/* ============================================================
   A TRADUÇÃO ENTRE O ESTADO E O BANCO

   No aparelho, o diário é um objeto só (`norte.v1`). No banco, ele mora
   em três lugares (supabase/migrations):

     `registros` — uma linha por item das listas, cada exame por valor e
                   cada sinal vital por medição;
     `perguntas` — as perguntas ao companheiro, que só crescem;
     `perfis`    — o resto, em seis partes, cada uma com a sua hora.

   `ida` faz o caminho do estado ao banco. `misturar` faz o de volta: põe
   no estado o que desceu, item por item, sem tocar no que ainda vai
   subir. Nenhuma das duas fala com a rede — quem fala é logic/sincronia.

   ⚠️ TODO CAMPO DO ESTADO TEM UM DESTINO DECLARADO, e só um: as duas
   tabelas logo abaixo. Um campo novo sem destino derruba a trava
   (scripts/sincronia.ts). Sem ela, o campo ficaria só no aparelho sem
   ninguém ter decidido isso, e sumiria na troca de telefone.
   ============================================================ */
import { CUP_ML, mlQueContam } from './derive';
import { startOfDay } from './time';
import { janelaDePerguntas, type OrigemDaPergunta, type PerguntaFeita } from './perguntas';

/** Os tipos de `registros`. ⚠️ A mesma lista da regra do banco
    (`registros_tipo_conhecido`) — a trava confere as duas. */
export const TIPOS_DE_REGISTRO = [
  'peso', 'aplicacao', 'checkin', 'refeicao', 'refeicao_favorita', 'medida',
  'exame', 'laudo', 'sinal_vital', 'foto', 'documento', 'anotacao',
  'meta_pessoal', 'caneta',
] as const;
export type TipoDeRegistro = (typeof TIPOS_DE_REGISTRO)[number];

/** As seis partes de `perfis`. */
export const PARTES = ['pessoal', 'tratamento', 'acompanhamento', 'protocolo', 'preferencias', 'vistos'] as const;
export type Parte = (typeof PARTES)[number];

export type Destino =
  | `registro:${TipoDeRegistro}`
  | 'perguntas'
  | `parte:${Parte}`
  /** o perfil, dividido campo a campo pela segunda tabela */
  | 'perfil'
  /** uma coluna própria de `perfis`: o consentimento e a escolha das perguntas */
  | 'coluna'
  /** vem do servidor: a clínica e o vínculo (fases 6 e 7 do plano) */
  | 'servidor'
  /** se calcula a partir de outro campo */
  | 'calcula'
  /** fica no aparelho */
  | 'aparelho';

/* ============================================================
   AS DUAS TABELAS

   ⚠️ CAMPO NOVO NUMA PARTE É CAMPO QUE O APLICATIVO ANTIGO NÃO CONHECE.
   A parte sobe inteira, e um aparelho com a versão anterior, mexendo
   nela, a subiria sem o campo novo — apagando-o no servidor. Antes de
   acrescentar um campo a uma parte que já existe, a volta precisa guardar
   o que não conhece.
   ============================================================ */

