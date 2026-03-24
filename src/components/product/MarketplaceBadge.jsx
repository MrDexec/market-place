// Все варианты названий которые может прислать сервер
const MP_MAP = {
  'ozon':            { bg: '#e8f0ff', color: '#1a5fff', label: 'Ozon' },
  'wildberries':     { bg: '#fce8fa', color: '#9c1dab', label: 'WB' },
  'яндекс маркет':   { bg: '#fff8e1', color: '#c47f00', label: 'Яндекс' },
  'yandexmarket':    { bg: '#fff8e1', color: '#c47f00', label: 'Яндекс' },
  'yandex market':   { bg: '#fff8e1', color: '#c47f00', label: 'Яндекс' },
  'яндекс':          { bg: '#fff8e1', color: '#c47f00', label: 'Яндекс' },
  'сбермегамаркет':  { bg: '#e8f5e9', color: '#2e7d32', label: 'СберМег' },
  'megamarket':      { bg: '#e8f5e9', color: '#2e7d32', label: 'СберМег' },
  'сбер мегамаркет': { bg: '#e8f5e9', color: '#2e7d32', label: 'СберМег' },
  'магнит маркет':   { bg: '#ffebee', color: '#c62828', label: 'Магнит' },
  'magnit':          { bg: '#ffebee', color: '#c62828', label: 'Магнит' },
  'магнит':          { bg: '#ffebee', color: '#c62828', label: 'Магнит' },
}

export default function MarketplaceBadge({ name }) {
  const key = name?.toLowerCase().trim()
  const mp = MP_MAP[key] || { bg: 'var(--stone)', color: 'var(--ink-muted)', label: name }
  return (
    <span style={{
      background: mp.bg, color: mp.color,
      padding: '3px 9px', borderRadius: 100,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>{mp.label}</span>
  )
}
