import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Leaf, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import DealsSection from '@/components/DealsSection';
import MenuSkeleton from '@/components/MenuSkeleton';
import { useCart } from '@/contexts/CartContext';
import { menuCategories, MenuItem } from '@/menuData';
import { toast } from '@/hooks/use-toast';

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
  const { getTotalItems, getTotalPrice, isCartOpen, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const [activeMobileTab, setActiveMobileTab] = useState<string>('monthly-special');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'veg' | 'under-20'>('all');
  const [recentlyViewed, setRecentlyViewed] = useState<
    { name: string; price: string; description?: string; image: string }[]
  >([]);

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

  // Easter Egg: Cyberpunk Mode
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const q = searchQuery.toLowerCase().trim();
    if (q === 'cyber' || q === 'neon' || q === 'matrix') {
      document.documentElement.setAttribute('data-theme', 'cyberpunk');
      toast({
        title: '🦾 SYSTEM OVERRIDE',
        description: 'Cyberpunk protocol initiated.',
      });
    } else if (q === 'reset' || q === 'normal') {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [searchQuery]);

  const isSecretSearch = ['magic', 'secret', 'mystery'].includes(searchQuery.toLowerCase().trim());

  const secretSection = {
    title: '✨ Secret Menu ✨',
    products: [
      {
        name: 'The Mystery Pizza',
        description: 'A legendary creation known only to the chosen few. Toppings change daily based on the chef\'s mood.',
        price: '$0.00',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        badges: ['Secret', 'Free'],
        sizeOptions: [{ label: 'Large', price: 0 }]
      }
    ]
  };

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
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Fixed Header with cart icon */}
      <Header onCartClick={() => setIsCartOpen(true)} totalItems={totalItems} />

      {/* Main Content (offset to clear fixed header and promo strip) */}
      <main className="pt-[96px] md:pt-[132px]">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured deals */}
        <DealsSection />

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
                <section className="sticky top-[96px] z-30 -mx-4 mb-3 border-b border-brand-soft-border bg-white/95 px-4 backdrop-blur md:hidden">
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
                          className={`inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${isActive
                            ? 'border-primary bg-primary text-white shadow-sm'
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
              <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary/10 bg-primary/5 px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === 'all'
                        ? 'border-primary bg-primary text-white'
                        : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                        }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('popular')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === 'popular'
                        ? 'border-primary bg-primary text-white'
                        : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                        }`}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" /> Popular
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('veg')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === 'veg'
                        ? 'border-primary bg-primary text-white'
                        : 'border-[#D6DADE] bg-white text-[#36424e] hover:bg-[#F3F4F6]'
                        }`}
                    >
                      <Leaf className="mr-1 h-3.5 w-3.5" /> Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('under-20')}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === 'under-20'
                        ? 'border-primary bg-primary text-white'
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

              {isSecretSearch && (
                <ProductSection
                  title={secretSection.title}
                  products={secretSection.products}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky order summary / call-to-action on mobile */}
      {/* Mobile sticky cart button removed in favor of MobileNav */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
