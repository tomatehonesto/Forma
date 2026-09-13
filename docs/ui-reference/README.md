# Referência de UI — Forma

Contexto de design para o app. Serve para qualquer pessoa (ou agente) que
vá mexer na interface sem ter participado das decisões originais.

## Ordem de precedência

Quando houver conflito, vale nesta ordem:

1. **O frame do Figma** — `Aplicativo de Caneta GLP-1`, arquivo `Ls9zGOWNsWu21p61sbsyB7`.
   É a fonte de verdade da identidade do Forma. O frame `Home` é o `181:1869`.
2. **`src/theme.ts`** — os tokens extraídos daquele frame. Cada bloco está
   marcado com `[figma]` (lido do arquivo) ou `[infer]` (derivado por
   consistência, substituível quando chegar desenho).
3. **Esta pasta** — referências externas. Entram para preencher lacunas e
   resolver casos que o Figma ainda não cobriu. **Nunca sobrescrevem 1 e 2.**

## O que é e o que não é

Isto é extração de **padrão**: como resolvem densidade de dado, hierarquia,
agrupamento, estado vazio, gráfico. Não é catálogo para copiar tela.

As imagens baixadas ficam em `.ui-refs/` (ignorada pelo git) — são material
de terceiros e não entram no repositório nem no bundle do app. O que fica
versionado é a análise.

## Método

O site é feito de imagem: o design real está dentro dos JPEGs, não no DOM.
Então são duas passadas por case:

1. **DOM** — extrair tipografia, cor, raio, espaçamento e grid por
   `getComputedStyle`. Preciso e numérico.
2. **Imagem** — baixar os JPEGs do case e abrir para ler as telas. É onde
   está o desenho de produto de fato.

Script de coleta: `scripts/ui-ref-fetch.md` (instruções, não automatizado).

## Sistema do rondesignlab.com (site)

Medido em `/cases` e nas páginas de case:

| | |
|---|---|
| Tipografia | Urbanist — 400 corrido, 600 em título. Prima do Outfit: geométrica, contraste baixo |
| Fundo | `#FAFAFA` |
| Superfície | `rgba(0,0,0,0.1)` — **sem borda**, separação por tom |
| Raio | 25 dominante; 30 e ~35 em card de mídia |
| Cor | preto/branco como base; cor forte só por case, um acento de cada vez |
| Card de case | imagem sangrada, `overflow: hidden`, texto sobre véu escuro, 711×437 (≈1,63:1) |
| Grade | 2 colunas, respiro curto (14px) |
| Largura máx. | 1265 |

### O que disso já entrou no Forma

- `Card` sem borda, separação por tom + sombra de 5% (`src/ui/kit.tsx`)
- `MediaCard` — imagem sangrada com véu e texto no rodapé
- Padding de tela em 24
- Disciplina de peso: 400 corrido, 600 em título, um número grande por tela

## Cases analisados

| Case | Relevância | Arquivo |
|---|---|---|
| Luna — smart ring, tracking de saúde | **Alta** — mesmo problema do Forma | [ron-luna.md](ron-luna.md) |

### Fila (17 restantes)

Ordenados por proximidade com o Forma:

**Alta** — `aetna-crm-medical-saas`, `everybot-cleaner-mobile-app`,
`web3-nft-concepts-mobile-app` (mobile e/ou saúde)

**Média** — `empower-pfm-finance`, `netsuite-crm-dashboard`,
`mineralsoft-oil-gas-dashboard` (densidade de dado, gráfico, métrica)

**Baixa** — `tectra-construction`, `clause-os-compliance`, `bizspeed-tms`,
`ecosolar`, `revanto-sales`, `xtiles-crm`, `centralflow-crm`, `katana-erp`,
`sparkcause`, `solaflux`, `golden-ticket` (SaaS web, pouco transferível
para app mobile)
