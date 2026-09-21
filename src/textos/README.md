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

## A rede

`scripts/congelar.ts` percorre toda função que produz texto e congela a
saída em quatro cenários — caneta, imperial, frasco e comprimido.

```
npx tsx --tsconfig scripts/tsconfig.json scripts/congelar.ts > /tmp/antes.json
# extrai um domínio
npx tsx --tsconfig scripts/tsconfig.json scripts/congelar.ts > /tmp/depois.json
diff /tmp/antes.json /tmp/depois.json
```

**Diferença nenhuma é a única saída aceitável.** Qualquer linha no diff é
erro de extração — melhoria de texto é outro commit, feito depois, com o
diff mostrando exatamente o que mudou.
