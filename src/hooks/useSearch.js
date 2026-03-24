import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '../store/search.store.js'
import { searchViaWS } from '../api/search.ws.js'

export function useSearch() {
  const navigate = useNavigate()
  const closeWS  = useRef(null)

  const { query, setQuery, startSearch, appendChunk, setFinished, setError } = useSearchStore()

  const search = useCallback((searchQuery) => {
    const q = (searchQuery ?? query).trim()
    if (!q) return

    closeWS.current?.()
    setQuery(q)
    startSearch(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)

    closeWS.current = searchViaWS(q, {
      onChunk:  (products) => appendChunk(products),
      onFinish: ()         => setFinished(),
      onError:  (code, meta) => {
        if (code === 'UNAUTHORIZED') { navigate('/login'); return }
        setError(code, meta)
      },
    })
  }, [query])

  return { query, setQuery, search }
}
