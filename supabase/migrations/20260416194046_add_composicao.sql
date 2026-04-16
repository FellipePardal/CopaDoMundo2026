-- Composição de itens — array de sub-linhas detalhando do que é composto o orçado
-- Cada elemento: { desc: string, qtd: number, valor: number }
-- Total por linha = qtd × valor. Soma dos totais deve bater com items.orcado.
ALTER TABLE items ADD COLUMN IF NOT EXISTS composicao JSONB DEFAULT '[]'::jsonb;
