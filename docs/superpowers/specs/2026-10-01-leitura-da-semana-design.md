# A leitura da semana: descobertas que a pessoa não sabe, escritas pela Morphi Intelligence

**Data:** 1º de outubro de 2026
**Estado:** aprovado pelo dono em 01/10/2026 ("Tá bom")
**Plano:** a escrever (`../plans/2026-10-01-leitura-da-semana-plano.md`)

---

## O problema

As descobertas de hoje (`patterns` em [derive.ts](../../../src/logic/derive.ts),
o cartão da Home em [descobertas.ts](../../../src/logic/descobertas.ts)) são
regras fixas no aparelho: uns dez cruzamentos escolhidos à mão (fim de
semana contra dias úteis, a água do dia mais fraco, proteína de hoje
contra a fome de amanhã, o enjoo depois da aplicação, água contra enjoo).
São verdadeiras, de graça e privadas, mas **só aparece o que alguém
previu**.

O dono quer descobertas que a pessoa não sabe. O exemplo dele: "Nos dias
que você registrou café da manhã, sua saciedade durante o dia foi muito
maior. Talvez o café seja um novo aliado." E quer uma leitura semanal
escrita pela IA.

### A armadilha

Pedir à IA que "ache coisas" nos dados encontra coincidências. Com uns 10
comportamentos e uns 6 resultados, são cerca de 60 pares; com poucas
semanas de registro, uns 3 parecem fortes por acaso. A IA os apresentaria
com convicção, e a pessoa mudaria de hábito por causa de ruído. Na
avaliação da conversa, o modelo já inventa causa ("é o remédio agindo")
quando a base não sustenta.

---

## A decisão

**O código descobre; a IA escreve.**

1. **No aparelho**, um motor novo com detectores para cada área da
   jornada — hábitos, ritmo do peso, exames, exercício, sintomas, medidas,
   constância — e uma régua contra coincidência. O número que sai é sempre
   uma conta, nunca uma impressão.
2. **No servidor**, o Sonnet 5.5 recebe o resumo da semana e a descoberta
   já calculada, e escreve a leitura na voz da Morphi Intelligence. Ele
   não descobre nada: narra, conecta e propõe um teste.

Decisões do dono (01/10/2026):

