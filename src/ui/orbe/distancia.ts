/* ============================================================
   A DISTÂNCIA ATÉ A BORDA DE UM DESENHO — para o orbe se transformar

   O orbe (ui/orbe/OrbeSkia) vira o M, a seringa e o copo. Para uma forma
   derreter na outra, o shader precisa saber, em cada ponto, a que
   distância está da borda do desenho (positiva fora, negativa dentro).
   Isto calcula essa distância a partir de uma máscara (1 dentro, 0 fora),
   uma vez, quando o orbe aparece.

   É um chanfro de duas passadas (1 para o lado, √2 na diagonal): não é a
   distância exata, mas é contínua e lisa o bastante para a transformação
   — e numa máscara de 128 × 128 custa uma fração de milissegundo.

   Função pura: a sonda e o protótipo no Node usam a mesma conta.
   ============================================================ */

/** A distância até o pixel `alvo` mais próximo, em pixels. */
function ate(alvo: Uint8Array, L: number, A: number): Float32Array {
  const INF = 1e9;
  const R2 = Math.SQRT2;
  const d = new Float32Array(L * A);
  for (let i = 0; i < L * A; i++) d[i] = alvo[i] ? 0 : INF;
  for (let y = 0; y < A; y++) {
    for (let x = 0; x < L; x++) {
      const i = y * L + x;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 1);
      if (y > 0) {
        v = Math.min(v, d[i - L] + 1);
        if (x > 0) v = Math.min(v, d[i - L - 1] + R2);
        if (x < L - 1) v = Math.min(v, d[i - L + 1] + R2);
      }
      d[i] = v;
    }
  }
  for (let y = A - 1; y >= 0; y--) {
    for (let x = L - 1; x >= 0; x--) {
      const i = y * L + x;
      let v = d[i];
      if (x < L - 1) v = Math.min(v, d[i + 1] + 1);
      if (y < A - 1) {
        v = Math.min(v, d[i + L] + 1);
        if (x < L - 1) v = Math.min(v, d[i + L + 1] + R2);
        if (x > 0) v = Math.min(v, d[i + L - 1] + R2);
      }
      d[i] = v;
    }
  }
  return d;
}

/** A distância com sinal até a borda: positiva fora do desenho,
    negativa dentro. `dentro` tem 1 onde o desenho está. */
export function distanciaComSinal(dentro: Uint8Array, L: number, A: number): Float32Array {
  const fora = ate(dentro, L, A);
  const inverso = new Uint8Array(L * A);
  for (let i = 0; i < L * A; i++) inverso[i] = dentro[i] ? 0 : 1;
  const dentroD = ate(inverso, L, A);
  const sd = new Float32Array(L * A);
  for (let i = 0; i < L * A; i++) sd[i] = fora[i] - dentroD[i];
  return sd;
}

/** O alcance da codificação, em pixels: a textura guarda 0,5 na borda e
    vai a 0 e 1 a esta distância. O shader desfaz a conta com o mesmo
    número. */
export const ALCANCE = 20;

/** A distância codificada num byte, para a textura. */
export const codificar = (d: number) =>
  Math.max(0, Math.min(255, Math.round((0.5 - d / (2 * ALCANCE)) * 255)));
