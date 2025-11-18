import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Store = {
  StoreID: number;
  StoreName: string;
  City: string;
  Address: string;
  PhoneNumbers?: string;
  Description?: string;
  StorePromo?: string;
  Distance?: string;
};

interface StoreContextType {
  nearestStores: Store[];
  selectedStore: Store | null;
  isLocating: boolean;
  locationError: string | null;
  useMyLocation: () => void;
  setSelectedStore: (store: Store | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nearestStores, setNearestStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const useMyLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch('https://pizzadepot.ca/orderonline/api.aspx/GetStoresData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          // Let the browser send any cookies it has for pizzadepot.ca
          credentials: 'include',
          body: JSON.stringify({ id: 0 }),
        })
          .then(async (res) => {
            const json = await res.json().catch(() => null as any);
            if (!res.ok) {
              console.error('GetStoresData (nearest) failed', res.status, res.statusText, json);
            }
            const stores: Store[] = json?.d?.result ?? [];

            if (!stores || stores.length === 0) {
              setLocationError('No nearby stores found.');
              return;
            }

            setNearestStores(stores);
            const first = stores[0];

            // Second call: fetch specific store details using its StoreID.
            return fetch('https://pizzadepot.ca/orderonline/api.aspx/GetStoresData', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ id: first.StoreID }),
            })
              .then(async (detailRes) => {
                const detailJson = await detailRes.json().catch(() => null as any);
                if (!detailRes.ok) {
                  console.error('GetStoresData (store detail) failed', detailRes.status, detailRes.statusText, detailJson);
                }
                const detailedStores: Store[] = detailJson?.d?.result ?? [];
                const detailed = detailedStores[0] ?? first;
                setSelectedStore(detailed);

                console.log('Nearest stores response', {
                  latitude,
                  longitude,
                  stores,
                });
                console.log('Selected store details', {
                  selectedStore: detailed,
                  raw: detailJson,
                });
              });
          })
          .catch((err) => {
            console.error('Error fetching stores data', err);
            setLocationError('Unable to fetch store data.');
          })
          .finally(() => {
            setIsLocating(false);
          });
      },
      (error) => {
        console.error('Geolocation error', error);
        setLocationError('Unable to get your location.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, []);

  // Automatically attempt to get location and nearest store list on first mount.
  useEffect(() => {
    useMyLocation();
  }, [useMyLocation]);

  const value: StoreContextType = {
    nearestStores,
    selectedStore,
    isLocating,
    locationError,
    useMyLocation,
    setSelectedStore,
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
