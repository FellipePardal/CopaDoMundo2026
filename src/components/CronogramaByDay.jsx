import React, { useState, useMemo } from 'react'
import { CRONOGRAMA_RIO, FASES } from '../data/items.js'
import { fmt } from '../data/utils.js'

function AddServicoPicker({ items, categorias = [], dia, onAddExisting, onAddNew, onAddCategoria, onClose }) {
  const [modo, setModo] = useState('pick') // 'pick' | 'new'
  const [sel, setSel]   = useState('')
  const [novo, setNovo] = useState({ cat: '', det: '', valorUn: '' })
  const [addingCat, setAddingCat] = useState(false)
  const [novaCat, setNovaCat]     = useState('')

  const disponiveis = items.filter(i => !((i.dias || []).includes(dia)))

  if (modo === 'new') {
    return (
      <div style={{
        padding: 12, background: 'var(--surface2)',
        border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
        marginTop: 6,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 8, marginBottom: 8 }}>
          {addingCat ? (
            <div style={{ display: 'flex', gap: 4 }}>
              <input autoFocus placeholder="Nova categoria"
                value={novaCat}
                onChange={e => setNovaCat(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const v = novaCat.trim()
                    if (v) { onAddCategoria && onAddCategoria(v); setNovo({ ...novo, cat: v }) }
                    setAddingCat(false); setNovaCat('')
                  }
                  if (e.key === 'Escape') { setAddingCat(false); setNovaCat('') }
                }}
                style={{ flex: 1, fontSize: 12, padding: '6px 8px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text)' }} />
              <button onClick={() => { setAddingCat(false); setNovaCat('') }} style={{
                padding: '0 8px', fontSize: 11, border: '1px solid var(--border)',
                background: 'var(--surface2)', color: 'var(--muted)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}>✕</button>
            </div>
          ) : (
            <select value={novo.cat}
              onChange={e => {
                if (e.target.value === '__add__') setAddingCat(true)
                else setNovo({ ...novo, cat: e.target.value })
              }}
              style={{ fontSize: 12, padding: '6px 8px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text)' }}>
              <option value="">Categoria...</option>
              {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
              <option value="__add__">+ Nova categoria</option>
            </select>
          )}
          <input placeholder="Descrição"
            value={novo.det}
            onChange={e => setNovo({ ...novo, det: e.target.value })}
            style={{ fontSize: 12, padding: '6px 8px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)' }} />
          <input type="number" step="0.01" placeholder="Valor/dia (R$)"
            value={novo.valorUn}
            onChange={e => setNovo({ ...novo, valorUn: e.target.value })}
            style={{ fontSize: 12, padding: '6px 8px', textAlign: 'right',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)',
              fontFamily: 'var(--mono)' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '5px 12px', fontSize: 11.5, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--muted)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={() => {
            const valor = parseFloat((novo.valorUn + '').replace(',', '.')) || 0
            onAddNew({ cat: novo.cat.trim(), det: novo.det.trim(), valorUn: valor })
          }} style={{
            padding: '5px 14px', fontSize: 11.5, fontWeight: 600,
            border: '1px solid rgba(74,158,219,0.35)',
            background: 'rgba(74,158,219,0.12)', color: '#4A9EDB',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          }}>Criar</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: 10, background: 'var(--surface2)',
      border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
      marginTop: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
    }}>
      <select value={sel} onChange={e => setSel(e.target.value)} style={{
        flex: 1, minWidth: 180, fontSize: 12, padding: '6px 8px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
      }}>
        <option value="">Selecionar item existente...</option>
        {disponiveis.map(i => (
          <option key={i.id} value={i.id}>
            {(i.cat || '—')} · {(i.det || 'sem descrição')}
          </option>
        ))}
      </select>
      <button disabled={!sel} onClick={() => sel && onAddExisting(Number(sel))} style={{
        padding: '6px 12px', fontSize: 11.5, fontWeight: 600,
        border: '1px solid rgba(101,179,46,0.35)',
        background: sel ? 'rgba(101,179,46,0.12)' : 'var(--surface)',
        color: sel ? '#65B32E' : 'var(--muted2)',
        borderRadius: 'var(--radius-sm)',
        cursor: sel ? 'pointer' : 'not-allowed',
        opacity: sel ? 1 : 0.6,
      }}>Adicionar</button>
      <span style={{ color: 'var(--muted2)', fontSize: 11 }}>ou</span>
      <button onClick={() => setModo('new')} style={{
        padding: '6px 12px', fontSize: 11.5, fontWeight: 600,
        border: '1px solid rgba(74,158,219,0.35)',
        background: 'rgba(74,158,219,0.12)', color: '#4A9EDB',
        borderRadius: 'var(--radius-sm)', cursor: 'pointer',
      }}>+ Novo serviço</button>
      <button onClick={onClose} style={{
        padding: '6px 10px', fontSize: 11.5, border: '1px solid var(--border)',
        background: 'transparent', color: 'var(--muted)',
        borderRadius: 'var(--radius-sm)', cursor: 'pointer',
      }}>✕</button>
    </div>
  )
}

export default function CronogramaByDay({ items, updateItemMulti, addItem, removeItem, categorias = [], addCategoria, isMobile }) {
  const [picking, setPicking] = useState(null) // dia sendo editado

  const byDay = useMemo(() => {
    const map = {}
    CRONOGRAMA_RIO.forEach(d => { map[d.dia] = [] })
    items.forEach(i => {
      (i.dias || []).forEach(d => {
        if (map[d]) map[d].push(i)
      })
    })
    return map
  }, [items])

  const totalGeral = useMemo(() => {
    const diasGastoTotal = items.reduce((s, i) =>
      s + (i.dias || []).length * (i.valorUn || 0), 0)
    return Math.round(diasGastoTotal * 100) / 100
  }, [items])

  async function addExisting(dia, itemId) {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const dias = Array.isArray(item.dias) ? item.dias : []
    if (dias.includes(dia)) return
    const novoDias = [...dias, dia].sort((a, b) => a - b)
    await updateItemMulti(item.id, {
      dias:      novoDias,
      qtd:       novoDias.length,
      orcado:    Math.round(novoDias.length * (item.valorUn     || 0) * 100) / 100,
      realizado: Math.round(novoDias.length * (item.valorUnReal || 0) * 100) / 100,
    })
    setPicking(null)
  }

  async function addNew(dia, data) {
    const valorUn = data.valorUn || 0
    const orcado  = Math.round(valorUn * 100) / 100
    const created = await addItem('', {
      cat:     data.cat,
      det:     data.det,
      valorUn,
      qtd:     1,
      orcado,
      dias:    [dia],
    })
    if (!created) return
    setPicking(null)
  }

  async function removerDia(item, dia) {
    const dias = (item.dias || []).filter(d => d !== dia)
    await updateItemMulti(item.id, {
      dias,
      qtd:       dias.length,
      orcado:    Math.round(dias.length * (item.valorUn     || 0) * 100) / 100,
      realizado: Math.round(dias.length * (item.valorUnReal || 0) * 100) / 100,
    })
  }

  return (
    <div>
      {/* Legenda */}
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
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
          Total geral (diárias × valor): <strong style={{ color: 'var(--text)',
            fontFamily: 'var(--mono)' }}>{fmt(totalGeral)}</strong>
        </div>
      </div>

      {/* Grid de dias */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 12,
      }}>
        {CRONOGRAMA_RIO.map(d => {
          const color = FASES[d.fase]?.color || '#888'
          const servicos = byDay[d.dia] || []
          const totalDia = servicos.reduce((s, i) => s + (i.valorUn || 0), 0)
          const isPicking = picking === d.dia

          return (
            <div key={d.dia} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              borderLeft: `4px solid ${color}`,
              padding: '14px 16px',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)',
                      fontWeight: 700, color: 'var(--muted)' }}>DIA {d.dia}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                      {d.diaSemana} · {d.data}
                    </span>
                  </div>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                    fontSize: 10, fontWeight: 700,
                    background: `${color}22`, color,
                    border: `1px solid ${color}55`,
                  }}>{d.fase}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)',
                  fontFamily: 'var(--mono)', textAlign: 'right' }}>
                  <div>{servicos.length} {servicos.length === 1 ? 'serviço' : 'serviços'}</div>
                  <div style={{ color: 'var(--text)', fontWeight: 700 }}>{fmt(totalDia)}</div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10,
                lineHeight: 1.3, fontStyle: 'italic' }}>{d.desc}</div>

              {/* Lista de serviços */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {servicos.length === 0 && !isPicking && (
                  <div style={{ fontSize: 11, color: 'var(--muted2)', padding: '6px 0',
                    fontStyle: 'italic' }}>
                    Nenhum serviço neste dia.
                  </div>
                )}

                {servicos.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.det || <span style={{ color: 'var(--muted2)', fontStyle: 'italic' }}>
                          sem descrição
                        </span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                        {item.cat || '—'}
                        {item.fornecedores ? <> · <span style={{ color: 'var(--text2)' }}>{item.fornecedores}</span></> : null}
                        {' · '}{fmt(item.valorUn)}/dia
                      </div>
                    </div>
                    <button onClick={() => removerDia(item, d.dia)}
                      title="Remover deste dia" style={{
                        border: 'none', background: 'transparent', color: '#E05252',
                        fontSize: 13, cursor: 'pointer', padding: 2,
                      }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Adicionar */}
              {isPicking ? (
                <AddServicoPicker
                  items={items}
                  categorias={categorias}
                  dia={d.dia}
                  onAddExisting={(itemId) => addExisting(d.dia, itemId)}
                  onAddNew={(data) => addNew(d.dia, data)}
                  onAddCategoria={addCategoria}
                  onClose={() => setPicking(null)}
                />
              ) : (
                <button onClick={() => setPicking(d.dia)} style={{
                  marginTop: 8, padding: '6px 10px',
                  fontSize: 11.5, fontWeight: 500,
                  border: '1px dashed var(--border)',
                  background: 'transparent', color: 'var(--muted)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                }}>+ Adicionar serviço</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
