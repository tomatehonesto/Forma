# Plano — a forma de aplicação e a folha de registrar

**Desenho:** [`../specs/2026-09-21-forma-de-aplicacao-design.md`](../specs/2026-09-21-forma-de-aplicacao-design.md)
**Data:** 21 de setembro de 2026

Seis fases. Cada uma termina num commit que passa no `tsc` e num aplicativo
que funciona — nenhuma delas deixa a árvore num estado em que a pessoa veria
algo quebrado.

A ordem não é arbitrária: as três primeiras não mudam uma linha de pixel. Elas
constroem o chão para a fase 4, que é a única que a pessoa enxerga.

---

## Fase 1 — o vocabulário e o catálogo

**Nada muda na tela.** É a fase que cria o conceito.

1. **`src/logic/formas.ts` (novo).** `Forma`, `FORMAS` e `formaDe(S)`, como
   no desenho. `formaDe` lê `S.profile.forma` e cai no primeiro item de
   `MEDS[med].formas` quando o perfil não tem resposta — é o que faz quem já
   está em tratamento não sentir nada.

2. **`src/logic/meds.ts`.**
   - `Med` ganha `formas: Forma[]`.
   - As sete entradas atuais recebem `formas: ['caneta']`.
   - `shelf` ganha o significado de **zero = não sabemos**, documentado no
     bloco de procedência que já existe no topo do arquivo.
   - `faixaDaMolecula(mol)`: mínimo e máximo das doses de todas as entradas
     de marca que compartilham a molécula. É o que dá faixa à régua do
     manipulado **sem inventar número**.

   ⚠️ **CORRIGIDO AO EXECUTAR:** os medicamentos novos — Rybelsus e as duas
   manipuladas — saíram desta fase e foram para a fase 2. O motivo é que o
   cadastro lista `Object.entries(MEDS)` inteiro: pô-los aqui os faria
   aparecer no seletor HOJE, e o manipulado tem escada vazia, o que
   deixaria o passo da dose sem degrau nenhum para oferecer. A fase 1
   prometeu não mudar nada visível, e com eles ela mudaria — para pior.
   Eles entram junto com o cadastro que sabe lidar com eles.

   ⚠️ **ESCOPO A MAIS, e ele é obrigatório:** `Med` ganhou também
   `marca: boolean`. O seletor do cadastro escreve `${m.label}®`, sem
   condição. Com uma entrada manipulada no catálogo isso viraria
   "Semaglutida manipulada®" — o aplicativo afirmando uma marca registrada
   que não existe, numa tela de saúde. O campo nasce nesta fase porque é o
   catálogo que o define; quem o consome é a fase 2.

3. **`src/logic/seed.ts`.** `profile.forma?: Forma` no tipo. A semente não
   ganha o campo — ela é o teste vivo de que a ausência funciona.

**Verificação:** `tsc`, e o aplicativo no navegador rodando idêntico. Se algo
mudou de aparência nesta fase, algo está errado.

⚠️ **Rybelsus tem cadência diária, e a meia-vida fica para a fase 2 junto
com ele.** Não invento: se não houver fonte para a meia-vida da semaglutida
oral, a entrada nasce com o `hl` marcado no mesmo aviso de procedência que
já existe no arquivo, e a curva farmacológica dela fica de fora até alguém
conferir.

⚠️ **Descoberto ao executar: a pergunta de validade precisa de
`injetavel && shelf === 0`, e não só do zero.** Cartela de comprimido não
vence "depois de aberta" do jeito que uma caneta vence — ali o zero quer
dizer "não se aplica", e não "pergunte". Está escrito no bloco de `shelf`.

---

## Fase 2 — os medicamentos novos, e o cadastro perguntando

0. **`src/logic/meds.ts`** — as entradas que a fase 1 devolveu para cá:
   `rybelsus` (`formas: ['comprimido']`, `marca: true`) e as duas
   manipuladas (`formas: ['frasco', 'seringa']`, `doses: []`, `shelf: 0`,
   `marca: false`).

