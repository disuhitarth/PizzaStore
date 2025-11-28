import raw from './data/siteMedia.json';

export interface HeroMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  headline?: string;
  subheadline?: string;
}

export interface CategoryTilesMedia {
  defaultImageUrl: string;
  perCategory?: Record<string, string>;
}

export interface SiteMediaConfig {
  hero: HeroMedia;
  categoryTiles: CategoryTilesMedia;
  banners: {
    closeIconUrl: string;
    loyaltyIconUrl: string;
  };
}

export const siteMedia = raw as SiteMediaConfig;
