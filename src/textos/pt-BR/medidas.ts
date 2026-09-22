/* ============================================================
   AS UNIDADES DE MEDIDA — as palavras, não os símbolos

   ⚠️ SÓ ENTRA AQUI O QUE SE LÊ POR EXTENSO. "kg", "cm", "oz" e "ml" são
   símbolos internacionais e ficam no código, escritos uma vez em
   medidas.ts: não se traduz um símbolo, e quem escrevesse "qg" estaria
   inventando.

   ⚠️ E A LISTA É O EXEMPLO, NÃO O INVENTÁRIO. Ela aparece embaixo do nome
   do sistema, para quem não sabe de cabeça o que "imperial" quer dizer —
   quatro palavras reconhecíveis bastam, e as quatro são as que o
   aplicativo realmente usa.
   ============================================================ */

export const medidas = {
  /* ⚠️ O NOME DO SISTEMA ESTAVA ESCRITO EM TRÊS TELAS — o cadastro, a
     folha de unidades e a linha do perfil. Ninguém escolhe pelo nome
     ("métrico" e "imperial" não dizem nada a quem não sabe de cabeça o
     que cada um mede), e é por isso que a lista de exemplos anda junto. */
  metrico: 'Métrico',
  imperial: 'Imperial',
  unidadesMetrico: 'quilos, metros, centímetros e litros',
  unidadesImperial: 'libras, pés, polegadas e onças',
};
