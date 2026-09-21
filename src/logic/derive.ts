/* Seletores / cálculos determinísticos — porta verbatim (S passa como parâmetro). */
import {
  DAY, startOfDay, now, daysAgo, addDays, diffDays, fmtDate, hm, DOW_PT, nf, kg, relDay,
  doseTxt, MO_LONG, semanaDoTratamento, quandoEm, dataLonga, kgTxt,
} from './time';
import { MEDS, CADENCE_DAYS, SHELF_DAYS } from './meds';
import { numeroEnxuto } from './local';
import { FORMAS, formaDe, oA, noNa } from './formas';
import { T, type SobreOMarcador, type JeitoDeAjudar } from '../textos';
import { conquistas, eventosDeConquista, feitas } from './conquistas';
import { ehForca, iconeDe } from './modalidades';
import {
  MOMENTOS, aguaDe, alimentoDe, momentoDaHora, nomeItem, nutrientesDe, somaDe, type ItemComida,
} from './prato';
import { BEBIDA_PADRAO, bebidaDe, type Bebida } from './bebidas';
import { faixaDe } from './escalas';
import { ENERGIA, FOME, HUMOR, SINTOMA, SINTOMAS_LIDOS, SONO, grauDoSintoma, paraTela } from './escalas';
import type { State } from './seed';
import { pesoTxt, pesoProsaTxt, compTxt, pesoU, pesoV, aguaTxt, aguaU, aguaN, pesoProsa, compU, compV } from './medidas';

/* A META DE ÁGUA SAI DO PERFIL, como a de proteína e a de exercício.

   Era a constante 8 aqui — oito copos, 2 L — enquanto o perfil pedia
   2,5 L e todas as telas de registro liam o perfil. Duas metas para a
   mesma água: a barra do dia dizia "faltam 2 L", o radar dava a mesma
   pessoa como 100% hidratada, e a conversa com o acompanhante contava os
   copos até oito. Nenhuma das três estava errada sozinha.

   Em COPOS porque é em copos que o check-in guarda a água, e é contra
   copos que estas contas comparam. Quem traduz para litro é a frase. */
export const metaDeCopos = (S: State) => (S.profile as any).targets.waterMl / CUP_ML;

/* QUANTO É UMA NOITE INTEIRA — a resposta num lugar só.

   O radar dividia por 8 e o indicador de sono trazia `padrao: 7`: as duas
   únicas contas do aplicativo que respondem isso, discordando em uma
   hora. Quem dormisse 7h por noite cumpria a meta no check-in e aparecia
   no radar com 88% de sono, na mesma tela, no mesmo dia.

   É convenção, não alvo do perfil: ao contrário de proteína, água e
   movimento, o cadastro não calcula sono nenhum a partir do corpo da
   pessoa. Por isso mora aqui e não em `targets` — mas mora UMA vez. */
export const SONO_REF_H = 7;

/* ============================================================
   AS DUAS METAS DE PESO, E POR QUE NENHUMA MANDA NA OUTRA

   `profile.goalWeight` é o destino que a PESSOA escolheu no cadastro. Ele
   mede a Jornada, e é a viagem dela: repontá-lo em silêncio mudaria o que
   todas as telas dizem sobre o progresso dela sem que ela tivesse pedido.

   `protocol.metaPeso` é o que a EQUIPE definiu — ou melhor, o que a
   pessoa anotou do que a equipe disse, porque não existe servidor e nada
   do lado da clínica transmite para cá. Por isso ele carrega a data e o
   nome de quem disse: um número sem procedência afirmando ter vindo de
   uma médica é pior do que número nenhum.

   ⚠️ AS DUAS PODEM DISCORDAR, E DISCORDAR É INFORMAÇÃO. Quem quer chegar
   a 68 e tem equipe mirando 72 não está errada, e a equipe também não —
   é uma conversa para a consulta. O aplicativo mostra as duas e não
   arbitra. O ÚNICO lugar que prefere a clínica é a etapa de MANUTENÇÃO,
   porque manutenção é um estado clínico: estar na faixa que a equipe
   definiu é um fato sobre o tratamento, e estar na que ela sonhou é um
   fato sobre o desejo dela.
   ============================================================ */

export type MetaDaEquipe = { valor: number; em: number; por: string };

/** O que a equipe definiu para este alvo, como a pessoa anotou. */
export const metaClinica = (S: State, chave: ChaveDeAlvo = 'peso') =>
  (((S.protocol as any)?.metas?.[chave]) ?? null) as MetaDaEquipe | null;

/** Todos os alvos que têm número da equipe, na ordem dos ALVOS. */
export const metasDaEquipe = (S: State) =>
  (Object.keys(ALVOS) as ChaveDeAlvo[])
    .map((k) => ({ chave: k, meta: metaClinica(S, k) }))
    .filter((x): x is { chave: ChaveDeAlvo; meta: MetaDaEquipe } => !!x.meta);

/* ⚠️⚠️ O PESO SEGUE UMA REGRA E OS OUTROS TRÊS SEGUEM OUTRA, e a diferença
   não é inconsistência — é a natureza dos números.

   A META DE PESO É UM DESTINO, e é dela. Duas podem conviver: a que ela
   quer alcançar e a que a equipe mira. Nenhuma tela conta nada contra
   elas todo dia; a Jornada mede a viagem, e a viagem é dela.

   OS TRÊS NÚMEROS DO DIA SÃO PARÂMETROS OPERACIONAIS. O anel da
   hidratação enche contra um número. O protocolo da semana conta dias
   contra um número. A barra da alimentação cobra um número. Ter dois
   seria a mesma pergunta com duas respostas — exatamente o defeito que
   este projeto passou a semana desfazendo, e no lugar mais caro possível:
   a pessoa veria "faltam 20 g" numa tela e "meta cumprida" na outra.

   Por isso, para os três, anotar o número da equipe ESCREVE em
   `profile.targets`. Continua existindo um número só, e o que a tag conta
   é DE QUEM ELE É. E ela pode mudá-lo depois: é o corpo dela e o
   aplicativo dela. O que o aplicativo não faz é esconder que mudou. */

/** De quem é o número que o aplicativo usa hoje para este alvo. */
export function procedenciaDoAlvo(S: State, chave: ChaveDeAlvo) {
  const meta = metaClinica(S, chave);
  const editadoEm = alvoEditadoEm(S, chave);
  if (!meta) {
    return {
      daEquipe: false, alterada: false, convivem: false, travado: false,
      editadoEm, meta: null as MetaDaEquipe | null,
    };
  }
  /* ⚠️ O PESO NÃO É "DA EQUIPE", ELE CONVIVE — e a primeira versão disto
     mentia na tela. Ela devolvia `daEquipe: true` sempre que houvesse
     anotação, e a linha de "Os números do dia" mostra o número DELA: a
     tela ficou com a tag "Da sua equipe · Dra. Helena Costa" ao lado dos
     68 kg que a Mariana escolheu no cadastro, enquanto a médica tinha
     dito 72.

     Aqui não há origem para atribuir: são dois números respondendo a duas
     perguntas. A tela mostra o dela e conta que existe o outro. */
  if (chave === 'peso') {
    return { daEquipe: false, alterada: false, convivem: true, travado: false, editadoEm, meta };
  }
  const emUso = ALVOS()[chave].le(S);
  /* ⚠️⚠️ NÚMERO DA EQUIPE NÃO SE ARRASTA. A régua some da folha de Os
     números do dia quando existe anotação da equipe para aquele alvo.

     A primeira versão deste arquivo deixava editar e só avisava, com o
     argumento de que é o corpo dela. O argumento contrário venceu, e é o
     do produto: isto é parte de um tratamento, e quem define a dose de
     proteína de quem usa GLP-1 é a profissional que acompanha — não uma
     régua num domingo à noite.

     ⚠️ MAS A SAÍDA EXISTE, E É EXPLÍCITA. Ela pode remover a anotação da
     equipe, na Área médica, e aí o número volta a ser editável. Isso
     importa: quem tem restrição renal, quem se lesionou, quem trocou de
     nutricionista e ficou com um número velho — nenhuma dessas pessoas
     pode ficar presa a um número que não serve mais. A diferença entre
     travar e travar com saída é que a saída é um ato consciente, com
     outro significado ("isto não é mais o que a minha equipe disse"), em
     vez de um arrasto silencioso. */
  return {
    daEquipe: emUso === meta.valor,
    alterada: emUso !== meta.valor,
    convivem: false,
    travado: true,
    editadoEm,
    meta,
  };
}

/** O peso de referência para leitura CLÍNICA — a da equipe quando existe,
    a dela quando não. Nunca usado para medir a Jornada: ver o comentário
    acima. */
export const pesoDeReferencia = (S: State) => {
  const mc = metaClinica(S, 'peso');
  return mc
    ? { kg: mc.valor, daEquipe: true, por: mc.por, em: mc.em }
    : { kg: (S.profile as any).goalWeight as number, daEquipe: false, por: '', em: 0 };
};

/** As duas discordam o bastante para valer uma pergunta na consulta? */
export const metasDiscordam = (S: State) => {
  const mc = metaClinica(S, 'peso');
  if (!mc) return false;
  /* Um quilo é ruído de balança; o que merece conversa é a diferença que
     muda o plano. Dois quilos é o menor degrau que não se explica por
     água — e é um limiar escolhido, como os do platô: PENDENCIAS 13. */
  return Math.abs(mc.valor - ((S.profile as any).goalWeight as number)) >= 2;
};

export const M = (S: State) => MEDS[S.profile.med];

/* ============================================================
   QUANDO AINDA NÃO HÁ DOSE

   O cadastro deixa responder "ainda não sei" no medicamento, e quem
   responde isso não vê as telas de dose — sai do formulário sem número
   nenhum. O perfil guardava `null` ali, e meia dúzia de telas faziam
   `nf(profile.dose)` direto: a Home quebrava inteira na primeira
   renderização, em branco, sem mensagem.

   O PERFIL PASSA A GUARDAR ZERO, que é um número e não quebra conta
   nenhuma. E zero aqui quer dizer "ainda não definida", não "zero
   miligramas" — por isso quem escreve dose na tela usa `doseDoPerfil`, e
   quem anuncia a próxima aplicação pergunta antes se existe uma.

   É a mesma regra do resto da casa: zero é honesto quando é zero, e aqui
   não é zero — é ausência, e ausência se diz com palavra. */
export const temDose = (S: State) =>
  S.profile.med !== 'indefinido' && !!(S.profile as any).dose;

/* O MEDICAMENTO COM A DOSE, numa frase só — e sem a dose quando ela não
   existe. "Ainda não definido ainda não definida" é o que sai de juntar
   dois campos que não foram respondidos: cada um diz a sua ausência, e as
   duas viram gagueira. Uma vez basta. */
export const medComDose = (S: State) =>
  (temDose(S) ? `${M(S).label} ${doseDoPerfil(S)}` : M(S).label);

/** A dose do perfil escrita para gente, ou a ausência dela. */
export function doseDoPerfil(S: State): string {
  if (!temDose(S)) return T.tratamento.doseIndefinida;
  return `${doseTxt((S.profile as any).dose)} ${M(S).unit}`;
}

/* ⚠️ LISTA VAZIA EXISTE, e antes não podia existir: a semente sempre
   trouxe pesagens, então ninguém nunca leu a última de uma lista com
   zero. Com o estado vazio isso passa a acontecer no instante entre
   apagar tudo e responder o cadastro — e uma tela que quebra nesse
   instante quebra em cima de quem acabou de apagar os próprios dados.

   O recuo é o peso do perfil, que é de onde a pessoa partiu; sem ele,
   zero. Não é um peso inventado: é a ausência, escrita como número.
   Quem precisa saber se existe pesagem pergunta pela lista. */
export const curWeight = (S: State) =>
  S.weights.length ? S.weights[S.weights.length - 1].kg : (S.profile.startWeight || 0);
export const startWeight = (S: State) => S.profile.startWeight;
export const lostKg = (S: State) => startWeight(S) - curWeight(S);
/* Sem peso de partida não há porcentagem de nada, e zero dividido por
   zero vira NaN na tela — que é pior do que não mostrar. */
export const lostPct = (S: State) => (startWeight(S) ? (lostKg(S) / startWeight(S)) * 100 : 0);
export const imc = (S: State, w: number) => w / (S.profile.height ** 2);
export const goalProgress = (S: State) => {
  const caminho = startWeight(S) - S.profile.goalWeight;
  if (!caminho) return 0;
  return Math.max(0, Math.min(100, ((startWeight(S) - curWeight(S)) / caminho) * 100));
};
export const lastInjection = (S: State) => (S.injections.length ? S.injections[S.injections.length - 1] : null);

/* A CADÊNCIA REAL, que nem sempre é a do catálogo.

   CADENCE_DAYS lê MEDS: Mounjaro e Ozempic são semanais, Saxenda e
   Victoza são diários. É o certo para quase todo mundo, e é por isso que
   o cadastro não faz da frequência uma pergunta.

   Só que aplicar a cada dez ou catorze dias existe, e não é erro de quem
   faz: acontece por tolerância, por orientação e por preço da caneta.
   Para essa pessoa o app inteiro contava errado — próxima aplicação,
   adesão, dia do ciclo, quanto tempo dura o estoque — e cobrava dose
   atrasada de quem não estava atrasada.

   O cadastro pergunta isso como EXCEÇÃO, atrás de um toque, e guarda em
   profile.intervalo. Aqui é onde a exceção passa a valer: as dez contas
   que dependiam da cadência leem esta função, e não mais o catálogo
   direto. Sem isto a resposta seria lida na tela do cadastro e jogada
   fora — que é exatamente o defeito que o "Quando" da tela de aplicação
   já teve. */
export const cadenciaDias = (S: State) => {
  const i = (S.profile as any).intervalo;
  return typeof i === 'number' && i > 0 ? i : CADENCE_DAYS(S.profile.med);
};

/** A idade, contada da data de nascimento — inclusive se já fez anos. */
export const idadeDe = (S: State) => {
  const t = (S.profile as any).nascimento;
  if (typeof t !== 'number') return null;
  const d = new Date(t); const h = now();
  let anos = h.getFullYear() - d.getFullYear();
  const m = h.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < d.getDate())) anos -= 1;
  return anos;
};

/* COMO A CADÊNCIA SE ESCREVE, em dois comprimentos.

   Quatro telas montavam esta frase por conta própria, cada uma com a sua
   redação e todas lendo med.cad direto do catálogo: "uma vez por
   semana", "1× por semana", "diariamente", "diária", "uso diário". Com o
   intervalo de exceção, as quatro passaram a contradizer a contagem do
   próprio app — a tela de aplicações dizia "uma vez por semana" logo
   acima de um anel marcando dia 5 de 10.

   Os dois comprimentos são de propósito: a linha de abertura de uma tela
   fala por extenso, e a célula de uma tabela de resumo médico não tem
   essa largura. */
export const cadenciaTexto = (S: State) => {
  const d = cadenciaDias(S);
  const t = T.tratamento;
  if (d === 7) return t.cadenciaSemanal;
  if (d === 1) return t.cadenciaDiaria;
  return t.cadenciaOutra(d);
};

export const cadenciaCurta = (S: State) => {
  const d = cadenciaDias(S);
  const t = T.tratamento;
  if (d === 7) return t.cadenciaSemanalCurta;
  if (d === 1) return t.cadenciaDiariaCurta;
  return t.cadenciaOutraCurta(d);
};

export function nextInjectionDate(S: State) {
  const li = lastInjection(S); if (!li) return startOfDay(now());
  return addDays(startOfDay(new Date(li.t)), cadenciaDias(S));
}
/* QUANTAS DOSES O TRATAMENTO PREVIA ATÉ HOJE.

   Ela existia escondida dentro de adesao(), e duas telas precisavam do
   número — o resumo médico e a de aplicações. As duas o reconstruíam
   dividindo as doses pela porcentagem: `Math.round(doses * 100 / adesao)`,
   uma conta que desfaz um arredondamento com outro e erra por um sempre
   que a porcentagem cai num meio. Agora é uma função, e a adesão é que
   sai dela. */
export const dosesPrevistas = (S: State) =>
  Math.floor(diffDays(now(), new Date(S.profile.startT)) / cadenciaDias(S)) + 1;

export function adesao(S: State) {
  return Math.max(0, Math.min(100, Math.round((S.injections.length / dosesPrevistas(S)) * 100)));
}
/* O REGISTRO DO DIA e o CHECK-IN FEITO são duas perguntas diferentes.

   `checkinToday` devolve o registro de hoje — a linha onde moram a água,
   a proteína e o exercício. Ela nasce no primeiro copo d'água, porque os
   acumuladores precisam de onde somar.

   Quem pergunta "a pessoa fez o check-in?" não pode usar essa linha: um
   copo d'água às oito da manhã criava o registro e, com ele, o banner
   dizia "concluído", o streak subia e o empurrão do dia sumia — tudo sem
   ninguém ter respondido nada.

   `checkinFeito` procura resposta, não registro. Resposta é o que só
   existe porque alguém disse: energia, sono, humor, fome, os sintomas, o
   intestino, a anotação. Zero conta — marcar "não tive náusea" grava 0, e
   isso é uma resposta. Água em zero não conta: ela é zero desde que o dia
   nasceu. */
export function checkinToday(S: State) { const t = +startOfDay(now()); return S.checkins.find((c: any) => c.t === t); }

const RESPOSTAS = ['energia', 'sono', 'mood', 'fome', 'nausea', 'constip', 'diarreia', 'refluxo', 'gut'];

/** O dia tem alguma resposta — não só um acumulador que subiu sozinho. */
export function respostaNoDia(c: any) {
  if (!c) return false;
  if (RESPOSTAS.some((k) => c[k] != null)) return true;
  if (Object.keys(c.sint || {}).length) return true;
  if (String(c.outroTexto || '').trim()) return true;
  return !!String(c.note || '').trim();
}

export function checkinFeito(S: State) { return respostaNoDia(checkinToday(S)); }

export function streak(S: State) {
  let n = 0; let d = checkinFeito(S) ? 0 : 1;
  for (; ;) {
    const t = +startOfDay(daysAgo(d));
    if (respostaNoDia(S.checkins.find((c: any) => c.t === t))) { n++; d++; } else break;
  }
  return n;
}
export function checkins30(S: State) {
  const from = +daysAgo(30);
  return S.checkins.filter((c: any) => c.t >= from && respostaNoDia(c)).length;
}
export function waterToday(S: State) { const c = checkinToday(S); return c ? c.agua : 0; }

// radar 0..100 a partir das últimas 3 avaliações
/* Eixo sem resposta SAI do radar, em vez de aparecer zerado. Um vértice
   encostado no centro lê como "você foi mal nisso", e não é isso que um
   dia sem registro diz. A figura fica com menos pontas e continua
   verdadeira — o que é melhor do que oito pontas mentindo em três. */
/* ⚠️ A CHAVE DO EIXO NÃO É O NOME DELE, e era. `radar()` devolvia
   `{ k: 'Sono' }`, a tabela de séries era indexada por 'Sono', e a tela
   mandava o mesmo 'Sono' de volta para pedir o gráfico — traduzir a
   palavra quebrava a busca em três lugares de uma vez.

   Agora `id` é a chave, estável, e `k` é o rótulo, que vem do catálogo. */
export type EixoDoRadar = { id: keyof typeof T.equilibrio.eixos; k: string; v: number };

export function radar(S: State): EixoDoRadar[] {
  const recent = S.checkins.slice(-3);
  const eixos: EixoDoRadar[] = [];
  const põe = (id: EixoDoRadar['id'], v: number | null) => {
    if (v != null) eixos.push({ id, k: T.equilibrio.eixos[id], v });
  };
  const esc = (m: number | null, f: (x: number) => number) => (m == null ? null : f(m));

  põe('sono', esc(mediaDe(recent, 'sono'), (m) => Math.min(100, (m / SONO_REF_H) * 100)));
  põe('energia', esc(mediaDe(recent, 'energia'), (m) => m * 10));
  põe('humor', esc(mediaDe(recent, 'mood'), (m) => (m / 5) * 100));
  /* Acumuladores não somem: zero de água é uma resposta, não uma lacuna. */
  põe('hidratacao', Math.min(100, ((mediaDe(recent, 'agua') ?? 0) / metaDeCopos(S)) * 100));
  põe('exercicio', recent.length
    ? Math.min(100, (recent.filter((c: any) => (c.exerc || 0) > 0).length / recent.length) * 100)
    : 0);
  /* ⚠️ ERA `/ 100` FIXO, e o eixo de cima já mostrava o conserto.

     A hidratação aqui do lado lê `metaDeCopos(S)` desde que alguém
     descobriu que o radar dava como 100% hidratada uma pessoa a quem a
     barra do dia dizia "faltam 2 L" — o comentário está no alto deste
     arquivo. A proteína ficou para trás com os 100 g de ninguém: o perfil
     calcula a meta do peso da pessoa (1,2 g por quilo, 90 g na semente).

     Quem tem meta de 70 g e bate os 70 aparecia com 70% de proteína;
     quem tem 120 g e faz 100 aparecia com 100%. O radar é a tela que
     compara a pessoa com ela mesma — era a única em que a régua era de
     outro. */
  põe('proteina', Math.min(100, ((mediaDe(recent, 'prot') ?? 0) / (S.profile as any).targets.prot) * 100));
  põe('saciedade', esc(mediaDe(recent, 'fome'), (m) => (10 - m) * 10));
  põe('adesao', adesao(S));
  return eixos;
}

// nível farmacológico estimado 0..1 num instante t
export function pharmaLevel(S: State, t: number) {
  const m = M(S); const tabs = 0.6; let lvl = 0;
  for (const inj of S.injections) {
    const dt = (t - inj.t) / DAY; if (dt < 0) continue;
    lvl += inj.dose * (1 - Math.exp(-dt / tabs)) * Math.exp(-dt * Math.LN2 / m.hl);
  }
  return lvl;
}
// amostra a curva ao redor de hoje e normaliza; retorna pontos + vale futuro
export function pharmaSeries(S: State) {
  const days = cadenciaDias(S);
  const from = +addDays(startOfDay(now()), -Math.min(days, 7));
  const to = +addDays(startOfDay(now()), days + 1);
  const pts: { t: number; v: number; n: number }[] = []; let max = 0;
  for (let t = from; t <= to; t += DAY / 2) { const v = pharmaLevel(S, t); pts.push({ t, v, n: 0 }); if (v > max) max = v; }
  pts.forEach((p) => (p.n = max ? p.v / max : 0));
  /* ⚠️ LINHA RETA NÃO TEM PONTO MAIS BAIXO, e era daqui que saía a
     previsão de fome de quem nunca aplicou nada.

     Sem aplicação no passado, `pharmaLevel` devolve 0 em todo instante:
     `max` é 0, `p.n` é 0 em todos os pontos, e o laço abaixo elegia o
     PRIMEIRO ponto como vale — porque `0 < 0` é falso e `!trough` é
     verdadeiro uma vez. Um vale de mentira, numa curva que não desce.

     `hungerForecast` lia esse vale e a Home escrevia, sob o rótulo
     DESCOBERTA: "sua fome tende a subir nestes dias, quando o nível da
     tirzepatida chega ao ponto mais baixo antes da próxima aplicação" —
     para alguém sem uma aplicação registrada, e às vezes sem nem ter
     escolhido o medicamento que a frase nomeia. Era o ÚNICO achado de
     quem acabou de instalar o aplicativo, então era esse o primeiro
     slide que essa pessoa via.

     `trough` já era `| null` no tipo, e `hungerForecast` já devolvia null
     quando ele falta. O que faltava era ele faltar. */
  const nd = +nextInjectionDate(S); let trough: { t: number; v: number; n: number } | null = null;
  if (max > 0) for (const p of pts) { if (p.t >= +startOfDay(now()) && p.t <= nd) { if (!trough || p.n < trough.n) trough = p; } }
  return { pts, trough, nextDose: nd };
}
export function hungerForecast(S: State) {
  const { trough } = pharmaSeries(S); if (!trough) return null;
  const d = diffDays(new Date(trough.t), now());
  return { when: new Date(trough.t), inDays: d };
}

/* O enjoo do dia seguinte, separado pelas noites longas e pelas curtas.

   Devolve null quando não dá para dizer nada, e são três as guardas —
   porque achado frágil é achado inventado com aritmética por cima:

   · as duas noites precisam existir em número (`MIN_NOITES` de cada lado),
   · a diferença precisa passar de `DIF_MINIMA` numa escala de 5, abaixo do
     que é só ruído de quem respondeu 2 num dia e 3 no outro,
   · e só falamos da direção que tem o que dizer.

   ⚠️ ISTO É HEURÍSTICA, NÃO TESTE ESTATÍSTICO — está no PENDENCIAS. Duas
   médias e um limiar não controlam o ciclo da aplicação, que é o que
   move o enjoo de verdade; numa semana de dose o enjoo sobe por conta
   dela, e se o sono daquela semana for curto por acaso os dois andam
   juntos sem terem relação. Os limiares altos existem para que isso
   aconteça pouco, não para que não aconteça. */
const MIN_NOITES = 7;
const DIF_MINIMA = 0.7;
export function enjooAposDormir(S: State) {
  const porDia = new Map<number, any>();
  S.checkins.forEach((c: any) => porDia.set(+startOfDay(new Date(c.t)), c));
  const longas: number[] = [], curtas: number[] = [];
  S.checkins.forEach((c: any) => {
    if (typeof c.sono !== 'number') return;
    const seg = porDia.get(+startOfDay(addDays(new Date(c.t), 1)));
    if (!seg || typeof seg.nausea !== 'number') return;
    (c.sono >= SONO_REF_H ? longas : curtas).push(seg.nausea);
  });
  if (longas.length < MIN_NOITES || curtas.length < MIN_NOITES) return null;
  const media = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
  const bem = media(longas), mal = media(curtas);
  return mal - bem >= DIF_MINIMA ? { bem, mal, noites: longas.length } : null;
}

/* ⚠️⚠️ O `insights()` MORAVA AQUI, e era o motor de descobertas da Home.

   Ele tinha quatro achados. Dois já viviam no `patterns()` em versão
   melhor e com limiar mais exigente — a água por dia da semana e a
   proteína metade-contra-metade — de modo que a Home podia anunciar como
   descoberta um padrão que a aba Insights, olhando o mesmo dado, julgava
   fraco demais para mostrar. O terceiro, a previsão de fome, virou
   ANTECIPAÇÃO no motor novo, e é o `hungerForecast` logo acima que a
   alimenta — por isso ele fica. O quarto, sono contra enjoo, virou
   Pattern no `patterns()`, e por isso o `enjooAposDormir` também fica.

   E a Home mostrava só `ins[0]`: os outros três eram calculados a cada
   abertura e jogados fora.

   Quem faz esse trabalho agora é src/logic/descobertas.ts, e a diferença
   não é de implementação — é de desenho. Produzir o que é verdade sobre
   a pessoa e ESCOLHER o que merece o único slot da Home são dois
   trabalhos, e agora estão em dois lugares. */

/* seletores das áreas complementares */
export const journeyDay = (S: State) => diffDays(now(), new Date(S.profile.startT)) + 1;
export const latestMeasure = (S: State) => S.measures[S.measures.length - 1];
export const firstMeasure = (S: State) => S.measures[0];
export function vitalLast(S: State, k: string) { const a = (S.vitals as any)[k]; return a && a.length ? a[a.length - 1] : null; }
export function examBy(S: State, m: string) { return S.exams.find((e: any) => e.marker === m); }
export const examLast = (e: any) => e.values[e.values.length - 1];
export const examFirst = (e: any) => e.values[0];
/* AS CONQUISTAS SÃO CALCULADAS, e não guardadas — ver
   src/logic/conquistas.ts. Aqui ficou só o atalho que o resto do derive
   usa, para não importar a tela inteira.

   A função antiga lia `S.achievements`, uma lista fixa com `done: true`
   escrito à mão: quem instalasse o app abria a Jornada com cinco
   conquistas de alguém que nunca existiu. */
export const achDone = (S: State) => feitas(conquistas(S));
/** Os níveis alcançados como eventos datados — para a linha do tempo. */
export const marcosDeConquista = (S: State) => eventosDeConquista(S);

/* ⚠️ O `alerts()` MORAVA AQUI, com um número inventado na última linha.

   Ela era esta, sem condição nenhuma em volta:

       out.push({ ic: 'pill', text: 'Estoque em 3 doses — renovar receita' });

   Três doses para todo mundo, sempre — enquanto `penStock(S).left`, neste
   mesmo arquivo, sabe quantas a pessoa tem. Uma pessoa sem caneta nenhuma
   ia ler que tinha três, e uma com dez, a mesma coisa.

   A função inteira saiu em vez de a linha ser corrigida: `grep` não acha um
   único chamador de `alerts()`, nem do tipo `Alert` — a Home monta os avisos
   dela por outro caminho. Código morto carregando número inventado é pior
   do que código morto: quem for ligá-lo um dia liga junto a mentira, e
   ela chega à tela parecendo que sempre esteve certa.

   Os outros dois avisos daqui (check-in do dia, aplicação chegando) já
   existem vivos em `todayBrief` e em `carePending`. */

/** Os marcadores que têm o que dizer. Sem coleta não há valor, e sem
    valor `examStatus` compara `undefined` com o limite do laboratório — o
    que devolve "alto" para um exame do qual não se sabe nada.

    ⚠️ E ERA O `examSummary` QUEM FILTRAVA, sozinho entre quatro. Os outros
    três lugares que contam marcadores fora da faixa não filtravam, então
    um marcador sem coleta entraria na conta de três telas e ficaria fora
    da quarta. Hoje isso não acontece — toda entrada de `exams` nasce com
    um valor —, e é por isso que a guarda cabe aqui em vez de virar
    conserto: ela impede a divergência antes de a primeira entrada vazia
    existir. */
export const examesComValor = (exames: any[]): any[] =>
  (exames ?? []).filter((e) => e?.values?.length);

/** Os marcadores fora da faixa de referência do laboratório.

    ⚠️ ESTA LINHA ESTAVA ESCRITA QUATRO VEZES — em `examSummary`, no painel
    do `examExplain`, na tela de Exames e na aba Cuidado. Idênticas as
    quatro, o que só quer dizer que ainda não tinham divergido. */
export const examesForaDaRef = (exames: any[]): any[] =>
  examesComValor(exames).filter((e) => examStatus(e) !== 'ok');

export function examStatus(e: any) {
  const v = examLast(e).v; const r = e.ref;
  const m = r.match(/([<>])\s*([\d,\.]+)/);
  if (m) { const lim = parseFloat(m[2].replace(',', '.')); return m[1] === '<' ? (v < lim ? 'ok' : 'alto') : (v > lim ? 'ok' : 'baixo'); }
  const rg = r.match(/([\d,\.]+)[–-]([\d,\.]+)/);
  if (rg) { const lo = parseFloat(rg[1].replace(',', '.')), hi = parseFloat(rg[2].replace(',', '.')); return v < lo ? 'baixo' : v > hi ? 'alto' : 'ok'; }
  return 'ok';
}
/* ⚠️ A GAUGE PASSOU A DIZER QUAIS BORDAS SÃO DE VERDADE.

   `bandL` e `bandR` sempre existiram, mas nem sempre significam a mesma
   coisa: numa referência "15–150" as duas são limites que o laboratório
   escreveu; numa "< 5,7" só a direita é — a esquerda é o zero que o
   desenho precisou inventar para ter onde começar.

   Enquanto a régua era uma barra, a diferença não aparecia. Agora que ela
   desenha a faixa por DISTÂNCIA ATÉ O LIMITE, ela precisa saber quais
   limites contar: sem isso, numa referência "< 5,7" o ponto mais forte
   cairia no meio entre zero e 5,7 — o aplicativo dizendo que 2,8% de
   HbA1c é o lugar ideal, o que não é verdade nem é coisa que ele saiba. */
export function examGaugeData(e: any) {
  const v = examLast(e).v, r = e.ref;
  let min = 0, max = 1, bandL = 0, bandR = 1;
  let temMin = false, temMax = false;
  const rng = r.match(/([\d,\.]+)\s*[–-]\s*([\d,\.]+)/), one = r.match(/([<>])\s*([\d,\.]+)/);
  if (rng) { const lo = parseFloat(rng[1].replace(',', '.')), hi = parseFloat(rng[2].replace(',', '.')), pad = (hi - lo) * 0.6 || hi * 0.2; min = Math.max(0, lo - pad); max = hi + pad; bandL = lo; bandR = hi; temMin = true; temMax = true; }
  else if (one) { const lim = parseFloat(one[2].replace(',', '.')); if (one[1] === '<') { min = 0; max = lim * 1.7; bandL = 0; bandR = lim; temMax = true; } else { min = 0; max = lim * 2.2; bandL = lim; bandR = max; temMin = true; } }
  else { min = 0; max = (v * 1.6) || 1; bandL = min; bandR = max; }
  const clamp = (x: number) => Math.max(1, Math.min(99, ((x - min) / ((max - min) || 1)) * 100));
  return {
    pos: clamp(v), bandL: clamp(bandL), bandR: clamp(bandR),
    min, max, temMin, temMax,
    limMin: bandL, limMax: bandR,
    status: examStatus(e),
  };
}

/* ============================================================
   OS DOIS SINAIS DO ACOMPANHAMENTO

   ⚠️ ERA UM SÓ, E ELE DECIDIA DUAS COISAS DIFERENTES.

     export const hasClinic = (S) => !!(S.profile.doctor || S.profile.clinic);

   Enquanto a única forma de ter médico era o seed, isso funcionava: quem
   tinha nome de médica tinha, junto, uma plataforma imaginária do outro
   lado. Mas o aplicativo vai ter gente que tem médico e NÃO tem
   plataforma — quem se trata com alguém que não é credenciado, e quem
   usa o app fora do Brasil, onde a rede não existe.

   Para essa pessoa o sinal único mente: ela escreve "Dr. João" no perfil
   e o aplicativo passa a oferecer mandar mensagem para ele, enviar o
   resumo para a plataforma dele e pedir receita a ele. Nada disso existe,
   e é mentira sobre saúde.

   A RÉGUA PARA ESCOLHER ENTRE OS DOIS: ter acompanhamento é sobre a vida
   da pessoa; clínica conectada é sobre a existência de um servidor. Na
   dúvida, pergunte se a funcionalidade precisa de alguém respondendo do
   outro lado.

   O NOME CONTINUA VINDO DOS DOIS CAMPOS. O cadastro pergunta uma coisa
   só, "alguém acompanha você?", e guarda um nome — se ele é de pessoa ou
   de lugar é assunto de quem responde. Quem é acompanhado por uma médica
   sem clínica no nome, que é a maioria, conta igual.

   Ver MODOS.md, na raiz do projeto.
   ============================================================ */

/** Alguém acompanha esta pessoa — venha do vínculo ou digitado por ela.
    Liga a consulta, o preparo de perguntas e o resumo como documento.

    ⚠️ ISTO LIA O NOME GUARDADO, e por isso não distinguia duas pessoas
    muito diferentes: quem tem médico e não preencheu o campo, e quem
    decidiu conduzir o tratamento sozinha. Para a segunda, cada lembrete
    de consulta e cada convite a registrar um especialista é o aplicativo
    insistindo numa escolha que ela já tomou.

    Agora é resposta, e não dedução — o cadastro pergunta. */
export const temAcompanhamento = (S: State) =>
  ((S.profile as any).acompanhamento ?? 'nenhum') !== 'nenhum' || clinicaConectada(S);

/* O `|| clinicaConectada` acima não é uma segunda fonte: `ensureDefaults`
   já grava 'proprio' em quem tem vínculo, e as duas linhas dizem a mesma
   regra. Ele cobre a janela entre um servidor confirmar o vínculo e o
   próximo carregamento — no instante da confirmação, esconder a consulta
   de quem acabou de ganhar uma equipe seria o pior momento possível. */

/** Escolheu conduzir o tratamento sem acompanhamento médico. É o oposto
    do de cima, e existe com nome próprio porque algumas telas precisam
    dizer alguma coisa para ela — e não apenas esconder o que sobrou. */
export const semAcompanhamento = (S: State) => !temAcompanhamento(S);

/** Existe plataforma do outro lado. Só um código de convite liga isto, e
    é ele que libera mensagem, envio do resumo, receita e a isenção. */
export const clinicaConectada = (S: State) => !!(S.profile as any).vinculo;

/* ⚠️ VÍNCULO IMPLICA ACOMPANHAMENTO, e a recíproca não vale. São duas
   perguntas separadas no cadastro — uma sobre o tratamento, outra sobre
   por onde a pessoa entrou —, e elas podem sair de lá em desacordo: quem
   chegou por uma clínica parceira e respondeu "por conta própria" na
   primeira deixaria o aplicativo escondendo dela a consulta que a própria
   clínica marca. Na dúvida, o app resolve para o lado de quem tem
   alguém. */

/* TER CONSULTA MARCADA é outra pergunta.

   Quem chega hoje não tem uma, e o estado vazio guarda zero na data —
   que vira primeiro de janeiro de 1970 em qualquer tela que formatar sem
   perguntar. As que escrevem a data da próxima consulta perguntam aqui
   antes. */
