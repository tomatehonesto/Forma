# Primeiros passos, e o fim das frases sobre o que não aconteceu

**Data:** 26 de setembro de 2026
**Estado:** aprovado pelo dono em 26/09/2026
**Plano:** [`../plans/2026-09-26-primeiros-passos-plano.md`](../plans/2026-09-26-primeiros-passos-plano.md)

---

## O problema

Quem termina o cadastro cai numa Home e em abas escritas para quem já tem
semanas de registro. Sem dado nenhum, elas afirmam coisas que não
aconteceram. Visto como pessoa nova, no servidor de produção, em 26/09/2026:

- **Home:** "Ingestão de proteína 0 g/dia — Abaixo da meta", em vermelho, e
  "Peso perdido: Estável", com uma pesagem só.
- **Jornada:** o selo "Ritmo mais lento" no dia 1, e "O efeito começa a
  subir nas próximas horas" sem aplicação nenhuma registrada.
- **Cuidado:** "Seu cuidado está em dia… com boa adesão" com zero doses;
  "Nada precisa de você agora" no dia da primeira dose; "4 de 4" doses
  numa caneta que ninguém registrou; e "1 semanas".
- **Insights:** "duas fortes puxam para cima, e nem a adesão ficou para
  trás. Eu não mudaria nada por enquanto" — um veredito, elogioso, sobre
  nada.

O dono pediu duas coisas: revisar os estados vazios da Home e do app
inteiro, e, no começo, trocar os indicadores por um checklist do que a
pessoa precisa configurar.

---

## As decisões

Tomadas em conversa, em 26/09/2026:

1. **Seção por seção.** O checklist fica na Home enquanto houver item
   pendente, e a seção que só faz sentido com dado — "Sua evolução" — só
   aparece quando ele existe. As metas diárias ficam desde o primeiro dia
   (ver a decisão 4). Não há um interruptor único de "modo boas-vindas".
2. **Cinco itens:** o plano pronto, a primeira aplicação, o primeiro
   check-in, a permissão dos lembretes e o Apple Saúde ou Health Connect.
3. **Ao completar, comemora e some na hora** — nada fica na tela o dia
   inteiro. Antes disso, um "Esconder por agora" discreto tira o checklist
   da Home, e ele pode ser reaberto no Perfil.
4. **O checklist mora na folha clara, e não na aurora:** logo acima de
   "Suas metas diárias".
5. **"Sua evolução" só aparece quando existe evolução.**
6. **Nenhuma frase afirma o que não aconteceu** — a regra da varredura dos
   estados vazios, no app inteiro.

---

## O recorte

**Entra:** o cartão "Primeiros passos" na Home, a linha de reabrir no
Perfil, a condição de "Sua evolução", as correções das frases das quatro
abas listadas acima, e a varredura das telas internas com a mesma regra.

**Fica para depois, a pedido do dono:** decidir se os itens de "Sua
evolução" (peso perdido, ingestão de proteína, gordura corporal) são fixos
ou podem mudar — ver **Questões em aberto**.

---

## Peça 1 — O cartão "Primeiros passos"

### A regra da casa

Cada item é uma **leitura do estado**, e não uma caixinha marcada à mão. É
a mesma regra do preparo da consulta (`ItemDoPreparo`, em logic/derive, e
o alto de app/consultas): o item não pergunta, responde, e o toque leva
para onde a resposta muda. O que o aplicativo não tem como saber não entra.

### Os itens

| id | Título | Pronto quando | Leva a | Não aparece quando |
|---|---|---|---|---|
| `plano` | Seu plano está pronto | sempre (o cadastro terminou) | — (sem toque) | — |
| `aplicacao` | Registre a sua primeira aplicação (dose, no comprimido) | `S.injections.length > 0` | `/aplicacao` | — |
| `checkin` | Faça o primeiro check-in | um dia com resposta (`respostaNoDia`, logic/derive) | `/checkin` | — |
| `lembretes` | Permita os lembretes | `estadoDaPermissao() === 'concedida'` (logic/avisos) | o pedido do sistema, no próprio toque; negada, `/lembretes` | a permissão é `indisponivel` (o navegador) |
| `saude` | Conecte o Apple Saúde / o Health Connect | `S.integrations.appleHealth` no iPhone, `healthConnect` no Android | `/integracoes` | `aparelhoDaVez()` é nulo (o navegador) |

- **O plano já vem feito**, de propósito: a pessoa começa com um item
  cumprido, e o cartão abre em "1 de 5", e não em zero.
