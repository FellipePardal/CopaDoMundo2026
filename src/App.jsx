import React, { useState, useEffect } from 'react'
import { useStore } from './data/store.js'
import { fmt, fmtM, fmtPct, CAT_COLORS } from './data/utils.js'
import KpiCard from './components/KpiCard.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import ItemsTable from './components/ItemsTable.jsx'
import { OrcadoVsRealizadoChart, CategoriaChart, ImpostoChart } from './components/Charts.jsx'

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 24px',
    boxShadow: 'var(--shadow-sm)',
    ...style,
  }}>
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.1em', color: 'var(--muted)',
    marginBottom: 18,
  }}>{children}</div>
)

const Legend = ({ items }) => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
    {items.map(([label, color]) => (
      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: 'var(--muted)' }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
        {label}
      </span>
    ))}
  </div>
)

const CircleAsset = ({ size = 120, color = '#65B32E', opacity = 0.06, style = {} }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `2px solid ${color}`,
    opacity, position: 'absolute', pointerEvents: 'none',
    ...style,
  }} />
)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function App() {
  const { items, updateItem, addItem, removeItem, totals, grand, byCategory, byStatus } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [theme, setTheme] = useState('light')
  const [mobileMenu, setMobileMenu] = useState(false)
  const isMobile = useIsMobile()

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'detail',   label: 'Itens' },
    { id: 'impostos', label: 'Impostos' },
  ]

  const isDark = theme === 'dark'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {!isMobile && (
        <>
          <CircleAsset size={400} color="#65B32E" opacity={isDark ? 0.04 : 0.05} style={{ top: -120, right: -120 }} />
          <CircleAsset size={200} color="#65B32E" opacity={isDark ? 0.06 : 0.07} style={{ top: -30, right: -30 }} />
          <CircleAsset size={600} color="#65B32E" opacity={isDark ? 0.025 : 0.03} style={{ bottom: -200, left: -200 }} />
        </>
      )}

      {/* TOPBAR */}
      <div style={{
        background: isDark ? 'rgba(0,0,0,0.30)' : 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        boxShadow: isDark ? 'none' : 'var(--shadow-sm)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 16px' : '0 32px',
          height: isMobile ? 54 : 60,
          maxWidth: 1600, margin: '0 auto',
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              fontFamily: "'Poppins', sans-serif", fontWeight: 800,
              fontSize: isMobile ? 16 : 18,
              letterSpacing: '-0.01em',
            }}>
              <span style={{ color: '#65B32E' }}>LIVE</span>
              <span style={{ color: isDark ? '#fff' : '#0F172A' }}>M</span>
              <span style={{
                display: 'inline-block',
                width: isMobile ? 12 : 14,
                height: isMobile ? 12 : 14,
                borderRadius: '50%',
                background: '#65B32E', margin: '0 1px', verticalAlign: 'middle',
                position: 'relative', top: -1,
              }} />
              <span style={{ color: isDark ? '#fff' : '#0F172A' }}>DE</span>
            </div>
            {!isMobile && (
              <>
                <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
                  Copa do Mundo 2026 · Controle Interno
                </div>
              </>
            )}
          </div>

          {/* Tabs — desktop */}
          {!isMobile && (
            <div style={{
              display: 'flex', gap: 2,
              background: 'var(--surface2)',
              padding: 3, borderRadius: 12,
              border: '1px solid var(--border)',
            }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  padding: '6px 20px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                  border: 'none',
                  background: activeTab === t.id ? 'rgba(101,179,46,0.18)' : 'transparent',
                  color: activeTab === t.id ? '#65B32E' : 'var(--muted)',
                  outline: activeTab === t.id ? '1px solid rgba(101,179,46,0.35)' : 'none',
                }}>{t.label}</button>
              ))}
            </div>
          )}

          {/* Direita */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isMobile && (
              <div style={{
                fontSize: 11, fontWeight: 500, color: 'var(--muted)',
                fontFamily: 'var(--mono)',
                background: 'var(--surface2)', padding: '5px 12px',
                borderRadius: 6, border: '1px solid var(--border)',
              }}>
                USD 1 = R$ 5,60
              </div>
            )}
            <button onClick={toggleTheme} style={{
              padding: isMobile ? '5px 10px' : '5px 14px',
              borderRadius: 6, fontSize: 12, fontWeight: 600,
              border: '1px solid var(--border)',
              background: 'var(--surface2)',
              color: 'var(--muted)',
            }}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Tabs — mobile (abaixo do header) */}
        {isMobile && (
          <div style={{
            display: 'flex',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flex: 1, padding: '10px 4px', fontSize: 12, fontWeight: 500,
                border: 'none', borderBottom: activeTab === t.id ? `2px solid #65B32E` : '2px solid transparent',
                background: 'transparent',
                color: activeTab === t.id ? '#65B32E' : 'var(--muted)',
              }}>{t.label}</button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{
        padding: isMobile ? '16px' : '28px 32px',
        maxWidth: 1600, margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>

        {/* VISÃO GERAL */}
        {activeTab === 'overview' && (
          <>
            {/* KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, minmax(0,1fr))',
              gap: isMobile ? 10 : 14,
              marginBottom: isMobile ? 14 : 22,
            }}>
              <KpiCard label="Orçado Total"     value={fmtM(grand.orcado)}
                sub={`${items.length} itens`} accent="#585455" />
              <KpiCard label="João Crispim"     value={fmtM(totals['João Crispim']?.orcado)}
                sub={`Real: ${fmtM(totals['João Crispim']?.realizado)}`} accent="#65B32E" />
              <KpiCard label="Ivan Souza"       value={fmtM(totals['Ivan Souza']?.orcado)}
                sub={`Real: ${fmtM(totals['Ivan Souza']?.realizado)}`} accent="#4A9EDB" />
              <KpiCard label="Total Realizado"  value={fmtM(grand.realizado)}
                sub={`${fmtPct(grand.pctExec)} exec.`} accent="#65B32E" />
              <KpiCard label="Saldo"            value={fmtM(grand.saldo)}
                sub={`${fmtPct(100 - grand.pctExec)} restante`}
                accent={grand.saldo < 0 ? '#E05252' : '#F5A623'} />
            </div>

            {/* Progresso */}
            <Card style={{ marginBottom: isMobile ? 14 : 20, padding: isMobile ? '16px' : '22px 24px' }}>
              <CardTitle>Progresso de Execução</CardTitle>
              {Object.entries(totals).map(([resp, t]) => (
                <ProgressBar key={resp} label={resp === 'João Crispim' ? 'Operações' : 'Engenharia'}
                  pct={t.pctExec} realizado={t.realizado} orcado={t.orcado}
                  color={resp === 'João Crispim' ? '#65B32E' : '#4A9EDB'}
                  initials={resp === 'João Crispim' ? 'OP' : 'ENG'}
                />
              ))}
            </Card>

            {/* Gráficos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 12 : 16,
              marginBottom: isMobile ? 14 : 20,
            }}>
              <Card style={{ padding: isMobile ? '16px' : '22px 24px' }}>
                <CardTitle>Orçado vs Realizado</CardTitle>
                <Legend items={[['Orçado','#65B32E'],['Realizado','#4A9EDB'],['Saldo','#CBD5E1']]} />
                <OrcadoVsRealizadoChart totals={totals} />
              </Card>
              <Card style={{ padding: isMobile ? '16px' : '22px 24px' }}>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {Object.keys(byCategory).sort((a,b) => byCategory[b].orcado - byCategory[a].orcado)
                    .slice(0,7).map((cat, i) => (
                    <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 10, color: 'var(--muted)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: 2,
                        background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      {cat.length > 22 ? cat.slice(0,20)+'…' : cat}
                    </span>
                  ))}
                </div>
                <CategoriaChart byCategory={byCategory} />
              </Card>
            </div>

            {/* Resumo por categoria */}
            <Card style={{ padding: isMobile ? '16px' : '22px 24px' }}>
              <CardTitle>Resumo por Categoria</CardTitle>
              {isMobile ? (
                /* Mobile: cards por categoria */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(byCategory).sort((a,b)=>b[1].orcado-a[1].orcado).map(([cat, v], idx) => {
                    const saldo = v.orcado - v.realizado
                    return (
                      <div key={cat} style={{
                        padding: '12px 14px', borderRadius: 'var(--radius-md)',
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        borderLeft: `3px solid ${CAT_COLORS[idx%CAT_COLORS.length]}`,
                      }}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--text)' }}>
                          {cat}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                          {[
                            { label: 'Orçado',      val: v.orcado,           color: 'var(--text)'  },
                            { label: 'Imposto',     val: v.imposto,          color: '#F5A623'      },
                            { label: 'Sem Imposto', val: v.orcado-v.imposto, color: 'var(--muted)' },
                            { label: 'Saldo',       val: saldo, color: saldo < 0 ? '#E05252' : 'var(--text2)' },
                          ].map((c, i) => (
                            <div key={i}>
                              <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                                letterSpacing: '0.06em', marginBottom: 2 }}>{c.label}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)',
                                color: c.color }}>{c.val > 0 || c.val < 0 ? fmt(c.val) : '—'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {/* Total */}
                  <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    background: 'var(--surface3)', border: '2px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Total Geral</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {[
                        { label: 'Orçado',      val: grand.orcado,   color: 'var(--text)' },
                        { label: 'Imposto',     val: grand.imposto,  color: '#F5A623'     },
                        { label: 'Sem Imposto', val: grand.semImp,   color: 'var(--muted)'},
                        { label: 'Realizado',   val: grand.realizado,color: '#65B32E'     },
                      ].map((c, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                            letterSpacing: '0.06em', marginBottom: 2 }}>{c.label}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)',
                            color: c.color }}>{fmt(c.val)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop: tabela */
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Categoria','Resp.','Itens','Orçado (R$)','Imposto (R$)','Sem Imposto (R$)','Realizado (R$)','Saldo (R$)'].map((h, i) => (
                          <th key={h} style={{ padding: '9px 13px', textAlign: i > 2 ? 'right' : 'left',
                            fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(byCategory).sort((a,b)=>b[1].orcado-a[1].orcado).map(([cat, v], idx) => {
                        const saldo = v.orcado - v.realizado
                        return (
                          <tr key={cat}
                            onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                            style={{ transition: 'background 0.1s' }}>
                            <td style={{ padding:'10px 13px', fontWeight:600, fontSize:13,
                              borderBottom:'1px solid var(--border)', color: 'var(--text)' }}>
                              <span style={{ display:'inline-block', width:7, height:7, borderRadius:2,
                                background: CAT_COLORS[idx%CAT_COLORS.length], marginRight:10 }} />
                              {cat}
                            </td>
                            <td style={{ padding:'10px 13px', fontSize:11, color:'var(--muted)',
                              borderBottom:'1px solid var(--border)' }}>
                              {items.find(i=>i.cat===cat)?.resp || '—'}
                            </td>
                            <td style={{ padding:'10px 13px', fontSize:12, textAlign:'center',
                              color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
                              {v.n}
                            </td>
                            {[
                              { val: v.orcado,           color: 'var(--text)',  bold: true  },
                              { val: v.imposto,          color: '#F5A623',      bold: false },
                              { val: v.orcado-v.imposto, color: 'var(--muted)', bold: false },
                              { val: v.realizado,        color: '#65B32E',      bold: false },
                              { val: saldo, color: saldo < 0 ? '#E05252' : 'var(--text2)', bold: false },
                            ].map((c, i) => (
                              <td key={i} style={{ padding:'10px 13px', textAlign:'right',
                                fontFamily:'var(--mono)', fontSize:12.5, color: c.color,
                                fontWeight: c.bold ? 600 : 400,
                                borderBottom:'1px solid var(--border)' }}>
                                {c.val > 0 || c.val < 0 ? fmt(c.val) : '—'}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'var(--surface2)' }}>
                        <td colSpan={3} style={{ padding:'10px 13px', fontSize:12,
                          fontWeight:700, color:'var(--muted)',
                          borderTop:'2px solid var(--border)' }}>
                          Total Geral
                        </td>
                        {[grand.orcado, grand.imposto, grand.semImp, grand.realizado, grand.saldo].map((v,i) => (
                          <td key={i} style={{ padding:'10px 13px', textAlign:'right',
                            fontFamily:'var(--mono)', fontSize:13, fontWeight:700,
                            color: i===1?'#F5A623':i===3?'#65B32E':i===4?(v<0?'#E05252':'var(--text)'):'var(--text)',
                            borderTop:'2px solid var(--border)' }}>
                            {fmt(v)}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}

        {/* ITENS */}
        {activeTab === 'detail' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Detalhe dos Itens Orçados
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Preencha <strong style={{ color: '#65B32E' }}>Realizado (R$)</strong> e selecione o <strong style={{ color: '#65B32E' }}>Status</strong>.
              </p>
            </div>
            <ItemsTable items={items} updateItem={updateItem} addItem={addItem}
              removeItem={removeItem} isMobile={isMobile} />
          </>
        )}

        {/* IMPOSTOS */}
        {activeTab === 'impostos' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Análise de Impostos
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Método gross-up — incide exclusivamente em itens em dólar.
              </p>
            </div>

            <div style={{ display:'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4,minmax(0,1fr))',
              gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 22 }}>
              <KpiCard label="Total Orçado"      value={fmtM(grand.orcado)} accent="#585455" />
              <KpiCard label="Total Imposto"     value={fmtM(grand.imposto)}
                sub={`${fmtPct(grand.orcado>0?grand.imposto/grand.orcado*100:0)} do orçado`} accent="#F5A623" />
              <KpiCard label="Sem Imposto"       value={fmtM(grand.semImp)} accent="#65B32E" />
              <KpiCard label="Itens Tributados"
                value={`${items.filter(i=>i.aliq>0).length}`}
                sub="todos em dólar" accent="#4A9EDB" />
            </div>

            <div style={{ display:'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 12 : 16, marginBottom: isMobile ? 14 : 20 }}>
              <Card style={{ padding: isMobile ? '16px' : '22px 24px' }}>
                <CardTitle>Imposto por Categoria</CardTitle>
                <Legend items={[['Base','#CBD5E1'],['Imposto','#F5A623']]} />
                <ImpostoChart byCategory={byCategory} />
              </Card>
              <Card style={{ padding: isMobile ? '16px' : '22px 24px' }}>
                <CardTitle>Alíquotas Aplicadas</CardTitle>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    { aliq:0.15,   label:'15,00%', desc:'IBC, HBS, Grafismo, Satélite' },
                    { aliq:0.2763, label:'27,63%', desc:'Servidores IBC, TVU' },
                    { aliq:0.3941, label:'39,41%', desc:'Fibras Dallas, Equipamentos ENG' },
                  ].map(({ aliq, label, desc }) => {
                    const mine  = items.filter(i => Math.abs(i.aliq-aliq)<0.0001)
                    const total = mine.reduce((s,i)=>s+i.orcado,0)
                    const imp   = mine.reduce((s,i)=>s+i.imposto,0)
                    return (
                      <div key={label} style={{
                        padding:'14px 16px', borderRadius:'var(--radius-md)',
                        background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.20)',
                        borderLeft:'3px solid #F5A623',
                      }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontWeight:700, fontSize:16, color:'#F5A623', fontFamily:'var(--mono)' }}>{label}</span>
                          <span style={{ fontSize:11, color:'var(--muted)' }}>{mine.length} itens</span>
                        </div>
                        <div style={{ fontSize:11, color:'var(--muted)', marginBottom:8 }}>{desc}</div>
                        <div style={{ display:'flex', gap: isMobile ? 10 : 16, fontSize:11.5,
                          fontFamily:'var(--mono)', flexWrap: 'wrap' }}>
                          <span style={{ color:'var(--text2)' }}>Orçado: <strong>{fmtM(total)}</strong></span>
                          <span style={{ color:'#F5A623' }}>Imposto: <strong>{fmtM(imp)}</strong></span>
                          <span style={{ color:'#65B32E' }}>Base: <strong>{fmtM(total-imp)}</strong></span>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{
                    padding:'14px 16px', borderRadius:'var(--radius-md)',
                    background:'rgba(101,179,46,0.06)', border:'1px solid rgba(101,179,46,0.20)',
                    borderLeft:'3px solid #65B32E',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:16, color:'#65B32E', fontFamily:'var(--mono)' }}>0,00%</span>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>{items.filter(i=>!i.aliq).length} itens</span>
                    </div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginBottom:8 }}>
                      Itens em Real — Kits Mojo, Reporters, Freelancers, Ivan Souza
                    </div>
                    <div style={{ fontSize:11.5, fontFamily:'var(--mono)', color:'#65B32E' }}>
                      Total: <strong>{fmtM(items.filter(i=>!i.aliq).reduce((s,i)=>s+i.orcado,0))}</strong>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card style={{ padding: isMobile ? '16px' : '22px 24px' }}>
              <CardTitle>Itens com Incidência de Imposto</CardTitle>
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.filter(i=>i.aliq>0).map(item => (
                    <div key={item.id} style={{
                      padding: '12px 14px', borderRadius: 'var(--radius-md)',
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      borderLeft: '3px solid #F5A623',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8,
                        color: 'var(--text)', lineHeight: 1.3 }}>{item.det}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {[
                          { label: 'Alíquota',    val: `${(item.aliq*100).toFixed(2)}%`, color: '#F5A623' },
                          { label: 'Orçado',      val: fmt(item.orcado),    color: 'var(--text)'  },
                          { label: 'Imposto',     val: fmt(item.imposto),   color: '#F5A623'      },
                          { label: 'Sem Imposto', val: fmt(item.semImp),    color: '#65B32E'      },
                        ].map((c, i) => (
                          <div key={i}>
                            <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                              letterSpacing: '0.06em', marginBottom: 2 }}>{c.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 600,
                              fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        {['Detalhamento','Moeda','Qtd','Cot.','Val. Un (USD)','Alíquota','Orçado (R$)','Imposto (R$)','Sem Imposto (R$)'].map((h,i)=>(
                          <th key={h} style={{ padding:'9px 13px', textAlign:i>1?'right':'left',
                            fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em',
                            color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.filter(i=>i.aliq>0).map((item)=>(
                        <tr key={item.id}
                          onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          style={{ transition:'background 0.1s' }}>
                          <td style={{ padding:'9px 13px', maxWidth:280, overflow:'hidden',
                            textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:13, fontWeight:500,
                            borderBottom:'1px solid var(--border)', color:'var(--text)' }} title={item.det}>
                            {item.det}
                          </td>
                          <td style={{ padding:'9px 13px', borderBottom:'1px solid var(--border)' }}>
                            <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700,
                              background:'rgba(74,158,219,0.12)', color:'#4A9EDB',
                              border:'1px solid rgba(74,158,219,0.30)' }}>USD</span>
                          </td>
                          {[item.qtd, 5.6, item.valorUn].map((v,i)=>(
                            <td key={i} style={{ padding:'9px 13px', textAlign:'right',
                              fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)',
                              borderBottom:'1px solid var(--border)' }}>
                              {typeof v==='number'?v.toLocaleString('pt-BR'):v}
                            </td>
                          ))}
                          <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                            fontWeight:700, color:'#F5A623', borderBottom:'1px solid var(--border)',
                            background:'rgba(245,166,35,0.04)' }}>
                            {(item.aliq*100).toFixed(2)}%
                          </td>
                          <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                            fontWeight:600, color:'var(--text)', borderBottom:'1px solid var(--border)' }}>
                            {fmt(item.orcado)}
                          </td>
                          <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                            fontWeight:700, color:'#F5A623', borderBottom:'1px solid var(--border)',
                            background:'rgba(245,166,35,0.04)' }}>
                            {fmt(item.imposto)}
                          </td>
                          <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                            color:'#65B32E', borderBottom:'1px solid var(--border)' }}>
                            {fmt(item.semImp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background:'var(--surface2)' }}>
                        <td colSpan={6} style={{ padding:'10px 13px', fontSize:12, fontWeight:700,
                          color:'var(--muted)', borderTop:'2px solid var(--border)' }}>
                          Total
                        </td>
                        {[
                          { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.orcado,0),  color:'var(--text)' },
                          { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.imposto,0), color:'#F5A623' },
                          { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.semImp,0),  color:'#65B32E' },
                        ].map((c,i)=>(
                          <td key={i} style={{ padding:'10px 13px', textAlign:'right', fontSize:13,
                            fontWeight:700, fontFamily:'var(--mono)', color:c.color,
                            borderTop:'2px solid var(--border)' }}>
                            {fmt(c.val)}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Footer */}
        {!isMobile && (
          <div style={{ marginTop:40, paddingTop:20,
            borderTop:'1px solid var(--border)',
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13 }}>
                <span style={{ color:'#65B32E' }}>LIVE</span>
                <span style={{ color:'var(--text)' }}>M</span>
                <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%',
                  background:'#65B32E', margin:'0 1px', verticalAlign:'middle', position:'relative', top:-1 }} />
                <span style={{ color:'var(--text)' }}>DE</span>
              </span>
              <span style={{ fontSize:11, color:'var(--muted2)' }}>
                Copa do Mundo 2026 — Controle Interno Operações & Engenharia
              </span>
            </div>
            <span style={{ fontSize:11, color:'var(--muted2)', fontFamily:'var(--mono)' }}>
              {new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
