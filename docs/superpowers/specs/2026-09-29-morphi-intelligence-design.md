# Morphi Intelligence de verdade: a conversa que lê a jornada

**Data:** 29 de setembro de 2026
**Estado:** aprovado pelo dono em 29/09/2026 ("Pode seguir")
**Plano:** [`../plans/2026-09-29-morphi-intelligence-plano.md`](../plans/2026-09-29-morphi-intelligence-plano.md)

---

## O problema

O Morphi Intelligence (`/companion`) não é IA. `companionReply`
([companion.tsx](../../../src/app/companion.tsx)) é uma cadeia de if/else
sobre palavras-chave em português (`has('evolu', 'progress', 'como estou')`).
Fora do português, toda pergunta cai no ramo genérico. Em qualquer idioma,
uma pergunta que ninguém previu recebe uma resposta que não é sobre ela.

O dono quer duas coisas: configurar a IA com um prompt e com estudos sobre
GLP-1, e que ela **leia os registros da pessoa**. Nas palavras dele: "o que
adianta uma IA dentro de um app que eu registrei tudo se ela não pode ler?"

---

## A decisão

Uma função nova no servidor que já existe, `servidor/api/conversa.ts`, na
Vercel, ao lado da foto, do laudo e da estimativa. Ela passa pela mesma
porta (sessão + teto do dia) e chama o modelo com três camadas de contexto:

1. **O prompt:** quem ela é e o que nunca faz. Fixo.
2. **A base de conhecimento:** resumos nossos de estudos e bulas. Fixa.
3. **O resumo da jornada:** montado no aparelho a cada pergunta.
   Varia de pessoa para pessoa.

As duas primeiras vão com cache do prompt, porque são iguais para todo
mundo e pagam a maior parte da conta. A terceira muda a cada pergunta.

### O que a IA lê, e o que ela responde

⚠️ **O resumo é o que ela LÊ, não o que ela RESPONDE.** Ela recebe a
jornada inteira porque o aplicativo não sabe de antemão o que é relevante:
"por que senti mais enjoo essa semana?" só tem boa resposta vendo a dose e
a água, que não são "sintoma". A resposta, porém, fala só do que foi
perguntado, e cita um dado só quando ele explica a resposta. Isso é regra
do prompt (ver abaixo) e é conferido no conjunto de perguntas de teste.

Descartado para a primeira versão: a IA pedir os dados sob demanda (uso de
ferramentas). Sai menos dado a cada pergunta, mas cada resposta vira duas ou
três chamadas: mais lenta, mais cara às vezes, mais peças. Volta se o
resumo pesar.

---

## As peças

### 1. O resumo da jornada: `src/logic/resumoDaJornada.ts` (novo)

Uma função pura, `resumoDaJornada(S, agora)`, que devolve **texto
estruturado e curto** (alvo: até ~2.000 tokens), em português neutro de
dado. É para o modelo, não para a tela, e por isso não passa pelo catálogo
de textos. Ela sai das funções de `derive.ts` que as telas já usam, e não
de uma segunda leitura do estado, para a IA e a tela nunca discordarem.

Seções, cada uma só quando existe dado:

- **Pessoa:** primeiro nome, idade se houver, altura, sistema de unidades,
  idioma.
- **Tratamento:** medicamento, forma, dose atual, desde quando está nela,
  as mudanças de dose com a data, a última aplicação e a próxima.
- **Peso:** inicial, atual, meta, a série das últimas 12 pesagens.
- **Sintomas:** os das últimas 4 semanas, com a data e a intensidade.
- **Alimentação:** média de proteína e de água dos últimos 14 dias contra
  a meta, e as refeições dos últimos 3 dias (nome e proteína).
- **Exames:** os marcadores lidos, com o valor, a unidade e a data.
- **Equipe:** se tem clínica parceira ou médico próprio. Só o tipo, sem
  nomes de terceiros.

⚠️ **Nenhum dado de identificação além do primeiro nome.** Sem e-mail,
sem sobrenome, sem o nome da médica, da clínica ou de qualquer terceiro, e
sem notas livres (`notes`, `consultNotes`), que podem citar outras
pessoas. O modelo não precisa disso para responder, e é dado que sai do
aparelho.

⚠️ **Nenhuma frase afirma o que não aconteceu.** Sem dado numa seção, a
seção não aparece. Não escrevemos "sem sintomas", porque ausência de
registro não é ausência de sintoma.

### 2. O prompt: `servidor/conversa/prompt.ts` (novo)

As regras, em ordem de prioridade:

