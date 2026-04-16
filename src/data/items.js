// Dados extraídos da aba "Eficiência de Orçamento Detalhada" — coluna M (VL Total)
// Fórmulas aplicadas:
//   Itens em Real:  orcado = Qtd × Valor Un
//   Itens em Dólar: orcado = Qtd × Cotação × Valor Un / (1 - aliq)  [gross-up]
//   imposto        = orcado × aliq
//   semImposto     = orcado - imposto
// Orçado total: João Crispim R$ 8.398.589,19 | Ivan Souza R$ 52.300,00

export const ORCAMENTO = {
  transmissao_copa: {
    'João Crispim': 8398589.19,
    'Ivan Souza':   52300.00,
  },
  casa_rio: {},
  casa_sp:  {},
}

export const PROJETOS = [
  { id: 'transmissao_copa', label: 'Transmissão Copa', grupo: null         },
  { id: 'casa_rio',         label: 'Casa Rio de Janeiro', grupo: 'casa'    },
  { id: 'casa_sp',          label: 'Casa São Paulo',      grupo: 'casa'    },
]

// Fases e suas cores — usadas no cronograma do Rio
export const FASES = {
  'Montagem':      { color: '#6B7A96' },
  'Teste Técnico': { color: '#4A9EDB' },
  'Fake Vivo':     { color: '#F59E0B' },
  'Ajustes':       { color: '#8B5CF6' },
  'Ao Vivo':       { color: '#E05252' },
}

// Cronograma Casa CazéTV Rio — 13 dias. Exclusivo Rio, não replicar para SP.
export const CRONOGRAMA_RIO = [
  { dia: 1,  data: '29 mai', diaSemana: 'Qui', fase: 'Montagem',      desc: 'Início da montagem' },
  { dia: 2,  data: '30 mai', diaSemana: 'Sex', fase: 'Montagem',      desc: 'Montagem' },
  { dia: 3,  data: '31 mai', diaSemana: 'Dom', fase: 'Montagem',      desc: 'Montagem' },
  { dia: 4,  data: '01 jun', diaSemana: 'Dom', fase: 'Teste Técnico', desc: 'Teste técnico — vídeo, áudio, interação, iluminação e sistemas' },
  { dia: 5,  data: '02 jun', diaSemana: 'Seg', fase: 'Teste Técnico', desc: 'Teste técnico — vídeo, áudio, interação, iluminação e sistemas' },
  { dia: 6,  data: '03 jun', diaSemana: 'Ter', fase: 'Fake Vivo',     desc: 'Jogo Teste 1 — Fake Vivo + reunião de feedbacks' },
  { dia: 7,  data: '04 jun', diaSemana: 'Qua', fase: 'Ajustes',       desc: 'Ajustes de montagem e calibração' },
  { dia: 8,  data: '05 jun', diaSemana: 'Qui', fase: 'Fake Vivo',     desc: 'Jogo Teste 2 — Fake Vivo + reunião de feedbacks' },
  { dia: 9,  data: '06 jun', diaSemana: 'Sex', fase: 'Ajustes',       desc: 'Ajustes de montagem e calibração' },
  { dia: 10, data: '07 jun', diaSemana: 'Dom', fase: 'Fake Vivo',     desc: 'Jogo Teste 3 — Fake Vivo + reunião de feedbacks' },
  { dia: 11, data: '08 jun', diaSemana: 'Dom', fase: 'Ajustes',       desc: 'Ajustes de montagem e calibração' },
  { dia: 12, data: '09 jun', diaSemana: 'Seg', fase: 'Ao Vivo',       desc: 'Jogo Teste 4 — AO VIVO' },
  { dia: 13, data: '10 jun', diaSemana: 'Ter', fase: 'Ajustes',       desc: 'Ajustes de montagem e calibração' },
]

export const COTACAO = 5.6

