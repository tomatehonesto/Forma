-- ============================================================
-- A SEMENTE DO PROJETO DE DESENVOLVIMENTO — a rede de exemplo
--
-- ⚠️⚠️ SÓ NO morphi-dev (kjagyoqykhysvasauzgo). ⚠️⚠️
--
-- Os nomes, os registros de conselho e os contatos são INVENTADOS: os
-- números começam com 0, que o plano de numeração brasileiro não usa, e
-- os endereços são do domínio reservado example.com. Toda clínica daqui
-- nasce com `exemplo = true`, que é o que faz a vitrine avisar.
--
-- Nasceu uma vez de EXEMPLO e CONVITES_DE_EXEMPLO (src/logic/rede.ts), e
-- dali em diante a fonte é este arquivo. Os ids são fixos, para o
-- aplicativo e os testes poderem apontar para eles.
--
-- Sobe com:  node scripts/semente.mjs
-- que confere o projeto ligado antes. NUNCA com `db push --include-seed`,
-- que roda cada arquivo uma vez só e depois ignora as mudanças.
--
-- Idempotente: rodar de novo devolve tudo a este estado, inclusive os
-- códigos de exemplo a "não usados", para o teste de conectar poder se
-- repetir.
-- ============================================================

insert into public.clinicas (
  id, nome, sobre, endereco, bairro, cidade, uf, lat, lng, dias, abre, fecha,
  presencial, teleconsulta, convenios, particular, contato, publicada, exemplo
) values
  ('0889a28d-edd8-5aeb-977e-c2938a5ab591', 'Clínica Lemos', 'Endocrinologia e nutrição no mesmo lugar. Acompanhamos o tratamento com GLP-1 desde o começo, com retorno a cada quatro semanas enquanto a dose está sendo ajustada.', 'Rua dos Pinheiros, 1000, sala 42', 'Pinheiros', 'São Paulo', 'SP', -23.566, -46.6835, array[1, 3, 5]::smallint[], '08:00', '17:00', true, true, array['Bradesco Saúde', 'SulAmérica']::text[], true, '{"whatsapp":"+55 11 00000-0001","telefone":"(11) 0000-0001","agenda":"agenda.example.com/clinica-lemos"}'::jsonb, true, true),
  ('79695249-3633-58a5-8461-606f8667ee5c', 'Clínica Ibirapuera', 'Endocrinologia clínica, com atenção especial à tireoide e ao metabolismo.', 'Avenida Ibirapuera, 2500, conjunto 81', 'Moema', 'São Paulo', 'SP', -23.601, -46.666, array[2, 4]::smallint[], '09:00', '18:00', true, false, array['Amil', 'Porto Saúde', 'Unimed']::text[], true, '{"telefone":"(11) 0000-0002","site":"clinicaibirapuera.example.com"}'::jsonb, true, true),
  ('0d290932-cfcf-5604-a27b-a360141fe8c1', 'Centro Médico Santana', null, 'Rua Voluntários da Pátria, 3200', 'Santana', 'São Paulo', 'SP', -23.501, -46.625, array[6]::smallint[], '08:00', '12:00', true, false, array['Unimed']::text[], true, '{"telefone":"(11) 0000-0003"}'::jsonb, true, true),
  ('ebbb0dfc-41eb-5180-b884-d29f6654e47d', 'Espaço Paulista', 'Nutrologia com foco em composição corporal: proteína, força e o que fazer para a perda ser de gordura, e não de músculo.', 'Alameda Santos, 1800, 9º andar', 'Jardim Paulista', 'São Paulo', 'SP', -23.568, -46.652, array[1, 2, 3, 4, 5]::smallint[], '09:00', '19:00', true, true, '{}'::text[], true, '{"whatsapp":"+55 11 00000-0004","email":"contato@espacopaulista.example.com"}'::jsonb, true, true),
  ('86fb0c9b-015d-5138-a4a1-652b6166df32', 'Júlia Tavares Psicologia', 'Atendimento on-line para quem está mudando a relação com a comida durante o tratamento — fome, ansiedade e o que muda quando o apetite muda.', null, null, 'São Paulo', 'SP', null, null, array[1, 2, 3, 4, 5]::smallint[], '18:00', '21:00', false, true, '{}'::text[], true, '{"whatsapp":"+55 11 00000-0007","agenda":"agenda.example.com/julia-tavares"}'::jsonb, true, true),
  ('227a502c-bffa-5616-add6-e4f016855b09', 'Clínica Botafogo', 'Obesidade, síndrome metabólica e acompanhamento de longo prazo depois que a dose se estabiliza.', 'Rua São Clemente, 190, sala 301', 'Botafogo', 'Rio de Janeiro', 'RJ', -22.953, -43.187, array[1, 3, 4]::smallint[], '08:00', '16:00', true, true, array['Bradesco Saúde', 'SulAmérica', 'Unimed']::text[], true, '{"whatsapp":"+55 21 00000-0008","telefone":"(21) 0000-0008"}'::jsonb, true, true),
  ('339144d0-8109-5e50-b66c-d33896133858', 'Centro Médico Barra', null, 'Avenida das Américas, 4200, bloco 3', 'Barra da Tijuca', 'Rio de Janeiro', 'RJ', -23, -43.365, array[2, 5, 6]::smallint[], '09:00', '15:00', true, false, array['Amil']::text[], true, '{"telefone":"(21) 0000-0009"}'::jsonb, true, true),
  ('572d0a83-bd46-5d4c-9664-72923ca8f571', 'Consultório Savassi', 'Endocrinologia em Belo Horizonte, com teleconsulta para quem mora no interior.', 'Rua Pernambuco, 1000, sala 1102', 'Savassi', 'Belo Horizonte', 'MG', -19.938, -43.935, array[1, 2, 3, 4]::smallint[], '08:00', '17:00', true, true, array['Unimed']::text[], true, '{"whatsapp":"+55 31 00000-0010","telefone":"(31) 0000-0010"}'::jsonb, true, true)
