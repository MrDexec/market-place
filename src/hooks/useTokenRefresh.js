import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/auth.store.js'
import { refreshToken } from '../api/auth.api.js'
import { getToken } from '../utils/storage.js'

// Проверяем через сколько мс истекает токен
function msUntilExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 - Date.now()
  } catch {
    return 0
  }
}

// Хук запускает таймер и обновляет токен за 2 минуты до истечения
export function useTokenRefresh() {
  const { token, login, logout } = useAuthStore()
  const timerRef = useRef(null)

  useEffect(() => {
    if (!token) return

    const scheduleRefresh = (currentToken) => {
      clearTimeout(timerRef.current)
      const ms = msUntilExpiry(currentToken)
      // Обновляем за 2 минуты до истечения (но не раньше чем через 5 сек)
      const delay = Math.max(ms - 2 * 60 * 1000, 5000)

      if (ms <= 0) {
        // Уже истёк — пробуем обновить немедленно
        doRefresh()
        return
      }

      timerRef.current = setTimeout(doRefresh, delay)
    }

    const doRefresh = async () => {
      try {
        const data = await refreshToken()
        if (data?.accessToken) {
          login(data.accessToken)
          scheduleRefresh(data.accessToken) // планируем следующий рефреш
        }
      } catch {
        // Refresh провалился — разлогиниваем
        logout()
        window.location.href = '/login'
      }
    }

    scheduleRefresh(token)

    return () => clearTimeout(timerRef.current)
  }, [token])
}
