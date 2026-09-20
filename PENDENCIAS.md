# Antes de subir para a loja

Lista curta do que está **de marcação** no código e precisa virar verdade
antes da primeira publicação. Cada item diz onde mexer.

---

## 🔴 Bloqueia a publicação

### 1. O e-mail de contato é de marcação

`src/logic/documentos.ts` → `EMPRESA.email`

Está `contato@morphi.app.br` e **o domínio não foi registrado**. Esse
endereço aparece em oito lugares e não recebe nada:

- abertura da Política de Privacidade
- seção 1 (controlador) e seção 17 (encarregado)
- seção 11 (como exercer os direitos) e 12 (revisão humana)
- seção 15 (denúncia de cadastro de menor)
- seção 15 dos Termos (contato)
- "Reportar um problema", no perfil

É o mesmo canal para contato geral e para o **encarregado (DPO)**, que a
LGPD exige no art. 41 — e ele precisa ser uma caixa que alguém lê, com
resposta em até 15 dias.

### 2. Os dois documentos precisam de revisão de advogado

`src/logic/documentos.ts`

Termos de Uso e Política de Privacidade foram escritos a partir do que o
aplicativo faz — cada afirmação é conferível no código — mas são
**minuta**. Aplicativo de saúde com dado sensível não publica documento
jurídico sem revisão profissional.

**E a voz dos dois vai junto na revisão.** O aplicativo inteiro fala em
primeira pessoa do plural — "guardamos para você", "não coletamos a sua
localização" — e estes dois documentos estão no meio do caminho: contei
**11 verbos em primeira pessoa contra cerca de 12 construções em
terceira**, e as duas vozes se alternam dentro do mesmo parágrafo:

> "**O aplicativo** não usa serviço de telemetria, analytics ou
> monitoramento de erro. **Não compartilhamos** com anunciantes…"

Duas frases seguidas, duas vozes. Não é escolha de registro, é
inconsistência — mas não se conserta antes da revisão, ou o advogado
revisa um texto e a loja recebe outro.

O que fazer quando ela vier: unificar em **primeira pessoa do plural** no
corpo, mantendo "o Morphi" nas seções de identificação — quem é o
controlador (art. 9º) e quem é o encarregado (art. 41) precisam de nome
próprio, não de "nós". Política em linguagem simples faz assim, e a
leitura melhora bastante.

### 3. A política precisa de uma URL pública

As lojas exigem um endereço na internet para a política de privacidade. O
texto está em dados justamente para poder ser publicado; falta a página.

---

## 🟡 Passa a valer quando a assinatura entrar

### 4. O endereço físico volta

`src/logic/documentos.ts` → `EMPRESA.endereco`

Está vazio de propósito: o do cartão do CNPJ é residencial. O **Decreto
7.962/2013**, que regula a venda pela internet, manda exibir endereço
físico e eletrônico em local de destaque — isso passa a valer na primeira
cobrança. Entrar com um **endereço comercial ou fiscal**, e não com o de
casa.

### 5. A cobrança não existe no código

Os Termos descrevem assinatura, isenção por profissional parceiro,
cancelamento e arrependimento de 7 dias (CDC art. 49). Nada disso está
implementado. Descrever a mais não é violação — descrever a menos é —,
mas o fluxo precisa existir antes de a loja cobrar alguém.

**A TELA EXISTE, A COBRANÇA NÃO.** `/planos` está desenhada e ligada em
`src/logic/assinatura.ts`, que é a costura por onde a loja entra. Três
coisas dela são de marcação e precisam de decisão antes da publicação:

- **os preços já foram decididos — R$ 49,90/mês e R$ 299,00/ano — mas
  não existem na loja.** Enquanto os produtos não forem criados na App
  Store Connect e no Google Play com exatamente estes valores, a tela
  anuncia um preço que ninguém consegue cobrar. O selo de −50% é a conta
  entre os dois (299 contra 49,90 × 12 = 598,80), e ele quebra junto se
  algum dos dois mudar;
