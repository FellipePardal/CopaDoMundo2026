import React from 'react'
import { fmtPct, fmt } from '../data/utils.js'

export default function ProgressBar({ label, pct, realizado, orcado, color = '#1D4ED8', initials }) {
  const p = Math.min(100, pct || 0)
  const over = pct > 100

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {initials && (
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: color + '18',
              border: `1.5px solid ${color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color,
            }}>{initials}</div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              {fmt(realizado)} realizado de {fmt(orcado)} orçado
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)',
          color: over ? 'var(--red)' : p > 70 ? 'var(--green)' : 'var(--text)',
        }}>
          {fmtPct(pct)}
        </div>
      </div>
      <div style={{
        height: 6, background: 'var(--surface3)',
        borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${p}%`,
          borderRadius: 99,
          background: over ? 'var(--red)' : color,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}
