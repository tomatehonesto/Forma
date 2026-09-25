-- Quem saiu da equipe continuaria lendo: `equipe.ativo` ignorado.
create or replace function private.minhas_clinicas()
returns setof uuid
language sql stable security definer
set search_path = ''
as $m$
  select e.clinica_id
  from public.equipe e
  join public.profissionais p on p.id = e.profissional_id
  where p.user_id = (select auth.uid())
$m$;
