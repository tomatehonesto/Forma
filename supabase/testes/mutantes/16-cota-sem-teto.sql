-- A cota que soma sem parar no teto do dia.
create or replace function private.consumir_cota_da_ia(p_tipo text)
returns jsonb
language plpgsql volatile security definer
set search_path = ''
as $m$
declare
  v_uid uuid := auth.uid();
  v_vezes integer;
begin
  if v_uid is null then
    raise exception 'sem sessão' using errcode = '42501';
  end if;
  insert into private.uso_da_ia as u (user_id, dia, tipo, vezes)
  values (v_uid, (now() at time zone 'utc')::date, p_tipo, 1)
  on conflict (user_id, dia, tipo) do update set vezes = u.vezes + 1
  returning vezes into v_vezes;
  return jsonb_build_object('ok', true, 'limite', 10, 'restam', 10 - v_vezes);
end;
$m$;
