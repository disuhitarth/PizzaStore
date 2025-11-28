export interface MenuItemSize {
  sizeDescription: string;
  price: number;
}

export interface MenuItem {
  itemId: string;
  itemName: string;
  description?: string;
  price?: number;
  startingPrice?: number;
  sizes?: MenuItemSize[];
  imageUrl?: string;
}

import rawMenu from './data/menu.json';

export interface MenuCategory {
  categoryId: string;
  categoryName: string;
  items: MenuItem[];
}

// Canonical production menu data.
// To publish changes made via the /admin/menu page:
// 1. Use "Export JSON" in the admin UI.
// 2. Replace the contents of src/data/menu.json with the exported JSON (it must remain a MenuCategory[]).
// 3. Commit and push to GitHub so Netlify rebuilds the site with the new menu.

export const menuCategories = rawMenu as MenuCategory[];
