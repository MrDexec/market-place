import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchStore } from '../store/search.store.js'
import { searchViaWS } from '../api/search.ws.js'

export function useSearch() {
  const navigate = useNavigate()
  const closeWS = useRef(null)

  // Текущий активный запрос
  const activeQuery = useRef(null)

  // Номер запроса, чтобы игнорировать старые callbacks
  const requestIdRef = useRef(0)

  const {
    query,
    setQuery,
    startSearch,
    appendChunk,
    setFinished,
    setError,
  } = useSearchStore()

  const runSearch = useCallback((searchQuery, { force = false } = {}) => {
    const q = (searchQuery ?? query).trim()
    if (!q) return

    // Не запускаем тот же запрос повторно, если он уже активен
    if (!force && activeQuery.current === q) return

    // Закрываем предыдущий сокет
    closeWS.current?.()

    activeQuery.current = q
    const requestId = ++requestIdRef.current

    setQuery(q)
    startSearch(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)

    closeWS.current = searchViaWS(q, {
      onChunk: (products) => {
        if (requestId !== requestIdRef.current) return
        appendChunk(products)
      },
      onFinish: () => {
        if (requestId !== requestIdRef.current) return
        activeQuery.current = null
        setFinished()
      },
      onError: (code, meta) => {
        if (requestId !== requestIdRef.current) return
        activeQuery.current = null
        if (code === 'UNAUTHORIZED') {
          navigate('/login')
          return
        }
        setError(code, meta)
      },
    })
  }, [query, navigate, setQuery, startSearch, appendChunk, setFinished, setError])

  const search = useCallback((searchQuery) => {
    runSearch(searchQuery, { force: false })
  }, [runSearch])

  const searchNew = useCallback((searchQuery) => {
    runSearch(searchQuery, { force: true })
  }, [runSearch])

  return { query, setQuery, search, searchNew }
}