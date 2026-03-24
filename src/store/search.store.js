import { create } from 'zustand'

export const useSearchStore = create((set, get) => ({
  query:     '',
  results:   [],
  status:    'idle',
  error:     null,
  errorCode: null,
  sortBy:    'default', // default | price_asc | price_desc

  setQuery: (query) => set({ query }),

  startSearch: (query) => set({
    query, results: [], status: 'loading', error: null, errorCode: null, sortBy: 'default',
  }),

  appendChunk: (products) => set(s => ({
    results: [...s.results, ...products],
    status:  'streaming',
  })),

  setFinished: () => set({ status: 'success' }),

  setError: (code, meta) => {
    console.warn('[Search WS error]', code, meta)
    set({ status: 'success', errorCode: code, error: meta })
  },

  setSortBy: (sortBy) => set({ sortBy }),

  // Возвращает отсортированные результаты
  getSortedResults: () => {
    const { results, sortBy } = get()
    if (sortBy === 'price_asc')  return [...results].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sortBy === 'price_desc') return [...results].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    return results
  },

  reset: () => set({ results: [], status: 'idle', error: null, errorCode: null, query: '' }),
}))
