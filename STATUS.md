# Status do Projeto — Controle de Orçamentos

Dashboard interno LiveMode para controle orçamentário de múltiplos projetos ligados à Copa do Mundo 2026.

## Projetos cobertos

### 1. Transmissão Copa
Orçamento original da transmissão (Operações — João Crispim / Engenharia — Ivan Souza).

- **Orçado total:** R$ 8.450.889,19 (8.398.589,19 JC + 52.300,00 IV)
- Itens com moeda em Real e Dólar
- Imposto gross-up em itens em dólar (alíquotas 15 %, 27,63 %, 39,41 %)

### 2. Casa CazéTV
Projeto da casa de ativações/interações durante o período da Copa. Cuida das transmissões feitas a partir das casas.

- **Casa Rio de Janeiro**
- **Casa São Paulo**

Orçamento independente para cada cidade (valores a definir). Itens típicos:
UM B2, Drone, Minidrone, DSLR, SNG, Geradores.

## Navegação

- **Nível 1 (Projeto):** Transmissão Copa | Casa CazéTV
- **Nível 2 (Casa):** Rio | São Paulo
- **Tabs internas (por projeto):**
  - Transmissão Copa → Visão Geral | Itens | Impostos
  - Casa Rio / SP → Visão Geral | Itens

## Estrutura dos itens

### Transmissão Copa
`Resp | Categoria | Detalhamento | Moeda | Qtd | Valor Un | Alíq | Orçado | Realizado | Status | Obs`

### Casa CazéTV
`Categoria | Detalhamento | Diárias | Valor/Dia | Orçado | Realizado | Saldo | Status | Obs`

(sem responsável, sem imposto, sempre em Real)

## Persistência

### Supabase — tabela `items`
Todos os itens (Copa e Casa) na mesma tabela, separados pela coluna `projeto`:
- `transmissao_copa`
- `casa_rio`
- `casa_sp`

### Supabase — tabela `categorias`
Lista fechada de categorias por projeto, gerenciável pela UI (dropdown + "+ Nova categoria").

### Tempo real
Qualquer alteração feita por qualquer usuário reflete instantaneamente nos outros (Supabase Realtime com filtro por projeto).

## Migrations aplicadas

### 1. Multi-projeto (rodada)
```sql
ALTER TABLE items ADD COLUMN IF NOT EXISTS projeto TEXT NOT NULL DEFAULT 'transmissao_copa';
CREATE INDEX IF NOT EXISTS items_projeto_idx ON items(projeto);
NOTIFY pgrst, 'reload schema';
```

### 2. Categorias gerenciáveis (rodar agora)
```sql
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  projeto TEXT NOT NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (projeto, nome)
);
CREATE INDEX IF NOT EXISTS categorias_projeto_idx ON categorias(projeto);

INSERT INTO categorias (projeto, nome) VALUES
  ('casa_rio', 'UM B2'), ('casa_rio', 'Drone'), ('casa_rio', 'Minidrone'),
  ('casa_rio', 'DSLR'),  ('casa_rio', 'SNG'),   ('casa_rio', 'Geradores'),
  ('casa_sp',  'UM B2'), ('casa_sp',  'Drone'), ('casa_sp',  'Minidrone'),
  ('casa_sp',  'DSLR'),  ('casa_sp',  'SNG'),   ('casa_sp',  'Geradores')
ON CONFLICT (projeto, nome) DO NOTHING;

NOTIFY pgrst, 'reload schema';
```

## Stack

- React 18 + Vite
- Supabase (Postgres + Realtime)
- Recharts (gráficos)
- Deploy: Vercel (auto-deploy do `main`)

## Arquivos principais

```
src/
  data/
    items.js            ← ORCAMENTO por projeto + lista PROJETOS
    store.js            ← useStore(projeto) + useCategorias(projeto)
  components/
    ItemsTable.jsx      ← tabela da Copa (com imposto)
    CasaItemsTable.jsx  ← tabela das Casas (diárias × valor)
    ItemRow.jsx         ← linha editável da Copa
    KpiCard, ProgressBar, StatusBadge, Charts
  App.jsx               ← nav em 2 níveis + render condicional Copa/Casa
  lib/supabase.js       ← client + anon key
```

## Pendências

- [ ] Definir valor do orçamento total por Casa (Rio/SP) e atualizar `ORCAMENTO` em `items.js`
- [ ] Validar fluxo completo (adicionar item, nova categoria, editar, remover) em produção
- [ ] Avaliar se categorias devem diferenciar entre Rio e SP ou serem compartilhadas
