# Plano: Morphi Intelligence de verdade

**Especificação:** [`../specs/2026-09-29-morphi-intelligence-design.md`](../specs/2026-09-29-morphi-intelligence-design.md)
**Aprovado:** 29/09/2026 ("Pode seguir")

Cada passo termina com as verificações de sempre (`tsc`, `servidor
typecheck`, sonda dos primeiros passos, idioma congelado, conferência) e
um commit na main.

## 1. A cota da conversa

- Migração nova: `tipo in (..., 'conversa')`, teto 30.
- `supabase/testes/regras.sql`: o tipo novo e o teto; um mutante (teto
  ausente para `conversa`).
- `scripts/regras.mjs` e `db push` no morphi-dev.

## 2. O servidor

- `servidor/conhecimento/*.md`: sete resumos com referência (ver a
  especificação). Rascunho; um agente confere cada número contra a fonte
  antes do commit.
- `servidor/conversa/prompt.ts`: as regras e a montagem do system prompt
  (regras + base), com `cache_control` no fim do bloco fixo.
- `servidor/api/conversa.ts`: mesma forma das outras três (`export default
  { fetch }`, CORS, token, porta `conversa`), entrada com tetos, saída
  `{ ok, resposta }`. O `usage` volta junto (só números), para a medição.
- `servidor/tsconfig` e o import de texto dos `.md` (string gerada em
  `servidor/conversa/base.ts` por um script, para não depender do
  bundler da Vercel ler `.md`).

## 3. O app

- `src/logic/resumoDaJornada.ts`: função pura, das funções de `derive`.
- `src/logic/conversa.ts`: `perguntarAoMorphi(S, pergunta, historico)`,
  `conversaLigada()`, o aceite (`aceitouAConversa`, `registrarAceiteDaConversa`,
  versão), e os motivos (`sem-servidor`, `sem-rede`, `sem-conta`, `limite`).
- `src/app/companion.tsx`: sai `companionReply`; a pergunta vai ao
  servidor; a folha do aceite; os erros como fala do companheiro; a
  conversa guardada em `S.conversa` (teto de 60 mensagens, não sobe na
  sincronia: `conversa` não é uma PARTE).
- Catálogo `companion.telaConversa` nos seis idiomas: os textos fixos da
  tela, o aceite e os erros.

## 4. Provas

- Sonda, seção 28: o resumo na semente (seções, teto, sem terceiros), na
  pessoa vazia (nenhuma seção), o aceite, e a função com o modelo
  simulado.
- `servidor/conversa/perguntas.json`: as ~20 perguntas; roda só com o OK
  do dono.

## 5. Papéis

- PENDENCIAS: item novo (revisão clínica da base), o item 2 (a Política
  e o aceite), o item 19 (a tela saiu da exceção), o item 39 (a quarta
  função).
- `servidor/README.md`: a função nova.
