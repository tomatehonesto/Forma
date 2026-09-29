-- A tabela de uso aberta para quem tem login, que poderia zerar a própria cota.
grant select, delete on table private.uso_da_ia to authenticated;
