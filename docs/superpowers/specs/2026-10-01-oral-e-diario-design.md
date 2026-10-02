# Remédio oral e remédio diário

**Data:** 01/10/2026 · **Estado:** aprovado pelo dono, parte A em construção

## Por quê

O app nasceu para a caneta semanal. Mas o catálogo já tem remédios diários — o
Rybelsus (semaglutida em comprimido, todo dia, em jejum), o Saxenda e o Victoza
(liraglutida, injeção diária) — e vêm mais comprimidos (Wegovy oral,
orforglipron). O levantamento de 01/10/2026 (oito agentes, sete áreas) achou
dois eixos independentes que quebram para essas pessoas:

- **A forma (tomei × apliquei).** Quem toma comprimido lê "Apliquei a dose"
  com uma seringa no "+", "PRÓXIMA APLICAÇÃO · local sugerido: Abdômen (esq.)"
  na Home, uma tela chamada "Aplicações", e o cadastro pergunta "de quanto em
  quanto tempo você aplica?". Pior: cada comprimido é gravado com um local de
  injeção inventado (o `site` nasce de `nextSite` e é salvo mesmo com o campo
  escondido), e esse local vai para o PDF do médico, que diz "Aplicações" —
  "Injections" e "Spritzen" nos outros idiomas.
- **A cadência (todo dia × semanal).** Para quem toma todo dia: a Home diz
  todo dia "Dia 1 depois da dose — o efeito começa a subir" (falso: o remédio
  diário fica em nível estável) e "a fome tende a apertar hoje"; a Jornada cria
  uma "semana" por dose ("Semana 90", "Semana 89"… de um dia cada) e afirma "4
  de 4 semanas com aplicação" para quem perdeu 20 de 28 doses; o estoque supõe 4
  doses por recipiente e pede "renovar" a cada 4 dias; o lembrete é um aviso só
  ("sua dose é amanhã" para quem registrou antes das 9h); o relatório mostra
  "40 de 92 previstas"; e os achados de "dia depois da aplicação" e "janela de
  48 h" da IA não têm sentido.

O que já existe e é a base: o catálogo sabe quem é diário (`cad: 'daily'`) e
qual é a forma; `FORMAS()` tem o vocabulário de cada forma nos 6 idiomas
(comprimido = "tomar", "dose", "cartela"); a folha de registro já diz
"Registrar dose" e esconde o local para comprimido; e a base clínica da IA já
cobre o Rybelsus e a liraglutida.

## Decisões do dono

1. **Vocabulário:** "dose" é o substantivo de todos — títulos, telas,
   documentos ("Doses", "Próxima dose", "Registrar dose"). Só a frase em
   primeira pessoa segue a forma: "Apliquei a dose" / "Tomei a dose".
2. **Registro diário:** um toque por dia, como o check-in. Nada é presumido.
3. **A semana de quem toma todo dia:** a semana do tratamento, blocos de 7
   dias contados do início — a mesma régua do painel "SEMANA N · DIA D".
4. **Estoque do comprimido:** pela caixa (padrão 30, confirmado ao abrir uma
   caixa nova).
5. **Horário da dose diária:** não se pergunta no cadastro; o lembrete
   diário nasce às 9h e se ajusta em Lembretes.
6. **Instruções de uso do comprimido (jejum etc.):** não entram nas telas por
   agora. Ficam na conversa com a IA, que já tem a base clínica, e vão para as
   pendências até haver revisor clínico.

## Parte A — vocabulário e local

**A1. Vocabulário (6 idiomas).** "Dose" para todos: a tela /aplicacoes vira
"Doses"; "PRÓXIMA APLICAÇÃO" vira "PRÓXIMA DOSE"; "Registrar aplicação" vira
"Registrar dose"; o PDF e o resumo do médico dizem "Doses"; o filtro da
Jornada, a trilha de conquistas, o retrato de adesão do Insights e a
exportação também. A primeira pessoa segue a forma ("Apliquei/Tomei a dose"
no "+"; "Se você aplicou/tomou…" no cartão de atraso; "você aplica/toma?" na
frequência do cadastro). Antes de o remédio ser escolhido, o cadastro fala
neutro ("Já comecei" / "Ainda não comecei"). O ícone vem da forma (campo
estrutural `icone` em `FORMAS()`: seringa ou comprimido) nos ~25 lugares em
que a seringa é fixa. O "APLICO A CADA" escrito à mão vai para o catálogo.

