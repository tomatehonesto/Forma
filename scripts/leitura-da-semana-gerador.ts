/* O gerador de diários da sonda da leitura da semana (scripts/leitura-da-semana.ts). */
import { AGORA } from './avaliacao/relogio';
import { estadoVazio, ensureDefaults, type State } from '../src/logic/seed';
import { DAY, startOfDay } from '../src/logic/time';
import { semanaLida } from '../src/logic/descobertasDaSemana';

/* o sorteio de semente fixa (mulberry32) */
export function sorteio(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const agora = new Date(AGORA);
export const { de, ate } = semanaLida(agora);
export const DIAS = 56;
export const diaAntes = (k: number) => +startOfDay(ate - k * DAY);
const grau = (r: () => number, m: number, dp = 0.9) => Math.max(1, Math.min(5, Math.round(m + (r() * 2 - 1) * dp * 1.7)));

export type Plantio = {
  cafeBaixaFome?: number;
  semRefeicaoComFome?: boolean;
  pesoPorSemana?: (semanasAtras: number) => number;
  enjooPorDia?: (k: number) => number;
};

/** Um diário de 8 semanas com tudo registrado; sem plantio, comportamentos
    e sensações são independentes — qualquer "padrão" é coincidência. */
export function diario(semente: number, p: Plantio = {}): State {
  const r = sorteio(semente);
  const S: any = estadoVazio();
  Object.assign(S.profile, {
    name: 'Teste', med: 'mounjaro', dose: 5, height: 1.7, startT: diaAntes(DIAS + 30), startWeight: 95, goalWeight: 75, acompanhamento: 'proprio',
  });
  S.profile.targets = { ...S.profile.targets, prot: 90, waterMl: 2000 };
  /* com o plantio, a fome de base fica longe do piso: tirar 2 pontos de quem já marca 1 não muda nada */
  const pessoa = { fome: p.cafeBaixaFome ? 3.6 + r() * 0.8 : 2 + r() * 2, energia: 2.5 + r() * 2, humor: 2.5 + r() * 2, enjoo: r() * 2 };
  const pCafe = 0.3 + r() * 0.4, pTreino = 0.2 + r() * 0.5, pTarde = 0.1 + r() * 0.3;
  S.checkins = []; S.meals = []; S.weights = []; S.injections = [];
  for (let k = DIAS; k >= 1; k--) {
    const t = diaAntes(k);
    const cafe = r() < pCafe;
    const semRefeicao = p.semRefeicaoComFome && !cafe;
    if (!semRefeicao) {
      if (cafe) S.meals.push({ t: t + 8 * 3600e3, name: 'Café da manhã', tag: '', g: 20 });
      S.meals.push({ t: t + 12.5 * 3600e3, name: 'Almoço', tag: '', g: 35 });
      S.meals.push({ t: t + (r() < pTarde ? 21.5 : 19.5) * 3600e3, name: 'Jantar', tag: '', g: 30 });
    }
    let fome = grau(r, pessoa.fome);
    if (p.cafeBaixaFome && cafe) fome = Math.max(1, fome - p.cafeBaixaFome);
    if (semRefeicao) fome = 5;
    const enjoo = p.enjooPorDia ? p.enjooPorDia(k) : Math.max(0, grau(r, pessoa.enjoo + 1) - 1);
    S.checkins.push({
      t, fome: fome * 2, energia: grau(r, pessoa.energia) * 2, mood: grau(r, pessoa.humor),
      nausea: enjoo * 2, gut: 'normal', sono: 5.5 + r() * 3,
      agua: (1200 + r() * 1600) / 250, prot: Math.round(50 + r() * 70), exerc: r() < pTreino ? 40 : 0,
    });
  }
  for (let k = DIAS; k >= 1; k -= 7) S.injections.push({ t: diaAntes(k), med: 'mounjaro', dose: 5, site: 'abd-e', note: '' });
  let kg = 95;
  for (let k = DIAS; k >= 1; k -= 3) {
    const semanasAtras = Math.floor(k / 7);
    const perda = p.pesoPorSemana ? p.pesoPorSemana(semanasAtras) : 0.5;
    kg -= (perda * 3) / 7;
    S.weights.push({ t: diaAntes(k) + 7 * 3600e3, kg: Math.round((kg + (r() * 2 - 1) * 0.3) * 10) / 10 });
  }
  S.checkins.sort((a: any, b: any) => a.t - b.t);
  S.meals.sort((a: any, b: any) => b.t - a.t);
  return ensureDefaults(S) as State;
}

