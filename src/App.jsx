import React, { useState } from 'react'
import { useStore } from './data/store.js'
import { fmt, fmtM, fmtPct, CAT_COLORS } from './data/utils.js'
import KpiCard from './components/KpiCard.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import ItemsTable from './components/ItemsTable.jsx'
import { OrcadoVsRealizadoChart, CategoriaChart, ImpostoChart } from './components/Charts.jsx'

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 24px',
    ...style,
  }}>
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.1em', color: 'rgba(255,255,255,0.40)',
    marginBottom: 18,
  }}>{children}</div>
)

const Legend = ({ items }) => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
    {items.map(([label, color]) => (
      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ width: 7, height: 7, borderRadius: 2, background: color }} />
        {label}
      </span>
    ))}
  </div>
)

const CircleAsset = ({ size = 120, color = '#65B32E', opacity = 0.08, style = {} }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `2px solid ${color}`,
    opacity,
    position: 'absolute',
    pointerEvents: 'none',
    ...style,
  }} />
)

export default function App() {
  const { items, updateItem, addItem, removeItem, totals, grand, byCategory, byStatus } = useStore()
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'detail',   label: 'Itens' },
    { id: 'impostos', label: 'Impostos' },
  ]

  const statusCards = [
    { key: '',                    label: 'Pendente',           color: 'rgba(255,255,255,0.5)',  bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)' },
    { key: 'Pago',                label: 'Pago',               color: '#65B32E', bg: 'rgba(101,179,46,0.12)',  border: 'rgba(101,179,46,0.30)'  },
    { key: 'Aprovado / a pagar',  label: 'Aprovado / a pagar', color: '#4A9EDB', bg: 'rgba(74,158,219,0.12)',  border: 'rgba(74,158,219,0.30)'  },
    { key: 'Em negociação',       label: 'Em negociação',      color: '#F5A623', bg: 'rgba(245,166,35,0.12)',  border: 'rgba(245,166,35,0.30)'  },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      <CircleAsset size={400} color="#65B32E" opacity={0.04} style={{ top: -120, right: -120 }} />
      <CircleAsset size={200} color="#65B32E" opacity={0.06} style={{ top: -30, right: -30 }} />
      <CircleAsset size={600} color="#65B32E" opacity={0.025} style={{ bottom: -200, left: -200 }} />

      {/* TOPBAR */}
      <div style={{
        background: 'rgba(0,0,0,0.30)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 60, maxWidth: 1600, margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0,
              fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 18,
              letterSpacing: '-0.01em',
            }}>
              <span style={{ color: '#65B32E' }}>LIVE</span>
              <span style={{ color: '#fff' }}>M</span>
              <span style={{
                display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
                background: '#65B32E', margin: '0 1px', verticalAlign: 'middle',
                position: 'relative', top: -1,
              }} />
              <span style={{ color: '#fff' }}>DE</span>
            </div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
              Copa do Mundo 2026 · Controle Interno
            </div>
          </div>

          <div style={{
            display: 'flex', gap: 2,
            background: 'rgba(0,0,0,0.25)',
            padding: 3, borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '6px 20px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                border: 'none',
                background: activeTab === t.id ? 'rgba(101,179,46,0.20)' : 'transparent',
                color: activeTab === t.id ? '#65B32E' : 'rgba(255,255,255,0.45)',
                outline: activeTab === t.id ? '1px solid rgba(101,179,46,0.35)' : 'none',
              }}>{t.label}</button>
            ))}
          </div>

          <div style={{
            fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--mono)',
            background: 'rgba(255,255,255,0.06)', padding: '5px 12px',
            borderRadius: 6, border: '1px solid rgba(255,255,255,0.10)',
          }}>
            USD 1 = R$ 5,60
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '28px 32px', maxWidth: 1600, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* VISÃO GERAL */}
        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 14, marginBottom: 22 }}>
              <KpiCard label="Orçado Total"     value={fmtM(grand.orcado)}
                sub={`${items.length} itens`} accent="#ffffff" />
              <KpiCard label="João Crispim"     value={fmtM(totals['João Crispim']?.orcado)}
                sub={`Realizado: ${fmtM(totals['João Crispim']?.realizado)}`} accent="#65B32E" />
              <KpiCard label="Ivan Souza"       value={fmtM(totals['Ivan Souza']?.orcado)}
                sub={`Realizado: ${fmtM(totals['Ivan Souza']?.realizado)}`} accent="#4A9EDB" />
              <KpiCard label="Total Realizado"  value={fmtM(grand.realizado)}
                sub={`${fmtPct(grand.pctExec)} executado`} accent="#65B32E" />
              <KpiCard label="Saldo Disponível" value={fmtM(grand.saldo)}
                sub={`${fmtPct(100 - grand.pctExec)} restante`}
                accent={grand.saldo < 0 ? '#E05252' : '#F5A623'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Card>
                <CardTitle>Progresso de Execução</CardTitle>
                {Object.entries(totals).map(([resp, t]) => (
                  <ProgressBar key={resp} label={resp}
                    pct={t.pctExec} realizado={t.realizado} orcado={t.orcado}
                    color={resp === 'João Crispim' ? '#65B32E' : '#4A9EDB'}
                    initials={resp === 'João Crispim' ? 'JC' : 'IV'}
                  />
                ))}
              </Card>
              <Card>
                <CardTitle>Status dos Itens</CardTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {statusCards.map(s => {
                    const count = s.key === ''
                      ? items.filter(i => !i.status).length
                      : (byStatus[s.key]?.n || 0)
                    const val = byStatus[s.key]?.val || 0
                    return (
                      <div key={s.key} style={{
                        padding: '14px 16px', borderRadius: 'var(--radius-md)',
                        background: s.bg, border: `1px solid ${s.border}`,
                      }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.09em', color: s.color, marginBottom: 6 }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                          {count}
                        </div>
                        <div style={{ fontSize: 11, color: s.color, opacity: 0.7,
                          marginTop: 4, fontFamily: 'var(--mono)' }}>
                          {val > 0 ? fmtM(val) : '—'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Card>
                <CardTitle>Orçado vs Realizado</CardTitle>
                <Legend items={[['Orçado','#65B32E'],['Realizado','#4A9EDB'],['Saldo','rgba(255,255,255,0.15)']]} />
                <OrcadoVsRealizadoChart totals={totals} />
              </Card>
              <Card>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {Object.keys(byCategory).sort((a,b) => byCategory[b].orcado - byCategory[a].orcado)
                    .slice(0,7).map((cat, i) => (
                    <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: 2,
                        background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      {cat.length > 22 ? cat.slice(0,20)+'…' : cat}
                    </span>
                  ))}
                </div>
                <CategoriaChart byCategory={byCategory} />
              </Card>
            </div>

            <Card>
              <CardTitle>Resumo por Categoria</CardTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Categoria','Resp.','Itens','Orçado (R$)','Imposto (R$)','Sem Imposto (R$)','Realizado (R$)','Saldo (R$)'].map((h, i) => (
                        <th key={h} style={{ padding: '9px 13px', textAlign: i > 2 ? 'right' : 'left',
                          fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                          color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          style={{ transition: 'background 0.1s' }}>
                          <td style={{ padding:'10px 13px', fontWeight:600, fontSize:13,
                            borderBottom:'1px solid rgba(255,255,255,0.05)', color: 'var(--text)' }}>
                            <span style={{ display:'inline-block', width:7, height:7, borderRadius:2,
                              background: CAT_COLORS[idx%CAT_COLORS.length], marginRight:10 }} />
                            {cat}
                          </td>
                          <td style={{ padding:'10px 13px', fontSize:11, color:'var(--muted)',
                            borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                            {items.find(i=>i.cat===cat)?.resp || '—'}
                          </td>
                          <td style={{ padding:'10px 13px', fontSize:12, textAlign:'center',
                            color:'var(--muted)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
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
                              borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                              {c.val > 0 || c.val < 0 ? fmt(c.val) : '—'}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'rgba(0,0,0,0.20)' }}>
                      <td colSpan={3} style={{ padding:'10px 13px', fontSize:12,
                        fontWeight:700, color:'rgba(255,255,255,0.5)',
                        borderTop:'1px solid rgba(255,255,255,0.12)' }}>
                        Total Geral
                      </td>
                      {[grand.orcado, grand.imposto, grand.semImp, grand.realizado, grand.saldo].map((v,i) => (
                        <td key={i} style={{ padding:'10px 13px', textAlign:'right',
                          fontFamily:'var(--mono)', fontSize:13, fontWeight:700,
                          color: i===1?'#F5A623':i===3?'#65B32E':i===4?(v<0?'#E05252':'var(--text)'):'var(--text)',
                          borderTop:'1px solid rgba(255,255,255,0.12)' }}>
                          {fmt(v)}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ITENS */}
        {activeTab === 'detail' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Detalhe dos Itens Orçados
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Preencha <strong style={{ color: '#65B32E' }}>Realizado (R$)</strong> e selecione o <strong style={{ color: '#65B32E' }}>Status</strong> para atualizar o controle.
              </p>
            </div>
            <ItemsTable items={items} updateItem={updateItem} addItem={addItem} removeItem={removeItem} />
          </>
        )}

        {/* IMPOSTOS */}
        {activeTab === 'impostos' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Análise de Impostos
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Método gross-up — imposto calculado sobre o valor total. Incide exclusivamente em itens em dólar.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:14, marginBottom:22 }}>
              <KpiCard label="Total Orçado"      value={fmtM(grand.orcado)} accent="#ffffff" />
              <KpiCard label="Total Imposto"     value={fmtM(grand.imposto)}
                sub={`${fmtPct(grand.orcado>0?grand.imposto/grand.orcado*100:0)} do orçado`} accent="#F5A623" />
              <KpiCard label="Total Sem Imposto" value={fmtM(grand.semImp)} accent="#65B32E" />
              <KpiCard label="Itens Tributados"
                value={`${items.filter(i=>i.aliq>0).length} itens`}
                sub="todos em dólar" accent="#4A9EDB" />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
              <Card>
                <CardTitle>Imposto por Categoria</CardTitle>
                <Legend items={[['Base','rgba(255,255,255,0.15)'],['Imposto','#F5A623']]} />
                <ImpostoChart byCategory={byCategory} />
              </Card>
              <Card>
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
                        background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.25)',
                        borderLeft:'3px solid #F5A623',
                      }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontWeight:700, fontSize:17, color:'#F5A623', fontFamily:'var(--mono)' }}>{label}</span>
                          <span style={{ fontSize:11, color:'var(--muted)' }}>{mine.length} itens</span>
                        </div>
                        <div style={{ fontSize:11, color:'var(--muted)', marginBottom:8 }}>{desc}</div>
                        <div style={{ display:'flex', gap:16, fontSize:11.5, fontFamily:'var(--mono)' }}>
                          <span style={{ color:'var(--text2)' }}>Orçado: <strong>{fmtM(total)}</strong></span>
                          <span style={{ color:'#F5A623' }}>Imposto: <strong>{fmtM(imp)}</strong></span>
                          <span style={{ color:'#65B32E' }}>Base: <strong>{fmtM(total-imp)}</strong></span>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{
                    padding:'14px 16px', borderRadius:'var(--radius-md)',
                    background:'rgba(101,179,46,0.08)', border:'1px solid rgba(101,179,46,0.25)',
                    borderLeft:'3px solid #65B32E',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:17, color:'#65B32E', fontFamily:'var(--mono)' }}>0,00%</span>
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

            <Card>
              <CardTitle>Itens com Incidência de Imposto</CardTitle>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Detalhamento','Moeda','Qtd','Cot.','Val. Un (USD)','Alíquota','Orçado (R$)','Imposto (R$)','Sem Imposto (R$)'].map((h,i)=>(
                        <th key={h} style={{ padding:'9px 13px', textAlign:i>1?'right':'left',
                          fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em',
                          color:'rgba(255,255,255,0.35)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(i=>i.aliq>0).map((item)=>(
                      <tr key={item.id}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                        style={{ transition:'background 0.1s' }}>
                        <td style={{ padding:'9px 13px', maxWidth:280, overflow:'hidden',
                          textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:13, fontWeight:500,
                          borderBottom:'1px solid rgba(255,255,255,0.05)' }} title={item.det}>
                          {item.det}
                        </td>
                        <td style={{ padding:'9px 13px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700,
                            background:'rgba(74,158,219,0.15)', color:'#4A9EDB',
                            border:'1px solid rgba(74,158,219,0.35)' }}>USD</span>
                        </td>
                        {[item.qtd, 5.6, item.valorUn].map((v,i)=>(
                          <td key={i} style={{ padding:'9px 13px', textAlign:'right',
                            fontFamily:'var(--mono)', fontSize:12, color:'var(--muted)',
                            borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                            {typeof v==='number'?v.toLocaleString('pt-BR'):v}
                          </td>
                        ))}
                        <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                          fontWeight:700, color:'#F5A623', borderBottom:'1px solid rgba(255,255,255,0.05)',
                          background:'rgba(245,166,35,0.06)' }}>
                          {(item.aliq*100).toFixed(2)}%
                        </td>
                        <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                          fontWeight:600, color:'var(--text)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                          {fmt(item.orcado)}
                        </td>
                        <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                          fontWeight:700, color:'#F5A623', borderBottom:'1px solid rgba(255,255,255,0.05)',
                          background:'rgba(245,166,35,0.06)' }}>
                          {fmt(item.imposto)}
                        </td>
                        <td style={{ padding:'9px 13px', textAlign:'right', fontFamily:'var(--mono)',
                          color:'#65B32E', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                          {fmt(item.semImp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background:'rgba(0,0,0,0.20)' }}>
                      <td colSpan={6} style={{ padding:'10px 13px', fontSize:12, fontWeight:700,
                        color:'rgba(255,255,255,0.4)', borderTop:'1px solid rgba(255,255,255,0.12)' }}>
                        Total
                      </td>
                      {[
                        { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.orcado,0),  color:'var(--text)' },
                        { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.imposto,0), color:'#F5A623' },
                        { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.semImp,0),  color:'#65B32E' },
                      ].map((c,i)=>(
                        <td key={i} style={{ padding:'10px 13px', textAlign:'right', fontSize:13,
                          fontWeight:700, fontFamily:'var(--mono)', color:c.color,
                          borderTop:'1px solid rgba(255,255,255,0.12)' }}>
                          {fmt(c.val)}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop:40, paddingTop:20,
          borderTop:'1px solid rgba(255,255,255,0.08)',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:13, letterSpacing:'-0.01em' }}>
              <span style={{ color:'#65B32E' }}>LIVE</span>
              <span style={{ color:'rgba(255,255,255,0.7)' }}>M</span>
              <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%',
                background:'#65B32E', margin:'0 1px', verticalAlign:'middle', position:'relative', top:-1 }} />
              <span style={{ color:'rgba(255,255,255,0.7)' }}>DE</span>
            </span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>
              Copa do Mundo 2026 — Controle Interno Operações & Engenharia
            </span>
          </div>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:'var(--mono)' }}>
            {new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}
