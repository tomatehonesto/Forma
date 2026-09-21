# A forma de aplicação, e a reforma de "Registrar aplicação"

**Data:** 21 de setembro de 2026
**Estado:** aprovado em conversa, à espera do plano de implementação

---

## O problema

Duas coisas chegaram na mesma mensagem, e elas são de tamanhos diferentes.

A menor: a tela `/aplicacao` não segue o padrão das outras capturas (é tela
cheia, e não folha), o campo "Quando" só oferece sete dias em chips, a dose
aparece duas vezes na mesma tela, e o local de aplicação se escolhe num
desenho do corpo que é bonito e desconfortável.

A maior: **o aplicativo inteiro assume que o medicamento é uma caneta.** São
177 menções a "caneta" em 37 arquivos, um `S.pen` no estado, as rotas
`/caneta` e `/caneta-nova`, e sete entradas de catálogo que são todas canetas
injetáveis. Quem usa semaglutida manipulada num frasco, ou Rybelsus em
comprimido, não cabe em lugar nenhum disso.

A segunda muda o que a primeira deveria ser: se o medicamento pode não ser
injetável, "Local da aplicação" e "Caneta" não deveriam existir para essa
pessoa, e o título da folha não é "Registrar aplicação", é "Registrar dose".

---

## O recorte

Três peças. Este documento desenha as duas primeiras.

1. **A forma existe.** O catálogo passa a declarar em que formas cada
   medicamento vem; o cadastro pergunta quando há mais de uma; um módulo
   único diz o que cada forma implica.
2. **A folha de registrar.** A reforma da tela, lendo a forma para decidir
   quais seções existem.
3. **A varredura da cópia.** As 177 menções, `S.pen`, as rotas `/caneta` e
   `/caneta-nova`. **Fora deste documento**, de propósito: é trabalho de
   outra natureza, e a peça 1 é o que o torna possível sem adivinhação.

---

## Peça 1 — a forma de aplicação

### A decisão: o catálogo sabe, e o cadastro só pergunta quando ele não sabe

Foram consideradas três:

| | como funciona | por que não |
|---|---|---|
| **A** ✅ | `Med` ganha `formas: Forma[]`; o passo do cadastro só aparece quando há mais de uma | — |
| B | pergunta sempre, com o catálogo dando o padrão | um toque a mais num cadastro de dez passos, para uma pergunta cuja resposta é óbvia para quem usa Mounjaro |
| C | nunca pergunta; o manipulado vira duas entradas de catálogo | o catálogo deixa de ser uma lista de medicamentos e vira uma lista de embalagens |

**A** foi a escolhida. Ela não pergunta o que já se sabe — quem usa Mounjaro
não ganha toque nenhum — e pergunta exatamente onde a resposta tem valor, que
é no manipulado. E a forma passa a morar ao lado de `cad`, `unit` e `shelf`,
que são fatos da mesma natureza sobre o mesmo objeto.

### O vocabulário

Módulo novo, `src/logic/formas.ts`. É a única fonte do que cada forma
implica, e é para onde a varredura da peça 3 vai desaguar.

```ts
export type Forma = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

export const FORMAS: Record<Forma, {
  /** decide se existem local de aplicação e rodízio */
  injetavel: boolean;
  /** como se chama o que guarda o medicamento: "caneta", "frasco", … */
  recipiente: string;
  /** "aplicar" ou "tomar" */
  verbo: string;
  /** "aplicação" ou "dose" — o substantivo dos títulos e confirmações */
  acao: string;
  /** como o estoque se conta */
  estoque: 'doses' | 'volume' | 'unidades' | 'comprimidos';
}>;
```

`comprimido` é o único com `injetavel: false`. É ele que apaga, de uma vez,
o local, o rodízio e metade dos textos da folha.

### O catálogo

`Med` ganha `formas: Forma[]`. As sete entradas atuais recebem `['caneta']`.
Entram entradas novas:

- **Rybelsus** — semaglutida oral, cadência diária, `formas: ['comprimido']`.
- **Semaglutida manipulada** e **Tirzepatida manipulada** —
  `formas: ['frasco', 'seringa']`.

`S.profile.forma: Forma` guarda a resposta, ou a única opção quando só há uma.

**Quem já está em tratamento não tem esse campo**, e não vai ser levado de
volta ao cadastro para ganhá-lo. A leitura é por função, não por campo:

```ts
export const formaDe = (S: State): Forma =>
  S.profile.forma ?? MEDS[S.profile.med]?.formas[0] ?? 'caneta';
```

Como as sete entradas atuais são todas `['caneta']`, ninguém que já usa o
aplicativo enxerga diferença nenhuma. Sem migração, sem pergunta retroativa —
e a regra da casa continua valendo: nenhuma atualização das informações limpa
registro.

### A escada de doses do manipulado

Um medicamento manipulado não tem escada: quem define a dose é a receita,
caso a caso. `doses: []` nas entradas manipuladas.

A folha lê isso: **com escada, a régua trava nos degraus do catálogo; sem
escada, ela corre contínua** numa faixa derivada das doses que existem em
bula para a MESMA MOLÉCULA — semaglutida vai de 0,25 a 2,4 porque é o que
Ozempic e Wegovy somam. A faixa é derivada, não inventada, e isso importa:
é a diferença entre um limite que vem de algum lugar e um palpite com cara
de dado.

### A validade do manipulado

