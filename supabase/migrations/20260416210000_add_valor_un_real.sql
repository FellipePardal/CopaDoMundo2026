-- Valor por dia pós-negociação (realizado/dia) para itens Casa CazéTV
-- Diárias × valor_un_real = realizado total
ALTER TABLE items ADD COLUMN IF NOT EXISTS valor_un_real NUMERIC DEFAULT 0;
