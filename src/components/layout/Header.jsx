import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { useSearch } from '../../hooks/useSearch.js'

export default function Header() {
  const { isLoggedIn, logout } = useAuth()
  const { query, setQuery, search } = useSearch()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [val, setVal] = useState(query)
  const [focused, setFocused] = useState(false)

  const submit = () => { setQuery(val); search(val) }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--stone-2)',
      padding: '0 48px', height: 64,
      display: 'flex', alignItems: 'center', gap: 24,
    }}>
      {/* Logo */}
      <Link to="/" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.07em', color: 'var(--ink)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        ПРАЙС<span style={{ color: 'var(--gold)' }}>ХАНТ</span>
      </Link>

      {/* Search in header (not on home) */}
      {!isHome && (
        <div style={{ flex: 1, maxWidth: 500, position: 'relative' }}>
          <input
            value={val}
            onChange={e => { setVal(e.target.value); setQuery(e.target.value) }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Поиск товаров..."
            style={{
              width: '100%',
              background: 'var(--stone)',
              border: `1px solid ${focused ? 'var(--stone-3)' : 'var(--stone-2)'}`,
              borderRadius: 'var(--radius)',
              padding: '8px 40px 8px 14px',
              fontSize: 14, color: 'var(--ink)',
              transition: 'border-color .2s',
            }}
          />
          <button
            onClick={submit}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', padding: 4, color: 'var(--ink-muted)', fontSize: 14,
            }}
          >→</button>
        </div>
      )}

      {/* Right */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        {isLoggedIn ? (
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: '1px solid var(--stone-2)',
              color: 'var(--ink-muted)',
              padding: '7px 18px', borderRadius: 'var(--radius)',
              fontSize: 13, fontWeight: 400,
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--stone-3)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--stone-2)'; e.currentTarget.style.color = 'var(--ink-muted)' }}
          >Выйти</button>
        ) : (
          <>
            <Link to="/login" style={{
              color: 'var(--ink-muted)', fontSize: 13, fontWeight: 400,
              padding: '7px 16px', transition: 'color .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
            >Войти</Link>
            <Link to="/register" style={{
              background: 'var(--ink)', color: 'var(--white)',
              padding: '8px 20px', borderRadius: 'var(--radius)',
              fontSize: 13, fontWeight: 500,
              letterSpacing: '0.02em',
              transition: 'background .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ink-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
            >Регистрация</Link>
          </>
        )}
      </div>
    </header>
  )
}
