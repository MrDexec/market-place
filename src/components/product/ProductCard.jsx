import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketplaceBadge from './MarketplaceBadge.jsx'
import { formatPrice } from '../../utils/formatPrice.js'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const discount = product.oldPrice && product.price && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  const notAvailable = product.isAvailable === false

  const handleClick = () => {
    // Передаём весь объект через state — на детальной странице
    // используем product.name как query для WS detailed запроса
    navigate(`/product/${encodeURIComponent(product.name)}`, {
      state: { product },
    })
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)',
        border: `1px solid ${hovered ? 'var(--stone-3)' : 'var(--stone-2)'}`,
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        transition: 'border-color .2s, box-shadow .2s, transform .2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 32px rgba(26,24,20,.07)' : '0 2px 8px rgba(26,24,20,.03)',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', height: '100%',
        opacity: notAvailable ? 0.6 : 1,
      }}
    >
      <div style={{ height: 192, background: 'var(--stone)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', flexShrink: 0 }}>
        {product.imgUrl
          ? <img src={product.imgUrl} alt={product.name} style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }} />
          : <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--stone-2)' }} />
        }
        {discount && (
          <span style={{ position: 'absolute', top: 10, right: 10, background: '#fff0f0', color: 'var(--red)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100 }}>
            -{discount}%
          </span>
        )}
        {notAvailable && (
          <span style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(26,24,20,.6)', color: '#fff', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>
            Нет в наличии
          </span>
        )}
      </div>

      <div style={{ padding: '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MarketplaceBadge name={product.marketplace} />
        <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </p>
        {product.brand && <p style={{ fontSize: 11, color: 'var(--ink-dim)' }}>{product.brand}</p>}
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{formatPrice(product.price)}</p>
          {product.oldPrice && product.oldPrice > product.price && (
            <p style={{ fontSize: 12, color: 'var(--ink-dim)', textDecoration: 'line-through', marginTop: 3 }}>{formatPrice(product.oldPrice)}</p>
          )}
        </div>
        {product.deliveryDate && (
          <p style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>🚚 {product.deliveryDate}</p>
        )}
      </div>
    </div>
  )
}
