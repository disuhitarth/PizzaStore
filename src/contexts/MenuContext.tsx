import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { menuCategories as staticMenuCategories, type MenuCategory, type MenuItem } from '@/menuData';

export interface MenuContextValue {
  categories: MenuCategory[];
  updateItem: (categoryId: string, itemId: string, partial: Partial<MenuItem>) => void;
  addItem: (categoryId: string, item: Omit<MenuItem, 'itemId'> & { itemId?: string }) => void;
  removeItem: (categoryId: string, itemId: string) => void;
  /** Replace the entire menu with a new set of categories (used for bulk JSON import). */
  replaceAll: (next: MenuCategory[]) => void;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

const STORAGE_KEY = 'editableMenuCategories';

const loadInitialCategories = (): MenuCategory[] => {
  if (typeof window === 'undefined') {
    return staticMenuCategories;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return staticMenuCategories;
    const parsed = JSON.parse(raw) as MenuCategory[];
    if (!Array.isArray(parsed)) return staticMenuCategories;
    // Very light validation: ensure each entry has categoryId, categoryName, items array
    return parsed.every((c) => c && typeof c.categoryId === 'string' && Array.isArray(c.items))
      ? parsed
      : staticMenuCategories;
  } catch {
    return staticMenuCategories;
  }
};

const getNumericPrice = (item: MenuItem): number =>
  item.price ?? item.startingPrice ?? item.sizes?.[0]?.price ?? 0;

const applyPriceToItem = (item: MenuItem, newPrice: number): MenuItem => {
  if (Number.isNaN(newPrice) || newPrice < 0) return item;

  if (typeof item.price === 'number') {
    return { ...item, price: newPrice };
  }

  if (typeof item.startingPrice === 'number') {
    return { ...item, startingPrice: newPrice };
  }

  if (item.sizes && item.sizes.length > 0) {
    const [first, ...rest] = item.sizes;
    return {
      ...item,
      sizes: [{ ...first, price: newPrice }, ...rest],
    };
  }

  return { ...item, price: newPrice };
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MenuCategory[]>(() => loadInitialCategories());

  // Persist to localStorage so admin edits survive reloads.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = JSON.stringify(categories);
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch {
      // ignore persistence errors
    }
  }, [categories]);

  const updateItem: MenuContextValue['updateItem'] = (categoryId, itemId, partial) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.categoryId !== categoryId) return category;
        return {
          ...category,
          items: category.items.map((item) =>
            item.itemId === itemId ? { ...item, ...partial } : item,
          ),
        };
      }),
    );
  };

  const addItem: MenuContextValue['addItem'] = (categoryId, item) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.categoryId !== categoryId) return category;
        const generatedId = item.itemId ?? `NEW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newItem: MenuItem = {
          itemId: generatedId,
          itemName: item.itemName || 'New item',
          description: item.description ?? '',
          price: typeof item.price === 'number' ? item.price : 0,
          startingPrice: item.startingPrice,
          sizes: item.sizes,
          imageUrl: item.imageUrl,
        };
        return {
          ...category,
          items: [...category.items, newItem],
        };
      }),
    );
  };

  const removeItem: MenuContextValue['removeItem'] = (categoryId, itemId) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.categoryId !== categoryId) return category;
        return {
          ...category,
          items: category.items.filter((item) => item.itemId !== itemId),
        };
      }),
    );
  };

  const replaceAll: MenuContextValue['replaceAll'] = (next) => {
    setCategories(next);
  };

  const value = useMemo<MenuContextValue>(
    () => ({
      categories,
      updateItem,
      addItem,
      removeItem,
      replaceAll,
    }),
    [categories],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = (): MenuContextValue => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return ctx;
};
