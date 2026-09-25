-- A regra de inserir perguntas sem conferir a escolha.
alter policy perguntas_criacao on public.perguntas with check (user_id = (select auth.uid()));
