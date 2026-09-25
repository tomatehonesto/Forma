# O Supabase como ponte: conta, diário, rede e vínculo

**Data:** 25 de setembro de 2026
**Estado:** aprovado em conversa, parte a parte; emendado na leitura do plano — ver **Emendas**, no fim
**Plano:** [`../plans/2026-09-25-supabase-ponte-plano.md`](../plans/2026-09-25-supabase-ponte-plano.md)

---

## O problema

Hoje o Morphi não tem servidor. Tudo mora no aparelho (`AsyncStorage`,
chave `norte.v1`), não existe conta, e o vínculo com a clínica parceira é
um campo local (`profile.vinculo`). A rede parceira só existe como lista de
exemplo em `__DEV__` (`logic/rede.ts`), e qualquer código de quatro letras
isenta a assinatura, porque não há contra o que conferir.

Três coisas empurram para o servidor ao mesmo tempo:

- **A promessa da folha do código** — "o vínculo com a clínica já garante o
  seu acesso… e cancelar não muda nada no que você já registrou" — só vale
  fora do aparelho se o vínculo e o diário estiverem num lugar que não some
  quando o celular some (PENDENCIAS, item 36).
- **O portal das clínicas** (ainda a construir) precisa de um lugar comum
  com o aplicativo. **O Supabase é essa ponte**: o mesmo banco, com o
  esquema e as regras de acesso como contrato entre os dois lados.
- **O diferencial do produto**, nas palavras do dono: o especialista
  acompanha sem o paciente precisar enviar, "até porque muitas vezes os
  sintomas são graves e você não sabe". A equipe tem todas as informações.

O item 10 das pendências já tinha decidido o Supabase (conta, autenticação
e banco) e a região (São Paulo, `sa-east-1`), e listado os textos legais que
ficam falsos no dia em que ele entrar.

---

## As decisões

Tomadas em conversa, em 25/09/2026, uma a uma:

1. **Tudo de uma vez:** conta, vínculo, rede e o diário inteiro
   sincronizado na mesma entrega, com a reescrita da Política, dos Termos e
   um novo consentimento.
2. **A conta nasce no fim do cadastro**, depois do plano (assinar, código
   de clínica ou teste).
3. **Entrar com Apple, Google ou e-mail com código de 6 dígitos.** Nenhuma
   senha, em lugar nenhum.
4. **Sincronização híbrida:** uma tabela de registros com identidade por
   item, e um documento por pessoa, em partes, para o que é único.
5. **O Supabase é a ponte com o portal.** Esquema e regras nascem servindo
   os dois lados, mesmo antes de o portal existir.
6. **Com vínculo ativo, a clínica vê tudo** — o diário inteiro, fotos
   inclusive —, sem o paciente enviar nada.
7. **Depois do vínculo, a clínica mantém a leitura do que foi registrado
   até o fim dele**, pela lógica do prontuário.
8. **Compartilhar e estar vinculado são a mesma coisa.** Revogar o
   compartilhamento é desconectar da clínica.
9. **Dois projetos Supabase, ambos em São Paulo:** `morphi-dev` e `morphi`.

---

## O recorte

**Dentro:** os dois projetos; a conta e a entrada; o diário sincronizado;
a rede, os convites e o vínculo no servidor; as regras de acesso dos dois
lados (paciente e profissional); os textos legais e de tela que ficam
falsos; as travas de teste.

**Fora, de propósito:**

- **A interface do portal.** Outro aplicativo, com desenho próprio. Daqui
  sai o contrato que ele cumpre.
- **A cobrança** (StoreKit, Play Billing e as notificações das lojas no
  servidor). Continua em PENDENCIAS, item 5; a regra única de acesso
  (`acessoDe`) já está pronta para recebê-la.
- **O alerta de sintoma grave.** É desenho do portal; o banco entrega o
  registro na hora (ver Peça 4), e o portal decide como avisar.
- **O prontuário congelado.** A clínica vê a versão atual dos registros do
  período do vínculo; uma cópia congelada no fim pode vir com o portal.
- **Compartilhamento por categoria.** A decisão foi o diário inteiro.
- **Mais de uma clínica ao mesmo tempo.** Um vínculo ativo por pessoa.

---

## Peça 1 — Arquitetura

### No servidor

