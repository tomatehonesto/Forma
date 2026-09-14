/* ============================================================
   AS MODALIDADES

   O que existe de movimento no app, num lugar só: o desenho de cada
   uma, e quais delas puxam músculo.

   Estava em três lugares diferentes — a lista com ícones dentro da tela
   de registro, os nomes de força dentro do derive, e o casamento entre
   um e outro em lugar nenhum. Bastava alguém renomear "Funcional" numa
   das pontas para a conta de força parar de bater sem erro nenhum
   aparecer.

   FORÇA É O QUE IMPORTA AQUI

   Em déficit calórico, quem só faz cardio perde massa magra junto com a
   gordura — e massa magra é o que o tratamento inteiro tenta segurar.
   Por isso a tabela carrega essa marca: não é uma categoria de academia,
   é a distinção que muda o desfecho desta doença.

   Yoga e alongamento ficam de fora. Não por desprezo: eles fazem outra
   coisa (mobilidade, e no caso do yoga também cabeça), e chamar isso de
   força faria a conta dizer que a pessoa está protegendo músculo quando
   não está.

   "Outro" é a porta do que a tabela não tem — a pessoa escreve o nome, e
   o app não sabe o que é "treino da Carol". Fica sem marca de força, que
   é o honesto.
   ============================================================ */

export type Modalidade = {
  /** Nome como fica gravado no registro, e como aparece na tela. */
  nome: string;
  /** Chave no mapa de ícones. */
  ic: string;
  /** Puxa músculo. */
  forca?: boolean;
};

export const MODALIDADES: Modalidade[] = [
  { nome: 'Caminhada', ic: 'walk' },
  { nome: 'Corrida', ic: 'run' },
  { nome: 'Musculação', ic: 'barbell', forca: true },
  { nome: 'Bike', ic: 'bike' },
  { nome: 'Natação', ic: 'swim' },
  { nome: 'Yoga', ic: 'yoga' },
  { nome: 'Pilates', ic: 'gymnastics', forca: true },
  { nome: 'Funcional', ic: 'lunge', forca: true },
  { nome: 'Alongamento', ic: 'stretch' },
  { nome: 'Outro', ic: 'more' },
];

const porNome = new Map(MODALIDADES.map((m) => [m.nome, m]));

/** A modalidade pelo nome gravado, ou null se foi escrita à mão. */
export function modalidadeDe(nome: string): Modalidade | null {
  return porNome.get(nome) ?? null;
}

/** O ícone de um treino. O que a pessoa escreveu à mão cai no genérico. */
export function iconeDe(nome: string): string {
  return porNome.get(nome)?.ic ?? 'more';
}

/** Se aquele treino conta como força. */
export function ehForca(nome: string): boolean {
  return !!porNome.get(nome)?.forca;
}
