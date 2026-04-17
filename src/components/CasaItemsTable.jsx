import React, { useState, useMemo } from 'react'
import { fmt, STATUS_OPTIONS } from '../data/utils.js'

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

const TD = ({ children, align = 'left', mono = false, style = {} }) => (
  <td style={{
    padding: '10px 13px', fontSize: 13, textAlign: align,
    fontFamily: mono ? 'var(--mono)' : 'var(--font)',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text2)', whiteSpace: 'nowrap',
    ...style,
  }}>{children}</td>
)

const inputStyle = {
  width: '100%', fontSize: 13, padding: '5px 8px',
  background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text)',
  fontFamily: 'var(--mono)',
}

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '5px 13px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
    border: `1px solid ${active ? '#4A9EDB' : 'var(--border)'}`,
    background: active ? 'rgba(74,158,219,0.12)' : 'transparent',
    color: active ? '#4A9EDB' : 'var(--muted)',
    cursor: 'pointer',
  }}>{label}</button>
)

function CategoriaSelect({ value, categorias, onChange, onAdd }) {
  const [adding, setAdding]   = useState(false)
  const [novoVal, setNovoVal] = useState('')

  if (adding) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          autoFocus
          value={novoVal}
          onChange={e => setNovoVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const v = novoVal.trim()
              if (v) { onAdd(v); onChange(v) }
              setAdding(false); setNovoVal('')
            }
            if (e.key === 'Escape') { setAdding(false); setNovoVal('') }
          }}
          placeholder="Nova categoria"
          style={{ ...inputStyle, fontFamily: 'var(--font)' }}
        />
        <button onClick={() => { setAdding(false); setNovoVal('') }} style={{
          padding: '0 8px', fontSize: 11, border: '1px solid var(--border)',
          background: 'var(--surface2)', color: 'var(--muted)',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer',
        }}>✕</button>
      </div>
    )
  }

  return (
    <select
      value={value || ''}
      onChange={e => {
        if (e.target.value === '__add__') setAdding(true)
        else onChange(e.target.value)
      }}
      style={{
        width: '100%', fontSize: 12.5, padding: '5px 8px',
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
      }}
    >
      <option value="">—</option>
      {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
      <option value="__add__">+ Nova categoria</option>
    </select>
  )
}

