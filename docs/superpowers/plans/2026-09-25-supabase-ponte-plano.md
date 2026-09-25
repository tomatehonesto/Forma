# Plano — o Supabase como ponte

**Desenho:** [`../specs/2026-09-25-supabase-ponte-design.md`](../specs/2026-09-25-supabase-ponte-design.md)
**Data:** 25 de setembro de 2026
**Projeto de desenvolvimento:** `morphi-dev`, ref `kjagyoqykhysvasauzgo`, São Paulo

Oito fases. Cada uma termina num commit que passa nas conferências de sempre
e num aplicativo que funciona. Nenhuma deixa uma frase mentindo para quem
usa o aplicativo, porque tudo o que é novo fica atrás de **um interruptor
só**, que a fase 8 liga no mesmo commit que troca os textos. É o "tudo de
uma vez" do desenho: a pessoa recebe a conta, o diário guardado, a rede e o
vínculo na mesma entrega. Os commits do caminho são para o desenvolvimento.

A ordem segue a regra do plano anterior: primeiro o que não muda nenhum
pixel. As fases 1 a 3 constroem o banco, o cliente e o miolo da
sincronização. A 4 é a primeira que se vê.

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
   serviço de envio passa a ser pré-requisito da fase 4.** E o modelo é um
   só para seis idiomas: ele escolhe o texto pelo `idioma` que o aplicativo
   manda junto quando pede o código.
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
   entram. A tela abre sozinha no dia em que o portão existir, porque ele
   pergunta a `acessoDe`. Até lá, quem perde o vínculo recebe um aviso.
10. **Sem biblioteca de conexão.** A falha de rede já é o sinal de "sem
    internet", e a espera crescente do desenho cobre o "quando a conexão
    voltar". É uma dependência a menos.

E três coisas que o desenho não dizia e o plano decide:

- **Apagar um registro limpa o conteúdo dele no servidor.** A linha fica,
  para o outro aparelho saber, mas `dados` vira `{}`. É o que "apagar"
  quer dizer, e a clínica, que vê a versão atual, vê o apagado.
- **O diário do aparelho tem dono.** Se a sessão cair e outra conta entrar
  no mesmo aparelho, nada sobe para a conta errada: o aplicativo pede para
  entrar com a conta dona do diário, ou para sair e começar de novo.
- **Dois diários não se misturam.** Quem já usa o aplicativo sem conta e
  entra, pelo Perfil, numa conta que já tem diário escolhe um dos dois. A
  mistura é outro projeto.

### ⚠️ Decisão para confirmar na leitura: "Agora não" na conta

O desenho põe a conta no fim do cadastro e não diz se o passo pode ser
pulado. **O plano oferece "Agora não"**, que leva ao aplicativo sem conta,
igual a quem já usa hoje, com o convite do Perfil. Dois motivos:

- a regra 5.1.1(v) da App Store pede que o aplicativo funcione sem login
  quando o que ele faz não depende de conta, e o diário funciona sem;
- sem internet no fim do cadastro não há como criar conta, e o aplicativo
  promete funcionar sem conexão.

A exceção é quem conectou um código de clínica no plano: o vínculo só
existe com conta. Ali a tela explica isso e mantém "Agora não", e o código
fica guardado esperando a conta. **Se a conta tiver de ser obrigatória, a
mudança é só nesta tela.**

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
"Já tenho conta", o convite do Perfil, a linha de estado, a vitrine lida do
banco e a conferência do código.

- **Em desenvolvimento** (`__DEV__`, o Expo Go do dono) as portas aparecem
  a partir da fase 4. Durante as fases 4 a 7, os textos legais que o dono lê
  no aparelho dele estão atrasados em relação ao que o aplicativo faz. É o
  preço de não escrever tudo num commit só, e ele fica dentro do
  desenvolvimento.
- **Em build de loja**, nada muda até a fase 8. E, sem as variáveis do
  projeto de produção, `nuvem()` é nulo mesmo depois dela: a virada para a
  produção é a seção "Depois do plano".

---

## O que depende do dono, e quando

Nenhum segredo passa pela conversa. A senha do banco e a chave secreta
ficam no painel e no terminal do dono.

