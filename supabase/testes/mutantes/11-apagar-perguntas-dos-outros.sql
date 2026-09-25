-- O delete de perguntas sem o filtro da dona.
alter policy perguntas_remocao on public.perguntas using (true);
