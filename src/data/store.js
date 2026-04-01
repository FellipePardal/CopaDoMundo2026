import { useState, useCallback } from 'react'
import { INITIAL_ITEMS, ORCAMENTO, COTACAO } from './items.js'

// Aplicar cálculos a um item
export function calcItem(item) {
  const orc     = item.orcado || 0
  const aliq    = item.aliq   || 0
  const imposto = Math.round(orc * aliq * 100) / 100
  const semImp  = Math.round((orc - imposto) * 100) / 100
  const real    = item.realizado || 0
  const diff    = real > 0 ? Math.round((real - orc) * 100) / 100 : null
  const pctExec = orc > 0 && real > 0 ? Math.round((real / orc) * 1000) / 10 : 0

  return { ...item, imposto, semImp, diff, pctExec }
}

// Hook principal — toda a lógica de estado
export function useStore() {
  const [items, setItems] = useState(() =>
    INITIAL_ITEMS.map(i => ({ ...i, realizado: 0, status: '', obs: '' }))
  )
  const [nextId, setNextId] = useState(INITIAL_ITEMS.length + 1)

  // Atualizar um campo de um item
  const updateItem = useCallback((id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }, [])

  // Adicionar novo item
  const addItem = useCallback((resp) => {
    const newItem = {
      id: nextId,
      resp,
      cat: '',
      catV2: '',
      det: '',
      moeda: 'Real',
      qtd: 1,
      valorUn: 0,
      aliq: 0,
      orcado: 0,
      realizado: 0,
      status: '',
      obs: '',
      bookado: '',
      isNew: true,
    }
    setItems(prev => [...prev, newItem])
    setNextId(n => n + 1)
  }, [nextId])

  // Remover item (apenas novos)
  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  // Itens calculados
  const computed = items.map(calcItem)

  // Totais por responsável
  const totals = {}
  for (const resp of Object.keys(ORCAMENTO)) {
    const mine = computed.filter(i => i.resp === resp)
    totals[resp] = {
      orcado:    ORCAMENTO[resp],
      realizado: mine.reduce((s, i) => s + (i.realizado || 0), 0),
      imposto:   mine.reduce((s, i) => s + i.imposto, 0),
      semImp:    mine.reduce((s, i) => s + i.semImp, 0),
      nItems:    mine.length,
      pago:      mine.filter(i => i.status === 'Pago').reduce((s, i) => s + (i.realizado || 0), 0),
      aprovado:  mine.filter(i => i.status === 'Aprovado / a pagar').reduce((s, i) => s + (i.realizado || 0), 0),
      negociacao:mine.filter(i => i.status === 'Em negociação').reduce((s, i) => s + (i.realizado || 0), 0),
    }
    totals[resp].saldo   = totals[resp].orcado - totals[resp].realizado
    totals[resp].pctExec = totals[resp].orcado > 0
      ? Math.round(totals[resp].realizado / totals[resp].orcado * 1000) / 10
      : 0
  }

  // Totais gerais
  const grand = {
    orcado:    Object.values(ORCAMENTO).reduce((s, v) => s + v, 0),
    realizado: computed.reduce((s, i) => s + (i.realizado || 0), 0),
    imposto:   computed.reduce((s, i) => s + i.imposto, 0),
    semImp:    computed.reduce((s, i) => s + i.semImp, 0),
  }
  grand.saldo   = grand.orcado - grand.realizado
  grand.pctExec = grand.orcado > 0
    ? Math.round(grand.realizado / grand.orcado * 1000) / 10
    : 0

  // Agrupamento por categoria
  const byCategory = computed.reduce((acc, i) => {
    const key = i.cat || 'Sem categoria'
    if (!acc[key]) acc[key] = { orcado: 0, realizado: 0, imposto: 0, n: 0 }
    acc[key].orcado    += i.orcado
    acc[key].realizado += i.realizado || 0
    acc[key].imposto   += i.imposto
    acc[key].n         += 1
    return acc
  }, {})

  // Contagem por status
  const byStatus = computed.reduce((acc, i) => {
    const s = i.status || 'Pendente'
    if (!acc[s]) acc[s] = { n: 0, val: 0 }
    acc[s].n++
    acc[s].val += i.realizado || 0
    return acc
  }, {})

  return { items: computed, updateItem, addItem, removeItem, totals, grand, byCategory, byStatus }
}