export const temConsulta = (S: State) => ((S as any).consult?.t ?? 0) > 0;

/* Marcos do tratamento — a narrativa da jornada em eventos (cronológico desc). */
/* ⚠️ TODO MARCO TEM DESTINO, e nenhum tinha.

   A fita de marcos era a única lista da Jornada que não levava a lugar
   nenhum: oito cartões de coisas que aconteceram, e nenhuma delas abria o
   registro que a prova. Para uma conquista isso é pior ainda, porque a
   tela de Conquistas — logo ali, no link do cabeçalho — abre a trilha
   inteira de cada uma.

   O destino sai do TIPO do marco, e não de um campo escrito à mão: dose
   vai para as aplicações, consulta para as consultas, exame para os
   exames, conquista para a trilha dela. É por isso que ele é montado
   aqui, junto de quem sabe de onde cada marco veio. */
export type Milestone = { t: number; ic: string; title: string; sub: string; to: string };
export function milestones(S: State): Milestone[] {
  const out: Milestone[] = [];
  const K = T.tratamento.marcos;
  out.push({ t: S.profile.startT, ic: 'leaf', title: K.inicio, sub: `${MEDS[S.profile.med].label} · ${pesoTxt(S, S.profile.startWeight)}`, to: '/historico' });
  let prev: number | null = null;
  for (const inj of S.injections as any[]) {
    if (prev != null && inj.dose !== prev) out.push({ t: inj.t, ic: 'dose', title: K.doseAjustada(nf(inj.dose, inj.dose % 1 ? 1 : 0)), sub: K.titulacao, to: '/aplicacoes' });
    prev = inj.dose;
  }
  const w5 = S.weights.find((w: any) => (S.profile.startWeight - w.kg) / S.profile.startWeight >= 0.05);
  if (w5) out.push({ t: w5.t, ic: 'trend', title: K.cincoPorCento, sub: K.cincoPorCentoSub, to: '/marcador?m=peso' });
  S.consultsHistory.forEach((ch: any) => out.push({ t: ch.t, ic: 'steth', title: K.consulta(ch.type.toLowerCase()), sub: ch.note, to: '/consultas' }));
  S.examBundles.forEach((b: any) => out.push({ t: b.t, ic: 'doc', title: b.name, sub: K.marcadoresImportados(b.n), to: '/exames' }));
  marcosDeConquista(S).forEach((a) => out.push({ t: a.t, ic: a.ic, title: a.title, sub: a.desc, to: `/trilha?id=${a.trilha}` }));
  out.sort((a, b) => b.t - a.t);
  return out;
}

/* Aplicações — locais, rotação e calendário de constância (porta verbatim). */
/* ⚠️ A CHAVE É DADO: 'abd-e' é o que fica gravado em cada aplicação. Só o
   rótulo vem do catálogo, e é por isso que `siteLabel` devolve a própria
   chave quando não conhece o local — registro antigo não some da tela. */
/* ⚠️ E O MESMO VALE PARA O MARCADOR DE EXAME: "HbA1c" e "Glicemia jejum"
   são o que fica gravado em `e.marker`, e eram também o que a tela
   mostrava. Quem não estiver na tabela aparece com a própria chave, para
   que exame antigo não suma por causa de um nome que mudou. */
export const nomeDoMarcador = (m: string) =>
  (T.marcadores.nome as Record<string, string>)[m] || m;

export const SITE_LABEL = (): Record<string, string> => T.tratamento.locais;
export const siteLabel = (s: string) => SITE_LABEL()[s] || s;
/* ============================================================
   O RODÍZIO DOS LOCAIS

   Alternar o local não é burocracia: repetir o mesmo ponto causa nódulo
   e irritação, e é o tipo de coisa que ninguém controla de cabeça. O app
   tem a resposta inteira guardada — cada aplicação traz o local e a data
   —, e usava isso só para SUGERIR o próximo, numa linha de texto.

   Aqui ele devolve a coisa toda: há quanto tempo cada um dos seis
   descansa. É o que transforma "Abdômen (esq.) sugerido" em uma decisão
   que a pessoa consegue conferir sozinha.

   Local nunca usado devolve semanas nulo — e não zero. Zero seria "usado
   esta semana", que é o oposto. */
export type LocalDoRodizio = {
  id: string;
  label: string;
  ultima: number | null;
  /** semanas desde a última vez; null quando nunca foi usado */
  semanas: number | null;
  proximo: boolean;
};

export function rodizioDeLocais(S: State): LocalDoRodizio[] {
  const prox = nextSite(S);
  const hoje = +startOfDay(now());
  const ultimaDe = new Map<string, number>();
  for (const i of S.injections as any[]) {
    const t = +startOfDay(new Date(i.t));
    if (!ultimaDe.has(i.site) || t > (ultimaDe.get(i.site) as number)) ultimaDe.set(i.site, t);
  }
  /* ⚠️ ERA `Object.keys(SITE_LABEL)`, E A TABELA VIROU FUNÇÃO. Chaves de
     uma função são zero, então a lista inteira de locais virou vazia — sem
     erro de tipo e sem erro em tempo de execução: a tela do rodízio
     simplesmente não desenhava nada. Quem pegou foi o congelamento. */
  return Object.keys(SITE_LABEL()).map((id) => {
    const ultima = ultimaDe.get(id) ?? null;
    return {
      id,
      label: SITE_LABEL()[id],
      ultima,
      semanas: ultima == null ? null : Math.floor((hoje - ultima) / (7 * DAY)),
      proximo: id === prox,
    };
  }).sort((a, b) => (a.ultima ?? -1) - (b.ultima ?? -1));
}

export function nextSite(S: State) {
  const used = S.injections.slice(-3).map((i: any) => i.site);
  const all = ['abd-e', 'abd-d', 'coxa-e', 'coxa-d', 'braco-e', 'braco-d'];
  return all.find((s) => !used.includes(s)) || all[0];
}
// calendário de aderência: 6 semanas, aplicadas marcadas, próxima tracejada — sem punição por dia perdido
export function injCalendar(S: State) {
  const applied = new Set(S.injections.map((i: any) => +startOfDay(new Date(i.t))));
  const nd = +startOfDay(nextInjectionDate(S)), today = +startOfDay(now());
  const anchor = new Date(Math.max(nd, today));
  const endSat = addDays(startOfDay(anchor), 6 - anchor.getDay());
  const cells: { day: number; applied: boolean; planned: boolean; today: boolean }[] = [];
  for (let i = 41; i >= 0; i--) {
    const d = addDays(endSat, -i); const key = +startOfDay(d);
    cells.push({ day: d.getDate(), applied: applied.has(key), planned: key === nd && key >= today, today: key === today });
  }
  return cells;
}

/* ============================================================
   GRADE DE SEMANAS — o calendário do acompanhamento

   Uma célula por semana de tratamento, da primeira até hoje mais algumas
   à frente. Cada célula sabe três coisas: se teve aplicação, quantos
   check-ins teve, e se é a semana corrente ou ainda por vir.

   É o mesmo dado que a barra de adesão resume num número, e a diferença
   é o que se enxerga: 87% não mostra ONDE ficaram os buracos, e é
   justamente o buraco — duas semanas seguidas sem registro em maio — que
   explica um platô. Um número esconde padrão; uma grade é o padrão.
   ============================================================ */
export type SemanaCelula = {
  n: number;                 // número da semana de tratamento
  aplicou: boolean;
  checkins: number;
  futura: boolean;
  atual: boolean;
  mes: string;               // rótulo curto, para agrupar visualmente
};

export function weekGrid(S: State, adiante = 4): SemanaCelula[] {
  const ini = startOfDay(new Date(S.profile.startT));
  const hoje = +startOfDay(now());
  const decorridas = semanaDoTratamento(now(), S.profile.startT);
  const total = decorridas + adiante;

  const apl = S.injections.map((i: any) => +startOfDay(new Date(i.t)));
  const chk = (S.checkins as any[]).map((c) => c.t);

  return Array.from({ length: total }, (_, k) => {
    const de = +addDays(ini, k * 7);
    const ate = +addDays(ini, (k + 1) * 7);
    return {
      n: k + 1,
      aplicou: apl.some((t) => t >= de && t < ate),
      checkins: chk.filter((t) => t >= de && t < ate).length,
      futura: de > hoje,
      atual: hoje >= de && hoje < ate,
      mes: MES_CURTO[new Date(de).getMonth()],
    };
  });
}

const MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** A grade lida: quantas semanas já foram vividas e em quantas houve
    aplicação.

    ⚠️ `grade.filter((g) => !g.futura && g.aplicou).length` ESTAVA ESCRITO
    TRÊS VEZES — no hero de Cuidado, no da Jornada e na tela de Ritmo —,
    e as três chamam `weekGrid(S, 0)` uma linha antes para poder escrevê-lo.
    É a mesma leitura da mesma grade, feita três vezes. */
export function semanasDaGrade(S: State) {
  const grade = weekGrid(S, 0);
  return {
    grade,
    vividas: grade.filter((g) => !g.futura).length,
    aplicadas: grade.filter((g) => !g.futura && g.aplicou).length,
  };
}

/** Daqui a quantos dias é a próxima aplicação. Negativo quer dizer
    atrasada.

    ⚠️ ESTAVA ESCRITO OITO VEZES, cinco delas dentro deste arquivo. */
export const diasAteAplicar = (S: State) => diffDays(nextInjectionDate(S), now());

/** Já começou a tomar, ou já marcou quando começou.

    ⚠️ A MESMA DISJUNÇÃO EM TRÊS ARQUIVOS — cadastro, dados e perfil —, e
    nos três ela decide a mesma coisa: se existe um "peso de quando
    começou" separado do peso de hoje. Duas respostas diferentes para essa
    pergunta mandariam a pessoa para dois passos diferentes do cadastro a
    partir de duas telas que mostram a mesma linha. */
export const emTratamento = (S: State) =>
  (S.injections?.length ?? 0) > 0 || !!S.profile.startT;

/** Os últimos sete dias, com o que foi registrado em cada um.

    Sete e não trinta: a semana é a unidade em que a pessoa se lembra do
    que fez. Numa grade de trinta dias, a célula de anteontem e a de três
    semanas atrás pesam igual — e só uma delas ainda pode ser corrigida.

    Ancorada em hoje à direita, não na segunda-feira: a pergunta é "como
    tenho ido", não "como foi a semana civil". */
export function last7Days(S: State) {
  const chk = new Set((S.checkins as any[]).map((c) => c.t));
  const apl = new Set(S.injections.map((i: any) => +startOfDay(new Date(i.t))));
  const hoje = +startOfDay(now());
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(startOfDay(now()), i - 6);
    const t = +d;
    return {
      t,
      dow: DOW_PT()[d.getDay()][0].toUpperCase(),
      dia: d.getDate(),
      feito: chk.has(t),
      aplicou: apl.has(t),
      hoje: t === hoje,
    };
  });
}

/* Exames — as categorias.

   ⚠️ É FUNÇÃO, E NÃO CONSTANTE DE MÓDULO. Constante lê o catálogo UMA
   vez, no import, e congelaria o idioma antes da primeira tela aparecer
   — a troca de idioma remonta a árvore do React, e não reexecuta o topo
   de um módulo. Ver o alto de textos/index.

   ⚠️ E AS CHAVES SÃO DADO, NÃO TEXTO: é o que fica gravado em `e.marker`.
   Ver textos/pt-BR/marcadores. */
export const examCats = (): [string, string[]][] => [
  [T.marcadores.catMetabolico, ['HbA1c', 'Glicemia jejum', 'Insulina']],
  [T.marcadores.catLipidico, ['Colesterol total', 'HDL', 'LDL', 'Triglicerídeos']],
  [T.marcadores.catFigadoRim, ['Creatinina', 'TGO', 'TGP']],
  [T.marcadores.catTireoide, ['TSH', 'T4 livre']],
  [T.marcadores.catVitaminas, ['Vitamina D', 'Vitamina B12', 'Ferritina']],
];

/* ============================================================
   OS TRÊS TEXTOS DE CADA MARCADOR — e eles não moram mais aqui

   O que o marcador é, o que mexe nele e o que costuma ajudar estão em
   textos/pt-BR/marcadores, junto das travas que explicam por que nenhum
   dos três diz se o resultado está bom. Quem for mexer no que essas
   frases AFIRMAM lê lá; o que ficou aqui é só a consulta.

   ⚠️ A BUSCA É POR TEXTO E NÃO PELO CONJUNTO DE CHAVES. O catálogo declara
   as chaves uma a uma de propósito — é assim que o tsc cobra do inglês o
   marcador que faltou. Mas quem procura aqui traz um `e.marker` que veio
   de um registro gravado, e registro antigo pode trazer marcador que a
   tabela de hoje não tem: por isso a consulta é de string, e por isso as
   três devolvem vazio em vez de quebrar.
   ============================================================ */

/** Os jeitos conhecidos de mexer no marcador para o lado esperado. Vazio
    para quem não tem item honesto — ver as travas no catálogo. */
export const examWays = (e: any): JeitoDeAjudar[] =>
  (T.marcadores.ajudar as Record<string, JeitoDeAjudar[]>)[e.marker] ?? [];

/** O que costuma mexer no marcador. Lista vazia para quem não está no
    mapa: inventar causas para um exame desconhecido é pior do que não
    dizer nada sobre ele. */
export const examInfluences = (e: any): string[] =>
  (T.marcadores.influencias as Record<string, string[]>)[e.marker] ?? [];

/** A definição do marcador, quando ela existe. Sem invenção para quem não
    está na lista: marcador desconhecido não ganha um "sobre" genérico,
    porque um parágrafo que serve para qualquer exame não explica nenhum. */
export const examAbout = (e: any): SobreOMarcador | null =>
  (T.marcadores.sobre as Record<string, SobreOMarcador>)[e.marker] ?? null;

/* ============================================================
   O RESUMO DA COLETA — e era um parágrafo escrito à mão

   ⚠️ O TEXTO FIXO AFIRMAVA FATOS CLÍNICOS SOBRE QUEM LÊ.

   Ele dizia "seus marcadores metabólicos melhoraram de forma consistente:
   HbA1c 6,3 → 5,6%, triglicerídeos e LDL em queda". Para a pessoa da
   semente isso é verdade; para qualquer outra são números que ela nunca
   teve, e para quem piorou o aplicativo afirmava que tinha melhorado. Num
   aplicativo de saúde isso não é um deslize de redação — é o produto
   mentindo sobre um exame de sangue.

   ⚠️ E O CARTÃO SE CHAMAVA "RESUMO DA IA". Não havia IA nenhuma: havia um
   parágrafo. O nome passou a ser o que a coisa é, e volta a ser "da IA"
   no dia em que houver uma do outro lado.

   O que se monta aqui é aritmética sobre os valores de quem abriu a tela:
   quantos ficaram fora, quais, quantos andaram para o lado esperado, e
   qual foi a maior mudança. Nenhuma frase opina; todas contam.
   ============================================================ */

/* A caixa no meio da frase é regra de idioma, e mora no catálogo com o
   resto da gramática. Ver textos/pt-BR/marcadores. */
const marcadorNoMeio = (m: string) => T.marcadores.noMeio(nomeDoMarcador(m));

/* A ENUMERAÇÃO PARA EM TRÊS, e o resto vira só a contagem.

   O resumo mora na capa, que tem altura fixa. Oito nomes em sequência
   empurram o parágrafo para debaixo da folha — e mesmo que coubesse, uma
   lista de oito no meio de uma frase não se lê, se conta. Passando disso,
   a contagem basta: a lista dos que ficaram fora está logo abaixo, no
   bloco que existe exatamente para isso. */
const LISTA_MAXIMA = 3;

export function examSummary(S: State): string | null {
  const todos = examesComValor((S.exams as any[]) ?? []);
  if (todos.length < 3) return null;

  const n = todos.length;
  const fora = examesForaDaRef(todos);

  const R = T.exames.resumo;
  const estado = fora.length === 0
    ? R.todosDentro(n)
    : fora.length === 1
      ? R.umFora(n, marcadorNoMeio(fora[0].marker))
      : fora.length <= LISTA_MAXIMA
        ? R.algunsFora(fora.length, n, T.comum.lista(fora.map((e) => marcadorNoMeio(e.marker))))
        : R.muitosFora(fora.length, n);

  /* Só entram no rumo os marcadores que declaram qual lado é o bom. Sem
     isso, chamar uma direção de melhora seria opinião — e creatinina ou
     TSH subindo não é notícia boa nem ruim por si. */
  const comRumo = todos
    .map((e) => {
      const l = examLast(e), f = examFirst(e);
      if (!e.good || e.values.length < 2 || l.t === f.t || l.v === f.v) return null;
      const delta = l.v - f.v;
      const melhorou = e.good === 'up' ? delta > 0 : delta < 0;
      /* A mudança é relativa, e não absoluta: 20 mg/dL de LDL e 20 µUI/mL
         de insulina são grandezas que não se comparam em números crus. */
      const peso = Math.abs(delta) / Math.max(1e-9, Math.abs(f.v));
      return { e, f, l, delta, melhorou, peso };
    })
    .filter(Boolean) as { e: any; f: any; l: any; delta: number; melhorou: boolean; peso: number }[];

  const bons = comRumo.filter((x) => x.melhorou).sort((a, b) => b.peso - a.peso);
  const maus = comRumo.filter((x) => !x.melhorou).sort((a, b) => b.peso - a.peso);

  const desde = comRumo.length
    ? R.desde(dataLonga(Math.min(...comRumo.map((x) => x.f.t))))
    : '';

  const melhora = !bons.length ? '' : (() => {
    const b = bons[0];
    const qual = marcadorNoMeio(b.e.marker);
    const de = kgTxt(b.f.v), para = kgTxt(b.l.v);
    return bons.length === 1
      ? R.melhoraUm(desde, qual, de, para, b.e.unit)
      : R.melhoraVarios(desde, bons.length, qual, de, para, b.e.unit);
  })();

  const piora = !maus.length ? ''
    : maus.length > LISTA_MAXIMA ? R.pioraMuitos(maus.length)
      : maus.length === 1
        ? R.pioraUm(marcadorNoMeio(maus[0].e.marker))
        : R.pioraPoucos(maus.length, T.comum.lista(maus.map((x) => marcadorNoMeio(x.e.marker))));

  return `${estado}${melhora}${piora}`;
}

export type LeituraDoExame = { titulo: string; texto: string };
/* `todos` é o painel inteiro da pessoa, e é opcional de propósito: a
   leitura tem que funcionar com o exame sozinho. Quando ele chega, entra
   no texto a única frase desta tela que não sai deste marcador — onde
   este resultado se encaixa no meio dos outros. */
export function examExplain(e: any, todos?: any[]): LeituraDoExame {
  /* ⚠️ AS FRASES ESTAVAM ESCRITAS COM OS NÚMEROS DA SEMENTE.

     A de HbA1c dizia "a queda de 6,3 para 5,6% mostra um controle bem
     melhor". Para a Mariana da semente isso é verdade; para qualquer
     outra pessoa é uma afirmação inventada sobre o exame dela — e para
     quem PIOROU, o aplicativo dizia que tinha melhorado.

     Não é um erro de redação, é a leitura estando no lugar errado:
     interpretação precisa dos números de quem lê, e texto fixo não tem
     como tê-los. Agora o que é fixo é a definição (examAbout), e o que
     é variável se monta do histórico. */
  const map: Record<string, LeituraDoExame> = {};
  /* ⚠️ O NOME DA MÉDICA DA SEMENTE ESTAVA ESCRITO AQUI. Esta é a
     frase que aparece para qualquer marcador sem leitura própria — a
     mais genérica do arquivo, e a que mais gente vê. Ela citava a Dra.
     Helena para todo mundo, inclusive para quem não tem médico nenhum.

     Não passa a citar o nome novo: esta função recebe o exame e nada
     mais, e puxar o estado inteiro até aqui para escrever um nome seria
     caro pelo que entrega. "Quem acompanha você" é verdade nos três
     modos. */
  if (map[e.marker]) return map[e.marker];

  const dentro = examStatus(e) === 'ok';
  const l = examLast(e), f = examFirst(e);
  const varios = (e.values?.length ?? 0) > 1 && l.t !== f.t;
  const delta = l.v - f.v;
  const melhorou = e.good === 'up' ? delta > 0 : delta < 0;

  /* A frase se monta do que ESTE histórico mostra: onde o valor caiu em
     relação à referência, e para que lado ele foi desde a primeira
     coleta. Quando `good` não diz qual lado é o bom, a direção sai da
     frase — dizer "subiu" sem dizer o que isso significa é melhor do que
     chutar o significado. */
  /* ⚠️ A MANCHETE É ESTADO + O QUE ESTÁ EM JOGO, e já foi estado + rumo.

     "Está na faixa, e vem caminhando na direção esperada" é uma frase
     correta que não acrescenta: o rumo é exatamente o que o cartão de
     evolução, três centímetros acima, anuncia em manchete própria e em
     etiqueta colorida. A manchete da leitura repetia o vizinho.

     O que nenhuma outra peça da tela diz é POR QUE este número importa.
     Um valor fora da faixa sem isso é um alarme sem assunto — e é essa a
     diferença entre um aplicativo que informa e um que assusta. O rumo não
     se perde: ele desceu para o parágrafo, onde vira "subiu 20, se
     afastando da faixa".

     ⚠️ A MOLDURA DA FRASE É QUE SEGURA A RESSALVA. "faz diferença para a
     saúde das artérias" fala do território; "vai entupir suas artérias"
     seria prognóstico, que é de médico. O complemento (`afeta`) nomeia só
     o assunto, e o verbo é sempre um que não promete nada.

     ⚠️ E ELA NÃO DIZ O NOME DO MARCADOR. "Seu HbA1c" / "Sua ferritina"
     pediria uma tabela de gênero por marcador para escrever certo em
     português, e errar o artigo numa frase sobre a saúde de alguém é um
     tropeço barato de evitar. "Este resultado" é sempre correto, e o nome
     está na barra do topo. */
  const L = T.exames.leitura;
  const lado = examStatus(e) === 'alto' ? L.acima : L.abaixo;
  const afeta = examAbout(e)?.afeta;

  const titulo = !afeta
    ? (dentro ? L.dentroSemAfeta : L.foraSemAfeta(lado))
    : dentro ? L.dentroComAfeta(afeta) : L.foraComAfeta(lado, afeta);

  /* O parágrafo é a conta por extenso: o valor desta coleta, a faixa que o
     laboratório escreveu, e o quanto andou desde a primeira. Nada aqui é
     interpretação — são os números que já estão na tela, ditos em frase,
     para quem prefere ler a ler gráfico. */
  const uni = e.unit ? ` ${e.unit}` : '';
  const faixa = (() => {
    const gg = examGaugeData(e);
    if (gg.temMin && gg.temMax) return L.faixaEntre(kgTxt(gg.limMin), kgTxt(gg.limMax), uni);
    if (gg.temMax) return L.faixaAbaixoDe(kgTxt(gg.limMax), uni);
    if (gg.temMin) return L.faixaAcimaDe(kgTxt(gg.limMin), uni);
    /* Sem mínimo nem máximo, o que sobra é a faixa como o laboratório a
       escreveu — texto do laudo, e não frase nossa. */
    return `${e.ref}${uni}`;
  })();

  /* O rumo ganhou a conclusão que estava na manchete: não é só que subiu,
     é que subiu PARA ONDE. Sem `good`, o marcador não declara qual lado é
     o bom, e aí a frase para no fato. */
  const rumo = !e.good
    ? ''
    : dentro
      ? (melhorou ? L.rumoDentroBom : L.rumoDentroRuim)
      : (melhorou ? L.rumoForaBom : L.rumoForaRuim);

  const andou = !varios || delta === 0
    ? ''
    : L.andou(dataLonga(f.t), delta > 0 ? L.subiu : L.caiu, kgTxt(Math.abs(delta)), uni, rumo);

  /* ⚠️ ESTA É A ÚNICA FRASE DA TELA QUE OLHA PARA FORA DESTE MARCADOR.

     Um número fora da faixa lido sozinho vira o mundo inteiro de quem
     lê — e a informação que desarma isso não está no marcador, está no
     painel: saber que os outros catorze foram bem muda o tamanho deste
     um. É o mesmo serviço que um médico presta na primeira frase da
     consulta, e é factual: conta quantos, não opina sobre o conjunto.

     Só entra com painel de verdade. Com dois ou três marcadores
     importados, "dos 3 marcadores deste exame" não é contexto, é uma
     conta pequena demais para significar alguma coisa. */
  const painel = (() => {
    if (!todos || todos.length < 5) return '';
    const fora = examesForaDaRef(todos).length;
    const n = todos.length;
    if (dentro) {
      return fora === 0
        ? L.painelTudoDentro(n)
        : L.painelEsteNao(n, fora, fora !== 1);
    }
    return fora === 1 ? L.painelUnicoFora(n) : L.painelEsteEUmDeles(n, fora);
  })();

  const texto = L.corpo(dataLonga(l.t), kgTxt(l.v), uni, faixa, andou, painel);

  return { titulo, texto };
}

/* Ciclo da dose — fase atual, dia no ciclo e stepper (mockups neurosafe). */
/* Cada fase carrega uma explicação em português comum. O nome sozinho
   ("Início do retorno da fome") é diagnóstico sem contexto — numa tela de
   tratamento isso assusta em vez de orientar. */
export type Phase = { key: string; label: string; ic: string; range: string; hint: string; q: string };
export function doseCycle(S: State) {
  const li = lastInjection(S);
  const total = cadenciaDias(S);
  const injDate = li ? startOfDay(new Date(li.t)) : startOfDay(now());
  const dayIn = Math.max(1, Math.min(total, diffDays(now(), injDate) + 1));
  /* ⚠️ AS CINCO PERGUNTAS JÁ EXISTIAM NO CATÁLOGO, escritas de novo aqui.
     São as mesmas que a manchete da Home manda para o companion — mesma
     frase, mesmo destino —, e duas cópias divergem na primeira vez que
     alguém melhorar uma delas. */
  const F = T.ciclo;
  const phases: Phase[] = [
    { key: 'aplic', label: F.faseAplicLabel, ic: 'syringe', range: F.faseAplicRange, hint: F.faseAplicHint, q: F.aplicQ },
    { key: 'pico', label: F.fasePicoLabel, ic: 'rocket', range: F.fasePicoRange, hint: F.fasePicoHint, q: F.picoQ },
    { key: 'estab', label: F.faseEstabLabel, ic: 'shield', range: F.faseEstabRange, hint: F.faseEstabHint, q: F.estabQ },
    { key: 'retorno', label: F.faseRetornoLabel, ic: 'waves', range: F.faseRetornoRange, hint: F.faseRetornoHint, q: F.retornoQ },
    { key: 'pre', label: F.fasePreLabel, ic: 'target', range: F.fasePreRange, hint: F.fasePreHint, q: F.altoQ },
  ];
  const idx = dayIn >= 7 ? 4 : dayIn >= 5 ? 3 : dayIn >= 3 ? 2 : dayIn >= 2 ? 1 : 0;
  return { dayIn, total, phases, idx, phase: phases[idx], nextDose: nextInjectionDate(S) };
}

/* ============================================================
   HOME DE AÇÃO — o motor do dia
   ============================================================ */

/* Briefing do dia — mensagem específica e acionável por fase do ciclo.
   Determinística (mesmo dia → mesma mensagem), muda conforme o ciclo anda. */
export function todayBrief(S: State) {
  const cyc = doseCycle(S);
  const ndDays = diasAteAplicar(S);
  let head = '', body = '', q = '';

  /* ⚠️ O CHAPÉU DEIXA DE SER "PARA HOJE" E PASSA A DIZER O DIA DO CICLO.

     "Sua fome pode começar a aumentar nas próximas 24 horas" é verdade e
     chega sem chão: por que hoje? A resposta já estava calculada a uma
     linha daqui — `doseCycle` devolve `dayIn` e `total` desde sempre — e não
     ia para lugar nenhum. Com ela em cima, a frase deixa de ser um palpite
     do dia e vira a leitura de uma posição: dia 5 de 7, e é por isso que a
     fome volta agora.

     ⚠️ E SÓ QUANDO HÁ CICLO. Sem aplicação registrada, `doseCycle` usa hoje
     como data da última dose e `dayIn` vira 1 — um "DIA 1 DE 7" para quem
     nunca aplicou nada, que é a mesma invenção que saiu do resto da Home
     esta semana. Sem ciclo, o chapéu continua PARA HOJE. */
  const temCiclo = !!lastInjection(S) && temDose(S);
  /* ⚠️ "DIA 5 DA DOSE", E NÃO "DIA 5 DE 7". O de-sete parecia contagem
     regressiva de um prazo — sete do quê, e o que acontece quando chegar?
     A cadência é do medicamento, não uma meta a cumprir. "Da dose" diz a
     mesma posição e nomeia o relógio que a está medindo. */
  const chapeu = temCiclo ? T.ciclo.chapeuDia(cyc.dayIn) : T.ciclo.chapeuSemCiclo;
  switch (cyc.phase.key) {
    case 'aplic':
      /* ⚠️ NÃO ANUNCIA QUE HOJE É DIA DE APLICAR: o slide seguinte da Home
         é inteiro sobre isso, com a dose e o local. Dois slides seguidos
         dando a mesma notícia gastam o carrossel — este fica com o que o
         outro não diz, que é o que acontece no corpo depois de aplicar. */
      head = T.ciclo.aplicHead;
      body = T.ciclo.aplicBody;
      q = T.ciclo.aplicQ;
      break;
    case 'pico':
      head = T.ciclo.picoHead;
      body = T.ciclo.picoBody;
      q = T.ciclo.picoQ;
      break;
    case 'estab':
      head = T.ciclo.estabHead;
      body = T.ciclo.estabBody;
      q = T.ciclo.estabQ;
      break;
    case 'retorno':
      head = T.ciclo.retornoHead;
      body = T.ciclo.retornoBody;
      q = T.ciclo.retornoQ;
      break;
    default:
      /* Mesma razão do 'aplic': quando a aplicação é hoje, quem conta é o
         slide da aplicação. */
      head = quandoEm(ndDays).hoje
        ? T.ciclo.altoHeadHoje
        : T.ciclo.altoHeadComData(quandoEm(ndDays).label);
      body = T.ciclo.altoBody;
      q = T.ciclo.altoQ;
  }
  // sinal extra: noite bem dormida muda o tom do dia
  const last = S.checkins[S.checkins.length - 1];
  if (last && last.sono >= 7.5 && cyc.phase.key !== 'aplic') {
    body = T.ciclo.dormiuBem(body);
  }
  return { head, body, q, cyc, chapeu };
}

/* ⚠️ A LISTA DE TAREFAS DO DIA MORREU AQUI, e a varredura de "caneta"
   foi quem descobriu.

   `todayTasks` montava sete linhas de "o que fazer hoje" e não tinha um
   só consumidor — nenhuma tela a chamava. Dentro dela, uma das linhas
   dizia "Restam 3 doses na caneta" com o TRÊS escrito à mão, ignorando o
   `penStock` que estava a duas funções de distância.

   É o retrato do que código morto faz: um número inventado sobrevive
   anos porque ninguém o vê. Sai inteira. */

/* Conquista recente (≤7 dias) — só aparece quando há o que celebrar. */
export function recentAchievement(S: State) {
  /* Os eventos vêm do mais recente para o mais antigo, então o primeiro
     dentro da semana é o último que aconteceu. */
  const a = marcosDeConquista(S).find((x) => diffDays(now(), new Date(x.t)) <= 7);
  return a ? { ...a, done: true } : null;
}

/* ============================================================
   INSIGHTS — a camada de interpretação

   A Home diz como está hoje, a Jornada diz por onde passou. Esta camada
   responde "o que isso quer dizer": lê os registros e devolve padrão,
   não número.

   Tudo aqui é heurística sobre dado real, nunca conselho clínico — o
   texto precisa deixar isso claro sempre que tocar em dose ou sintoma.
   ============================================================ */
export type PatKey = 'alimentacao' | 'sono' | 'sintomas' | 'peso' | 'aplicacoes';
/* `surpresa` ordena a tela: 3 é o que a pessoa não veria sozinha (cruza duas
   variáveis, ou contraria a intuição), 0 é o que ela já sabe olhando a Home.
   Sem essa nota, um "ritmo de 0,7 kg/semana" — correto e óbvio — disputa
   espaço com "seu fim de semana é outro tratamento". */
export type Pattern = {
  key: PatKey; cat: string; ic: string; cor: string;
  titulo: string; texto: string; q: string; surpresa: number;
  /* O número que sustenta o achado, separado do texto para poder ser
     exibido grande. Sem ele o card afirma; com ele, o card mostra de onde
     tirou — e é a diferença entre parecer opinião e parecer descoberta. */
  evid?: { valor: string; unidade: string; legenda: string };
  /* O terceiro movimento: o que o achado quer dizer para esta pessoa.
     Sem ele o card informa e para; com ele, responde a pergunta que a
     pessoa faria em seguida — "e daí?". É a diferença entre dado e
     análise, e é o que faz a tela parecer escrita e não gerada. */
  significa: string;
  /* ⚠️ QUANTO A EVIDÊNCIA PASSOU DO PRÓPRIO LIMIAR, de 0 (raspou) a 1
     (dobrou) — e é a nota que faltava para a Home poder escolher.

     `surpresa` é autoral: vale o mesmo para todo mundo que dispara o
     mesmo achado. Quem teve 1,5 copo de diferença no fim de semana — o
     limiar exato — pontuava igual a quem teve 5. Cada um destes achados
     JÁ CALCULA essa diferença, para escrever a frase, e jogava fora o
     número logo depois.

     ⚠️ AUSENTE NÃO É ZERO: é "não é descoberta". Os dois retratos do fim
     da fila (ritmo, adesão) não têm limiar nenhum para passar — eles
     descrevem um número que a pessoa já vê na Home. Sem `forca` eles
     seguem valendo para a aba, e a Home sabe que não são para ela. Um
     valor padrão aqui seria número inventado com cara de nota. */
  forca?: number;
  /* Por que o fenômeno acontece. Só os achados de maior surpresa têm —
     são os candidatos a virar a matéria da semana, e matéria precisa de
     um meio entre a manchete e a conclusão. Nos demais, explicar o
     mecanismo alongaria sem acrescentar. */
  porque?: string;
};

export const PAT_LABEL = (): Record<PatKey, string> => ({
  alimentacao: T.cruzamentos.catAlimentacao, sono: T.cruzamentos.catSono,
  sintomas: T.cruzamentos.catSintomas, peso: T.cruzamentos.catPeso,
  aplicacoes: T.cruzamentos.catAplicacoes,
});

/* ============================================================
   OS CRUZAMENTOS QUE TÊM DUAS CARAS

   Um achado sobre o passado — "a sua hidratação cai aos domingos" — é o
   mesmo fato que uma antecipação sobre o futuro: no sábado, "amanhã é o
   dia em que ela cai". Mesma conta, duas frases, e quem escolhe é a tela.

   Por isso estes dois saíram de dentro do `patterns()`: lá dentro a conta
   virava frase na mesma linha e o número morria ali. Quem quisesse a
   outra cara teria de calcular de novo — que é como as duas versões
   passam a discordar.

   ⚠️ E O FILTRO DE `typeof` VEIO JUNTO, porque ele faltava aqui. Os
   check-ins antigos guardam exercício e proteína e mais nada; um
   `undefined` no meio fazia a média virar NaN, e NaN perde toda
   comparação em silêncio — o achado simplesmente nunca aparecia. O
   `insights()` tinha esse filtro e um comentário explicando; o
   `patterns()`, que é o que vai para a tela, não tinha.
   ============================================================ */

export const NOMES_DIA = () => T.cruzamentos.nomesDia;

/** O dia da semana em que a hidratação cai, quando existe um que caia o
    bastante para ser dito. */
export function diaFracoDeAgua(S: State) {
  const porDia: Record<number, number[]> = {};
  (S.checkins as any[]).forEach((c) => {
    if (typeof c.agua !== 'number') return;
    (porDia[new Date(c.t).getDay()] = porDia[new Date(c.t).getDay()] || []).push(c.agua);
  });
  const media = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
  let dia: number | null = null, dele = Infinity;
  for (const [k, arr] of Object.entries(porDia)) {
    const m = media(arr);
    if (m < dele) { dele = m; dia = +k; }
  }
  if (dia === null) return null;
  const resto = (S.checkins as any[]).filter((c) => typeof c.agua === 'number' && new Date(c.t).getDay() !== dia).map((c) => c.agua as number);
  if (!resto.length) return null;
  const outros = media(resto);
  return outros - dele >= 1 ? { dia, dele, outros, nome: NOMES_DIA()[dia] } : null;
}

/** A janela de enjoo depois da aplicação: quanto ele pesa nos dois
    primeiros dias contra o resto do ciclo. */
