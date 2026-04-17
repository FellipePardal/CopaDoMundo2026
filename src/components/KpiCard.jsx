import React from 'react'

export default function KpiCard({ label, value, sub, accent = 'var(--text-primary)', icon }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* top amarelo accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: 'var(--brand-amarelo)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }} />

      <div style={{
        fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginTop: 4, marginBottom: 10,
      }}>
        {label}
      </div>

      <div style={{
        fontSize: 26, fontWeight: 700, color: accent,
        fontFamily: 'var(--mono)', letterSpacing: '-0.02em',
        lineHeight: 1.1, marginBottom: 6,
      }}>
        {value}
      </div>

      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 400 }}>
          {sub}
        </div>
      )}
    </div>
  )
}
