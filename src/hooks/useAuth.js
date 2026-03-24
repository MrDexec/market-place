import { useAuthStore } from '../store/auth.store.js'

export function useAuth() {
  const { token, login, logout } = useAuthStore()
  return { token, isLoggedIn: !!token, login, logout }
}