| antes de | o quê | onde |
|---|---|---|
| passo 1.2 | `npx supabase login` no terminal dele. A autorização é dele, e os comandos da CLI passam a usá-la | terminal |
| fase 4 | **o serviço de envio de e-mail**, pelo item 3 acima. Sugestão: **Amazon SES em São Paulo (`sa-east-1`)**, que mantém o e-mail no Brasil e fecha a pendência da transferência internacional. Domínio de envio verificado (é o item 1 das pendências) e as credenciais SMTP digitadas no painel | Supabase → Authentication → Emails → SMTP |
| fase 4 | os dois modelos de e-mail ("Magic link" e "Confirm signup"), colados de `supabase/modelos/codigo.html`; código de **6** dígitos; validade de **600 s** | Authentication → Emails; Sign In / Providers → Email |
| fase 4 | Apple ligada, com Client IDs `br.com.selloapp.morphi,host.exp.Exponent`. Login nativo não precisa de Services ID nem de chave `.p8` | Sign In / Providers → Apple |
| fase 5 | o item 16 das pendências (`eas init`, iPhone registrado, conta paga de desenvolvedor Apple); no Google Cloud, a tela de consentimento e três clientes OAuth (web, iOS e Android com o SHA-1); no Supabase, o Google com os IDs, o da web primeiro | EAS, Google Cloud, painel |
| fase 7 | desligar "Allow public access" do Realtime, para só haver canal privado | Realtime → Settings |
| fases 4 e 6 | digitar no navegador de testes o código que chegar no e-mail dele, quando eu pedir | navegador |

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

4. **As migrações**, cada uma criada com `npx supabase migration new`:

   **a. `perfis_e_registros`**
   - O esquema `private`: `revoke all … from public`, e `usage` para
     `anon` e `authenticated`. Ele não é exposto pela API.
   - A tabela `perfis`, com:
     - `user_id` como chave, referenciando `auth.users` com
       `on delete cascade`;
     - seis partes `jsonb`, cada uma com o seu `<parte>_em`;
     - `versao_consentimento`, `consentido_em`, `criado_em` e
       `atualizado_em`.
   - A tabela `registros`, com as colunas do desenho, mais:
     - `check` do `tipo` contra a lista da tradução;
     - `check (octet_length(dados::text) <= 65536)`, para ninguém guardar
       arquivo em `dados`.
   - Os gatilhos:
     - `atualizado_em = clock_timestamp()` a cada escrita (o relógio do
       aparelho não decide nada);
     - o `<parte>_em` de cada parte que mudou;
     - apagado: carimba `apagado_em` e limpa `dados`.
   - Os índices: `registros (user_id, atualizado_em)` e
     `perfis (atualizado_em)`.

   **b. `rede`**
   - A tabela `clinicas`, com os campos de `Clinica` em `logic/rede.ts`,
     mais `publicada` e `exemplo`.
   - A tabela `profissionais`, com `user_id` apontando para `auth.users`
     (`on delete set null`).
   - A tabela `equipe`: `clinica_id`, `profissional_id`, `papel` e `ativo`.
   - Os ids são uuid, e a semente usa uuids fixos.

   **c. `ponte`**: as tabelas `convites` e `vinculos` do desenho, e o
   índice único parcial `vinculos (paciente_id) where encerrado_em is null`.

   **d. `da_clinica`**: as tabelas `mensagens`, `receitas`, `consultas`,
   `planos_da_equipe` e `materiais`.
   - Cada uma leva `vinculo_id`, `paciente_id` (com `on delete cascade`) e
     `atualizado_em` carimbado pelo servidor.
   - `materiais.paciente_id` é nulo quando o material vale para todos os
     pacientes da clínica.

   **e. `funcoes_do_convite`**: as três funções da Peça 5, descritas
   abaixo.

   **f. `tempo_real`**: os gatilhos de Broadcast e as políticas em
   `realtime.messages`, descritos abaixo.

   **g. `armazenamento_da_rede`**: o balde `clinicas`, público para
   leitura. As escritas nascem com o portal; no `morphi-dev`, as fotos
   sobem pela CLI (passo 6.7).

   O que as migrações a, c, d, e e f dizem sobre acesso está no passo 5.

