import React, { FormEvent, useMemo, useRef, useState } from 'react';
import { useMenu } from '@/contexts/MenuContext';
import type { MenuCategory, MenuItem } from '@/menuData';
import { pizzaConfig } from '@/pizzaConfig';
import { siteMedia as initialSiteMedia } from '@/siteMedia';

// Admin menu UI: local-only editing with GitHub/Netlify publish hooks.

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [itemSearch, setItemSearch] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | 'all'>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { categories, updateItem, addItem, removeItem, replaceAll } = useMenu();
  const [siteMediaConfig, setSiteMediaConfig] = useState(() => initialSiteMedia);

  const allToppings = useMemo(() => {
    const categories = pizzaConfig.pizza.customization.toppings.categories as Record<
      string,
      { displayName: string; items: { id: string; name: string }[] }
    >;
    return Object.entries(categories).flatMap(([key, value]) =>
      value.items.map((item) => ({
        id: item.id,
        name: item.name,
        group: value.displayName,
      })),
    );
  }, []);

  const crustOptions = useMemo(
    () => pizzaConfig.pizza.customization.crust.options,
    [],
  );

  const sauceOptions = useMemo(
    () => pizzaConfig.pizza.customization.sauce.options,
    [],
  );

  const pizzaOptions = useMemo(
    () => pizzaConfig.pizza.customization.pizzaOptions.options,
    [],
  );

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

  const handlePublish = async () => {
    setImportError(null);
    setPublishMessage(null);
    setIsPublishing(true);
    try {
      const res = await fetch('/.netlify/functions/publish-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error ?? `Publish failed with status ${res.status}`;
        setImportError(msg);
        return;
      }

      setPublishMessage(
        data?.message ?? 'Menu published to GitHub. Netlify will redeploy shortly.',
      );
    } catch {
      setImportError('Failed to reach publish endpoint. Check your network or Netlify setup.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishSiteMedia = async () => {
    setImportError(null);
    setPublishMessage(null);
    setIsPublishing(true);
    try {
      const res = await fetch('/.netlify/functions/publish-site-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media: siteMediaConfig }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error ?? `Publish failed with status ${res.status}`;
        setImportError(msg);
        return;
      }

      setPublishMessage(
        data?.message ?? 'Site visuals published to GitHub. Netlify will redeploy shortly.',
      );
    } catch {
      setImportError('Failed to reach site-media publish endpoint. Check your network or Netlify setup.');
    } finally {
      setIsPublishing(false);
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
    () => {
      const q = itemSearch.trim().toLowerCase();
      const base = categories.slice();
      if (!q) return base;
      return base
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => {
            const name = item.itemName.toLowerCase();
            const desc = (item.description || '').toLowerCase();
            return name.includes(q) || desc.includes(q) || item.itemId.toLowerCase().includes(q);
          }),
        }))
        .filter((cat) => cat.items.length > 0);
    },
    [categories, itemSearch],
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
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          This page edits a <span className="font-semibold">local preview only</span> (stored in this browser via
          localStorage). To update the live site deployed from GitHub (e.g. on Netlify), use the Publish buttons below
          to sync menu data and site visuals via GitHub.
        </div>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Menu admin</h1>
            <p className="text-sm text-slate-600">
              Edit titles, descriptions, prices, and image URLs. Changes here are a local preview in this browser
              (stored in localStorage) and are reflected on the main menu in real time on this device only.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              To update the live site on Netlify, export the JSON, paste it into <code>src/menuData.ts</code> in
              GitHub, commit, and let Netlify redeploy. Import JSON is for loading a draft back into this local
              preview.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <div className="inline-flex flex-wrap gap-2">
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
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center rounded-md border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm hover:bg-emerald-100 disabled:opacity-60"
              >
                {isPublishing ? 'Publishing…' : 'Publish menu to GitHub'}
              </button>
              <button
                type="button"
                onClick={handlePublishSiteMedia}
                disabled={isPublishing}
                className="inline-flex items-center rounded-md border border-sky-600 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 shadow-sm hover:bg-sky-100 disabled:opacity-60"
              >
                {isPublishing ? 'Publishing…' : 'Publish visuals to GitHub'}
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
        {publishMessage && (
          <p className="text-xs text-emerald-600">{publishMessage}</p>
        )}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Site visuals</h2>
          <p className="text-[11px] text-slate-500">
            Configure the hero media and default category tile image. These settings are published separately from the
            menu JSON.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-700">Hero type</label>
              <select
                value={siteMediaConfig.hero.type}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, type: e.target.value as 'image' | 'video' },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-700">Hero media URL</label>
              <input
                type="text"
                value={siteMediaConfig.hero.src}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, src: e.target.value },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-700">Hero poster image (optional)</label>
              <input
                type="text"
                value={siteMediaConfig.hero.poster ?? ''}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, poster: e.target.value },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-700">Hero headline</label>
              <input
                type="text"
                value={siteMediaConfig.hero.headline ?? ''}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline: e.target.value },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
                placeholder="Your pizza, your way."
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">Hero subheadline</label>
              <textarea
                value={siteMediaConfig.hero.subheadline ?? ''}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subheadline: e.target.value },
                  }))
                }
                rows={2}
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-[11px] text-slate-800 focus:border-brand focus:ring-brand resize-y"
                placeholder="Short supporting copy for the hero section"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">Default category tile image URL</label>
              <input
                type="text"
                value={siteMediaConfig.categoryTiles.defaultImageUrl}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    categoryTiles: {
                      ...prev.categoryTiles,
                      defaultImageUrl: e.target.value,
                    },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
                placeholder="https://..."
              />
              <div className="mt-2 space-y-1">
                <p className="text-[10px] font-medium text-slate-700">Per-category tile images (optional)</p>
                <div className="max-h-40 space-y-1.5 overflow-auto rounded border border-slate-100 bg-slate-50/70 px-2 py-1.5">
                  {categories.map((cat) => {
                    const current = siteMediaConfig.categoryTiles.perCategory?.[cat.categoryId] ?? '';
                    return (
                      <div key={cat.categoryId} className="space-y-0.5">
                        <span className="block text-[10px] font-medium text-slate-700 truncate">
                          {cat.categoryName}
                        </span>
                        <input
                          type="text"
                          value={current}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSiteMediaConfig((prev) => {
                              const perCategory = { ...(prev.categoryTiles.perCategory ?? {}) };
                              if (!value) {
                                delete perCategory[cat.categoryId];
                              } else {
                                perCategory[cat.categoryId] = value;
                              }
                              return {
                                ...prev,
                                categoryTiles: {
                                  ...prev.categoryTiles,
                                  perCategory,
                                },
                              };
                            });
                          }}
                          className="block w-full rounded border border-slate-200 px-1.5 py-1 text-[10px] text-slate-800 focus:border-brand focus:ring-brand bg-white"
                          placeholder="(inherit default)"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-700">Pickup banner close icon URL</label>
              <input
                type="text"
                value={siteMediaConfig.banners.closeIconUrl}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    banners: {
                      ...prev.banners,
                      closeIconUrl: e.target.value,
                    },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-700">Loyalty banner icon URL</label>
              <input
                type="text"
                value={siteMediaConfig.banners.loyaltyIconUrl}
                onChange={(e) =>
                  setSiteMediaConfig((prev) => ({
                    ...prev,
                    banners: {
                      ...prev.banners,
                      loyaltyIconUrl: e.target.value,
                    },
                  }))
                }
                className="mt-0.5 block w-full rounded border border-slate-200 px-2 py-1.5 text-xs text-slate-800 focus:border-brand focus:ring-brand"
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Menu items</h2>
              <p className="text-[11px] text-slate-500">
                Edit product titles, descriptions, prices, images and pizza defaults. Changes apply instantly to this
                preview.
              </p>
            </div>
            <div className="mt-1 sm:mt-0 w-full sm:w-64">
              <input
                type="search"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                placeholder="Search by name, description, or ID"
                className="w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-brand focus:ring-brand"
              />
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {sortedCategories.map((category) => {
            const isExpanded =
              expandedCategoryId === 'all' || expandedCategoryId === category.categoryId;
            const pizzaCount = category.items.filter((item) => item.isPizzaItem).length;
            const hasPizzas = pizzaCount > 0;
            return (
              <section
                key={category.categoryId}
                className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">{category.categoryName}</h2>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>
                        {category.items.length} item{category.items.length === 1 ? '' : 's'}
                      </span>
                      {hasPizzas && (
                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                          {pizzaCount} pizza{pizzaCount === 1 ? '' : 's'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategoryId((prev) =>
                          prev === category.categoryId ? 'all' : category.categoryId,
                        )
                      }
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <span className="mr-1">{isExpanded ? 'Hide items' : 'Show items'}</span>
                      <span className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}>
                        ▾
                      </span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-t border-slate-200 text-left text-xs">
                      <thead className="bg-slate-50 sticky top-0 z-10">
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
                        <tr
                          key={item.itemId}
                          className={`border-t border-slate-100 odd:bg-white even:bg-slate-50/40 ${item.isPizzaItem ? 'border-l-2 border-l-rose-400' : ''}`}
                        >
                          <td className="whitespace-nowrap px-3 py-2 text-slate-500">{item.itemId}</td>
                          <td className="px-3 py-2 align-top">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={item.itemName}
                                onChange={(e) =>
                                  updateItem(category.categoryId, item.itemId, {
                                    itemName: e.target.value,
                                  })
                                }
                                className="w-full flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand focus:ring-brand"
                              />
                              {item.isPizzaItem && (
                                <span className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-rose-700">
                                  Pizza
                                </span>
                              )}
                            </div>
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
                            <div className="flex flex-col items-end gap-1.5">
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
                              <label className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={Boolean(item.isPizzaItem)}
                                  onChange={(e) =>
                                    updateItem(category.categoryId, item.itemId, {
                                      isPizzaItem: e.target.checked,
                                      defaultToppingIds: e.target.checked ? item.defaultToppingIds ?? [] : [],
                                    })
                                  }
                                  className="h-3 w-3 rounded border-slate-300 text-brand focus:ring-brand"
                                />
                                <span>Pizza item</span>
                              </label>
                              {item.isPizzaItem && (
                                <div className="mt-2 w-full rounded-lg border border-rose-100 bg-rose-50/70 px-2 py-1.5 text-left shadow-inner">
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-700">
                                      Pizza defaults
                                    </span>
                                    <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[9px] font-medium text-rose-600">
                                      Builder
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div>
                                      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                        Default crust
                                      </label>
                                      <select
                                        value={item.defaultCrustId ?? ''}
                                        onChange={(e) =>
                                          updateItem(category.categoryId, item.itemId, {
                                            defaultCrustId: e.target.value || undefined,
                                          })
                                        }
                                        className="mt-0.5 block w-full rounded border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-700 focus:border-brand focus:ring-brand"
                                      >
                                        <option value="">(none)</option>
                                        {crustOptions.map((opt) => (
                                          <option key={opt.id} value={opt.id}>
                                            {opt.name}
                                            {opt.price && opt.price > 0
                                              ? ` (+$${opt.price.toFixed(2)})`
                                              : ''}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                        Default sauce
                                      </label>
                                      <select
                                        value={item.defaultSauceId ?? ''}
                                        onChange={(e) =>
                                          updateItem(category.categoryId, item.itemId, {
                                            defaultSauceId: e.target.value || undefined,
                                          })
                                        }
                                        className="mt-0.5 block w-full rounded border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-700 focus:border-brand focus:ring-brand"
                                      >
                                        <option value="">(none)</option>
                                        {sauceOptions.map((opt) => (
                                          <option key={opt.id} value={opt.id}>
                                            {opt.name}
                                            {opt.price && opt.price > 0
                                              ? ` (+$${opt.price.toFixed(2)})`
                                              : ''}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                        Default pizza options
                                      </label>
                                      <select
                                        multiple
                                        value={item.defaultPizzaOptionIds ?? []}
                                        onChange={(e) => {
                                          const selectedIds = Array.from(
                                            e.target.selectedOptions,
                                          ).map((opt) => opt.value);
                                          updateItem(category.categoryId, item.itemId, {
                                            defaultPizzaOptionIds: selectedIds,
                                          });
                                        }}
                                        className="mt-0.5 block w-full max-h-20 overflow-auto rounded border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-700 focus:border-brand focus:ring-brand"
                                      >
                                        {pizzaOptions.map((opt) => (
                                          <option key={opt.id} value={opt.id}>
                                            {opt.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                        Default toppings
                                      </label>
                                      <select
                                        multiple
                                        value={item.defaultToppingIds ?? []}
                                        onChange={(e) => {
                                          const selectedIds = Array.from(
                                            e.target.selectedOptions,
                                          ).map((opt) => opt.value);
                                          updateItem(category.categoryId, item.itemId, {
                                            defaultToppingIds: selectedIds,
                                          });
                                        }}
                                        className="mt-0.5 block w-full max-h-20 overflow-auto rounded border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-700 focus:border-brand focus:ring-brand"
                                      >
                                        {allToppings.map((t) => (
                                          <option key={t.id} value={t.id}>
                                            {t.group}: {t.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
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
            )}
          </section>
        );
      })}
        </div>
      </div>
    </div>
  );
};

export default MenuAdmin;
