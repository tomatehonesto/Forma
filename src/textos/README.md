# Os textos

Todo texto que a pessoa lê mora aqui, e não no meio do código que o desenha.

## Mensagem é função, e não string de JSON

```ts
export const peso = {
  perdido: (v: string) => `Você perdeu ${v}`,
  semanas: (n: number) => `${n} ${n === 1 ? 'semana' : 'semanas'}`,
};
```

Parâmetro, plural e concordância são **TypeScript comum**, conferidos pelo
compilador. O arquivo de português faz a concordância do português; o de
inglês fará as regras do inglês.

**Gramática é código por idioma, não dado por idioma.** Foi a varredura de
"caneta" que provou isso: um substantivo só precisou de `noNa`, `doDa`,
`concordar`, `umOutro` e `nesteNesta` para as frases não saírem com
"na frasco". Nenhum formato de JSON expressa isso sem inventar uma
linguagem de template — e uma linguagem de template é um interpretador que
ninguém confere.

O ICU existe porque a maioria dos projetos guarda mensagem em JSON. Aqui
não precisa: sem dependência, sem sintaxe nova, e o `tsc` garante que
**todo idioma implementa toda mensagem com a mesma assinatura**.

## Os comentários vêm junto

⚠️ **Isto é uma inversão deliberada do padrão, e é a regra mais importante
deste diretório.**

A propriedade mais distintiva deste código é que quase toda frase não-óbvia
carrega o motivo de ela dizer o que diz. Uma extração convencional
arrancaria mil e quinhentas frases das suas justificativas.

Mas esses comentários explicam **por que a mensagem diz aquilo** — é fato
sobre a mensagem, não sobre o código que a desenha. Então eles pertencem
aqui. E é a única coisa que impede a tradução de sair errada: quem
traduzir precisa saber que *"é assunto de consulta, não de esforço"* foi
escrito de propósito para não sugerir esforço, e que trocar por
*"talk to your doctor about what you can do"* desfaz a frase inteira.

Quando mover uma frase para cá, **mova o comentário dela junto**. Se o
comentário explicava metade código e metade texto, parta em dois: a parte
de código fica onde estava, a de texto vem.

## Organizado por assunto, não por arquivo

A mesma frase aparece em duas telas. Um diretório espelhando `src/app/`
obrigaria a duplicá-la — que é o defeito que este código combate em toda
parte.

## Como ler

```ts
import { T } from '../textos';
T.peso.perdido(pesoTxt(S, x))
```

O idioma ativo é um valor de módulo. Trocá-lo remonta a árvore a partir do
layout raiz — é operação rara, e remontar é o resultado certo. As funções
de lógica **não ganham parâmetro novo**: ao contrário do que aconteceu com
as unidades, onde `S` teve de ser enfiado em quatro tabelas constantes.

## Constante de módulo congela o idioma

⚠️ **Tabela constante que lê `T` no topo do arquivo lê UMA vez, no import.**

A troca de idioma remonta a árvore do React. Ela não reexecuta o topo de um
módulo — então uma constante como

```ts
export const EXAM_CATS = [[T.marcadores.catMetabolico, [...]], ...];
```

fica em português para sempre, e o `tsc` não vê nada de errado. O defeito só
aparece no dia em que alguém troca o idioma, que é meses depois de o código
ter sido escrito.

**A regra: se a tabela lê o catálogo, ela é função.**

```ts
export const examCats = (): [string, string[]][] => [ ... ];
```

O custo é um `()` em cada sítio de chamada. Aconteceu duas vezes — em
`examCats` e em `cicloFasesFixas` — e a segunda foi corrigida no commit
seguinte ao que a criou.

## A rede

`scripts/congelar.ts` percorre toda função que produz texto e congela a
saída em seis cenários — caneta, imperial, frasco, comprimido e os
dois em inglês.

```
npx tsx --tsconfig scripts/tsconfig.json scripts/congelar.ts > /tmp/antes.json
# extrai um domínio
npx tsx --tsconfig scripts/tsconfig.json scripts/congelar.ts > /tmp/depois.json
diff /tmp/antes.json /tmp/depois.json
```

