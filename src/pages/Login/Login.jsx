import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../../api/auth.api.js'
import { useAuthStore } from '../../store/auth.store.js'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPass,  setFocusPass]  = useState(false)

  const loginStore = useAuthStore(s => s.login)
  const navigate   = useNavigate()

  const handleSubmit = async () => {
    if (!email || !password) return setError('Заполните все поля')
    setLoading(true); setError('')
    try {
      // POST /api/auth/login → { accessToken, message }
      const data = await loginApi(email, password)
      loginStore(data.accessToken)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = focused => ({
    width: '100%', background: 'var(--stone)',
    border: `1px solid ${focused ? 'var(--stone-3)' : 'var(--stone-2)'}`,
    borderRadius: 'var(--radius)', padding: '12px 14px',
    fontSize: 14, color: 'var(--ink)', transition: 'border-color .2s',
  })

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 64px)', padding: 24, background: 'var(--stone)',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--white)', border: '1px solid var(--stone-2)',
        borderRadius: 'var(--radius-lg)', padding: '40px 36px',
        boxShadow: '0 8px 40px rgba(26,24,20,.06)',
        animation: 'fadeUp .4s ease both',
      }}>
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink)' }}>
            ПРАЙС<span style={{ color: 'var(--gold)' }}>ХАНТ</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginTop: 20, marginBottom: 6 }}>Вход</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', fontWeight: 300 }}>Войдите в свой аккаунт</p>
        </div>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fdd', borderRadius: 'var(--radius)', padding: '11px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--red)' }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
              style={inputStyle(focusEmail)}
              onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Пароль</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle(focusPass)}
              onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', background: 'var(--ink)', color: '#fff',
          padding: 13, borderRadius: 'var(--radius)',
          fontSize: 14, fontWeight: 600,
          opacity: loading ? .65 : 1, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background .2s', marginBottom: 20,
        }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--ink-2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
        >{loading ? 'Входим...' : 'Войти'}</button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-muted)' }}>
          Нет аккаунта?{' '}
          <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 500 }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
