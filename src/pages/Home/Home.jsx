import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MARKETPLACES = ['Ozon','Wildberries','Яндекс Маркет','СберМегаМаркет','Магнит Маркет']

const MP_COLORS = {
  'Ozon':           '#1a5fff',
  'Wildberries':    '#9c1dab',
  'Яндекс Маркет':  '#c47f00',
  'СберМегаМаркет': '#2e7d32',
  'Магнит Маркет':  '#c62828',
}

const DEMO_PRICES = [
  { mp:'Ozon',           price:'89 990 ₽' },
  { mp:'Wildberries',    price:'91 500 ₽' },
  { mp:'Яндекс Маркет',  price:'86 200 ₽', best:true },
  { mp:'СберМегаМаркет', price:'88 400 ₽' },
]

const DEMO_MINI = [
  { name:'Nike Air Max 270', mp:'Ozon',        price:'7 290 ₽', old:'9 999 ₽', pct:'-27%' },
  { name:'Dyson V15 Detect', mp:'Wildberries', price:'42 990 ₽', old:'52 000 ₽', pct:'-17%' },
]

export default function Home() {
  const [val, setVal] = useState('')
  const navigate = useNavigate()

  // Просто навигируем — Search страница сама запустит WS
  const doSearch = () => {
    if (val.trim()) navigate(`/search?q=${encodeURIComponent(val.trim())}`)
  }

  return (
    <div>

      {/* HERO */}
      <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'calc(100vh - 64px)' }}>

        {/* LEFT */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'72px 56px 72px 80px', animation:'fadeUp .6s ease both' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            fontSize:11, fontWeight:600, letterSpacing:'0.12em',
            textTransform:'uppercase', color:'var(--gold)',
            border:'1px solid var(--gold-light)', background:'var(--gold-bg)',
            padding:'6px 14px', borderRadius:100, width:'fit-content', marginBottom:32,
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', animation:'pulse 2s ease infinite', display:'inline-block' }}/>
            Живые цены · 5 маркетплейсов
          </div>

          <h1 style={{ fontSize:'clamp(44px,5vw,72px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.03em', color:'var(--ink)', marginBottom:24 }}>
            Найдите<br/>лучшую цену<br/>
            <span style={{ color:'var(--gold)' }}>на любой товар</span>
          </h1>

          <p style={{ fontSize:16, fontWeight:300, lineHeight:1.7, color:'var(--ink-muted)', maxWidth:420, marginBottom:44 }}>
            Сравниваем цены на Ozon, Wildberries, Яндекс Маркете и ещё двух площадках — в одном месте, без лишних вкладок.
          </p>

          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            <input
              value={val} onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key==='Enter' && doSearch()}
              placeholder="Например: iPhone 15 Pro, Nike Air Max..."
              style={{
                flex:1, background:'var(--stone)', border:'1px solid var(--stone-2)',
                borderRadius:'var(--radius)', padding:'13px 18px',
                fontSize:15, color:'var(--ink)', transition:'border-color .2s, box-shadow .2s',
              }}
              onFocus={e => { e.target.style.borderColor='var(--stone-3)'; e.target.style.boxShadow='0 0 0 3px rgba(184,151,90,.12)' }}
              onBlur={e => { e.target.style.borderColor='var(--stone-2)'; e.target.style.boxShadow='none' }}
            />
            <button onClick={doSearch} style={{
              background:'var(--ink)', color:'#fff',
              padding:'13px 28px', borderRadius:'var(--radius)',
              fontSize:14, fontWeight:500, transition:'background .2s, transform .1s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--ink-2)'; e.currentTarget.style.transform='translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--ink)'; e.currentTarget.style.transform='none' }}
            >Найти</button>
          </div>

          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {MARKETPLACES.map(mp => (
              <span key={mp} style={{ padding:'5px 13px', borderRadius:100, fontSize:12, background:'var(--stone)', border:'1px solid var(--stone-2)', color:'var(--ink-muted)' }}>{mp}</span>
            ))}
          </div>
          <p style={{ fontSize:11, color:'var(--ink-dim)', marginTop:8 }}>Поиск сразу по всем маркетплейсам</p>
        </div>

        {/* RIGHT */}
        <div style={{ background:'var(--stone)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 52px', gap:14, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-80, right:-80, width:280, height:280, borderRadius:'50%', border:'1px solid var(--stone-2)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-60, left:-40, width:200, height:200, borderRadius:'50%', border:'1px solid var(--stone-2)', pointerEvents:'none' }}/>

          <div style={{ background:'var(--white)', border:'1px solid var(--stone-2)', borderRadius:16, padding:'24px 24px 20px', width:'100%', maxWidth:340, boxShadow:'0 20px 50px rgba(26,24,20,.1)', animation:'float 4s ease-in-out infinite', position:'relative', zIndex:2 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, paddingBottom:14, borderBottom:'1px solid var(--stone-2)' }}>
              <span style={{ fontSize:14, fontWeight:600 }}>iPhone 15 Pro 256GB</span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--gold)', background:'var(--gold-bg)', border:'1px solid var(--gold-light)', padding:'4px 9px', borderRadius:100 }}>Сейчас</span>
            </div>
            {DEMO_PRICES.map(({ mp, price, best }) => (
              <div key={mp} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--stone)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:MP_COLORS[mp], flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:'var(--ink-muted)' }}>{mp}</span>
                </div>
                <span style={{ fontSize:15, fontWeight: best ? 700 : 400, color: best ? 'var(--green)' : 'var(--ink-2)' }}>
                  {price}{best ? ' ✓' : ''}
                </span>
              </div>
            ))}
            <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid var(--stone-2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, color:'var(--ink-muted)' }}>Вы экономите</span>
              <span style={{ fontSize:15, fontWeight:700, color:'var(--green)' }}>— 5 300 ₽</span>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%', maxWidth:340, position:'relative', zIndex:2 }}>
            {DEMO_MINI.map(({ name, mp, price, old, pct }) => (
              <div key={name} style={{ background:'var(--white)', border:'1px solid var(--stone-2)', borderRadius:12, padding:14, boxShadow:'0 4px 14px rgba(26,24,20,.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:MP_COLORS[mp], flexShrink:0 }}/>
                  <span style={{ fontSize:10, fontWeight:700, color:'#c0392b', background:'#fff0f0', padding:'2px 7px', borderRadius:100 }}>{pct}</span>
                </div>
                <p style={{ fontSize:11, color:'var(--ink-muted)', lineHeight:1.4, marginBottom:10, minHeight:32 }}>{name}</p>
                <p style={{ fontSize:15, fontWeight:700, color:'var(--ink)', lineHeight:1 }}>{price}</p>
                <p style={{ fontSize:11, color:'var(--ink-dim)', textDecoration:'line-through', marginTop:3 }}>{old}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:14, width:'100%', maxWidth:340, background:'var(--white)', border:'1px solid var(--stone-2)', borderRadius:10, padding:'12px 16px', position:'relative', zIndex:2 }}>
            <div style={{ display:'flex' }}>
              {Object.values(MP_COLORS).map((c,i) => (
                <div key={i} style={{ width:22, height:22, borderRadius:'50%', background:c, border:'2px solid var(--white)', marginLeft: i > 0 ? -6 : 0, flexShrink:0, position:'relative', zIndex:5-i }}/>
              ))}
            </div>
            <p style={{ fontSize:12, color:'var(--ink-muted)', lineHeight:1.4 }}>
              <strong style={{ color:'var(--ink)', fontWeight:600 }}>5 маркетплейсов</strong> сканируются одновременно
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:'var(--ink)', padding:'0 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {[
            { num:'5',   suf:'+', label:'Маркетплейсов в базе' },
            { num:'1,2', suf:'М', label:'Товаров ежедневно' },
            { num:'24',  suf:'%', label:'Средняя экономия' },
            { num:'0',   suf:'₽', label:'Полностью бесплатно' },
          ].map(({ num, suf, label }, i) => (
            <div key={i} style={{ padding:'44px 0', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: i === 0 ? 0 : 48, paddingRight: i === 3 ? 0 : 48 }}>
              <div style={{ fontSize:54, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1, marginBottom:10, color:'var(--white)' }}>
                {num}<span style={{ fontSize:32, color:'var(--gold)' }}>{suf}</span>
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', fontWeight:300 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section style={{ padding:'96px 80px', background:'var(--stone)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-20, right:60, fontSize:320, fontWeight:700, color:'var(--stone-2)', lineHeight:1, pointerEvents:'none', userSelect:'none', letterSpacing:'-0.06em' }}>?</div>
        <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:14 }}>Как это работает</p>
        <h2 style={{ fontSize:'clamp(32px,4vw,52px)', fontWeight:700, lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:64, maxWidth:480, color:'var(--ink)' }}>Три шага до<br/>лучшей цены</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:48, position:'relative', zIndex:1 }}>
          {[
            { n:'01', title:'Введите запрос', text:'Напишите название товара — система подключится к маркетплейсам в реальном времени.' },
            { n:'02', title:'Стриминг результатов', text:'Товары появляются по мере готовности каждого маркетплейса — не нужно ждать всех.' },
            { n:'03', title:'Выбирайте лучшее', text:'Все предложения на одной странице. Переходите прямо на страницу товара одним кликом.' },
          ].map(({ n, title, text }) => (
            <div key={n}>
              <div style={{ fontSize:64, fontWeight:700, letterSpacing:'-0.04em', color:'var(--stone-3)', lineHeight:1, marginBottom:20 }}>{n}</div>
              <div style={{ width:32, height:3, background:'var(--gold)', borderRadius:2, marginBottom:20 }}/>
              <h3 style={{ fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:12 }}>{title}</h3>
              <p style={{ fontSize:14, color:'var(--ink-muted)', fontWeight:300, lineHeight:1.7 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKETPLACES */}
      <section style={{ padding:'80px', borderTop:'1px solid var(--stone-2)', borderBottom:'1px solid var(--stone-2)' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48 }}>
          <h2 style={{ fontSize:40, fontWeight:700, letterSpacing:'-0.025em', lineHeight:1.15, color:'var(--ink)' }}>Покрытые<br/>маркетплейсы</h2>
          <span style={{ fontSize:13, color:'var(--ink-muted)', fontWeight:300 }}>Данные в реальном времени через WebSocket</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14 }}>
          {[
            { icon:'OZ', bg:'#e8f0ff', color:'#1a5fff', name:'Ozon' },
            { icon:'WB', bg:'#fce8fa', color:'#9c1dab', name:'Wildberries' },
            { icon:'ЯМ', bg:'#fff8e1', color:'#c47f00', name:'Яндекс Маркет' },
            { icon:'СМ', bg:'#e8f5e9', color:'#2e7d32', name:'СберМегаМаркет' },
            { icon:'ММ', bg:'#ffebee', color:'#c62828', name:'Магнит Маркет' },
          ].map(mp => (
            <div key={mp.name} style={{ border:'1px solid var(--stone-2)', borderRadius:'var(--radius-md)', padding:'24px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, transition:'border-color .2s, box-shadow .2s, transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--stone-3)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(26,24,20,.07)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--stone-2)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
            >
              <div style={{ width:44, height:44, borderRadius:12, background:mp.bg, color:mp.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>{mp.icon}</div>
              <span style={{ fontSize:12, color:'var(--ink-muted)', textAlign:'center', lineHeight:1.4 }}>{mp.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'112px 80px', background:'var(--ink)', display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:80 }}>
        <div>
          <h2 style={{ fontSize:'clamp(36px,5vw,64px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-0.025em', color:'var(--white)', marginBottom:16 }}>
            Перестаньте переплачивать.<br/>
            <span style={{ color:'var(--gold)' }}>Начните прямо сейчас.</span>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', fontWeight:300 }}>Бесплатно · Результаты в реальном времени</p>
        </div>
        <button onClick={doSearch} style={{ background:'var(--gold)', color:'#fff', padding:'18px 44px', borderRadius:'var(--radius)', fontSize:14, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', whiteSpace:'nowrap', transition:'opacity .2s, transform .1s', flexShrink:0 }}
          onMouseEnter={e => { e.currentTarget.style.opacity='.85'; e.currentTarget.style.transform='translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none' }}
        >Найти лучшую цену</button>
      </section>

    </div>
  )
}
