-- A conversa com o teto do dia, mas sem o de 30 dias: a conta nunca é feita.
create or replace function private.consumir_cota_da_ia(p_tipo text)
returns jsonb
language plpgsql volatile security definer
set search_path = ''
as $m$
declare
  v_uid uuid := auth.uid();
  v_hoje date := (now() at time zone 'utc')::date;
  v_limite integer;
  v_teto_30 integer;
  v_nos_30 integer := 0;
  v_vezes integer;
  v_restam integer;
begin
  if v_uid is null then
    raise exception 'sem sessão' using errcode = '42501';
  end if;
  -- ⚠️ O login anônimo também é `authenticated`, e não pode abrir a porta:
  -- bastaria criar uma sessão anônima por chamada para nunca ter teto.
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'sessão anônima' using errcode = '42501';
  end if;

  v_limite := case p_tipo
    when 'foto' then 10
    when 'estimativa' then 20
    when 'laudo' then 5
    when 'conversa' then 10
  end;
  if v_limite is null then
    raise exception 'tipo desconhecido: %', p_tipo using errcode = '22023';
  end if;
  -- Só a conversa tem teto de 30 dias, por enquanto.
  v_teto_30 := case p_tipo when 'conversa' then 100 end;

  insert into private.uso_da_ia as u (user_id, dia, tipo, vezes)
  values (v_uid, v_hoje, p_tipo, 1)
  on conflict (user_id, dia, tipo) do update
    set vezes = u.vezes + 1
    where u.vezes < v_limite
  returning vezes into v_vezes;

  -- Sem linha devolvida, o `where` barrou: o teto do dia já foi.
  if v_vezes is null then
    return jsonb_build_object('ok', false, 'limite', v_limite, 'restam', 0, 'periodo', 'dia');
  end if;
  v_restam := v_limite - v_vezes;
  if v_teto_30 is not null then
    v_restam := least(v_restam, v_teto_30 - (v_nos_30 + 1));
  end if;
  return jsonb_build_object('ok', true, 'limite', v_limite, 'restam', v_restam);
end;
$m$;
