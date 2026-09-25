-- ============================================================
-- AS FUNÇÕES DO CONVITE — conferir, usar e encerrar
--
-- Cada uma tem duas camadas:
--   · em `public`, uma casca `security invoker`, que é a porta da API;
--   · em `private`, o miolo `security definer`, que confere
--     `auth.uid()` antes de tudo.
-- Nenhuma função `security definer` mora num esquema exposto.
--
-- O que elas devolvem tem a forma dos tipos de src/logic/rede.ts
-- (`Clinica`, `Profissional`), para o aplicativo usar sem traduzir.
-- ============================================================

-- ------------------------------------------------------------
-- As fichas, em JSON — só os campos públicos
-- ------------------------------------------------------------
create function private.profissional_json(p public.profissionais, responsavel boolean)
returns jsonb
language sql stable
set search_path = ''
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'id', p.id,
    'nome', p.nome,
    'foto', p.foto,
    'especialidades', to_jsonb(p.especialidades),
    'conselho', p.conselho,
    'regiao', p.regiao,
    'registro', p.registro,
    'rqe', case when cardinality(p.rqe) > 0 then to_jsonb(p.rqe) end,
    'responsavel', case when responsavel then true end
  ))
$$;

create function private.clinica_json(c public.clinicas)
returns jsonb
language sql stable
set search_path = ''
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'id', c.id,
    'nome', c.nome,
    'foto', c.foto,
    'logo', c.logo,
    'sobre', c.sobre,
    'endereco', c.endereco,
    'bairro', c.bairro,
    'cidade', c.cidade,
    'uf', c.uf,
    'ponto', case when c.lat is not null then jsonb_build_object('lat', c.lat, 'lng', c.lng) end,
    'dias', to_jsonb(c.dias),
    'abre', c.abre,
    'fecha', c.fecha,
    'presencial', c.presencial,
    'teleconsulta', c.teleconsulta,
    'convenios', to_jsonb(c.convenios),
    'particular', c.particular,
    'contato', c.contato,
    'exemplo', c.exemplo,
    'equipe', coalesce((
      select jsonb_agg(private.profissional_json(p, e.papel = 'responsavel') order by e.ordem, p.nome)
      from public.equipe e
      join public.profissionais p on p.id = e.profissional_id
      where e.clinica_id = c.id and e.ativo
    ), '[]'::jsonb)
  ))
$$;

-- A cópia local do vínculo, que o aparelho guarda em `profile.vinculo`.
create function private.vinculo_json(v public.vinculos)
returns jsonb
language sql stable
set search_path = ''
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'id', v.id,
    'convite', v.convite,
    'desde', v.desde,
    'encerrado_em', v.encerrado_em,
    'encerrado_por', v.encerrado_por,
    'consentimento_versao', v.consentimento_versao,
    'clinica', (select private.clinica_json(c) from public.clinicas c where c.id = v.clinica_id),
    'profissional', (select private.profissional_json(p, false) from public.profissionais p where p.id = v.profissional_id)
  ))
$$;

revoke all on function
  private.profissional_json(public.profissionais, boolean),
  private.clinica_json(public.clinicas),
  private.vinculo_json(public.vinculos)
from public, anon, authenticated;


-- ------------------------------------------------------------
-- Encerrar, que as duas pontas usam
--
-- ⚠️ A cópia do perfil vai para `perfil_no_fim`, que é o que a clínica
-- passa a ler depois do fim. A escolha das perguntas não vai junto: ela
-- é entre a pessoa e nós, e a clínica não tem o que fazer com ela.
-- ------------------------------------------------------------
create function private.encerra(p_vinculo uuid, p_por text)
returns public.vinculos
language plpgsql
set search_path = ''
as $$
declare
  v public.vinculos;
begin
  update public.vinculos
     set encerrado_em = now(),
         encerrado_por = p_por,
         perfil_no_fim = (
           select to_jsonb(p) - 'perguntas_para_uso' - 'perguntas_para_uso_em'
           from public.perfis p
           where p.user_id = vinculos.paciente_id
         )
   where id = p_vinculo and encerrado_em is null
  returning * into v;
  return v;
end;
$$;
revoke all on function private.encerra(uuid, text) from public, anon, authenticated;


-- ------------------------------------------------------------
-- conferir_convite(codigo) — sem login
--
-- Devolve a clínica e quem convidou se o código existe, não expirou, é
-- de clínica publicada e não foi usado (ou foi usado por quem pergunta).
-- Senão, nulo: "não achamos". Nunca lista códigos.
-- ------------------------------------------------------------
create function private.conferir_convite(p_codigo text)
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_codigo text := upper(btrim(coalesce(p_codigo, '')));
  v_eu uuid := (select auth.uid());
  v_convite public.convites;
  v_clinica public.clinicas;
  v_profissional public.profissionais;