1. **`src/app/cadastro.tsx`.**
   - O seletor passa a escrever `®` só quando `m.marca`.
   - O passo da dose precisa saber o que fazer com `doses: []` — hoje ele
     desenha a escada do catálogo, e escada vazia não desenha nada. Para
     manipulado, a dose vem da régua na faixa de `faixaDaMolecula`, que é
     o mesmo controle que a fase 4 usa na folha de registrar.
   - `'forma'` entra em `TODOS`, logo depois de `'medicamento'`.
   - O filtro de `passos` ganha:
     `if (x === 'forma') return (MEDS[r.med ?? '']?.formas.length ?? 1) > 1;`
     — pelo mesmo mecanismo que já esconde `'dose'` de quem não sabe o
     medicamento.
   - O passo em si: `Opcoes` com as formas daquele medicamento, rotuladas
     por `FORMAS[f].recipiente`.
   - `r.forma` entra no estado do formulário, no `salvar` e na linha do
     resumo.

**Verificação:** no navegador — escolher uma manipulada e ver o passo
aparecer; voltar e escolher Mounjaro e ver o passo sumir da fila, com a
numeração se ajustando (o cadastro já faz isso para `'inicio'` e `'dose'`).

### ⚠️⚠️ O erro grave que esta fase quase cometeu: a via

`faixaDaMolecula` somava as doses de todas as entradas com a mesma
molécula. Com o Rybelsus no catálogo isso vira um defeito clínico:
semaglutida **injetável** vai de 0,25 a 2,4 mg; semaglutida **oral** vai de
3 a 14 mg. É a mesma molécula e são números que não se comparam.

Somadas, a régua de dose de um frasco injetável iria até 14 mg — seis vezes
a dose máxima daquela via, oferecida num controle que a pessoa arrasta.

A função passou a pedir a FORMA, e não só a molécula, e só soma
medicamentos cuja via bate com a de quem perguntou. Por isso ela **mudou de
arquivo**: saiu de `meds.ts` e foi para `formas.ts`, que é quem sabe o que
é via.

Verificado: escolhendo semaglutida manipulada, a dose nasce em **1,35 mg** —
o meio de 0,25–2,4 — e não no meio de uma faixa misturada.

### Escopo a mais, obrigatório: o `®` em `plano.tsx`

`plano.tsx` escrevia `${med.label}®` em dois lugares, sem condição. Com um
manipulado selecionável isso vira "Semaglutida manipulada®" — a mesma marca
registrada inventada que o `marca` da fase 1 existe para impedir, só que
noutra tela. Consertado junto, porque foi esta fase que o tornou alcançável.
O artigo também muda: "com o Mounjaro®", mas "com semaglutida manipulada".

---

## Fase 3 — o calendário

1. **`src/ui/calendario.tsx` (novo).** Uma grade de mês, navegável por mês,
   com o dia escolhido marcado. Não aceita futuro: dias adiante de hoje
   nascem apagados e não respondem ao toque.

   Nasce em `src/ui/` e não dentro da folha porque três outras capturas
   ("Quando" da refeição, do exercício, do exame) têm a mesma pergunta
   resolvida de três jeitos hoje. Esta fase **não** as converte — só deixa a
   peça pronta para quando isso valer a pena.

**Verificação:** no navegador, montado sozinho numa rota de teste descartável,
antes de entrar na folha. É mais barato consertar uma grade de dias isolada do
que dentro de um formulário.

---

## Fase 4 — a folha de registrar

> ⚠️ **REVISADA DEPOIS DO TESTE.** O que está descrito abaixo foi o que
> subiu primeiro; três coisas mudaram quando o Nick usou a tela. O
> registro do porquê está no fim desta seção, em **Depois do teste**.

A fase que a pessoa vê. É a maior, e por isso vem depois de as três peças
dela já existirem e estarem verificadas.

1. **`src/app/_layout.tsx`.** `aplicacao` e `aplicacao-ok` saem da lista de
   telas comuns e entram na lista de `transparentModal` +
   `slide_from_bottom`, junto das outras capturas.