export const DESTINO_NO_ESTADO: Record<string, Destino> = {
  profile: 'perfil',

  weights: 'registro:peso',
  injections: 'registro:aplicacao',
  checkins: 'registro:checkin',
  meals: 'registro:refeicao',
  favMeals: 'registro:refeicao_favorita',
  measures: 'registro:medida',
  exams: 'registro:exame',
  examBundles: 'registro:laudo',
  vitals: 'registro:sinal_vital',
  photos: 'registro:foto',
  documents: 'registro:documento',
  notes: 'registro:anotacao',
  goals: 'registro:meta_pessoal',
  pens: 'registro:caneta',

  /* Só sobem com a escolha da pessoa ligada — quem decide é a sincronia. */
  asked: 'perguntas',
  perguntasParaUso: 'coluna',

  /* `customSyms` é lista de texto solto, sem onde pôr identidade. */
  history: 'parte:tratamento',
  customSyms: 'parte:tratamento',
  /* Sem vínculo, a consulta é a que a pessoa anotou do médico dela. Com
     vínculo, ela passa a vir da clínica (fase 7). */
  consult: 'parte:acompanhamento',
  consultsHistory: 'parte:acompanhamento',
  consultNotes: 'parte:acompanhamento',
  protocol: 'parte:protocolo',
  theme: 'parte:preferencias',
  paleta: 'parte:preferencias',
  alertas: 'parte:preferencias',
  descobertasVistas: 'parte:vistos',
  apresentacoesVistas: 'parte:vistos',
  vistoEmConquistas: 'parte:vistos',
  lastReplaySeen: 'parte:vistos',

  /* O que só existe porque existe alguém do outro lado. */
  messages: 'servidor',
  prescriptions: 'servidor',
  materials: 'servidor',
  team: 'servidor',

  /* As mensagens ainda não lidas: sai da leitura das mensagens. */
  unread: 'calcula',

  /* Permissões e estado deste telefone — e a marca do exemplo, o dono
     deste diário e a identidade dele neste aparelho (ver logic/sincronia). */
  integrations: 'aparelho',
  notifications: 'aparelho',
  onboardDone: 'aparelho',
  semente: 'aparelho',
  conta: 'aparelho',
  diario: 'aparelho',
};

export const DESTINO_NO_PERFIL: Record<string, Destino> = {
  name: 'parte:pessoal',
  nascimento: 'parte:pessoal',
  height: 'parte:pessoal',
  sistema: 'parte:pessoal',
  identidade: 'parte:pessoal',
  /* 256 px em base64 — é por ela que a parte pode chegar a 256 KB. */
  foto: 'parte:pessoal',

  med: 'parte:tratamento',
  dose: 'parte:tratamento',
  forma: 'parte:tratamento',
  intervalo: 'parte:tratamento',
  startWeight: 'parte:tratamento',
  goalWeight: 'parte:tratamento',
  startT: 'parte:tratamento',
  restricoes: 'parte:tratamento',
  motivacao: 'parte:tratamento',
  ritmo: 'parte:tratamento',
  atividade: 'parte:tratamento',
  targets: 'parte:tratamento',
  /* quais metas a pessoa ajustou à mão: anda junto com as metas */
  alvosEditados: 'parte:tratamento',

  acompanhamento: 'parte:acompanhamento',
  doctor: 'parte:acompanhamento',
  clinic: 'parte:acompanhamento',
  nutri: 'parte:acompanhamento',
  doctorInfo: 'parte:acompanhamento',

  idioma: 'parte:preferencias',

  consentimento: 'coluna',

  /* O vínculo nasce no servidor, e a ficha da clínica vem de `clinicas`
     (fase 6). O código digitado vira vínculo lá. */
  vinculo: 'servidor',
  convite: 'servidor',
  clinicInfo: 'servidor',

  /* ⚠️ O MOTIVO DE QUEM CANCELOU FICA AQUI. É uma resposta sobre nós, e
     não sobre o tratamento; nenhum texto nosso diz que ela sobe, e subir
     seria uma finalidade nova. */
  cancelamento: 'aparelho',
};

/* ============================================================
   AS LISTAS E A ORDEM EM QUE O APLICATIVO AS GUARDA

   A ordem importa: há quem leia por posição — o peso atual é o último da
   lista, a caneta em uso é a última aberta, o documento novo aparece em
   cima. O que desce de outro aparelho entra onde o aplicativo o teria
   posto, e o que já estava fica onde estava.

   `posicao` é das listas sem momento (metas e favoritas): a ordem é a
   que a pessoa vê, e vai junto nos dados.
   ============================================================ */
type Ordem = 'antigo-primeiro' | 'novo-primeiro' | 'posicao';

