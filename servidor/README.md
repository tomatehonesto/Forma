# O servidor que lê o prato

Uma função. Ela existe por um motivo só: a chave da API não pode ir no
aplicativo. Tudo que é empacotado no app é extraível — chave no pacote é
chave publicada.

Fora isso ela não guarda nada, não sabe quem está do outro lado, não tem
banco e não guarda a foto.

## O que sobe

```
servidor/
  api/analisar.ts     a função
  alimentos.json      a tabela, GERADA — não edite à mão
  vercel.json         60s de teto, região gru1 (São Paulo)
```

`alimentos.json` sai do mesmo gerador que a tabela do aplicativo:

```bash
node scripts/gerar-alimentos.mjs src/logic/alimentos.ts
```

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
