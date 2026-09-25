-- ============================================================
-- O DIÁRIO DA PESSOA — perfis, registros e perguntas
--
-- É o que é DELA. Esta migração só dá acesso à própria pessoa; a
-- leitura da equipe nasce em "ponte", junto com os vínculos que a
-- justificam.
--
-- ⚠️ A exposição automática de tabelas está DESLIGADA neste projeto:
-- nenhuma tabela nova chega à API sem um grant escrito aqui. E a RLS é
-- ligada de forma explícita em todas, mesmo com a RLS automática.
--
-- Desenho: docs/superpowers/specs/2026-09-25-supabase-ponte-design.md
-- Plano:   docs/superpowers/plans/2026-09-25-supabase-ponte-plano.md
-- ============================================================

-- O esquema privado guarda as funções que decidem acesso e a visão das
-- perguntas. Ele não está entre os esquemas expostos pela API: o que mora
-- aqui não tem endereço, só é chamado de dentro do banco.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;


-- ------------------------------------------------------------
-- O relógio é o do servidor
--
-- O cursor da sincronia desce "o que mudou desde"; se o aparelho
-- carimbasse a hora, um celular com o relógio errado esconderia as
-- próprias mudanças dos outros aparelhos.
-- ------------------------------------------------------------
create function private.carimba_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := clock_timestamp();
  return new;
end;
$$;
revoke all on function private.carimba_atualizado_em() from public;


-- ============================================================
-- PERFIS — um por pessoa, em partes
--
-- Cada parte tem a sua hora de mudança, para dois aparelhos mexendo em
-- partes diferentes não se atropelarem: o aparelho sobe só a parte que
-- mudou, e o servidor carimba só essa.
-- ============================================================
create table public.perfis (
  user_id uuid primary key references auth.users (id) on delete cascade,

  pessoal jsonb not null default '{}'::jsonb,
  pessoal_em timestamptz,
  tratamento jsonb not null default '{}'::jsonb,
  tratamento_em timestamptz,
  acompanhamento jsonb not null default '{}'::jsonb,
  acompanhamento_em timestamptz,
  protocolo jsonb not null default '{}'::jsonb,
  protocolo_em timestamptz,
  preferencias jsonb not null default '{}'::jsonb,
  preferencias_em timestamptz,
  vistos jsonb not null default '{}'::jsonb,
  vistos_em timestamptz,

  -- O consentimento geral: a versão aceita e a hora que o aparelho
  -- declara. A hora em que o SERVIDOR recebeu é outra coluna, que só ele
  -- escreve — é ela que prova, porque a pessoa não a reescreve.
  versao_consentimento integer,
  consentido_em timestamptz,
  consentimento_registrado_em timestamptz,

  -- A escolha de deixar a gente ler as perguntas ao companheiro, para
  -- entender o uso do aplicativo. Desligada por padrão; a hora é do
  -- servidor. Ver "perguntas", abaixo.
  perguntas_para_uso boolean not null default false,
  perguntas_para_uso_em timestamptz,

  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint perfis_versao_valida check (versao_consentimento >= 1),
  constraint perfis_partes_sao_objetos check (
    jsonb_typeof(pessoal) = 'object'
    and jsonb_typeof(tratamento) = 'object'
    and jsonb_typeof(acompanhamento) = 'object'
    and jsonb_typeof(protocolo) = 'object'
    and jsonb_typeof(preferencias) = 'object'
    and jsonb_typeof(vistos) = 'object'
  ),
  -- A foto do perfil mora em "pessoal" (256 px em base64, encolhida no
  -- aparelho), e é por ela que o teto é de 256 KB e não menor.
  constraint perfis_partes_cabem check (
    octet_length(pessoal::text) <= 262144
    and octet_length(tratamento::text) <= 262144
    and octet_length(acompanhamento::text) <= 262144
    and octet_length(protocolo::text) <= 262144
    and octet_length(preferencias::text) <= 262144
    and octet_length(vistos::text) <= 262144
  )
);

create index perfis_por_mudanca on public.perfis (atualizado_em);

