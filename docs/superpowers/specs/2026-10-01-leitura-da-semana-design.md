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

1. **No aparelho**, um motor novo testa todos os pares comportamento ×
   resultado com uma régua contra coincidência. O número que sai é sempre
   uma conta, nunca uma impressão.
2. **No servidor**, o Sonnet 5.5 recebe o resumo da semana e a descoberta
   já calculada, e escreve a leitura na voz da Morphi Intelligence. Ele
   não descobre nada: narra, conecta e propõe um teste.

Decisões do dono (01/10/2026):

- **Onde:** um card "Sua semana" no topo da Home, toda segunda.
- **Aceite:** próprio, pedido pelo card na primeira vez ("Quer que eu leia
  a sua semana toda segunda?"). Quem não aceita não recebe; o resto do app
  não muda.
- **Conteúdo:** três partes curtas — a semana, a descoberta mais forte, e
  UM teste prático para a semana seguinte. Sem descoberta forte, só a
  semana e o teste.
- **Geração:** na primeira abertura do app a partir de segunda. Só gasta
  com quem usa, e o dado sai do aparelho como na conversa.

---

## As peças

### 1. O motor de pares: `src/logic/pares.ts` (novo)

**Os comportamentos** (do dia d):

| id | como se lê | cuidado |
|---|---|---|
| `cafe` | uma refeição com o nome de café da manhã do catálogo (qualquer um dos 6 idiomas) ou antes das 10h30 | só entram dias com pelo menos 2 refeições registradas: "sem café" num dia sem registro é só um dia sem registro |
| `proteinaNaMeta` | `prot` do dia ≥ `targets.prot` | só dias com proteína registrada |
| `aguaNaMeta` | `aguaDoDia` ≥ `targets.waterMl` | só dias com água registrada |
| `treino` | `exerc` > 0 | só dias com check-in |
| `sono7` | `sono` ≥ 7 h | só dias com sono respondido |
| `jantarTarde` | a última refeição do dia depois das 21h | o mesmo corte de `cafe` |
| `posAplicacao` | d é o dia seguinte ou o segundo dia depois de uma aplicação | só com aplicações registradas |

**Os resultados** (do dia d e do dia d+1): fome, energia, humor e enjoo,
na régua de 1 a 5 da tela (`paraTela`, `grauDoSintoma`).

**A régua** (uma descoberta só existe se passar em tudo):

- janela: as últimas 6 semanas;
- pelo menos **4 dias de cada lado** (com e sem o comportamento);
- diferença das médias de pelo menos **1 ponto** na régua de 1 a 5;
- **a mesma direção nas duas metades da janela** (as 3 semanas mais
  antigas e as 3 mais recentes, cada metade com pelo menos 2 dias de cada
  lado): o padrão tem de se repetir, e não só aparecer uma vez;
- fora o que é óbvio ou circular: `posAplicacao` × enjoo já é a "janela do
  enjoo" de hoje; `proteinaNaMeta` × fome do mesmo dia é quase a mesma
  coisa medida duas vezes.

**A ordem:** pela força (a diferença, ponderada pela menor amostra), e só
a primeira vai para a leitura. As outras ficam para as semanas seguintes,
com a mesma memória do cartão de hoje (uma descoberta já mostrada não
volta por 3 semanas).

**A frase da descoberta é dado, não texto:**
`{ comportamento, resultado, defasagem: 0 | 1, mediaCom, mediaSem, diasCom, diasSem, direcao }`.
Quem escreve é a IA (peça 3), e a mensagem sem rede usa o catálogo.

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
- Recebe `{ semana, descoberta | null, idioma }`. Devolve JSON por esquema
  (`output_config.format`): `{ semana: string, descoberta: string | null, teste: string }`.
- Modelo: Sonnet 5.5, esforço baixo, as regras em cache de 1 hora (como na
  conversa) e a reserva para recusa (`fallbacks: 'default'`).
- As regras (prompt próprio, `servidor/leitura/prompt.ts`), na voz da
  conversa:
  - os números da descoberta são usados **como vieram**; nada de calcular
    outros;
  - linguagem de coincidência ("nos dias em que…", "talvez"), nunca causa;
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

1. **A régua, na sonda dos primeiros passos:**
   - 100 diários gerados com dados aleatórios, sem padrão nenhum: a régua
     tem de achar descoberta em **no máximo 5** deles;
   - um padrão plantado (café da manhã baixa a fome em 1,5 ponto, em 6
     semanas): a régua tem de achá-lo, com a direção certa;
   - dias sem refeições registradas não contam como "sem café";
   - os pares óbvios ficam de fora.
2. **O resumo da semana:** as seções, o teto, nada de terceiros, e a semana
   com pouco registro sem chamada ao servidor.
3. **A leitura, numa bateria pequena** (`scripts/avaliacao`, fluxo novo
   `leitura`): ~12 semanas de pacientes fictícios — com descoberta, sem
   descoberta, com sinal de alerta, em outro idioma — e o juiz conferindo:
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
- Descobertas com o peso como resultado (a semana é curta demais para o
  peso responder a um comportamento).

---

## O que fica com o dono

- Revisão do advogado da Política 2.3 e do aceite da leitura.
- Olhar as leituras da bateria antes de ligar para todos.
