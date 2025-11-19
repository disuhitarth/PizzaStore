import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
import { MapPin, Bike, Clock, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const STEPS = [
  'Order placed',
  'Being prepared',
  'Baking',
  'Quality check',
  'Out for delivery',
  'Delivered',
] as const;

interface DeliveryAddress {
  name?: string;
  street?: string;
  unit?: string;
  city?: string;
  postalCode?: string;
  instructions?: string;
}

interface OrderStatusLocationState {
  deliveryAddress?: DeliveryAddress | null;
  contactNumber?: string | null;
}

const OrderStatusPage: React.FC = () => {
  const { items, getTotalPrice } = useCart();
  const { selectedStore, userLocationLabel, serviceType } = useStore();
  const location = useLocation() as { state?: OrderStatusLocationState | null };
  const navigate = useNavigate();
  const deliveryAddress = location.state?.deliveryAddress;
  const contactNumber = location.state?.contactNumber ?? '';
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header />

      <main className="pt-[132px]">
        {/* Hero */}
        <section className="bg-[#020617] py-8 sm:py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-end sm:px-6 lg:px-8">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Order status
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                We&apos;re on it.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                This live tracker is a demo view inspired by delivery apps like Domino&apos;s. Steps will
                advance automatically so you can preview the full experience.
              </p>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900/40 p-4 text-xs text-slate-100 shadow-xl sm:text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-semibold">
                    <Bike className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Estimated time
                    </p>
                    <p className="text-sm font-semibold text-white">35–45 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                  <Clock className="h-3.5 w-3.5" />
                  Live demo
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-300">
                When wired to a backend, this card can show real-time driver updates and accurate ETAs
                for pickup or delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Tracker + map + summary */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8 md:flex-row">
            {/* Tracker */}
            <div className="w-full md:w-[45%]">
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-[#111827]">Order progress</h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Steps will advance every few seconds to simulate a real order. In production, these
                  would be driven by live order events.
                </p>

                <ol className="mt-4 space-y-3">
                  {STEPS.map((label, index) => {
                    const isActive = index === activeStep;
                    const isComplete = index < activeStep;
                    return (
                      <li key={label} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                            isComplete
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : isActive
                              ? 'border-[#E30613] bg-[#E30613] text-white'
                              : 'border-[#D1D5DB] bg-white text-[#6B7280]'
                          }`}
                        >
                          {isComplete ? '✓' : index + 1}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">{label}</p>
                          {isActive && (
                            <p className="mt-0.5 text-[11px] text-[#6B7280]">
                              This is the current step in the demo tracker.
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Map + summary */}
            <div className="w-full md:flex-1 space-y-4">
              <div className="rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#7F0010] via-[#B8000F] to-[#E30613] p-4 shadow-[0_22px_45px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between gap-3 text-xs text-red-50">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Map preview
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {serviceType === 'delivery' ? 'Delivery on the way' : 'Pickup in progress'}
                    </p>
                    {selectedStore && (
                      <p className="mt-1 text-[11px] text-red-100/80 truncate">
                        {serviceType === 'delivery'
                          ? `From ${selectedStore.StoreName} · ${selectedStore.City}`
                          : `Pickup at ${selectedStore.StoreName} · ${selectedStore.City}`}
                      </p>
                    )}
                    {serviceType === 'delivery' && userLocationLabel && (
                      <p className="mt-0.5 text-[11px] text-red-100/70 truncate">
                        Approx. delivery area: {userLocationLabel}
                      </p>
                    )}
                    {serviceType === 'delivery' && deliveryAddress && (
                      <p className="mt-0.5 text-[11px] text-red-100/80 truncate">
                        Delivering to{' '}
                        {[deliveryAddress.street, deliveryAddress.unit, deliveryAddress.city, deliveryAddress.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[11px]">
                    <div className="inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1 border border-white/10">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-medium">35–45 min</span>
                    </div>
                    <div className="rounded-full bg-black/20 px-3 py-1 text-[10px] text-red-50 border border-white/5">
                      Demo only — map and movement are illustrative.
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-[230px] rounded-2xl bg-slate-900/40 p-3 sm:h-[260px]">
                  <div
                    className="relative h-full w-full overflow-hidden rounded-xl border border-white/5 bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] [background-size:18px_18px]"
                    aria-hidden="true"
                  >
                    {/* Soft map glow */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(74,222,128,0.24),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(252,211,77,0.26),transparent_55%)]" />

                    {/* Route */}
                    <div className="absolute left-[18%] top-[18%] h-[64%] w-[54%] rounded-3xl border-2 border-dashed border-emerald-400/70 opacity-90 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]" />

                    {/* Store pin */}
                    <div className="absolute left-6 top-5 inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] text-slate-100 shadow-sm backdrop-blur">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
                        <MapPin className="h-3 w-3 text-emerald-300" />
                      </span>
                      <span className="font-medium truncate max-w-[120px]">
                        {selectedStore ? selectedStore.City : 'Store'}
                      </span>
                    </div>

                    {/* Customer pin */}
                    <div className="absolute right-6 bottom-6 inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] text-slate-100 shadow-sm backdrop-blur">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20">
                        <MapPin className="h-3 w-3 text-amber-300" />
                      </span>
                      <span className="font-medium truncate max-w-[140px]">
                        {deliveryAddress?.city || userLocationLabel || 'Your area'}
                      </span>
                    </div>

                    {/* Driver badge roughly along the route */}
                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] text-slate-100 shadow-sm backdrop-blur animate-pulse">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                        <Bike className="h-3.5 w-3.5 text-emerald-300" />
                      </span>
                      <span className="font-medium">Driver en route</span>
                    </div>

                    {/* Compass / zoom controls fake UI */}
                    <div className="absolute right-3 top-3 flex flex-col gap-1 text-[9px] text-slate-200">
                      <button className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-xs shadow-sm">
                        +
                      </button>
                      <button className="flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-xs shadow-sm">
                        −
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-red-100/80">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                      <span>Store</span>
                      <span className="inline-flex h-2 w-2 rounded-full bg-amber-300 ml-3" />
                      <span>Approx. dropoff</span>
                    </div>
                    <span className="text-[10px] text-red-100/70">Real maps can be wired in via your delivery API.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-[#111827]">Your order</h2>
                {items.length === 0 ? (
                  <p className="mt-2 text-xs text-[#6B7280]">
                    Your cart is currently empty. For the demo, build an order first and then tap
                    Checkout to see items appear here.
                  </p>
                ) : (
                  <>
                    <ul className="mt-3 space-y-2 text-xs text-[#374151]">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-[#111827]">
                              {item.quantity}× {item.name}
                            </span>
                            {item.size && (
                              <span className="text-[11px] text-[#6B7280]">{item.size}</span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#111827]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-[#E5E7EB] pt-3 text-xs text-[#111827]">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-semibold">${total.toFixed(2)}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#6B7280]">
                        Taxes, delivery fees, and tips would be calculated at checkout in production.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {serviceType === 'delivery' && deliveryAddress && (
                <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="flex items-center gap-2 text-base font-semibold text-[#111827]">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FEF2F2] text-[#B91C1C] text-xs">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                        <span>Delivery details</span>
                      </h2>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        This is a demo view only — details here are not sent to any backend.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[11px] text-[#6B7280]">
                      <div className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-medium text-[#111827]">
                        <Clock className="h-3.5 w-3.5 text-[#6B7280]" />
                        <span>ETA 35–45 min</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.history.length > 1) {
                            navigate(-1);
                          } else {
                            navigate('/');
                          }
                        }}
                        className="text-[11px] font-medium text-[#111827] underline underline-offset-2 hover:text-[#E30613]"
                      >
                        Change details
                      </button>
                    </div>
                  </div>

                  <dl className="mt-3 space-y-2 text-xs text-[#374151]">
                    {deliveryAddress.name && (
                      <div className="flex items-start gap-2">
                        <dt className="w-20 text-[11px] font-semibold text-[#6B7280]">Name</dt>
                        <dd className="flex-1 text-[#111827]">{deliveryAddress.name}</dd>
                      </div>
                    )}
                    {contactNumber && (
                      <div className="flex items-start gap-2">
                        <dt className="w-20 text-[11px] font-semibold text-[#6B7280]">Phone</dt>
                        <dd className="flex-1 inline-flex items-center gap-1 text-[#111827]">
                          <Phone className="h-3.5 w-3.5 text-[#6B7280]" />
                          <span>{contactNumber}</span>
                        </dd>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <dt className="w-20 text-[11px] font-semibold text-[#6B7280]">Address</dt>
                      <dd className="flex-1 text-[#111827]">
                        {[deliveryAddress.street, deliveryAddress.unit]
                          .filter(Boolean)
                          .join(', ')}
                        <br />
                        {[deliveryAddress.city, deliveryAddress.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </dd>
                    </div>
                    {deliveryAddress.instructions && (
                      <div className="flex items-start gap-2">
                        <dt className="w-20 text-[11px] font-semibold text-[#6B7280]">Notes</dt>
                        <dd className="flex-1 text-[#111827] whitespace-pre-line">
                          {deliveryAddress.instructions}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderStatusPage;
