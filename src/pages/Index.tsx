import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Leaf, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { useCart } from '@/contexts/CartContext';
import { menuCategories, MenuItem } from '@/menuData';

const DEFAULT_IMAGE =
  'https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fff8a4ed4b8138568da19bb28117853c4531c44a0';

const formatPrice = (value?: number) =>
  typeof value === 'number' ? `$${value.toFixed(2)}` : '';

const getNumericPrice = (item: MenuItem): number =>
  item.price ?? item.startingPrice ?? item.sizes?.[0]?.price ?? 0;

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'veg' | 'under-20'>('all');
  const [recentlyViewed, setRecentlyViewed] = useState<
    { name: string; price: string; description?: string; image: string }
  >([]);

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
            image: item.image || DEFAULT_IMAGE,
          }));
        setRecentlyViewed(normalized);
      }
    } catch {
      // ignore
    }
  }, []);

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

    return menuCategories.map((category) => ({
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
            image: DEFAULT_IMAGE,
            sizeOptions: item.sizes?.map((size) => ({
              label: size.sizeDescription,
              price: size.price,
            })),
            badges,
          };
        }),
    }));
  }, [searchQuery, activeFilter]);

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

      const headerOffset = 120; // accounts for fixed header + some padding
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
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Fixed Header with cart icon */}
      <Header onCartClick={() => setCartOpen(true)} totalItems={totalItems} />

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />

      {/* Main Content (offset to clear fixed header) */}
      <main className="pt-[104px]">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Layout with Sidebar */}
        <div className="flex w-full pt-10 md:pt-16 max-md:flex-col">
          {/* Sidebar Navigation */}
          <aside className="flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 px-4 max-md:px-4">
            <div className="max-w-[1354px] w-full mx-auto">
              {/* Mobile sticky category tabs */}
              {mobileTabs.length > 0 && (
                <section className="sticky top-[104px] z-30 -mx-4 mb-3 border-b border-[#E5E7EB] bg-white/95 px-4 backdrop-blur md:hidden">
                  <div className="flex items-center gap-2 overflow-x-auto py-3">
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
                          className={`inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                            isActive
                              ? 'border-black bg-black text-white shadow-sm'
                              : 'border-[#D6DADE] bg-white text-[#374151] hover:bg-[#F3F4F6]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Filters & search */}
              <section className="mb-6 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        activeFilter === 'all'
                          ? 'border-black bg-black text-white'
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
                          ? 'border-black bg-black text-white'
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
                          ? 'border-black bg-black text-white'
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
                          ? 'border-black bg-black text-white'
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
                        className="w-full sm:w-64 rounded-full border border-[#D6DADE] bg-white px-4 py-2 text-xs sm:text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent"
                        aria-label="Search menu items"
                      />
                    </div>
                  </div>
                </div>
                {!hasAnyProducts && (
                  <p className="text-xs sm:text-sm text-[#6B7280]">
                    No items match your search or filters. Try clearing filters or searching for something else.
                  </p>
                )}
              </section>

              {/* Recently viewed */}
              {recentlyViewed.length > 0 && (
                <section className="mb-6">
                  <ProductSection
                    title="Recently viewed"
                    products={recentlyViewed.slice(0, 6)}
                    layout="grid"
                  />
                </section>
              )}

              {sections.map((section) => (
                <ProductSection
                  key={section.title}
                  title={section.title}
                  products={section.products}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky order summary on mobile */}
      {totalItems > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full bg-black px-4 py-3 text-left text-white shadow-lg shadow-slate-900/40 md:hidden"
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
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
