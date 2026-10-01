/* ============================================================
   A SONDA DA LEITURA DA SEMANA — o motor de descobertas

     npx tsx --tsconfig scripts/tsconfig.json scripts/leitura-da-semana.ts

   ⚠️ O QUE ESTA SONDA SEGURA É O ALARME FALSO. Com dezenas de pares
   testados por pessoa, a coincidência aparece sozinha; se a régua deixa
   passar um "padrão forte" num diário de números sorteados, ela deixa
   passar a mesma ilusão em gente de verdade — e a pessoa muda de hábito
   por causa de ruído. Ver docs/superpowers/specs/2026-10-01-leitura-da-
   semana-design.md.

   Ela afirma:
     1. em 100 diários aleatórios, padrão forte em no máximo 5;
     2. o padrão plantado (café da manhã baixa a fome) é achado, com a
        direção certa; dia sem refeição não conta como "sem café"; os
        pares óbvios ficam de fora;
     3. cada detector de tendência acha o caso plantado e ignora o ruído;
     4. todo diário com registro sai com uma descoberta; as áreas se
        alternam; a memória segura 3 semanas.

   Tudo com sorteio de semente fixa e relógio fixo: o resultado é o mesmo
   em toda rodada.
   ============================================================ */

import { comRelogioFixo } from './avaliacao/relogio';
import { DAY } from '../src/logic/time';
import { buildSeed, estadoVazio, ensureDefaults, type State } from '../src/logic/seed';
import { resumoDaSemana, temMinimoDaSemana, descobertaParaLeitura, TETO_DO_RESUMO_DA_SEMANA } from '../src/logic/resumoDaSemana';
import { candidatasDaSemana, escolherDaSemana, type Candidata } from '../src/logic/descobertasDaSemana';

let falhas = 0;
const ok = (certo: boolean, o: string, detalhe = '') => {
  console.log(`${certo ? '  ok  ' : '  NÃO '} ${o}${detalhe ? `  (${detalhe})` : ''}`);
  if (!certo) falhas += 1;
};

import { diario, diaAntes, agora, de } from './leitura-da-semana-gerador';

const COMPARACOES = new Set(['par', 'pesoPorHabito']);
const fortesDeComparacao = (cs: Candidata[]) => cs.filter((c) => c.nivel === 'forte' && COMPARACOES.has(c.tipo));