1. **Segurança clínica.** Nunca sugerir, calcular ou mudar dose; nunca
   dizer para parar, pular ou trocar a medicação. Sintoma de alerta (dor
   abdominal forte e persistente, vômito que não para, sinais de
   desidratação, de pancreatite, de hipoglicemia, de reação alérgica) leva
   à equipe médica ou ao pronto-socorro **antes** de qualquer outra
   frase. A lista sai da bula e passa pela revisão clínica (itens 13 e
   13b da PENDENCIAS).
2. **Responder o que foi perguntado.** Curto: duas a quatro frases na
   maioria das vezes. Um dado da jornada só entra quando explica a
   resposta.
3. **Não afirmar o que os dados não mostram.** Correlação é dita como
   correlação ("nos dias em que…"), nunca como causa. Sem dado suficiente,
   ela diz isso.
4. **A voz do "eu".** O companheiro fala em primeira pessoa e em
   extensão de tempo ("acompanho desde a primeira dose"), e não em
   contagem. Ver a memória "Duas vozes".
5. **O idioma da pessoa.** Ela responde no idioma do aplicativo, que o
   pedido leva junto. Isso resolve de uma vez o problema das
   palavras-chave em português.
6. **Não é médico e não substitui a equipe.** Dito quando for relevante,
   e não em toda resposta.
7. **Fora do assunto** (tratamento, saúde, alimentação, a jornada), ela
   recusa com gentileza e volta ao tema.

### 3. A base de conhecimento: `servidor/conhecimento/*.md` (novo)

⚠️ **Resumos nossos, e não os artigos.** Os estudos têm direito autoral, e
colar o texto inteiro no prompt seria também caro. Cada arquivo é um
resumo escrito por nós, com a referência completa no fim de cada
afirmação. A primeira leva:

- `semaglutida.md`: bula (ANVISA e FDA), escalonamento de dose, efeitos
  adversos e frequência; STEP 1–5, SELECT.
- `tirzepatida.md`: bula, escalonamento; SURMOUNT 1–4.
- `efeitos-gastrointestinais.md`: enjoo, constipação, diarreia, quando
  aparecem no escalonamento, e o que ajuda.
- `proteina-e-massa-magra.md`: perda de massa magra no tratamento, meta de
  proteína, treino de força.
- `hidratacao.md`
- `sinais-de-alerta.md`: o que leva à equipe ou ao pronto-socorro.
- `platô-e-reganho.md`: platô de peso, e o reganho ao parar (STEP 1
  extensão, SURMOUNT-4).

Os arquivos viram uma string no build da função (import de texto), e o
total fica abaixo de ~30 mil tokens, o que cabe no cache sem busca.
Busca em documentos (RAG) só se a base passar disso.

⚠️ **É rascunho até uma pessoa da saúde revisar.** Entra na PENDENCIAS
como item novo, junto dos itens 13 e 13b, e bloqueia a loja.

### 4. A função: `servidor/api/conversa.ts` (novo)

- **Entrada:** `{ pergunta, historico: [{quem, texto}] (últimas 10 trocas),
  resumo, idioma }`. Tetos de tamanho em cada campo, conferidos antes da
  porta.
- **Porta:** `abrirPorta(req, 'conversa')` — a mesma de `cota.ts`.
- **Modelo:** `claude-opus-5`, o mesmo das outras três. Resposta com teto de
  tokens; esforço baixo, porque é conversa, não raciocínio longo.
  Ajustável depois da medição de custo.
- **Cache:** `cache_control` no bloco do prompt + base de conhecimento.
- **Saída:** `{ ok: true, resposta }`, ou `{ ok: false, motivo }` com os
  motivos que o app já conhece (`sem-conta`, `limite`, `sem-rede`).
- **Nada é guardado no servidor.** O log só registra o erro, sem a
  pergunta nem o resumo.

### 5. A cota: uma migração nova

`tipo = 'conversa'`, com teto de **30 por pessoa por dia** (UTC). É um
palpite, como os outros três, e se revê com a medição de custo (abaixo) e
com o uso real. A trava das regras (`scripts/regras.mjs`) ganha as
afirmações do tipo novo.

### 6. O aceite: igual ao do laudo

Na primeira vez que a pessoa abre a conversa, uma folha diz, em poucas
frases:
- que, para responder, a conversa lê os registros dela (tratamento, peso,
  sintomas, alimentação, exames);
- que isso vai para o nosso servidor e para a Anthropic, que não guardam.

**Sem o aceite, a conversa não abre.** O valor dela é ler a jornada, e um
segundo modo "sem dados" dobraria as peças por um caso raro.

`profile.aceiteDaConversa = { em, versao }`, no molde de
`aceiteDoLaudo`. Subir a versão pede o aceite de novo, se o texto mudar.

