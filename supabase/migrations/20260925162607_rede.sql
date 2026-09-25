-- ============================================================
-- A REDE — clínicas, profissionais e equipes
--
-- O portal mantém (quando existir), a vitrine lê. As colunas seguem o
-- contrato de `Clinica` e `Profissional` em src/logic/rede.ts: é o que a
-- vitrine precisa receber, e nada além disso.
--
-- Aqui nasce só a leitura da VITRINE: clínicas publicadas, a equipe
-- ativa delas e os campos públicos de quem está nelas. A ficha da
-- própria clínica, publicada ou não, entra em "ponte", junto com os
-- vínculos. As escritas do portal nascem com o portal.
-- ============================================================

create table public.clinicas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  -- caminhos no armazenamento `clinicas` (público para leitura)
  foto text,
  logo text,
  -- com as palavras da própria clínica
  sobre text,
  -- rua e número; sem endereço é só teleconsulta
  endereco text,
  bairro text,
  cidade text not null,
  uf text not null,
  lat double precision,
  lng double precision,
  -- 0 é domingo, como em `Date.getDay()`
  dias smallint[] not null default '{}',
  -- "08:00"
  abre text not null,
  fecha text not null,
  presencial boolean not null default false,
  teleconsulta boolean not null default false,
  convenios text[] not null default '{}',
  particular boolean not null default false,
  -- whatsapp, telefone, agenda, site, email, instagram — canal vazio não aparece
  contato jsonb not null default '{}'::jsonb,

  -- Se aparece na vitrine.
  publicada boolean not null default false,
  -- ⚠️ Clínica inventada, da semente do projeto de desenvolvimento. É o
  -- que faz a vitrine avisar "Clínicas de exemplo" — o aviso vem do dado,
  -- e não de qual projeto está ligado. Nenhuma linha de produção tem isto.
  exemplo boolean not null default false,

  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint clinicas_uf check (uf ~ '^[A-Z]{2}$'),
  constraint clinicas_ponto check (
    (lat is null) = (lng is null)
    and (lat is null or (lat between -90 and 90 and lng between -180 and 180))
  ),
  constraint clinicas_dias check (dias <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]),
  constraint clinicas_horario check (abre ~ '^[0-2][0-9]:[0-5][0-9]$' and fecha ~ '^[0-2][0-9]:[0-5][0-9]$'),
  constraint clinicas_contato check (jsonb_typeof(contato) = 'object')
);

create table public.profissionais (
  id uuid primary key default gen_random_uuid(),
  -- como o profissional escreveu no portal, com o título se ele usa
  nome text not null,
  foto text,
  especialidades text[] not null default '{}',
  conselho text not null,
  -- a região do conselho: UF no CRM ("SP"), número no CRN ("3") e no CRP ("06")
  regiao text not null,
  registro text not null,
  -- Registro de Qualificação de Especialista — só de médico
  rqe text[] not null default '{}',
  -- ⚠️ A conta com que entra no portal. Nunca é pública: a vitrine lê só
  -- as colunas concedidas abaixo, e esta não está entre elas.
  user_id uuid unique references auth.users (id) on delete set null,

  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint profissionais_especialidades check (
    especialidades <@ array['endocrinologia', 'nutrologia', 'nutricao', 'esporte', 'psicologia']::text[]
  ),
  constraint profissionais_conselho check (conselho in ('CRM', 'CRN', 'CRP'))
);

-- Quem trabalha em qual clínica. Um profissional pode estar em mais de
-- uma, e em cada uma tem o seu papel. `ativo` falso é quem saiu: perde a
-- leitura de tudo na mesma hora (ver `private.minhas_clinicas`).
create table public.equipe (
  clinica_id uuid not null references public.clinicas (id) on delete cascade,
  profissional_id uuid not null references public.profissionais (id) on delete cascade,
  -- quem responde pela clínica é o rosto do cartão
  papel text not null default 'equipe',
  ativo boolean not null default true,
  ordem smallint not null default 0,
  primary key (clinica_id, profissional_id),
  constraint equipe_papel check (papel in ('responsavel', 'equipe'))
);

create index equipe_do_profissional on public.equipe (profissional_id);

create trigger clinicas_ao_gravar
  before insert or update on public.clinicas
  for each row execute function private.carimba_atualizado_em();
create trigger profissionais_ao_gravar
  before insert or update on public.profissionais
  for each row execute function private.carimba_atualizado_em();


-- ============================================================
-- A VITRINE
--
-- Sem login, só o que está publicado. Com login, a mesma coisa — e,
-- em "ponte", mais a ficha das clínicas dos próprios vínculos.
-- ============================================================
alter table public.clinicas enable row level security;
alter table public.profissionais enable row level security;
alter table public.equipe enable row level security;

create policy clinicas_vitrine on public.clinicas
  for select to anon
  using (publicada);
create policy clinicas_leitura on public.clinicas
  for select to authenticated
  using (publicada);

create policy equipe_vitrine on public.equipe
  for select to anon
  using (
    ativo and exists (
      select 1 from public.clinicas c where c.id = equipe.clinica_id and c.publicada
    )
  );
create policy equipe_leitura on public.equipe
  for select to authenticated
  using (
    ativo and exists (
      select 1 from public.clinicas c where c.id = equipe.clinica_id and c.publicada
    )
  );

create policy profissionais_vitrine on public.profissionais
  for select to anon
  using (
    exists (
      select 1
      from public.equipe e
      join public.clinicas c on c.id = e.clinica_id
      where e.profissional_id = profissionais.id and e.ativo and c.publicada
    )
  );
create policy profissionais_leitura on public.profissionais
  for select to authenticated
  using (
    exists (
      select 1
      from public.equipe e
      join public.clinicas c on c.id = e.clinica_id
      where e.profissional_id = profissionais.id and e.ativo and c.publicada
    )
  );

grant select on table public.clinicas, public.equipe to anon, authenticated;
-- ⚠️ Por coluna: `user_id` fica de fora. Um `select *` da API falha aqui
-- de propósito; a vitrine pede as colunas pelo nome.
grant select (id, nome, foto, especialidades, conselho, regiao, registro, rqe)
  on table public.profissionais to anon, authenticated;

grant select, insert, update, delete
  on table public.clinicas, public.equipe, public.profissionais to service_role;
