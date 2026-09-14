/* ============================================================
   AS FOTOS DA PRATELEIRA

   A tela de consulta abre com uma imagem em cima, como a referência que
   a inspirou. Mas a foto é da PRATELEIRA, e não do alimento: duzentas e
   vinte e quatro fotos de comida seriam duzentas e vinte e quatro
   licenças e uns vinte megabytes de bundle num app que não é de
   receitas.

   O peito de frango e a picanha dividem a mesma imagem de carne, e isso
   é honesto — a foto ali é sinalização, do mesmo jeito que a placa do
   corredor do mercado. O que descreve aquele alimento são os números
   logo abaixo.

   COMO ACRESCENTAR UMA: ponha o arquivo em
   assets/images/alimentos/<arquivo>.jpg e escreva a linha aqui. O
   `require` do Metro precisa do caminho literal, então não dá para
   montar o nome em tempo de execução.

   Enquanto uma prateleira não tem foto, a tela usa o painel de cor —
   que continua funcionando e continua dizendo alguma coisa, porque a
   cor vem do nutriente em destaque.
   ============================================================ */
export const FOTO_PRATELEIRA: Record<string, any> = {
  // 'Carnes e aves': require('../../assets/images/alimentos/carnes.jpg'),
  // 'Peixes e frutos do mar': require('../../assets/images/alimentos/peixes.jpg'),
  // 'Ovos': require('../../assets/images/alimentos/ovos.jpg'),
  // 'Leite e queijos': require('../../assets/images/alimentos/laticinios.jpg'),
  // 'Grãos e feijões': require('../../assets/images/alimentos/graos.jpg'),
  // 'Arroz, massas e pães': require('../../assets/images/alimentos/massas.jpg'),
  // 'Verduras e legumes': require('../../assets/images/alimentos/verduras.jpg'),
  // 'Frutas': require('../../assets/images/alimentos/frutas.jpg'),
  // 'Castanhas e sementes': require('../../assets/images/alimentos/castanhas.jpg'),
  // 'Pratos prontos': require('../../assets/images/alimentos/pratos.jpg'),
  // 'Café da manhã': require('../../assets/images/alimentos/cafe.jpg'),
  // 'Doces e lanches': require('../../assets/images/alimentos/lanches.jpg'),
  // 'Bebidas': require('../../assets/images/alimentos/bebidas.jpg'),
  // 'Suplementos': require('../../assets/images/alimentos/suplementos.jpg'),
};

export const temFoto = (onde: string) => !!FOTO_PRATELEIRA[onde];
