-- ============================================================
-- A TRAVA DAS REGRAS DE ACESSO
--
--   node scripts/regras.mjs
--
-- ⚠️⚠️ UMA REGRA ERRADA EXPÕE DADO DE SAÚDE. ⚠️⚠️ É o maior risco da
-- ponte com o Supabase, e é por isso que ela tem trava própria.
--
-- COMO FUNCIONA. O arquivo inteiro é UM bloco `do`: as contas de teste,
-- as clínicas e os registros nascem aqui dentro, as afirmações rodam
-- "como" cada pessoa (trocando o papel e o JWT, como a API faz), e o
-- bloco termina SEMPRE num `raise` — PROVA-OK ou PROVA-FALHOU. A exceção
-- desfaz tudo: nada do que o teste cria fica no banco, nem se ele falhar
-- no meio.
--
-- OS MUTANTES. scripts/regras.mjs roda este arquivo uma vez limpo, e
-- depois uma vez com cada arquivo de supabase/testes/mutantes/ colado no
-- lugar da marca @MUTANTE@. Cada mutante afrouxa uma regra de propósito;
-- se nenhuma afirmação cair, a trava não serve.
--
-- ⚠️ O executor só roda no projeto de desenvolvimento.
-- ============================================================
do $prova$
declare
  -- as pessoas (contas de teste, que só existem dentro deste bloco)
  u_a   constant uuid := '00000000-0000-4000-8000-0000000000a1';
  u_b   constant uuid := '00000000-0000-4000-8000-0000000000b1';
  u_px  constant uuid := '00000000-0000-4000-8000-0000000000c1';  -- profissional da clínica X
  u_py  constant uuid := '00000000-0000-4000-8000-0000000000c2';  -- profissional da clínica Y
  u_pxs constant uuid := '00000000-0000-4000-8000-0000000000c3';  -- saiu da equipe de X

  -- as clínicas e as fichas dos profissionais
  c_x  constant uuid := '00000000-0000-4000-8000-0000000000d1';
  c_y  constant uuid := '00000000-0000-4000-8000-0000000000d2';
  c_w  constant uuid := '00000000-0000-4000-8000-0000000000d3';  -- fora da vitrine
  f_x  constant uuid := '00000000-0000-4000-8000-0000000000e1';
  f_y  constant uuid := '00000000-0000-4000-8000-0000000000e2';
  f_xs constant uuid := '00000000-0000-4000-8000-0000000000e3';
  f_w  constant uuid := '00000000-0000-4000-8000-0000000000e4';

  -- o diário
  r_antes      constant uuid := '00000000-0000-4000-8000-0000000000f1';
  r_sem_quando constant uuid := '00000000-0000-4000-8000-0000000000f2';
  r_depois     constant uuid := '00000000-0000-4000-8000-0000000000f3';
  r_durante    constant uuid := '00000000-0000-4000-8000-0000000000f4';
  r_b          constant uuid := '00000000-0000-4000-8000-0000000000f5';
  q_a1         constant uuid := '00000000-0000-4000-8000-000000000011';
  q_b          constant uuid := '00000000-0000-4000-8000-000000000012';
  rx           constant uuid := '00000000-0000-4000-8000-000000000021';

  v1 text;
  v2 text;
  v3 text;
  v_tmp text;
  v_ok boolean;
  v_total int;
  v_falhas int;
