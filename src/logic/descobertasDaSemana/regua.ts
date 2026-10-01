/* ============================================================
   A RÉGUA CONTRA COINCIDÊNCIA

   Com uns 50 pares testados por pessoa, a coincidência é a regra, e não
   a exceção: num diário de números sorteados, alguns pares sempre
   "parecem" fortes. A régua é o que separa o padrão do acaso, e ela é
   ajustada por simulação (scripts/leitura-da-semana.ts): em 100 diários
   aleatórios, padrão forte em no máximo 5 — e o padrão plantado achado.

   ⚠️ O PADRÃO FORTE PEDE TRÊS COISAS AO MESMO TEMPO:
     1. tamanho — a diferença das médias, em pontos da régua de 1 a 5;
     2. clareza — a diferença contra o próprio ruído da pessoa (z), que é
        o que corrige "50 pares testados": sem ele, o acaso passa;
     3. repetição — a mesma direção nas duas metades da janela.

   O COMEÇO DE PADRÃO pede menos, de propósito: a leitura diz que ainda é
   cedo e propõe observar — é ele quem garante que quase todo mundo
   tenha o que ler, sem afirmar o que não se sabe.
   ============================================================ */

/* ⚠️ CALIBRADA POR SIMULAÇÃO (01/10/2026), e não escolhida de cabeça.
   Com z 3,2 e 4 dias de cada lado, 9 de 100 diários aleatórios ganhavam
   um padrão forte — quase sempre de grupos pequenos (o pós-aplicação, 12
   dias contra 30; o jantar tarde, 10 contra 31). Com 6 dias, 1,2 ponto e
   z 4, foram 1 em 100, e o café da manhã plantado com 2 pontos de efeito
   foi achado nos 20 diários. Um efeito real de 1 ponto vira começo de
   padrão — dito com cautela, que é o que ele merece. Mexer aqui pede
   rodar a sonda. */
export const REGUA = {
  forte: { minimoDeCadaLado: 6, diferenca: 1.2, z: 4, minimoNaMetade: 2 },
  comeco: { minimoDeCadaLado: 3, diferenca: 0.5 },
};

const media = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const variancia = (xs: number[], m: number) => xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1);

export type Comparacao = {
  mediaCom: number; mediaSem: number; diasCom: number; diasSem: number;
  diferenca: number; z: number; repete: boolean;
};

/** Compara os resultados dos dias COM e SEM, com o tempo de cada um para
    a repetição nas duas metades. */
export function comparar(pares: { com: boolean; valor: number; t: number }[], metade: number): Comparacao | null {
  const com = pares.filter((p) => p.com), sem = pares.filter((p) => !p.com);
  if (!com.length || !sem.length) return null;
  const mc = media(com.map((p) => p.valor)), ms = media(sem.map((p) => p.valor));
  const vc = variancia(com.map((p) => p.valor), mc), vs = variancia(sem.map((p) => p.valor), ms);
  /* o ruído mínimo: respostas iguais todos os dias não fazem um z infinito */
  const ep = Math.sqrt(Math.max(vc, 0.25) / com.length + Math.max(vs, 0.25) / sem.length);
  const diferenca = mc - ms;
  const metadeOk = (lado: (p: { t: number }) => boolean) => {
    const c = com.filter(lado), s = sem.filter(lado);
    if (c.length < REGUA.forte.minimoNaMetade || s.length < REGUA.forte.minimoNaMetade) return null;
    return media(c.map((p) => p.valor)) - media(s.map((p) => p.valor));
  };
  const antes = metadeOk((p) => p.t < metade), depois = metadeOk((p) => p.t >= metade);
  const repete = antes != null && depois != null && Math.sign(antes) === Math.sign(diferenca) && Math.sign(depois) === Math.sign(diferenca) && diferenca !== 0;
  return { mediaCom: mc, mediaSem: ms, diasCom: com.length, diasSem: sem.length, diferenca, z: Math.abs(diferenca) / ep, repete };
}

export type NivelDaComparacao = 'forte' | 'comeco' | null;

export function nivelDe(c: Comparacao): NivelDaComparacao {
  const menor = Math.min(c.diasCom, c.diasSem);
  const d = Math.abs(c.diferenca);
  if (menor >= REGUA.forte.minimoDeCadaLado && d >= REGUA.forte.diferenca && c.z >= REGUA.forte.z && c.repete) return 'forte';
  if (menor >= REGUA.comeco.minimoDeCadaLado && d >= REGUA.comeco.diferenca) return 'comeco';
  return null;
}

/** A força para ordenar dentro do nível: o tamanho, contido pela menor
    amostra. Entre 0 e 1. */
export const forcaDe = (c: Comparacao) =>
  Math.min(1, Math.abs(c.diferenca) / 2) * Math.min(1, Math.min(c.diasCom, c.diasSem) / 10);

/** A inclinação (unidades por dia) de uma série, por mínimos quadrados,
    e o desvio dos pontos em volta dela — o ruído da própria pessoa. */
export function tendencia(pontos: { t: number; v: number }[]) {
  const n = pontos.length;
  if (n < 2) return null;
  const mt = media(pontos.map((p) => p.t)), mv = media(pontos.map((p) => p.v));
  let num = 0, den = 0;
  for (const p of pontos) { num += (p.t - mt) * (p.v - mv); den += (p.t - mt) ** 2; }
  const inclinacao = den ? num / den : 0;
  const residuos = pontos.map((p) => p.v - (mv + inclinacao * (p.t - mt)));
  const desvio = Math.sqrt(residuos.reduce((a, r) => a + r * r, 0) / Math.max(1, n - 2));
  return { inclinacao, desvio, n };
}
