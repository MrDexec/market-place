import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSearchStore } from '../../store/search.store.js'
import { useSearch } from '../../hooks/useSearch.js'
import { useAuth } from '../../hooks/useAuth.js'
import ProductCard from '../../components/product/ProductCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

const MARKETPLACE_CHIPS = [
  { label: 'Ozon',           keys: ['ozon'] },
  { label: 'Wildberries',    keys: ['wildberries'] },
  { label: 'Яндекс Маркет',  keys: ['яндекс маркет', 'yandexmarket', 'yandex market', 'яндекс'] },
  { label: 'СберМегаМаркет',  keys: ['сбермегамаркет', 'megamarket', 'сбер мегамаркет'] },
  { label: 'Магнит Маркет',   keys: ['магнит маркет', 'magnit', 'магнит'] },
]

const CHIP_COLORS = {
  'Ozon': '#1a5fff',
  'Wildberries': '#9c1dab',
  'Яндекс Маркет': '#c47f00',
  'СберМегаМаркет': '#2e7d32',
  'Магнит Маркет': '#c62828',
}

function isMarketplaceArrived(chip, arrivedKeys) {
  return chip.keys.some(k => arrivedKeys.includes(k))
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const {
    results,
    status,
    sortBy,
    setSortBy,
    getSortedResults,
    query: storeQuery,
  } = useSearchStore()

  const { search, setQuery } = useSearch()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // Чтобы не стартовать один и тот же запрос повторно при возврате назад
  const handledQueryRef = useRef('')

  useEffect(() => {
    if (!q) return

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    const sameQueryAlreadyInStore =
        storeQuery === q &&
        (status === 'loading' || status === 'streaming' || status === 'success')

    if (sameQueryAlreadyInStore) {
      handledQueryRef.current = q
      return
    }

    if (handledQueryRef.current === q) return

    handledQueryRef.current = q
    setQuery(q)
    search(q)
  }, [q, isLoggedIn, navigate, storeQuery, status, search, setQuery])

  const isLoading = status === 'loading'
  const isStreaming = status === 'streaming'
  const sortedResults = getSortedResults()
  const arrivedKeys = [...new Set(results.map(p => p.marketplace?.toLowerCase().trim()))]

  // Пока запрос идёт и результатов ещё нет — показываем загрузку
  const showLoading = q && (isLoading || isStreaming || (status === 'success' && results.length === 0))

  return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 48px' }}>
        {q && (
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--stone-2)' }}>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 4 }}>Результаты поиска</p>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                    «{q}»
                  </h1>

                  {results.length > 0 && (
                      <span style={{ fontSize: 15, fontWeight: 300, color: 'var(--ink-dim)' }}>
                  {results.length} товаров
                        {isStreaming && <span style={{ color: 'var(--gold)', marginLeft: 8 }}>· загружается...</span>}
                </span>
                  )}
                </div>

                {results.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Сортировка:</span>
                      {[
                        { value: 'default', label: 'По умолчанию' },
                        { value: 'price_asc', label: 'Сначала дешевле' },
                        { value: 'price_desc', label: 'Сначала дороже' },
                      ].map(opt => (
                          <button
                              key={opt.value}
                              onClick={() => setSortBy(opt.value)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: 100,
                                fontSize: 12,
                                fontWeight: 400,
                                background: sortBy === opt.value ? 'var(--ink)' : 'var(--stone)',
                                color: sortBy === opt.value ? '#fff' : 'var(--ink-muted)',
                                border: `1px solid ${sortBy === opt.value ? 'var(--ink)' : 'var(--stone-2)'}`,
                                transition: 'all .15s',
                                cursor: 'pointer',
                              }}
                          >
                            {opt.label}
                          </button>
                      ))}
                    </div>
                )}
              </div>

              {(isLoading || isStreaming || status === 'success') && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {MARKETPLACE_CHIPS.map(chip => {
                      const arrived = isMarketplaceArrived(chip, arrivedKeys)
                      const color = CHIP_COLORS[chip.label]
                      return (
                          <div
                              key={chip.label}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 12px',
                                borderRadius: 100,
                                border: `1px solid ${arrived ? color + '44' : 'var(--stone-2)'}`,
                                background: arrived ? color + '11' : 'var(--stone)',
                                transition: 'all .4s ease',
                              }}
                          >
                            {arrived ? (
                                <span style={{ fontSize: 10, color }}>{'✓'}</span>
                            ) : (
                                <div
                                    style={{
                                      width: 7,
                                      height: 7,
                                      borderRadius: '50%',
                                      background: color,
                                      opacity: (isLoading || isStreaming) ? 1 : 0.3,
                                      animation: (isLoading || isStreaming) ? 'pulse 1.5s ease infinite' : 'none',
                                    }}
                                />
                            )}
                            <span style={{ fontSize: 12, color: arrived ? color : 'var(--ink-muted)', fontWeight: arrived ? 500 : 400 }}>
                      {chip.label}
                    </span>
                          </div>
                      )
                    })}
                  </div>
              )}
            </div>
        )}

        {showLoading && results.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '96px 0', gap: 18 }}>
              <Spinner size={40} />
              <p style={{ fontSize: 14, color: 'var(--ink-muted)', fontWeight: 300 }}>
                Ищем товары...
              </p>
            </div>
        )}

        {sortedResults.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
              {sortedResults.map((product, i) => (
                  <ProductCard key={`${product.link}-${i}`} product={product} />
              ))}
            </div>
        )}
      </div>
  )
}