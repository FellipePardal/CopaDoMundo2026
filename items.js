import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts'
import { CAT_COLORS, fmtM, fmt } from '../data/utils.js'

const TIP = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: 'JetBrains Mono, monospace',
  color: '#0F172A',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: 0,
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={TIP}>
      <div style={{ padding: '8px 14px', borderBottom: '1px solid #E2E8F0',
        fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif',
        fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ padding: '6px 14px', display: 'flex',
          alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill || p.color }} />
          <span style={{ color: '#334155', fontSize: 12 }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: '#0F172A' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function OrcadoVsRealizadoChart({ totals }) {
  const data = Object.entries(totals).map(([resp, t]) => ({
    name: resp === 'João Crispim' ? 'J. Crispim' : 'I. Souza',
    'Orçado':    Math.round(t.orcado),
    'Realizado': Math.round(t.realizado),
    'Saldo':     Math.round(Math.max(0, t.saldo)),
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="35%" barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Inter' }}
          axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtM} tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Inter' }}
          axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: '#F8FAFC' }} />
        <Bar dataKey="Orçado"    fill="#1D4ED8" radius={[3,3,0,0]} />
        <Bar dataKey="Realizado" fill="#16A34A" radius={[3,3,0,0]} />
        <Bar dataKey="Saldo"     fill="#E2E8F0" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CategoriaChart({ byCategory }) {
  const data = Object.entries(byCategory)
    .sort((a, b) => b[1].orcado - a[1].orcado)
    .slice(0, 7)
    .map(([name, v]) => ({
      name: name.length > 22 ? name.slice(0, 20) + '…' : name,
      value: Math.round(v.orcado),
    }))

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%"
          innerRadius={52} outerRadius={82}
          dataKey="value" paddingAngle={2} strokeWidth={0}>
          {data.map((_, i) => (
            <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={({ active, payload }) => {
          if (!active || !payload?.length) return null
          const p = payload[0]
          return (
            <div style={TIP}>
              <div style={{ padding: '8px 14px' }}>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>{fmt(p.value)}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>
                  {(p.value / total * 100).toFixed(1)}% do total
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
      name: name.length > 22 ? name.slice(0, 20) + '…' : name,
      'Base':    Math.round(v.orcado - v.imposto),
      'Imposto': Math.round(v.imposto),
    }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
        <XAxis type="number" tickFormatter={fmtM}
          tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Inter' }}
          axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={150}
          tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Inter' }}
          axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: '#F8FAFC' }} />
        <Bar dataKey="Base"    fill="#DBEAFE" stackId="a" />
        <Bar dataKey="Imposto" fill="#F59E0B" stackId="a" radius={[0,3,3,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
