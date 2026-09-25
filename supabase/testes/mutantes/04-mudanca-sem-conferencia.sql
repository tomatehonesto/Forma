-- O `with check` do update trocado por `true`: a pessoa poderia passar
-- uma linha dela para outra conta. (Sem `with check` nenhum, o Postgres
-- reusa o `using` — não seria um afrouxamento de verdade.)
alter policy registros_mudanca on public.registros with check (true);
