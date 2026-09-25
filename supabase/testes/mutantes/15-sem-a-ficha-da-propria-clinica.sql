-- Sem a ficha da própria clínica: a clínica que sai da vitrine sumiria
-- do aplicativo de quem ela acompanha.
alter policy clinicas_leitura on public.clinicas using (publicada);