create function private.perfis_ao_gravar()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  agora timestamptz := clock_timestamp();
begin
  new.atualizado_em := agora;

  if tg_op = 'INSERT' then
    new.criado_em := agora;
    new.pessoal_em := agora;
    new.tratamento_em := agora;
    new.acompanhamento_em := agora;
    new.protocolo_em := agora;
    new.preferencias_em := agora;
    new.vistos_em := agora;
    new.consentimento_registrado_em :=
      case when new.versao_consentimento is not null then agora end;
    new.perguntas_para_uso_em := agora;
    return new;
  end if;

  new.criado_em := old.criado_em;
  new.pessoal_em := case when new.pessoal is distinct from old.pessoal then agora else old.pessoal_em end;
  new.tratamento_em := case when new.tratamento is distinct from old.tratamento then agora else old.tratamento_em end;
  new.acompanhamento_em := case when new.acompanhamento is distinct from old.acompanhamento then agora else old.acompanhamento_em end;
  new.protocolo_em := case when new.protocolo is distinct from old.protocolo then agora else old.protocolo_em end;
  new.preferencias_em := case when new.preferencias is distinct from old.preferencias then agora else old.preferencias_em end;
  new.vistos_em := case when new.vistos is distinct from old.vistos then agora else old.vistos_em end;

  -- ⚠️ A versão do consentimento nunca diminui. Quem aceitou a 2 aceitou
  -- um tratamento que a 1 não descrevia; voltar para a 1 seria apagar a
  -- prova de que a pessoa viu o texto novo.
  if new.versao_consentimento is distinct from old.versao_consentimento then
    if old.versao_consentimento is not null
       and (new.versao_consentimento is null or new.versao_consentimento < old.versao_consentimento) then
      raise exception 'a versão do consentimento não diminui' using errcode = '23514';
    end if;
    new.consentimento_registrado_em := agora;
  else
    new.consentimento_registrado_em := old.consentimento_registrado_em;
  end if;

  new.perguntas_para_uso_em :=
    case when new.perguntas_para_uso is distinct from old.perguntas_para_uso then agora
         else old.perguntas_para_uso_em end;

  return new;
end;
$$;
revoke all on function private.perfis_ao_gravar() from public;

create trigger perfis_ao_gravar
  before insert or update on public.perfis
  for each row execute function private.perfis_ao_gravar();


-- ============================================================
-- REGISTROS — uma linha por item do diário
--
-- O `id` nasce no aparelho (o `rid` do item). Apagar é marcar: a linha
-- fica, para o outro aparelho saber que sumiu — mas o conteúdo vai
-- junto, porque é isso que "apagar" quer dizer.
-- ============================================================
create table public.registros (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  tipo text not null,
  quando timestamptz,
  dados jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),
  apagado_em timestamptz,

  -- A lista é a da tabela de tradução (logic/traducao.ts). Um tipo novo
  -- no aparelho pede uma migração nova, e é bom que peça.
  constraint registros_tipo_conhecido check (tipo in (
    'peso', 'aplicacao', 'checkin', 'refeicao', 'refeicao_favorita', 'medida',
    'exame', 'laudo', 'sinal_vital', 'foto', 'documento', 'anotacao',
    'meta_pessoal', 'caneta'
  )),
  constraint registros_dados_objeto check (jsonb_typeof(dados) = 'object'),
  -- Registro não é lugar de arquivo.
  constraint registros_dados_cabem check (octet_length(dados::text) <= 65536)
);

create index registros_do_dono on public.registros (user_id, atualizado_em);

create function private.registros_ao_gravar()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  agora timestamptz := clock_timestamp();
begin
  new.atualizado_em := agora;
  if new.apagado_em is not null then
    new.apagado_em :=
      case when tg_op = 'UPDATE' and old.apagado_em is not null then old.apagado_em else agora end;
    new.dados := '{}'::jsonb;
  end if;
  return new;
end;
$$;
revoke all on function private.registros_ao_gravar() from public;

create trigger registros_ao_gravar
  before insert or update on public.registros
  for each row execute function private.registros_ao_gravar();


-- ============================================================
-- PERGUNTAS — o que a pessoa perguntou ao companheiro
--
-- ⚠️ A CLÍNICA NÃO LÊ, POR CONSTRUÇÃO. Não há política para a equipe, e
-- nem a chave secreta tem permissão aqui: nenhuma função do servidor e
-- nenhum portal chega a estas linhas.
--
-- Nós lemos para entender o uso do aplicativo — só de quem ligou a
-- escolha em `perfis.perguntas_para_uso`, e só pela visão
-- `private.perguntas_para_leitura`, que não traz a identidade.
--
-- ⚠️ SÓ CRESCE. No aparelho, `asked` é uma janela das 12 últimas; sair
-- dela não é apagar. Não há `update`: o texto de uma pergunta nunca muda
-- depois de subir. A pessoa apaga as suas desligando a escolha, ou
-- apagando a conta.
-- ============================================================
create table public.perguntas (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  quando timestamptz not null,
  texto text not null,
  -- 'digitada' ou 'sugerida'; nula nas perguntas feitas antes de a
  -- origem existir.
  origem text,
  criado_em timestamptz not null default clock_timestamp(),

  constraint perguntas_origem_conhecida check (origem in ('digitada', 'sugerida')),
  constraint perguntas_texto_cabe check (octet_length(texto) between 1 and 65536)
);