begin
  -- @MUTANTE@

  -- ============================================================
  -- O ARREIO
  -- ============================================================
  create temp table _resultado (
    ordem serial primary key,
    ok boolean not null,
    frase text not null,
    detalhe text
  );

  create function pg_temp.igual(p_obtido text, p_esperado text, p_frase text) returns void
  language sql as $f$
    insert into _resultado (ok, frase, detalhe)
    values (coalesce(p_obtido = p_esperado, false), p_frase,
            'esperava ' || coalesce(p_esperado, '<nulo>') || ', veio ' || coalesce(p_obtido, '<nulo>'))
  $f$;

  create function pg_temp.que(p_ok boolean, p_frase text, p_detalhe text default null) returns void
  language sql as $f$
    insert into _resultado (ok, frase, detalhe) values (coalesce(p_ok, false), p_frase, p_detalhe)
  $f$;

  -- Troca o papel e o JWT como a API faz: `authenticated` com o `sub` da
  -- pessoa, ou `anon`, `service_role` e o papel de leitura das perguntas.
  create function pg_temp.como(p_quem text) returns void
  language plpgsql as $f$
  begin
    if p_quem in ('anon', 'service_role', 'analise_perguntas') then
      perform set_config('request.jwt.claims', json_build_object('role', p_quem)::text, true);
      perform set_config('role', p_quem, true);
    else
      perform set_config('request.jwt.claims',
        json_build_object('sub', p_quem, 'role', 'authenticated')::text, true);
      perform set_config('role', 'authenticated', true);
    end if;
  end;
  $f$;

  -- Quantas linhas a consulta devolve para essa pessoa — ou o erro.
  create function pg_temp.conta(p_quem text, p_sql text) returns text
  language plpgsql as $f$
  declare
    v_dono text := current_user;
    v_n bigint;
  begin
    begin
      perform pg_temp.como(p_quem);
      execute 'select count(*) from (' || p_sql || ') as q' into v_n;
      perform set_config('role', v_dono, true);
      return v_n::text;
    exception when others then
      perform set_config('role', v_dono, true);
      return 'erro:' || sqlstate;
    end;
  end;
  $f$;

  -- Um comando como essa pessoa: 'ok:<linhas afetadas>' — ou o erro.
  create function pg_temp.faz(p_quem text, p_sql text) returns text
  language plpgsql as $f$
  declare
    v_dono text := current_user;
    v_n bigint;
  begin
    begin
      perform pg_temp.como(p_quem);
      execute p_sql;
      get diagnostics v_n = row_count;
      perform set_config('role', v_dono, true);
      return 'ok:' || v_n;
    exception when others then
      perform set_config('role', v_dono, true);
      return 'erro:' || sqlstate;
    end;
  end;
  $f$;

  -- O valor de uma expressão como essa pessoa — ou o erro.
  create function pg_temp.valor(p_quem text, p_sql text) returns text
  language plpgsql as $f$
  declare
    v_dono text := current_user;
    v text;
  begin
    begin
      perform pg_temp.como(p_quem);
      execute 'select (' || p_sql || ')::text' into v;
      perform set_config('role', v_dono, true);
      return coalesce(v, '<nulo>');
    exception when others then
      perform set_config('role', v_dono, true);
      return 'erro:' || sqlstate;
    end;
  end;
  $f$;


  -- ============================================================
  -- AS PESSOAS, AS CLÍNICAS E O DIÁRIO
  -- ============================================================
  insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values
    (u_a,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'regras-a@teste.morphi.invalid',   '{}', '{}', now(), now()),
    (u_b,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'regras-b@teste.morphi.invalid',   '{}', '{}', now(), now()),
    (u_px,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'regras-px@teste.morphi.invalid',  '{}', '{}', now(), now()),
    (u_py,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'regras-py@teste.morphi.invalid',  '{}', '{}', now(), now()),
    (u_pxs, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'regras-pxs@teste.morphi.invalid', '{}', '{}', now(), now());

  insert into public.clinicas (id, nome, cidade, uf, abre, fecha, publicada) values
    (c_x, 'Clínica X (teste)', 'São Paulo', 'SP', '08:00', '17:00', true),
    (c_y, 'Clínica Y (teste)', 'São Paulo', 'SP', '08:00', '17:00', true),
    (c_w, 'Clínica W (teste)', 'São Paulo', 'SP', '08:00', '17:00', false);

  insert into public.profissionais (id, nome, conselho, regiao, registro, user_id) values
    (f_x,  'Profissional de X',        'CRM', 'SP', '1', u_px),
    (f_y,  'Profissional de Y',        'CRM', 'SP', '2', u_py),
    (f_xs, 'Quem saiu da equipe de X', 'CRM', 'SP', '3', u_pxs),
    (f_w,  'Profissional de W',        'CRM', 'SP', '4', null);

  insert into public.equipe (clinica_id, profissional_id, papel, ativo) values
    (c_x, f_x,  'responsavel', true),
    (c_x, f_xs, 'equipe',      false),
    (c_y, f_y,  'responsavel', true),
    (c_w, f_w,  'responsavel', true);

  insert into public.convites (codigo, clinica_id, profissional_id, expira_em) values
    ('TESTEX01',   c_x, f_x, null),
    ('TESTEX02',   c_x, f_x, null),
    ('TESTEY01',   c_y, f_y, null),
    ('TESTEVELHO', c_x, f_x, now() - interval '1 day'),
    ('TESTEW01',   c_w, f_w, null);

  insert into public.perfis (user_id, pessoal, versao_consentimento, consentido_em) values
    (u_a, '{"nome": "A"}', 1, now()),
    (u_b, '{"nome": "B"}', 1, now());

  insert into public.registros (id, user_id, tipo, quando, dados) values
    (r_antes,      u_a, 'peso',              now() - interval '60 days', '{"kg": 80}'),
    (r_sem_quando, u_a, 'refeicao_favorita', null,                       '{"itens": []}'),
    (r_b,          u_b, 'peso',              now() - interval '10 days', '{"kg": 70}');

  -- As perguntas de B entram pelo dono do banco, sem passar pela regra, e
  -- B deixou a gente ler.
  update public.perfis set perguntas_para_uso = true where user_id = u_b;
  insert into public.perguntas (id, user_id, quando, texto, origem)
    values (q_b, u_b, now(), 'regras: pergunta de B', 'digitada');


  -- ============================================================
  -- SEM LOGIN: A VITRINE, E SÓ ELA
  -- ============================================================
  perform pg_temp.igual(pg_temp.conta('anon', format(
    'select 1 from public.clinicas where id in (%L, %L)', c_x, c_y)), '2',
    'sem login, a vitrine mostra as clínicas publicadas');
  perform pg_temp.igual(pg_temp.conta('anon', format(
    'select 1 from public.clinicas where id = %L', c_w)), '0',
    'sem login, a clínica fora da vitrine não aparece');
  perform pg_temp.igual(pg_temp.conta('anon', format(
    'select id, nome from public.profissionais where id = %L', f_x)), '1',
    'sem login, os campos públicos do profissional aparecem');
  perform pg_temp.igual(pg_temp.conta('anon', format(
    'select id from public.profissionais where id = %L', f_w)), '0',
    'sem login, o profissional de clínica fora da vitrine não aparece');
  perform pg_temp.igual(pg_temp.conta('anon',
    'select user_id from public.profissionais'), 'erro:42501',
    'sem login, profissionais.user_id não se lê');
  perform pg_temp.igual(pg_temp.conta('anon',
    'select 1 from public.convites'), 'erro:42501',
    'sem login, a tabela de convites não se lê');
  perform pg_temp.igual(pg_temp.conta('anon', 'select 1 from public.registros'), 'erro:42501',
    'sem login, registros não se leem');
  perform pg_temp.igual(pg_temp.conta('anon', 'select 1 from public.perfis'), 'erro:42501',
    'sem login, perfis não se leem');
  perform pg_temp.igual(pg_temp.conta('anon', 'select 1 from public.perguntas'), 'erro:42501',
    'sem login, perguntas não se leem');
  perform pg_temp.igual(pg_temp.conta('anon', 'select 1 from public.vinculos'), 'erro:42501',
    'sem login, vínculos não se leem');
  perform pg_temp.igual(pg_temp.conta('anon', 'select 1 from public.mensagens'), 'erro:42501',
    'sem login, mensagens não se leem');

  perform pg_temp.igual(pg_temp.valor('anon',
    $$public.conferir_convite(' testex01 ')->>'codigo'$$), 'TESTEX01',
    'sem login, o código se confere (e é normalizado)');
  perform pg_temp.igual(pg_temp.valor('anon',
    $$public.conferir_convite('TESTEX01')->'clinica'->>'nome'$$), 'Clínica X (teste)',
    'a conferência devolve a clínica');
  perform pg_temp.igual(pg_temp.valor('anon',
    $$public.conferir_convite('TESTEVELHO')$$), '<nulo>',
    'código vencido é "não achamos"');
  perform pg_temp.igual(pg_temp.valor('anon',
    $$public.conferir_convite('TESTEW01')$$), '<nulo>',
    'código de clínica fora da vitrine é "não achamos"');
  perform pg_temp.igual(pg_temp.valor('anon',
    $$public.conferir_convite('NAOEXISTE')$$), '<nulo>',
    'código que não existe é "não achamos"');
  perform pg_temp.igual(pg_temp.valor('anon',
    $$public.usar_convite('TESTEX01', 1)$$), 'erro:42501',
    'sem login, ninguém usa um código');


  -- ============================================================
  -- A USA O CÓDIGO DE X
  -- ============================================================
  v1 := pg_temp.valor(u_a::text, $$public.usar_convite('TESTEX01', 1)->>'id'$$);
  perform pg_temp.que(v1 ~ '^[0-9a-f-]{36}$', 'A usa o código de X e o vínculo nasce', 'veio ' || v1);
  perform pg_temp.igual(pg_temp.valor(u_a::text, $$public.usar_convite('testex01', 1)->>'id'$$), v1,
    'usar o mesmo código de novo não cria um segundo vínculo');
  perform pg_temp.igual((select count(*)::text from public.vinculos where paciente_id = u_a and encerrado_em is null), '1',
    'A tem um vínculo ativo só');
  perform pg_temp.igual(pg_temp.valor(u_b::text, $$public.conferir_convite('TESTEX01')$$), '<nulo>',
    'código usado por outra pessoa é "não achamos"');
  perform pg_temp.igual(pg_temp.valor(u_a::text, $$public.conferir_convite('TESTEX01')->>'codigo'$$), 'TESTEX01',
    'quem usou o código continua achando o próprio código');
  perform pg_temp.igual(pg_temp.valor(u_b::text, $$public.usar_convite('TESTEX01', 1)$$), '<nulo>',
    'B não usa o código que A usou');
  perform pg_temp.igual(pg_temp.conta(u_a::text, 'select 1 from public.convites'), '0',
    'o paciente nunca lê a tabela de convites');


  -- ============================================================
  -- COM O VÍNCULO ATIVO
  -- ============================================================
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where id = %L', r_antes)), '1',
    'o profissional de X lê o diário de A — inclusive o de antes do vínculo');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where id = %L', r_sem_quando)), '1',
    'com o vínculo ativo, lê também o que não tem data');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.perfis where user_id = %L', u_a)), '1',
    'com o vínculo ativo, lê o perfil de A');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where user_id = %L', u_b)), '0',
    'o profissional de X não lê B, que não tem vínculo');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.registros where user_id = %L', u_a)), '0',
    'o profissional de Y nunca lê A');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.perfis where user_id = %L', u_a)), '0',
    'o profissional de Y nunca lê o perfil de A');
  perform pg_temp.igual(pg_temp.conta(u_pxs::text, format('select 1 from public.registros where user_id = %L', u_a)), '0',
    'quem saiu da equipe de X não lê mais nada');
  perform pg_temp.igual(pg_temp.conta(u_b::text, format('select 1 from public.registros where user_id = %L', u_a)), '0',
    'B não lê os registros de A');
  perform pg_temp.igual(pg_temp.conta(u_a::text, format('select 1 from public.registros where user_id = %L', u_b)), '0',
    'A não lê os registros de B');
  perform pg_temp.igual(pg_temp.conta(u_a::text, format('select 1 from public.perfis where user_id = %L', u_b)), '0',
    'A não lê o perfil de B');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.vinculos where paciente_id = %L', u_a)), '1',
    'a equipe de X lê o vínculo de A com X');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.vinculos where paciente_id = %L', u_a)), '0',
    'a equipe de Y não lê o vínculo de A com X');

  -- ninguém além de A escreve no diário de A
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'insert into public.registros (id, user_id, tipo) values (gen_random_uuid(), %L, %L)', u_a, 'peso')), 'erro:42501',
    'a equipe não cria registro no diário de A');
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'update public.registros set dados = %L where id = %L', '{"kg": 1}', r_antes)), 'ok:0',
    'a equipe não muda registro de A');
  perform pg_temp.igual(pg_temp.faz(u_b::text, format(
    'update public.registros set dados = %L where id = %L', '{"kg": 1}', r_antes)), 'ok:0',
    'B não muda registro de A');
  perform pg_temp.igual(pg_temp.faz(u_b::text, format(
    'insert into public.registros (id, user_id, tipo) values (gen_random_uuid(), %L, %L)', u_a, 'peso')), 'erro:42501',
    'B não cria registro no diário de A');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.registros set user_id = %L where id = %L', u_b, r_antes)), 'erro:42501',
    'A não troca o dono de uma linha dela para B');
  -- ⚠️ Num update COM filtro, a regra de leitura também confere a linha
  -- nova, e é ela que barra a troca acima mesmo que o `with check` se
  -- afrouxe. Sem filtro, a leitura não entra: fica só o `with check`.
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.registros set user_id = %L', u_b)), 'erro:42501',
    'A não troca o dono das linhas dela para B, nem num update sem filtro');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.registros (id, user_id, tipo, quando, dados) values (%L, %L, %L, now(), %L)',
    r_durante, u_a, 'checkin', '{"sintomas": ["enjoo"]}')), 'ok:1',
    'A registra no próprio diário');

  -- o perfil, como a API escreve o upsert, e o que o servidor carimba
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.perfis (user_id, pessoal) values (%L, %L) on conflict (user_id) do update set user_id = excluded.user_id, pessoal = excluded.pessoal',
    u_a, '{"nome": "A de novo"}')), 'ok:1',
    'o upsert do perfil funciona como a API o escreve');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perfis set consentimento_registrado_em = now() where user_id = %L', u_a)), 'erro:42501',
    'A não escreve a hora em que o servidor registrou o consentimento');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perfis set perguntas_para_uso_em = now() where user_id = %L', u_a)), 'erro:42501',
    'A não escreve a hora da escolha das perguntas');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perfis set versao_consentimento = 2 where user_id = %L', u_a)), 'ok:1',
    'A aceita a versão nova do consentimento');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perfis set versao_consentimento = 1 where user_id = %L', u_a)), 'erro:23514',
    'A não diminui a versão do consentimento');
  perform pg_temp.que((select consentimento_registrado_em is not null from public.perfis where user_id = u_a),
    'o servidor carimbou a hora do consentimento');

  -- as mensagens
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, profissional_id, texto) values (%L, %L, %L, %L, %L)',
    v1, u_a, 'equipe', f_x, 'Como foi a semana?')), 'ok:1',
    'a equipe de X escreve para A');
  perform pg_temp.igual(pg_temp.faz(u_py::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, profissional_id, texto) values (%L, %L, %L, %L, %L)',
    v1, u_a, 'equipe', f_y, 'intrusa')), 'erro:42501',
    'a equipe de Y não escreve para A');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, texto) values (%L, %L, %L, %L)',
    v1, u_a, 'paciente', 'Boa, obrigada')), 'ok:1',
    'A responde à equipe');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, profissional_id, texto) values (%L, %L, %L, %L, %L)',
    v1, u_a, 'equipe', f_x, 'falsa')), 'erro:42501',
    'A não escreve mensagem como equipe');
  perform pg_temp.igual(pg_temp.faz(u_b::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, texto) values (%L, %L, %L, %L)',
    v1, u_a, 'paciente', 'intrusa')), 'erro:42501',
    'B não escreve no vínculo de A');
  perform pg_temp.igual(pg_temp.conta(u_a::text, format('select 1 from public.mensagens where vinculo_id = %L', v1)), '2',
    'A lê a conversa');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.mensagens where vinculo_id = %L', v1)), '2',
    'a equipe de X lê a conversa');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.mensagens where vinculo_id = %L', v1)), '0',
    'a equipe de Y não lê a conversa');

  -- a receita: o paciente mexe só no pedido de renovação
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'insert into public.receitas (id, vinculo_id, paciente_id, profissional_id, nome) values (%L, %L, %L, %L, %L)',
    rx, v1, u_a, f_x, 'Mounjaro 5 mg')), 'ok:1',
    'a equipe de X emite uma receita para A');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.receitas set renovacao_pedida_em = now() where id = %L', rx)), 'ok:1',
    'A pede a renovação da receita');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.receitas set nome = %L where id = %L', 'Mounjaro 15 mg', rx)), 'erro:42501',
    'A não muda o que a receita diz');
  perform pg_temp.igual(pg_temp.faz(u_py::text, format(
    'update public.receitas set nome = %L where id = %L', 'Outra', rx)), 'ok:0',
    'a equipe de Y não mexe na receita de A');

  -- o vínculo só nasce e acaba pelas funções
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.vinculos (paciente_id, clinica_id, consentimento_versao) values (%L, %L, 1)', u_a, c_y)), 'erro:42501',
    'A não cria vínculo sem as funções');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.vinculos set encerrado_em = now(), encerrado_por = %L where id = %L', 'paciente', v1)), 'erro:42501',
    'A não encerra vínculo sem as funções');

  -- os convites são da clínica
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.convites where clinica_id = %L', c_x)), '3',
    'a equipe de X lê os convites de X');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.convites where clinica_id = %L', c_x)), '0',
    'a equipe de Y não lê os convites de X');
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'insert into public.convites (codigo, clinica_id, profissional_id) values (%L, %L, %L)', 'TESTEX03', c_x, f_x)), 'ok:1',
    'a equipe de X cria um convite de X');
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'insert into public.convites (codigo, clinica_id, profissional_id) values (%L, %L, %L)', 'TESTEY09', c_y, f_x)), 'erro:42501',
    'a equipe de X não cria convite de Y');


  -- ============================================================
  -- O TEMPO REAL
  --
  -- ⚠️ `realtime.messages` é particionada por dia, e quem cria as
  -- partições é o próprio serviço de tempo real, quando alguém se conecta.
  -- Sem a partição de hoje, `realtime.send` engole o erro e nenhum aviso
  -- chega. scripts/regras.mjs acorda o serviço antes; a primeira
  -- afirmação diz se deu certo, para as outras não caírem por causa do
  -- ambiente parecendo que caíram por causa da regra.
  -- ============================================================
  perform pg_temp.que(exists (
      select 1
      from pg_inherits i
      join pg_class c on c.oid = i.inhrelid
      where i.inhparent = 'realtime.messages'::regclass
        and c.relname = 'messages_' || to_char(now() at time zone 'utc', 'YYYY_MM_DD')
    ),
    'o tempo real está acordado (há partição de hoje em realtime.messages)',
    'sem ela nenhum aviso chega; rode de novo, que o executor acorda o serviço antes');
  perform pg_temp.que((select count(*) > 0 from realtime.messages where topic = 'paciente:' || u_a::text),
    'a mensagem da equipe avisa no canal de A');
  perform pg_temp.que((select count(*) > 0 from realtime.messages
                        where topic = 'clinica:' || c_x::text and payload->>'tabela' = 'registros'),
    'o registro de A avisa no canal da clínica X');
  perform set_config('realtime.topic', 'paciente:' || u_a::text, true);
  perform pg_temp.que(pg_temp.conta(u_a::text, 'select 1 from realtime.messages') not in ('0') and pg_temp.conta(u_a::text, 'select 1 from realtime.messages') not like 'erro:%',
    'A ouve o próprio canal', 'veio ' || pg_temp.conta(u_a::text, 'select 1 from realtime.messages'));
  perform pg_temp.igual(pg_temp.conta(u_b::text, 'select 1 from realtime.messages'), '0',
    'B não ouve o canal de A');
  perform set_config('realtime.topic', 'clinica:' || c_x::text, true);
  perform pg_temp.que(pg_temp.conta(u_px::text, 'select 1 from realtime.messages') not in ('0') and pg_temp.conta(u_px::text, 'select 1 from realtime.messages') not like 'erro:%',
    'a equipe de X ouve o canal de X', 'veio ' || pg_temp.conta(u_px::text, 'select 1 from realtime.messages'));
  perform pg_temp.igual(pg_temp.conta(u_py::text, 'select 1 from realtime.messages'), '0',
    'a equipe de Y não ouve o canal de X');
  perform pg_temp.igual(pg_temp.conta(u_a::text, 'select 1 from realtime.messages'), '0',
    'A não ouve o canal da clínica');
  perform set_config('realtime.topic', '', true);


  -- ============================================================
  -- AS PERGUNTAS AO COMPANHEIRO
  -- ============================================================
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.perguntas (id, user_id, quando, texto, origem) values (%L, %L, now(), %L, %L)',
    q_a1, u_a, 'regras: pergunta de A', 'digitada')), 'erro:42501',
    'com a escolha desligada, a pergunta de A não sobe');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perfis set perguntas_para_uso = true where user_id = %L', u_a)), 'ok:1',
    'A liga a escolha das perguntas');
  perform pg_temp.que((select perguntas_para_uso_em is not null from public.perfis where user_id = u_a),
    'o servidor carimbou a hora da escolha');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.perguntas (id, user_id, quando, texto, origem) values (%L, %L, now(), %L, %L)',
    q_a1, u_a, 'regras: pergunta de A', 'digitada')), 'ok:1',
    'com a escolha ligada, a pergunta sobe');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.perguntas (id, user_id, quando, texto, origem) values (%L, %L, now(), %L, %L) on conflict do nothing',
    q_a1, u_a, 'regras: pergunta de A', 'digitada')), 'ok:0',
    'subir a mesma pergunta de novo não duplica (só com a permissão de inserir)');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perguntas set texto = %L where id = %L', 'outra coisa', q_a1)), 'erro:42501',
    'A não muda uma pergunta que já subiu');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.perguntas where user_id = %L', u_a)), '0',
    'o profissional de X não lê as perguntas de A, nem com vínculo ativo');
  perform pg_temp.igual((select count(*)::text from realtime.messages
                          where topic like 'clinica:%' and payload->>'tabela' = 'perguntas'), '0',
    'o canal da clínica não recebe evento de pergunta');
  perform pg_temp.igual(pg_temp.conta('service_role', 'select 1 from public.perguntas'), 'erro:42501',
    'a chave secreta não lê as perguntas');

  -- a nossa leitura
  perform pg_temp.que((select count(*) = 0 from information_schema.columns
                        where table_schema = 'private' and table_name = 'perguntas_para_leitura'
                          and column_name = 'user_id'),
    'a visão das perguntas não traz o user_id');
  perform pg_temp.que((select count(*) >= 2 from private.perguntas_para_leitura
                        where texto in ('regras: pergunta de A', 'regras: pergunta de B')),
    'a visão mostra as perguntas de quem deixou');
  perform pg_temp.igual(pg_temp.conta('anon', 'select 1 from private.perguntas_para_leitura'), 'erro:42501',
    'sem login, a visão das perguntas não se lê');
  perform pg_temp.igual(pg_temp.conta(u_a::text, 'select 1 from private.perguntas_para_leitura'), 'erro:42501',
    'com login, a visão das perguntas não se lê');
  perform pg_temp.igual(pg_temp.conta('service_role', 'select 1 from private.perguntas_para_leitura'), 'erro:42501',
    'a chave secreta não lê a visão das perguntas');
  v_tmp := pg_temp.conta('analise_perguntas',
    $$select 1 from private.perguntas_para_leitura where texto in ('regras: pergunta de A', 'regras: pergunta de B')$$);
  perform pg_temp.igual(v_tmp, '2', 'o papel de leitura lê a visão das perguntas');
  perform pg_temp.igual(pg_temp.conta('analise_perguntas', 'select 1 from public.registros'), 'erro:42501',
    'o papel de leitura não lê registros');
  perform pg_temp.igual(pg_temp.conta('analise_perguntas', 'select 1 from public.perfis'), 'erro:42501',
    'o papel de leitura não lê perfis');
  perform pg_temp.igual(pg_temp.conta('analise_perguntas', 'select 1 from public.mensagens'), 'erro:42501',
    'o papel de leitura não lê mensagens');
  perform pg_temp.igual(pg_temp.conta('analise_perguntas', 'select 1 from public.perguntas'), 'erro:42501',
    'o papel de leitura não lê a tabela de perguntas, com o dono');

  -- desligar a escolha: a visão esquece, e A apaga as suas
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'update public.perfis set perguntas_para_uso = false where user_id = %L', u_a)), 'ok:1',
    'A desliga a escolha das perguntas');
  perform pg_temp.igual((select count(*)::text from private.perguntas_para_leitura where texto = 'regras: pergunta de A'), '0',
    'com a escolha desligada, a visão não mostra as perguntas de A');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format('delete from public.perguntas where user_id = %L', u_b)), 'ok:0',
    'A não apaga as perguntas de B');
  perform pg_temp.igual(pg_temp.faz(u_a::text, 'delete from public.perguntas'), 'ok:1',
    'A apaga as suas perguntas');
  perform pg_temp.igual((select count(*)::text from public.perguntas where user_id = u_b), '1',
    'as perguntas de B continuam lá');


  -- ============================================================
  -- A FICHA DA PRÓPRIA CLÍNICA, FORA DA VITRINE
  -- ============================================================
  update public.clinicas set publicada = false where id = c_x;
  perform pg_temp.igual(pg_temp.conta('anon', format('select 1 from public.clinicas where id = %L', c_x)), '0',
    'X saiu da vitrine');
  perform pg_temp.igual(pg_temp.conta(u_a::text, format('select 1 from public.clinicas where id = %L', c_x)), '1',
    'A lê a ficha de X mesmo fora da vitrine, porque tem vínculo com ela');
  perform pg_temp.igual(pg_temp.conta(u_a::text, format('select 1 from public.equipe where clinica_id = %L', c_x)), '2',
    'A lê a equipe de X, inclusive quem saiu (é quem assinou as mensagens)');
  perform pg_temp.igual(pg_temp.conta(u_a::text, format('select id, nome from public.profissionais where id = %L', f_x)), '1',
    'A lê a ficha pública do profissional de X');
  perform pg_temp.igual(pg_temp.conta(u_b::text, format('select 1 from public.clinicas where id = %L', c_x)), '0',
    'B, sem vínculo, não lê X fora da vitrine');
  update public.clinicas set publicada = true where id = c_x;


  -- ============================================================
  -- A CLÍNICA ENCERRA
  -- ============================================================
  perform pg_temp.igual(pg_temp.valor(u_py::text, format('public.encerrar_vinculo(%L)', v1)), '<nulo>',
    'a equipe de Y não encerra o vínculo de A com X');
  perform pg_temp.igual(pg_temp.valor(u_px::text, format($$public.encerrar_vinculo(%L)->>'encerrado_por'$$, v1)), 'clinica',
    'a equipe de X encerra o vínculo, e fica registrado que foi a clínica');
  perform pg_temp.que((select perfil_no_fim is not null from public.vinculos where id = v1::uuid),
    'o encerramento copia o perfil');
  perform pg_temp.que((select not (perfil_no_fim ? 'perguntas_para_uso') from public.vinculos where id = v1::uuid),
    'a cópia do perfil não leva a escolha das perguntas');

  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.registros (id, user_id, tipo, quando, dados) values (%L, %L, %L, now() + interval %L, %L)',
    r_depois, u_a, 'peso', '1 day', '{"kg": 79}')), 'ok:1',
    'A continua registrando depois do fim');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where id = %L', r_antes)), '1',
    'depois do fim, a equipe de X lê o que foi registrado até o fim');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where id = %L', r_depois)), '0',
    'depois do fim, a equipe de X não lê o que veio depois');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where id = %L', r_sem_quando)), '0',
    'depois do fim, a equipe de X não lê o que não tem data');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.perfis where user_id = %L', u_a)), '0',
    'depois do fim, a equipe de X não lê o perfil de A');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select perfil_no_fim from public.vinculos where id = %L', v1)), '1',
    'depois do fim, a equipe de X lê a cópia do perfil');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.mensagens where vinculo_id = %L', v1)), '2',
    'depois do fim, a equipe de X lê as mensagens daquele vínculo');
  perform pg_temp.igual(pg_temp.faz(u_px::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, profissional_id, texto) values (%L, %L, %L, %L, %L)',
    v1, u_a, 'equipe', f_x, 'depois do fim')), 'erro:42501',
    'depois do fim, a equipe de X não escreve para A');
  perform pg_temp.igual(pg_temp.faz(u_a::text, format(
    'insert into public.mensagens (vinculo_id, paciente_id, autor, texto) values (%L, %L, %L, %L)',
    v1, u_a, 'paciente', 'depois do fim')), 'erro:42501',
    'depois do fim, A não escreve no vínculo encerrado');


  -- ============================================================
  -- A TROCA DE CLÍNICA
  -- ============================================================
  v2 := pg_temp.valor(u_a::text, $$public.usar_convite('TESTEX02', 1)->>'id'$$);
  perform pg_temp.que(v2 ~ '^[0-9a-f-]{36}$' and v2 <> v1, 'A volta para X com outro código', 'veio ' || v2);
  v3 := pg_temp.valor(u_a::text, $$public.usar_convite('TESTEY01', 1)->>'id'$$);
  perform pg_temp.que(v3 ~ '^[0-9a-f-]{36}$', 'A troca X por Y', 'veio ' || v3);
  perform pg_temp.que((select encerrado_por = 'paciente' and perfil_no_fim is not null from public.vinculos where id = v2::uuid),
    'a troca encerra o vínculo anterior, pelo paciente, com a cópia do perfil');
  perform pg_temp.igual((select string_agg(id::text, ',') from public.vinculos where paciente_id = u_a and encerrado_em is null), v3,
    'depois da troca, o único vínculo ativo é o de Y');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.registros where id = %L', r_depois)), '1',
    'a equipe de Y lê o diário inteiro de A');
  perform pg_temp.igual(pg_temp.conta(u_px::text, format('select 1 from public.registros where id = %L', r_depois)), '0',
    'a equipe de X, que ficou para trás, não lê o que veio depois');


  -- ============================================================
  -- O PACIENTE ENCERRA
  -- ============================================================
  perform pg_temp.igual(pg_temp.valor(u_a::text, $$public.encerrar_vinculo()->>'encerrado_por'$$), 'paciente',
    'A desconecta, e fica registrado que foi o paciente');
  perform pg_temp.igual(pg_temp.conta(u_py::text, format('select 1 from public.registros where id = %L', r_depois)), '0',
    'depois de A desconectar, a equipe de Y não lê o que veio depois do fim');


  -- ============================================================
  -- APAGAR A CONTA
  -- ============================================================
  begin
    delete from auth.users where id = u_a;
    v_ok := true;
  exception when others then
    v_ok := false;
    v_tmp := sqlstate;
  end;
  perform pg_temp.que(v_ok, 'apagar a conta de A não falha', 'erro ' || coalesce(v_tmp, ''));
  perform pg_temp.igual((
    select (
      (select count(*) from public.perfis where user_id = u_a)
      + (select count(*) from public.registros where user_id = u_a)
      + (select count(*) from public.perguntas where user_id = u_a)
      + (select count(*) from public.vinculos where paciente_id = u_a)
      + (select count(*) from public.mensagens where paciente_id = u_a)
      + (select count(*) from public.receitas where paciente_id = u_a)
    )::text), '0',
    'apagar a conta não deixa linha de A em tabela nenhuma (a cópia do perfil inclusive)');
  perform pg_temp.igual((select count(*)::text from public.convites
                          where codigo in ('TESTEX01', 'TESTEX02', 'TESTEY01') and usado_por is not null), '0',
    'os convites que A usou ficam sem dono');


  -- ============================================================
  -- O RESULTADO — e o `raise` que desfaz tudo
  -- ============================================================
  select count(*), count(*) filter (where not ok) into v_total, v_falhas from _resultado;
  if v_falhas = 0 then
    raise exception 'PROVA-OK % afirmações', v_total;
  else
    raise exception 'PROVA-FALHOU % de % || %', v_falhas, v_total, (
      select string_agg('[' || ordem || '] ' || frase || ' — ' || coalesce(detalhe, ''), ' || ' order by ordem)
      from _resultado where not ok
    );
  end if;
end;
$prova$;
