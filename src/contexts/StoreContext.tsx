import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast as notify } from '@/components/ui/sonner';
import { PIZZA_DEPOT_STORES, PizzaDepotStaticStore } from '@/data/pizzaDepotStores';

export type Store = {
  StoreID: number;
  StoreName: string;
  City: string;
  Address: string;
  PhoneNumbers?: string;
  Description?: string;
  StorePromo?: string;
  Distance?: string;
  Latitude?: number;
  Longitude?: number;
  MinimumTimeRequiredForPickup?: number;
  MinimumTimeRequiredForDelivery?: number;
  StoreOpenTime?: string;
  StoreCloseTime?: string;
};

// Raw shape returned from the Pizza Depot API (Latitude/Longitude as strings, plus extra fields)
interface ApiStore {
  StoreID: number;
  StoreName: string;
  City: string;
  Address: string;
  PhoneNumbers?: string;
  Description?: string;
  StorePromo?: string;
  Distance?: string;
  Latitude?: string | null;
  Longitude?: string | null;
  MinimumTimeRequiredForPickup?: number;
  MinimumTimeRequiredForDelivery?: number;
  StoreOpenTime?: string;
  StoreCloseTime?: string;
  [key: string]: unknown;
}

interface StoresApiResponse {
  d?: {
    result?: ApiStore[];
  };
}

const toStoreFromStatic = (s: PizzaDepotStaticStore & { distanceKm?: number }): Store => ({
  StoreID: s.store_id,
  StoreName: s.store_name,
  City: s.city,
  Address: s.address,
  PhoneNumbers: s.phone_number,
  Description: undefined,
  StorePromo: s.store_promo,
  Distance: typeof s.distanceKm === 'number' ? `${s.distanceKm.toFixed(1)} km` : undefined,
  Latitude: s.latitude,
  Longitude: s.longitude,
  MinimumTimeRequiredForPickup: undefined,
  MinimumTimeRequiredForDelivery: undefined,
  StoreOpenTime: s.store_open_time,
  StoreCloseTime: s.store_close_time,
});

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const mapApiStore = (api: ApiStore): Store => ({
  StoreID: api.StoreID,
  StoreName: api.StoreName,
  City: api.City,
  Address: api.Address,
  PhoneNumbers: api.PhoneNumbers,
  Description: api.Description,
  StorePromo: api.StorePromo,
  Distance: api.Distance,
  Latitude: api.Latitude != null && api.Latitude !== '' ? Number(api.Latitude) : undefined,
  Longitude: api.Longitude != null && api.Longitude !== '' ? Number(api.Longitude) : undefined,
  MinimumTimeRequiredForPickup: api.MinimumTimeRequiredForPickup,
  MinimumTimeRequiredForDelivery: api.MinimumTimeRequiredForDelivery,
  StoreOpenTime: api.StoreOpenTime,
  StoreCloseTime: api.StoreCloseTime,
});

interface StoreContextType {
  nearestStores: Store[];
  selectedStore: Store | null;
  /** Human-readable label for the user's approximate location (city/region). */
  userLocationLabel: string | null;
  isLocating: boolean;
  locationError: string | null;
  /** pickup vs delivery mode shared across header and checkout */
  serviceType: 'pickup' | 'delivery';
  setServiceType: (mode: 'pickup' | 'delivery') => void;
  locateStores: () => void;
  setSelectedStore: (store: Store | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nearestStores, setNearestStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);
  const [userLocationLabel, setUserLocationLabel] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<'pickup' | 'delivery'>(() => {
    if (typeof window === 'undefined') return 'pickup';
    const stored = window.localStorage.getItem('serviceType');
    return stored === 'delivery' ? 'delivery' : 'pickup';
  });

  const applySelectedStore = useCallback((store: Store | null) => {
    setSelectedStoreState((prev) => {
      if (store && (!prev || prev.StoreID !== store.StoreID)) {
        notify.success('Nearest store selected', {
          description: `${store.StoreName} (${store.City})`,
        });
      }
      return store;
    });
  }, []);

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'pizza-depot-demo/1.0',
          },
        },
      );
      if (!res.ok) return null;
      const data = (await res.json().catch(() => null)) as any;
      if (!data) return null;
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.suburb;
      const region = address.state || address.region;
      const country = address.country_code ? String(address.country_code).toUpperCase() : undefined;
      const parts = [city, region, country].filter(Boolean);
      return parts.join(', ') || (data.display_name as string | undefined) || null;
    } catch {
      return null;
    }
  };

  const locateStores = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      notify.error('Unable to detect your location', {
        description: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setUserLocationLabel(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Fire and forget: resolve a human-readable label for the user's approximate location.
        reverseGeocode(latitude, longitude).then((label) => {
          if (label) {
            setUserLocationLabel(label);
          }
        });

        // Use local static store data to determine nearest locations by distance.
        const storesWithDistance = PIZZA_DEPOT_STORES.map((s) => ({
          ...s,
          distanceKm: haversineKm(latitude, longitude, s.latitude, s.longitude),
        })).sort((a, b) => a.distanceKm - b.distanceKm);

        if (!storesWithDistance.length) {
          setLocationError('No nearby stores found.');
          setIsLocating(false);
          return;
        }

        const nearestStoresMapped: Store[] = storesWithDistance.map((s) => toStoreFromStatic(s));
        setNearestStores(nearestStoresMapped);
        applySelectedStore(nearestStoresMapped[0]);

        console.log('Nearest static stores response', {
          latitude,
          longitude,
          nearest: nearestStoresMapped.slice(0, 5),
        });

        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error', error);
        setLocationError('Unable to get your location.');
        notify.error('Unable to detect your location', {
          description: 'We could not get your location. Try again or choose a store manually.',
        });
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, []);

  // Persist service type to localStorage so it survives reloads.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('serviceType', serviceType);
    }
  }, [serviceType]);

  const value: StoreContextType = {
    nearestStores,
    selectedStore,
    userLocationLabel,
    isLocating,
    locationError,
    serviceType,
    setServiceType,
    locateStores,
    setSelectedStore: applySelectedStore,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
