import React, { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface NutrientRow {
  id: string;
  category: 'Crust' | 'Sauce' | 'Cheese' | 'Topping';
  name: string;
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large' | 'Per serving';
  calories: number;
  fat: number;
  sodium: number;
  protein: number;
  carbs: number;
}

const NUTRITION_DATA: NutrientRow[] = [
  // Crusts - Small
  {
    id: 'crust-hand-small',
    category: 'Crust',
    name: 'Hand Tossed Crust',
    size: 'Small',
    calories: 135,
    fat: 2.2,
    sodium: 145,
    protein: 4,
    carbs: 26,
  },
  {
    id: 'crust-thin-small',
    category: 'Crust',
    name: 'Thin Crust',
    size: 'Small',
    calories: 114,
    fat: 1.17,
    sodium: 76,
    protein: 2,
    carbs: 13.5,
  },
  // Crusts - Medium
  {
    id: 'crust-hand-medium',
    category: 'Crust',
    name: 'Hand Tossed Crust',
    size: 'Medium',
    calories: 144,
    fat: 1.8,
    sodium: 150,
    protein: 4.8,
    carbs: 26.4,
  },
  {
    id: 'crust-thin-medium',
    category: 'Crust',
    name: 'Thin Crust',
    size: 'Medium',
    calories: 103.2,
    fat: 1.5,
    sodium: 129,
    protein: 3.45,
    carbs: 18.9,
  },
  // Crusts - Large
  {
    id: 'crust-hand-large',
    category: 'Crust',
    name: 'Hand Tossed Crust',
    size: 'Large',
    calories: 164,
    fat: 2.5,
    sodium: 170,
    protein: 6,
    carbs: 30,
  },
  {
    id: 'crust-thin-large',
    category: 'Crust',
    name: 'Thin Crust',
    size: 'Large',
    calories: 117,
    fat: 1.78,
    sodium: 150,
    protein: 4.1,
    carbs: 21.5,
  },
  // Crusts - Extra Large
  {
    id: 'crust-hand-xl',
    category: 'Crust',
    name: 'Hand Tossed Crust',
    size: 'Extra Large',
    calories: 184,
    fat: 21,
    sodium: 168,
    protein: 5.8,
    carbs: 32,
  },
  {
    id: 'crust-thin-xl',
    category: 'Crust',
    name: 'Thin Crust',
    size: 'Extra Large',
    calories: 135,
    fat: 17.1,
    sodium: 145,
    protein: 4,
    carbs: 26,
  },

  // Sauces - per serving (use size buckets by pizza size)
  {
    id: 'sauce-pizza-small',
    category: 'Sauce',
    name: 'Pizza Sauce',
    size: 'Small',
    calories: 7,
    fat: 0,
    sodium: 51,
    protein: 0.3,
    carbs: 13,
  },
  {
    id: 'sauce-bbq-small',
    category: 'Sauce',
    name: 'BBQ Sauce',
    size: 'Small',
    calories: 13,
    fat: 0,
    sodium: 51.4,
    protein: 0.16,
    carbs: 2.8,
  },
  {
    id: 'sauce-pizza-medium',
    category: 'Sauce',
    name: 'Pizza Sauce',
    size: 'Medium',
    calories: 7.3,
    fat: 0,
    sodium: 53,
    protein: 0.2,
    carbs: 1.5,
  },
  {
    id: 'sauce-bbq-medium',
    category: 'Sauce',
    name: 'BBQ Sauce',
    size: 'Medium',
    calories: 16,
    fat: 0,
    sodium: 62.5,
    protein: 0.1,
    carbs: 3.6,
  },
  {
    id: 'sauce-pizza-large',
    category: 'Sauce',
    name: 'Pizza Sauce',
    size: 'Large',
    calories: 8.5,
    fat: 0,
    sodium: 61.2,
    protein: 0.08,
    carbs: 1.68,
  },
  {
    id: 'sauce-bbq-large',
    category: 'Sauce',
    name: 'BBQ Sauce',
    size: 'Large',
    calories: 18,
    fat: 0,
    sodium: 72,
    protein: 0.08,
    carbs: 4,
  },
  {
    id: 'sauce-pizza-xl',
    category: 'Sauce',
    name: 'Pizza Sauce',
    size: 'Extra Large',
    calories: 24,
    fat: 0,
    sodium: 80,
    protein: 0.18,
    carbs: 4.5,
  },
  {
    id: 'sauce-bbq-xl',
    category: 'Sauce',
    name: 'BBQ Sauce',
    size: 'Extra Large',
    calories: 22,
    fat: 0,
    sodium: 88,
    protein: 1,
    carbs: 4,
  },

  // Cheeses - per serving
  {
    id: 'cheese-regular-small',
    category: 'Cheese',
    name: 'Regular Cheese',
    size: 'Small',
    calories: 45.3,
    fat: 4.4,
    sodium: 138,
    protein: 3.9,
    carbs: 0,
  },
  {
    id: 'cheese-extra-small',
    category: 'Cheese',
    name: 'Extra Cheese',
    size: 'Small',
    calories: 63,
    fat: 4.6,
    sodium: 196,
    protein: 5.5,
    carbs: 0,
  },
  {
    id: 'cheese-regular-medium',
    category: 'Cheese',
    name: 'Regular Cheese',
    size: 'Medium',
    calories: 47.2,
    fat: 3.5,
    sodium: 147,
    protein: 4.1,
    carbs: 0,
  },
  {
    id: 'cheese-extra-medium',
    category: 'Cheese',
    name: 'Extra Cheese',
    size: 'Medium',
    calories: 71,
    fat: 5.3,
    sodium: 221,
    protein: 6.2,
    carbs: 0,
  },
  {
    id: 'cheese-regular-large',
    category: 'Cheese',
    name: 'Regular Cheese',
    size: 'Large',
    calories: 52.6,
    fat: 3.6,
    sodium: 164,
    protein: 4.56,
    carbs: 0,
  },
  {
    id: 'cheese-extra-large',
    category: 'Cheese',
    name: 'Extra Cheese',
    size: 'Large',
    calories: 79.2,
    fat: 5.9,
    sodium: 257.9,
    protein: 6.88,
    carbs: 0,
  },
  {
    id: 'cheese-regular-xl',
    category: 'Cheese',
    name: 'Regular Cheese',
    size: 'Extra Large',
    calories: 60,
    fat: 40,
    sodium: 175,
    protein: 5,
    carbs: 0.9,
  },
  {
    id: 'cheese-extra-xl',
    category: 'Cheese',
    name: 'Extra Cheese',
    size: 'Extra Large',
    calories: 85,
    fat: 57,
    sodium: 280,
    protein: 5.1,
    carbs: 1.75,
  },

  // Common toppings (small)
  {
    id: 'top-pepperoni-small',
    category: 'Topping',
    name: 'Pepperoni',
    size: 'Small',
    calories: 26,
    fat: 2,
    sodium: 112,
    protein: 1.1,
    carbs: 0,
  },
  {
    id: 'top-mushroom-small',
    category: 'Topping',
    name: 'Mushroom',
    size: 'Small',
    calories: 2.5,
    fat: 0,
    sodium: 2.5,
    protein: 0.3,
    carbs: 0.3,
  },
  {
    id: 'top-onion-small',
    category: 'Topping',
    name: 'Onion',
    size: 'Small',
    calories: 1.7,
    fat: 0,
    sodium: 0.8,
    protein: 0,
    carbs: 0.5,
  },
  {
    id: 'top-green-pepper-small',
    category: 'Topping',
    name: 'Green Pepper',
    size: 'Small',
    calories: 1.6,
    fat: 0,
    sodium: 0,
    protein: 0,
    carbs: 0.3,
  },
  {
    id: 'top-bacon-small',
    category: 'Topping',
    name: 'Bacon',
    size: 'Small',
    calories: 45,
    fat: 3.3,
    sodium: 168,
    protein: 2.3,
    carbs: 0.8,
  },
];

const NutritionalInfoPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Crust' | 'Sauce' | 'Cheese' | 'Topping'>('All');
  const [sizeFilter, setSizeFilter] = useState<'All' | 'Small' | 'Medium' | 'Large' | 'Extra Large' | 'Per serving'>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return NUTRITION_DATA.filter((row) => {
      if (categoryFilter !== 'All' && row.category !== categoryFilter) return false;
      if (sizeFilter !== 'All' && row.size !== sizeFilter) return false;
      if (!q) return true;

      return (
        row.name.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.size.toLowerCase().includes(q)
      );
    });
  }, [search, categoryFilter, sizeFilter]);

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header />

      <main className="pt-[132px]">
        <section className="bg-brand-soft py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-soft-foreground">
              Nutritional info
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-brand">
              See what&apos;s in your pizza.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[#4B5563]">
              Browse approximate nutritional information for crusts, sauces, cheeses, and toppings.
              Values are per serving and may vary slightly by store.
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-xs">
                {(['All', 'Crust', 'Sauce', 'Cheese', 'Topping'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      categoryFilter === cat
                        ? 'border-brand bg-brand text-white shadow-sm'
                        : 'border-[#D6DADE] bg-white text-[#374151] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value as any)}
                  className="w-full rounded-full border border-[#D6DADE] bg-white px-3 py-1.5 text-xs text-[#111827] shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-40"
                >
                  {(['All', 'Small', 'Medium', 'Large', 'Extra Large', 'Per serving'] as const).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="w-full sm:w-56">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search toppings or ingredients"
                    className="w-full rounded-full border border-[#D6DADE] bg-white px-3 py-1.5 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
              <div className="grid grid-cols-6 gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                <div className="col-span-2">Item</div>
                <div>Size</div>
                <div className="text-right">Calories</div>
                <div className="text-right">Fat (g)</div>
                <div className="text-right">Sodium (mg)</div>
              </div>

              {filtered.length === 0 && (
                <p className="px-4 py-6 text-xs text-[#6B7280]">
                  No items match that search. Try a different term or clear filters.
                </p>
              )}

              {filtered.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-6 gap-3 border-t border-[#F3F4F6] px-4 py-2.5 text-xs text-[#111827]"
                >
                  <div className="col-span-2">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-[11px] text-[#6B7280]">{row.category}</p>
                  </div>
                  <div className="text-[11px] text-[#4B5563]">{row.size}</div>
                  <div className="text-right">{row.calories}</div>
                  <div className="text-right">{row.fat}</div>
                  <div className="text-right">{row.sodium}</div>
                </div>
              ))}

              <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-[11px] text-[#6B7280]">
                Values are approximate and provided for informational purposes only. For specific
                dietary needs or allergies, please contact the store directly.
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NutritionalInfoPage;
