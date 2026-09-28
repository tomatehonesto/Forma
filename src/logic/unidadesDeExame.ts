import { nf } from './time';
import { paisAtual, type Pais } from './pais';

/* ============================================================
   AS UNIDADES DOS EXAMES — a do laudo, em qualquer país

   ⚠️ O LAUDO DE CADA PAÍS FALA UMA UNIDADE (28/09/2026, pedido do dono: o
   lançamento é para os mercados de todos os idiomas). No Brasil, nos
   Estados Unidos e na América Latina, glicemia e colesterol vêm em mg/dL
   e a HbA1c em %; no Reino Unido, no Canadá, na Austrália, nos nórdicos e
   na Holanda, em mmol/L e mmol/mol; na França, em g/L. A folha de anotar
   só conhecia a brasileira, e quem digitasse o número do próprio laudo o
   veria ao lado de uma unidade que não é a dele — e comparado com uma
   faixa na escala errada.

   ⚠️ QUEM ESCOLHE É A PESSOA, E O PAÍS SÓ DECIDE A QUE VEM MARCADA.
   Adivinhar pelo país acertaria quase sempre e erraria justamente com
   quem tem o laudo diferente — laboratório alemão em mg/dL ou em mmol/L,
   francês em g/L e em mmol/L lado a lado. As pastilhas de /medir-exame
   deixam trocar.

   ⚠️ CADA EXAME GUARDA A PRÓPRIA UNIDADE, e o valor fica nela. A faixa
   usual é convertida para ela na hora de anotar, e daí em diante valor e
   faixa estão sempre na mesma escala dentro do registro — a leitura "na
   referência", o gráfico e o resumo continuam sem conversão nenhuma.

   A primeira unidade de cada lista é a de REFERENCIA_DOS_MARCADORES (em
   logic/derive), e é a partir dela que as outras se calculam. Os fatores
   são os de conversão padrão entre as unidades convencionais e as do
   Sistema Internacional.
   ============================================================ */

export type UnidadeDeExame = {
  id: string;
  /** da unidade de referência para esta */
  daReferencia: (v: number) => number;
  /** desta para a unidade de referência */
  paraReferencia: (v: number) => number;
  /** casas decimais com que a faixa convertida se escreve */
  casas: number;
};

const linear = (id: string, fator: number, casas: number): UnidadeDeExame => ({
  id, casas,
  daReferencia: (v) => v * fator,
  paraReferencia: (v) => v / fator,
});

/* HbA1c: NGSP (%) para IFCC (mmol/mol) é afim, e não proporcional. */
const IFCC: UnidadeDeExame = {
  id: 'mmol/mol', casas: 0,
  daReferencia: (v) => (v - 2.15) * 10.929,
  paraReferencia: (v) => v / 10.929 + 2.15,
};

const GLICOSE = [linear('mg/dL', 1, 0), linear('mmol/L', 1 / 18.016, 1), linear('g/L', 0.01, 2)];
const COLESTEROL = [linear('mg/dL', 1, 0), linear('mmol/L', 1 / 38.67, 1), linear('g/L', 0.01, 2)];

export const UNIDADES_DO_MARCADOR: Record<string, UnidadeDeExame[]> = {
  HbA1c: [linear('%', 1, 1), IFCC],
  'Glicemia jejum': GLICOSE,
  Insulina: [linear('µUI/mL', 1, 1), linear('pmol/L', 6.945, 0)],
  'Colesterol total': COLESTEROL,
  HDL: COLESTEROL,
  LDL: COLESTEROL,
  Triglicerídeos: [linear('mg/dL', 1, 0), linear('mmol/L', 1 / 88.57, 1), linear('g/L', 0.01, 2)],
  Creatinina: [linear('mg/dL', 1, 1), linear('µmol/L', 88.42, 0)],
  TGO: [linear('U/L', 1, 0)],
  TGP: [linear('U/L', 1, 0)],
  /* µUI/mL e mUI/L são o mesmo número com dois nomes; o nome é o que a
     pessoa procura no laudo. O mesmo vale para ng/mL e µg/L na ferritina. */
  TSH: [linear('µUI/mL', 1, 1), linear('mUI/L', 1, 1)],
  'T4 livre': [linear('ng/dL', 1, 1), linear('pmol/L', 12.87, 0)],
  'Vitamina D': [linear('ng/mL', 1, 0), linear('nmol/L', 2.496, 0)],
  'Vitamina B12': [linear('pg/mL', 1, 0), linear('pmol/L', 0.7378, 0)],
  Ferritina: [linear('ng/mL', 1, 0), linear('µg/L', 1, 0)],
};