export default function CasaItemsTable({
  items, updateItem, addItem, removeItem,
  categorias, addCategoria, isMobile,
}) {
  const [filterCat,    setFilterCat]    = useState('Todas')
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [search,       setSearch]       = useState('')

  const filtered = useMemo(() => items.filter(i => {
    if (filterCat !== 'Todas' && i.cat !== filterCat) return false
    if (filterStatus !== 'Todos') {
      const s = i.status || 'Pendente'
      if (filterStatus === 'Pendente' ? (s !== '' && s !== 'Pendente') : s !== filterStatus) return false
    }
    if (search && !(i.det || '').toLowerCase().includes(search.toLowerCase()) &&
        !(i.cat || '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [items, filterCat, filterStatus, search])

  const totals = useMemo(() => ({
    orcado:    filtered.reduce((s, i) => s + (i.orcado    || 0), 0),
    realizado: filtered.reduce((s, i) => s + (i.realizado || 0), 0),
  }), [filtered])

  function handleNumberChange(id, field, raw) {
    const v = parseFloat((raw + '').replace(',', '.')) || 0
    updateItem(id, field, v)
  }

  // Valor/dia orçado → recomputa orçado total
  function handleValorChange(item, raw) {
    const v = parseFloat((raw + '').replace(',', '.')) || 0
    const diarias = (item.dias || []).length
    updateItem(item.id, 'valorUn', v)
    updateItem(item.id, 'orcado', Math.round(diarias * v * 100) / 100)
  }

  // Valor/dia realizado (pós-negociação) → recomputa realizado total
  function handleValorRealChange(item, raw) {
    const v = parseFloat((raw + '').replace(',', '.')) || 0
    const diarias = (item.dias || []).length
    updateItem(item.id, 'valorUnReal', v)
    updateItem(item.id, 'realizado', Math.round(diarias * v * 100) / 100)
  }

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

        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <Pill label="Todas" active={filterCat === 'Todas'} onClick={() => setFilterCat('Todas')} />
          {categorias.map(c => (
            <Pill key={c.id} label={c.nome} active={filterCat === c.nome} onClick={() => setFilterCat(c.nome)} />
          ))}
        </div>

        <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['Todos','Pendente','Pago','Aprovado / a pagar','Em negociação','Cancelado'].map(o => (
            <Pill key={o} label={o} active={filterStatus === o} onClick={() => setFilterStatus(o)} />
          ))}
        </div>

        <div style={{ marginLeft: isMobile ? 0 : 'auto', width: isMobile ? '100%' : 'auto' }}>
          <button onClick={() => addItem('')} style={{
            width: isMobile ? '100%' : 'auto',
            padding: '7px 16px', borderRadius: 'var(--radius-sm)',
            fontSize: 12, fontWeight: 600,
            background: 'rgba(74,158,219,0.12)', color: '#4A9EDB',
            border: '1px solid rgba(74,158,219,0.35)', cursor: 'pointer',
          }}>+ Novo item</button>
        </div>
      </div>

      {isMobile ? (
        /* MOBILE: cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(item => {
            const saldo = (item.orcado || 0) - (item.realizado || 0)
            return (
              <div key={item.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '14px 16px',
                boxShadow: 'var(--shadow-sm)', borderLeft: '3px solid #4A9EDB',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.cat || 'Sem categoria'}</div>
                  <button onClick={() => removeItem(item.id)} style={{
                    border: 'none', background: 'transparent', color: '#E05252',
                    fontSize: 14, cursor: 'pointer',
                  }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Categoria</div>
                    <CategoriaSelect value={item.cat} categorias={categorias}
                      onChange={v => updateItem(item.id, 'cat', v)} onAdd={addCategoria} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Fornecedor</div>
                    <input
                      defaultValue={item.fornecedores || ''}
                      onBlur={e => updateItem(item.id, 'fornecedores', e.target.value)}
                      placeholder="—"
                      style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 2 }}>Detalhamento</div>
                  <input
                    defaultValue={item.det || ''}
                    onBlur={e => updateItem(item.id, 'det', e.target.value)}
                    placeholder="Ex: Minidrone com piloto"
                    style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Diárias</div>
                    <div style={{
                      fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: (item.dias || []).length > 0 ? 'var(--text)' : 'var(--muted2)',
                      padding: '5px 0',
                    }}>{(item.dias || []).length || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Valor/Dia (R$)</div>
                    <input type="number" step="0.01"
                      defaultValue={item.valorUn || ''}
                      onBlur={e => handleValorChange(item, e.target.value)}
                      style={inputStyle} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Orçado</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: (item.dias || []).length > 0 ? 'var(--text)' : 'var(--muted2)',
                      padding: '5px 0' }}>
                      {(item.dias || []).length > 0 ? fmt(item.orcado) : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Valor/Dia Real (R$)</div>
                    <input type="number" step="0.01"
                      defaultValue={item.valorUnReal || ''}
                      onBlur={e => handleValorRealChange(item, e.target.value)}
                      placeholder="Pós-negociação"
                      style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Realizado</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: (item.dias || []).length > 0 && item.valorUnReal > 0 ? '#65B32E' : 'var(--muted2)',
                      padding: '5px 0' }}>
                      {(item.dias || []).length > 0 && item.valorUnReal > 0 ? fmt(item.realizado) : '—'}
                    </div>
                  </div>
                  <div />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Saldo</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                      color: saldo < 0 ? '#E05252' : 'var(--text2)', padding: '5px 0' }}>
                      {fmt(saldo)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                      letterSpacing: '0.06em', marginBottom: 2 }}>Status</div>
                    <select value={item.status || ''}
                      onChange={e => updateItem(item.id, 'status', e.target.value)}
                      style={{ width: '100%', fontSize: 12, padding: '5px 6px',
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        color: 'var(--text)', borderRadius: 6 }}>
                      {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <input
                  defaultValue={item.obs || ''}
                  onBlur={e => updateItem(item.id, 'obs', e.target.value)}
                  placeholder="Observações..."
                  style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              Nenhum item. Clique em <strong>+ Novo item</strong>.
            </div>
          )}

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '14px 16px', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 10 }}>
              {filtered.length} itens
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                  letterSpacing: '0.06em', marginBottom: 2 }}>Orçado</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                  color: 'var(--text)' }}>{fmt(totals.orcado)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase',
                  letterSpacing: '0.06em', marginBottom: 2 }}>Realizado</div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)',
                  color: '#65B32E' }}>{fmt(totals.realizado)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP: tabela */
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 260px)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1300 }}>
              <thead>
                <tr>
                  <TH align="center">Ações</TH>
                  <TH>Categoria</TH>
                  <TH>Fornecedor</TH>
                  <TH>Detalhamento</TH>
                  <TH align="right">Diárias</TH>
                  <TH align="right">Valor/Dia (R$)</TH>
                  <TH align="right">Orçado (R$)</TH>
                  <TH align="right">Valor/Dia Real (R$)</TH>
                  <TH align="right">Realizado (R$)</TH>
                  <TH align="right">Saldo (R$)</TH>
                  <TH>Status</TH>
                  <TH>Observações</TH>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const saldo = (item.orcado || 0) - (item.realizado || 0)
                  return (
                    <tr key={item.id}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      style={{ transition: 'background 0.1s' }}>
                      <TD align="center" style={{ width: 40 }}>
                        <button onClick={() => removeItem(item.id)} title="Remover" style={{
                          border: 'none', background: 'transparent', color: '#E05252',
                          fontSize: 14, cursor: 'pointer', padding: 4,
                        }}>✕</button>
                      </TD>
                      <TD style={{ minWidth: 160 }}>
                        <CategoriaSelect value={item.cat} categorias={categorias}
                          onChange={v => updateItem(item.id, 'cat', v)} onAdd={addCategoria} />
                      </TD>
                      <TD style={{ minWidth: 140 }}>
                        <input
                          defaultValue={item.fornecedores || ''}
                          onBlur={e => updateItem(item.id, 'fornecedores', e.target.value)}
                          placeholder="Fornecedor"
                          style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
                      </TD>
                      <TD style={{ minWidth: 240 }}>
                        <input
                          defaultValue={item.det || ''}
                          onBlur={e => updateItem(item.id, 'det', e.target.value)}
                          placeholder="Descrição"
                          style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
                      </TD>
                      <TD align="right" style={{ width: 100 }} mono>
                        <span title={(item.dias || []).length > 0
                          ? `Dias: ${(item.dias || []).join(', ')}`
                          : 'Aloque dias na aba Cronograma ou Por Dia'}
                          style={{
                            fontWeight: 700,
                            color: (item.dias || []).length > 0 ? 'var(--text)' : 'var(--muted2)',
                          }}>
                          {(item.dias || []).length || '—'}
                        </span>
                      </TD>
                      <TD align="right" style={{ width: 140 }}>
                        <input type="number" step="0.01"
                          defaultValue={item.valorUn || ''}
                          onBlur={e => handleValorChange(item, e.target.value)}
                          style={{ ...inputStyle, textAlign: 'right' }} />
                      </TD>
                      <TD align="right" mono style={{
                        fontWeight: 600,
                        color: (item.dias || []).length > 0 ? 'var(--text)' : 'var(--muted2)',
                      }}>
                        {(item.dias || []).length > 0 ? fmt(item.orcado) : '—'}
                      </TD>
                      <TD align="right" style={{ width: 140 }}>
                        <input type="number" step="0.01"
                          defaultValue={item.valorUnReal || ''}
                          onBlur={e => handleValorRealChange(item, e.target.value)}
                          placeholder="pós-negoc."
                          style={{ ...inputStyle, textAlign: 'right' }} />
                      </TD>
                      <TD align="right" mono style={{
                        fontWeight: 600,
                        color: (item.dias || []).length > 0 && item.valorUnReal > 0 ? '#65B32E' : 'var(--muted2)',
                      }}>
                        {(item.dias || []).length > 0 && item.valorUnReal > 0 ? fmt(item.realizado) : '—'}
                      </TD>
                      <TD align="right" mono style={{
                        fontWeight: 600,
                        color: item.realizado > 0 ? (saldo < 0 ? '#E05252' : 'var(--text2)') : 'var(--muted2)',
                      }}>
                        {item.realizado > 0 ? fmt(saldo) : '—'}
                      </TD>
                      <TD style={{ minWidth: 160 }}>
                        <select value={item.status || ''}
                          onChange={e => updateItem(item.id, 'status', e.target.value)}
                          style={{ width: '100%', fontSize: 12, padding: '5px 6px',
                            background: 'var(--surface2)', border: '1px solid var(--border)',
                            color: 'var(--text)', borderRadius: 6 }}>
                          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </TD>
                      <TD style={{ minWidth: 200 }}>
                        <input
                          defaultValue={item.obs || ''}
                          onBlur={e => updateItem(item.id, 'obs', e.target.value)}
                          placeholder="—"
                          style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
                      </TD>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={12} style={{ padding: '40px', textAlign: 'center',
                      color: 'var(--muted)', fontSize: 13 }}>
                      Nenhum item. Clique em <strong>+ Novo item</strong>.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--surface2)' }}>
                  <td colSpan={6} style={{ padding: '11px 13px', fontSize: 12,
                    fontWeight: 600, color: 'var(--muted)',
                    borderTop: '2px solid var(--border)' }}>
                    {filtered.length} {filtered.length === 1 ? 'item' : 'itens'}
                  </td>
                  <td style={{ padding: '11px 13px', textAlign: 'right', fontSize: 13,
                    fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--text)',
                    borderTop: '2px solid var(--border)' }}>
                    {fmt(totals.orcado)}
                  </td>
                  <td style={{ borderTop: '2px solid var(--border)' }} />
                  <td style={{ padding: '11px 13px', textAlign: 'right', fontSize: 13,
                    fontWeight: 700, fontFamily: 'var(--mono)', color: '#65B32E',
                    borderTop: '2px solid var(--border)' }}>
                    {fmt(totals.realizado)}
                  </td>
                  <td colSpan={3} style={{ borderTop: '2px solid var(--border)' }} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
