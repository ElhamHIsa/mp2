import axios from 'axios';
import type { MediaItem, NasaCollectionItem, NasaSearchResponse } from '../types';

const client = axios.create({
  baseURL: 'https://images-api.nasa.gov',
  timeout: 15000,
});

const cache = new Map<string, MediaItem[]>();

function toMediaItem(item: NasaCollectionItem): MediaItem | null {
  const data = item.data[0];
  if (!data) return null;

  const thumbnail = item.links?.find((link) => link.rel === 'preview')?.href ?? '';

  return {
    id: data.nasa_id,
    title: data.title ?? 'Untitled',
    description: data.description ?? '',
    date: data.date_created ?? '',
    center: data.center ?? 'Unknown',
    photographer: data.photographer ?? '',
    keywords: data.keywords ?? [],
    thumbnail,
  };
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  const term = query.trim() || 'apollo';
  const cached = cache.get(term);
  if (cached) return cached;

  const response = await client.get<NasaSearchResponse>('/search', {
    params: { q: term, media_type: 'image' },
  });

  const items = response.data.collection.items
    .map(toMediaItem)
    .filter((item): item is MediaItem => item !== null && item.thumbnail !== '');

  cache.set(term, items);
  return items;
}

export async function getItemById(nasaId: string): Promise<MediaItem | null> {
  const response = await client.get<NasaSearchResponse>('/search', {
    params: { nasa_id: nasaId },
  });

  const first = response.data.collection.items[0];
  return first ? toMediaItem(first) : null;
}
export async function getAssetUrls(nasaId: string): Promise<string[]> {
  const response = await client.get<{ collection: { items: { href: string }[] } }>(
    `/asset/${encodeURIComponent(nasaId)}`
  );

  return response.data.collection.items
    .map((item) => item.href)
    .filter((href) => /\.(jpg|jpeg|png)$/i.test(href))
    .map((href) => href.replace(/^http:/, 'https:'));
}