2. **`src/app/aplicacao.tsx`.** `TelaInterna` → `SheetScreen`. O `Titulao`
   sai (a folha já tem título) e o rodapé de `Botao` vira o `rodape` do
   `SheetScreen`.

3. **Quando.** Os chips continuam e ganham `'outro'` no fim. Escolhendo-o,
   abre o calendário — dentro da própria folha, abaixo dos chips, e não numa
   segunda folha por cima. O aviso do campo diz que a contagem da próxima
   dose sai daí.

4. **Dose.** Com escada: `Opcoes` com os degraus. Sem escada: `Regua` na
   faixa de `faixaDaMolecula`. O `Stepper` sai.

5. **Local.** `Chips` com os seis locais de `ZONAS`, rotulados por
   `siteLabel`, o sugerido marcado. Abaixo, as duas linhas de texto que já
   existem hoje — o descanso e a posição na rotação —, intocadas: elas são a
   parte que funciona. `MapaCorpo` sai deste arquivo; `src/ui/corpo.tsx`
   continua servindo `/aplicacoes`.
   Toda a seção atrás de `FORMAS[forma].injetavel`.

6. **Recipiente.** O rótulo vem de `FORMAS[forma].recipiente`. A opção em uso
   perde a dose do texto — passa a dizer o medicamento e a contagem de doses
   do recipiente. Também atrás de `injetavel`.

7. **Título e textos.** De `FORMAS[forma].acao`.

**Verificação:** no navegador, com o estado forçado para as três formas
(caneta, frasco, comprimido) — conferindo que a folha sobe, que o calendário
não aceita futuro, que a dose grava o degrau certo, e que para comprimido as
duas últimas seções não existem e o título muda.

⚠️ **O `MapaCorpo` é código que sai de circulação.** Ele vive dentro de
`aplicacao.tsx`, não em `src/ui/`. Sai junto — e `src/ui/corpo.tsx`, que é a
peça de verdade, fica. Sem isso a árvore ganharia um componente morto.

### Quatro coisas que só apareceram na tela

Nenhuma delas estava no plano, e as quatro são consequência direta da fase.

1. **"Outro caneta".** O rótulo do recipiente é montado com o nome dele, e
   português cobra concordância: a caneta, o frasco, a seringa, a cartela.
   `FORMAS` ganhou `genero`, e com ele `umOutro()` e `oA()`. O defeito
   aparecia em quatro frases, nas duas telas.

2. **O título duplicado na confirmação.** `SheetScreen` sempre teve título
   obrigatório, e a `Confirmacao` já diz o que aconteceu em h2,
   centralizado, embaixo do visto verde. Os dois juntos escreviam "Dose
   registrada" duas vezes, em dois tamanhos, a dois centímetros um do
   outro. `titulo` virou opcional — sem ele o cabeçalho fica sendo o que
   tem de ser numa confirmação: a alça e o X.

3. **"1 dias".** Era raro quando todo medicamento era semanal, e virou
   rotina com o oral diário: a próxima dose é sempre amanhã. O plural
   passou a ter o caso de um.

4. **`Chips` ganhou `nota`.** O pedido era marcar o local sugerido, e o
   componente só tinha `n`, uma contagem numérica. `nota` é uma palavra
   que qualifica o chip, desenhada igual — recuada, para ser lida depois
   do nome.

---

### Depois do teste

**1. A data virou um campo que abre o calendário — em duas rodadas.**

As pastilhas saíram primeiro. Eram sete atalhos — Hoje, Ontem,
Anteontem, três dias com nome e "Outro dia" — e o argumento contra eles
foi do Nick: *"sinto que algumas pessoas têm dificuldade com datas"*.
Quem quer registrar a aplicação de terça precisa traduzir "terça" para
uma pastilha, e contar dias para trás de cabeça é justamente o que se
erra.

