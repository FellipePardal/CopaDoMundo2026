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

export default function ItemRow({ item, onUpdate, onRemove, categories = [], showTaxCols = false }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [addingCat, setAddingCat] = useState(false)
  const [newCat, setNewCat] = useState('')

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
    })
    setEditing(true)
  }

  function saveEdit() {
    Object.entries(draft).forEach(([field, value]) => {
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
    <tr
      style={{ transition: 'background 0.12s', background: rowBg }}
      onMouseEnter={e => { if (!editing) e.currentTarget.style.background = 'var(--surface2)' }}
      onMouseLeave={e => { if (!editing) e.currentTarget.style.background = 'transparent' }}
    >

      {/* AÇÕES — primeira coluna, sempre visível */}
      <TD>
        {item.isNew ? (
          <button onClick={() => onRemove(item.id)} style={{
            background: 'rgba(224,82,82,0.10)', color: '#E05252',
            border: '1px solid rgba(224,82,82,0.30)',
            borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer',
          }}>Remover</button>
        ) : editing ? (
          <div style={{ display: 'flex', gap: 6 }}>
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
          </div>
        ) : (
          <button onClick={startEdit} style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            background: 'var(--surface2)', color: 'var(--muted)',
            border: '1px solid var(--border)', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>✏️ Editar</button>
        )}
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
          <option value="Dólar">USD</option>
          <option value="Real">BRL</option>
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
        <TD align="right">
          <input
            type="text"
            inputMode="decimal"
            defaultValue={item.realizadoUsd || ''}
            onBlur={e => {
              const v = parseFloat(e.target.value.replace(',', '.')) || 0
              onUpdate(item.id, 'realizadoUsd', v)
            }}
            placeholder="—"
            style={{
              width: 100, fontSize: 12, textAlign: 'right',
              fontFamily: 'var(--mono)',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: '#4A9EDB',
            }}
          />
        </TD>
      ) : <TD align="center" style={{ color: 'var(--muted2)' }}>—</TD>}

      {/* Cotação Transação — só para itens em dólar */}
      {item.moeda === 'Dólar' ? (
        <TD align="right">
          <input
            type="text"
            inputMode="decimal"
            defaultValue={item.cotacaoReal || ''}
            onBlur={e => {
              const v = parseFloat(e.target.value.replace(',', '.')) || 0
              onUpdate(item.id, 'cotacaoReal', v)
            }}
            placeholder={String(COTACAO)}
            style={{
              width: 75, fontSize: 12, textAlign: 'right',
              fontFamily: 'var(--mono)',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </TD>
      ) : <TD align="center" style={{ color: 'var(--muted2)' }}>—</TD>}

      {/* Diff Câmbio — diferença entre cotação real e fixa (5.6) aplicada ao valor USD */}
      {(() => {
        const isUsd = item.moeda === 'Dólar'
        const usd = item.realizadoUsd || 0
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
  )
}
