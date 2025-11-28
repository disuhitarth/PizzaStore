import raw from './data/siteMedia.json';

export interface HeroMedia {
  type: 'image' | 'video';
  /** Desktop / default hero media URL */
  src: string;
  /** Optional desktop hero poster for video */
  poster?: string;
  /** Optional mobile-specific hero media URL (image or video) */
  mobileSrc?: string;
  /** Optional mobile-specific poster image for video */
  mobilePoster?: string;
  headline?: string;
  subheadline?: string;
  /**
   * Optional additional image URLs for a simple hero slider.
   * These are treated as background images and rotate every 8 seconds.
   */
  extraImages?: string[];
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
