export default function Spinner({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '2px solid var(--stone-2)',
      borderTopColor: 'var(--gold)',
      borderRadius: '50%',
      animation: 'spin .7s linear infinite',
    }} />
  )
}
