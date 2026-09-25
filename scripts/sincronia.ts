/* ============================================================
   A TRAVA DA SINCRONIA

     npx tsx --tsconfig scripts/tsconfig.json scripts/sincronia.ts

   O miolo da sincronização com o Supabase é código sem rede, e é ele que
   se testa aqui. Esta trava cresce com o plano
   (docs/superpowers/plans/2026-09-25-supabase-ponte-plano.md):

     FASE 2 — a identidade de cada item e a marca da semente.
     FASE 3 — a tradução de ida e volta, a fila, a mistura e os mutantes.

   A IDENTIDADE. Cada item do diário ganha um `rid` — o id da linha dele no
   banco — num lugar só (logic/identidade), chamado por `ensureDefaults` e
   pelo `update` do store. Se ela falhar, dois aparelhos duplicam itens,
   ou um item some por ter nascido com o id de outro.

   A MARCA DA SEMENTE. A demonstração da Mariana nunca pede conta e nunca
   sobe para o servidor. Se a marca vazar para o diário de alguém, esse
   diário nunca sobe; se faltar na demonstração, uma pessoa inventada sobe
   para a conta de alguém.

   A TRADUÇÃO (logic/traducao). Todo campo do estado tem um destino
   declarado, e a ida e a volta devolvem o mesmo diário, nos seis idiomas
   e no estado vazio. Se ela falhar, um campo some na troca de telefone.

   O MOTOR (logic/sincronia), contra um servidor de mentira
   (scripts/duble/servidor.ts) que carimba a hora e aplica as regras do
   banco. Dois aparelhos na mesma conta, a rede que cai, a transação que
   demora, a prévia do Perfil, a semente, as perguntas e a troca de
   diário. Se ele falhar, um registro some, sobe para a conta errada, ou
   um diário vazio apaga a conta inteira.
   ============================================================ */
import { buildSeed, comNotificacoesDeExemplo, ensureDefaults, estadoVazio, recomecarDoZero } from '../src/logic/seed';
import {
  DESTINO_NO_ESTADO, DESTINO_NO_PERFIL, PARTES, TIPOS_DE_REGISTRO, canonico, ida, itensDoDiario, misturar,
  type Descida, type RegistroDoServidor,
} from '../src/logic/traducao';
import { CHAVE_DA_BASE, criarSincronia, esperaDepoisDe, type Sincronia } from '../src/logic/sincronia';
import { acrescentarPergunta, enderecoDoCompanheiro, origemDoEndereco } from '../src/logic/perguntas';
import { TIPOS_COMPARTILHADOS, oQueAEquipeVe } from '../src/logic/compartilhamento';
import { CUP_ML, mlQueContam } from '../src/logic/derive';
import { startOfDay } from '../src/logic/time';
import { trocarLocal } from '../src/logic/local';
import { carimbar, novoRid } from '../src/logic/identidade';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mascarar, useStore } from '../src/logic/store';
import { NOMES_DAS_PERSONAS } from '../src/textos';
import { ServidorFalso } from './duble/servidor';

