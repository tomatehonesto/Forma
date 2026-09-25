-- ============================================================
-- DA CLÍNICA PARA O PACIENTE
--
-- Mensagens, receitas, consultas, os planos da equipe e os materiais.
-- Cada linha nasce num vínculo (`vinculo_id`) e é de um paciente
-- (`paciente_id`), e os dois precisam concordar — um gatilho confere.
--
-- Quem escreve: a equipe, só com o vínculo ativo (`equipe_escreve`). O
-- paciente escreve só as próprias mensagens, e mexe numa receita só no
-- pedido de renovação.
-- Quem lê: o paciente lê o que é dele; a equipe lê o que nasceu nos
-- vínculos da sua clínica, ativos ou encerrados (`equipe_le_vinculo`).
-- ============================================================

create table public.mensagens (
  id uuid primary key default gen_random_uuid(),
  vinculo_id uuid not null references public.vinculos (id) on delete cascade,
  paciente_id uuid not null references auth.users (id) on delete cascade,
  autor text not null,
  -- quem escreveu, quando foi a equipe
  profissional_id uuid references public.profissionais (id) on delete set null,
  texto text not null,
  -- a hora em que foi escrita; pode vir do aparelho, que escreve sem
  -- internet — o cursor da sincronia é `atualizado_em`, do servidor
  criada_em timestamptz not null default now(),
  lida_em timestamptz,
  atualizado_em timestamptz not null default now(),

  constraint mensagens_autor check (autor in ('paciente', 'equipe')),
  constraint mensagens_texto check (char_length(texto) between 1 and 10000)
);
create index mensagens_do_paciente on public.mensagens (paciente_id, atualizado_em);
create index mensagens_do_vinculo on public.mensagens (vinculo_id);
create index mensagens_do_profissional on public.mensagens (profissional_id);

create table public.receitas (
  id uuid primary key default gen_random_uuid(),
  vinculo_id uuid not null references public.vinculos (id) on delete cascade,
  paciente_id uuid not null references auth.users (id) on delete cascade,
  profissional_id uuid references public.profissionais (id) on delete set null,
  nome text not null,
  detalhe text,
  emitida_em timestamptz not null default now(),
  renovacao_pedida_em timestamptz,
  atualizado_em timestamptz not null default now()
);
create index receitas_do_paciente on public.receitas (paciente_id, atualizado_em);
create index receitas_do_vinculo on public.receitas (vinculo_id);
create index receitas_do_profissional on public.receitas (profissional_id);

create table public.consultas (
  id uuid primary key default gen_random_uuid(),
  vinculo_id uuid not null references public.vinculos (id) on delete cascade,
  paciente_id uuid not null references auth.users (id) on delete cascade,
  profissional_id uuid references public.profissionais (id) on delete set null,
  quando timestamptz not null,
  -- "Retorno", "Primeira consulta"… como a clínica escreveu
  tipo text,
  -- o que ficou da consulta, para o histórico
  nota text,
  atualizado_em timestamptz not null default now()
);
create index consultas_do_paciente on public.consultas (paciente_id, atualizado_em);
create index consultas_do_vinculo on public.consultas (vinculo_id);
create index consultas_do_profissional on public.consultas (profissional_id);

-- As metas e tarefas que a equipe define. O formato de `dados` é o
-- contrato que o portal vai cumprir; ele nasce aberto de propósito,
-- enquanto o portal não existe.
create table public.planos_da_equipe (
  id uuid primary key default gen_random_uuid(),
  vinculo_id uuid not null references public.vinculos (id) on delete cascade,
  paciente_id uuid not null references auth.users (id) on delete cascade,
  profissional_id uuid references public.profissionais (id) on delete set null,
  dados jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now(),

  constraint planos_dados check (jsonb_typeof(dados) = 'object' and octet_length(dados::text) <= 65536)
);
create index planos_do_paciente on public.planos_da_equipe (paciente_id, atualizado_em);
create index planos_do_vinculo on public.planos_da_equipe (vinculo_id);
create index planos_do_profissional on public.planos_da_equipe (profissional_id);

