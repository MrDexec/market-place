import { getToken } from '../utils/storage.js'

const WS_BASE = import.meta.env.VITE_WS_URL ?? 'wss://api.pricehunt.website'

// Проверяем не истёк ли токен
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

/**
 * Preview поиск — стримит товары чанками по маркетплейсам
 * @param {string} query - текст запроса
 * @param {{ onChunk, onFinish, onError }} callbacks
 * @returns {function} close — закрыть соединение
 */
export function searchViaWS(query, { onChunk, onFinish, onError }) {
  const token = getToken()

  if (!token || isTokenExpired(token)) {
    onError?.('UNAUTHORIZED', null)
    return () => {}
  }

  const url = `${WS_BASE}/ws/search?token=${encodeURIComponent(token)}`
  const ws = new WebSocket(url)

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'preview', query, params: { } }))
  }

  ws.onmessage = (event) => {
    let msg
    try { msg = JSON.parse(event.data) } catch { return }

    switch (msg.type) {
      case 'preview_chunk':
        if (Array.isArray(msg.data) && msg.data.length > 0) onChunk?.(msg.data)
        break
      case 'finish':
        onFinish?.()
        ws.close()
        break
      case 'error':
        onError?.(msg.code, msg.meta)
        ws.close()
        break
    }
  }

  ws.onerror = () => onError?.('CONNECTION_ERROR', 'Не удалось подключиться к серверу')

  ws.onclose = (e) => {
    if (e.code !== 1000 && e.code !== 1005) {
      // 1011 = сервер упал, скорее всего токен протух
      const msg = e.code === 1011
        ? 'Ошибка сервера — попробуйте войти заново'
        : `Соединение прервано (${e.code})`
      onError?.('CONNECTION_CLOSED', msg)
    }
  }

  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close()
  }
}

/**
 * Detailed запрос — передаём НАЗВАНИЕ товара (не ссылку!)
 * Согласно API: query = полное название товара на маркетплейсе
 * @param {string} productName - название товара
 * @param {{ onResult, onFinish, onError }} callbacks
 * @returns {function} close
 */
export function getDetailedViaWS(productName, { onResult, onFinish, onError }) {
  const token = getToken()

  if (!token || isTokenExpired(token)) {
    onError?.('UNAUTHORIZED', null)
    return () => {}
  }

  const url = `${WS_BASE}/ws/search?token=${encodeURIComponent(token)}`
  const ws = new WebSocket(url)

  ws.onopen = () => {
    // query = название товара, как в примере документации
    ws.send(JSON.stringify({ type: 'detailed', query: productName }))
  }

  ws.onmessage = (event) => {
    let msg
    try { msg = JSON.parse(event.data) } catch { return }

    switch (msg.type) {
      case 'detailed_result':
        onResult?.(msg.data.product)
        break
      case 'finish':
        onFinish?.()
        ws.close()
        break
      case 'error':
        onError?.(msg.code, msg.meta)
        ws.close()
        break
    }
  }

  ws.onerror = () => onError?.('CONNECTION_ERROR', 'Не удалось подключиться к серверу')

  ws.onclose = (e) => {
    if (e.code !== 1000 && e.code !== 1005) {
      const msg = e.code === 1011
        ? 'Ошибка сервера — попробуйте войти заново'
        : `Соединение прервано (${e.code})`
      onError?.('CONNECTION_CLOSED', msg)
    }
  }

  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close()
  }
}

export const WS_ERROR_MESSAGES = {
  LIMIT_EXCEEDED:   'Достигнут месячный лимит запросов',
  PARSER_ERROR:     'Ошибка парсера маркетплейса',
  UNAUTHORIZED:     'Сессия истекла — войдите заново',
  INVALID_MESSAGE:  'Неверный формат запроса',
  CONNECTION_ERROR: 'Не удалось подключиться к серверу',
  CONNECTION_CLOSED:'Соединение с сервером прервано',
}