- **Onde:** um card "Sua semana" no topo da Home, toda segunda.
- **Aceite:** próprio, pedido pelo card na primeira vez ("Quer que eu leia
  a sua semana toda segunda?"). Quem não aceita não recebe; o resto do app
  não muda.
- **Conteúdo:** três partes curtas — a semana, a descoberta, e UM teste
  prático para a semana seguinte.
- **Todo mundo recebe uma descoberta** (o dono, 01/10/2026: "a ideia é
  todos terem descobertas, algumas vão ser interessantes e outras menos —
  somos o companheiro do tratamento de todos"). Por isso a descoberta tem
  três níveis, e o tom acompanha a força do dado (peça 1).
- **Geração:** na primeira abertura do app a partir de segunda. Só gasta
  com quem usa, e o dado sai do aparelho como na conversa.

---

## As peças

### 1. O motor de descobertas: `src/logic/descobertasDaSemana/` (novo)

⚠️ **NÃO É SÓ REGISTRO CONTRA SINTOMA** (o dono, 01/10/2026: "pode ser
coisas de ritmo de perda de peso, de melhora de exames, de exercícios, de
tudo"). O motor é um conjunto de **detectores**, um por área da jornada.
Cada um é uma função `(S, semana) => Candidata[]`, e acrescentar uma área
depois é escrever mais um detector — nada no resto muda.

Toda candidata tem a mesma forma:
`{ area, tipo, nivel: 'forte' | 'comeco' | 'retrato', forca: 0..1, dados }`,
em que `dados` são os números que a leitura vai usar como vieram.

**Os detectores da primeira versão:**

| área | o que procura | exemplo do que vira |
|---|---|---|
| `habitos` | pares hábito × como a pessoa se sente, dia a dia (abaixo) | "Nos dias em que você tomou café da manhã, sua fome foi bem menor." |
| `ritmo` | o ritmo do peso das últimas semanas contra o das anteriores; antes e depois de cada subida de dose; marcos (10% do peso inicial, metade do caminho até a meta); "no ritmo das últimas 4 semanas, chegaria à meta em…" | "Desde que você foi para 5 mg, o seu ritmo de perda dobrou." |
| `exames` | um marcador que melhorou entre dois laudos, ou entrou na faixa de referência do laudo | "Seu LDL caiu de 142 para 118 mg/dL entre junho e setembro." |
| `exercicio` | frequência subindo ou caindo; sequência de semanas treinando; treino × energia e sono (pelo detector de hábitos) | "Você treinou em 6 das últimas 6 semanas — a sua melhor sequência." |
| `sintomas` | um sintoma ao longo do tempo: caindo desde a subida de dose, a semana mais leve, a janela que encurtou | "O enjoo caiu pela metade desde a sua 3ª semana em 0,5 mg." |
| `pesoSemanal` | hábitos × perda de peso da semana, semana a semana (semanas com mais proteína ou mais treino) | "Nas semanas em que você treinou 3 vezes ou mais, a perda foi maior." |
| `medidas` | cintura (ou outra medida) caindo mais rápido que o peso, quando há medidas registradas | "Sua cintura caiu 6% enquanto o peso caiu 4%." |
| `constancia` | aplicações sem falha; a melhor semana de água ou proteína desde quando; o dia mais forte da semana | "Foi a sua melhor semana de água desde agosto." |

**O detector de hábitos, em detalhe.** Os comportamentos (do dia d):

| id | como se lê | cuidado |
|---|---|---|
| `cafe` | uma refeição com o nome de café da manhã do catálogo (qualquer um dos 6 idiomas) ou antes das 10h30 | só entram dias com pelo menos 2 refeições registradas: "sem café" num dia sem registro é só um dia sem registro |
| `proteinaNaMeta` | `prot` do dia ≥ `targets.prot` | só dias com proteína registrada |
| `aguaNaMeta` | `aguaDoDia` ≥ `targets.waterMl` | só dias com água registrada |
| `treino` | `exerc` > 0 | só dias com check-in |
| `sono7` | `sono` ≥ 7 h | só dias com sono respondido |
| `jantarTarde` | a última refeição do dia depois das 21h | o mesmo corte de `cafe` |
| `posAplicacao` | d é o dia seguinte ou o segundo dia depois de uma aplicação | só com aplicações registradas |

Os resultados (do dia d e do dia d+1): fome, energia, humor e enjoo, na
régua de 1 a 5 da tela (`paraTela`, `grauDoSintoma`). Fora o que é óbvio
ou circular: `posAplicacao` × enjoo já é a "janela do enjoo" de hoje;
`proteinaNaMeta` × fome do mesmo dia é quase a mesma coisa medida duas
vezes.

**A régua, para tudo o que é comparação** (hábitos, peso semanal,
exercício × energia): é o que separa o padrão da coincidência.

- **Padrão forte:** pelo menos 4 dias de cada lado nas últimas 6 semanas;
  diferença de pelo menos 1 ponto na régua de 1 a 5; e **a mesma direção
  nas duas metades da janela** (cada metade com pelo menos 2 dias de cada
  lado) — o padrão tem de se repetir. No peso semanal: pelo menos 8
  semanas, 3 de cada lado, e diferença de pelo menos 0,3 kg por semana.
- **Começo de padrão:** pelo menos 3 dias de cada lado e 0,5 ponto de
  diferença, sem exigir a repetição. No peso semanal, não existe: o peso
  oscila demais para um começo de padrão dizer alguma coisa.

**Os detectores de tendência** (ritmo, exames, sintomas, medidas,
constância) não comparam grupos: leem uma série. A régua deles é de
tamanho e de ruído: ritmo só com pelo menos 4 pesagens em cada trecho
comparado, e a diferença maior que a oscilação normal da pessoa (o
desvio das pesagens dela); exame só com dois laudos do mesmo marcador;
medidas só com duas medições separadas por pelo menos 3 semanas. O que
passa é **padrão forte** quando a mudança é clara e **retrato** quando é
um fato (um marco, uma sequência, a melhor semana).

**Os três níveis.** Toda pessoa com o mínimo de registro (peça 2) recebe
uma descoberta por semana; o que muda é o quanto ela afirma:

1. **Padrão forte** — passou na régua inteira. A leitura afirma o padrão:
   "Nos dias em que você tomou café da manhã, sua fome foi bem menor.
   Talvez ele seja um aliado."
2. **Começo de padrão** — a leitura diz que ainda é cedo, e o teste da
   semana vira confirmar o padrão: "Ainda é cedo para afirmar, mas nos
   dias com café da manhã sua fome pareceu menor. Que tal observar isso
   esta semana?"
3. **Retrato** — um fato verdadeiro da jornada que a pessoa provavelmente
   não percebeu. Sempre existe algum para quem registra o mínimo: no
   último caso, a variação do peso no mês.

**A escolha da semana:** primeiro o nível (forte, depois começo, depois
retrato), dentro dele a força, e **as áreas se alternam** — a área da
semana passada perde a vez se houver outra no mesmo nível. Uma descoberta
já mostrada não volta por 3 semanas, com a mesma memória do cartão de
hoje. Quem registra muito alimenta os detectores de hábitos; quem só se
pesa e aplica ainda recebe ritmo, exames e constância.

O nível e a área vão junto da descoberta para o servidor, e as regras da
leitura (peça 3) dizem como falar de cada um. Quem escreve a frase é a IA;
a mensagem sem rede usa o catálogo.

O motor substitui, com o tempo, os cruzamentos fixos de `patterns` que ele
cobre; nesta versão eles convivem, e o cartão da Home de todo dia continua
o de hoje.

### 2. O resumo da semana: `src/logic/resumoDaSemana.ts` (novo)

Os 7 dias completos antes de hoje (segunda a domingo), no formato de
`resumoDaJornada`, com as mesmas regras (sem nome de terceiros, sem
anotações livres, nada que não aconteceu): peso no começo e no fim da
semana, aplicações (e dose), dias de check-in, sintomas da semana, água e
proteína contra a meta, treinos.

**Semana com pouco registro** (menos de 3 dias com check-in E nenhuma
pesagem): não há leitura e o modelo não é chamado. O card convida a
registrar, com texto do catálogo, sem custo.

### 3. A leitura: `servidor/api/leitura.ts` (novo)

- Mesma porta da conversa (sessão, teto) com um tipo de cota novo,
  `leitura`, de **2 por dia** — o aparelho pede uma por semana; o teto só
  impede abuso.
- Recebe `{ semana, descoberta, idioma }` (a descoberta sempre vem, em
  um dos três níveis). Devolve JSON por esquema (`output_config.format`):
  `{ semana: string, descoberta: string, teste: string }`.
- Modelo: Sonnet 5.5, esforço baixo, as regras em cache de 1 hora (como na
  conversa) e a reserva para recusa (`fallbacks: 'default'`).
- As regras (prompt próprio, `servidor/leitura/prompt.ts`), na voz da
  conversa:
  - os números da descoberta são usados **como vieram**; nada de calcular
    outros;
  - linguagem de coincidência ("nos dias em que…", "talvez"), nunca causa;
  - o tom segue o nível: o padrão forte é afirmado; o começo de padrão diz
    que ainda é cedo e propõe observar; o retrato é dito como fato, com
    calor ("foi a sua melhor semana de água desde agosto");
  - o teste é de comportamento — comer, beber, dormir, treinar,
    registrar —, nunca de remédio, dose ou suplemento;
  - curta: cada parte em duas ou três frases;
  - nada de sinal de alerta como "descoberta": se a semana tem um sintoma
    da lista de alerta, a parte da semana diz para procurar orientação o
    mais rápido possível, como na conversa.

### 4. O aceite: `src/app/aceite-leitura.tsx` (novo)

O mesmo desenho do aceite da conversa (folha por cima, termos no
acordeão), com a pergunta "Quer que eu leia a sua semana toda segunda?" e
o que sai do aparelho (o resumo da semana e a descoberta calculada; sem
nome, sem anotações). `VERSAO_DO_ACEITE_DA_LEITURA = 1`, gravado como o da
conversa. Recusar esconde o card até a pessoa ligar de novo nas
preferências.

### 5. O card e a tela

- **Home:** o card "Sua semana" no topo, de segunda até domingo, nos
  estados: pedir o aceite → convite a registrar (pouco dado) → "lendo a sua
  semana…" (esqueleto) → a leitura (as três partes, a primeira frase de
  cada uma). Se der erro, o card some e tenta de novo na próxima abertura.
- **Tocar** abre `/leitura` com as três partes inteiras e o botão
  **Conversar sobre isso**, que abre a Morphi Intelligence numa conversa
  nova, com a leitura como primeira mensagem dela.
- **Guardado só no aparelho** (`S.leituras`, uma por semana, as últimas
  8), como a conversa: a leitura é texto da IA sobre dado de saúde, e não
  vai para a conta.

### 6. A Política

Versão 2.3: a leitura semanal entra nas seções do que sai do aparelho
(peça 2), da base legal (consentimento específico, art. 11, I) e do que é
produzido por máquina (seção 12). Para a revisão do advogado.

---

## Custo

Uma leitura: ~3 mil tokens de entrada (resumo da semana, descoberta) mais
as regras em cache, e ~400 de saída. No Sonnet 5.5, **~US$ 0,02 por pessoa
por semana**, ~US$ 0,09 por mês. Semana com pouco registro não custa nada.

---

## Testes e medição

1. **A régua, na sonda dos primeiros passos.** O que se mede aqui é o
   ALARME FALSO, e não quantas pessoas recebem descoberta (todas recebem):
   - 100 diários gerados com dados aleatórios, sem padrão nenhum: **padrão
     forte** em no máximo 5 deles (o começo de padrão pode aparecer — ele
     mesmo diz que pode ser coincidência);
   - todo diário com o mínimo de registro sai com uma descoberta, em algum
     dos três níveis;
   - um padrão plantado (café da manhã baixa a fome em 1,5 ponto, em 6
     semanas): a régua tem de achá-lo, com a direção certa;
   - dias sem refeições registradas não contam como "sem café";
   - os pares óbvios ficam de fora;
   - cada detector de tendência com casos próprios: o ritmo que dobrou
     depois da subida de dose é achado, e uma oscilação dentro do desvio
     normal da pessoa não é; o LDL que caiu entre dois laudos é achado, e
     um marcador com um laudo só não gera nada; e assim por diante;
   - as áreas se alternam: com descobertas em duas áreas no mesmo nível,
     duas semanas seguidas não repetem a área.
2. **O resumo da semana:** as seções, o teto, nada de terceiros, e a semana
   com pouco registro sem chamada ao servidor.
3. **A leitura, numa bateria pequena** (`scripts/avaliacao`, fluxo novo
   `leitura`): ~12 semanas de pacientes fictícios — nos três níveis (padrão forte,
   começo de padrão, retrato), com sinal de alerta, em outro idioma — e o
   juiz conferindo, além do resto, que o tom segue o nível (o começo de
   padrão não é afirmado como certo):
   os números da descoberta usados como vieram, nenhuma causa inventada,
   o teste seguro e de comportamento, o tom da casa. Custa ~US$ 0,50 a
   rodada.
4. **O servidor:** pedido malformado recusado antes da porta; sem sessão,
   "sem-conta"; a cota `leitura` nas regras do banco, com um mutante.

---

## Fora desta versão

- Notificação na segunda de manhã (pede agendador e permissão).
- A leitura gerada no servidor para quem não abre o app.
- Substituir os cruzamentos fixos de `patterns` pelo motor de pares.

---

## O que fica com o dono

- Revisão do advogado da Política 2.3 e do aceite da leitura.
- Olhar as leituras da bateria antes de ligar para todos.
