import client from './client.js'

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// Response: { accessToken, message }
// + устанавливает httpOnly cookie refreshToken
export const login = (email, password) =>
  client.post('/api/auth/login', { email, password }).then(r => r.data)


// ─── REFRESH ──────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// Cookie: refreshToken (отправляется автоматически при withCredentials: true)
// Response: { accessToken, message }
export const refreshToken = () =>
  client.post('/api/auth/refresh').then(r => r.data)


// ─── REGISTRATION (3 шага) ────────────────────────────────────────────────────

// Шаг 1: POST /api/auth/register/send-code
// Body: { email, password }
// Response: { riskToken }
export const sendRegisterCode = (email, password) =>
  client.post('/api/auth/register/send-code', { email, password }).then(r => r.data)

// Шаг 1б (если нужно переслать): POST /api/auth/register/resend-code
// Body: { email }
// Response: { riskToken }
export const resendRegisterCode = (email) =>
  client.post('/api/auth/register/resend-code', { email }).then(r => r.data)

// Шаг 2: POST /api/auth/register/verify-code
// Body: { riskToken, code }
// Response: { email, proofToken, message }
export const verifyRegisterCode = (riskToken, code) =>
  client.post('/api/auth/register/verify-code', { riskToken, code }).then(r => r.data)

// Шаг 3: POST /api/auth/register/complete
// Body: { proofToken }
// Response: { accessToken }
// + устанавливает httpOnly cookie refreshToken
export const completeRegister = (proofToken) =>
  client.post('/api/auth/register/complete', { proofToken }).then(r => r.data)


// ─── SUBSCRIPTION ─────────────────────────────────────────────────────────────
// GET /api/subscription/status  (требует Bearer token)
// Response: { requestsUsed, requestsLimit, requestsRemaining, resetAt }
export const getSubscriptionStatus = () =>
  client.get('/api/subscription/status').then(r => r.data)
