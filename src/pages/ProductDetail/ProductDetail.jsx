import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getDetailedViaWS, WS_ERROR_MESSAGES } from '../../api/search.ws.js'
import MarketplaceBadge from '../../components/product/MarketplaceBadge.jsx'
import { formatPrice } from '../../utils/formatPrice.js'
import Spinner from '../../components/ui/Spinner.jsx'

export default function ProductDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const location   = useLocation()

  // Превью из карточки — показываем сразу пока грузится детальное
  const preview = location.state?.product || null

  const [product, setProduct] = useState(preview)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // id в URL = encodeURIComponent(product.name)
  const productName = decodeURIComponent(id)

  useEffect(() => {
    // Запрос детальной инфы по НАЗВАНИЮ товара (согласно документации)
    const close = getDetailedViaWS(productName, {
      onResult: (p) => { setProduct(p); setLoading(false) },
      onFinish: ()  => setLoading(false),
      onError:  (code, meta) => {
        setError(meta || WS_ERROR_MESSAGES[code] || code)
        setLoading(false)
      },
    })
    return () => close()
  }, [productName])

  const discount = product?.oldPrice && product?.price && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 48px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: 'var(--ink-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, transition: 'color .2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
      >← Назад к результатам</button>

      {error && !product && (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--red)' }}>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {!product && loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '96px 0' }}>
          <Spinner size={40} />
        </div>
      )}

      {product && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 40 }}>
            {/* Фото */}
            <div style={{ background: 'var(--stone)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--stone-2)', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, position: 'relative' }}>
              {product.imgUrl
                ? <img src={product.imgUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }} />
                : <div style={{ width: 80, height: 80, borderRadius: 16, background: 'var(--stone-2)' }} />
              }
              {loading && <div style={{ position: 'absolute', bottom: 12, right: 12 }}><Spinner size={20} /></div>}
            </div>

            {/* Инфо */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <MarketplaceBadge name={product.marketplace} />

              <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                {product.name}
              </h1>

              {product.brand && (
                <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                  Бренд: <strong style={{ color: 'var(--ink)' }}>{product.brand}</strong>
                </p>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                    {formatPrice(product.price)}
                  </span>
                  {discount && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', background: '#fff0f0', padding: '4px 10px', borderRadius: 100 }}>
                      -{discount}%
                    </span>
                  )}
                </div>
                {product.oldPrice && product.oldPrice > product.price && (
                  <p style={{ fontSize: 14, color: 'var(--ink-dim)', textDecoration: 'line-through', marginTop: 4 }}>
                    {formatPrice(product.oldPrice)}
                  </p>
                )}
              </div>

              {product.deliveryDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f0faf5', borderRadius: 'var(--radius)', border: '1px solid #c3e6d4' }}>
                  <span>🚚</span>
                  <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>Доставка: {product.deliveryDate}</span>
                </div>
              )}

              {product.scoresInfo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#fffbf0', borderRadius: 'var(--radius)', border: '1px solid #ffe4a0' }}>
                    <span style={{ color: '#f59e0b' }}>★</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#92610a' }}>{product.scoresInfo.rating}</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                    {product.scoresInfo.reviewCount?.toLocaleString('ru-RU')} отзывов
                  </span>
                </div>
              )}

              {product.link && (
                <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--ink)', color: '#fff', padding: '14px 28px', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, width: 'fit-content', marginTop: 8, transition: 'background .2s, transform .1s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink-2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.transform = 'none' }}
                >Перейти к товару →</a>
              )}
            </div>
          </div>

          {/* Характеристики */}
          {product.features && product.features.length > 0 && (
            <div style={{ background: 'var(--stone)', border: '1px solid var(--stone-2)', borderRadius: 'var(--radius-lg)', padding: '28px 32px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>Характеристики</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 32px' }}>
                {product.features.map(({ name, value }) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid var(--stone-2)', gap: 16 }}>
                    <span style={{ fontSize: 13, color: 'var(--ink-muted)', flexShrink: 0 }}>{name}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
