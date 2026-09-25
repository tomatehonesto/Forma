-- ============================================================
-- A RLS AUTOMÁTICA, FORA DA API
--
-- A opção "Enable automatic RLS" do projeto cria `public.rls_auto_enable()`,
-- a função do gatilho de evento `ensure_rls`, que liga a RLS em toda
-- tabela nova do esquema `public`. Ela é `security definer` e nasce com o
-- `EXECUTE` padrão do Postgres — para todo mundo, inclusive quem não tem
-- login, pelo endereço `/rest/v1/rpc/rls_auto_enable`. O conselheiro de
-- segurança do Supabase acusa isso.
--
-- Chamada direto ela nem roda (função de gatilho de evento só roda como
-- gatilho), mas não há por que a API alcançá-la. Tirar o `EXECUTE` não
-- desliga nada: o gatilho não confere a permissão de quem cria a tabela —
-- provado numa transação desfeita antes desta migração, com uma tabela
-- nova nascendo com RLS depois da revogação.
--
-- Condicional porque a função só existe onde a opção foi ligada.
-- ============================================================
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
