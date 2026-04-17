import React from 'react'

const STYLES = {
  'Pago':               { bg: 'rgba(101,179,46,0.18)',  border: 'rgba(101,179,46,0.40)',  color: '#65B32E'  },
  'Aprovado / a pagar': { bg: 'rgba(74,158,219,0.18)',  border: 'rgba(74,158,219,0.40)',  color: '#4A9EDB'  },
  'Em negociação':      { bg: 'rgba(245,166,35,0.18)',  border: 'rgba(245,166,35,0.40)',  color: '#F5A623'  },
  'Cancelado':          { bg: 'rgba(224,82,82,0.18)',   border: 'rgba(224,82,82,0.40)',   color: '#E05252'  },
  'Pendente':           { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.50)' },
}

export default function StatusBadge({ status }) {
  const label = status || 'Pendente'
  const s = STYLES[label] || STYLES['Pendente']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 600, color: s.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {label}
    </span>
  )
}
