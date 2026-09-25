-- ============================================================
-- A PONTE — convites, vínculos e o que a equipe lê
--
-- ⚠️⚠️ É AQUI QUE UMA REGRA ERRADA EXPÕE DADO DE SAÚDE. ⚠️⚠️
--
-- Tudo o que a equipe de uma clínica lê do diário de alguém passa por
-- `private.equipe_le`, e ela diz a regra do prontuário inteira:
--
--   · com vínculo ATIVO, a equipe lê o diário inteiro — inclusive o que
--     foi registrado antes do vínculo;
--   · depois do FIM, lê só os registros com `quando` até a data do fim,
--     e o perfil só pela cópia feita no fim (`vinculos.perfil_no_fim`);
--   · quem saiu da equipe (`equipe.ativo` falso) não lê mais nada;
--   · outra clínica nunca lê nada.
--
-- A trava de tudo isto é supabase/testes/regras.sql, rodada por
-- scripts/regras.mjs, com um erro plantado para cada regra.
-- ============================================================

create table public.convites (
  -- normalizado: maiúsculo e sem espaço, como `normalizarConvite`
  codigo text primary key,
  clinica_id uuid not null references public.clinicas (id) on delete cascade,
  -- quem convidou
  profissional_id uuid not null references public.profissionais (id) on delete cascade,
  criado_em timestamptz not null default now(),
  expira_em timestamptz,
  usado_por uuid references auth.users (id) on delete set null,
  usado_em timestamptz,

  constraint convites_codigo_normalizado check (
    codigo = upper(btrim(codigo)) and char_length(codigo) between 4 and 32
  )
);

create index convites_da_clinica on public.convites (clinica_id);
create index convites_do_profissional on public.convites (profissional_id);
create index convites_de_quem_usou on public.convites (usado_por);

create table public.vinculos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references auth.users (id) on delete cascade,
  -- ⚠️ `restrict`: uma clínica com vínculos não some do banco, porque o
  -- que ela registrou durante o vínculo é prontuário.
  clinica_id uuid not null references public.clinicas (id) on delete restrict,
  -- responsável pelo paciente
  profissional_id uuid references public.profissionais (id) on delete set null,
  -- o código usado; sem chave estrangeira, porque o convite pode sair do
  -- portal e o vínculo continua
  convite text,
  desde timestamptz not null default now(),
  encerrado_em timestamptz,
  encerrado_por text,
  -- o consentimento de compartilhar com a clínica, que é outro que o
  -- geral: a versão do texto que a pessoa leu em /codigo, e quando
  consentimento_versao integer not null,
  consentido_em timestamptz not null default now(),
  -- a cópia do perfil feita no encerramento (ver `private.encerra`)
  perfil_no_fim jsonb,

  constraint vinculos_fim check ((encerrado_em is null) = (encerrado_por is null)),
  constraint vinculos_encerrado_por check (encerrado_por in ('paciente', 'clinica')),
  constraint vinculos_consentimento check (consentimento_versao >= 1)
);

-- Um vínculo ativo por paciente. Duas clínicas ao mesmo tempo é outro
-- projeto (ver o desenho, "O que este desenho NÃO faz").
create unique index vinculos_um_ativo on public.vinculos (paciente_id) where encerrado_em is null;
create index vinculos_do_paciente on public.vinculos (paciente_id);
create index vinculos_da_clinica on public.vinculos (clinica_id);
create index vinculos_do_profissional on public.vinculos (profissional_id);


-- ============================================================
-- AS FUNÇÕES QUE DECIDEM
--
-- `security definer` para lerem vínculos e equipes sem passar pelas
-- regras dessas mesmas tabelas — sem isso, as regras que se consultam
-- entrariam em laço. Moram em `private`, que a API não expõe; nenhuma
-- delas escreve nada; e toda resposta parte de `auth.uid()`, a pessoa que
-- pergunta.
-- ============================================================

-- As clínicas em que quem pergunta é da equipe, AGORA.
create function private.minhas_clinicas()
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select e.clinica_id
  from public.equipe e
  join public.profissionais p on p.id = e.profissional_id
  where p.user_id = (select auth.uid()) and e.ativo
$$;

-- A regra do prontuário. Sem momento (o perfil, os favoritos), só com o
-- vínculo ativo.
create function private.equipe_le(paciente uuid, momento timestamptz)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.vinculos v
    where v.paciente_id = paciente
      and v.clinica_id in (select private.minhas_clinicas())
      and (v.encerrado_em is null or (momento is not null and momento <= v.encerrado_em))
  )
$$;

-- O que nasceu num vínculo (mensagens, receitas, consultas, planos) a
-- equipe da clínica lê enquanto for equipe — ativo ou encerrado.
create function private.equipe_le_vinculo(vinculo uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.vinculos v
    where v.id = vinculo and v.clinica_id in (select private.minhas_clinicas())
  )
$$;

-- Escrever para alguém, só com o vínculo ativo.
create function private.equipe_escreve(vinculo uuid, paciente uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.vinculos v
    where v.id = vinculo
      and v.paciente_id = paciente
      and v.encerrado_em is null
      and v.clinica_id in (select private.minhas_clinicas())
  )
