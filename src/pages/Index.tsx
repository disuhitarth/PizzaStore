import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Leaf, Sparkles, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import DealsSection from '@/components/DealsSection';
import MenuSkeleton from '@/components/MenuSkeleton';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MenuItem } from '@/menuData';
import { useMenu } from '@/contexts/MenuContext';
import { useSiteMedia } from '@/contexts/SiteMediaContext';

const formatPrice = (value?: number) =>
  typeof value === 'number' ? `$${value.toFixed(2)}` : '';

const getNumericPrice = (item: MenuItem): number =>
  item.price ?? item.startingPrice ?? item.sizes?.[0]?.price ?? 0;

const slugify = (str: string) => {
  const base = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Ensure the ID is a valid CSS selector (for querySelector) by avoiding
  // leading digits, which would otherwise need escaping.
  if (/^[0-9]/.test(base)) {
    return `section-${base}`;
  }

  return base || 'section';
};

// Simple curated sets to power filters/badges without changing the source data too much
const POPULAR_ITEM_IDS = new Set<string>(['C388', 'C352', 'C395', 'C578', 'C623']);
const VEG_ITEM_IDS = new Set<string>(['C320', 'C324', 'C368', 'C372', 'C479', 'C631', 'C615', 'C583', 'C587']);

const Index: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const [activeMobileTab, setActiveMobileTab] = useState<string>('monthly-special');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'veg' | 'under-20'>('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<
    { name: string; price: string; description?: string; image: string; isPizzaItem?: boolean }
  >([]);

  const { media } = useSiteMedia();
  const defaultImage = media.categoryTiles.defaultImageUrl;
  const perCategoryImages = media.categoryTiles.perCategory ?? {};

  useEffect(() => {
    const timer = setTimeout(() => setIsMenuLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('recentlyViewedItems');
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const normalized = parsed
          .filter((item) => item && item.name)
          .map((item) => ({
            name: item.name as string,
            price: item.price as string,
            description: item.description as string | undefined,
            image: item.image || defaultImage,
            // Default to true (pizza) when flag is missing, so old data behaves as before.
            isPizzaItem: typeof item.isPizzaItem === 'boolean' ? item.isPizzaItem : true,
          }));
        setRecentlyViewed(normalized);
      }
    } catch {
      // ignore
    }
  }, []);

  const { categories: menuCategories } = useMenu();

  const sections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matchesSearch = (item: MenuItem) => {
      if (!q) return true;
      const name = item.itemName.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      return name.includes(q) || desc.includes(q);
    };

    const matchesFilter = (item: MenuItem) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'popular') return POPULAR_ITEM_IDS.has(item.itemId);
      if (activeFilter === 'veg') return VEG_ITEM_IDS.has(item.itemId);
      if (activeFilter === 'under-20') return getNumericPrice(item) < 20;
      return true;
    };

    return menuCategories.map((category) => {
      const isPizzaCategory =
        category.categoryId === 'build-your-own' ||
        category.categoryId === 'traditional-pizzas' ||
        category.categoryId === 'gourmet-pizzas';

      return {
        title: category.categoryName,
        products: category.items
          .filter((item) => matchesSearch(item) && matchesFilter(item))
          .map((item) => {
            const badges: string[] = [];
            if (POPULAR_ITEM_IDS.has(item.itemId)) badges.push('Best seller');
            if (VEG_ITEM_IDS.has(item.itemId)) badges.push('Veg');
            if (category.categoryId === 'monthly-special') badges.push('New');

            return {
              name: item.itemName,
              description: item.description,
              price: formatPrice(getNumericPrice(item)),
              image: item.imageUrl ?? defaultImage,
              sizeOptions: item.sizes?.map((size) => ({
                label: size.sizeDescription,
                price: size.price,
              })),
              badges,
              isPizzaItem: typeof item.isPizzaItem === 'boolean' ? item.isPizzaItem : isPizzaCategory,
              initialToppingIds: item.defaultToppingIds,
              initialCrustId: item.defaultCrustId,
              initialSauceId: item.defaultSauceId,
              initialPizzaOptionIds: item.defaultPizzaOptionIds,
            };
          }),
      };
    });
  }, [menuCategories, searchQuery, activeFilter]);

  const hasAnyProducts = sections.some((section) => section.products.length > 0);

  // Scroll-spy behavior: update activeMobileTab based on scroll position on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tabs = menuCategories.map((category) => ({
      id: category.categoryId,
      href: `#${slugify(category.categoryName)}`,
    }));

    const handleScroll = () => {
      // Only apply on mobile widths where the tab bar is visible
      if (window.innerWidth >= 768) return;

      const headerOffset = 140; // accounts for fixed header, promo strip + some padding
      let currentId = activeMobileTab;

      for (const tab of tabs) {
        const el = document.querySelector(tab.href) as HTMLElement | null;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - headerOffset <= 0) {
          currentId = tab.id;
        } else {
          break;
        }
      }

      if (currentId !== activeMobileTab) {
        setActiveMobileTab(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeMobileTab]);

  const mobileTabs = menuCategories.map((category) => ({
    id: category.categoryId,
    label: category.categoryName,
    href: `#${slugify(category.categoryName)}`,
  }));

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: '#F7F5EA' }}>
      {/* Fixed Header with cart icon */}
      <Header onCartClick={() => setCartOpen(true)} totalItems={totalItems} />

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />

      {/* Main Content (offset to clear fixed header and promo strip) */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured deals and rest of page on white background */}
        <div className="bg-white">
          <DealsSection />
        </div>

        {/* Main Layout with Sidebar */}
        <div className="flex w-full pt-10 md:pt-16 max-md:flex-col">
          {/* Sidebar Navigation */}
          <aside className="flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 px-3 md:px-4">
            <div className="max-w-[1354px] w-full mx-auto">
              {/* Category tiles (desktop + mobile) */}
              <section className="mb-8">
                <h2 className="mb-4 text-lg font-black uppercase tracking-[0.22em] text-[#4B2E00]">
                  Menu
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {menuCategories.map((category) => {
                    const href = `#${slugify(category.categoryName)}`;
                    const tileImage = perCategoryImages[category.categoryId] ?? defaultImage;
                    const imageFitClass =
                      category.categoryId === 'monthly-special' ||
                      category.categoryId === '591ml-bottles' ||
                      category.categoryId === 'dips'
                        ? 'object-contain'
                        : 'object-cover';
                    return (
                      <button
                        key={category.categoryId}
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            const el = document.querySelector(href) as HTMLElement | null;
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }
                        }}
                        className="group relative flex flex-col overflow-hidden rounded-3xl bg-white text-left border border-[#E5D6B8] shadow-[0_18px_40px_rgba(15,23,42,0.16)] hover:shadow-[0_26px_60px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#F7F5EA]"
                      >
                        <div className="px-4 pt-4 pb-2">
                          <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-[#4B2E00]">
                            {category.categoryName}
                          </h3>
                        </div>
                        <div className="relative flex-1 bg-white overflow-hidden flex items-stretch justify-stretch">
                          {/* White framed image with fixed aspect ratio so all tiles look consistent */}
                          <div className="relative m-3 w-full rounded-2xl bg-white overflow-hidden aspect-[16/9]">
                            <img
                              src={tileImage}
                              alt={category.categoryName}
                              className={`w-full h-full ${imageFitClass}`}
                            />
                          </div>
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end px-4 py-3 bg-gradient-to-t from-black/35 via-black/0 to-transparent">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#C81607] text-white shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4 translate-x-[1px] fill-current"
                                aria-hidden="true"
                              >
                                <path d="M8 5v14l10-7z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Mobile sticky: category chips + compact search + Filters button */}
              {mobileTabs.length > 0 && (
                <section className="sticky top-[88px] z-30 -mx-4 mb-3 border-b border-brand-soft-border bg-white/95 backdrop-blur md:hidden">
                  <div className="px-4 py-1.5 space-y-1.5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                      {mobileTabs.map((tab) => {
                        const isActive = activeMobileTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setActiveMobileTab(tab.id);
                              if (typeof window !== 'undefined') {
                                const el = document.querySelector(tab.href) as HTMLElement | null;
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }
                            }}
                            className={`inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition ${
                              isActive
                                ? 'border-brand bg-brand text-white shadow-sm'
                                : 'border-[#D6DADE] bg-white text-[#374151] hover:bg-[#F3F4F6]'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pb-0.5">
                      <div className="relative flex-1">
                        <input
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search pizzas, wings, sides..."
                          className="w-full rounded-full border border-[#D6DADE] bg-white px-3 py-2 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          aria-label="Search menu items"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFilterSheetOpen(true)}
                        className="inline-flex items-center justify-center rounded-full border border-[#D6DADE] bg-white px-2.5 py-2 text-[11px] font-medium text-[#36424e] shadow-sm"
                        aria-label="Open filters"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline ml-1">Filters</span>
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Filters & search (desktop, sticky) */}
              <section className="mb-6 hidden md:sticky md:top-[104px] md:z-30 md:flex flex-col gap-3 rounded-2xl border border-brand-soft-border bg-brand-soft px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'all'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('popular')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'popular'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" /> Popular
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('veg')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'veg'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Leaf className="mr-1 h-3.5 w-3.5" /> Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('under-20')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'under-20'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      Under $20
                    </button>
                  </div>
                  <div className="w-full sm:w-auto">
                    <div className="relative">
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search pizzas, wings, sides..."
                        className="w-full sm:w-64 rounded-full border border-[#D6DADE] bg-white px-4 py-2 text-xs sm:text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                        aria-label="Search menu items"
                      />
                    </div>
                  </div>
                </div>
                {!hasAnyProducts && (
                  <p className="text-xs sm:text-sm text-[#7F1D1D]">
                    No items match your search or filters. Try clearing filters or searching for something else.
                  </p>
                )}
              </section>

              {/* Skeleton while menu loads (demo-only) */}
              {isMenuLoading && <MenuSkeleton />}

              {/* Recently viewed */}
              {!isMenuLoading && recentlyViewed.length > 0 && (
                <section className="mb-6">
                  <ProductSection
                    title="Recently viewed"
                    products={recentlyViewed.slice(0, 6)}
                    layout="grid"
                  />
                </section>
              )}

              {!isMenuLoading &&
                sections.map((section) => (
                  <ProductSection
                    key={section.title}
                    title={section.title}
                    products={section.products}
                  />
                ))}
            </div>

            {/* Mobile filters bottom sheet */}
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetContent side="bottom" className="md:hidden h-auto max-h-[70vh] rounded-t-3xl border-t border-border">
                <SheetHeader className="px-0 pt-1 pb-3">
                  <SheetTitle className="text-base">Filter menu</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'all'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('popular')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'popular'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" /> Popular
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('veg')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'veg'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      <Leaf className="mr-1 h-3.5 w-3.5" /> Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('under-20')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'under-20'
                          ? 'border-brand bg-brand text-white'
                          : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                      }`}
                    >
                      Under $20
                    </button>
                  </div>

                  {!hasAnyProducts && (
                    <p className="text-xs text-[#7F1D1D]">
                      No items match your search or filters. Try clearing filters or searching for something else.
                    </p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </main>

      {/* Sticky order summary / call-to-action on mobile */}
      {totalItems > 0 ? (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full bg-brand px-4 py-3 text-left text-white shadow-lg shadow-[0_16px_40px_rgba(185,28,28,0.45)] md:hidden"
          aria-label="View order summary"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide text-white/70">
                Your order
              </span>
              <span className="text-sm font-semibold">
                {totalItems} item{totalItems !== 1 ? 's' : ''} • ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-white/80">View</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              const target = document.querySelector('#monthly-special') as HTMLElement | null;
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[0_16px_40px_rgba(185,28,28,0.45)] md:hidden"
          aria-label="Start your order"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
            <ShoppingCart className="h-3.5 w-3.5" />
          </span>
          <span>Order Now</span>
        </button>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