export function janelaDoEnjoo(S: State) {
  const diasInj = (S.injections as any[]).map((i) => +startOfDay(new Date(i.t)));
  if (!diasInj.length) return null;
  const desde = (c: any) => {
    const dia = +startOfDay(new Date(c.t));
    const ds = diasInj.filter((x) => x <= dia).map((x) => (dia - x) / DAY);
    return ds.length ? Math.min(...ds) : 99;
  };
  const com = (S.checkins as any[]).filter((c) => typeof c.nausea === 'number');
  const perto = com.filter((c) => desde(c) <= 2);
  const longe = com.filter((c) => desde(c) > 2 && desde(c) < 99);
  if (perto.length < 2 || longe.length < 2) return null;
  const media = (a: any[]) => a.reduce((s, c) => s + c.nausea, 0) / a.length;
  const ePerto = media(perto), eLonge = media(longe);
  return ePerto - eLonge >= 0.5 ? { perto: ePerto, longe: eLonge, dias: perto.length } : null;
}

/** A nota que ordena a lista: a surpresa manda, e a força decide dentro
    dela.

    `surpresa * forca` puro seria cruel — um cruzamento que raspou no
    limiar zeraria e empataria com os retratos, e um cruzamento fraco
    ainda é mais interessante que "seu ritmo é de 0,7 kg por semana".
    Meio a meio deixa a força mexer meia banda: um achado de surpresa 2
    com evidência forte (2,0) passa na frente de um de surpresa 3 que
    raspou (1,5), e é isso mesmo que deve acontecer. */
export const nota = (p: Pattern) => p.surpresa * (0.5 + 0.5 * (p.forca ?? 0));

/** Quanto uma evidência passou do limiar que a deixou entrar: 0 quando
    raspou, 1 quando dobrou. É a régua que separa o achado forte do achado
    que só não foi barrado. */
const forcaDe = (medido: number, limiar: number) =>
  Math.max(0, Math.min(1, (medido - limiar) / limiar));

/* ⚠️ `cat` ERA O MESMO FATO QUE `key`, ESCRITO DE NOVO. Onze achados
   traziam o par à mão — `key: 'sono', cat: 'Sono'` — e nada garantia que
   os dois continuassem combinando; bastava traduzir um e esquecer o
   outro. O rótulo agora sai de um lugar só. */
const daCategoria = (key: PatKey) => ({ key, cat: PAT_LABEL()[key] });

export function patterns(S: State): Pattern[] {
  const out: Pattern[] = [];
  const cs = S.checkins as any[];
  const med = (arr: number[]) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0);

  /* --- o fim de semana como outro tratamento ---
     Cruza três variáveis de uma vez. Ninguém percebe isso olhando um dia
     por vez: é preciso agrupar 13 check-ins por tipo de dia. */
  const fds = cs.filter((c) => [0, 6].includes(new Date(c.t).getDay()));
  const uteis = cs.filter((c) => ![0, 6].includes(new Date(c.t).getDay()));
  let fdsDito = false;
  if (fds.length >= 2 && uteis.length >= 3) {
    const dAgua = med(uteis.map((c) => c.agua)) - med(fds.map((c) => c.agua));
    const dProt = med(uteis.map((c) => c.prot)) - med(fds.map((c) => c.prot));
    const dSono = med(fds.map((c) => c.sono)) - med(uteis.map((c) => c.sono));
    if (dAgua >= 1.5) {
      fdsDito = true;
      const F = T.cruzamentos.fimDeSemana;
      const copos = nf(dAgua, 1);
      /* a proteína só entra na frase quando a diferença é grande o
         bastante para significar alguma coisa — 5 g de gap não sustentam
         uma manchete, e achado que exagera o dado deixa de ser achado */
      const prot = dProt >= 8 ? F.textoProteina(Math.round(dProt)) : '';
      const sono = dSono >= 0.4 ? F.textoSono(nf(dSono, 1)) : F.textoSemSono;
      out.push({
        ...daCategoria('alimentacao'), ic: 'cal', cor: 'water', surpresa: 3, forca: forcaDe(dAgua, 1.5),
        titulo: F.titulo,
        texto: F.texto(copos, prot, sono),
        q: F.q,
        evid: F.evid(copos),
        porque: F.porque,
        significa: F.significa,
      });
    }
  }

  /* --- água por dia da semana --- */
  /* se o card do fim de semana já falou disso, este vira eco: dois cards
     dizendo a mesma coisa gastam a confiança que o primeiro construiu */
  const fraco = diaFracoDeAgua(S);
  if (fraco && !(fdsDito && [0, 6].includes(fraco.dia))) {
    const { dele: piorMedia, outros } = fraco;
    const A = T.cruzamentos.aguaDia;
    const pior = piorMedia.toFixed(0), rest = outros.toFixed(0);
    out.push({
      ...daCategoria('alimentacao'), ic: 'water', cor: 'water', surpresa: 2, forca: forcaDe(outros - piorMedia, 1),
      titulo: A.titulo(fraco.nome),
      texto: A.texto(pior, rest),
      q: A.q,
      evid: A.evid(pior, rest),
      significa: A.significa,
    });
  }

  /* --- proteína de hoje contra fome de amanhã ---
     A relação está a um dia de distância, então some no gráfico diário:
     a pessoa vê a fome de hoje ao lado do prato de hoje, nunca do de ontem. */
  const t: any = S.profile.targets;
  const seq = cs.slice(0, -1).map((c, i) => ({ prot: c.prot, fomeDepois: cs[i + 1].fome }));
  const bateu = seq.filter((p) => p.prot >= t.prot), naoBateu = seq.filter((p) => p.prot < t.prot);
  if (bateu.length >= 2 && naoBateu.length >= 2) {
    const fSim = med(bateu.map((p) => p.fomeDepois)), fNao = med(naoBateu.map((p) => p.fomeDepois));
    if (fNao - fSim >= 0.5) out.push({
      ...daCategoria('alimentacao'), ic: 'leaf', cor: 'lime', surpresa: 3, forca: forcaDe(fNao - fSim, 0.5),
      titulo: T.cruzamentos.proteinaFome.titulo,
      texto: T.cruzamentos.proteinaFome.texto(t.prot, nf(fSim, 1), nf(fNao, 1)),
      q: T.cruzamentos.proteinaFome.q,
      evid: T.cruzamentos.proteinaFome.evid(nf(fNao - fSim, 1)),
      porque: T.cruzamentos.proteinaFome.porque,
      significa: T.cruzamentos.proteinaFome.significa,
    });
  }

  /* --- sono contra fome do dia seguinte --- */
  const pares = cs.slice(0, -1).map((c, i) => ({ sono: c.sono, fomeDepois: cs[i + 1].fome }));
  const bem = pares.filter((p) => p.sono >= 7), mal = pares.filter((p) => p.sono < 7);
  if (bem.length >= 2 && mal.length >= 2) {
    const fBem = med(bem.map((p) => p.fomeDepois)), fMal = med(mal.map((p) => p.fomeDepois));
    if (fMal - fBem >= 0.5) out.push({
      ...daCategoria('sono'), ic: 'moon', cor: 'purple', surpresa: 3, forca: forcaDe(fMal - fBem, 0.5),
      titulo: T.cruzamentos.sonoFome.titulo,
      texto: T.cruzamentos.sonoFome.texto(nf(fBem, 1), nf(fMal, 1)),
      q: T.cruzamentos.sonoFome.q,
      evid: T.cruzamentos.sonoFome.evid,
      porque: T.cruzamentos.sonoFome.porque,
      significa: T.cruzamentos.sonoFome.significa,
    });
  }

  /* --- sono contra enjoo do dia seguinte ---
     ⚠️ ESTE ACHADO VEIO DO `insights()`, QUE MORREU. Ele nasceu hoje de
     manhã, no lugar de uma frase que afirmava exatamente isto sem ter
     calculado nada, e o motor da Home passou a ler o `patterns()` — que é
     onde um achado ganha evidência, porquê e significado em vez de uma
     linha solta.

     ⚠️ A EXIGÊNCIA AQUI É MAIOR QUE A DOS VIZINHOS: sete noites de cada
     lado, contra as duas ou três que os outros pedem. Não é capricho —
     é o único achado da lista que liga sono a um SINTOMA CLÍNICO, e
     errar nele não custa um conselho ruim sobre água, custa fazer alguém
     concluir que o enjoo dela é culpa de ter dormido mal. */
  const sn = enjooAposDormir(S);
  if (sn) {
    const bem = nf(sn.bem, 1), mal = nf(sn.mal, 1);
    out.push({
      ...daCategoria('sintomas'), ic: 'moon', cor: 'purple', surpresa: 3,
      forca: forcaDe(sn.mal - sn.bem, DIF_MINIMA),
      titulo: T.cruzamentos.sonoEnjoo.titulo,
      texto: T.cruzamentos.sonoEnjoo.texto(SONO_REF_H, bem, mal),
      q: T.cruzamentos.sonoEnjoo.q,
      evid: T.cruzamentos.sonoEnjoo.evid(bem, mal, sn.noites),
      significa: T.cruzamentos.sonoEnjoo.significa,
    });
  }

  /* --- enjoo: onde ele começa e onde termina ---
     O achado não é que existe enjoo — é que ele tem hora para acabar. */
  const jan = janelaDoEnjoo(S);
  if (jan) {
    const { perto: ePerto, longe: eLonge } = jan;
    out.push({
      ...daCategoria('sintomas'), ic: 'waves', cor: 'rose', surpresa: 2, forca: forcaDe(ePerto - eLonge, 0.5),
      titulo: T.cruzamentos.janelaEnjoo.titulo,
      texto: T.cruzamentos.janelaEnjoo.texto(nf(ePerto, 1), nf(eLonge, 1)),
      q: T.cruzamentos.janelaEnjoo.q,
      evid: T.cruzamentos.janelaEnjoo.evid,
      significa: T.cruzamentos.janelaEnjoo.significa(jan.dias),
    });
  }

  /* --- água contra enjoo ---
     Duas coisas que a pessoa registra em telas diferentes, e que só se
     encontram quando alguém cruza as duas colunas. */
  /* "BEBEU BEM" É COMPARADO COM OS PRÓPRIOS DIAS DELA, e não com a meta.

     O corte era um copo abaixo da meta, e a meta não tem nada a ver com a
     comparação que este achado faz. Quem nunca chega perto dela não tem
     nenhum dia "bem hidratado" — e o achado, que é sobre a VARIAÇÃO da
     pessoa, deixaria de existir justamente para quem mais precisava dele.

     A mediana dos dias registrados divide em dois grupos que sempre têm
     gente: os dias em que ela bebeu mais do que o próprio normal, e os em
     que bebeu menos. E só entram os dias que têm as DUAS colunas: cruzar
     água com enjoo num dia sem enjoo registrado é comparar com nada. */
  const comAgua = cs.filter((c) => typeof c.agua === 'number' && typeof c.nausea === 'number');
  const escala = comAgua.map((c) => c.agua as number).sort((a, b) => a - b);
  const corteAgua = escala.length ? escala[Math.floor(escala.length / 2)] : 0;
  const hidratados = comAgua.filter((c) => c.agua >= corteAgua);
  const secos = comAgua.filter((c) => c.agua < corteAgua);
  if (hidratados.length >= 3 && secos.length >= 3) {
    const eSim = med(hidratados.map((c) => c.nausea)), eNao = med(secos.map((c) => c.nausea));
    if (eNao - eSim >= 0.5) out.push({
      ...daCategoria('sintomas'), ic: 'water', cor: 'water', surpresa: 3, forca: forcaDe(eNao - eSim, 0.5),
      titulo: T.cruzamentos.aguaEnjoo.titulo,
      texto: T.cruzamentos.aguaEnjoo.texto(aguaTxt(S, corteAgua * CUP_ML), nf(eSim, 1), nf(eNao, 1)),
      q: T.cruzamentos.aguaEnjoo.q,
      evid: T.cruzamentos.aguaEnjoo.evid(nf(eNao - eSim, 1)),
      significa: T.cruzamentos.aguaEnjoo.significa,
    });
  }

  /* --- o platô que não impediu nada ---
     Contra-intuitivo por definição: a balança subiu e o resultado veio
     assim mesmo. É o padrão que evita abandono na semana ruim. */
  const ws = S.weights as any[];
  if (ws.length >= 5) {
    const subidas = ws.slice(1).filter((w, i) => w.kg > ws[i].kg).length;
    const total = ws[0].kg - ws[ws.length - 1].kg;
    if (subidas >= 1 && total > 0) out.push({
      ...daCategoria('peso'), ic: 'trend', cor: 'accent', surpresa: 3, forca: forcaDe(subidas, 1),
      titulo: T.cruzamentos.platoQueNaoImpediu.titulo(subidas, pesoTxt(S, total)),
      texto: T.cruzamentos.platoQueNaoImpediu.texto(ws.length, subidas),
      q: T.cruzamentos.platoQueNaoImpediu.q,
      evid: T.cruzamentos.platoQueNaoImpediu.evid(subidas, pesoTxt(S, total)),
      porque: T.cruzamentos.platoQueNaoImpediu.porque,
      significa: T.cruzamentos.platoQueNaoImpediu.significa,
    });
  }

  /* --- proteína: metade recente contra metade antiga --- */
  if (cs.length >= 8) {
    const meio = Math.floor(cs.length / 2);
    const antes = med(cs.slice(0, meio).map((x) => x.prot));
    const depois = med(cs.slice(meio).map((x) => x.prot));
    /* Mesma divisão por zero do achado curto da Home: `antes` é a média
       dos primeiros check-ins, e ela é 0 para quem só começou a registrar
       comida depois. `Math.abs(Infinity) >= 5` é verdade, e o título dizia
       "Sua proteína subiu Infinity% desde o começo". */
    const pct = antes > 0 ? Math.round(((depois - antes) / antes) * 100) : 0;
    const P = T.cruzamentos.proteinaTendencia;
    const de = Math.round(antes), para = Math.round(depois);
    if (Math.abs(pct) >= 5) out.push({
      ...daCategoria('alimentacao'), ic: 'flame', cor: 'lime', surpresa: 1, forca: forcaDe(Math.abs(pct), 5),
      titulo: P.titulo(pct > 0, Math.abs(pct)),
      texto: pct > 0 ? P.textoSubiu(para, de) : P.textoCaiu(para, de),
      q: P.q,
      evid: P.evid(pct, de, para),
      significa: pct > 0 ? P.significaSubiu : P.significaCaiu,
    });
  }

  /* --- os dois óbvios, no fim da fila --- */

  /* ⚠️⚠️ ESTES DOIS ERAM OS ÚNICOS SEM `if` EM VOLTA, e por isso eram os
     únicos que apareciam no primeiro dia — quando não há nada para
     dizer e eles diziam assim mesmo.

     A aba Insights abria, para quem tinha acabado de instalar o
     aplicativo, com o destaque:

         "Você manteve 0% das aplicações em dia
          São 0 aplicações desde o início do tratamento, com alguns
          atrasos pelo caminho."

     Zero de zero é 0%, e a frase seguinte fala dos atrasos dessa pessoa.
     Ela nunca teve uma aplicação marcada. Logo abaixo, "Seu ritmo é de
     0,0 kg por semana — dentro do esperado para a sua fase": um veredito
     sobre uma semana que não aconteceu.

     Os dois são RETRATO, não descoberta: descrevem um número que a
     pessoa já vê na Home. Retrato de nada é invenção, e por serem os
     últimos da fila ninguém reparava — só apareciam sozinhos, que é
     exatamente quando ninguém devia estar lendo. */

  const r = journeySummary(S);
  /* Ritmo POR SEMANA precisa de semanas: com uma pesagem não há ritmo, e
     com uma semana o número é o primeiro intervalo, não uma tendência. */
  const R = T.cruzamentos.ritmo;
  if (S.weights.length >= 3 && r.semana >= 2) out.push({
    ...daCategoria('peso'), ic: 'scale', cor: 'accent', surpresa: 0,
    titulo: R.titulo(r.ritmoLabel),
    texto: r.verdict.good
      ? R.textoBom(pesoTxt(S, r.lost), r.semana)
      : R.textoAtencao(pesoTxt(S, r.lost), r.semana),
    q: R.q,
    evid: R.evid(r.ritmoLabel, pesoTxt(S, r.lost), r.semana),
    significa: r.verdict.good ? R.significaBom : R.significaAtencao,
  });

  const ade = adesao(S);
  /* Três aplicações é o mínimo para a palavra "manteve" significar algo:
     com uma, a porcentagem é 0% ou 100% e nenhum dos dois é um hábito. */
  const D = T.cruzamentos.adesao;
  if (S.injections.length >= 3) out.push({
    ...daCategoria('aplicacoes'), ic: 'syringe', cor: 'accent2', surpresa: 0,
    titulo: ade >= 100 ? D.tituloPerfeita : D.titulo(ade),
    texto: D.texto(S.injections.length, ade >= 90 ? D.textoQuaseTodas : D.textoComAtrasos),
    q: D.q,
    evid: D.evid(ade, S.injections.length),
    significa: ade >= 90 ? D.significaAlta : D.significaBaixa,
  });

  /* o mais surpreendente primeiro — a ordem da tela é a ordem do valor */
  return out.sort((a, b) => nota(b) - nota(a));
}

/* ============================================================
   LEITURA DO EQUILÍBRIO

   O radar mostra oito eixos e não conclui nada — quem conclui é o
   paciente, que não sabe se 62% em proteína é bom. Aqui a IA lê o
   gráfico por ele: o gráfico vira ilustração de uma frase, não a frase.
   ============================================================ */
export function balanceRead(S: State) {
  const eixos = radar(S).slice().sort((a, b) => b.v - a.v);
  const fortes = eixos.slice(0, 2);
  const fraco = eixos[eixos.length - 1];
  /* amplitude entre o melhor e o pior eixo: é ela que diz se o
     tratamento está equilibrado ou apoiado numa perna só */
  const amp = eixos[0].v - fraco.v;

  /* Os dois cortes de amplitude são de CÓDIGO: 30 e 55 são onde eu
     decidi que a figura deixa de estar equilibrada. As frases que cada
     faixa produz são de textos/pt-BR/equilibrio. */
  const Q = T.equilibrio;
  const abertura = amp <= 30 ? Q.aberturaTudoBem
    : amp <= 55 ? Q.aberturaAtencao
      : Q.aberturaPreciso;

  const doisFortes = Q.par(fortes[0].k, fortes[1].k);
  const corpo = amp <= 30
    ? Q.corpoEquilibrado(doisFortes, fraco.k)
    : Q.corpoUmAtras(doisFortes, fraco.k);

  /* ⚠️ TRÊS CAMPOS SAÍRAM DAQUI, E NENHUM TINHA LEITOR: `media` (a média dos
     eixos, arredondada), `fortes` e `fracos`. A tela do balanço lê quatro
     coisas — abertura, texto, o eixo fraco e a pergunta — e é a única que
     chama esta função.

     `fortes` continua existindo como variável porque a FRASE usa os dois
     primeiros; o que saiu foi devolvê-los. */
  return {
    abertura,
    texto: corpo,
    /* A CHAVE e o RÓTULO, separados: a primeira vai buscar a série, o
       segundo aparece na tela. Eram a mesma string. */
    fraco: fraco.id,
    fracoNome: fraco.k,
    botao: Q.botaoMelhorar(fraco.k),
    q: Q.perguntaMelhorar(fraco.k),
    serieDe: (dias: number) => Q.serieDe(fraco.k, dias),
  };
}

/* O eixo mais fraco, dia a dia.

   O radar e as pétalas mostram a MÉDIA de cada indicador, e média esconde
   exatamente o que a leitura afirma: que aquele eixo "oscila". Duas
   semanas de 50 constante e duas semanas alternando 20 e 80 dão a mesma
   média e não são a mesma coisa. Aqui a série diária mostra a oscilação
   em vez de descrevê-la. */
/* null quando o dia não respondeu aquele eixo — a série pula o ponto em vez
   de desenhar um zero que ninguém disse. */
/* ⚠️ INDEXADO PELA CHAVE, E NÃO PELO NOME. Enquanto era 'Sono', esta
   tabela e a tela combinavam por acaso — as duas escreviam a mesma
   palavra em português. */
const EIXO_DIA: Record<string, (c: any, S: State) => number | null> = {
  sono: (c) => (respondido(c, 'sono') ? Math.min(100, (c.sono / 8) * 100) : null),
  energia: (c) => (respondido(c, 'energia') ? c.energia * 10 : null),
  humor: (c) => (respondido(c, 'mood') ? (c.mood / 5) * 100 : null),
  hidratacao: (c, S) => Math.min(100, ((c.agua || 0) / metaDeCopos(S)) * 100),
  exercicio: (c) => ((c.exerc || 0) > 0 ? 100 : 0),
  proteina: (c) => Math.min(100, c.prot || 0),
  saciedade: (c) => (respondido(c, 'fome') ? (10 - c.fome) * 10 : null),
  adesao: (_c, S) => adesao(S),
};

export function balanceSeries(S: State, eixo: string, n = 8) {
  const f = EIXO_DIA[eixo];
  const cs = (S.checkins as any[]).slice(-n);
  if (!f || !cs.length) return [];
  return cs
    .map((c) => ({ t: c.t, bruto: f(c, S) }))
    .filter((p): p is { t: number; bruto: number } => p.bruto != null)
    .map((p) => ({ t: p.t, v: Math.max(0, Math.min(100, Math.round(p.bruto))) }));
}

/* ============================================================
   OS SINTOMAS, LIDOS DEPOIS

   Um dia de check-in responde "como foi hoje". Três perguntas só a SÉRIE
   responde, e são as três que a pessoa leva para a consulta:

     · o que apareceu na semana, e em quantos dias
     · se isso acompanha o ciclo da dose
     · e o que dá para afirmar a partir disso

   A do meio é a que a tela de sintomas afirmava sem calcular. Havia um
   parágrafo fixo dizendo que a náusea se concentra nos dois primeiros
   dias depois da aplicação e que a fome faz o contrário. É o padrão
   típico — mas escrito com "seus registros" virava um achado sobre ESTA
   pessoa que ninguém tinha olhado. O app tem a data de cada aplicação e o
   grau de cada dia: dá para responder de verdade, e às vezes a resposta
   é "ainda não dá para dizer".
   ============================================================ */

/** Um sintoma na janela lida. `dias` são os dias em que ele apareceu. */
export type SintomaLido = {
  id: string; label: string;
  dias: number; pior: number; media: number;
  /** a frase da régua no pior grau — "enjoo constante", "dois dias sem ir" */
  legenda: string;
};

const janela = (S: State, n: number) => {
  const desde = +startOfDay(daysAgo(n - 1));
  return (S.checkins as any[]).filter((c) => c.t >= desde);
};

/* O DIA PASSOU PELA PERGUNTA DE SINTOMAS — mesmo que a resposta tenha
   sido "não tive nada".

   Não dá para usar `respostaNoDia` aqui: ela aceita o dia em que a pessoa
   respondeu só o sono, e nesse dia a náusea não é zero — é ausência. O
   check-in grava zero nas colunas e 'normal' no intestino quando nada é
   marcado, então a presença desses campos é a prova de que a pergunta foi
   feita e respondida. */
const respondeuSintomas = (c: any) => typeof c?.nausea === 'number' || c?.gut != null || !!c?.sint;

/** Dias da janela em que os sintomas foram respondidos — o denominador
    honesto. Sem ele, "náusea em 3 dias" esconde que só 4 foram respondidos. */
export function diasDeSintomas(S: State, n = 7) {
  return janela(S, n).filter(respondeuSintomas).length;
}

/** Os sintomas que apareceram nos últimos `n` dias, do mais presente. */
export function sintomasDaSemana(S: State, n = 7): SintomaLido[] {
  return sintomasEm(janela(S, n));
}

/* A MESMA LEITURA, sobre os dias que quem chama escolher.

   /sintomas pergunta pelos últimos sete; /semana pergunta por uma semana
   específica do tratamento, que pode ter acabado em abril. Era essa
   diferença de janela que justificava a segunda tela ter a sua própria
   conta — e com ela vieram uma régua de 0 a 10 na cara da pessoa, um
   "forte" que chamava de forte o que ela respondeu como leve, e o
   silêncio somado como zero. A janela é de quem chama; a régua, não. */
export function sintomasEm(cs: any[]): SintomaLido[] {
  const fora: SintomaLido[] = [];
  for (const s of SINTOMAS_LIDOS()) {
    const graus = cs.map((c) => grauDoSintoma(c, s.id)).filter((v): v is number => v != null);
    if (!graus.length) continue;
    const pior = Math.max(...graus);
    fora.push({
      id: s.id, label: s.label, dias: graus.length, pior,
      media: graus.reduce((a, b) => a + b, 0) / graus.length,
      legenda: s.regua[pior - 1] ?? '',
    });
  }
  /* Mais dias primeiro, e o grau desempata: o que incomodou a semana
     inteira vem antes do que foi forte num dia só. */
  return fora.sort((a, b) => b.dias - a.dias || b.pior - a.pior);
}

/* O SINTOMA AO LONGO DO CICLO DA DOSE.

   O dia do ciclo é a distância até a última aplicação: 0 é o dia de
   aplicar. Um dia respondido SEM o sintoma entra como zero e não sai da
   conta — o vale é metade do achado, e tirá-lo faria a média subir
   justamente nos dias em que o sintoma não apareceu. */
export function sintomaNoCiclo(S: State, id = 'nausea') {
  const cad = cadenciaDias(S);
  const baldes = Array.from({ length: cad }, (_, dia) => ({ dia, dias: 0, soma: 0 }));
  const injs = (S.injections as any[]).map((i) => +startOfDay(new Date(i.t))).sort((a, b) => a - b);
  for (const c of S.checkins as any[]) {
    if (!respondeuSintomas(c)) continue;
    let ultima: number | null = null;
    for (const t of injs) { if (t <= c.t) ultima = t; else break; }
    if (ultima == null) continue;
    const d = Math.round((c.t - ultima) / DAY);
    if (d < 0 || d >= cad) continue;
    baldes[d].dias++;
    baldes[d].soma += grauDoSintoma(c, id) ?? 0;
  }
  return baldes.map((b) => ({ dia: b.dia, dias: b.dias, media: b.dias ? b.soma / b.dias : null }));
}

/* O PADRÃO, e a régua para poder afirmar que existe um.

   Três condições, e todas precisam valer: dias bastantes, quase todo o
   ciclo coberto, e um degrau inteiro de diferença entre o pior dia e o
   melhor. Sem isso a frase seria ruído de amostra pequena com cara de
   descoberta — e é uma frase que a pessoa leva para a consulta.

   Quando não dá para afirmar, devolve POR QUE não deu, porque as duas
   razões dizem coisas opostas à pessoa: "ainda são poucos dias" pede que
   ela continue respondendo, e "aparece parecido em todo o ciclo" já é uma
   resposta — a de que, nela, o sintoma não segue a dose. A régua fica
   aqui e não na tela: quem mostra não deveria poder discordar de quem
   calcula sobre quantos dias bastam. */
export type PadraoDoCiclo =
  | { pode: true; dias: number[]; alto: number; baixo: number; doInicio: boolean; doFim: boolean }
  | { pode: false; motivo: 'poucos' | 'parecido' };

export function padraoDoCiclo(S: State, id = 'nausea'): PadraoDoCiclo {
  const baldes = sintomaNoCiclo(S, id);
  const com = baldes.filter((b) => b.media != null) as { dia: number; dias: number; media: number }[];
  const total = com.reduce((a, b) => a + b.dias, 0);
  if (total < 10 || com.length < baldes.length - 1) return { pode: false, motivo: 'poucos' };
  const alto = Math.max(...com.map((b) => b.media));
  const baixo = Math.min(...com.map((b) => b.media));
  if (alto - baixo < 1) return { pode: false, motivo: 'parecido' };
  const corte = (alto + baixo) / 2;
  const dias = com.filter((b) => b.media >= corte).map((b) => b.dia).sort((a, b) => a - b);
  const seguido = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);
  return {
    pode: true, dias, alto, baixo,
    doInicio: seguido && dias[0] === 0,
    doFim: seguido && dias[dias.length - 1] === baldes.length - 1,
  };
}

/* ============================================================
   AS FAIXAS DE IMC

   Os cortes são os que a OMS usa para adultos — 18,5 / 25 / 30 / 35 / 40
   —, e são os mesmos que aparecem em qualquer relatório de consulta. Ficam
   numa tabela só porque mais de uma tela mostra IMC: três listas escritas
   à mão viram, mais cedo ou mais tarde, três classificações diferentes
   para o mesmo número.

   O QUE ELAS NÃO SABEM: o IMC não separa músculo de gordura, não sabe a
   idade de quem está na balança nem de onde veio o peso. Quem mostra a
   faixa mostra junto o que ela ignora — é o mesmo cuidado que as faixas de
   referência dos exames pedem.

   `tom` é o nome de um par de cores do tema, e não uma cor: a tela clara e
   a escura resolvem o mesmo nome em vermelhos diferentes.
   ============================================================ */
export type FaixaIMC = { de: number; ate: number; nome: string; tom: string };
export const FAIXAS_IMC = (): FaixaIMC[] => [
  { de: 15, ate: 18.5, nome: T.tratamento.imc.abaixo, tom: 'blue' },
  { de: 18.5, ate: 25, nome: T.tratamento.imc.normal, tom: 'ok' },
  { de: 25, ate: 30, nome: T.tratamento.imc.sobrepeso, tom: 'amber' },
  { de: 30, ate: 35, nome: T.tratamento.imc.grau1, tom: 'cta2' },
  { de: 35, ate: 40, nome: T.tratamento.imc.grau2, tom: 'cta' },
  { de: 40, ate: 45, nome: T.tratamento.imc.grau3, tom: 'cta' },
];
export const faixaDoIMC = (v: number) => {
  const f = FAIXAS_IMC();
  return f.find((x) => v < x.ate) ?? f[f.length - 1];
};
/* O ÍNDICE DA FAIXA, para quem desenha a régua. Era `FAIXAS_IMC.indexOf()`
   sobre o objeto devolvido por `faixaDoIMC` — comparação por identidade, que
   deixou de valer quando a tabela virou função. */
export const indiceDoIMC = (v: number) => {
  const f = FAIXAS_IMC();
  const i = f.findIndex((x) => v < x.ate);
  return i === -1 ? f.length - 1 : i;
};

/* ============================================================
   O PLANO DE PARTIDA — o que o app deriva do cadastro

   As metas diárias do app — proteína, água, movimento, gordura corporal
   — vinham fixas da semente: 90 g, 2,5 L, 60 min, 28%. Eram os números
   de UMA pessoa, lidos dez vezes cada um por telas que falam com outra.

   Aqui elas saem do que a pessoa acabou de contar. Não é conta de
   nutricionista e não substitui uma: é ponto de partida, e o perfil muda
   todas.

   ⚠️ PROCEDÊNCIA — os dois coeficientes são de uso corrente e NÃO foram
   conferidos contra diretriz brasileira vigente. Proteína a 1,2 g por
   quilo é o piso da faixa que se cita para preservação de massa magra em
   perda de peso (a faixa vai a 1,6, e o piso é escolha deliberada: errar
   para baixo num número que a pessoa vai perseguir todo dia é mais
   seguro do que errar para cima). Água a 35 ml por quilo é a regra de
   bolso mais comum. Antes disto chegar a alguém de verdade, as duas
   linhas precisam ser verificadas e esta marca, removida.

   E NÃO TEM CALORIA, de propósito. O app decidiu não contar caloria —
   /alimentacao tem uma seção inteira chamada "Por que proteína, e não
   caloria", e o argumento é que num tratamento de GLP-1 a fome cai
   sozinha e o risco deixa de ser comer demais. Uma meta diária de
   quilocaloria aqui contradiria isso na cara, e seria pior: o app não
   soma caloria de refeição nenhuma, então seria uma meta que nada no app
   consegue medir. Meta que ninguém lê é pior do que meta nenhuma.
   ============================================================ */
export type PlanoInicial = {
  imc: number;
  /** o IMC que a meta de peso representa, na mesma altura */
  imcMeta: number;
  /** quilocalorias por dia, já com o piso de segurança aplicado */
  kcal: number;
  /** o gasto estimado do dia, antes do déficit */
  gasto: number;
  /** o ritmo escolhido pedia menos caloria do que o piso — a meta parou nele */
  noPiso: boolean;
  /** gramas por dia */
  prot: number;
  carb: number;
  gord: number;
  fibra: number;
  /** mililitros por dia */
  agua: number;
  /** semanas até a meta, no ritmo escolhido; null quando não há o que perder */
  semanas: number | null;
  chegada: number | null;
};

/* O QUE TROUXE A PESSOA — as opções que os apps do ramo oferecem em
   comum, e a tradução do código guardado.

   Mora aqui, junto de ATIVIDADES e pelo mesmo motivo: a lista é do
   cadastro, mas quem lê o código guardado é o perfil. Duas cópias da
   mesma lista divergem no dia em que alguém acrescentar uma opção numa
   delas. */
export const MOTIVOS = (): { id: string; titulo: string; sub: string; ic: string }[] => {
  const m = T.tratamento.motivos;
  return [
    { id: 'saude', titulo: m.saude, sub: m.saudeSub, ic: 'heart' },
    { id: 'energia', titulo: m.energia, sub: m.energiaSub, ic: 'bolt' },
    { id: 'espelho', titulo: m.espelho, sub: m.espelhoSub, ic: 'camera' },
    { id: 'confianca', titulo: m.confianca, sub: m.confiancaSub, ic: 'spark' },
    { id: 'medico', titulo: m.medico, sub: m.medicoSub, ic: 'steth' },
  ];
};

/* OS QUATRO DEGRAUS DE ATIVIDADE, com o que cada um quer dizer em dias
   por semana — sem isso "levemente ativo" é autoavaliação, e cada pessoa
   se põe num degrau diferente.

   Mora aqui, e não na tela que pergunta, porque quem lê o índice é a
   conta de energia logo abaixo: a lista e o multiplicador são a mesma
   informação em duas formas, e separá-los é como um ganha um degrau que o
   outro não tem. */
export const ATIVIDADES = (): { id: string; titulo: string; sub: string }[] => {
  const a = T.tratamento.atividades;
  return [
    { id: 'sedentario', titulo: a.sedentario, sub: a.sedentarioSub },
    { id: 'leve', titulo: a.leve, sub: a.leveSub },
    { id: 'moderado', titulo: a.moderado, sub: a.moderadoSub },
    { id: 'muito', titulo: a.muito, sub: a.muitoSub },
  ];
};

/* Os multiplicadores clássicos de nível de atividade sobre o gasto de
   repouso, na ordem de ATIVIDADES. */
const FATOR_ATIVIDADE = [1.2, 1.375, 1.55, 1.725];
/* Um quilo de gordura corporal ≈ 7.700 kcal. É a conta que transforma o
   ritmo que a pessoa escolheu (kg por semana) em déficit por dia. */
const KCAL_POR_QUILO = 7700;

/* ============================================================
   A REPARTIÇÃO DA ENERGIA

   Mora fora de planoDoCadastro porque a tela de Alimentação precisa dela
   sem precisar do plano inteiro: quem já se cadastrou tem a meta de
   energia guardada no perfil, e os três gramas saem dela pela mesma
   conta que os escreveu na tela de plano. Duplicar a conta lá seria a
   maneira mais rápida de o app dizer 210 g de carboidrato num lugar e
   195 g no outro.

   Arredondados para cinco: o app vai escrever estes números como meta, e
   "96,4 g" afirma uma precisão que a conta não tem — ela nasce de uma
   regra de bolso sobre um peso digitado.
   ============================================================ */
export function macrosDe(kcal: number, prot: number): { gord: number; carb: number; fibra: number } {
  /* 28% da energia em gordura — o meio da faixa de 25 a 30% que as
     diretrizes repetem. Nove quilocalorias por grama. */
  const gord = Math.round((kcal * 0.28) / 9 / 5) * 5;
  /* O carboidrato é o que sobra. É a ordem certa: a proteína protege
     massa magra e tem alvo próprio, a gordura tem faixa, e o resto da
     energia vira carboidrato — e não o contrário. */
  const carb = Math.max(0, Math.round((kcal - prot * 4 - gord * 9) / 4 / 5) * 5);
  /* 14 g de fibra por 1.000 kcal é a ingestão adequada do Institute of
     Medicine, repetida na posição da Academy of Nutrition and Dietetics.
     Ela é proporcional à energia, e não ao peso. */
  const fibra = Math.round(((kcal / 1000) * 14) / 5) * 5;
  return { gord, carb, fibra };
}

