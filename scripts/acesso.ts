/* ============================================================
   A TRAVA DA PROMESSA DO VÍNCULO

     npx tsx --tsconfig scripts/tsconfig.json scripts/acesso.ts

   A folha do código promete a quem já paga pela loja e conecta uma
   clínica: "O vínculo com a clínica já garante o seu acesso ao
   aplicativo… e cancelar não muda nada no que você já registrou." Esta
   sonda é o que torna a frase verificável, e ela afirma as duas metades:

     1. O ACESSO — com vínculo há acesso, com a assinatura ativa ou
        cancelada; sem vínculo, a assinatura decide; sem os dois, não há.
     2. OS REGISTROS — conectar, recarregar, cancelar e perder o vínculo
        não encostam em nada do que a pessoa registrou.

   ⚠️ QUEM LIGAR A COBRANÇA RODA ESTA SONDA. O portão que vai trancar o
   aplicativo ainda não existe (PENDENCIAS, itens 5 e 36). Quando existir,
   ele pergunta a `acessoDe`; se alguém o fizer ler a loja diretamente, é
   aqui que a promessa deixa de ter prova.
   ============================================================ */

import { buildSeed, ensureDefaults, type State } from '../src/logic/seed';
import { mascarar } from '../src/logic/store';
import { clinicaConectada } from '../src/logic/derive';
import { acessoDe, vinculoDoConvite, type Assinatura } from '../src/logic/assinatura';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};

/* O que é DELA — o que a promessa diz que não muda. A lista é a de
   `estadoVazio`, em logic/seed, menos o que vem da clínica (mensagens,
   receitas, equipe, material). */
const REGISTROS = [
  'weights', 'injections', 'pens', 'checkins', 'photos', 'measures', 'exams', 'examBundles',
  'meals', 'favMeals', 'notes', 'goals', 'customSyms', 'history', 'vitals', 'documents',
] as const;
const registros = (S: State) => JSON.stringify(REGISTROS.map((k) => (S as any)[k]));
const clone = (S: State): State => JSON.parse(JSON.stringify(S));

/* Uma assinatura anual no meio do período — a da loja, que o aplicativo
   ainda não lê (`assinaturaAtual` devolve nulo). Cancelada e ainda no
   período pago, ela continua sendo esta; vencida, vira nulo. */
const ativa: Assinatura = { plano: 'anual', renovaEm: Date.now() + 200 * 864e5, emTeste: false };

/* O que o banco devolve — `clinica_json`, `profissional_json` e
   `vinculo_json` (supabase/migrations, "funcoes_do_convite") —, com a
   clínica e o código da semente do projeto de desenvolvimento. */
const CLINICA = {
  id: '572d0a83-bd46-5d4c-9664-72923ca8f571', nome: 'Consultório Savassi',
  sobre: 'Endocrinologia em Belo Horizonte.', endereco: 'Rua Pernambuco, 1000', bairro: 'Savassi',
  cidade: 'Belo Horizonte', uf: 'MG', ponto: { lat: -19.938, lng: -43.935 }, dias: [1, 2, 3, 4],
  abre: '08:00', fecha: '17:00', presencial: true, teleconsulta: true, convenios: ['Unimed'],
  particular: true, contato: { telefone: '(31) 0000-0010' }, exemplo: true,
  equipe: [{ id: '411998f9-d16d-5bec-b66c-e3dca42b84ee', nome: 'Dra. Patrícia Menezes', especialidades: ['endocrinologia'], conselho: 'CRM', regiao: 'MG', registro: '58210', rqe: ['29877'], responsavel: true }],
};
const PROFISSIONAL = CLINICA.equipe[0];
const vinculoDoServidor = (id: string, fim?: { por: 'paciente' | 'clinica' }) => ({
  id, convite: 'SAVASSI26', desde: '2026-09-25T12:00:00+00:00', consentimento_versao: 1,
  ...(fim ? { encerrado_em: '2026-09-26T12:00:00+00:00', encerrado_por: fim.por } : {}),
  clinica: CLINICA, profissional: PROFISSIONAL,
});