5. **As permissões e as regras.** A exposição automática está desligada
   no projeto, então **cada tabela precisa do seu `grant`**. Sem ele a API
   devolve `42501`, que é o comportamento certo para o que não foi
   concedido. E toda tabela tem RLS ligada, de forma explícita.

   **Quem pode o quê:**

   | tabela | `anon` | `authenticated` |
   |---|---|---|
   | `perfis`, `registros` | — | `select`, `insert`, `update` (sem `delete`: apagar é marcar; a linha só sai com a conta, pela cascata) |
   | `clinicas`, `equipe` | `select` | `select` |
   | `profissionais` | `select` só das colunas públicas: id, nome, foto, especialidades, conselho, região, registro e RQE. **`user_id` fica de fora** | igual |
   | `convites` | — | `select`, `insert` (a equipe, pelo portal) |
   | `vinculos` | — | `select`. Criar e encerrar, só pelas funções |
   | `mensagens`, `receitas` | — | `select`, `insert`, e `update` só da coluna que o paciente mexe (`lida_em`, `renovacao_pedida_em`) |
   | `consultas`, `planos_da_equipe`, `materiais` | — | `select`, `insert`, `update` |

   `service_role` recebe tudo, para as funções do servidor.

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

   Mais três, no mesmo molde: `equipe_le_vinculo(vinculo)`, que vale ativo
   ou encerrado; `equipe_escreve(vinculo, paciente)`, que só vale com
   vínculo ativo; e `meu_vinculo_ativo()`.

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
     - copia `perfis` para `perfil_no_fim`.

   **O tempo real.** Gatilhos em `private` chamam `realtime.send` com o
   conteúdo `{tabela, id}`:

   | quando muda | para o canal |
   |---|---|
   | o que a clínica escreve para o paciente, e o vínculo dele | `paciente:<uuid>` |
   | um registro ou o perfil de quem tem vínculo ativo (o sintoma no portal, na hora) | `clinica:<uuid>` |

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
   - Y nunca lê A;
   - ninguém além de A escreve no diário de A;
   - sem login, a vitrine sim; as clínicas não publicadas, os convites e
     `profissionais.user_id`, não;
   - sem login, o código se confere e não se lista; código usado por outra
     pessoa é "não achamos";
   - `usar_convite` deixa um vínculo ativo só, e a troca encerra o anterior
     com a cópia;
   - A não cria nem encerra vínculo sem as funções, nem escreve mensagem
     como equipe;
   - a equipe escreve para A só com vínculo ativo;
   - A mexe numa receita só no pedido de renovação;
   - os tópicos de tempo real: A ouve só o seu canal; X, só o da sua
     clínica.

   **A porta da frente**, sem arreio. O executor também chama a API de
   verdade com a chave pública:
   - a vitrine responde;
   - `convites` e `registros` respondem `42501`;
   - `conferir_convite` responde.

   É o que prova as permissões e a exposição, e não só as regras.

   **Os mutantes** ficam em `supabase/testes/mutantes/`: cada um é um trecho
   de SQL aplicado dentro da mesma transação, antes das afirmações. O
   executor exige que **cada um derrube pelo menos uma afirmação**.
   - a regra da equipe sem o limite do fim;
   - `using (true)` na leitura de `registros`;
   - `equipe.ativo` ignorado;
   - o `with check` removido do `update`;
   - `conferir_convite` aceitando código usado;
   - `grant select` de `convites` para `anon`.

**Verificação:**
- `node scripts/regras.mjs`: todas as afirmações passam e os seis mutantes
  são pegos;
- os avisos do passo 6 zerados;
- as conferências de sempre, que não mudam, porque `src/` não foi tocado.

---

## Fase 2 — o cliente e a identidade dos itens

**Nada muda na tela.**

1. **Instalar:**
   - `npx expo install expo-secure-store expo-crypto`, com as versões do
     SDK 57;
   - `npm install --save-exact @supabase/supabase-js@2.117.2 aes-js@3.1.2`.

   Três coisas ficam de fora:
   - **`react-native-url-polyfill`**, porque o SDK 57 já traz `URL` e
     `URLSearchParams`. A prova é o passo 5; se falhar no iPhone, ele
     entra;
   - **a opção `lock`**, que está obsoleta desde a supabase-js 2.107;
   - **`userStorage`**, que ainda é experimental.

