# Plano — primeiros passos, e o fim das frases sobre o que não aconteceu

**Desenho:** [`../specs/2026-09-26-primeiros-passos-design.md`](../specs/2026-09-26-primeiros-passos-design.md)
**Data:** 26 de setembro de 2026

Três etapas, cada uma num commit que passa nas conferências de sempre
(`npx tsc --noEmit -p .`, `node scripts/idioma-congelado.mjs`,
`node scripts/conferencia.mjs <idioma>` nos seis, `node scripts/espaco-fino.mjs
fr-FR --conferir`, e as sondas de scripts/) e é visto como pessoa nova no
servidor de produção, na origem de teste 127.0.0.1:8082.

**Ver como pessoa nova** pede passar da tranca da conta, que ninguém cria
em teste. A sonda de sempre, marcada `SONDA TEMPORÁRIA` e tirada antes de
cada commit: em app/_layout, `precisaDeConta` falso só quando a página é
127.0.0.1:8082.

---

## Etapa 1 — o cartão, e a Home que espera o dado

### 1.1 A lógica (logic/primeirosPassos.ts, nova)

Pura, sem React Native, para a sonda de node conseguir importar:

- `type PassoId = 'plano' | 'aplicacao' | 'checkin' | 'lembretes' | 'saude'`
- `type Passo = { id; ic; titulo; sub; pronto; to? }` — o formato de
  `ItemDoPreparo`, com os textos do catálogo.
- `passos(S, { permissao, aparelho })` — a permissão (`Permissao`, de
  logic/avisos) e o aparelho (`{ id, nome } | null`, de `aparelhoDaVez`)
  entram como argumento, porque os dois são do aparelho e assíncronos, e a
  sonda roda em node. Regras da Peça 1 da especificação: `lembretes` some
  com `indisponivel`, `saude` some com aparelho nulo.
- `passosEscondidos(S)`, `passosConcluidos(S)` — as marcas
  `primeiros-passos-escondidos` e `primeiros-passos-concluidos`, em
  `apresentacoesVistas`.
- `esconderPassos(s)`, `reabrirPassos(s)`, `concluirPassos(s)` — as
  mutações, para `update`.
- `temEvolucao(S)` — duas pesagens em dias diferentes (`startOfDay`).

### 1.2 Os textos

Um grupo `primeirosPassos` em `home.ts`, nos seis idiomas: título,
`progresso(n, m)`, título e subtítulo de cada item (o da saúde recebe o
nome do aparelho), "Tudo pronto!" e a frase dele, "Esconder por agora", e
o título e o subtítulo da linha do Perfil. O francês passa pelo espaço
fino.

### 1.3 O cartão (ui/primeirosPassos.tsx, nova)

- Lê o estado da store e a permissão (`estadoDaPermissao`) na montagem e
  na volta ao aplicativo (`AppState`). **Não desenha nada até a primeira
  leitura da permissão chegar**, para a barra não pular de "1 de 5" para
  "2 de 5" na frente da pessoa.
- Some quando o diário não terminou o cadastro, quando está escondido ou
  concluído.
- Cabeçalho (título e "N de M"), barra fina na cor de ação, uma linha por
  item — ícone num círculo claro, título, subtítulo e seta; o item pronto
  troca a seta pelo visto e perde o subtítulo. "Esconder por agora" em
  texto no pé.
- **A comemoração:** com todos prontos e ainda não concluído, o cartão vira
  "Tudo pronto!" (visto em lima, como `Confirmacao`), espera dois segundos,
  marca o concluído e se recolhe (opacidade). A marca é gravada no fim,
  para uma saída no meio da animação repetir a comemoração na próxima
  abertura, e não perdê-la.

### 1.4 A Home

- `<PrimeirosPassos />` na folha, depois de `FaixaDaConta` e antes de
  "Suas metas diárias".
- "Sua evolução" dentro de `temEvolucao(S)`.

### 1.5 O Perfil

No grupo "Acompanhamento", a primeira linha, só com o cartão escondido e
não concluído: "Primeiros passos", com "N de M" no subtítulo. O toque
reabre e volta para a Home.

### 1.6 A sonda (scripts/primeiros-passos.ts, nova)

- diário novo: o plano pronto, o resto pendente, "1 de 5" com tudo;
- no navegador (permissão `indisponivel`, aparelho nulo): três itens;
- a primeira aplicação e o primeiro check-in marcam os seus; a permissão
  concedida marca os lembretes; a saúde ligada marca a saúde;
- esconder, reabrir e concluir; concluído vence escondido;
- `temEvolucao`: uma pesagem, não; duas no mesmo dia, não; duas em dias
  diferentes, sim.

### 1.7 Ver

