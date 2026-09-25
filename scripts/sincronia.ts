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
   ============================================================ */
import { buildSeed, ensureDefaults, estadoVazio, recomecarDoZero } from '../src/logic/seed';
import { itensDoDiario } from '../src/logic/traducao';
import { carimbar } from '../src/logic/identidade';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../src/logic/store';
import { NOMES_DAS_PERSONAS } from '../src/textos';

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

console.log(falhas ? `\n${falhas} afirmação(ões) falharam\n` : '\ntodas as afirmações passaram\n');
process.exit(falhas ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
