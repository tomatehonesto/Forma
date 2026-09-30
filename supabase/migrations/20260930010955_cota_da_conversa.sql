-- ============================================================
-- A COTA DA CONVERSA — o quarto tipo da cota da IA
--
-- O Morphi Intelligence passa a chamar o modelo (servidor/api/conversa),
-- e cada pergunta é paga como a foto e o laudo. Ela entra pela mesma
-- porta (`consumir_cota_da_ia`), com um tipo próprio: o teto da conversa
-- não tranca a foto do almoço, e o contrário também não.
--
-- O TETO, 30 por dia, é palpite, como os outros três: uma conversa longa
-- por dia com folga. Se revê com a medição de custo da especificação
-- (docs/superpowers/specs/2026-09-29-morphi-intelligence-design.md) e com
-- o uso real.
--
-- A função é reescrita inteira, e não remendada: é a mesma de
-- 20260929202900_cota_da_ia, com uma linha a mais no `case`. As
-- permissões ficam como estavam, porque `create or replace` as mantém.
-- ============================================================

alter table private.uso_da_ia drop constraint uso_da_ia_tipo_check;
alter table private.uso_da_ia add constraint uso_da_ia_tipo_check
  check (tipo in ('foto', 'laudo', 'estimativa', 'conversa'));

create or replace function private.consumir_cota_da_ia(p_tipo text)
returns jsonb
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_limite integer;
  v_vezes integer;
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
    when 'foto' then 20
    when 'estimativa' then 40
    when 'laudo' then 10
    when 'conversa' then 30
  end;
  if v_limite is null then
    raise exception 'tipo desconhecido: %', p_tipo using errcode = '22023';
  end if;

  insert into private.uso_da_ia as u (user_id, dia, tipo, vezes)
  values (v_uid, (now() at time zone 'utc')::date, p_tipo, 1)
  on conflict (user_id, dia, tipo) do update
    set vezes = u.vezes + 1
    where u.vezes < v_limite
  returning vezes into v_vezes;

  -- Sem linha devolvida, o `where` barrou: o teto do dia já foi.
  if v_vezes is null then
    return jsonb_build_object('ok', false, 'limite', v_limite, 'restam', 0);
  end if;
  return jsonb_build_object('ok', true, 'limite', v_limite, 'restam', v_limite - v_vezes);
end;
$$;
