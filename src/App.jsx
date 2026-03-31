import React, { useState } from 'react'
import { useStore } from './data/store.js'
import { fmt, fmtM, fmtPct, CAT_COLORS } from './data/utils.js'
import KpiCard from './components/KpiCard.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import StatusBadge from './components/StatusBadge.jsx'
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

const CardTitle = ({ children, action }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 18,
  }}>
    <span style={{
      fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--muted)',
    }}>{children}</span>
    {action}
  </div>
)

const Legend = ({ items }) => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
    {items.map(([label, color]) => (
      <span key={label} style={{ display: 'flex', alignItems: 'center',
        gap: 6, fontSize: 12, color: 'var(--muted)' }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
        {label}
      </span>
    ))}
  </div>
)

const Divider = () => (
  <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />
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
    { key: '',                    label: 'Pendente',           color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' },
    { key: 'Pago',                label: 'Pago',               color: '#166534', bg: '#F0FDF4', border: '#BBF7D0' },
    { key: 'Aprovado / a pagar',  label: 'Aprovado / a pagar', color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    { key: 'Em negociação',       label: 'Em negociação',      color: '#92400E', bg: '#FFFBEB', border: '#FDE68A' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* HEADER */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        {/* Top strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 58,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--blue)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#fff', fontWeight: 700,
            }}>⚽</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                Copa do Mundo 2026
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>
                Controle Interno — Operações & Engenharia
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface2)',
            padding: 3, borderRadius: 10, border: '1px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '6px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: 'none',
                background: activeTab === t.id ? 'var(--surface)' : 'transparent',
                color: activeTab === t.id ? 'var(--text)' : 'var(--muted)',
                boxShadow: activeTab === t.id ? 'var(--shadow-xs)' : 'none',
              }}>{t.label}</button>
            ))}
          </div>

          <div style={{
            fontSize: 11, fontWeight: 500, color: 'var(--muted)',
            fontFamily: 'var(--mono)',
            background: 'var(--surface2)', padding: '5px 12px',
            borderRadius: 6, border: '1px solid var(--border)',
          }}>
            USD 1 = R$ 5,60 (cotação fixa)
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '28px 32px', maxWidth: 1600, margin: '0 auto' }}>

        {/* ===================== VISÃO GERAL ===================== */}
        {activeTab === 'overview' && (
          <>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 14, marginBottom: 24 }}>
              <KpiCard label="Orçado Total"     value={fmtM(grand.orcado)}
                sub={`${items.length} itens orçados`}
                accent="#334155" icon="📋" />
              <KpiCard label="João Crispim"     value={fmtM(totals['João Crispim']?.orcado)}
                sub={`Realizado: ${fmtM(totals['João Crispim']?.realizado)}`}
                accent="#1D4ED8" icon="👤" />
              <KpiCard label="Ivan Souza"       value={fmtM(totals['Ivan Souza']?.orcado)}
                sub={`Realizado: ${fmtM(totals['Ivan Souza']?.realizado)}`}
                accent="#7C3AED" icon="👤" />
              <KpiCard label="Total Realizado"  value={fmtM(grand.realizado)}
                sub={`${fmtPct(grand.pctExec)} executado`}
                accent="#16A34A" icon="✅" />
              <KpiCard label="Saldo Disponível" value={fmtM(grand.saldo)}
                sub={`${fmtPct(100 - grand.pctExec)} restante`}
                accent={grand.saldo < 0 ? '#B91C1C' : '#D97706'} icon="💰" />
            </div>

            {/* Progresso + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <Card>
                <CardTitle>Progresso de Execução</CardTitle>
                {Object.entries(totals).map(([resp, t]) => (
                  <ProgressBar key={resp} label={resp}
                    pct={t.pctExec} realizado={t.realizado} orcado={t.orcado}
                    color={resp === 'João Crispim' ? '#1D4ED8' : '#7C3AED'}
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
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.07em', color: s.color, marginBottom: 6 }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                          {count}
                        </div>
                        <div style={{ fontSize: 11, color: s.color + 'AA', marginTop: 4,
                          fontFamily: 'var(--mono)' }}>
                          {val > 0 ? fmtM(val) : '—'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Gráficos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <Card>
                <CardTitle>Orçado vs Realizado</CardTitle>
                <Legend items={[['Orçado','#1D4ED8'],['Realizado','#16A34A'],['Saldo','#E2E8F0']]} />
                <OrcadoVsRealizadoChart totals={totals} />
              </Card>
              <Card>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {Object.keys(byCategory).sort((a,b) => byCategory[b].orcado - byCategory[a].orcado)
                    .slice(0,7).map((cat, i) => (
                    <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 11, color: 'var(--muted)' }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2,
                        background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      {cat.length > 22 ? cat.slice(0,20)+'…' : cat}
                    </span>
                  ))}
                </div>
                <CategoriaChart byCategory={byCategory} />
              </Card>
            </div>

            {/* Resumo por categoria */}
            <Card>
              <CardTitle>Resumo por Categoria</CardTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Categoria','Responsável','Itens','Orçado (R$)','Imposto (R$)','Sem Imposto (R$)','Realizado (R$)','Saldo (R$)'].map((h, i) => (
                        <th key={h} style={{
                          padding: '10px 14px', textAlign: i > 2 ? 'right' : 'left',
                          fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                          letterSpacing: '0.07em', color: 'var(--muted)',
                          borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(byCategory).sort((a,b)=>b[1].orcado-a[1].orcado).map(([cat, v], idx) => {
                      const saldo = v.orcado - v.realizado
                      return (
                        <tr key={cat}
                          onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                          style={{ transition: 'background 0.1s' }}>
                          <td style={{ padding: '11px 14px', fontWeight: 600, fontSize: 13,
                            borderBottom: '1px solid var(--border)' }}>
                            <span style={{ display:'inline-block', width:8, height:8, borderRadius:2,
                              background: CAT_COLORS[idx%CAT_COLORS.length], marginRight:10 }} />
                            {cat}
                          </td>
                          <td style={{ padding:'11px 14px', fontSize:12, color:'var(--muted)',
                            borderBottom:'1px solid var(--border)' }}>
                            {items.find(i=>i.cat===cat)?.resp || '—'}
                          </td>
                          <td style={{ padding:'11px 14px', fontSize:12, textAlign:'center',
                            color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
                            {v.n}
                          </td>
                          {[
                            { val: v.orcado,           color: 'var(--text)',  bold: true },
                            { val: v.imposto,          color: 'var(--amber)', bold: false },
                            { val: v.orcado-v.imposto, color: 'var(--muted)', bold: false },
                            { val: v.realizado,        color: 'var(--green)', bold: false },
                            { val: saldo, color: saldo < 0 ? 'var(--red)' : 'var(--text2)', bold: false },
                          ].map((c, i) => (
                            <td key={i} style={{ padding:'11px 14px', textAlign:'right',
                              fontFamily:'var(--mono)', fontSize:12.5,
                              color: c.color, fontWeight: c.bold ? 600 : 400,
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
                      <td colSpan={3} style={{ padding:'11px 14px', fontSize:12,
                        fontWeight:700, color:'var(--muted)', borderTop:'2px solid var(--border)' }}>
                        Total Geral
                      </td>
                      {[grand.orcado, grand.imposto, grand.semImp, grand.realizado, grand.saldo].map((v,i) => (
                        <td key={i} style={{ padding:'11px 14px', textAlign:'right',
                          fontFamily:'var(--mono)', fontSize:13, fontWeight:700,
                          color: i===1?'var(--amber)':i===3?'var(--green)':i===4?(v<0?'var(--red)':'var(--text)'):'var(--text)',
                          borderTop:'2px solid var(--border)' }}>
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

        {/* ===================== ITENS ===================== */}
        {activeTab === 'detail' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Detalhe dos Itens Orçados
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Preencha a coluna <strong>Realizado (R$)</strong> e selecione o <strong>Status</strong> para atualizar o controle.
              </p>
            </div>
            <ItemsTable items={items} updateItem={updateItem}
              addItem={addItem} removeItem={removeItem} grand={grand} />
          </>
        )}

        {/* ===================== IMPOSTOS ===================== */}
        {activeTab === 'impostos' && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                Análise de Impostos
              </h2>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Método gross-up — imposto calculado sobre o valor total orçado. Incide exclusivamente em itens em dólar.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:14, marginBottom:24 }}>
              <KpiCard label="Total Orçado (c/ imposto)" value={fmtM(grand.orcado)} accent="#334155" icon="📊" />
              <KpiCard label="Total Imposto"  value={fmtM(grand.imposto)}
                sub={`${fmtPct(grand.orcado > 0 ? grand.imposto/grand.orcado*100 : 0)} do orçado`}
                accent="#D97706" icon="🧾" />
              <KpiCard label="Total Sem Imposto" value={fmtM(grand.semImp)} accent="#16A34A" icon="✅" />
              <KpiCard label="Itens Tributados"
                value={`${items.filter(i=>i.aliq>0).length} itens`}
                sub="todos em dólar" accent="#7C3AED" />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
              <Card>
                <CardTitle>Imposto por Categoria</CardTitle>
                <Legend items={[['Base (sem imposto)','#DBEAFE'],['Imposto','#F59E0B']]} />
                <ImpostoChart byCategory={byCategory} />
              </Card>

              <Card>
                <CardTitle>Alíquotas Aplicadas</CardTitle>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[
                    { aliq:0.15,   label:'15,00%', desc:'IBC, HBS, Grafismo, Satélite' },
                    { aliq:0.2763, label:'27,63%', desc:'Servidores IBC, TVU' },
                    { aliq:0.3941, label:'39,41%', desc:'Fibras Dallas, Equipamentos ENG' },
                  ].map(({ aliq, label, desc }) => {
                    const mine  = items.filter(i => Math.abs(i.aliq - aliq) < 0.0001)
                    const total = mine.reduce((s,i) => s+i.orcado, 0)
                    const imp   = mine.reduce((s,i) => s+i.imposto, 0)
                    return (
                      <div key={label} style={{
                        padding:'14px 16px', borderRadius:'var(--radius-md)',
                        background:'var(--amber-light)', border:'1px solid var(--amber-border)',
                        borderLeft:`3px solid var(--amber)`,
                      }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ fontWeight:700, fontSize:18, color:'var(--amber)',
                            fontFamily:'var(--mono)' }}>{label}</span>
                          <span style={{ fontSize:12, color:'var(--muted)' }}>{mine.length} itens</span>
                        </div>
                        <div style={{ fontSize:12, color:'var(--muted)', marginBottom:10 }}>{desc}</div>
                        <div style={{ display:'flex', gap:20, fontSize:12, fontFamily:'var(--mono)' }}>
                          <span style={{ color:'var(--text2)' }}>Orçado: <strong>{fmtM(total)}</strong></span>
                          <span style={{ color:'var(--amber)' }}>Imposto: <strong>{fmtM(imp)}</strong></span>
                          <span style={{ color:'var(--green)' }}>Base: <strong>{fmtM(total-imp)}</strong></span>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{
                    padding:'14px 16px', borderRadius:'var(--radius-md)',
                    background:'var(--green-light)', border:'1px solid var(--green-border)',
                    borderLeft:`3px solid var(--green)`,
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontWeight:700, fontSize:18, color:'var(--green)',
                        fontFamily:'var(--mono)' }}>0,00%</span>
                      <span style={{ fontSize:12, color:'var(--muted)' }}>
                        {items.filter(i=>!i.aliq).length} itens
                      </span>
                    </div>
                    <div style={{ fontSize:12, color:'var(--muted)', marginBottom:10 }}>
                      Itens em Real — Kits Mojo, Reporters, Freelancers, Ivan Souza
                    </div>
                    <div style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--green)' }}>
                      Total: <strong>{fmtM(items.filter(i=>!i.aliq).reduce((s,i)=>s+i.orcado,0))}</strong>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabela impostos */}
            <Card>
              <CardTitle>Itens com Incidência de Imposto</CardTitle>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Detalhamento','Moeda','Qtd','Cot. USD','Val. Un (USD)','Alíquota','Orçado (R$)','Imposto (R$)','Sem Imposto (R$)'].map((h,i) => (
                        <th key={h} style={{ padding:'10px 14px', textAlign: i > 1 ? 'right' : 'left',
                          fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em',
                          color:'var(--muted)', borderBottom:'2px solid var(--border)', whiteSpace:'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(i=>i.aliq>0).map((item, idx) => (
                      <tr key={item.id}
                        onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                        style={{ transition:'background 0.1s' }}>
                        <td style={{ padding:'10px 14px', maxWidth:280, overflow:'hidden',
                          textOverflow:'ellipsis', whiteSpace:'nowrap',
                          fontSize:13, fontWeight:500, borderBottom:'1px solid var(--border)' }}
                          title={item.det}>{item.det}</td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)' }}>
                          <span style={{ padding:'2px 8px', borderRadius:4, fontSize:10, fontWeight:700,
                            background:'var(--blue-light)', color:'var(--blue)',
                            border:'1px solid var(--blue-border)' }}>USD</span>
                        </td>
                        {[item.qtd, 5.6, item.valorUn].map((v,i) => (
                          <td key={i} style={{ padding:'10px 14px', textAlign:'right',
                            fontFamily:'var(--mono)', fontSize:12.5,
                            color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
                            {typeof v==='number'?v.toLocaleString('pt-BR'):v}
                          </td>
                        ))}
                        <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)',
                          fontWeight:700, color:'var(--amber)', borderBottom:'1px solid var(--border)',
                          background:'var(--amber-light)' }}>
                          {(item.aliq*100).toFixed(2)}%
                        </td>
                        <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)',
                          fontWeight:600, borderBottom:'1px solid var(--border)' }}>
                          {fmt(item.orcado)}
                        </td>
                        <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)',
                          fontWeight:700, color:'var(--amber)', borderBottom:'1px solid var(--border)',
                          background:'var(--amber-light)' }}>
                          {fmt(item.imposto)}
                        </td>
                        <td style={{ padding:'10px 14px', textAlign:'right', fontFamily:'var(--mono)',
                          color:'var(--green)', borderBottom:'1px solid var(--border)' }}>
                          {fmt(item.semImp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background:'var(--surface2)' }}>
                      <td colSpan={6} style={{ padding:'11px 14px', fontSize:12,
                        fontWeight:700, color:'var(--muted)', borderTop:'2px solid var(--border)' }}>
                        Total
                      </td>
                      {[
                        { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.orcado,0),   color:'var(--text)' },
                        { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.imposto,0),  color:'var(--amber)' },
                        { val:items.filter(i=>i.aliq>0).reduce((s,i)=>s+i.semImp,0),   color:'var(--green)' },
                      ].map((c,i) => (
                        <td key={i} style={{ padding:'11px 14px', textAlign:'right',
                          fontSize:13, fontWeight:700, fontFamily:'var(--mono)',
                          color:c.color, borderTop:'2px solid var(--border)' }}>
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
        <div style={{ marginTop:40, paddingTop:20, borderTop:'1px solid var(--border)',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'var(--muted2)' }}>
            Copa do Mundo 2026 — Controle Interno Operações & Engenharia
          </span>
          <span style={{ fontSize:12, color:'var(--muted2)', fontFamily:'var(--mono)' }}>
            {new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}