const LISTAS: Record<string, { tipo: TipoDeRegistro; ordem: Ordem }> = {
  weights: { tipo: 'peso', ordem: 'antigo-primeiro' },
  injections: { tipo: 'aplicacao', ordem: 'antigo-primeiro' },
  checkins: { tipo: 'checkin', ordem: 'antigo-primeiro' },
  meals: { tipo: 'refeicao', ordem: 'novo-primeiro' },
  favMeals: { tipo: 'refeicao_favorita', ordem: 'posicao' },
  measures: { tipo: 'medida', ordem: 'antigo-primeiro' },
  examBundles: { tipo: 'laudo', ordem: 'novo-primeiro' },
  photos: { tipo: 'foto', ordem: 'novo-primeiro' },
  documents: { tipo: 'documento', ordem: 'novo-primeiro' },
  notes: { tipo: 'anotacao', ordem: 'novo-primeiro' },
  goals: { tipo: 'meta_pessoal', ordem: 'posicao' },
  pens: { tipo: 'caneta', ordem: 'antigo-primeiro' },
};
const LISTA_DO_TIPO = Object.fromEntries(
  Object.entries(LISTAS).map(([lista, { tipo }]) => [tipo, lista]),
) as Partial<Record<TipoDeRegistro, string>>;

/** As listas do estado em que cada item vira uma linha no banco. */
export const LISTAS_DO_DIARIO = [...Object.keys(LISTAS), 'asked'] as const;

/** Todo item do estado que vira uma linha no banco: os das listas do
    diário, cada valor de cada marcador de exame e cada medição de cada
    sinal vital. Os exames e os sinais se achatam de propósito — dois
    aparelhos acrescentando valores ao mesmo marcador não podem se
    atropelar. */
export function itensDoDiario(S: any): any[] {
  const itens: any[] = [];
  const juntar = (lista: unknown) => {
    if (!Array.isArray(lista)) return;
    for (const item of lista) if (item && typeof item === 'object') itens.push(item);
  };
  for (const nome of LISTAS_DO_DIARIO) juntar(S?.[nome]);
  if (Array.isArray(S?.exams)) for (const marcador of S.exams) juntar(marcador?.values);
  if (S?.vitals && typeof S.vitals === 'object') for (const medicoes of Object.values(S.vitals)) juntar(medicoes);
  return itens;
}

/* ============================================================
   AS LINHAS
   ============================================================ */

/** Uma linha de `registros`, do jeito que o aparelho a monta. `quando`
    é o `t` do item, em milissegundos; nulo nos itens sem momento. */
export type Registro = {
  id: string;
  tipo: TipoDeRegistro;
  quando: number | null;
  dados: Record<string, unknown>;
};

/** Uma linha de `perguntas`. */
export type Pergunta = {
  id: string;
  quando: number;
  texto: string;
  origem: OrigemDaPergunta | null;
};

export type Consentimento = { versao: number; em: number };

export type PerfilDoAparelho = {
  partes: Record<Parte, Record<string, unknown>>;
  consentimento: Consentimento | null;
  perguntasParaUso: boolean;
};

export type Ida = { registros: Registro[]; perguntas: Pergunta[]; perfil: PerfilDoAparelho };

/** Uma linha de `registros` como o servidor devolve. */
export type RegistroDoServidor = Registro & { atualizadoEm: string; apagadoEm: string | null };
/** Uma linha de `perguntas` como o servidor devolve. */
export type PerguntaDoServidor = Pergunta & { criadoEm: string };
/** A linha de `perfis`. Parte vazia é parte que o servidor não tem. */
export type PerfilDoServidor = {
  partes: Partial<Record<Parte, Record<string, unknown>>>;
  consentimento: Consentimento | null;
  perguntasParaUso: boolean;
  atualizadoEm: string;
};

/** O valor como o banco o guarda e devolve: sem `undefined`, sem função. */
const limpo = <T>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