- **O subtítulo diz o porquê**, numa linha: o dos lembretes, "para o aviso
  da dose tocar"; o da saúde, "o peso da balança entra sozinho". O nome do
  aplicativo de saúde é o do aparelho (`aparelhoDaVez()`), como no cadastro.
- **Quem conectou a saúde no cadastro** ("Conectar meus dados") vê esse
  item já pronto.
- **O alerta da dose já existe por padrão** (`ensureDefaults`, ligado às
  9 h). Por isso o item é a permissão, e não "criar o lembrete": sem
  permissão, o alerta existe e não toca.
- **O toque nos lembretes pede a permissão ali mesmo.** Em `/lembretes` o
  alerta da dose já aparece ligado, e não haveria o que tocar; e a regra
  de logic/avisos — pedir quando a pessoa quer o aviso — está cumprida,
  porque o item e o subtítulo acabaram de dizer para quê. Negada, o
  sistema não pergunta mais, e o toque seguinte leva a `/lembretes`, que
  mostra o caminho dos ajustes.
- **O check-in é o dia com resposta**, e não qualquer registro: o mesmo
  `checkins` guarda a água e a proteína do dia, e um copo d'água não pode
  marcar "fiz o primeiro check-in".
- **A forma decide a palavra**: quem toma comprimido registra a primeira
  dose, com o desenho do comprimido (`FORMAS().injetavel`).
- **A permissão se lê de novo** ao abrir a Home e na volta ao aplicativo —
  é ela que muda fora do app, nos ajustes do sistema.
- O total é o número de itens que aparecem: "3 de 5" no iPhone, "2 de 3" no
  navegador.

### O desenho

Um cartão da folha clara, no mesmo vocabulário das telas internas: título
"Primeiros passos", o "N de M" à direita, uma barra de progresso fina, e
uma linha por item — ícone, título, subtítulo e seta. O item pronto troca a
seta por um visto e perde o subtítulo; ele fica na lista até o cartão sair,
para a pessoa ver o que já fez. No pé do cartão, "Esconder por agora", em
texto.

### O lugar

Na folha clara da Home, depois da faixa da conta (`FaixaDaConta`) e antes
de "Suas metas diárias". Nunca na aurora: ela é do destaque do dia e do
check-in.

### A conclusão

- Quando o último item fica pronto, o cartão vira "Tudo pronto!" — o visto
  em lima, a cor do feito, e uma frase curta —, fica por uns dois segundos
  e se recolhe. Nada fica na Home o dia inteiro.
- Os itens se cumprem em outras telas (`/aplicacao`, `/checkin`, os ajustes
  do sistema). A comemoração acontece na próxima vez em que a Home aparece
  com tudo pronto, e uma vez só.
- **Os dois segundos correm com o "Tudo pronto!" à vista**: a Home em foco
  e o cartão na tela. Ele mora abaixo da aurora, e quem volta para a Home
  chega no alto dela — sem esta espera, a comemoração acontecia fora da
  vista e o cartão sumia sem ser visto. Rolar para longe antes do fim
  recomeça a conta.
- A marca de concluído é gravada no fim da saída, e não no começo: quem
  fecha o aplicativo no meio dela reencontra a comemoração.
- **Concluído não volta**, nem se a permissão for revogada depois, nem num
  aparelho novo: a marca sobe com o diário.

### Esconder por agora

- O toque tira o cartão da Home e não pede confirmação — é reversível.
- No Perfil, uma linha "Primeiros passos · N de M" reabre o cartão. Ela só
  existe enquanto ele estiver escondido e não concluído — e some se tudo
  ficar pronto com ele escondido: reabrir para ver "5 de 5" seria ruído.
- **O diário de exemplo (a semente) não tem cartão**, nem linha no Perfil:
  ela é alguém com meses de tratamento, e é assim que serve de vitrine.

### O estado

Duas marcas dentro de `apresentacoesVistas` (o mapa que já existe, na parte
`vistos` da sincronia): `primeiros-passos-escondidos` e
`primeiros-passos-concluidos`, com a data. Nenhum campo novo no estado, e
nenhuma mudança no contrato da sincronia — a regra de logic/traducao sobre
campo novo em parte existente não se aplica, porque o campo é o mesmo.

### Os textos