comRelogioFixo(() => {
  /* ---------------- 1. o alarme falso ---------------- */
  console.log('\n1. O ALARME FALSO — 100 diários sem padrão nenhum');
  let comForte = 0, comComeco = 0, semNada = 0;
  const exemplos: string[] = [];
  for (let i = 1; i <= 100; i++) {
    const cs = candidatasDaSemana(diario(i * 7919), agora);
    const f = fortesDeComparacao(cs);
    if (f.length) { comForte++; if (exemplos.length < 3) exemplos.push(f[0].chave); if (process.env.DIAG) for (const x of f) console.log('    falso', x.chave, JSON.stringify(x.dados)); }
    if (cs.some((c) => c.nivel === 'comeco')) comComeco++;
    if (!escolherDaSemana(cs, [], de)) semNada++;
  }
  ok(comForte <= 5, 'padrão forte em no máximo 5 de 100 diários aleatórios', `${comForte}${exemplos.length ? `: ${exemplos.join(', ')}` : ''}`);
  ok(semNada === 0, 'todo diário com registro sai com uma descoberta', `começo de padrão em ${comComeco}, nada em ${semNada}`);

  /* ---------------- 2. o padrão plantado ---------------- */
  console.log('\n2. O PADRÃO PLANTADO — café da manhã baixa a fome');
  let achados = 0, direcao = 0;
  for (let i = 1; i <= 20; i++) {
    const cs = candidatasDaSemana(diario(i * 104729, { cafeBaixaFome: 2 }), agora);
    const par = cs.find((c) => c.chave === 'par:cafe:fome:0' && c.nivel === 'forte');
    if (process.env.DIAG) { const q = cs.find((c) => c.chave === 'par:cafe:fome:0'); console.log('    plantado', q?.nivel, JSON.stringify(q?.dados)); }
    if (par) { achados++; if ((par.dados.mediaCom as number) < (par.dados.mediaSem as number)) direcao++; }
  }
  ok(achados >= 18, 'o padrão plantado vira padrão forte em pelo menos 18 de 20 diários', `${achados}`);
  ok(direcao === achados, 'e sempre na direção certa: com café, menos fome', `${direcao}/${achados}`);

  const vazios = candidatasDaSemana(diario(31337, { semRefeicaoComFome: true }), agora);
  ok(!vazios.some((c) => c.chave.startsWith('par:cafe:')), 'dia sem refeição registrada não conta como "sem café"');

  const obvios = candidatasDaSemana(diario(4242, { enjooPorDia: (k) => (k % 7 === 6 || k % 7 === 5 ? 4 : 0) }), agora);
  ok(!obvios.some((c) => c.chave.startsWith('par:posAplicacao:enjoo')), 'o enjoo depois da aplicação fica de fora (já é a janela do enjoo)');

  /* ---------------- 3. os detectores de tendência ---------------- */
  console.log('\n3. OS DETECTORES DE TENDÊNCIA');
  {
    const S: any = diario(777, { pesoPorSemana: (s) => (s >= 4 ? 0.2 : 0.9) });
    /* a dose subiu há 4 semanas */
    S.injections = S.injections.map((x: any) => ({ ...x, dose: x.t >= diaAntes(28) ? 7.5 : 5 }));
    const cs = candidatasDaSemana(S, agora);
    ok(cs.some((c) => c.tipo === 'ritmoDaDose' && (c.dados.ritmoDepoisKgSemana as number) > (c.dados.ritmoAntesKgSemana as number)),
      'o ritmo que acelerou depois da subida de dose é achado');
    ok(cs.some((c) => c.tipo === 'ritmoAcelerou' && c.nivel === 'forte'), 'e o ritmo das últimas 4 semanas que acelerou é padrão forte');
  }
  {
    const S: any = diario(776, { pesoPorSemana: (s) => (s >= 4 ? 1.0 : 0.3) });
    S.injections = S.injections.map((x: any) => ({ ...x, dose: x.t >= diaAntes(28) ? 7.5 : 5 }));
    const cs = candidatasDaSemana(S, agora);
    ok(!cs.some((c) => c.tipo === 'ritmoDaDose'), 'desacelerar depois da subida de dose NÃO vira descoberta da dose (é o tempo, não a dose)');
    ok(cs.some((c) => c.tipo === 'ritmoDesacelerou') && !cs.some((c) => c.tipo === 'ritmoDesacelerou' && c.nivel !== 'retrato'),
      'e a desaceleração das últimas semanas é só retrato');
  }
  {
    const cs = candidatasDaSemana(diario(778, { pesoPorSemana: () => 0.5 }), agora);
    ok(!cs.some((c) => ['ritmoAcelerou', 'ritmoDesacelerou', 'ritmoDaDose'].includes(c.tipo)), 'um ritmo constante, com a oscilação normal, não vira descoberta');
  }
  {
    const S: any = diario(779);
    S.exams = [
      { marker: 'LDL', unit: 'mg/dL', ref: '< 130', good: 'down', values: [{ t: diaAntes(120), v: 142 }, { t: diaAntes(10), v: 118 }] },
      { marker: 'TSH', unit: 'µUI/mL', ref: '0,4–4,0', good: '', values: [{ t: diaAntes(10), v: 2.1 }] },
    ];
    const cs = candidatasDaSemana(S, agora);
    ok(cs.some((c) => c.tipo === 'exameEntrouNaFaixa' && c.dados.marcador === 'LDL'), 'o LDL que caiu para dentro da faixa entre dois laudos é achado');
    ok(!cs.some((c) => c.area === 'exames' && c.dados.marcador === 'TSH'), 'um marcador com um laudo só não gera nada');
  }
  {
    const cs = candidatasDaSemana(diario(780, { enjooPorDia: (k) => (k > 14 ? 3 : 1) }), agora);
    ok(cs.some((c) => c.tipo === 'sintomaCaiu'), 'o enjoo que caiu pela metade nas últimas 2 semanas é achado');
  }
  {
    const S: any = diario(781);
    S.measures = [
      { t: diaAntes(40), cintura: 100 },
      { t: diaAntes(4), cintura: 94 },
    ];
    S.weights = [{ t: diaAntes(41), kg: 90 }, { t: diaAntes(20), kg: 88 }, { t: diaAntes(5), kg: 86.6 }];
    const cs = candidatasDaSemana(S, agora);
    ok(cs.some((c) => c.tipo === 'cinturaMaisQuePeso'), 'a cintura caindo mais rápido que o peso é achada');
  }

  /* ---------------- 4. a escolha da semana ---------------- */
  console.log('\n4. A ESCOLHA DA SEMANA');
  const fake = (area: any, chave: string, nivel: any, forca: number): Candidata => ({ area, tipo: 'x', chave, nivel, forca, dados: {} });
  const cands = [fake('habitos', 'a', 'forte', 0.9), fake('ritmo', 'b', 'forte', 0.5), fake('constancia', 'c', 'retrato', 0.9)];
  ok(escolherDaSemana(cands, [], de)?.chave === 'a', 'sem histórico, vence o mais forte');
  ok(escolherDaSemana(cands, [{ semana: de - 7 * DAY, chave: 'z', area: 'habitos' }], de)?.chave === 'b',
    'se a semana passada foi de hábitos, outra área no mesmo nível vence');
  ok(escolherDaSemana(cands, [{ semana: de - 14 * DAY, chave: 'a', area: 'habitos' }], de)?.chave === 'b',
    'uma descoberta mostrada há 2 semanas não volta');
  ok(escolherDaSemana(cands, [{ semana: de - 28 * DAY, chave: 'a', area: 'habitos' }], de)?.chave === 'a',
    'e há 4 semanas, já pode voltar');
});

