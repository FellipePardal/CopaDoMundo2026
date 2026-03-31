import React from 'react'

export default function KpiCard({ label, value, sub, accent = '#1D4ED8', icon, trend }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      boxShadow: 'var(--shadow-sm)',
      borderTop: `3px solid ${accent}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 6,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>{label}</span>
        {icon && (
          <span style={{
            width: 30, height: 30, borderRadius: 8,
            background: accent + '15',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>{icon}</span>
        )}
      </div>
      <div style={{
        fontSize: 24, fontWeight: 700, color: 'var(--text)',
        fontFamily: 'var(--mono)', letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  )
}
