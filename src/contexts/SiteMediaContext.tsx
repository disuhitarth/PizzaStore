import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { siteMedia as staticSiteMedia, type SiteMediaConfig } from '@/siteMedia';

interface SiteMediaContextValue {
  media: SiteMediaConfig;
  setMedia: (next: SiteMediaConfig) => void;
}

const SiteMediaContext = createContext<SiteMediaContextValue | undefined>(undefined);

const STORAGE_KEY = 'editableSiteMedia';

const loadInitialMedia = (): SiteMediaConfig => {
  if (typeof window === 'undefined') {
    return staticSiteMedia;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return staticSiteMedia;
    const parsed = JSON.parse(raw) as SiteMediaConfig;
    if (!parsed || typeof parsed !== 'object') return staticSiteMedia;
    if (!parsed.hero || !parsed.categoryTiles || !parsed.banners) return staticSiteMedia;
    return parsed;
  } catch {
    return staticSiteMedia;
  }
};

export const SiteMediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<SiteMediaConfig>(() => loadInitialMedia());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload = JSON.stringify(media);
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch {
      // ignore persistence errors
    }
  }, [media]);

  const value = useMemo<SiteMediaContextValue>(
    () => ({
      media,
      setMedia,
    }),
    [media],
  );

  return <SiteMediaContext.Provider value={value}>{children}</SiteMediaContext.Provider>;
};

export const useSiteMedia = (): SiteMediaContextValue => {
  const ctx = useContext(SiteMediaContext);
  if (!ctx) {
    throw new Error('useSiteMedia must be used within a SiteMediaProvider');
  }
  return ctx;
};