/** Um texto que só depende do conteúdo — a ordem das chaves não conta,
    porque o `jsonb` do banco não a guarda. */
export function canonico(v: unknown): string {
  const ordenar = (x: any): any => {
    if (Array.isArray(x)) return x.map(ordenar);
    if (x && typeof x === 'object') {
      return Object.fromEntries(Object.keys(x).sort().map((k) => [k, ordenar(x[k])]));
    }
    return x;
  };
  return JSON.stringify(ordenar(limpo(v ?? null)));
}

/** Quantos bytes o `jsonb` ocupa como texto no banco — é o que as regras
    de tamanho medem (`octet_length(dados::text)`). O banco escreve um
    espaço depois de cada dois-pontos e de cada vírgula. */
export function tamanhoNoBanco(v: unknown): number {
  /* em UTF-8: o par substituto é um caractere só, de quatro bytes */
  const bytes = (s: string) => {
    let n = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c < 0x80) n += 1;
      else if (c < 0x800) n += 2;
      else if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length) { n += 4; i++; }
      else n += 3;
    }
    return n;
  };
  const medir = (x: any): number => {
    if (Array.isArray(x)) return 2 + x.reduce((n, e) => n + medir(e), 0) + Math.max(0, x.length - 1) * 2;
    if (x && typeof x === 'object') {
      const chaves = Object.keys(x);
      return 2 + chaves.reduce((n, k) => n + bytes(JSON.stringify(k)) + 2 + medir(x[k]), 0)
        + Math.max(0, chaves.length - 1) * 2;
    }
    return bytes(JSON.stringify(x));
  };
  return medir(limpo(v ?? null));
}

const momento = (t: unknown): t is number => Number.isSafeInteger(t);

/** O item vira linha: o `t` vai para `quando`, o resto para `dados`. Um
    `t` que não é um instante inteiro fica nos dados, como veio. */
function linhaDoItem(item: any, tipo: TipoDeRegistro, extra: Record<string, unknown>): Registro {
  const { rid, t, ...resto } = item;
  const temMomento = momento(t);
  const dados = { ...resto, ...(temMomento || t === undefined ? {} : { t }), ...extra };
  return { id: rid, tipo, quando: temMomento ? t : null, dados: limpo(dados) };
}

const temIdentidade = (x: any) => !!x && typeof x === 'object' && typeof x.rid === 'string' && !!x.rid;

/* ============================================================
   IDA — do estado ao banco
   ============================================================ */
export function ida(S: any): Ida {
  const registros: Registro[] = [];

  for (const [lista, { tipo, ordem }] of Object.entries(LISTAS)) {
    const itens: any[] = Array.isArray(S?.[lista]) ? S[lista] : [];
    itens.forEach((item, posicao) => {
      if (temIdentidade(item)) registros.push(linhaDoItem(item, tipo, ordem === 'posicao' ? { posicao } : {}));
    });
  }

  /* Cada valor de exame leva a ficha do marcador junto — o nome é o que
     reagrupa na volta, e a posição é a ordem em que a lista de exames
     aparece. */
  (Array.isArray(S?.exams) ? S.exams : []).forEach((m: any, posicao: number) => {
    if (!m || typeof m !== 'object') return;
    const { values, ...ficha } = m;
    for (const valor of Array.isArray(values) ? values : []) {
      if (temIdentidade(valor)) registros.push(linhaDoItem(valor, 'exame', { marcador: { ...ficha, posicao } }));
    }
  });

  for (const [sinal, medicoes] of Object.entries(S?.vitals ?? {})) {
    for (const m of Array.isArray(medicoes) ? medicoes : []) {
      if (temIdentidade(m)) registros.push(linhaDoItem(m, 'sinal_vital', { sinal }));
    }
  }

  const perguntas: Pergunta[] = [];
  for (const p of (Array.isArray(S?.asked) ? S.asked : []) as PerguntaFeita[]) {
    if (!temIdentidade(p) || !momento(p.t) || typeof p.q !== 'string' || !p.q) continue;
    perguntas.push({ id: p.rid!, quando: p.t, texto: p.q, origem: p.origem ?? null });
  }

  const partes = Object.fromEntries(PARTES.map((p) => [p, {}])) as Record<Parte, Record<string, unknown>>;
  for (const [campo, destino] of Object.entries(DESTINO_NO_ESTADO)) {
    if (destino.startsWith('parte:')) partes[destino.slice(6) as Parte][campo] = S?.[campo];
  }
  for (const [campo, destino] of Object.entries(DESTINO_NO_PERFIL)) {
    if (destino.startsWith('parte:')) partes[destino.slice(6) as Parte][campo] = S?.profile?.[campo];
  }
  for (const p of PARTES) partes[p] = limpo(partes[p]);

  return {
    registros,
    perguntas,
    perfil: {
      partes,
      consentimento: consentimentoDe(S?.profile),
      perguntasParaUso: S?.perguntasParaUso === true,
    },
  };
}

