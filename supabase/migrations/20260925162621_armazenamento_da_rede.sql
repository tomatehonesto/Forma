-- ============================================================
-- O ARMAZENAMENTO DA REDE — fotos e logos da vitrine
--
-- Público para leitura: são as fotos que a vitrine mostra a qualquer
-- pessoa. Ninguém lista o balde (não há política de leitura em
-- `storage.objects`) e ninguém escreve nele pela API: as escritas
-- nascem com o portal. No projeto de desenvolvimento, as fotos das
-- clínicas de exemplo sobem pela CLI (plano, fase 6).
--
-- ⚠️ Nada do diário mora aqui. Os armazenamentos `fotos` e `documentos`
-- do desenho ficaram para quando algum registro tiver arquivo.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('clinicas', 'clinicas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