- **os dois links de loja envelhecem** — `PAGAMENTO_NA_LOJA` e
  `HISTORICO_NA_LOJA` em `src/logic/assinatura.ts` apontam para páginas da
  Apple e do Google, e as duas mudam de endereço sem avisar. Abrir os dois
  antes de publicar: um link morto numa tela de cobrança é onde a
  confiança quebra mais rápido;
- **o desconto de retenção não existe na loja** — `/cancelar` oferece `50% no próximo mês`
  a quem responde "está caro", e quem concede abatimento é a **oferta
  promocional** configurada na App Store Connect e no Google Play, presa
  ao mesmo produto de assinatura — a mesma armadilha do teste grátis.
  `resgatarDesconto()` recusa até lá, e a tela mostra a recusa; a
  porcentagem e o prazo em `DESCONTO_DE_RETENCAO` também ainda não foram
  confirmados;
- **o motivo de cancelamento não sai do aparelho** — `/cancelar` pergunta
  por que a pessoa está saindo e grava a resposta — e o texto que a pessoa escrever — em
  `profile.cancelamento` com a data. Não há para onde enviar: entra na mesma fila do Supabase do
  item 10. Até lá, a tela retém (as alternativas são reais) mas não
  descobre nada;
- **o botão não compra** — `assinar()` devolve "não implementado", e a
  tela mostra isso em voz alta em vez de fingir sucesso;
- **"Restaurar compras" cai no mesmo lugar**, porque restaurar sem loja
  é a mesma promessa vazia;
- **o estado de assinante de `/assinatura` nunca aparece.** A tela de
  gestão tem os três estados desenhados, mas o terceiro lê de
  `assinaturaAtual()`, que devolve nulo enquanto não houver recibo de loja
  para ler. Quando a cobrança entrar, é essa função que passa a devolver o
  plano, a data de renovação e se está no teste — e nenhuma tela precisa
  mudar de forma. A data vem nula até lá, e a linha some em vez de mostrar
  uma data falsa.

⚠️⚠️ **QUALQUER CÓDIGO DE QUATRO LETRAS DÁ O APLICATIVO DE GRAÇA.**

O convite deixou de esperar confirmação da clínica: quem tem o código
recebeu o código dela, e mandar a pessoa esperar a segunda-feira abrir
com o aplicativo trancado não fazia sentido nenhum. Digitar passou a
ligar o vínculo na hora, e vínculo isenta a assinatura.

**Só que ninguém confere o código.** Não existe lista de códigos válidos
em lugar nenhum. Hoje é inofensivo, porque não há cobrança para burlar —
no dia em que houver, "ABCD" vale uma assinatura. As três portas do
convite (o cadastro, `/parceiros` e a folha `/codigo`) chamam a mesma
função, `vinculoDoConvite` em `src/logic/assinatura.ts`, e é ela que
precisa virar uma chamada ao **Supabase** — já está no formato certo para
isso, e a decisão de região está no item 10. Quando virar, as três telas
ganham um estado de espera e um de recusa, que hoje não existem porque
não há como recusar. **Ligar a cobrança antes de a conferência existir é abrir a porta
dos fundos no mesmo dia em que se põe a fechadura na da frente.**

⚠️⚠️ **CÓDIGO E COBRANÇA NÃO PODEM COEXISTIR, E O MECANISMO NÃO EXISTE.**

A regra é: entrou código, não se cobra mais. Mas quem cobra é a loja, e
nenhum aplicativo cancela uma assinatura da App Store ou do Google Play
em nome de alguém — só a própria pessoa, pelas telas da loja, ou o
servidor, pelas APIs de servidor das duas.

Então hoje quem confirma um código estando com assinatura ativa continua
sendo cobrado até alguém cancelar. A tela de gestão faz a única coisa que
pode: mostra "sem custo", que é o que a regra promete, e mantém o
cancelamento à vista. **Fechar isso é trabalho da integração de cobrança**
— cancelamento pelo servidor no momento em que o vínculo nasce, e
provavelmente reembolso proporcional do período já pago.

⚠️⚠️ **A SUSPENSÃO POR FIM DE VÍNCULO É UMA REGRA SEM MECANISMO.**

