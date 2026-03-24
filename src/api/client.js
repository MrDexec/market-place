import axios from 'axios'
import { getToken, setToken, removeToken } from '../utils/storage.js'

// Берём из .env, или захардкоженный IP как запасной вариант
const BASE = import.meta.env.VITE_API_URL ?? 'https://api.pricehunt.website'

const client = axios.create({
  baseURL: BASE,
  timeout: 30000,
  withCredentials: true,
})

client.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let refreshQueue = []

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token))
  refreshQueue = []
}

client.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }
      original._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post(
          BASE + '/api/auth/refresh',
          {},
          { withCredentials: true }
        )
        const newToken = data.accessToken
        setToken(newToken)
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        removeToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  }
)

export default client