export function planoDoCadastro(d: {
  altura: number; peso: number; meta: number; ritmo: number | null;
  /** 0 sedentário, 1 leve, 2 moderado, 3 muito ativo */
  atividade?: number;
  idade?: number;
  /** o que o cadastro sabe sobre o corpo — ver o bloco sobre a equação */
  sexo?: 'f' | 'm' | null;
}): PlanoInicial {
  const perder = d.peso - d.meta;
  const semanas = d.ritmo && perder > 0 ? Math.ceil(perder / d.ritmo) : null;
  const idade = d.idade ?? 40;

  /* ============================================================
     A ENERGIA DO DIA

     O APP PASSOU A CONTAR CALORIA, e isso é uma reversão de rumo que
     merece estar escrita aqui: /alimentacao tem uma seção chamada "Por
     que proteína, e não caloria", e o argumento dela continua de pé para
     o dia a dia — num tratamento de GLP-1 a fome cai sozinha, e contar
     caloria de cada refeição é trabalho que a maioria abandona na
     segunda semana. O que mudou é o ESCOPO: aqui a caloria não é um
     contador, é um ALVO — e é dele que saem carboidrato e gordura, que
     não existem de outra forma. Os dois são fatia de uma meta de
     energia; sem ela, gramas de carboidrato são chute com cara de conta.

     E AGORA ELE TEM LEITOR: /alimentacao soma a energia do prato do dia
     contra este alvo, e tira dele carboidrato, gordura e fibra por
     macrosDe. O contador de lá conta só o que veio da tabela de
     alimentos, e diz de quantas refeições ele não fala — contar caloria
     continua sendo coisa que a maioria abandona, e um total que finge
     saber o que não sabe seria pior do que não ter total.

     MIFFLIN-ST JEOR, porque é a que a Academy of Nutrition and Dietetics
     designou como padrão baseado em evidência para gasto de repouso, e a
     que mais vezes cai dentro de 10% do medido por calorimetria.

     O TERMO DE SEXO É O PONTO FRACO, e está dito em vez de escondido: a
     equação pede sexo biológico (+5 para homens, −161 para mulheres), e o
     cadastro pergunta como a pessoa se IDENTIFICA. Para quem respondeu
     "outro" ou "prefiro não informar", o termo usado é a média dos dois
     (−78), que erra menos do que escolher um. Para quem respondeu
     feminino ou masculino, a identidade é usada como aproximação do
     corpo — o que é aproximação mesmo, e não verdade.
     ============================================================ */
  const tmb = 10 * d.peso + 6.25 * (d.altura * 100) - 5 * idade
    + (d.sexo === 'm' ? 5 : d.sexo === 'f' ? -161 : -78);
  const gasto = tmb * FATOR_ATIVIDADE[d.atividade ?? 0];
  const deficit = d.ritmo && perder > 0 ? (d.ritmo * KCAL_POR_QUILO) / 7 : 0;

  /* O PISO EXISTE PORQUE O RITMO NÃO TEM TETO NA TELA DE ESCOLHA.

     O app deixa escolher até 2 kg por semana, e 2 kg por semana são 2.200
     kcal de déficit por dia — mais do que o gasto inteiro de muita gente.
     Sem piso, a tela de plano escreveria "coma 300 kcal por dia" com toda
     a calma do mundo, e isso é dano.

     1.200 para mulheres e 1.500 para homens é a linha que o NHS marca
     como o mínimo sem acompanhamento médico. Na dúvida sobre o corpo, o
     piso mais alto: errar para mais comida é o erro que não machuca. */
  const piso = d.sexo === 'f' ? 1200 : 1500;
  const bruto = gasto - deficit;
  const kcal = Math.max(piso, Math.round(bruto / 10) * 10);

  const prot = Math.round((d.peso * 1.2) / 5) * 5;
  const { gord, carb, fibra } = macrosDe(kcal, prot);

  return {
    imc: d.peso / (d.altura ** 2),
    imcMeta: d.meta / (d.altura ** 2),
    kcal,
    gasto: Math.round(gasto / 10) * 10,
    noPiso: bruto < piso,
    prot,
    carb,
    gord,
    fibra,
    /* A ÁGUA SOBE COM O QUANTO A PESSOA SE MEXE, E CAI COM A IDADE.

       35 ml por quilo é a referência para adultos até uns 55 anos; de 56
       a 65 a faixa citada cai para 30, e daí em diante para 25 — a
       necessidade por quilo diminui e a sede fica menos confiável, o que
       faz uma meta alta demais virar cobrança sem função. Quem treina
       perde mais líquido, e o acréscimo por nível de atividade é modesto
       de propósito: é ponto de partida.

       São as duas perguntas — nascimento e atividade física — virando
       conta. É esse o critério para uma pergunta existir no cadastro. */
    agua: Math.round(
      (d.peso * (idade <= 55 ? 35 : idade <= 65 ? 30 : 25)
        + [0, 100, 250, 400][d.atividade ?? 0]) / 100,
    ) * 100,
    /* A META DE GORDURA CORPORAL CONTINUA FORA DAQUI.

       Ela dependia do sexo biológico — 28% é a ponta saudável para
       mulheres, 20% para homens — e o cadastro pergunta identidade. A
       equação de energia usa identidade como aproximação porque o erro
       ali é de algumas dezenas de quilocalorias num alvo que já é
       estimativa; um alvo de composição corporal é outra ordem de
       afirmação, e continua vindo do padrão do app até haver de onde
       tirar. */
    semanas,
    chegada: semanas ? +addDays(startOfDay(now()), semanas * 7) : null,
  };
}

/* ============================================================
   O PLANO A PARTIR DO PERFIL

   A mesma conta do cadastro, alimentada pelo que ficou guardado. Serve
   duas telas: a porta /plano, que mostra o plano sem refazer o
   formulário, e a meta de energia de quem se cadastrou antes de existir
   um campo para ela.

   É por aqui que a conta continua UMA SÓ. A alternativa — cada tela
   remontando os argumentos de planoDoCadastro do seu jeito — é a receita
   conhecida para duas telas do mesmo app discordarem sobre quantas
   calorias a pessoa deve comer.
   ============================================================ */
export function planoDoPerfil(S: State): PlanoInicial {
  const p: any = S.profile;
  const nivel = Math.max(0, ATIVIDADES().findIndex((x) => x.id === p.atividade));
  return planoDoCadastro({
    altura: p.height,
    peso: curWeight(S),
    meta: p.goalWeight,
    ritmo: typeof p.ritmo === 'number' ? p.ritmo : null,
    atividade: nivel,
    idade: idadeDe(S) ?? undefined,
    sexo: p.identidade === 'f' ? 'f' : p.identidade === 'm' ? 'm' : null,
  });
}

/* AS METAS DE COMIDA DO DIA, num lugar só.

   A proteína vem do perfil porque é editável — o app tem uma tela onde
   se muda a meta, e uma conta que ignorasse a edição faria a pessoa ver
   dois alvos diferentes para a mesma coisa. A energia vem do perfil
   quando ela foi gravada no cadastro, e da conta quando não foi: quem
   entrou antes de a tela de plano existir não tem o campo, e é melhor
   derivar dos mesmos dados dela do que mostrar um espaço vazio.

   E carboidrato, gordura e fibra NUNCA são guardados. Eles são fatia da
   energia; guardá-los seria criar quatro números que podem divergir do
   quinto assim que alguém mexer nele. */
export function metasDoDia(S: State): { kcal: number; prot: number; carb: number; gord: number; fibra: number } {
  const t: any = S.profile.targets;
  const prot = t.prot as number;
  const kcal = typeof t.kcal === 'number' ? t.kcal : planoDoPerfil(S).kcal;
  return { kcal, prot, ...macrosDe(kcal, prot) };
}

/* O QUE O PRATO DO DIA ENTREGOU, além da proteína.

   Só entra refeição cujo prato está montado com alimentos da tabela — a
   estimativa da foto responde por proteína, e nada mais. `fora` conta as
   refeições que ficaram de fora inteiras ou pela metade, para a tela
   poder dizer de quantas essa soma NÃO fala. Sem esse número, um dia de
   três refeições estimadas apareceria como 0 kcal, e zero ali seria
   mentira: a pessoa comeu. */
export function energiaDoDia(S: State, t: number) {
  const refeicoes = refeicoesDoDia(S, t);
  const soma = { kcal: 0, carb: 0, gord: 0, fibra: 0, fora: 0, refeicoes: refeicoes.length };
  for (const m of refeicoes) {
    const itens = (m.itens || []) as ItemComida[];
    if (!itens.length) { soma.fora++; continue; }
    const n = nutrientesDe(itens);
    if (n.fora > 0 || n.contados === 0) soma.fora++;
    soma.kcal += n.kcal;
    soma.carb += n.carb;
    soma.gord += n.gord;
    soma.fibra += n.fibra;
  }
  return soma;
}

/* ============================================================
   MEMÓRIA DO COMPANION

   A frase que prova que ele conhece esta pessoa e não uma qualquer.
   "Leu 51 registros" é verdadeiro mas soa a contador; o que constrói
   confiança é a extensão do que ele acompanha — desde quando, e o quê.

   O índice sai da quantidade de check-ins, e não de sorteio: a frase
   muda quando a jornada muda, não a cada vez que a tela desenha.
   ============================================================ */
export function companionMemoria(S: State): string {
  const dias = diffDays(now(), new Date(S.profile.startT));
  const semanas = Math.max(1, Math.floor(dias / 7));
  const nInj = S.injections.length;
  const nCheck = S.checkins.length;

  const M = T.companion.memoria;
  const frases = [
    M.desdeAPrimeira(dias),
    M.desdeOPrimeiroDiaComSemanas(semanas),
    M.desdeOPrimeiroDia,
    M.dosesAtras(nInj),
  ];
  return frases[nCheck % frases.length];
}

/* ============================================================
   BIBLIOTECA CONTEXTUAL

   Não é catálogo. Cada leitura entra porque alguma coisa no estado da
   pessoa a puxou — a fase do ciclo, um sintoma, a consulta marcada — e
   o motivo aparece no card. Conteúdo sem motivo visível vira blog.
   ============================================================ */
export type Leitura = { motivo: string; titulo: string; desc: string; ic: string; min: number };

export function libraryPicks(S: State): Leitura[] {
  const L = T.companion.biblioteca;
  const out: Leitura[] = [];
  const cyc = doseCycle(S);
  const ci: any = checkinToday(S);
  const cs = S.checkins as any[];
  const r = journeySummary(S);
  const m = M(S);

  const dia = Math.max(0, cadenciaDias(S) - diasAteAplicar(S));

  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') {
    out.push({ motivo: L.fomeMotivo(dia), titulo: L.fomeTitulo, desc: L.fomeDesc(m.mol.toLowerCase()), ic: 'drop2', min: 3 });
  }
  if (cyc.phase.key === 'aplic' || cyc.phase.key === 'pico') {
    out.push({ motivo: L.primeirosMotivo(dia), titulo: L.primeirosTitulo, desc: L.primeirosDesc, ic: 'dose', min: 3 });
  }

  const enjoo = cs.slice(-5).reduce((s, c) => s + c.nausea, 0) / Math.max(1, Math.min(5, cs.length));
  if (enjoo >= 2 || (ci && ci.nausea >= 4)) {
    const dias = cs.slice(-7).filter((c) => c.nausea >= 3).length;
    out.push({ motivo: L.enjooMotivo(dias), titulo: L.enjooTitulo, desc: L.enjooDesc, ic: 'waves', min: 4 });
  }

  const t: any = S.profile.targets;
  const protMed = cs.length ? cs.reduce((s, c) => s + c.prot, 0) / cs.length : 0;
  if (protMed < t.prot) {
    out.push({ motivo: L.proteinaMotivo(Math.round(t.prot - protMed)), titulo: L.proteinaTitulo, desc: L.proteinaDesc, ic: 'flame', min: 5 });
  }

  const sonoMed = cs.length ? cs.reduce((s, c) => s + c.sono, 0) / cs.length : 0;
  if (sonoMed < 7) {
    out.push({ motivo: L.sonoMotivo(nf(sonoMed, 1)), titulo: L.sonoTitulo, desc: L.sonoDesc, ic: 'moon', min: 4 });
  }

  if (r.semana >= 8) {
    out.push({ motivo: L.plateauMotivo(r.semana, pesoTxt(S, r.lost)), titulo: L.plateauTitulo, desc: L.plateauDesc, ic: 'journey', min: 6 });
  }

  if (temConsulta(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 14) out.push({ motivo: L.consultaMotivo(cd), titulo: L.consultaTitulo, desc: L.consultaDesc, ic: 'steth', min: 3 });
  }

  return out.slice(0, 4);
}

/* Perguntas que a pessoa já fez — a conversa continua entre sessões em vez
   de recomeçar do zero toda vez que a aba abre. */
export function recentQuestions(S: State): string[] {
  const a = ((S as any).asked || []) as { t: number; q: string }[];
  return [...new Set(a.slice().reverse().map((x) => x.q))].slice(0, 3);
}

/* Sugestões para o Morphi — o que faz sentido perguntar AGORA.

   Pergunta sugerida é a porta de entrada da IA: se ela vier genérica
   ("Como está minha evolução?" sempre), a inteligência não se prova. As
   duas primeiras saem do momento do tratamento; as outras cobrem o que a
   pessoa costuma querer saber. */
export function companionSuggestions(S: State): string[] {
  const out: string[] = [];
  const cyc = doseCycle(S);
  const nd = diasAteAplicar(S);
  const ci: any = checkinToday(S);

  const P = T.rotina.perguntas;
  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') out.push(P.maisFome);
  else if (cyc.phase.key === 'pico') out.push(P.semFome);
  else if (cyc.phase.key === 'aplic') out.push(P.depoisDaAplicacao);

  if (ci && ci.nausea >= 5) out.push(P.diminuirEnjoo);
  if (nd <= 2) out.push(P.trocarODia);

  const a1c = examBy(S, 'HbA1c');
  if (a1c && a1c.values.length >= 2) out.push(P.meusExames);

  out.push(P.meuProgresso);
  if (temAcompanhamento(S)) out.push(P.prepararConsulta);

  /* sem repetir e no máximo quatro — lista longa vira menu, não conversa */
  return [...new Set(out)].slice(0, 4);
}

/* Recomendações — o que fazer com o que foi encontrado. Saem da fase do
   ciclo e do que está em aberto, não de conselho genérico. */
/* Cada ação carrega o PORQUÊ e o PRAZO REAL, não um balde genérico.

   "Esta semana: agendar exame" é lista de tarefas. "Daqui a 9 dias:
   prepare perguntas para a consulta" é alguém organizando a agenda de
   outra pessoa — e a diferença toda está em o prazo ser calculado a
   partir do dado, não escolhido entre duas opções fixas. */
export type Reco = {
  /* ordem cronológica real, em dias — é ela que agrupa e ordena */
  emDias: number;
  ic: string;
  /* ⚠️ O IMPERATIVO AQUI É DE PROPÓSITO — "Beba mais água ainda hoje",
     "Separe a caneta", "Peça a renovação". Numa varredura atrás de texto
     que cobra a pessoa, esta lista aparece inteira e parece o pior
     achado do aplicativo; não é.

     Cobrança é o aplicativo julgando o que já passou. Isto é o formato de
     uma lista de tarefas, e é o que a pessoa abriu a tela para ver: ela
     veio aqui perguntando o que fazer. Trocar por substantivo — "mais um
     copo hoje" — não deixa o texto mais gentil, deixa a sugestão mais
     tímida, e uma sugestão tímida numa lista de quatro vira decoração.

     O que NÃO pode ser imperativo é o `porque` logo abaixo: lá mora o
     fato, e fato com verbo de ordem vira sermão. */
  texto: string;
  /* a razão de a IA estar sugerindo isso agora */
  porque: string;
  to: string;
};

export function recommendations(S: State): Reco[] {
  const E = T.rotina.empurroes;
  const out: Reco[] = [];
  const cyc = doseCycle(S);
  const nd = diasAteAplicar(S);
  const t: any = S.profile.targets;
  const cs = S.checkins as any[];
  const recentes = cs.slice(-4);
  const enjoo = recentes.length ? recentes.reduce((s, c) => s + c.nausea, 0) / recentes.length : 0;

  if (waterMlToday(S) < t.waterMl * 0.6) {
    out.push({
      emDias: 0, ic: 'water', texto: E.agua,
      /* ⚠️ O MOTIVO ERA UM DÉFICIT COM O NOME DA PESSOA NA FRENTE.

         "Você está abaixo da metade da meta" põe o sujeito no lugar de
         quem falhou, e é o único desta lista com essa forma: os vizinhos
         dizem "restam 3 doses na caneta", "a aplicação da semana está
         chegando", "você está na fase do ciclo em que a fome volta" —
         fatos sobre a caneta, sobre a agenda, sobre o ciclo.

         O que falta de água é fato do dia, não defeito de caráter: "o dia
         está na metade da meta" diz o mesmo e aponta para o copo. */
      porque: enjoo >= 2 ? E.aguaPorqueComEnjoo : E.aguaPorque,
      to: '/medir-agua',
    });
  }
  if (cyc.phase.key === 'retorno' || cyc.phase.key === 'pre') {
    out.push({
      emDias: 0, ic: 'leaf', texto: E.proteina,
      porque: E.proteinaPorque,
      to: '/medir-refeicao',
    });
  }
  if (!checkinFeito(S)) {
    out.push({
      emDias: 0, ic: 'check', texto: E.checkin,
      porque: E.checkinPorque,
      to: '/checkin',
    });
  }

  if (nd >= 0 && nd <= 3) {
    out.push({
      emDias: nd, ic: 'syringe',
      texto: E.aplicacao(`${oA(formaDe(S))} ${FORMAS[formaDe(S)].recipiente}`),
      porque: E.aplicacaoPorque,
      to: '/aplicacoes',
    });
  }
  const p = penStock(S);
  if (!p.verdict.good) {
    out.push({
      emDias: Math.max(1, p.left * 7 - 7), ic: 'pill', texto: E.receita,
      porque: E.receitaPorque(`${p.left} doses ${noNa(formaDe(S))}`),
      to: '/aplicacoes',
    });
  }
  const exame = exameNoProtocolo(S);
  if (exame) out.push({
    emDias: 5, ic: 'doc', texto: exame,
    porque: E.examePorque,
    to: '/exames',
  });
  if (temConsulta(S)) {
    const cd = diffDays(new Date(S.consult.t), now());
    if (cd >= 0 && cd <= 14) out.push({
      emDias: cd, ic: 'cal', texto: E.consulta,
      porque: E.consultaPorque(S.consult.type, S.consult.doctor),
      to: '/consultas',
    });
  }
  return out.sort((a, b) => a.emDias - b.emDias);
}

/* O rótulo do grupo sai do prazo, e o prazo sai do dado. */
export function recoBucket(d: number): string {
  const P = T.rotina.prazo;
  if (d <= 0) return P.hoje;
  if (d === 1) return P.amanha;
  if (d <= 7) return P.estaSemana;
  return P.daquiA(d);
}

/* ============================================================
   HOME V2 — metas diárias e cartões de evolução (Figma 181:1869)
   ============================================================ */

/** Um copo de água = 250 ml. O check-in continua contando copos;
    a Home exibe em litros, que é como o desenho fala. */
export const CUP_ML = 250;

/* A ÁGUA QUE VEIO DO PRATO, num dia.

   Só de refeição que a pessoa registrou como comida: a que nasceu de uma
   bebida (`fonte: 'bebida'`) já foi contada como gole, e contá-la de novo
   faria o copo de leite entrar duas vezes no mesmo total. */
export function aguaDaComida(S: State, t: number): number {
  return refeicoesDoDia(S, t)
    .filter((m: any) => m.fonte !== 'bebida')
    .reduce((x, m: any) => x + aguaDe((m.itens || []) as ItemComida[]), 0);
}

/** Tudo o que hidratou naquele dia: o que foi bebido mais o que veio no prato. */
export function aguaDoDia(S: State, t: number): number {
  const c = (S.checkins as any[]).find((x) => x.t === t);
  return Math.round((c?.agua || 0) * CUP_ML) + aguaDaComida(S, t);
}

/* O TOTAL DE HOJE, que é o que a capa e a Home mostram. */
export const waterMlToday = (S: State) => aguaDoDia(S, +startOfDay(now()));

/* COMO O APP ESCREVE UM VOLUME: em litros, e sem zero à toa no fim —
   "2,5", "1,75", "0,25", "1". Duas telas falam de água, e enquanto cada
   uma tinha o próprio formatador elas escreviam o mesmo copo de jeitos
   diferentes a dois toques de distância.

   Sem arredondar para uma casa: 1,75 L arredondado vira 1,8 L, e um
   número que a pessoa não registrou aparecendo no lugar do que ela
   registrou é caro demais para o pouco que economiza de largura.

   A unidade não vem junto de propósito — quem escreve o "L" é a frase,
   que às vezes quer "de 2,5 L hoje" e às vezes só o número. */
/* ⚠️ A VÍRGULA SAIU DAQUI, e a função ficou. Ela era posta à mão — e a
   mesma regra vivia também dentro do `aguaN` de logic/medidas, que
   trazia no comentário a frase "era o litros de derive": o aviso de que a
   cópia existia, deixado por quem a fez. As duas agora chamam
   `numeroEnxuto`, em logic/local, que é onde se sabe qual é o separador
   do idioma. */
export const litros = (ml: number) => numeroEnxuto(ml / 1000, 2);


export type DailyTarget = {
  key: 'prot' | 'agua' | 'exerc';
  label: string;
  /* valor e unidade são dois elementos, nunca uma string só — mantém a
     coluna de números alinhada entre os três cards. */
  num: string; unit: string;
  maxLabel: string;
  cur: number; target: number; pct: number;
  remain: string; done: boolean;
  from: string; to: string;   // chaves da Palette p/ o gradiente da barra
};

/* As três metas do dia. Vêm do check-in de hoje contra profile.targets —
   quando não há check-in, tudo zera (e não some da tela: a meta continua
   valendo, só não foi cumprida ainda). */
export function dailyTargets(S: State): DailyTarget[] {
  const t: any = S.profile.targets;
  const ci: any = checkinToday(S);
  const prot = ci ? ci.prot : 0;
  const ml = waterMlToday(S);
  const ex = ci ? ci.exerc : 0;
  const mk = (
    key: DailyTarget['key'], label: string, cur: number, target: number,
    num: string, unit: string, maxLabel: string, remain: string, from: string, to: string,
  ): DailyTarget => ({
    key, label, cur, target, num, unit, maxLabel,
    pct: Math.max(0, Math.min(1, target ? cur / target : 0)),
    remain, done: cur >= target, from, to,
  });
  const faltaMl = Math.max(0, t.waterMl - ml);
  const G = T.home.metas;
  return [
    mk('prot', G.proteina, prot, t.prot,
      `${Math.round(prot)}`, 'g', `${t.prot} g`,
      prot >= t.prot ? G.batida : G.faltamProteina(Math.round(t.prot - prot)),
      'limePale', 'lime'),
    mk('agua', G.agua, ml, t.waterMl,
      aguaN(S, ml), aguaU(S), aguaTxt(S, t.waterMl),
      /* Sempre em litros, inclusive abaixo de um. A frase trocava de
         unidade no meio do caminho — "Faltam 1,5 L" virava "Faltam 400 ml"
         quando a pessoa chegava perto —, e quem está acompanhando o
         próprio número via a escala mudar debaixo do pé. */
      faltaMl <= 0 ? G.batida : G.faltamAgua(aguaTxt(S, faltaMl)),
      'bluePale', 'accent2'),
    mk('exerc', G.exercicio, ex, t.exercMin,
      `${Math.round(ex)}`, 'min', `${t.exercMin} min`,
      ex >= t.exercMin ? G.batida : G.faltamExercicio(Math.round(t.exercMin - ex)),
      /* ⚠️ ROSA, E ERA TEAL. O teal virou a cor do ESTADO — a notícia
         ruim que não cobra, na Jornada —, e uma cor não pode ser
         categoria e estado ao mesmo tempo: na linha do tempo os ícones
         de exercício sairiam em teal ao lado de pastilhas em teal
         dizendo outra coisa, na mesma tela.

         Das cores livres, o rosa é a única que não esbarra em nada ali:
         azul é ação, lima é alcançado, roxo é foto, âmbar é refeição e
         atenção. Trocar a CATEGORIA foi mais barato do que trocar o
         estado — categoria tem alternativa, estado já tinha passado por
         verde, vermelho e âmbar antes de assentar. */
      'roseBg', 'rose'),
  ];
}

/* Todo número exibido vem com um veredito. O valor diz a medida; a palavra
   diz se está bom — e é a palavra que a pessoa procura primeiro. Sem isso
   ela faz a conta sozinha, e num tratamento médico faz errado. */
/* ⚠️ O `tom` E OPCIONAL E O `good` FICA, porque a maioria dos vereditos
   do app é binária de verdade: proteína na meta ou abaixo, estoque em dia
   ou não. Só um deles tem um terceiro estado — o ritmo de perda, onde
   "rápido demais" não é fracasso nem sucesso, e sim assunto para a
   equipe. Quem nao declara `tom` continua caindo no par de sempre. */
export type Verdict = { label: string; good: boolean; tom?: 'bom' | 'ruim' | 'atencao' };

/** Média de proteína dos últimos 7 dias, contra a meta. */
export function protein7d(S: State) {
  const from = +daysAgo(7);
  const r = S.checkins.filter((c: any) => c.t >= from);
  const avg = r.length ? r.reduce((s: number, c: any) => s + c.prot, 0) / r.length : 0;
  const target = (S.profile as any).targets.prot as number;
  const verdict: Verdict = avg >= target
    ? { label: T.home.veredito.naMeta, good: true }
    : avg >= target * 0.85
      ? { label: T.home.veredito.pertoDaMeta, good: true }
      : { label: T.home.veredito.abaixoDaMeta, good: false };
  return { avg, target, verdict };
}

/** Gordura corporal da última medida, contra a meta do perfil. */
export function bodyFat(S: State) {
  const m = latestMeasure(S);
  const target = (S.profile as any).targets.bodyFat as number;
  if (!m) return null;
  const first = firstMeasure(S);
  const caindo = first ? m.gordura < first.gordura : false;
  const above = m.gordura > target;
  const verdict: Verdict = !above
    ? { label: T.home.veredito.naMeta, good: true }
    : caindo
      ? { label: T.home.veredito.emQueda, good: true }
      : { label: T.home.veredito.acimaDaMeta, good: false };
  return { v: m.gordura, target, above, verdict };
}

/** Peso perdido e o quanto a meta pede — cartão principal da evolução. */
export function weightCard(S: State) {
  const lost = lostKg(S);
  const goal = startWeight(S) - S.profile.goalWeight;
  /* ⚠️ O TÍTULO TAMBÉM MUDA, e não só o número. "Peso perdido" em cima de
     "+3,3 kg" é uma contradição dentro do mesmo cartão — e a palavra
     errada dói mais do que o número. "Variação do peso" é o nome neutro
     do que aquele número é, e só aparece quando precisa. */
  return {
    lost, goal,
    titulo: lost >= 0 ? T.home.peso.perdido : T.home.peso.variacao,
    lostLabel: variacaoDe(pesoV(S, -lost), pesoU(S)).delta,
    goalLabel: T.home.peso.meta(variacaoDe(pesoV(S, -goal)).numero, pesoU(S)),
  };
}

/** Série de peso normalizada (x,y ∈ 0..1) para o sparkline do card. */
export function weightSeries(S: State) {
  const w = S.weights;
  if (w.length < 2) return [] as { x: number; y: number }[];
  const ks = w.map((p: any) => p.kg);
  const lo = Math.min(...ks), hi = Math.max(...ks), span = hi - lo || 1;
  return w.map((p: any, i: number) => ({ x: i / (w.length - 1), y: (p.kg - lo) / span }));
}

/* Linha do tempo — mistura de eventos (aplicação, check-in, peso, água, treino,
   sono, proteína, humor) num feed cronológico (mockup neurosafe .23_2). */
/* Os oito tipos da árvore de informação. O filtro da Linha do tempo é
   exatamente esta lista — e cada chip carrega sua contagem, para a pessoa
   saber o que tem atrás dele antes de tocar. */
export type TLKind = 'checkin' | 'aplicacao' | 'peso' | 'refeicao' | 'exercicio' | 'consulta' | 'exame';

export const TL_LABEL = (): Record<TLKind, string> => T.home.tipos;

export type TLEvent = {
  key: string; kind: TLKind; day: number;
  /* HORA QUE NÃO É HORA — é ordem dentro do dia.

     Este campo já se chamou `time` e era impresso como relógio: "16 set ·
     08:30". Nenhum desses horários foi registrado. Check-in, peso e
     refeição são guardados no começo do dia, sem hora; os valores aqui
     são constantes escritas à mão para que dois eventos do mesmo dia
     saiam sempre na mesma ordem — o treino antes do check-in, o check-in
     antes da consulta.

     Como ordenação, servem. Como texto na tela, eram o app afirmando que
     alguém pesou às 07:45. Por isso o nome mudou: quem for imprimi-lo
     agora lê o que ele é antes de tentar. */
  ordemNoDia: string;
  ic: string; color: string; title: string; sub: string;
  /* ⚠️ O QUE A PESSOA RESPONDEU, para o evento poder abrir.

     A linha do check-in mostrava três acumuladores — água, proteína,
     sono — e um veredito de humor em uma palavra. Tudo o que ela de fato
     respondeu ficava guardado e sem tela: o enjoo, a fome, a energia, o
     intestino, o sintoma que ela digitou à mão.

     ⚠️ E VEM EM FRASE, NÃO EM NÚMERO. A pessoa não respondeu "4 de 5":
     ela tocou em "Um bom dia". Guardar a régua e devolver o número é o
     app traduzindo a resposta dela para uma escala que ela nunca viu — e
     as réguas existem em escalas.ts justamente para isso não acontecer
     em cada tela por conta própria. */
  respostas?: { k: string; v: string }[];
  /* O MESMO EVENTO CONTADO SEM O NOME DO TIPO.

     `title` serve à lista misturada — na semana, "Check-in" ao lado de
     "Peso" e "Consulta presencial" é o que separa uma linha da outra.
     Numa lista já filtrada por tipo, esse mesmo título vira a mesma
     palavra repetida em treze linhas, e a coluna do título deixa de
     informar qualquer coisa.

     `detalhe` é o que sobra quando o tipo já é sabido: para o check-in,
     a água e a proteína; para a aplicação, a dose e o local. Vem daqui, e
     não de um recorte feito na tela, porque quem monta a frase é quem tem
     os pedaços — a tela só teria a string pronta para cortar. */
  detalhe: string;
  value: string; valueColor?: string;
};

/* Feed cronológico do tratamento inteiro. Água, sono, proteína e humor não
   são eventos próprios: são o conteúdo do check-in daquele dia — por isso
   entram resumidos na linha do check-in, e não como oito linhas repetidas. */
/* O catálogo dos eventos, lido na hora — ver o alto de textos/index. */
const V = () => T.home.evento;

export function timelineEvents(S: State): TLEvent[] {
  const out: TLEvent[] = [];
  const med = M(S);
  const D = (t: number) => +startOfDay(new Date(t));

  for (const inj of S.injections as any[]) {
    out.push({
      key: `inj-${inj.t}`, kind: 'aplicacao', day: D(inj.t), ordemNoDia: '09:00',
      ic: 'syringe', color: 'accent', title: V().aplicacao(nf(inj.dose, inj.dose % 1 ? 1 : 0), med.unit),
      sub: `${med.mol} · ${siteLabel(inj.site)}`,
      detalhe: `${nf(inj.dose, inj.dose % 1 ? 1 : 0)} ${med.unit} · ${med.mol} · ${siteLabel(inj.site)}`,
      value: '', valueColor: 'tx3',
    });
  }

  const w = S.weights as any[];
  w.forEach((cur, i) => {
    const prev = i > 0 ? w[i - 1] : null;
    const dl = prev ? cur.kg - prev.kg : 0;
    out.push({
      key: `peso-${cur.t}`, kind: 'peso', day: D(cur.t), ordemNoDia: '07:45',
      ic: 'scale', color: 'accent2', title: V().peso, sub: `${pesoTxt(S, cur.kg)}`,
      detalhe: `${pesoTxt(S, cur.kg)}`,
      value: prev ? `${dl <= 0 ? '−' : '+'}${pesoTxt(S, Math.abs(dl))}` : V().pesoInicial,
      valueColor: prev ? (dl <= 0 ? 'good' : 'tx2') : 'tx3',
    });
  });

  for (const cc of S.checkins as any[]) {
    const day = D(cc.t);
    /* SÓ OS DIAS EM QUE HOUVE CHECK-IN DE VERDADE.

       Todo registro de dia entrava aqui como um check-in, e os antigos
       guardam só acumuladores — proteína e exercício. Deles esta linha
       lia sono e humor assim mesmo: quarenta e dois dias de "NaN L ·
       NaNh de sono", cada um marcado como dia Difícil, porque um humor
       AUSENTE também não é >= 3. A linha do tempo contava uma temporada
       ruim que nunca existiu.

       O evento de exercício continua fora desta condição: ele depende de
       exerc, que é acumulador, e um dia de treino sem check-in é um dia
       de treino. */
    if (respondido(cc, 'mood')) {
      /* E o resumo traz só o que foi respondido. Água e proteína são
         acumuladores e sempre valem o que dizem; sono é estado, e um dia
         sem resposta sai da frase em vez de virar zero. */
      const partes = [aguaTxt(S, (cc.agua || 0) * CUP_ML), V().gramasDeProteina(Math.round(cc.prot || 0))];
      if (respondido(cc, 'sono')) partes.push(V().horasDeSono(Math.floor(cc.sono)));
      /* As respostas, na régua em que foram dadas. `paraTela` traz as
         colunas de 0–10 de volta para o 1–5 da pergunta; `mood` já nasce
         em 1–5. Cada uma só entra se existir: campo ausente é pergunta
         não respondida, e inventar um degrau para ela seria pôr palavra
         na boca de quem ficou em silêncio. */
      const respostas: { k: string; v: string }[] = [];
      const degrau = (regua: string[], g: number | null) =>
        (g == null ? null : regua[Math.max(0, Math.min(regua.length - 1, g - 1))]);
      const humor = degrau(HUMOR(), respondido(cc, 'mood') ? cc.mood : null);
      if (humor) respostas.push({ k: V().respostaHumor, v: humor });
      const energia = degrau(ENERGIA(), paraTela(cc.energia));
      if (energia) respostas.push({ k: V().respostaEnergia, v: energia });
      const fome = degrau(FOME(), paraTela(cc.fome));
      if (fome) respostas.push({ k: V().respostaFome, v: fome });
      for (const sx of SINTOMAS_LIDOS()) {
        const frase = degrau(sx.regua, grauDoSintoma(cc, sx.id));
        if (frase) respostas.push({ k: sx.label, v: frase });
      }
      /* O texto livre é o único campo em que a pessoa escreveu, e não
         escolheu — ele fecha a lista porque é o que menos se repete. */
      if (String(cc.outroTexto || '').trim()) respostas.push({ k: V().respostaOutroSintoma, v: String(cc.outroTexto).trim() });

      out.push({
        key: `ci-${day}`, kind: 'checkin', day, ordemNoDia: '08:30',
        ic: 'check', color: 'accent', title: V().checkin,
        sub: partes.join(' · '), detalhe: partes.join(' · '),
        value: cc.mood >= 4 ? V().diaBem : cc.mood >= 3 ? V().diaNeutro : V().diaDificil,
        valueColor: cc.mood >= 4 ? 'good' : 'tx3',
        respostas,
      });
    }
    if (cc.exerc > 0) out.push({
      key: `ex-${day}`, kind: 'exercicio', day, ordemNoDia: '07:00',
      ic: 'dumbbell', color: 'rose', title: V().exercicio, sub: V().minDeMovimento(cc.exerc),
      detalhe: V().minDeMovimento(cc.exerc), value: '', valueColor: 'tx3',
    });
  }

  for (const m of S.meals as any[]) out.push({
    key: `ref-${m.t}`, kind: 'refeicao', day: D(m.t), ordemNoDia: '12:30',
    ic: 'utensils', color: 'amber', title: m.name, sub: m.tag,
    detalhe: [m.name, m.tag].filter(Boolean).join(' · '),
    value: V().proteinaDaRefeicao(String(m.prot)), valueColor: 'tx3',
  });

  for (const ch of S.consultsHistory as any[]) out.push({
    key: `con-${ch.t}`, kind: 'consulta', day: D(ch.t), ordemNoDia: '14:00',
    ic: 'steth', color: 'accent2', title: V().consulta(ch.type.toLowerCase()), sub: ch.note,
    detalhe: [ch.type, ch.note].filter(Boolean).join(' · '), value: '', valueColor: 'tx3',
  });

  for (const b of S.examBundles as any[]) out.push({
    key: `exa-${b.t}`, kind: 'exame', day: D(b.t), ordemNoDia: '11:00',
    ic: 'doc', color: 'amber', title: b.name, sub: V().marcadoresDe(b.n, b.source),
    detalhe: V().marcadoresDetalhe(b.name, b.n, b.source),
    value: b.shared ? V().compartilhado : '', valueColor: 'tx3',
  });

  out.sort((a, b) => b.day - a.day || (b.ordemNoDia > a.ordemNoDia ? 1 : b.ordemNoDia < a.ordemNoDia ? -1 : 0));
  return out;
}

/* A linha do tempo em capítulos semanais.

   Num tratamento semanal a aplicação não é "mais um evento": ela abre a
   semana. Tudo que acontece depois dela — check-in, peso, refeição, foto —
   pertence àquele ciclo. Por isso a aplicação vira o cabeçalho do capítulo,
   e não uma linha igual às outras. É assim que a paciente já pensa:
   "semana 10", não "agosto". */
/** Um destaque numérico do ciclo — valor + como ele se moveu. */
export type WeekMetric = { ic: string; label: string; valor: string; delta: string | null; good: boolean };

