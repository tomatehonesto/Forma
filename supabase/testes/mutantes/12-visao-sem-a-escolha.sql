-- A visão das perguntas sem o filtro da escolha.
create or replace view private.perguntas_para_leitura as
  select q.quando, q.texto, q.origem
  from public.perguntas q;