Dois projetos Supabase, os dois em **São Paulo (`sa-east-1`)** — banco,
autenticação, armazenamento e funções no mesmo projeto, para nenhum dado
atravessar a fronteira pela porta dos fundos (PENDENCIAS, item 10):

- **`morphi-dev`** — desenvolvimento. Nasce com a rede de exemplo (as oito
  clínicas, os nove profissionais e os oito códigos, `LEMOS26` e os
  outros), carregada de um arquivo do repositório.
- **`morphi`** — produção. A rede começa vazia e se enche pelo portal. Um
  código de teste nunca chega a uma pessoa de verdade.

⚠️ **O plano gratuito pausa projetos parados**, e um projeto de produção
pausado é o aplicativo fora do ar. `morphi` sobe para o plano pago antes da
loja (vai para as pendências).

### No aplicativo

Três peças novas e uma adaptada, cada uma com um trabalho:

| peça | trabalho | depende de |
|---|---|---|
| `logic/nuvem.ts` | o cliente Supabase; a sessão guardada de forma segura no aparelho | as variáveis de ambiente |
| `logic/conta.ts` | entrar (Apple, Google, e-mail com código), sair, apagar a conta | `nuvem` |
| `logic/sincronia.ts` | traduz o estado do aparelho em linhas do banco e de volta; sobe e baixa em segundo plano | `nuvem`, o `store` |
| `logic/rede.ts` | a vitrine e a conferência do código passam a ler do banco | `nuvem` |

