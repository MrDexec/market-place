import client from './client.js'

export const searchProducts  = (query, marketplaces = []) =>
  client.post('/products/search', { query, marketplaces }).then(r => r.data)

export const getProductDetail = (id) =>
  client.get(`/products/${id}`).then(r => r.data)
