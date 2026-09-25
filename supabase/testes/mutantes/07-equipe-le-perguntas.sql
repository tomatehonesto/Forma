-- A leitura da equipe estendida às perguntas ao companheiro.
create policy perguntas_da_equipe on public.perguntas
  for select to authenticated
  using (private.equipe_le(user_id, quando));
