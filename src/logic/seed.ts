/* SEED — paciente coerente (Mariana, ~semana 10 de tratamento). Porta verbatim do protótipo. */
import { daysAgo, addDays, startOfDay, now } from './time';

export const HEIGHT = 1.67;

export function buildSeed() {
  const med = 'mounjaro';
  /* Pesos: 82,4 -> 75,1 em ~70 dias.
     A curva tem platô e duas semanas de leve ganho de propósito. Perda com
     GLP-1 não é linear, e um seed em linha reta contradiz o que o próprio
     app diz à paciente sobre semanas paradas. */
  const wpts = [[70, 82.4], [63, 81.2], [56, 80.3], [49, 80.9], [42, 79.6], [35, 78.8], [28, 79.5], [21, 78.1], [14, 77.0], [10, 77.7], [7, 76.3], [3, 75.5], [0, 75.1]];
  const weights = wpts.map(([d, k]) => ({ t: +daysAgo(d), kg: k }));
  // aplicações semanais: 4×2.5mg depois 5mg; última há 4 dias
  const injDays = [67, 60, 53, 46, 39, 32, 25, 18, 11, 4];
  const sites = ['abd-e', 'abd-d', 'coxa-e', 'coxa-d', 'braco-e', 'braco-d'];
  const injections = injDays.map((d, i) => ({ t: +daysAgo(d), med, dose: i < 4 ? 2.5 : 5, site: sites[i % 6], note: '' }));
  // check-ins últimos 13 dias (hoje pendente)
  const checkins: any[] = [];
  for (let d = 13; d >= 1; d--) {
    const date = daysAgo(d); const wd = date.getDay();
    const postInj = [3, 4, 5, 10, 11, 12].includes(d); // dias logo após aplicar
    checkins.push({
      t: +startOfDay(date),
      mood: 3 + (13 - d > 6 ? 1 : 0) + (wd === 0 ? -1 : 0),
      fome: postInj ? 3 : (d % 7 < 2 ? 7 : 5),
      nausea: postInj ? 4 : 1,
      sono: wd === 0 || wd === 6 ? 7.5 : (d % 3 === 0 ? 6 : 7),
      gut: postInj ? 'preso' : 'normal',
      energia: postInj ? 5 : 7,
      agua: wd === 0 ? 4 : (wd === 6 ? 5 : 7),
      prot: 70 + (13 - d) * 1.4 + (wd === 0 ? -15 : 0),
      exerc: [1, 3, 5, 8, 10, 12].includes(d) ? 30 : 0,
      refluxo: postInj ? 1 : 0, ansiedade: wd === 1 ? 2 : (d % 3 === 0 ? 1 : 0), constip: postInj ? 2 : 0,
    });
  }
  return {
    profile: {
      name: 'Mariana Silva', med, dose: 5, startWeight: 82.4, goalWeight: 68, height: HEIGHT,
      startT: +daysAgo(70), doctor: 'Dra. Helena Costa', clinic: 'Clínica Vitalis',
      nutri: 'Renata Alves', idade: 38, email: 'mariana.silva@email.com',
      /* Ficha da especialista. CRM e tempo de formação não são enfeite: são
         o que separa "alguém está te acompanhando" de "alguém habilitado
         está te acompanhando", e num app que não prescreve nada essa
         distinção é o produto inteiro. */
      doctorInfo: {
        crm: 'CRM 128456-SP',
        especialidade: 'Endocrinologista',
        anos: 12,
        pacientes: 2400,
        rating: 4.9,
        avaliacoes: 128,
        sobre: 'Especialista em tratamento clínico da obesidade, modulação hormonal e saúde metabólica. Meu objetivo é promover saúde com acolhimento, ciência e personalização em cada etapa do tratamento.',
        abordagens: ['Emagrecimento', 'Modulação hormonal', 'Metabolismo', 'Saúde intestinal'],
      },
      /* metas diárias — antes ficavam espalhadas como número fixo no
         código (proteína 90 g em derive, água na constante GOAL_WATER).
         A Home nova trata as três como alvo configurável. */
      targets: { prot: 90, waterMl: 2500, exercMin: 60, bodyFat: 28 },
    },
    weights, injections, checkins,
    photos: [{ t: +daysAgo(70), tag: 'início' }, { t: +daysAgo(35), tag: 'semana 5' }, { t: +daysAgo(4), tag: 'semana 10' }],
    goals: [
      { id: 'g1', ic: 'scale', label: 'Peso de referência · 68 kg', kind: 'peso', prog: 0 },
      { id: 'g2', ic: 'moon', label: 'Dormir 7h+ nas noites de semana', kind: 'sono', prog: 0 },
      { id: 'g3', ic: 'target', label: 'Vestir a calça jeans antiga', kind: 'manual', prog: 60 },
      { id: 'g4', ic: 'bolt', label: 'Ter mais energia à tarde', kind: 'energia', prog: 0 },
    ],
    protocol: {
      week: 10, tasks: [
        { t: 'Aplicação da semana', done: true, note: '' },
        { t: '2 L de água por dia', done: false, note: '5 de 7 dias' },
        { t: '90 g de proteína por dia', done: false, note: '4 de 7 dias' },
        { t: 'Caminhada 3× na semana', done: false, note: '2 de 3' },
        { t: 'Agendar exame de sangue', done: false, note: '' },
      ],
    },
    messages: [
      { t: +daysAgo(6), from: 'doc', text: 'Oi Mariana, vi que você passou pros 5 mg. Como está a náusea nos primeiros dias?' },
      { t: +daysAgo(6), from: 'me', text: 'Melhorou bastante, só no primeiro dia foi mais forte.' },
      { t: +daysAgo(2), from: 'doc', text: 'Ótimo sinal. Mantém a hidratação e a proteína que combinamos. Na consulta a gente revê a dose com calma.' },
    ],
    unread: 1,
    heroSeen: { milestone: 0, insight: null as string | null, replay: null as string | null },
    documents: [
      { t: +daysAgo(40), name: 'Hemograma completo', kind: 'Exame' },
      { t: +daysAgo(40), name: 'Perfil lipídico', kind: 'Exame' },
      { t: +daysAgo(14), name: 'Resumo da semana 8', kind: 'Gerado pela IA' },
    ],
    consult: { t: +addDays(startOfDay(now()), 9), type: 'Teleconsulta', doctor: 'Dra. Helena Costa' },
    consultsHistory: [
      { t: +daysAgo(32), type: 'Presencial', note: 'Ajuste de dose para 5 mg. Evolução dentro do esperado, boa tolerância.' },
      { t: +daysAgo(60), type: 'Presencial', note: 'Início do tratamento. Metas definidas, exames de base solicitados.' },
    ],
    measures: [
      { t: +daysAgo(70), cintura: 104, quadril: 118, braco: 36, coxa: 64, gordura: 42, musculo: 29.0 },
      { t: +daysAgo(35), cintura: 100, quadril: 115, braco: 34.5, coxa: 62, gordura: 39, musculo: 29.4 },
      { t: +daysAgo(14), cintura: 96, quadril: 112, braco: 33, coxa: 60, gordura: 37, musculo: 30.0 },
    ],
    vitals: {
      pa: [{ t: +daysAgo(40), sys: 138, dia: 88 }, { t: +daysAgo(18), sys: 132, dia: 85 }, { t: +daysAgo(3), sys: 127, dia: 82 }],
      fc: [{ t: +daysAgo(18), v: 78 }, { t: +daysAgo(3), v: 71 }],
      glic: [{ t: +daysAgo(40), v: 112 }, { t: +daysAgo(14), v: 103 }, { t: +daysAgo(3), v: 96 }],
      spo2: [{ t: +daysAgo(3), v: 98 }],
      fr: [{ t: +daysAgo(3), v: 16 }],
    },
    exams: [
      { marker: 'HbA1c', unit: '%', ref: '< 5,7', good: 'down', values: [{ t: +daysAgo(120), v: 6.3 }, { t: +daysAgo(40), v: 5.9 }, { t: +daysAgo(3), v: 5.6 }] },
      { marker: 'Glicemia jejum', unit: 'mg/dL', ref: '70–99', good: 'down', values: [{ t: +daysAgo(120), v: 118 }, { t: +daysAgo(40), v: 104 }, { t: +daysAgo(3), v: 96 }] },
      { marker: 'Insulina', unit: 'µUI/mL', ref: '2,6–24,9', good: 'down', values: [{ t: +daysAgo(120), v: 22 }, { t: +daysAgo(3), v: 12 }] },
      { marker: 'Colesterol total', unit: 'mg/dL', ref: '< 190', good: 'down', values: [{ t: +daysAgo(120), v: 214 }, { t: +daysAgo(3), v: 188 }] },
      { marker: 'HDL', unit: 'mg/dL', ref: '> 40', good: 'up', values: [{ t: +daysAgo(120), v: 44 }, { t: +daysAgo(3), v: 52 }] },
      { marker: 'LDL', unit: 'mg/dL', ref: '< 130', good: 'down', values: [{ t: +daysAgo(120), v: 142 }, { t: +daysAgo(3), v: 118 }] },
      { marker: 'Triglicerídeos', unit: 'mg/dL', ref: '< 150', good: 'down', values: [{ t: +daysAgo(120), v: 180 }, { t: +daysAgo(3), v: 132 }] },
      { marker: 'Creatinina', unit: 'mg/dL', ref: '0,6–1,1', good: '', values: [{ t: +daysAgo(3), v: 0.8 }] },
      { marker: 'TGO', unit: 'U/L', ref: '< 32', good: '', values: [{ t: +daysAgo(3), v: 26 }] },
      { marker: 'TGP', unit: 'U/L', ref: '< 33', good: '', values: [{ t: +daysAgo(3), v: 29 }] },
      { marker: 'TSH', unit: 'µUI/mL', ref: '0,4–4,0', good: '', values: [{ t: +daysAgo(3), v: 2.1 }] },
      { marker: 'T4 livre', unit: 'ng/dL', ref: '0,9–1,7', good: '', values: [{ t: +daysAgo(3), v: 1.2 }] },
      { marker: 'Vitamina D', unit: 'ng/mL', ref: '> 30', good: 'up', values: [{ t: +daysAgo(120), v: 24 }, { t: +daysAgo(3), v: 33 }] },
      { marker: 'Vitamina B12', unit: 'pg/mL', ref: '> 300', good: 'up', values: [{ t: +daysAgo(3), v: 410 }] },
      { marker: 'Ferritina', unit: 'ng/mL', ref: '15–150', good: '', values: [{ t: +daysAgo(3), v: 88 }] },
    ],
    examBundles: [
      { t: +daysAgo(3), name: 'Painel metabólico', n: 12, source: 'PDF', shared: true },
      { t: +daysAgo(120), name: 'Exames de base', n: 8, source: 'foto', shared: true },
    ],
    achievements: [
      { id: 'a1', ic: 'leaf', title: 'Primeiro passo', desc: 'Primeira aplicação registrada', t: +daysAgo(70), done: true },
      { id: 'a2', ic: 'trend', title: 'Primeiros 5%', desc: '5% do peso inicial perdidos', t: +daysAgo(30), done: true },
      { id: 'a3', ic: 'check', title: 'Semana completa', desc: '7 check-ins na semana', t: +daysAgo(14), done: true },
      { id: 'a4', ic: 'water', title: 'Hidratação em dia', desc: '8 copos em 5 dias da semana', t: +daysAgo(20), done: true },
      { id: 'a5', ic: 'leaf', title: 'Dez semanas', desc: 'Dez semanas de tratamento constante', t: +daysAgo(4), done: true },
      { id: 'a6', ic: 'dose', title: 'Dose de manutenção', desc: 'Concluir a titulação', t: 0, done: false },
      { id: 'a7', ic: 'scale', title: '−10 kg', desc: 'Marca de 10 kg a menos', t: 0, done: false },
      { id: 'a8', ic: 'flame', title: 'Proteína em foco', desc: '90 g/dia por 2 semanas', t: 0, done: false },
    ],
    prescriptions: [
      { t: +daysAgo(70), name: 'Mounjaro (tirzepatida)', detail: 'Titulação 2,5 → 5 mg · 1×/semana, subcutânea', by: 'Dra. Helena Costa' },
      { t: +daysAgo(70), name: 'Suplemento de proteína', detail: 'Conforme necessidade, para atingir a meta diária', by: 'Renata Alves (Nutrição)' },
    ],
    meals: [
      { t: +daysAgo(0.4), name: 'Almoço', prot: 'alta', qual: 'ótima', tag: 'Frango grelhado, arroz integral e salada' },
      { t: +daysAgo(1), name: 'Café da manhã', prot: 'média', qual: 'boa', tag: 'Ovos mexidos e fruta' },
      { t: +daysAgo(1.4), name: 'Jantar', prot: 'alta', qual: 'ótima', tag: 'Salmão e legumes no vapor' },
    ],
    favMeals: ['Iogurte natural + granola', 'Frango grelhado + salada', 'Omelete de claras'],
    notifications: [
      { t: +daysAgo(0.2), ic: 'syringe', kind: 'trat', title: 'Aplicação em 3 dias', body: 'Mounjaro 5 mg · quinta. Local sugerido: abdômen (esq.).' },
      { t: +daysAgo(0.5), ic: 'spark', kind: 'ia', title: 'Novo insight', body: 'Sua fome tende a subir nos próximos dias, perto da dose.' },
      { t: +daysAgo(1), ic: 'steth', kind: 'clin', title: 'Dra. Helena respondeu', body: 'Mantém a hidratação e a proteína que combinamos.' },
      { t: +daysAgo(1.5), ic: 'pill', kind: 'trat', title: 'Estoque acabando', body: 'Restam 3 doses na caneta. Vale renovar a receita.' },
      { t: +daysAgo(2), ic: 'doc', kind: 'exame', title: 'Exames importados', body: 'Painel metabólico lido e organizado por data.' },
      { t: +daysAgo(4), ic: 'spark', kind: 'ia', title: 'Dez semanas de tratamento', body: 'Seu corpo vem respondendo de forma constante. Um sinal entre vários, no seu ritmo.' },
    ],
    integrations: { appleHealth: true, healthConnect: false, googleFit: false, garmin: false, fitbit: false, withings: true, scale: true, watch: false },
    history: { conditions: ['Pré-diabetes', 'Hipertensão leve'], allergies: ['Nenhuma conhecida'], meds: ['Losartana 50 mg'] },
    customSyms: ['Refluxo'],
    reminders: {
      dose: { on: true, lead: 1, hour: 9, min: 0 },
      peso: { on: false, freq: 'semanal', dow: 1, hour: 8, min: 0 },
      agua: { on: false, hour: 15, min: 0 },
      proteina: { on: false, hour: 12, min: 0 },
    },
    /* Estoque da caneta — antes era a string fixa 'Restam 3 doses' cravada
       em derive.ts. Uma caneta de Mounjaro rende 4 doses semanais. */
    pen: { dosesLeft: 3, dosesPerPen: 4 },
    /* A equipe além da médica. Cada pessoa tem um papel distinto no
       tratamento — não é lista de contatos, é quem faz o quê. */
    team: [
      { name: 'Renata Alves', role: 'Nutricionista', sobre: 'Ajusta o plano alimentar conforme a fase do ciclo.' },
      { name: 'Carla Mendes', role: 'Enfermeira', sobre: 'Orienta aplicação, locais e conservação da caneta.' },
      { name: 'Rafael Lima', role: 'Psicólogo', sobre: 'Acompanha a relação com a comida e com o corpo.' },
    ],

    /* Material que a clínica mandou para você — diferente de `documents`,
       que é o que saiu de você para a clínica. A direção importa: um é
       orientação recebida, o outro é prova enviada. */
    /* `motivo` é o que separa curadoria de biblioteca: cada material diz
       por que ELE foi escolhido para esta pessoa neste momento. */
    materials: [
      { t: +daysAgo(32), name: 'O que fazer se enjoar', kind: 'Guia rápido', meta: '2 min', ic: 'bulb', motivo: 'Para a fase de titulação' },
      { t: +daysAgo(70), name: 'Como aplicar sem dor', kind: 'Vídeo', meta: '4 min', ic: 'play', motivo: 'Enviado pela enfermeira' },
      { t: +daysAgo(70), name: 'Protocolo alimentar', kind: 'Protocolo', meta: '2,4 MB', ic: 'doc', motivo: 'Montado pela nutricionista' },
      { t: +daysAgo(60), name: 'Checklist da semana', kind: 'Checklist', meta: '8 itens', ic: 'check', motivo: 'Atualizado toda segunda' },
    ],

    /* Perguntas feitas ao Companion. Guarda só o texto e a hora — a
       resposta é sempre recalculada sobre o estado atual, então
       persistir a thread inteira envelheceria o dado. */
    asked: [] as { t: number; q: string }[],
    consultNotes: '',
    onboardDone: true,
    theme: 'light' as 'light' | 'dark',
    lastReplaySeen: 0,
  };
}