Os Termos e duas telas passaram a dizer que, se a clínica informar o fim
do vínculo de tratamento, o acesso fica suspenso até a pessoa aderir a um
plano Personal. **A tela existe** — `/suspenso`, desenhada e pronta, com as
três saídas: assinar, exportar e entrar com o código de outra clínica.

O que falta é o que a liga: não há canal pelo qual a clínica informe (é o
mesmo Supabase do item 10), não há estado de "suspenso" guardado, e não
há o ponto do aplicativo que intercepta e manda para lá. Hoje só se chega
por um atalho `__DEV__` na tela de assinatura.

Três coisas precisam ser verdade no dia em que entrar, e as três já estão
prometidas por escrito:

- **ninguém é cobrado sem escolher** — a suspensão não vira cobrança
  automática;
- **a pessoa é avisada**, e não descobre ao abrir o aplicativo trancado;
- ⚠️ **a suspensão não tranca os dados dela.** Um diário de tratamento não
  pode deixar alguém do lado de fora do próprio peso, das próprias
  aplicações e dos próprios exames. Exportar continua aberto com ou sem
  assinatura — está nos Termos, seção 7, e é a parte mais fácil de
  esquecer quando se implementa um portão.

⚠️⚠️ **O TESTE GRÁTIS DE 3 DIAS É UMA PROMESSA QUE A LOJA PRECISA
CUMPRIR.** A tela anuncia "Começar os 3 dias grátis" em corpo grande, e
quem concede período gratuito não é o aplicativo: é a **oferta
introdutória** configurada na App Store Connect e no Google Play Console.
Enquanto ela não existir lá, ligar a cobrança é cobrar alguém que leu
"comece o teste".

**E ela é do produto MENSAL, e só dele.** O teste é o argumento do plano
de quem ainda não decidiu; o anual defende o desconto. Configurar a
oferta introdutória no produto anual por engano dá um ano de graça a cada
três dias de teste.

E ele **não é** o arrependimento do CDC. Os Termos descrevem sete dias
para desistir com reembolso (art. 49) — direito de quem já comprou. O
teste é antes da compra, os dois convivem, e **a seção 7 dos Termos ainda
não fala do teste**: ela precisa passar pela revisão do item 2 com essa
frase dentro.

`TESTE_DIAS = 0` em `src/logic/assinatura.ts` desliga o anúncio na tela
inteira — é assim que se tira, e não apagando frase por frase.

⚠️ **E há uma porta de desenvolvimento a tirar junto.** A semente tem
clínica parceira, então a tela abre sempre no estado isento e a versão
que cobra ficava inalcançável sem editar o estado à mão. O parâmetro
`?compra=1` finge, só no desenho, que não há vínculo, e a linha do perfil
que leva até ele existe só sob `__DEV__` — em produção as duas somem na
compilação. Nenhuma das duas escreve nada no estado. Saem quando a
cobrança entrar.

⚠️ E ela **não é linkada de lugar nenhum**: chega-se por rota. No dia em
que a cobrança existir, o primeiro link é o fim do cadastro — e é aí que
o passo `recomendacao` sai de lá.

**E a tela de planos leva o código junto.** Decidido em 18 de setembro de
2026, quando o passo do convite voltou a ser uma pergunta separada no
cadastro:

- O código não é um dado do tratamento: ele decide **quem paga**. O lugar
  natural de resgatá-lo é onde o preço aparece — "Ver planos", com os
  valores em cima e **"Tenho um código de um especialista parceiro"**
  embaixo, que é como qualquer pessoa já espera resgatar um código.
- **Ali ninguém tenta burlar.** No cadastro, a pergunta "veio por
  indicação?" concede um benefício, e por isso a tela não pode anunciar
  esse benefício — a frase "quem chega por um profissional parceiro não
  paga pelo app" saiu de lá justamente por isso. No paywall a ordem se
  inverte: a pessoa já viu o preço, e quem tem código digita porque tem.
- **Quando a tela de planos existir, o passo `recomendacao` sai do
  cadastro.** São treze perguntas antes da primeira tela, e uma delas
  passa a ser respondida melhor dez segundos depois. Enquanto o paywall
  não existe o passo fica, porque a clínica manda a pessoa baixar o app
  *com o código na mão* e ela precisa de onde escrevê-lo.