`shelf` — quantos dias o medicamento dura depois de aberto — **não é
derivável para manipulado**: quem define é a farmácia de manipulação, caso a
caso, e o aplicativo não tem como saber.

Então ela é perguntada, e no lugar certo: **no registro de um recipiente
novo** (`/caneta-nova`), não no cadastro. Validade é fato do frasco, não do
tratamento — cada frasco que chega da farmácia tem a sua.

O gatilho é `shelf === 0` no catálogo, e não "é manipulado". Zero passa a
querer dizer **não sabemos** — as entradas manipuladas nascem com ele, e
qualquer entrada futura em que o prazo dependa de quem preparou ganha o mesmo
tratamento sem precisar de uma segunda regra. O campo já carrega um aviso de
procedência no topo de `meds.ts`; este é o caso em que a procedência não
existe.

`S.pen` ganha `validadeDias?: number`, e `canetaAtual()` passa a preferi-lo
ao `SHELF_DAYS(med)` do catálogo.

**Enquanto ninguém responder, o aviso de validade fica calado.** É o
comportamento certo: melhor não dizer nada do que mandar descartar o que está
bom, ou autorizar o que não está.

---

## Peça 2 — a folha de registrar

Vira `SheetScreen`, como as outras capturas. A rota sai da apresentação de
tela cheia e entra na lista de `transparentModal` com `slide_from_bottom`.

De cima para baixo:

### Quando

Os chips de "Hoje / Ontem / Anteontem / …" continuam — eles resolvem o caso
comum em um toque. Ganham um chip final **"Outro dia"**, que abre um
calendário.

**Qualquer dia passado; nada no futuro.** Registro de medicamento aplicado é
fato, e um fato com data no futuro é uma promessa disfarçada de registro.

O aviso do campo diz, em voz alta, que a contagem da próxima dose sai daí —
porque sai mesmo, e registrar uma data antiga reescreve o ciclo.

O calendário é peça nova: não existe uma no aplicativo. Ela nasce em
`src/ui/` para ser reusada, não dentro da folha.

### Dose

A régua da casa, no lugar do `Stepper`. É o mesmo gesto do peso e das
medidas, e o `Stepper` já tinha saído da pesagem pelo mesmo motivo: mais e
menos servem para corrigir um passo, não para dizer um número.

Com escada, trava nos degraus. Sem escada (manipulado), corre contínua na
faixa da molécula.

### Local da aplicação

**Chips, e não o desenho do corpo.** O sugerido pela rotação vem marcado.

Abaixo dos chips, a linha que já existe e que é a razão de a rotação
existir: *"Descansando há 3 semanas"* e *"É o próximo da rotação"* — ou
*"Fora da rotação sugerida — sem problema, é só um lembrete."*

O desenho do corpo **não morre**: ele continua em `/aplicacoes`, onde mostra o
rodízio em vez de ser seletor. Era ali que ele sempre foi melhor.

Esta seção **só existe quando `FORMAS[forma].injetavel`**.

### O recipiente

Hoje o campo se chama "Caneta" e o rótulo dele repete a dose que o campo
acima acabou de perguntar — é a duplicação apontada. Ele perde o número da
dose e passa a dizer só o que é dele: **qual recipiente está em uso e quantas
doses restam**.

O rótulo vem de `FORMAS[forma].recipiente`. Esta seção também some para
comprimido.

### O título

`FORMAS[forma].acao`: "Registrar aplicação" para injetável, "Registrar dose"
para comprimido.

### E a confirmação vai junto

`/aplicacao-ok` é hoje uma `TelaInterna` de tela cheia, e ela abre logo
depois do salvar. Uma folha que fecha para dar lugar a uma tela cheia é a
pessoa saindo do contexto para ler "pronto" — e o resto do aplicativo já não
faz isso: `/registro-ok` é folha, e substitui a folha de captura no lugar
onde ela estava.

Então `/aplicacao-ok` vira folha também. Não é escopo extra: é o que impede
a reforma de trocar um defeito de padrão por outro.

---

## O que este desenho NÃO faz

- **Não varre as 177 menções a "caneta".** A peça 3 existe e fica para
  depois. Até lá, quem escolher uma forma que não é caneta vai ver a palavra
  "caneta" em telas que este documento não toca — e isso é uma dívida
  conhecida, não um descuido.
- **Não mexe no desenho do corpo** além de tirá-lo desta folha.
- **Não muda a regra de estoque** para as formas novas. `FORMAS[].estoque`
  declara como cada uma conta, mas quem consome isso é a peça 3.
- **Não inventa validade, doses por frasco nem faixa de dose para
  manipulado.** O que não se sabe, se pergunta ou se cala.

---

## Riscos conhecidos

**A dívida da cópia é visível.** Assim que a forma existir, alguém pode
escolher "comprimido" e encontrar "caneta" escrito em quinze telas. Duas
saídas: segurar a pergunta até a peça 3 existir, ou aceitar a inconsistência
por um tempo. Este desenho aceita — porque sem a peça 1 a peça 3 não tem como
saber o que escrever no lugar.

**Registrar uma data antiga reescreve o ciclo.** É o comportamento correto —
a próxima dose conta a partir da última aplicação —, mas é surpreendente. O
aviso do campo precisa dizer isso antes do toque, e não depois.

**Os medicamentos manipulados não têm rótulo de marca.** "Semaglutida
manipulada" não é um produto: é uma categoria. O catálogo passa a misturar
marcas e categorias, e isso vai aparecer em toda tela que lista o
medicamento da pessoa.