/** O consentimento gravado no perfil — `{ em, versao }`, ver app/cadastro. */
function consentimentoDe(perfil: any): Consentimento | null {
  const c = perfil?.consentimento;
  return c && momento(c.em) && Number.isInteger(c.versao) && c.versao >= 1 ? { versao: c.versao, em: c.em } : null;
}

/* ============================================================
   MISTURAR — do banco ao estado

   Item por item: o desconhecido entra no lugar dele, o mais novo
   substitui o que estava (e fica onde estava, se o momento não mudou), e
   o apagado sai.

   ⚠️ O INTOCÁVEL NÃO É TOCADO. É o que mudou aqui e ainda não subiu: vai
   chegar ao servidor depois da versão que desceu agora, e por isso vai
   ser a última. Quem decide o que é intocável é a sincronia, que conhece
   a base.
   ============================================================ */
export type Intocaveis = {
  registro: (id: string) => boolean;
  parte: (p: Parte) => boolean;
  escolha: boolean;
};

export type Descida = {
  registros?: RegistroDoServidor[];
  perguntas?: PerguntaDoServidor[];
  perfil?: PerfilDoServidor | null;
};

const NADA_INTOCAVEL: Intocaveis = { registro: () => false, parte: () => false, escolha: false };

/** Mistura no lugar. Devolve as linhas que o aparelho não soube pôr no
    estado — um tipo que esta versão não conhece, um exame sem marcador —,
    para a sincronia não as dar como recebidas. */
export function misturar(
  S: any,
  descida: Descida,
  intocavel: Intocaveis = NADA_INTOCAVEL,
): { ignorados: Set<string> } {
  const ignorados = new Set<string>();
  if (descida.perfil) misturarPerfil(S, descida.perfil, intocavel);
  if (descida.registros?.length) misturarRegistros(S, descida.registros, intocavel.registro, ignorados);
  if (descida.perguntas?.length) misturarPerguntas(S, descida.perguntas);
  return { ignorados };
}

function atribuir(alvo: any, campo: string, valor: unknown) {
  if (valor === undefined) delete alvo[campo];
  else alvo[campo] = limpo(valor);
}

function misturarPerfil(S: any, perfil: PerfilDoServidor, intocavel: Intocaveis) {
  S.profile = S.profile && typeof S.profile === 'object' ? S.profile : {};
  for (const p of PARTES) {
    const valor = perfil.partes[p];
    if (!valor || !Object.keys(valor).length || intocavel.parte(p)) continue;
    for (const [campo, destino] of Object.entries(DESTINO_NO_ESTADO)) {
      if (destino === `parte:${p}`) atribuir(S, campo, valor[campo]);
    }
    for (const [campo, destino] of Object.entries(DESTINO_NO_PERFIL)) {
      if (destino === `parte:${p}`) atribuir(S.profile, campo, valor[campo]);
    }
  }

  /* ⚠️ O CONSENTIMENTO SÓ SOBE DE VERSÃO — o banco recusa o contrário.
     A versão maior vale, venha de onde vier; na mesma versão, vale a
     hora que o servidor já tem. */
  const local = consentimentoDe(S.profile);
  const remoto = perfil.consentimento;
  if (remoto && (!local || remoto.versao >= local.versao)) {
    S.profile.consentimento = { em: remoto.em, versao: remoto.versao };
  }

  if (!intocavel.escolha) S.perguntasParaUso = perfil.perguntasParaUso === true;
}