⚠️ O que **não** pode sair junto é a porta permanente: `/parceiros`, com
entrada pelo perfil, existe para quem recebe o código depois — e esse é o
caminho mais comum de todos. A tela de planos é onde ele se resgata na
primeira vez; o perfil é onde ele entra em qualquer outra.

⚠️ E vale conferir a regra de loja antes de desenhar: Apple e Google têm
posição sobre desbloquear assinatura por código fora da compra no app.
Ver "A loja olha código que libera conteúdo pago", em MODOS.md.

### 6. A transmissão para a equipe não existe no código

A Política descreve o envio do resumo e das mensagens à equipe de saúde.
Hoje isso é gravado localmente: não há plataforma do outro lado. Antes de
publicar, ou o servidor existe, ou a redação muda.

**E não era só a Política — a TELA de privacidade dizia o mesmo**, para
todo mundo, sem depender de vínculo com clínica: "o resumo sai quando você
toca em enviar e vira um documento datado no que a sua equipe tem; as
mensagens saem quando você escreve". A frase foi reescrita para o que de
fato acontece ("por enquanto, nada"), com a versão futura dita no
condicional. Quando o servidor existir, é lá que a redação volta ao
presente — `src/app/privacidade.tsx`, bloco "O que sai daqui".

Para o registro: o aplicativo inteiro tem **uma** chamada de rede,
`analise.ts`, a da leitura da foto do prato. Nenhuma outra. É o teste mais
rápido para conferir qualquer afirmação de envio no texto.

**A tela de Sinais vitais tem o mesmo problema, por outro caminho.** Nada
no código escreve `S.vitals` — só a semente —, então em produção ela é uma
tela permanentemente vazia. Ela dizia "Withings conectada · peso e pressão
sincronizam sozinhos" em texto fixo, sem ler `S.integrations`, e que
pressão e saturação "chegam do aparelho conectado": a leitura do aparelho
traz só PESO, e Garmin, Fitbit e Withings dependem deste mesmo servidor.
As duas frases foram corrigidas; o que falta é a fonte de dados.

**E vincular também não existe.** Nenhuma tela do aplicativo escreve
`doctor` ou `clinic` — os dois só apareciam porque o seed já vinha com a
Dra. Helena, e desde que o cadastro passou a limpar o seed, quem chega
hoje não tem como ter equipe nunca. O aplicativo tinha **quatro portas**
para um quarto que não foi construído, e as quatro saíram:

| onde | o que prometia | para onde ia |
|---|---|---|
| Home, card sem equipe | "Conhecer especialistas" | `/medico` — a conversa, com o nome da médica vazio |
| Home, cabeçalho | "Ir para área médica" | `/medico`, o mesmo, nos dois estados |
| Cuidado, sem vínculo | botão cheio "Vincular uma clínica" | `/perfil` |
| Perfil, sem vínculo | card "Conectar a um especialista" | **nada** — `onPress` indefinido |
| Sua equipe, "Na clínica" | linha "Compartilhar evolução" | **nada** — `onPress` indefinido |

As duas primeiras agora só aparecem com vínculo, a terceira saiu, a
quarta virou uma vaga vazia que não se toca e a quinta saiu da lista.

**A quinta não ganhou destino de propósito.** Peso, adesão, sintomas,
exames e anotações são o resumo, e o resumo já é o botão azul no alto da
mesma tela — apontar a linha para lá trocaria uma porta que não abre por
duas portas para a mesma sala. Se um dia "compartilhar" for outra coisa —
a equipe acompanhando o peso **continuamente**, e não um documento levado
à consulta —, ela volta como ajuste que se liga e se desliga, e não como
linha de navegação.

**Quando a porta existir**, o modelo é o que os Termos já descrevem
(seção sobre profissional parceiro): quem convida é a clínica, com um
código — e não a pessoa que procura um médico dentro do aplicativo. É o
contrário do que os botões antigos sugeriam, e vale desenhar a tela a
partir do código de convite, não de uma busca.