**Diferença nenhuma é a única saída aceitável.** Qualquer linha no diff é
erro de extração — melhoria de texto é outro commit, feito depois, com o
diff mostrando exatamente o que mudou.

## O formato não mora aqui

Palavra mora neste diretório. **Separador decimal, desenho de data e
relógio moram em `src/logic/local.ts`**, com o valor que decide os dois.

É um valor só: idioma e local são a mesma decisão. "Português com números
americanos" não é um estado que deva existir — quem escreve em português
escreve 181,7.

| onde | o quê |
|---|---|
| `src/textos/` | a frase: o que o aplicativo diz |
| `src/logic/local.ts` | o formato: como o número e a data saem |

A fronteira tem uma exceção, e ela está comentada lá: os **nomes do
calendário** — doze meses e sete dias — moram no formato, e não aqui. Não
são fala do aplicativo, são a grade do calendário: lista fechada, sem
concordância, igual em todo texto que já existiu naquele idioma. E o
formatador de data não funciona sem eles.

A prosa sobre tempo — "ontem", "há 3 dias" — é fala, e é daqui.

### A mesma armadilha, de novo

Constante de módulo congela o local exatamente como congelava o catálogo:

```ts
export const MO_LONG = () => formato().mesLongo;   // função, não constante
```

Dez sítios de chamada precisaram do `()`. O `tsc` acusou todos, porque
indexar uma função é erro de tipo — foi de graça. O que não é de graça é
uma tabela que o `tsc` aceita: `Object.keys` de uma função devolve `[]`, e
nada acusa.

### E o inglês já escreve número

O motor de formato está completo nos dois locais. O catálogo ainda só fala
português, e um aparelho em inglês lê **números americanos com frases
portuguesas** — o `CATALOGOS` cai no português de propósito, com o motivo
escrito em cima.

Os dois cenários `-en-US` da rede congelam esse estado. Quando a tradução
chegar, **só a prosa deles pode mudar**: número, data e relógio já estão no
lugar, e qualquer movimento neles é erro dela.

---

## A tradução não é literal, e o pior erro dela é o que compila

O `tsc` prova que as chaves existem e que nenhum parâmetro mudou de lugar.
Ele não sabe nada sobre o que a frase quer dizer — e é aí que mora o erro
caro. "Achieve your goal" virando "Conquiste seu gol" compila.

### Três armadilhas, com exemplo real deste repositório

**O FALSO AMIGO.** `jornada` em português é o caminho; em espanhol é a
jornada de TRABALHO. Foi evitado no cadastro usando `camino` — e é o tipo
de coisa que só se pega quem conhece as duas línguas, nunca uma tabela.

**A PALAVRA QUE SÓ VALE NUM PAÍS.** Escrevi `busca una guardia hoy` na
linha que manda alguém com o intestino trabado, dor forte e vômito
procurar atendimento. Na Argentina e no Uruguai a *guardia* é a urgência
do hospital; no México, na Colômbia, no Peru, no Chile e na América
Central uma guardia é um **guarda de segurança**. Metade da América Latina
leria a mensagem clínica mais grave do aplicativo como "procure um
vigilante". A palavra é `urgencias`, e se entende nos vinte países.

Na mesma auditoria saíram `palta` (Cone Sul; o resto diz *aguacate*),
`clóset`, `picotear`, `porrón` e `tarro`.

**O VERBO QUE NÃO COMBINA COM O SUBSTANTIVO.** `conquistada` serve a um
território; uma meta se **logra** ou se alcança.

### A regra

Um idioma neutro — `es-419` — escolhe a palavra que se entende no maior
número de países, e não a mais bonita de um deles. Quando não existe
palavra neutra, **reescreva a frase para não precisar dela**: "lo que ya
hay en tu cocina" resolve o que *refrigerador / heladera / nevera* não
resolve.

⚠️ **E ISTO PRECISA DE REVISÃO DE QUEM FALA O IDIOMA.** A conferência de
forma (`scripts/conferencia.mjs`) prova a assinatura. Nada aqui prova o
sentido — ver PENDENCIAS.