A primeira tentativa foi deixar a grade **sempre aberta**. Acertou a
tradução e errou o tamanho: 280 px no topo empurravam dose, local e
recipiente para baixo da dobra em todo registro — inclusive nos nove de
dez em que a data é hoje e ninguém encosta nela. Eu tinha previsto o
custo e o subestimado; quem viu foi ele, usando.

A forma final é um campo com a data por extenso — "Segunda, 21 de
setembro" — que abre a grade no toque e a fecha na escolha. O valor fica
à vista mesmo fechado, que é o que separa este campo das pastilhas: lá,
fechada, a tela mostrava "Anteontem" e a pessoa tinha de decodificar.

`diasParaAplicar` ficou sem consumidor e foi removida do `derive.ts`. E
o subtítulo do cabeçalho saiu junto: ele escrevia a mesma data três
centímetros acima do campo.

**2. A dose virou um fato com CTA, e era uma pergunta toda semana.** Ela
muda na titulação: uma vez por mês no começo, e quase nunca depois da
manutenção. Seis degraus na tela toda semana é uma escolha que se responde
sozinha em nove de dez registros. Agora a tela diz `Mounjaro · 5,0 mg`, e a
escada só aparece para quem tocar em **"Mudei a dose"**. O medicamento
entrou na mesma linha e saiu do campo do recipiente, onde estava
repetido.

A alternativa considerada — medicamento implícito no topo, só a dose
selecionável — resolvia a duplicação e não o esforço.

**3. O local virou duas perguntas, e não tem mais rolagem horizontal.** Os
seis locais são três regiões vezes dois lados, e apresentá-los como seis
opções soltas fazia ler "Abdômen" três vezes para achar o lado. Agora são
três alvos e depois dois, tudo empilhado e visível. O id gravado continua
o mesmo par, então nada mudou para os gráficos de rodízio.

E todo controle da tela passou a ser o mesmo `Opc`: não havia motivo para
dois estilos de seleção na mesma folha, e o que rolava para o lado ficava
fora da tela para quem não sabia que estava lá.

---

## Fase 5 — a validade do recipiente

1. **`src/app/caneta-nova.tsx`.** Quando `MEDS[med].shelf === 0`, aparece um
   campo a mais: quantos dias depois de aberto. Sem valor padrão — deixar um
   número pré-escolhido num campo destes é exatamente inventar o dado.

2. **`src/logic/seed.ts`.** `pen.validadeDias?: number`.

3. **`src/logic/derive.ts`.** `canetaAtual()` prefere `pen.validadeDias` ao
   `SHELF_DAYS(med)`. Quando os dois faltam — manipulado sem resposta —,
   `vence` fica `null`, e quem consome já sabe lidar com isso.

**Verificação:** no navegador, um estado com medicamento manipulado e sem
resposta de validade, conferindo que **nenhuma tela inventa uma data de
vencimento** e que nenhuma delas mostra um vazio feio no lugar.

---

## Fase 6 — a dívida, registrada

Não é código: é a honestidade sobre o que ficou.

1. **`PENDENCIAS.md`** ganha um item: a partir daqui existe gente que escolhe
   "comprimido" e encontra a palavra "caneta" escrita em telas que estas
   fases não tocam. São 177 menções em 37 arquivos, e a varredura é a peça 3
   do desenho. O item diz onde estão e qual é a regra de substituição
   (`FORMAS[forma].recipiente`, `.verbo`, `.acao`).

2. **Os textos das telas que ESTAS fases tocam** são corrigidos nelas, e não
   ficam para a varredura. O que se toca, se conserta.

---

## O que este plano não faz

- Não converte as outras capturas para o calendário novo.
- Não varre as 177 menções.
- Não mexe no estoque das formas novas além de guardar a validade.
- Não cria curva farmacológica para o Rybelsus sem fonte para a meia-vida.

## Ordem de commit

Uma fase, um commit. As fases 1 a 3 podem ir juntas se nenhuma delas
surpreender — elas não mudam nada visível, e um commit que não muda nada
visível é barato de reverter. A fase 4 vai sozinha, porque é a que a pessoa
sente.
