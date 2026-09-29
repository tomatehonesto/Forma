# O servidor que lê o prato e o laudo

Três funções — a do prato, a do laudo e a que estima um prato pelo nome. Elas existem por um motivo só: a
chave da API não pode ir no aplicativo. Tudo que é empacotado no app é extraível — chave no pacote é
chave publicada.

Fora isso elas não guardam nada, não sabem quem está do outro lado, não
têm banco e não guardam a foto nem o laudo.

## O que sobe

```
servidor/
  api/analisar.ts     a leitura do prato
  api/laudo.ts        a leitura do laudo (PDF ou foto)
  api/estimar.ts      o rótulo de um prato, estimado pelo nome
  alimentos.json      a tabela, GERADA — não edite à mão
  marcadores.ts       os 15 marcadores do laudo e as unidades de cada um
  prateleiras.ts      as 13 prateleiras da tabela de alimentos
  rotulo.ts           a porção estimada virada em rótulo por 100 g
  vercel.json         60s de teto, região gru1 (São Paulo)
```

`alimentos.json` sai do mesmo gerador que a lista de comidas do
aplicativo — uma lista só, para todo país:

```bash
node scripts/gerar-comidas.mjs
```

Os nomes vão em português, que é a língua do prompt; o item que não está
na lista volta com o nome no idioma do aplicativo, que a foto leva junto,
e com o rótulo inteiro de uma porção — o mesmo formato de `api/estimar`,
convertido por `rotulo.ts`. `nome` e `base` continuam indo junto, para
a versão do aplicativo que ainda só lê a proteína.

Rode isso sempre que a lista de alimentos mudar, senão um `id` existe de
um lado e não do outro — o servidor devolve um id que o app não conhece,
e o item cai fora em silêncio.

## Subir na Vercel

1. **Novo projeto** apontando para este repositório.
2. Em *Settings → General*, **Root Directory: `servidor`**. Isso é o que
   impede a Vercel de tentar buildar o aplicativo Expo junto.
3. Em *Settings → Environment Variables*:

   | Nome | Valor |
   |---|---|
   | `ANTHROPIC_API_KEY` | a sua chave |
   | `MORPHI_TOKEN` | uma frase qualquer que você inventar (opcional) |

4. Deploy. A URL final é `https://<projeto>.vercel.app/api/analisar`.

## Ligar no aplicativo

Na raiz do repositório, `.env`:

```
EXPO_PUBLIC_ANALISE_URL=https://<projeto>.vercel.app/api/analisar
EXPO_PUBLIC_ANALISE_TOKEN=<o mesmo MORPHI_TOKEN>
```

Sem essas variáveis o app se comporta exatamente como hoje: o botão de
escanear abre a câmera, a leitura devolve "ainda não está ligada" e a
lista manual continua ali. Ligar a foto é variável de ambiente, não outro
build.

## Sobre o `MORPHI_TOKEN`

Ele vale menos do que parece, e é melhor saber disso. O aplicativo carrega
esse valor dentro do pacote, então quem abrir o pacote encontra. Ele
impede que uma URL vazada em log vire conta aberta; não impede alguém
decidido. Proteção de verdade só chega junto com conta de usuário.

Se você deixar `MORPHI_TOKEN` vazio na Vercel, a função aceita qualquer
chamada. Para um piloto fechado, tudo bem. Para qualquer coisa pública,
não.

## Testar sem subir

```bash
cd servidor
npm install
ANTHROPIC_API_KEY=... node teste.mjs ../caminho/da/foto.jpg
```

`teste.mjs` chama o mesmo prompt e o mesmo schema da função, com uma foto
do disco. Serve para afinar o prompt sem gastar deploy.

## O que custa

Por foto, com a imagem já reduzida a 1024 px e o cache de prompt quente
(a tabela é a parte estável, e é a maior):

| | por foto | 3 refeições/dia, por pessoa/mês |
|---|---|---|
| `claude-opus-5` (o que está no código) | ~US$ 0,012 | ~US$ 1,10 |
| `claude-sonnet-5` | ~US$ 0,005 | ~US$ 0,45 |
| `claude-haiku-4-5` | ~US$ 0,002 | ~US$ 0,22 |

A hospedagem em si é perto de zero: a Vercel cobra CPU ativa, e esperar o
modelo não conta como CPU.

Trocar de modelo é uma string em `api/analisar.ts`. O `effort: 'medium'`
ao lado dela é o outro botão — reconhecer comida é tarefa de percepção, e
tem alguém olhando para uma roda girando enquanto isso.

## A leitura do laudo

`api/laudo.ts` recebe um PDF (até uns 3 MB) ou a foto de um laudo e
devolve os resultados como estão impressos: valor, unidade, faixa do
laboratório e data da coleta. Não converte e não interpreta — quem lê o
valor contra a faixa é o aplicativo, e quem confere cada linha contra o
papel antes de salvar é a pessoa.

Ela sobe junto com a do prato, no mesmo projeto, com as mesmas variáveis
(`ANTHROPIC_API_KEY` e `MORPHI_TOKEN`). O aplicativo acha a URL sozinho
a partir de `EXPO_PUBLIC_ANALISE_URL` (troca `/analisar` por `/laudo`);
se um dia ela morar em outro lugar, `EXPO_PUBLIC_LAUDO_URL` manda.

⚠️ `marcadores.ts` repete a lista do aplicativo (`src/logic/unidadesDeExame`),
porque o servidor não enxerga o código de lá. A sonda dos primeiros passos
(seção 20) confere que as duas continuam iguais — mudar uma sem a outra
faz ela falhar.

⚠️ Um laudo é dado de saúde sensível. O aplicativo pede um aceite próprio
antes da primeira leitura, e a Política de Privacidade (minuta, em
`src/logic/documentos.ts`) descreve o envio — as duas coisas precisam da
revisão do advogado antes de a leitura ser ligada na loja.

## A estimativa pelo nome

`api/estimar.ts` recebe o que a pessoa digitou — "galinhada", "pad thai"
— e o idioma do aplicativo, e devolve o rótulo de UMA porção comum: o
peso dela e proteína, energia, carboidrato, gordura e fibra por 100 g. O
aplicativo só pede quando nada da lista bateu, e com um toque, nunca a
cada letra. Ele grava a estimativa no próprio registro, marcada como
estimada, e da segunda vez o prato sai do diário, sem chamar o servidor.

Mesmas variáveis e mesmo projeto das outras duas. A URL sai de
`EXPO_PUBLIC_ANALISE_URL` (troca `/analisar` por `/estimar`); se um dia
ela morar em outro lugar, `EXPO_PUBLIC_ESTIMAR_URL` manda.

⚠️ `prateleiras.ts` repete a lista do aplicativo (`src/logic/prateleiras`),
pelo mesmo motivo dos marcadores. A sonda dos primeiros passos (seção 24)
confere que as duas continuam iguais e que a conta de `rotulo.ts` sai no
formato que o aplicativo aceita.
