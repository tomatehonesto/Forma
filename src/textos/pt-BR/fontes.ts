/* ============================================================
   AS FONTES — de onde vem cada número do aplicativo

   ⚠️ O TÍTULO DO ARTIGO NÃO SE TRADUZ, E NÃO ESTÁ AQUI. "Once-Weekly
   Semaglutide in Adults with Overweight or Obesity" é o nome de um
   trabalho publicado, e traduzi-lo tornaria impossível encontrá-lo — a
   pessoa que tocar no selo vai procurar por aquelas palavras. Os títulos
   ficam em logic/fontes, com a URL e o ano, que são da mesma natureza.

   ⚠️ O QUE MORA AQUI SÃO AS DUAS FRASES QUE SÃO NOSSAS: o que aquele
   trabalho SUSTENTA no aplicativo, e o nome de quem publicou quando ele
   se diz em português. "Organização Mundial da Saúde" é a mesma
   instituição que o inglês chama de World Health Organization; "New
   England Journal of Medicine" é o nome próprio de um periódico, e esse
   não muda.
   ============================================================ */

export const fontes = {
  /* O que cada trabalho sustenta, na língua do aplicativo. */
  sustenta: {
    acompanha: 'O que este aplicativo acompanha: proteína, movimento, água e sintomas',
    imc: 'As faixas de IMC',
    plato: 'Quando a perda costuma estabilizar',
    proteina: 'A meta de proteína por quilo de peso',
    ritmo: 'O ritmo seguro de perda e o piso de calorias',
    curva: 'A forma da curva: rápida no começo, afrouxando depois',
    agua: 'A meta de água por quilo, e a variação por idade',
    fibra: 'A meta de fibra por mil quilocalorias',
    gasto: 'A estimativa de gasto do dia (Mifflin-St Jeor)',
    equacao: 'A escolha desta equação entre as disponíveis',
  },

  /* ⚠️ SÓ OS QUE SE DIZEM EM PORTUGUÊS. Os periódicos — Clinical Obesity,
     Metabolites, New England Journal of Medicine — são nomes próprios e
     ficam em logic/fontes, ao lado do título e da URL. */
  onde: {
    harvard: 'Harvard T.H. Chan School of Public Health, sobre dois artigos do JAMA Internal Medicine',
    oms: 'Organização Mundial da Saúde',
    nhs: 'NHS — serviço público de saúde do Reino Unido',
    academy: 'Academy of Nutrition and Dietetics',
  },

  /* ⚠️ A SIGLA DO SELO TAMBÉM MUDA. 'OMS' é lida como palavra no
     Brasil e ninguém precisa expandir; em inglês a mesma instituição
     é 'WHO'. As outras siglas do selo são nomes próprios de
     periódico e ficam em logic/fontes. */
  siglaOms: 'OMS',
  siglaNhs: 'National Health Service - UK',

  /* O título do trabalho da Academy sobre a equação de gasto: é o único
     da lista escrito por nós, porque descreve uma análise e não um artigo
     com nome próprio. */
  tituloMifflin: 'Mifflin-St Jeor: equação de gasto energético de repouso, na análise de evidência da Academy',
};