begin
  if char_length(v_codigo) not between 4 and 32 then
    return null;
  end if;

  select * into v_convite from public.convites where codigo = v_codigo;
  if not found
     or (v_convite.expira_em is not null and v_convite.expira_em <= now())
     or (v_convite.usado_por is not null and v_convite.usado_por is distinct from v_eu) then
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
    'profissional', private.profissional_json(
      v_profissional,
      exists (
        select 1 from public.equipe e
        where e.clinica_id = v_clinica.id
          and e.profissional_id = v_profissional.id
          and e.papel = 'responsavel'
      )
    )
  );
end;
$$;


-- ------------------------------------------------------------
-- usar_convite(codigo, versao_consentimento) — com login
--
-- Numa transação: trava o convite, encerra o vínculo ativo anterior (com
-- a cópia do perfil) se for troca de clínica, cria o novo com a versão
-- do consentimento de compartilhar e a hora, e marca o código.
--
-- Chamar de novo com o mesmo código, ou com outro código da mesma
-- clínica, devolve o vínculo que já existe: não cria um segundo.
-- ------------------------------------------------------------
create function private.usar_convite(p_codigo text, p_versao integer)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_eu uuid := (select auth.uid());
  v_codigo text := upper(btrim(coalesce(p_codigo, '')));
  v_convite public.convites;
  v_atual public.vinculos;
  v_novo public.vinculos;
begin
  if v_eu is null then
    raise exception 'sem sessão' using errcode = '42501';
  end if;
  if p_versao is null or p_versao < 1 then
    raise exception 'a versão do consentimento é obrigatória' using errcode = '22023';
  end if;

  select * into v_convite from public.convites where codigo = v_codigo for update;
  if not found
     or (v_convite.expira_em is not null and v_convite.expira_em <= now())
     or (v_convite.usado_por is not null and v_convite.usado_por <> v_eu)
     or not exists (select 1 from public.clinicas c where c.id = v_convite.clinica_id and c.publicada) then
    return null;
  end if;

  select * into v_atual from public.vinculos
   where paciente_id = v_eu and encerrado_em is null
   for update;

  if found then
    if v_atual.clinica_id = v_convite.clinica_id then
      return private.vinculo_json(v_atual);
    end if;
    perform private.encerra(v_atual.id, 'paciente');
  end if;

  insert into public.vinculos (paciente_id, clinica_id, profissional_id, convite, consentimento_versao, consentido_em)
  values (v_eu, v_convite.clinica_id, v_convite.profissional_id, v_codigo, p_versao, now())
  returning * into v_novo;

  update public.convites set usado_por = v_eu, usado_em = now() where codigo = v_codigo;

  return private.vinculo_json(v_novo);
end;
$$;


-- ------------------------------------------------------------
-- encerrar_vinculo(vinculo) — com login, pelas duas pontas
--
-- Sem argumento, o paciente encerra o próprio vínculo ativo. Com o id,
-- encerra quem é o paciente dele (`paciente`) ou alguém da equipe ativa
-- da clínica (`clinica`) — é a porta do portal, pronta antes dele. Para
-- qualquer outra pessoa, nulo, como se o vínculo não existisse.
-- ------------------------------------------------------------
create function private.encerrar_vinculo(p_vinculo uuid)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_eu uuid := (select auth.uid());
  v public.vinculos;
  v_por text;
begin
  if v_eu is null then
    raise exception 'sem sessão' using errcode = '42501';
  end if;

  if p_vinculo is null then
    select * into v from public.vinculos
     where paciente_id = v_eu and encerrado_em is null
     for update;
  else
    select * into v from public.vinculos
     where id = p_vinculo and encerrado_em is null
     for update;
  end if;
  if not found then
    return null;
  end if;

  if v.paciente_id = v_eu then
    v_por := 'paciente';
  elsif v.clinica_id in (select private.minhas_clinicas()) then
    v_por := 'clinica';
  else
    return null;
  end if;

  v := private.encerra(v.id, v_por);
  return private.vinculo_json(v);
end;
$$;

revoke all on function
  private.conferir_convite(text),
  private.usar_convite(text, integer),
  private.encerrar_vinculo(uuid)
from public, anon, authenticated;
grant execute on function private.conferir_convite(text) to anon, authenticated;
grant execute on function private.usar_convite(text, integer), private.encerrar_vinculo(uuid) to authenticated;


-- ------------------------------------------------------------
-- As cascas, na API
-- ------------------------------------------------------------
create function public.conferir_convite(codigo text)
returns jsonb
language sql stable security invoker
set search_path = ''
as $$
  select private.conferir_convite(codigo)
$$;

create function public.usar_convite(codigo text, versao_consentimento integer)
returns jsonb
language sql volatile security invoker
set search_path = ''
as $$
  select private.usar_convite(codigo, versao_consentimento)
$$;

create function public.encerrar_vinculo(vinculo uuid default null)
returns jsonb
language sql volatile security invoker
set search_path = ''
as $$
  select private.encerrar_vinculo(vinculo)
$$;

revoke all on function
  public.conferir_convite(text),
  public.usar_convite(text, integer),
  public.encerrar_vinculo(uuid)
from public, anon, authenticated;
grant execute on function public.conferir_convite(text) to anon, authenticated;
grant execute on function public.usar_convite(text, integer), public.encerrar_vinculo(uuid) to authenticated;