2. **`.env.development`, versionado**, com as duas variáveis públicas do
   `morphi-dev` e um cabeçalho que diz por que elas podem estar ali: vão
   dentro do aplicativo de qualquer jeito, e quem protege o dado são as
   regras. `expo start` roda como desenvolvimento e lê esse arquivo; o
   `.env` do dono continua ignorado e continua valendo.
   `.env.example` ganha a explicação.

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
     aninhados: cada valor de `exams[].values` e cada medição de `vitals`.
   - A lista de caminhos mora em `src/logic/traducao.ts`, que nasce aqui
     só com ela.
   - É chamada em `ensureDefaults`, o que cobre os itens antigos na
     primeira abertura e também a semente, e em `update`, depois da
     mutação.
   - É idempotente: quem tem `rid` não é tocado.
   - Em `scripts/tsconfig.json`, `expo-crypto` ganha dublê em
     `scripts/duble/expo.ts`, com o `crypto` do Node.

5. **Prova no aparelho, com sonda temporária.** Um `/* SONDA TEMPORÁRIA */`
   em `__DEV__` lê uma clínica publicada e escreve o resultado no console
   do Metro.
   - O dono abre no iPhone (Expo Go) e eu leio o `preview_logs`.
   - É o que decide o polyfill do passo 1, sem deduzir do navegador (ver a
     memória "ler o aparelho").
   - A sonda sai antes do commit, com `grep SONDA` = 0.

**Verificação:**
- `scripts/sincronia.ts` nasce com a primeira parte, a identidade:
  - os itens antigos ganham `rid` uma vez;
  - a segunda passada não muda nada;
  - não há `rid` repetido;
  - o item novo é carimbado no `update`;
  - a prévia do Perfil não carimba nada que seja gravado.
- O navegador idêntico, e o `norte.v1` com `rid` nos itens (leitura, sem
  escrever).
- Nenhuma chamada ao Supabase no painel de rede, fora da sonda.
- As conferências de sempre, e `acesso.ts`.

---

## Fase 3 — a sincronia, sem rede

**Nada muda na tela.** O miolo é código sem rede, e é ele que se testa.

1. **`src/logic/traducao.ts`: a tabela do desenho, em código.**
   - **`ida(S)`** transforma o estado em linhas de `registros` e em partes
     de `perfis`.
   - **`volta(linhas, partes)`** faz o caminho inverso, reagrupando exames
     por marcador e sinais vitais por tipo, e devolvendo cada lista na
     ordem em que o aplicativo a guarda. Há lista do mais antigo para o
     mais novo, e há `documents`, ao contrário.
   - **Todo campo do estado tem um destino declarado**, e só um:
     - um tipo de registro;
     - uma parte do perfil;
     - "vem do servidor" (a clínica e o vínculo);
     - "se calcula";
     - "fica no aparelho".

   Classificações que o desenho não fez:

   | campo | destino | por quê |
   |---|---|---|
   | `asked` (as perguntas ao companheiro) | **fica no aparelho** | é conversa, e não registro do tratamento |
   | `consultNotes` | `acompanhamento` | |
   | `alertas`, `theme`, `paleta`, `profile.idioma` | `preferencias` | |
   | `descobertasVistas`, `apresentacoesVistas`, `vistoEmConquistas`, `lastReplaySeen` | `vistos` | |
   | `unread` | **se calcula**, pela leitura das mensagens | |
   | `profile.vinculo`, `profile.convite` | **vêm do servidor** (fase 6) | |
   | `profile.consentimento` | `perfis.versao_consentimento` e `consentido_em` | |
   | `customSyms` | `tratamento` | item 8 da lista do alto |

   ⚠️ **`asked` fora da sincronia é decisão a confirmar na leitura.**

