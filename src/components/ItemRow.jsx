import React, { useState } from 'react'
import { STATUS_OPTIONS, fmt, fmtAliq, fmtPct } from '../data/utils.js'
import { COTACAO } from '../data/items.js'

const TD = ({ children, align = 'left', mono = false, style = {} }) => (
  <td style={{
    padding: '11px 13px', fontSize: 13, textAlign: align,
    fontFamily: mono ? 'var(--mono)' : 'var(--font)',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text2)', whiteSpace: 'nowrap',
    background: 'transparent',
    ...style,
  }}>
    {children}
  </td>
)

function ComposicaoPanel({ item, onUpdate }) {
  const composicao = Array.isArray(item.composicao) ? item.composicao : []

  function persist(novo) {
    onUpdate(item.id, 'composicao', novo)
  }

  function updateComp(idx, field, raw) {
    const value = field === 'desc' ? raw : (parseFloat((raw + '').replace(',', '.')) || 0)
    const novo = composicao.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    persist(novo)
  }

  function addComp() {
    persist([...composicao, { desc: '', qtd: 1, valor: 0 }])
  }

  function removeComp(idx) {
    persist(composicao.filter((_, i) => i !== idx))
  }

  const soma    = composicao.reduce((s, c) => s + (Number(c.qtd) || 0) * (Number(c.valor) || 0), 0)
  const diff    = Math.round((soma - item.orcado) * 100) / 100
  const bate    = Math.abs(diff) < 0.01

  const thStyle = {
    padding: '6px 10px', fontSize: 10, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'var(--muted)', textAlign: 'left',
    borderBottom: '1px solid var(--border)',
  }
  const tdStyle = {
    padding: '4px 8px', fontSize: 12, color: 'var(--text2)',
    borderBottom: '1px solid var(--border)',
  }
  const inputStyle = {
    width: '100%', fontSize: 12, padding: '4px 7px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
    fontFamily: 'var(--mono)',
  }

  return (
    <div style={{ padding: '14px 22px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--muted)' }}>
          Composição — {item.det}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          {composicao.length} {composicao.length === 1 ? 'componente' : 'componentes'}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse',
        background: 'var(--surface)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)' }}>
        <thead>
          <tr>
            <th style={thStyle}>Descrição</th>
            <th style={{ ...thStyle, textAlign: 'right', width: 90 }}>Qtd</th>
            <th style={{ ...thStyle, textAlign: 'right', width: 150 }}>Valor Un (R$)</th>
            <th style={{ ...thStyle, textAlign: 'right', width: 150 }}>Total (R$)</th>
            <th style={{ ...thStyle, textAlign: 'center', width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {composicao.map((c, idx) => {
            const total = (Number(c.qtd) || 0) * (Number(c.valor) || 0)
            return (
              <tr key={idx}>
                <td style={{ ...tdStyle, minWidth: 200 }}>
                  <input
                    defaultValue={c.desc || ''}
                    onBlur={e => updateComp(idx, 'desc', e.target.value)}
                    placeholder="Ex: 10 câmeras 4K"
                    style={{ ...inputStyle, fontFamily: 'var(--font)' }} />
                </td>
                <td style={tdStyle}>
                  <input type="number" step="0.01"
                    defaultValue={c.qtd || ''}
                    onBlur={e => updateComp(idx, 'qtd', e.target.value)}
                    style={{ ...inputStyle, textAlign: 'right' }} />
                </td>
                <td style={tdStyle}>
                  <input type="number" step="0.01"
                    defaultValue={c.valor || ''}
                    onBlur={e => updateComp(idx, 'valor', e.target.value)}
                    style={{ ...inputStyle, textAlign: 'right' }} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'right',
                  fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--text)' }}>
                  {fmt(total)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button onClick={() => removeComp(idx)} title="Remover" style={{
                    border: 'none', background: 'transparent', color: '#E05252',
                    fontSize: 14, cursor: 'pointer', padding: 2,
                  }}>✕</button>
                </td>
              </tr>
            )
          })}
          {composicao.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...tdStyle, textAlign: 'center',
                color: 'var(--muted2)', fontStyle: 'italic', padding: '14px 10px' }}>
                Sem componentes ainda. Clique em + Adicionar.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ ...tdStyle, borderBottom: 'none', padding: '8px 10px' }}>
              <button onClick={addComp} style={{
                padding: '5px 12px', fontSize: 11.5, fontWeight: 600,
                background: 'rgba(101,179,46,0.12)', color: '#65B32E',
                border: '1px solid rgba(101,179,46,0.35)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}>+ Adicionar componente</button>
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', borderBottom: 'none',
              fontFamily: 'var(--mono)', fontWeight: 700,
              color: 'var(--text)', padding: '8px 10px' }}>
              {fmt(soma)}
            </td>
            <td style={{ borderBottom: 'none' }} />
          </tr>
          <tr>
            <td colSpan={3} style={{ ...tdStyle, borderBottom: 'none', padding: '2px 10px 10px',
              fontSize: 11, color: 'var(--muted)' }}>
              Soma deve bater com o orçado do item.
            </td>
            <td style={{ ...tdStyle, textAlign: 'right', borderBottom: 'none',
              padding: '2px 10px 10px', fontSize: 11, fontFamily: 'var(--mono)',
              color: bate ? '#65B32E' : '#E05252', fontWeight: 600 }}>
              {bate
                ? `✓ bate com ${fmt(item.orcado)}`
                : `Δ ${diff > 0 ? '+' : ''}${fmt(diff)} vs ${fmt(item.orcado)}`}
            </td>
            <td style={{ borderBottom: 'none' }} />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default function ItemRow({ item, onUpdate, onRemove, categories = [], showTaxCols = false }) {
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState({})
  const [addingCat, setAddingCat] = useState(false)
  const [newCat, setNewCat] = useState('')

  const compCount = Array.isArray(item.composicao) ? item.composicao.length : 0

  const diff = item.realizado > 0 ? Math.round(item.realizado - item.orcado) : null
  const diffColor = diff === null ? 'var(--muted2)'
    : diff === 0 ? 'var(--muted)' : diff < 0 ? '#65B32E' : '#E05252'

  function startEdit() {
    setDraft({
      det:          item.det,
      cat:          item.cat,
      fornecedores: item.fornecedores || '',
      orcado:       item.orcado,
      aliq:         item.aliq,
      qtd:          item.qtd,
      valorUn:      item.valorUn,
      realizadoUsd: item.realizadoUsd || (item.moeda === 'Dólar' ? item.valorUn * item.qtd : 0) || '',
      cotacaoReal:  item.cotacaoReal || '',
    })
    setEditing(true)
  }

  function saveEdit() {
    const toSave = { ...draft }
    if (toSave.realizadoUsd !== undefined)
      toSave.realizadoUsd = parseFloat(String(toSave.realizadoUsd).replace(',', '.')) || 0
    if (toSave.cotacaoReal !== undefined)
      toSave.cotacaoReal = parseFloat(String(toSave.cotacaoReal).replace(',', '.')) || 0
    Object.entries(toSave).forEach(([field, value]) => {
      onUpdate(item.id, field, value)
    })
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
    setDraft({})
    setAddingCat(false)
    setNewCat('')
  }

  function handleReal(e) {
    const v = parseFloat(e.target.value.replace(',', '.')) || 0
    onUpdate(item.id, 'realizado', v)
  }

  const rowBg = editing ? 'rgba(101,179,46,0.04)' : 'transparent'

  return (
    <React.Fragment>
    <tr
      style={{ transition: 'background 0.12s', background: rowBg }}
      onMouseEnter={e => { if (!editing) e.currentTarget.style.background = 'var(--surface2)' }}
      onMouseLeave={e => { if (!editing) e.currentTarget.style.background = 'transparent' }}
    >

      {/* AÇÕES — primeira coluna, sempre visível */}
      <TD>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {!item.isNew && (
            <button
              onClick={() => setExpanded(e => !e)}
              title={compCount > 0 ? `${compCount} componente(s) cadastrado(s)` : 'Detalhar composição'}
              style={{
                padding: '4px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                background: compCount > 0 ? 'rgba(74,158,219,0.12)' : 'var(--surface2)',
                color: compCount > 0 ? '#4A9EDB' : 'var(--muted)',
                border: `1px solid ${compCount > 0 ? 'rgba(74,158,219,0.30)' : 'var(--border)'}`,
                cursor: 'pointer', minWidth: 28, fontFamily: 'var(--mono)',
              }}>
              {expanded ? '▼' : '▶'}{compCount > 0 && ` ${compCount}`}
            </button>
          )}
          {item.isNew ? (
            <button onClick={() => onRemove(item.id)} style={{
              background: 'rgba(224,82,82,0.10)', color: '#E05252',
              border: '1px solid rgba(224,82,82,0.30)',
              borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
            }}>Remover</button>
          ) : editing ? (
            <>
              <button onClick={saveEdit} style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: 'rgba(101,179,46,0.15)', color: '#65B32E',
                border: '1px solid rgba(101,179,46,0.35)', cursor: 'pointer',
              }}>Salvar</button>
              <button onClick={cancelEdit} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 12,
                background: 'var(--surface2)', color: 'var(--muted)',
                border: '1px solid var(--border)', cursor: 'pointer',
              }}>✕</button>
            </>
          ) : (
            <button onClick={startEdit} style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: 'var(--surface2)', color: 'var(--muted)',
              border: '1px solid var(--border)', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>✏️ Editar</button>
          )}
        </div>
      </TD>

      {/* Responsável */}
      <TD>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: item.resp === 'João Crispim'
            ? 'rgba(101,179,46,0.12)' : 'rgba(74,158,219,0.12)',
          color: item.resp === 'João Crispim' ? '#65B32E' : '#4A9EDB',
          border: `1px solid ${item.resp === 'João Crispim'
            ? 'rgba(101,179,46,0.30)' : 'rgba(74,158,219,0.30)'}`,
        }}>
          {item.resp === 'João Crispim' ? 'JC' : 'IV'}
        </span>
      </TD>

      {/* Categoria */}
      <TD style={{ color: 'var(--muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {editing ? (
          addingCat ? (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <input
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                placeholder="Nova categoria..."
                autoFocus
                style={{ width: 110, fontSize: 12 }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newCat.trim()) {
                    setDraft(d => ({ ...d, cat: newCat.trim() }))
                    setAddingCat(false)
                    setNewCat('')
                  }
                  if (e.key === 'Escape') { setAddingCat(false); setNewCat('') }
                }}
              />
              <button onClick={() => {
                if (newCat.trim()) {
                  setDraft(d => ({ ...d, cat: newCat.trim() }))
                  setAddingCat(false)
                  setNewCat('')
                }
              }} style={{ fontSize: 11, padding: '2px 6px', cursor: 'pointer',
                background: 'rgba(101,179,46,0.15)', color: '#65B32E',
                border: '1px solid rgba(101,179,46,0.35)', borderRadius: 4 }}>✓</button>
              <button onClick={() => { setAddingCat(false); setNewCat('') }}
                style={{ fontSize: 11, padding: '2px 6px', cursor: 'pointer',
                  background: 'var(--surface2)', color: 'var(--muted)',
                  border: '1px solid var(--border)', borderRadius: 4 }}>✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <select
                value={draft.cat}
                onChange={e => {
                  if (e.target.value === '__add_new__') { setAddingCat(true); return }
                  setDraft(d => ({ ...d, cat: e.target.value }))
                }}
                style={{ width: 130, fontSize: 12, padding: '4px 6px',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text)', borderRadius: 6 }}
              >
                <option value="">— Selecionar —</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__add_new__">+ Nova categoria...</option>
              </select>
            </div>
          )
        ) : (
          <span title={item.cat}>{item.cat || '—'}</span>
        )}
      </TD>

      {/* Fornecedores */}
      <TD style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--muted)' }}>
        {editing
          ? <input value={draft.fornecedores || ''} onChange={e => setDraft(d => ({ ...d, fornecedores: e.target.value }))}
              style={{ width: 160, fontSize: 12 }} />
          : <span title={item.fornecedores}>{item.fornecedores || '—'}</span>}
      </TD>

      {/* Detalhamento */}
      <TD style={{ maxWidth: 270, overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
        {editing
          ? <input value={draft.det} onChange={e => setDraft(d => ({ ...d, det: e.target.value }))}
              style={{ width: 250, fontSize: 12 }} />
          : <span title={item.det}>{item.det}</span>}
      </TD>

      {/* Moeda */}
      <TD align="center">
        <select
          value={item.moeda}
          onChange={e => onUpdate(item.id, 'moeda', e.target.value)}
          style={{
            padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
            background: item.moeda === 'Dólar'
              ? 'rgba(74,158,219,0.12)' : 'rgba(101,179,46,0.12)',
            color: item.moeda === 'Dólar' ? '#4A9EDB' : '#65B32E',
            border: `1px solid ${item.moeda === 'Dólar'
              ? 'rgba(74,158,219,0.30)' : 'rgba(101,179,46,0.30)'}`,
            cursor: 'pointer',
            appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          }}
        >
          <option value="Dólar" style={{ background: 'var(--surface)', color: '#4A9EDB' }}>USD</option>
          <option value="Real" style={{ background: 'var(--surface)', color: '#65B32E' }}>BRL</option>
        </select>
      </TD>

      {/* Qtd */}
      <TD align="center" mono>
        {editing
          ? <input type="number" value={draft.qtd}
              onChange={e => setDraft(d => ({ ...d, qtd: parseFloat(e.target.value) || 1 }))}
              style={{ width: 50, textAlign: 'center', fontSize: 12 }} />
          : item.qtd}
      </TD>

      {/* Alíquota */}
      <TD align="center" mono style={{
        color: item.aliq > 0 ? '#F5A623' : 'var(--muted2)',
        fontWeight: item.aliq > 0 ? 600 : 400,
      }}>
        {editing
          ? <input type="number" step="0.01" value={(draft.aliq * 100).toFixed(2)}
              onChange={e => setDraft(d => ({ ...d, aliq: parseFloat(e.target.value) / 100 || 0 }))}
              style={{ width: 60, textAlign: 'center', fontSize: 12 }} />
          : fmtAliq(item.aliq)}
      </TD>

      {/* Orçado */}
      <TD align="right" mono>
        {editing
          ? <input type="number" value={draft.orcado}
              onChange={e => setDraft(d => ({ ...d, orcado: parseFloat(e.target.value) || 0 }))}
              style={{ width: 120, textAlign: 'right', fontSize: 12 }} />
          : <span style={{ fontWeight: 600, color: 'var(--text)' }}>{fmt(item.orcado)}</span>}
      </TD>

      {/* Placeholder da coluna toggle "Impostos" */}
      <TD />

      {/* Imposto */}
      {showTaxCols && (
        <TD align="right" mono style={{
          color: item.imposto > 0 ? '#F5A623' : 'var(--muted2)',
        }}>
          {item.imposto > 0 ? fmt(item.imposto) : '—'}
        </TD>
      )}

      {/* Sem Imposto */}
      {showTaxCols && (
        <TD align="right" mono style={{ color: 'var(--muted)' }}>
          {item.aliq > 0 ? fmt(item.semImp) : '—'}
        </TD>
      )}

      {/* Realizado */}
      <TD align="right">
        <input
          type="number"
          step="0.01"
          defaultValue={item.realizado || ''}
          onBlur={handleReal}
          placeholder="—"
          style={{
            width: 130, fontSize: 12, textAlign: 'right',
            fontFamily: 'var(--mono)',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            MozAppearance: 'textfield',
            appearance: 'textfield',
          }}
        />
      </TD>

      {/* Realizado USD — só para itens em dólar */}
      {item.moeda === 'Dólar' ? (
        <TD align="right" mono style={{ color: '#4A9EDB' }}>
          {editing
            ? <input
                type="text"
                inputMode="decimal"
                value={draft.realizadoUsd ?? ''}
                onChange={e => setDraft(d => ({ ...d, realizadoUsd: e.target.value }))}
                placeholder="—"
                style={{
                  width: 100, fontSize: 12, textAlign: 'right',
                  fontFamily: 'var(--mono)',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: '#4A9EDB',
                }}
              />
            : (item.realizadoUsd || item.valorUn * item.qtd || null)
              ? `$ ${Number(item.realizadoUsd || item.valorUn * item.qtd).toLocaleString('en-US')}`
              : '—'
          }
        </TD>
      ) : <TD align="center" style={{ color: 'var(--muted2)' }}>—</TD>}

      {/* Cotação Transação — só para itens em dólar */}
      {item.moeda === 'Dólar' ? (
        <TD align="right" mono>
          {editing
            ? <input
                type="text"
                inputMode="decimal"
                value={draft.cotacaoReal ?? ''}
                onChange={e => setDraft(d => ({ ...d, cotacaoReal: e.target.value }))}
                placeholder={String(COTACAO)}
                style={{
                  width: 75, fontSize: 12, textAlign: 'right',
                  fontFamily: 'var(--mono)',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
            : item.cotacaoReal ? item.cotacaoReal.toFixed(2) : '—'
          }
        </TD>
      ) : <TD align="center" style={{ color: 'var(--muted2)' }}>—</TD>}

      {/* Diff Câmbio — diferença entre cotação real e fixa (5.6) aplicada ao valor USD */}
      {(() => {
        const isUsd = item.moeda === 'Dólar'
        const usd = item.realizadoUsd || (isUsd ? item.valorUn * item.qtd : 0) || 0
        const cot = item.cotacaoReal || 0
        if (!isUsd || usd === 0 || cot === 0) {
          return <TD align="center" style={{ color: 'var(--muted2)' }}>—</TD>
        }
        const diffCambio = Math.round(usd * (cot - COTACAO))
        const color = diffCambio === 0 ? 'var(--muted)' : diffCambio > 0 ? '#E05252' : '#65B32E'
        return (
          <TD align="right" mono style={{ color, fontWeight: 600 }}>
            {(diffCambio > 0 ? '+' : '') + fmt(diffCambio)}
          </TD>
        )
      })()}

      {/* Diferença */}
      <TD align="right" mono style={{
        color: diffColor, fontWeight: diff !== null ? 600 : 400,
      }}>
        {diff !== null ? (diff > 0 ? '+' : '') + fmt(diff === 0 ? 0 : diff) : '—'}
      </TD>

      {/* % Exec */}
      <TD align="center" mono style={{
        color: item.pctExec > 0 ? '#65B32E' : 'var(--muted2)',
        fontWeight: item.pctExec > 0 ? 600 : 400,
      }}>
        {item.pctExec > 0 ? fmtPct(item.pctExec) : '—'}
      </TD>

      {/* Status */}
      <TD>
        <select
          value={item.status}
          onChange={e => onUpdate(item.id, 'status', e.target.value)}
          style={{
            fontSize: 12, padding: '5px 8px', minWidth: 145,
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 6,
          }}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </TD>

      {/* Observações */}
      <TD>
        <input
          value={item.obs || ''}
          onChange={e => onUpdate(item.id, 'obs', e.target.value)}
          placeholder="Observações..."
          style={{
            width: 160, fontSize: 12,
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </TD>

    </tr>

    {expanded && !item.isNew && (
      <tr>
        <td colSpan={showTaxCols ? 20 : 18} style={{
          padding: 0, background: 'var(--surface2)',
          borderBottom: '2px solid var(--border)',
          borderLeft: '3px solid #4A9EDB',
        }}>
          <ComposicaoPanel item={item} onUpdate={onUpdate} />
        </td>
      </tr>
    )}
    </React.Fragment>
  )
}
