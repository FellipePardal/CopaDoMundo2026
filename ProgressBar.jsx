import React from 'react'

const STATUS_STYLES = {
  'Pago':               { bg: 'var(--green-mid)',   border: 'var(--green-border)',  color: 'var(--green)'  },
  'Aprovado / a pagar': { bg: 'var(--blue-mid)',    border: 'var(--blue-border)',   color: 'var(--blue)'   },
  'Em negociação':      { bg: 'var(--amber-mid)',   border: 'var(--amber-border)',  color: 'var(--amber)'  },
  'Cancelado':          { bg: 'var(--red-mid)',     border: 'var(--red-border)',    color: 'var(--red)'    },
  'Pendente':           { bg: 'var(--surface3)',    border: 'var(--border)',        color: 'var(--muted)'  },
}

export default function StatusBadge({ status }) {
  const label = status || 'Pendente'
  const s = STATUS_STYLES[label] || STATUS_STYLES['Pendente']

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 600, color: s.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: s.color, flexShrink: 0,
      }} />
      {label}
    </span>
  )
}