export const INITIAL_ITEMS = [
  { id: 1,  resp: 'João Crispim', cat: 'Infraestrutura & Conectividade IBC', catV2: 'Receber e transmitir jogos',       det: 'IBC - Espaço e estrutura',                                                                    moeda: 'Dólar', qtd: 1, valorUn: 54700,  aliq: 0.15,   orcado: 360376.47,  bookado: 'Sim' },
  { id: 2,  resp: 'João Crispim', cat: 'Infraestrutura & Conectividade IBC', catV2: 'Receber e transmitir jogos',       det: 'IBC - Internet',                                                                               moeda: 'Dólar', qtd: 1, valorUn: 15780,  aliq: 0.15,   orcado: 103962.35,  bookado: 'Sim' },
  { id: 3,  resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Receber e transmitir jogos',       det: 'IBC - Equipamentos',                                                                           moeda: 'Dólar', qtd: 1, valorUn: 40000,  aliq: 0.3941, orcado: 369697.97,  bookado: 'Não' },
  { id: 4,  resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Sinais e conteúdos extras FIFA',   det: 'IBC - Servidores de Streaming (104 jogos, 20 sinais, com Multifeed)',                          moeda: 'Dólar', qtd: 1, valorUn: 16600,  aliq: 0.2763, orcado: 128451.02,  bookado: 'Não' },
  { id: 5,  resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Backups e redundâncias',           det: 'IBC - Servidores de Streaming (104 jogos, 20 sinais)',                                        moeda: 'Dólar', qtd: 1, valorUn: 15400,  aliq: 0.2763, orcado: 119165.40,  bookado: '' },
  { id: 6,  resp: 'João Crispim', cat: 'Tec Fee',                            catV2: '4k',                               det: 'HBS - World feed',                                                                             moeda: 'Dólar', qtd: 1, valorUn: 6300,   aliq: 0.15,   orcado: 41505.88,   bookado: 'Não' },
  { id: 7,  resp: 'João Crispim', cat: 'Tec Fee',                            catV2: 'Sinais e conteúdos extras FIFA',   det: 'HBS - Multi Feed Package - IBC',                                                              moeda: 'Dólar', qtd: 1, valorUn: 26100,  aliq: 0.15,   orcado: 171952.94,  bookado: 'Sim' },
  { id: 8,  resp: 'João Crispim', cat: 'Tec Fee',                            catV2: 'Sinais e conteúdos extras FIFA',   det: 'HBS - MP Router (16 sinais) - IBC',                                                           moeda: 'Dólar', qtd: 1, valorUn: 19900,  aliq: 0.15,   orcado: 131105.88,  bookado: 'Sim' },
  { id: 9,  resp: 'João Crispim', cat: 'Infraestrutura & Conectividade IBC', catV2: 'Receber e transmitir jogos',       det: 'HBS - Conectividade das Fibras (MP Room - MCR)',                                               moeda: 'Dólar', qtd: 1, valorUn: 6000,   aliq: 0.15,   orcado: 39529.41,   bookado: 'Sim' },
  { id: 10, resp: 'João Crispim', cat: 'Tec Fee',                            catV2: 'Backups e redundâncias',           det: 'HBS - Satélite e SRT (104 jogos, pacote completo 20 sinais)',                                  moeda: 'Dólar', qtd: 1, valorUn: 190000, aliq: 0.15,   orcado: 1251764.71, bookado: 'Sim' },
  { id: 11, resp: 'João Crispim', cat: 'Operação de Transmissão',            catV2: 'Receber e transmitir jogos',       det: 'HBS - Grafismo em Português',                                                                  moeda: 'Dólar', qtd: 1, valorUn: 121200, aliq: 0.15,   orcado: 798494.12,  bookado: 'Sim' },
  { id: 12, resp: 'João Crispim', cat: 'Tec Fee',                            catV2: '4k',                               det: 'HBS - Grafismo em Português (4k)',                                                             moeda: 'Dólar', qtd: 1, valorUn: 20200,  aliq: 0.15,   orcado: 133082.35,  bookado: 'Sim' },
  { id: 13, resp: 'João Crispim', cat: 'Infraestrutura & Conectividade IBC', catV2: 'Receber e transmitir jogos',       det: 'Fibra - Conectividade IBC - Pops em Dallas (1+1)',                                             moeda: 'Dólar', qtd: 1, valorUn: 87000,  aliq: 0.3941, orcado: 804093.08,  bookado: 'Sim' },
  { id: 14, resp: 'João Crispim', cat: 'Operação de Transmissão',            catV2: 'Receber e transmitir jogos',       det: 'Fibra - Transporte de sinais HD (20 canais, todos os jogos)',                                  moeda: 'Dólar', qtd: 1, valorUn: 217000, aliq: 0.3941, orcado: 2005611.49, bookado: 'Sim' },
  { id: 15, resp: 'João Crispim', cat: 'Tec Fee',                            catV2: '4k',                               det: 'Fibra - Transporte de sinais 4k',                                                              moeda: 'Dólar', qtd: 1, valorUn: 38700,  aliq: 0.3941, orcado: 357682.79,  bookado: 'Não' },
  { id: 16, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Produção Brasil',                  det: 'Externa - Kit Mojo (x8)',                                                                      moeda: 'Real',  qtd: 8, valorUn: 6000,   aliq: 0,      orcado: 48000.00,   bookado: '' },
  { id: 17, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Produção Brasil',                  det: 'Externa - Kit Mojo Dados (x8)',                                                                moeda: 'Real',  qtd: 8, valorUn: 250,    aliq: 0,      orcado: 2000.00,    bookado: '' },
  { id: 18, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobertura Seleção Brasileira',     det: 'Externa - Kit Mojo (Seleção)',                                                                 moeda: 'Real',  qtd: 1, valorUn: 6000,   aliq: 0,      orcado: 6000.00,    bookado: 'Não' },
  { id: 19, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. PT/ARG/ESP/FRA',           det: 'Externa - Kit Mojo (PT/ARG/ESP/FRA)',                                                          moeda: 'Real',  qtd: 6, valorUn: 6000,   aliq: 0,      orcado: 36000.00,   bookado: 'Não' },
  { id: 20, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. ITA/ING/URU/ALE',          det: 'Externa - Kit Mojo (ITA/ING/URU/ALE)',                                                         moeda: 'Real',  qtd: 4, valorUn: 6000,   aliq: 0,      orcado: 24000.00,   bookado: 'Não' },
  { id: 21, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobertura Seleção Brasileira',     det: 'Externa - Kit Mojo Dados (Seleção)',                                                           moeda: 'Real',  qtd: 1, valorUn: 500,    aliq: 0,      orcado: 500.00,     bookado: 'Não' },
  { id: 22, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. PT/ARG/ESP/FRA',           det: 'Externa - Kit Mojo Dados (PT/ARG/ESP/FRA)',                                                    moeda: 'Real',  qtd: 6, valorUn: 500,    aliq: 0,      orcado: 3000.00,    bookado: 'Não' },
  { id: 23, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. ITA/ING/URU/ALE',          det: 'Externa - Kit Mojo Dados (ITA/ING/URU/ALE)',                                                   moeda: 'Real',  qtd: 4, valorUn: 500,    aliq: 0,      orcado: 2000.00,    bookado: 'Não' },
  { id: 24, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobertura Seleção Brasileira',     det: 'Externa - TVU (Seleção Brasileira)',                                                           moeda: 'Dólar', qtd: 4, valorUn: 4170,   aliq: 0.2763, orcado: 129070.06,  bookado: 'Não' },
  { id: 25, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. PT/ARG/ESP/FRA',           det: 'Externa - TVU (PT/ARG/ESP/FRA)',                                                               moeda: 'Dólar', qtd: 4, valorUn: 4170,   aliq: 0.2763, orcado: 129070.06,  bookado: 'Não' },
  { id: 26, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. ITA/ING/URU/ALE',          det: 'Externa - TVU (ITA/ING/URU/ALE)',                                                              moeda: 'Dólar', qtd: 6, valorUn: 4170,   aliq: 0.2763, orcado: 193605.09,  bookado: 'Não' },
  { id: 27, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobertura Seleção Brasileira',     det: 'Externa - Kit de ENG (Seleção Brasileira)',                                                    moeda: 'Dólar', qtd: 4, valorUn: 4180,   aliq: 0.3941, orcado: 154533.75,  bookado: 'Não' },
  { id: 28, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. PT/ARG/ESP/FRA',           det: 'Externa - Kit de ENG (PT/ARG/ESP/FRA)',                                                        moeda: 'Dólar', qtd: 4, valorUn: 4180,   aliq: 0.3941, orcado: 154533.75,  bookado: 'Não' },
  { id: 29, resp: 'João Crispim', cat: 'Locação de Equipamentos',            catV2: 'Cobert. ITA/ING/URU/ALE',          det: 'Externa - Kit de ENG (ITA/ING/URU/ALE)',                                                       moeda: 'Dólar', qtd: 6, valorUn: 4180,   aliq: 0.3941, orcado: 231800.63,  bookado: 'Não' },
  { id: 30, resp: 'João Crispim', cat: 'Freelas - EUA',                      catV2: 'Cobertura Seleção Brasileira',     det: 'Reporter Cinematográfico - Seleção (Em negociação)',                                           moeda: 'Real',  qtd: 1, valorUn: 84000,  aliq: 0,      orcado: 84000.00,   bookado: 'Não' },
  { id: 31, resp: 'João Crispim', cat: 'Freelas - EUA',                      catV2: 'Cobert. PT/ARG/ESP/FRA',           det: 'Reporter Cinematográfico - PT/ARG/ESP/FRA (Em negociação)',                                    moeda: 'Real',  qtd: 4, valorUn: 75000,  aliq: 0,      orcado: 300000.00,  bookado: 'Não' },
  { id: 32, resp: 'João Crispim', cat: 'Freelas - EUA',                      catV2: 'Cobertura Seleção Brasileira',     det: 'Reporter Cinematográfico - Seleção 2 (Em negociação)',                                         moeda: 'Real',  qtd: 1, valorUn: 84000,  aliq: 0,      orcado: 84000.00,   bookado: 'Não' },
  { id: 33, resp: 'João Crispim', cat: 'Freelas - Brasil',                   catV2: 'Produção Brasil',                  det: 'Equipe de externa RJ e SP',                                                                    moeda: 'Real',  qtd: 2, valorUn: 0,      aliq: 0,      orcado: 0,          bookado: 'Não' },
  { id: 34, resp: 'Ivan Souza',   cat: 'Freelas - EUA',                      catV2: 'Cobertura Seleção Brasileira',     det: 'Reporter Cinematográfico - Time LET',                                                          moeda: 'Real',  qtd: 3, valorUn: 10000,  aliq: 0,      orcado: 30000.00,   bookado: 'Não' },
  { id: 35, resp: 'Ivan Souza',   cat: 'Freelas - Brasil',                   catV2: 'Produção Brasil',                  det: 'Assunção - Equipe Switcher / Estúdio / Central (Maio, Junho e Julho)',                         moeda: 'Real',  qtd: 3, valorUn: 0,      aliq: 0,      orcado: 0,          bookado: 'Não' },
  { id: 36, resp: 'Ivan Souza',   cat: 'Sorteio Copa',                       catV2: 'Realizado',                        det: 'Sorteio Grupos - Cobertura do sorteio da Copa EUA',                                            moeda: 'Real',  qtd: 1, valorUn: 22300,  aliq: 0,      orcado: 22300.00,   bookado: '' },
]