O endereço e a chave pública de cada projeto vêm de variáveis de ambiente
(`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). **A
chave secreta (`sb_secret_…`) nunca entra no aplicativo**: vive só nas
funções do servidor.

**O aparelho continua sendo a fonte da tela.** Tudo é gravado primeiro no
celular, como hoje, e sobe depois. **Registrar nunca espera o servidor**:
sem internet, o diário funciona igual. Esperam a conexão só as ações que
acontecem no servidor: criar a conta ou entrar nela, apagar a conta, e
conferir ou usar um código de clínica. O fim de um cadastro novo espera a
conexão, porque ele termina na conta (Emenda 1). Quem já tem diário nunca
fica trancado fora dele por falta de internet, porque a tranca da conta,
ao reabrir, só fecha com conexão.

O esquema do banco fica **versionado no repositório**, em arquivos SQL de
migração (`supabase/migrations/`), e a carga de exemplo em
`supabase/seed.sql`. Os dois projetos se montam dos mesmos arquivos.

---

## Peça 2 — Modelo de dados

### O paciente

**`perfis`** — um por pessoa (`user_id`, chave). O documento é dividido em
**partes, cada uma com a sua data de mudança**, para dois aparelhos
mexendo em partes diferentes não se atropelarem:

| parte | o que leva |
|---|---|
| `pessoal` | nome, nascimento, altura, sistema de medidas, foto |
| `tratamento` | medicamento, forma, dose, pesos de início e de meta, datas, restrições, histórico (condições, alergias, medicamentos) |
| `acompanhamento` | quem acompanha, quando é médico próprio (nome, ficha) e a consulta anotada pela pessoa |
| `protocolo` | a semana, as tarefas, as metas que a própria pessoa anotou |
| `preferencias` | tema, paleta, alertas e lembretes |
| `vistos` | conquistas, descobertas e apresentações já mostradas |

E mais: `versao_consentimento` (a do consentimento geral aceito, que
nunca diminui), `consentido_em` (a hora que o aparelho declara),
`consentimento_registrado_em` (a hora em que o servidor recebeu, que só
ele escreve), `perguntas_para_uso` e `perguntas_para_uso_em` (a escolha da
Emenda 2, com a hora carimbada pelo servidor) e `criado_em`.

**`registros`** — uma linha por item do diário:

| coluna | |
|---|---|
| `id` | uuid gerado no aparelho |
| `user_id` | dono |
| `tipo` | ver a tabela de tradução, na Peça 4 |
| `quando` | o momento do registro (o `t` de hoje); vazio nos itens que não têm momento, como as refeições favoritas |
| `dados` | jsonb com o resto do item |
| `atualizado_em` | carimbado pelo servidor a cada escrita |
| `apagado_em` | marca de apagado; a linha não some, para o outro aparelho saber |

**`perguntas`** — as perguntas feitas ao companheiro (`asked`), uma linha
por pergunta: `id`, `user_id`, `quando`, `texto` e `origem` (digitada ou
sugerida). **Só cresce**: no aparelho, `asked` guarda as 12 últimas, mas
sair dessa janela não apaga nada no servidor. Só sobe com a escolha da
pessoa ligada (`perfis.perguntas_para_uso`), e a regra do banco confere
isso. A pessoa lê as suas, e desligar a escolha apaga as que subiram. **A
clínica não lê**, e nós lemos com um papel de leitura próprio, por uma
visão sem o `user_id`, para entender o uso do aplicativo (Emenda 2).

**Armazenamento `fotos` e `documentos`** — privados, uma pasta por pessoa
(`{user_id}/{registro_id}`). O registro de tipo `foto` ou `documento`
guarda o caminho. ⚠️ **Fora desta entrega** (Emenda 3): nenhum registro
tem arquivo hoje.

### A rede (o portal mantém, a vitrine lê)

- **`clinicas`** — a ficha que a vitrine já usa (`Clinica`, em
  `logic/rede.ts`): nome, sobre, endereço, bairro, cidade, UF, ponto, dias,
  horário, modalidades, convênios, particular, contatos, foto e logo — e
  **`publicada`**, se aparece na vitrine.
- **`profissionais`** — nome, foto, especialidades, conselho, região,
  registro, RQE, e `user_id` (a conta com que entra no portal, quando
  tiver).
- **`equipe`** — quem trabalha em qual clínica (`clinica_id`,
  `profissional_id`, `papel`: `responsavel` ou `equipe`, `ativo`).
- **Armazenamento `clinicas`** — público para leitura: fotos e logos da
  vitrine.

### A ponte

- **`convites`** — `codigo` (normalizado, chave), `clinica_id`,
  `profissional_id` (quem convidou), `criado_em`, `expira_em`, `usado_por`,
  `usado_em`.
- **`vinculos`** — `id`, `paciente_id`, `clinica_id`, `profissional_id`
  (responsável pelo paciente), `convite`, `desde`, `encerrado_em`,
  `encerrado_por` (`paciente` ou `clinica`), `consentimento_versao`,
  `consentido_em`, e **`perfil_no_fim`** — a cópia do perfil feita no
  encerramento (ver "O prontuário", abaixo). **Um ativo por paciente**
  (índice único parcial sobre `encerrado_em is null`).

### Da clínica para o paciente

`mensagens` (a conversa, com autor e leitura), `receitas` (com o pedido de
renovação), `consultas` (agenda e histórico), `planos_da_equipe` (as metas e
tarefas que a equipe define) e `materiais` (de uma pessoa, ou de todos os
pacientes da clínica). Cada linha leva o `vinculo_id` em que nasceu.

### Quem vê o quê

As regras moram no próprio banco (RLS), e não no aplicativo:

- **O paciente** lê e escreve o próprio `perfis`, os próprios `registros` e
  a própria pasta de arquivos; lê, acrescenta e apaga as próprias
  `perguntas`. Lê os próprios `vinculos`, o que a clínica escreveu para ele
  e a ficha e a equipe das clínicas dos seus vínculos, publicadas na
  vitrine ou não; escreve mensagens e pedidos de renovação.
- **O profissional**, sendo membro ativo da equipe da clínica C:
  - lê `registros`, `perfis` e arquivos do paciente P **enquanto houver
    vínculo ativo entre P e C** — o histórico inteiro, inclusive o de antes
    do vínculo;
  - **depois do fim do vínculo**, lê os `registros` de P com `quando` até
    a data do fim (e os arquivos deles), o `perfil_no_fim`, e as
    mensagens, receitas, consultas e planos daquele vínculo — e nada do que
    vier depois. Não escreve mais nada para P;
  - escreve mensagens, receitas, consultas, planos e materiais só para
    pacientes com vínculo ativo;
  - **nunca lê as `perguntas` de P**, nem com vínculo ativo — e o portal
    também não, nem com a chave secreta, que não tem permissão na tabela;
  - de outra clínica, nunca lê nada de P.
- **Sem login**, lê só a vitrine (clínicas publicadas, equipe e os campos
  públicos dos profissionais), e confere um código pela função — nunca lê a
  tabela de convites.
- **A exclusão de conta e as tarefas administrativas** rodam em funções do
  servidor, com a chave secreta.
- **Nós** lemos as `perguntas` de quem escolheu permitir, com um papel de
  leitura próprio (`analise_perguntas`), que só enxerga uma visão sem o
  `user_id`, para entender o uso (Emenda 2). Nenhuma regra da API dá esse
  acesso, e ele não é o `postgres` do painel, que lê tudo.

### O prontuário

Durante o vínculo, a clínica vê o diário inteiro. Quando ele termina — por
qualquer um dos dois lados —, a função que o encerra copia o perfil do
paciente para `perfil_no_fim`, e a leitura da clínica passa a ser: os
registros com `quando` até o fim, e essa cópia.

Duas consequências conhecidas, e aceitas nesta entrega:

- a clínica vê a **versão atual** dos registros do período; se o paciente
  corrigir uma pesagem antiga depois do fim, a clínica vê a correção;
- **se o paciente apagar a conta**, os registros somem para a clínica
  também. O prontuário tem guarda de 20 anos (Lei 13.787/2018) e a LGPD dá
  o direito de eliminação: quem guarda o quê é **revisão jurídica**
  (pendências), e não decisão de código.

---

## Peça 3 — Conta e entrada

- **O cadastro ganha um último passo:** as perguntas, depois o plano
  (assinar, código de clínica ou teste), depois **criar a conta** — Apple,
  Google ou e-mail com código. Nesse momento, tudo o que foi respondido
  sobe, e o aplicativo abre.
- **Código de clínica no plano:** conferir funciona sem login, então o
  código é conferido na hora, e o consentimento de compartilhar aparece ali
  (Peça 5). O vínculo nasce no servidor assim que a conta existe, com o
  consentimento que ficou guardado no aparelho até então.
- **A primeira tela do cadastro ganha "Já tenho conta".** Num aparelho
  novo, a pessoa entra, o diário desce inteiro e o cadastro é pulado.
- **A conta é obrigatória** (Emenda 1). O cadastro só termina com ela, e
  **quem já usa o aplicativo hoje**, sem conta, cria a sua na primeira
  abertura depois da entrega — o diário sobe nesse momento. Nada sobe
  antes de a conta existir. A tranca olha o dono do diário, e não a
  sessão: sessão expirada não tranca ninguém.
- **"Sair da conta"** (hoje uma porta falsa, PENDENCIAS item 30) passa a
  sair de verdade: o diário fica no servidor e a cópia do aparelho é
  removida, depois de um aviso. Com algo ainda não enviado, o aviso diz
  isso antes.
- **"Apagar meus dados"** apaga no servidor também — registros, arquivos,
  perguntas, perfil, mensagens, vínculos (os encerrados inclusive, com o
  `perfil_no_fim`) e a conta —, por uma função do servidor. É o direito de
  eliminação da LGPD (art. 18, VI). Precisa de conexão, e o aparelho só é
  limpo depois de o servidor confirmar. Sem conta, apaga só o aparelho,
  como hoje, e não precisa de conexão. O que a clínica teria de guardar
  por obrigação legal é a revisão jurídica da Peça 2.
- **A sessão** fica guardada de forma segura no aparelho e se renova
  sozinha. Expirada sem internet, o aplicativo segue funcionando e pede para
  entrar de novo quando a conexão voltar.
- **O e-mail manda um código, e não um link:** o modelo do e-mail do
  Supabase é ajustado para os 6 dígitos.
- **O modo de demonstração do Perfil nunca sobe nada**, como hoje ele não
  grava nada.

---

## Peça 4 — Sincronização

### A identidade de cada item

Cada item do diário ganha um `rid` (uuid; no banco, a coluna `id`) **num
lugar só**: a função que
grava o estado no `store` carimba quem chegar sem um. Nenhuma tela muda —
elas continuam acrescentando itens como hoje. Os itens que já existem
ganham o seu na primeira abertura depois da atualização; como até hoje o
diário só existia num aparelho, não há como duas cópias do mesmo item
receberem identidades diferentes.

### A tradução entre o estado e o banco

| no aparelho (`State`) | no banco |
|---|---|
| `weights` | `registros`, tipo `peso` |
| `injections` | tipo `aplicacao` |
| `checkins` | tipo `checkin` (sintomas, água, proteína, movimento do dia) |
| `meals`, `favMeals` | tipos `refeicao` e `refeicao_favorita` |
| `measures` | tipo `medida` |
| `exams` (marcador com valores) | tipo `exame`, **um registro por valor**, com o marcador nos dados; a tradução reagrupa ao descer |
| `examBundles` | tipo `laudo` |
| `vitals` (pressão, frequência, glicemia, saturação) | tipo `sinal_vital`, um por medição |
| `photos`, `documents` | tipos `foto` e `documento` — hoje sem arquivo nenhum (Emenda 3) |
| `notes`, `goals`, `pens` | tipos `anotacao`, `meta_pessoal`, `caneta` |
| `customSyms` | parte `tratamento` do perfil: é lista de texto solto, e não tem onde guardar identidade (Emenda 3) |
| `profile`, `protocol`, `history`, tema, paleta, alertas, os "vistos" | `perfis`, nas partes da Peça 2 |
| `messages`, `prescriptions`, `materials` | vêm das tabelas da clínica (só leitura, menos mensagens e pedidos de renovação) |
| `team`, `consult`, `consultsHistory`, as metas da equipe | **com vínculo**, das tabelas da clínica; **sem vínculo**, o que a pessoa anotou do médico próprio, no perfil (partes `acompanhamento` e `protocolo`) |
| `asked` | `perguntas`, que a clínica não lê (Emenda 2) |
| `integrations`, `notifications`, `onboardDone` | **ficam só no aparelho** — são permissões e estado deste celular |

Os exames e os sinais vitais se achatam de propósito: dois aparelhos
acrescentando valores ao mesmo marcador não podem se atropelar.

### O que mudou, sem as telas contarem

A sincronia guarda como estava o diário na última vez que sincronizou e
compara com o de agora: **novo**, **editado** (o conteúdo mudou) e
**sumiu** (vira `apagado_em`). É isso que deixa as telas intactas.

### Subir

As mudanças entram numa **fila guardada no aparelho** — fechar o aplicativo
sem internet não perde nada. Com conexão, a fila sobe **logo depois de cada
mudança** (juntando as que chegam em sequência), e é isso que põe um
sintoma no portal na hora; sem conexão, espera, e tenta de novo com espera
crescente quando falha. Fotos e documentos teriam fila
própria, porque são pesados — quando algum registro tiver arquivo
(Emenda 3).

### Baixar

Ao abrir o aplicativo e ao voltar para ele, desce só o que mudou desde o
último cursor (`atualizado_em`) e se mistura **item por item**: item
desconhecido entra, item mais novo substitui, `apagado_em` remove.

**Conflito:** o mesmo item mexido em dois aparelhos — vale a última versão
que chegou ao servidor (o servidor carimba `atualizado_em`; o relógio do
aparelho não decide nada). Itens diferentes nunca se atropelam. No perfil, o
conflito é por parte.

### Na hora

Mensagens, receitas, consultas e planos da clínica chegam **em tempo real**
(Broadcast do Supabase, num canal privado por pessoa; a mensagem leva só a
tabela e o id, e o conteúdo desce pela leitura normal, com as mesmas regras
de acesso — Emenda 3). É o mesmo mecanismo que entrega ao portal, na hora,
um registro de sintoma — a base do alerta de sintoma grave, que o portal
desenha.

### Primeira vez

Ao criar a conta, o diário inteiro sobe. Num aparelho novo, ao entrar, ele
desce inteiro e monta o estado a partir do vazio.

### A pessoa sabe o estado

O Perfil ganha uma linha só, com uma de cinco frases: "Tudo guardado",
"Guardando…", "Sem internet — guardamos quando a conexão voltar", "Entre
de novo" (a sessão caiu) ou "Sem internet — criamos a sua conta quando a
conexão voltar" (a conta ainda não existe; esta também numa faixa da
Home). Nada de dizer que está salvo quando não está.

---

## Peça 5 — Vínculo e rede

- **A vitrine lê do banco** as clínicas publicadas, com a equipe e os
  campos públicos dos profissionais. `EXEMPLO` e `CONVITES_DE_EXEMPLO` saem
  do código do aplicativo e vão para `supabase/seed.sql`, carregado só no
  `morphi-dev`. O aviso "Clínicas de exemplo" continua aparecendo — agora
  porque as clínicas lidas são marcadas como exemplo, e não por qual
  projeto está ligado (Emenda 3). Fica no aplicativo, só em `__DEV__`, a
  lista dos códigos de exemplo para a dica da folha, e a trava das regras
  confere que ela é igual à do `seed.sql`.
- **As fotos das clínicas de exemplo saem do pacote** (~1,3 MB) e vão para
  o armazenamento `clinicas` do projeto de desenvolvimento, com os créditos
  de `assets/images/CREDITOS.txt`. Os retratos da semente da Mariana são
  outro assunto (PENDENCIAS, item 34).
- **`conferir_convite(codigo)`** — função no banco, sem login: devolve a
  clínica e o profissional (campos públicos) se o código existe, não
  expirou e não foi usado (ou foi usado pela mesma pessoa); senão, "não
  achamos". Nunca lista códigos.
- **`usar_convite(codigo, versao_consentimento)`** — com login: numa
  transação só, marca o código como usado, encerra o vínculo ativo anterior
  (troca de clínica) e cria o novo, com o consentimento e a hora.
- **O buraco de hoje fecha:** o código precisa existir. Antes do portal, os
  códigos das clínicas-piloto são criados direto no banco. O cadastro
  deixa de escrever o vínculo (hoje ele o reescreve a cada edição pelo
  lápis). `/parceiros` e o caminho sem fonte de `/codigo`, que hoje ligam
  o código sem conferir, passam pelas mesmas duas funções.
- **O consentimento entra no "É essa a sua clínica?"** (`/codigo`): abaixo
  da clínica e do profissional, a lista do que a equipe passa a ver — tirada
  da tabela de tradução, e não escrita à mão: todo tipo de registro e toda
  parte do perfil que a regra entrega, sinais vitais, laudos, documentos e
  histórico de saúde inclusive —, que ela vê também o que foi registrado
  antes de conectar, que as perguntas ao companheiro ficam de fora, que dura
  enquanto a pessoa estiver conectada, e que a clínica guarda o que foi
  registrado até o fim se ela desconectar. **Conectar é aceitar.**
- **"Desconectar da clínica"**, na tela da clínica, é o jeito de revogar.
  Antes de confirmar, a pessoa lê o que acontece: a equipe para de ver, a
  isenção acaba, os registros ficam. A função `encerrar_vinculo()` faz a
  cópia do perfil e encerra.
- **Quando a clínica encerra pelo portal**, o aplicativo fica sabendo em
  tempo real e avisa a pessoa. `/suspenso` só abre quando o portão da
  cobrança existir, porque ele pergunta a `acessoDe` (Emenda 3).
- **O servidor é a fonte do vínculo.** `profile.vinculo` vira a cópia local
  de `vinculos`, e `acessoDe` (`logic/assinatura.ts`) continua sendo a regra
  única de acesso.

---

## Peça 6 — Privacidade e textos

Tudo **na mesma entrega** que ligar o Supabase — nenhuma frase mentindo nem
um dia:

- **A lista inteira do item 10 das pendências, com a numeração de hoje**
  (a do item 10 envelheceu). Política de Privacidade, seções 2, 4, 5, 6, 7
  (entram como operadores o Supabase, a Apple e o Google, e o serviço de
  envio de e-mail), 8 (o banco em território nacional), 10, 11, 13 e 14;
  Termos, seções 3, 6, 7, 9 e 12; `consentimento.ts`, `privacidade.tsx`,
  as respostas de "E se eu desinstalar o aplicativo?" e "O que a minha
  equipe consegue ver?" (no catálogo `ajuda`), e o comentário do `Portao` em
  `_layout.tsx`.
- **As perguntas entram na Política** (Emenda 2): o dado, a finalidade,
  quem lê, a base legal e o prazo de guarda — e as frases de "não usamos
  analytics" passam a dizer a verdade inteira.
- **O compartilhamento com a clínica entra na Política:** o que a equipe
  vê, desde quando, e que depois de desconectar ela mantém o que foi
  registrado até ali.
- **O consentimento geral sobe de `VERSAO`** — quem aceitou o texto antigo
  aceitou outro tratamento. O consentimento de compartilhar com a clínica é
  outro, e fica guardado no vínculo. O texto novo diz também que nós lemos
  as perguntas feitas ao companheiro para entender o uso, e que a clínica
  não as lê (Emenda 2).
- **As frases que viram mentira:** "Sem vínculo, nada do seu diário sai do
  aparelho" (`/parceiros`) vira "sem vínculo, nenhuma clínica vê o seu
  diário"; "o vínculo não abre o diário para ninguém" (`MODOS.md`); "Um
  toque envia…" (os benefícios de `/parceiros`) vira acompanhamento
  contínuo; "Apagar meus dados" passa a dizer que apaga no servidor — e
  "Não há cópia em lugar nenhum" sai, porque há as cópias de segurança e o
  outro aparelho —, e "Exportar" vira a garantia de portabilidade, levando
  tudo o que sobe, as perguntas inclusive. Nos seis idiomas, onde a frase
  existe nos seis.
- **Para as pendências, sem travar a entrega:** a revisão jurídica do
  prontuário de 20 anos contra o direito de apagar; o papel da clínica
  perante a LGPD (controladora, ou não); a transferência internacional do
  e-mail, se o serviço de envio ficar fora do Brasil; o plano pago do
  projeto de produção; e as cópias de segurança do banco diante do pedido
  de eliminação.
- **O que bloqueia a publicação:** a leitura das perguntas por nós
  (Emenda 2), ao lado do item 2 das pendências.
- **O que deixa de ser pendência e vira pré-requisito:** o domínio de
  e-mail (item 1) e o serviço de envio, já no desenvolvimento, antes da
  conta (Emenda 3).

---

## Peça 7 — Testes e verificação

**Travas que rodam sem servidor**, no formato de `scripts/modos.ts`:

- **`scripts/acesso.ts`** (existe) ganha: o vínculo vindo do servidor,
  desconectar, a clínica encerrar. Em todos, os registros saem intactos.
- **`scripts/sincronia.ts`** (nova) — o miolo da sincronia é código sem
  rede, e é ele que se testa: dois aparelhos registrando coisas diferentes,
  nada se perde; o mesmo item nos dois, vale o último; apagar num, some nos
  dois; a fila sem internet sobe tudo depois; a identidade dos itens
  antigos não duplica nada; o modo de demonstração nunca gera nada para
  subir; o perfil em partes não perde campos; a tradução de ida e volta
  devolve o mesmo estado nos campos que sobem (os que ficam no aparelho,
  vêm do servidor ou se calculam são conferidos à parte).

**As regras de acesso**, com um script contra o `morphi-dev` e contas de
teste (paciente A, paciente B, profissional da clínica X, profissional da
clínica Y, sem login): A não lê B; o profissional de X lê A só com vínculo
ativo e, depois do fim, só até a data do fim; o profissional de X nunca lê
as perguntas de A; Y nunca lê A; sem login, só a vitrine, e o código se
confere mas não se lista; ninguém além da própria pessoa escreve no diário
dela.

**Cada trava é provada com um erro plantado de propósito** — a regra
trocada, a política frouxa —, como foi feito com `scripts/acesso.ts`. Se
ela não pegar, não serve.

**As conferências de sempre** continuam: `tsc`, os seis catálogos, o
espaço fino do francês, o idioma congelado e `scripts/modos.ts`.

**À mão:** no navegador, o cadastro até a conta com e-mail e código, duas
origens (`localhost` e `127.0.0.1`, que não dividem o armazenamento) como
dois aparelhos (registrar numa, ver chegar na outra), conectar
com um código de exemplo e desconectar. No iPhone, a Apple no Expo Go e o
Google com build de desenvolvimento, lendo o console pelo Metro quando algo
falhar.

---

## O que depende do dono, fora do código

- Criar os dois projetos Supabase em São Paulo e passar o endereço e a
  chave pública de cada um (a secreta fica no painel do Supabase e nas
  funções).
- Na conta de desenvolvedor da Apple, a capacidade "Entrar com Apple"; no
  Google Cloud, os clientes de login (iOS, Android e web).
- Um domínio de e-mail e um serviço de envio para os códigos, **já no
  desenvolvimento** (Emenda 3).
- Um build de desenvolvimento no iPhone para o Google; a Apple roda no
  Expo Go.

---

## O que este desenho NÃO faz

- Não desenha o portal, e não cria nenhuma tela dele.
- Não liga a cobrança, nem lê recibos das lojas.
- Não congela o prontuário no fim do vínculo.
- Não deixa a pessoa escolher categorias do que compartilhar.
- Não permite duas clínicas ao mesmo tempo.
- Não sincroniza em tempo real o diário entre dois aparelhos da mesma
  pessoa: desce ao abrir e ao voltar para o aplicativo. Em tempo real, só o
  que vem da clínica.

---

## Riscos conhecidos

- **Uma regra de acesso errada expõe dado de saúde.** É o maior risco da
  entrega, e é por isso que as regras têm trava própria, provada com erro
  plantado.
- **A primeira subida do diário** carrega tudo o que a pessoa já registrou;
  uma falha no meio precisa retomar de onde parou, e não recomeçar nem
  duplicar.
- **Bibliotecas nativas no Expo SDK 57:** o cliente Supabase, o
  armazenamento seguro e os logins da Apple e do Google precisam ser
  conferidos na documentação versionada (AGENTS.md) antes de entrar.
- **O envio de e-mail** padrão do Supabase não serve nem para o
  desenvolvimento: num projeto gratuito novo ele não aceita o modelo com o
  código, manda um link, só entrega a membros da organização e tem limite
  de duas mensagens por hora (Emenda 3).
- **O projeto gratuito pausa** depois de dias parado.
- **A carga de exemplo tem médicos inventados**, e não pode ir para a
  produção: ela mora só no `seed.sql` do `morphi-dev`.

---

## Emendas

Feitas em 25/09/2026, na leitura do plano de implementação. O texto acima
já foi corrigido onde elas o contradiziam; aqui fica o porquê. Depois das
duas decisões, o plano, este desenho e o código passaram por duas rodadas
de revisão independente, e cada achado passou por um cético; o que
sobreviveu está aqui e no plano.

1. **A conta é obrigatória.** Decisão do dono: o diário precisa estar
   ligado a uma pessoa. Não há "Agora não" no fim do cadastro, e quem já
   usa o aplicativo sem conta cria a sua na primeira abertura depois da
   entrega. O que isso arrasta:
   - **em produção, a instalação nova nasce vazia** e cai no cadastro — a
     saída 2 do item 27 das pendências. A demonstração da Mariana passa a
     existir só no desenvolvimento, e é lá que ela nunca pede conta nem
     sobe;
   - a tranca olha o **dono do diário**, gravado no próprio estado, e não a
     sessão: sessão expirada não tranca ninguém;
   - o cadastro novo termina na conta, e por isso espera a conexão. Ao
     reabrir, a tranca **só fecha com conexão**, para quem já tem diário
     nunca ficar fora dele sem internet. Registrar nunca espera o
     servidor; só as ações que acontecem nele esperam;
   - o risco diante da regra 5.1.1(v) da App Store vai para as pendências.
2. **As perguntas ao companheiro sobem, numa tabela que a clínica não
   lê.** Decisão do dono: elas não interessam à clínica, mas nos servem
   para entender o uso do aplicativo. O que isso arrasta:
   - a tabela **só cresce**: no aparelho a lista guarda as 12 últimas, e
     sair dela não é apagar; cada pergunta leva a sua origem (digitada ou
     sugerida);
   - nós lemos **com um papel de leitura próprio, por uma visão sem o
     `user_id`**; nem a equipe nem a chave secreta têm permissão na tabela;
   - como é texto de saúde com uma finalidade nova, e a conta é obrigatória,
     embutir essa leitura no aceite geral faria dela a condição para usar o
     diário. Por isso, **até a revisão jurídica dizer outra coisa**, ela é
     uma escolha própria, desligada por padrão, cuja recusa não tranca
     nada — e só lemos as perguntas de quem disser sim. A escolha fica no
     servidor e a regra do banco a confere; ela se muda a qualquer momento
     em `/privacidade`, e desligar apaga as que subiram. A pendência
     bloqueia a publicação.
3. **O que a pesquisa da documentação mudou**, com o motivo de cada um na
   seção "Antes de tudo" do plano:
   - sem os armazenamentos `fotos` e `documentos`, porque nenhum registro
     tem arquivo hoje;
   - a chave pública é a nova, `publishable`;
   - o serviço de envio de e-mail vira pré-requisito da conta, e não só da
     produção;
   - o tempo real é por Broadcast, com a mensagem levando só a tabela e o
     id;
   - o Google depende da build de desenvolvimento;
   - o aviso de exemplo vem do dado;
   - a identidade do item, no aparelho, se chama `rid`, porque metas e
     alertas já têm um `id`;
   - `customSyms` vai para o perfil;
   - o fim do vínculo não abre `/suspenso` enquanto a cobrança não
     existir.
