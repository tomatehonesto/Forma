# Plano — o Supabase como ponte

**Desenho:** [`../specs/2026-09-25-supabase-ponte-design.md`](../specs/2026-09-25-supabase-ponte-design.md)
**Data:** 25 de setembro de 2026
**Projeto de desenvolvimento:** `morphi-dev`, ref `kjagyoqykhysvasauzgo`, São Paulo

Oito fases. Cada uma termina num commit que passa nas conferências de sempre
e num aplicativo que funciona. Tudo o que é novo fica atrás de **um
interruptor só**, que a fase 8 liga no mesmo commit que troca os textos. É
o "tudo de uma vez" do desenho: a pessoa recebe a conta, o diário guardado,
a rede e o vínculo na mesma entrega. Os commits do caminho são para o
desenvolvimento.

A ordem segue a regra do plano anterior: primeiro o que não muda nenhum
pixel. As fases 1 a 3 constroem o banco, o cliente e o miolo da
sincronização. A 4 é a primeira que se vê.

**Revisado na leitura.** Duas decisões do dono entraram depois da primeira
versão: a conta obrigatória e as perguntas ao companheiro subindo. Depois
delas, o plano passou por duas rodadas de revisão independente:
- na primeira, três revisores leram o plano, o desenho e o código, um pela
  coerência, um pelo código e um pela privacidade;
- na segunda, um conferiu se cada achado confirmado foi tratado, e outro
  releu tudo do zero.

Cada achado passou por um cético antes de entrar, e o que sobreviveu está
incorporado abaixo.

---

## Antes de tudo: o que a pesquisa mudou no desenho

Li a documentação atual do Supabase, a do Expo SDK 57 e o código antes de
planejar. Dez coisas do desenho mudam, e cada uma tem um motivo:

1. **Nenhum registro tem arquivo hoje.** As fotos de progresso estão
   desligadas (`S.photos` fica vazio e nada o lê). `documents` e
   `examBundles` só guardam nome, data e origem, sem arquivo. A única
   imagem do estado é a foto do perfil: 256 px em base64, encolhida de
   propósito (`perfil.tsx`). Por isso **os armazenamentos `fotos` e
   `documentos` e a fila de arquivos ficam de fora desta entrega**. A foto
   do perfil viaja dentro de `perfis.pessoal`, como mora hoje. Os dois
   armazenamentos voltam quando algum registro tiver arquivo.
