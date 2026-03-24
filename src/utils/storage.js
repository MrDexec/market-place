const KEY = 'mp_access_token'

// Нормализуем токен — берём только первые 3 части (header.payload.signature)
// Фикс бага бэкенда который добавляет лишние символы после подписи
function normalizeToken(token) {
  if (!token) return null
  const parts = token.split('.')
  // Если частей больше 3 — склеиваем 3-ю и последующие обратно
  // (на случай если подпись содержит точку)
  if (parts.length > 3) {
    return parts[0] + '.' + parts[1] + '.' + parts.slice(2).join('')
  }
  return token.replace(/\.+$/, '') // убираем trailing dot
}

export const getToken    = ()      => normalizeToken(localStorage.getItem(KEY))
export const setToken    = (token) => localStorage.setItem(KEY, normalizeToken(token))
export const removeToken = ()      => localStorage.removeItem(KEY)