/* O QUE CADA PAÍS COSTUMA LER NO LAUDO — só o que vem marcado. Os países
   fora destas listas começam na unidade de referência, que é a da maior
   parte dos mercados (Brasil, Estados Unidos, América Latina, Península
   Ibérica, Itália, e a maioria dos laboratórios de língua alemã). */
const SI: Pais[] = ['GB', 'IE', 'CA', 'AU', 'NZ', 'ZA', 'SE', 'NO', 'DK', 'FI', 'IS', 'NL'];
const PREFERE: { paises: Pais[]; unidades: string[] }[] = [
  { paises: SI, unidades: ['mmol/L', 'mmol/mol', 'pmol/L', 'µmol/L', 'nmol/L', 'mUI/L', 'µg/L'] },
  { paises: ['FR', 'BE', 'LU', 'MC'], unidades: ['g/L', 'µmol/L'] },
];

/** As unidades que o marcador aceita — a primeira é a de referência. */
export const unidadesDe = (marcador: string): UnidadeDeExame[] =>
  UNIDADES_DO_MARCADOR[marcador] ?? [];

/** A unidade que vem marcada para quem mora em `pais`. */
export function unidadePadrao(marcador: string, pais: Pais = paisAtual()): string | null {
  const us = unidadesDe(marcador);
  if (!us.length) return null;
  const pref = PREFERE.find((p) => p.paises.includes(pais));
  const achada = pref && us.find((u) => pref.unidades.includes(u.id));
  return (achada ?? us[0]).id;
}

/** Um valor de uma unidade do marcador para outra. Sem as duas na lista,
    o valor volta como veio. */
export function converterValor(marcador: string, v: number, de: string, para: string): number {
  if (de === para) return v;
  const us = unidadesDe(marcador);
  const a = us.find((u) => u.id === de), b = us.find((u) => u.id === para);
  if (!a || !b) return v;
  return b.daReferencia(a.paraReferencia(v));
}

/* OS NÚMEROS DE UMA FAIXA, e só eles — "< 5,7", "70–99", "> 40". O resto
   do texto (o sinal, o traço) fica como estava. */
const NUMERO = /\d+(?:[.,]\d+)?/g;
const numeroDe = (s: string) => parseFloat(s.replace(',', '.'));

/** A faixa convertida de uma unidade para outra, com o ponto decimal
    neutro — é assim que ela fica gravada, e `examStatus` lê as duas. */
export function converterFaixa(marcador: string, faixa: string, de: string, para: string): string {
  if (!faixa || de === para) return faixa;
  const destino = unidadesDe(marcador).find((u) => u.id === para);
  if (!destino) return faixa;
  return faixa.replace(NUMERO, (n) => {
    const v = converterValor(marcador, numeroDe(n), de, para);
    return String(Number(v.toFixed(destino.casas)));
  });
}

/** A faixa escrita para quem lê: os números com a vírgula ou o ponto do
    idioma. Gravada, ela pode ter qualquer um dos dois. */
export function faixaTxt(faixa: string): string {
  if (!faixa) return faixa;
  return faixa.replace(NUMERO, (n) => {
    const casas = n.includes('.') || n.includes(',') ? n.split(/[.,]/)[1].length : 0;
    return nf(numeroDe(n), casas);
  });
}