/** O item de volta: os dados, o `t` e a identidade — sem as chaves que a
    própria tradução pôs. */
function itemDaLinha(linha: Registro, sobras: string[]): any {
  const dados: Record<string, unknown> = { ...limpo(linha.dados) };
  for (const k of sobras) delete dados[k];
  return { ...dados, ...(linha.quando !== null ? { t: linha.quando } : {}), rid: linha.id };
}

/** Põe o item onde o aplicativo o teria posto. */
function inserirPeloMomento(lista: any[], item: any, ordem: Ordem) {
  const t = typeof item.t === 'number' ? item.t : null;
  const i = t === null ? -1
    : ordem === 'novo-primeiro'
      ? lista.findIndex((x) => typeof x?.t === 'number' && x.t < t)
      : lista.findIndex((x) => typeof x?.t === 'number' && x.t > t);
  if (i < 0) lista.push(item);
  else lista.splice(i, 0, item);
}

/** Onde está o item deste id, dentro das listas que o tipo pode ocupar. */
function acharItem(S: any, id: string, tipo: TipoDeRegistro): { lista: any[]; i: number } | null {
  const listas: any[][] = tipo === 'exame'
    ? (Array.isArray(S.exams) ? S.exams : []).map((m: any) => m?.values).filter(Array.isArray)
    : tipo === 'sinal_vital'
      ? Object.values(S.vitals ?? {}).filter(Array.isArray) as any[][]
      : [S[LISTA_DO_TIPO[tipo]!]].filter(Array.isArray);
  for (const lista of listas) {
    const i = lista.findIndex((x) => x?.rid === id);
    if (i >= 0) return { lista, i };
  }
  return null;
}