2. **A chave pública é a nova, "publishable".** A variável é
   `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; o desenho dizia `ANON_KEY`, o
   nome da chave antiga. A chave secreta (`sb_secret_…`) continua sem
   entrar no aplicativo, no repositório e na conversa.
3. **O e-mail do código precisa de um serviço de envio desde já, e não só
   para a produção.** Projetos gratuitos criados depois de 03/06/2026 não
   podem editar os modelos de e-mail no envio padrão do Supabase. Sem isso,
   o e-mail leva um link, e não os 6 dígitos. O envio padrão também só
   entrega para membros da organização, duas mensagens por hora. **O
   serviço de envio e o domínio verificado passam a ser pré-requisito da
   fase 4.** E o modelo é um só para seis idiomas: ele escolhe o texto pelo
   `idioma` que o aplicativo manda junto quando pede o código.
4. **O tempo real é por Broadcast, e não por "Postgres Changes".** A
   documentação atual recomenda Broadcast, e há um motivo além da escala:
   no Postgres Changes o evento de exclusão não passa pelas regras de
   acesso. **A mensagem de tempo real leva só a tabela e o id**, sem
   nenhum dado de saúde. O conteúdo desce pela leitura normal, com as
   regras de sempre.
5. **O Google não roda no Expo Go.** As duas bibliotecas que a Expo indica
   exigem build de desenvolvimento. A escolhida é
   `react-native-nitro-google-signin` (licença MIT, usa o Credential
   Manager do Android e é feita em Nitro, que o projeto já tem). O botão só
   aparece onde funciona, o que o torna uma fase à parte (a 5), dependente
   do item 16 das pendências. **A Apple funciona no Expo Go.** O Supabase
   aceita o token se `host.exp.Exponent` estiver na lista de IDs (só no
   `morphi-dev`).
6. **O aviso "Clínicas de exemplo" vem do dado**, e não de qual projeto
   está ligado. A clínica ganha a coluna `exemplo`, que só a semente do
   `morphi-dev` marca. O aviso aparece porque as clínicas **são** de
   exemplo, em qualquer projeto.
7. **A identidade do item se chama `rid`, e não `id`.** Metas e alertas já
   têm um `id` com outro sentido (`'g3'`, `'al-dose'`), que vai para
   endereço de tela. `rid` é o id do registro no banco, sem sentido nenhum
   no aplicativo.
8. **Lista de texto solto não tem onde pôr identidade.** `customSyms` é
   `string[]` (`['Refluxo']`), e por isso vai para a parte `tratamento` do
   perfil, e não para `registros`. A trava da tradução (fase 3) acha as
   outras listas assim, se houver.
9. **O fim do vínculo não abre `/suspenso` enquanto a cobrança não
   existir.** O desenho dizia "sem assinatura, abre `/suspenso`". Mas sem
   cobrança ninguém tem assinatura, e abri-la só para quem perdeu o
   vínculo trancaria uma pessoa enquanto todas as outras sem vínculo
   entram. A tela abre sozinha no dia em que o portão da cobrança existir,
   porque ele pergunta a `acessoDe`. Até lá, quem perde o vínculo recebe um
   aviso.
10. **Sem biblioteca de conexão.** A falha de rede já é o sinal de "sem
    internet", e a espera crescente do desenho cobre o "quando a conexão
    voltar". É uma dependência a menos.

E quatro coisas que o desenho não dizia e o plano decide:

- **Apagar um registro limpa o conteúdo dele no servidor.** A linha fica,
  para o outro aparelho saber, mas `dados` vira `{}`. É o que "apagar"
  quer dizer, e a clínica, que vê a versão atual, vê o apagado.
- **O diário do aparelho tem dono**, gravado no próprio estado
  (`S.conta`). Se a sessão cair e outra conta entrar no mesmo aparelho,
  nada sobe para a conta errada: o aplicativo pede para entrar com a conta
  dona do diário, ou para sair e começar de novo.
- **Dois diários não se misturam.** Quem já usa o aplicativo sem conta e,
  ao criar a conta, entra numa que já tem diário escolhe um dos dois. A
  mistura é outro projeto.
- **A prova do consentimento é do servidor.** A versão aceita sobe do
  aparelho, mas a hora em que o servidor a recebeu é carimbada por ele, e a
  versão nunca diminui (ela desce para um aparelho novo, como o resto do
  perfil). Cabe a nós provar o consentimento, e um registro que a própria
  pessoa pode reescrever não prova nada.

---

## As decisões da leitura

### 1. A conta é obrigatória

Não há "Agora não". O motivo do dono: o diário precisa estar ligado a uma
pessoa. Consequências:

- **O cadastro só termina com a conta.** O cadastro leva a
  `/planos?de=cadastro`. Dali, com o diário sem dono, toda saída que
  entraria no aplicativo vai a `/conta?de=cadastro`, com ou sem internet. A
  tela `/conta` não tem saída que não seja criar a conta ou entrar numa.
- **Em produção, a instalação nova passa a nascer vazia.** Hoje toda
  instalação nova abre na demonstração da Mariana, com `onboardDone`
  verdadeiro (`store.ts`, `hydrate`; PENDENCIAS, item 27). Com a conta
  obrigatória, isso seria a porta para usar o aplicativo sem conta. Na
  fase 8, junto com o interruptor, a instalação nova fora de `__DEV__`
  nasce de `estadoVazio()` e cai no cadastro. É a "saída 2" do item 27.
  **A Mariana passa a existir só no desenvolvimento.**
- **O portão ganha duas trancas novas**, descritas inteiras na seção "As
  trancas do portão": a do consentimento novo (fase 8) e a da conta. A da
  conta cobre quem reabre o aplicativo sem ter conta, inclusive **quem já
  usa o aplicativo hoje**: na primeira abertura depois da entrega, essa
  pessoa cria a conta, e o diário dela sobe. O desenho dizia que ela
  "continua funcionando igual", com um convite no Perfil. Isso sai.
- **A tranca olha o dono do diário, e não a sessão.** Uma sessão que
  expirou não tranca nada: a pessoa tem conta, o aplicativo segue
  funcionando, e a linha de estado pede para entrar de novo. O dono mora
  em `S.conta`, que `hydrate` já lê junto com o resto, sem esperar a
  sessão nem a rede.
- **Ao reabrir, a tranca da conta só fecha com conexão.** Registrar nunca
  espera o servidor, e trancar sem internet deixaria alguém fora do
  próprio diário, sem poder registrar a dose. Sem conexão, o aplicativo
  abre com um aviso ("Sem internet — criamos a sua conta quando a conexão
  voltar"), e a tranca fecha na próxima abertura com rede. Esperam a
  conexão só as ações que acontecem no servidor: criar a conta ou entrar
  nela, apagar a conta, e conferir ou usar um código de clínica.
- **A semente só existe no desenvolvimento, e nunca pede conta nem sobe.**
  - `buildSeed` grava `semente: true`.
  - `estadoVazio` **parte de `buildSeed`** e herdaria a marca. Por isso
    ele grava `semente: false` de forma explícita, antes do
    `return ensureDefaults(S)`. Isso vale para todo caminho que passa por
    ele: o cadastro, "Apagar meus dados", "Sair da conta" e "Já tenho
    conta".
  - Fora de `__DEV__`, a marca não isenta nada. Um estado gravado com
    `semente: true` numa build de loja (quem instalou antes e nunca se
    cadastrou) vai para o cadastro.
- **O código de clínica do plano vira vínculo logo depois**, quando a
  conta nasce.
- ⚠️ **Risco conhecido: a regra 5.1.1(v) da App Store.** Ela aceita login
  obrigatório quando o aplicativo tem recursos que dependem de conta. Aqui
  eles existem: o diário guardado entre aparelhos e o vínculo com a
  clínica. Mesmo assim, a revisão pode perguntar. O risco vai para as
  pendências, com a resposta pronta.

### 2. As perguntas ao companheiro sobem para nós, e a clínica não lê

`asked` guarda as perguntas feitas ao companheiro, com a hora. Elas sobem
para uma tabela própria, `perguntas`, e não para `registros`.

- **`perguntas` só cresce.** No aparelho, `asked` é uma janela: guarda as
  12 últimas e tira a repetida (`companion.tsx:251`). Se a sincronia
  tratasse quem sai da janela como apagado, a 13ª pergunta apagaria a
  primeira no servidor, e ele nunca teria mais de 12 por pessoa. Então
  sair da janela não é apagar: cada pergunta é uma linha, a repetida é uma
  linha nova, e o conteúdo nunca muda depois de subir. Ao descer, o
  aplicativo remonta a janela das 12 últimas.
- **Cada pergunta leva a sua origem: `digitada` ou `sugerida`.** Sem isso,
  não há como mapear o uso, porque as sugestões do aplicativo se
  misturariam com as dúvidas de verdade. A origem é gravada no aparelho,
  em cada item de `asked`, por quem faz a pergunta (fase 3).
- **A clínica não lê, por construção.** A tabela não tem regra para a
  equipe. Também não tem `grant` para a chave secreta, então nem uma
  função do servidor nem o futuro portal a leem. A trava das regras afirma
  as duas coisas, cada uma com o seu mutante.
- **Nós lemos com um papel de leitura próprio**, `analise_perguntas`, que
  só enxerga uma visão sem o `user_id` e só com as perguntas de quem deixou.
  Não é pela chave secreta, nem pelo papel `postgres` do painel, que lê
  tudo.
- **A pessoa leva todas as suas perguntas no "Exportar"**, e apagar a conta
  leva todas.

⚠️ **É uma finalidade nova, sobre texto de saúde, e o consentimento
precisa ser livre.** A pergunta costuma falar de sintoma, de dose e de
medo. Usá-la para entender o uso pede consentimento específico e destacado
(LGPD, art. 11, I). E, como a conta é obrigatória, embutir essa finalidade
no aceite geral faria dela a condição para usar o diário. Um consentimento
assim dificilmente é livre (art. 5º, XII).

Por isso, **até a revisão jurídica dizer outra coisa**, o plano faz assim:
- a leitura das perguntas é **uma escolha própria**, no mesmo passo do
  consentimento, **desligada por padrão**;
- a escolha fica no servidor (`perfis.perguntas_para_uso`, com a hora
  carimbada por ele), e a regra de `insert` de `perguntas` exige que ela
  esteja ligada;
- recusar não tranca nada, e quem recusa guarda as perguntas só no
  aparelho, como hoje;
- ligar sobe também as perguntas que estão no aparelho (as até 12);
- desligar, a qualquer momento, em `/privacidade`, apaga as que já
  subiram. É a revogação que a LGPD garante (art. 8º, § 5º).

Assim, se a revisão permitir outra forma, muda o padrão e a tela, e o
motor fica como está. **Consequência: só lemos as perguntas de quem
disser sim.** A pendência vai para "🔴 Bloqueia a publicação", ao lado do
item 2.

---

## O interruptor

`src/logic/nuvem.ts` exporta:

```ts
/** A nuvem só existe com as duas variáveis de ambiente. */
export const nuvem = (): SupabaseClient | null => …
/** ⚠️ Fica falso até a fase 8, que o liga junto com os textos. */
const NUVEM_PARA_TODOS = false;
export const contaLigada = () => !!nuvem() && (__DEV__ || NUVEM_PARA_TODOS);
```

Toda porta nova pergunta a `contaLigada()`: a conta no fim do cadastro,
"Já tenho conta", as duas trancas novas do portão, a linha de estado, a
vitrine lida do banco, a conferência do código e a instalação nova vazia.

- **Em desenvolvimento** (`__DEV__`, o Expo Go do dono) as portas aparecem
  a partir da fase 4. Durante as fases 4 a 7, os textos legais que o dono lê
  no aparelho dele estão atrasados em relação ao que o aplicativo faz. É o
  preço de não escrever tudo num commit só, e ele fica dentro do
  desenvolvimento.
- **Em build de loja**, nada muda até a fase 8. Depois dela, sem as
  variáveis do projeto de produção, `nuvem()` continua nulo.
- ⚠️ **Os textos da fase 8 não passam pelo interruptor.** A Política, os
  Termos e o consentimento novo descrevem a nuvem para todas as builds.
  Por isso, **nenhuma build fora de `__DEV__` (prévia, TestFlight ou loja)
  sai do commit da fase 8 antes da virada para a produção** (a seção
  "Depois do plano"). As variáveis de produção no EAS são a condição para
  a primeira build distribuída.

---

## As trancas do portão

Hoje o `Portao` (`_layout.tsx:59`) tem uma tranca: sem `onboardDone`,
qualquer segmento que não seja `cadastro` volta para `/cadastro`. Com as
duas novas, a regra inteira fica assim:

**Cada tranca tem uma condição e uma lista. A primeira cuja condição vale
decide sozinha: se o segmento atual está na lista dela, fica; senão, vai
ao destino dela. As de baixo não são avaliadas.** O comentário do `Portao`
passa a dizer exatamente isso.

| # | condição | destino | deixa ficar |
|---|---|---|---|
| 1 | `!onboardDone` | `/cadastro` | `cadastro`, `conta`, `documento` |
| 2 | fase 8: `contaLigada()`, `onboardDone`, a versão aceita é menor que `VERSAO`, e o estado não é a semente de desenvolvimento | a folha do consentimento novo | a folha, `documento`, `exportar` |
| 3 | `contaLigada()`, `onboardDone`, sem `S.conta`, o estado não é a semente de desenvolvimento, **e há conexão** | `/conta?de=cadastro` | `cadastro`, `planos`, `codigo`, `conta`, `documento`, `exportar`, a folha |

- **A tranca 1 ganha `conta` e `documento`.** Sem isso, "Já tenho conta"
  na abertura do cadastro, onde `onboardDone` é falso, voltaria na hora
  para o cadastro. O mesmo aconteceria com os links dos Termos e da
  Política.
- **A tranca 2 exige `onboardDone`.** Sem isso, um cadastro novo, que
  ainda não tem consentimento nenhum, seria levado à folha no meio das
  perguntas. O consentimento dele é o último passo do cadastro.
- **A tranca 3 deixa ficar `cadastro`, `planos` e `codigo`.** O `salvar`
  do cadastro põe `onboardDone` verdadeiro antes da devolutiva, de
  `/planos` e de `/codigo` (`cadastro.tsx:1246` e `:1410`). Sem essas
  exceções, a tranca levaria a pessoa à conta antes de ela escolher o
  plano. O caminho do cadastro até a conta é a saída de
  `/planos?de=cadastro` (a decisão 1). A tranca 3 cobre quem reabre o
  aplicativo, e por isso só fecha com conexão.
- **"Apagar meus dados" e "Sair da conta" levam ao cadastro, e não à
  conta.** O estado vazio tem `onboardDone` falso, e a tranca 1 vem
  primeiro.
- **"Há conexão"** é uma consulta curta ao endereço de saúde da
  autenticação, na abertura e na volta ao aplicativo. Enquanto ela não
  responde, a tranca 3 não fecha.

---

## O que depende do dono, e quando

Nenhum segredo passa pela conversa. A senha do banco, a chave secreta e a
senha do papel de leitura ficam no painel, no terminal e no gerenciador de
senhas do dono.

| antes de | o quê | onde |
|---|---|---|
| passo 1.2 | `npx supabase login` no terminal dele. A autorização é dele, e os comandos da CLI passam a usá-la | terminal |
| fase 4 | **o serviço de envio de e-mail e o domínio de envio verificado** (item 3 acima; o domínio é o item 1 das pendências). Sugestão: **Amazon SES em São Paulo (`sa-east-1`)**, que mantém o e-mail no Brasil e fecha a pendência da transferência internacional. As credenciais SMTP são digitadas no painel | Supabase → Authentication → Emails → SMTP |
| fase 4 | os dois modelos de e-mail ("Magic link" e "Confirm signup"), colados de `supabase/modelos/codigo.html`; código de **6** dígitos; validade de **600 s** | Authentication → Emails; Sign In / Providers → Email |
| fase 4 | Apple ligada, com Client IDs `com.morphihealth.app,host.exp.Exponent`. Login nativo não precisa de Services ID nem de chave `.p8` | Sign In / Providers → Apple |
| fase 5 | o item 16 das pendências (`eas init`, iPhone registrado, conta paga de desenvolvedor Apple); no Google Cloud, a tela de consentimento e três clientes OAuth (web, iOS e Android com o SHA-1); no Supabase, o Google com os IDs, o da web primeiro | EAS, Google Cloud, painel |
| fase 7 (⏸️ adiada) | desligar "Allow public access" do Realtime, para só haver canal privado — só quando a fase voltar | Realtime → Settings |
| fases 4 e 6 | digitar no navegador de testes o código que chegar no e-mail dele, quando eu pedir | navegador |
| quando for ler as perguntas | dar login e senha ao papel `analise_perguntas`, no editor SQL; a senha fica no gerenciador dele | painel |

---

## Fase 1 — o banco

**Nada muda no aplicativo.** É a fase do contrato: o esquema, as regras e
a trava delas.

⚠️ **Não há Docker nesta máquina**, então `db pull`, `db diff`, `db reset`
e `test db` não rodam. Duas consequências:

- as migrações são escritas à mão;
- **o esquema do `morphi-dev` nunca muda pelo painel**, porque não haveria
  como trazer a mudança de volta.

Todo o resto passa pela API de gestão com o login do dono: `db push`,
`db query --linked`, `db advisors` e `functions deploy --use-api`.

1. **A CLI como dependência do projeto:**
   `npm install --save-dev --save-exact supabase@2.118.0` (a versão do dia;
   o lockfile vai junto). Todo comando é `npx supabase …`, e flag nenhuma
   entra sem passar pelo `--help` da versão fixada.

2. **`npx supabase init`**, que cria `supabase/config.toml` e o
   `.gitignore` dele. O dono roda `npx supabase login`, e eu ligo o
   projeto com `npx supabase link --project-ref kjagyoqykhysvasauzgo`,
   deixando a senha em branco.

3. **Provar o arreio antes de escrever regra.** Um arquivo descartável,
   rodado com `npx supabase db query --linked -f`, com seis passos:
   - `begin`;
   - uma tabela temporária;
   - um usuário falso inserido em `auth.users`;
   - `set_config('role', 'authenticated', true)`;
   - `set_config('request.jwt.claims', …)` e `auth.uid()` devolvendo o
     usuário falso;
   - `rollback`.

   Anoto aqui, como "⚠️ CORRIGIDO AO EXECUTAR", o que a saída mostra: se o
   endpoint devolve o último `select`, como ele trata várias instruções, o
   código de saída num `raise`, e se nada ficou no banco.
   **Se `begin/rollback` não funcionar por ali**, a trava vira um bloco
   `do $$ … $$` que termina num `raise` com um sentinela, e a exceção
   desfaz tudo.

4. **As migrações**, cada uma criada com `npx supabase migration new`.

   **Toda chave estrangeira para `auth.users` diz o que acontece quando a
   conta some.** Sem isso, `deleteUser` falha para quem já usou um código,
   ou deixa linhas para trás:
   - `on delete cascade`: `perfis.user_id`, `registros.user_id`,
     `perguntas.user_id`, `vinculos.paciente_id` e o `paciente_id` das
     tabelas da clínica;
   - `on delete set null`: `convites.usado_por` e
     `profissionais.user_id`;
   - o `vinculo_id` das tabelas da clínica acompanha o vínculo
     (`on delete cascade`).

   **a. `perfis_e_registros`**
   - O esquema `private`: `revoke all … from public`, e `usage` para
     `anon` e `authenticated`. Ele não é exposto pela API.
   - A tabela `perfis`, com:
     - `user_id` como chave;
     - seis partes `jsonb`, cada uma com o seu `<parte>_em`;
     - `versao_consentimento`, `consentido_em` (a hora que o aparelho
       declara) e **`consentimento_registrado_em`**, que só o servidor
       escreve;
     - **`perguntas_para_uso`** (`boolean not null default false`, a
       escolha da decisão 2) e **`perguntas_para_uso_em`**, que só o
       servidor escreve;
     - `criado_em` e `atualizado_em`.
   - A tabela `registros`, com as colunas do desenho, mais:
     - `check` do `tipo` contra a lista da tradução;
     - `check (octet_length(dados::text) <= 65536)`, para ninguém guardar
       arquivo em `dados`.
   - A tabela `perguntas` (a decisão 2):
     - `id` (o `rid`), `user_id`, `quando` e `texto` (com o mesmo teto de
       tamanho);
     - `origem`, com `check (origem in ('digitada', 'sugerida'))`, e nula
       nas perguntas feitas antes desta entrega;
     - `criado_em`, carimbado pelo servidor (`clock_timestamp()`), e que o
       cliente não escreve.

     **Não tem `update`**: o conteúdo de uma pergunta nunca muda.
   - A visão `private.perguntas_para_leitura`: `quando`, `texto` e
     `origem`, **sem o `user_id`**, e só das pessoas com
     `perguntas_para_uso` ligado. Ela roda com os direitos da dona, e por
     isso recebe `revoke all … from public, anon, authenticated,
     service_role`.
   - O papel **`analise_perguntas`**: `nologin`, sem `bypassrls`, com
     `usage` em `private` e `select` só na visão. A senha nunca entra no
     repositório: quando alguém for ler, o dono liga o login e dá a senha
     no editor SQL. Ele mesmo pode ler com `set role analise_perguntas`.
   - Os gatilhos:
     - `atualizado_em = clock_timestamp()` a cada escrita (o relógio do
       aparelho não decide nada);
     - o `<parte>_em` de cada parte que mudou;
     - apagado: carimba `apagado_em` e limpa `dados`;
     - consentimento: quando `versao_consentimento` sobe, carimba
       `consentimento_registrado_em`; se ela tentar diminuir, recusa;
     - quando `perguntas_para_uso` muda, carimba `perguntas_para_uso_em`.
   - Os índices: `registros (user_id, atualizado_em)`,
     `perguntas (user_id, criado_em)` e `perfis (atualizado_em)`.

   **b. `rede`**
   - A tabela `clinicas`, com os campos de `Clinica` em `logic/rede.ts`,
     mais `publicada` e `exemplo`.
   - A tabela `profissionais`, com `user_id`.
   - A tabela `equipe`: `clinica_id`, `profissional_id`, `papel` e `ativo`.
   - Os ids são uuid, e a semente usa uuids fixos.

   **c. `ponte`**: as tabelas `convites` e `vinculos` do desenho, e o
   índice único parcial `vinculos (paciente_id) where encerrado_em is null`.

   **d. `da_clinica`**: as tabelas `mensagens`, `receitas`, `consultas`,
   `planos_da_equipe` e `materiais`.
   - Cada uma leva `vinculo_id`, `paciente_id` e `atualizado_em` carimbado
     pelo servidor.
   - `materiais.paciente_id` é nulo quando o material vale para todos os
     pacientes da clínica.

   **e. `funcoes_do_convite`**: as três funções da Peça 5, descritas
   abaixo.

   **f. `tempo_real`**: os gatilhos de Broadcast e as políticas em
   `realtime.messages`, descritos abaixo.

   **g. `armazenamento_da_rede`**: o balde `clinicas`, público para
   leitura. As escritas nascem com o portal; no `morphi-dev`, as fotos
   sobem pela CLI (fase 6, passo 7).

   O que as migrações a até f dizem sobre acesso está no passo 5.

5. **As permissões e as regras.** A exposição automática está desligada
   no projeto, então **cada tabela precisa do seu `grant`**. Sem ele a API
   devolve `42501`, que é o comportamento certo para o que não foi
   concedido. E toda tabela tem RLS ligada, de forma explícita.

   **Quem pode o quê:**

   | tabela | `anon` | `authenticated` |
   |---|---|---|
   | `perfis` | — | `select`, `insert`, e `update` das partes, de `versao_consentimento`, de `consentido_em` e de `perguntas_para_uso`. **Nunca das duas colunas que o servidor carimba** |
   | `registros` | — | `select`, `insert`, `update` (sem `delete`: apagar é marcar; a linha só sai com a conta, pela cascata) |
   | `perguntas` | — | `select`, `insert` e `delete`. Sem `update` |
   | `clinicas`, `equipe` | `select` | `select` |
   | `profissionais` | `select` só das colunas públicas: id, nome, foto, especialidades, conselho, região, registro e RQE. **`user_id` fica de fora** | igual |
   | `convites` | — | `select`, `insert` (a equipe, pelo portal) |
   | `vinculos` | — | `select`. Criar e encerrar, só pelas funções |
   | `mensagens`, `receitas` | — | `select`, `insert`, e `update` só da coluna que o paciente mexe (`lida_em`, `renovacao_pedida_em`) |
   | `consultas`, `planos_da_equipe`, `materiais` | — | `select`, `insert`, `update` |

   `service_role` recebe tudo, para as funções do servidor, **menos
   `perguntas` e a visão**. A cascata de `deleteUser` continua apagando as
   perguntas, porque a ação da chave estrangeira roda como dona da tabela.

   **As funções que decidem, em `private`**, todas `stable security
   definer set search_path = ''`:

   ```sql
   -- as clínicas em que quem pergunta é da equipe, AGORA
   create function private.minhas_clinicas() returns setof uuid … as $$
     select e.clinica_id from public.equipe e
     join public.profissionais p on p.id = e.profissional_id
     where p.user_id = (select auth.uid()) and e.ativo
   $$;

   -- a regra do prontuário: vínculo ativo, tudo; encerrado, só até o fim;
   -- sem momento (perfil, favoritos), só com vínculo ativo
   create function private.equipe_le(paciente uuid, momento timestamptz)
   returns boolean … as $$
     select exists (
       select 1 from public.vinculos v
       where v.paciente_id = paciente
         and v.clinica_id in (select private.minhas_clinicas())
         and (v.encerrado_em is null
              or (momento is not null and momento <= v.encerrado_em)))
   $$;
   ```

   Mais quatro, no mesmo molde:
   - `equipe_le_vinculo(vinculo)`, que vale ativo ou encerrado;
   - `equipe_escreve(vinculo, paciente)`, que só vale com vínculo ativo;
   - `meu_vinculo_ativo()`;
   - `minhas_clinicas_de_paciente()`: as clínicas dos vínculos de quem
     pergunta, ativos e encerrados.

   Todas recebem `revoke execute … from public, anon`, e `grant` só para
   `authenticated`.

   **As políticas**: uma por operação, sempre `to authenticated`, com a
   dona embrulhada em `(select auth.uid())`:

   - **`registros`**
     - leitura da dona: `user_id = (select auth.uid())`;
     - leitura da equipe: `private.equipe_le(user_id, quando)`;
     - escrita só da dona, com `with check` no `insert` e no `update`,
       para ninguém mudar o dono de uma linha.
   - **`perfis`**: igual, com `private.equipe_le(user_id, null)`. Depois do
     fim, a equipe lê o perfil só por `vinculos.perfil_no_fim`.
   - **`perguntas`**
     - leitura e `delete` só da dona;
     - `insert` só da dona, **e só com `perguntas_para_uso` ligado no
       perfil dela**, conferido na própria regra;
     - **nenhuma política para a equipe.** Essa ausência, com a falta de
       `grant` para `service_role`, é o que faz a clínica não ler.
   - **`vinculos`**: o paciente lê os seus; a equipe lê os da sua
     clínica.
   - **as da clínica**
     - o paciente lê o que é dele (e `materiais` de toda a clínica do seu
       vínculo ativo);
     - o paciente escreve mensagem só como `autor = 'paciente'`, no seu
       vínculo ativo;
     - a equipe lê por `equipe_le_vinculo`, e escreve por
       `equipe_escreve`.
   - **`convites`**: a equipe lê e cria só os da sua clínica.
   - **a vitrine** (`anon` e `authenticated`):
     - clínicas com `publicada`;
     - a equipe ativa delas;
     - os profissionais que estão numa equipe ativa de clínica publicada.
   - **a ficha da própria clínica** (`authenticated`): o paciente lê a
     clínica, a equipe e os profissionais (as colunas públicas) das
     clínicas dos seus vínculos, ativos e encerrados, **publicadas ou
     não**. Sem isso, uma clínica que sai da vitrine sumiria do aplicativo
     de quem ela acompanha, e as mensagens chegariam de autores que o
     aparelho não sabe quem são.

   Os índices de cada coluna que uma regra lê: `vinculos (clinica_id)`,
   `equipe (profissional_id)`, `profissionais (user_id)` e os `vinculo_id`.

   **As funções que o aplicativo chama.** Cada uma tem duas camadas:
   - em `public`, uma casca `security invoker`, que é a porta da API;
   - em `private`, o miolo `security definer`, que confere
     `auth.uid()` antes de tudo.

   Nenhuma função `security definer` fica num esquema exposto.

   - **`conferir_convite(codigo)`** (`anon` e `authenticated`):
     - normaliza o código;
     - devolve a clínica e o profissional (campos públicos) se o código
       existe, não expirou, é de clínica publicada e não foi usado, ou foi
       usado por quem pergunta;
     - senão, nulo.

     Nunca lista.
   - **`usar_convite(codigo, versao)`** (`authenticated`). Numa transação:
     - trava o convite (`for update`);
     - encerra o vínculo ativo anterior, com cópia do perfil, se for troca
       de clínica;
     - cria o novo, com a versão do consentimento e a hora;
     - marca o código.

     Chamar de novo com o mesmo código não cria um segundo vínculo.
   - **`encerrar_vinculo(vinculo default null)`** (`authenticated`):
     - pelo paciente, encerra o dele (`encerrado_por = 'paciente'`);
     - por alguém da equipe ativa da clínica, encerra aquele
       (`'clinica'`), que é a porta do portal, pronta antes dele;
     - copia `perfis` para `perfil_no_fim`. As perguntas não estão em
       `perfis`, e por isso não vão junto.

   **O tempo real.** Gatilhos em `private` chamam `realtime.send` com o
   conteúdo `{tabela, id}`:

   | quando muda | para o canal |
   |---|---|
   | o que a clínica escreve para o paciente, e o vínculo dele | `paciente:<uuid>` |
   | um registro ou o perfil de quem tem vínculo ativo (o sintoma no portal, na hora). Uma pergunta, nunca | `clinica:<uuid>` |

   As políticas em `realtime.messages` comparam o tópico por texto:
   `'paciente:' || auth.uid()` para o paciente, e a lista de
   `minhas_clinicas()` para a equipe. Não há cast, que quebraria num tópico
   malformado. Ninguém recebe política de `insert`, então nenhum aparelho
   transmite.

   **Subir:** `npx supabase db push --dry-run`, conferir, e depois
   `npx supabase db push`.

6. **`npx supabase db advisors --linked`** (conferir as flags no
   `--help`). A meta é **zero avisos de segurança**. Um aviso de
   desempenho que fique precisa ter o motivo escrito na migração.

7. **`supabase/seed.sql`: a rede de exemplo.**
   - O que entra: as oito clínicas, os nove profissionais e os oito
     códigos, com `exemplo = true` e `publicada = true`.
   - De onde vem: gerado uma vez a partir de `EXEMPLO` e
     `CONVITES_DE_EXEMPLO`, por um script de rascunho que não entra no
     repositório. Dali em diante, a fonte é o arquivo.
   - É idempotente: `on conflict do update`, e ele devolve os códigos de
     exemplo a "não usados", para o teste de conectar poder se repetir.
   - Sobe com `npx supabase db query --linked -f supabase/seed.sql`, e
     **nunca** com `--include-seed`, que roda cada arquivo uma vez só e
     depois ignora as mudanças.

8. **A trava das regras: `supabase/testes/regras.sql` +
   `scripts/regras.mjs`.**
   - As contas de teste nascem dentro da transação e morrem no `rollback`:
     paciente A, paciente B, profissional da clínica X, profissional da
     clínica Y e profissional que saiu da equipe de X.
   - Nenhuma senha é necessária, porque o arreio finge o JWT.
   - O executor **se recusa a rodar** se `supabase/.temp/project-ref` não
     for `kjagyoqykhysvasauzgo`, para que a trava nunca toque a produção.

   As afirmações, cada uma com a sua frase:
   - A não lê, não escreve e não apaga nada de B;
   - A não troca o dono de uma linha dela para B (o `with check`);
   - o profissional de X lê o diário e o perfil de A com vínculo ativo,
     **inclusive o de antes do vínculo**;
   - depois do fim, lê só os registros com `quando` até o fim, e nenhum sem
     `quando`; o perfil, só pela cópia;
   - o profissional que saiu da equipe não lê mais nada;
   - **as perguntas:**
     - o profissional de X não lê as de A, nem com vínculo ativo;
     - o canal da clínica não recebe evento de pergunta;
     - `service_role` recebe `42501` em `perguntas`;
     - com a escolha desligada, o `insert` de A em `perguntas` falha;
     - A não muda uma pergunta que já subiu; apaga as suas, e nenhuma de B;
     - a visão mostra as perguntas de A só com a escolha ligada, e sem o
       `user_id`;
     - `anon`, `authenticated` e `service_role` recebem `42501` na visão;
     - `analise_perguntas` lê a visão e recebe `42501` em `registros`,
       `perfis`, `mensagens` e `perguntas`;
   - A não escreve as colunas que o servidor carimba, e não diminui a
     versão do consentimento;
   - Y nunca lê A;
   - ninguém além de A escreve no diário de A;
   - sem login, a vitrine sim; as clínicas não publicadas, os convites e
     `profissionais.user_id`, não;
   - A lê a ficha e a equipe de X mesmo com X fora da vitrine, porque tem
     vínculo com ela; B, sem vínculo, não;
   - sem login, o código se confere e não se lista; código usado por outra
     pessoa é "não achamos";
   - `usar_convite` deixa um vínculo ativo só, e a troca encerra o anterior
     com a cópia;
   - A não cria nem encerra vínculo sem as funções, nem escreve mensagem
     como equipe;
   - a equipe escreve para A só com vínculo ativo;
   - A mexe numa receita só no pedido de renovação;
   - os tópicos de tempo real: A ouve só o seu canal; X, só o da sua
     clínica;
   - **apagar A de `auth.users`**, dentro da transação, não falha e não
     deixa linha de A em tabela nenhuma (a cópia `perfil_no_fim`
     inclusive), e o convite que A usou fica com `usado_por` nulo.

   **A porta da frente**, sem arreio. O executor também chama a API de
   verdade com a chave pública:
   - a vitrine responde;
   - `convites`, `registros` e `perguntas` respondem `42501`;
   - `conferir_convite` responde.

   É o que prova as permissões e a exposição, e não só as regras. O
   executor confere também que a lista de códigos de exemplo que fica no
   aplicativo (fase 6, passo 1) é igual à do `seed.sql`.

   **Os mutantes** ficam em `supabase/testes/mutantes/`: cada um é um trecho
   de SQL aplicado dentro da mesma transação, antes das afirmações. O
   executor exige que **cada um derrube pelo menos uma afirmação**.
   1. a regra da equipe sem o limite do fim;
   2. `using (true)` na leitura de `registros`;
   3. `equipe.ativo` ignorado;
   4. o `with check` removido do `update`;
   5. `conferir_convite` aceitando código usado;
   6. `grant select` de `convites` para `anon`;
   7. a leitura da equipe estendida a `perguntas`;
   8. o `grant` de `perguntas` devolvido a `service_role`;
   9. uma chave estrangeira sem a cascata (`registros.user_id`);
   10. a regra de `insert` de `perguntas` sem a escolha;
   11. o `delete` de `perguntas` sem o filtro da dona;
   12. a visão sem o filtro da escolha;
   13. `grant select` da visão para `authenticated`;
   14. `select` em `registros` para `analise_perguntas`;
   15. a ficha da própria clínica sem a política (A deixa de ler X fora da
       vitrine).

**Verificação:**
- `node scripts/regras.mjs`: todas as afirmações passam e os quinze
  mutantes são pegos;
- os avisos do passo 6 zerados;
- as conferências de sempre, que não mudam, porque `src/` não foi tocado.

### ⚠️ CORRIGIDO AO EXECUTAR (25/09/2026)

**O resultado:** as oito migrações estão no `morphi-dev`. As 128
afirmações passam, os 15 mutantes são pegos, e a porta da frente responde
certo nos 10 casos. Não há nenhum aviso de segurança, e o teste não deixou
nada no banco.

1. **O login da CLI nesta máquina era de outra conta**, a de outra
   organização, que não enxergava o `morphi-dev`. O dono entrou com a conta
   da Morphi, e o login novo enxerga as duas.
2. **A CLI 2.118 é um script de Node**, e não um executável baixado. Os
   scripts a chamam pelo próprio Node, sem shell no meio
   (`scripts/banco-dev.mjs`).
3. **O arreio, provado antes das regras.**
   - `db query --linked` roda como `postgres`;
   - o teste cria contas em `auth.users`;
   - a troca de papel e de JWT funciona, com `auth.uid()` certo;
   - **um arquivo com várias instruções roda numa transação só.**

   Por isso a trava é um bloco `do` que termina sempre num `raise`, e nada
   do que ela cria fica no banco.
4. **O ensaio virou modo do executor**: `node scripts/regras.mjs --ensaio`.
   - Ele manda num envio só as migrações que ainda não subiram, a
     semente, as regras e os mutantes, e desfaz tudo no fim.
   - Foi assim que as sete migrações rodaram inteiras antes do primeiro
     `db push`.
   - Sem Docker, **toda migração nova passa por ele antes de subir**. Um
     erro de SQL sai com o arquivo e a linha.
5. **O tempo real dorme.** `realtime.messages` é particionada por dia, e
   quem cria as partições é o próprio serviço de tempo real, quando alguém
   se conecta. Num projeto novo não havia partição nenhuma, e
   `realtime.send` engole o erro (ele troca a falha por um aviso).
   - Isso também quer dizer que uma falha do tempo real nunca impede um
     registro de ser gravado.
   - O executor agora acorda o serviço com uma conexão curta, com a chave
     pública, e a trava ganhou uma afirmação que diz quando ele não
     acordou.
   - ⚠️ **Na fase 7, com "Allow public access" desligado**, o despertar por
     canal público pode ser recusado. É preciso conferir se a recusa ainda
     acorda o serviço, ou acordar por um canal privado.
6. **O mutante 04 passava, e com razão.** Num update com filtro, o
   Postgres também confere a linha nova contra a regra de leitura. Por
   isso passar uma linha para outra conta já era barrado duas vezes, e
   afrouxar só o `with check` não aparecia. A trava ganhou o caso sem
   filtro, em que só o `with check` protege. O mutante passou a ser pego.
7. **O conselheiro de segurança acusou uma função do próprio Supabase.**
   `public.rls_auto_enable()`, da opção "RLS automática", é
   `security definer` e alcançável pela API.
   - A migração nova `rls_automatica_fora_da_api` tira o `EXECUTE` dela.
   - Antes, uma transação desfeita provou que a tabela nova continua
     nascendo com RLS.
   - Os 26 avisos de desempenho que ficaram são todos "índice não usado",
     só informativos: o banco acabou de nascer e não teve tráfego.
8. **`.env.development` veio para a fase 1.** A trava precisa do endereço
   e da chave pública para testar a porta da frente.
9. **A semente sobe por `node scripts/semente.mjs`**, que confere o
   projeto ligado antes, e não pelo comando cru.
10. **Duas coisas para a fase 6:**
    - a vitrine sem login não aceita `select *` em `profissionais`, porque
      o grant é por coluna, de propósito: a tela pede as colunas pelo nome;
    - `conferir_convite` já devolve a clínica no formato do tipo `Clinica`
      de `logic/rede.ts` (mais `exemplo`), para o aplicativo usar sem
      traduzir.

---

## Fase 2 — o cliente, a identidade dos itens e a marca da semente

**Nada muda na tela.**

1. **Instalar:**
   - `npx expo install expo-secure-store expo-crypto`, com as versões do
     SDK 57;
   - `npm install --save-exact @supabase/supabase-js@2.117.2 aes-js@3.1.2`.

   Três coisas ficam de fora:
   - **`react-native-url-polyfill`**, porque o SDK 57 já traz `URL` e
     `URLSearchParams`. A prova é o passo 6; se falhar no iPhone, ele
     entra;
   - **a opção `lock`**, que está obsoleta desde a supabase-js 2.107;
   - **`userStorage`**, que ainda é experimental.

2. **`.env.development`, versionado** (⚠️ feito na fase 1, que precisou
   dele para a trava), com as duas variáveis públicas do
   `morphi-dev` e um cabeçalho que diz por que elas podem estar ali: vão
   dentro do aplicativo de qualquer jeito, e quem protege o dado são as
   regras. `expo start` roda como desenvolvimento e lê esse arquivo; o
   `.env` do dono continua ignorado e continua valendo.
   `.env.example` ganha a explicação.
   ⚠️ `expo start --no-dev` roda como produção e **não** lê
   `.env.development` (a verificação da fase 8 depende disso).

3. **`src/logic/nuvem.ts` (novo).**
   - O cliente com `persistSession`, `autoRefreshToken` e
     `detectSessionInUrl: false`.
   - A sessão no padrão que a documentação do Supabase indica para o
     Expo: uma chave AES em `expo-secure-store` e a sessão cifrada no
     `AsyncStorage`, porque a sessão com dados da Apple ou do Google passa
     dos 2 KB que algumas versões do iOS recusavam. A chave nasce de
     `Crypto.getRandomBytes(32)`.
   - Na web, que é só a de testes, a sessão fica no `localStorage`.
   - `AppState` liga e desliga a renovação automática, como a
     documentação pede fora do navegador.
   - Exporta `nuvem()` e `contaLigada()`, o interruptor do alto.

4. **A identidade dos itens: `src/logic/identidade.ts` (novo).**
   - `carimbar(S, novoId)` põe um `rid` (uuid, de `Crypto.randomUUID`) em
     todo item de lista sincronizada que chegar sem um, inclusive nos
     aninhados (cada valor de `exams[].values` e cada medição de `vitals`)
     e em cada pergunta de `asked`.
   - A lista de caminhos mora em `src/logic/traducao.ts`, que nasce aqui
     só com ela.
   - É chamada em `ensureDefaults`, o que cobre os itens antigos na
     primeira abertura e também a semente, e em `update`, depois da
     mutação.
   - É idempotente: quem tem `rid` não é tocado.
   - Em `scripts/tsconfig.json`, `expo-crypto` ganha dublê em
     `scripts/duble/expo.ts`, com o `crypto` do Node.

5. **A marca da semente e o dono, em `src/logic/seed.ts`** (a decisão 1).
   - `buildSeed` grava `semente: true` e `conta: null`.
   - `estadoVazio` grava `semente: false` e `conta: null`, de forma
     explícita, antes do `return ensureDefaults(S)`. Ele parte de
     `buildSeed` e herdaria a marca.
   - **Um estado gravado antes disto, sem a marca**
     (`typeof S.semente !== 'boolean'`), é a semente só se as duas coisas
     forem verdade: não há `profile.consentimento` e o nome do perfil é o
     de uma das seis personas (`src/textos/<idioma>/semente.ts`). Só a
     falta de consentimento não basta: o cadastro já trancava a porta
     antes de gravar o consentimento (commits de 16 e 18/09). Qualquer
     outro estado é de alguém, e recebe `semente: false`.
   - O `salvar` do cadastro guarda `S.conta` de antes do
     `Object.assign(s, estadoVazio())` e o devolve depois. É o caso de
     quem entrou pelo "Já tenho conta" numa conta vazia e fez o cadastro já
     com dono.

6. **Prova no aparelho, com sonda temporária.** Um `/* SONDA TEMPORÁRIA */`
   em `__DEV__` lê uma clínica publicada e escreve o resultado no console
   do Metro.
   - O dono abre no iPhone (Expo Go) e eu leio o `preview_logs`.
   - É o que decide o polyfill do passo 1, sem deduzir do navegador (ver a
     memória "ler o aparelho").
   - A sonda sai antes do commit, com `grep SONDA` = 0.

**Verificação:**
- `scripts/sincronia.ts` nasce com a primeira parte:
  - os itens antigos ganham `rid` uma vez;
  - a segunda passada não muda nada;
  - não há `rid` repetido;
  - o item novo é carimbado no `update`;
  - a prévia do Perfil não carimba nada que seja gravado;
  - `estadoVazio().semente === false`, e `reset` não deixa a marca;
  - um estado antigo da persona, sem consentimento, é a semente;
  - um estado antigo cadastrado sem consentimento, com outro nome, não é;
  - o `salvar` do cadastro não perde `S.conta`.
- O navegador idêntico, e o `norte.v1` com `rid` nos itens (leitura, sem
  escrever).
- Nenhuma chamada ao Supabase no painel de rede, fora da sonda.
- As conferências de sempre, e `acesso.ts`.

### ⚠️ CORRIGIDO AO EXECUTAR (25/09/2026)

**O resultado:**
- `scripts/sincronia.ts` nasceu com 27 afirmações, e os 7 erros plantados
  de propósito foram todos pegos;
- no iPhone (Expo Go), a sessão cifrada fez ida e volta, e a consulta ao
  `morphi-dev` respondeu;
- na web, a tela ficou idêntica, e os 298 itens da demonstração ganharam
  `rid`.

1. **O polyfill de URL não entra.** A consulta do `supabase-js` funcionou
   no iPhone sem ele, e o SDK 57 dispensa mesmo.
2. **A abertura grava o que mudou.** Como estava no plano, a identidade
   dos itens antigos nascia no `hydrate` só em memória, e o estado só era
   gravado na primeira mudança. Até lá, cada abertura daria ids novos aos
   mesmos itens, e a sincronia da fase 3 subiria o mesmo item duas vezes.
   - O `hydrate` agora grava na hora, sempre que o `ensureDefaults` mudou
     alguma coisa.
   - A trava confere duas aberturas seguidas, e o erro plantado ("a
     abertura sem gravar") é pego.
3. **As sondas ganharam um `AsyncStorage` de memória**
   (`scripts/duble/async-storage.ts`). O de verdade falha em silêncio
   fora do aparelho, e nenhuma trava via o que seria gravado.
4. **A chave AES sai de `getRandomValues`.** A documentação do SDK 57 avisa
   que `getRandomBytes` pode cair em `Math.random` em desenvolvimento.
5. **O plugin do `expo-secure-store` entra com `faceIDPermission: false`.**
   O `expo install` o acrescentou ao `app.json`, e sem opções ele poria no
   iOS um pedido de Face ID, em inglês, para uma biometria que o
   aplicativo não usa. A exclusão dos valores do cofre no backup do
   Android fica, e é bom que fique.
6. **A `aes-js` não traz tipos.** Uma declaração local
   (`src/logic/aes-js.d.ts`) cobre só o que a sessão cifrada usa.
7. **O recomeço do cadastro virou uma função, `recomecarDoZero`**, em
   `logic/seed`, para a trava poder provar que o dono atravessa. O
   `salvar` do cadastro passou a chamá-la.
8. **Os nomes das personas saem do próprio catálogo**
   (`NOMES_DAS_PERSONAS`, em `src/textos`), e não de uma lista copiada.
   Uma persona renomeada continua reconhecida.

---

## Fase 3 — a sincronia, sem rede

**Nada muda na tela.** O miolo é código sem rede, e é ele que se testa.

1. **A origem das perguntas.** `ask(texto, origem)`, no companheiro, grava
   `{ t, q, origem }` (o `rid` já vem da fase 2):
   - **`digitada`**: o campo do companheiro e o botão de enviar
     (`companion.tsx:473` e `:520`), e o campo do Insights
     (`(tabs)/insights.tsx:152`), que manda `&origem=digitada` junto do
     `?q=`;
   - **`sugerida`**: as pastilhas do próprio companheiro
     (`companion.tsx:375`) e todos os outros atalhos que abrem o
     companheiro por `?q=`: `(tabs)/insights.tsx:146`, `ui/Ask.tsx:19`,
     `(tabs)/index.tsx:255`, `(tabs)/cuidado.tsx:196` e `:660`, e
     `alimentacao.tsx:298`. O companheiro lê `origem` do endereço, e usa
     `sugerida` quando ela falta;
   - **uma recente tocada no Insights herda a origem da primeira vez**,
     lida em `asked`;
   - as perguntas antigas, sem origem, sobem com ela nula.

2. **`src/logic/traducao.ts`: a tabela do desenho, em código.**
   - **`ida(S)`** transforma o estado em linhas de `registros` e de
     `perguntas`, e em partes de `perfis`.
   - **`volta(linhas, perguntas, partes)`** faz o caminho inverso:
     - reagrupa exames por marcador e sinais vitais por tipo;
     - remonta a janela de `asked` com as 12 últimas perguntas, sem as
       repetidas, como o companheiro a guarda;
     - devolve cada lista na ordem em que o aplicativo a guarda. Há lista
       do mais antigo para o mais novo, e há `documents`, ao contrário.
   - **Todo campo do estado tem um destino declarado**, e só um:
     - um tipo de registro;
     - `perguntas`;
     - uma parte do perfil;
     - "vem do servidor" (a clínica e o vínculo);
     - "se calcula";
     - "fica no aparelho".

   Classificações que o desenho não fez:

   | campo | destino | por quê |
   |---|---|---|
   | `asked` | `perguntas`, **só com `perfis.perguntas_para_uso` ligado**; sem ela, fica no aparelho | a decisão 2 |
   | a escolha das perguntas | `perfis.perguntas_para_uso` | a decisão 2 |
   | `semente`, `conta` | **ficam no aparelho** | são a marca do exemplo e o dono deste diário |
   | `consultNotes` | `acompanhamento` | |
   | `alertas`, `theme`, `paleta`, `profile.idioma` | `preferencias` | |
   | `descobertasVistas`, `apresentacoesVistas`, `vistoEmConquistas`, `lastReplaySeen` | `vistos` | |
   | `unread` | **se calcula**, pela leitura das mensagens | |
   | `profile.vinculo`, `profile.convite` | **vêm do servidor** (fase 6) | |
   | `profile.consentimento` | `perfis.versao_consentimento` e `consentido_em` | |
   | `customSyms` | `tratamento` | item 8 da lista do alto |

3. **`src/logic/sincronia.ts`: o motor, com o transporte injetado.**
   - **A base.** Ela fica numa chave própria do `AsyncStorage`
     (`norte.sincronia.v1`), marcada com o dono. Guarda três coisas:
     - os cursores (um para `registros` e o perfil, e outro para
       `perguntas`);
     - um resumo (hash) de cada linha como estava na última sincronia;
     - a fila.

     O dono em si mora no estado (`S.conta`), que é o que o portão lê. Base
     com dono diferente de `S.conta` não sobe nada.
   - **O que mudou.** Ele compara `ida(S)` com a base, e o resultado vira
     operação na fila: novo, editado, sumiu (que vira `apagado_em`) e
     parte do perfil mudada.
     - **Em `perguntas` não existe "sumiu".** Sair da janela das 12 não é
       apagar (a decisão 2).
     - Pergunta sobe com `ignoreDuplicates`, que só precisa de `insert`,
       e **depois** do perfil, porque a regra de `insert` lê a escolha nele.
     - **Desligar a escolha** chama o `delete` das próprias perguntas,
       esvazia as perguntas da fila e não enfileira mais nenhuma. Ligar
       enfileira as que estão no aparelho.
   - **Trocar de diário troca a base inteira.** "Sair da conta", "Apagar
     meus dados", `resemear` e "Já tenho conta" param o motor e apagam
     `norte.sincronia.v1` antes de mexer no estado, nessa ordem. Sem isso,
     o estado vazio seria comparado com a base antiga, e tudo viraria
     `apagado_em` na conta de antes.
   - **Subir.**
     - `upsert` por `id`, em lotes de 500;
     - reenviar o que já subiu não duplica nada, e é isso que deixa a
       primeira subida retomar de onde parou;
     - a base só avança quando o servidor confirma.
   - **Baixar.**
     - pede o que mudou desde o cursor **menos um minuto**, porque uma
       transação que demorou pode ter gravado antes do cursor e terminado
       depois; a mistura é idempotente;
     - item desconhecido entra, item mais novo substitui, apagado sai;
     - **item com mudança na fila não é tocado**: ela vai chegar ao
       servidor depois, e por isso vai ser a última;
     - o perfil segue a mesma regra, por parte;
     - as perguntas descem por `criado_em`, pelo cursor próprio e com a
       mesma folga. Num aparelho novo, descem só as 12 últimas.
   - **Quando corre.**
     - assina o `store` e junta mudanças em sequência (dois segundos
       parado);
     - sobe logo depois;
     - baixa ao abrir e ao voltar para o aplicativo;
     - na falha, espera 2 s, 4 s, 8 s… até um minuto.
   - **⚠️ Com `modoFingido()`, ele não olha.** A prévia serve um estado
     mascarado sem a clínica, e comparar a máscara com a base mandaria
     apagar a clínica de verdade.
   - **⚠️ Com `S.semente`, ele também não olha.** A Mariana é inventada,
     e não pode subir para conta nenhuma.
   - **O estado que a tela lê**:
     - guardado, guardando e sem internet;
     - entrar de novo (a sessão recusada);
     - conta apagada (fase 4, passo 6);
     - conta ainda não criada: aparece só quando a tranca 3 foi adiada
       por falta de conexão, e nunca na semente.
   - **Sessão que cai não apaga nada.** Só "Sair da conta" e "Apagar meus
     dados" apagam a cópia do aparelho.

4. **`scripts/sincronia.ts`: a trava.** O transporte é um servidor falso
   em memória, que carimba `atualizado_em` e `criado_em` como o de
   verdade. Afirmações:
   - **ida e volta** devolvem o mesmo estado **nos campos cujo destino é
     um tipo de registro, `perguntas` ou uma parte do perfil**, na semente
     de cada um dos seis idiomas (as personas) e no estado vazio. Para
     `perguntas`, com a escolha ligada de propósito no teste. Os campos
     que ficam no aparelho, vêm do servidor ou se calculam são conferidos
     à parte: ficam fora de `ida`, e `volta` não os inventa;
   - **todo campo tem destino**: um campo novo no estado, sem
     classificação, derruba a trava;
   - dois aparelhos registrando coisas diferentes não perdem nada;
   - o mesmo item nos dois: vale o último que chegou ao servidor;
   - apagar num, some nos dois, e o conteúdo apagado não fica no servidor
     falso;
   - a fila sem internet sobe tudo depois, e fechar no meio não perde nem
     duplica;
   - a primeira subida interrompida retoma sem duplicar;
   - o modo de demonstração nunca põe nada na fila;
   - a semente nunca põe nada na fila;
   - **as perguntas:**
     - vão para `perguntas`, e nenhuma para `registros`;
     - sem a escolha ligada, nenhuma vai para a fila;
     - a 13ª pergunta não apaga a primeira no servidor;
     - a repetida vira uma linha nova, sem apagar a anterior;
     - a pastilha tocada chega como `sugerida`, e a pergunta digitada no
       Insights, como `digitada`;
     - desligar a escolha apaga as do servidor e esvazia as da fila;
     - uma pergunta feita no aparelho A aparece na janela do B na descida
       seguinte;
   - o perfil em partes: dois aparelhos mexendo em partes diferentes não
     se atropelam;
   - o diário com dono não sobe para outra conta;
   - **trocar de diário:**
     - o estado vazio com a base de outro dono não gera apagado;
     - depois de sair, a fila está vazia e nada é enfileirado;
     - entrar de novo na mesma conta não marca nada como apagado;
     - depois de apagar a conta, uma conta nova sobe.

   Provada com mutantes, como `acesso.ts`:
   - a mistura por cima de item com mudança na fila;
   - o `apagado_em` ignorado ao baixar;
   - a folga do cursor removida (o servidor falso atrasa um commit de
     propósito);
   - a guarda do modo fingido retirada;
   - a guarda da semente retirada;
   - o "sumiu" aplicado a `perguntas`;
   - as perguntas subindo sem a escolha;
   - sair sem apagar a base.

**Verificação:** `scripts/sincronia.ts` inteira e os mutantes pegos; as
conferências de sempre; o navegador idêntico. O motor ainda não liga,
porque ninguém tem conta.

### ⚠️ CORRIGIDO AO EXECUTAR (25/09/2026)

**O resultado:**
- `scripts/sincronia.ts` tem 94 afirmações (27 da fase 2 e 67 novas), e
  os 29 erros plantados foram todos pegos: os 7 da fase 2, os 8 do plano
  e 14 que a execução acrescentou;
- `scripts/regras.mjs` ganhou a comparação dos 14 tipos de registro com a
  tradução;
- na web, as telas da demonstração ficaram iguais, e a origem de cada
  pergunta foi gravada pelas três portas do Insights e pelas duas do
  companheiro.

1. **O estado vazio herdava a Mariana.** Sobravam em `estadoVazio` os
   sinais vitais (três pressões, duas frequências, três glicemias), os
   materiais da clínica e a ficha da clínica. Nada no aplicativo escreve
   um sinal vital: quem se cadastrava carregava para sempre a pressão de
   outra pessoa, e a sincronia a subiria como dela.
   - Os três agora nascem vazios.
   - A tela de Saúde mostra só os cartões com medição. Não precisou de
     texto novo: o aviso "Estes números não se digitam" já diz o que
     falta.
2. **A medição nova copiava a identidade da última** (`{ ...ultima, t }`).
   As duas virariam uma linha só no banco, e um lote com o mesmo id duas
   vezes é recusado inteiro.
   - A tela deixou de copiar.
   - O `carimbar` passou a dar identidade nova a quem repete a de outro
     item; o primeiro mantém a sua.
3. **A ordem das listas não era a que o plano dizia.**
   - Do mais antigo ao mais novo: pesos, aplicações, check-ins, medidas,
     canetas, valores de exame e sinais vitais.
   - Do mais novo ao mais antigo: refeições, anotações, documentos, laudos
     e fotos.
   - Sem momento: metas e favoritas levam a posição nos dados. No empate,
     os dois aparelhos desempatam do mesmo jeito.
   - O que desce de outro aparelho entra onde o aplicativo o teria posto,
     e o que já estava fica onde estava.
   - Duas sementes estavam fora da própria ordem (as refeições dentro do
     dia, e os documentos), e foram postas nela.
4. **O mesmo dia em dois aparelhos.** O registro do dia (`registroDoDia`)
   é o recipiente onde o check-in, a água, o exercício e a proteína
   escrevem. Dois aparelhos sem conexão criam cada um o seu, com
   identidades diferentes, e as telas leriam só o primeiro. Na mistura,
   eles viram um:
   - fica o de menor identidade, e os dois aparelhos escolhem o mesmo;
   - ele recebe os goles e os treinos que faltam e as respostas que não
     deu;
   - o outro sobe como apagado.
5. **A fila é calculada, e não guardada.** A base só avança com a
   confirmação do servidor, então o que falta subir é exatamente o que
   difere dela. Fechar no meio não perde nada, e não há fila para ficar
   velha. A base guarda:
   - um resumo de cada linha e de cada parte;
   - as perguntas da janela que já subiram;
   - os cursores e a escolha confirmada;
   - a dívida de apagar as perguntas.
6. **A base é amarrada ao diário, e não só ao dono.** Cada diário ganha
   uma identidade neste aparelho (`S.diario`). Ela nasce na semente, no
   estado vazio e no cadastro que recomeça, e não sobe. A base de outro
   diário é jogada fora.
   - Por quê: um caminho que esquecesse de apagar a base transformaria o
     diário vazio numa lista de apagados na conta. É o risco que "apagar a
     base antes" existia para evitar, e agora ele não depende de ninguém
     lembrar.
   - A base continua sendo apagada, por `trocarDeDiario` e por "Apagar
     meus dados".
   - O erro plantado "sair sem apagar a base" é pego pela afirmação de que
     a base sai. O novo, "a base de outro diário usada", é pego pelo
     diário novo que encontra a base velha.
7. **Antes da primeira descida, o perfil do aparelho não é mudança.** Num
   aparelho que acabou de entrar numa conta, o perfil é o do estado vazio,
   e subi-lo apagaria o de verdade. Nada sobe antes de a primeira descida
   terminar, e nela vale o servidor em cada parte que ele tiver.
8. **O perfil desce inteiro a cada volta**, e não pelo cursor. É uma linha
   só, e cada parte é conferida pelo resumo. O cursor fica só para
   `registros`.
9. **O consentimento só sobe de versão.** A versão maior vale, venha de
   onde vier e esteja pendente ou não. Na mesma versão, vale a hora que o
   servidor tem. Sem isso, um aparelho com a versão antiga seria recusado
   pelo banco para sempre.
10. **Uma linha que esta versão não conhece fica de fora do estado e da
    base.** É um tipo novo, subido por uma versão mais nova do aplicativo.
    Se entrasse na base, voltaria como apagada.
11. **O que passa do teto do banco fica no aparelho** (64 KB por linha e
    256 KB por parte, medidos como o banco mede) e não segura o resto do
    lote. Ele conta no que falta: o estado não diz "guardado" com uma
    linha de fora.
12. **Os estados da tela ganharam três.**
    - `sem-conta`: o diário tem jeito de ser de alguém e ainda não tem
      conta.
    - `outra-conta`: a sessão é de outra conta.
    - `desligada`: a semente, a prévia do Perfil ou o diário sem dono.

    E a recusa do banco tenta de novo descendo primeiro. A causa mais
    provável é a escolha das perguntas desligada em outro aparelho.
13. **A escolha das perguntas é `S.perguntasParaUso`**, desligada por
    padrão. A tela que a liga é da fase 8. A origem viaja no endereço:
    - sem nada, é `sugerida`, e por isso os outros atalhos não mudaram;
    - o campo do Insights manda `digitada`;
    - uma recente tocada de novo manda `recente`, e o companheiro a troca
      pela origem da vez anterior, lida em `asked`.

    A janela e a origem moram em `logic/perguntas`.
14. **"Apagar meus dados" grava o estado na hora**, e esquece a sincronia
    ao lado. Esperar a base sair antes de gravar deixava a gravação do
    vazio para trás de um `update` feito logo em seguida.
15. **A comparação dos tipos com a regra do banco mora em
    `scripts/regras.mjs`**, que já lê as migrações. A trava da sincronia é
    TypeScript e não lê arquivo.
16. **Três campos do perfil não estavam no levantamento:**
    - a foto, em `pessoal`;
    - as metas ajustadas à mão (`alvosEditados`), em `tratamento`;
    - o motivo de quem cancelou (`cancelamento`), que fica no aparelho,
      porque nenhum texto nosso diz que ele sobe.
17. **O servidor de mentira mora em `scripts/duble/servidor.ts`.** Ele:
    - carimba a hora, marca o apagado e tira o conteúdo;
    - não deixa sobrescrever linha de outra conta;
    - recusa consentimento que desce e pergunta sem a escolha;
    - sabe perder a conexão, perder a resposta de um lote e atrasar uma
      transação.
18. ⚠️ **Fica para antes do primeiro campo novo numa parte.** A parte sobe
    inteira. Um aparelho com a versão anterior, mexendo nela, a subiria
    sem o campo novo e o apagaria no servidor. A volta precisa guardar o
    que não conhece. Está anotado em `logic/traducao`.

**Para a fase 4:**
- o transporte do Supabase implementa `Transporte`: as colunas em
  `snake_case`, a descida paginada e `ignoreDuplicates` nas perguntas;
- `usuario()` lê a sessão do aparelho, sem ir à rede, e a conta apagada
  aparece na primeira leitura ou escrita;
- a volta ao aplicativo chama `voltouAoAplicativo()`;
- "Sair da conta" e "Já tenho conta" passam por `trocarDeDiario`;
- "Apagar meus dados" e reconstruir a semente deixam a sincronia parada
  (`esquecerSincronia`), e quem cria ou abre a conta a liga de novo;
- medir no iPhone o custo de uma volta num diário grande. No Node, a
  tradução e os resumos de 2.000 linhas levam uns 20 ms, e cada volta faz
  isso até três vezes.

---

## Fase 4 — a conta: e-mail e Apple, e a sincronia ligada

🔑 **Depende do dono:** o serviço de envio, o domínio, os modelos, o código
de 6 dígitos e a Apple (a tabela do alto).

**A primeira fase que se vê**, e só em desenvolvimento.

1. **`supabase/modelos/codigo.html`**: o modelo do e-mail nos seis idiomas.
   - Um `{{ if eq .Data.idioma "en-US" }}…` por idioma, com o português no
     `else`.
   - O `idioma` vai em `signInWithOtp({ options: { data: { idioma } } })`.
   - Na voz do produto ("nós"), com o código grande, a validade escrita e
     "se não foi você, pode ignorar".
   - ⚠️ A validade escrita tem de bater com a do painel. O comentário do
     arquivo diz isso.

2. **`src/logic/conta.ts` (novo).**
   - `pedirCodigo(email)` e `confirmarCodigo(email, codigo)`, este com
     `verifyOtp` do tipo `'email'`.
   - `entrarComApple()`: `expo-apple-authentication` com `nonce`. O nonce
     cru vai para o Supabase, e o SHA-256 dele (`Crypto.digestStringAsync`)
     vai para a Apple. O escopo é só o e-mail, porque o nome já veio do
     cadastro.
   - `sair()` com `signOut({ scope: 'local' })`, porque o padrão desloga
     todos os aparelhos.
   - `apagarConta()` e `useConta()`.
   - Os erros viram frases do catálogo, e não mensagens do servidor.
   - `app.json` ganha `ios.usesAppleSignIn: true`, para a build de
     desenvolvimento e a da loja. O Expo Go não precisa.

3. **`src/app/conta.tsx` (novo)**, com o desenho saindo dos componentes do
   aplicativo (ver a memória "mockup é referência").
   - A escolha: Apple, só no iOS e com `isAvailableAsync`; Google, a partir
     da fase 5; e "Continuar com e-mail".
   - O e-mail, e depois o código, com colar, reenviar em 60 s e o número
     de dígitos numa constante só.
   - Depois de entrar, "Guardando o seu diário…", com a primeira subida
     acontecendo de verdade.
   - **Sem saída que não seja criar a conta ou entrar numa** (a decisão 1).
     Sem internet, a tela diz que criar a conta precisa de conexão, guarda
     o que já foi escrito e tenta de novo sozinha quando a pessoa volta
     para o aplicativo.
   - Três entradas por `?de=`:
     - `cadastro`: o fim do cadastro e a tranca 3 do portão;
     - `abertura`, que é "Já tenho conta";
     - `sessao`, que é "entre de novo". Ela só autentica e confere se quem
       entrou é o dono gravado em `S.conta`. Se for, não mexe no estado
       (fora o convite pendente, na fase 6) e retoma a fila. Se não for,
       oferece entrar com a conta dona ou sair e começar de novo, sem subir
       nada.
   - Catálogo novo, `conta`, nos seis idiomas, registrado como os outros
     34 módulos. Tem o francês com espaço fino, e as frases irmãs
     procuradas em todos.

4. **As portas**, todas atrás de `contaLigada()`:
   - **as trancas do portão**, em `_layout.tsx`: a 1 ganha `conta` e
     `documento`, e a 3 nasce, como está na seção "As trancas do portão";
   - **o caminho do cadastro até a conta**: `cadastro.tsx:1410` passa a
     levar a `/planos?de=cadastro`. Ali, sem `S.conta`, o `fechar`
     (`planos.tsx:330-333`) e as outras saídas que entrariam no aplicativo
     vão a `/conta?de=cadastro`, com ou sem conexão. Sem o `de=cadastro`
     (quem veio de `/assinatura`), o `fechar` continua voltando;
   - **a abertura do cadastro** ganha "Já tenho conta". Entrou:
     - se a conta tem diário, ele desce inteiro, o estado nasce de
       `estadoVazio()` + `volta()`, com `S.conta` gravado e a base nova. O
       cadastro é pulado e `onboardDone` vira verdadeiro;
     - se a conta está vazia, o cadastro segue, já com `S.conta`;
   - **ao criar a conta com um diário que já existe**, se a conta escolhida
     também tem diário, a pessoa escolhe um dos dois (a regra do alto);
   - **a linha de estado**, no Perfil, com as frases da fase 3. "Entre de
     novo" abre `/conta?de=sessao`. Quando a tranca 3 foi adiada por falta
     de conexão, a linha, e uma faixa na Home, dizem: "Sem internet —
     criamos a sua conta quando a conexão voltar". Na semente, a linha não
     aparece.

5. **"Sair da conta" de verdade.** Pendências, item 30:
   - aviso antes, e aviso de que há coisa não enviada, se houver;
   - `sair()`, o motor parado, a base apagada, o estado vazio e a abertura
     do cadastro, com "Já tenho conta";
   - **sem dono**, em qualquer build, o botão faz o que faz hoje (volta ao
     cadastro), mas **não diz "Sair da conta"**. O rótulo proposto é
     "Refazer o cadastro", nos seis idiomas. É decisão do dono pelo item
     30, e até ele decidir fica esse.

6. **"Apagar meus dados".**
   - **Sem dono** (a semente, ou um diário que ainda não tem conta), é o
     `reset()` de hoje: local, sem rede e sem função.
   - **Com dono**, apaga no servidor:
     - **`supabase/functions/apagar-conta/index.ts`** usa
       `npm:@supabase/server@1.8.0` com `withSupabase({ auth: 'user' })`.
       O `verify_jwt` sozinho aceita também as chaves de API, então a
       conferência do usuário é no código;
     - a função faz `auth.admin.deleteUser`, e a cascata da fase 1 leva o
       perfil, os registros, as perguntas, os vínculos (os encerrados
       também, com a cópia), as mensagens e o resto que é dele;
     - sobe com `npx supabase functions deploy apagar-conta --use-api`, e
       a chave secreta é a que o próprio Supabase injeta na função;
     - **precisa de conexão**, e a tela diz isso;
     - o aparelho só é limpo **depois** de a função responder que apagou,
       nesta ordem: o motor parado, a base apagada, `sair()` e o estado
       vazio. Se ela falhar, nada muda, e a tela avisa.
   - **O outro aparelho** descobre na próxima vez que falar com o servidor.
     O sinal é o erro de usuário inexistente que a autenticação devolve
     (o código exato, `user_not_found`, é conferido na versão fixada). A
     tela diz que a conta foi apagada e oferece limpar a cópia daquele
     aparelho. Se o sinal não vier, o aparelho cai em "entre de novo". Ao
     entrar pela `sessao` com o mesmo e-mail, o `id` novo não bate com
     `S.conta`, e a tela diz a mesma coisa.
   - ⚠️ O token de acesso já emitido vale até expirar (uma hora), mas o
     dono dele não existe mais: as regras não acham nada e a escrita falha
     na chave estrangeira.

7. **A sincronia liga.** Começa em `_layout.tsx` depois do `hydrate`, com
   `nuvem()`, `S.conta` e sessão.
   - `resemear` (a semente de desenvolvimento) para o motor, apaga a base
     e sai da conta antes, para a Mariana nunca subir.

**Verificação:**
- **Navegador:** o cadastro até a conta com e-mail e código (o dono
  digita o código que chegar). O diário no `morphi-dev`, conferido por
  `db query`. "Sair" e "Já tenho conta" devolvendo o diário inteiro.
- **As trancas e os caminhos:**
  - o cadastro inteiro passa pela devolutiva, pelo plano e por `/planos`
    antes da conta;
  - cadastro novo sem internet: o X de `/planos` abre `/conta`, que
    espera; fechar ali e reabrir sem internet abre o aplicativo com o
    aviso; com a rede de volta, a abertura seguinte vai a `/conta`;
  - fechar em `/planos` ou em `/conta` e reabrir com internet: cai em
    `/conta`;
  - diário sem dono, sem internet, `/assinatura` → `/planos` → X: volta a
    `/assinatura`;
  - "Sair", depois "Já tenho conta" na abertura: abre `/conta`, e não
    volta ao cadastro; os links dos Termos e da Política abrem;
  - "Apagar meus dados" leva ao cadastro, e não a `/conta`; na semente,
    com e sem internet, também;
  - abertura a frio sem internet, com a sessão vencida: o aplicativo
    abre, e não vai para `/conta`;
  - com um registro na fila e a sessão derrubada, "entre de novo" sobe o
    registro e não troca o estado; entrar com outra conta não sobe nada;
  - a semente abre sem pedir conta, e sem dono o Perfil não mostra "Sair
    da conta".
- **Duas origens como dois aparelhos**, `localhost` e `127.0.0.1`, que
  não dividem o `localStorage`: registrar numa, voltar à outra e ver
  chegar. Apagar numa e ver sumir.
- **Apagar a conta** com uma conta descartável (`contato+teste@…`): nada
  dela fica no banco. Sem internet, o botão não apaga nada, e diz por quê.
  Na outra origem, a próxima conversa com o servidor leva à tela de conta
  apagada.
- **iPhone, Expo Go:** a Apple, com o console lido pelo Metro.
- As conferências de sempre, `sincronia.ts`, `acesso.ts` e `regras.mjs`.

### ⚠️ CORRIGIDO AO EXECUTAR (25/09/2026)

**O resultado, até aqui:**
- o código da fase inteira está feito, atrás de `contaLigada()`;
- a função `apagar-conta` foi publicada no `morphi-dev` e recusa, com
  401, quem chama sem sessão;
- `scripts/sincronia.ts` tem 96 afirmações, e os 30 erros plantados foram
  todos pegos;
- no navegador, numa segunda origem (`127.0.0.1`, que não mexe no diário
  de teste de `localhost`), funcionaram:
  - "Já tenho conta" na abertura do cadastro;
  - a tranca 3 levando o diário sem dono à conta, com conexão;
  - o corredor da conta aos planos e de volta pelo X;
  - na semente, o Perfil sem a linha da conta e com "Refazer o cadastro";
- as consultas do transporte passam pelo leitor do servidor (com a chave
  pública, todas chegam à regra de permissão).

**⏳ O que falta, e depende do dono:** a entrada de verdade. O painel ainda
não tem o serviço de envio de e-mail, e sem ele o Supabase não deixa
editar o modelo: o e-mail sairia com um link, e não com o código. Lido
com `config pull`, sem mudar nada, o painel está com código de 8 dígitos,
validade de 1 hora e a Apple desligada. Faltam, na tabela "O que depende
do dono":
- o serviço de envio e o domínio;
- os dois modelos (`supabase/modelos/codigo.html`, que também traz o
  assunto);
- o código de 6 dígitos e a validade de 600 s;
- a Apple com os Client IDs.

Com isso, a verificação desta fase segue: o cadastro até a conta com o
código, o diário conferido no banco, sair e entrar de novo, duas origens,
apagar a conta, a Apple no iPhone.

1. **A comemoração das conquistas entrava no corredor e travava o
   portão.** Ela é uma rota, e rota fora da lista de uma tranca volta ao
   destino da tranca.
   - Sem cadastro feito, "Já tenho conta" abria a conta, a comemoração a
     cobria, e o portão mandava tudo de volta ao cadastro.
   - Depois do cadastro, a comemoração e a conta se revezavam sem fim.

   Agora ela espera o cadastro feito e fica quieta no corredor inteiro
   (cadastro, conta, planos, código e documentos).
2. **Entrar sem conexão não segura a pessoa.** Quando o diário deste
   telefone ganha dono, a pessoa entra no aplicativo mesmo que a subida
   falhe: a sincronia tenta de novo, e a linha do Perfil diz. Só espera na
   tela quem está trazendo o diário da conta, porque sem ele não há o que
   abrir. Ali a tela mostra o erro e "Tentar de novo", e tenta sozinha na
   volta ao aplicativo.
3. **O código errado e o vencido são o mesmo erro no servidor**
   (`otp_expired`), e a frase diz os dois.
4. **O modelo vai nos dois e-mails**, "Confirm signup" e "Magic link":
   com a confirmação ligada, a conta nova recebe o primeiro, e a existente
   recebe o segundo. O idioma só é gravado na criação da conta, e quem já
   tem conta recebe o e-mail na língua do cadastro.
5. **A conta apagada em outro aparelho** é descoberta a cada descida: o
   transporte pergunta ao servidor quem é a pessoa (`getUser`) e
   reconhece `user_not_found`. Sem isso, o token que ainda vale
   devolveria leituras vazias, e o diário pareceria guardado.
6. **"Ficar com o deste telefone"** é uma operação do motor,
   `substituirNoServidor`. A base passa a dizer que o servidor tem o
   diário da conta inteiro e que a primeira descida já foi feita, e a
   subida de sempre faz o resto: o que o telefone não tem vira apagado, e
   este sobe. A trava prova, com um erro plantado.
7. **A função usa `withSupabase({ auth: 'user' })`** do
   `@supabase/server@1.8.0`, que confere o token e entrega o cliente
   administrativo. A chave secreta é a que o Supabase injeta.
   `supabase/functions` fica fora do `tsc` do aplicativo, porque é Deno.
8. **O e-mail da pessoa** fica em `S.conta.email`, para a linha do Perfil
   dizer de quem é a conta. Ele não sobe com o diário: a conta já o tem.
9. **Sem biblioteca nova além da Apple** (`expo-apple-authentication`, o
   plugin e `ios.usesAppleSignIn`).
10. **A primeira entrada de verdade (25/09/2026)** foi feita no iPhone,
    pelo Expo Go, com o e-mail pelo Resend (`no-reply@morphihealth.com`,
    que caiu no spam — domínio novo). O diário subiu:
    - as seis partes do perfil;
    - o consentimento, com a hora do servidor;
    - os registros.

    Os registros entregaram um defeito: **dez sinais vitais da Mariana**
    subiram. O diário do telefone foi cadastrado antes da correção da
    fase 3, e ela só valia para diário novo.
    - `ensureDefaults` agora limpa, uma vez só em cada diário que não é a
      semente, os sinais vitais herdados, pela marca `vitaisHerdadosLimpos`
      (que fica no aparelho). Nada no aplicativo escreve um sinal vital,
      então todos vieram da semente.
    - A limpeza subiu como apagado: no banco ficaram os dez marcados, sem
      conteúdo.
    - Dois erros plantados provam a regra. O reset explícito dos sinais
      em `estadoVazio` virou uma segunda proteção, e o erro plantado nele
      deixou de ser pego; ele saiu da lista.
11. ⚠️ **A primeira tentativa não gravou o dono**, e não se sabe por quê:
    a conta foi criada no servidor, e o diário do iPhone continuou sem
    `S.conta`. Na segunda, com sondas em cada passo, o caminho inteiro
    funcionou (o código, a conta vazia, o dono gravado, "guardado"). Fica
    de olho nos próximos testes: sair e entrar, e o segundo aparelho.
12. **O desenho do e-mail e das telas da conta** fica para uma rodada
    própria, pedida pelo dono depois do primeiro teste.
13. **Os testes com o dono (25/09/2026), no iPhone e no navegador de
    testes (`127.0.0.1`, uma segunda origem):**
    - **sair e entrar de novo:** a mesma conta. Nada virou apagado, o
      perfil do servidor não foi atropelado pelo vazio, e o aplicativo
      abriu na Home;
    - **dois aparelhos:** o navegador entrou na conta e escolheu "Ficar
      com o da conta". Uma nota escrita no navegador chegou ao iPhone na
      volta ao aplicativo, um copo d'água do iPhone chegou ao navegador,
      e a nota apagada no navegador sumiu do iPhone (no banco, marcada e
      sem conteúdo);
    - **sair na web:** a sessão e a base saíram, e o diário da conta
      ficou intacto;
    - **apagar a conta**, com uma descartável (`+teste`): a função
      respondeu, o aparelho foi limpo depois, e no banco não sobrou
      usuário, perfil, registro nem pergunta dela. A conta do dono ficou
      intacta.
14. ⚠️ **A Apple não funciona no Expo Go**, ao contrário do que a
    documentação diz. No iPhone (iOS 26.3, Expo Go do SDK 57), o módulo
    nativo `ExpoAppleAuthentication` não existe, e `isAvailableAsync`
    responde falso. O botão não aparece, e é o certo. **O teste da Apple
    vai para a fase 5**, com o Google, porque os dois pedem a build de
    desenvolvimento (item 16 das pendências). O código fica como está.
15. ⏳ **Falta a conta apagada vista do outro aparelho** (a tela "Esta
    conta foi apagada"). Ela pede uma conta descartável aberta em dois
    aparelhos ao mesmo tempo, e fica para quando houver os dois.

---

## Fase 5 — o Google (build de desenvolvimento)

🔑 **Depende do dono:** o item 16 das pendências e o Google Cloud.
**Pode andar em paralelo, e não trava as fases 6 a 8.** Se a fase 8
chegar antes, o aplicativo sai com Apple e e-mail, e o Google entra
depois.

1. **`expo-dev-client`**, que falta para o perfil `development` do
   `eas.json` funcionar, e **`react-native-nitro-google-signin@2.3.0`**
   exato, com o plugin e o `iosUrlScheme` no `app.json`.
2. **`entrarComGoogle()` em `conta.ts`.**
   - `require` preguiçoso, só fora do Expo Go, no molde de
     `saude-do-aparelho.ts`, para o Expo Go do dono continuar abrindo.
   - O token vai em `signInWithIdToken({ provider: 'google' })`.
   - Nonce: se a biblioteca aceitar, ele vai e o "Skip nonce check" fica
     desligado. Se não, fica ligado.
3. **O botão em `/conta`** só aparece com o módulo nativo presente.

4. **A Apple também é verificada aqui** (ver a fase 4, correção 14): o
   Expo Go não traz o módulo dela, e o teste pede esta mesma build.

**Verificação:** no iPhone, com a build nova, entrar com a Apple e com o Google, e a
mesma conta pelo e-mail do Google cai no mesmo usuário (a ligação
automática por e-mail verificado). No Expo Go, o botão não aparece e nada
quebra. Os achados vão para o item 16.

---

## Fase 6 — o vínculo e a rede no servidor

1. **`logic/rede.ts` lê do banco.**
   - `FONTE` pede as clínicas publicadas com a equipe e os campos
     públicos, numa consulta só.
   - A ficha da clínica do próprio vínculo vem pela regra da fase 1,
     publicada ou não.
   - `redeNoAr()` passa a perguntar a `contaLigada()`.
   - `redeDeExemplo()` passa a perguntar se as clínicas lidas são de
     exemplo.
   - `EXEMPLO` e `CONVITES_DE_EXEMPLO` saem do aplicativo. Fica, só em
     `__DEV__`, a lista dos **nomes** dos códigos para a dica da folha, e
     `regras.mjs` confere que ela é igual à do `seed.sql`.
2. **`conferirConvite` chama `conferir_convite`.**
   - `'sem-fonte'` só existe sem `contaLigada()`.
   - Nasce `'sem-internet'`, com frase própria.
3. **O consentimento em `/codigo`**, na etapa "É essa a sua clínica?".
   Abaixo da clínica e do profissional:
   - **a lista do que a equipe passa a ver, tirada da tabela de
     tradução**: todo tipo de registro e toda parte do perfil que
     `equipe_le` entrega. Isso inclui sinais vitais, laudos, documentos e o
     histórico de saúde (condições, alergias, medicamentos). Não entra
     "fotos", que não sobem nesta entrega;
   - que a equipe vê **também o que foi registrado antes de conectar**;
   - que **as perguntas ao companheiro, não**;
   - que dura enquanto a pessoa estiver conectada;
   - que a clínica guarda o que foi registrado até o fim.

   "Conectar" é aceitar. A trava da tradução afirma que a lista cobre todo
   destino que a equipe lê.
   - A versão desse consentimento é própria (`VERSAO_DO_COMPARTILHAMENTO`,
     em `src/logic/compartilhamento.ts`), e fica no vínculo.
   - **Com sessão:** `usar_convite`, e a cópia local sai da resposta do
     servidor.
   - **Diário sem dono (o plano do cadastro):**
     - o código e o consentimento ficam guardados como convite pendente;
     - a clínica não aparece como conectada, porque ainda não está;
     - em `/planos`, o lugar do preço diz que o código está guardado e que
       conectamos quando a conta for criada.
   - **Diário com dono e sessão caída:** a folha confere o código e pede
     "entre de novo" (`/conta?de=sessao`) antes de conectar. O convite fica
     pendente até a sessão voltar.
   - **Quem transforma o pendente em vínculo:** ao nascer a conta (a
     entrada `cadastro`) e ao voltar a sessão (a entrada `sessao`), o
     aplicativo chama `usar_convite`. A cópia local sai da resposta, e o
     pendente sai.
   - **Se o código falhar na hora de usar** (outra pessoa usou antes, ou
     ele expirou entre a conferência e a conta), a conta nasce do mesmo
     jeito, e o pendente sai. A pessoa lê que o código não valeu e que pode
     digitar outro na aba Cuidado.
   - Nos seis idiomas.
4. **As outras portas passam pelas mesmas funções.**
   - O `salvar` do cadastro deixa de escrever `profile.convite` e
     `profile.vinculo`, sempre. Hoje ele reescreve os dois em qualquer
     edição pelo lápis, com `desde` novo, e numa cópia vinda do servidor
     isso apagaria o vínculo.
   - `/parceiros` (`parceiros.tsx:81`) e o caminho `'sem-fonte'` de
     `/codigo` (`codigo.tsx:145`) deixam de ligar com `vinculoDoConvite`
     quando há nuvem.
5. **"Desconectar da clínica"**, em `/clinica`.
   - Antes de confirmar, a pessoa lê o que acontece: a equipe para de ver,
     a isenção acaba e os registros ficam.
   - Depois: `encerrar_vinculo()`, e a cópia local limpa o que é de
     plataforma, o mesmo recorte de `mascarar(…, 'sem-parceira')`. O
     diário fica intacto.
6. **O servidor é a fonte do vínculo.**
   - O vínculo ativo desce com o resto, e `profile.vinculo` é a cópia
     dele, com o `id` da linha de `vinculos`.
   - **Vínculo antigo**, sem esse `id`, nasceu só no aparelho, de um código
     que ninguém conferiu. Na primeira sincronia ele sai, e a pessoa lê um
     aviso honesto: o código não foi confirmado, e ela pode digitar de novo
     em Cuidado. Ele nunca vira vínculo no servidor sem passar por
     `/codigo` e pelo consentimento.
   - **Vínculo com `id` que o servidor diz ter acabado:**
     - com `encerrado_por = 'clinica'`, a cópia sai, e entra um aviso nas
       notificações do aparelho ("A clínica encerrou o acompanhamento; o
       seu diário continua aqui"). Não abre `/suspenso` (item 9 do alto);
     - com `encerrado_por = 'paciente'` (a própria pessoa desconectou em
       outro aparelho), a cópia sai, sem esse aviso;
     - se houver um vínculo ativo novo (troca de clínica em outro
       aparelho), a cópia passa a ser a do novo, também sem o aviso.
7. **As fotos da rede saem do pacote.**
   - As imagens de exemplo (~1,3 MB) sobem para o balde `clinicas` do
     `morphi-dev`, por `npx supabase storage cp` (conferido no `--help`;
     se a versão não tiver, o dono arrasta pelo painel).
   - `seed.sql` aponta os caminhos.
   - `ui/retratos.ts`: `fotoDaRede` passa a devolver o endereço público.
   - Os `require` saem e as imagens saem de `assets/`.
   - `CREDITOS.txt` continua dizendo a origem.
   - Os retratos da semente da Mariana ficam (item 34).
8. **`scripts/acesso.ts` cresce**, como o desenho pede:
   - o vínculo vindo do servidor, pela tradução de uma linha de
     `vinculos`;
   - desconectar;
   - a clínica encerrar;
   - desconectar num aparelho não faz o outro dizer que a clínica
     encerrou;
   - trocar de clínica num aparelho deixa o outro com o vínculo novo, sem
     aviso de encerramento;
   - o vínculo antigo, que sai com o aviso certo, e não com o da clínica;
   - editar a altura pelo lápis não muda o vínculo nem o `desde`.

   Em todos, os registros saem intactos e o acesso segue `acessoDe`.

**Verificação:**
- **Navegador:**
  - a vitrine vinda do banco, com o aviso de exemplo;
  - conectar com `SAVASSI26`, e o vínculo no banco com a versão do
    consentimento;
  - desconectar, e o vínculo encerrado com a cópia do perfil;
  - encerrar pelo lado da clínica (a função chamada por `db query`, como
    o profissional da clínica), e o aplicativo ficar sabendo ao voltar
    para ele.
- **O cadastro inteiro com código:** o convite pendente vira vínculo
  quando a conta nasce.
- **Com a sessão derrubada:** o X de `/planos` volta ao aplicativo, e um
  código conectado vira vínculo no próximo login.
- **Apagar a conta de novo, agora com uma conta que conectou:** o vínculo
  some, e o convite fica com `usado_por` nulo.
- `acesso.ts`, `regras.mjs` (as funções mudaram de consumidor e não de
  regra, mas roda) e as conferências de sempre.

### ⚠️ CORRIGIDO AO EXECUTAR (25/09/2026)

**O resultado, até aqui:**
- o código da fase inteira está feito;
- `acesso.ts` ganhou a seção 3, com nove afirmações, e passa;
- `sincronia.ts` afirma que o consentimento cobre todo destino que a
  equipe lê, nos seis idiomas (98 afirmações);
- `regras.mjs` confere os nomes dos códigos contra o `seed.sql`;
- `tsc`, as seis conferências, a espaça fina e `modos` passam.

No navegador de testes (`127.0.0.1`), com um cadastro novo e sem conta:
- a folha do código conferiu `SAVASSI26` no banco e mostrou a clínica,
  com a foto vinda do balde, a Dra. Patrícia e a lista do que a clínica
  passa a ver;
- "Conectar" guardou o convite pendente (`SAVASSI26`, versão 1), sem
  vínculo;
- `/planos` disse "Código guardado".

**⏳ O que falta, e depende do dono** (a entrada com o código do e-mail):
- o pendente virando vínculo quando a conta nasce;
- conectar com sessão;
- desconectar;
- a clínica encerrando;
- apagar uma conta que conectou.

1. **O cadastro não pergunta mais o código.** A pergunta saiu antes deste
   plano: `recomendado` e `codigo` só chegam preenchidos na edição pelo
   lápis, a partir de `profile.convite`. Então o "salvar deixa de escrever"
   do item 4 virou `conviteDoCadastro` (em `logic/rede`):
   - escreve só quando o código mudou, e a edição da altura não encosta no
     vínculo (a trava prova);
   - com a nuvem, não liga nunca.

   O caminho do código no cadastro é o de sempre: `/planos`, "Tenho um
   código de convite".
2. **`/parceiros` não liga mais com a nuvem.** O código digitado ali fica
   em `profile.convite` e abre `/codigo`, que é onde mora o
   consentimento.
3. **O vínculo segue o servidor fora do motor.** O vínculo não é registro
   nem parte do perfil: não passa pela tradução. `atualizarVinculo()`
   (em `logic/conta`) lê o último vínculo da pessoa e aplica
   `seguirVinculoDoServidor`:
   - na abertura, na volta ao aplicativo, depois de entrar e depois de
     desconectar;
   - antes, `usarConvitePendente()` tenta o pendente.

   A cópia só é regravada quando mudou, para não acordar a sincronia.
4. **Os avisos são notificações do aparelho**, do tipo `vinculo`, com
   três motivos: a clínica encerrou, o código antigo não foi confirmado e
   o código pendente não valeu.
5. **As fotos da rede moram em `clinicas/exemplo/`** no balde, subidas com
   `supabase storage cp --linked --experimental`. Detalhes:
   - a CLI 2.118 não sobrescreve: a troca é `storage rm` e depois `cp`;
   - caminho absoluto do Windows no `cp` vira "operação não suportada", e
     o `cp` roda de dentro da pasta;
   - `seed.sql` grava os endereços num `update` no fim, e a semente foi
     rodada (8 clínicas com foto).

   A Lemos usa uma cópia da `vitalis.jpg`, e a Beatriz, Marina e Camila,
   cópias dos retratos da semente. O Rafael fica na inicial.
6. **O banco não guarda foco de retrato.** `focoDaRede` agora é sempre o
   topo. O retrato da responsável, que pedia o centro, subiu já cortado
   no alto (240 px a menos). Foto de clínica de verdade pede o recortador
   no envio, no portal.
7. ⚠️ **O login em laço no iPhone era a sessão virando lixo** (e é a
   explicação da correção 11 da fase 4). A sessão cifrada são duas peças,
   a chave no Keychain e a cifra no AsyncStorage, gravadas uma depois da
   outra. O cliente do Supabase 2.117 não tem trava ("lockless"), e uma
   leitura no meio de uma gravação juntava a chave nova com a cifra velha.
   - O cliente jogava a sessão fora, e a conta ficava sem sessão.
   - A fase 6 multiplicou as leituras na abertura (o convite pendente e o
     vínculo), e o encontro virou regra.
   - Sem sessão, `contaTemDiario` respondia nulo, e a tela voltava a "Crie
     a sua conta" com o erro de conexão: o laço.

   Agora leitura, gravação e remoção esperam a anterior, numa fila em
   `logic/nuvem`. Com sondas no aparelho: todas as leituras voltaram
   inteiras, e a entrada seguinte gravou o dono.
8. ⚠️ **Desconectar deixava a ficha da clínica no perfil.** Conectar marca
   o acompanhamento e escreve a clínica e quem atende como "quem acompanha
   você". Desconectar tirava só o vínculo. A aba Cuidado, achando que a
   pessoa tinha médico, escondia a rede parceira, e com ela o caminho do
   código.
   - Agora a primeira conexão guarda os cinco campos de antes
     (`profile.antesDoVinculo`, na parte `acompanhamento`), e o fim do
     vínculo os devolve.
   - Trocar de clínica não regrava o guardado.
   - O vínculo antigo, nascido só no aparelho, não escreveu ficha, e o
     médico digitado fica.

   A trava prova as três coisas.
9. **Os testes com o dono (25/09/2026), no iPhone, com uma conta
   descartável (`+teste`):**
   - conectar com `LEMOS26`: o vínculo no banco com a Dra. Beatriz, a
     versão 1 do consentimento e o código marcado como usado;
   - desconectar: o vínculo encerrado por `paciente`, com a cópia do
     perfil, e o diário intacto.

   - a clínica encerrando (`BOTAFOGO26`, encerrado pelo banco com
     `private.encerra(…, 'clinica')`, porque a rede de exemplo não tem
     profissional com login): na volta ao aplicativo, a cópia saiu e o
     aviso "A clínica encerrou o acompanhamento" chegou ao sino.

   - o código guardado virando vínculo quando a conta nasce, com outra
     descartável (`+teste2`): o `SANTANA26` foi guardado em `/planos`,
     antes da conta, e a conta nasceu às 02:17:16. O vínculo saiu às
     02:17:34, com a versão 1 do consentimento aceita antes de a conta
     existir;
   - apagar essa conta: no banco não sobrou usuário, perfil, registro
     nem vínculo, e o `SANTANA26` ficou com `usado_por` nulo, que é o que
     `usar_convite` confere; `usado_em` fica como registro. As outras
     contas ficaram intactas.

   **A fase 6 está verificada com o dono.** Não foi testada: a sessão
   derrubada com um código conectado (o caminho `/conta?de=sessao`).
10. ⚠️ **Na primeira tentativa (`PAULISTA26`), o aviso não chegou**, e a
    cópia já tinha saído sem ele. O caminho que tira a cópia sem aviso
    existia: a conferência do vínculo que a volta ao aplicativo dispara
    podia terminar depois de uma conexão feita no meio, e aplicar a
    resposta velha (o vínculo anterior, encerrado) sobre a cópia nova.
    Agora a resposta só vale para a cópia que havia na pergunta. Aquela
    tentativa foi antes das sondas, e não dá para afirmar que foi isto.
    A segunda, com as sondas, passou inteira.
11. **"Anote quem é" não marcava o acompanhamento.** A tela gravava o
    nome da médica e a pessoa continuava "por conta própria", com a rede
    parceira na aba Cuidado. Defeito anterior ao plano, achado no teste.
12. **O código também entra por "Quem acompanha você"**, pedido do dono:
    quem tem médico não vê a rede, e o código só entrava pelo Perfil.

---

## Fase 7 — da clínica para o paciente, na hora

⏸️ **ADIADA (26/09/2026), por decisão do dono.** O sistema da clínica
ainda não existe, e no primeiro momento não vai ser necessário: sem ele,
não há quem escreva mensagem, receita, consulta ou material do outro
lado. O que isso deixa como está:
- o aparelho continua sem descer nada da clínica. `messages`,
  `prescriptions`, `team` e `materials` ficam como hoje, e
  `tirarVinculo` os limpa ao fim do vínculo;
- o fim do vínculo chega na volta ao aplicativo (fase 6), e não na hora;
- "Allow public access" do Realtime não precisa ser desligado ainda. O
  banco já tem os gatilhos e os tópicos da fase 1, prontos para quando
  ela voltar;
- ⚠️ **a fase 8 não pode prometer** mensagem da equipe nem nada chegando
  "na hora". Os textos dizem o que a equipe VÊ, e não o que ela manda.

Volta quando o portal dos médicos (o sistema da clínica) tiver o
primeiro envio.

🔑 **Depende do dono:** "Allow public access" desligado no Realtime.

1. **A tradução das tabelas da clínica.**

   | tabela do servidor | no aparelho | direção |
   |---|---|---|
   | `mensagens` | `messages` | sobe a do paciente, desce a da equipe, e `lida_em` sobe quando a conversa é aberta; `unread` se calcula |
   | `receitas` | `prescriptions` | desce, e o pedido de renovação sobe |
   | `consultas` | `consult`, `consultsHistory` | desce, **com vínculo** |
   | `planos_da_equipe` | as metas da equipe | desce, **com vínculo** |
   | `materiais` | `materials` | desce |
   | `equipe` + `profissionais` da clínica | `team` | desce |

   **Sem vínculo**, `consult`, `consultsHistory` e as metas voltam a ser o
   que a pessoa anotou, no perfil. A trava da tradução cobre as duas
   formas.
2. **O canal privado `paciente:<uuid>`.**
   - Assinado com sessão, depois de `realtime.setAuth()`.
   - Cada evento pede de novo só a tabela que ele nomeia.
   - Um evento de `vinculos` é o caminho do fim do vínculo, agora na hora,
     e o aviso depende de `encerrado_por` (fase 6, passo 6).
3. **O item 6 das pendências fecha na parte das mensagens.** A mensagem
   sai de verdade. O envio do resumo continua como está, e o que ele passa
   a ser, com a equipe vendo o diário inteiro, é decisão de produto que vai
   para o item.

**Verificação:**
- Uma mensagem da equipe inserida por `db query` no vínculo da conta de
  desenvolvimento chega com o aplicativo aberto, no navegador e no iPhone.
- A resposta do paciente aparece no banco.
- Um canal de outra pessoa assinado à força não recebe nada: é a
  afirmação de tópico da trava, e agora também à mão.
- As conferências de sempre.

---

## Fase 8 — os textos, e o interruptor

**No mesmo commit**, porque é a regra do desenho: nenhuma frase mentindo
nem um dia. E, a partir deste commit, nenhuma build fora de `__DEV__` sai
antes da virada para a produção (a seção "O interruptor").

1. **A lista inteira do item 10 das pendências, com a numeração de hoje.**
   A numeração do item 10 envelheceu, e o `documentos.ts` atual manda:
   - **a Política:**
     - seções 2 (o e-mail da conta), 4, 5, 6, 7, 8, 10, 11, 13 e 14;
     - os operadores, na 7: Supabase, Apple, Google e o serviço de envio
       de e-mail;
   - **os Termos:**
     - seções 3 (o que o Morphi faz), 6 (a relação com a equipe) e 7
       (assinatura: "cancelar não apaga… no seu aparelho");
     - seções 9 (os seus registros: "a guarda dos registros é sua") e 12
       (encerramento);
   - `VERSAO_DOS_DOCUMENTOS` e `VIGENTE_DESDE` sobem;
   - **os textos das telas**, que moram no catálogo, e não nas telas:
     - em `src/textos/<idioma>/aviso.ts`: `guardadoTitulo`,
       `guardadoTexto`, `saiTitulo`, `saiTexto`, o `parado` da exportação
       ("Nada sai daqui sem o seu toque") e, em `telaPrivacidade`,
       `noAparelhoTexto`, `desinstalar`, `desinstalarTexto`,
       `oQueSaiNota`, `paraEquipeTexto`, `apagarSub` e `apagarPergunta`;
     - em `src/textos/<idioma>/ajuda.ts`: as respostas de "E se eu
       desinstalar o aplicativo?" e "O que a minha equipe consegue ver?";
   - o comentário do `Portao` em `_layout.tsx`, com a regra das trancas.

   O item 10 das pendências é corrigido junto, para a próxima leitura não
   herdar a numeração velha.
2. **O compartilhamento com a clínica entra na Política**: o que a equipe
   vê (a mesma lista da folha do código), desde quando, e o que ela mantém
   depois de desconectar.
3. **As perguntas entram na Política** (a decisão 2):
   - na seção 2, como dado tratado, e que guardamos todas as que a pessoa
     permitir, e não só as 12 que o aplicativo mostra;
   - na 3, a finalidade, quem lê (nós, com um papel de leitura sem a
     identidade) e que a clínica não lê;
   - na 4, a base: consentimento específico, art. 11, I;
   - na 10, o prazo de guarda;
   - na 11, como desligar a escolha e o que acontece com as que subiram;
   - nas 7 e 13, as frases "não usamos analytics" passam a dizer que não
     usamos ferramentas de terceiros e que lemos as perguntas como a seção
     3 descreve;
   - em `privacidade.tsx`, uma linha no bloco "O que sai daqui".
4. **As frases da Peça 6:**
   - `/parceiros`: "sem vínculo, nenhuma clínica vê o seu diário", e o
     acompanhamento contínuo nos benefícios;
   - **"Apagar meus dados"**, a confirmação e as seções 10 e 11 da
     Política dizem o que acontece de verdade:
     - o servidor e este aparelho são apagados agora;
     - as cópias de segurança do banco guardam por até N dias (o N do
       plano contratado);
     - outro aparelho mantém a cópia local até sair da conta ali.

     "Não há cópia em lugar nenhum" sai;
   - **"Exportar" leva tudo o que sobe:** todo tipo de registro, as partes
     do perfil com dado da pessoa e as perguntas. Hoje ele não leva sinais
     vitais, laudos, documentos, metas pessoais, canetas, o histórico de
     saúde nem os sintomas próprios.
     - **As perguntas:** com sessão e conexão, vêm todas do servidor,
       somadas às que ainda estão na fila, sem repetir. Sem isso, o arquivo
       leva as recentes do aparelho e diz que as outras vêm com conexão.
     - A trava da tradução afirma que todo destino tem seção no arquivo
       exportado.
   - `privacidade.tsx`, bloco "O que sai daqui", de volta ao presente;
   - `MODOS.md`.

   Nos seis idiomas, onde a frase existe nos seis.
5. **O consentimento novo.**
   - O texto ganha a guarda no servidor, a conta obrigatória e a escolha
     das perguntas.
   - **A escolha das perguntas** é própria e desligada por padrão, e
     recusá-la não tranca nada (a decisão 2). Ela também fica em
     `/privacidade`, para ligar e desligar a qualquer momento. O texto diz
     que ligar sobe também as perguntas que já estão no aparelho, e que
     desligar apaga as que subiram.
   - A `VERSAO` sobe de 1 para 2.
   - **É a tranca 2 do portão.** A folha reabre em toda abertura até ser
     aceita, antes da tranca da conta e antes de qualquer coisa subir.
     Deixa ficar `documento` e `exportar`. A semente de desenvolvimento
     não a vê.
   - Como a conta é obrigatória, quem recusa o consentimento geral não
     segue. A folha diz isso com clareza e oferece "Exportar" e "Apagar
     meus dados deste aparelho", como os Termos prometem a quem não
     concorda. O apagar roda ali mesmo, sem navegar: é o apagar local da
     fase 4, e não precisa de conexão. Nada é apagado sem pedido.
6. **O interruptor e a instalação nova.**
   - `NUVEM_PARA_TODOS = true`.
   - Fora de `__DEV__` e com `contaLigada()`, `hydrate` sem nada gravado
     nasce de `estadoVazio()`, e um estado gravado com `semente: true`
     vai para o cadastro. É a saída 2 do item 27 (a decisão 1).
7. **`PENDENCIAS.md`:**
   - o item 10 vira ✅, com o que mudou e a numeração corrigida;
   - o 30 fecha para quem tem dono, e fica aberto até a virada para a
     produção e até o dono decidir o rótulo de quem não tem dono;
   - o 36 ganha o servidor;
   - o 34 ganha a vitrine no banco;
   - o 27 registra que a saída 2 foi decidida por causa da conta
     obrigatória.

   **🔴 Bloqueia a publicação**, ao lado do item 2: **a leitura das
   perguntas por nós.** Ela entra com o que falta decidir e as salvaguardas
   que já valem:
   - a revisão jurídica: se a escolha pode ser outra coisa além de
     própria e desligada por padrão, e se a leitura pode ter a identidade
     da pessoa;
   - quem lê, e com qual login do papel `analise_perguntas`;
   - MFA na organização do Supabase;
   - quem analisa não é membro da organização no painel;
   - nada exportado para fora de `sa-east-1`, porque a exclusão da conta
     não alcança uma cópia;
   - se a extensão `pgaudit` estiver disponível, o registro de quem leu.

   E entram os itens novos, sem travar a entrega:
   - a **revisão jurídica** do prontuário de 20 anos contra o direito de
     apagar;
   - o papel da clínica perante a LGPD;
   - o e-mail fora do Brasil, se o serviço escolhido não for o de São
     Paulo;
   - as cópias de segurança diante do pedido de eliminação;
   - **a revogação do token da Apple ao apagar a conta**, que a App Store
     cobra de quem usa o login da Apple e que exige a chave `.p8`;
   - **os códigos de verdade**: sorteados, com 8 caracteres de um alfabeto
     sem ambiguidade. Os de exemplo são fáceis de adivinhar, e a função de
     conferir não tem limite de tentativas. Isso entra antes do portal
     emitir o primeiro;
   - **a conta obrigatória diante da regra 5.1.1(v) da App Store**, com a
     resposta pronta: o diário guardado entre aparelhos e o vínculo com a
     clínica dependem da conta;
   - a lista de virada para a produção, abaixo.

**Verificação:**
- os seis catálogos, o espaço fino do francês, o idioma congelado,
  `modos.ts`, `acesso.ts`, `sincronia.ts`, `regras.mjs` e o `tsc`;
- **a conferência por chave**: o `git diff` do commit mostra mudada cada
  chave do passo 1, **nos seis arquivos de idioma**. É ela que prova a
  troca nos seis, porque uma busca por frase em português não acha nada
  nos outros cinco;
- **uma busca complementar**, sem diferenciar maiúsculas, que tem de
  voltar vazia fora dos contextos em que a frase continua verdadeira:
  - em português: `não há cópia`, `não há conta`, `sem conta`,
    `sem servidor`, `no seu aparelho`, `toque seu`, `sem o seu toque`,
    `gesto seu`, `nada sai daqui`, `comando de enviar`, `escolhe enviar`,
    `quando você manda`, `analytics`, `telemetria`;
  - os equivalentes de cada idioma, tirados das mesmas chaves;
- **no navegador:**
  - um cadastro do zero, com o consentimento novo e sem passar pela folha
    da tranca 2;
  - com a escolha das perguntas desligada, nada chega a `perguntas`;
    ligada, chegam também as que estavam no aparelho; desligada de novo em
    `/privacidade`, somem do servidor;
  - com a escolha ligada e 13 perguntas, o arquivo exportado traz as 13;
  - consentimento antigo, sem conta e com internet: a folha, aceitar e
    `/conta`, sem laço;
  - recusar, fechar e reabrir: a folha volta; "Exportar" gera o arquivo, e
    o link da Política abre; "Apagar meus dados deste aparelho", sem
    internet, volta ao cadastro vazio;
  - um diário antigo aberto sem internet: o aplicativo abre, com o aviso;
- **uma instalação limpa sem `__DEV__`**, com o interruptor ligado: cai no
  cadastro e só entra no aplicativo com conta, sem a Mariana.
  - `expo start --no-dev` roda como produção e não lê `.env.development`.
    As duas variáveis públicas do `morphi-dev` vão num
    `.env.production.local` só para o teste, que o `.gitignore` já ignora e
    que é apagado depois.
  - Antes de julgar o resultado, conferir no painel de rede que há chamada
    ao `morphi-dev`, e, com uma sonda temporária, que `__DEV__` é falso.

---

## Depois do plano — a produção

Não é deste plano, e fica escrito para não se perder. **Nenhuma build fora
de `__DEV__` sai do commit da fase 8 antes desta lista estar feita.**

1. **Criar o projeto `morphi`** na organização paga, em São Paulo, com a
   exposição automática desligada e a RLS automática ligada.
2. **Subir o banco:** as migrações com `db push`. **Nunca** a semente e
   nunca a trava. O executor da trava já se recusa, mas ligar a CLI na
   produção pede um cuidado próprio: um diretório separado, ou ligar e
   desligar no mesmo passo.
3. **Configurar a autenticação e o tempo real:**
   - o SMTP, os modelos, o código de 6 dígitos e a validade;
   - a Apple **sem** `host.exp.Exponent`;
   - o Google;
   - o Realtime sem acesso público.
4. **As variáveis do EAS** por ambiente: `production` e `preview`
   apontando para o que for decidido. Elas são a condição para a primeira
   build distribuída.
5. **Subir o limite de e-mails por hora** para o tamanho do lançamento.
6. **Resolver o que bloqueia a publicação** nas pendências: os
   documentos, o item 2, e a leitura das perguntas.

---

## O que este plano não faz

- Não desenha o portal, nem as escritas dele na vitrine.
- Não liga a cobrança.
- Não cria os armazenamentos `fotos` e `documentos`: nenhum registro tem
  arquivo hoje.
- Não congela o prontuário no fim do vínculo.
- Não mistura dois diários.
- Não cria nem liga o projeto `morphi`.
- Não revoga o token da Apple ao apagar a conta: vai para as pendências.
- Não muda o que o envio do resumo significa.
- Não dá à pessoa um lugar para ver e apagar uma pergunta de cada vez.
  Ela as leva todas no "Exportar", com conexão, e as apaga todas
  desligando a escolha ou apagando a conta.

## Ordem de commit

Uma fase, um commit, com push na `main`.

- As fases 1, 2 e 3 **não se juntam**: a 1 é o banco inteiro, e a trava
  dela precisa ter passado sozinha antes de qualquer código ler dali.
- A fase 5 entra quando o dono tiver a build.
- A fase 8 vai sozinha, porque é a que a pessoa recebe. **A partir dela,
  nenhuma build fora de `__DEV__` sai antes da virada para a produção.**

O que for corrigido ao executar entra neste arquivo como "⚠️ CORRIGIDO AO
EXECUTAR", na fase em que aconteceu, como no plano anterior.
