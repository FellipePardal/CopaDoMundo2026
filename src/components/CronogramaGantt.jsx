import React, { useMemo } from 'react'
import { CRONOGRAMA_RIO, FASES } from '../data/items.js'
import { fmt } from '../data/utils.js'

const DAY_COL_W = 48

export default function CronogramaGantt({ items, updateItemMulti, addItem, removeItem, isMobile }) {
  const totals = useMemo(() => ({
    orcado:    items.reduce((s, i) => s + (i.orcado    || 0), 0),
    realizado: items.reduce((s, i) => s + (i.realizado || 0), 0),
  }), [items])

  function toggleDia(item, dia) {
    const atual = Array.isArray(item.dias) ? item.dias : []
    const novo  = atual.includes(dia)
      ? atual.filter(d => d !== dia)
      : [...atual, dia].sort((a, b) => a - b)
    const qtd = novo.length
    const orcado    = Math.round(qtd * (item.valorUn     || 0) * 100) / 100
    const realizado = Math.round(qtd * (item.valorUnReal || 0) * 100) / 100
    updateItemMulti(item.id, { dias: novo, qtd, orcado, realizado })
  }

  return (
    <div>
      {/* Legenda de fases */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        padding: '12px 16px', marginBottom: 14,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--muted)' }}>Fases</span>
        {Object.entries(FASES).map(([nome, { color }]) => (
          <span key={nome} style={{ display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11.5, color: 'var(--text2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            {nome}
          </span>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={() => addItem('')} style={{
            padding: '7px 16px', borderRadius: 'var(--radius-sm)',
            fontSize: 12, fontWeight: 600,
            background: 'rgba(74,158,219,0.12)', color: '#4A9EDB',
            border: '1px solid rgba(74,158,219,0.35)', cursor: 'pointer',
          }}>+ Novo item</button>
        </div>
      </div>

      {/* Gantt */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
          <table style={{
            borderCollapse: 'collapse',
            minWidth: 260 + CRONOGRAMA_RIO.length * DAY_COL_W + 280,
            width: '100%',
          }}>
            <thead>
              <tr>
                <th style={{
                  position: 'sticky', left: 0, top: 0, zIndex: 3,
                  background: 'var(--surface2)',
                  padding: '9px 12px', fontSize: 10, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: 'var(--muted)', textAlign: 'left',
                  borderBottom: '2px solid var(--border)',
                  borderRight: '1px solid var(--border)',
                  minWidth: 260,
                }}>Item</th>

                {CRONOGRAMA_RIO.map(d => {
                  const color = FASES[d.fase]?.color || '#888'
                  return (
                    <th key={d.dia} title={`${d.diaSemana} ${d.data} — ${d.fase}: ${d.desc}`}
                      style={{
                        position: 'sticky', top: 0, zIndex: 2,
                        background: 'var(--surface2)',
                        padding: '4px 2px',
                        fontSize: 10, fontWeight: 600,
                        color: 'var(--text2)',
                        borderBottom: '2px solid var(--border)',
                        borderLeft: '1px solid var(--border)',
                        minWidth: DAY_COL_W, width: DAY_COL_W,
                        textAlign: 'center',
                      }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
                        color: 'var(--text)' }}>{d.dia}</div>
                      <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1 }}>
                        {d.diaSemana}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--muted2)',
                        fontFamily: 'var(--mono)' }}>{d.data.split(' ')[0]}</div>
                      <div style={{ height: 3, background: color, marginTop: 4,
                        borderRadius: 2 }} />
                    </th>
                  )
                })}

                {['Diárias','Valor/Dia','Orçado','Real.','Ações'].map(h => (
                  <th key={h} style={{
                    position: 'sticky', top: 0, zIndex: 2,
                    background: 'var(--surface2)',
                    padding: '9px 10px', fontSize: 10, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'var(--muted)',
                    borderBottom: '2px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                    textAlign: h === 'Ações' ? 'center' : 'right',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const dias   = Array.isArray(item.dias) ? item.dias : []
                const saldo  = (item.orcado || 0) - (item.realizado || 0)
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{
                      position: 'sticky', left: 0, zIndex: 1,
                      background: 'var(--surface)',
                      padding: '9px 12px',
                      borderRight: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)',
                        lineHeight: 1.3, marginBottom: 2 }}>
                        {item.det || <span style={{ color: 'var(--muted2)', fontStyle: 'italic' }}>
                          (sem descrição)
                        </span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                        {item.cat || 'sem categoria'}
                      </div>
                    </td>

                    {CRONOGRAMA_RIO.map(d => {
                      const active = dias.includes(d.dia)
                      const color  = FASES[d.fase]?.color || '#888'
                      return (
                        <td key={d.dia}
                          onClick={() => toggleDia(item, d.dia)}
                          title={`${d.diaSemana} ${d.data} — ${d.fase}`}
                          style={{
                            padding: 0, width: DAY_COL_W, minWidth: DAY_COL_W,
                            borderLeft: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                            textAlign: 'center', cursor: 'pointer',
                            background: active ? color : 'transparent',
                            transition: 'background 0.1s',
                            userSelect: 'none',
                          }}
                          onMouseEnter={e => {
                            if (!active) e.currentTarget.style.background = `${color}22`
                          }}
                          onMouseLeave={e => {
                            if (!active) e.currentTarget.style.background = 'transparent'
                          }}>
                          <div style={{ height: 34, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700,
                            color: active ? '#fff' : 'var(--muted2)',
                            fontFamily: 'var(--mono)',
                          }}>
                            {active ? '●' : '·'}
                          </div>
                        </td>
                      )
                    })}

                    <td style={{
                      padding: '9px 10px', textAlign: 'right',
                      fontFamily: 'var(--mono)', fontSize: 12.5, fontWeight: 700,
                      color: dias.length > 0 ? 'var(--text)' : 'var(--muted2)',
                      borderLeft: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>{dias.length || '—'}</td>

                    <td style={{
                      padding: '6px 8px', textAlign: 'right',
                      borderLeft: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <input type="number" step="0.01"
                        defaultValue={item.valorUn || ''}
                        onBlur={e => {
                          const v = parseFloat((e.target.value + '').replace(',', '.')) || 0
                          const qtd = dias.length
                          updateItemMulti(item.id, {
                            valorUn: v,
                            orcado: Math.round(qtd * v * 100) / 100,
                          })
                        }}
                        style={{
                          width: 100, fontSize: 12, padding: '5px 6px',
                          background: 'var(--surface2)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                          fontFamily: 'var(--mono)', textAlign: 'right',
                        }} />
                    </td>

                    <td style={{
                      padding: '9px 10px', textAlign: 'right',
                      fontFamily: 'var(--mono)', fontSize: 12.5, fontWeight: 700,
                      color: 'var(--text)',
                      borderLeft: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>{fmt(item.orcado)}</td>

                    <td style={{
                      padding: '9px 10px', textAlign: 'right',
                      fontFamily: 'var(--mono)', fontSize: 12,
                      color: item.realizado > 0 ? '#65B32E' : 'var(--muted2)',
                      borderLeft: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      {item.realizado > 0 ? fmt(item.realizado) : '—'}
                    </td>

                    <td style={{
                      padding: '9px 10px', textAlign: 'center',
                      borderLeft: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <button onClick={() => removeItem(item.id)} title="Remover" style={{
                        border: 'none', background: 'transparent', color: '#E05252',
                        fontSize: 14, cursor: 'pointer', padding: 4,
                      }}>✕</button>
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={CRONOGRAMA_RIO.length + 6} style={{
                    padding: '40px', textAlign: 'center', color: 'var(--muted)',
                    fontSize: 13,
                  }}>
                    Nenhum item. Cadastre itens na aba <strong>Itens</strong> ou clique em <strong>+ Novo item</strong> acima.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--surface2)' }}>
                <td style={{
                  position: 'sticky', left: 0,
                  background: 'var(--surface2)',
                  padding: '10px 12px', fontSize: 12, fontWeight: 700,
                  color: 'var(--muted)',
                  borderTop: '2px solid var(--border)',
                  borderRight: '1px solid var(--border)',
                }}>
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </td>
                <td colSpan={CRONOGRAMA_RIO.length + 2}
                  style={{ borderTop: '2px solid var(--border)' }} />
                <td style={{
                  padding: '10px 10px', textAlign: 'right', fontSize: 13,
                  fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text)',
                  borderTop: '2px solid var(--border)',
                  borderLeft: '1px solid var(--border)',
                }}>{fmt(totals.orcado)}</td>
                <td style={{
                  padding: '10px 10px', textAlign: 'right', fontSize: 13,
                  fontWeight: 700, fontFamily: 'var(--mono)', color: '#65B32E',
                  borderTop: '2px solid var(--border)',
                  borderLeft: '1px solid var(--border)',
                }}>{fmt(totals.realizado)}</td>
                <td style={{ borderTop: '2px solid var(--border)' }} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div style={{
        marginTop: 10, fontSize: 11, color: 'var(--muted)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span>Clique numa célula para marcar o item como ativo naquele dia. Diárias e Orçado são calculados automaticamente.</span>
      </div>
    </div>
  )
}
