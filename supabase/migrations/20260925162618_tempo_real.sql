-- ============================================================
-- O TEMPO REAL — por Broadcast, em canais privados
--
-- ⚠️ A MENSAGEM LEVA SÓ A TABELA E O ID, sem nenhum dado de saúde. Quem
-- recebe pede de novo pela leitura normal, que passa pelas regras de
-- sempre. É por isso que o Broadcast, e não o "Postgres Changes": lá, o
-- evento de exclusão não passa pelas regras de acesso.
--
-- Dois canais:
--   · `paciente:<uuid>` — o que a clínica escreve para a pessoa, e o
--     vínculo dela (é assim que o aplicativo sabe, na hora, que a
--     clínica encerrou);
--   · `clinica:<uuid>` — o que a pessoa com vínculo ativo registra, que
--     é a base do alerta de sintoma grave que o portal vai desenhar.
--     UMA PERGUNTA AO COMPANHEIRO NUNCA VAI PARA ESTE CANAL.
-- ============================================================

create function private.avisa_paciente()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_linha record;
begin
  if tg_op = 'DELETE' then
    v_linha := old;
  else
    v_linha := new;
  end if;
  -- material da clínica toda não tem paciente: desce quando o aplicativo abre
  if v_linha.paciente_id is null then
    return null;
  end if;
  perform realtime.send(
    jsonb_build_object('tabela', tg_table_name, 'id', v_linha.id),
    'mudou',
    'paciente:' || v_linha.paciente_id::text,
    true
  );
  return null;
end;
$$;
revoke all on function private.avisa_paciente() from public;

create function private.avisa_clinica()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_linha record;
  v_paciente uuid;
  v_id uuid;
  v_clinica uuid;
begin
  if tg_op = 'DELETE' then
    v_linha := old;
  else
    v_linha := new;
  end if;

  if tg_table_name = 'perfis' then
    v_paciente := v_linha.user_id;
    v_id := v_linha.user_id;
  elsif tg_table_name = 'registros' then
    v_paciente := v_linha.user_id;
    v_id := v_linha.id;
  elsif tg_table_name = 'mensagens' then
    v_paciente := v_linha.paciente_id;
    v_id := v_linha.id;
  else
    return null;
  end if;

  select v.clinica_id into v_clinica
    from public.vinculos v
   where v.paciente_id = v_paciente and v.encerrado_em is null;

  if v_clinica is not null then
    perform realtime.send(
      jsonb_build_object('tabela', tg_table_name, 'id', v_id, 'paciente', v_paciente),
      'mudou',
      'clinica:' || v_clinica::text,
      true
    );
  end if;
  return null;
end;
$$;
revoke all on function private.avisa_clinica() from public;

-- para o paciente
create trigger mensagens_avisa_paciente after insert or update or delete on public.mensagens
  for each row execute function private.avisa_paciente();
create trigger receitas_avisa_paciente after insert or update or delete on public.receitas
  for each row execute function private.avisa_paciente();
create trigger consultas_avisa_paciente after insert or update or delete on public.consultas
  for each row execute function private.avisa_paciente();
create trigger planos_avisa_paciente after insert or update or delete on public.planos_da_equipe
  for each row execute function private.avisa_paciente();
create trigger materiais_avisa_paciente after insert or update or delete on public.materiais
  for each row execute function private.avisa_paciente();
create trigger vinculos_avisa_paciente after insert or update on public.vinculos
  for each row execute function private.avisa_paciente();

-- para a clínica
create trigger perfis_avisa_clinica after insert or update on public.perfis
  for each row execute function private.avisa_clinica();
create trigger registros_avisa_clinica after insert or update on public.registros
  for each row execute function private.avisa_clinica();
create trigger mensagens_avisa_clinica after insert or update on public.mensagens
  for each row execute function private.avisa_clinica();


-- ============================================================
-- QUEM OUVE O QUÊ
--
-- O tópico é comparado por texto, e nunca convertido: um tópico
-- malformado não pode derrubar a regra. Ninguém ganha política de
-- `insert`, então nenhum aparelho transmite nada — só o banco.
-- ============================================================
create policy ouvir_o_proprio_canal on realtime.messages
  for select to authenticated
  using (
    realtime.messages.extension = 'broadcast'
    and (
      (select realtime.topic()) = 'paciente:' || (select auth.uid())::text
      or (select realtime.topic()) in (
        select 'clinica:' || c::text from private.minhas_clinicas() as c
      )
    )
  );