export type JourneyWeek = {
  semana: number; t: number; dose: string; site: string;
  eventos: TLEvent[]; deltaPeso: string | null;
  /** resumo dos registros da semana — "7 check-ins · 2 refeições" */
  resumo: string;
  /** dose diferente da semana anterior: o evento que mais muda o tratamento */
  mudouDose: boolean;
  /** o que os números daquele ciclo dizem, comparados com o anterior */
  metricas: WeekMetric[];
};

export function timelineWeeks(S: State): JourneyWeek[] {
  const evs = timelineEvents(S);
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  const med = M(S);
  const out: JourneyWeek[] = [];

  /* Médias do ciclo — o que o corpo recebeu naquela semana. Calculadas
     para todos os ciclos antes do laço, porque cada semana precisa da
     anterior para dizer se melhorou ou piorou. */
  const janela = (i: number) => {
    const ini = +startOfDay(new Date(injs[i].t));
    const fim = i + 1 < injs.length ? +startOfDay(new Date(injs[i + 1].t)) : Infinity;
    const cs = (S.checkins as any[]).filter((x) => x.t >= ini && x.t < fim);
    if (!cs.length) return null;
    const med2 = (k: string) => cs.reduce((s: number, x: any) => s + (x[k] || 0), 0) / cs.length;
    return { agua: (med2('agua') * CUP_ML) / 1000, prot: med2('prot'), exerc: cs.reduce((s: number, x: any) => s + (x.exerc || 0), 0) };
  };
  const stats = injs.map((_, i) => janela(i));

  for (let i = injs.length - 1; i >= 0; i--) {
    const inicio = +startOfDay(new Date(injs[i].t));
    const fim = i + 1 < injs.length ? +startOfDay(new Date(injs[i + 1].t)) : Infinity;
    const eventos = evs.filter((e) => e.day >= inicio && e.day < fim && e.kind !== 'aplicacao');

    // variação de peso dentro do ciclo — o que a semana rendeu
    const pesos = (S.weights as any[]).filter((w) => {
      const d = +startOfDay(new Date(w.t));
      return d >= inicio && d < fim;
    });
    const anteriores = (S.weights as any[]).filter((w) => +startOfDay(new Date(w.t)) < inicio);
    const base = anteriores.length ? anteriores[anteriores.length - 1].kg : null;
    let deltaPeso: string | null = null;
    if (base != null && pesos.length) {
      const d = pesos[pesos.length - 1].kg - base;
      deltaPeso = `${d <= 0 ? '−' : '+'}${pesoTxt(S, Math.abs(d))}`;
    }

    /* resumo por tipo — é o que a semana rendeu, não a lista do que houve */
    const contagem: Partial<Record<TLKind, number>> = {};
    for (const e of eventos) contagem[e.kind] = (contagem[e.kind] || 0) + 1;
    const W = T.home.semana;
    const nome: Partial<Record<TLKind, [string, string]>> = {
      checkin: W.checkin, peso: W.peso, refeicao: W.refeicao,
      exercicio: W.exercicio, consulta: W.consulta, exame: W.exame,
    };
    const resumo = (Object.keys(contagem) as TLKind[])
      .map((k) => {
        const n = contagem[k]!;
        const rotulo = TL_LABEL()[k].toLowerCase();
        const [s, p] = nome[k] ?? [rotulo, rotulo];
        return W.contagem(n, n === 1 ? s : p);
      })
      .join(' · ');

    /* Destaques numéricos do ciclo. Cada um traz a variação contra a semana
       anterior — é a comparação que transforma número em informação. */
    const at = stats[i], ant = i > 0 ? stats[i - 1] : null;
    const metricas: WeekMetric[] = [];
    if (deltaPeso) metricas.push({
      ic: 'scale', label: W.pesoMetrica, valor: deltaPeso, delta: null, good: deltaPeso.startsWith('−'),
    });
    if (at) {
      const sinal = (agora: number, antes: number, casas: number) =>
        `${agora >= antes ? '+' : '−'}${nf(Math.abs(agora - antes), casas)}`;
      metricas.push({
        ic: 'water', label: W.hidratacao, valor: W.litrosPorDia(nf(at.agua, 1)),
        delta: ant?.agua == null ? null : W.deltaLitros(sinal(at.agua, ant.agua, 1)),
        good: !ant || at.agua >= ant.agua,
      });
      metricas.push({
        ic: 'leaf', label: W.proteina, valor: W.gramasPorDia(Math.round(at.prot)),
        delta: ant ? W.deltaGramas(`${at.prot >= ant.prot ? '+' : '−'}${Math.round(Math.abs(at.prot - ant.prot))}`) : null,
        good: !ant || at.prot >= ant.prot,
      });
      metricas.push({
        ic: 'dumbbell', label: W.exercicioMetrica, valor: W.minutos(at.exerc),
        delta: ant ? W.deltaMinutos(`${at.exerc >= ant.exerc ? '+' : '−'}${Math.abs(at.exerc - ant.exerc)}`) : null,
        good: !ant || at.exerc >= ant.exerc,
      });
    }

    out.push({
      semana: i + 1, t: injs[i].t,
      dose: `${med.label} ${nf(injs[i].dose, injs[i].dose % 1 ? 1 : 0)} ${med.unit}`,
      site: siteLabel(injs[i].site),
      eventos, deltaPeso,
      resumo: resumo || W.semRegistros,
      mudouDose: i > 0 && injs[i].dose !== injs[i - 1].dose,
      metricas,
    });
  }
  return out;
}

/** Contagem por tipo — alimenta os chips de filtro. Tipo sem evento não vira chip. */
export function timelineCounts(S: State): { kind: TLKind; label: string; n: number }[] {
  const all = timelineEvents(S);
  return (Object.keys(TL_LABEL) as TLKind[])
    .map((k) => ({ kind: k, label: TL_LABEL()[k], n: all.filter((e) => e.kind === k).length }))
    .filter((x) => x.n > 0);
}

/* "O que já mudou" — o coração da Jornada.

   Uma paciente de GLP-1 abre esta tela com uma pergunta: está funcionando?
   Listar links para telas não responde. Mostrar de-onde-para-onde responde —
   e cobre justamente o que mais sustenta alguém num platô, quando a balança
   trava mas cintura, exames e composição seguem melhorando. */
export type Change = {
  ic: string; label: string; from: string; to: string; delta: string;
  good: boolean;
  /* ⚠️ O TOM É SEPARADO DO `good`, e não derivado dele na tela. O que a
     pastilha precisa saber é se aquilo é boa notícia, má notícia ou
     nenhuma — e `!good` não distingue as duas últimas. Um peso que não
     mudou e um peso que subiu três quilos não podem sair da mesma cor. */
  tom: TomDaVariacao;
  to_: string;
};

/* ⚠️ O SINAL SAI DA CONTA, E NÃO DA ESPERANÇA.

   Meia dúzia de lugares escreviam a variação como `−${diferença}` — o
   desenho de quem está emagrecendo, que é o caso da semente e de quase
   todo mundo. Para quem ganhou peso a diferença já vinha negativa, e a
   tela mostrava "−−3,3 kg": um menos que é sinal, outro que é o próprio
   número, e ninguém lendo aquilo sabe o que aconteceu com ela. Em vários
   deles o veredito também era fixo, então o aplicativo comemorava em lima
   três quilos a mais.

   É o mesmo defeito que a leitura dos exames tinha: texto escrito para o
   caso feliz, num aplicativo em que o caso infeliz é exatamente quem mais
   precisa de clareza. Por isso virou uma peça só — enquanto cada tela
   montava a própria string, cada tela podia errar sozinha.

   ⚠️ E ZERO NÃO É "−0,0". Um número que não se mexeu não variou para lado
   nenhum, e a palavra é essa. Ele sai como "não boa notícia", porque
   também não é má.

   `bomSeCai` é falso só onde subir é o que se quer — massa magra é a
   única no aplicativo. */
export type TomDaVariacao = 'bom' | 'ruim' | 'neutro';
export function variacaoDe(d: number, unidade = '', bomSeCai = true) {
  const abs = Math.abs(d);
  const parado = Number(nf(abs, 1).replace(',', '.')) === 0;
  const numero = parado ? nf(0, 1) : `${d > 0 ? '+' : '−'}${nf(abs, 1)}`;
  /* ⚠️ SÃO TRÊS TONS, E ERAM DOIS. Com `good` booleano, "parado" caía no
     mesmo balde de "piorou" — e pintar de vermelho um número que não se
     mexeu é dizer que ficar igual é má notícia. Não é: é notícia nenhuma. */
  const tom: TomDaVariacao = parado ? 'neutro' : ((bomSeCai ? d < 0 : d > 0) ? 'bom' : 'ruim');
  return {
    /** só o número, com sinal — para quem já tem coluna de unidade */
    numero,
    /** número, sinal e unidade, ou "Estável" quando não houve mudança */
    delta: parado ? T.home.estavel : `${numero}${unidade ? ` ${unidade}` : ''}`,
    good: tom === 'bom',
    tom,
  };
}

export function journeyChanges(S: State): Change[] {
  const out: Change[] = [];
  const fm = firstMeasure(S), lm = latestMeasure(S);
  const variacao = (d: number, unidade: string, bomSeCai = true) => {
    const v = variacaoDe(d, unidade, bomSeCai);
    return { delta: v.delta, good: v.good, tom: v.tom };
  };

  /* ⚠️⚠️ CADA CARD ABRE O SEU PRÓPRIO NÚMERO, e antes só dois abriam.

     Peso e cintura iam para /marcador — a tela daquele marcador, com a
     série, os registros e o caminho para corrigir. Os outros quatro iam
     para a tela da ÁREA: gordura e massa magra caíam em /medidas, que
     abre com quatro cards de circunferência e tem a composição lá
     embaixo; HbA1c caía na lista de quinze exames.

     Dois cards cumpriam a promessa e quatro não. A pessoa aprendia nos
     dois primeiros que tocar abre o detalhe daquele número, e levava um
     susto nos outros — o card dizia "Gordura corporal" e a tela que
     abria falava de cintura.

     Agora os cinco primeiros abrem o seu. A pressão fica em /saude por
     uma razão de forma, e não por descuido: ela são DOIS números
     (sistólica e diastólica), que não cabem no desenho de valor único do
     /marcador — e /saude já abre com ela no topo. */
  out.push({
    ic: 'scale', label: T.home.mudancas.peso, from: `${pesoTxt(S, startWeight(S))}`, to: `${pesoTxt(S, curWeight(S))}`,
    ...variacao(pesoV(S, curWeight(S) - startWeight(S)), pesoU(S)), to_: '/marcador?m=peso',
  });

  if (fm && lm && fm !== lm) {
    if (lm.cintura !== fm.cintura) out.push({
      ic: 'ruler', label: T.home.mudancas.cintura, from: compTxt(S, fm.cintura, 0), to: compTxt(S, lm.cintura, 0),
      ...variacao(compV(S, lm.cintura - fm.cintura), compU(S)), to_: '/marcador?m=cintura',
    });
    if (lm.gordura !== fm.gordura) out.push({
      ic: 'activity', label: T.home.mudancas.gorduraCorporal, from: `${nf(fm.gordura, 1)}%`, to: `${nf(lm.gordura, 1)}%`,
      ...variacao(lm.gordura - fm.gordura, 'pp'), to_: '/marcador?m=gordura',
    });
    /* A única em que subir é a boa notícia: músculo perdido num
       emagrecimento é o que o tratamento tenta evitar. */
    if (lm.musculo !== fm.musculo) out.push({
      ic: 'dumbbell', label: T.home.mudancas.massaMagra, from: `${pesoTxt(S, fm.musculo)}`, to: `${pesoTxt(S, lm.musculo)}`,
      ...variacao(pesoV(S, lm.musculo - fm.musculo), pesoU(S), false), to_: '/marcador?m=musculo',
    });
  }

  const a1c = examBy(S, 'HbA1c');
  if (a1c && a1c.values.length >= 2) {
    const f = examFirst(a1c), l = examLast(a1c);
    const naRef = examStatus(a1c) === 'ok';
    out.push({
      ic: 'doc', label: 'HbA1c', from: `${nf(f.v, 1)}%`, to: `${nf(l.v, 1)}%`,
      delta: naRef ? T.home.mudancas.naReferencia : T.home.mudancas.foraDaReferencia,
      good: naRef, tom: naRef ? 'bom' : 'ruim', to_: '/exames?m=HbA1c',
    });
  }

  const pa = (S.vitals as any).pa;
  if (pa && pa.length >= 2) {
    const f = pa[0], l = pa[pa.length - 1];
    /* ⚠️ "ESTÁVEL" ERA O QUE SOBRAVA DE TUDO QUE NÃO FOSSE QUEDA, e a
       pressão subindo catorze pontos saía como estável — em lima, porque
       `good` aceitava o empate junto com a melhora. Subir tem nome. */
    out.push({
      ic: 'heart', label: T.home.mudancas.pressao, from: `${f.sys}/${f.dia}`, to: `${l.sys}/${l.dia}`,
      delta: l.sys < f.sys ? T.home.mudancas.pressaoEmQueda
        : l.sys > f.sys ? T.home.mudancas.pressaoEmAlta : T.home.mudancas.pressaoEstavel,
      good: l.sys < f.sys,
      tom: l.sys < f.sys ? 'bom' : l.sys > f.sys ? 'ruim' : 'neutro',
      to_: '/saude',
    });
  }

  return out;
}

/* AS METAS, prontas para a tela — a medida com a conta que o indicador
   dela devolve, a pessoal com o estado e a data. */
export type JourneyGoal = {
  id: string; ic: string; label: string;
  pct: number;
  hint: string;
  /** sem indicador: quem marca é a pessoa */
  pessoal: boolean;
  feita: boolean;
  /** o que o indicador conta, em uma frase; vazio nas pessoais */
  conta: string;
};

/* ⚠️ A META DE PESO NÃO MORA EM `S.goals`, e por isso não estava na
   lista de metas de lugar nenhum.

   Ela é do PERFIL — `goalWeight` —, porque nasce no cadastro e porque
   metade do aplicativo depende dela: a projeção do plano, o "faltam 7,1
   kg" do hero, a capa da tela de Metas. Pôr uma cópia dela dentro de
   `S.goals` criaria duas verdades para o mesmo número.

   Mas ela É uma meta, e a principal. Fora da lista, "Suas metas" abria
   com dormir e energia e silenciava sobre o peso — como se a razão de o
   tratamento existir fosse assunto de outra tela.

   ⚠️ E ELA TEM BARRA, porque tem conta fechada: quantos quilos de quantos
   quilos. É o oposto da meta pessoal, que é sim ou não num dia. Sai
   separada de `journeyGoals` para cada tela decidir — a de Metas já a
   mostra na capa, e repetir na lista seria o mesmo número duas vezes na
   mesma rolagem. */
export function metaDePeso(S: State): JourneyGoal | null {
  const alvo = startWeight(S) - S.profile.goalWeight;
  if (!(alvo > 0)) return null;
  const andado = lostKg(S);
  /* Travada em 0: quem ganhou peso tem `andado` negativo, e barra
     negativa não existe — o número negativo já está dito no hero, aqui
     ele viraria uma barra vazia com um menos do lado. */
  const pct = Math.max(0, Math.min(100, Math.round((andado / alvo) * 100)));
  const falta = Math.max(0, alvo - andado);
  return {
    id: 'peso', ic: 'scale',
    /* `kgTxt` e não `kg`: a meta redonda é 68 kg, e "68,0 kg" numa
       lista de metas finge uma precisão que ninguém definiu — é o mesmo
       formatador que a capa de /metas e a folha de editar já usam. O que
       falta abaixo mantém a casa, porque 7,1 kg de fato tem uma. */
    label: T.home.metaDePeso.chegarA(pesoProsaTxt(S, S.profile.goalWeight)),
    pct,
    hint: falta === 0 ? T.home.metaDePeso.alcancada : T.home.metaDePeso.faltam(pesoTxt(S, falta)),
    pessoal: false,
    feita: falta === 0,
    conta: '',
  };
}

export function journeyGoals(S: State): JourneyGoal[] {
  /* Catorze dias, e só os RESPONDIDOS entram na conta: quatorze dias com
     três noites registradas não são "21% das noites" — são três noites, e
     duas delas boas é 67%. Diluir pelo que não foi perguntado
     transformaria silêncio em fracasso. */
  const recentes = S.checkins.slice(-14) as any[];

  /* CADA META PERGUNTA AO PRÓPRIO INDICADOR.

     Aqui havia um `if` para sono e outro para energia, os dois com a
     conta escrita à mão. Acrescentar "menos enjoo" exigia um terceiro,
     e a tela de nova meta não teria como oferecer nada que o arquivo
     não soubesse de cor. Agora a lista de indicadores é o que manda, e
     esta função não conhece nenhum deles pelo nome.

     A de energia era MÉDIA × 10: energia 6,2 virava barra em 62%, como
     se 62% fosse o caminho andado até um dez que ninguém pediu. Ela é
     um indicador como os outros — dias que passaram de sete. */
  return (S.goals as any[]).map((g) => {
    const ind = indicadorDe(g.indicador || KIND_ANTIGO[g.kind]);

    if (!ind) {
      /* Pessoal: cheia ou vazia, e a data no lugar da fração. */
      /* O PRAZO É FATO, NÃO COBRANÇA. Passado e não conquistada, a linha
         diz que ele passou e para aí — sem vermelho e sem "atrasada". Num
         tratamento de meses, uma data que escorregou é a coisa mais
         comum do mundo, e a meta continua de pé. */
      const venceu = !g.feita && g.prazo && g.prazo < +startOfDay(now());
      const J = T.metas.jornada;
      return {
        id: g.id, ic: g.ic, label: g.label,
        pct: g.feita ? 100 : 0,
        hint: g.feita && g.em
          ? J.conquistadaEm(fmtDate(new Date(g.em)))
          : g.prazo
            ? (venceu ? J.oPrazoEra : J.ate)(fmtDate(new Date(g.prazo)))
            : J.vocemarca,
        pessoal: true,
        feita: !!g.feita,
        conta: '',
      };
    }

    const alvo = typeof g.alvo === 'number' ? g.alvo : padraoDe(ind, S);
    const vals = recentes.map((c) => ind.leitura(c)).filter((v): v is number => v != null);
    const n = vals.filter((v) => (ind.sentido === 'min' ? v >= alvo : v <= alvo)).length;
    const de = vals.length;
    /* A CONTA, e não a porcentagem de novo. A linha dizia "85%" à
       direita e "85% das noites recentes" embaixo — o mesmo número duas
       vezes. "11 de 13 noites" responde de quantas noites falamos. */
    return {
      id: g.id, ic: ind.ic, label: g.label || ind.rotulo(alvo, S),
      pct: de ? Math.round((n / de) * 100) : 0,
      hint: de
        ? T.metas.jornada.contagem(n, de, de === 1 ? ind.nomes[0] : ind.nomes[1], ind.femininas)
        : T.metas.jornada.semRegistros(ind.nomes[1]),
      pessoal: false,
      feita: false,
      conta: ind.conta(alvo, S),
    };
  });
}

/* Captura rápida — os três atalhos do sheet de registrar.

   O critério é FREQUÊNCIA, não importância. Aplicação é o registro mais
   importante do tratamento e mesmo assim não merece lugar fixo: acontece
   uma vez a cada sete dias, então em seis deles ocuparia um dos três
   espaços de maior destaque sem ser usada.

   Os três lugares vão para o que a pessoa faz todo dia.

   ⚠️ O TIPO LISTAVA SETE CHAVES para uma lista de três, e quatro delas
   não eram opção nenhuma: eram restos da época em que os atalhos giravam
   com o dia. O sheet mantinha um catálogo com as sete, e as quatro
   sobrando desenhavam itens que nenhuma tela renderizava — entre elas a
   anotação da consulta, cuja tela de captura ficou, por isso, sem porta
   no app inteiro. */
export type QuickKey = 'agua' | 'refeicao' | 'exercicio';

/* Os três atalhos do sheet de registrar. Fixos, sempre os mesmos.

   Eles giravam com o momento do tratamento: no dia da aplicação o terceiro
   virava "Meu corpo reagiu", depois de uma consulta virava "Recebi um
   exame". A intenção era boa e o efeito era ruim — o sheet é superfície de
   memória muscular, e um botão que troca de identidade conforme o dia
   obriga a LER os três toda vez, que é o oposto de atalho.

   E a escolha do dia de aplicação era a mais questionável das três:
   sintoma já é o assunto do check-in, que fica no banner logo acima, com
   nove sintomas e intensidade. Exercício não está em lugar nenhum além
   daqui — tirá-lo do atalho no dia em que a pessoa mais precisa se mexer
   era trocar o único caminho pelo caminho duplicado.

   A rotação continua existindo no app, mas onde ela cabe: nos empurrões da
   Home e do companion, que são leitura, não botão. */
export const ATALHOS: QuickKey[] = ['agua', 'refeicao', 'exercicio'];

/* Quais integrações trazem MOVIMENTO. Balança e Withings ficam de fora:
   elas pesam, não contam passo.

   A ordem é a de quem costuma ser a fonte principal — o telefone antes do
   relógio, porque o relógio manda para ele. */
/* ⚠️ SÓ O NOME DA APPLE PASSA PELO CATÁLOGO: "Apple Saúde" é "Apple
   Health" em inglês, porque é a Apple que traduz o nome do próprio
   aplicativo. Os outros quatro são marcas, e marca não se traduz. */
const FONTES_MOVIMENTO = (): [string, string][] => [
  ['appleHealth', T.home.fontes.appleSaude],
  ['healthConnect', 'Health Connect'],
  /* Google Fit e "smartwatch" saíram com o catálogo de integrações: o
     primeiro está fechado para novos cadastros desde 2024, e o segundo
     nunca foi um serviço — o relógio escreve no app de saúde do celular,
     e é de lá que os minutos chegam. Ver src/logic/integracoes.ts. */
  ['garmin', 'Garmin'],
  ['fitbit', 'Fitbit'],
  ['withings', 'Withings'],
];

/* TODAS as fontes ligadas, e não a primeira que aparece.

   Ninguém tem só uma. Quem usa Garmin costuma ter o Apple Saúde ligado
   junto, e quem tem relógio tem o app do relógio — e a tela que dizia
   "Apple Saúde conectado" estava escondendo as outras duas de quem
   justamente queria saber de onde os minutos vinham. */
export function fontesDeMovimento(S: State): string[] {
  const i: any = (S as any).integrations || {};
  return FONTES_MOVIMENTO().filter(([k]) => i[k]).map(([, nome]) => nome);
}

/** Lista em português: "a", "a e b", "a, b e c", "a, b e mais 2".

    ⚠️ A REGRA MORA EM textos/pt-BR/comum, porque ela é gramática e não
    assunto — e porque estava escrita duas vezes, aqui e no cuidado. */
export const listaPt = (itens: string[], mostrar = 3): string =>
  T.comum.lista(itens, mostrar);

/* ============================================================
   O MOVIMENTO DOS ÚLTIMOS DIAS

   Duas coisas moram no registro do dia e não são a mesma:

     exerc    minutos — o total, venha de onde vier
     treinos  as sessões: [{ tipo, min }]

   Elas divergem de propósito. Quem tem Apple Saúde ou Health Connect
   ligado recebe minutos que ninguém digitou, e esses minutos não têm
   modalidade: o telefone conta passo, não sabe que era caminhada. Então
   a soma dos treinos é quase sempre MENOR que os minutos, e a tela que
   mostra as duas precisa dizer isso — senão ela se contradiz sozinha.
   ============================================================ */

/* `i` é a posição da sessão dentro do dia dela. A lista da tela é
   achatada e reordenada, então sem esse índice não dá para apagar uma
   sessão específica — só adivinhar qual era. */
export type Treino = { t: number; i: number; tipo: string; min: number; ic: string; fonte: string };

/* DE ONDE VEIO A SESSÃO.

   Um treino de 50 minutos que a pessoa digitou e um que o relógio mandou
   não valem a mesma coisa na hora de conferir: o primeiro ela lembra de
   ter escrito, o segundo pode ser uma caminhada até o mercado que o
   relógio resolveu chamar de exercício. Sem a origem escrita, corrigir
   vira adivinhação.

   Ausência quer dizer manual, porque manual é o que existia antes de
   haver origem — e todo registro antigo é manual de fato. Mas a tela
   nunca mostra a ausência: ela mostra "Você", porque ausência não
   responde "quem registrou isto", responde "não sei". */
export const ORIGEM_MANUAL = () => T.rotina.origemManual;
export const origemDoTreino = (tr: { fonte?: string } | null | undefined): string =>
  (tr && tr.fonte) || ORIGEM_MANUAL();
export const ehManual = (fonte: string) => fonte === ORIGEM_MANUAL();

/** As sessões registradas à mão, da mais nova para a mais velha. */
export function treinosRecentes(S: State, dias = 30): Treino[] {
  const corte = +startOfDay(now()) - (dias - 1) * DAY;
  const out: Treino[] = [];
  for (const c of S.checkins as any[]) {
    if (c.t < corte) continue;
    ((c.treinos || []) as { tipo: string; min: number; fonte?: string }[]).forEach((tr, i) => {
      out.push({ t: c.t, i, tipo: tr.tipo, min: tr.min, ic: iconeDe(tr.tipo), fonte: origemDoTreino(tr) });
    });
  }
  return out.sort((a, b) => b.t - a.t);
}

/** Os sete últimos dias em minutos, do mais antigo para hoje. */
export function semanaDeMovimento(S: State): { t: number; min: number }[] {
  const hoje = +startOfDay(now());
  const porDia = new Map<number, number>(
    (S.checkins as any[]).map((c) => [c.t, c.exerc || 0]),
  );
  return Array.from({ length: 7 }, (_, i) => {
    const t = hoje - (6 - i) * DAY;
    return { t, min: Math.round(porDia.get(t) || 0) };
  });
}

/* MINUTOS POR SEMANA, NAS ÚLTIMAS N SEMANAS.

   O gráfico de barras em cima responde "como foi esta semana". Este
   responde outra coisa, que nenhuma parte da tela respondia: estou me
   mexendo mais ou menos do que estava há dois meses. Num tratamento que
   dura meses, essa é a pergunta que a semana isolada nunca alcança.

   Em SEMANAS e não em dias porque o dia é picotado — 0, 30, 0, 0, 45 —,
   e uma curva suave passada por cima disso desenha um movimento que não
   aconteceu. A semana soma o descanso junto com o treino, que é como o
   corpo conta.

   As semanas terminam hoje e correm para trás: a última é a que está
   acontecendo, e por isso costuma ser mais baixa que as outras. */
export function semanasDeMovimento(S: State, n = 8): { t: number; min: number }[] {
  const hoje = +startOfDay(now());
  const balde = new Array(n).fill(0);
  for (const c of S.checkins as any[]) {
    const atras = Math.floor((hoje - c.t) / DAY);
    if (atras < 0 || atras >= n * 7) continue;
    balde[n - 1 - Math.floor(atras / 7)] += c.exerc || 0;
  }
  return balde.map((min, i) => ({ t: hoje - (n - 1 - i) * 7 * DAY, min: Math.round(min) }));
}

/* Em quantos dos últimos 7 dias houve treino de força.

   A proporção de força já teve um cartão inteiro nesta tela — barra,
   legenda, minutos por modalidade — e não fazia nada. Era resumo: olhava
   bonito, não mudava nenhuma decisão, e ocupava a altura de um cartão
   para dizer o que cabe numa linha.

   A linha ficou, porque o FATO importa: em déficit calórico quem só faz
   cardio perde massa magra junto com a gordura, e massa magra é o que o
   tratamento inteiro tenta segurar. O que saiu foi a moldura. */
export function diasDeForca(S: State): number {
  const corte = +startOfDay(now()) - 6 * DAY;
  const dias = new Set<number>();
  for (const c of S.checkins as any[]) {
    if (c.t < corte) continue;
    if (((c.treinos || []) as any[]).some((tr) => ehForca(tr.tipo))) dias.add(c.t);
  }
  return dias.size;
}

/* OS DIAS DO PERÍODO, do mais antigo para hoje.

   Serve à tira de calendário do caderno: cada dia sabe se teve treino
   registrado e quantos minutos. É diferente do gráfico de barras lá em
   cima, que mostra SETE dias e responde "quanto" — aqui a pergunta é o
   ritmo ao longo do período: três dias seguidos, um de folga, dois.

   `treinos` e não `exerc`: a tira navega o caderno, e o caderno só tem
   o que foi registrado à mão. Marcar um dia que só o relógio preencheu
   levaria a pessoa a um dia vazio. */
/** Um dia na tira de calendário: quantos registros ele tem, e se é hoje.

    `itens` e não `treinos` porque a mesma tira serve o caderno de treino
    e o de alimentação — nomear pelo conteúdo de um dos dois obrigava o
    outro a ler `d.treinos` para contar refeições. */
export type DiaDaTira = { t: number; itens: number; hoje: boolean };

export function diasDoPeriodo(S: State, dias: number): DiaDaTira[] {
  const hoje = +startOfDay(now());
  const porT = new Map((S.checkins as any[]).map((c) => [c.t, c]));
  /* `hoje` sai daqui e não da tela porque quem sabe que dia é hoje é esta
     camada — a tela que recalculasse isso teria a sua própria meia-noite,
     e as duas divergiriam justamente na virada. */
  return Array.from({ length: dias }, (_, i) => {
    const t = hoje - (dias - 1 - i) * DAY;
    const lista = (porT.get(t)?.treinos || []) as { min: number }[];
    return {
      t,
      itens: lista.length,
      hoje: t === hoje,
    };
  });
}

/* O RESUMO DE UM PERÍODO — só do que foi registrado aqui.

   Os minutos vêm dos TREINOS, e não de `exerc`: os números ficam em
   cima da lista de treinos, e somar o que o relógio trouxe faria o
   resumo dizer 12 h sobre uma lista que mostra 6 h. Duas contas na mesma
   tela é a divergência que este app passou meses tirando de si mesmo. */
export type Resumo = { treinos: number; min: number; maisLongo: number; forca: number };

export function resumoDeMovimento(S: State, dias: number): Resumo {
  const lista = treinosRecentes(S, dias);
  return {
    treinos: lista.length,
    min: lista.reduce((x, t) => x + t.min, 0),
    maisLongo: lista.reduce((x, t) => Math.max(x, t.min), 0),
    forca: lista.filter((t) => ehForca(t.tipo)).reduce((x, t) => x + t.min, 0),
  };
}

/** Uma sessão pelo dia e pela posição dentro dele. */
export function treinoEm(S: State, t: number, i: number): { tipo: string; min: number; fonte?: string } | null {
  const c = (S.checkins as any[]).find((x) => x.t === t);
  return c?.treinos?.[i] ?? null;
}

/* Corrigir uma sessão acerta o total do dia pela DIFERENÇA, e não pela
   soma dos treinos: o dia pode carregar minutos que vieram do relógio, e
   recalcular do zero apagaria justamente esses. */
export function editarTreino(s: any, t: number, i: number, tipo: string, min: number) {
  const c = (s.checkins as any[]).find((x) => x.t === t);
  const tr = c?.treinos?.[i];
  if (!tr) return;
  c.exerc = Math.max(0, (c.exerc || 0) - tr.min + min);
  /* Espalha o original: corrigir a modalidade não pode apagar de onde a
     sessão veio. Trocar o objeto inteiro por { tipo, min } fazia um treino
     do relógio virar um treino manual no instante em que alguém acertava
     a duração dele. */
  c.treinos = (c.treinos as any[]).map((x: any, j: number) => (j === i ? { ...x, tipo, min } : x));
}

/* Apagar uma sessão devolve os minutos dela ao dia. O total NÃO volta a
   zero: ele pode carregar minutos que vieram do relógio e que ninguém
   digitou, e esses não são desta sessão. */
export function apagarTreino(s: any, t: number, i: number) {
  const c = (s.checkins as any[]).find((x) => x.t === t);
  const tr = c?.treinos?.[i];
  if (!tr) return;
  c.treinos = (c.treinos as any[]).filter((_: any, j: number) => j !== i);
  c.exerc = Math.max(0, (c.exerc || 0) - tr.min);
}

/* Apagar uma refeição devolve a proteína dela ao dia. Mesma regra do
   treino: o total do dia não volta a zero, porque ele soma o que as
   OUTRAS refeições trouxeram.

   Refeição antiga, gravada antes de `g` existir, vale o que a faixa dela
   valia — senão apagar um registro de "proteína alta" tiraria zero do dia
   e o número ficaria alto para sempre, sem nada explicando. */
/* ============================================================
   A PROTEÍNA AO LONGO DO TEMPO

   A tela de alimentação só sabia dizer HOJE. Num tratamento de meses a
   pergunta que importa não é "quanto comi hoje", é "estou conseguindo
   manter" — e são as mesmas duas resoluções que o exercício já tem: a
   semana dia a dia, e a tendência de oito semanas.
   ============================================================ */

/** Os sete últimos dias em gramas, do mais antigo para hoje. */
export function semanaDeProteina(S: State): { t: number; g: number }[] {
  const hoje = +startOfDay(now());
  const porDia = new Map<number, number>(
    (S.checkins as any[]).map((c) => [c.t, Math.round(c.prot || 0)]),
  );
  return Array.from({ length: 7 }, (_, i) => {
    const t = hoje - (6 - i) * DAY;
    return { t, g: porDia.get(t) || 0 };
  });
}

/** O dia a que uma refeição pertence — ela guarda a hora, o caderno lê o dia. */
export const diaDaRefeicao = (m: any) => +startOfDay(new Date(m.t));

/** Os dias do período, marcando os que têm refeição registrada. */
export function diasDeRefeicao(S: State, dias: number): DiaDaTira[] {
  const hoje = +startOfDay(now());
  const porT = new Map<number, { n: number; g: number }>();
  for (const m of S.meals as any[]) {
    const t = diaDaRefeicao(m);
    const a = porT.get(t) || { n: 0, g: 0 };
    a.n += 1;
    a.g += m.g ?? 0;
    porT.set(t, a);
  }
  return Array.from({ length: dias }, (_, i) => {
    const t = hoje - (dias - 1 - i) * DAY;
    const a = porT.get(t);
    return { t, itens: a?.n || 0, hoje: t === hoje };
  });
}

/* AS REFEIÇÕES DE UM DIA, na ordem em que o dia acontece: café, almoço,
   lanche, jantar.

   Pela hora do registro elas saíam trocadas com frequência — quem só
   lembra de anotar à noite registra o café por último, e o caderno
   mostrava o dia de trás para a frente. A ordem que se lê é a do prato,
   não a do toque, e ela já está escrita em MOMENTOS; a hora fica como
   desempate para duas refeições do mesmo momento. */
export function refeicoesDoDia(S: State, t: number): any[] {
  const ordem = (nome: string) => {
    const i = MOMENTOS.findIndex(([, n]) => n === nome);
    return i < 0 ? MOMENTOS.length : i;
  };
  return (S.meals as any[])
    .filter((m) => diaDaRefeicao(m) === t)
    .slice()
    .sort((a, b) => ordem(a.name) - ordem(b.name) || a.t - b.t);
}

/** Uma refeição pelo instante em que foi registrada — que é o id dela. */
export function refeicaoEm(S: State, t: number): any | null {
  return (S.meals as any[]).find((m) => m.t === t) ?? null;
}

/* Corrigir uma refeição acerta o dia pela DIFERENÇA, e não recalculando
   do zero: o dia pode carregar proteína de outras refeições, e refazer a
   conta a partir desta apagaria justamente as outras. É a mesma regra de
   editarTreino, pelo mesmo motivo. */
export function editarRefeicao(
  s: any, t: number,
  dados: { name: string; g: number; tag: string; itens?: any[]; fonte?: string },
) {
  const m = (s.meals as any[]).find((x) => x.t === t);
  if (!m) return;
  const dia = (s.checkins as any[]).find((c) => c.t === +startOfDay(new Date(t)));
  if (dia) dia.prot = Math.max(0, (dia.prot || 0) - (m.g || 0) + dados.g);
  Object.assign(m, dados);
}

/* OS FAVORITOS — pratos que se repetem.

   Um favorito é um PRATO, não um nome: quem come marmita repete os
   mesmos itens nas mesmas quantidades, e é isso que faz o atalho valer
   a pena. Guardar só o texto obrigava a pessoa a remontar o prato item
   por item toda vez, que é exatamente o trabalho que o favorito existe
   para poupar.

   Os antigos, que eram só string, continuam a ser lidos — eles abrem o
   registro com o nome escrito na busca, como sempre fizeram. O que não
   acontece mais é CRIAR um assim. */
export type Favorito = { nome: string; itens?: any[] };

/* O nome sai dos ITENS, e não de um campo guardado ao lado deles. Dois
   lugares dizendo como o prato se chama divergem na primeira vez que
   alguém troca o arroz branco pelo integral e o nome continua falando do
   branco. */
export function favoritos(S: State): Favorito[] {
  return (((S as any).favMeals || []) as any[]).map((f) => {
    if (typeof f === 'string') return { nome: f };
    const itens = (f.itens || []) as any[];
    return { ...f, nome: itens.length ? itens.map(nomeItem).filter(Boolean).join(', ') : f.nome };
  });
}