2. **`src/logic/sincronia.ts`: o motor, com o transporte injetado.**
   - **A base.** Ele guarda, numa chave própria do `AsyncStorage`
     (`norte.sincronia.v1`):
     - o dono do diário;
     - o cursor;
     - um resumo (hash) de cada linha como estava na última sincronia;
     - a fila.
   - **O que mudou.** Ele compara `ida(S)` com a base, e o resultado vira
     operação na fila: novo, editado, sumiu (que vira `apagado_em`) e
     parte do perfil mudada.
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
     - o perfil segue a mesma regra, por parte.
   - **Quando corre.**
     - assina o `store` e junta mudanças em sequência (dois segundos
       parado);
     - sobe logo depois;
     - baixa ao abrir e ao voltar para o aplicativo;
     - na falha, espera 2 s, 4 s, 8 s… até um minuto.
   - **⚠️ Com `modoFingido()`, ele não olha.** A prévia serve um estado
     mascarado sem a clínica, e comparar a máscara com a base mandaria
     apagar a clínica de verdade.
   - **O estado que a tela lê**: guardado, guardando, sem internet, entrar
     de novo ou sem conta. "Sem internet" é a falha de rede; "entrar de
     novo" é a sessão recusada.
   - **Sessão que cai não apaga nada.** Só "Sair da conta" apaga a cópia
     do aparelho.

3. **`scripts/sincronia.ts`: a trava.** O transporte é um servidor falso
   em memória, que carimba `atualizado_em` como o de verdade. Afirmações:
   - **ida e volta** devolvem o mesmo estado, na semente de **cada um dos
     seis idiomas** (as personas) e no estado vazio;
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
   - o perfil em partes: dois aparelhos mexendo em partes diferentes não
     se atropelam;
   - o diário com dono não sobe para outra conta.

   Provada com mutantes, como `acesso.ts`:
   - a mistura por cima de item com mudança na fila;
   - o `apagado_em` ignorado ao baixar;
   - a folga do cursor removida (o servidor falso atrasa um commit de
     propósito);
   - a guarda do modo fingido retirada.

**Verificação:** `scripts/sincronia.ts` inteira e os mutantes pegos; as
conferências de sempre; o navegador idêntico. O motor ainda não liga,
porque ninguém tem conta.

---

## Fase 4 — a conta: e-mail e Apple, e a sincronia ligada

🔑 **Depende do dono:** o serviço de envio, os modelos, o código de 6
dígitos e a Apple (a tabela do alto).

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
   - Três entradas por `?de=`:
     - `cadastro`, com "Agora não";
     - `abertura`, que é "Já tenho conta";
     - `perfil`.
   - Catálogo novo, `conta`, nos seis idiomas, registrado como os outros
     34 módulos. Tem o francês com espaço fino, e as frases irmãs
     procuradas em todos.

4. **As portas**, todas atrás de `contaLigada()`:
   - **fim do cadastro**: o X e as saídas de `/planos` levam a
     `/conta?de=cadastro` quando não há sessão;
   - **a abertura do cadastro** ganha "Já tenho conta". Entrou:
     - se a conta tem diário, ele desce inteiro, o estado nasce de
       `estadoVazio()` + `volta()`, o cadastro é pulado e `onboardDone`
       vira verdadeiro;
     - se a conta está vazia, o cadastro segue e a conta já está ligada;
   - **no Perfil**, quem não tem conta vê "Crie a sua conta para guardar o
     seu diário", e recebe um aviso único ao abrir. Se a conta escolhida já
     tem diário e o aparelho também, a pessoa escolhe um dos dois (a regra
     do alto);
   - **no Perfil**, a linha de estado da sincronia, com as frases do
     desenho.

5. **"Sair da conta" de verdade.** Pendências, item 30:
   - aviso antes, e aviso de que há coisa não enviada, se houver;
   - `sair()`, o estado vazio e a abertura do cadastro;
   - sem conta, o botão não diz "Sair da conta".

6. **"Apagar meus dados" apaga no servidor.**
   - **`supabase/functions/apagar-conta/index.ts`** usa
     `npm:@supabase/server@1.8.0` com `withSupabase({ auth: 'user' })`. O
     `verify_jwt` sozinho aceita também as chaves de API, então a conferência
     do usuário é no código.
   - A função faz `auth.admin.deleteUser`, e a cascata leva:
     - o perfil e os registros;
     - os vínculos, os encerrados também, com a cópia;
     - as mensagens e o resto que é dele.
   - Sobe com `npx supabase functions deploy apagar-conta --use-api`, e a
     chave secreta é a que o próprio Supabase injeta na função.
   - No aplicativo: a função, depois `sair()`, depois o estado vazio.
   - ⚠️ O token de acesso já emitido vale até expirar (uma hora), mas o
     dono dele não existe mais: as regras não acham nada e a escrita falha
     na chave estrangeira.