let falhas = 0;
const ok = (certo: boolean, o: string) => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}`);
  if (!certo) falhas += 1;
};
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const rids = (S: unknown) => itensDoDiario(S).map((i) => i.rid);

/* Um estado gravado antes da identidade existir: a semente crua, sem
   ter passado por ensureDefaults, e sem a marca nem o dono. */
function estadoAntigo(): any {
  const S: any = clone(buildSeed());
  delete S.semente;
  delete S.conta;
  return S;
}

/* ---------------- para a fase 3 ---------------- */

const CONTA_A = '00000000-0000-4000-8000-00000000000a';
const CONTA_B = '00000000-0000-4000-8000-00000000000b';
const CONTA_C = '00000000-0000-4000-8000-00000000000c';
const INSTANTE = 1790000000000;

/** O que sobe, e só isso: os campos cujo destino é um tipo de registro,
    as perguntas, uma parte do perfil ou uma coluna dele. */
const sobe = (d: string) => d.startsWith('registro:') || d === 'perguntas' || d.startsWith('parte:') || d === 'coluna';
function oQueSobe(S: any) {
  const out: any = { profile: {} };
  for (const [k, d] of Object.entries(DESTINO_NO_ESTADO)) if (sobe(d)) out[k] = S?.[k];
  for (const [k, d] of Object.entries(DESTINO_NO_PERFIL)) if (sobe(d)) out.profile[k] = S?.profile?.[k];
  return canonico(out);
}
/** E o resto: o que fica no aparelho, vem do servidor ou se calcula. */
function oQueFica(S: any) {
  const out: any = { profile: {} };
  for (const [k, d] of Object.entries(DESTINO_NO_ESTADO)) if (!sobe(d) && d !== 'perfil') out[k] = S?.[k];
  for (const [k, d] of Object.entries(DESTINO_NO_PERFIL)) if (!sobe(d)) out.profile[k] = S?.profile?.[k];
  return canonico(out);
}

/** O que o servidor devolveria depois de receber o estado inteiro. */
function comoDesce(S: any): Descida {
  const t = ida(S);
  return {
    registros: t.registros.map((r, i) => ({ ...clone(r), atualizadoEm: new Date(INSTANTE + i).toISOString(), apagadoEm: null })),
    perguntas: t.perguntas.map((p, i) => ({ ...clone(p), criadoEm: new Date(INSTANTE + i).toISOString() })),
    perfil: {
      partes: clone(t.perfil.partes), consentimento: t.perfil.consentimento,
      perguntasParaUso: t.perfil.perguntasParaUso, atualizadoEm: new Date(INSTANTE).toISOString(),
    },
  };
}

/** Um diário com tudo o que a semente não tem: o consentimento, a foto,
    as perguntas com e sem origem, uma foto de corpo, os campos que só o
    cadastro escreve. */
function completo(S0: any): any {
  const S = clone(S0);
  S.semente = false;
  S.conta = { id: CONTA_A };
  Object.assign(S.profile, {
    consentimento: { em: INSTANTE, versao: 1 },
    foto: 'data:image/jpeg;base64,AAAA',
    sistema: 'imperial', forma: 'caneta', idioma: 'pt-BR', atividade: 'moderada',
    alvosEditados: { prot: INSTANTE },
    targets: { ...S.profile.targets, kcal: 1800 },
    cancelamento: { motivo: 'preco', detalhe: '', t: INSTANTE },
  });
  S.perguntasParaUso = true;
  S.photos = [{ t: INSTANTE, nome: 'frente' }];
  let asked: any[] = [];
  asked = acrescentarPergunta(asked, 'Uma antiga, de antes da origem', undefined, INSTANTE - 1);
  for (let i = 0; i < 14; i++) asked = acrescentarPergunta(asked, `Pergunta ${i % 11}`, i % 3 ? 'sugerida' : 'digitada', INSTANTE + i);
  S.asked = asked;
  return carimbar(S);
}

/** Um diário de verdade, de uma conta: a semente, sem a marca. */
function diarioDe(conta: string | null): any {
  const S: any = clone(ensureDefaults(comNotificacoesDeExemplo(buildSeed())));
  S.semente = false;
  S.conta = conta ? { id: conta } : null;
  S.diario = novoRid();
  S.profile.consentimento = { em: INSTANTE, versao: 1 };
  return S;
}
function vazioDe(conta: string | null): any {
  const S: any = estadoVazio();
  S.conta = conta ? { id: conta } : null;
  return S;
}

/** Um aparelho: o estado, o armazenamento, a sessão e a sincronia dele.
    O relógio parado deixa a trava dizer quando cada volta acontece. */
const RELOGIO_PARADO = { depois: () => null, cancelar: () => {} };
type Aparelho = {
  S: any;
  sessao: string | null;
  fingindo: boolean;
  motor: Sincronia;
  guarda: { getItem(k: string): Promise<string | null>; setItem(k: string, v: string): Promise<void>; removeItem(k: string): Promise<void> };
  registrar(mut: (s: any) => void): void;
  sync(baixar?: boolean): Promise<void>;
  reabrir(): void;
};
function aparelho(servidor: ServidorFalso, S0: any, sessao: string | null): Aparelho {
  const mapa = new Map<string, string>();
  const ouvintes = new Set<() => void>();
  const a = {
    S: clone(S0),
    sessao,
    fingindo: false,
    guarda: {
      getItem: async (k: string) => mapa.get(k) ?? null,
      setItem: async (k: string, v: string) => { mapa.set(k, v); },
      removeItem: async (k: string) => { mapa.delete(k); },
    },
  } as Aparelho;
  const loja = {
    ler: () => a.S,
    /* como o `update` do store: numa cópia, com a identidade carimbada */
    mudar: (mut: (s: any) => void) => {
      const s = clone(a.S);
      mut(s);
      carimbar(s);
      a.S = s;
      for (const o of ouvintes) o();
    },
    assinar: (o: () => void) => { ouvintes.add(o); return () => { ouvintes.delete(o); }; },
  };
  a.registrar = loja.mudar;
  a.reabrir = () => {
    a.motor = criarSincronia({
      transporte: servidor.transporte(() => a.sessao), loja, guarda: a.guarda,
      fingindo: () => a.fingindo, relogio: RELOGIO_PARADO,
    });
  };
  a.reabrir();
  a.sync = (baixar = false) => a.motor.sincronizar({ baixar });
  return a;
}
const vivas = (srv: ServidorFalso, conta: string) => srv.linhasDe(conta).filter((l) => l.apagadoEm === null);
const apagadas = (srv: ServidorFalso, conta: string) => srv.linhasDe(conta).filter((l) => l.apagadoEm !== null);


async function main() {
console.log('\nA IDENTIDADE DE CADA ITEM');
const antigo = estadoAntigo();
const itensAntigos = itensDoDiario(antigo);
ok(itensAntigos.length > 50 && itensAntigos.every((i) => i.rid === undefined),
  `o estado antigo tem ${itensAntigos.length} itens, e nenhum com identidade`);

const aberto = ensureDefaults(antigo) as any;
ok(rids(aberto).every((r) => typeof r === 'string' && UUID.test(r)),
  'na primeira abertura, todo item ganha um rid (uuid)');
ok(new Set(rids(aberto)).size === rids(aberto).length, 'nenhum rid se repete');
ok(aberto.exams.every((m: any) => m.values.every((v: any) => UUID.test(v.rid))),
  'cada valor de cada exame tem o seu');
ok(Object.values(aberto.vitals).every((l: any) => l.every((m: any) => UUID.test(m.rid))),
  'cada medição de cada sinal vital tem a sua');
ok(aberto.asked.every((p: any) => UUID.test(p.rid)), 'cada pergunta ao companheiro tem a sua');
ok(aberto.customSyms.every((s: unknown) => typeof s === 'string'),
  'a lista de sintomas próprios continua sendo de texto (ela vai para o perfil)');

const fotografia = JSON.stringify(aberto);
ensureDefaults(aberto);
ok(JSON.stringify(aberto) === fotografia, 'a segunda passada não muda nada');

/* Cada item com ele mesmo, e não por posição: a pesagem nova entra no fim
   de `weights`, e empurra os itens das listas seguintes uma casa. */
const cadaUm = itensDoDiario(aberto).map((item) => [item, item.rid] as const);
aberto.weights.push({ t: Date.now(), kg: 70.2 });
carimbar(aberto);
ok(cadaUm.every(([item, rid]) => item.rid === rid), 'quem já tem rid não é tocado');
const novaPesagem = aberto.weights[aberto.weights.length - 1];
ok(UUID.test(novaPesagem.rid) && !cadaUm.some(([, rid]) => rid === novaPesagem.rid),
  'o item novo ganha um rid novo');

/* A medição nova era montada a partir da última, com o `rid` dela junto. */
const ultimaMedida = aberto.measures[aberto.measures.length - 1];
aberto.measures.push({ ...ultimaMedida, t: Date.now(), cintura: 90 });
carimbar(aberto);
const copiada = aberto.measures[aberto.measures.length - 1];
ok(ultimaMedida.rid === cadaUm.find(([item]) => item === ultimaMedida)?.[1] && copiada.rid !== ultimaMedida.rid
  && new Set(rids(aberto)).size === rids(aberto).length,
  'um item montado a partir de outro não fica com a identidade dele: o primeiro a mantém, o novo ganha outra');


console.log('\nO STORE');
const loja = useStore.getState();
const pesagensAntes = loja.S.weights.length;
loja.update((s) => { s.weights.push({ t: Date.now(), kg: 69.8 } as any); });
const nova: any = useStore.getState().S.weights[pesagensAntes];
ok(!!nova && UUID.test(nova.rid), 'o item novo ganha a identidade no update, na hora');

const verdade = JSON.stringify(useStore.getState().S);
useStore.getState().fingir('sozinha');
useStore.getState().update((s) => { s.weights.push({ t: Date.now(), kg: 50 } as any); });
useStore.getState().fingir(null);
ok(JSON.stringify(useStore.getState().S) === verdade,
  'a prévia do Perfil não deixa nada no estado de verdade — nem item, nem identidade');


console.log('\nA MARCA DA SEMENTE');
ok(buildSeed().semente === true && ensureDefaults(buildSeed()).semente === true, 'a semente nasce marcada');
const vazio = estadoVazio() as any;
ok(vazio.semente === false && vazio.conta === null, 'o estado vazio não é a semente, e não tem dono');
useStore.getState().reset();
ok((useStore.getState().S as any).semente === false, 'apagar os dados (reset) não deixa a marca');

ok(NOMES_DAS_PERSONAS.length === 6 && new Set(NOMES_DAS_PERSONAS).size === 6, 'as seis personas têm seis nomes');
ok(NOMES_DAS_PERSONAS.every((nome) => {
  const S = estadoAntigo();
  S.profile.name = nome;
  return ensureDefaults(S).semente === true;
}), 'um estado antigo, sem consentimento e com o nome de uma persona, é a semente — nos seis idiomas');

const cadastradaSemConsentimento = estadoAntigo();
cadastradaSemConsentimento.profile.name = 'Fulana de Tal';
ok(ensureDefaults(cadastradaSemConsentimento).semente === false,
  'um estado antigo cadastrado sem consentimento, com outro nome, é de alguém');

const xara = estadoAntigo();
xara.profile.consentimento = { em: Date.now(), versao: 1 };
ok(ensureDefaults(xara).semente === false,
  'quem consentiu é de alguém, mesmo com o nome de uma persona');

const marcada: any = clone(ensureDefaults(buildSeed()));
ok(ensureDefaults(marcada).semente === true, 'a marca que já existe não é recalculada');


console.log('\nO CADASTRO RECOMEÇA — MAS NÃO DE DONO');
const comDono: any = clone(estadoVazio());
comDono.conta = { id: '00000000-0000-4000-8000-000000000001' };
comDono.weights.push({ t: Date.now(), kg: 80 });
recomecarDoZero(comDono);
ok(comDono.conta?.id === '00000000-0000-4000-8000-000000000001', 'o dono atravessa o recomeço');
ok(comDono.weights.length === 0 && comDono.semente === false, 'e o resto recomeça do zero');
const semDono: any = clone(buildSeed());
recomecarDoZero(semDono);
ok(semDono.conta === null && semDono.semente === false, 'a semente que recomeça vira um diário sem dono, e sem a marca');


console.log('\nA ABERTURA — a identidade que nasce nela é gravada na hora');
await AsyncStorage.setItem('norte.v1', JSON.stringify(estadoAntigo()));
await useStore.getState().hydrate();
const naPrimeira = rids(useStore.getState().S);
const gravado = JSON.parse((await AsyncStorage.getItem('norte.v1')) ?? 'null');
ok(naPrimeira.length > 50 && JSON.stringify(rids(gravado)) === JSON.stringify(naPrimeira),
  'a primeira abertura grava as identidades que deu');
await useStore.getState().hydrate();
ok(JSON.stringify(rids(useStore.getState().S)) === JSON.stringify(naPrimeira),
  'a segunda abertura encontra as mesmas identidades');


/* ================================================================
   FASE 3
   ================================================================ */

console.log('\nO ESTADO VAZIO NÃO HERDA A MARIANA');
const zerado: any = estadoVazio();
ok(Object.values(zerado.vitals).every((l: any) => Array.isArray(l) && l.length === 0) && Object.keys(zerado.vitals).length === 5,
  'os sinais vitais nascem vazios — as cinco listas, sem medição nenhuma');
ok(zerado.materials.length === 0 && Object.keys(zerado.profile.clinicInfo).length === 0,
  'nem os materiais nem a ficha da clínica de exemplo');
ok(estadoVazio().diario !== estadoVazio().diario && buildSeed().diario !== buildSeed().diario,
  'cada estado vazio, e cada semente, é um diário novo');
{
  /* um diário cadastrado antes da correção: o estado vazio de então
     trazia os sinais vitais da Mariana */
  const antigo: any = clone(ensureDefaults(comNotificacoesDeExemplo(buildSeed())));
  antigo.semente = false;
  delete antigo.vitaisHerdadosLimpos;
  const medicoes = Object.values(antigo.vitals).reduce((n: number, l: any) => n + l.length, 0);
  ensureDefaults(antigo);
  const limpo = Object.values(antigo.vitals).every((l: any) => l.length === 0) && antigo.vitaisHerdadosLimpos === true;
  antigo.vitals.pa.push({ t: Date.now(), sys: 120, dia: 80 });
  ensureDefaults(antigo);
  const exemplo: any = ensureDefaults(buildSeed());
  ok(medicoes > 0 && limpo && antigo.vitals.pa.length === 1 && exemplo.vitals.pa.length > 0,
    'o diário que já existia perde, uma vez só, os sinais vitais herdados da semente — e a semente continua com os dela');
}


console.log('\nA TRADUÇÃO — todo campo tem destino');
const LOCAIS = ['pt-BR', 'en-US', 'es-419', 'fr-FR', 'it-IT', 'de-DE'] as const;
const sementes = LOCAIS.map((l) => {
  trocarLocal(l);
  return { l, S: ensureDefaults(comNotificacoesDeExemplo(buildSeed())) as any };
});
trocarLocal('pt-BR');
const semDestino = new Set<string>();
for (const S of [...sementes.map((x) => x.S), estadoVazio() as any, completo(sementes[0].S)]) {
  for (const k of Object.keys(S)) if (!(k in DESTINO_NO_ESTADO)) semDestino.add(k);
  for (const k of Object.keys(S.profile)) if (!(k in DESTINO_NO_PERFIL)) semDestino.add(`profile.${k}`);
}
ok(!semDestino.size, `todo campo do estado e do perfil tem destino declarado${semDestino.size ? ` — sem destino: ${[...semDestino].join(', ')}` : ''}`);

/* Que os tipos são os mesmos da regra do banco, quem confere é
   scripts/regras.mjs, que lê a migração. */
const tiposNaTabela = Object.values(DESTINO_NO_ESTADO).filter((d) => d.startsWith('registro:')).map((d) => d.slice(9));
ok(canonico([...tiposNaTabela].sort()) === canonico([...TIPOS_DE_REGISTRO].sort()),
  'cada tipo de registro é o destino de um campo, e de um só');
const nasPartes = [
  ...Object.entries(DESTINO_NO_ESTADO), ...Object.entries(DESTINO_NO_PERFIL),
].filter(([, d]) => d.startsWith('parte:')).map(([k, d]) => `${d}:${k}`);
ok(new Set(nasPartes).size === nasPartes.length, 'nenhuma parte do perfil recebe dois campos com o mesmo nome');


{
  /* O consentimento de compartilhar (logic/compartilhamento): a lista do
     que a equipe vê cobre todo tipo que sobe e toda parte do perfil. */
  const esperado = TIPOS_DE_REGISTRO.length - 1 + PARTES.length;
  const faltam = LOCAIS.filter((l) => {
    trocarLocal(l);
    const lista = oQueAEquipeVe();
    return lista.length !== esperado || lista.some((f) => typeof f !== 'string' || !f.trim());
  });
  trocarLocal('pt-BR');
  ok(!faltam.length && !(TIPOS_COMPARTILHADOS as readonly string[]).includes('foto'),
    `o consentimento de compartilhar lista todo tipo de registro e toda parte do perfil que a equipe lê, nos seis idiomas — e não as fotos, que não sobem${faltam.length ? ` — falta em ${faltam.join(', ')}` : ''}`);
}


console.log('\nA TRADUÇÃO — a tabela e a ida dizem a mesma coisa');
const cheio = completo(sementes[0].S);
const idaCheia = ida(cheio);
const discordam: string[] = [];
const conferir = (campo: string, destino: string, mexer: (S: any) => void, ler: (S: any) => unknown) => {
  const S = clone(cheio);
  mexer(S);
  const depois = ida(S);
  if (destino.startsWith('parte:')) {
    const parte = destino.slice(6) as (typeof PARTES)[number];
    const certo = canonico((depois.perfil.partes[parte] as any)[campo]) === canonico(ler(S))
      && PARTES.every((p) => p === parte || canonico(depois.perfil.partes[p]) === canonico(idaCheia.perfil.partes[p]))
      && canonico(depois.registros) === canonico(idaCheia.registros);
    if (!certo) discordam.push(campo);
  } else if (canonico(depois) !== canonico(idaCheia)) discordam.push(campo);
};
for (const [campo, destino] of Object.entries(DESTINO_NO_ESTADO)) {
  if (destino.startsWith('registro:') || destino === 'perguntas' || destino === 'perfil' || destino === 'coluna') continue;
  conferir(campo, destino, (S) => { S[campo] = { mexido: campo }; }, (S) => S[campo]);
}
for (const [campo, destino] of Object.entries(DESTINO_NO_PERFIL)) {
  if (destino === 'coluna') continue;
  conferir(campo, destino, (S) => { S.profile[campo] = { mexido: campo }; }, (S) => S.profile[campo]);
}
ok(!discordam.length, `cada campo de parte vai para a sua parte, e o que fica, vem do servidor ou se calcula não entra na ida${discordam.length ? ` — discordam: ${discordam.join(', ')}` : ''}`);

const contagem = (S: any, campo: string) => campo === 'exams'
  ? S.exams.reduce((n: number, m: any) => n + m.values.length, 0)
  : campo === 'vitals' ? Object.values(S.vitals).reduce((n: number, l: any) => n + l.length, 0) : S[campo].length;
const listasErradas = Object.entries(DESTINO_NO_ESTADO)
  .filter(([, d]) => d.startsWith('registro:'))
  .filter(([campo, d]) => idaCheia.registros.filter((r) => r.tipo === d.slice(9)).length !== contagem(cheio, campo))
  .map(([campo]) => campo);
ok(!listasErradas.length && idaCheia.registros.length > 250,
  `cada item vira uma linha do tipo da sua lista — cada valor de exame e cada sinal vital também (${idaCheia.registros.length} linhas)${listasErradas.length ? ` — erradas: ${listasErradas.join(', ')}` : ''}`);
ok(idaCheia.perguntas.length === cheio.asked.length && !idaCheia.registros.some((r) => cheio.asked.some((p: any) => p.rid === r.id)),
  'as perguntas vão para `perguntas`, e nenhuma para `registros`');
ok(idaCheia.perfil.consentimento?.versao === 1 && idaCheia.perfil.perguntasParaUso === true,
  'o consentimento e a escolha das perguntas vão para as colunas próprias do perfil');


console.log('\nA TRADUÇÃO — ida e volta devolvem o mesmo diário');
for (const { l, S } of sementes) {
  const origem = completo(S);
  const novo: any = estadoVazio();
  const antes = oQueFica(novo);
  misturar(novo, comoDesce(origem));
  ok(oQueSobe(novo) === oQueSobe(origem) && oQueFica(novo) === antes,
    `${l} (${S.profile.name}): o aparelho novo recebe o mesmo diário, e a volta não inventa o que não sobe`);
}
{
  const origem = completo(estadoVazio());
  const novo: any = estadoVazio();
  misturar(novo, comoDesce(origem));
  ok(oQueSobe(novo) === oQueSobe(origem), 'o estado vazio também vai e volta igual');
}


console.log('\nA MISTURA — item por item');
{
  const S: any = diarioDe(CONTA_A);
  const [p1, p2] = [S.weights[3], S.weights[4]];
  const antiga: RegistroDoServidor = {
    id: novoRid(), tipo: 'peso', quando: Math.round((p1.t + p2.t) / 2), dados: { kg: 77.7 },
    atualizadoEm: new Date(INSTANTE).toISOString(), apagadoEm: null,
  };
  const refeicao: RegistroDoServidor = {
    id: novoRid(), tipo: 'refeicao', quando: Date.now() + 60_000, dados: { name: 'Jantar', g: 30, itens: [] },
    atualizadoEm: new Date(INSTANTE).toISOString(), apagadoEm: null,
  };
  misturar(S, { registros: [antiga, refeicao] });
  ok(S.weights[4].rid === antiga.id && S.meals[0].rid === refeicao.id,
    'o que chega de outro aparelho entra onde o aplicativo o teria posto: a pesagem antiga no meio, a refeição nova em cima');

  const nota = S.notes[2];
  misturar(S, { registros: [{ ...ida(S).registros.find((r) => r.id === nota.rid)!, dados: { text: 'corrigida lá', done: true }, atualizadoEm: '', apagadoEm: null }] });
  ok(S.notes[2].rid === nota.rid && S.notes[2].text === 'corrigida lá', 'a versão nova substitui a antiga no mesmo lugar');

  const creatinina = S.exams.find((m: any) => m.marker === 'Creatinina');
  const valor = creatinina.values[0];
  const marcadores = S.exams.length;
  misturar(S, { registros: [{ id: valor.rid, tipo: 'exame', quando: null, dados: {}, atualizadoEm: '', apagadoEm: new Date().toISOString() }] });
  ok(S.exams.length === marcadores - 1 && !S.exams.some((m: any) => m.marker === 'Creatinina'),
    'o apagado sai — e o marcador que fica sem valor sai junto');

  const guardada = canonico(S.notes[0]);
  misturar(S, { registros: [{ ...ida(S).registros.find((r) => r.id === S.notes[0].rid)!, dados: { text: 'de lá' }, atualizadoEm: '', apagadoEm: null }] },
    { registro: (id) => id === S.notes[0].rid, parte: () => false, escolha: false });
  ok(canonico(S.notes[0]) === guardada, 'o que mudou aqui e ainda não subiu não é tocado');

  const antes = canonico(S);
  const { ignorados } = misturar(S, { registros: [{ id: novoRid(), tipo: 'glicose_continua' as any, quando: INSTANTE, dados: { v: 90 }, atualizadoEm: '', apagadoEm: null }] });
  ok(canonico(S) === antes && ignorados.size === 1, 'um tipo que esta versão não conhece fica de fora, e é avisado');
}
{
  /* o mesmo dia, criado em dois aparelhos sem conexão */
  const dia = +startOfDay(Date.now() + 2 * 86400000);
  const gole = (h: number) => ({ t: dia + h * 3600000, ml: 250 });
  const S: any = diarioDe(CONTA_A);
  const daqui = { t: dia, agua: 1, prot: 0, exerc: 0, aguas: [gole(8)], mood: 3, rid: novoRid() };
  S.checkins.push(daqui);
  const dela = {
    id: novoRid(), tipo: 'checkin' as const, quando: dia,
    dados: { agua: 2, prot: 0, exerc: 30, aguas: [gole(10), gole(12)], treinos: [{ tipo: 'Caminhada', min: 30 }], sono: 7 },
    atualizadoEm: '', apagadoEm: null,
  };
  misturar(S, { registros: [dela] });
  const doDia = S.checkins.filter((c: any) => c.t === dia);
  const [um] = doDia;
  const agua = 1 + (mlQueContam(gole(10) as any) + mlQueContam(gole(12) as any)) / CUP_ML;
  ok(doDia.length === 1 && um.rid === [daqui.rid, dela.id].sort()[0] && um.aguas.length === 3 && um.agua === agua
    && um.exerc === 30 && um.treinos.length === 1 && um.mood === 3 && um.sono === 7,
    'o mesmo dia criado em dois aparelhos vira um só, com os goles, o treino e as respostas dos dois');
}
{
  /* metas acrescentadas ao mesmo tempo, uma em cada aparelho */
  const S1: any = diarioDe(CONTA_A);
  const S2: any = clone(S1);
  S1.goals.push({ id: 'g-a', ic: 'star', label: 'Do A', indicador: null, feita: false, em: null });
  S2.goals.push({ id: 'g-b', ic: 'star', label: 'Do B', indicador: null, feita: false, em: null });
  carimbar(S1);
  carimbar(S2);
  const linhaDe = (S: any, id: string) => {
    const g = S.goals.find((x: any) => x.id === id);
    return { ...ida(S).registros.find((r) => r.id === g.rid)!, atualizadoEm: '', apagadoEm: null };
  };
  const doA = linhaDe(S1, 'g-a');
  const doB = linhaDe(S2, 'g-b');
  misturar(S1, { registros: [doB] });
  misturar(S2, { registros: [doA] });
  ok(canonico(S1.goals) === canonico(S2.goals), 'duas metas acrescentadas ao mesmo tempo ficam na mesma ordem nos dois aparelhos');
}


console.log('\nDOIS APARELHOS, UMA CONTA');
const srv = new ServidorFalso();
srv.criarConta(CONTA_A);
srv.criarConta(CONTA_B);
const A = aparelho(srv, diarioDe(CONTA_A), CONTA_A);
await A.sync();
ok(vivas(srv, CONTA_A).length === ida(A.S).registros.length && A.motor.estado() === 'guardado' && (await A.motor.pendentes()) === 0,
  `a conta nova recebe o diário inteiro (${vivas(srv, CONTA_A).length} linhas), e o estado diz "guardado"`);
ok(PARTES.every((p) => Object.keys(srv.perfis.get(CONTA_A)?.partes[p] ?? {}).length) && srv.perfis.get(CONTA_A)?.consentimento?.versao === 1,
  'e as seis partes do perfil, e o consentimento');

const perfilAntes = srv.perfis.get(CONTA_A)?.atualizadoEm;
const subidasAntes = srv.subidas;
const B = aparelho(srv, vazioDe(CONTA_A), CONTA_A);
await B.sync();
ok(oQueSobe(B.S) === oQueSobe(A.S), 'um aparelho novo, entrando na mesma conta, desce o diário inteiro');
ok(srv.subidas === subidasAntes && srv.perfis.get(CONTA_A)?.atualizadoEm === perfilAntes,
  'e não sobe nada: o perfil vazio dele não apaga o de verdade');

A.registrar((s) => { s.weights.push({ t: Date.now(), kg: 74.9 }); });
B.registrar((s) => { s.notes.unshift({ t: Date.now(), text: 'anotada no B', done: false }); });
await A.sync();
await B.sync();
await A.sync(true);
await B.sync(true);
ok(oQueSobe(A.S) === oQueSobe(B.S) && A.S.weights.some((w: any) => w.kg === 74.9) && A.S.notes.some((n: any) => n.text === 'anotada no B'),
  'dois aparelhos registrando coisas diferentes: os dois ficam com tudo');

const nota = A.S.notes[1].rid;
A.registrar((s) => { s.notes.find((n: any) => n.rid === nota).text = 'versão do A'; });
B.registrar((s) => { s.notes.find((n: any) => n.rid === nota).text = 'versão do B'; });
await A.sync();
await B.sync();
await A.sync(true);
await B.sync(true);
ok([A, B].every((x) => x.S.notes.find((n: any) => n.rid === nota).text === 'versão do B') && srv.registros.get(nota)?.dados.text === 'versão do B',
  'o mesmo item mexido nos dois: vale o último que chegou ao servidor');

B.registrar((s) => { s.notes.find((n: any) => n.rid === nota).text = 'de novo no B'; });
await B.sync();
srv.semRede = true;
A.registrar((s) => { s.notes.find((n: any) => n.rid === nota).text = 'no A, sem conexão'; });
await A.sync();
srv.semRede = false;
await A.sync(true);
ok(A.S.notes.find((n: any) => n.rid === nota).text === 'no A, sem conexão' && srv.registros.get(nota)?.dados.text === 'no A, sem conexão',
  'o que mudou aqui e ainda não subiu não é atropelado pelo que desce — e sobe depois, por último');
await B.sync(true);

const refeicaoApagada = A.S.meals[3].rid;
A.registrar((s) => { s.meals = s.meals.filter((m: any) => m.rid !== refeicaoApagada); });
await A.sync();
await B.sync(true);
const marca = srv.registros.get(refeicaoApagada);
ok(!B.S.meals.some((m: any) => m.rid === refeicaoApagada) && !!marca?.apagadoEm && !Object.keys(marca.dados).length,
  'apagar num aparelho some no outro, e o servidor fica só com a marca — sem o conteúdo');

A.registrar((s) => { s.theme = 'dark'; });
B.registrar((s) => { s.profile.name = 'Nome mudado no B'; });
await A.sync();
await B.sync();
await A.sync(true);
await B.sync(true);
ok([A, B].every((x) => x.S.theme === 'dark' && x.S.profile.name === 'Nome mudado no B'),
  'dois aparelhos mexendo em partes diferentes do perfil não se atropelam');

{
  const dia = +startOfDay(Date.now() + 86400000);
  A.registrar((s) => { s.checkins.push({ t: dia, agua: 1, prot: 0, exerc: 0, aguas: [{ t: dia + 8 * 3600000, ml: 250 }] }); });
  B.registrar((s) => { s.checkins.push({ t: dia, agua: 0, prot: 0, exerc: 20, treinos: [{ tipo: 'Caminhada', min: 20 }], mood: 4 }); });
  const recipientes = [A, B].map((x) => x.S.checkins.find((c: any) => c.t === dia).rid as string);
  await A.sync();
  await B.sync();
  await A.sync(true);
  await B.sync(true);
  await A.sync(true);
  const [daA, daB] = [A, B].map((x) => x.S.checkins.filter((c: any) => c.t === dia));
  ok(daA.length === 1 && daB.length === 1 && canonico(daA[0]) === canonico(daB[0])
    && daA[0].aguas?.length === 1 && daA[0].treinos?.length === 1 && daA[0].mood === 4 && daA[0].agua === 1 && daA[0].exerc === 20,
    'o mesmo dia criado nos dois aparelhos vira um dia só nos dois, com o que cada um registrou');
  const noServidor = recipientes.map((id) => srv.registros.get(id));
  ok(noServidor.filter((l) => l && !l.apagadoEm).length === 1 && noServidor.filter((l) => l?.apagadoEm).length === 1
    && daA[0].rid === [...recipientes].sort()[0],
    'e no servidor fica um vivo — o de menor identidade, nos dois aparelhos —, e o outro marcado como apagado');
}

srv.perfis.get(CONTA_A)!.consentimento = { versao: 2, em: INSTANTE + 5 };
await B.sync(true);
B.registrar((s) => { s.profile.consentimento = { em: Date.now(), versao: 1 }; });
await B.sync(true);
ok(B.S.profile.consentimento.versao === 2 && srv.perfis.get(CONTA_A)?.consentimento?.versao === 2 && B.motor.estado() === 'guardado',
  'o consentimento só sobe de versão: a maior vale, venha de onde vier');
B.registrar((s) => { s.profile.consentimento = { em: Date.now(), versao: 3 }; });
await B.sync(true);
await A.sync(true);
ok(B.S.profile.consentimento.versao === 3 && srv.perfis.get(CONTA_A)?.consentimento?.versao === 3 && A.S.profile.consentimento.versao === 3,
  'e a versão nova aceita aqui não é trocada pela antiga que desce: ela sobe, e chega ao outro aparelho');

{
  /* uma linha que uma versão mais nova do aplicativo subiu */
  const doFuturo = novoRid();
  srv.registros.set(doFuturo, {
    id: doFuturo, usuario: CONTA_A, tipo: 'glicose_continua', quando: INSTANTE, dados: { v: 90 },
    atualizadoEm: srv.relogio + 1, apagadoEm: null, escondida: false,
  });
  srv.relogio += 1;
  await A.sync(true);
  await A.sync();
  ok(srv.registros.get(doFuturo)?.apagadoEm === null && srv.registros.get(doFuturo)?.dados.v === 90 && A.motor.estado() === 'guardado',
    'uma linha de um tipo que esta versão não conhece fica intacta no servidor — não vira apagada');
}


console.log('\nA REDE QUE CAI');
srv.semRede = true;
A.registrar((s) => {
  s.weights.push({ t: Date.now() + 1, kg: 74.1 });
  s.notes.unshift({ t: Date.now() + 2, text: 'sem conexão 1', done: false });
  s.notes.unshift({ t: Date.now() + 3, text: 'sem conexão 2', done: false });
});
await A.sync();
ok(A.motor.estado() === 'sem-internet' && (await A.motor.pendentes()) === 3, 'sem internet, o que mudou fica esperando — e o estado diz');
A.reabrir();
srv.semRede = false;
await A.sync();
ok(vivas(srv, CONTA_A).filter((l) => /^sem conexão/.test(String(l.dados.text))).length === 2
  && vivas(srv, CONTA_A).filter((l) => l.dados.kg === 74.1).length === 1 && (await A.motor.pendentes()) === 0 && A.motor.estado() === 'guardado',
  'fechado e reaberto com conexão, sobe tudo, uma vez só');

{
  const srv2 = new ServidorFalso();
  srv2.criarConta(CONTA_B);
  const grande = diarioDe(CONTA_B);
  for (let i = 0; i < 900; i++) grande.meals.push({ t: INSTANTE - i * 60_000, name: `Extra ${i}`, g: 10, tag: '', itens: [], fonte: 'manual' });
  const C = aparelho(srv2, carimbar(grande), CONTA_B);
  const total = ida(C.S).registros.length;
  srv2.perderRespostaDoLote = 2;
  await C.sync();
  ok(total > 1000 && C.motor.estado() === 'sem-internet' && vivas(srv2, CONTA_B).length === 1000,
    `a primeira subida de ${total} linhas cai com a resposta do segundo lote perdida`);
  C.reabrir();
  await C.sync();
  ok(vivas(srv2, CONTA_B).length === total && (await C.motor.pendentes()) === 0 && C.motor.estado() === 'guardado',
    'e retoma de onde parou: todas no servidor, nenhuma a mais, nada pendente');
}

srv.demorarProximoLote = true;
A.registrar((s) => { s.notes.unshift({ t: Date.now() + 10, text: 'de uma transação demorada', done: false }); });
await A.sync();
A.registrar((s) => { s.weights.push({ t: Date.now() + 11, kg: 73.3 }); });
await A.sync();
await B.sync(true);
const viuAntes = B.S.notes.some((n: any) => n.text === 'de uma transação demorada');
srv.terminarTransacoes();
await B.sync(true);
ok(!viuAntes && B.S.weights.some((w: any) => w.kg === 73.3) && B.S.notes.some((n: any) => n.text === 'de uma transação demorada'),
  'a linha de uma transação que demorou aparece na descida seguinte: a descida volta um minuto antes do cursor');

{
  const nota = { t: Date.now() + 20, text: 'x'.repeat(70_000), done: false };
  A.registrar((s) => { s.notes.unshift(nota); s.weights.push({ t: Date.now() + 21, kg: 72.8 }); });
  await A.sync();
  ok(vivas(srv, CONTA_A).some((l) => l.dados.kg === 72.8) && !vivas(srv, CONTA_A).some((l) => String(l.dados.text ?? '').length > 60_000)
    && A.motor.estado() === 'guardando' && (await A.motor.pendentes()) === 1,
    'a linha maior que o teto do banco fica no aparelho, não segura o resto, e o estado não diz "guardado"');
  A.registrar((s) => { s.notes = s.notes.filter((n: any) => n.text !== nota.text); });
  await A.sync();
}

A.sessao = null;
const antesDaQueda = canonico(A.S);
const baseDaQueda = await A.guarda.getItem(CHAVE_DA_BASE);
await A.sync(true);
ok(A.motor.estado() === 'entrar-de-novo' && canonico(A.S) === antesDaQueda && (await A.guarda.getItem(CHAVE_DA_BASE)) === baseDaQueda,
  'a sessão que cai pede para entrar de novo, e não apaga nada');
A.sessao = CONTA_A;

ok([1, 2, 3, 4, 5, 6, 7].map(esperaDepoisDe).join() === '2000,4000,8000,16000,32000,60000,60000',
  'na falha, espera 2 s, 4 s, 8 s… até um minuto');


console.log('\nO QUE NUNCA SOBE');
{
  const antes = srv.subidas;
  const verdade = A.S;
  A.fingindo = true;
  A.S = mascarar(verdade, 'sozinha');
  await A.sync(true);
  ok(srv.subidas === antes && A.motor.estado() === 'desligada', 'com a prévia do Perfil no ar, nada sobe — e nada desce');
  A.S = verdade;
  A.fingindo = false;
}
{
  const srv3 = new ServidorFalso();
  srv3.criarConta(CONTA_A);
  const exemplo: any = clone(ensureDefaults(buildSeed()));
  exemplo.conta = { id: CONTA_A };
  const D = aparelho(srv3, exemplo, CONTA_A);
  await D.sync(true);
  ok(srv3.subidas === 0 && srv3.linhasDe(CONTA_A).length === 0 && D.motor.estado() === 'desligada',
    'a demonstração nunca sobe, nem com um dono');
}
{
  const E = aparelho(srv, diarioDe(CONTA_A), CONTA_B);
  const linhas = srv.registros.size;
  await E.sync();
  ok(E.motor.estado() === 'outra-conta' && srv.registros.size === linhas && !srv.perfis.has(CONTA_B),
    'o diário com dono não sobe para outra conta');
}
{
  const F = aparelho(srv, (() => { const v = vazioDe(null); v.onboardDone = true; return v; })(), CONTA_A);
  await F.sync();
  ok(F.motor.estado() === 'sem-conta', 'o diário de alguém, ainda sem conta, é dito como tal');
}


console.log('\nAS PERGUNTAS');
{
  const par = (endereco: string) => new URLSearchParams(endereco.split('?')[1]);
  const doCampo = par(enderecoDoCompanheiro('Posso beber?', 'digitada'));
  const daPastilha = par(enderecoDoCompanheiro('Por que sinto enjoo?'));
  ok(origemDoEndereco([], doCampo.get('q')!, doCampo.get('origem') ?? undefined) === 'digitada'
    && origemDoEndereco([], daPastilha.get('q')!, daPastilha.get('origem') ?? undefined) === 'sugerida',
    'a pergunta digitada no Insights chega como digitada, e a pastilha tocada como sugerida');
  const recente = par(enderecoDoCompanheiro('Posso beber?', 'recente'));
  ok(origemDoEndereco([{ t: 1, q: 'Posso beber?', origem: 'digitada' }], 'Posso beber?', recente.get('origem')!) === 'digitada'
    && origemDoEndereco([{ t: 1, q: 'Antiga' }], 'Antiga', 'recente') === undefined,
    'uma recente tocada de novo herda a origem da primeira vez — e a antiga, sem origem, continua sem');
}

A.registrar((s) => { s.asked = acrescentarPergunta(s.asked, 'Posso beber?', 'digitada', Date.now()); });
await A.sync();
ok(srv.perguntasTentadas === 0 && srv.perguntasDe(CONTA_A).length === 0 && A.motor.estado() === 'guardado',
  'sem a escolha ligada, nenhuma pergunta sai do aparelho — e isso não é pendência');

A.registrar((s) => { s.perguntasParaUso = true; });
await A.sync();
const primeira = srv.perguntasDe(CONTA_A)[0];
ok(srv.perfis.get(CONTA_A)?.perguntasParaUso === true && srv.perguntasDe(CONTA_A).length === 1 && primeira?.origem === 'digitada'
  && !srv.registros.has(primeira.id),
  'ligada a escolha, a pergunta do aparelho sobe com a origem dela — para `perguntas`, e não para `registros`');

for (let i = 1; i <= 12; i++) A.registrar((s) => { s.asked = acrescentarPergunta(s.asked, `Pergunta ${i}`, 'sugerida', Date.now() + i); });
await A.sync();
ok(A.S.asked.length === 12 && !A.S.asked.some((p: any) => p.rid === primeira.id) && srv.perguntas.has(primeira.id)
  && srv.perguntasDe(CONTA_A).length === 13,
  'a 13ª pergunta tira a primeira da janela, e não do servidor');

A.registrar((s) => { s.asked = acrescentarPergunta(s.asked, 'Pergunta 5', 'sugerida', Date.now() + 100); });
await A.sync();
ok(srv.perguntasDe(CONTA_A).filter((p) => p.texto === 'Pergunta 5').length === 2,
  'a repetida vira uma linha nova, sem apagar a anterior');

await B.sync(true);
/* B nunca tinha descido pergunta nenhuma: vêm as 12 últimas linhas, e
   uma delas é a repetida — a janela fica com 11. */
ok(B.S.perguntasParaUso === true && B.S.asked.some((p: any) => p.q === 'Pergunta 12')
  && B.S.asked.filter((p: any) => p.q === 'Pergunta 5').length === 1 && B.S.asked.length === 11
  && B.S.asked.every((p: any) => A.S.asked.some((q: any) => q.rid === p.rid)),
  'a pergunta feita no aparelho A aparece na janela do B na descida seguinte — e a repetida, uma vez só');

A.registrar((s) => {
  s.perguntasParaUso = false;
  s.asked = acrescentarPergunta(s.asked, 'Depois de desligar', 'digitada', Date.now() + 200);
});
await A.sync();
ok(srv.perfis.get(CONTA_A)?.perguntasParaUso === false && srv.perguntasDe(CONTA_A).length === 0 && (await A.motor.pendentes()) === 0,
  'desligar a escolha apaga as do servidor, e nada fica esperando para subir');

B.registrar((s) => { s.asked = acrescentarPergunta(s.asked, 'No B, com a escolha antiga', 'digitada', Date.now() + 300); });
await B.sync();
const recusada = B.motor.estado();
await B.sync(true);
ok(recusada === 'guardando' && B.S.perguntasParaUso === false && srv.perguntasDe(CONTA_A).length === 0 && B.motor.estado() === 'guardado',
  'o outro aparelho, com a escolha antiga, é recusado pelo banco — e a volta seguinte desce a escolha nova');


console.log('\nOS DOIS DIÁRIOS NÃO SE MISTURAM');
{
  const srv4 = new ServidorFalso();
  srv4.criarConta(CONTA_C);
  const X = aparelho(srv4, diarioDe(CONTA_C), CONTA_C);
  await X.sync();
  const daConta = new Set(vivas(srv4, CONTA_C).map((l) => l.id));
  /* outro telefone, com o diário que acabou de montar, entra na mesma conta */
  const Y = aparelho(srv4, (() => {
    const v: any = vazioDe(null);
    v.onboardDone = true;
    v.profile.name = 'Quem ficou com este';
    v.weights = [{ t: Date.now(), kg: 88 }];
    return carimbar(v);
  })(), CONTA_C);
  Y.registrar((s) => { s.conta = { id: CONTA_C }; });
  await Y.motor.substituirNoServidor();
  const vivasAgora = vivas(srv4, CONTA_C);
  ok(vivasAgora.length === 1 && vivasAgora[0].dados.kg === 88 && [...daConta].every((id) => srv4.registros.get(id)?.apagadoEm)
    && srv4.perfis.get(CONTA_C)?.partes.pessoal?.name === 'Quem ficou com este' && Y.motor.estado() === 'guardado',
    'ficar com o deste telefone: o diário da conta vira apagado, e este sobe no lugar — perfil e registros');
  await X.sync(true);
  ok(X.S.weights.length === 1 && X.S.weights[0].kg === 88 && X.S.profile.name === 'Quem ficou com este',
    'e o outro aparelho da conta recebe o diário que ficou');
}


console.log('\nTROCAR DE DIÁRIO');
{
  const antes = srv.subidas;
  await A.motor.trocarDeDiario(() => { A.S = vazioDe(null); });
  ok((await A.guarda.getItem(CHAVE_DA_BASE)) === null, 'sair da conta apaga a base da sincronia');
  A.registrar((s) => { s.weights.push({ t: Date.now(), kg: 70 }); });
  await A.sync();
  ok((await A.motor.pendentes()) === 0 && srv.subidas === antes, 'depois de sair, nada fica esperando e nada sobe');

  const vivasAntes = vivas(srv, CONTA_A).length;
  const apagadasAntes = apagadas(srv, CONTA_A).length;
  await A.motor.trocarDeDiario(() => { A.S = vazioDe(CONTA_A); });
  await A.sync();
  /* Com a escolha desligada, as perguntas ficaram só no B: elas não descem. */
  const semPerguntas = (S: any) => oQueSobe({ ...S, asked: [] });
  ok(vivas(srv, CONTA_A).length === vivasAntes && apagadas(srv, CONTA_A).length === apagadasAntes
    && semPerguntas(A.S) === semPerguntas(B.S) && A.S.asked.length === 0,
    'entrar de novo na mesma conta não marca nada como apagado, e o diário desce inteiro — menos as perguntas que ficaram no outro aparelho');

  /* um caminho que esquecesse de apagar a base */
  A.S = vazioDe(CONTA_A);
  await A.sync();
  ok(vivas(srv, CONTA_A).length === vivasAntes && apagadas(srv, CONTA_A).length === apagadasAntes,
    'um diário novo encontrando a base do anterior não gera apagado: a base é de outro diário');

  A.S = vazioDe(CONTA_B);
  A.sessao = CONTA_B;
  await A.sync();
  ok(vivas(srv, CONTA_A).length === vivasAntes && apagadas(srv, CONTA_A).length === apagadasAntes && srv.linhasDe(CONTA_B).length === 0,
    'o estado vazio com a base de outro dono não gera apagado em conta nenhuma');
}
{
  const G = aparelho(srv, diarioDe(CONTA_B), CONTA_B);
  await G.sync();
  srv.apagarConta(CONTA_B);
  await G.sync(true);
  ok(G.motor.estado() === 'conta-apagada', 'a conta apagada no servidor aparece como tal');
  await G.motor.trocarDeDiario(() => { G.S = vazioDe(null); });
  srv.criarConta(CONTA_C);
  G.sessao = CONTA_C;
  G.registrar((s) => { s.conta = { id: CONTA_C }; s.onboardDone = true; s.weights.push({ t: Date.now(), kg: 90 }); });
  await G.sync();
  ok(vivas(srv, CONTA_C).length === 1 && G.motor.estado() === 'guardado', 'depois de apagar a conta, uma conta nova sobe do zero');
}


console.log('\nO STORE TROCA DE DIÁRIO');
await AsyncStorage.setItem(CHAVE_DA_BASE, '{"versao":1}');
useStore.getState().reset();
await new Promise((r) => setTimeout(r, 10));
ok((await AsyncStorage.getItem(CHAVE_DA_BASE)) === null, '"Apagar meus dados" apaga a base da sincronia');
await AsyncStorage.setItem(CHAVE_DA_BASE, '{"versao":1}');
useStore.getState().resemear();
await new Promise((r) => setTimeout(r, 10));
ok((await AsyncStorage.getItem(CHAVE_DA_BASE)) === null, 'reconstruir a semente também');

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
