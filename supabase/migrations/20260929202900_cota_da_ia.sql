-- ============================================================
-- A COTA DA IA — quantas vezes por dia cada pessoa chama o modelo
--
-- A leitura da foto do prato, a do laudo e a estimativa de um prato pelo
-- nome passam pelo servidor da Vercel, e cada chamada é paga. O servidor
-- tinha só um token compartilhado, que vai no pacote do aplicativo e é
-- extraível: quem o tirasse de lá chamava o modelo quanto quisesse, na
-- conta do Morphi.
--
-- Agora o servidor manda o JWT de quem está logado para
-- `public.consumir_cota_da_ia`, com a chave pública. Uma chamada só faz as
-- duas coisas: a API recusa um JWT inválido antes de chegar aqui, e a
-- função soma um uso e diz se ainda cabe no dia. Sem chave secreta no
-- servidor.
--
-- ⚠️ A TABELA MORA EM `private`, e não tem política nenhuma: ninguém lê
-- nem escreve nela pela API. Só o miolo `security definer` escreve, e só
-- na linha de `auth.uid()`. Se ela fosse exposta com escrita para o dono,
-- apagar a própria linha zeraria a cota.
--
-- O DIA É O DE UTC. A cota não é um prazo que a pessoa acompanha; é o
-- teto que segura o custo, e um dia contado por fuso seria uma coluna a
-- mais para decidir o mesmo número.
--
-- OS TETOS são o uso de alguém que registra tudo com folga — três fotos
-- por refeição, cinco refeições — e ficam longe do de quem abusa. Mudar
-- um é mudar esta função numa migração nova.
-- ============================================================

create table private.uso_da_ia (
  user_id uuid not null references auth.users (id) on delete cascade,
  dia date not null,
  tipo text not null check (tipo in ('foto', 'laudo', 'estimativa')),
  vezes integer not null default 0 check (vezes >= 0),
  primary key (user_id, dia, tipo)
);

alter table private.uso_da_ia enable row level security;
revoke all on table private.uso_da_ia from public, anon, authenticated;

-- ------------------------------------------------------------
-- O miolo: confere quem é, soma um uso e responde se coube
-- ------------------------------------------------------------
create function private.consumir_cota_da_ia(p_tipo text)
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

revoke all on function private.consumir_cota_da_ia(text) from public, anon, authenticated;
grant execute on function private.consumir_cota_da_ia(text) to authenticated;

-- ------------------------------------------------------------
-- A casca: a porta da API, `security invoker`
-- ------------------------------------------------------------
create function public.consumir_cota_da_ia(tipo text)
returns jsonb
language sql volatile security invoker
set search_path = ''
as $$
  select private.consumir_cota_da_ia(tipo)
$$;

revoke all on function public.consumir_cota_da_ia(text) from public, anon, authenticated;
grant execute on function public.consumir_cota_da_ia(text) to authenticated;