on conflict (id) do update set
  nome = excluded.nome, sobre = excluded.sobre, endereco = excluded.endereco,
  bairro = excluded.bairro, cidade = excluded.cidade, uf = excluded.uf,
  lat = excluded.lat, lng = excluded.lng, dias = excluded.dias,
  abre = excluded.abre, fecha = excluded.fecha,
  presencial = excluded.presencial, teleconsulta = excluded.teleconsulta,
  convenios = excluded.convenios, particular = excluded.particular,
  contato = excluded.contato, publicada = excluded.publicada, exemplo = excluded.exemplo;

insert into public.profissionais (id, nome, especialidades, conselho, regiao, registro, rqe) values
  ('582a3abc-c5a3-50b6-85f0-8a13c12787e7', 'Dra. Beatriz Lemos', array['endocrinologia']::text[], 'CRM', 'SP', '154872', array['61233']::text[]),
  ('25edf2e3-7062-55d1-95a3-ab68e8344a83', 'Marina Duarte', array['nutricao']::text[], 'CRN', '3', '48213', '{}'::text[]),
  ('8bdd8b32-4729-5410-bcc5-6c640f82d790', 'Dr. Rafael Nogueira', array['endocrinologia']::text[], 'CRM', 'SP', '138455', array['57402']::text[]),
  ('23647476-7689-580e-a86b-fda1f4b4579f', 'Dra. Camila Arantes', array['nutrologia']::text[], 'CRM', 'SP', '167321', array['70114']::text[]),
  ('aa203202-109d-5a54-b858-0a5d9da570b4', 'Dr. Felipe Sato', array['esporte']::text[], 'CRM', 'SP', '149903', array['66120']::text[]),
  ('c901819b-ea25-560c-a67e-5fd873d2c82b', 'Júlia Tavares', array['psicologia']::text[], 'CRP', '06', '154321', '{}'::text[]),
  ('00f1ea70-3c36-527f-a4e8-e257bce86290', 'Dra. Luísa Cardoso', array['endocrinologia']::text[], 'CRM', 'RJ', '52871', array['30118']::text[]),
  ('2dd721ff-0450-527d-aa62-0b8efd4b35b9', 'Dr. André Moreira', array['nutrologia']::text[], 'CRM', 'RJ', '61240', array['34502']::text[]),
  ('411998f9-d16d-5bec-b66c-e3dca42b84ee', 'Dra. Patrícia Menezes', array['endocrinologia']::text[], 'CRM', 'MG', '58210', array['29877']::text[])
