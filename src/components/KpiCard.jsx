import React from 'react'

export default function KpiCard({ label, value, sub, accent = '#65B32E', icon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        border: `2px solid ${accent}30`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: -8, right: -8,
        width: 40, height: 40, borderRadius: '50%',
        background: `${accent}18`,
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: 10, fontWeight: 600, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: 10,
      }}>
        {label}
      </div>

      <div style={{
        fontSize: 22, fontWeight: 700, color: 'var(--text)',
        fontFamily: 'var(--mono)', letterSpacing: '-0.02em',
        lineHeight: 1.1, marginBottom: 6,
      }}>
        {value}
      </div>

      {sub && (
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
          {sub}
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3, background: accent,
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      }} />
    </div>
  )
}
