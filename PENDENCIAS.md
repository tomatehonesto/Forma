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

---

## 🔴 13b. A validade do manipulado: a faixa da pergunta é escolha minha

O aplicativo passou a aceitar medicamento manipulado, e manipulado **não
tem prazo de validade de bula**: quem define é a farmácia que preparou,
caso a caso. Por isso o prazo é perguntado no registro de um recipiente
novo, e guardado junto com o recipiente — não no catálogo.

A pergunta é opcional e começa em "não sei". Sem resposta, **o aplicativo
não fala de vencimento** para aquela pessoa: nenhuma data é calculada e a
tela do recipiente diz "não informada". É de propósito — anunciar um
vencimento que ninguém calculou é mandar descartar o que está bom, ou
autorizar o que não está.

O que precisa de olho de quem entende, em `src/app/caneta-nova.tsx`:

| constante | valor | o que decide |
|---|---|---|
| `VALIDADE_MIN` | 7 | o menor prazo que a régua deixa dizer |
| `VALIDADE_MAX` | 90 | o maior |

**Não consegui derivar esses dois de nada.** Os prazos que o catálogo
conhece — 14, 21, 30 e 56 dias — são de produto industrializado, e um
manipulado não herda nenhum deles. Sete e noventa são o meu palpite de
"nada desta classe se guarda aberto por menos de uma semana nem por mais
de três meses".

**O que está em jogo se estiver errado:** se a farmácia de alguém disser
um prazo fora da faixa, a régua não deixa a pessoa dizer o número certo —
e ela vai gravar o mais próximo, que é pior do que não gravar nada. Se
for para errar, é melhor a faixa ser larga demais do que estreita.

---

## 🔴 13. Os limiares de platô são escolha de código, não decisão clínica

`src/logic/etapa.ts` passou a reconhecer duas etapas do tratamento a
partir do peso, e as duas dependem de números que **eu escolhi**:

| constante | valor | o que decide |
|---|---|---|
| `PLATO_SEMANAS` | 4 | quanto tempo parada conta como platô |
| `PLATO_KG` | 0,5 | quanto o peso pode ter caído e ainda contar como parado |
| `PLATO_VELHO_SEMANAS` | 7 | quando o platô deixa de ser notícia na Home |
| `LARGURAS_DIAS` | 7 e 14 | de quantos dias é a média de cada ponta |
| `MIN_PESAGENS` | 2 | quantas pesagens uma janela precisa para valer |
| faixa da meta | +0,5 kg | quão perto da meta conta como "na meta" |

**O raciocínio, para quem for revisar:** quatro semanas porque o próprio
aplicativo diz, na tela de evolução, que variações de um a dois quilos
acontecem por água, sal e intestino — uma quinzena parada é ruído. Meio
quilo em quatro semanas dá cerca de 125 g por semana, bem abaixo de
qualquer ritmo terapêutico. A comparação é entre **médias**, nunca entre
duas pesagens, e cada janela exige duas pesagens para valer.

**A largura da janela se ajusta, e isso pede revisão junto.** Eram sete
dias fixos, e quem se pesa uma vez por semana nunca tinha duas pesagens
numa janela: essa pessoa não recebia platô nem manutenção, nunca. Agora
tenta sete dias e, não cabendo duas pesagens nas duas pontas, tenta
catorze. A distância entre os centros das janelas continua sendo 28 dias
nos dois casos, então o meio quilo continua querendo dizer a mesma coisa.

O que precisa de olho clínico: **a leitura de quem se pesa uma vez por
semana é mais ruidosa** — média de duas medidas contra média de sete. Um
falso platô diz a alguém que o peso está parado quando ele caiu; um platô
perdido deixa alguém um mês sem a conversa. Se meio quilo for apertado
demais para duas medidas, o caminho é um limiar próprio para a janela
larga — e aí ele também é escolha minha, não medida. Quem se pesa de
quinze em quinze continua de fora de propósito: com duas pesagens no mês
não dá para separar platô de água.

**O que está em jogo se estiver errado.** A frase que sai daqui é *"Seu
peso está parado há cerca de um mês — platô é parte esperada do
tratamento, é assunto de consulta, não de esforço."* Ela foi escrita para
não culpar ninguém e para empurrar para a consulta em vez de para o
esforço. Ainda assim:

- **cedo demais** e o aplicativo chama de platô uma oscilação normal,
  o que assusta quem está indo bem;
- **tarde demais** e alguém passa dois meses achando que o problema é
  ela, quando havia conversa de ajuste de dose a ser tida.

**Decidir antes da loja:** se 4 semanas / 0,5 kg é a régua, ou se a régua
muda com a fase do tratamento — o platô da titulação não é o mesmo da
manutenção. Vale a mesma pergunta do item 12: **o ciclo da dose explica
quase tudo o que oscila neste aplicativo**, e a semana da dose mexe no
peso pela água que ela segura.

**A meta clínica passou a existir, e ela é ANOTADA, não recebida.**
`protocol.metaPeso` guarda `{ kg, em, por }` — o número, a data e quem
definiu —, e a folha `/meta-clinica` é a pessoa escrevendo o que a equipe
dela disse na consulta. Não há servidor, então não há transmissão: todo
texto dessa folha foi escrito para nunca sugerir o contrário, e o verbo é
sempre *anotar*.

**O que revisar junto com os limiares acima:**

- **A procedência não é verificável.** "Dra. Helena Costa, 12 de março" é
  o que a pessoa lembrou, e o aplicativo passa a dizer *"você está na
  faixa que a sua equipe definiu"* com base nisso. É a razão de o nome e
  a data serem obrigatórios — sem eles, o número afirmaria uma origem que
  nem ela conseguiria conferir depois. Ainda assim, alguém precisa
  decidir se essa frase pode ser dita a partir de um dado transcrito.
- **Só a MANUTENÇÃO usa a meta clínica.** A Jornada, a evolução e as
  conquistas continuam medindo contra `profile.goalWeight`, que é a meta
  da pessoa — decisão de produto, tomada com o usuário: a viagem é dela,
  e repontar o destino em silêncio mudaria o que todas as telas dizem
  sobre o progresso sem que ela tivesse pedido.
- **O limiar de divergência é 2 kg**, e é escolhido como os de cima.
  Acima disso a área médica mostra um aviso sugerindo levar a diferença
  para a consulta.
- **Quando houver servidor**, o campo é o mesmo e passa a ser preenchido
  do outro lado. O que muda é a frase da tela, não o formato — e aí a
  procedência vira verificável.

**Decidido:** a frase *"você está na faixa que a sua equipe definiu"* pode
ser dita a partir de um dado transcrito, **desde que o nome e a data
estejam à vista na mesma tela**. É por isso que os dois são obrigatórios
na folha de anotar, e é por isso que toda tela que mostra o número mostra
a procedência junto.

---

## 🔴 14. O ditado abriu a segunda saída de rede, e a tela de privacidade não sabe

Até agora o aplicativo tinha **exatamente uma** chamada de rede: a leitura
da foto do prato, em `src/logic/analise.ts`. A tela de privacidade foi
corrigida nesta semana justamente para parar de descrever transmissões que
não existiam.

O microfone do companion (`src/ui/useDitado.ts`,
`expo-speech-recognition`) muda isso. Reconhecimento de fala **pode mandar
áudio para os servidores da Apple ou do Google** — e áudio de alguém
falando do próprio tratamento é dado de saúde.

**O que o código faz:** pede `requiresOnDeviceRecognition: true`, que é o
certo para um aplicativo de saúde. A documentação do módulo diz *"only
enabled if the device supports it"*: quem não tem o modelo de pt-BR
instalado cai no reconhecimento por rede **sem que nada avise**. Na web é
sempre pela rede, pela própria natureza da Web Speech API.

**Por isso o texto da permissão não promete que o áudio fica no
aparelho** — seria promessa que o código não cumpre.

**Antes da loja:**

1. **A tela de privacidade e a política precisam citar o ditado**, dizendo
   que a fala pode ser processada pelo sistema operacional e que isso
   acontece só enquanto o microfone está ligado. Vai junto com a revisão
   jurídica do item 2.
2. **Decidir se o ditado só aparece com reconhecimento local disponível.**
   `getSupportedLocales()` responde se o pt-BR está instalado — dá para
   esconder o microfone quando não estiver, ao custo de o recurso sumir
   para parte das pessoas.
3. **Conferir no aparelho.** O ditado não pôde ser testado de ponta a
   ponta aqui: o painel do navegador bloqueia captura de microfone. O que
   foi verificado é que o botão aparece, pede permissão, e que a recusa
   vira a frase certa na tela. Falta ver a transcrição acontecendo, em
   iOS e em Android, com prebuild.
4. **O prebuild.** O módulo não roda no Expo Go. Isso não é novidade —
   os ícones alternativos do item 9 já exigem prebuild —, mas agora são
   dois motivos.

---

## 🔴 15. O identificador do aplicativo foi escolhido por mim

`br.com.selloapp.morphi`, em `app.json`, nos dois lugares
(`ios.bundleIdentifier` e `android.package`). Saiu do domínio do e-mail de
contato do projeto, em DNS reverso — que é a convenção —, mas **ninguém
confirmou**.

**Por que isso é bloqueante e não um detalhe:** depois da primeira
publicação numa loja, esse identificador **não muda**. Ele é a identidade
do aplicativo para a Apple e para o Google; trocar depois significa um
aplicativo novo, sem os usuários, sem as avaliações e sem o histórico de
compras do anterior. Antes de publicar é uma linha; depois, não é nada.

**Confirmar antes do primeiro build de produção:**

1. O domínio é mesmo `selloapp.com.br`? Se a empresa publicar sob outro
   nome, o identificador segue o outro.
2. iOS e Android podem ser iguais (é o mais comum) ou diferentes.
3. Se já existir uma conta de desenvolvedor com algum aplicativo
   publicado, vale seguir o padrão que ela já usa.

## 🟡 16. O EAS está configurado, mas o projeto ainda não existe na conta

`eas.json` tem três perfis — `development` (build de desenvolvimento, APK,
distribuição interna), `preview` (release instalável para testar) e
`production` (app bundle para a loja). `appVersionSource: "remote"` deixa
a numeração de build com o EAS, em vez de manter à mão no `app.json`.

**Falta o que só quem tem a conta pode fazer:**

```
npx eas-cli login
npx eas-cli init          # cria o projeto e grava extra.eas.projectId
npx eas-cli build -p android --profile development
```

O `init` grava o `projectId` no `app.json`, e sem ele nenhum build sobe.

**O que a build de desenvolvimento destrava** — hoje três recursos estão
no código e nenhum pode ser testado, porque todos precisam de módulo
nativo que o Expo Go não tem:

- o **ditado** do companion (`expo-speech-recognition`);
- os **ícones alternativos** por paleta (item 9);
- a leitura do **Apple Saúde / Health Connect** (`saude-do-aparelho.ts`).

**iOS a partir do Windows** precisa de conta paga de desenvolvedor Apple —
o EAS compila na nuvem, mas a assinatura do aplicativo é da conta. Android
não precisa de nada além da conta Expo para o perfil `development`.

## 🟡 17. O nome do marcador é chave de registro, e aparece na tela

Não bloqueia a publicação em português. Bloqueia a versão em inglês.

"HbA1c", "Glicemia jejum", "Colesterol total", "T4 livre" são o que fica
**gravado** em cada exame anotado (`e.marker`), e são também o que a tela
**mostra** — a lista de exames, os chips de `/medir-exame` e o topo de
`/marcador` desenham a própria chave.

As duas coisas não podem ser a mesma no dia em que houver um segundo
idioma:

- traduzir a chave quebra o vínculo com todo exame já anotado;
- não traduzir deixa "Glicemia jejum" na tela de quem lê em inglês.

**O que falta:** separar chave de nome de exibição. A chave continua o que
é hoje (é dado, e dado não se traduz); o nome sai do catálogo, como os
rótulos de categoria já saem — `T.marcadores.nome[chave]`.

**Por que não foi feito junto da extração:** a extração dos textos tem uma
invariante verificável — a saída não muda. Esta mudança muda a saída de
propósito, e misturar as duas faria o congelamento parar de provar
qualquer coisa. Fica para a peça da tradução — ver o item 19.