export function apagarFavorito(s: any, nome: string) {
  s.favMeals = (((s as any).favMeals || []) as any[])
    .filter((f) => (typeof f === 'string' ? f : f.nome) !== nome);
}

export function guardarFavorito(s: any, fav: Favorito) {
  const atuais = favoritos(s as any);
  if (atuais.some((f) => f.nome === fav.nome)) return;
  s.favMeals = [...(s.favMeals || []), fav];
}

export function apagarRefeicao(s: any, t: number, gramas: number) {
  s.meals = (s.meals as any[]).filter((m) => m.t !== t);
  const dia = (s.checkins as any[]).find((c) => c.t === +startOfDay(new Date(t)));
  if (dia) dia.prot = Math.max(0, (dia.prot || 0) - gramas);
}

/* ============================================================
   A ÁGUA — e a memória que ela não tinha

   Beber era a única coisa deste app que não se podia desfazer. O registro
   somava num acumulador do dia e não guardava nada sobre quem somou: quem
   tocou "Garrafão" sem querer ficava com um litro a mais para sempre,
   vendo o número errado todo dia até ele virar ontem. Refeição se apaga,
   treino se apaga, água não se apagava.

   Agora a água guarda os goles um a um, com a mesma dupla que o exercício
   já tem — `treinos` é a lista, `exerc` é o total do dia, e apagar um
   mexe nos dois. Aqui é `aguas` e `agua`.

   POR QUE DOIS CAMPOS e não só a lista: `agua` é o que o app inteiro lê —
   a pontuação, os padrões, o resumo, a Home. E os dias antigos só têm o
   total: derivar tudo da lista faria cada um deles valer zero, que é
   perder histórico para arrumar a arquitetura. O total continua sendo o
   número; a lista conta de onde ele veio.

   E um dia sem goles é tratado pelo que ele é: um total sem detalhe. O
   caderno mostra uma linha só dizendo isso, em vez de inventar um horário
   que ninguém registrou.
   ============================================================ */

/** Um gole no caderno: quando e quanto. O instante é o id. */
export type Gole = {
  t: number;
  ml: number;
  /* QUAL BEBIDA — ver src/logic/bebidas.ts. Ausente quer dizer água: é o
     que todo registro anterior a esta tela é, porque era a única coisa
     que dava para registrar. */
  bebida?: string;
  /** o nome que a pessoa escreveu, quando a bebida é "Outro" */
  nome?: string;
};

/** O que este gole soma no dia. Zero quando a bebida não conta. */
export const mlQueContam = (g: Gole) => (bebidaDe(g.bebida).conta ? g.ml : 0);

/* ============================================================
   UM REGISTRO, DOIS CAMPOS

   Leite, suco e shake são bebida e comida ao mesmo tempo. Pedir para a
   pessoa anotar o copo de leite na hidratação e de novo na alimentação é
   cobrar duas vezes pelo mesmo gesto — e é assim que se ensina alguém a
   não registrar nada.

   Então o registro da bebida cria TAMBÉM a refeição, com o item da
   tabela e a quantidade que o volume (ou a dose) determina. A partir
   daí, proteína, caloria, carboidrato e gordura saem do caminho de
   sempre: ninguém precisou inventar um número novo, e o diário de
   refeições mostra a linha, porque ela existe de verdade.

   E A MARCA `fonte: 'bebida'` EXISTE PARA A CONTA NÃO VOLTAR. A água
   dessa refeição já foi contada como gole; sem a marca, o leite entraria
   duas vezes no total do dia — uma pelo copo, outra pela comida.
   ============================================================ */
export function itensDaBebida(b: Bebida, ml: number, doses = 0): ItemComida[] {
  if (b.porDose) return doses > 0 ? [{ id: b.porDose, qtd: doses }] : [];
  if (!b.item) return [];
  const a = alimentoDe(b.item);
  /* Sem peso publicado não há como converter mililitro em unidade — e
     nenhuma bebida da tabela cai nesse caso hoje. */
  return a && a.gUn ? [{ id: b.item, qtd: (ml * (b.fracao ?? 1)) / a.gUn }] : [];
}

/* Registra o que se bebeu hoje — entra no diário e sobe o total do dia.

   O DIÁRIO RECEBE TUDO, O TOTAL RECEBE O QUE CONTA. É a mesma regra das
   refeições sem rótulo: o registro é da pessoa e guarda o que aconteceu;
   a conta é do app e só soma o que ele sabe somar. */
export function registrarAgua(
  s: any, ml: number, bebida: string = BEBIDA_PADRAO,
  extra?: { nome?: string; doses?: number },
) {
  const b = bebidaDe(bebida);
  const c = registroDoDia(s, +startOfDay(now()));
  const g: Gole = { t: +now(), ml, bebida, ...(extra?.nome ? { nome: extra.nome } : {}) };
  c.aguas = [...((c.aguas || []) as Gole[]), g];
  c.agua = (c.agua || 0) + mlQueContam(g) / CUP_ML;

  const itens = itensDaBebida(b, ml, extra?.doses);
  if (itens.length) {
    registrarRefeicao(s, {
      name: momentoDaHora(now().getHours()),
      tag: b.nome,
      itens,
      fonte: 'bebida',
    });
  }
}

/* A REFEIÇÃO, GRAVADA NUM LUGAR SÓ.

   A tela de registro montava o objeto na mão e somava a proteína no dia
   na linha seguinte. Quando a hidratação passou a criar refeições
   também, virariam duas cópias da mesma regra — e a segunda esquece o
   acumulador do dia na primeira vez que alguém mexer numa delas. */
export function registrarRefeicao(
  s: any,
  d: { name: string; tag: string; itens: ItemComida[]; fonte?: string; g?: number },
) {
  const g = d.g ?? somaDe(d.itens);
  s.meals.unshift({
    t: +now(), name: d.name, g, prot: faixaDe(g), tag: d.tag,
    fonte: d.fonte ?? 'manual', itens: d.itens,
  });
  const c = registroDoDia(s, +startOfDay(now()));
  c.prot = (c.prot || 0) + g;
}

/* Apagar devolve ao dia o que aquele gole tinha somado, e não zera: o dia
   carrega a água dos outros goles. Mesma regra de apagarTreino.

   Sem o instante, apaga o dia inteiro — que é a única saída possível para
   um registro antigo, de quando não havia goles para apagar um a um. */
export function apagarGole(s: any, dia: number, t?: number | null) {
  const c = (s.checkins as any[]).find((x) => x.t === dia);
  if (!c) return;
  if (t == null) { c.agua = 0; c.aguas = []; return; }
  const g = ((c.aguas || []) as Gole[]).find((x) => x.t === t);
  if (!g) return;
  c.aguas = ((c.aguas || []) as Gole[]).filter((x) => x.t !== t);
  c.agua = Math.max(0, (c.agua || 0) - mlQueContam(g) / CUP_ML);
}

/** Os sete últimos dias em ml, do mais antigo para hoje. */
export function semanaDeAgua(S: State): { t: number; ml: number }[] {
  const hoje = +startOfDay(now());
  /* A barra da semana conta o mesmo que a capa conta: o que foi bebido
     mais a água do prato. Sem isso, o dia em que a pessoa almoçou sopa
     apareceria menor na semana do que apareceu no dia — dois números
     para o mesmo dia, a uma rolagem de distância. */
  return Array.from({ length: 7 }, (_, i) => {
    const t = hoje - (6 - i) * DAY;
    return { t, ml: aguaDoDia(S, t) };
  });
}

/** Os dias do período, marcando os que têm água registrada. */
export function diasDeAgua(S: State, dias: number): DiaDaTira[] {
  const hoje = +startOfDay(now());
  const porT = new Map<number, number>();
  for (const c of S.checkins as any[]) {
    /* O ponto da tira responde "houve registro", e para isso o TOTAL é
       resposta melhor que a lista: um dia antigo tem litros e nenhum gole,
       e marcá-lo como vazio seria sumir com ele da vista. */
    const n = ((c.aguas || []) as Gole[]).length || ((c.agua || 0) > 0 ? 1 : 0);
    if (n) porT.set(c.t, n);
  }
  return Array.from({ length: dias }, (_, i) => {
    const t = hoje - (dias - 1 - i) * DAY;
    return { t, itens: porT.get(t) || 0, hoje: t === hoje };
  });
}

/** O caderno de um dia, do primeiro gole ao último. Um dia antigo devolve
    uma linha sem hora: o total é tudo o que se sabe dele. */
export function golesDoDia(S: State, t: number): { t: number | null; ml: number; bebida?: string }[] {
  const c = (S.checkins as any[]).find((x) => x.t === t);
  if (!c) return [];
  const gs = ((c.aguas || []) as Gole[]).slice().sort((a, b) => a.t - b.t);
  if (gs.length) return gs;
  const ml = Math.round((c.agua || 0) * CUP_ML);
  return ml > 0 ? [{ t: null, ml }] : [];
}

/* ============================================================
   O PROTOCOLO DA SEMANA

   Cinco itens combinados com a equipe, e duas naturezas muito diferentes
   entre eles:

     MEDIDOS   água, proteína, movimento. O app conta esses dias o tempo
               todo — é o que as três telas de hábito fazem. No protocolo
               eles só aparecem somados.

     MANUAIS   aplicar a dose, agendar o exame. Não há registro de onde
               tirar a resposta; quem sabe é a pessoa, e por isso essas
               se marcam.

   A SEPARAÇÃO NÃO É ARRUMAÇÃO, é o conserto de uma mentira. Os medidos
   vinham com a contagem ESCRITA À MÃO — "5 de 7 dias" — ao lado de um
   caderno de água que sabia a resposta de verdade, e com uma caixinha
   que deixava marcar "2 L por dia" como cumprido num dia de meio litro.
   Duas fontes para o mesmo fato, e a que mandava era a inventada.

   Agora a contagem sai dos registros, e nos medidos a caixinha some:
   eles se cumprem bebendo, comendo e andando — não tocando neles.

   E A META SAI DO PERFIL, não do texto da tarefa. O item dizia "2 L de
   água por dia" enquanto o perfil pedia 2,5 L: a tela de água cobrava um
   número e o protocolo cobrava outro, na mesma semana. */

export type TarefaDoProtocolo = {
  /** o índice no array guardado — é por ele que a manual se marca */
  i: number;
  texto: string;
  nota: string;
  feita: boolean;
  /** medida: o app conta. manual: a pessoa marca. */
  medida: boolean;
  /* O ÍCONE DA COISA, só para a linha medida. Ele entra no lugar da caixa
     de marcar enquanto a meta não fecha — e a caixa não pode estar lá,
     porque caixa convida ao toque e esta linha não é da pessoa para
     marcar. Vem daqui, e não da tela, porque quem sabe que "prot" é
     proteína é a mesma função que sabe onde ela se cumpre. */
  ic?: string;
  /* DE ONDE VEM O NÚMERO, e para onde ir para mexer nele.

     A linha medida não se marca, e dizer isso com um cadeado responde
     só metade: a pessoa fica sabendo que não pode tocar e continua sem
     saber onde aquilo se cumpre. O nome da tela responde a outra metade,
     e o toque leva até ela. */
  origem?: string;
  para?: string;
};

/* Como cada meta medida se escreve e se conta. O alvo — em quantos dias
   da semana — vem da tarefa, porque é ele que a equipe negocia. */
const K = () => T.rotina.protocolo;

const MEDIDAS: Record<string, (S: State, alvo: number) => {
  texto: string; feito: number; origem: string; para: string; ic: string;
  /** o que se conta, quando não são dias — "1 de 1 dia" não descreve uma injeção */
  unidade?: [string, string];
}> = {
  agua: (S, alvo) => {
    const ml = (S.profile as any).targets.waterMl as number;
    return {
      texto: alvo >= 7 ? K().aguaTodoDia(aguaTxt(S, ml)) : K().aguaEmDias(aguaTxt(S, ml), alvo),
      feito: semanaDeAgua(S).filter((d) => d.ml >= ml).length,
      origem: K().origemAgua, para: '/agua', ic: 'water',
    };
  },
  prot: (S, alvo) => {
    const g = (S.profile as any).targets.prot as number;
    return {
      texto: alvo >= 7 ? K().proteinaTodoDia(g) : K().proteinaEmDias(g, alvo),
      feito: semanaDeProteina(S).filter((d) => d.g >= g).length,
      origem: K().origemProteina, para: '/alimentacao', ic: 'cutlery',
    };
  },
  /* Dias COM MOVIMENTO, e não minutos: é o que o item pede — sair do
     sofá três vezes —, e é o que o registro sabe dizer sem chutar
     modalidade. O item já foi "Caminhada 3× na semana", e o app não tem
     como saber se aqueles trinta minutos foram uma caminhada. */
  exerc: (S, alvo) => ({
    /* "Se exercitar", e era "se mexer". O informal servia quando a meta
       era um empurrão; numa lista que a clínica prescreve, ao lado de
       dose e proteína, ele destoa — e "mexer" é a palavra que a gente usa
       para levantar do sofá, não para a coisa que vai no protocolo. */
    texto: K().exercicio(alvo),
    feito: semanaDeMovimento(S).filter((d) => d.min > 0).length,
    origem: K().origemExercicio, para: '/exercicio', ic: 'dumbbell',
  }),
  /* ⚠️ A APLICAÇÃO ERA UMA CAIXA PARA MARCAR À MÃO, e o app já sabia a
     resposta: cada aplicação é um registro com data, e é dele que a Home
     tira "próxima aplicação em 3 dias" e a grade de adesão tira os
     quadradinhos verdes.

     Enquanto a semana ficou congelada ninguém percebeu — a caixa foi
     marcada uma vez, em algum momento, e continuou marcada para sempre.
     No instante em que a virada de semana passou a zerar os manuais, a
     contradição apareceu na tela: "Aplicação da semana" desmarcada logo
     abaixo de um hero dizendo "com aplicação em dia".

     Duas fontes para o mesmo fato, de novo, e é sempre o mesmo defeito.
     Agora é uma medida: conta os dias com injeção na semana corrente,
     como as outras três contam água, proteína e movimento. */
  aplicacao: (S, alvo) => {
    const de = +startOfDay(now()) - 6 * DAY;
    const feito = (S.injections as any[]).filter((x) => +startOfDay(new Date(x.t)) >= de).length;
    return {
      texto: alvo === 1 ? K().aplicacaoUma : K().aplicacaoVarias(alvo),
      unidade: K().unidadeAplicacao,
      feito: Math.min(feito, alvo),
      origem: K().origemAplicacao, para: '/aplicacoes', ic: 'syringe',
    };
  },
};

export function protocoloDaSemana(S: State) {
  const p: any = S.protocol;
  const tarefas: TarefaDoProtocolo[] = (p.tasks as any[]).map((x, i) => {
    const m = x.metrica && MEDIDAS[x.metrica];
    if (!m) {
      /* Tarefa manual — inclusive as antigas, guardadas antes de existir
         métrica: elas continuam valendo o que a pessoa marcou. */
      return { i, texto: x.t, nota: x.note || '', feita: !!x.done, medida: false };
    }
    const alvo = x.alvo || 7;
    const { texto, feito, origem, para, unidade, ic } = m(S, alvo);
    const [un1, unN] = unidade ?? K().unidadeDia;
    return {
      i, texto,
      nota: K().nota(feito, alvo, alvo === 1 ? un1 : unN),
      feita: feito >= alvo,
      medida: true,
      origem,
      para,
      ic,
    };
  });
  const feitas = tarefas.filter((t) => t.feita).length;
  return {
    semana: p.week as number,
    tarefas,
    feitas,
    total: tarefas.length,
    pct: tarefas.length ? Math.round((feitas / tarefas.length) * 100) : 0,
  };
}

/* ============================================================
   AS SEMANAS ANTERIORES

   O app guarda UM protocolo, o desta semana — quem escreve é a equipe, e
   o da semana passada não ficou em lugar nenhum. Esta seção já existiu
   com duas linhas cravadas no código ("Semana 9 · 5 de 5 concluídos") e
   saiu por isso: era história inventada sobre o tratamento de alguém.

   O QUE DÁ PARA MOSTRAR DE VERDADE são as três metas que o app MEDE,
   semana a semana, saídas dos mesmos registros que alimentam as telas de
   água, alimentação e exercício. Aplicação e exame não entram: não existe
   registro de quem marcou o quê, e um "cumprido" sem lastro aqui seria a
   mesma invenção com outra roupa.

   A RESSALVA É REAL e está escrita na tela: os alvos são os de HOJE,
   aplicados para trás. Se a equipe mudou a meta de proteína no mês
   passado, o app não tem como saber — ele guarda a meta atual, não a
   história dela.

   E só entram as semanas com registro. Uma semana sem nenhum check-in
   não é uma semana de zeros, é uma semana sem resposta — e a diferença
   entre as duas coisas é a mesma de sempre.
   ============================================================ */
export type SemanaDoProtocolo = {
  semana: number;
  de: number;
  ate: number;
  metas: { ic: string; feito: number; alvo: number }[];
};

export function historicoDeProtocolos(S: State, n = 6): SemanaDoProtocolo[] {
  const hoje = +startOfDay(now());
  const t = (S.profile as any).targets;
  /* Os alvos saem das tarefas de hoje — é lá que a equipe negocia quantos
     dias da semana cada meta pede. */
  const alvoDe = (metrica: string, padrao: number) => {
    const x = (S.protocol.tasks as any[]).find((y) => y.metrica === metrica);
    return (x && x.alvo) || padrao;
  };
  const alvos = { agua: alvoDe('agua', 7), prot: alvoDe('prot', 7), exerc: alvoDe('exerc', 3) };

  const out: SemanaDoProtocolo[] = [];
  for (let k = 1; k <= n; k++) {
    const ate = hoje - k * 7 * DAY;
    const de = ate - 6 * DAY;
    const cs = (S.checkins as any[]).filter((c) => c.t >= de && c.t <= ate);
    if (!cs.length) continue;
    out.push({
      semana: S.protocol.week - k,
      de,
      ate,
      metas: [
        { ic: 'water', feito: cs.filter((c) => (c.agua || 0) * CUP_ML >= t.waterMl).length, alvo: alvos.agua },
        { ic: 'utensils', feito: cs.filter((c) => (c.prot || 0) >= t.prot).length, alvo: alvos.prot },
        { ic: 'dumbbell', feito: cs.filter((c) => (c.exerc || 0) > 0).length, alvo: alvos.exerc },
      ],
    });
  }
  return out;
}

/* UMA SEMANA DO HISTÓRICO, aberta.

   A linha do histórico diz 5/7 e para aí. Quem toca nela quer a coisa
   que o número esconde: QUAIS dias. Cinco de sete seguidos e cinco de
   sete alternados são a mesma fração e semanas diferentes — a primeira é
   um hábito que caiu na quinta, a segunda é um hábito que nunca pegou.

   Dia sem check-in devolve valor nulo, e não zero. Nos acumuladores os
   dois quase se confundem — quem não registrou água provavelmente bebeu
   pouco —, mas "não sei" e "zero" continuam sendo respostas diferentes,
   e a célula vazia é a única que diz a primeira. */
export type DiaDaMeta = { t: number; ok: boolean; valor: number | null };
export type MetaDaSemana = {
  ic: string;
  texto: string;
  feito: number;
  alvo: number;
  /** a frase de baixo: média por dia, ou o total da semana */
  resumo: string;
  dias: DiaDaMeta[];
};

export function semanaDoHistorico(S: State, ate: number) {
  const de = ate - 6 * DAY;
  const t = (S.profile as any).targets;
  const alvoDe = (metrica: string, padrao: number) => {
    const x = (S.protocol.tasks as any[]).find((y) => y.metrica === metrica);
    return (x && x.alvo) || padrao;
  };

  const porT = new Map<number, any>((S.checkins as any[]).map((c) => [c.t, c]));
  const dias = Array.from({ length: 7 }, (_, i) => de + i * DAY);

  /* Média só dos dias REGISTRADOS, como em toda média deste arquivo:
     dividir por sete transformaria um dia sem resposta em um dia ruim. */
  const media = (vs: (number | null)[]) => {
    const n = vs.filter((v): v is number => v != null);
    return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
  };

  const monta = (
    ic: string, texto: string, alvo: number,
    valorDe: (c: any) => number | null, bate: (v: number) => boolean,
    resumoDe: (m: number | null, soma: number) => string,
  ): MetaDaSemana => {
    const ds: DiaDaMeta[] = dias.map((d) => {
      const c = porT.get(d);
      const v = c ? valorDe(c) : null;
      return { t: d, ok: v != null && bate(v), valor: v };
    });
    const vs = ds.map((d) => d.valor);
    const soma = vs.reduce((a: number, b) => a + (b || 0), 0);
    return { ic, texto, alvo, feito: ds.filter((d) => d.ok).length, resumo: resumoDe(media(vs), soma), dias: ds };
  };

  const W = T.rotina.semanas;
  return {
    semana: S.protocol.week - Math.round((+startOfDay(now()) - ate) / (7 * DAY)),
    de,
    ate,
    metas: [
      monta('water', W.aguaMeta(aguaTxt(S, t.waterMl)), alvoDe('agua', 7),
        (c) => (typeof c.agua === 'number' ? c.agua * CUP_ML : null),
        (v) => v >= t.waterMl,
        (m) => (m == null ? W.semRegistro : W.mediaDeAgua(aguaTxt(S, Math.round(m))))),
      monta('utensils', W.proteinaMeta(t.prot), alvoDe('prot', 7),
        (c) => (typeof c.prot === 'number' ? Math.round(c.prot) : null),
        (v) => v >= t.prot,
        (m) => (m == null ? W.semRegistro : W.mediaDeProteina(Math.round(m)))),
      monta('dumbbell', W.exercicioMeta(alvoDe('exerc', 3)), alvoDe('exerc', 3),
        (c) => (typeof c.exerc === 'number' ? Math.round(c.exerc) : null),
        (v) => v > 0,
        (_m, soma) => (soma ? W.minutosNaSemana(soma) : W.semMovimento)),
    ],
  };
}

/* ============================================================
   OS ALVOS — os quatro números que o app cobra

   Proteína, água, exercício e a meta de peso. Eles não são enfeite
   de perfil: a tela de alimentação cobra o de proteína, a de água cobra o
   dela, o protocolo conta os três e a Jornada mede a viagem inteira
   contra o de peso.

   E NÃO HAVIA COMO MUDAR NENHUM. O perfil tinha duas linhas apontando
   para /metas — "meta de peso" e "metas diárias" — e a tela de
   metas não mostrava nem um nem outro: dois becos sem saída para os
   números mais usados do app. A meta de 90 g de proteína valia para
   sempre porque ninguém tinha onde escrever outra.

   A tabela mora aqui, e não na tela, porque a folha de edição e a lista
   precisam das mesmas definições. Duas cópias divergiriam no dia em que
   alguém mudasse o passo de um lado só.
   ============================================================ */
export type ChaveDeAlvo = 'prot' | 'waterMl' | 'exercMin' | 'peso';

/* Atalhos para os catálogos de texto. São FUNÇÕES e são chamadas dentro
   das tabelas — o catálogo tem de ser lido na hora, e não no import. */
const A = () => T.metas.alvos;
const I = () => T.metas.indicadores;

/* ⚠️ É FUNÇÃO, E NÃO CONSTANTE. Metade desta tabela é texto, e constante
   de módulo lê o catálogo UMA vez, no import — congelaria o idioma antes
   da primeira tela. Ver o alto de textos/index. */
export const ALVOS = (): Record<ChaveDeAlvo, {
  ic: string;
  nome: string;
  /** o que este número muda no resto do app */
  onde: string;
  /* ⚠️ DE ONDE O NÚMERO VEIO, e a folha de editar não dizia.

     Três destes quatro não foram escolhidos por ninguém: saíram de uma
     conta feita com as respostas do cadastro. Sem dizer isso, a folha
     parece um campo vazio que a pessoa preenche — e mexer num número
     calculado sabendo que ele foi calculado é uma decisão diferente de
     mexer num número que parecia não ter dono.

     Não é aviso para travar nada. A conta é um bom palpite, não uma
     prescrição: quem tem restrição renal não bebe 2,5 L, quem está
     lesionado não faz 60 min, e a nutricionista de alguém pode ter dito
     outro número de proteína. Editar segue sendo direito da pessoa — ela
     só passa a saber o que está sobrescrevendo. */
  origem: string;
  /* ⚠️ O QUE MEXER AQUI PODE FAZER DO LADO DE LÁ.

     Os três números do dia não são só da pessoa: o protocolo da semana
     conta DIAS contra eles. "7 dias com a meta de proteína" usa o número
     que está aqui — então baixar a proteína faz o protocolo marcar
     cumprido sem que nada tenha mudado no prato.

     A ressalva não trava e não julga: ela diz o que a pessoa não tem como
     saber olhando a folha. A meta de peso não tem ressalva porque nenhum
     protocolo conta contra ela. */
  ressalva?: string;
  /* A RÉGUA DESTA GRANDEZA. Os quatro eram <Stepper> — mais e menos, um
     passo por toque —, e o peso já tinha virado régua em toda tela que o
     pergunta. Mais e menos servem para corrigir; para dizer QUANTO, a
     régua mostra a vizinhança.

     `paraRegua` e `deRegua` existem porque a hidratação é guardada em
     mililitros e lida em litros: a régua trabalha na unidade em que a
     pessoa lê, e converte na fronteira. */
  regua: { min: number; max: number; passo: number; tracoCada: number; casas: number; esp: number; salto: number };
  paraRegua?: (v: number) => number;
  deRegua?: (v: number) => number;
  /* ⚠️⚠️ A UNIDADE E O FORMATO VIRARAM FUNÇÕES DO ESTADO, e eram texto
     fixo. Dois dos quatro alvos mudam de unidade — peso e água —, e os
     outros dois não: proteína se conta em grama nos dois sistemas, e
     minuto é minuto em todo lugar. Quem escreve a entrada decide, e o
     tipo obriga a decidir. */
  un: (S: State) => string;
  passo: number;
  min: number;
  max: number;
  le: (S: State) => number;
  /** como o número se escreve na tela, já na unidade de quem lê */
  escreve: (v: number, S: State) => string;
}> => ({
  prot: {
    ic: 'utensils', nome: A().prot.nome, onde: A().prot.onde, origem: A().prot.origem,
    ressalva: A().ressalvaDoProtocolo,
    regua: { min: 40, max: 220, passo: 5, tracoCada: 5, casas: 0, esp: 10, salto: 5 },
    un: () => A().prot.un, passo: 5, min: 40, max: 220,
    le: (S) => (S.profile as any).targets.prot,
    escreve: (v) => A().prot.escreve(Math.round(v)),
  },
  waterMl: {
    /* Guardada em mililitros e escrita em litros, como em toda parte: o
       passo de 250 ml é um copo, que é a unidade em que se bebe. */
    ic: 'water', nome: A().waterMl.nome, onde: A().waterMl.onde, origem: A().waterMl.origem,
    ressalva: A().ressalvaDoProtocolo,
    /* Em LITROS, e o estado guarda mililitros: a régua mostra o número
       que a pessoa lê em toda outra tela. O passo é um copo. */
    regua: { min: 0.75, max: 5, passo: 0.25, tracoCada: 0.1, casas: 2, esp: 40, salto: 0.25 },
    paraRegua: (v) => v / 1000,
    deRegua: (v) => Math.round(v * 1000),
    un: aguaU, passo: 250, min: 750, max: 5000,
    le: (S) => (S.profile as any).targets.waterMl,
    escreve: (v, S) => aguaN(S, v),
  },
  exercMin: {
    ic: 'dumbbell', nome: A().exercMin.nome, onde: A().exercMin.onde,
    origem: A().exercMin.origem,
    ressalva: A().ressalvaDoProtocolo,
    regua: { min: 10, max: 180, passo: 10, tracoCada: 5, casas: 0, esp: 20, salto: 10 },
    un: () => A().exercMin.un, passo: 10, min: 10, max: 180,
    le: (S) => (S.profile as any).targets.exercMin,
    escreve: (v) => A().exercMin.escreve(Math.round(v)),
  },
  peso: {
    /* Este peso mede o caminho, e não cobra: é por isso que ele é o único
       dos quatro sem ressalva de protocolo. */
    ic: 'scale', nome: A().peso.nome, onde: A().peso.onde, origem: A().peso.origem,
    regua: { min: 40, max: 200, passo: 0.5, tracoCada: 0.5, casas: 1, esp: 6, salto: 0.5 },
    un: pesoU, passo: 0.5, min: 40, max: 200,
    le: (S) => S.profile.goalWeight,
    /* Sem o ",0" pendurado: 68 kg é como se fala de um peso redondo, e
       "68,0 kg" numa pastilha de meta parece precisão de balança. */
    escreve: (v, S) => pesoProsa(S, v),
  },
});

/* ⚠️ `porEla` EXISTE PORQUE DUAS COISAS DIFERENTES ESCREVEM AQUI.

   Quando a pessoa arrasta a régua em Os números do dia, o número passa a
   ser dela e o aplicativo precisa saber disso — senão a folha continua
   dizendo "calculado do seu peso, a 1,2 g por quilo" sobre um número que
   ela escolheu à mão, que é uma frase falsa sobre a origem de um dado.

   Quando a folha da equipe grava, quem definiu foi a equipe: marcar como
   edição dela apagaria justamente a procedência que aquela folha existe
   para guardar. */
export function mudarAlvo(s: any, chave: ChaveDeAlvo, valor: number, porEla = true) {
  const a = ALVOS()[chave];
  const v = Math.max(a.min, Math.min(a.max, valor));
  if (chave === 'peso') s.profile.goalWeight = v;
  else s.profile.targets[chave] = v;
  if (porEla) {
    s.profile.alvosEditados = s.profile.alvosEditados ?? {};
    s.profile.alvosEditados[chave] = +now();
  }
}

/** Quando a pessoa mexeu neste número à mão, se é que mexeu. */
export const alvoEditadoEm = (S: State, chave: ChaveDeAlvo): number | null =>
  ((S.profile as any).alvosEditados?.[chave] ?? null) as number | null;

/* ============================================================
   AS METAS — e as duas naturezas que elas têm

   MEDIDAS   o app tem como responder: quantas noites de sete horas,
             quantos dias com energia alta. Saem dos check-ins, e a
             porcentagem é uma conta de verdade.

   PESSOAIS  só a pessoa sabe. Vestir a calça jeans antiga, subir a
             escada sem parar, voltar a jogar bola no domingo.

   A PESSOAL PERDEU A PORCENTAGEM, e essa é a mudança que importa. Ela
   vinha com "prog: 60" escrito na semente e uma barra em 60% — e não
   existe sessenta por cento de caber numa calça. Era precisão inventada,
   parada para sempre num número que ninguém tinha como mexer.

   Agora ela é o que sempre foi: ainda não, ou conseguiu em tal dia. A
   data importa mais que a barra — é ela que a pessoa vai querer contar
   para alguém.

   É a mesma divisão do protocolo, pelo mesmo motivo: o que o app mede,
   ele conta; o que só a pessoa sabe, ela diz.
   ============================================================ */
/* ============================================================
   OS INDICADORES — o que o app sabe contar, e a régua que falta

   Um indicador é uma coluna do check-in mais uma DIREÇÃO: sono conta
   para cima, enjoo conta para baixo. O que ele não traz é o número —
   esse é de quem está criando a meta.

   A LISTA OFERECIA A RÉGUA PRONTA: "Dormir 7h+", "Enjoo em 2 ou menos".
   Sete horas é o que a literatura repete, e mesmo assim é um palpite
   sobre a vida de alguém — quem dorme cinco e quer chegar a seis não
   tinha onde dizer isso, e quem já dorme oito recebia uma meta que já
   nasceu cumprida. Escolher a coisa e escolher o número são duas
   decisões, e a segunda é a que é pessoal.

   Agora a lista é genérica — "Horas de sono", "Enjoo" — e o número vem
   no segundo toque, com a mesma régua e as mesmas palavras do check-in.

   E É A RÉGUA DA TELA, NÃO A DO BANCO. Energia e fome são guardadas de
   0 a 10 e perguntadas de 1 a 5; a meta dizia "energia de 7 para cima",
   que é um número que ninguém nunca viu em tela nenhuma. A escolha
   acontece em 1 a 5, com as legendas do check-in, e a leitura converte —
   é a mesma fronteira que escalas.ts já documenta.

   TODO INDICADOR CONTA SÓ OS DIAS RESPONDIDOS. Catorze dias com três
   noites registradas não são "21% das noites": são três noites.
   ============================================================ */
export type Indicador = {
  id: string;
  ic: string;
  /** o nome genérico, na lista de escolha: "Horas de sono" */
  nome: string;
  /** a pergunta do segundo passo */
  pergunta: string;
  /* DE ONDE SAI O NÚMERO, dito na lista. "Conta para cima" era o que
     estava ali, e é coisa da régua — que só aparece no passo seguinte.
     Antes de escolher, o que a pessoa precisa saber é se o app tem como
     responder: se ela nunca registra refeição, a meta de proteína vai
     ficar parada em zero e é melhor ela ver isso agora. */
  origem: string;
  /** singular e plural do que se conta */
  nomes: [string, string];
  /* A concordância de `nomes`, que a frase da Jornada precisa: "11 de 13
     noites REGISTRADAS". Era decidido comparando a palavra com "noite" —
     o que quebra calado no dia em que entrar um indicador feminino novo. */
  femininas: boolean;
  /** para cima (sono, proteína) ou para baixo (enjoo, fome) */
  sentido: 'min' | 'max';
  /** o palpite inicial — só um começo, não uma recomendação */
  padrao: number;
  /* A UNIDADE, para quem escreve MÉDIA.

     `escreve` dá conta do número inteiro que a pessoa escolhe — "7 h",
     "4 de 5" —, mas média tem casa decimal, e formatar decimal é de quem
     mostra. Sem a unidade declarada aqui, cada tela que mostra média
     redescobre que sono é hora e energia é degrau; é assim que uma delas
     acaba escrevendo "6.8 h" com ponto.

     ⚠️ SÓ OS CINCO DE SENTIR TÊM, e é o que /sintomas lê. Proteína, água
     e movimento não aparecem como média em tela nenhuma — e a unidade
     deles seria a primeira a errar, porque duas das três mudam de sistema.
     Declarar por precaução criaria justamente o "L" que ninguém atualiza.

     ⚠️ E ISSO JÁ ACONTECEU. Os três carregavam um `passos` com
     `{ min, max, passo, un }` para a folha de criar meta medida — folha
     que deixou de existir. Ninguém lia, e o `un` da água dizia "L" com o
     aplicativo mostrando fl oz. Saiu. */
  un?: string;
  /** quando o padrão sai da meta do perfil */
  doPerfil?: (S: State) => number;
  /* ⚠️⚠️ O QUE A PESSOA SENTE NÃO VIRA META NOVA.

     Os oito indicadores se dividem em dois grupos que a tela tratava
     igual: o que a pessoa FAZ — proteína, água, movimento, hora de deitar
     — e o que ela SENTE: enjoo, fome, humor, energia.

     Enjoo e fome num tratamento com GLP-1 são o remédio funcionando, ou a
     dose pedindo ajuste. A alavanca não é esforço, é a prescrição. Uma
     meta "Enjoo 2 ou menos" marcando 40% diz "você está falhando" sobre a
     única coisa ali cuja ação certa é falar com a clínica.

     ⚠️ E O PIOR NÃO É DESANIMAR, É ENVIESAR. A conta da meta sai do
     check-in — o mesmo check-in que alimenta a tela de sintomas e o
     resumo que vai para a consulta. Quem vê a própria meta de enjoo em
     vermelho ganha um incentivo para marcar enjoo menor do que teve. A
     meta corrompe o único registro clínico que o aplicativo produz.

     Humor tem o mesmo desenho. Energia é resultado de sono, dose e
     comida, não de uma decisão. Sono fica, porque tem alavanca: a hora
     de deitar.

     ⚠️ ELES NÃO SAEM DO CATÁLOGO, SÓ DA LISTA DE CRIAR. Quem já tem uma
     meta de energia continua com ela funcionando, com a porcentagem e
     tudo — tirar o indicador do array a rebaixaria calada para uma meta
     de marcar à mão. Paramos de oferecer; não tiramos de ninguém.

     Onde eles seguem vivos é em /sintomas, que mostra histórico em vez de
     nota — que é a leitura honesta de uma coisa que se sente. */
  sintoma?: boolean;
  /** escolha por régua, com as legendas do check-in */
  escala?: { valores: number[]; legendas?: string[] };
  /** o valor do dia na régua da ESCOLHA; null quando não foi respondido */
  leitura: (c: any) => number | null;
  /** o nome que a meta ganha: "Dormir 7h por noite" */
  rotulo: (v: number, S: State) => string;
  /** o que ela conta, dito por extenso */
  conta: (v: number, S: State) => string;
  /** como o número aparece no seletor */
  escreve: (v: number, S: State) => string;
};

const num = (c: any, k: string): number | null => (typeof c[k] === 'number' ? c[k] : null);

/* ⚠️ NOME, PERGUNTA, ORIGEM, NOMES E UNIDADE VÊM JUNTOS, de uma chave só.
   Escritos um a um, cada indicador repetia cinco linhas de `I().x.y` e
   nada garantia que a chave fosse a mesma nas cinco — trocar uma sozinha
   daria um indicador com a pergunta de outro, e o tsc não veria nada. */