on conflict (id) do update set
  nome = excluded.nome, especialidades = excluded.especialidades,
  conselho = excluded.conselho, regiao = excluded.regiao,
  registro = excluded.registro, rqe = excluded.rqe;

insert into public.equipe (clinica_id, profissional_id, papel, ativo, ordem) values
  ('0889a28d-edd8-5aeb-977e-c2938a5ab591', '582a3abc-c5a3-50b6-85f0-8a13c12787e7', 'responsavel', true, 0),
  ('0889a28d-edd8-5aeb-977e-c2938a5ab591', '25edf2e3-7062-55d1-95a3-ab68e8344a83', 'equipe', true, 1),
  ('79695249-3633-58a5-8461-606f8667ee5c', '8bdd8b32-4729-5410-bcc5-6c640f82d790', 'responsavel', true, 0),
  ('0d290932-cfcf-5604-a27b-a360141fe8c1', '8bdd8b32-4729-5410-bcc5-6c640f82d790', 'responsavel', true, 0),
  ('ebbb0dfc-41eb-5180-b884-d29f6654e47d', '23647476-7689-580e-a86b-fda1f4b4579f', 'responsavel', true, 0),
  ('ebbb0dfc-41eb-5180-b884-d29f6654e47d', 'aa203202-109d-5a54-b858-0a5d9da570b4', 'equipe', true, 1),
  ('86fb0c9b-015d-5138-a4a1-652b6166df32', 'c901819b-ea25-560c-a67e-5fd873d2c82b', 'responsavel', true, 0),
  ('227a502c-bffa-5616-add6-e4f016855b09', '00f1ea70-3c36-527f-a4e8-e257bce86290', 'responsavel', true, 0),
  ('339144d0-8109-5e50-b66c-d33896133858', '2dd721ff-0450-527d-aa62-0b8efd4b35b9', 'responsavel', true, 0),
  ('572d0a83-bd46-5d4c-9664-72923ca8f571', '411998f9-d16d-5bec-b66c-e3dca42b84ee', 'responsavel', true, 0)
on conflict (clinica_id, profissional_id) do update set
  papel = excluded.papel, ativo = excluded.ativo, ordem = excluded.ordem;

-- Um código por clínica, de quem responde por ela.
insert into public.convites (codigo, clinica_id, profissional_id) values
  ('LEMOS26', '0889a28d-edd8-5aeb-977e-c2938a5ab591', '582a3abc-c5a3-50b6-85f0-8a13c12787e7'),
  ('IBIRAPUERA26', '79695249-3633-58a5-8461-606f8667ee5c', '8bdd8b32-4729-5410-bcc5-6c640f82d790'),
  ('SANTANA26', '0d290932-cfcf-5604-a27b-a360141fe8c1', '8bdd8b32-4729-5410-bcc5-6c640f82d790'),
  ('PAULISTA26', 'ebbb0dfc-41eb-5180-b884-d29f6654e47d', '23647476-7689-580e-a86b-fda1f4b4579f'),
  ('TAVARES26', '86fb0c9b-015d-5138-a4a1-652b6166df32', 'c901819b-ea25-560c-a67e-5fd873d2c82b'),
  ('BOTAFOGO26', '227a502c-bffa-5616-add6-e4f016855b09', '00f1ea70-3c36-527f-a4e8-e257bce86290'),
  ('BARRA26', '339144d0-8109-5e50-b66c-d33896133858', '2dd721ff-0450-527d-aa62-0b8efd4b35b9'),
  ('SAVASSI26', '572d0a83-bd46-5d4c-9664-72923ca8f571', '411998f9-d16d-5bec-b66c-e3dca42b84ee')
on conflict (codigo) do update set
  clinica_id = excluded.clinica_id, profissional_id = excluded.profissional_id,
  expira_em = null, usado_por = null, usado_em = null;
