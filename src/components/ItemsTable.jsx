import React, { useState, useMemo } from 'react'
import ItemRow from './ItemRow.jsx'
import { fmt } from '../data/utils.js'

const TH = ({ children, align = 'left', style = {} }) => (
  <th style={{
    padding: '11px 13px', fontSize: 10, fontWeight: 600, textAlign: align,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.40)', background: 'rgba(0,0,0,0.20)',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    whiteSpace: 'nowrap', position: 'sticky', top: 0, zIndex: 1,
    ...style,
  }}>{children}</th>
)

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '5px 13px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
    border: `1px solid ${active ? '#65B32E' : 'rgba(255,255,255,0.15)'}`,
    background: active ? 'rgba(101,179,46,0.18)' : 'transparent',
    color: active ? '#65B32E' : 'rgba(255,255,255,0.5)',
  }}>{label}</button>
)

export default function ItemsTable({ items, updateItem, addItem, removeItem }) {
  const [filterResp,   setFilterResp]   = useState('Todos')
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [filterMoeda,  setFilterMoeda]  = useState('Todas')
  const [search,       setSearch]       = useState('')

  const filtered = useMemo(() => items.filter(i => {
    if (filterResp !== 'Todos' && i.resp !== filterResp) return false
    if (filterStatus !== 'Todos') {
      const s = i.status || 'Pendente'
      if (filterStatus === 'Pendente' ? (s !== '' && s !== 'Pendente') : s !== filterStatus) return false
    }
    if (filterMoeda !== 'Todas' && i.moeda !== filterMoeda) return false
    if (search && !i.det.toLowerCase().includes(search.toLowerCase()) &&
        !i.cat.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [items, filterResp, filterStatus, filterMoeda, search])

  const totals = useMemo(() => ({
    orcado:    filtered.reduce((s, i) => s + i.orcado, 0),
    imposto:   filtered.reduce((s, i) => s + i.imposto, 0),
    semImp:    filtered.reduce((s, i) => s + i.semImp, 0),
    realizado: filtered.reduce((s, i) => s + (i.realizado || 0), 0),
  }), [filtered])

  return (
    <div>
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        marginBottom: 16, padding: '14px 16px',
        background: 'rgba(0,0,0,0.20)', borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <input placeholder="Buscar item ou categoria..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }} />
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {['Todos','João Crispim','Ivan Souza'].map(o => (
            <Pill key={o}
              label={o === 'João Crispim' ? 'J. Crispim' : o === 'Ivan Souza' ? 'I. Souza' : o}
              active={filterResp === o} onClick={() => setFilterResp(o)} />
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {['Todas','Dólar','Real'].map(o => (
            <Pill key={o} label={o} active={filterMoeda === o} onClick={() => setFilterMoeda(o)} />
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['Todos','Pendente','Pago','Aprovado / a pagar','Em negociação','Cancelado'].map(o => (
            <Pill key={o} label={o} active={filterStatus === o} onClick={() => setFilterStatus(o)} />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => addItem('João Crispim')} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600,
            background: 'rgba(101,179,46,0.18)', color: '#65B32E',
            border: '1px solid rgba(101,179,46,0.40)',
          }}>+ João Crispim</button>
          <button onClick={() => addItem('Ivan Souza')} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600,
            background: 'rgba(74,158,219,0.18)', color: '#4A9EDB',
            border: '1px solid rgba(74,158,219,0.40)',
          }}>+ Ivan Souza</button>
        </div>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.18)', borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1400 }}>
            <thead>
              <tr>
                <TH>Resp.</TH><TH>Categoria</TH><TH>Detalhamento</TH>
                <TH align="center">Moeda</TH><TH align="center">Qtd</TH>
                <TH align="center">Alíq.</TH><TH align="right">Orçado (R$)</TH>
                <TH align="right">Imposto (R$)</TH><TH align="right">Sem Imposto (R$)</TH>
                <TH align="right">Realizado (R$)</TH><TH align="right">Diferença (R$)</TH>
                <TH align="center">% Exec.</TH><TH>Status</TH>
                <TH align="center">Bookado?</TH><TH>Observações</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <ItemRow key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={15} style={{ padding: '40px', textAlign: 'center',
                  color: 'var(--muted)', fontSize: 13 }}>
                  Nenhum item encontrado com os filtros selecionados.
                </td></tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(0,0,0,0.25)' }}>
                <td colSpan={6} style={{ padding: '11px 13px', fontSize: 12,
                  fontWeight: 600, color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  {filtered.length} {filtered.length === 1 ? 'item' : 'itens'} exibidos
                </td>
                {[
                  { val: totals.orcado,    color: '#fff'         },
                  { val: totals.imposto,   color: '#F5A623'      },
                  { val: totals.semImp,    color: 'var(--muted)' },
                  { val: totals.realizado, color: '#65B32E'      },
                ].map((t, i) => (
                  <td key={i} style={{ padding: '11px 13px', textAlign: 'right',
                    fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                    color: t.color, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    {fmt(t.val)}
                  </td>
                ))}
                <td colSpan={4} style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
