import React from 'react'

const STYLES = {
  'Pago':               { bg: 'rgba(45,184,61,0.18)',  border: 'rgba(45,184,61,0.40)',  color: '#2DB83D'  },
  'Aprovado / a pagar': { bg: 'rgba(27,63,173,0.18)',  border: 'rgba(27,63,173,0.40)',  color: '#1B3FAD'  },
  'Em negociação':      { bg: 'rgba(245,200,0,0.18)',  border: 'rgba(245,200,0,0.40)',  color: '#F5C800'  },
  'Cancelado':          { bg: 'rgba(255,107,0,0.18)',   border: 'rgba(255,107,0,0.40)',   color: '#FF6B00'  },
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
