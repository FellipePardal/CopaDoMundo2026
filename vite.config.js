# Copa 2026 — Controle Interno Operações & Engenharia

Dashboard de controle orçamentário para as áreas de Operações (João Crispim) e Engenharia (Ivan Souza) da Copa do Mundo 2026.

## Stack

- **React 18** + **Vite**
- **Recharts** — gráficos
- **Lucide React** — ícones
- Fontes: **Syne** (display) + **DM Mono** (números)

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como fazer deploy (GitHub Pages)

1. Crie um repositório no GitHub
2. Faça push deste código
3. Instale o plugin de deploy:
   ```bash
   npm install --save-dev gh-pages
   ```
4. Adicione ao `package.json`:
   ```json
   "homepage": "https://<seu-usuario>.github.io/<nome-do-repo>",
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
5. Rode:
   ```bash
   npm run deploy
   ```

## Como fazer deploy na Vercel

1. Faça push para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório — a Vercel detecta o Vite automaticamente
4. Clique em Deploy ✅

## Estrutura

```
src/
  data/
    items.js      ← todos os itens orçados (fonte: aba Eficiência col M)
    store.js      ← estado global + todos os cálculos
    utils.js      ← formatação e constantes
  components/
    KpiCard.jsx       ← card de KPI
    ProgressBar.jsx   ← barra de progresso
    StatusBadge.jsx   ← badge de status
    Charts.jsx        ← todos os gráficos (Recharts)
    ItemRow.jsx       ← linha editável da tabela
    ItemsTable.jsx    ← tabela completa com filtros
  App.jsx         ← layout principal + 3 abas
  main.jsx        ← entry point
  index.css       ← variáveis CSS globais
```

## Fórmulas aplicadas

### Itens em Real (sem imposto)
```
Orçado = Qtd × Valor Un
Imposto = 0
```

### Itens em Dólar (gross-up)
```
Base     = Qtd × Cotação (5,60) × Valor Un (USD)
Orçado   = Base ÷ (1 − alíquota)
Imposto  = Orçado × alíquota
Sem imp  = Orçado − Imposto = Base
```

### Alíquotas utilizadas
| Alíquota | Itens |
|---|---|
| 15,00% | IBC, HBS, Grafismo, Satélite |
| 27,63% | Servidores IBC, TVU |
| 39,41% | Fibras Dallas, Equipamentos ENG |

## Como adicionar novos itens

Na aba **"Detalhe dos Itens"**, clique em `+ JC` ou `+ IV` para adicionar uma linha nova.
Preencha categoria, descrição, moeda, quantidade, valor unitário e alíquota.
O orçado e imposto calculam automaticamente.
