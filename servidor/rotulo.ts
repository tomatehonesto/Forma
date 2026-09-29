import { PRATELEIRAS } from './prateleiras.js';

/* A resposta do modelo sobre UMA porção, virada no rótulo que o
   aplicativo guarda: os números por 100 g e o peso da porção à parte.

   Mora fora de api/estimar para a sonda dos primeiros passos poder
   conferir a conta sem chamar o modelo — e conferir que o que sai daqui
   é aceito pela limpeza do aplicativo (limparRotulo, em
   src/logic/estimativa). */

export type Porcao = {
  nome: string;
  unidade: string;
  unidades: string;
  gramas: number;
  proteina: number;
  kcal: number;
  carboidrato: number;
  gordura: number;
  fibra: number;
  prateleira: (typeof PRATELEIRAS)[number];
};

/* Um número por 100 g, com uma casa. */
const por100 = (v: number, g: number) => Math.round((Math.max(0, v) / g) * 1000) / 10;

export function rotuloDaPorcao(e: Porcao) {
  /* Uma porção de menos de 5 g ou de mais de 2 kg não é porção: é erro. */
  const g = Math.round(e.gramas);
  if (!(g >= 5 && g <= 2000)) return null;
  return {
    nome: e.nome.slice(0, 80),
    un: e.unidade.slice(0, 30),
    unp: e.unidades.slice(0, 30),
    gUn: g,
    p: por100(e.proteina, g),
    kcal: Math.round((Math.max(0, e.kcal) / g) * 100),
    carb: por100(e.carboidrato, g),
    gord: por100(e.gordura, g),
    fibra: por100(e.fibra, g),
    onde: e.prateleira,
  };
}
