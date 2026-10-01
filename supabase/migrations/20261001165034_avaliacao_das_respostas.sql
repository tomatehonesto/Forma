-- ============================================================
-- A AVALIAÇÃO DAS RESPOSTAS DA MORPHI INTELLIGENCE
--
-- O 👍 e o 👎 embaixo de cada resposta (app/companion). Decidido pelo
-- dono em 01/10/2026: o 👍 manda só a nota; o 👎 abre uma folha com o
-- motivo e manda, se a pessoa confirmar, a pergunta e a resposta — é o
-- único caminho para a conversa aprender com o uso, porque ela mora no
-- aparelho e nós não a lemos.
--
-- ⚠️ NO ESQUEMA PRIVADO, E SÓ POR FUNÇÃO. A tabela não aparece na API: a
-- pessoa grava pela função `avaliar_resposta`, e ninguém lê pela API —
-- nem a própria pessoa, que já tem a conversa no aparelho. Quem lê somos
-- nós, pelo painel.
--
-- ⚠️ DOZE MESES, E QUEM APAGA É A PRÓPRIA FUNÇÃO. Não há pg_cron no
-- projeto: cada avaliação nova apaga as de mais de 365 dias, de todo
-- mundo. Apagar a conta apaga as da pessoa na hora (on delete cascade).
--
-- ⚠️ SÓ O 👎 LEVA TEXTO, e a tabela garante isso: nota 1 sem pergunta e
-- sem resposta. O resumo da jornada não vem nunca — só a troca.
-- ============================================================

create table private.avaliacoes_da_ia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  criada timestamptz not null default now(),
  nota smallint not null check (nota in (-1, 1)),
  motivo text check (motivo in ('errada', 'nao-respondeu', 'tom', 'arriscada', 'outro')),
  pergunta text check (char_length(pergunta) <= 1000),
  resposta text check (char_length(resposta) <= 8000),
  idioma text check (char_length(idioma) <= 10),
  pais text check (pais ~ '^[A-Z]{2}$'),
  check (nota = -1 or (motivo is null and pergunta is null and resposta is null))
);

create index avaliacoes_da_ia_criada on private.avaliacoes_da_ia (criada);
create index avaliacoes_da_ia_user_dia on private.avaliacoes_da_ia (user_id, criada);

alter table private.avaliacoes_da_ia enable row level security;
revoke all on table private.avaliacoes_da_ia from public, anon, authenticated;

create function private.avaliar_resposta(
  p_nota integer, p_motivo text, p_pergunta text, p_resposta text, p_idioma text, p_pais text
)
returns jsonb
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_hoje integer;
begin
  if v_uid is null then
    raise exception 'sem sessão' using errcode = '42501';
  end if;
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'sessão anônima' using errcode = '42501';
  end if;
  if p_nota not in (-1, 1) then
    raise exception 'nota inválida' using errcode = '22023';
  end if;

  -- O teto é contra abuso, e não contra uso: ninguém avalia trinta
  -- respostas num dia, e a conversa tem teto de dez perguntas.
  select count(*) into v_hoje
  from private.avaliacoes_da_ia
  where user_id = v_uid and criada > now() - interval '1 day';
  if v_hoje >= 30 then
    return jsonb_build_object('ok', false, 'motivo', 'limite');
  end if;

  delete from private.avaliacoes_da_ia where criada < now() - interval '365 days';

  insert into private.avaliacoes_da_ia (user_id, nota, motivo, pergunta, resposta, idioma, pais)
  values (
    v_uid,
    p_nota,
    case when p_nota = -1 then p_motivo end,
    case when p_nota = -1 then nullif(left(p_pergunta, 1000), '') end,
    case when p_nota = -1 then nullif(left(p_resposta, 8000), '') end,
    left(p_idioma, 10),
    case when p_pais ~ '^[A-Z]{2}$' then p_pais end
  );
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function private.avaliar_resposta(integer, text, text, text, text, text) from public, anon, authenticated;
grant execute on function private.avaliar_resposta(integer, text, text, text, text, text) to authenticated;

-- A casca, na API
create function public.avaliar_resposta(
  nota integer, motivo text default null, pergunta text default null,
  resposta text default null, idioma text default null, pais text default null
)
returns jsonb
language sql volatile security invoker
set search_path = ''
as $$
  select private.avaliar_resposta(nota, motivo, pergunta, resposta, idioma, pais)
$$;

revoke all on function public.avaliar_resposta(integer, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.avaliar_resposta(integer, text, text, text, text, text) to authenticated;
