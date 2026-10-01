import type { State } from '../seed';
import { now, DAY } from '../time';
import { diasDaJanela, semanaLida } from './dias';
import {
  habitos, ritmo, exames, exercicio, sintomas, pesoSemanal, medidas, constancia,
  type Candidata, type Contexto, type Area,
} from './detectores';

export type { Candidata, Area, Nivel } from './detectores';
export { semanaLida } from './dias';

/* ============================================================
   AS DESCOBERTAS DA SEMANA — o motor da leitura de segunda

   O código descobre; a IA escreve (servidor/api/leitura). Aqui só há
   conta: cada detector olha uma área da jornada e devolve candidatas com
   nível e força, e a escolha da semana pega uma.

   ⚠️ TODO MUNDO COM O MÍNIMO DE REGISTRO RECEBE UMA DESCOBERTA (o dono,
   01/10/2026: "somos o companheiro do tratamento de todos"). O nível é
   que muda — padrão forte, começo de padrão, retrato —, e a leitura fala
   de cada um com a firmeza que o dado sustenta. A semana do tratamento é
   o retrato que sempre existe.

   Ver docs/superpowers/specs/2026-10-01-leitura-da-semana-design.md.
   ============================================================ */

const DETECTORES: ((c: Contexto) => Candidata[])[] = [habitos, ritmo, exames, exercicio, sintomas, pesoSemanal, medidas, constancia];

const ORDEM_DO_NIVEL = { forte: 0, comeco: 1, retrato: 2 } as const;
const ordenar = (a: Candidata, b: Candidata) => ORDEM_DO_NIVEL[a.nivel] - ORDEM_DO_NIVEL[b.nivel] || b.forca - a.forca;

/** Todas as candidatas da semana lida, da melhor para a pior. */
export function candidatasDaSemana(S: State, agora: Date = now()): Candidata[] {
  const { de, ate } = semanaLida(agora);
  const ctx: Contexto = { S, dias: diasDaJanela(S, agora), de, ate };
  const fora: Candidata[] = [];
  for (const d of DETECTORES) {
    /* um detector que quebra não leva a leitura junto */
    try { fora.push(...d(ctx)); } catch (e) { if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('detector', d.name, e); }
  }
  return fora.sort(ordenar);
}

/** O que já foi mostrado: a semana (o `de` dela), a chave e a área. */
export type Lembranca = { semana: number; chave: string; area: Area };

/** A memória: uma descoberta já mostrada não volta por 3 semanas. */
export const SEMANAS_SEM_REPETIR = 3;

/** A descoberta da semana: a melhor que não foi mostrada nas últimas 3
    semanas, trocando de área quando a da semana passada se repetiria e
    há outra no mesmo nível. */
export function escolherDaSemana(candidatas: Candidata[], historico: Lembranca[], semana: number): Candidata | null {
  const recentes = historico.filter((h) => h.semana < semana && h.semana >= semana - SEMANAS_SEM_REPETIR * 7 * DAY);
  const vistas = new Set(recentes.map((h) => h.chave));
  const livres = candidatas.filter((c) => !vistas.has(c.chave)).sort(ordenar);
  if (!livres.length) return null;
  /* a alternância é só contra a semana imediatamente anterior */
  const passada = historico.find((h) => h.semana === semana - 7 * DAY);
  const primeira = livres[0];
  if (passada && primeira.area === passada.area) {
    const outra = livres.find((c) => c.nivel === primeira.nivel && c.area !== passada.area);
    if (outra) return outra;
  }
  return primeira;
}