const doTexto = (id: keyof typeof T.metas.indicadores) => {
  const t = I()[id] as any;
  return {
    nome: t.nome, pergunta: t.pergunta, origem: t.origem,
    nomes: t.nomes as [string, string], femininas: t.femininas as boolean,
    ...(t.un ? { un: t.un as string } : {}),
  };
};

/* Função pelo mesmo motivo de `ALVOS`: nome, pergunta e origem saem do
   catálogo, e constante de módulo o leria no import. */
export const INDICADORES = (): Indicador[] => [
  {
    id: 'sono', ic: 'moon', ...doTexto('sono'), sentido: 'min', padrao: SONO_REF_H,
    escala: { valores: [5, 6, 7, 8, 9], legendas: SONO() },
    leitura: (c) => num(c, 'sono'),
    escreve: (v) => I().sono.escreve(v),
    rotulo: (v) => I().sono.rotulo(v),
    conta: (v) => I().sono.conta(v),
  },
  {
    /* Energia e fome moram de 0 a 10 no banco e de 1 a 5 na tela. A
       leitura converte com paraTela, que é a mesma função que o check-in
       usa para reabrir uma resposta salva. */
    id: 'energia', ic: 'bolt', ...doTexto('energia'),
    sintoma: true,
    sentido: 'min', padrao: 4,
    escala: { valores: [1, 2, 3, 4, 5], legendas: ENERGIA() },
    leitura: (c) => paraTela(c.energia),
    escreve: (v) => I().energia.escreve(v),
    rotulo: (v) => I().energia.rotulo(v),
    conta: (v) => I().energia.conta(v),
  },
  {
    id: 'humor', ic: 'mood', ...doTexto('humor'),
    sintoma: true,
    sentido: 'min', padrao: 4,
    escala: { valores: [1, 2, 3, 4, 5], legendas: HUMOR() },
    leitura: (c) => num(c, 'mood'),
    escreve: (v) => I().humor.escreve(v),
    rotulo: (v) => I().humor.rotulo(v),
    conta: (v) => I().humor.conta(v),
  },
  {
    /* Sintoma conta AO CONTRÁRIO: o acerto é o dia em que o número ficou
       baixo. Sem o sentido, "menos enjoo" mostraria a barra crescendo
       junto com o enjoo. */
    id: 'enjoo', ic: 'waves', ...doTexto('enjoo'),
    sintoma: true,
    sentido: 'max', padrao: 2,
    escala: { valores: [1, 2, 3, 4, 5], legendas: SINTOMA().nausea },
    leitura: (c) => num(c, 'nausea'),
    escreve: (v) => I().enjoo.escreve(v),
    rotulo: (v) => I().enjoo.rotulo(v),
    conta: (v) => I().enjoo.conta(v),
  },
  {
    id: 'fome', ic: 'soup', ...doTexto('fome'),
    sintoma: true,
    sentido: 'max', padrao: 3,
    escala: { valores: [1, 2, 3, 4, 5], legendas: FOME() },
    leitura: (c) => paraTela(c.fome),
    escreve: (v) => I().fome.escreve(v),
    rotulo: (v) => I().fome.rotulo(v),
    conta: (v) => I().fome.conta(v),
  },
  {
    /* Os três de baixo começam na meta do PERFIL, que é o número que a
       pessoa já persegue todo dia — mas continuam livres: dá para pôr uma
       meta de proteína mais baixa do que a diária e ir subindo. */
    id: 'prot', ic: 'utensils', ...doTexto('prot'),
    sentido: 'min', padrao: 90,
    doPerfil: (S) => (S.profile as any).targets.prot,
    leitura: (c) => num(c, 'prot'),
    escreve: (v) => I().prot.escreve(Math.round(v)),
    rotulo: (v) => I().prot.rotulo(Math.round(v)),
    conta: (v) => I().prot.conta(Math.round(v)),
  },
  {
    id: 'agua', ic: 'water', ...doTexto('agua'),
    sentido: 'min', padrao: 2500,
    doPerfil: (S) => (S.profile as any).targets.waterMl,
    leitura: (c) => (typeof c.agua === 'number' ? c.agua * CUP_ML : null),
    /* ⚠️ O ESTADO ENTROU NESTES TRÊS por causa das unidades — a tabela é
       constante e a água se escreve em litro ou em onça. O catálogo recebe
       a quantidade já escrita: unidade é de logic/medidas, frase é de lá. */
    escreve: (v, S) => aguaTxt(S, v),
    rotulo: (v, S) => I().agua.rotulo(aguaTxt(S, v)),
    conta: (v, S) => I().agua.conta(aguaTxt(S, v)),
  },
  {
    id: 'exerc', ic: 'dumbbell', ...doTexto('exerc'),
    /* ⚠️ ELE NÃO TINHA `doPerfil`, E OS VIZINHOS TINHAM — e por isso a
       meta de movimento abria em 30 min enquanto o aplicativo cobrava 60.
       Não era só divergir depois de editada: ela já NASCIA discordando do
       alvo, e ninguém percebeu porque a lista tem três números do dia e
       só dois liam o perfil. */
    sentido: 'min', padrao: 30,
    doPerfil: (S) => (S.profile as any).targets.exercMin,
    leitura: (c) => num(c, 'exerc'),
    escreve: (v) => I().exerc.escreve(Math.round(v)),
    rotulo: (v) => I().exerc.rotulo(Math.round(v)),
    conta: (v) => I().exerc.conta(Math.round(v)),
  },
];

/* ============================================================
   AS QUE O APP NÃO MEDE

   A folha oferecia oito indicadores e, no fim, uma linha em branco. E a
   linha em branco é a parte mais difícil da tela: quem abre "escreva sua
   meta" com o cursor piscando escreve "emagrecer" — que é o que o app
   inteiro já faz — ou fecha.

   ESTAS SÃO CATEGORIAS, E NÃO FRASES PRONTAS. É a mesma forma dos
   indicadores: a lista diz de QUE coisa se trata, e o segundo toque é
   que a torna dela. "Um esporte" pergunta qual esporte; "uma peça de
   roupa" pergunta qual peça.

   Elas chegaram a ser frases prontas que preenchiam o campo — "Voltar a
   um esporte que eu gostava", com o cursor no fim. Funcionava e era
   preguiçoso: quem não apagasse nada ficava com uma meta genérica, e
   meta genérica não convida ninguém a nada. A pergunta obriga a
   especificar, que é justamente o trabalho que uma meta pessoal pede.

   O PREFIXO GARANTE QUE A FRASE FECHE. A resposta é um pedaço de frase —
   "vôlei", "o vestido do casamento" — e o monta devolve a sentença
   inteira. Sem isso, metade das metas começaria em minúscula e a outra
   metade repetiria o verbo.

   Nenhuma delas assume família, corpo ou dinheiro: uma meta que não cabe
   na vida de quem está lendo é pior do que campo vazio.
   ============================================================ */
export type MetaPessoal = {
  id: string;
  ic: string;
  /** a categoria, na lista */
  nome: string;
  /** a pergunta que especifica */
  pergunta: string;
  /* O QUE APARECE DENTRO DO CAMPO, e por que ele é neutro.

     Ele era um exemplo de verdade — "o vestido do casamento da minha
     irmã", "vôlei" —, e exemplo dentro de campo é sugestão: quem lê
     aquilo antes de pensar na própria meta pensa na meta do exemplo. Pior
     no caso da roupa, que inventava um casamento e uma irmã para quem
     talvez não tenha nenhum dos dois.

     Quem ensina a forma da resposta agora é a frase montada logo abaixo,
     que aparece já na primeira letra e mostra o resultado de verdade em
     vez de prometer um. */
  dica: string;
  /** a frase inteira, a partir do pedaço que a pessoa escreveu */
  monta: (r: string) => string;
};

/* O ícone é do código — ele não se traduz — e o resto vem do catálogo de
   uma chave só, pelo mesmo motivo do `doTexto` dos indicadores. */
const pessoal = (id: keyof typeof T.metas.pessoais, ic: string): MetaPessoal => {
  const t = T.metas.pessoais[id];
  return { id, ic, nome: t.nome, pergunta: t.pergunta, dica: t.dica, monta: t.monta };
};

export const METAS_PESSOAIS = (): MetaPessoal[] => [
  /* ⚠️⚠️ DUAS COISAS FORAM ARRUMADAS AQUI DE UMA VEZ, e a segunda é a que
     dói mais.

     1. O TEMPO VERBAL ESTAVA ESCOLHENDO A VIDA DA PESSOA. "Voltar a
        praticar" pressupõe que ela praticou; quem quer começar natação aos
        quarenta não cabia na categoria chamada "Um esporte" — a única do
        aplicativo que falava do assunto. O mesmo com "Conseguir X sem
        perder o fôlego", que decide qual é a barreira: pode ser joelho,
        pode ser dor, pode ser vergonha.

        As frases neutras ficam neutras. A única que continua pressupondo é
        a do lugar — e ela passou a DIZER isso no nome ("um lugar que você
        deixou de ir"), que é a diferença entre pressupor e perguntar.

     2. A PERGUNTA ERA UM FORMULÁRIO. "Que foto você quer tirar?" é
        correto e é frio, e esta lista é a parte do aplicativo que fala da
        vida de alguém que está atravessando um tratamento difícil.

        ⚠️ E OS EXEMPLOS VÃO NA PERGUNTA, NÃO NO CAMPO. O campo continua
        abrindo vazio, pela razão que já estava escrita na tela: exemplo
        dentro de campo é sugestão, e quem lê um antes de pensar na
        própria meta escreve a meta do exemplo. Na pergunta eles são o que
        devem ser — a forma da resposta, não a resposta. */
  pessoal('roupa', 'ruler'),
  pessoal('esporte', 'run'),
  pessoal('folego', 'walk'),
  pessoal('sentir', 'heart'),
  pessoal('foto', 'photo'),
  pessoal('lugar', 'sun'),
  pessoal('comecar', 'leaf'),
  pessoal('largar', 'check'),
];

/* A saída para o que não cabe em nenhuma categoria. Ela é a mesma coisa
   que as outras — pergunta, exemplo, monta —, só que sem prefixo: aqui a
   frase inteira é de quem escreve. */
export const META_LIVRE = (): MetaPessoal => pessoal('livre', 'more');

/* OS PRAZOS, e por que eles são relativos.

   Uma meta pessoal pode ter data — "até o casamento", "até a consulta de
   junho" — e um calendário para escolher o dia exato seria precisão que
   ninguém tem: quem põe prazo numa meta de tratamento pensa em "uns três
   meses", não em 14 de dezembro.

   E o prazo é OPCIONAL de verdade: a primeira opção é não ter, e ela vem
   selecionada. Uma meta sem data continua sendo uma meta — o que ela não
   pode é ganhar um prazo que a pessoa não escolheu. */
export const PRAZOS = (): { id: string; label: string; dias: number | null }[] => [
  { id: 'nao', label: T.metas.prazos.nao, dias: null },
  { id: '30', label: T.metas.prazos.umMes, dias: 30 },
  { id: '90', label: T.metas.prazos.tresMeses, dias: 90 },
  { id: '180', label: T.metas.prazos.seisMeses, dias: 180 },
  { id: '365', label: T.metas.prazos.umAno, dias: 365 },
];

export const indicadorDe = (id?: string | null) =>
  INDICADORES().find((x) => x.id === id) || null;

/** O número com que o seletor abre: a meta do perfil quando existe. */
export const padraoDe = (i: Indicador, S: State) => (i.doPerfil ? i.doPerfil(S) : i.padrao);

/* ⚠️ O `indicadoresLivres` MORAVA AQUI, e servia à lista de "o que
   conseguimos medir" da folha de nova meta. A folha deixou de ter essa
   lista: quem cria a conta já sai do cadastro com o plano, e o lado
   clínico das metas passou a viver em Os números do dia.

   O catálogo abaixo continua — ele é lido por quem já tem uma meta
   medida guardada, e é o que dá a ela a porcentagem e a frase. O que
   sumiu foi a porta de criar mais. */

/* As metas guardadas antes de existir indicador traziam `kind`, e as da
   primeira versão do catálogo traziam a régua no id ('sono7u'). As duas
   continuam valendo: o app traduz na leitura, e ninguém perde a meta de
   sono por causa de uma mudança de formato. */
const KIND_ANTIGO: Record<string, string> = {
  sono: 'sono', energia: 'energia',
  sono7u: 'sono', sono7: 'sono', energia7: 'energia', humor4: 'humor',
};

export type Meta = {
  id: string;
  ic: string;
  label: string;
  /** o indicador que o app conta; sem ele, a meta é pessoal */
  indicador?: string | null;
  /** o número que a pessoa escolheu para ele */
  alvo?: number;
  /** só nas pessoais */
  feita?: boolean;
  /** o dia em que ela foi conquistada */
  em?: number | null;
  /** a data que a pessoa escolheu, quando escolheu alguma */
  prazo?: number | null;
};

/** Uma meta que só a pessoa sabe dizer quando chegou, com prazo se ela
    quis um. */
export function guardarMetaPessoal(s: any, label: string, ic = 'target', prazo: number | null = null) {
  const texto = label.trim();
  if (!texto) return;
  s.goals = [...(s.goals || []), {
    id: 'g' + Date.now(), ic, label: texto, indicador: null, feita: false, em: null, prazo,
  }];
}

/** Uma meta amarrada a um indicador e a um número — o app conta, ela não
    se marca. O rótulo sai do indicador com o alvo dentro, para a lista
    não ter de remontar a frase. */
/* ⚠️⚠️ A META DO NÚMERO DO DIA NÃO GUARDA O NÚMERO, e guardava.

   Proteína, hidratação e movimento já têm um número: o ALVO, que a pessoa
   define em "Os números do dia" e que a Home, a Alimentação, a Hidratação
   e o protocolo cobram. A meta nascia com uma CÓPIA dele — `padraoDe` lê
   do perfil — e a cópia ficava independente para sempre. Mudar o alvo
   para 110 g não mexia na meta, que seguia contando 90: a Alimentação
   cobrava um número e a meta contava outro, sobre a mesma proteína, no
   mesmo dia, nas duas telas que a pessoa abre todo dia.

   Sem `alvo` guardado, `journeyGoals` já cai no `padraoDe` — que é o alvo do
   perfil. Um número só, e a meta passa a acrescentar o que o alvo não
   diz: a CONSTÂNCIA, "11 de 14 dias".

   ⚠️ E NEM O RÓTULO, pelo mesmo motivo. "Comer 90 g de proteína" gravado
   viraria mentira no dia em que o alvo virasse 110 — o título dizendo um
   número e a conta embaixo usando outro. Sem ele, `journeyGoals` monta a
   frase com o alvo de hoje.

   Sono continua guardando os dois: ele não tem alvo no perfil, então o
   número da meta é o único que existe. */
export function guardarMetaMedida(s: any, idIndicador: string, alvo: number) {
  const i = indicadorDe(idIndicador);
  if (!i) return;
  const doPerfil = !!i.doPerfil;
  s.goals = [...(s.goals || []), {
    id: 'g' + Date.now(), ic: i.ic, indicador: i.id,
    /* O rótulo é escrito NA UNIDADE DE QUEM GRAVA, e guardado pronto:
       ele é o nome que a pessoa deu à meta, e nome não se recalcula. */
    ...(doPerfil ? {} : { label: i.rotulo(alvo, s), alvo }),
  }];
}

export function apagarMeta(s: any, id: string) {
  s.goals = ((s.goals || []) as any[]).filter((g) => g.id !== id);
}

/* Marcar guarda a DATA junto, e desmarcar a apaga. Sem isso, quem
   desmarcasse por engano e marcasse de novo ficaria com a data do engano
   — e a data é a parte da conquista que se conta para alguém. */
export function marcarMeta(s: any, id: string) {
  const g = ((s.goals || []) as any[]).find((x) => x.id === id);
  if (!g || g.indicador || KIND_ANTIGO[g.kind]) return;
  g.feita = !g.feita;
  g.em = g.feita ? +startOfDay(now()) : null;
}

/* O EXAME QUE AINDA ESTÁ ABERTO no protocolo. Três telas perguntam por
   ele — a lista de hoje, as recomendações e o cuidado —, e a busca morava
   copiada nas três, cada uma com a sua regex.

   E só as MANUAIS entram: uma tarefa medida não tem texto próprio (o
   texto dela sai da meta do perfil), então procurar "exame" nela é
   procurar em undefined. */
export function exameNoProtocolo(S: State): string | null {
  const x = (S.protocol.tasks as any[])
    .find((t) => !t.done && typeof t.t === 'string' && /exame/i.test(t.t));
  return x ? (x.t as string) : null;
}

/** Marca ou desmarca uma tarefa manual. As medidas não passam por aqui. */
export function marcarTarefa(s: any, i: number) {
  const x = s.protocol.tasks[i];
  if (!x || x.metrica) return;
  x.done = !x.done;
}

/* ============================================================
   QUANDO FOI A APLICAÇÃO

   ⚠️ AS PASTILHAS DE DIA SAÍRAM, e com elas a `diasParaAplicar` que as
   montava — hoje e os seis anteriores, com "Hoje", "Ontem",
   "Anteontem" e três dias com nome.

   A folha de registrar passou a abrir com o calendário do mês, já com
   hoje marcado. Os atalhos economizavam um toque que ninguém dava, e
   cobravam o toque caro: quem quer registrar a aplicação de terça tinha
   de traduzir "terça" para uma pastilha, e contar dias para trás de
   cabeça é justamente o que as pessoas erram.

   O que sobrou deste bloco é a regra que não mudou, e que vale para o
   calendário também: "OUTRO HORÁRIO" NÃO VOLTA. A hora de uma aplicação
   não aparece em lugar nenhum do aplicativo — o histórico mostra data, o
   calendário conta por dia, a curva farmacológica trabalha em dias. Um
   controle cujo valor ninguém lê não é um recurso, é uma pergunta que a
   pessoa responde à toa.
   ============================================================ */

/* A hora dentro do dia escolhido: agora quando é hoje, meio-dia quando é
   um dia que já passou. Meio-dia porque a hora precisa existir para o
   registro ter um instante, e porque ela não aparece em tela nenhuma —
   herdar a hora de AGORA num registro de sexta-feira seria inventar um
   detalhe com cara de dado. */
export const instanteDaAplicacao = (t: number) =>
  t === +startOfDay(now()) ? +now() : t + 12 * 3600000;

/* NÃO EXISTE APAGAR APLICAÇÃO, e isso é decisão de produto.

   Chegou a existir, pela mesma regra da água e do treino: o que o app
   deixa criar, ele tem de deixar desfazer. Mas uma aplicação não é um
   copo d'água — é registro de medicamento injetado, o que a equipe lê na
   consulta e o que conta a história do tratamento. Um toque errado
   apagando a dose da semana passada some com um fato clínico.

   Quem registrou errado resolve com quem acompanha. O app não oferece a
   borracha. */

/** Estoque da caneta — quantas doses restam e quando isso vira urgência. */
export function penStock(S: State) {
  const p: any = (S as any).pen || { dosesLeft: 0, dosesPerPen: 4 };
  const semanas = p.dosesLeft * (cadenciaDias(S) / 7);
  const verdict: Verdict = p.dosesLeft <= 1
    ? { label: T.tratamento.estoqueUrgente, good: false }
    : p.dosesLeft <= 3
      ? { label: T.tratamento.estoqueRenovar, good: false }
      : { label: T.tratamento.estoqueEmDia, good: true };
  return { left: p.dosesLeft, total: p.dosesPerPen, semanas, verdict };
}

/* Resumo do tratamento — os cinco números do topo da Jornada. */
/* A LINHA DO DIA, que agora precisa saber contar para trás.

   O cadastro aceita "vou começar em breve", e com isso startT pode estar
   no futuro. A conta que a Home fazia — diffDays + 1, direto no JSX —
   escrevia "Dia -6 do tratamento", que não é frase nenhuma, e ao lado
   dela uma semana de protocolo que ainda não começou.

   Antes de começar o que existe é contagem regressiva; depois, o dia. E
   a semana só entra quando existe semana. */
export function diaDoTratamento(S: State) {
  /* SEM NENHUMA APLICAÇÃO, NÃO HÁ DIA DE TRATAMENTO A CONTAR.

     O cadastro deixou de perguntar a data a quem ainda vai começar —
     muita gente chega ao app antes de ter receita, e pedir uma data que
     ela não tem é pedir um palpite para guardar como fato. Para essa
     pessoa startT é o dia do cadastro, e sem esta guarda a Home abriria
     dizendo "Dia 1 do tratamento" para quem nunca aplicou nada.

     O tratamento começa na primeira dose, e é ela que passa a contar. */
  if (!S.injections.length) return { antes: true, texto: T.tratamento.antesDaPrimeiraDose };
  const d = diffDays(now(), new Date(S.profile.startT));
  if (d < 0) return { antes: true, texto: d === -1 ? T.tratamento.comecaAmanha : T.tratamento.comecaEm(-d) };
  /* "Dia 71", e não "Dia 71 do tratamento". A linha onde isto aparece já
     termina em "Semana 10", e as duas juntas só podem estar contando a
     mesma coisa — dizer de qual tratamento era a palavra que sobrava. */
  return { antes: false, texto: T.tratamento.diaDoTratamento(d + 1) };
}

export function journeySummary(S: State) {
  const lost = lostKg(S);
  const goal = startWeight(S) - S.profile.goalWeight;
  const semanas = Math.max(1, Math.ceil(journeyDay(S) / 7));
  const ritmo = lost / semanas;                       // kg por semana
  /* 0,5–1,5 kg/semana é a faixa que o tratamento costuma render. Fora dela
     o texto não alarma: aponta para conversar com a equipe. */
  /* ⚠️ RITMO NEGATIVO NÃO É "RITMO MAIS LENTO". Sem este primeiro ramo,
     quem ganhou peso caía no último — e o hero da Jornada dizia "Ritmo
     mais lento" em lima, ao lado de um número que subiu. Lento e ao
     contrário são coisas diferentes, e só uma delas é ritmo.

     "Acima do início" é o fato, sem adjetivo: a etiqueta abre /ritmo, e é
     lá que se explica o que ela mede e o que não mede. */
  const verdict: Verdict = lost < 0
    ? { label: T.tratamento.ritmoAcimaDoInicio, good: false, tom: 'ruim' }
    : ritmo >= 0.5 && ritmo <= 1.5
      ? { label: T.tratamento.ritmoSaudavel, good: true, tom: 'bom' }
      /* ⚠️ ACELERADO NÃO É RUIM, E ERA PINTADO COMO RUIM. Perder mais de
         1,5 kg por semana é motivo para conversar com a equipe — massa
         magra, hidratação —, e não um erro que a pessoa cometeu. Vermelho
         cobra; âmbar chama. */
      : ritmo > 1.5
        ? { label: T.tratamento.ritmoAcelerado, good: false, tom: 'atencao' }
        : { label: T.tratamento.ritmoLento, good: true, tom: 'bom' };
  return {
    dia: journeyDay(S), semana: S.protocol.week,
    /* O rótulo já vem com o sinal: quem consome só imprime. Antes ele era
       o número cru e cada tela grudava um "−" na frente. */
    lost, lostLabel: variacaoDe(-lost, '').numero,
    goal, pct: Math.round((lost / goal) * 100),
    faltamLabel: nf(Math.max(0, goal - lost), 1),
    aplicacoes: S.injections.length,
    proximaEmDias: diasAteAplicar(S),
    /* ritmo semanal — diz mais que "71 dias de tratamento", que é trivia */
    ritmo, ritmoLabel: nf(ritmo, 1),
    adesao: adesao(S), streak: streak(S),
    verdict,
  };
}

/* ============================================================
   CUIDADO — a área das pessoas

   Diferente das outras abas, aqui quase nada é calculado: o dado já
   existe pronto no estado (consulta marcada, mensagens, receitas). O que
   falta é seleção — o que está esperando a pessoa, o que está esperando
   a equipe, e o que é só arquivo.
   ============================================================ */

/* Os catálogos de texto do cuidado, lidos na HORA — ver o alto de
   textos/index. */
const P = () => T.cuidado.pendencias;
const E = () => T.cuidado.estado;

/** Última mensagem da conversa com a equipe, com quem falou por último. */
export function lastMessage(S: State) {
  const m = S.messages as any[];
  if (!m.length) return null;
  const u = m[m.length - 1];
  return {
    ...u,
    daEquipe: u.from === 'doc',
    quando: relDay(new Date(u.t)),
  };
}

/** A próxima consulta, com o quanto falta e se já dá para se preparar. */
export function nextConsult(S: State) {
  /* ⚠️ A PERGUNTA CERTA É SE HÁ CONSULTA, e não se há equipe. Ter médico
     não é ter data marcada — e no modo sem plataforma a data é a própria
     pessoa que anota. Com `hasClinic`, alguém com médico e sem consulta
     recebia uma consulta em 1º de janeiro de 1970. */
  if (!temConsulta(S)) return null;
  const d = new Date(S.consult.t);
  const dias = diffDays(d, now());
  return {
    data: d, dias,
    tipo: S.consult.type,
    doutor: S.consult.doctor,
    /* uma semana antes é quando faz sentido começar a juntar perguntas —
       antes disso ainda vai acontecer coisa que vale levar */
    prepararAgora: dias >= 0 && dias <= 7,
    label: quandoEm(dias).label,
  };
}

/** O que está esperando uma ação da pessoa — e só isso.

    ⚠️⚠️ E É A ÚNICA FONTE DISSO, desde que o `careStatus` foi embora. O
    hero da aba Cuidado conta e nomeia as pendências a partir desta lista,
    e não de um segundo cálculo paralelo — o `rotulo` de cada item existe
    para isso: é a palavra curta que entra na frase "duas pendências
    precisam de você — receita e exames".

    Enquanto eram dois cálculos, eles divergiram em três lugares ao mesmo
    tempo, e um deles estava na tela: a mensagem entrava aqui sem exigir
    clínica e lá exigindo; a preparação da consulta entrava aqui e não
    tinha quadro lá; e o quadro da consulta contava "sem consulta
    marcada" como pendência sem ter linha nenhuma aqui. Duas fontes para
    o mesmo fato divergem — é só questão de quando. */
export function carePending(S: State) {
  /* Título curto e sub explicando: a lista virou ListRow, e ListRow tem
     duas linhas. O título diz O QUE fazer, o sub diz por que agora — que
     é a informação que decide se a pessoa toca hoje ou semana que vem.

     O `rotulo` é outra coisa: é como o hero chama este item quando os
     lista numa frase só. "Agendar exame de sangue" é o que se faz; para
     a frase, o assunto é "exames". */
  const out: { ic: string; texto: string; sub?: string; rotulo: string; to: string; urgente?: boolean }[] = [];
  const cs = nextConsult(S);

  /* ⚠️ MENSAGEM PEDE CLÍNICA, e esta linha não pedia.

     Sem vínculo não há quem escreva — `unread` só desce, nunca sobe, e
     /conversa abre um fio com ninguém. O quadro do hero já exigia
     clínica para contar mensagens, e era exatamente nisso que os dois
     números discordavam: "duas pendências" escrito em cima de uma lista
     com três. */
  if (S.unread > 0 && clinicaConectada(S)) out.push({
    ic: 'companion',
    texto: S.unread === 1 ? P().mensagemUma : P().mensagemVarias(S.unread),
    sub: P().mensagemSub,
    rotulo: P().mensagemRotulo,
    to: '/conversa', urgente: true,
  });
  /* ⚠️ A RECEITA ACABANDO É UM FATO, E O DESTINO É QUE MUDAVA.

     A primeira tentativa foi esconder a linha sem plataforma — e, na
     época, isso quebrava uma regra mais antiga: o hero contava as
     pendências por um cálculo separado, e escondida num lugar só a tela
     dizia "duas pendências" em cima de uma lista com uma. Hoje o cálculo
     separado não existe mais e esconder aqui esconderia nos dois — mas
     a linha continua, porque o motivo dela nunca foi o outro cálculo.

     A caneta está acabando para todo mundo. O que muda é para onde a
     pessoa vai resolver: com plataforma, a conversa com a equipe; sem
     ela, o estoque, onde estão as doses e a data. */
  const p = penStock(S);
  if (!p.verdict.good) out.push({
    ic: 'pill', texto: P().receita,
    sub: P().receitaSub(p.left, p.semanas),
    rotulo: P().receitaRotulo,
    /* ⚠️ COM EQUIPE, LEVA AO PEDIDO E NÃO À TELA. "Peça a renovação da
       receita" abria a tela de equipe no alto, e a pessoa ficava
       procurando o botão de pedir — que não existia. Pedir receita É uma
       mensagem para a equipe, e o parâmetro leva direto à conversa com o
       rascunho escrito. Sem equipe, quem resolve é o estoque. */
    to: clinicaConectada(S) ? '/conversa?pedir=receita' : '/aplicacoes',
  });
  const exame = exameNoProtocolo(S);
  /* O exame vem do protocolo. Com equipe, foi ela que pediu; sem
     equipe, quem pede é o próprio plano — e dizer "pedido pela sua
     equipe" inventaria uma. */
  if (exame) out.push({
    ic: 'doc', texto: exame,
    sub: clinicaConectada(S) ? P().exameSubDaEquipe : P().exameSubDoProtocolo,
    rotulo: P().exameRotulo,
    to: '/exames',
  });
  if (cs?.prepararAgora) out.push({
    ic: 'cal', texto: P().consulta,
    sub: P().consultaSub(cs.tipo.toLowerCase(), cs.label, cs.doutor),
    rotulo: P().consultaRotulo,
    to: '/consultas',
  });
  return out;
}

/* ⚠️ ONDE UM DOCUMENTO ABRE depende do que ele é, e essa regra vivia
   escondida dentro de careDocs. A tela de equipe lista os mesmos
   documentos e não abria nenhum; para abrir, ela ia ter que repetir o
   teste — e duas cópias de "isto é um exame?" divergem na primeira vez
   que alguém acrescentar um tipo. */
export const destinoDoDocumento = (kind: string) =>
  /exame/i.test(kind) ? '/exames' : '/resumo-medico';

/** Documentos e exames em uma lista só, do mais recente para o mais antigo. */
export function careDocs(S: State, n = 3) {
  const docs = (S.documents as any[]).map((d) => ({
    t: d.t, nome: d.name, tipo: d.kind,
    to: destinoDoDocumento(d.kind),
  }));
  const recs = (S.prescriptions as any[]).map((r) => ({
    t: r.t, nome: r.name, tipo: 'Receita', to: '/medico',
  }));
  return [...docs, ...recs].sort((a, b) => b.t - a.t).slice(0, n);
}

/* ============================================================
   A EQUIPE, NUM FORMATO SÓ

   ⚠️ O ESTADO GUARDA A EQUIPE EM DUAS CASAS, e as telas liam as duas.

   A responsável mora em `profile.doctor`, `profile.clinic` e
   `profile.doctorInfo`; o resto mora em `S.team`. São formatos
   diferentes para a mesma coisa — uma tem `crm` e `especialidade`, a
   outra tem `role` —, e cada tela que precisava das duas juntava do seu
   jeito. A tela de equipe chegou a reescrever a lista à mão dentro do
   JSX, com uma pessoa de fora e dois papéis divergindo da fonte.

   Unificar as duas casas tocaria o cadastro, a ficha de acompanhamento e
   a aba Cuidado, e não é o que a reforma da tela pede. O que entra é um
   adaptador: o estado continua com duas casas, e QUEM LÊ passa a ter uma.

   ⚠️ E ELE DEVOLVE CAMPOS OPCIONAIS DE PROPÓSITO. Quem vier da clínica um
   dia pode não ter registro, formação ou foto. A tela que consome isto
   some com a seção em vez de desenhar um cabeçalho vazio — é a regra da
   casa, e ela só funciona se a ausência chegar como ausência.
   ============================================================ */

export type FichaDaEquipe = {
  /** estável e legível — vira `?id=` na URL do perfil */
  id: string;
  nome: string;
  papel: string;
  responsavel: boolean;
  registro?: string;
  sobre?: string;
  formacao?: string[];
  areas?: string[];
  anos?: number;
  pacientes?: number;
  rating?: number;
  avaliacoes?: number;
};

const semAcento = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/* O id sai do primeiro nome, sem o tratamento: "Dra. Helena Costa" vira
   "helena".

   ⚠️ E ELE É CALCULADO NA LEITURA, E NÃO GRAVADO POR MIGRAÇÃO. Quem já
   tinha equipe guardada no formato antigo — só nome, papel e sobre — não
   tem `id`, e a alternativa seria escrever um campo novo no estado de
   alguém para resolver um problema que o leitor resolve sozinho. Uma
   migração a menos, e o estado continua sendo o que a pessoa tem. */
export const idDoNome = (nome: string) =>
  semAcento(nome.split(/\s+/).find((w) => !w.endsWith('.')) ?? nome)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export function fichaDaEquipe(S: State): FichaDaEquipe[] {
  const p: any = S.profile ?? {};
  const info: any = p.doctorInfo ?? {};

  /* ⚠️ A RESPONSÁVEL TEM ID FIXO, e não derivado do nome. Ela é um
     PAPEL antes de ser uma pessoa: trocar de médica na clínica não pode
     quebrar um link guardado nem mudar o endereço do perfil. */
  const responsavel: FichaDaEquipe[] = p.doctor ? [{
    id: 'responsavel',
    nome: p.doctor,
    papel: info.especialidade || T.cuidado.equipe.responsavelPadrao,
    responsavel: true,
    registro: info.crm || undefined,
    sobre: info.sobre || undefined,
    formacao: info.formacao?.length ? info.formacao : undefined,
    areas: info.abordagens?.length ? info.abordagens : undefined,
    anos: info.anos,
    pacientes: info.pacientes,
    rating: info.rating,
    avaliacoes: info.avaliacoes,
  }] : [];

  const resto: FichaDaEquipe[] = (((S as any).team ?? []) as any[])
    .filter((m) => m?.name)
    .map((m) => ({
      id: m.id || idDoNome(m.name),
      nome: m.name,
      papel: m.role || '',
      responsavel: false,
      registro: m.registro || undefined,
      sobre: m.sobre || undefined,
      formacao: m.formacao?.length ? m.formacao : undefined,
      areas: m.areas?.length ? m.areas : undefined,
    }));

  return [...responsavel, ...resto];
}

/* ============================================================
   A FICHA DA CLÍNICA

   ⚠️ ELA PODE NÃO EXISTIR, e esse é o caso mais provável de todos.

   Três cenários chegam por aí, e o aplicativo tem que servir os três sem
   fingir o que falta:

   · um profissional sozinho, sem clínica nenhuma;
   · uma clínica que é uma médica com uma sala;
   · uma clínica com equipe.

   Desenhar para o terceiro e deixar os outros dois com buracos é o
   caminho fácil — e é o que produz tela com cabeçalho de seção vazia e
   botão que não leva a lugar nenhum. Aqui a regra é a de sempre: existe
   clínica, existe a ficha; não existe, não existe entrada para ela.

   ⚠️ E NÃO HÁ BLOCO DE CONTATO. Telefone, site e endereço não estão no
   estado, e inventá-los na semente seria diferente de inventar um CRN:
   um CRN falso não faz nada, um TELEFONE falso liga para a casa de
   alguém. Quando a clínica mandar os dados, eles entram — até lá o canal
   que existe é a conversa, que já está na tela.
   ============================================================ */
/* ============================================================
   COMO SE FALA COM A CLÍNICA

   ⚠️ ISTO EXISTE PARA QUEM NÃO É PACIENTE DELA. Quem é paciente tem a
   conversa dentro do aplicativo, e ela é melhor: fica registrada, chega
   à equipe inteira e não depende de ninguém ter o número certo. Quem
   ainda não é não tem conversa nenhuma — e mandar essa pessoa para um
   botão que não existe é pior do que mandá-la para o telefone.

   ⚠️ E CADA CAMPO É OPCIONAL, UM POR UM. A clínica que só tem WhatsApp
   manda só o WhatsApp. Nenhuma linha aparece sem o dado dela, porque
   "Telefone —" numa lista de contatos é a tela prometendo um canal que
   não existe.

   ⚠️ TELEFONE E WHATSAPP NÃO TÊM VALOR DE SEMENTE, e a ausência é a
   decisão. Um registro profissional inventado não faz nada; um telefone
   inventado faz alguém ligar para a casa de um estranho. Site e e-mail
   podem porque existe TLD reservado — nada em `.example` pertence a
   ninguém, hoje nem nunca (RFC 2606). Para telefone não existe
   equivalente, então não existe semente.
   ============================================================ */
export type ContatoDaClinica = {
  /** só dígitos, com DDI: é o que vai na URL, e formatar isso é da tela */
  whatsapp?: string;
  /** como se lê, com parênteses e traço — o link tira o que não é dígito */
  telefone?: string;
  site?: string;
  email?: string;
  /** sem arroba; a tela põe */
  instagram?: string;
};

/* As linhas da lista de contato, na ordem em que fazem sentido: o canal
   mais rápido primeiro, o mais formal por último. */