É também onde entra a pergunta maior, que continua aberta: o catálogo de
exames é brasileiro. "TGO/TGP" é a nomenclatura daqui — nos Estados Unidos
os mesmos marcadores são AST e ALT, e não é tradução de rótulo, é outro
nome no laudo.

## 🟡 18. As tabelas de alimentos: o que ficou em aberto

A base dos EUA entrou — 4.666 alimentos da FNDDS/USDA, com a porção
caseira vinda do próprio dado. `MERCADO` em `src/logic/mercado.ts` escolhe
qual tabela o aplicativo usa. Três coisas ficaram para depois:

**a) O pacote viaja nos dois mercados.** São 647 KB de string, e o
`require` adiado evita o custo de LEITURA mas não o de tamanho: o Metro
não tira um módulo do bundle por causa de uma constante. Quando existir
build por mercado de verdade, é ela que escolhe o arquivo — hoje o
brasileiro carrega a tabela americana sem nunca abrir.

**b) A lista americana não tem curadoria de importância.** A brasileira é
ordenada à mão dentro de cada prateleira, do mais comum para o menos, e a
busca usa essa ordem como desempate. A FNDDS não traz nada parecido, então
a ordem é por nome mais curto — o que acerta "Broccoli, raw" antes de
"Beef and broccoli" e erra "Rice cake" antes de "Rice, white, cooked".

O que resolveria é frequência de consumo, que a FNDDS tem no inquérito
mas não neste arquivo. Enquanto isso, quem procura arroz branco digita
mais uma palavra.

**c) As restrições caem para o nível da prateleira.** `contemDe` procura o
alimento num mapa escrito à mão por id — e os ids americanos não estão
nele —, então cai no que a PRATELEIRA contém. Funciona, e é mais grosso:
"Carnes e aves" inteira conta como carne, sem distinguir o que tem
lactose do que não tem. O mapa por id precisa ser escrito para os
alimentos americanos que importam.

**d) O fast food brasileiro tem três redes.** Estão
dentro o McDonald's (54 itens), o Burger King (45) e o Habib's (18), cada
um com a colheita em `scripts/dados/` e um script que a refaz. As duas que
faltam não faltam por falta de trabalho:

- **Bob's publica calorias, carboidrato e sódio — e não publica proteína.**
  A proteína é o número central deste aplicativo, e estimá-la a partir do
  nome do sanduíche seria inventar. Enquanto a rede não publicar, não
  entra.
- **O Subway fica de fora de propósito.** Lá a pessoa monta o lanche —
  escolhe pão, proteína, queijo e o que mais quiser —, e um item
  chamado "Subway Frango" seria um número médio com cara de dado. Quem
  montou o próprio lanche registra o que pôs nele, que é o que a lista
  geral já faz. A rede também não publica tabela no site, mas essa é a
  razão menor.

**d.1) Do Habib's só entra o que é da casa.** A rede vende kibe, tabule,
homus, arroz branco, batata frita e pastel, e nenhum é dela — a tabela
geral já tem todos, medidos pela Unicamp. Pôr os dois lados criaria uma
escolha sem resposta entre "Esfiha de carne" e "Habib's Esfiha de carne".
A régua está no gerador, e é por linha de produto: Bib'Sfiha, Beirute e
Genius. O McDonald's e o Burger King não precisam de régua porque o
cardápio inteiro deles já é próprio.

**d.1.1) E a prateleira é de salgado.** A sobremesa das três redes ficou
de fora — 150 itens, contra os 117 que entraram. O cardápio de sobremesa
de uma rede é quase todo variação da mesma coisa, dezenove sundaes que
mudam a calda, e três deles juntos enterravam o sanduíche procurado
debaixo de sabor de sorvete. O que um doce de rede acrescenta ao dia já
está em "Doces e lanches", na tabela geral; o que só existe na rede é o
salgado.

A perda que dói é uma: o shake proteico do Burger King, doce pela régua e
proteína pelo conteúdo. Se tiver de voltar, é tirar "shake" da lista
`DOCE` no gerador e pôr o nome dele numa exceção.

**d.2) O que as fontes erram, e o que fizemos.** Vale saber, porque volta
na próxima colheita:

- O botão "Ver Tabela" do site do Burger King aponta para um arquivo que
  responde AccessDenied. O que responde é o nome sem data, e é nele que
  `colher-bk.mjs` bate. Se cair, o jeito de achar o novo está no alto do
  script.
- A tabela do Burger King erra o próprio %VD em várias linhas — publica
  "56 g (121%)" onde 56 g de 50 são 112%. Por isso a conferência é pela
  caloria calculada dos macros, que é física, e não pela porcentagem
  deles.
- Uma linha dela, "BK® Chicken – 4 unidades", traz 40 g e 1 g de proteína
  enquanto as de 6 e 10 unidades trazem 18 g por unidade. É coerente
  consigo mesma e incoerente com os irmãos: ficou de fora.
- Oito itens do Habib's não declaram alérgeno nenhum, e ficaram de fora
  por isso — sem declaração não dá para distinguir "não tem leite" de
  "não disseram", e o que não está marcado o aplicativo mostra a quem
  filtrou lactose. Um deles é comida de verdade: o "Sorvete de Creme".

**d.3) A restrição do Burger King sai do nome.** A tabela dele liga
alérgeno a INGREDIENTE — o queijo cheddar, a calda de morango — e não a
produto, e montar a receita de cada sanduíche a partir disso é um trabalho
que a fonte não sustenta. A lista de palavras no gerador é generosa de
propósito: marcar de menos é o erro que machuca.

**e) A colheita envelhece.** As redes mudam receita e cardápio, e a nossa
cópia tem a data em que foi feita — 21/09/2026. Não há nada que avise
quando ela ficar velha. Antes de subir para a loja, vale recolher: são
três comandos, `colher-habibs`, `colher-bk` e o colhedor de navegador do
McDonald's, e depois `gerar-fastfood-br`.

## 🔴 19. A extração de textos não terminou, e são 1.150 frases

**O número que eu tinha dado estava errado.** Eu disse 466, e a medição
foi estreita: contava só literal de string com acento ou palavra
portuguesa, com quatro letras ou mais, e não via template literal nem
texto solto dentro de JSX. A conta refeita com um inventário próprio
(`scratchpad/inventario4.mjs`, o método está abaixo) deu **1.585**.

**Medido em 24/09/2026: faltam 320, em 59 arquivos.** (`/notificacoes` saiu da lista.)

⚠️⚠️ **E ESTE NÚMERO SUBSTITUI OS ANTERIORES, porque a rede era cega.** A
regra do inventário que pega texto solto de JSX barrava `\n` dentro do
texto, e por isso não via NENHUMA frase que o editor tivesse quebrado em
duas linhas — que é toda frase de tela um pouco longa, já que o JSX
começa recuado. Três arquivos estavam fora da lista inteiros
(`documento`, `planos`, `suspenso`) e outros seis vinham com menos
frases do que têm.

⚠️ **O `\n` não podia simplesmente sair.** Sem ele o casamento atravessa
o arquivo do primeiro `=>` até o próximo `<`, e a tabela de alimentos
vira "frase de tela": o teste deu 410 frases, quase todas rótulos
nutricionais. A saída foi uma segunda regra, estreita — exige a etiqueta
de fechamento e nenhum `<`, `>`, `{` ou `}` nas linhas do meio. Texto
misturado com interpolação em várias linhas continua invisível, e é o
preço de não ter falso positivo. (Eram 1.150 em 94
quando este item nasceu; a conta é refeita a cada lote com
`node scripts/inventario-textos.mjs <saída>`, e o número vai no commit
só depois de medido.)

⚠️ **E A ÁREA MÉDICA SE DIVIDE EM DUAS, decidido em 22/09/2026.** No
internacional fica só o que NÃO depende da rede parceira — e a divisão
não é por rota, é por qual campo do estado manda:

| campo | telas | onde vale |
| --- | --- | --- |
| `vinculo` (clínica parceira na plataforma) | `/conversa`, `/clinica`, `/especialista`, `/prescricao` | **BR** |
| `profile.doctor` / `temAcompanhamento` (o médico dela) | `/consultas`, `/anotar-consulta`, `/consulta`, `/medico`, `/protocolos` | todo mercado |

⚠️ **O NOME DA TELA ENGANA.** `/medico` soa parceiro e não é: ela abre
por `temAcompanhamento`, verdade para quem anotou o próprio médico. E
`/protocolos` é linkada da JORNADA, sem trava nenhuma, com a linha de
cima já traduzida.

⚠️ **E "não traduzir" não basta sozinho.** Tela alcançável em alemão com
texto em português é pior do que tela que não existe. As quatro de
parceiro se apagam pelo DADO — sem plataforma não há `msg`, `clinic`,
`responsavel` nem `prescriptions` —, que é o tipo certo de trava:
`temRedeParceira()` só guarda três pontos hoje (um cartão do Cuidado e
dois ramos de assinatura), e nenhum deles é uma destas telas.

⚠️ **`/companion` (46 frases) FICA DE FORA DA FILA, por decisão de
produto: a tela vai ser refeita.** Extrair agora seria escrever 46 chaves
× cinco idiomas para um texto que muda inteiro. O que ela tem de pior não
é o texto de todo jeito: `companionReply` casa a pergunta por
PALAVRA-CHAVE EM PORTUGUÊS — `has('evolu', 'progress', 'como estou')` —, e
por isso a conversa cai no ramo genérico em qualquer outro idioma. É um
problema de arquitetura, não de catálogo, e some com a tela nova.

⚠️ E O NÚMERO SUBIU DEPOIS DE CAIR, de propósito. Ele tinha chegado a
1.015 com a varredura antiga, que só achava literal com cara de
português. Quem reclamou foi a tela: "na tela de sexo em inglês, as opções
estão em português" — "Feminino", "Masculino", "Outro" estavam em duro, e
nenhuma das três tem acento nem palavra que a heurística reconhecesse.

A regra 3 entrou por causa disso: **texto passado como propriedade de JSX
é fala, por definição**, sem teste de aparência. O total pulou de 1.015
para 1.132, e as 117 novas não são regressão — são o que a rede não via.

| onde | frases | arquivos | o que é |
|---|---|---|---|
| `src/app/` | 1.059 | 75 | as telas |
| `src/logic/` | 68 | 12 | ver abaixo — a maioria não é texto |
| `src/ui/` | 20 | 6 | o que sobrou dos componentes |
| `src/theme.ts` | 3 | 1 | nome de paleta |

Fora da conta, de propósito: `logic/alimentos*` (nome de comida é dado),
`logic/documentos` (minuta jurídica) e `logic/seed` (a semente de
demonstração).

### `src/logic/` está pronto, e as 45 que sobraram não são texto

A varredura ainda as acusa, e cada uma tem razão para ficar:

- **31 em `logic/local.ts`** — "março", "sáb", "janv.", `${d} de
  ${PT.mesLongo[m]}`. São as tabelas de formato do próprio motor de
  idioma, e crescem a cada local novo. Mandá-las para o catálogo seria
  circular: é o local que escolhe o catálogo.
- **2 em `logic/escalas.ts`** — 'alta', 'média' e 'baixa' ficaram
  **gravadas** em toda refeição registrada antes de o grama existir.
  Traduzir apagaria a proteína dessas refeições.
- **4 em `logic/restricoes.ts`** — 'Peixes e frutos do mar' e as outras
  prateleiras são casadas com `a.onde` da tabela de alimentos, por
  `includes`. Nunca vão para a tela. Saem junto com o item 18.
- **'Triglicerídeos' e as rotas `/marcador?m=peso`** — chave de exame e
  rota. Família do item 17.
- **O resto** são ids (`peso-${cur.t}`, `ant:agua:${…}`), nome de arquivo
  exportado, e composições só de número e unidade — mais alguns pedaços
  de código que o contador parte no meio de um `>=`.

### A receita, que está provada

Ela funcionou em cinco lotes seguidos e não tem surpresa:

1. **Um domínio por assunto** em `src/textos/pt-BR/`, com os comentários
   do código vindo junto — a justificativa é fato sobre a mensagem.
