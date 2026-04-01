import { useState, useCallback, useEffect, useRef } from 'react'
import { ORCAMENTO } from './items.js'
import { supabase } from '../lib/supabase.js'

export function calcItem(item) {
  const orc     = item.orcado    || 0
  const aliq    = item.aliq      || 0
  const imposto = Math.round(orc * aliq * 100) / 100
  const semImp  = Math.round((orc - imposto) * 100) / 100
  const real    = item.realizado || 0
  const diff    = real > 0 ? Math.round((real - orc) * 100) / 100 : null
  const pctExec = orc > 0 && real > 0 ? Math.round((real / orc) * 1000) / 10 : 0
  return { ...item, imposto, semImp, diff, pctExec }
}

function fromDb(row) {
  return {
    id:           row.id,
    resp:         row.resp,
    cat:          row.cat,
    catV2:        row.cat_v2,
    fornecedores: row.fornecedores || '',
    det:          row.det,
    moeda:     row.moeda,
    qtd:       Number(row.qtd),
    valorUn:   Number(row.valor_un),
    aliq:      Number(row.aliq),
    orcado:    Number(row.orcado),
    bookado:   row.bookado,
    realizado: Number(row.realizado) || 0,
    status:    row.status || '',
    obs:       row.obs    || '',
    isNew:     row.is_new || false,
  }
}

const FIELD_MAP = { catV2: 'cat_v2', valorUn: 'valor_un', isNew: 'is_new' }
const toDbField = (f) => FIELD_MAP[f] || f

export function useStore() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const saveTimer = useRef({})

  useEffect(() => {
    // Carga inicial
    supabase
      .from('items')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (error) console.error('Erro ao carregar:', error)
        else setItems(data.map(fromDb))
        setLoading(false)
      })

    // Tempo real — atualiza automaticamente quando qualquer usuário muda algo
    const channel = supabase
      .channel('items-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'items' }, (payload) => {
        setItems(prev => prev.map(i => i.id === payload.new.id ? fromDb(payload.new) : i))
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'items' }, (payload) => {
        setItems(prev => {
          if (prev.find(i => i.id === payload.new.id)) return prev
          return [...prev, fromDb(payload.new)].sort((a, b) => a.id - b.id)
        })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'items' }, (payload) => {
        setItems(prev => prev.filter(i => i.id !== payload.old.id))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const updateItem = useCallback((id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))

    const key   = `${id}-${field}`
    const delay = field === 'obs' ? 800 : 0

    if (saveTimer.current[key]) clearTimeout(saveTimer.current[key])
    saveTimer.current[key] = setTimeout(async () => {
      const { error } = await supabase
        .from('items')
        .update({ [toDbField(field)]: value })
        .eq('id', id)
      if (error) console.error('Erro ao salvar:', error)
    }, delay)
  }, [])

  const addItem = useCallback(async (resp) => {
    const tempId   = Date.now()
    const tempItem = {
      id: tempId, resp, cat: '', catV2: '', fornecedores: '', det: '',
      moeda: 'Real', qtd: 1, valorUn: 0, aliq: 0, orcado: 0,
      realizado: 0, status: '', obs: '', bookado: '', isNew: true,
    }
    setItems(prev => [...prev, tempItem])

    const { data, error } = await supabase
      .from('items')
      .insert({
        resp, cat: '', cat_v2: '', fornecedores: '', det: '',
        moeda: 'Real', qtd: 1, valor_un: 0, aliq: 0, orcado: 0,
        realizado: 0, status: '', obs: '', bookado: '', is_new: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao adicionar:', error)
      setItems(prev => prev.filter(i => i.id !== tempId))
      return
    }

    setItems(prev => prev.map(i => i.id === tempId ? fromDb(data) : i))
  }, [])

  const removeItem = useCallback(async (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) console.error('Erro ao remover:', error)
  }, [])

  // Envia todos os dados atuais da tela para o Supabase (usado pelo colega para sincronizar)
  const syncToSupabase = useCallback(async (currentItems) => {
    const rows = currentItems.map(i => ({
      id:         i.id,
      resp:       i.resp,
      cat:          i.cat,
      cat_v2:       i.catV2,
      fornecedores: i.fornecedores || '',
      det:          i.det,
      moeda:      i.moeda,
      qtd:        i.qtd,
      valor_un:   i.valorUn,
      aliq:       i.aliq,
      orcado:     i.orcado,
      bookado:    i.bookado,
      realizado:  i.realizado || 0,
      status:     i.status    || '',
      obs:        i.obs       || '',
      is_new:     i.isNew     || false,
    }))

    const { error } = await supabase
      .from('items')
      .upsert(rows, { onConflict: 'id' })

    if (error) {
      console.error('Erro ao sincronizar:', error)
      return false
    }
    return true
  }, [])

  const computed = items.map(calcItem)

  const totals = {}
  for (const resp of Object.keys(ORCAMENTO)) {
    const mine = computed.filter(i => i.resp === resp)
    totals[resp] = {
      orcado:     ORCAMENTO[resp],
      realizado:  mine.reduce((s, i) => s + (i.realizado || 0), 0),
      imposto:    mine.reduce((s, i) => s + i.imposto, 0),
      semImp:     mine.reduce((s, i) => s + i.semImp, 0),
      nItems:     mine.length,
      pago:       mine.filter(i => i.status === 'Pago').reduce((s, i) => s + (i.realizado || 0), 0),
      aprovado:   mine.filter(i => i.status === 'Aprovado / a pagar').reduce((s, i) => s + (i.realizado || 0), 0),
      negociacao: mine.filter(i => i.status === 'Em negociação').reduce((s, i) => s + (i.realizado || 0), 0),
    }
    totals[resp].saldo   = totals[resp].orcado - totals[resp].realizado
    totals[resp].pctExec = totals[resp].orcado > 0
      ? Math.round(totals[resp].realizado / totals[resp].orcado * 1000) / 10 : 0
  }

  const grand = {
    orcado:    Object.values(ORCAMENTO).reduce((s, v) => s + v, 0),
    realizado: computed.reduce((s, i) => s + (i.realizado || 0), 0),
    imposto:   computed.reduce((s, i) => s + i.imposto, 0),
    semImp:    computed.reduce((s, i) => s + i.semImp, 0),
  }
  grand.saldo   = grand.orcado - grand.realizado
  grand.pctExec = grand.orcado > 0
    ? Math.round(grand.realizado / grand.orcado * 1000) / 10 : 0

  const byCategory = computed.reduce((acc, i) => {
    const key = i.cat || 'Sem categoria'
    if (!acc[key]) acc[key] = { orcado: 0, realizado: 0, imposto: 0, n: 0 }
    acc[key].orcado    += i.orcado
    acc[key].realizado += i.realizado || 0
    acc[key].imposto   += i.imposto
    acc[key].n         += 1
    return acc
  }, {})

  const byStatus = computed.reduce((acc, i) => {
    const s = i.status || 'Pendente'
    if (!acc[s]) acc[s] = { n: 0, val: 0 }
    acc[s].n++
    acc[s].val += i.realizado || 0
    return acc
  }, {})

  return { items: computed, loading, updateItem, addItem, removeItem, syncToSupabase, totals, grand, byCategory, byStatus }
}
