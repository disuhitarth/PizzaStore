import React from 'react';
import { Sparkles, Percent, Pizza } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const deals = [
  {
    id: 'bf50-second-pizza',
    name: 'Black Friday • 50% off your 2nd pizza',
    description: 'Buy any large pizza, get 50% off a second of equal or lesser value.',
    code: 'BF50',
    price: 0,
    tag: 'Limited time',
  },
  {
    id: 'family-feast',
    name: 'Family Feast for 4',
    description: '2 large 3-topping pizzas, 10 wings & 4 cans of pop.',
    price: 39.99,
    tag: 'Most popular',
  },
  {
    id: 'late-night',
    name: 'Late Night 11" Deal',
    description: 'Any 11" specialty pizza + dip after 9PM.',
    price: 14.99,
    tag: 'After 9PM',
  },
] as const;

const DealsSection: React.FC = () => {
  const { addItem } = useCart();
  const isMobile = useIsMobile();
  const [hasUserSeenRow, setHasUserSeenRow] = React.useState(false);
  const rowRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isMobile) return;
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const target = rowRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasUserSeenRow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isMobile]);

  const handleApplyDeal = (deal: (typeof deals)[number]) => {
    if (deal.id === 'bf50-second-pizza') {
      if (!isMobile) {
        toast.success('Promo code BF50 will be applied at checkout in this demo.');
      }
      return;
    }

    addItem({
      id: `deal-${deal.id}-${Date.now()}`,
      name: deal.name,
      price: deal.price,
      quantity: 1,
      size: 'Deal',
      toppings: [],
      specialInstructions: deal.description,
      image:
        'https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2F17f6ae84473042fb97e6a63073930cb3',
    });

    if (!isMobile) {
      toast.success(`${deal.name} added to your order`);
    }
  };

  return (
    <section id="specials" className="bg-white text-[#111827]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-soft-foreground">
            <Sparkles className="h-4 w-4 text-[#F97316]" />
            <span>Featured deals</span>
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Prices and availability may vary by location. Taxes and delivery fees extra.
          </p>
        </div>

        <div
          ref={rowRef}
          className={`flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scroll-px-4 md:mx-0 md:px-0 md:overflow-visible md:pb-0 md:grid md:grid-cols-3 ${
            isMobile && !hasUserSeenRow ? 'deals-marquee-row' : ''
          }`}
        >
          {deals.map((deal) => (
            <button
              key={deal.id}
              type="button"
              onClick={() => handleApplyDeal(deal)}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-brand-soft-border bg-white px-4 py-4 text-left shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition hover:border-brand hover:bg-brand-soft min-w-[260px] snap-center md:snap-start md:min-w-0"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-soft-foreground">
                {deal.id === 'bf50-second-pizza' ? (
                  <Percent className="h-3 w-3 text-brand" />
                ) : (
                  <Pizza className="h-3 w-3 text-brand" />
                )}
                <span>{deal.tag}</span>
              </div>
              <div className="w-full overflow-hidden rounded-xl bg-brand-soft aspect-square">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2F17f6ae84473042fb97e6a63073930cb3"
                  alt={deal.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-snug text-[#111827]">{deal.name}</p>
                <p className="mt-1 text-[11px] text-[#4B5563]">{deal.description}</p>
              </div>
              <div className="mt-2 flex w-full items-center justify-between text-xs text-[#374151]">
                <div className="flex items-baseline gap-1">
                  {deal.price > 0 ? (
                    <>
                      <span className="text-[11px] uppercase tracking-wide text-[#6B7280]">From</span>
                      <span className="text-sm font-semibold text-[#111827]">${deal.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-brand-soft-foreground">Code: {deal.code}</span>
                  )}
                </div>
                <span className="rounded-full bg-brand text-[11px] font-semibold text-white px-3 py-1 shadow-sm group-hover:bg-brand/90">
                  {deal.id === 'bf50-second-pizza' ? 'Copy code' : 'Add deal'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