Um grupo novo em `home.ts`, nos seis idiomas: título, progresso, os cinco
itens (título e subtítulo), "Tudo pronto!" e a frase dele, "Esconder por
agora" e a linha do Perfil. Com a voz da casa — "nós" é o produto — e sem
pressupor equipe nem consulta.

---

## Peça 2 — As seções da Home que dependem de dado

- **Suas metas diárias:** ficam desde o primeiro dia. Meta é destino, e não
  juízo — "Faltam 95 g" e "+ Registrar" servem a quem começa. A varredura
  confirma que nenhum cartão dela julga antes do primeiro registro.
- **Sua evolução:** aparece quando existem **duas pesagens em dias
  diferentes** — o mínimo para "peso perdido" querer dizer alguma coisa.
  Quem já tinha começado e informou o peso inicial no cadastro já tem
  evolução no primeiro dia; quem começa hoje, não. Até lá, a seção não
  aparece.
- **Dentro de "Sua evolução"**, até a questão em aberto se resolver: o item
  sem dado diz "sem registro", neutro — o veredito em vermelho da proteína
  só com registro.
- **Quem cuida de você:** como hoje.

---

## Peça 3 — Estados vazios no app inteiro

### A regra

**Nenhuma frase afirma o que não aconteceu.** Sem dado, a tela diz o que
falta e onde se resolve, ou não diz nada — nunca um veredito, nem bom nem
ruim. Elogio sem base é tão falso quanto bronca sem base.

### O que já foi achado, e a correção

| Onde | Hoje | Correção |
|---|---|---|
| Home, "Sua evolução" | "0 g/dia — Abaixo da meta" em vermelho; "Peso perdido: Estável" com uma pesagem | a seção só aparece com evolução (Peça 2) |
| Jornada, cartão do peso | "Ritmo mais lento" no dia 1 (`ritmoLento`, textos/tratamento) | o ritmo só aparece com pesagens suficientes para ter ritmo |
| Jornada, a aplicação | "O efeito começa a subir nas próximas horas" sem aplicação (`aplicHead`, `faseAplicHint`, textos/ciclo) | a fase do ciclo só existe depois da primeira aplicação; antes, a primeira dose como o que vem |
| Cuidado, o destaque | "Seu cuidado está em dia… com boa adesão" com zero doses (`emDiaTitulo` e vizinhas, textos/cuidado) | um texto de começo, que não fala de adesão antes de haver dose |
| Cuidado, "Precisa de você" | "Nada precisa de você agora. Seu acompanhamento está em dia." sem dose nenhuma (`nadaPrecisa`, `emDia`) | o "em dia" sai antes do ciclo; a primeira dose **não** vira pendência — "vale resolver esta semana" empurraria alguém a começar um remédio, e quando começar é decisão dela com quem receita |
| Cuidado, a caneta | "4 de 4" doses numa caneta nunca registrada (`estoqueEmDia`, textos/tratamento) | pedir o registro da caneta, em vez de supor que está cheia |
| Cuidado, o destaque | "1 semanas" | plural certo (a vizinha `Nesta dose há…` já faz) |
| Insights, o equilíbrio | "…e nem a adesão ficou para trás. Eu não mudaria nada" sem dado (textos/equilibrio) | a leitura só com registro; antes, o que registrar para ela existir |

#### O que a Etapa 2 achou a mais

A causa comum: sem aplicação registrada, `nextInjectionDate` devolve **hoje**
por recuo. Toda frase montada em cima dela afirmava uma dose que ninguém
marcou. Agora quem escreve sobre dose, ciclo ou adesão pergunta antes
`temCiclo` (logic/derive).

