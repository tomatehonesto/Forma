# Plano: a leitura da semana

**Especificação:** [`../specs/2026-10-01-leitura-da-semana-design.md`](../specs/2026-10-01-leitura-da-semana-design.md)
**Data:** 1º de outubro de 2026

Cada etapa termina com a sonda passando, `tsc` limpo e um commit. As
etapas 1 e 2 não chamam o servidor nem gastam crédito.

## Etapa 1 — o motor de descobertas (no aparelho)

`src/logic/descobertasDaSemana/`:

- `dias.ts` — a semana (a última segunda a domingo completa) e a série
  de dias das últimas 6 semanas: os comportamentos (café da manhã, jantar
  tarde, proteína e água na meta, treino, sono de 7 h, pós-aplicação) e
  os resultados (fome, energia, humor, enjoo), com `null` onde não há
  registro que diga.
- `regua.ts` — a comparação de dois grupos (padrão forte, começo de
  padrão) e a leitura de série (tendência acima do ruído da pessoa).
- `detectores.ts` — os oito detectores: hábitos, ritmo, exames,
  exercício, sintomas, peso semanal, medidas, constância (com a semana
  de tratamento como último retrato, para sempre haver um).
- `index.ts` — `candidatasDaSemana(S)` e `escolherDaSemana(candidatas,
  historico)`: nível, força, alternância de área e a memória de 3
  semanas.

Sonda nova, `scripts/leitura-da-semana.ts`:
- 100 diários aleatórios: padrão forte em no máximo 5;
- o padrão plantado (café da manhã baixa a fome) é achado, com a direção;
- dia sem refeições não conta como "sem café"; pares óbvios fora;
- cada detector de tendência acha o caso plantado e ignora o ruído;
- todo diário com o mínimo sai com uma descoberta; as áreas se alternam.

A régua (o z mínimo do padrão forte) é ajustada pela simulação até a
meta de alarme falso passar sem perder o padrão plantado.

## Etapa 2 — o resumo da semana

`src/logic/resumoDaSemana.ts`, no formato de `resumoDaJornada`, e o
"mínimo de registro" (3 check-ins ou uma pesagem na semana). Na mesma
sonda: seções, teto, nada de terceiros.

## Etapa 3 — o servidor

`servidor/api/leitura.ts` e `servidor/leitura/prompt.ts`; o tipo de cota
`leitura` (2 por dia) numa migração, com regra e mutante; `lerPedido` e
`parametrosDaLeitura` exportados para a sonda e a bateria.

## Etapa 4 — o aceite

`src/app/aceite-leitura.tsx`, `VERSAO_DO_ACEITE_DA_LEITURA`, o campo no
estado (`traducao.ts`), e o catálogo nos seis idiomas.

## Etapa 5 — o card e a tela

O card "Sua semana" na Home, `/leitura`, `S.leituras` (só no aparelho),
e "Conversar sobre isso" abrindo a conversa com a leitura.

## Etapa 6 — a Política 2.3

## Etapa 7 — a bateria da leitura

Fluxo `leitura` em `scripts/avaliacao`, ~12 semanas, o mesmo juiz; uma
rodada (~US$ 0,50) antes de ligar.
