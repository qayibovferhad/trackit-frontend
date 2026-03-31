import { api } from '@/shared/lib/axios';
import type { SearchResults } from '../types/search.types';
import { MAX_RECENT, RECENT_KEY } from '../constants';

export const globalSearch = async (q: string): Promise<SearchResults> => {
  const { data } = await api.get<SearchResults>('/search', { params: { q } });
  return data;
};

export const getRecentSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
};

export const addRecentSearch = (q: string) => {
  const prev = getRecentSearches().filter((s) => s !== q);
  const next = [q, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

export const removeRecentSearch = (q: string) => {
  const next = getRecentSearches().filter((s) => s !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};
