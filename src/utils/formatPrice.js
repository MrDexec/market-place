export const formatPrice = (price) => {
  if (price == null) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
  }).format(price)
}
