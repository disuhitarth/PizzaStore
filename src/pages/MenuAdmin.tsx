import React, { FormEvent, useMemo, useRef, useState } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import type { MenuCategory, MenuItem } from '@/menuData';

const ADMIN_PASSWORD = import.meta.env.VITE_MENU_ADMIN_PASSWORD || 'admin123';

const getNumericPrice = (item: MenuItem): number =>
  item.price ?? item.startingPrice ?? item.sizes?.[0]?.price ?? 0;

const isMenuCategoryArray = (value: unknown): value is MenuCategory[] => {
  if (!Array.isArray(value)) return false;
  return value.every((cat) => {
    if (!cat || typeof cat !== 'object') return false;
    const maybeCat = cat as Partial<MenuCategory>;
    return (
      typeof maybeCat.categoryId === 'string' &&
      typeof maybeCat.categoryName === 'string' &&
      Array.isArray(maybeCat.items)
    );
  });
};

const MenuAdmin: React.FC = () => {
  const [isAuthed, setIsAuthed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('menuAdminAuthed') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { categories, updateItem, addItem, removeItem, replaceAll } = useMenu();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      setError(null);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('menuAdminAuthed', 'true');
      }
    } else {
      setError('Incorrect password');
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(categories, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menu-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setImportError('Failed to export menu JSON.');
    }
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result ?? '');
        const parsed: unknown = JSON.parse(text);
        if (!isMenuCategoryArray(parsed)) {
          throw new Error('Invalid menu format');
        }
        replaceAll(parsed);
        setImportError(null);
      } catch (err) {
        setImportError('Failed to import menu JSON. Please check the file format.');
      } finally {
        // Allow re-selecting the same file later
        // eslint-disable-next-line no-param-reassign
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const sortedCategories = useMemo(
    () => categories.slice(),
    [categories],
  );

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl bg-white shadow-lg border border-slate-200 p-6 space-y-4"
        >
          <h1 className="text-lg font-semibold text-slate-900">Admin access</h1>
          <p className="text-sm text-slate-600">
            Enter the admin password to manage the menu. This is client-side only and intended for demo/internal use.
          </p>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-brand"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Menu admin</h1>
            <p className="text-sm text-slate-600">
              Edit titles, descriptions, prices, and image URLs. Changes are saved locally in this browser and
              reflected on the main menu in real time.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              You can also export the full menu as JSON, edit it offline, and import it back.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <div className="inline-flex gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={handleImportClick}
                className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Import JSON
              </button>
            </div>
            <a
              href="/"
              className="text-xs font-medium text-brand hover:underline"
            >
              View storefront
            </a>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFileChange}
          />
        </header>

        {importError && (
          <p className="text-xs text-red-600">{importError}</p>
        )}

        <div className="space-y-8">
          {sortedCategories.map((category) => (
            <section
              key={category.categoryId}
              className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">{category.categoryName}</h2>
                  <p className="text-xs text-slate-500">
                    {category.items.length} item{category.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addItem(category.categoryId, {
                      itemName: 'New item',
                      description: '',
                      price: 0,
                    })
                  }
                  className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
                >
                  + Add item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-t border-slate-200 text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-slate-700">ID</th>
                      <th className="px-3 py-2 font-medium text-slate-700">Title</th>
                      <th className="px-3 py-2 font-medium text-slate-700">Description</th>
                      <th className="px-3 py-2 font-medium text-slate-700 whitespace-nowrap">Price</th>
                      <th className="px-3 py-2 font-medium text-slate-700">Image URL</th>
                      <th className="px-3 py-2 font-medium text-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item) => {
                      const basePrice = getNumericPrice(item);
                      const imageUrl = item.imageUrl ?? '';

                      return (
                        <tr key={item.itemId} className="border-t border-slate-100">
                          <td className="whitespace-nowrap px-3 py-2 text-slate-500">{item.itemId}</td>
                          <td className="px-3 py-2 align-top">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) =>
                                updateItem(category.categoryId, item.itemId, {
                                  itemName: e.target.value,
                                })
                              }
                              className="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand focus:ring-brand"
                            />
                          </td>
                          <td className="px-3 py-2 align-top">
                            <textarea
                              value={item.description ?? ''}
                              onChange={(e) =>
                                updateItem(category.categoryId, item.itemId, {
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full resize-y rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand focus:ring-brand"
                            />
                          </td>
                          <td className="px-3 py-2 align-top">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={Number.isFinite(basePrice) ? basePrice : ''}
                              onChange={(e) => {
                                const next = Number(e.target.value);
                                if (Number.isNaN(next)) return;
                                const updated: MenuItem =
                                  category.items.find((it) => it.itemId === item.itemId) ?? item;
                                const hasPrice = typeof updated.price === 'number';
                                const hasStarting = typeof updated.startingPrice === 'number';
                                if (hasPrice) {
                                  updateItem(category.categoryId, item.itemId, { price: next });
                                } else if (hasStarting) {
                                  updateItem(category.categoryId, item.itemId, { startingPrice: next });
                                } else if (Array.isArray(updated.sizes) && updated.sizes.length > 0) {
                                  const [first, ...rest] = updated.sizes;
                                  updateItem(category.categoryId, item.itemId, {
                                    sizes: [{ ...first, price: next }, ...rest],
                                  });
                                } else {
                                  updateItem(category.categoryId, item.itemId, { price: next });
                                }
                              }}
                              className="w-24 rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand focus:ring-brand"
                            />
                          </td>
                          <td className="px-3 py-2 align-top">
                            <input
                              type="text"
                              value={imageUrl}
                              onChange={(e) =>
                                updateItem(category.categoryId, item.itemId, {
                                  imageUrl: e.target.value,
                                })
                              }
                              placeholder="https://..."
                              className="w-full min-w-[240px] rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand focus:ring-brand"
                            />
                          </td>
                          <td className="px-3 py-2 text-right align-top">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Remove this item from the menu?')) {
                                  removeItem(category.categoryId, item.itemId);
                                }
                              }}
                              className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {category.items.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-4 text-center text-xs text-slate-500"
                        >
                          No items in this category yet. Use "Add item" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuAdmin;