create index perguntas_do_dono on public.perguntas (user_id, criado_em);

-- A hora de chegada é a do servidor: é o cursor de quem desce as
-- perguntas num aparelho novo.
create function private.perguntas_ao_gravar()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.criado_em := clock_timestamp();
  return new;
end;
$$;
revoke all on function private.perguntas_ao_gravar() from public;

create trigger perguntas_ao_gravar
  before insert on public.perguntas
  for each row execute function private.perguntas_ao_gravar();


-- ============================================================
-- AS REGRAS — só a própria pessoa, por enquanto
--
-- Uma política por operação, sempre `to authenticated`, com a dona
-- embrulhada em `(select auth.uid())` — assim o Postgres a calcula uma
-- vez por consulta, e não uma vez por linha.
--
-- A leitura de `perfis` e `registros` ganha a equipe em "ponte"
-- (`alter policy`), para continuar sendo UMA política por operação.
-- ============================================================
alter table public.perfis enable row level security;
alter table public.registros enable row level security;
alter table public.perguntas enable row level security;

create policy perfis_leitura on public.perfis
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy perfis_criacao on public.perfis
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy perfis_mudanca on public.perfis
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy registros_leitura on public.registros
  for select to authenticated
  using (user_id = (select auth.uid()));
create policy registros_criacao on public.registros
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy registros_mudanca on public.registros
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
-- Sem política de delete: apagar um registro é marcar `apagado_em`, e a
-- linha só sai com a conta, pela cascata.

create policy perguntas_leitura on public.perguntas
  for select to authenticated
  using (user_id = (select auth.uid()));
-- ⚠️ A escolha é conferida AQUI, e não só no aparelho: um aplicativo
-- antigo ou com defeito não sobe a pergunta de quem não deixou.
create policy perguntas_criacao on public.perguntas
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.perfis p
      where p.user_id = (select auth.uid()) and p.perguntas_para_uso
    )
  );
-- Desligar a escolha apaga as que já subiram: é a revogação.
create policy perguntas_remocao on public.perguntas
  for delete to authenticated
  using (user_id = (select auth.uid()));


-- ============================================================
-- AS PERMISSÕES
--
-- ⚠️ `perfis`: o `update` é por coluna, e nunca alcança as horas que o
-- servidor carimba. `user_id` está na lista porque o `upsert` da API o
-- repete no `set`; a política impede trocá-lo por outro.
-- ============================================================
grant select, insert on table public.perfis to authenticated;
grant update (
  user_id, pessoal, tratamento, acompanhamento, protocolo, preferencias, vistos,
  versao_consentimento, consentido_em, perguntas_para_uso
) on table public.perfis to authenticated;

grant select, insert, update on table public.registros to authenticated;

grant select, delete on table public.perguntas to authenticated;
grant insert (id, user_id, quando, texto, origem) on table public.perguntas to authenticated;

-- As funções do servidor usam a chave secreta — MENOS em `perguntas`. A
-- cascata de `auth.admin.deleteUser` continua apagando as perguntas,
-- porque a ação da chave estrangeira roda como dona da tabela.
grant select, insert, update, delete on table public.perfis, public.registros to service_role;


-- ============================================================
-- A NOSSA LEITURA DAS PERGUNTAS
--
-- Uma visão sem o `user_id`, só de quem ligou a escolha, e um papel que
-- só enxerga ela. Quem analisa não usa o `postgres` do painel, que lê o
-- diário inteiro.
--
-- ⚠️ A visão roda com os direitos da dona (é o que a deixa ler
-- `perguntas` sem que o papel de leitura tenha acesso à tabela). Por isso
-- ninguém além de `analise_perguntas` pode lê-la.
--
-- O papel nasce sem login. Quando alguém for ler, o dono liga o login e
-- dá a senha pelo editor SQL — a senha nunca entra no repositório. Ele
-- mesmo pode ler com `set role analise_perguntas`.
-- ============================================================
create view private.perguntas_para_leitura as
  select q.quando, q.texto, q.origem
  from public.perguntas q
  join public.perfis p on p.user_id = q.user_id
  where p.perguntas_para_uso;

revoke all on private.perguntas_para_leitura from public, anon, authenticated, service_role;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'analise_perguntas') then
    create role analise_perguntas nologin;
  end if;
end;
$$;

grant usage on schema private to analise_perguntas;
grant select on private.perguntas_para_leitura to analise_perguntas;
grant analise_perguntas to postgres;
