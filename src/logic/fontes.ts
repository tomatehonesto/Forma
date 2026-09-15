/* ============================================================
   AS FONTES — de onde saem os números que o app afirma

   Um app de tratamento escreve, todo dia, frases com número: "95 g de
   proteína", "IMC 27,7 — sobrepeso", "1.750 kcal". Cada uma delas é uma
   afirmação sobre o corpo de alguém, e nenhuma nasceu aqui dentro.

   Esta lista existe para que a pergunta "de onde você tirou isso?" tenha
   resposta dentro do app, e não numa reunião. É a diferença entre um selo
   escrito "baseado em evidência científica" — que qualquer um carimba — e
   uma linha que diz qual conta cada trabalho sustenta, com o link.

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
  /** o que esta fonte sustenta, na língua do app */
  sustenta: string;
  titulo: string;
  onde: string;
  ano?: number;
  url: string;
};

export const FONTES: Fonte[] = [
  {
    id: 'energia',
    sustenta: 'A estimativa de gasto do dia',
    titulo: 'Equação de Mifflin-St Jeor para gasto energético de repouso',
    onde: 'Academy of Nutrition and Dietetics · análise de evidência',
    url: 'https://www.andeal.org/template.cfm?template=guide_summary&key=4341',
  },
  {
    id: 'energia2',
    sustenta: 'A escolha da equação entre as disponíveis',
    titulo: 'Comparison of Predictive Equations for Resting Metabolic Rate in Healthy Nonobese and Obese Adults',
    onde: 'Journal of the American Dietetic Association',
    ano: 2005,
    url: 'https://www.jandonline.org/article/S0002-8223(05)00149-5/abstract',
  },
  {
    id: 'proteina',
    sustenta: 'A meta de proteína por quilo',
    titulo: 'Lean Mass and Musculoskeletal Preservation in GLP-1-Based Obesity Treatment',
    onde: 'Metabolites',
    url: 'https://www.mdpi.com/2218-1989/16/6/364',
  },
  {
    id: 'fibra',
    sustenta: 'A meta de fibra por mil quilocalorias',
    titulo: 'Position of the Academy of Nutrition and Dietetics: Health Implications of Dietary Fiber',
    onde: 'Journal of the Academy of Nutrition and Dietetics',
    ano: 2015,
    url: 'https://www.jandonline.org/article/S2212-2672(15)01386-6/pdf',
  },
  {
    id: 'agua',
    sustenta: 'A meta de água por quilo',
    titulo: 'Total water intake by kilogram of body weight: national nutrition survey analysis',
    onde: 'European Journal of Clinical Nutrition · PubMed',
    ano: 2021,
    url: 'https://pubmed.ncbi.nlm.nih.gov/34327801/',
  },
  {
    id: 'ritmo',
    sustenta: 'O ritmo seguro e o piso de calorias',
    titulo: 'Calories and weight loss',
    onde: 'NHS · Better Health',
    url: 'https://www.nhs.uk/better-health/lose-weight/calorie-counting/',
  },
  {
    id: 'imc',
    sustenta: 'As faixas de IMC',
    titulo: 'Body mass index among adults',
    onde: 'Organização Mundial da Saúde',
    url: 'https://www.who.int/data/gho/data/themes/topics/indicator-groups/indicator-group-details/GHO/bmi-among-adults',
  },
];
