-- A conferência aceitando código já usado por outra pessoa.
create or replace function private.conferir_convite(p_codigo text)
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $m$
declare
  v_codigo text := upper(btrim(coalesce(p_codigo, '')));
  v_convite public.convites;
  v_clinica public.clinicas;
  v_profissional public.profissionais;
begin
  if char_length(v_codigo) not between 4 and 32 then
    return null;
  end if;
  select * into v_convite from public.convites where codigo = v_codigo;
  if not found or (v_convite.expira_em is not null and v_convite.expira_em <= now()) then
    return null;
  end if;
  select * into v_clinica from public.clinicas where id = v_convite.clinica_id and publicada;
  if not found then
    return null;
  end if;
  select * into v_profissional from public.profissionais where id = v_convite.profissional_id;
  return jsonb_build_object(
    'codigo', v_convite.codigo,
    'clinica', private.clinica_json(v_clinica),
    'profissional', private.profissional_json(v_profissional, false)
  );
end;
$m$;