export function contatosDaClinica(ct?: ContatoDaClinica) {
  if (!ct) return [];
  const soDigitos = (v: string) => v.replace(/\D/g, '');
  const linhas: { ic: string; titulo: string; sub: string; url: string }[] = [];
  const C = T.cuidado.contato;
  if (ct.whatsapp) linhas.push({ ic: 'companion', titulo: C.whatsapp, sub: C.whatsappSub, url: `https://wa.me/${soDigitos(ct.whatsapp)}` });
  if (ct.telefone) linhas.push({ ic: 'phone', titulo: C.telefone, sub: ct.telefone, url: `tel:${soDigitos(ct.telefone)}` });
  if (ct.site) linhas.push({ ic: 'site', titulo: C.site, sub: ct.site, url: /^https?:/.test(ct.site) ? ct.site : `https://${ct.site}` });
  if (ct.email) linhas.push({ ic: 'mail', titulo: C.email, sub: ct.email, url: `mailto:${ct.email}` });
  if (ct.instagram) linhas.push({ ic: 'at', titulo: C.instagram, sub: `@${ct.instagram}`, url: `https://instagram.com/${ct.instagram}` });
  return linhas;
}

export type FichaDaClinica = {
  nome: string;
  especialidade?: string;
  cidade?: string;
  sobre?: string;
  /** rua, número e bairro — a cidade vem separada porque aparece sozinha */
  endereco?: string;
  horario?: string;
  convenios?: string[];
  /* ⚠️ O ENDEREÇO É TEXTO, e não um mapa que abre. Um endereço clicável
     manda alguém até uma porta, e enquanto o dado vier de semente essa
     porta é de um estranho. A ação entra junto com o dado de verdade. */
  contato?: ContatoDaClinica;
  /** desde quando o vínculo existe, para a tela poder dizer há quanto tempo */
  desde?: number;
  equipe: FichaDaEquipe[];
};

export function fichaDaClinica(S: State): FichaDaClinica | null {
  const p: any = S.profile ?? {};
  if (!p.clinic) return null;
  const info: any = p.clinicInfo ?? {};
  return {
    nome: p.clinic,
    especialidade: info.especialidade || undefined,
    cidade: info.cidade || undefined,
    sobre: info.sobre || undefined,
    endereco: info.endereco || undefined,
    horario: info.horario || undefined,
    convenios: info.convenios?.length ? info.convenios : undefined,
    contato: info.contato,
    desde: p.vinculo?.desde,
    equipe: fichaDaEquipe(S),
  };
}

/** Sem `id`, a responsável — que é o comportamento antigo de /especialista. */
export const fichaDe = (S: State, id?: string): FichaDaEquipe | undefined => {
  const todas = fichaDaEquipe(S);
  return id ? todas.find((f) => f.id === id) : todas[0];
};

/* ⚠️⚠️ AQUI MORAVA O `careStatus`, E ELE ERA A SEGUNDA FONTE.

   Ele montava quatro quadros — consulta, mensagens, receita, exames —
   com nível cada um, para um painel chamado "Seu cuidado hoje" que saiu
   da aba há várias rodadas. Sem o painel, sobrou um único consumidor: o
   `careState` logo abaixo, que só lia dele a CONTAGEM dos quadros fora
   do "ok" e os nomes deles.

   Ou seja, o aplicativo calculava as pendências duas vezes — uma para
   dizer quantas são, outra para listá-las — e as duas contas discordavam
   em três pontos:

   · a MENSAGEM entrava na lista sem exigir clínica e no quadro exigindo;
   · a PREPARAÇÃO DA CONSULTA entrava na lista, entre quatro e sete dias
     antes, e não tinha quadro nenhum;
   · o quadro da CONSULTA contava "sem consulta marcada" como pendência,
     e para isso não há linha na lista.

   O terceiro já tinha sido caçado uma vez, e o comentário que o
   registrava morreu junto com o quadro: ele dizia, com todas as letras,
   "duas fontes para o mesmo fato de novo, e é sempre o mesmo defeito".
   Era, e continuou sendo enquanto houve duas.

   Agora há uma: `carePending`. O hero conta o comprimento dela e nomeia
   os itens pelo `rotulo` de cada um. O que a lista mostra e o que a
   frase diz não podem mais divergir, porque são a mesma coisa lida duas
   vezes. */

/* Três níveis e não dois. "Precisa de atenção" junta coisas muito
   diferentes: uma receita que vence em três semanas e um exame já
   atrasado não pedem a mesma reação, e tratá-los igual ensina a pessoa a
   ignorar os dois. */
export type CareNivel = 'ok' | 'atencao' | 'acao';

/* ============================================================
   O ESTADO DO ACOMPANHAMENTO, EM UMA FRASE

   carePending responde "o que exige um toque meu" — uma lista, item por
   item. Serve a uma lista. Mas o hero não é lista: ele tem que dizer,
   numa frase só, o que está acontecendo com o acompanhamento AGORA. E
   quando o que está acontecendo é justamente a pilha de pendências, é
   dela que a frase se monta — contagem e nomes —, para que a manchete e
   a lista logo abaixo nunca digam números diferentes.

   E o que está acontecendo muda de natureza ao longo do mês. Faltando
   três dias para a consulta, o assunto do cuidado é a consulta. No dia
   seguinte a ela, é a orientação nova. Com a receita vencendo, é a
   receita. No resto do tempo — que é a maior parte — é a continuidade.

   Por isso a saída é um estado nomeado e não um texto montado por
   concatenação: cada momento tem manchete própria, e a ordem em que os
   estados são testados é a ordem de precedência entre eles.
   ============================================================ */
export type CareMomento = 'consulta' | 'posConsulta' | 'pendencia' | 'emDia';

export function careState(S: State) {
  const cs = nextConsult(S);
  const pend = carePending(S);
  const semanas = Math.max(1, Math.floor(diffDays(now(), new Date(S.profile.startT)) / 7));
  const ad = adesao(S);

  /* Dois números e um rótulo, não três números.

     A primeira versão punha a adesão como terceiro "big number", e ela
     não é número: é veredito. Escrita em corpo 25 numa coluna de um
     terço, "Boa adesão" cortava — e a solução não era diminuir a fonte,
     era reconhecer que ali não cabia um número porque ali não HÁ um.
     Adesão desceu para a linha do pulso, onde qualificador é a gramática
     do lugar.

     Os dois que ficaram são contagens de verdade — duração e volume — e
     por isso ganham a leitura de relance que o princípio 9 pede: valor
     em cima, unidade embaixo. */
  /* ⚠️⚠️ A CONTA, E ERA UMA NOTA.

     A pastilha do hero dizia "Boa adesão", "Adesão regular" ou "Adesão
     baixa", e a terceira é a que importa: ela aparece no alto da aba de
     quem perdeu duas doses — e perdeu, quase sempre, porque passou mal.
     O aplicativo transformava uma consequência do tratamento numa nota
     sobre a pessoa, no primeiro lugar em que o olho cai.

     "8 de 11 aplicações" diz a mesma coisa sem julgar, e diz MAIS: a nota
     achatava 70% e 89% no mesmo rótulo, e o número não achata nada. É
     também como o resto do aplicativo fala — "9 de 13 noites
     registradas", "3 de 4 doses na caneta", "2 de 5 cumpridas". A
     pastilha era a única que dava nota.

     ⚠️ E NÃO É ESCONDER O FATO. Quem está com metade das doses continua
     vendo metade das doses, no mesmo lugar e com o mesmo destaque. O que
     sai é o adjetivo. */
  const previstas = dosesPrevistas(S);
  /* "doses" e não "aplicações": a pastilha divide a linha com o pulso,
     que pode ser "3 itens pendentes", e a palavra longa empurrava o pulso
     para duas linhas. O estoque da caneta diz "3 de 4 doses na caneta",
     com o qualificador — aqui, ao lado da contagem de pendências, doses
     sem qualificador são as que foram tomadas. */
  const adRotulo = E().adesao(S.injections.length, previstas);
  const metricas: { valor: string; label: string }[] = [
    { valor: String(semanas), label: E().metricaSemanas },
    { valor: String(S.injections.length), label: E().metricaAplicacoes },
  ];

  /* O plano em números.

     A régua de traços que vivia no hero não dizia nada, e a razão é que
     ela não tinha REFERÊNCIA: onze traços acesos não significam nada
     sem saber quantos existem ao todo. Barra sem denominador é decoração
     com aparência de dado.

     ⚠️ E O DENOMINADOR ERA INVENTADO. Ele saía de `profile.planoSemanas`,
     um campo que só existia na semente com o valor 16: nenhuma equipe
     combinou aquilo, o cadastro nunca o escreveu, e a tela dizia "de 16
     previstas no seu plano" para todo mundo. Número inventado com cara
     de plano médico é a pior espécie dos dois.

     AGORA O HORIZONTE É O DA META. São as semanas que o ritmo escolhido
     leva para chegar ao peso combinado — a mesma conta que a tela de
     plano mostra, e que muda quando a pessoa muda o ritmo ou a meta.
     Tratamento com GLP-1 não tem data de alta; o que tem data é a meta
     que a pessoa escolheu perseguir.

     E O HORIZONTE NUNCA É MENOR QUE O PRESENTE. Quem passou da conta
     continua andando: a régua cresce com a pessoa em vez de deixá-la
     fora dela. */
  const { grade, aplicadas } = semanasDaGrade(S);
  /* A semana corrente vem da grade, não de `semanas`.

     `semanas` é quantas se COMPLETARAM — floor(dias/7) —, e a que a pessoa
     está vivendo é a seguinte. Usar uma no lugar da outra deslocava a
     régua em um: o marcador de "agora" caía sobre uma semana já cumprida,
     e a semana de fato corrente aparecia como prevista. */
  const ateAMeta = planoDoPerfil(S).semanas;
  const plano = {
    previstas: Math.max(grade.length, ateAMeta ?? 0),
    /** há meta a perseguir, e portanto um horizonte de verdade */
    temHorizonte: ateAMeta != null,
    atual: grade.length,
    cumpridas: aplicadas,
  };

  const base = { metricas, semanas, adesaoRotulo: adRotulo, plano };

  /* ⚠️ AQUI O ESTADO SEM MÉDICO SAÍA PELA PORTA DOS FUNDOS.

     Antes de qualquer leitura do tratamento, quem não tinha equipe
     recebia uma frase sobre não ter equipe — e perdia todo o resto. A
     pessoa abria a aba Cuidado no meio da semana 11, com a adesão em
     91% e um exame pendente, e o aplicativo respondia falando da
     ausência de um médico. O único assunto que ele tinha para ela era o
     que faltava.

     O estado saiu. Sem médico, o hero passa a ler exatamente o que lê
     para todo mundo: as pendências quando há, e a continuidade quando
     não há. Quem acompanha virou um bloco da tela, que é o tamanho certo
     disso — e não a manchete. */

  /* A consulta chegando vence tudo: nos dias que a antecedem, ela é o
     acompanhamento. Três dias é a janela em que dá tempo de preparar
     alguma coisa — antes disso ainda vai acontecer o que vale levar. */
  if (cs && cs.dias >= 0 && cs.dias <= 3) return {
    ...base, momento: 'consulta' as CareMomento, nivel: 'atencao' as CareNivel,
    kicker: E().kicker,
    titulo: E().consultaTitulo,
    /* O resumo saiu daqui e virou a faixa de vidro no pé do card. Numa
       frase corrida ele é informação; como faixa, com ícone e chevron,
       ele é uma coisa que se pode abrir — e era isso que ele queria ser
       desde o começo. */
    texto: cs.dias === 0
      ? E().consultaHoje(cs.doutor)
      : E().consultaFaltam(cs.dias, cs.doutor),
    pulso: E().consultaPulso(cs.label),
  };

  /* Logo depois da consulta o tratamento costuma ter mudado, e é isso que
     a pessoa volta aqui para conferir. */
  const ultima = (S.consultsHistory as any[]).slice().sort((a, b) => b.t - a.t)[0];
  /* ⚠️ "SUA EQUIPE ATUALIZOU SEU TRATAMENTO" SÓ É VERDADE COM
     PLATAFORMA — é ela que traz a orientação nova. Sem servidor, o app
     não sabe o que foi decidido na sala: ele sabe que a consulta
     aconteceu, porque a pessoa disse. A frase muda de dono. */
  if (ultima && diffDays(now(), new Date(ultima.t)) <= 2) return {
    ...base, momento: 'posConsulta' as CareMomento, nivel: 'ok' as CareNivel,
    kicker: E().kicker,
    titulo: clinicaConectada(S) ? E().posConsultaTituloComPlataforma : E().posConsultaTituloSemPlataforma,
    texto: clinicaConectada(S) ? E().posConsultaTextoComPlataforma : E().posConsultaTextoSemPlataforma,
    pulso: E().posConsultaPulso,
  };

  if (pend.length > 0) return {
    ...base, momento: 'pendencia' as CareMomento, nivel: 'acao' as CareNivel,
    kicker: E().kicker,
    titulo: E().pendenciaTitulo,
    /* nomeia o que é, em vez de contar quantos: "duas coisas" obriga a
       rolar para descobrir se importa.

       ⚠️ E OS NOMES SÃO OS DA PRÓPRIA LISTA, item por item. Vinham dos
       rótulos dos quadros do `careStatus`, que eram outro conjunto: dava
       para a frase nomear um assunto que a lista não tinha, e para a
       lista ter um item que a frase não nomeava. */
    texto: E().pendenciaTexto(
      E().porExtenso[pend.length] ?? String(pend.length),
      pend.length !== 1,
      T.comum.lista(pend.map((it) => it.rotulo)),
    ),
    pulso: E().pendenciaPulso(pend.length),
  };

  /* ⚠️ E ESTA FRASE COMEÇAVA PELO NOME DA MÉDICA. Sem ninguém
     registrado ela abria com um espaço em branco: " acompanha seu
     tratamento há 10 semanas". Quem conduz o tratamento sozinha conduz
     há o mesmo tanto de tempo, e é isso que a frase passa a dizer. */
  const quem = S.profile.doctor || S.profile.clinic;
  return {
    ...base, momento: 'emDia' as CareMomento, nivel: 'ok' as CareNivel,
    kicker: E().kicker,
    titulo: E().emDiaTitulo,
    texto: quem ? E().emDiaComQuem(quem, semanas) : E().emDiaSozinha(semanas),
    pulso: E().emDiaPulso,
  };
}

/* Contexto do tratamento — as três frases curtas que fazem a dose parecer
   acompanhada em vez de só registrada. */
export function doseContext(S: State) {
  const nd = diasAteAplicar(S);
  const injs = S.injections as any[];

  /* há quanto tempo a dose atual não muda: acha a primeira aplicação da
     dose vigente andando de trás para frente */
  const atual = injs.length ? injs[injs.length - 1].dose : S.profile.dose;
  let i = injs.length - 1;
  while (i > 0 && injs[i - 1].dose === atual) i--;
  const desde = injs.length ? Math.max(1, Math.round(diffDays(now(), new Date(injs[i].t)) / 7)) : 0;

  const cs = nextConsult(S);
  const D = T.cuidado.dose;
  return {
    proxima: quandoEm(nd).hoje ? D.aplicacaoHoje : D.proximaAplicacao(quandoEm(nd).label),
    naDose: desde > 0 ? D.nestaDoseHa(desde) : null,
    revisao: cs ? D.revisaoNaConsulta(cs.dias <= 0 ? D.revisaoHoje : cs.label) : null,
  };
}

/* ============================================================
   CICLO EM QUATRO FASES — a leitura das telas internas

   doseCycle() divide o ciclo em cinco etapas e é o que alimenta a Home e
   a Jornada: lá a pergunta é "em que ponto eu estou AGORA", e cinco
   etapas dão granularidade para a frase do dia mudar.

   A tela de Ciclo pergunta outra coisa — "como é o ciclo inteiro" — e aí
   cinco linhas é uma a mais do que a pessoa consegue guardar. Aplicação e
   pico são a mesma experiência vivida ("o efeito está subindo"), então
   viram uma fase só. Sobram quatro, que é o número de coisas que cabe na
   cabeça de quem está lendo isto pela primeira vez.

   As duas leituras convivem de propósito: nenhuma tela de aba muda por
   causa desta função.
   ============================================================ */
export type CicloFase = {
  key: string;
  /** "Dias 1–2 · subida" */
  titulo: string;
  /** o que a fase é, em meia linha */
  sub: string;
  /** primeiro e último dia do ciclo que a fase cobre */
  de: number; ate: number;
  comum: string;
  ajuda: string;
  /** só a fase de descida tem: é quando os sintomas que pedem médico aparecem */
  atencao?: string;
};

/* ⚠️ FUNÇÃO PELO MESMO MOTIVO DE `examCats`: constante de módulo lê o
   catálogo no import e congela o idioma. */
export const cicloFasesFixas = (): CicloFase[] => [
  {
    key: 'subida', titulo: T.ciclo.faseSubidaTitulo, sub: T.ciclo.faseSubidaSub,
    de: 1, ate: 2,
    comum: T.ciclo.faseSubidaComum,
    ajuda: T.ciclo.faseSubidaAjuda,
  },
  {
    key: 'plato', titulo: T.ciclo.fasePlatoTitulo, sub: T.ciclo.fasePlatoSub,
    de: 3, ate: 4,
    comum: T.ciclo.fasePlatoComum,
    ajuda: T.ciclo.fasePlatoAjuda,
  },
  {
    key: 'descida', titulo: T.ciclo.faseDescidaTitulo, sub: T.ciclo.faseDescidaSub,
    de: 5, ate: 6,
    comum: T.ciclo.faseDescidaComum,
    ajuda: T.ciclo.faseDescidaAjuda,
    atencao: T.ciclo.faseDescidaAtencao,
  },
  {
    key: 'baixo', titulo: T.ciclo.faseBaixoTitulo, sub: T.ciclo.faseBaixoSub,
    de: 7, ate: 99,
    comum: T.ciclo.faseBaixoComum,
    ajuda: T.ciclo.faseBaixoAjuda,
  },
];

/** Onde a pessoa está nas quatro fases, e o rótulo de cada uma em relação
    a hoje: "passou", "agora", "amanhã" ou o intervalo que falta. */
export function cicloFases(S: State) {
  const { dayIn, total, nextDose } = doseCycle(S);
  const fases = cicloFasesFixas().map((f) => {
    const estado: 'passou' | 'agora' | 'amanha' | 'depois' =
      dayIn > f.ate ? 'passou'
        : dayIn >= f.de ? 'agora'
          : f.de === dayIn + 1 ? 'amanha' : 'depois';
    const Se = T.rotina.selo;
    const selo = estado === 'passou' ? Se.passou
      : estado === 'agora' ? Se.agora
        : estado === 'amanha' ? Se.amanha : Se.emDias(f.de - dayIn);
    return { ...f, estado, selo };
  });
  const atual = fases.find((f) => f.estado === 'agora') ?? fases[fases.length - 1];
  return { dayIn, total, nextDose, fases, atual, pct: Math.round((dayIn / total) * 100) };
}

/* ============================================================
   CANETAS — o histórico do que foi aberto

   O estado guarda quantas doses sobraram na caneta atual, não uma lista
   de canetas. A lista é reconstruída a partir das aplicações: a caneta em
   uso cobre as últimas (dosesPerPen − dosesLeft) aplicações, e o resto do
   histórico é fatiado de trás para frente em blocos do mesmo tamanho.

   Reconstruir em vez de guardar significa que trocar a contagem de doses
   por caneta no perfil reescreve o histórico inteiro — que é justamente o
   comportamento certo enquanto a caneta não for uma entidade do estado.
   ============================================================ */

/* A validade depois de aberta virou campo de MEDS — ela varia por produto
   e não se deduz da molécula nem da cadência. Ver o bloco sobre `shelf`
   em logic/meds. */

export type Caneta = {
  id: number;
  /** 'uso' | 'fim' — a de cima é a que está aberta */
  estado: 'uso' | 'fim';
  label: string; dose: number; unit: string;
  usadas: number; total: number;
  /** timestamp da primeira aplicação da caneta; null se ainda não foi aberta */
  abertaEm: number | null;
  ultimaEm: number | null;
  aplicacoes: { t: number; site: string; dose: number }[];
};

export function canetas(S: State): Caneta[] {
  const p: any = (S as any).pen || { dosesLeft: 0, dosesPerPen: 4 };
  const total: number = p.dosesPerPen || 4;
  const injs = (S.injections as any[]).slice().sort((a, b) => a.t - b.t);
  const med = M(S);

  /* A caneta aberta pode estar pela metade; as anteriores sempre foram
     usadas até o fim. Por isso o corte começa pelo pedaço de cima. */
  const emUso = Math.max(0, Math.min(total, total - p.dosesLeft));
  const blocos: any[][] = [];
  let fim = injs.length;
  if (emUso > 0) { blocos.push(injs.slice(fim - emUso)); fim -= emUso; }
  while (fim > 0) { const ini = Math.max(0, fim - total); blocos.push(injs.slice(ini, fim)); fim = ini; }

  return blocos.map((bl, i) => ({
    id: i,
    estado: i === 0 && emUso > 0 ? 'uso' : 'fim',
    label: med.label,
    dose: bl.length ? bl[bl.length - 1].dose : S.profile.dose,
    unit: med.unit,
    usadas: bl.length,
    total,
    abertaEm: bl.length ? bl[0].t : null,
    ultimaEm: bl.length ? bl[bl.length - 1].t : null,
    aplicacoes: bl.map((x) => ({ t: x.t, site: x.site, dose: x.dose })),
  }));
}

/** A caneta aberta e o que decorre dela: validade, cobertura e o veredito
    de estoque que a Jornada já mostra no card de receita. */
export function canetaAtual(S: State) {
  const lista = canetas(S);
  const atual = lista[0] ?? null;
  const est = penStock(S);
  const cad = cadenciaDias(S);
  /* ⚠️⚠️ A VALIDADE PODE SER DESCONHECIDA, e antes ela não podia.

     `SHELF_DAYS` devolve o prazo de bula, e para medicamento manipulado
     não existe prazo de bula: quem define é a farmácia que preparou. No
     catálogo isso é `shelf: 0`, que quer dizer NÃO SABEMOS — e não "vence
     hoje".

     A ordem é: o que a pessoa respondeu ao registrar o recipiente ganha
     do catálogo, porque é o prazo daquele frasco; o catálogo entra quando
     ela não respondeu; e quando nenhum dos dois existe, isto é `null` e
     quem consome tem de calar. Anunciar um vencimento que ninguém
     calculou é as duas piores coisas ao mesmo tempo num aplicativo de
     tratamento: mandar descartar o que está bom, ou autorizar o que não
     está. */
  const doCatalogo = SHELF_DAYS(S.profile.med);
  const validadeDias: number | null = (S as any).pen?.validadeDias ?? (doCatalogo > 0 ? doCatalogo : null);
  const vence = atual?.abertaEm && validadeDias
    ? addDays(new Date(atual.abertaEm), validadeDias)
    : null;
  /* Cobertura da receita: o que ainda há de dose vezes a cadência, contado
     a partir da próxima aplicação. É uma estimativa do app, não um dado da
     receita — o texto na tela diz "cerca de". */
  const cobreAte = addDays(nextInjectionDate(S), Math.max(0, est.left - 1) * cad);

  /* A caneta pode vencer ANTES de a última dose sair dela. Com Trulicity —
     14 dias de validade e 4 doses semanais — isso é a regra, não a exceção:
     a quarta dose cairia duas semanas depois de a caneta ter vencido. Quem
     consome decide o que fazer com o aviso; aqui só se constata. */
  const venceAntesDoFim = !!vence && vence < cobreAte;

  return { atual, lista, ...est, vence, cobreAte, validadeDias, venceAntesDoFim };
}

/* ============================================================
   NOTAS PARA A CONSULTA

   A lista é a fonte; o texto corrido é uma PROJEÇÃO dela, gerada só na
   hora de montar o relatório. O caminho inverso — guardar texto e tentar
   extrair estrutura — foi o que existia antes, e não sobrevive à primeira
   pergunta que a tela precisa responder: "esta nota é de antes ou depois
   de eu subir a dose?".
   ============================================================ */
export type Nota = { t: number; text: string; done: boolean };

export const notas = (S: State): Nota[] =>
  ((S as any).notes || []).slice().sort((a: Nota, b: Nota) => b.t - a.t);

export const notasAbertas = (S: State) => notas(S).filter((n) => !n.done);

/* ============================================================
   O PREPARO DA CONSULTA

   ⚠️ ERA UM CHECKLIST DE QUATRO FRASES FIXAS, marcado à mão e guardado em
   `useState` — ou seja, esquecido ao sair da tela. Alguém marcava
   "pesar-se na véspera", voltava no dia seguinte e encontrava tudo em
   branco. Lista de preparação que esquece é pior do que nenhuma: ela
   pede o trabalho duas vezes e não credita nenhuma.

   ⚠️ MAS O DEFEITO MAIOR ERA OUTRO: TRÊS DOS QUATRO ITENS SÃO COISAS QUE
   O APLICATIVO JÁ SABE. Ele sabe quando foi a última pesagem, quantas
   dúvidas estão anotadas e se há exame recente — e mesmo assim pedia que
   a pessoa marcasse à mão que fez aquilo. Um aplicativo que registra o
   peso e depois pergunta "você se pesou?" está desperdiçando a única
   coisa que ele tem de especial.

   Aqui cada item é uma LEITURA do estado. Ele não pergunta: ele responde,
   e a ação leva para onde a resposta muda. O que não pode ser derivado
   não entra — não há item de "ter os exames em mãos" porque estar com o
   papel na bolsa é do mundo, e o aplicativo não tem como saber.
   ============================================================ */
export type ItemDoPreparo = {
  id: string;
  ic: string;
  titulo: string;
  sub: string;
  /** o estado já está resolvido — a linha vira confirmação, e não tarefa */
  pronto: boolean;
  to: string;
};

/** Pesagem fresca é a de até três dias: a consulta olha tendência, e o
    peso de uma semana atrás já não é o de hoje. */
const DIAS_DE_PESO_FRESCO = 3;
/** Exame de até três meses ainda descreve o tratamento atual. */
const DIAS_DE_EXAME_RECENTE = 90;

export function preparoDaConsulta(S: State): ItemDoPreparo[] {
  const itens: ItemDoPreparo[] = [];

  const w = (S.weights as any[])[S.weights.length - 1];
  const diasDoPeso = w ? diffDays(now(), new Date(w.t)) : null;
  const R = T.rotina.preparo;
  itens.push(
    diasDoPeso == null
      ? { id: 'peso', ic: 'scale', titulo: R.pesoNenhum, sub: R.pesoNenhumSub, pronto: false, to: '/medir-peso' }
      : diasDoPeso <= DIAS_DE_PESO_FRESCO
        ? { id: 'peso', ic: 'scale', titulo: R.pesoEmDia, sub: R.pesoSub(pesoTxt(S, w.kg), rotuloDeDias(diasDoPeso)), pronto: true, to: '/medir-peso' }
        : { id: 'peso', ic: 'scale', titulo: R.pesoAntigo, sub: R.pesoAntigoSub(rotuloDeDias(diasDoPeso)), pronto: false, to: '/medir-peso' },
  );

  const abertas = notasAbertas(S).length;
  itens.push(abertas
    ? { id: 'notas', ic: 'pencil', titulo: R.notasProntas, sub: R.notasProntasSub(abertas), pronto: true, to: '/notas' }
    : { id: 'notas', ic: 'pencil', titulo: R.notasVazias, sub: R.notasVaziasSub, pronto: false, to: '/nota' });

  /* ⚠️ O PACOTE, E NÃO O MARCADOR SOLTO. `exams` guarda cada marcador com
     a série inteira dele; `examBundles` guarda o dia em que um exame foi
     entregue. A pergunta aqui é "tem exame recente?", e quem responde isso
     é a entrega. */
  const pacotes = ((S as any).examBundles ?? []) as { t: number; name: string }[];
  const ultimo = pacotes.slice().sort((a, b) => b.t - a.t)[0];
  const diasDoExame = ultimo ? diffDays(now(), new Date(ultimo.t)) : null;
  itens.push(
    ultimo && diasDoExame != null && diasDoExame <= DIAS_DE_EXAME_RECENTE
      ? { id: 'exames', ic: 'chart', titulo: R.examesRecentes, sub: R.examesRecentesSub(ultimo.name, rotuloDeDias(diasDoExame)), pronto: true, to: '/exames' }
      : { id: 'exames', ic: 'chart', titulo: R.exames, sub: ultimo ? R.examesAntigosSub(rotuloDeDias(diasDoExame!)) : R.examesNenhumSub, pronto: false, to: '/exames' },
  );

  return itens;
}

/* ============================================================
   O PERÍODO DE UMA CONSULTA

   ⚠️ NÃO É "O QUE VEIO DESTA CONSULTA", E A DIFERENÇA É TUDO.

   A tentação é ligar as coisas à consulta: a receita de 18 de agosto foi
   dada NAQUELA consulta, a dose subiu POR CAUSA dela. Provavelmente sim —
   e "provavelmente" sobre a medicação de alguém não é uma coisa que este
   aplicativo pode afirmar. Ele não estava na sala. O que ele sabe é a
   data de cada registro, e data não é causa.

   Então o que esta leitura devolve é um INTERVALO: o que aconteceu entre
   esta consulta e a seguinte. Isso é verificável, e responde a mesma
   pergunta sem inventar a parte que falta — "o que mudou desde que eu
   estive lá" é, afinal, o que alguém quer saber ao abrir uma consulta
   passada.

   ⚠️ E O ÚLTIMO INTERVALO AINDA CORRE. A consulta mais recente não tem
   uma seguinte, então o período dela vai até hoje e é dito assim: "até
   agora", e não uma data fechada que ele não tem.
   ============================================================ */
export type MudancaDoPeriodo = { id: string; ic: string; titulo: string; sub?: string };

export type PeriodoDaConsulta = {
  t: number;
  tipo: string;
  nota?: string;
  /** o fim do intervalo: a consulta seguinte, ou agora */
  ate: number;
  /** o intervalo ainda não fechou */
  emAberto: boolean;
  mudancas: MudancaDoPeriodo[];
};

export function periodoDaConsulta(S: State, t: number): PeriodoDaConsulta | null {
  const historico = (((S as any).consultsHistory ?? []) as any[]).slice().sort((a, b) => a.t - b.t);
  const i = historico.findIndex((h) => h.t === t);
  if (i < 0) return null;
  const h = historico[i];

  /* O fim do intervalo é a PRÓXIMA consulta do histórico. A consulta
     marcada para o futuro não conta: ela não aconteceu, e fechar um
     período numa data que ainda não chegou diria que o que vem depois
     dela já está contado. */
  const seguinte = historico[i + 1];
  const ate = seguinte ? seguinte.t : +now();
  const emAberto = !seguinte;
  const dentro = (x: number) => x > h.t && x <= ate;

  const mudancas: MudancaDoPeriodo[] = [];

  /* ---- peso ----
     Os dois extremos do intervalo, e não a diferença com hoje: a pergunta
     é o que mudou NAQUELE tempo. */
  const C_ = T.rotina.periodo;
  const pesos = ((S.weights ?? []) as any[]).filter((w) => dentro(w.t));
  if (pesos.length >= 2) {
    const de = pesos[0].kg;
    const para = pesos[pesos.length - 1].kg;
    const d = para - de;
    mudancas.push({
      id: 'peso', ic: 'scale',
      titulo: d === 0 ? C_.pesoEstavel : `${d < 0 ? '−' : '+'}${pesoTxt(S, Math.abs(d))}`,
      sub: C_.pesoDe(pesoTxt(S, de, 1), nf(para)),
    });
  }

  /* ---- dose ----
     Só o ajuste, e não a dose de cada aplicação: uma lista de dez linhas
     iguais dizendo "5 mg" é ruído; a linha que importa é aquela em que o
     número mudou. */
  const injs = ((S.injections ?? []) as any[]).slice().sort((a, b) => a.t - b.t);
  let anterior: number | null = null;
  let ajuste: { de: number; para: number } | null = null;
  let aplicacoes = 0;
  for (const inj of injs) {
    if (dentro(inj.t)) {
      aplicacoes++;
      if (anterior != null && inj.dose !== anterior) ajuste = { de: anterior, para: inj.dose };
    }
    if (inj.t <= ate) anterior = inj.dose;
  }
  if (ajuste) {
    mudancas.push({
      id: 'dose', ic: 'dose',
      titulo: C_.doseNova(nf(ajuste.para, ajuste.para % 1 ? 1 : 0)),
      sub: C_.doseAnterior(nf(ajuste.de, ajuste.de % 1 ? 1 : 0)),
    });
  }
  if (aplicacoes) {
    mudancas.push({
      id: 'aplicacoes', ic: 'syringe',
      titulo: aplicacoes === 1 ? C_.umaAplicacao : C_.aplicacoes(aplicacoes),
    });
  }

  /* ---- o que a clínica registrou no intervalo ---- */
  const receitas = ((S.prescriptions ?? []) as any[]).filter((x) => dentro(x.t));
  for (const r of receitas) {
    mudancas.push({ id: 'receita-' + r.t, ic: 'pill', titulo: r.name, sub: r.detail });
  }

  const exames = (((S as any).examBundles ?? []) as any[]).filter((x) => dentro(x.t));
  for (const ex of exames) {
    mudancas.push({ id: 'exame-' + ex.t, ic: 'chart', titulo: ex.name, sub: C_.marcadores(ex.n) });
  }

  const orientacoes = ((S.messages ?? []) as any[]).filter((m) => m.from === 'doc' && dentro(m.t)).length;
  if (orientacoes) {
    mudancas.push({
      id: 'orientacoes', ic: 'companion',
      titulo: orientacoes === 1 ? C_.umaOrientacao : C_.orientacoes(orientacoes),
    });
  }

  return { t: h.t, tipo: h.type || C_.consultaSemTipo, nota: h.note || undefined, ate, emAberto, mudancas };
}

/** "hoje", "ontem", "há 4 dias" — a mesma frase em todas as linhas do
    preparo, para o olho comparar as datas em vez de traduzi-las. */
function rotuloDeDias(d: number) {
  const Q = T.rotina.quando;
  if (d <= 0) return Q.hoje;
  if (d === 1) return Q.ontem;
  if (d < 30) return Q.haDias(d);
  const meses = Math.round(d / 30);
  return meses <= 1 ? Q.haUmMes : Q.haMeses(meses);
}

/** As notas ainda não conversadas, em texto, para o resumo do médico. */
export function notasTexto(S: State) {
  const abertas = notasAbertas(S);
  return abertas.length ? abertas.map((n) => `• ${n.text}`).join('\n') : '';
}

/* ============================================================
   O REGISTRO DO DIA — acumulador não é estado

   O check-in de um dia é o recipiente daquele dia, e várias telas
   escrevem nele: o check-in em si, a água, o exercício, a refeição. O
   problema é que cada uma delas, ao criar o registro do zero, preenchia o
   dia INTEIRO com valores de enfeite — sono 7, humor 3, fome 5, energia 6.
   Registrar um copo d'água afirmava junto que a pessoa dormiu sete horas.

   A separação que resolve é entre dois tipos de campo:

     acumuladores — agua, prot, exerc. Contam o que foi acontecendo no dia,
       e zero é a resposta HONESTA de quem ainda não registrou nada. Nascem
       em zero e vão subindo.

     estados — sono, humor, fome, energia, sintomas. Descrevem como a
       pessoa esteve, e não têm valor neutro: só existem se ela disser.
       Ficam AUSENTES até ser perguntados.

   Quem lê estado precisa então saber lidar com ausência — e é por isso que
   as médias abaixo devolvem null em vez de zero. Um dia sem resposta não é
   um dia ruim; é um dia sem resposta, e a diferença entre as duas coisas é
   o que separa um diário de um boletim.
   ============================================================ */

/** Registro de hoje, criado se ainda não existir. Só os acumuladores
    nascem preenchidos — em zero, que é o que eles de fato valem. */
export function registroDoDia(s: any, t: number) {
  let c = s.checkins.find((x: any) => x.t === t);
  if (!c) { c = { t, agua: 0, prot: 0, exerc: 0 }; s.checkins.push(c); }
  return c;
}

/** O campo foi respondido naquele dia? */
export const respondido = (c: any, k: string) => typeof c?.[k] === 'number';

/** Média só dos dias em que o campo foi respondido; null se nenhum foi. */
export function mediaDe(cs: any[], k: string): number | null {
  const vs = (cs || []).filter((c) => respondido(c, k)).map((c) => c[k] as number);
  return vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : null;
}

/** Proporção de dias que atendem a condição, contando só os respondidos.
    null quando ninguém respondeu — não existe "0% das noites" se nenhuma
    noite foi registrada. */
export function contaDe(cs: any[], k: string, cond: (v: number) => boolean) {
  const vs = (cs || []).filter((c) => respondido(c, k)).map((c) => c[k] as number);
  return { n: vs.filter(cond).length, de: vs.length };
}

export function pctDe(cs: any[], k: string, cond: (v: number) => boolean): number | null {
  const { n, de } = contaDe(cs, k, cond);
  return de ? (n / de) * 100 : null;
}
