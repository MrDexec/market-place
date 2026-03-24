export default function Button({ children, onClick, variant = 'primary', disabled, style: ext = {} }) {
  const v = {
    primary: { background: 'var(--ink)', color: '#fff', border: 'none' },
    outline: { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--stone-2)' },
    gold:    { background: 'var(--gold)', color: '#fff', border: 'none' },
  }
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: '10px 24px', borderRadius: 'var(--radius)',
        fontSize: 14, fontWeight: 500,
        transition: 'opacity .15s',
        opacity: disabled ? .5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...v[variant], ...ext,
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = '.82')}
      onMouseLeave={e => (e.currentTarget.style.opacity = disabled ? '.5' : '1')}
    >{children}</button>
  )
}
