import { create } from 'zustand'
import { getToken, setToken, removeToken } from '../utils/storage.js'

// Убираем лишние точки в конце токена (баг на бэкенде)
const cleanToken = (token) => token?.replace(/\.+$/, '') ?? null

export const useAuthStore = create((set) => ({
  token: cleanToken(getToken()),

  login: (accessToken) => {
    const token = cleanToken(accessToken)
    setToken(token)
    set({ token })
  },

  logout: () => {
    removeToken()
    set({ token: null })
  },
}))