export type State = ReturnType<typeof buildSeed>;

/* migra estados salvos antes das novas áreas (mutação in-place). */
export function ensureDefaults(S: any) {
  if (!S.reminders) S.reminders = {};
  const R = S.reminders;
  R.dose = Object.assign({ on: true, lead: 1, hour: 9, min: 0 }, R.dose || {});
  R.peso = Object.assign({ on: false, freq: 'semanal', dow: 1, hour: 8, min: 0 }, R.peso || {});
  R.agua = Object.assign({ on: false, hour: 15, min: 0 }, R.agua || {});
  R.proteina = Object.assign({ on: false, hour: 12, min: 0 }, R.proteina || {});
  if (!Array.isArray(S.asked)) S.asked = [];
  if (!Array.isArray(S.team)) S.team = buildSeed().team;
  if (!Array.isArray(S.materials)) S.materials = buildSeed().materials;
  if (S.profile && !S.profile.doctorInfo) S.profile.doctorInfo = buildSeed().profile.doctorInfo;
  if (typeof S.consultNotes !== 'string') S.consultNotes = '';
  if (typeof S.onboardDone !== 'boolean') S.onboardDone = true;
  if (!S.heroSeen) S.heroSeen = { milestone: 0, insight: null, replay: null };
  if (!S.theme) S.theme = 'light';
  /* bodyFat sai daqui quando a meta virar campo do perfil — o valor certo
     depende da pessoa, e um padrão fixo não serve para todo mundo. */
  if (S.profile) S.profile.targets = Object.assign({ prot: 90, waterMl: 2500, exercMin: 60, bodyFat: 28 }, S.profile.targets || {});
  if (!S.pen) S.pen = { dosesLeft: 3, dosesPerPen: 4 };
  return S;
}
