export const STATUS_OPTIONS = [
  { value: '',                    label: 'Pendente',           color: '#6B7A96' },
  { value: 'Pago',                label: 'Pago',               color: '#10B981' },
  { value: 'Aprovado / a pagar',  label: 'Aprovado / a pagar', color: '#3B82F6' },
  { value: 'Em negociação',       label: 'Em negociação',      color: '#F59E0B' },
  { value: 'Cancelado',           label: 'Cancelado',          color: '#EF4444' },
]

export const STATUS_COLOR = {
  '':                   '#6B7A96',
  'Pendente':           '#6B7A96',
  'Pago':               '#10B981',
  'Aprovado / a pagar': '#3B82F6',
  'Em negociação':      '#F59E0B',
  'Cancelado':          '#EF4444',
}

export const CAT_COLORS = [
  '#3B82F6','#10B981','#8B5CF6','#F59E0B',
  '#EF4444','#06B6D4','#EC4899','#84CC16',
]

export function fmt(v, decimals = 0) {
  if (v === null || v === undefined) return '—'
  return 'R$ ' + Number(v).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function fmtPct(v) {
  return (v || 0).toFixed(1) + '%'
}

export function fmtAliq(v) {
  if (!v) return '—'
  return (v * 100).toFixed(2) + '%'
}

export function fmtM(v) {
  if (!v) return 'R$ 0'
  if (Math.abs(v) >= 1e6) return 'R$ ' + (v / 1e6).toFixed(2) + 'M'
  if (Math.abs(v) >= 1e3) return 'R$ ' + (v / 1e3).toFixed(1) + 'k'
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR')
}