7. **A sincronia liga.** Começa em `_layout.tsx` depois do `hydrate`, com
   `nuvem()` e sessão.
   - `resemear` (a semente de desenvolvimento) sai da conta antes, para a
     Mariana nunca subir.

**Verificação:**
- **Navegador:** o cadastro até a conta com e-mail e código (o dono
  digita o código que chegar). O diário no `morphi-dev`, conferido por
  `db query`. "Sair" e "Já tenho conta" devolvendo o diário inteiro.
- **Duas origens como dois aparelhos**, `localhost` e `127.0.0.1`, que
  não dividem o `localStorage`: registrar numa, voltar à outra e ver
  chegar. Apagar numa e ver sumir.
- **Apagar a conta** com uma conta descartável (`contato+teste@…`): nada
  dela fica no banco.
- **iPhone, Expo Go:** a Apple, com o console lido pelo Metro.
- As conferências de sempre, `sincronia.ts`, `acesso.ts` e `regras.mjs`.

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

**Verificação:** no iPhone, com a build nova, entrar com Google, e a
mesma conta pelo e-mail do Google cai no mesmo usuário (a ligação
automática por e-mail verificado). No Expo Go, o botão não aparece e nada
quebra. Os achados vão para o item 16.

---

## Fase 6 — o vínculo e a rede no servidor

1. **`logic/rede.ts` lê do banco.**
   - `FONTE` pede as clínicas publicadas com a equipe e os campos
     públicos, numa consulta só.
   - `redeNoAr()` passa a perguntar a `contaLigada()`.
   - `redeDeExemplo()` passa a perguntar se as clínicas lidas são de
     exemplo.
   - `EXEMPLO` e `CONVITES_DE_EXEMPLO` saem do aplicativo. Fica, só em
     `__DEV__`, a lista dos **nomes** dos códigos para a dica da folha.
2. **`conferirConvite` chama `conferir_convite`.**
   - `'sem-fonte'` só existe sem `contaLigada()`.
   - Nasce `'sem-internet'`, com frase própria.
3. **O consentimento em `/codigo`**, na etapa "É essa a sua clínica?".
   Abaixo da clínica e do profissional:
   - a lista do que a equipe passa a ver;
   - que dura enquanto a pessoa estiver conectada;
   - que a clínica guarda o que foi registrado até o fim.

   "Conectar" é aceitar.
   - A versão desse consentimento é própria (`VERSAO_DO_COMPARTILHAMENTO`,
     em `src/logic/compartilhamento.ts`), e fica no vínculo.
   - **Com sessão:** `usar_convite`, e a cópia local sai da resposta do
     servidor.
   - **Sem sessão (o plano do cadastro):** o código e o consentimento ficam
     guardados como convite pendente, e a clínica não aparece como
     conectada, porque ainda não está. O vínculo nasce quando a conta
     existir.
   - Nos seis idiomas.
4. **As outras portas passam pelas mesmas funções.** O cadastro (edição
   do convite) e o caminho `'sem-fonte'` deixam de ligar com
   `vinculoDoConvite` quando há nuvem.
5. **"Desconectar da clínica"**, em `/clinica`.
   - Antes de confirmar, a pessoa lê o que acontece: a equipe para de ver,
     a isenção acaba e os registros ficam.
   - Depois: `encerrar_vinculo()`, e a cópia local limpa o que é de
     plataforma, o mesmo recorte de `mascarar(…, 'sem-parceira')`. O
     diário fica intacto.