⚠️ E ainda há uma afirmação sem dono na aba Cuidado: "**Especialistas
credenciados** — médicos que acompanham tratamento com GLP-1 de perto"
descreve uma rede credenciada. Sem o botão ela lê como benefício do
acompanhamento, e não como catálogo; com a rede no ar, precisa ser
verdade sobre quem está nela.

#### A tela da clínica parceira não tem entrada

`/clinica` tem duas versões. A **sua clínica** é a que se alcança pela
ficha da equipe. A **parceira** — a mesma tela vista por quem assina o
Personal, sem vínculo: sem o botão de conversa, com a nota da parceria no
lugar do cartão do vínculo e a equipe sem ficha — **não se alcança de
lugar nenhum**, porque não existe diretório de clínicas parceiras. Os
canais da clínica (telefone, WhatsApp, site, e-mail, Instagram) aparecem
nas duas: ter a conversa do aplicativo não dispensa ninguém de remarcar
uma consulta pelo telefone.

Hoje ela se olha por `?parceira=1`, que é `__DEV__` e sai junto com as
outras portas de desenvolvimento (`?compra=1`, `?assinante=1`,
`?assinante=anual`, o atalho para `/suspenso`).

**Três coisas precisam existir antes de ela valer:**

1. **O diretório.** Uma lista de clínicas parceiras que alguém possa
   abrir — e com ela a decisão de quem entra na lista e por quê. A tela é
   a vitrine; a vitrine sem loja é a parte fácil.
2. **A ficha vir do servidor, e não do perfil.** Hoje `fichaDaClinica` lê
   `profile.clinicInfo`, que é a SUA clínica. Uma parceira que você não
   tem precisa de um `?id=` e de uma origem de dados — e aí `vinculada`
   deixa de ser a porta de desenvolvimento e passa a ser derivável.
1b. **A migração das tarefas do protocolo sai.** `ensureDefaults` converte
   a lista antiga — texto puro, sem `metrica` — para o formato atual,
   usando a lista da semente. Enquanto o protocolo vem da semente isso é
   um conserto; no dia em que a clínica mandar o dela, a migração passa a
   ter opinião sobre dado de outra pessoa e precisa sair, ou ganhar um
   marcador de versão no próprio protocolo.

2a. **As fotos precisam de recorte na hora do envio.** As telas hoje
   enquadram sozinhas, com `contentFit="cover"` e `contentPosition="center"`,
   e isso resolve o cabeçalho grande: a foto entra de borda a borda, o
   rosto fica na metade de cima e a imagem dissolve no fundo antes de
   chegar ao texto.

   **O que não resolve é o quadrado pequeno.** Numa foto de corpo inteiro
   — que é o que uma assessoria manda —, os 76px do cartão de Sua equipe
   deixam o rosto com uns doze. Dá para ver que ali há uma pessoa; não dá
   para ver quem. Nenhuma posição de recorte conserta isso, porque o
   problema é a escala e não o enquadramento.

   Duas saídas, e as duas são do lado de quem envia:

   · **um recortador no envio**, com a clínica escolhendo o quadro do
     rosto — é o que praticamente todo cadastro de equipe faz;
   · **um ponto de foco guardado junto da imagem**, e as telas passam a
     enquadrar por ele em vez de pelo centro.

   Enquanto não houver nenhuma das duas, vale pedir à clínica uma foto
   enquadrada do peito para cima — e a semente usa uma foto de corpo
   inteiro DE PROPÓSITO, para o caso ruim ficar visível em vez de
   aparecer só depois da primeira clínica real.

2b. **A foto de estudo sai.** `IMAGENS_DA_CLINICA` tem uma entrada de
   desenvolvimento — uma foto de comida servindo de recepção — para que o
   cabeçalho com imagem possa ser julgado. Ela está atrás de `__DEV__` e
   nunca sai daqui, mas sai do arquivo no dia em que a clínica mandar a
   dela.