async function main() {
  const {
    clinicaDoBanco, profissionalDoBanco, gravarConviteDaRede, gravarVinculo, seguirVinculoDoServidor, conviteDoCadastro,
  } = await import('../src/logic/rede');

  const mariana = ensureDefaults(buildSeed()) as State;
  const sozinha = mascarar(mariana, 'sozinha');

  console.log('\nAS DUAS PESSOAS, para a comparação valer');
  ok(clinicaConectada(mariana), 'a Mariana tem vínculo com clínica');
  ok(!clinicaConectada(sozinha), 'a "sozinha" não tem');
  ok((mariana as any).weights.length > 0 && (mariana as any).injections.length > 0, 'e as duas têm registros');

  console.log('\n1. O ACESSO — o vínculo basta sozinho');
  const a1 = acessoDe(mariana, ativa);
  ok(a1.tem && a1.por === 'vinculo', 'vínculo e assinatura ativa: acesso, e pelo vínculo');
  const a2 = acessoDe(mariana, null);
  ok(a2.tem && a2.por === 'vinculo', 'vínculo e assinatura cancelada e vencida: acesso continua');
  const a3 = acessoDe(sozinha, ativa);
  ok(a3.tem && a3.por === 'assinatura', 'sem vínculo, com assinatura: acesso pela assinatura');
  ok(!acessoDe(sozinha, null).tem, 'sem vínculo e sem assinatura: sem acesso');
  ok(acessoDe(mariana).tem, 'sem passar a assinatura, a regra lê a costura — e o vínculo basta');

  console.log('\n2. OS REGISTROS — nada do que é dela muda');
  const antes = registros(sozinha);
  acessoDe(sozinha, null);
  acessoDe(mariana, ativa);
  ok(registros(sozinha) === antes, 'perguntar pelo acesso não escreve nada');

  /* conectar pela folha, com o que `conferir_convite` devolveria */
  const convite = { codigo: 'SAVASSI26', clinica: clinicaDoBanco(CLINICA), profissional: profissionalDoBanco(PROFISSIONAL) };
  ok(convite.clinica.exemplo === true && convite.profissional.responsavel === true && !!convite.clinica.ponto,
    'a clínica e quem passou o código chegam do banco na forma da vitrine');
  const conectada = clone(sozinha);
  gravarConviteDaRede(conectada, convite);
  ok(clinicaConectada(conectada), 'conectada, ela passa a ter vínculo');
  ok(registros(conectada) === antes, 'conectar não encosta em nenhum registro');
  const a4 = acessoDe(conectada, ativa);
  ok(a4.tem && a4.por === 'vinculo', 'quem já pagava e conectou tem acesso pelo vínculo');

  /* o caminho sem fonte, que é o de produção enquanto o portal não existe */
  const semFonte = clone(sozinha);
  (semFonte.profile as any).convite = 'ABCD1234';
  (semFonte.profile as any).vinculo = vinculoDoConvite('ABCD1234');
  ok(acessoDe(semFonte, null).tem, 'sem fonte, o código liga e dá acesso do mesmo jeito');
  ok(registros(semFonte) === antes, 'e também não encosta em registro');

  /* recarregar o aplicativo: o estado passa por ensureDefaults */
  const recarregada = ensureDefaults(clone(conectada)) as State;
  ok(clinicaConectada(recarregada), 'recarregado, o vínculo continua');

  /* ⚠️ O CÓDIGO GUARDADO NÃO VIRA VÍNCULO AO RECARREGAR. Com a nuvem, quem
     conecta antes de ter conta fica com o código escrito e pendente, e o
     vínculo só nasce no servidor. Uma regra antiga do `ensureDefaults`
     transformava esse código num vínculo falso na abertura seguinte. */
  const pendente = clone(sozinha);
  (pendente.profile as any).convite = 'TAVARES26';
  (pendente as any).convitePendente = { codigo: 'TAVARES26', versao: 1 };
  const pendenteRecarregada = ensureDefaults(clone(pendente)) as State;
  ok(!clinicaConectada(pendenteRecarregada) && !acessoDe(pendenteRecarregada, null).tem,
    'recarregado, o código só guardado continua sem vínculo e sem acesso — ele espera a conta');
  ok(registros(recarregada) === antes, 'recarregado, os registros continuam idênticos');

  /* cancelar a assinatura: a loja para de cobrar, e o aplicativo não faz nada */
  const cancelou = acessoDe(recarregada, null);
  ok(cancelou.tem && cancelou.por === 'vinculo', 'cancelou a assinatura: o acesso continua, pelo vínculo');
  ok(registros(recarregada) === antes, 'cancelou a assinatura: os registros continuam idênticos');

  /* e o pior caso: a clínica encerra o vínculo e não há assinatura */
  const semVinculo = clone(recarregada);
  (semVinculo.profile as any).vinculo = null;
  ok(!acessoDe(semVinculo, null).tem, 'sem vínculo e sem assinatura: o acesso fica suspenso');
  ok(registros(semVinculo) === antes, 'mas nada foi apagado — é o que a tela /suspenso diz');

  console.log('\n3. O VÍNCULO VINDO DO SERVIDOR (fase 6 do plano do Supabase)');
  const V1 = '00000000-0000-4000-8000-000000000001';
  const V2 = '00000000-0000-4000-8000-000000000002';
  const doServidor = clone(sozinha);
  gravarVinculo(doServidor, vinculoDoServidor(V1));
  const copia = (doServidor.profile as any).vinculo;
  ok(clinicaConectada(doServidor) && copia.id === V1 && copia.clinica === CLINICA.id && copia.consentimento === 1
    && (doServidor.profile as any).clinic === CLINICA.nome,
    'o vínculo vindo do servidor vira a cópia, com o id da linha, a clínica e a versão do consentimento');
  ok(registros(doServidor) === antes && acessoDe(doServidor, null).tem, 'e não encosta em registro, e dá acesso');

  const mesmo = clone(doServidor);
  ok(seguirVinculoDoServidor(mesmo, vinculoDoServidor(V1)) === null && (mesmo.profile as any).vinculo.id === V1,
    'o mesmo vínculo descendo de novo não muda nada, e não avisa');

  const desconectou = clone(doServidor);
  const avisoDesconectou = seguirVinculoDoServidor(desconectou, vinculoDoServidor(V1, { por: 'paciente' }));
  ok(!clinicaConectada(desconectou) && avisoDesconectou === null && registros(desconectou) === antes
    && (desconectou as any).messages.length === 0 && (desconectou as any).team.length === 0,
    'desconectar (neste aparelho ou em outro): a cópia sai sem aviso de encerramento, com o que é de plataforma, e os registros ficam');
  ok(!acessoDe(desconectou, null).tem && acessoDe(desconectou, ativa).tem, 'e o acesso volta a ser o da assinatura');
  const pd = desconectou.profile as any;
  ok(pd.acompanhamento === 'nenhum' && pd.clinic === '' && pd.doctor === '' && !pd.antesDoVinculo
    && JSON.stringify(pd.clinicInfo) === JSON.stringify((sozinha.profile as any).clinicInfo),
    'desconectar devolve o "por conta própria" de antes: sem a clínica no perfil, e a aba Cuidado volta a oferecer a rede');

  const comMedico = clone(sozinha);
  Object.assign(comMedico.profile as any, { acompanhamento: 'proprio', doctor: 'Dr. Fulano', clinic: 'Minha Clínica', doctorInfo: { crm: 'CRM-SP 1' } });
  gravarVinculo(comMedico, vinculoDoServidor(V1));
  gravarVinculo(comMedico, vinculoDoServidor(V2));
  ok((comMedico.profile as any).clinic === CLINICA.nome, 'conectada (e trocando de clínica), a ficha é a da clínica');
  seguirVinculoDoServidor(comMedico, vinculoDoServidor(V2, { por: 'paciente' }));
  const pm = comMedico.profile as any;
  ok(pm.acompanhamento === 'proprio' && pm.doctor === 'Dr. Fulano' && pm.clinic === 'Minha Clínica' && pm.doctorInfo.crm === 'CRM-SP 1',
    'quem tinha médico próprio antes de conectar volta a tê-lo, com o nome e o registro — o de antes da primeira clínica, e não o da segunda');

  const encerrou = clone(doServidor);
  ok(seguirVinculoDoServidor(encerrou, vinculoDoServidor(V1, { por: 'clinica' })) === 'clinica-encerrou'
    && !clinicaConectada(encerrou) && registros(encerrou) === antes,
    'a clínica encerrou: a cópia sai, com o aviso de que o diário continua — e ele continua');

  const trocou = clone(doServidor);
  ok(seguirVinculoDoServidor(trocou, vinculoDoServidor(V2)) === null && (trocou.profile as any).vinculo.id === V2
    && registros(trocou) === antes,
    'trocar de clínica em outro aparelho: a cópia passa a ser a do vínculo novo, sem aviso de encerramento');

  const antigo = clone(sozinha);
  (antigo.profile as any).vinculo = vinculoDoConvite('ABCD1234');
  Object.assign(antigo.profile as any, { acompanhamento: 'proprio', doctor: 'Dra. Digitada' });
  ok(seguirVinculoDoServidor(antigo, null) === 'nao-confirmado' && !clinicaConectada(antigo) && registros(antigo) === antes,
    'o vínculo antigo, nascido só no aparelho: sai com o aviso de que o código não foi confirmado, e não com o da clínica');
  ok((antigo.profile as any).doctor === 'Dra. Digitada' && (antigo.profile as any).acompanhamento === 'proprio',
    'e o médico que a pessoa digitou fica: o vínculo antigo não escreveu ficha nenhuma');
  const antigoEComServidor = clone(sozinha);
  (antigoEComServidor.profile as any).vinculo = vinculoDoConvite('SAVASSI26');
  ok(seguirVinculoDoServidor(antigoEComServidor, vinculoDoServidor(V1)) === 'nao-confirmado'
    && (antigoEComServidor.profile as any).vinculo.id === V1,
    'e, se o servidor tem um vínculo de verdade, a cópia passa a ser ele — com o mesmo aviso sobre o antigo');

  const editou = clone(doServidor);
  const antesDaEdicao = JSON.stringify((editou.profile as any).vinculo);
  conviteDoCadastro(editou, 'savassi26');
  ok(JSON.stringify((editou.profile as any).vinculo) === antesDaEdicao,
    'editar a altura pelo lápis (o mesmo código no cadastro) não muda o vínculo nem o desde');

  console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
  process.exit(falhas ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
