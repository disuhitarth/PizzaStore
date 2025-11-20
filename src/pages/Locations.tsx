import React from 'react';
import { MapPin, Navigation2, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStore } from '@/contexts/StoreContext';
import { PIZZA_DEPOT_STORES } from '@/data/pizzaDepotStores';

const inferProvince = (city: string): 'ON' | 'MB' | 'AB' | 'SK' | 'OTHER' => {
  const c = city.toLowerCase();
  if (['winnipeg'].includes(c)) return 'MB';
  if (['calgary'].includes(c)) return 'AB';
  if (['regina', 'saskatoon', 'battleford'].includes(c)) return 'SK';
  // Most remaining cities are in Ontario
  return 'ON';
};

const LocationsPage: React.FC = () => {
  const { nearestStores, selectedStore, setSelectedStore, locateStores, isLocating } = useStore();
  const [provinceFilter, setProvinceFilter] = React.useState<'ALL' | 'ON' | 'MB' | 'AB' | 'SK'>('ALL');
  const [search, setSearch] = React.useState('');

  const allLocations = React.useMemo(
    () =>
      PIZZA_DEPOT_STORES.map((s) => ({
        id: `static-${s.store_id}`,
        name: s.store_name,
        city: s.city,
        address: s.address,
        phone: s.phone_number || '+1-866-597-9711',
        province: inferProvince(s.city),
        latitude: s.latitude,
        longitude: s.longitude,
        storeId: s.store_id,
      })),
    [],
  );

  const filtered = allLocations.filter((loc) => {
    const matchesProvince = provinceFilter === 'ALL' || loc.province === provinceFilter;
    const q = search.trim().toLowerCase();
    const matchesQuery = !q || loc.name.toLowerCase().includes(q) || loc.city.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q);
    return matchesProvince && matchesQuery;
  });

  const active = React.useMemo(() => {
    if (selectedStore) {
      const match = allLocations.find((loc) => loc.storeId === selectedStore.StoreID);
      if (match) {
        return match;
      }
    }

    return filtered[0] ?? allLocations[0] ?? null;
  }, [selectedStore, filtered, allLocations]);

  const buildMapUrl = React.useCallback(
    (loc: typeof active) => {
      if (!loc) {
        return 'https://www.google.com/maps?q=Canada&z=3&output=embed';
      }

      if (typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
        return `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}&z=14&output=embed`;
      }

      const query = encodeURIComponent(`${loc.address}, ${loc.city}, ${loc.province} Canada`);
      return `https://www.google.com/maps?q=${query}&z=14&output=embed`;
    },
    [],
  );

  const handleSelect = (loc: (typeof allLocations)[number]) => {
    const matchedStatic = PIZZA_DEPOT_STORES.find((s) => s.store_id === loc.storeId) || null;
    if (matchedStatic) {
      setSelectedStore({
        StoreID: matchedStatic.store_id,
        StoreName: matchedStatic.store_name,
        City: matchedStatic.city,
        Address: matchedStatic.address,
        PhoneNumbers: matchedStatic.phone_number,
        Description: undefined,
        StorePromo: matchedStatic.store_promo,
        Distance: undefined,
        Latitude: matchedStatic.latitude,
        Longitude: matchedStatic.longitude,
        MinimumTimeRequiredForPickup: undefined,
        MinimumTimeRequiredForDelivery: undefined,
        StoreOpenTime: matchedStatic.store_open_time,
        StoreCloseTime: matchedStatic.store_close_time,
      });
    } else {
      setSelectedStore(null);
    }

    if (typeof window !== 'undefined') {
      const el = document.getElementById('locations-map');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const ProvinceFilterButton: React.FC<{ code: 'ALL' | 'ON' | 'MB' | 'AB' | 'SK'; label: string }> = ({ code, label }) => (
    <button
      type="button"
      onClick={() => setProvinceFilter(code)}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        provinceFilter === code
          ? 'border-brand bg-brand text-white shadow-sm'
          : 'border-[#D6DADE] bg-white text-[#374151] hover:bg-[#F3F4F6]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header />

      <main className="pt-[132px]">
        <section className="bg-brand-soft py-10 sm:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row md:items-end">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-soft-foreground">
                Locations
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-brand">
                Find a Pizza Depot near you.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[#4B5563]">
                Browse all Pizza Depot locations across Ontario, Manitoba, Alberta, and Saskatchewan.
                Use search or filters below to quickly find a store near you.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => locateStores()}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-md hover:bg-slate-100"
                >
                  <Navigation2 className="h-3.5 w-3.5" />
                  {isLocating ? 'Locating you…' : 'Use my location'}
                </button>
                {active && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-200 border border-white/10">
                    <MapPin className="h-3 w-3 text-orange-300" />
                    <span className="truncate max-w-[220px]">
                      {active.city}, {active.province}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {active && (
              <div className="w-full max-w-md rounded-2xl border border-brand-soft-border bg-white p-4 shadow-xl text-[#374151]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                  Selected store
                </p>
                <p className="mt-1 text-sm font-semibold text-[#111827]">{active.name}</p>
                <p className="mt-1 text-xs text-[#4B5563]">{active.address}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#374151]">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${active.phone}`} className="text-[#111827] hover:underline">
                    {active.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8 md:flex-row">
            {/* List */}
            <div className="w-full md:w-[52%]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[11px] font-medium text-[#6B7280]">
                    All stores ({allLocations.length})
                  </span>
                  <ProvinceFilterButton code="ALL" label="All provinces" />
                  <ProvinceFilterButton code="ON" label="Ontario" />
                  <ProvinceFilterButton code="MB" label="Manitoba" />
                  <ProvinceFilterButton code="AB" label="Alberta" />
                  <ProvinceFilterButton code="SK" label="Saskatchewan" />
                </div>
                <div className="w-full sm:w-48">
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by city or address"
                    className="w-full rounded-full border border-[#D6DADE] bg-white px-3 py-1.5 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 max-h-[480px] overflow-auto rounded-2xl border border-[#E5E7EB] bg-white">
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-xs text-[#6B7280]">
                    No locations match that search. Try a nearby city or clear your filters.
                  </p>
                )}
                {filtered.map((loc) => {
                  const isActive = active && loc.id === active.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelect(loc)}
                      className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-xs sm:text-sm border-b last:border-b-0 transition ${
                        isActive ? 'bg-[#F3F4FF]' : 'hover:bg-[#F9FAFB]'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-[#111827]">{loc.name}</p>
                        <p className="text-[#4B5563]">{loc.address}</p>
                        <p className="text-[11px] text-[#6B7280]">
                          {loc.city}, {loc.province}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[11px] text-[#4B5563]">
                        <span className="inline-flex items-center gap-1 rounded-full border border-brand-soft-border px-2 py-0.5 text-[10px] font-medium text-brand-soft-foreground bg-brand-soft">
                          <MapPin className="h-3 w-3 text-brand" />
                          View on map
                        </span>
                        <a
                          href={`tel:${loc.phone}`}
                          className="text-[#111827] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {loc.phone}
                        </a>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className="w-full md:flex-1" id="locations-map">
              <div className="h-[360px] rounded-3xl border border-brand-soft-border bg-gradient-to-br from-brand via-brand to-brand p-4 shadow-[0_22px_45px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between text-xs text-red-50">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-100/80">
                      Live map
                    </p>
                    <p className="text-sm font-semibold text-white">{active ? active.city : 'Canada'}</p>
                  </div>
                  <div className="rounded-full bg-black/30 px-3 py-1 text-[11px] text-red-50 border border-white/10">
                    Pan and zoom the map below to explore.
                  </div>
                </div>

                <div className="mt-4 h-[280px] rounded-2xl overflow-hidden bg-black/20">
                  <iframe
                    title={active ? `Map for ${active.name}` : 'Pizza Depot locations map'}
                    src={buildMapUrl(active)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LocationsPage;
