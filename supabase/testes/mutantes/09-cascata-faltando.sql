-- Uma chave estrangeira sem a cascata: apagar a conta falharia, ou
-- deixaria linhas para trás.
alter table public.registros drop constraint registros_user_id_fkey;
alter table public.registros
  add constraint registros_user_id_fkey foreign key (user_id) references auth.users (id);
