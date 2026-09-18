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
- **o botão não compra** — `assinar()` devolve "não implementado", e a
  tela mostra isso em voz alta em vez de fingir sucesso;
- **"Restaurar compras" cai no mesmo lugar**, porque restaurar sem loja
  é a mesma promessa vazia.

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

As duas primeiras agora só aparecem com vínculo, a terceira saiu e a
quarta virou uma vaga vazia que não se toca.

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
