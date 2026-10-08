export interface NasaItemData {
  nasa_id: string;
  title: string;
  description?: string;
  date_created: string;
  center?: string;
  keywords?: string[];
  photographer?: string;
  media_type: string;
}

export interface NasaLink {
  href: string;
  rel: string;
  render?: string;
}

export interface NasaCollectionItem {
  href: string;
  data: NasaItemData[];
  links?: NasaLink[];
}

export interface NasaSearchResponse {
  collection: {
    version: string;
    href: string;
    items: NasaCollectionItem[];
    metadata: { total_hits: number };
  };
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  center: string;
  photographer: string;
  keywords: string[];
  thumbnail: string;
}

export type SortKey = 'title' | 'date' | 'center';
export type SortDirection = 'asc' | 'desc';