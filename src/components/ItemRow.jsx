import React, { useState } from 'react'
import { STATUS_OPTIONS, fmt, fmtAliq, fmtPct } from '../data/utils.js'

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

export default function ItemRow({ item, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})

  const diff = item.realizado > 0 ? item.realizado - item.orcado : null
  const diffColor = diff === null ? 'var(--muted2)'
    : diff <= 0 ? '#65B32E' : '#E05252'

  function startEdit() {
    setDraft({
      det:     item.det,
      cat:     item.cat,
      orcado:  item.orcado,
      aliq:    item.aliq,
      qtd:     item.qtd,
      valorUn: item.valorUn,
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
  }

  function handleReal(e) {
    const v = parseFloat(e.target.value.replace(',', '.')) || 0
    onUpdate(item.id, 'realizado', v)
  }

  const rowBg = editing ? 'rgba(101,179,46,0.04)' : 'transparent'
  const rowBorder = editing ? '1px solid rgba(101,179,46,0.25)' : undefined

  return (
    <tr
      style={{ transition: 'background 0.12s', background: rowBg,
        outline: editing ? '1px solid rgba(101,179,46,0.20)' : 'none' }}
      onMouseEnter={e => { if (!editing) e.currentTarget.style.background = 'var(--surface2)' }}
      onMouseLeave={e => { if (!editing) e.currentTarget.style.background = 'transparent' }}
    >

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
      <TD style={{ color: 'var(--muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {editing
          ? <input value={draft.cat} onChange={e => setDraft(d => ({ ...d, cat: e.target.value }))}
              style={{ width: 130, fontSize: 12 }} />
          : item.cat}
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
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
          background: item.moeda === 'Dólar'
            ? 'rgba(74,158,219,0.12)' : 'rgba(101,179,46,0.12)',
          color: item.moeda === 'Dólar' ? '#4A9EDB' : '#65B32E',
          border: `1px solid ${item.moeda === 'Dólar'
            ? 'rgba(74,158,219,0.30)' : 'rgba(101,179,46,0.30)'}`,
        }}>
          {item.moeda === 'Dólar' ? 'USD' : 'BRL'}
        </span>
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

      {/* Imposto */}
      <TD align="right" mono style={{
        color: item.imposto > 0 ? '#F5A623' : 'var(--muted2)',
      }}>
        {item.imposto > 0 ? fmt(item.imposto) : '—'}
      </TD>

      {/* Sem Imposto */}
      <TD align="right" mono style={{ color: 'var(--muted)' }}>
        {item.aliq > 0 ? fmt(item.semImp) : '—'}
      </TD>

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
          }}
        />
      </TD>

      {/* Diferença */}
      <TD align="right" mono style={{
        color: diffColor, fontWeight: diff !== null ? 600 : 400,
      }}>
        {diff !== null ? (diff > 0 ? '+' : '') + fmt(diff) : '—'}
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

      {/* Bookado */}
      <TD align="center">
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: item.bookado === 'Sim' ? '#65B32E'
               : item.bookado === 'Não' ? '#E05252' : 'var(--muted2)',
        }}>
          {!item.bookado || item.bookado === 'nan' ? '—' : item.bookado}
        </span>
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

      {/* Ações — Editar / Salvar / Cancelar */}
      <TD>
        {item.isNew ? (
          <button onClick={() => onRemove(item.id)} style={{
            background: 'rgba(224,82,82,0.10)', color: '#E05252',
            border: '1px solid rgba(224,82,82,0.30)',
            borderRadius: 6, padding: '4px 10px', fontSize: 12,
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
          }}>✏️ Editar</button>
        )}
      </TD>
    </tr>
  )
}
