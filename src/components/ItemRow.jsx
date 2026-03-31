import React from 'react'
import { STATUS_OPTIONS, fmt, fmtAliq, fmtPct } from '../data/utils.js'

const TD = ({ children, align = 'left', mono = false, style = {} }) => (
  <td style={{
    padding: '10px 13px', fontSize: 12.5, textAlign: align,
    fontFamily: mono ? 'var(--mono)' : 'var(--font)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: 'var(--text2)', whiteSpace: 'nowrap',
    ...style,
  }}>
    {children}
  </td>
)

export default function ItemRow({ item, onUpdate, onRemove }) {
  const diff = item.realizado > 0 ? item.realizado - item.orcado : null
  const diffColor = diff === null ? 'var(--muted2)'
    : diff <= 0 ? '#65B32E' : '#E05252'

  function handleReal(e) {
    const v = parseFloat(e.target.value.replace(',', '.')) || 0
    onUpdate(item.id, 'realizado', v)
  }

  return (
    <tr style={{ transition: 'background 0.12s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

      <TD>
        <span style={{
          padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
          background: item.resp === 'João Crispim' ? 'rgba(101,179,46,0.18)' : 'rgba(74,158,219,0.18)',
          color:      item.resp === 'João Crispim' ? '#65B32E' : '#4A9EDB',
          border: `1px solid ${item.resp === 'João Crispim' ? 'rgba(101,179,46,0.4)' : 'rgba(74,158,219,0.4)'}`,
        }}>
          {item.resp === 'João Crispim' ? 'JC' : 'IV'}
        </span>
      </TD>

      <TD style={{ color: 'var(--muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.isNew
          ? <input value={item.cat} onChange={e => onUpdate(item.id, 'cat', e.target.value)}
              placeholder="Categoria" style={{ width: 130, fontSize: 12 }} />
          : item.cat}
      </TD>

      <TD style={{ maxWidth: 270, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.isNew
          ? <input value={item.det} onChange={e => onUpdate(item.id, 'det', e.target.value)}
              placeholder="Descrição" style={{ width: 250, fontSize: 12 }} />
          : <span title={item.det}>{item.det}</span>}
      </TD>

      <TD align="center">
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
          background: item.moeda === 'Dólar' ? 'rgba(74,158,219,0.15)' : 'rgba(101,179,46,0.15)',
          color:      item.moeda === 'Dólar' ? '#4A9EDB' : '#65B32E',
          border: `1px solid ${item.moeda === 'Dólar' ? 'rgba(74,158,219,0.35)' : 'rgba(101,179,46,0.35)'}`,
        }}>
          {item.moeda === 'Dólar' ? 'USD' : 'BRL'}
        </span>
      </TD>

      <TD align="center" mono>{item.isNew
        ? <input type="number" value={item.qtd}
            onChange={e => onUpdate(item.id, 'qtd', parseFloat(e.target.value)||1)}
            style={{ width: 50, textAlign: 'center', fontSize: 12 }} />
        : item.qtd}
      </TD>

      <TD align="center" mono style={{
        color: item.aliq > 0 ? '#F5A623' : 'var(--muted2)', fontWeight: item.aliq > 0 ? 600 : 400,
      }}>
        {item.isNew
          ? <input type="number" step="0.01" value={(item.aliq*100).toFixed(2)}
              onChange={e => onUpdate(item.id,'aliq',parseFloat(e.target.value)/100||0)}
              style={{ width: 60, textAlign: 'center', fontSize: 12 }} />
          : fmtAliq(item.aliq)}
      </TD>

      <TD align="right" mono>
        {item.isNew
          ? <input type="number" value={item.orcado}
              onChange={e => onUpdate(item.id,'orcado',parseFloat(e.target.value)||0)}
              style={{ width: 120, textAlign: 'right', fontSize: 12 }} />
          : <span style={{ fontWeight: 600 }}>{fmt(item.orcado)}</span>}
      </TD>

      <TD align="right" mono style={{ color: item.imposto > 0 ? '#F5A623' : 'var(--muted2)' }}>
        {item.imposto > 0 ? fmt(item.imposto) : '—'}
      </TD>

      <TD align="right" mono style={{ color: 'var(--muted)' }}>
        {item.aliq > 0 ? fmt(item.semImp) : '—'}
      </TD>

      <TD align="right">
        <input type="number" step="0.01"
          defaultValue={item.realizado || ''}
          onBlur={handleReal} placeholder="—"
          style={{ width: 130, fontSize: 12, textAlign: 'right', fontFamily: 'var(--mono)' }}
        />
      </TD>

      <TD align="right" mono style={{ color: diffColor, fontWeight: diff !== null ? 600 : 400 }}>
        {diff !== null ? (diff > 0 ? '+' : '') + fmt(diff) : '—'}
      </TD>

      <TD align="center" mono style={{
        color: item.pctExec > 0 ? '#65B32E' : 'var(--muted2)',
        fontWeight: item.pctExec > 0 ? 600 : 400,
      }}>
        {item.pctExec > 0 ? fmtPct(item.pctExec) : '—'}
      </TD>

      <TD>
        <select value={item.status} onChange={e => onUpdate(item.id,'status',e.target.value)}
          style={{ fontSize: 12, padding: '5px 8px', minWidth: 145 }}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </TD>

      <TD align="center">
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: item.bookado === 'Sim' ? '#65B32E'
               : item.bookado === 'Não' ? '#E05252' : 'var(--muted2)',
        }}>
          {!item.bookado || item.bookado === 'nan' ? '—' : item.bookado}
        </span>
      </TD>

      <TD>
        <input value={item.obs || ''} onChange={e => onUpdate(item.id,'obs',e.target.value)}
          placeholder="Observações..." style={{ width: 180, fontSize: 12 }} />
      </TD>

      {item.isNew && (
        <TD>
          <button onClick={() => onRemove(item.id)} style={{
            background: 'rgba(224,82,82,0.15)', color: '#E05252',
            border: '1px solid rgba(224,82,82,0.35)', borderRadius: 6, padding: '4px 10px', fontSize: 12,
          }}>Remover</button>
        </TD>
      )}
    </tr>
  )
}
