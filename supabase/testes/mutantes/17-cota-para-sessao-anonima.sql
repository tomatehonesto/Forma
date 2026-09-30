-- A cota que não confere se a sessão é anônima.
create or replace function private.consumir_cota_da_ia(p_tipo text)
returns jsonb
language plpgsql volatile security definer
set search_path = ''
as $m$
declare
  v_uid uuid := auth.uid();
  v_limite integer := case p_tipo when 'foto' then 20 when 'estimativa' then 40 when 'laudo' then 10 when 'conversa' then 30 end;
  v_vezes integer;
begin
  if v_uid is null then
    raise exception 'sem sessão' using errcode = '42501';
  end if;
  if v_limite is null then
    raise exception 'tipo desconhecido' using errcode = '22023';
  end if;
  insert into private.uso_da_ia as u (user_id, dia, tipo, vezes)
  values (v_uid, (now() at time zone 'utc')::date, p_tipo, 1)
  on conflict (user_id, dia, tipo) do update set vezes = u.vezes + 1 where u.vezes < v_limite
  returning vezes into v_vezes;
  if v_vezes is null then
    return jsonb_build_object('ok', false, 'limite', v_limite, 'restam', 0);
  end if;
  return jsonb_build_object('ok', true, 'limite', v_limite, 'restam', v_limite - v_vezes);
end;
$m$;
