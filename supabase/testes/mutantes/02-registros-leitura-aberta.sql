-- A leitura de registros aberta para quem tiver login.
alter policy registros_leitura on public.registros using (true);
