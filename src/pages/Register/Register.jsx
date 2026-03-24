import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  sendRegisterCode,
  resendRegisterCode,
  verifyRegisterCode,
  completeRegister,
} from '../../api/auth.api.js'
import { useAuthStore } from '../../store/auth.store.js'

// ─── РЕГИСТРАЦИЯ — 3 шага ─────────────────────────────────────────────────────
// Шаг 1: email + password → POST /send-code → riskToken
// Шаг 2: код из письма   → POST /verify-code → proofToken
// Шаг 3: автоматически   → POST /complete → accessToken

const STEPS = {
  CREDENTIALS: 'credentials', // email + password
  CODE:        'code',        // код из email
}

export default function Register() {
  const [step,      setStep]      = useState(STEPS.CREDENTIALS)
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [code,      setCode]      = useState('')
  const [riskToken, setRiskToken] = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [resendCd,  setResendCd]  = useState(0)   // кулдаун переотправки (сек)

  const loginStore = useAuthStore(s => s.login)
  const navigate   = useNavigate()

  // ── ШАГИ ──────────────────────────────────────────────────────────────────

  // Шаг 1 → отправить код
  const handleSendCode = async () => {
    if (!email) return setError('Введите email')
    if (!password || password.length < 8) return setError('Пароль минимум 8 символов')
    if (password.length > 20)             return setError('Пароль максимум 20 символов')
    setLoading(true); setError('')
    try {
      const data = await sendRegisterCode(email, password) // { riskToken }
      setRiskToken(data.riskToken)
      setStep(STEPS.CODE)
      startResendCooldown()
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.error || e.message || 'Ошибка отправки кода')
    } finally {
      setLoading(false)
    }
  }

  // Шаг 2 → проверить код + сразу завершить регистрацию
  const handleVerifyAndComplete = async () => {
    if (!code) return setError('Введите код из письма')
    setLoading(true); setError('')
    try {
      // verify-code → { proofToken }
      const verified = await verifyRegisterCode(riskToken, code)
      // complete → { accessToken }
      const completed = await completeRegister(verified.proofToken)
      loginStore(completed.accessToken)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.error || e.message || 'Неверный код')
    } finally {
      setLoading(false)
    }
  }

  // Переотправить код
  const handleResend = async () => {
    if (resendCd > 0) return
    setLoading(true); setError('')
    try {
      const data = await resendRegisterCode(email) // { riskToken }
      setRiskToken(data.riskToken)
      setCode('')
      startResendCooldown()
    } catch (e) {
      setError(e.response?.data?.message || e.response?.data?.error || e.message || 'Ошибка переотправки')
    } finally {
      setLoading(false)
    }
  }

  const startResendCooldown = () => {
    setResendCd(60)
    const t = setInterval(() => {
      setResendCd(prev => {
        if (prev <= 1) { clearInterval(t); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // ── СТИЛИ ─────────────────────────────────────────────────────────────────

  const [focusEmail,   setFocusEmail]   = useState(false)
  const [focusPass,    setFocusPass]    = useState(false)
  const [focusCode,    setFocusCode]    = useState(false)

  const inputStyle = focused => ({
    width: '100%', background: 'var(--stone)',
    border: `1px solid ${focused ? 'var(--stone-3)' : 'var(--stone-2)'}`,
    borderRadius: 'var(--radius)', padding: '12px 14px',
    fontSize: 14, color: 'var(--ink)', transition: 'border-color .2s',
  })

  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    display: 'block', marginBottom: 6,
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

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
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink)' }}>
            ПРАЙС<span style={{ color: 'var(--gold)' }}>ХАНТ</span>
          </Link>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 14 }}>
            {[STEPS.CREDENTIALS, STEPS.CODE].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: step === s ? 'var(--ink)' : (i < [STEPS.CREDENTIALS, STEPS.CODE].indexOf(step) ? 'var(--gold)' : 'var(--stone-2)'),
                  color: step === s || i < [STEPS.CREDENTIALS, STEPS.CODE].indexOf(step) ? '#fff' : 'var(--ink-dim)',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .3s',
                }}>{i + 1}</div>
                {i < 1 && <div style={{ width: 24, height: 1, background: step === STEPS.CODE ? 'var(--gold)' : 'var(--stone-2)', transition: 'background .3s' }}/>}
              </div>
            ))}
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 6 }}>
            {step === STEPS.CREDENTIALS ? 'Регистрация' : 'Подтверждение'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', fontWeight: 300 }}>
            {step === STEPS.CREDENTIALS
              ? 'Создайте бесплатный аккаунт'
              : `Введите код, отправленный на ${email}`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fdd', borderRadius: 'var(--radius)', padding: '11px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--red)' }}>{error}</p>
          </div>
        )}

        {/* ── STEP 1: credentials ── */}
        {step === STEPS.CREDENTIALS && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
                  style={inputStyle(focusEmail)}
                  onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)} />
              </div>
              <div>
                <label style={labelStyle}>Пароль</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="8–20 символов"
                  onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                  style={inputStyle(focusPass)}
                  onFocus={() => setFocusPass(true)} onBlur={() => setFocusPass(false)} />
                <p style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 5 }}>От 8 до 20 символов</p>
              </div>
            </div>

            <button onClick={handleSendCode} disabled={loading} style={{
              width: '100%', background: 'var(--ink)', color: '#fff',
              padding: 13, borderRadius: 'var(--radius)',
              fontSize: 14, fontWeight: 600,
              opacity: loading ? .65 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background .2s', marginBottom: 20,
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--ink-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
            >{loading ? 'Отправляем код...' : 'Получить код'}</button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-muted)' }}>
              Уже есть аккаунт?{' '}
              <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 500 }}>Войти</Link>
            </p>
          </>
        )}

        {/* ── STEP 2: email code ── */}
        {step === STEPS.CODE && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Код из письма</label>
              <input
                value={code} onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerifyAndComplete()}
                placeholder="Например: 123456" maxLength={10}
                autoFocus
                style={{
                  ...inputStyle(focusCode),
                  fontSize: 22, fontWeight: 700, letterSpacing: '0.15em',
                  textAlign: 'center',
                }}
                onFocus={() => setFocusCode(true)} onBlur={() => setFocusCode(false)}
              />
            </div>

            <button onClick={handleVerifyAndComplete} disabled={loading} style={{
              width: '100%', background: 'var(--ink)', color: '#fff',
              padding: 13, borderRadius: 'var(--radius)',
              fontSize: 14, fontWeight: 600,
              opacity: loading ? .65 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background .2s', marginBottom: 16,
            }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--ink-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
            >{loading ? 'Проверяем...' : 'Подтвердить'}</button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => { setStep(STEPS.CREDENTIALS); setError('') }} style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 13, color: 'var(--ink-muted)', cursor: 'pointer',
              }}>← Назад</button>

              <button onClick={handleResend} disabled={resendCd > 0 || loading} style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 13, cursor: resendCd > 0 ? 'default' : 'pointer',
                color: resendCd > 0 ? 'var(--ink-dim)' : 'var(--gold)',
                fontWeight: 500,
              }}>
                {resendCd > 0 ? `Отправить снова (${resendCd}с)` : 'Отправить снова'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