| Onde | Hoje | Correção |
|---|---|---|
| Home, o carrossel | "Hoje é dia de aplicar sua dose" logo depois de "Sua primeira aplicação ainda está por vir" | o slide da próxima aplicação só com ciclo |
| Jornada, o painel | "SEMANA 1 · DIA 1", "dose hoje", "0 de 1 semanas com aplicação" antes da primeira dose | "ANTES DA PRIMEIRA DOSE"; sem data de dose; só a contagem de check-in; plural de semana |
| Jornada, a faixa da fase | "APLICAÇÃO · O efeito começa a subir" sem aplicação | "PRIMEIRA DOSE · O ciclo começa a contar da primeira dose que você registrar", e o toque leva ao registro |
| Jornada, "O que já mudou" | "Peso · 80,0 → 80,0 · Estável" com uma pesagem | o peso entra com evolução, como os vizinhos; sem nada, a seção diz quando passa a ter |
| Cuidado, o destaque | "0 de 0 doses" e a régua "Semana 1 de 10 · 0 com aplicação em dia" | a pastilha e a régua só com dose prevista; e "com boa adesão" só com 90% ou mais |
| Cuidado, a dose | "Aplicação hoje" sem aplicação; "Nesta dose há 1 semana" no dia da primeira | "Nenhuma dose registrada"; a semana na dose sem piso de um |
| Cuidado e confirmação da aplicação | "4 de 4 · Estoque em dia" e "Restam 4 doses" sem recipiente registrado (`penStock` devolve cheio por recuo) | pede o registro do recipiente, com o toque levando a ele (`penStock().registrada`) |
| Insights, "Próximas ações" | "Separe a caneta… a aplicação da semana está chegando" sem aplicação | só com ciclo |
| Insights, o equilíbrio | adesão zero como o eixo mais fraco de quem não começou | sem ciclo, adesão não é eixo |
| O aviso da dose | "é hoje" às nove, todo dia em que o app abrisse cedo, sem aplicação registrada | o aviso da dose conta da primeira aplicação registrada; Lembretes diz isso na linha |
| Jornada, o ritmo | "Ritmo mais lento" com uma pesagem | a etiqueta só com duas pesagens separadas por uma semana (`temRitmo`) |
| Biblioteca e sugestões do Morphi | "Você aplicou há 7 dias" sem aplicação; "Posso trocar o dia da aplicação?" sem dia de aplicação | as leituras do ciclo e a sugestão só com ciclo |

### A varredura das telas internas

Com a mesma regra, como pessoa nova, no servidor de produção: Evolução,
Metas, Alimentação, Hidratação, Exercício, Sintomas, Sinais vitais, Exames,
Conquistas, Histórico, Semana, Ciclo, Aplicações, Caneta, Consultas, Resumo
para o médico, Protocolos e Trilha. O que ela achar entra no plano, tela
por tela, antes de ser corrigido.

---

## Peça 4 — Testes e verificação

- **Uma sonda nova em scripts/** (como as de acesso e de canetas) trava a
  derivação dos itens: o diário novo tem o plano pronto e o resto pendente;
  a primeira aplicação e o primeiro check-in marcam os seus; as marcas de
  escondido e concluído valem; concluído não volta.
- **A mesma sonda trava a Peça 2:** uma pesagem, sem evolução; duas no
  mesmo dia, sem evolução; duas em dias diferentes, com.
- **E trava as frases da Peça 3** que saem de logic/derive: com zero doses,
  nada fala em adesão; sem aplicação, nada fala em fase do ciclo, próxima
  dose nem aviso de dose; sem pesagens bastantes, nada de ritmo nem de
  "estável"; sem recipiente registrado, nada de estoque; sem check-in
  respondido, nada de leitura do equilíbrio.
- **No navegador:** como pessoa nova, no servidor de produção, na origem de
  teste (127.0.0.1:8082), em claro e escuro: o cartão, a comemoração, o
  esconder e o reabrir.
- **No iPhone, pelo dono:** o item dos lembretes (a permissão é do
  aparelho) e o da saúde.

---

## Questões em aberto

- **Os itens de "Sua evolução" são fixos ou mutáveis?** Hoje são três:
  peso perdido, ingestão de proteína e gordura corporal. O dono quer decidir
  depois se continuam fixos ou se podem mudar (conforme o que a pessoa
  registra, ou por escolha dela). Até lá, vale a Peça 2.

---

## O que este desenho NÃO faz

- Não muda o cadastro.
- Não cria tela nova: é um cartão na Home e uma linha no Perfil.
- Não muda o contrato da sincronia: as marcas moram num campo que já sobe.
- Não decide o futuro de "Sua evolução".

---

## Riscos conhecidos

- **A permissão é assíncrona e do aparelho.** O item dos lembretes pode
  aparecer pendente por um instante antes da leitura chegar; a leitura
  precisa acontecer antes de o cartão contar o progresso, ou a barra pula.
- **A comemoração depende de a Home aparecer.** Quem completa o último item
  e fecha o aplicativo vê a comemoração na próxima abertura — e é o certo,
  porque é ali que ela é notada.
- **Itens cumpridos em outro aparelho** chegam pela sincronia e aparecem
  prontos, e a permissão e a saúde de um aparelho novo aparecem pendentes.
  A marca de concluído, que também sobe, impede o cartão de voltar para
  quem já tinha terminado.
