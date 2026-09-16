/* ============================================================
   AS FONTES — de onde saem os números que o app afirma

   Um app de tratamento escreve, todo dia, frases com número: "95 g de
   proteína", "IMC 27,7 — sobrepeso", "1.260 kcal". Cada uma delas é uma
   afirmação sobre o corpo de alguém, e nenhuma nasceu aqui dentro.

   ESTE ARQUIVO É AUDITORIA, E NÃO VITRINE. Em tela aparecem uma frase
   ("nenhum número aqui foi inventado") e os nomes de quem publicou, em
   selos que abrem o trabalho no toque. O título de cada artigo fica aqui,
   que é onde ele serve para alguma coisa: para alguém conferir a lista
   sem precisar abrir o app.

   A referência lista quatro artigos com setinha, em inglês, com o nome da
   revista embaixo. Impressiona e ninguém abre — e três dos quatro são
   matéria sobre o tema, não a fonte de número nenhum.

   A REGRA DE ENTRADA É ESTRITA: só entra fonte que sustente um número que
   o app de fato calcula. A referência que aparece em tela concorrente
   porque o assunto é parecido — "o futuro do tratamento da obesidade" — é
   decoração com aparência de rigor, e é pior do que fonte nenhuma: ela
   empresta autoridade a contas que não foram conferidas por ninguém.

   ⚠️ O QUE ESTA LISTA AINDA NÃO É: uma revisão clínica. Os trabalhos aqui
   foram levantados para dar procedência às contas do `planoDoCadastro` e
   conferidos quanto a existirem e dizerem o que se diz que dizem. Antes
   de o app chegar a uma pessoa de verdade, alguém com formação precisa
   ler cada um, confirmar que o coeficiente usado é mesmo o recomendado
   para esta população, e trocar as que não servirem.
   ============================================================ */

export type Fonte = {
  id: string;
  /** o número que ela sustenta, na língua do app */
  sustenta: string;
  /** o nome curto de quem publicou — é o que vai para o selo em tela */
  sigla: string;
  titulo: string;
  onde: string;
  ano?: number;
  url: string;
};

/* A ORDEM É A DO RECONHECIMENTO, e não a das contas: em tela os nomes
   viram selos lado a lado, e quem bate o olho reconhece OMS e NHS antes
   de reconhecer o nome de um periódico. */
export const FONTES: Fonte[] = [
  {
    id: 'imc',
    sustenta: 'As faixas de IMC',
    sigla: 'OMS',
    titulo: 'Body mass index among adults',
    onde: 'Organização Mundial da Saúde',
    url: 'https://www.who.int/data/gho/data/themes/topics/indicator-groups/indicator-group-details/GHO/bmi-among-adults',
  },
  {
    id: 'ritmo',
    sustenta: 'O ritmo seguro de perda e o piso de calorias',
    sigla: 'NHS',
    titulo: 'Calories and weight loss · Better Health',
    onde: 'NHS — serviço público de saúde do Reino Unido',
    url: 'https://www.nhs.uk/better-health/lose-weight/calorie-counting/',
  },
  {
    id: 'proteina',
    sustenta: 'A meta de proteína por quilo de peso',
    sigla: 'Metabolites',
    titulo: 'Lean Mass and Musculoskeletal Preservation in GLP-1-Based Obesity Treatment',
    onde: 'Metabolites',
    url: 'https://www.mdpi.com/2218-1989/16/6/364',
  },
  {
    id: 'agua',
    sustenta: 'A meta de água por quilo, e a variação por idade',
    sigla: 'PubMed',
    titulo: 'Total water intake by kilogram of body weight',
    onde: 'European Journal of Clinical Nutrition',
    ano: 2021,
    url: 'https://pubmed.ncbi.nlm.nih.gov/34327801/',
  },
  {
    id: 'fibra',
    sustenta: 'A meta de fibra por mil quilocalorias',
    sigla: 'Academy of Nutrition and Dietetics',
    titulo: 'Position of the Academy of Nutrition and Dietetics: Health Implications of Dietary Fiber',
    onde: 'Journal of the Academy of Nutrition and Dietetics',
    ano: 2015,
    url: 'https://www.jandonline.org/article/S2212-2672(15)01386-6/pdf',
  },
  {
    id: 'energia',
    sustenta: 'A estimativa de gasto do dia (Mifflin-St Jeor)',
    sigla: 'Academy of Nutrition and Dietetics',
    titulo: 'Mifflin-St Jeor: equação de gasto energético de repouso, na análise de evidência da Academy',
    onde: 'Academy of Nutrition and Dietetics',
    url: 'https://www.andeal.org/template.cfm?template=guide_summary&key=4341',
  },
  {
    id: 'energia2',
    sustenta: 'A escolha desta equação entre as disponíveis',
    sigla: 'JADA',
    titulo: 'Comparison of Predictive Equations for Resting Metabolic Rate in Healthy Nonobese and Obese Adults',
    onde: 'Journal of the American Dietetic Association',
    ano: 2005,
    url: 'https://www.jandonline.org/article/S0002-8223(05)00149-5/abstract',
  },
];
