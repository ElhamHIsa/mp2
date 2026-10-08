import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { searchMedia } from '../api/nasa';
import type { MediaItem } from '../types';

interface SearchState {
  query: string;
  setQuery: (value: string) => void;
  items: MediaItem[];
  loading: boolean;
  error: string | null;
}

const SearchContext = createContext<SearchState | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('apollo');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);

      searchMedia(query)
        .then((results) => {
          if (!active) return;
          setItems(results);
          if (results.length === 0) setError('No results for that search.');
        })
        .catch(() => {
          if (!active) return;
          setItems([]);
          setError('Could not reach the NASA archive. Try again');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const value = useMemo(
    () => ({ query, setQuery, items, loading, error }),
    [query, items, loading, error]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchState {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used inside SearchProvider');
  return context;
}