**A2. Local só para injeção.** A dose de comprimido para de gravar `site`. O
local, o "local sugerido", a coluna Local do PDF, a trilha "Rodízio" e a
recomendação "escolha o local" só aparecem quando a dose é injetável. A
decisão é por dose, pelo `med` gravado nela (`localDaDose`), e por isso os
locais inventados que já estão gravados somem de todas as telas sem que nada
do diário seja apagado.

**A3. Compartilhamento.** O consentimento troca "Aplicações" por "Doses do
medicamento" — mesmo sentido, sem novo aceite. O .json ganha a via de cada
dose. O nome interno `aplicacao` (tipo no banco, `S.injections`) fica: trocar
exigiria migração e versão nova do consentimento sem ganho para quem usa.

Fora da A: tudo o que é de cadência. Os textos legais (documentos.ts) que
dizem "locais de aplicação" vão junto com a revisão jurídica pendente.

## Parte B — o remédio diário

Vale para cadência de 1 dia (catálogo `daily`, ou `profile.intervalo` = 1).

**B1. A dose vira um hábito do dia.** Na Home, um cartão "Dose de hoje",
pendente até um toque em "Tomei hoje" / "Apliquei hoje" (com a dose do perfil
e a hora real; na caneta diária, já com o local sugerido e um "mudar" que abre
a folha), e depois "feita às 7h12". Saem, para o diário: a contagem regressiva
da próxima dose, o cartão "a dose de ontem não está registrada", as fases do
ciclo ("Dia 1 depois da dose"), a tela /ciclo, a antecipação do "vale" da fome,
a "janela de 48 h" do enjoo, o padrão do ciclo nos sintomas e o detector
`posAplicacao` — o remédio diário fica em nível estável, e esses achados
inventariam um padrão. O calendário de doses permite marcar vários dias
esquecidos de uma vez. Uma segunda dose no mesmo dia pede confirmação (risco
de dose dobrada). Junto, um conserto que vale para todos: a "última dose" passa
a ser a de data mais recente, e não a última do array (um registro retroativo
hoje confunde a próxima dose e muda a dose do perfil).

**B2. A semana do tratamento.** Para o diário, `timelineWeeks` agrupa em
blocos de 7 dias contados do início, numerados como o painel. O cabeçalho de
cada bloco mostra "6 de 7 doses · Rybelsus 7 mg"; o painel diz "5 de 7 dias com
dose". O resumo da semana usa esses blocos como ciclos, e o Insights, a Home e o
"Ver detalhes" continuam abrindo a mesma tela. O slide "Sua semana N" aparece na
virada da semana, e não a cada dose. A trilha de doses conta dias com dose
(7, 30, 90, 180, 365); a trilha do rodízio só existe para injeção.

**B3. Estoque.** O catálogo ganha a quantidade por recipiente: canetas diárias
em mg (Saxenda e Victoza, 18 mg → doses = mg ÷ dose atual); comprimido por
caixa (padrão 30, confirmado ao abrir a caixa). O aviso de renovar passa a ser
em dias de cobertura (7 dias antes), para todos.

**B4. Lembrete.** Diário: todo dia às 9h (ajustável), quieto se a dose de hoje
já foi registrada, agendado dentro da cota de avisos. Semanal: como hoje.

**B5. Relatório e IA.** No diário, o relatório diz "Dias com dose registrada:
26 de 28", sem doses presumidas. A IA recebe a forma e a cadência; os achados
de ciclo semanal desligam para o diário; a constância conta em dias; e para
quem toma comprimido a IA não usa estudos de injeção para projetar perda — só o
ritmo da própria pessoa.

**Fora desta rodada:** instruções clínicas nas telas; remédios novos no
catálogo (Wegovy oral, orforglipron); avaliação da IA com personas Rybelsus e
Saxenda (anotada nas pendências).

## Ordem e verificação

Parte A num commit. Parte B em etapas: B1 + B2, depois B3, B4 e B5. Cada etapa:
typecheck, as sondas de scripts/ (e uma sonda nova para o diário quando a
etapa tocar a lógica), a conferência dos 6 idiomas, o navegador com um diário
de Rybelsus e um de Saxenda, e uma revisão com agentes antes do commit.