$$;

create function private.meu_vinculo_ativo()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select v.id from public.vinculos v
  where v.paciente_id = (select auth.uid()) and v.encerrado_em is null
$$;

create function private.minha_clinica_ativa()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select v.clinica_id from public.vinculos v
  where v.paciente_id = (select auth.uid()) and v.encerrado_em is null
$$;

-- As clínicas dos vínculos de quem pergunta, ativos e encerrados.
create function private.minhas_clinicas_de_paciente()
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select distinct v.clinica_id from public.vinculos v
  where v.paciente_id = (select auth.uid())
$$;

-- Os profissionais dessas clínicas — é quem assina as mensagens, mesmo
-- depois de sair da equipe.
create function private.profissionais_das_minhas_clinicas()
returns setof uuid
language sql stable security definer
set search_path = ''
as $$
  select distinct e.profissional_id from public.equipe e
  where e.clinica_id in (select private.minhas_clinicas_de_paciente())
$$;

create function private.meu_profissional()
returns uuid
language sql stable security definer
set search_path = ''
as $$
  select p.id from public.profissionais p where p.user_id = (select auth.uid())
$$;

revoke all on function
  private.minhas_clinicas(),
  private.equipe_le(uuid, timestamptz),
  private.equipe_le_vinculo(uuid),
  private.equipe_escreve(uuid, uuid),
  private.meu_vinculo_ativo(),
  private.minha_clinica_ativa(),
  private.minhas_clinicas_de_paciente(),
  private.profissionais_das_minhas_clinicas(),
  private.meu_profissional()
from public, anon;

grant execute on function
  private.minhas_clinicas(),
  private.equipe_le(uuid, timestamptz),
  private.equipe_le_vinculo(uuid),
  private.equipe_escreve(uuid, uuid),
  private.meu_vinculo_ativo(),
  private.minha_clinica_ativa(),
  private.minhas_clinicas_de_paciente(),
  private.profissionais_das_minhas_clinicas(),
  private.meu_profissional()
to authenticated;


-- ============================================================
-- A EQUIPE ENTRA NA LEITURA DO DIÁRIO
--
-- `alter policy`, e não uma política a mais: continua sendo uma política
-- por operação, com a dona e a equipe na mesma frase.
-- ============================================================
alter policy perfis_leitura on public.perfis
  using (user_id = (select auth.uid()) or private.equipe_le(user_id, null));

alter policy registros_leitura on public.registros
  using (user_id = (select auth.uid()) or private.equipe_le(user_id, quando));


-- ============================================================
-- A FICHA DA PRÓPRIA CLÍNICA
--
-- O paciente lê a clínica, a equipe e os profissionais das clínicas dos
-- seus vínculos, ativos e encerrados, PUBLICADAS OU NÃO. Sem isso, uma
-- clínica que sai da vitrine sumiria do aplicativo de quem ela acompanha,
-- e as mensagens chegariam de autores que o aparelho não sabe quem são.
-- ============================================================
alter policy clinicas_leitura on public.clinicas
  using (publicada or id in (select private.minhas_clinicas_de_paciente()));

alter policy equipe_leitura on public.equipe
  using (
    (ativo and exists (
      select 1 from public.clinicas c where c.id = equipe.clinica_id and c.publicada
    ))
    or clinica_id in (select private.minhas_clinicas_de_paciente())
  );

alter policy profissionais_leitura on public.profissionais
  using (
    exists (
      select 1
      from public.equipe e
      join public.clinicas c on c.id = e.clinica_id
      where e.profissional_id = profissionais.id and e.ativo and c.publicada
    )
    or id in (select private.profissionais_das_minhas_clinicas())
  );


-- ============================================================
-- VÍNCULOS E CONVITES
--
-- Ninguém cria nem encerra vínculo pela API: só pelas funções de
-- "funcoes_do_convite", que conferem o código e registram o
-- consentimento. Por isso não há grant de escrita em `vinculos`.
-- ============================================================
alter table public.vinculos enable row level security;
alter table public.convites enable row level security;

create policy vinculos_leitura on public.vinculos
  for select to authenticated
  using (paciente_id = (select auth.uid()) or clinica_id in (select private.minhas_clinicas()));

-- Os convites são da clínica: quem é da equipe lê e cria os da sua. O
-- paciente e quem não tem login nunca leem esta tabela — conferem um
-- código pela função, que não lista nada.
create policy convites_leitura on public.convites
  for select to authenticated
  using (clinica_id in (select private.minhas_clinicas()));
create policy convites_criacao on public.convites
  for insert to authenticated
  with check (
    clinica_id in (select private.minhas_clinicas())
    and profissional_id = (select private.meu_profissional())
  );

grant select on table public.vinculos to authenticated;
grant select on table public.convites to authenticated;
grant insert (codigo, clinica_id, profissional_id, expira_em) on table public.convites to authenticated;

grant select, insert, update, delete on table public.vinculos, public.convites to service_role;