-- De uma pessoa (com vínculo e paciente), ou de todos os pacientes da
-- clínica (sem os dois).
create table public.materiais (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas (id) on delete cascade,
  vinculo_id uuid references public.vinculos (id) on delete cascade,
  paciente_id uuid references auth.users (id) on delete cascade,
  profissional_id uuid references public.profissionais (id) on delete set null,
  dados jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint materiais_para_quem check ((vinculo_id is null) = (paciente_id is null)),
  constraint materiais_dados check (jsonb_typeof(dados) = 'object' and octet_length(dados::text) <= 65536)
);
create index materiais_da_clinica on public.materiais (clinica_id);
create index materiais_do_paciente on public.materiais (paciente_id, atualizado_em);
create index materiais_do_vinculo on public.materiais (vinculo_id);
create index materiais_do_profissional on public.materiais (profissional_id);


-- ============================================================
-- OS GATILHOS
-- ============================================================

-- O vínculo e o paciente concordam, e a hora é a do servidor.
create function private.da_clinica_ao_gravar()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.vinculos v
    where v.id = new.vinculo_id and v.paciente_id = new.paciente_id
  ) then
    raise exception 'o vínculo e o paciente não concordam' using errcode = '23514';
  end if;
  new.atualizado_em := clock_timestamp();
  return new;
end;
$$;
revoke all on function private.da_clinica_ao_gravar() from public;

create trigger mensagens_ao_gravar before insert or update on public.mensagens
  for each row execute function private.da_clinica_ao_gravar();
create trigger receitas_ao_gravar before insert or update on public.receitas
  for each row execute function private.da_clinica_ao_gravar();
create trigger consultas_ao_gravar before insert or update on public.consultas
  for each row execute function private.da_clinica_ao_gravar();
create trigger planos_ao_gravar before insert or update on public.planos_da_equipe
  for each row execute function private.da_clinica_ao_gravar();

create function private.materiais_ao_gravar()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if new.vinculo_id is not null and not exists (
    select 1 from public.vinculos v
    where v.id = new.vinculo_id and v.paciente_id = new.paciente_id and v.clinica_id = new.clinica_id
  ) then
    raise exception 'o vínculo, o paciente e a clínica não concordam' using errcode = '23514';
  end if;
  new.atualizado_em := clock_timestamp();
  return new;
end;
$$;
revoke all on function private.materiais_ao_gravar() from public;

create trigger materiais_ao_gravar before insert or update on public.materiais
  for each row execute function private.materiais_ao_gravar();

-- ⚠️ Na receita, o paciente mexe só no pedido de renovação. A permissão
-- é por coluna, mas o paciente e a equipe são o mesmo papel no banco
-- (`authenticated`) — quem separa os dois é este gatilho.
create function private.receitas_quem_muda()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) = old.paciente_id
     and (new.nome, new.detalhe, new.profissional_id, new.emitida_em, new.vinculo_id, new.paciente_id)
         is distinct from
         (old.nome, old.detalhe, old.profissional_id, old.emitida_em, old.vinculo_id, old.paciente_id)
  then
    raise exception 'o paciente só pede a renovação' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.receitas_quem_muda() from public;

create trigger receitas_quem_muda before update on public.receitas
  for each row execute function private.receitas_quem_muda();


-- ============================================================
-- AS REGRAS — uma por operação
-- ============================================================
alter table public.mensagens enable row level security;
alter table public.receitas enable row level security;
alter table public.consultas enable row level security;
alter table public.planos_da_equipe enable row level security;
alter table public.materiais enable row level security;

-- ---- mensagens ----
create policy mensagens_leitura on public.mensagens
  for select to authenticated
  using (paciente_id = (select auth.uid()) or private.equipe_le_vinculo(vinculo_id));

create policy mensagens_criacao on public.mensagens
  for insert to authenticated
  with check (
    (autor = 'paciente'
      and paciente_id = (select auth.uid())
      and profissional_id is null
      and vinculo_id = (select private.meu_vinculo_ativo()))
    or
    (autor = 'equipe'
      and profissional_id = (select private.meu_profissional())
      and private.equipe_escreve(vinculo_id, paciente_id))
  );