3. **Os contatos de verdade.** O tipo `ContatoDaClinica` existe inteiro,
   mas a semente **não tem telefone nem WhatsApp**, de propósito: um
   telefone inventado a um toque de uma linha que disca sozinha faz
   alguém ligar para a casa de um estranho. Site e e-mail estão em
   `.example`, TLD reservado pela RFC 2606, que nunca vai pertencer a
   ninguém. Quando a clínica mandar os dados, os campos já estão lá.

⚠️ E há uma afirmação de dinheiro nessa versão: "**Pacientes de clínicas
parceiras não pagam pelo aplicativo**". Ela é verdade no modelo de hoje
(`isento(S) = clinicaConectada(S)`) e é o motivo de a tela existir para
quem assina — mas é uma promessa comercial numa tela que apresenta um
terceiro. Se a regra mudar, ela muda aqui também.

**E o protocolo não traz os números dele.** A tarefa da clínica diz
`{ metrica: 'prot', alvo: 7 }` — sete **dias**. Quantos gramas contam como
dia cumprido sai de `profile.targets.prot`, que é da pessoa e ela edita em
Metas › Os números do dia.

Isso significa que **dá para mover a trave e relatar o gol**: baixar a
proteína de 90 g para 40 g faz o protocolo marcar 7 de 7, e a clínica lê
"cumpriu a semana" sem saber que a régua mudou. Vale igual para
hidratação (750 ml a 5 L) e exercício (10 a 180 min).

A saída não é travar a edição. Ela é clinicamente necessária — quem tem
restrição renal não bebe 2,5 L, quem está lesionado não faz 60 min, e a
nutricionista de alguém pode ter dito outro número de proteína. Hoje a
folha de editar já diz de onde o número veio (`ALVOS[k].origem`) e o que
ele muda, para a pessoa saber que está sobrescrevendo uma conta.

**O que falta é o número da clínica ser da clínica.** Quando o protocolo
vier do outro lado, a tarefa medida precisa trazer o alvo junto —
`{ metrica: 'prot', alvo: 7, referencia: 90 }` — e a contagem do protocolo
passa a usar `referencia` quando ela existe, caindo no alvo do perfil
quando não. Aí existem dois números com donos diferentes, o que a clínica
pediu e o que a pessoa se propôs, e isso é legítimo: o defeito de hoje não
é haver dois, é haver um só fingindo ser de dois.

Onde mexer: `protocoloDaSemana` e `historicoDeProtocolos`, em
`src/logic/derive.ts`, mais o formato de `protocol.tasks`.

---

## 🟢 Confirmar em aparelho

### 7. Exportação em iOS e Android

`src/logic/exportacao.ts`

`expo-file-system` + `expo-sharing` não rodam no navegador. O caminho web
(download) foi testado; o **caminho nativo — escrever o arquivo e abrir a
folha de compartilhamento — precisa de um dev client** para ser
confirmado.

### 8. Notificações e leitura de saúde

`expo-notifications`, `@kingstinct/react-native-healthkit` e
`react-native-health-connect` também não existem no Expo Go. Confirmar os
lembretes tocando e a leitura de peso chegando, em build de verdade.

---

## 9. Os ícones alternativos precisam de prebuild

`expo-alternate-app-icons` entra por projeto nativo: os 12 ícones são
declarados no plugin do `app.json` e o arquivo nativo é escrito no
`prebuild`. No EAS isso acontece no próprio build; num dev client local,
rodar `npx expo prebuild --clean` depois de mexer em `PALETAS`.

E regerar os arquivos antes — os dois geradores:

```
node scripts/gerar-icones.mjs
node scripts/gerar-aurora.mjs
```

A troca de ícone não roda no navegador nem no Expo Go — a tela de
Aparência diz isso na própria tela quando é o caso, e as cores mudam do
mesmo jeito. **Confirmar em aparelho** que o ícone troca de verdade.

---

## 🔴 10. O Supabase derruba metade do que os documentos dizem

O aplicativo vai passar a usar **Supabase** — conta, autenticação e banco
de dados. Hoje ele não tem nada disso, e **os textos estão certos**: eles
descrevem um app sem servidor, sem login e sem cópia. No dia em que o
Supabase entrar, cada uma das frases abaixo vira **declaração falsa numa
política de privacidade**, que é o pior lugar para uma.