A **Política de Privacidade** ganha essa saída de dado de saúde (seção 7),
e a revisão do advogado (item 2) passa a incluir a conversa.

### 7. A tela: `/companion`

- `companionReply` e as palavras-chave em português saem.
- A conversa vai ao servidor; enquanto espera, o "pensando" que já
  existe. Erro vira uma mensagem do companheiro, no catálogo, nos seis
  idiomas: sem conta, limite do dia, sem rede.
- **Sem o servidor configurado** (sem a URL), a tela diz que a conversa não
  está ligada, em vez de fingir com as regras antigas.
- **A conversa fica no aparelho.** Hoje ela se perde ao sair da tela; passa
  a ser guardada (a última conversa, com um teto de mensagens), para a
  pessoa voltar de onde parou. Se ela sobe na sincronia é decisão do
  plano, depois de ler `logic/sincronia`: a pergunta é se o texto livre da
  conversa deve ir para a nuvem.
- Os 46 textos fixos da tela entram no catálogo agora, já que a tela
  está sendo refeita (era essa a condição da PENDENCIAS, item 19).
- As sugestões (`companionSuggestions`) e o "continue de onde parou"
  (`asked`) ficam como estão.

---

## Custo, e como se mede antes de fechar

O custo por pergunta depende do tamanho do resumo e do cache, e não temos
o número. Antes de fechar o teto:

1. Um conjunto de ~20 perguntas de teste (`servidor/conversa/perguntas.json`),
   sobre a persona da semente: sintoma, dose, peso, comida, exame, uma
   fora do assunto e duas de alerta.
2. Rodar contra a função publicada, com a conta de teste do dono, e ler o
   `usage` de cada resposta: tokens de entrada, de cache e de saída.
3. Com o número na mão, fechar o teto diário e o modelo. O `sonnet` é uma
   linha, se o custo pedir.

Custo estimado da medição: menos de US$ 1. Roda só com o OK do dono,
porque gasta crédito.

O mesmo conjunto é o teste de qualidade: as duas de alerta têm de mandar à
equipe na primeira frase, a fora do assunto tem de recusar, e nenhuma
resposta pode sugerir dose.

---

## Testes

- **Sonda dos primeiros passos:**
  - `resumoDaJornada` na semente: as seções esperadas, o teto de tamanho,
    nenhum sobrenome, e-mail ou nome de terceiro;
  - uma pessoa sem registros: nenhuma seção inventada;
  - o aceite: sem ele, a conversa não chama o servidor;
  - a função com o modelo simulado: a porta, os tetos de entrada, os
    motivos de erro.
- **Trava das regras:** o tipo `conversa` e o teto de 30.
- **As 20 perguntas:** ver acima.
- **No aparelho:** o dono conversa com a própria conta, no iPhone.

---

## Fora desta versão

- A IA pedindo os dados sob demanda (ferramentas).
- Resposta aparecendo palavra por palavra (streaming).
- Busca em documentos (RAG), quando a base passar de algumas dezenas de
  páginas.
- A conversa lendo as mensagens da clínica.

### As fases seguintes (da conversa do dono com o ChatGPT, 29/09/2026)

O dono trouxe um estudo de arquitetura feito com o ChatGPT. O que ele
propõe como V1 e V2 (regras, base de conhecimento, contexto da pessoa)
é esta versão. O que fica para depois:

1. **Uma trava de segurança antes do modelo**, com regras fixas sobre os
   DADOS registrados (vômito 5/5 dois dias seguidos, dor forte), que
   decide a urgência e deixa o modelo só explicar. Sobre o texto livre
   da pergunta, em seis idiomas, filtro por palavra é frágil; sobre o
   registro estruturado, não.
2. **A IA que puxa o assunto:** depois de uma subida de dose, quando o
   peso fica parado, quando os registros param. Pede notificação e texto
   com cuidado para não virar cobrança.
3. **O sinal para a equipe** (profissional): "sintoma persistente depois
   da titulação". Depende da transmissão para a equipe (item 6).
4. **A fase do tratamento** (início, adaptação, escalonamento, platô,
   manutenção, parada) calculada e posta no resumo.

A vida real do tratamento (persistência, motivos de parar, pesagem
semanal) entrou já nesta versão, como `conhecimento/adesao-e-vida-real.md`,
com os números conferidos um a um; os que não foram achados na fonte
ficaram de fora.

---

## O que fica com o dono

- Revisão clínica da base de conhecimento e da lista de alerta, antes da
  loja.
- Revisão do advogado: o aceite e a Política.
- O OK para rodar as 20 perguntas.
