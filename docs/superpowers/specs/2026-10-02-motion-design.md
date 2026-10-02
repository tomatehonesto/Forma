# Motion: entrada das telas, gráficos que se desenham e esqueleto

**Data:** 02/10/2026 · **Estado:** aprovado pelo dono; começa depois do commit
da correção do uso diário (as duas mexem na Home, na Jornada e no Cuidado)

## Por quê

O dono pediu motion no carregamento das telas, os componentes aparecendo com
movimento, os gráficos aparecendo desenhando, e o esqueleto de carregamento
pronto. O levantamento de 02/10/2026 achou:

- O Reanimated 4.5.1 já está instalado e configurado (plugin dos worklets no
  babel), e não é usado — todo movimento é `Animated` do RN, escrito à mão em
  cada tela, com durações espalhadas (130 a 1300 ms) e sem tokens.
- Nenhum gráfico anima. O precedente de traço que se desenha é a
  `RodaQueViraVisto` (ui/espera.tsx).
- **Quase nenhuma tela espera.** As telas desenham na hora a partir do estado
  local. Esqueleto nelas seria uma espera inventada. A espera real está em:
  vitrine e ficha das clínicas (Supabase), cartão da rede no Cuidado, leitura
  da IA (já tem esqueleto), conversa, foto do prato e imagens remotas.
- O "reduzir movimento" do sistema é ignorado na maioria das animações, e o
  carrossel da Home anima `width` na thread de JS num laço que nunca pausa.
- A lição de ui/folhas.tsx vale: animação de JS disparada na montagem perde os
  primeiros quadros. A entrada tem de rodar na UI thread.

## Decisões do dono

1. Movimento **sutil**: entrada de ~0,3 s no total, deslocamento pequeno.
2. Esqueleto **só onde há espera de verdade**.

## Desenho

**Fase 0 — base.** Tokens `movimento` em src/theme.ts (curto 180 ms, médio 260,
gráfico 700, passo 40, teto 6, curva out-cubic) e o hook
`src/ui/useMenosMovimento.ts` (valor inicial pelo `useReducedMotion` do
Reanimated e escuta ao vivo pelo `AccessibilityInfo`, como o OrbeSkia). Com
"reduzir movimento" ligado, nada se move: gráficos aparecem prontos, esqueleto
fica parado, a entrada some.

**Fase 1 — entrada em cascata.** Peça `src/ui/cascata.tsx`: cada bloco de
coluna entra com fade + 10–12 px para cima (`entering` do Reanimated), 40 ms
entre blocos, só os 6 primeiros com atraso, sem `exiting`, chaves estáveis de
`Children.toArray` (fragmentos achatados um nível), nunca em itens de linha ou
de `flex`. Ligada por padrão em TelaInterna, FolhaDeHabito e Screen, com uma
saída `semCascata`; nas 4 abas, à mão, uma vez por sessão. Não entra nas
folhas (já sobem pela rota) nem em `Rolagem` (que também é tira e carrossel).
Telas com coreografia própria (plano, checkin-ok, conta, cadastro) ficam como
estão.

**Fase 2 — gráficos que se desenham, uma vez por abertura** (e não a cada
registro, porque o estado é clonado a cada gravação):
- `AreaCurve` e quem a usa (Home, Jornada, plano, doses, 5 telas de
  CardCurva): revelada da esquerda para a direita por recorte (`ClipPath` com
  `Rect` animado), 700 ms.
- `CardSemana`, `Barras`, `BarrasDoCiclo`: barras crescendo de baixo, 35–40 ms
  entre elas; a meta entra antes do dado.
- Barras de progresso: uma peça só, `BarraQueEnche`, no lugar dos 6 desenhos.
- Linha do exame: traço por `strokeDashoffset`; a grade entra inteira com fade.
- Web: conferir as props animadas de SVG; se falharem, o estado final direto.

**Fase 3 — esqueleto onde há espera.** Peça `src/ui/esqueleto.tsx` (linha,
bloco, disco em `c.bg2`, um pulso só para o grupo, parado com "reduzir
movimento", atraso de ~200 ms antes de aparecer, formato do conteúdo final).
O `Lendo` do resumo da semana migra para ela. Esqueletos novos: vitrine e
ficha das clínicas, rostos do cartão da rede no Cuidado, linhas do prato na
foto. Pontos animados na conversa. `transition` do expo-image nas imagens
remotas.

**Fase 4 — consertos.** Carrossel da Home com native driver (scaleX) e pausa
sem foco; os laços que ignoram "reduzir movimento"; a malha do exame
memoizada.

## Verificação

Cada fase: typecheck, sondas, navegador (com o "reduzir movimento" emulado), e
**teste no aparelho** — falha de iPhone não se deduz do navegador (ler o
console pelo Metro). Revisão com agentes antes de cada commit.
