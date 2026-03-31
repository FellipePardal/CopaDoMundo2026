import React from 'react'
import { STATUS_OPTIONS, fmt, fmtAliq, fmtPct } from '../data/utils.js'
import StatusBadge from './StatusBadge.jsx'

const TD = ({ children, align = 'left', mono = false, style = {} }) => (
  <td style={{
    padding: '10px 14px', fontSize: 12.5, textAlign: align,
    fontFamily: mono ? 'var(--mono)' : 'var(--font)',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text2)', whiteSpace: 'nowrap',
    ...style,
  }}>
    {children}
  </td>
)

export default function ItemRow({ item, onUpdate, onRemove }) {
  const diff = item.realizado > 0 ? item.realizado - item.orcado : null
  const diffColor = diff === null ? 'var(--muted2)'
    : diff <= 0 ? 'var(--green)' : 'var(--red)'

  function handleReal(e) {
    const v = parseFloat(e.target.value.replace(',', '.')) || 0
    onUpdate(item.id, 'realizado', v)
  }

  return (
    <tr style={{ transition: 'background 0.1s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      {/* Resp */}
      <TD>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          background: item.resp === 'João Crispim' ? 'var(--blue-mid)' : 'var(--purple-mid)',
          color:      item.resp === 'João Crispim' ? 'var(--blue)' : 'var(--purple)',
          border: `1px solid ${item.resp === 'João Crispim' ? 'var(--blue-border)' : 'var(--purple-border)'}`,
        }}>
          {item.resp === 'João Crispim' ? 'JC' : 'IV'}
        </span>
      </TD>

      {/* Categoria */}
      <TD style={{ color: 'var(--muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.isNew
          ? <input value={item.cat} onChange={e => onUpdate(item.id, 'cat', e.target.value)}
              placeholder="Categoria" style={{ width: 130, fontSize: 12 }} />
          : item.cat}
      </TD>

      {/* Detalhamento */}
      <TD style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
        {item.isNew
          ? <input value={item.det} onChange={e => onUpdate(item.id, 'det', e.target.value)}
              placeholder="Descrição" style={{ width: 260, fontSize: 12 }} />
          : <span title={item.det}>{item.det}</span>}
      </TD>

      {/* Moeda */}
      <TD align="center">
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
          background: item.moeda === 'Dólar' ? 'var(--blue-light)' : 'var(--green-light)',
          color:      item.moeda === 'Dólar' ? 'var(--blue)' : 'var(--green)',
          border: `1px solid ${item.moeda === 'Dólar' ? 'var(--blue-border)' : 'var(--green-border)'}`,
        }}>
          {item.moeda === 'Dólar' ? 'USD' : 'BRL'}
        </span>
      </TD>

      {/* Qtd */}
      <TD align="center" mono>
        {item.isNew
          ? <input type="number" value={item.qtd}
              onChange={e => onUpdate(item.id, 'qtd', parseFloat(e.target.value) || 1)}
              style={{ width: 50, textAlign: 'center', fontSize: 12 }} />
          : item.qtd}
      </TD>

      {/* Alíquota */}
      <TD align="center" mono style={{
        color: item.aliq > 0 ? 'var(--amber)' : 'var(--muted2)',
        fontWeight: item.aliq > 0 ? 600 : 400,
      }}>
        {item.isNew
          ? <input type="number" step="0.01" value={(item.aliq * 100).toFixed(2)}
              onChange={e => onUpdate(item.id, 'aliq', parseFloat(e.target.value) / 100 || 0)}
              style={{ width: 60, textAlign: 'center', fontSize: 12 }} />
          : fmtAliq(item.aliq)}
      </TD>

      {/* Orçado */}
      <TD align="right" mono>
        {item.isNew
          ? <input type="number" value={item.orcado}
              onChange={e => onUpdate(item.id, 'orcado', parseFloat(e.target.value) || 0)}
              style={{ width: 120, textAlign: 'right', fontSize: 12 }} />
          : <span style={{ fontWeight: 600, color: 'var(--text)' }}>{fmt(item.orcado)}</span>}
      </TD>

      {/* Imposto */}
      <TD align="right" mono style={{
        color: item.imposto > 0 ? 'var(--amber)' : 'var(--muted2)',
      }}>
        {item.imposto > 0 ? fmt(item.imposto) : '—'}
      </TD>

      {/* Sem imposto */}
      <TD align="right" mono style={{ color: 'var(--muted)' }}>
        {item.aliq > 0 ? fmt(item.semImp) : '—'}
      </TD>

      {/* Realizado — INPUT */}
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
          }}
        />
      </TD>

      {/* Diferença */}
      <TD align="right" mono style={{ color: diffColor, fontWeight: diff !== null ? 600 : 400 }}>
        {diff !== null ? (diff > 0 ? '+' : '') + fmt(diff) : '—'}
      </TD>

      {/* % Exec */}
      <TD align="center" mono style={{
        color: item.pctExec > 0 ? 'var(--green)' : 'var(--muted2)',
        fontWeight: item.pctExec > 0 ? 600 : 400,
      }}>
        {item.pctExec > 0 ? fmtPct(item.pctExec) : '—'}
      </TD>

      {/* Status */}
      <TD>
        <select
          value={item.status}
          onChange={e => onUpdate(item.id, 'status', e.target.value)}
          style={{ fontSize: 12, padding: '5px 8px', minWidth: 145 }}
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
          color: item.bookado === 'Sim' ? 'var(--green)'
               : item.bookado === 'Não' ? 'var(--red)' : 'var(--muted2)',
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
          style={{ width: 180, fontSize: 12 }}
        />
      </TD>

      {/* Remover (novos) */}
      {item.isNew && (
        <TD>
          <button onClick={() => onRemove(item.id)} style={{
            background: 'var(--red-light)', color: 'var(--red)',
            border: '1px solid var(--red-border)', borderRadius: 6,
            padding: '4px 10px', fontSize: 12,
          }}>Remover</button>
        </TD>
      )}
    </tr>
  )
}