function misturarRegistros(
  S: any,
  linhas: RegistroDoServidor[],
  intocavel: (id: string) => boolean,
  ignorados: Set<string>,
) {
  const conhecidos = new Set<string>(TIPOS_DE_REGISTRO);
  /* A ordem de quem chegou: a posição dos dados, e para quem já estava, a
     posição de antes — é por ela que as listas sem momento se reordenam
     no fim. */
  const ordemDe = new Map<any, number>();
  const listasComPosicao = Object.entries(LISTAS).filter(([, l]) => l.ordem === 'posicao').map(([nome]) => nome);
  for (const nome of listasComPosicao) (Array.isArray(S[nome]) ? S[nome] : []).forEach((x: any, i: number) => ordemDe.set(x, i));
  S.exams = Array.isArray(S.exams) ? S.exams : [];
  S.exams.forEach((m: any, i: number) => ordemDe.set(m, i));

  for (const linha of linhas) {
    if (!conhecidos.has(linha.tipo)) {
      ignorados.add(linha.id);
      continue;
    }
    if (intocavel(linha.id)) continue;
    const onde = acharItem(S, linha.id, linha.tipo);

    if (linha.apagadoEm) {
      if (onde) onde.lista.splice(onde.i, 1);
      continue;
    }

    if (linha.tipo === 'exame') {
      const { posicao, ...ficha } = (linha.dados.marcador ?? {}) as any;
      if (typeof ficha.marker !== 'string') {
        ignorados.add(linha.id);
        continue;
      }
      let marcador = S.exams.find((m: any) => m?.marker === ficha.marker);
      if (!marcador) {
        marcador = { ...ficha, values: [] };
        S.exams.push(marcador);
      } else {
        Object.assign(marcador, limpo(ficha));
      }
      if (typeof posicao === 'number') ordemDe.set(marcador, posicao);
      const item = itemDaLinha(linha, ['marcador']);
      if (onde && onde.lista === marcador.values && onde.lista[onde.i].t === item.t) onde.lista[onde.i] = item;
      else {
        if (onde) onde.lista.splice(onde.i, 1);
        inserirPeloMomento(marcador.values, item, 'antigo-primeiro');
      }
      continue;
    }

    if (linha.tipo === 'sinal_vital') {
      const sinal = linha.dados.sinal;
      if (typeof sinal !== 'string') {
        ignorados.add(linha.id);
        continue;
      }
      S.vitals = S.vitals && typeof S.vitals === 'object' ? S.vitals : {};
      const lista: any[] = Array.isArray(S.vitals[sinal]) ? S.vitals[sinal] : (S.vitals[sinal] = []);
      const item = itemDaLinha(linha, ['sinal']);
      if (onde && onde.lista === lista && onde.lista[onde.i].t === item.t) onde.lista[onde.i] = item;
      else {
        if (onde) onde.lista.splice(onde.i, 1);
        inserirPeloMomento(lista, item, 'antigo-primeiro');
      }
      continue;
    }

    const nome = LISTA_DO_TIPO[linha.tipo]!;
    const { ordem } = LISTAS[nome];
    const lista: any[] = Array.isArray(S[nome]) ? S[nome] : (S[nome] = []);
    if (ordem === 'posicao') {
      const item = itemDaLinha(linha, ['posicao']);
      ordemDe.set(item, typeof linha.dados.posicao === 'number' ? linha.dados.posicao : lista.length);
      if (onde) lista[onde.i] = item;
      else lista.push(item);
      continue;
    }
    const item = itemDaLinha(linha, []);
    if (onde && lista[onde.i].t === item.t) lista[onde.i] = item;
    else {
      if (onde) lista.splice(onde.i, 1);
      inserirPeloMomento(lista, item, ordem);
    }
  }

  /* As listas sem momento e os marcadores voltam à ordem de todos os
     aparelhos: a posição, e no empate, algo que os dois lados veem igual. */
  const pelaOrdem = (desempate: (x: any) => string) => (a: any, b: any) =>
    (ordemDe.get(a) ?? Infinity) - (ordemDe.get(b) ?? Infinity) || desempate(a).localeCompare(desempate(b));
  for (const nome of listasComPosicao) if (Array.isArray(S[nome])) S[nome].sort(pelaOrdem((x) => String(x?.rid ?? '')));
  /* Marcador sem valor não tem linha no banco, e as telas de exame leem o
     último valor sem perguntar. */
  S.exams = S.exams.filter((m: any) => Array.isArray(m?.values) && m.values.length);
  S.exams.sort(pelaOrdem((m) => String(m?.marker ?? '')));

  juntarDiasRepetidos(S);
}

/* ============================================================
   O MESMO DIA EM DOIS APARELHOS

   O registro de um dia (`registroDoDia`, em logic/derive) é o recipiente
   daquele dia — o check-in, a água, o exercício e a proteína das
   refeições escrevem nele. Dois aparelhos sem conexão criam, cada um, o
   seu recipiente para o mesmo dia, com identidades diferentes; ao se
   encontrarem, o dia teria dois, e as telas leem o primeiro que acham.

   ⚠️ ENTÃO ELES VIRAM UM, sem perder o que cada um registrou: fica o de
   menor identidade (os dois aparelhos escolhem o mesmo), com o que o
   outro tem a mais — os goles e os treinos que faltam, as respostas que
   ele não deu. O outro sai, e a saída sobe como apagado.
   ============================================================ */
const numero = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : 0);

/** O que está em `deles` e não em `nossos`, contando repetidos: dois
    copos iguais no mesmo instante são dois copos. */
