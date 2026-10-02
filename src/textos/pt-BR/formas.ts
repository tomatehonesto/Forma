/* ============================================================
   A FORMA DE APLICAÇÃO — o vocabulário e a concordância

   ⚠️⚠️ AQUI ESTÁ A GRAMÁTICA, E NÃO SÓ AS PALAVRAS. É a regra do README:
   gramática é código por idioma, não dado por idioma.

   O português cobra concordância — a caneta, o frasco, a seringa, a
   cartela — e quem monta "Restam 3 doses ___ caneta" precisa da contração
   certa. O inglês não cobra nada: são quatro "the". Se a concordância
   morasse na lógica, ela seria uma conta portuguesa rodando em toda
   língua do mundo, e o inglês pagaria para calcular um gênero que não
   tem.

   ⚠️⚠️ E O GÊNERO NÃO SAI DESTE ARQUIVO. Ele é propriedade da PALAVRA, não
   da forma de aplicação: "caneta" é feminino em português, "pen" não é
   nada em inglês. Quem estava perguntando o gênero lá fora — e três telas
   estavam — passa a perguntar `concordar`, que é a pergunta que tem
   resposta em qualquer idioma.

   ⚠️ O RECIPIENTE DO COMPRIMIDO É A CAIXA (02/10/2026), e era a cartela.
   Mudou porque o estoque do comprimido passou a ser contado pela caixa —
   30 por padrão, confirmado ao abrir uma (decisão do dono; ver o bloco
   "QUANTO CABE" em logic/meds.ts). Com o estoque numa caixa e a palavra
   na cartela, a tela diria "Nova cartela" ao abrir uma caixa de trinta, e
   "resta uma dose na cartela" quando a cartela da vez ainda tem dez. Nem
   a caixa nem a cartela vencem "depois de abertas" do jeito que uma
   caneta vence — ver o bloco de `shelf` em logic/meds.ts.
   ============================================================ */

/* ⚠️ A UNIÃO É DECLARADA AQUI, e não importada de logic/meds. O catálogo
   não conhece a lógica — é a lógica que lê o catálogo. Se as duas
   divergirem, o `Record<Forma, …>` de logic/formas.ts não compila, que é
   exatamente onde o erro tem de aparecer. */
type Recipiente = 'caneta' | 'frasco' | 'seringa' | 'comprimido';

/* ⚠️ PRIVADO DE PROPÓSITO. Ele não entra no `palavras` e não é exportado:
   a única porta para o gênero são as funções abaixo. */
const GENERO: Record<Recipiente, 'm' | 'f'> = {
  caneta: 'f', frasco: 'm', seringa: 'f', comprimido: 'f',
};

const f = (r: Recipiente) => GENERO[r] === 'f';

export const formas = {
  /* ⚠️ O PLURAL É CAMPO, e não `recipiente + 's'`. Os quatro de hoje são
     regulares e a conta daria certo — e é exatamente assim que o quinto,
     irregular, entra sem ninguém notar. */
  /* ⚠️⚠️ `acao` É "DOSE" PARA TODAS AS FORMAS (decisão do dono, 01/10/2026).
     Era "aplicação" nas três injetáveis, e quem lê o campo o põe em
     título e confirmação — "Registrar aplicação", "Aplicação registrada",
     "Dia 3 depois da aplicação", "A sua aplicação é hoje" — que quem toma
     comprimido lia como se injetasse. "Dose" serve às quatro, e o dono
     escolheu a mesma palavra para todo mundo.

     O que segue a forma é só a frase em PRIMEIRA PESSOA ("Apliquei a
     dose" / "Tomei a dose", "Se você aplicou/tomou…"), e ela não sai
     daqui: é função de `injetavel` no catálogo de cada tela, como
     `cadastro.ultima(injetavel)`. Um substantivo não conjuga verbo.

     O campo fica, e não vira constante, porque um idioma pode precisar de
     outra palavra para uma forma (o francês usou "prise" para o
     comprimido até 01/10/2026). Hoje é "dose" nas quatro formas e nos
     seis idiomas — e é feminina em todos, então o artigo de quem a recebe
     ("da", "la", "deiner") continua certo. */
  palavras: {
    caneta: { recipiente: 'caneta', plural: 'canetas', verbo: 'aplicar', acao: 'dose' },
    frasco: { recipiente: 'frasco', plural: 'frascos', verbo: 'aplicar', acao: 'dose' },
    seringa: { recipiente: 'seringa', plural: 'seringas', verbo: 'aplicar', acao: 'dose' },
    comprimido: { recipiente: 'caixa', plural: 'caixas', verbo: 'tomar', acao: 'dose' },
  } as Record<Recipiente, { recipiente: string; plural: string; verbo: string; acao: string }>,

  /* ⚠️ A CONCORDÂNCIA É EXPLÍCITA, com as duas palavras escritas.

     A tentação é derivar — trocar o "o" final por "a" — e ela falha no
     primeiro "nenhum/nenhuma" e no primeiro particípio irregular.
     Escrever os dois deixa a frase legível no lugar onde ela é montada,
     que é onde alguém vai reler para ver se soa certo. */
  concordar: (r: Recipiente, masc: string, fem: string) => (f(r) ? fem : masc),

  /* ⚠️⚠️ AS PREPOSIÇÕES SÃO PEÇA, e não concatenação no lugar do uso.

     "Restam 3 doses na caneta" vira "no frasco", não "na frasco". A
     contração do artigo com a preposição é o erro mais comum de uma
     varredura destas — ela passa no `tsc`, passa na revisão de diff e só
     aparece na tela de quem usa a forma menos comum. */
  noNa: (r: Recipiente) => `${f(r) ? 'na' : 'no'} ${formas.palavras[r].recipiente}`,
  doDa: (r: Recipiente) => `${f(r) ? 'da' : 'do'} ${formas.palavras[r].recipiente}`,
  /** "nesta caneta", "neste frasco" — o demonstrativo com a preposição. */
  nesteNesta: (r: Recipiente) => `${f(r) ? 'nesta' : 'neste'} ${formas.palavras[r].recipiente}`,

  /** "outra caneta", "outro frasco" — o artigo que o nome sozinho não dá. */
  umOutro: (r: Recipiente, maiusculo = false) => {
    const p = f(r) ? 'outra' : 'outro';
    return maiusculo ? p[0].toUpperCase() + p.slice(1) : p;
  },

  /** "a caneta", "o frasco" — para frases em que o artigo definido entra. */
  oA: (r: Recipiente): string => (f(r) ? 'a' : 'o'),
};
