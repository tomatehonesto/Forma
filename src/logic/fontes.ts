/* ============================================================
   AS FONTES — de onde saem os números que o app afirma

   Um app de tratamento escreve, todo dia, frases com número: "95 g de
   proteína", "IMC 27,7 — sobrepeso", "1.260 kcal". Cada uma delas é uma
   afirmação sobre o corpo de alguém, e nenhuma nasceu aqui dentro.

   Esta lista existe para que a pergunta "de onde você tirou isso?" tenha
   resposta dentro do app, e não numa reunião. É a diferença entre um selo
   escrito "baseado em evidência científica" — que qualquer um carimba — e
   uma linha que diz o que se sabe, quem estudou, e abre o trabalho.

   O QUE A PESSOA LÊ É A `frase`, E NÃO O TÍTULO DO ARTIGO. "Equação de
   Mifflin-St Jeor para gasto energético de repouso" é o nome certo da
   coisa e não diz nada a quem acabou de terminar um cadastro; quem quer o
   nome certo toca na linha e chega ao trabalho. O que fica em tela é o
   que aquilo quer dizer para essa pessoa — e a instituição embaixo, que é
   o que dá lastro sem virar aula.

   A REGRA DE ENTRADA É ESTRITA: só entra fonte que sustente um número que
   o app de fato calcula. A referência que aparece em tela concorrente
   porque o assunto é parecido — "o futuro do tratamento da obesidade" — é
   decoração com aparência de rigor, e é pior do que fonte nenhuma: ela
   empresta autoridade a contas que não foram conferidas por ninguém.

   E A FRASE NÃO PODE DIZER MAIS DO QUE O TRABALHO DIZ. Citação de artigo
   sobre uma equação de gasto energético não vira "estudos comprovam que
   emagrecer é assim"; cada linha aqui foi escrita para caber no que a
   fonte dela sustenta, e é por isso que nenhuma começa com "comprovado".

   ⚠️ O QUE ESTA LISTA AINDA NÃO É: uma revisão clínica. Os trabalhos aqui
   foram levantados para dar procedência às contas do `planoDoCadastro` e
   conferidos quanto a existirem e dizerem o que se diz que dizem. Antes
   de o app chegar a uma pessoa de verdade, alguém com formação precisa
   ler cada um, confirmar que o coeficiente usado é mesmo o recomendado
   para esta população, e trocar as que não servirem.
   ============================================================ */

export type Fonte = {
  id: string;
  /** o que a pessoa lê: o que se sabe, em português de gente */
  frase: string;
  /** a instituição — o lastro, sem virar aula */
  onde: string;
  /** o trabalho em si, para quem for conferir. Não vai para a tela. */
  titulo: string;
  ano?: number;
  url: string;
};

export const FONTES: Fonte[] = [
  {
    id: 'proteina',
    frase: 'Comer mais proteína durante o tratamento protege a sua massa magra — parte do peso que some com o GLP-1 é músculo, e é ela que segura isso.',
    onde: 'Revisão publicada na Metabolites',
    titulo: 'Lean Mass and Musculoskeletal Preservation in GLP-1-Based Obesity Treatment',
    url: 'https://www.mdpi.com/2218-1989/16/6/364',
  },
  {
    id: 'agua',
    frase: 'A quantidade de água que o corpo pede acompanha o seu peso e a sua idade. É por isso que a sua meta não é "dois litros para todo mundo".',
    onde: 'Análise de inquérito nacional de nutrição',
    titulo: 'Total water intake by kilogram of body weight',
    ano: 2021,
    url: 'https://pubmed.ncbi.nlm.nih.gov/34327801/',
  },
  {
    id: 'fibra',
    frase: 'Quem come mais fibra tem menos risco de doença do coração e de diabetes tipo 2 — e costuma manter o peso mais baixo.',
    onde: 'Academy of Nutrition and Dietetics',
    titulo: 'Position of the Academy of Nutrition and Dietetics: Health Implications of Dietary Fiber',
    ano: 2015,
    url: 'https://www.jandonline.org/article/S2212-2672(15)01386-6/pdf',
  },
  {
    id: 'energia',
    frase: 'Dá para estimar quanta energia o seu corpo gasta a partir de peso, altura, idade e sexo. É a conta que a nutrição usa há décadas, e a que mais acerta.',
    onde: 'Academy of Nutrition and Dietetics · análise de evidência',
    titulo: 'Mifflin-St Jeor: equação de gasto energético de repouso, e a comparação entre equações (JADA, 2005)',
    url: 'https://www.andeal.org/template.cfm?template=guide_summary&key=4341',
  },
  {
    id: 'ritmo',
    frase: 'Perder de meio quilo a um quilo por semana é o ritmo considerado seguro. Abaixo de um mínimo de calorias por dia, só com acompanhamento médico.',
    onde: 'NHS · serviço público de saúde do Reino Unido',
    titulo: 'Calories and weight loss · Better Health',
    url: 'https://www.nhs.uk/better-health/lose-weight/calorie-counting/',
  },
  {
    id: 'imc',
    frase: 'O IMC é a régua que a Organização Mundial da Saúde usa para situar o peso de um adulto. Ele não separa músculo de gordura: é ponto de partida, não diagnóstico.',
    onde: 'Organização Mundial da Saúde',
    titulo: 'Body mass index among adults',
    url: 'https://www.who.int/data/gho/data/themes/topics/indicator-groups/indicator-group-details/GHO/bmi-among-adults',
  },
];