Nada disso deve ser reescrito antes — descrever tratamento que ainda não
acontece é o erro simétrico. Esta lista existe para que a troca aconteça
**no mesmo commit** que ligar o Supabase.

### O que fica falso

**`src/logic/documentos.ts` — Política de Privacidade**

| seção | frase |
|---|---|
| 5 | "gravados no armazenamento do aplicativo, **no seu próprio aparelho**" |
| 5 | "Não há conta nem senha: ninguém acessa os seus dados com um login" |
| 5 | "**não existe um servidor nosso de onde eles possam vazar**" |
| 5 | "desinstalar o aplicativo apaga tudo, sem cópia para restaurar" |
| 7 | falta o Supabase na lista de **operadores** |
| 8 | com o banco em São Paulo, a **transferência internacional** continua valendo só para a foto do prato — o que entra é uma linha dizendo que o banco fica em território nacional |
| 10 | retenção "no seu aparelho, enquanto você quiser" |
| 14 | segurança: entra senha, hash, sessão e o que protege o banco |

**`src/logic/documentos.ts` — Termos de Uso**

| seção | frase |
|---|---|
| 5 | "funciona **sem conta e sem senha**"; "a guarda dos registros é sua" |
| 8 | "Cancelar não apaga os seus registros — eles estão no seu aparelho" |
| 12 | encerramento passa a envolver apagar do servidor |

**Outras telas**

- `src/logic/consentimento.ts` — o item "**O que você registra fica no seu
  aparelho**". E a `VERSAO` do aviso **precisa subir**: quem consentiu com
  o texto antigo consentiu com outro tratamento, e tem de ver o novo.
- `src/app/privacidade.tsx` — os blocos "No aparelho, dentro do
  aplicativo" e "**Desinstalar leva tudo junto**".
- `src/app/ajuda.tsx` — a resposta de "E se eu desinstalar o aplicativo?",
  e a premissa de que não há conta nem senha.
- `src/app/_layout.tsx` — o comentário do `Portao`: "não há conta,
  servidor nem senha. **NÃO É AUTENTICAÇÃO, e não finge ser**". Com o
  Supabase, ele passa a ser — ou é substituído por autenticação de
  verdade.

### O que muda de comportamento, e não só de texto

- **Apagar meus dados** hoje chama `reset()`, que limpa o aparelho. Com
  servidor, ele tem de apagar lá também — senão o botão mente, e mente
  sobre o direito de eliminação da LGPD (art. 18, VI).
- **Exportar** continua valendo, e passa a ser a garantia de portabilidade
  sobre o que está no servidor.
- **`estadoVazio()`** e o cadastro pressupõem que o estado nasce local.

### ✅ Decidido: o projeto nasce em São Paulo (sa-east-1)

Supabase pergunta a região na criação do projeto e **não dá para mudar
depois sem migrar** — por isso isto estava aqui como decisão, e não como
detalhe de infraestrutura. Está decidida: **São Paulo, `sa-east-1`**.

O que essa escolha compra:

- O histórico de tratamento — peso, sintomas, aplicações, exames,
  anotações — **não sai do Brasil**. Transferência internacional (LGPD
  art. 33) continua valendo só para a foto do prato na leitura por
  imagem, que é o que a política já declara hoje.
- A **seção 8 da Política de Privacidade quase não muda**. Ela continua
  dizendo que o que atravessa a fronteira é a foto, e agora pode dizer
  também que o banco fica em território nacional — o que é um argumento a
  favor, e não uma ressalva.
- Nada de cláusulas contratuais padrão nem de base legal específica de
  transferência para o corpo principal dos dados.

**Se alguém mudar de ideia**, o custo não é técnico: é reescrever a seção
8 inteira, nomear o país de destino, a salvaguarda adotada e a base legal,
e — como o tratamento declarado muda — subir a `VERSAO` do consentimento
outra vez. Migrar um banco de dado sensível depois de ter gente usando é
mais caro do que escolher certo agora.