-- Só `lida_em` muda (a permissão é dessa coluna): o paciente marca o que
-- a equipe escreveu, e a equipe marca o que o paciente escreveu.
create policy mensagens_leitura_marcada on public.mensagens
  for update to authenticated
  using (
    (autor = 'equipe' and paciente_id = (select auth.uid()))
    or (autor = 'paciente' and private.equipe_escreve(vinculo_id, paciente_id))
  )
  with check (
    (autor = 'equipe' and paciente_id = (select auth.uid()))
    or (autor = 'paciente' and private.equipe_escreve(vinculo_id, paciente_id))
  );

-- ---- receitas ----
create policy receitas_leitura on public.receitas
  for select to authenticated
  using (paciente_id = (select auth.uid()) or private.equipe_le_vinculo(vinculo_id));

create policy receitas_criacao on public.receitas
  for insert to authenticated
  with check (
    profissional_id = (select private.meu_profissional())
    and private.equipe_escreve(vinculo_id, paciente_id)
  );

create policy receitas_mudanca on public.receitas
  for update to authenticated
  using (
    (paciente_id = (select auth.uid()) and vinculo_id = (select private.meu_vinculo_ativo()))
    or private.equipe_escreve(vinculo_id, paciente_id)
  )
  with check (
    (paciente_id = (select auth.uid()) and vinculo_id = (select private.meu_vinculo_ativo()))
    or private.equipe_escreve(vinculo_id, paciente_id)
  );

-- ---- consultas e planos: a equipe escreve, o paciente lê ----
create policy consultas_leitura on public.consultas
  for select to authenticated
  using (paciente_id = (select auth.uid()) or private.equipe_le_vinculo(vinculo_id));
create policy consultas_criacao on public.consultas
  for insert to authenticated
  with check (
    (profissional_id is null or profissional_id = (select private.meu_profissional()))
    and private.equipe_escreve(vinculo_id, paciente_id)
  );
create policy consultas_mudanca on public.consultas
  for update to authenticated
  using (private.equipe_escreve(vinculo_id, paciente_id))
  with check (private.equipe_escreve(vinculo_id, paciente_id));

create policy planos_leitura on public.planos_da_equipe
  for select to authenticated
  using (paciente_id = (select auth.uid()) or private.equipe_le_vinculo(vinculo_id));
create policy planos_criacao on public.planos_da_equipe
  for insert to authenticated
  with check (
    (profissional_id is null or profissional_id = (select private.meu_profissional()))
    and private.equipe_escreve(vinculo_id, paciente_id)
  );
create policy planos_mudanca on public.planos_da_equipe
  for update to authenticated
  using (private.equipe_escreve(vinculo_id, paciente_id))
  with check (private.equipe_escreve(vinculo_id, paciente_id));

-- ---- materiais ----
create policy materiais_leitura on public.materiais
  for select to authenticated
  using (
    paciente_id = (select auth.uid())
    or (paciente_id is null and clinica_id = (select private.minha_clinica_ativa()))
    or clinica_id in (select private.minhas_clinicas())
  );
create policy materiais_criacao on public.materiais
  for insert to authenticated
  with check (
    clinica_id in (select private.minhas_clinicas())
    and (paciente_id is null or private.equipe_escreve(vinculo_id, paciente_id))
  );
create policy materiais_mudanca on public.materiais
  for update to authenticated
  using (
    clinica_id in (select private.minhas_clinicas())
    and (paciente_id is null or private.equipe_escreve(vinculo_id, paciente_id))
  )
  with check (
    clinica_id in (select private.minhas_clinicas())
    and (paciente_id is null or private.equipe_escreve(vinculo_id, paciente_id))
  );


-- ============================================================
-- AS PERMISSÕES
-- ============================================================
grant select, insert on table public.mensagens to authenticated;
grant update (lida_em) on table public.mensagens to authenticated;

grant select, insert on table public.receitas to authenticated;
grant update (nome, detalhe, renovacao_pedida_em) on table public.receitas to authenticated;

grant select, insert, update on table public.consultas, public.planos_da_equipe, public.materiais to authenticated;

grant select, insert, update, delete
  on table public.mensagens, public.receitas, public.consultas, public.planos_da_equipe, public.materiais
  to service_role;