2. **O mesmo arquivo em `en-US/`**, com só as notas do que o inglês faz
   diferente. O `tsc` cobra a assinatura idêntica, de graça.
3. **Toda tabela que lê o catálogo vira função.** Constante de módulo é
   avaliada no import e congela o idioma. O `tsc` acusa os sítios de
   chamada, porque indexar uma função é erro de tipo.
4. **A rede decide.** `scripts/congelar.ts` tem de sair com os cinco
   cenários em português **idênticos**; os dois `-en-US` mudam onde a
   extração alcançou. Qualquer movimento no português é erro de extração,
   e não melhoria de texto — melhoria de texto é outro commit.

### ⚠️⚠️ O QUE A PESSOA VÊ NÃO É O QUE A VARREDURA CONTA

Medido em 22/09/2026, com o aplicativo em **alemão**, pela rede de telas:
**87 telas varridas, 47 delas com português na tela, 430 linhas.**

E as 430 não são uma coisa só. Separadas por NATUREZA, e não por arquivo:

| | linhas | o que é | dá para traduzir? |
|---|---:|---|---|
| os documentos | **131** | termos e privacidade | ❌ é minuta jurídica |
| a tabela de comida | **53** | nome de alimento, tabela da Unicamp | ❌ é dado de mercado |
| a personagem da semente | **40** | Dra. Helena Costa, CRM-SP, São Paulo | ❌ ver item 27 |
| **as telas** | **206** | o item 19 de verdade | ✅ |

**Mais da metade do que a pessoa vê não é trabalho de tradução.** São
decisões de mercado: uma minuta que precisa de advogado naquele país, uma
tabela de alimentos daquele país, e uma clínica de demonstração daquele
país. Terminar a peça 2 inteira resolve 206 das 430 linhas — menos da
metade —, e é bom saber disso antes de prometer que "falta só traduzir".

As telas com mais linhas, em ordem: `/alimentacao` (26),
`/marcador` (15), `/ajuda` (13), `/jornada` (12), `/biblioteca` (9),
`/exercicio` (9), `/aplicacoes` (8), `/exportar` (8), `/insights` (8).

### O que a rede NÃO cobre, e o que fazer com isso

`congelar.ts` chama funções de `logic/`. As telas não passam por ela: não
há como provar que uma tela não mudou sem abri-la. Para os ~970 de
`src/app/` e `src/ui/`, a conferência é outra — abrir a tela no navegador
antes e depois e comparar o texto renderizado. É mais lento e é o que
existe.

⚠️⚠️ **E A REDE MENTE POR OMISSÃO, o que é pior do que não existir.** Os
sete cenários não produzem uma única frase que contenha o nome do
recipiente — "caneta" aparece na saída só como nome de cenário e como
chave `canetaAtual`. A migração inteira da concordância passou por ela
com "idêntico" sem ter sido testada em nada.

Antes de confiar num "idêntico", confira se a rede chega no que você
mexeu: `grep` a saída pela frase que deveria ter mudado. Quando não
chegar, a mudança precisa da rede dela — foi assim que nasceu
`scripts/gramatica.ts` (as seis funções × quatro formas × dois idiomas),
e o português que ele imprime foi conferido contra a implementação antiga
tirada do `git show`, e não de memória.

### O que já apareceu no caminho

- **Um bloco morto de texto clínico**, em `logic/escalas`: as nove réguas
  de sintoma inteiras, numa cópia que a extração anterior deixou para
  trás e que ninguém chamava. Constante não usada compila.
- **A rede dava alarme falso.** Duas execuções do mesmo código devolviam
  marcos trocados de lugar — o `sort` da linha do tempo ordenava só por
  instante. Consertado com desempate por título.
- **O momento da refeição é chave e rótulo ao mesmo tempo** — "Almoço" é
  o que fica gravado. Mesma família do item 17.
- **Cinco telas perguntavam o gênero gramatical direto**, e duas pelo pior
  caminho possível: `umOutro(forma, true) === 'Outra' ? 'Nova' : 'Novo'`.
  É uma sonda de gênero por comparação de string, e quebra calada no
  primeiro idioma cujo "outro" não se escreve "Outra". As cinco passam a
  chamar `concordar`, e `.genero` não sai mais do catálogo.
- **Sete cópias do vetor de dias da semana**, seis já recolhidas em
  `DOW_PT` e a sétima escondida dentro de `alertas.quando`.
- **Duas chaves escritas e nunca ligadas** — o que a Garmin e a Withings
  trazem. Escrever o catálogo não liga o texto; é preciso ir na linha.
- **A barra de abas estava em português nos cinco idiomas.** Quatro
  palavras embaixo de toda tela do aplicativo — Home, Jornada, Cuidado,
  Insights —, numa constante de módulo de `ui/TabBar`. Ver o item 28:
  nenhuma rede estática podia vê-la.
- **Um número que o aplicativo anunciava e não tinha.** A tela de
  exportar contava "15 coletas" somando os VALORES de cada marcador —
  três datas de HbA1c são três valores da mesma coleta. A conta estava
  certa, a palavra não: virou "resultados".
- **Duas linhas do mesmo cartão com o mesmo nome**, separadas por um
  artigo: "Resumo para a consulta" (a conversa) e "Resumo para consulta"
  (o documento). Em português já confundia; em francês e em alemão
  sairia a mesma frase duas vezes. Traduzir sem olhar teria multiplicado
  a colisão por cinco.
