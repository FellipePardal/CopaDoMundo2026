import React, { useState, useMemo } from 'react'
import ItemRow from './ItemRow.jsx'
import { fmt } from '../data/utils.js'
import { INITIAL_ITEMS } from '../data/items.js'


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

export default function ItemsTable({ items, updateItem, addItem, removeItem, isMobile }) {
  const [filterResp,   setFilterResp]   = useState('Todos')
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [filterMoeda,  setFilterMoeda]  = useState('Todas')
  const [search,       setSearch]       = useState('')
  const [showTaxCols,  setShowTaxCols]  = useState(false)

  // Categorias únicas extraídas dos dados iniciais + itens atuais
  const categories = useMemo(() => {
    const set = new Set()
    INITIAL_ITEMS.forEach(i => { if (i.cat) set.add(i.cat) })
    items.forEach(i => { if (i.cat) set.add(i.cat) })
    return [...set].sort()
  }, [items])

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
        display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
        marginBottom: 14, padding: isMobile ? '12px 14px' : '14px 18px',
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <input placeholder="Buscar..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: isMobile ? '100%' : 220 }} />

        {isMobile ? (
          /* Mobile: filtros em linha compacta */
          <>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', width: '100%' }}>
              {['Todos','João Crispim','Ivan Souza'].map(o => (
                <Pill key={o}
                  label={o === 'João Crispim' ? 'JC' : o === 'Ivan Souza' ? 'IV' : 'Todos'}
                  active={filterResp === o} onClick={() => setFilterResp(o)} />
              ))}
              <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 2px' }} />
              {['Todas','Dólar','Real'].map(o => (
                <Pill key={o} label={o === 'Todas' ? 'Todos' : o === 'Dólar' ? 'USD' : 'BRL'}
                  active={filterMoeda === o} onClick={() => setFilterMoeda(o)} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', width: '100%' }}>
              {['Todos','Pendente','Pago','Aprovado / a pagar','Em negociação'].map(o => (
                <Pill key={o}
                  label={o === 'Aprovado / a pagar' ? 'Aprovado' : o === 'Em negociação' ? 'Negoc.' : o}
                  active={filterStatus === o} onClick={() => setFilterStatus(o)} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button onClick={() => addItem('João Crispim')} style={{
                flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                fontSize: 12, fontWeight: 600,
                background: 'rgba(101,179,46,0.12)', color: '#65B32E',
                border: '1px solid rgba(101,179,46,0.35)', cursor: 'pointer',
              }}>+ João Crispim</button>
              <button onClick={() => addItem('Ivan Souza')} style={{
                flex: 1, padding: '8px', borderRadius: 'var(--radius-sm)',
                fontSize: 12, fontWeight: 600,
                background: 'rgba(74,158,219,0.12)', color: '#4A9EDB',
                border: '1px solid rgba(74,158,219,0.35)', cursor: 'pointer',
              }}>+ Ivan Souza</button>
            </div>
          </>
        ) : (
          /* Desktop: filtros normais */
          <>
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
          </>
        )}
      </div>

      {/* Mobile: cards */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-sm)',
              borderLeft: `3px solid ${item.resp === 'João Crispim' ? '#65B32E' : '#4A9EDB'}`,
            }}>
              {/* Header do card */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: item.resp === 'João Crispim'
                        ? 'rgba(101,179,46,0.12)' : 'rgba(74,158,219,0.12)',
                      color: item.resp === 'João Crispim' ? '#65B32E' : '#4A9EDB',
                      border: `1px solid ${item.resp === 'João Crispim'
                        ? 'rgba(101,179,46,0.30)' : 'rgba(74,158,219,0.30)'}`,
                    }}>
                      {item.resp === 'João Crispim' ? 'JC' : 'IV'}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{item.cat}</span>
                    <span style={{
                      padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700,
                      background: item.moeda === 'Dólar' ? 'rgba(74,158,219,0.12)' : 'rgba(101,179,46,0.12)',
                      color: item.moeda === 'Dólar' ? '#4A9EDB' : '#65B32E',
                    }}>
                      {item.moeda === 'Dólar' ? 'USD' : 'BRL'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)',
                    lineHeight: 1.3 }}>
                    {item.det}
                  </div>
                </div>
              </div>

              {/* Valores */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 2 }}>Orçado</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                    color: 'var(--text)' }}>{fmt(item.orcado)}</div>
                </div>
                {item.imposto > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Imposto ({(item.aliq*100).toFixed(0)}%)</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: '#F5A623' }}>{fmt(item.imposto)}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 2 }}>Realizado</div>
                  <input
                    type="number" step="0.01"
                    defaultValue={item.realizado || ''}
                    onBlur={e => {
                      const v = parseFloat(e.target.value.replace(',','.')) || 0
                      updateItem(item.id, 'realizado', v)
                    }}
                    placeholder="0"
                    style={{
                      width: '100%', fontSize: 13, fontFamily: 'var(--mono)',
                      padding: '5px 8px', background: 'var(--surface2)',
                      border: '1px solid var(--border)', color: 'var(--text)',
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 2 }}>Status</div>
                  <select
                    value={item.status}
                    onChange={e => updateItem(item.id, 'status', e.target.value)}
                    style={{
                      width: '100%', fontSize: 12, padding: '5px 6px',
                      background: 'var(--surface2)', border: '1px solid var(--border)',
                      color: 'var(--text)', borderRadius: 6,
                    }}
                  >
                    {[
                      { value: '', label: 'Pendente' },
                      { value: 'Pago', label: 'Pago' },
                      { value: 'Aprovado / a pagar', label: 'Aprovado / a pagar' },
                      { value: 'Em negociação', label: 'Em negociação' },
                      { value: 'Cancelado', label: 'Cancelado' },
                    ].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* % execução */}
              {item.pctExec > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    marginBottom: 4, fontSize: 11 }}>
                    <span style={{ color: 'var(--muted)' }}>Execução</span>
                    <span style={{ fontWeight: 700, color: '#65B32E',
                      fontFamily: 'var(--mono)' }}>{item.pctExec.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surface3)',
                    borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: '#65B32E',
                      width: `${Math.min(100, item.pctExec)}%` }} />
                  </div>
                </div>
              )}

              {/* Observações */}
              <input
                value={item.obs || ''}
                onChange={e => updateItem(item.id, 'obs', e.target.value)}
                placeholder="Observações..."
                style={{
                  width: '100%', fontSize: 12,
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center',
              color: 'var(--muted)', fontSize: 13 }}>
              Nenhum item encontrado.
            </div>
          )}

          {/* Totais mobile */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '14px 16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 10 }}>
              {filtered.length} itens exibidos
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Orçado',     val: totals.orcado,    color: 'var(--text)' },
                { label: 'Imposto',    val: totals.imposto,   color: '#F5A623'     },
                { label: 'Sem Imp.',   val: totals.semImp,    color: 'var(--muted)'},
                { label: 'Realizado',  val: totals.realizado, color: '#65B32E'     },
              ].map((t, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                    color: t.color }}>{fmt(t.val)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: tabela */
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
                  <TH>Fornecedores</TH>
                  <TH>Detalhamento</TH>
                  <TH align="center">Moeda</TH>
                  <TH align="center">Qtd</TH>
                  <TH align="center">Alíq.</TH>
                  <TH align="right">Orçado (R$)</TH>
                  <TH align="center" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <span
                      onClick={() => setShowTaxCols(v => !v)}
                      title={showTaxCols ? 'Ocultar colunas de imposto' : 'Expandir colunas de imposto'}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <span style={{
                        display: 'inline-block', fontSize: 9,
                        transform: showTaxCols ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s',
                      }}>▶</span>
                      Impostos
                    </span>
                  </TH>
                  {showTaxCols && <TH align="right">Imposto (R$)</TH>}
                  {showTaxCols && <TH align="right">Sem Imposto (R$)</TH>}
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
                    onUpdate={updateItem} onRemove={removeItem}
                    categories={categories} showTaxCols={showTaxCols} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={showTaxCols ? 18 : 16} style={{ padding: '40px', textAlign: 'center',
                      color: 'var(--muted)', fontSize: 13 }}>
                      Nenhum item encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--surface2)' }}>
                  <td colSpan={8} style={{ padding: '11px 13px', fontSize: 12,
                    fontWeight: 600, color: 'var(--muted)',
                    borderTop: '2px solid var(--border)' }}>
                    {filtered.length} {filtered.length === 1 ? 'item' : 'itens'} exibidos
                  </td>
                  <td style={{ padding: '11px 13px', textAlign: 'right',
                    fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                    color: 'var(--text)', borderTop: '2px solid var(--border)' }}>
                    {fmt(totals.orcado)}
                  </td>
                  {/* Coluna do toggle "Impostos" — vazia no footer */}
                  <td style={{ borderTop: '2px solid var(--border)' }} />
                  {showTaxCols && (
                    <td style={{ padding: '11px 13px', textAlign: 'right',
                      fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: '#F5A623', borderTop: '2px solid var(--border)' }}>
                      {fmt(totals.imposto)}
                    </td>
                  )}
                  {showTaxCols && (
                    <td style={{ padding: '11px 13px', textAlign: 'right',
                      fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: 'var(--muted)', borderTop: '2px solid var(--border)' }}>
                      {fmt(totals.semImp)}
                    </td>
                  )}
                  <td style={{ padding: '11px 13px', textAlign: 'right',
                    fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                    color: '#65B32E', borderTop: '2px solid var(--border)' }}>
                    {fmt(totals.realizado)}
                  </td>
                  <td colSpan={5} style={{ borderTop: '2px solid var(--border)' }} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
