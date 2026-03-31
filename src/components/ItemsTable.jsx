import React, { useState, useMemo } from 'react'
import ItemRow from './ItemRow.jsx'
import { fmt } from '../data/utils.js'

const TH = ({ children, align = 'left', style = {} }) => (
  <th style={{
    padding: '11px 13px', fontSize: 10, fontWeight: 600, textAlign: align,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'var(--muted)', background: 'var(--surface2)',
    borderBottom: '2px solid var(--border)',
    whiteSpace: 'nowrap', position: 'sticky', top: 0, zIndex: 1,
    ...style,
  }}>{children}</th>
)

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '5px 13px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
    border: `1px solid ${active ? '#65B32E' : 'var(--border)'}`,
    background: active ? 'rgba(101,179,46,0.12)' : 'transparent',
    color: active ? '#65B32E' : 'var(--muted)',
    cursor: 'pointer',
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
      {/* Filtros */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        marginBottom: 16, padding: '14px 18px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <input placeholder="Buscar item ou categoria..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }} />
        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {['Todos','João Crispim','Ivan Souza'].map(o => (
            <Pill key={o}
              label={o === 'João Crispim' ? 'J. Crispim' : o === 'Ivan Souza' ? 'I. Souza' : o}
              active={filterResp === o} onClick={() => setFilterResp(o)} />
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {['Todas','Dólar','Real'].map(o => (
            <Pill key={o} label={o} active={filterMoeda === o} onClick={() => setFilterMoeda(o)} />
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['Todos','Pendente','Pago','Aprovado / a pagar','Em negociação','Cancelado'].map(o => (
            <Pill key={o} label={o} active={filterStatus === o} onClick={() => setFilterStatus(o)} />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => addItem('João Crispim')} style={{
            padding: '7px 16px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600,
            background: 'rgba(101,179,46,0.12)', color: '#65B32E',
            border: '1px solid rgba(101,179,46,0.35)', cursor: 'pointer',
          }}>+ João Crispim</button>
          <button onClick={() => addItem('Ivan Souza')} style={{
            padding: '7px 16px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600,
            background: 'rgba(74,158,219,0.12)', color: '#4A9EDB',
            border: '1px solid rgba(74,158,219,0.35)', cursor: 'pointer',
          }}>+ Ivan Souza</button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1500 }}>
            <thead>
              <tr>
                <TH align="center">Ações</TH>
                <TH>Resp.</TH>
                <TH>Categoria</TH>
                <TH>Detalhamento</TH>
                <TH align="center">Moeda</TH>
                <TH align="center">Qtd</TH>
                <TH align="center">Alíq.</TH>
                <TH align="right">Orçado (R$)</TH>
                <TH align="right">Imposto (R$)</TH>
                <TH align="right">Sem Imposto (R$)</TH>
                <TH align="right">Realizado (R$)</TH>
                <TH align="right">Diferença (R$)</TH>
                <TH align="center">% Exec.</TH>
                <TH>Status</TH>
                <TH align="center">Bookado?</TH>
                <TH>Observações</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <ItemRow key={item.id} item={item}
                  onUpdate={updateItem} onRemove={removeItem} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={16} style={{ padding: '40px', textAlign: 'center',
                    color: 'var(--muted)', fontSize: 13 }}>
                    Nenhum item encontrado.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--surface2)' }}>
                <td colSpan={7} style={{ padding: '11px 13px', fontSize: 12,
                  fontWeight: 600, color: 'var(--muted)',
                  borderTop: '2px solid var(--border)' }}>
                  {filtered.length} {filtered.length === 1 ? 'item' : 'itens'} exibidos
                </td>
                {[
                  { val: totals.orcado,    color: 'var(--text)'  },
                  { val: totals.imposto,   color: '#F5A623'      },
                  { val: totals.semImp,    color: 'var(--muted)' },
                  { val: totals.realizado, color: '#65B32E'      },
                ].map((t, i) => (
                  <td key={i} style={{ padding: '11px 13px', textAlign: 'right',
                    fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                    color: t.color, borderTop: '2px solid var(--border)' }}>
                    {fmt(t.val)}
                  </td>
                ))}
                <td colSpan={5} style={{ borderTop: '2px solid var(--border)' }} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
