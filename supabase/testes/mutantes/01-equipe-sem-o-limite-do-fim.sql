-- A regra do prontuário sem o limite do fim: depois de encerrado o
-- vínculo, a equipe passaria a ler o que veio depois.
create or replace function private.equipe_le(paciente uuid, momento timestamptz)
returns boolean
language sql stable security definer
set search_path = ''
as $m$
  select exists (
    select 1
    from public.vinculos v
    where v.paciente_id = paciente
      and v.clinica_id in (select private.minhas_clinicas())
      and (v.encerrado_em is null or momento is not null)
  )
$m$;
