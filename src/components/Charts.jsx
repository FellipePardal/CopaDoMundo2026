import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts'
import { CAT_COLORS, fmtM, fmt } from '../data/utils.js'

function getComputedColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border2)',
      borderRadius: 10, fontSize: 12,
      color: 'var(--text)',
      boxShadow: 'var(--shadow-md)',
      padding: 0,
    }}>
      <div style={{
        padding: '8px 14px', borderBottom: '1px solid var(--border)',
        fontSize: 10, color: 'var(--muted)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: p.fill || p.color }} />
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function OrcadoVsRealizadoChart({ totals }) {
  const data = Object.entries(totals).map(([resp, t]) => ({
    name: resp === 'João Crispim' ? 'Operações' : 'Engenharia',
    'Orçado':    Math.round(t.orcado),
    'Realizado': Math.round(t.realizado),
    'Saldo':     Math.round(Math.max(0, t.saldo)),
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="35%" barGap={3}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'Syne' }}
          axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtM}
          tick={{ fill: 'var(--text-disabled)', fontSize: 11 }}
          axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: 'var(--surface2)' }} />
        <Bar dataKey="Orçado"    fill="#F5C800" radius={[4,4,0,0]} />
        <Bar dataKey="Realizado" fill="#1B3FAD" radius={[4,4,0,0]} />
        <Bar dataKey="Saldo"     fill="#E5E7EB" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CategoriaChart({ byCategory }) {
  const data = Object.entries(byCategory)
    .sort((a, b) => b[1].orcado - a[1].orcado).slice(0, 7)
    .map(([name, v]) => ({
      name: name.length > 20 ? name.slice(0, 18) + '…' : name,
      value: Math.round(v.orcado),
    }))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%"
          innerRadius={50} outerRadius={82}
          dataKey="value" paddingAngle={3} strokeWidth={0}>
          {data.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
        </Pie>
        <Tooltip content={({ active, payload }) => {
          if (!active || !payload?.length) return null
          const p = payload[0]
          return (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border2)',
              borderRadius: 10, boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ padding: '8px 14px' }}>
                <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{fmt(p.value)}</div>
                <div style={{ color: 'var(--muted2)', fontSize: 11 }}>
                  {(p.value / total * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )
        }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ImpostoChart({ byCategory }) {
  const data = Object.entries(byCategory)
    .filter(([, v]) => v.imposto > 0)
    .sort((a, b) => b[1].imposto - a[1].imposto)
    .map(([name, v]) => ({
      name: name.length > 20 ? name.slice(0, 18) + '…' : name,
      'Base':    Math.round(v.orcado - v.imposto),
      'Imposto': Math.round(v.imposto),
    }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" barCategoryGap="28%">
        <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tickFormatter={fmtM}
          tick={{ fill: 'var(--muted2)', fontSize: 11 }}
          axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={145}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: 'var(--surface2)' }} />
        <Bar dataKey="Base"    fill="#E5E7EB" stackId="a" />
        <Bar dataKey="Imposto" fill="#28C6C6" stackId="a" radius={[0,4,4,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