function faltantes(nossos: unknown[], deles: unknown[]): any[] {
  const conta = new Map<string, number>();
  for (const x of nossos) conta.set(canonico(x), (conta.get(canonico(x)) ?? 0) + 1);
  const falta: any[] = [];
  for (const x of deles) {
    const k = canonico(x);
    const n = conta.get(k) ?? 0;
    if (n > 0) conta.set(k, n - 1);
    else falta.push(limpo(x));
  }
  return falta;
}

function dobrarDia(S: any, fica: any, sai: any) {
  const aguas: any[] = Array.isArray(fica.aguas) ? fica.aguas : [];
  const treinos: any[] = Array.isArray(fica.treinos) ? fica.treinos : [];
  const aguasDeFora = faltantes(aguas, Array.isArray(sai.aguas) ? sai.aguas : []);
  const treinosDeFora = faltantes(treinos, Array.isArray(sai.treinos) ? sai.treinos : []);

  /* o que um respondeu e o outro não */
  for (const [k, v] of Object.entries(sai)) if (k !== 'rid' && !(k in fica)) fica[k] = limpo(v);

  if (aguasDeFora.length) fica.aguas = [...aguas, ...aguasDeFora].sort((a, b) => numero(a?.t) - numero(b?.t));
  if (treinosDeFora.length) fica.treinos = [...treinos, ...treinosDeFora];

  /* Os acumuladores contam o que cada um viu, mais o que só o outro viu.
     Um total antigo, de antes dos goles, não desce. */
  fica.agua = Math.max(numero(sai.agua), numero(fica.agua) + aguasDeFora.reduce((n, g) => n + mlQueContam(g) / CUP_ML, 0));
  fica.exerc = Math.max(numero(sai.exerc), numero(fica.exerc) + treinosDeFora.reduce((n, x) => n + numero(x?.min), 0));
  /* A proteína do dia é a soma das refeições do dia, e as dos dois
     aparelhos já estão na lista. */
  const doDia = (Array.isArray(S.meals) ? S.meals : []).filter(
    (m: any) => typeof m?.t === 'number' && +startOfDay(m.t) === fica.t,
  );
  fica.prot = doDia.length
    ? doDia.reduce((n: number, m: any) => n + numero(m.g), 0)
    : Math.max(numero(fica.prot), numero(sai.prot));
}

function juntarDiasRepetidos(S: any) {
  if (!Array.isArray(S.checkins)) return;
  const porDia = new Map<number, any[]>();
  for (const c of S.checkins) {
    if (typeof c?.t !== 'number') continue;
    porDia.set(c.t, [...(porDia.get(c.t) ?? []), c]);
  }
  const saem = new Set<any>();
  for (const iguais of porDia.values()) {
    if (iguais.length < 2) continue;
    const [fica, ...outros] = iguais.slice().sort((a, b) => String(a.rid).localeCompare(String(b.rid)));
    for (const sai of outros) {
      dobrarDia(S, fica, sai);
      saem.add(sai);
    }
  }
  if (saem.size) S.checkins = S.checkins.filter((c: any) => !saem.has(c));
}

/* ============================================================
   AS PERGUNTAS

   Só entram: uma pergunta nunca muda depois de feita, e sair da janela
   não é apagar. A janela se remonta como o companheiro a monta.
   ============================================================ */
function misturarPerguntas(S: any, perguntas: PerguntaDoServidor[]) {
  const janela: PerguntaFeita[] = Array.isArray(S.asked) ? S.asked : [];
  const conhecidas = new Set(janela.map((p) => p.rid));
  const novas: PerguntaFeita[] = perguntas
    .filter((p) => !conhecidas.has(p.id) && typeof p.texto === 'string' && momento(p.quando))
    .map((p) => ({ t: p.quando, q: p.texto, ...(p.origem ? { origem: p.origem } : {}), rid: p.id }));
  if (novas.length) S.asked = janelaDePerguntas([...janela, ...novas]);
}