⚠️ E a região do banco não é a única fronteira: a **autenticação, o
armazenamento de arquivos e as Edge Functions** precisam ficar no mesmo
projeto. Um bucket ou uma função em outra região devolve o problema pela
porta dos fundos.

---

## 🟡 11. As paletas definitivas ainda vão ser desenhadas

As cinco que estão no código — Original, Amora, Pitaia, Brasa, Floresta —
são **provisórias**: valores escolhidos à mão para a tela existir e ser
testada. As definitivas vêm depois, junto com as auroras feitas de
propósito para cada uma, em vez de giradas no matiz a partir da azul.

Quando isso acontecer, o contrato é este — e ele não perdoa erro de nome,
porque o empacotador resolve cada `require` em tempo de compilação:

**Os arquivos**

```
assets/auroras/hero-<id>.webp        fundo da Home
assets/auroras/insights-<id>.webp    fundo do Insights e das Metas
assets/icones/<id>.png               ícone iOS, 1024×1024
assets/icones/<id>-frente.png        camada de frente do Android
```

**Os quatro lugares que precisam concordar**

| onde | o que tem |
|---|---|
| `src/theme.ts` › `PALETAS` | a lista, e a fonte de tudo |
| `src/ui/aurora.ts` | o mapa de `require`, escrito à mão |
| `app.json` › `expo-alternate-app-icons` | uma entrada por ícone |
| `assets/icones/plugin.json` | o mesmo, gerado |

Os dois geradores leem `PALETAS` e escrevem o resto:
`node scripts/gerar-aurora.mjs` e `node scripts/gerar-icones.mjs` — o
segundo reescreve `plugin.json`, que depois se cola em `app.json`. Quem
mudar a lista sem rodar os dois deixa a tela oferecendo uma cor sem fundo
e sem ícone.

**As regras que a tela impõe**

- **Cinco, numa fileira só.** Não há `flexWrap`: uma sexta paleta não
  cabe, e é para não caber.
- **Oito letras no nome, no máximo.** A coluna tem 65 pixels num telefone
  de 360pt. Foi por isso que "Framboesa" virou "Pitaia".
- **Ação e alcançado bem separadas.** Se as duas forem próximas, o botão
  que leva a algum lugar e a marca do que já foi feito viram a mesma
  coisa — que é o problema que as paletas fechadas existem para evitar.
- **Um id que sai da lista precisa de uma linha em `ensureDefaults`**, em
  `src/logic/seed.ts`: ou traduzindo para o novo, ou caindo na original.
  Sem ela a pessoa perde a escolha em silêncio.

---

## 🟡 12. O achado de sono e enjoo é heurística, não estatística

`enjooAposDormir`, em `src/logic/derive.ts`, separa o enjoo do dia
seguinte em dois grupos — noites de 7h ou mais e noites mais curtas — e
só devolve algo quando há **7 noites de cada lado** e a diferença passa
de **0,7 ponto** numa escala de 5. A frase que sai dele mostra as duas
médias, de propósito, para quem lê poder julgar.

Isso substituiu uma frase que não tinha conta nenhuma por trás: ela era
empurrada para todo mundo, sempre, dizendo "seus registros de náusea".

**O que ainda não é verdade:** duas médias e um limiar não são um teste.
Nada aqui controla o **ciclo da aplicação**, que é o que move o enjoo de
verdade — na semana da dose ele sobe por conta dela, e se o sono daquela
semana tiver sido curto por acaso, os dois andam juntos sem ter relação.
Os limiares altos fazem isso acontecer pouco; não fazem não acontecer.

**Antes da loja, decidir uma das três:**

1. Deixar como está, e aceitar que é uma leitura dos registros da pessoa
   — que é o que a frase diz ser, sem afirmar causa.
2. Controlar o ciclo: comparar só dias com a mesma distância da última
   aplicação, o que reduz muito a amostra.
3. Tirar o achado do ar até haver método revisado por quem entende.

Vale a mesma pergunta para qualquer achado futuro que cruze dois sinais
do check-in: **o ciclo da dose explica quase tudo o que oscila neste
aplicativo**, e um achado que não olha para ele está olhando para o ciclo
sem saber.