comRelogioFixo(() => {
  /* ---------------- 5. o resumo da semana ---------------- */
  console.log('\n5. O RESUMO DA SEMANA');
  const S = ensureDefaults(buildSeed()) as State;
  const r = resumoDaSemana(S, agora);
  ok(['## Pessoa', '## Tratamento', '## Peso', '## Alimentação e água'].every((x) => r.includes(x)), 'o resumo da semente tem pessoa, tratamento, peso e alimentação');
  ok(r.length <= TETO_DO_RESUMO_DA_SEMANA, 'e cabe no teto');
  const P: any = S.profile;
  const terceiros = [P.doctor, P.clinic, P.nutri, P.email].filter((x) => typeof x === 'string' && x.trim().length > 2);
  ok(terceiros.every((x) => !r.includes(x)), 'sem o nome de quem acompanha, da clínica, nem e-mail');
  const sobrenome = String(P.name).trim().split(/\s+/).slice(1).join(' ');
  ok(!sobrenome || !r.includes(sobrenome), 'do nome, só o primeiro');
  const vazio = ensureDefaults(estadoVazio()) as State;
  ok(!temMinimoDaSemana(vazio, agora), 'sem registro na semana, não há o mínimo — e o servidor não é chamado');
  ok(temMinimoDaSemana(diario(1), agora), 'com check-in todo dia, há');
  const c = descobertaParaLeitura({ area: 'exames', tipo: 'exameMelhorou', chave: 'x', nivel: 'forte', forca: 1, dados: { marcador: 'LDL', dataAntes: diaAntes(100), diaDaSemana: 3 } });
  ok(/^\d{4}-\d{2}-\d{2}$/.test(String(c.dados.dataAntes)) && c.dados.diaDaSemana === 'quarta-feira', 'a descoberta vai ao servidor com as datas e o dia da semana escritos');
});

/* ---------------- 6. o servidor ---------------- */
(async () => {
  console.log('\n6. O SERVIDOR DA LEITURA');
  const env = { ...process.env };
  process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'sk-teste';
  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://projeto.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_teste';
  delete process.env.MORPHI_TOKEN;
  const { lerPedidoDaLeitura, TETOS_DA_LEITURA, default: leitura } = await import('../servidor/api/leitura');
  const d = { nivel: 'forte', area: 'habitos', tipo: 'par', dados: { comportamento: 'cafe', resultado: 'fome', mediaCom: 1.8, mediaSem: 3.2 } };
  ok(lerPedidoDaLeitura({ resumo: 'r', descoberta: d, idioma: 'de-DE' })?.idioma === 'de-DE'
    && lerPedidoDaLeitura({ resumo: 'r', descoberta: d, idioma: 'xx' })?.idioma === 'pt-BR',
    'o idioma vem do pedido, e um desconhecido cai no português');
  ok(lerPedidoDaLeitura({ resumo: '', descoberta: d }) === null
    && lerPedidoDaLeitura({ resumo: 'x'.repeat(TETOS_DA_LEITURA.resumo + 1), descoberta: d }) === null
    && lerPedidoDaLeitura({ resumo: 'r', descoberta: { ...d, nivel: 'certeza' } }) === null
    && lerPedidoDaLeitura({ resumo: 'r', descoberta: { ...d, dados: { x: { aninhado: 1 } } } }) === null
    && lerPedidoDaLeitura({ resumo: 'r' }) === null,
    'pedido sem resumo, grande demais, com nível inventado, com dado aninhado ou sem descoberta é recusado');
  const post = (corpo: unknown) => leitura.fetch(new Request('https://x/api/leitura', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo),
  }));
  ok((await post({ resumo: '' })).status === 400, 'um pedido malformado é recusado antes da porta, sem gastar cota');
  const semLogin = await post({ resumo: 'a semana', descoberta: d, idioma: 'pt-BR' });
  ok(semLogin.status === 401 && (await semLogin.json()).motivo === 'sem-conta', 'sem sessão, a leitura é "sem-conta" e não chama o modelo');
  for (const k of ['ANTHROPIC_API_KEY', 'VERCEL_ENV', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'MORPHI_TOKEN']) {
    if (env[k] === undefined) delete process.env[k]; else process.env[k] = env[k];
  }
  console.log(falhas ? `\n${falhas} afirmação(ões) falharam` : '\ntodas as afirmações passaram');
  process.exit(falhas ? 1 : 0);
})();