6. **O servidor é a fonte do vínculo.**
   - O vínculo ativo desce com o resto, e `profile.vinculo` é a cópia
     dele.
   - Se o servidor diz que não há vínculo e o aparelho tem um, é que a
     clínica encerrou. A cópia sai, e entra um aviso nas notificações do
     aparelho ("A clínica encerrou o acompanhamento; o seu diário continua
     aqui"). Não abre `/suspenso` (item 9 do alto).
7. **As fotos da rede saem do pacote.**
   - As imagens de exemplo (~1,3 MB) sobem para o balde `clinicas` do
     `morphi-dev`, por `npx supabase storage cp` (conferido no `--help`;
     se a versão não tiver, o dono arrasta pelo painel).
   - `seed.sql` aponta os caminhos.
   - `ui/retratos.ts`: `fotoDaRede` passa a devolver o endereço público.
   - Os `require` saem e as imagens saem de `assets/`.
   - `CREDITOS.txt` continua dizendo a origem.
   - Os retratos da semente da Mariana ficam (item 34).
8. **`scripts/acesso.ts` cresce**, como o desenho pede. O vínculo vindo do
   servidor, pela tradução de uma linha de `vinculos`; desconectar; a
   clínica encerrar. Em todos, os registros saem intactos e o acesso segue
   `acessoDe`.

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
- `acesso.ts`, `regras.mjs` (as funções mudaram de consumidor e não de
  regra, mas roda) e as conferências de sempre.

---

## Fase 7 — da clínica para o paciente, na hora

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
   - Um evento de `vinculos` é o caminho "a clínica encerrou", agora na
     hora.
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
nem um dia.

1. **A lista inteira do item 10 das pendências:**
   - a Política, seções 5, 7, 8, 10 e 14;
   - os Termos, seções 5, 8 e 12;
   - `consentimento.ts`, `privacidade.tsx` e `ajuda.tsx`;
   - o comentário do `Portao` em `_layout.tsx`.

   Os operadores, na seção 7: Supabase, Apple, Google e o serviço de envio
   de e-mail.
2. **O compartilhamento com a clínica entra na Política**: o que a equipe
   vê, desde quando, e o que ela mantém depois de desconectar.
3. **As frases da Peça 6:**
   - `/parceiros`: "sem vínculo, nenhuma clínica vê o seu diário", e o
     acompanhamento contínuo nos benefícios;
   - "Apagar meus dados" apaga no servidor;
   - "Exportar" é a garantia de portabilidade;
   - `privacidade.tsx`, bloco "O que sai daqui", de volta ao presente;
   - `MODOS.md`.

   Nos seis idiomas, onde a frase existe nos seis.
4. **`VERSAO` do consentimento: 1 → 2.** Se o aplicativo ainda não pede o
   consentimento de novo a quem aceitou a versão anterior, o pedido nasce
   aqui: uma folha que abre uma vez, com o texto novo, antes de a
   sincronia subir qualquer coisa. Quem não aceitar continua sem conta,
   como hoje.
5. **`NUVEM_PARA_TODOS = true`.**
6. **`PENDENCIAS.md`:**
   - o item 10 vira ✅, com o que mudou;
   - o 30 fecha;
   - o 36 ganha o servidor;
   - o 34 ganha a vitrine no banco.

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
   - a lista de virada para a produção, abaixo.

**Verificação:**
- os seis catálogos, o espaço fino do francês, o idioma congelado,
  `modos.ts`, `acesso.ts`, `sincronia.ts`, `regras.mjs` e o `tsc`;
- uma varredura (`grep`) das frases do item 10 nos seis idiomas, que tem
  de voltar vazia;
- no navegador, um cadastro do zero, com o consentimento novo.

---

## Depois do plano — a produção

Não é deste plano, e fica escrito para não se perder. Os passos:

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
   apontando para o que for decidido.
5. **Subir o limite de e-mails por hora** para o tamanho do lançamento.

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

## Ordem de commit

Uma fase, um commit, com push na `main`.

- As fases 1, 2 e 3 **não se juntam**: a 1 é o banco inteiro, e a trava
  dela precisa ter passado sozinha antes de qualquer código ler dali.
- A fase 5 entra quando o dono tiver a build.
- A fase 8 vai sozinha, porque é a que a pessoa recebe.

O que for corrigido ao executar entra neste arquivo como "⚠️ CORRIGIDO AO
EXECUTAR", na fase em que aconteceu, como no plano anterior.
