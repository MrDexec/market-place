import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      {isHome && (
        <footer style={{
          borderTop: '1px solid var(--stone-2)',
          padding: '28px 80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink)' }}>
            ПРАЙС<span style={{ color: 'var(--gold)' }}>ХАНТ</span>
          </span>
          <span style={{ fontSize: '12px', color: 'var(--ink-dim)', fontWeight: 300 }}>
            © 2025 · Все маркетплейсы России в одном месте
          </span>
        </footer>
      )}
    </div>
  )
}