- **"MORPHI OBSERVOU"** — o único lugar do aplicativo em que o nome do
  produto tinha verbo pendurado nele. O cabeçalho do companion já traz a
  regra escrita, e o cartão vizinho já trazia a forma certa ("A
  DESCOBERTA DA SEMANA"). Virou "O QUE OBSERVAMOS".
- **Um chapéu em duro no meio de dois que já vinham do catálogo.**
  `descobertas.ts` monta três tipos de cartão, e dois liam
  `chapeuAntecipacao` e `chapeuConvite`; o terceiro dizia
  `chapeu: 'DESCOBERTA'`. A Home em alemão abria com a palavra em
  português a três linhas de um cartão inteiramente traduzido — e o
  vizinho errado é mais difícil de ver do que o arquivo errado.
- **"min" escrito duas vezes em `derive`**, enquanto o alemão escrevia
  "Min." em cinco chaves do catálogo. A mesma barra de meta mostrava
  "60 min" no topo e "Noch 60 Min." embaixo.
- **`DOW_PT`, um nome que mente.** O sufixo sobrou de quando a tabela era
  um vetor literal; hoje ela lê o formato do local. Quem procurasse os
  dias da semana e achasse isso concluiria que os outros idiomas não têm
  e escreveria o oitavo vetor. Virou `diasDaSemana`.
- **`home.tela` era a JORNADA.** Num módulo chamado `home`, "tela" só
  podia ser uma coisa, e era a outra. Virou `telaJornada`, e a Home
  nasceu como `telaInicio`.
- **Uma quebra de linha à mão em "Gordura / corporal"**, decidida pela
  largura do card em português. "Körperfett" é uma palavra só, e o `\n`
  partiria o que não se parte. O alinhamento pelo pé, que era o motivo
  dela, já vinha do `marginTop: 'auto'` logo abaixo.
- **A linha do idioma, no Perfil, era um ternário de DUAS saídas** —
  inglês, ou "Português · Brasil" — para cinco idiomas e dezenas de
  países. Em alemão ela dizia "Português · Brasil" logo abaixo da palavra
  "Sprache". Agora repete o que a tela do outro lado mostra, com os nomes
  vindo de `NOME_DO_LOCAL` e `NOME_DO_PAIS`.
- **Um "kg" literal ao lado de `kgTxt`, no Plano.** `kgTxt` devolve o
  número em quilo sem converter, e a unidade estava escrita em duro ao
  lado — quem lê em libra via o número certo com a unidade errada, em
  quatro lugares da mesma tela. O sistema dela estava a uma variável de
  distância, já usado na ressalva logo abaixo.
- **Duas frases do Plano assumiam caneta** — "A caneta tira a fome",
  "Quando você souber a caneta" —, e há frasco, seringa e cartela.
  Nenhuma das duas precisava do recipiente para dizer o que diz.
- **Um plural francês errado que só a tela mostra:** `p(a, 'poids')`
  devolvia "10 poidss". O helper aceita o plural explícito e o autor o
  usou em "repas" e esqueceu em "poids". ⚠️ O alemão não pode ter esse
  defeito: lá o plural é **obrigatório** no helper, e quem esquece leva
  erro de compilação em vez de palavra errada na tela. É a diferença
  entre um padrão que perdoa e um que cobra.
- **O catálogo ganhou o 32º módulo**, `perfil`. Ele não cabia em nenhum
  dos 31: não é cadastro, não é ajuste de medida, não é aviso.
- **"Doses na caneta", no Cuidado**, com frasco, seringa e cartela do
  outro lado. `formas.noNa` já sabia concordar — faltava chamá-lo.
- **"o app avisa quando ela chegar perto"**, no convite de anotar
  consulta. O aplicativo não fala de si em terceira pessoa, e a linha
  gêmea na Home já dizia certo: "para avisarmos quando ela chegar perto".
- **Uma pergunta escrita dentro de uma URL:**
  `/companion?q=Prepare%20minha%20consulta`, em português e com %20 no
  meio, enquanto `rotina.perguntas` já a guardava nos cinco idiomas. É a
  terceira pergunta que aparece assim — as duas primeiras estavam em
  Insights.
- **Mais um `.toLowerCase()` numa tela**, no diário de bebidas: em
  alemão ele escreveria "kaffee" e "milch". Abaixar a caixa é regra de
  idioma, e por isso mora em `comum.noMeio`, que no alemão devolve o
  que recebe.
- **Uma constante de módulo com recuo escrito**, em Privacidade:
  `const APP_DE_SAUDE = aparelhoDaVez()?.nome ?? 'aplicativo de saúde do
  celular'`. Congelava duas coisas de uma vez — o idioma do recuo e o
  nome do depósito de saúde, que muda com o aparelho. É a família do
  item 28, com a agravante de a rede também não a ver.
- **"o app lê as pesagens... Ele só lê"**, na tela de privacidade. Duas
  vezes o aplicativo falando de si em terceira pessoa, e justamente na
  tela cuja pergunta é quem faz o quê. Quem lê somos nós.
- **"O que o Morphi é, o que não é"** — verbo pendurado no nome do
  produto, no subtítulo dos Termos. Virou "O que somos, o que não somos".
- **Um particípio com gênero:** "Onde você é atendida" concordava com uma
  leitora, e a tela não sabe o gênero de quem lê. A frase foi reescrita
  para não precisar saber — o francês teria o mesmo problema em
  "suivie", e o alemão em "du bist es, die...".
- **Um nome próprio depois de preposição alemã.** "wir schreiben nie
  etwas in ${app}" fica certo com "Apple Health" e errado com o recuo
  genérico, que pede artigo: "in **die** Gesundheits-App". Como o valor
  pode ser um nome ou um substantivo, não há artigo que sirva sempre — o
  alemão reconstrói a frase sem a preposição, que é a mesma saída de
  `rotina.empurroes.aplicacao`.
- **Mais duas constantes de módulo com rótulo literal**, as duas quintas
  cópias: `SEXO` em /dados (as quatro respostas de identidade, que
  `cadastro` já tinha) e `SELO` em /semana (os sete tipos de evento no
  singular). Ver o item 28 — e reparar que já são quatro achados da mesma
  família, encontrados sempre pela tela e nunca pela rede.
- **As aspas da citação são de cada idioma:** “ ” no português, „ “ no
  alemão, « » no francês e no espanhol. Escritas na tela, a nota de quem
  lê em alemão saía com aspas inglesas.
- **Mais dois particípios franceses com gênero** — "Ce qui vous a
  amenée" e "Comment vous vous êtes senti" —, os dois nascidos na
  tradução e não no português. É a armadilha que se repete: uma frase
  neutra em português vira gendrada em francês sem ninguém decidir isso.
- **`concordar` RECEBIA AS DUAS GRAFIAS EM PORTUGUÊS.** A tela do
  recipiente escrevia `concordar(forma, 'aberto', 'aberta')` — os dois
  candidatos no sítio de chamada —, e em alemão isso devolvia "aberto" ou
  "aberta": português dos dois jeitos, sete vezes na mesma tela. A função
  continua fazendo o trabalho dela; o que mudou é de onde saem os
  candidatos. Onde o idioma não flexiona, os dois são a mesma palavra.
- **"encerrada" no feminino fixo**, num histórico que também lista frasco
  e blíster.
- **Uma quarta constante de módulo com rótulo literal:** `SENTIR` em
  /sintomas, os quatro apelidos curtos dos indicadores.
- **E a quinta e a sexta:** `REGIOES` e `LADOS` em /aplicacao — a forma
  PARTIDA dos seis locais de `tratamento.locais`. O padrão está fechado:
  **toda tela que apresenta uma tabela de opções tem uma dessas**, e vale
  procurá-las de propósito nas que faltam em vez de esperar que a
  varredura em alemão tropece nelas.
- **A DÉCIMA:** `TIPOS` em /anotar-consulta — Presencial, Teleconsulta e
  Retorno. Estas são chave E rótulo: é o que fica gravado em
  `S.consult.type`, mesma família do momento da refeição.
- **A sétima, a oitava e a nona foram CÓPIAS DE TABELAS QUE JÁ ESTAVAM NO
  CATÁLOGO:** `CIRC` e `PERIODOS` em /evolucao (as quatro
  circunferências de `medidas.corpo` e os três períodos de
  `medidas.tela`) e `VEREDITO` em /resumo-medico (os três selos de
  `exames.tela`). Nove no total, em nove telas — e a cópia é sempre a que
  fica em português nos cinco idiomas, porque a original já tinha sido
  traduzida.
- **Mais dois ordinais de idioma:** "3ª dose" em /aplicacao e "no 3º dia
  depois" em /sintomas. O sufixo não é o mesmo em nenhum par de idiomas —
  "3ª", "3.", "3rd", "3e" — e não há concatenação que sirva.
- **⚠️⚠️ "MUITA FÓSFORO", EM PORTUGUÊS, NA TELA DE HOJE.** A tela do
  alimento escrevia `Muita ${nutriente}` com o "Muita" fixo, e cinco dos
  onze nutrientes da tabela são masculinos: cálcio, ferro, magnésio,
  zinco e fósforo. É um defeito de português que estava publicado, e só
  a tradução foi olhar — a frase inteira passou a vir do catálogo, uma
  por nutriente, com a chave em português porque é ela que está gravada
  em `logic/alimentos`.
- **Duas réguas para a mesma pergunta.** /medir-refeicao tinha a sua
  própria conta do momento sugerido — `hora < 10 ? Café da manhã : …` —,
  com os quatro nomes em duro e com CORTES DIFERENTES dos de
  `momentoDaHora`, que é a régua do resto do aplicativo. Divergiam em três
  horas do dia: 10h, 18h e 23h. O momento é chave e rótulo ao mesmo tempo
  (é ele que fica gravado na refeição), então duas réguas eram duas
  verdades sobre o mesmo registro.
- **Dois particípios que só aparecem no recipiente errado:** o francês
  "La plaquette expire avant d'être **fini**" e o alemão "läuft ab, bevor
  **er** leer ist". Os dois nasceram na tradução, e os dois só se veem
  com um recipiente que a semente não usa — foram achados rodando as
  quatro formas fora da tela, e não olhando o aplicativo.
- **⚠️⚠️ E UM DEFEITO QUE NÃO ERA DE TEXTO.** `timelineCounts` fazia
  `Object.keys(TL_LABEL)` **sem os parênteses**. `TL_LABEL` virou função
  quando os rótulos saíram para o catálogo, e as chaves próprias de uma
  função são nenhuma: a contagem voltava vazia e os **sete chips de
  filtro sumiram** de /historico e da linha do tempo da Jornada. O `as
  TLKind[]` calou o compilador. Um filtro que não aparece não parece
  defeito — parece decisão de produto.

- **⚠️⚠️ A REDE DA ESPAÇA FINA ESCREVIA DENTRO DO CÓDIGO.**
  `espaco-fino.mjs` punha a fina antes de `?` e `:` varrendo o conteúdo
  de cada literal — e o conteúdo de um template inclui `${ … }`, que é
  EXPRESSÃO e não texto. Estava em 19 arquivos do francês:
  `${dias === 1 ? 'jour' : 'jours'}` ficava com a fina colada no ternário,
  invisível, no lugar da espaça normal que ela comia. U+202F é espaço de
  verdade para o ECMAScript, então o `tsc` passava, o aplicativo rodava e
  nada acusava — era o CONSERTO escrevendo lixo no código que ele só devia
  atravessar. A varredura por expressão regular virou um analisador: texto
  é texto, `${ … }` é expressão, e template dentro de expressão volta a
  ser texto. Setenta e quatro literais consertados, e a fina de texto
  (`plus long : ${dias}`) segue onde deve. ⚠️ O `congelar.ts` não tinha
  como vê-lo — ele só roda pt-BR e en-US (item 24, quarta cegueira).
- **"1 de 1 semanas", nos cinco idiomas.** A leitura do ritmo escrevia o
  nome da semana sempre no plural, e a primeira semana de tratamento é
  exatamente o caso de "1 de 1". ⚠️ E o número que manda não é o mesmo em
  toda parte: em francês o nome vem depois de `aplicadas`
  ("1 semaine sur 3"), e nos outros quatro depois de `vividas`. Achado
  chamando a função fora da tela — a semente está na semana onze, e
  nenhuma tela mostra esse ramo.

- **AS ASPAS ESTAVAM ESCRITAS EM DOIS MÓDULOS.** `escalas` e `home`
  tinham a mesma `citacao` letra por letra, nos cinco idiomas, e a tela
  da consulta passada ia escrever a terceira cópia. Aspa é regra de
  idioma e não de tela — “ ” no português e no inglês, « » no francês com
  espaça, «» no espanhol sem, „ “ no alemão. Mora em `comum.citacao`, e
  as duas cópias saíram.
- **"o número que ELA definiu na consulta"**, na área médica. O
  aplicativo não sabe o gênero de quem acompanha: a semente tem uma
  médica, e o médico de quem usa pode ser qualquer pessoa. Mesma família
  dos particípios do francês — a frase foi reescrita para não precisar
  saber.
- **Dois rótulos que eram o NOME DA TELA DO OUTRO LADO.** Os quatro
  atalhos de `/medico` escreviam "Consultas" e "Protocolos" à mão, e os
  dois já estavam no catálogo como título das telas que eles abrem. Agora
  são lidos de lá: a porta e a sala não têm como divergir.
- **Uma frase que a lista de âncoras deixou passar** — a ressalva das
  duas metas de peso, num ramo que só aparece quando o número da equipe
  discorda do de quem usa. Achada lendo a tela em alemão. O inventário é
  a rede; a lista de âncoras é só a intenção, e as duas precisam ser
  conferidas uma contra a outra no fim de cada leva.

- **⚠️ O VAZIO DOS LEMBRETES NOMEAVA QUATRO ASSUNTOS, E SÃO CINCO.**
  "Dose, pesagem, hidratação e proteína" foi escrito quando o check-in
  ainda não era um alerta, e a frase não acompanhou — a tela oferece
  cinco e a frase promete quatro, em português, hoje. É a mesma família
  das tabelas copiadas: uma lista escrita à mão ao lado da lista de
  verdade. Agora ela vem de `ORDEM`, e um sexto assunto entra sozinho.
- **As três modalidades de força escritas à mão**, em /treino:
  "musculação, pilates e funcional é que contam", ao lado de
  `MODALIDADES()`, que já sabe quais são pelo campo `forca`. Em alemão
  sairiam os três nomes em português; em qualquer idioma, uma quarta
  modalidade de força não entraria na frase.
- **E o "min" de novo, duas vezes na mesma tela.** `telaExercicio.unidadeMin`
  nasceu para isto — o alemão escreve "Min." na prosa — e /treino escrevia
  "min" ao lado do número grande e outra vez na consequência do apagar.
  A chave existir não basta: é preciso ir na linha.

- **⚠️⚠️ A REDE DO INVENTÁRIO NÃO VIA FRASE QUEBRADA EM DUAS LINHAS.** É
  a rede que responde "a tela zerou", e ela podia mentir: duas frases
  desta leva foram achadas lendo o aplicativo em alemão, e não pela
  lista. Ver o item 19 — o número faltando era 13 frases maior, e três
  arquivos estavam fora da lista inteiros.
- **O botão do Ciclo dizia "Registrar aplicação" em duro**, e quem toma
  comprimido não aplica nada. A tela de registrar já monta o próprio
  título com a palavra de `formas.palavras`; aqui era a cópia escrita à
  mão, parada em "aplicação" para os quatro recipientes. Agora sai
  "Einnahme eintragen" para quem toma cartela.
- **"Nível X de Y" tinha duas cópias** — o cartão da grade de conquistas
  e o cabeçalho da folha de /trilha. Uma chave, duas telas.
- **Mais uma quebra de linha escrita no JSX:** `depois${'\n'}da
  aplicação`, no Ciclo. A largura é a do português.

- **⚠️⚠️ A DÉCIMA PRIMEIRA CONSTANTE DE MÓDULO, e a quarta que era CÓPIA
  DE TABELA QUE JÁ ESTAVA NO CATÁLOGO:** `TIPOS` em /medir-exercicio, com
  as dez modalidades escritas e os dez ícones. `MODALIDADES()`, em
  `logic/modalidades`, tem os mesmos dez nomes e os mesmos dez ícones — e
  aquele arquivo existe justamente para ser o único lugar onde a tabela
  mora. Até o desenho que o comentário da tela explicava (musculação na
  barra, não no halter) já estava explicado lá. A cópia é sempre a que
  fica em português nos cinco idiomas.
- **E o `.toLowerCase()` da mesma tela saiu junto** — um dos oito do item
  32. Em alemão ele escrevia "schwimmen" onde o catálogo escreve
  "Schwimmen".
- **O "min" aparecia SEIS VEZES em /medir-exercicio** — no total do dia,
  na métrica da duração, nas duas pontas do slider, nos quatro atalhos e
  no botão. `telaExercicio.unidadeMin` já existia.
- **Dois selos para a mesma palavra**, em /dia: "feita" para a aplicação
  e "feito" para o check-in e o peso. Em alemão os dois são "erledigt" —
  a escolha é do catálogo, e não da tela.
- **⚠️ E O SERVIDOR DE DESENVOLVIMENTO NÃO SOBREVIVE A `git stash` NO
  `src`.** O ciclo de esconder e devolver a árvore quebra o grafo de
  módulos do Metro, e o aplicativo abre EM BRANCO — sem erro no console
  e sem erro no log do servidor. Duas telas pareceram quebradas por isso
  nesta leva, e as duas estavam certas. Quem for fazer a conferência do
  `congelar.ts` no meio de uma leva precisa reiniciar o servidor depois.

- **⚠️⚠️ UMA FOLHA DESENHADA DENTRO DE UMA TELA EMPURRADA**, em /idioma:
  abria com uma sombra por cima e nada atrás. `SheetScreen` pinta o
  próprio scrim e conta com a apresentação `transparentModal` para que o
  scrim tenha o que escurecer; a irmã dela, /unidades, está na lista dos
  modais do layout, e /idioma ficou de fora, encostada no `checkin`.
  Empurrada como tela e desenhada como folha, o scrim cobria a própria
  página. ⚠️ **Vale procurar o inverso também** — tela desenhada como
  tela dentro de `transparentModal` —, porque a lista de modais é escrita
  à mão e nada liga uma ponta na outra.
- **⚠️ LEITURA DE MÓDULO NÃO RE-RENDERIZA NADA.** A mesma tela mostrava o
  país numa linha e o valor vinha de `paisAtual()`: escolher Portugal na
  folha gravava certo no perfil e a linha continuava dizendo "Brasil",
  porque a tela de trás nunca re-renderizava. Com o IDIOMA o defeito não
  apareceria — trocá-lo remonta a árvore inteira pelo `key` da Moldura —,
  e é exatamente por isso que ele passaria despercebido. Toda tela que
  mostra `localAtual()`/`paisAtual()`/`formaDe()` e fica montada atrás de
  uma folha precisa assinar `S`.

- **⚠️⚠️ A TERCEIRA CEGUEIRA DO INVENTÁRIO: PALAVRA PORTUGUESA SEM
  ACENTO.** A regra do texto solto de JSX passa pelo `PT`, que é uma
  heurística de APARÊNCIA — ela pede um acento ou uma palavra de uma
  lista curta. "Pronto", no botão de /registro-ok, não tem nenhum dos
  dois, e por isso aquele arquivo NÃO APARECE no inventário: zero frases,
  com um botão em português no meio de uma tela alemã. O comentário do
  próprio script já reconhece o buraco para as PROPRIEDADES, e foi por
  isso que a regra 3 nasceu sem o `PT`; o texto solto continuou com ele.
  ⚠️ A saída provável é tirar o `PT` das regras 2 e 2b também — texto
  entre etiquetas é quase sempre cópia de tela —, mas isso precisa ser
  MEDIDO antes: é o mesmo tipo de mudança que, na cegueira anterior,
  inflou o inventário para 410 com rótulo de sorvete.
- **O cabeçalho da folha rolava junto com o conteúdo.** Numa folha curta
  ninguém via; na lista de cento e onze países, rolar levava embora o
  título E o botão de fechar. O pé da folha já era fixo pelo mesmo
  motivo; o topo só não era por descuido.

- **⚠️⚠️ A TABELA DE PAÍSES TINHA 111 E O MUNDO TEM MAIS.** Quando o
  aparelho dizia uma região que não estava nela, `paisDoAparelho`
  devolvia `null` e `paisAtual()` caía no `PADRAO` — quem abrisse na
  Albânia via "Brasil" pré-selecionado, não achava a Albânia na lista
  para corrigir, e ainda ganhava o convite de clínica parceira, porque
  `temRedeParceira` pergunta `pais === 'BR'`. Agora são 243. ⚠️ Fica a
  pergunta que a tabela cheia levanta: `moedaDe` cai em dólar para quem
  não está em `MOEDAS` nem no euro, e a tabela de preços é uma só, em
  reais — um albanês via "R$ 24,92" (símbolo certo, preço certo) e passa
  a ver "$24,92" (símbolo errado sobre um preço em real). Não é regressão
  nova: Nigéria, Quênia, Índia e Turquia já estavam na tabela e já caíam
  assim. É o item do preço por mercado, que já está aqui.
- **E `CORTES_ASIA` não acompanhou.** Laos, Brunei, Butão e Maldivas
  entraram na tabela e não entraram na lista dos cortes de IMC
  Ásia-Pacífico — nem o Timor-Leste, que já estava na tabela antes. Não
  mexi: o corte é decisão clínica, e o comportamento deles não mudou
  (caíam em `oms` pelo `PADRAO` e continuam em `oms`). Mas agora a falta
  é visível, e é uma pergunta para quem decide a régua.

- **O país passou a se escrever no idioma do aplicativo**, e a mudança
  apagou um problema inteiro. Enquanto cada país se escrevia no PRÓPRIO
  idioma, cada nome era três decisões — qual língua num país multilíngue,
  qual escrita, forma curta ou oficial —, e o CLDR erra as três sozinho.
  No idioma do aplicativo não sobra decisão nenhuma. ⚠️ A regra continua
  valendo para a lista de IDIOMAS, e por motivo oposto: quem está perdido
  numa língua que não lê procura "Deutsch", e "Alemão" não ajuda.
- **⚠️ E A TABELA É GERADA, E NÃO RESOLVIDA NO APARELHO.** O aplicativo
  não usa `Intl` em tempo de execução em lugar nenhum — `logic/local`
  escreve data e número com tabelas próprias —, não há polyfill
  instalado, e o Hermes não garante `Intl.DisplayNames`. Resolver o nome
  no aparelho seria apostar num motor que pode não ter a peça, e a aposta
  só se perde no aparelho de alguém. `scripts/nomes-de-pais.mjs` gera
  `logic/paisesNomes`, e rodá-lo duas vezes não muda nada — se mudar, o
  diff é a resposta.

- **O corte de IMC deixou de ser decisão do país**, por decisão de
  produto: o país é proxy fraco de ascendência — um nipo-brasileiro em
  São Paulo recebia o corte da OMS e um inglês em Singapura recebia o
  asiático —, perguntar ascendência está fora por ser dado sensível para
  ganho marginal, e o foco do produto é ocidental. Fica uma régua, a da
  OMS. ⚠️ O que o corte antigo sabia NÃO foi apagado: está escrito no alto
  de `logic/pais`, com o custo dito em voz alta, para ninguém
  redescobrir o problema e resolvê-lo sem saber que ele foi pensado.
- **E com isso o país decide menos.** Medi: 243 países produziam 8
  comportamentos distintos, e cinco dos oito se distinguiam só pelo
  símbolo da moeda. Sem o corte de IMC são 3 — Brasil, Estados Unidos e o
  resto —, e o que os separa é a tabela de alimentos e a ordem dos
  medicamentos. A moeda sai quando o preço vier da loja, que é quem sabe
  o país de cobrança.

- **⚠️⚠️ A PERGUNTA DO PAÍS SAIU DO APLICATIVO**, do cadastro e do perfil,
  por decisão de produto em 22/09/2026. O que ela decide se resolve em
  DOIS BOOLEANOS — "é Brasil?" para a rede parceira e "é Estados Unidos?"
  para a tabela de alimentos, já que só existem duas tabelas —, e a
  região do aparelho responde os dois com precisão alta. Medido antes de
  tirar: 243 países davam 8 comportamentos, cinco deles distintos só pelo
  símbolo da moeda; sem o corte de IMC sobraram 3. ⚠️ **O custo está dito
  no alto de `logic/pais` e é real: quem tiver a região do telefone
  diferente de onde se trata fica no balde errado e NÃO TEM COMO
  ARRUMAR** — um brasileiro com telefone em outra região não vê o convite
  de clínica parceira.
- **E nada do país é guardado no perfil.** O `_layout` devolvia
  `profile.pais` no arranque, o que fazia sentido quando havia escolha.
  Sem escolha, isso congelaria um palpite velho: quem trocasse a região
  do telefone ficaria no país anterior para sempre. A fonte passa a ser o
  aparelho, lido a cada arranque.
- **Morreram junto**, e foram apagados: `logic/paisesNomes` (243 × 5
  nomes, gerado ontem), `scripts/nomes-de-pais.mjs`, `nomeDoPais`,
  `paisesOrdenados`, `trocarPais` e o `scrollRef` do `SheetScreen` — que
  existia só para a folha de 243 linhas abrir no valor certo. A lista de
  CÓDIGOS fica: é ela que impede uma região desconhecida de virar Brasil.

- **E a tela do idioma saiu junto.** Ela existia porque a pergunta eram
  DUAS; com uma, o título dela e a sua única linha diziam a mesma palavra
  — "Idioma" em cima de "Idioma". A linha do Perfil passa a abrir a folha
  direto, como as unidades, que são o ajuste irmão logo abaixo e são
  folha desde sempre. Um toque a menos e um arquivo a menos, e a ressalva
  desceu para depois da lista, onde ela responde o que a lista provoca.

- **⚠️⚠️ A TRADUÇÃO SAIU COM SOTAQUE, e a causa é o método.** Eu traduzi
  chave a chave a partir do português: isso otimiza paridade e fidelidade,
  que eram as redes que existiam, e produz inglês que soa português
  traduzido. O catálogo empurra para isso — as chaves têm nome em
  português e a estrutura é a da frase original, então a unidade de
  trabalho virou "esta frase portuguesa" e não "o que um aplicativo
  inglês diz aqui". ⚠️ **Vale para os quatro idiomas**, não só o inglês:
  `es-419` tinha 19 "Ver el/la", `fr-FR` tinha 14 "Voir le/la". O alemão
  tem zero desse formato e vai ter os próprios.
- **⚠️⚠️ "I had a drink" ESTAVA NO BOTÃO DE REGISTRAR ÁGUA.** Em inglês
  isso é bebida alcoólica. Saiu de traduzir "Me hidratei" pela ESTRUTURA
  em vez de pelo sentido, e dizia para quem lê o contrário do que o
  aplicativo quer. É o pior tipo de sotaque: o que muda o significado.
- **E o aplicativo tem DOIS registros**, o que não estava escrito em lugar
  nenhum: a voz dele com a pessoa, e o `resumo`, que é escrito para o
  médico. "shot" pertence ao primeiro e "injection" ao segundo — por isso
  a varredura do inglês deixou `resumo.ts` de fora, junto com "injection
  site", que é o termo da etiqueta da própria caneta.

- **⚠️⚠️ EM ESPANHOL, "aplicación" ERA A INJEÇÃO E ERA O APLICATIVO.** O
  português não tem esse problema — "aplicação" e "aplicativo" são
  palavras diferentes —, e a tradução carregou a colisão sem ver. Ela
  aparecia numa frase só: "Peso, medidas, APLICACIONES... en el
  almacenamiento de la propia APLICACIÓN". E a Home dizia "La aplicación
  de ayer no está registrada", que se lê como "o APLICATIVO de ontem".
  Virou "inyección", que é o que se diz e não colide.
- **⚠️ E EU ERREI AO DIZER QUE ES E FR TINHAM O MESMO PROBLEMA DE SINTAXE
  DO INGLÊS.** Contei 19 "Ver el/la" e 14 "Voir le/la" e chamei de
  sotaque — mas "Ver el resumen" e "Voir le résumé" são espanhol e
  francês CORRETOS: essas línguas mantêm o artigo. Derrubá-lo era regra
  do inglês, e eu medi um padrão achando que era um defeito. O que sobrou
  de verdade nas outras três foi o VOCABULÁRIO.
- **Três armadilhas de troca por palavra, uma por idioma**, e as três só
  apareceram lendo o aplicativo: o artigo inglês ("an injection" → "an
  shot"), a elisão francesa ("l'injection" → "l'piqûre", que não é
  francês) e o elemento de ligação alemão ("Injektion" liga com -s- e
  "Spritze" com -n-: "Spritzestag" em vez de "Spritzentag"). ⚠️ E a CAIXA
  ALTA escapou nos quatro: "NEXT INJECTION", "NÄCHSTE INJEKTION",
  "PROCHAINE INJECTION", "PRÓXIMA APLICACIÓN" — é o cabeçalho do cartão
  da próxima dose, uma das primeiras coisas que se vê.

- **⚠️⚠️ "THE PERIOD" NA HOME EM INGLÊS.** "Levo o seu período organizado"
  virou "I'll bring the period organized" — calque, e num aplicativo
  usado sobretudo por mulheres "period" se lê como MENSTRUAÇÃO antes de
  se ler como intervalo de tempo. Mesma família do "I had a drink":
  tradução pela estrutura que muda o significado. Trocado onde a palavra
  encostava em sintoma ou corpo; na assinatura ela fica, porque ali é
  cobrança e não tem com o que se confundir.
- **⚠️ A PROSA É MUITO MAIOR DO QUE OS RÓTULOS, e é o que falta.** Medido:
  **1.364 frases de prosa, ~395 mil caracteres** nos quatro idiomas
  (en 327 · es 335 · fr 357 · de 345). Não é varredura, é reescrita — não
  se acha com grep como se achou "injection", e cada frase é uma decisão.
  ⚠️ A ordem certa NÃO é por volume, é por quanto se lê: `home` é diário,
  `leituras` e `cruzamentos` são os cartões de insight, e `aviso`,
  `ajuda` e `assinatura` se leem uma vez na vida.
- **E o inglês passou a divergir do português no check-in**, por decisão
  de produto: "Como foi o seu dia?" continua em português, e o inglês
  pergunta "How are you feeling today?". ⚠️ Vale reparar que a segunda é
  mais fiel ao que a tela FAZ — ela mede energia, fome, sono e humor, que
  é como a pessoa está, e não como o dia foi. O português talvez queira
  seguir.

- **⚠️ UMA UNIDADE CRAVADA NO TEXTO INGLÊS**, e é a única do catálogo:
  `cruzamentos.porque` diz "swings of **two to four pounds**", onde o
  português diz "um a dois quilos". A tradução converteu — o que foi bem
  pensado —, mas cravou: quem lê em inglês E usa métrico (Reino Unido,
  Irlanda, Austrália, Canadá, Índia) lê libra. ⚠️ Consertar de verdade
  exige a string virar FUNÇÃO da unidade nos cinco idiomas, com o
  chamador passando `sistemaDe(S)` — é mudança de assinatura, não de
  prosa, e por isso não entrou na leva do texto. Fica aqui.
- **"go get seen" contra "go to urgent care"**, nas leituras clínicas —
  dois registros para a mesma instrução, na tela que diz o que fazer
  quando algo dói. Virou "get checked out" nas quatro.
- **E dois idiomas portugueses que não dizem nada em inglês:** "the
  treatment runs with **one foot outside**" (com um pé fora) e "the
  effect **crosses the night**" (atravessa a noite). O leitor para para
  decifrar no meio de um cartão que devia ser lido de corrida.

## 🔴 20. O mundo cabe no mecanismo; cinco idiomas cabem na lista

A pergunta do idioma é o **primeiro passo do cadastro**, e o mecanismo
está inteiro:

- o aparelho é lido no arranque e entrega **idioma e país**;
- `IDIOMA_DO_PAIS`, em `logic/local.ts`, cobre cerca de **cem países** —
  Alemanha para alemão, Japão para japonês, Arábia Saudita para árabe;
- `idiomasOrdenados()` põe em cima o idioma do país de quem está lendo,
  com o idioma do SISTEMA ganhando do país quando os dois discordam;
- a resposta já chega marcada, e para quem a aposta acertou o passo custa
  um toque em "Continuar".

**E a lista mostra cinco idiomas: português, inglês, espanhol, francês e
alemão.** É o que existe de catálogo, e a lista não pode ser maior que
isso — `DISPONIVEIS` é do tipo `Local`, e `src/textos` declara
`Record<Local, Textos>`: acrescentar um idioma sem escrever o catálogo
dele **não compila**.

⚠️ **A PERGUNTA DO PAÍS SAIU** — do cadastro e do perfil. Ela existiu
entre o espanhol e esta revisão, e a razão de sair está no alto de
`logic/pais.ts`: 243 códigos davam 8 comportamentos, cinco deles
diferindo só na moeda, e a moeda já vem da loja em que a pessoa está
conectada. O que restava eram os cortes de IMC, e a decisão foi usar os
da OMS em todo mercado. `paisAtual()` hoje é o que o aparelho diz.

Essa trava é de propósito. Oferecer "Deutsch" e entregar português é a
porta emparedada mais cara do aplicativo, porque quem a abre não consegue
voltar — não sabe ler a tela para achar o caminho.

### O que falta para cada idioma novo

Por idioma, dois trabalhos, nesta ordem:

1. **Terminar a peça 2** (item 19). Enquanto 1.015 frases estiverem em
   código, todo idioma novo nasce com essas 1.015 em português. Fazer a
   tradução antes é traduzir duas vezes.
2. **Escrever `src/textos/<local>/`** — hoje **trinta** arquivos, e o `tsc`
   cobra a assinatura inteira. É o mesmo trabalho que o inglês custou.
   `node scripts/conferencia.mjs <local>` confere a forma arquivo a
   arquivo enquanto a tradução anda.

Depois disso, o idioma entra em `Local` e em `DISPONIVEIS`, e o mapa de
países já pronto o põe em cima para quem estiver naquele país.

### A ordem sugerida, se for por alcance

Espanhol ✅, francês ✅, alemão ✅, italiano ✅. **Depois o japonês.**
Árabe e hebraico pedem um trabalho a mais que os outros não pedem: o
aplicativo inteiro desenha da esquerda para a direita, e
`expo-localization` devolve `textDirection` justamente para isso — nada
no código lê esse campo hoje.

⚠️ **O ITALIANO NASCEU COM AS 347 FRASES DO ITEM 19 EM PORTUGUÊS**, como
os outros quatro. O caderno diz para terminar a extração antes de
traduzir, e a razão é de esforço e não de correção: as 347 entram nas
seis línguas juntas quando saírem do código. O italiano ficou simétrico
com os outros, não pior.

⚠️ **E AS TRÊS DECISÕES CLÍNICAS DELE ENTRAM NA MESMA FILA DE REVISÃO.**
No referto italiano as transaminases se chamam **AST** e **ALT** — como
nos Estados Unidos, e ao contrário do francês (ASAT/ALAT) e do alemão
(GOT/GPT) —, e o T4 livre se imprime **FT4**. Escrevi os três pela
literatura, e valem a mesma ressalva dos outros: se estiverem errados, a
pessoa não acha a própria linha no próprio exame.

### ⚠️⚠️ A PROSA DAS CINCO LÍNGUAS FOI ESCRITA POR MIM, E NÃO POR NATIVO

Os 32 módulos de inglês, espanhol, francês e alemão foram lidos frase a
frase **na própria língua, sem o português do lado** — e o método
importa: escrever com o original ao lado contamina, e eu provei isso
reintroduzindo um decalque duas horas depois de o ter corrigido.

O italiano nasceu depois dessa leitura, e por isso nasceu já com o que
ela ensinou: a metáfora do orçamento de caloria escrita por extenso
("le calorie del giorno"), o "sai pronto" nunca traduzido ao pé da
letra, e a dor de barriga sem o "única" que contradizia a própria tela
em três idiomas. As armadilhas que só ele tem estão escritas nos
arquivos dele — o apóstrofo de `un'altra`, as preposições articuladas,
o particípio que concorda em gênero E número, e o plural que não tem
regra única.

O que a leitura tirou, por classe, com exemplos:

- **Sentido invertido.** "sostener el estreñimiento" e "sostienen el
  hambre" (es), "tient le transit bloqué" (fr), "halten den Hunger"
  (de): em português segurar é conter, nas outras é manter de pé. As
  quatro frases diziam o contrário, e as quatro são conselho de saúde.
- **Palavra que já tem dono na língua.** "la regla del Recorrido" (es) é
  a menstruação; "the period" (en) idem; "referirte al especialista"
  (es) e "to refer to the clinician" (en) são encaminhar; "what crosses
  over to the other side" (en) é morrer; "le transit bloqué" (fr) é a
  oclusão, que tem leitura de urgência própria neste aplicativo.
- **Contradição dentro da mesma tela.** A dor de barriga era "a única
  que pede atenção no mesmo dia" em es, fr e de — e duas leituras
  abaixo o intestino travado manda ir hoje à urgência.
- **Frase que não fecha.** "it stopped having happened" e as suas três
  irmãs; "get ready what you'll bring"; "Les mesurés"; "aber diese
  Woche lohnt es sich" sem objeto.
- **Duas palavras para a mesma coisa.** adherence/consistency,
  observance/régularité, Therapietreue/Verlässlichkeit; Dosisleiter,
  Leiter e Dosistreppe no mesmo módulo; "acá" contra "aquí", 11 a 74.
- **E três defeitos que a varredura de vocabulário deixou, meus:** oito
  rótulos "Aplicación" em espanhol ao lado de "inyección" na prosa, uma
  troca a mais em ajuda ("escribimos en esas inyecciones"), e três
  "L'piqûre" em francês, duas delas na Home.

**O que isso NÃO é.** É a leitura de um falante não nativo com as redes
do repositório por baixo — não é revisão de falante nativo, e menos
ainda de profissional de saúde naquele mercado. As duas continuam
pendentes, e a segunda está logo abaixo.

### E a revisão clínica se repete

Cada idioma novo repete o que o inglês já deve: o `marcadores.ts` é o
maior bloco de texto clínico do aplicativo, e a redação dele para um
mercado precisa passar por alguém habilitado naquele mercado. Não é
tradução de interface.

⚠️⚠️ **E JÁ HÁ TRÊS CASOS CONCRETOS DISSO NO CÓDIGO.** TGO e TGP se
chamam **ASAT** e **ALAT** no laudo francês e **GOT** e **GPT** no alemão
— e o TGO/TGP do português vem da mesma palavra que o GOT/GPT alemão, e
ainda assim nenhum é o outro. As faixas de IMC alemãs usam os nomes da
classificação ("Adipositas Grad I"), e o piso da escala de diarreia segue
o corte da OMS em todos os idiomas.

Eu escrevi os três pela literatura, e são exatamente o tipo de decisão
que precisa de quem exerce naquele mercado: se estiver errado, a pessoa
não acha a linha dela no próprio exame.

### E as duas decisões permanentes do alemão

1. **Ele trata por "du".** Português diz "você", espanhol "tú" — os dois
   familiares. Francês diz "vous" porque a língua quase não oferece outra
   coisa a um aplicativo falando com um adulto desconhecido. Alemão
   oferece as duas de verdade, e "Sie" aqui não seria educado, seria
   distante: este aplicativo fala do corpo, das aplicações e dos exames de
   quem lê, e no fim agradece por ter feito o caminho junto.

   **É a decisão que mais custa desfazer** — são trinta arquivos —, e por
   isso ela está escrita por extenso no alto de `textos/de-DE/comum.ts`.
   Vale confirmar antes da loja.

2. **A Doppelnennung, por extenso.** "sprich mit deiner Ärztin oder
   deinem Arzt", e não "Ärzt*in" nem "Ärzt:in" — os leitores de tela
   pronunciam mal as formas com sinal no meio, que é exatamente o que
   derrubou o ponto médio francês. Onde nomear os dois estoura a linha,
   entra o papel: "dein Team", "wer dich behandelt", "ärztlich begleiten".

### E as três travas de francês que o código já carrega

Não são estilo, e valem para qualquer francês que se escreva depois:

1. **Nenhuma frase concorda um particípio com quem lê.** `être` +
   particípio afirma um gênero que o português nunca carregou:
   "Vous êtes passée à 5 mg" diz que quem lê é mulher. As saídas são o
   auxiliar *avoir*, o infinitivo, ou um sintagma nominal.
2. **Nenhuma concorda com variável de tempo de execução** — pior que a
   primeira, porque acerta parte das vezes. Os oito eixos do radar são
   2 masculinos, 5 femininos e 1 feminino plural.
3. **O ponto médio (`né·e`) não é a saída.** Ele contorna o acordo em vez
   de evitá-lo, é contestado, e os leitores de tela o pronunciam mal. A
   saída é reformular.


---

## 🔴 21. O preço é o mesmo número em toda moeda

A moeda segue o país — `moedaDe()`, em `logic/pais.ts` — e a tela de planos
em França mostra **49,90 €**. O símbolo mudou; o número não.

R$ 49,90 e 49,90 € não são o mesmo preço: são quase seis vezes um do
outro. O que está na tela hoje não é um preço de mercado, é o preço
brasileiro com outro símbolo na frente.

**Isto não pode chegar na loja assim.** Preço por mercado é decisão de
negócio, não de tradução, e enquanto ela não existir a tela está dizendo
um número que ninguém decidiu.

Onde mexer: `PLANOS()` em `logic/assinatura.ts` — hoje o valor é constante
e só o símbolo vem do país.

---

## 🟡 22. O rótulo do IMC não diz de qual classificação ele saiu

⚠️ **A SEGUNDA RÉGUA SAIU, e o item mudou de sentido — não fechou.** Havia
duas, trocadas pelo país: a da OMS (18,5 · 25 · 30 · 35 · 40) e a
asiática (18,5 · 23 · 25 · 30 · 35). A asiática saiu em 22/09/2026, por
decisão de produto — o motivo inteiro está no alto de `logic/pais`.

Com uma régua só, some o problema de a mesma pessoa cair em faixas de
nome diferente em Lisboa e em Singapura. **O que fica é maior:** quem é
do sul ou do leste asiático lê uma faixa MAIS PERMISSIVA do que a
diretriz do país dele usaria, e a tela não diz isso.

Falta uma linha: **de onde vem o corte**. É a mesma regra do resto do
aplicativo — todo número mostrado diz de onde veio —, e aqui ela vale
mais do que valia com duas réguas, porque agora a escolha é do
aplicativo e não do país de quem lê.

---

## 🟡 23. O espanhol tem um separador decimal; a América tem dois

Já está escrito por extenso no alto de `logic/local.ts`, e fica aqui para
não se perder: México, América Central, Porto Rico e a República
Dominicana escrevem "1,234.56", à americana; a América do Sul e a Espanha
escrevem "1.234,56". São ~150 milhões de falantes de um lado e ~200 do
outro.

Ficou a vírgula decimal. **A saída não é mudar esse número: é um
`es-MX` com o mesmo catálogo e outro formato** — que é exatamente o que a
separação entre FORMATO e CATÁLOGO existe para permitir. O relógio tem o
mesmo problema (México escreve 12 h, a América do Sul 24), e nesse o
aparelho manda.

---

## 🟡 24. A rede de congelamento tem quatro cegueiras conhecidas

Ela roda sete cenários sobre **uma** semente, e a semente tem registro de
tudo. Quatro consequências, as quatro já custaram:

1. **Todo ramo que só aparece no vazio fica de fora.** O feminino escrito
   em duro em `metas.jornada.semRegistros` — a tela dizia "sem dias
   registradas ainda" — passou por ela sem uma linha de diferença, antes e
   depois da correção. O aviso está no cabeçalho da rede: antes de confiar
   num "idêntico", procure no JSON a frase que DEVERIA ter mudado.

2. **Há uma não-determinação latente na ordem dos marcos.** Duas execuções
   sem mudança de código deram zero diferenças, e uma terceira, contra uma
   captura anterior, trocou a ordem de dois marcos com o mesmo carimbo de
   tempo. Não foi reproduzida desde então. Se o diff acusar marcos sem
   nenhuma outra mudança, é provável que seja isto — mas é para conferir,
   não para descartar.

3. **O que ela não CHAMA, ela não vê — e isso já custou.** Ela lia
   `timelineEvents` e `timelineWeeks`, mas não `timelineCounts`, que é
   quem monta os chips de filtro. Quando `Object.keys(TL_LABEL)` passou a
   devolver lista vazia, a rede deu zero diferenças com toda a razão: ela
   não olhava para lá. `timelineCounts` entrou na rede junto com o
   conserto. A lição é de leitura: um "idêntico" só cobre as funções
   listadas no cenário, e a lista está no arquivo — vale conferir se a
   função que você mexeu está nela antes de confiar no silêncio.

4. **Ela só roda pt-BR e en-US.** Dos sete cenários, dois trocam o local, e
   os dois trocam para `en-US`. Mudança em catálogo espanhol, francês ou
   alemão passa por ela sem uma linha de diferença — o "idêntico" é
   verdadeiro e não diz nada. Foi o que aconteceu com a maiúscula do
   alemão em `rotina.empurroes.aplicacao` ("der Pen ist dran" no começo
   de frase): a rede calou, e quem viu foi a tela. Acrescentar cenários
   nos outros três locais é barato e ainda não foi feito.


---

## ✅ 25. O nome do princípio ativo está em português, em todo idioma — RESOLVIDO

**Resolvido.** `tratamento.molecula` é uma tabela chave→exibição em cada
catálogo, e `logic/formas.nomeDaMolecula` a lê com recuo para a chave:
registro antigo continua legível, e nenhuma tela escreve mais a grafia
portuguesa em alemão. O relato original fica abaixo.

`logic/meds.ts` guarda `mol: 'Tirzepatida'`, `mol: 'Semaglutida'` — a
grafia portuguesa —, e o nome aparece dentro de frase em duas telas: a
carta do companion sobre a fome que volta, e a mensagem de quem ainda não
aplicou.

O nome comum internacional muda de idioma:

| | |
|---|---|
| pt-BR | tirzepatida, semaglutida, dulaglutida |
| en-US | tirzepatide, semaglutide, dulaglutide |
| es-419 | tirzepatida, semaglutida, dulaglutida |
| fr-FR | tirzépatide, sémaglutide, dulaglutide |
| de-DE | Tirzepatid, Semaglutid, Dulaglutid |

Três dos cinco já saem errados hoje. **Isto é dado de mercado, e não
texto de catálogo** — o mesmo lugar onde mora a lista de medicamentos por
país (`logic/pais.ts`). A saída provável é um campo `mol` por local em
`MEDS`, ou uma tabela de tradução ao lado dela.

⚠️ E a CAIXA já está resolvida: o `.toLowerCase()` que ficava no sítio de
chamada virou `comum.noMeio`, que no alemão devolve o que recebeu.

---

## 🟡 26. `formas.oA` devolve um caso só, e o alemão precisa de dois

`oA` devolve o artigo pelado — "a", "the", "la", "der" — e as seis
chamadas dele põem esse artigo ora no sujeito, ora no objeto:

| caso | onde |
|---|---|
| nominativo | `index.tsx:245`, `caneta.tsx:102` |
| acusativo | `aplicacao-ok.tsx:85`, `caneta.tsx:113`, `derive.ts:2445` |

⚠️ **Eram quatro acusativos, e são três.** O quarto era o botão do cartão
de estoque da Home — "Ver a caneta", `home.verRecipiente` —, e ele deixou
de nomear o recipiente: diz "Ver o medicamento", que é o nome da tela de
destino. Sem substantivo não há caso para resolver. É o caminho que este
item prevê no fim: a frase se constrói em volta do problema em vez de
receber um parâmetro para ele.

Em português, espanhol, francês e inglês o artigo é o mesmo nos dois
casos, e por isso a assinatura nunca precisou saber. Em alemão é "der
Pen" e "den Pen".

O alemão devolve o **nominativo**, e nas três chamadas de acusativo
está errado. Está listado por arquivo e linha no alto de
`textos/de-DE/formas.ts`.

**Não é para consertar agora**, e a razão é o item 19: as seis chamadas
moram em frases portuguesas ainda cravadas no código. Um parâmetro de
caso enfiado dentro de "Ver der Pen" não ajuda ninguém. Quando essas
telas forem para o catálogo, o dono da frase é o idioma, e aí o caso é
decisão do idioma — ou a frase se constrói em volta do nominativo, que é
o que `avisos.ts` e `rotina.ts` já fazem em alemão.

⚠️ E o `concordar` tem o mesmo tipo de buraco: ele recebe DUAS palavras,
e o alemão tem TRÊS gêneros. Nenhum dos quatro recipientes de hoje é
neutro, então o ramo nunca rodou. Quem acrescentar um "das" precisa saber
disso antes.


---

## 🟡 27. A semente é uma paciente brasileira, e ela abre em todo mercado

`store.hydrate()` cai em `buildSeed()` quando não há nada gravado — ou
seja, **toda instalação nova abre na demonstração**, com setenta dias de
registros de outra pessoa. Isso já era conhecido; o que o alemão mostrou é
que a outra pessoa é brasileira de ponta a ponta:

- **Mariana Silva**, e as metas pessoais dela em português — "Vestir a
  calça jeans antiga", "Voltar a ir à praia", "Começar a caminhar de
  manhã". São as três que aparecem em `/metas` e em `/jornada`, em
  qualquer idioma.
- **Dra. Helena Costa**, **CRM 128456-SP**, Endocrinologia e Metabologia,
  **São Paulo, SP**, Rua Ficção Exemplar, "Seg a sex, 8h às 18h".
- **Unimed, Bradesco Saúde, SulAmérica, Amil** — convênios brasileiros, na
  tela da clínica de quem instalou na Alemanha.
- As conversas, as perguntas para a consulta e as notas das duas consultas,
  todas em português.

⚠️⚠️ **E TRADUZIR SÓ A PROSA SERIA PIOR.** Metas em alemão ao lado de um
CRM paulista é a mesma doença de meia tela traduzida — o leitor conclui
que o aplicativo está quebrado, e desta vez com razão.

### ⚠️⚠️ E A REDE PARCEIRA É BRASILEIRA, O QUE MUDA A RESPOSTA

A rede de clínicas parceiras **não existe fora do Brasil ainda**. A trava
já está escrita — `temRedeParceira()`, em `logic/pais.ts`, devolve
`p === 'BR'` —, e três lugares a consultam: o convite na aba Cuidado, a
tela de planos e a de assinatura.

**O que ela NÃO cobre é a semente.** `buildSeed()` grava `vinculo` sem
perguntar o país, e doze telas decidem o que mostrar por
`clinicaConectada(S)`, que só olha esse campo. Resultado, medido em
`/cuidado` com o aplicativo em alemão e o país em DE:

> Quem cuida de você · **Dra. Helena Costa** · Endocrinologista
> ÚLTIMA ORIENTAÇÃO · "Ótimo sinal. Mantém a hidratação e a proteína que
> combinamos." · Teleconsulta · Donnerstag

Uma endocrinologista paulista, com mensagem em português, numa tela
alemã de um país onde a rede parceira não existe.

⚠️ **E ISSO MUDA O QUE VALE TRADUZIR.** Oito telas são da rede parceira —
`/medico`, `/especialista`, `/clinica`, `/parceiros`, `/codigo`,
`/conversa`, `/resumo-medico`, `/meta-clinica` — mais `/protocolos` e
`/prescricao`. Enquanto a rede for só brasileira, traduzi-las é trabalho
adiantado para um mercado que ainda não existe. **O que precisa de
tradução são as telas que existem em todo mercado**: o marcador, a
ajuda, a jornada, o exercício, as aplicações, a biblioteca, a exportação.

**A saída mais barata é uma linha na semente:** fora do Brasil ela não
grava `vinculo`, e as doze telas caem sozinhas no caminho de quem se
trata por conta própria — que o aplicativo já sabe desenhar, porque é o
caminho de quem respondeu "não" no cadastro.

**São duas saídas para o resto, e as duas são decisão de produto:**

1. **Uma persona por mercado.** A demonstração ganha um elenco por país —
   nome, registro profissional, cidade, convênios —, e a prosa dela entra
   num módulo próprio do catálogo, separado do resto para a regra "toda
   frase daqui é o aplicativo falando" continuar valendo.

2. **Instalação nova entra vazia.** `estadoVazio()` já existe e já é o que
   o "apagar meus dados" usa. A demonstração vira uma porta de
   desenvolvimento, e quem instala cai no cadastro — que é o que um
   aplicativo de verdade faz.

A segunda é mais barata e provavelmente mais certa. A primeira só se paga
se a demonstração for material de venda.

### ✅ Decidido em 24/09/2026: uma persona por idioma (a saída 1)

Feito. A persona mora em `src/textos/<idioma>/semente.ts`, um módulo do
catálogo separado dos outros porque não é o aplicativo falando, e
`buildSeed()` lê dele na hora de montar:

- **pt-BR** continua sendo a Mariana, com a Dra. Helena, a Clínica
  Vitalis, a rede parceira e tudo que depende dela.
- **Os outros cinco** — Sarah (en-US), Valeria (es-419), Camille (fr-FR),
  Julia (de-DE) e Giulia (it-IT) — se tratam com **médico próprio**,
  porque a rede parceira não existe fora do Brasil. Sem vínculo, sem
  conversa com a equipe, sem receitas, equipe, materiais nem a tarefa de
  exame: é o mesmo recorte do modo "sem clínica parceira" de
  `logic/store`. Da médica, só o que a pessoa digitaria em
  /acompanhamento — nome, especialidade e onde é atendida; registro,
  biografia e nota de avaliação seriam números que ninguém forneceu.
- Metas, notas, consultas, documentos, arquivos de exame, histórico e
  sintoma próprio são de cada persona. Refeições e treinos são gravados
  com os rótulos do catálogo, como o aplicativo grava um registro novo.
- O tipo de documento virou chave (`'exame'`/`'resumo'`), e o rótulo sai
  de `tipoDoDocumento` — "Exame" aparecia em português na tela do
  médico em qualquer idioma.

**O que continua em aberto:**

1. **A persona é lida uma vez.** O que a semente grava fica gravado; quem
   troca de idioma depois continua com a persona antiga até tocar em
   "Reconstruir a semente", no fim do Perfil.
2. **Os nomes dos alimentos são do MERCADO, não do idioma.** A build é do
   mercado brasileiro, e "comida é do lugar" (`logic/mercado`): a Julia
   come arroz integral e peito de frango grelhado, com os nomes da TACO.
   Resolve-se com build por mercado — ver o item 18.
3. **A saída 2 continua de pé como decisão separada**: instalação nova
   ainda abre na demonstração, agora na persona do idioma do aparelho.
4. **A prosa das cinco personas foi escrita por mim**, e entra na revisão
   nativa do item 20 junto com o resto.

---

## 🟡 28. Rótulo literal em constante de módulo: nenhuma rede estática o vê

`scripts/idioma-congelado.mjs` procura **constante de módulo que LÊ o
catálogo**, porque essa é a que congela o idioma no import. Ela não tem
como achar o caso irmão, e pior: **constante de módulo cujos rótulos são
texto literal**. Não há o que detectar — é só uma string.

Foi assim que a barra de abas ficou em português nos cinco idiomas:

```ts
const ITEMS = [
  { ic: 'home', label: 'Home' },
  { ic: 'journey', label: 'Jornada' },   // ← em alemão também
```

Quatro palavras embaixo de **toda** tela do aplicativo, e as duas redes
calaram: `idioma-congelado` porque a constante não lê o catálogo, e
`inventario-textos` porque acusava o arquivo mas ele não estava na fila
das telas.

**A rede que pega esta classe é a de tela, não a de código.** Trocar o
idioma e varrer o texto renderizado é o único jeito de achar palavra
portuguesa que ninguém marcou como texto — `scripts/rede-telas.js` no
navegador já faz a varredura; o que faltava era rodá-la olhando também
para a moldura, e não só para o miolo de cada tela.

⚠️ E o inventário conta ARQUIVO, não tela. `ui/TabBar.tsx` aparecia na
lista dele o tempo todo, misturado com os componentes, enquanto a fila de
trabalho ia por rota. O que aparece em toda tela não tem rota.

---

## ✅ 29. O resumo da semana mostra o peso sem sinal — RESOLVIDO

**Resolvido em 24/09/2026** (9993b89). A linha usa `variacaoDe`, a mesma
das outras variações do aplicativo: "−0,4 kg", ou "estável" quando o
número não se mexeu. E com menos de duas pesagens nos sete dias o peso sai
da linha — antes ela escrevia "0,0 kg", uma estabilidade que ninguém
mediu. O relato original fica abaixo.

Na aba de Insights, a linha "Resumo da semana" diz `semana 11 · 6
check-ins, 0,4 kg` — e os 0,4 kg saem de `Math.abs()` sobre a variação
dos últimos sete dias. Quem lê não sabe se subiu ou desceu.

Não é número inventado (a variação é real), mas é número sem leitura, que
é a metade do problema. A correção é escolher: ou o sinal entra, ou a
frase diz a direção em palavra. Fica fora deste lote porque muda
comportamento numa linha que este commit só traduziu.

---

## 🟡 30. "Sair da conta" promete uma conta que não existe

O botão do fim do Perfil diz "Sair da conta" — e o comentário que mora
três linhas acima dele diz o contrário: *"Não há conta nem servidor
aqui: sair é voltar para a porta, e não apagar a vida de alguém do
aparelho."* Ele põe `onboardDone` em falso e devolve a pessoa ao
cadastro. Nada é apagado, e nunca houve login.

Em português "sair da conta" passa como fórmula. Traduzido, fica mais
difícil de ignorar: "Sign out", "Cerrar sesión", "Se déconnecter" e
"Abmelden" prometem credenciais nos quatro.

Fica como pendência e não como conserto porque o rótulo certo depende do
que o botão deve ser — refazer o cadastro? voltar à abertura? — e isso é
decisão de produto, não de tradução. O que a tradução fez foi tornar a
promessa mais audível.

---

## 🟡 31. A frase com número no meio dela: três pedaços, e não uma frase

Apareceu duas vezes em dois lotes seguidos, e vai voltar:

```
pt  Para perder <b>7 kg</b> com o Mounjaro®.
de  Um <b>7 kg</b> abzunehmen mit Mounjaro®.

pt  Semana <b>11</b> de 15 até a sua meta · <b>10</b> com aplicação em dia
de  Woche <b>11</b> von 15 bis zu deinem Ziel · <b>10</b> mit Injektion nach Plan
```

Quando a frase tem **destaque tipográfico no meio**, ela não pode vir
pronta do catálogo: o negrito ficaria travado na posição que o português
escolheu, e o alemão põe o verbo no fim. A saída que os dois casos usam é
a mesma — o catálogo devolve uma **tupla de pedaços**, e a tela intercala
os valores em negrito entre eles.

```ts
objetivo: (perder, alvo, marca): [string, string, string] => [...]
linhaDoPlano: (previstas, temHorizonte): [string, string, string] => [...]
```

⚠️ A anotação de tipo `: [string, string, string]` **não é enfeite**: sem
ela o TypeScript infere a união literal das strings do português, e
nenhum outro idioma satisfaz a conferência de forma. O mesmo vale para
qualquer função do catálogo cujo corpo seja um ternário entre dois
literais — ver `home.telaInicio.diasSeguidos`, que precisou de
`: string` pelo mesmo motivo.

Não é uma pendência a resolver: é o padrão a repetir, escrito aqui para
não ser redescoberto na terceira vez.

## 🟡 32. O `.toLowerCase()` de tela estraga texto JÁ TRADUZIDO

Sobram **sete** `.toLowerCase()` em telas, e eles não esperam a extração
para fazer estrago: o catálogo do outro lado já está nos cinco idiomas, e
a tela abaixa a caixa dele depois de pronto.

Visto hoje, em alemão, na folha de conquista:

    Próximo nível: noch 3 termine

`conquistas.consultasFalta` devolve **"Noch 3 Termine"** — certo, do
catálogo alemão. Quem escreveu "noch 3 termine" foi a tela, com um
`.toLowerCase()` que é regra de PORTUGUÊS: depois de dois-pontos a frase
continua em minúscula. Em alemão o substantivo não perde a maiúscula
nunca, e ali ele perdeu duas.

| onde | o que ele abaixa |
| --- | --- |
| `conquista-ok.tsx:146` | o que falta para o próximo nível |
| `aplicacao-ok.tsx:64` | o local da aplicação |
| `cobrancas.tsx:69` | o nome do plano |
| `medir-agua.tsx:120` | o nome da bebida |
| `companion.tsx:124,140,180` | o tipo de consulta e o nome da molécula |

A saída é a mesma de sempre e já existe: `T.comum.noMeio`, que no alemão
devolve o que recebe. Cada um sai com a tela dele — as cinco primeiras
ainda estão na fila do item 19, e os três do `/companion` somem com a
tela nova.

⚠️ **O `.toLowerCase()` de `companion.tsx:106` não é deste item.** Aquele
não escreve na tela: normaliza a PERGUNTA para casar palavra-chave em
português, que é o defeito de arquitetura já descrito no item 19.

---

## 🟡 33. A categoria tem um nome local em cada mercado, e não é "caneta"

"Caneta emagrecedora" é como o Brasil chama a categoria, e **não se
traduz**. Fora daqui o nome popular fala do medicamento ou da injeção, e
não do aparelho: nos EUA "Wegovy pen" é o objeto, e a categoria é
GLP-1; em alemão o termo que pegou é *Abnehmspritze*, e um "Abnehm-Pen"
soaria inventado. O mapa, trazido em 24/09/2026, para quando a ficha da
loja, o site e os anúncios forem escritos:

| mercado | categoria | alternativas |
| --- | --- | --- |
| pt-BR | canetas emagrecedoras | — |
| en-US | GLP-1 medications | weight-loss medications · weight-loss injections |
| es-419 | medicamentos para perder peso | tratamiento para perder peso · plumas para adelgazar |
| fr-FR | médicaments pour la perte de poids | injections pour perdre du poids · traitement par GLP-1 |
| it-IT | farmaci per la perdita di peso | iniezioni per perdere peso · farmaci GLP-1 |
| de-DE | Abnehmspritzen | Medikamente zur Gewichtsabnahme |

⚠️ **E O QUE NÃO USAR COMO NOME DA CATEGORIA:** "weight-loss pen" em
inglês; "stylo pour maigrir" em francês, que se entende mas soa informal
e comercial (o termo técnico é *stylo prérempli*, e é o objeto);
"penna dimagrante" em italiano, que aparece em comunicação comercial mas
não é tão consolidado quanto a *Abnehmspritze* alemã. O espanhol é o mais
perto do português — "pluma para adelgazar" existe —, e mesmo assim a
categoria vai melhor pelo medicamento.

**O aplicativo já está do lado certo disto, e não há código a mexer.**
Nenhum dos seis idiomas nomeia a categoria na interface: a tela diz "seu
tratamento" e depois o remédio pelo nome. A palavra do aparelho só vem
de `formas`, e só para quem de fato usa caneta — e ela bate com o termo
técnico de cada língua: *stylo*, *penna*, *pluma*, *Pen*. A única menção
genérica é "Em estudos sobre GLP-1", na lista de fontes do cadastro. O
alemão já fala da injeção onde a frase é sobre a dose ("Deine Spritze ist
morgen") e deixa "Pen" para o objeto. Este item é sobre o que fica FORA
do repositório: título, subtítulo e palavras-chave da loja, o site e os
anúncios.

⚠️⚠️ **E A FICHA DA LOJA É PERGUNTA PARA A REVISÃO DO ITEM 2, antes de
ser escrita.** Na União Europeia a publicidade ao público de medicamento
de venda sob prescrição é proibida (Diretiva 2001/83/CE, art. 88), e o
Brasil tem restrição parecida (Lei 6.360/1976 e RDC 96/2008 da Anvisa).
Um aplicativo que acompanha o tratamento não vende o remédio — mas nome
de marca (Mounjaro, Wegovy, Ozempic) na ficha, ou "Abnehmspritzen" como
palavra-chave, pode ser lido como propaganda, e isso é o advogado quem
responde, mercado por mercado. Nos EUA a regra não é a mesma: a
propaganda ao consumidor é permitida, com as exigências da FDA.

---

## 🟡 34. A vitrine da rede parceira existe, com lista de exemplo, e espera o portal

Feita em 24/09/2026 para ver como fica: `/rede` (a lista, com busca,
especialidade, localização e filtros), `/rede-filtros` (a folha) e
`/profissional` (a ficha, com consultórios, horários, convênios e canais).
Abre pelo bloco do fim da aba Cuidado, para quem está no Brasil e não
tem acompanhamento nenhum. Os médicos virão de um **portal próprio**
(Admin/CMS), onde cada um é cadastrado e mantém a própria ficha; o contato
é direto com o consultório, e o vínculo continua nascendo do código de
convite que ele passa depois da primeira consulta.

**Hoje a única fonte é a de exemplo**, e ela só existe em `__DEV__`: nove
profissionais inventados, com o aviso no alto da vitrine e nenhum contato
que abra. Em produção `FONTE` é nula, a vitrine não abre, e o bloco da
aba Cuidado continua levando a `/parceiros`.

**O que falta antes de valer em produção:**

1. **O portal, e o contrato com ele.** Os tipos de `logic/rede.ts`
   (`Profissional`, `Consultorio`, `Contato`) são o que a vitrine precisa
   receber — é daí que sai a especificação do portal. Quando ele existir,
   `FONTE` passa a ler de lá, e só ela muda.
2. **Revisão jurídica da vitrine — ver o item 2.** É publicidade médica:
   a ficha já mostra CRM com UF e RQE de cada especialidade, mas quem
   entra na lista, com que critério, e o que o profissional pode escrever
   no "Sobre" são perguntas de advogado. A ordem é distância ou nome, sem
   nota e sem "destaque" — os dois pediriam critério que ninguém definiu.
3. **A Política de Privacidade ganha uma linha.** Ler o catálogo é uma
   chamada de rede nova. A localização não vai junto: a distância é
   calculada no aparelho (`logic/localizacao.ts`), e é isso que o texto
   da permissão promete.
4. **Um build novo no iPhone.** `expo-location` é módulo nativo, e o
   build de agora não o tem — a linha "Usar minha localização" some até
   lá (o módulo é carregado com cuidado para a tela não cair). E o build
   de produção passa a declarar a permissão de localização, mesmo com a
   vitrine fechada.
5. **As fotos vêm do portal, com o consentimento de quem aparece.** Sem
   foto, o cartão mostra a inicial.
