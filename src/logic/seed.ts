/* SEED — paciente coerente (Mariana, ~semana 10 de tratamento). Porta verbatim do protótipo. */
import { daysAgo, addDays, startOfDay, now } from './time';
import { nomeItem, somaDe, type ItemComida } from './prato';

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
  /* Check-ins dos últimos 13 dias — hoje fica pendente de propósito,
     para a home abrir com o convite de responder.

     Mas HOJE tem um registro mesmo assim, só com os acumuladores: o
     almoço da semente é de hoje, e refeição registrada move a proteína
     do dia. Sem esta linha a tela de refeição abria dizendo "0 de 90 g"
     com uma pastilha de 30 g do lado — duas versões do mesmo dia na
     mesma tela. Um registro só com agua/prot/exerc não conta como
     check-in respondido (ver respostaNoDia), então o convite continua
     de pé. */
  /* O CARDÁPIO — as refeições de cada dia, e a proteína que vem delas.

     A semente tinha TRÊS refeições ao todo, todas nos dois últimos dias.
     Com isso o caderno de alimentação abria com um dia cheio e vinte e
     nove vazios, e a proteína do dia era um número solto no check-in que
     não batia com refeição nenhuma — duas versões do mesmo dia.

     Aqui a ordem se inverte: o dia tem refeições, e `prot` é a SOMA
     delas. Uma fonte por campo, inclusive na semente. */
  const CARDAPIO: { name: string; itens: ItemComida[]; h: number }[] = [
    { name: 'Café da manhã', h: 8, itens: [{ id: 'ovo-frito', qtd: 2 }, { id: 'pao-integral', qtd: 2 }] },
    { name: 'Café da manhã', h: 8, itens: [{ id: 'iogurte', qtd: 1 }, { id: 'whey', qtd: 1 }] },
    { name: 'Almoço', h: 12.5, itens: [{ id: 'peito-frango', qtd: 1 }, { id: 'arroz-integral', qtd: 4 }, { id: 'salada-folhas', qtd: 1 }] },
    { name: 'Almoço', h: 12.5, itens: [{ id: 'patinho', qtd: 1 }, { id: 'arroz', qtd: 4 }, { id: 'legumes', qtd: 1 }] },
    { name: 'Jantar', h: 19.5, itens: [{ id: 'salmao', qtd: 1 }, { id: 'brocolis', qtd: 1 }] },
    { name: 'Jantar', h: 19.5, itens: [{ id: 'omelete', qtd: 1 }, { id: 'queijo-minas', qtd: 1 }] },
    { name: 'Lanche', h: 16, itens: [{ id: 'queijo-minas', qtd: 1 }] },
  ];

  /* Hoje entra pela metade de propósito: um dia em andamento é o estado
     em que a tela é aberta, e é o único que mostra o "faltam X g". */
  const refeicoesDe = (d: number) => {
    if (d === 0) return [CARDAPIO[0], CARDAPIO[2]];
    const r = [CARDAPIO[d % 2]];
    if (d % 7 !== 3) r.push(CARDAPIO[2 + (d % 2)]);
    if (d % 5 !== 1) r.push(CARDAPIO[4 + (d % 2)]);
    if (d % 4 === 0) r.push(CARDAPIO[6]);
    return r;
  };
  /* Os gramas saem dos ITENS, pela mesma tabela que a tela usa. Um número
     fixo ao lado da lista seria um segundo lugar dizendo quanta proteína
     o prato tem, e ele divergiria no dia em que a TACO fosse corrigida. */
  const protDoDia = (d: number) => refeicoesDe(d).reduce((x, m) => x + somaDe(m.itens), 0);

  /* Da mais recente para a mais antiga, que é a ordem em que a lista lê
     e a mesma em que o registro novo entra (unshift). */
  const meals: any[] = [];
  for (let d = 0; d <= 55; d++) {
    const base = +startOfDay(daysAgo(d));
    refeicoesDe(d)
      .slice()
      .reverse()
      .forEach((m, k) => {
        meals.push({
          t: base + Math.round(m.h * 3600000),
          name: m.name,
          tag: m.itens.map(nomeItem).filter(Boolean).join(', '),
          g: somaDe(m.itens),
          /* Com os itens guardados, corrigir a refeição abre o prato do
             jeito que ele foi montado em vez de uma folha em branco. */
          itens: m.itens,
          /* Uma em cada quatro veio da câmera: sem a mistura, a linha de
             origem só existiria numa das duas formas. */
          fonte: (d + k) % 4 === 0 ? 'foto' : 'manual',
        });
      });
  }

  /* A ÁGUA, GOLE A GOLE.

     A semente escrevia só o total do dia — "7 copos" — e era exatamente o
     formato antigo que golesDoDia existe para tolerar: o caderno de água
     abriria com uma linha sem hora em todos os treze dias, contando a
     história de um app que ainda não guardava goles. Semente não é dado
     legado; ela é o app funcionando.

     QUATRO DIAS POSSÍVEIS, do mais seco ao que bate a meta. O dia de
     semana bebe melhor que o fim de semana — sem a garrafa da mesa de
     trabalho, bebe-se menos e mais tarde. */
  const AGUA: Record<string, [number, number][]> = {
    seco: [[9.7, 250], [13.2, 500], [19, 250]],                                              // 1 L
    meio: [[10.3, 250], [13.5, 500], [17, 250], [21, 250]],                                  // 1,25 L
    bom: [[7.3, 250], [9.8, 250], [12.5, 500], [15.7, 250], [18.3, 250], [21.2, 250]],       // 1,75 L
    otimo: [[7.2, 250], [9.5, 250], [11.8, 500], [14.3, 250], [16.5, 500], [18.6, 250], [21, 500]], // 2,5 L
  };
  const ESCALA = ['seco', 'meio', 'bom', 'otimo'];
  /* COMO CADA SEMANA FOI, da atual para trás. Não é uma linha reta: tem
     semana boa, semana de viagem e semana em que ninguém lembrou de
     encher a garrafa — que é como hidratação funciona de verdade, e é o
     que dá o que mostrar no histórico do protocolo. Uma semente que
     repetisse o mesmo dia cinquenta vezes faria a tela de semanas
     anteriores parecer quebrada. */
  const NIVEL_DA_SEMANA = ['bom', 'bom', 'otimo', 'meio', 'bom', 'otimo', 'seco', 'meio', 'bom'];
  const golesDe = (d: number) => {
    const wd = daysAgo(d).getDay();
    const base = NIVEL_DA_SEMANA[Math.min(Math.floor(d / 7), NIVEL_DA_SEMANA.length - 1)];
    const i = Math.max(0, ESCALA.indexOf(base) - (wd === 0 || wd === 6 ? 1 : 0));
    return AGUA[ESCALA[i]];
  };
  /* Hoje entra pela metade: dois copos da manhã, e o resto do dia por
     acontecer. Zerado, o caderno de água abriria vazio no único dia em
     que a pessoa vai olhar primeiro. */
  const GOLES_HOJE: [number, number][] = [[7.5, 250], [10.2, 250]];
  /* A lista é que manda, e o total sai dela. Escrever os dois à mão faria
     a barra do dia discordar do caderno na primeira vez que alguém
     mexesse num horário. Um copo são 250 ml — o mesmo CUP_ML que derive
     usa para traduzir copos em litros. */
  const emGoles = (base: number, gs: [number, number][]) =>
    gs.map(([h, ml]) => ({ t: base + Math.round(h * 3600000), ml }));
  const coposDe = (gs: [number, number][]) => gs.reduce((x, [, ml]) => x + ml, 0) / 250;

  const checkins: any[] = [
    {
      t: +startOfDay(daysAgo(0)),
      agua: coposDe(GOLES_HOJE), aguas: emGoles(+startOfDay(daysAgo(0)), GOLES_HOJE),
      prot: protDoDia(0), exerc: 0,
    },
  ];

  /* AS SESSÕES DE EXERCÍCIO — por dias atrás.

     Antes o exercício da semente era `30 min` em seis dias fixos, sem
     modalidade e sem origem, e só nas duas últimas semanas. Isso deixava
     duas telas mentindo sobre si mesmas: o caderno de treino abria
     sempre vazio, e a curva de oito semanas era seis semanas em zero
     seguidas de dois degraus iguais — uma rampa, não um histórico. Quem
     treina de verdade tem semana boa, semana fraca e semana de viagem, e
     é essa variação que a curva existe para mostrar.

     A origem também é da semente: sem uma mistura de registro manual e
     integração, a linha "de onde veio" nunca aparece nas duas formas. */
  const SESSOES: Record<number, { tipo: string; min: number; fonte?: string }[]> = {
    55: [{ tipo: 'Musculação', min: 45 }],
    53: [{ tipo: 'Corrida', min: 30, fonte: 'Apple Saúde' }],
    50: [{ tipo: 'Musculação', min: 45 }],
    47: [{ tipo: 'Caminhada', min: 35, fonte: 'Apple Saúde' }],
    44: [{ tipo: 'Musculação', min: 30 }],
    41: [{ tipo: 'Musculação', min: 50 }],
    39: [{ tipo: 'Bicicleta', min: 40, fonte: 'Apple Saúde' }],
    37: [{ tipo: 'Musculação', min: 40 }],
    35: [{ tipo: 'Caminhada', min: 20, fonte: 'Apple Saúde' }],
    33: [{ tipo: 'Corrida', min: 35, fonte: 'Apple Saúde' }],
    30: [{ tipo: 'Musculação', min: 60 }],
    27: [{ tipo: 'Musculação', min: 55 }],
    25: [{ tipo: 'Natação', min: 45 }],
    23: [{ tipo: 'Corrida', min: 35, fonte: 'Apple Saúde' }],
    21: [{ tipo: 'Musculação', min: 40 }],
    19: [{ tipo: 'Musculação', min: 50 }],
    17: [{ tipo: 'Caminhada', min: 25, fonte: 'Apple Saúde' }],
    15: [{ tipo: 'Pilates', min: 35 }],
    12: [{ tipo: 'Musculação', min: 40 }],
    10: [{ tipo: 'Caminhada', min: 30, fonte: 'Apple Saúde' }],
    8: [{ tipo: 'Corrida', min: 35, fonte: 'Apple Saúde' }],
    5: [{ tipo: 'Musculação', min: 80 }],
    3: [{ tipo: 'Pilates', min: 40 }],
    1: [{ tipo: 'Corrida', min: 30, fonte: 'Apple Saúde' }],
  };
  const minDoDia = (d: number) => (SESSOES[d] || []).reduce((x, tr) => x + tr.min, 0);

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
      agua: coposDe(golesDe(d)),
      aguas: emGoles(+startOfDay(date), golesDe(d)),
      prot: protDoDia(d),
      exerc: minDoDia(d),
      treinos: SESSOES[d],
      refluxo: postInj ? 1 : 0, ansiedade: wd === 1 ? 2 : (d % 3 === 0 ? 1 : 0), constip: postInj ? 2 : 0,
    });
  }
  /* As semanas anteriores entram só com ACUMULADORES — nem humor, nem
     sono, nem fome. Um registro que tem apenas acumuladores não conta
     como check-in respondido, então a sequência e a contagem do mês
     continuam falando das duas semanas que a pessoa de fato preencheu.
     Inventar dois meses de check-in completo para encher um gráfico seria
     pagar a curva com um histórico falso em cinco outras telas.

     E a água entra junto, que antes não entrava. Ela é acumulador como
     proteína e exercício, e ficava de fora sem motivo: quarenta e dois
     dias com prato e treino registrados e nenhuma gota d'água é retrato
     de ninguém. Era também o que deixava o caderno de água vazio antes de
     duas semanas atrás, e o histórico do protocolo sem o que contar. */
  for (let d = 55; d >= 14; d--) {
    const base = +startOfDay(daysAgo(d));
    checkins.push({
      t: base,
      agua: coposDe(golesDe(d)),
      aguas: emGoles(base, golesDe(d)),
      prot: protDoDia(d),
      exerc: minDoDia(d),
      treinos: SESSOES[d],
    });
  }

  /* EM ORDEM, DO MAIS ANTIGO PARA HOJE — e isto conserta oito lugares
     de uma vez.

     O array nascia embaralhado: hoje primeiro, depois as duas últimas
     semanas, depois os quarenta dias anteriores. E meia dúzia de funções
     escreve `checkins.slice(-14)` querendo dizer "os catorze dias mais
     recentes" — o radar, as metas, o resumo médico, o ritmo, os
     sintomas, a série de equilíbrio. Todas pegavam o rabo do array, que
     era o bloco MAIS ANTIGO.

     O efeito era visível e mudo: a tela de metas dizia "sem noites
     registradas ainda" com treze noites registradas, porque as catorze
     linhas do fim são justamente as que só têm acumulador.

     Dava para corrigir as oito chamadas. Ordenar aqui é melhor: o array
     passa a ser o que todo mundo já achava que ele era, e um registro
     novo — que é sempre de hoje — continua entrando no fim, no lugar
     certo. */
  checkins.sort((a, b) => a.t - b.t);

  return {
    profile: {
      name: 'Mariana Silva', med, dose: 5, startWeight: 82.4, goalWeight: 68, height: HEIGHT,
      startT: +daysAgo(70), doctor: 'Dra. Helena Costa', clinic: 'Clínica Vitalis',
      /* Horizonte do plano que a equipe traçou até a dose de manutenção.
         Não é alta: é até onde a titulação foi programada, e é o número
         que dá sentido a "você está na semana 11". */
      planoSemanas: 16,
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
         Hoje as três saem daqui, e derive lê o perfil.
         A Home nova trata as três como alvo configurável. */
      targets: { prot: 90, waterMl: 2500, exercMin: 60, bodyFat: 28 },
    },
    weights, injections, checkins,
    photos: [{ t: +daysAgo(70), tag: 'início' }, { t: +daysAgo(35), tag: 'semana 5' }, { t: +daysAgo(4), tag: 'semana 10' }],
    /* ONDE QUERO CHEGAR — as metas de vida, e só elas.

       O PESO SAIU DAQUI. Ele era a primeira da lista, numa tela que se
       chamava "metas além do peso" — e continua no app, no lugar certo:
       é o número grande da capa e uma linha dos alvos, onde dá para
       mudar. Na lista ele aparecia uma terceira vez.

       E A PESSOAL PERDEU O "prog: 60". Não existe sessenta por cento de
       caber numa calça: era precisão inventada, parada para sempre num
       número que ninguém tinha como mexer. Ela é o que sempre foi —
       ainda não, ou conseguiu em tal dia. */
    goals: [
      { id: 'g2', ic: 'moon', label: 'Dormir 7h+ nas noites de semana', kind: 'sono' },
      { id: 'g4', ic: 'bolt', label: 'Dias com energia de 7 para cima', kind: 'energia' },
      { id: 'g3', ic: 'target', label: 'Vestir a calça jeans antiga', kind: 'pessoal', feita: false, em: null },
    ],
    /* O PROTOCOLO DA SEMANA — cinco itens, duas naturezas.

       Os MEDIDOS trazem só a métrica e o alvo: o texto sai da meta do
       perfil e a contagem sai dos registros. Antes eles vinham com o
       número escrito à mão aqui — "5 de 7 dias" — ao lado de um caderno
       de água que sabia a resposta, e com a meta de 2 L enquanto o perfil
       pedia 2,5 L. Semente não é lugar de guardar conta feita.

       Os MANUAIS trazem o texto, porque não há registro de onde tirar a
       resposta: o app não sabe se a dose foi aplicada nem se o exame foi
       agendado. */
    protocol: {
      week: 10, tasks: [
        { t: 'Aplicação da semana', done: true },
        { metrica: 'agua', alvo: 7 },
        { metrica: 'prot', alvo: 7 },
        { metrica: 'exerc', alvo: 3 },
        { t: 'Agendar exame de sangue', done: false },
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
    meals,
    /* Favoritos são PRATOS, com os itens e as quantidades. O nome sai
       deles na hora de mostrar, então não há um segundo lugar guardando
       como o prato se chama. */
    favMeals: [
      { itens: [{ id: 'peito-frango', qtd: 1 }, { id: 'arroz-integral', qtd: 4 }, { id: 'salada-folhas', qtd: 1 }] },
      { itens: [{ id: 'patinho', qtd: 1 }, { id: 'arroz', qtd: 4 }] },
      { itens: [{ id: 'ovo-frito', qtd: 2 }, { id: 'iogurte', qtd: 1 }] },
    ],
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

    /* Perguntas feitas ao Morphi. Guarda só o texto e a hora — a
       resposta é sempre recalculada sobre o estado atual, então
       persistir a thread inteira envelheceria o dado. */
    asked: [] as { t: number; q: string }[],
    consultNotes: '',

    /* Notas para a consulta. Cada uma guarda QUANDO foi anotada e se já
       foi conversada: sem a data, a nota chega na consulta sem o contexto
       que a explica ('isso foi antes ou depois de subir a dose?'). */
    notes: [
      { t: +daysAgo(2), text: 'A constipação piorou desde que subi para 5 mg', done: false },
      { t: +daysAgo(7), text: 'Perguntar se posso aplicar de manhã em vez de à noite', done: false },
      { t: +daysAgo(16), text: 'Tontura em dois dias seguidos na semana 9', done: false },
      { t: +daysAgo(23), text: 'Confirmar se mantenho 5 mg ou subo', done: false },
      { t: +daysAgo(38), text: 'Falar sobre os enjoos das primeiras semanas', done: true },
      { t: +daysAgo(45), text: 'Pedir os exames de acompanhamento', done: true },
    ],
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
  /* Migração do texto corrido para a lista: cada linha do campo antigo
     vira uma nota, datada de hoje porque a data original nunca existiu.
     Depois disso a lista é a fonte, e consultNotes deixa de ser lido. */
  if (!Array.isArray(S.notes)) {
    const linhas = String(S.consultNotes || '')
      .split('\n')
      .map((l) => l.replace(/^[•\-\s]+/, '').trim())
      .filter(Boolean);
    S.notes = linhas.length
      ? linhas.map((text) => ({ t: +startOfDay(now()), text, done: false }))
      : buildSeed().notes;
  }
  if (typeof S.onboardDone !== 'boolean') S.onboardDone = true;
  if (!S.heroSeen) S.heroSeen = { milestone: 0, insight: null, replay: null };
  if (!S.theme) S.theme = 'light';
  /* bodyFat sai daqui quando a meta virar campo do perfil — o valor certo
     depende da pessoa, e um padrão fixo não serve para todo mundo. */
  if (S.profile) S.profile.targets = Object.assign({ prot: 90, waterMl: 2500, exercMin: 60, bodyFat: 28 }, S.profile.targets || {});
  if (!S.pen) S.pen = { dosesLeft: 3, dosesPerPen: 4 };
  /* Favorito virou prato. Os que existirem como string continuam
     valendo — viram { nome } e seguem abrindo o registro com o nome na
     busca, que é o que sempre fizeram. */
  if (Array.isArray((S as any).favMeals)) {
    (S as any).favMeals = ((S as any).favMeals as any[])
      .map((f) => (typeof f === 'string' ? { nome: f } : f));
  }
  if (S.profile && !S.profile.planoSemanas) S.profile.planoSemanas = 16;
  return S;
}
