/* As quinze prateleiras da tabela de alimentos do aplicativo.

   ⚠️ SÃO CHAVES, E NÃO TEXTO DE TELA: `restricoes.ts` sugere fonte de
   proteína por prateleira e `conselhos.ts` conta o corredor verde por
   ela, comparando com estas palavras exatas. A estimativa pelo nome
   precisa devolver uma delas, ou o item novo não conta como verdura nem
   como proteína.

   A sonda dos primeiros passos confere que esta lista é a mesma que a
   tabela do aplicativo usa. */
export const PRATELEIRAS = [
  'Arroz, massas e pães',
  'Bebidas',
  'Café da manhã',
  'Carnes e aves',
  'Castanhas e sementes',
  'Doces e lanches',
  'Frutas',
  'Grãos e feijões',
  'Leite e queijos',
  'Molhos e gorduras',
  'Ovos',
  'Peixes e frutos do mar',
  'Pratos prontos',
  'Suplementos',
  'Verduras e legumes',
] as const;