Na origem de teste, com a sonda da tranca: o cartão em claro e escuro;
esconder e reabrir pelo Perfil; registrar uma aplicação e um check-in até
a comemoração; "Sua evolução" ausente com uma pesagem.

---

## Etapa 2 — as quatro abas

Para cada frase do inventário (Peça 3 da especificação), achar a função
que a monta, dar a ela o caso de começo, e travar o caso na sonda:

- **Jornada:** o selo de ritmo (`ritmoLento`) só com pesagens bastantes
  para ritmo; a fase do ciclo (`aplicHead`, `faseAplicHint`) só depois da
  primeira aplicação.
- **Cuidado:** o destaque "em dia… boa adesão" sem dose vira começo;
  "Nada precisa de você" com a primeira dose por fazer vira pendência; a
  caneta sem registro pede o registro em vez de supor "4 de 4"; o plural
  de semana.
- **Insights:** a leitura do equilíbrio só com registro.

Os textos novos entram nos seis idiomas. Cada correção é vista como pessoa
nova e com a semente, para não quebrar quem tem dado.

---

## Etapa 3 — a varredura das telas internas

Visitar como pessoa nova: Evolução, Metas, Alimentação, Hidratação,
Exercício, Sintomas, Sinais vitais, Exames, Conquistas, Histórico, Semana,
Ciclo, Aplicações, Caneta, Consultas, Resumo para o médico, Protocolos e
Trilha. O que ferir a regra ("nenhuma frase afirma o que não aconteceu")
entra neste plano, como um item por tela, antes de ser corrigido — em
commits por grupo de telas.

### O que a varredura achou (26 de setembro, pessoa nova sem dose)

Limpas: Metas, Alimentação, Hidratação, Exercício, Sintomas, Sinais
vitais, Exames, Semana, Consultas e Notificações. (Trilha só abre com uma
conquista escolhida.) O resto, por grupo:

**Grupo A — as telas da dose.** A mesma causa da Etapa 2: sem aplicação
registrada, a próxima dose é hoje por recuo, e o estoque é cheio por
recuo.

- **Ciclo:** "Dia 1 depois da aplicação", "Ciclo atual · dia 1 de 7",
  "Próxima dose: sábado, 26 de setembro" e as fases com "agora" e "em 2
  dias". Sem ciclo: as fases como conteúdo, sem posição nem data.
- **Aplicações:** "PRÓXIMA APLICAÇÃO · Hoje", "Ciclo da dose · Dia 1 de
  7", "Restam 4 doses nesta caneta" e a grade marcando hoje como
  "próxima". Sem ciclo: a primeira dose, sem data; sem recipiente, o
  pedido de registro.
- **Caneta:** "Nenhuma caneta aberta", e logo abaixo "Doses usadas 0 de
  4", "Última dose desta caneta: sábado, 17 de outubro", "21 dias", "4
  semanas" e "Receita até 17 out" — projeções de uma caneta que não
  existe. Sem recipiente: só o que é fato, e o registro.
- **O dia (/dia):** "Dia de aplicação · prevista para hoje". Sem ciclo,
  nada é previsto.
- **Protocolos:** "aplicação hoje" na linha do topo, e "Aplicação da
  semana · 0 de 1" antes da primeira dose.

**Grupo B — as telas que resumem.**

- **Resumo para consulta:** "Tempo de tratamento · 1 dias", "Aplicações ·
  0 de 0 previstas" e "Variação · Estável (0,0%) · em 0 dias" — no
  documento que vai para o médico.
- **Perfil:** "Dia 1" antes da primeira dose, e "Atual −0,0 kg" com uma
  pesagem.
- **Evolução:** "Doze semanas de tratamento" no alto, e "0,0 kg" de
  variação com um registro.
- **Histórico:** "1 registro desde o início do tratamento", antes do
  tratamento.

**Grupo C — conquistas e biblioteca.**

- **Conquistas:** "Faltam 1 aplicação" (e dia, treino, refeição…), "1
  dias de jornada", e "Tempo de tratamento · Faltam 30 dias" contando de
  uma primeira dose que não existe.
- **Biblioteca:** "SUA MÉDIA DE SONO ESTÁ EM 0,0 H … nos seus próprios
  registros isso já aparece" sem resposta nenhuma, e "FALTAM 95 G PARA
  SUA MÉDIA BATER A META" com a média de nada.

E um de desenho, visto no caminho: no painel da Jornada, em 375 px, "hoje"
e "faltam" se encostam ("hojefaltam 10,0 kg").

---

## O que este plano não faz

- Não decide se os itens de "Sua evolução" são fixos ou mutáveis
  (questão em aberto da especificação).
- Não mexe no cadastro nem na sincronia.
