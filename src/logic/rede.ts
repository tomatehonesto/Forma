import { create } from 'zustand';
import { temRedeParceira } from './pais';
import { distanciaKm, type Ponto } from './localizacao';
import { sistemaDe } from './medidas';
import { WD, hm, nf, maiuscula } from './time';
import { T } from '../textos';

/* ============================================================
   A REDE PARCEIRA — o catálogo da vitrine

   Os profissionais vêm do portal da rede, onde cada médico é cadastrado
   e mantém a própria ficha. Os tipos abaixo são o CONTRATO: o que a
   vitrine precisa receber do portal, e nada além disso.

   ⚠️ O PORTAL AINDA NÃO EXISTE, e a única fonte hoje é a de exemplo — que
   só existe em desenvolvimento. Em produção `FONTE` é nula e a vitrine
   não abre: o bloco da aba Cuidado continua levando a /parceiros, a
   tela do código de convite. Quando o portal existir, é só aqui que ele
   entra.

   ⚠️⚠️ OS NOMES DE EXEMPLO SÃO INVENTADOS, e uma tela de saúde com nome
   inventado é a mentira que a pessoa pode tentar ligar. Por isso eles só
   existem em `__DEV__`, a vitrine avisa no alto que são de exemplo, e
   nenhum contato deles abre nada (ver `redeDeExemplo`).
   ============================================================ */

export type Especialidade = 'endocrinologia' | 'nutrologia' | 'nutricao' | 'esporte' | 'psicologia';
export type Conselho = 'CRM' | 'CRN' | 'CRP';
/** 0 é domingo, como em `Date.getDay()`. */
export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Modalidade = 'presencial' | 'teleconsulta';

/** Os canais que o consultório cadastrou. Canal vazio não aparece. */
export type Contato = {
  whatsapp?: string;
  telefone?: string;
  /** endereço da agenda on-line do consultório */
  agenda?: string;
  site?: string;
  email?: string;
  instagram?: string;
};

export type Consultorio = {
  id: string;
  nome: string;
  /** rua e número — sem endereço é só teleconsulta */
  endereco?: string;
  bairro?: string;
  cidade: string;
  uf: string;
  ponto?: Ponto;
  dias: Dia[];
  /** "08:00" */
  abre: string;
  fecha: string;
  presencial: boolean;
  teleconsulta: boolean;
  convenios: string[];
  particular: boolean;
  contato: Contato;
};

export type Profissional = {
  id: string;
  /** como o profissional escreveu no portal, com o título se ele usa */
  nome: string;
  foto?: string;
  especialidades: Especialidade[];
  conselho: Conselho;
  /** a região do conselho: UF no CRM ("SP"), número no CRN ("3") e no CRP ("06") */
  regiao: string;
  registro: string;
  /** Registro de Qualificação de Especialista — só de médico, um por especialidade */
  rqe?: string[];
  /** com as palavras do próprio profissional */
  sobre: string;
  consultorios: Consultorio[];
};

/* ============================================================
   A FONTE
   ============================================================ */

type Fonte = () => Promise<Profissional[]>;
const FONTE: Fonte | null = __DEV__ ? async () => EXEMPLO : null;

/** Se a vitrine tem de onde ler. Sem isso, a porta dela não aparece. */
export const redeNoAr = () => temRedeParceira() && FONTE !== null;

/** Se o que está na tela é a lista inventada. Nesse caso nenhum contato abre. */
export const redeDeExemplo = () => __DEV__ && FONTE !== null;

/* A última lista lida, para a ficha abrir sem esperar a rede de novo. */
let ultima: Profissional[] | null = null;

export async function carregarRede(): Promise<Profissional[]> {
  if (!FONTE) return [];
  ultima = await FONTE();
  return ultima;
}

export async function profissional(id: string): Promise<Profissional | null> {
  const lista = ultima ?? (await carregarRede());
  return lista.find((p) => p.id === id) ?? null;
}

/* ============================================================
   OS FILTROS — valem enquanto o aplicativo está aberto

   Moram fora do estado gravado de propósito: filtro de busca é da visita,
   e voltar à vitrine amanhã com "Barra da Tijuca, sábado, Amil" ainda
   ligado seria a tela lembrando uma pergunta que a pessoa já esqueceu.
   ============================================================ */

export type Filtros = {
  termo: string;
  especialidade: Especialidade | '';
  /** "São Paulo|SP", ou vazio para todas */
  cidade: string;
  /** o nome do convênio, 'particular', ou vazio para qualquer um */
  convenio: string;
  modalidade: Modalidade | '';
  dia: Dia | null;
};

const SEM_FILTRO: Filtros = { termo: '', especialidade: '', cidade: '', convenio: '', modalidade: '', dia: null };

type Vitrine = Filtros & {
  /** o ponto da pessoa, quando ela deixou usar */
  perto: Ponto | null;
  mudar: (f: Partial<Filtros>) => void;
  /** tira os filtros da folha, e mantém a busca e a especialidade */
  limparFolha: () => void;
  limparTudo: () => void;
  usarPonto: (p: Ponto | null) => void;
};

export const useVitrine = create<Vitrine>((set) => ({
  ...SEM_FILTRO,
  perto: null,
  mudar: (f) => set(f),
  limparFolha: () => set({ cidade: '', convenio: '', modalidade: '', dia: null }),
  limparTudo: () => set({ ...SEM_FILTRO }),
  usarPonto: (p) => set({ perto: p }),
}));

export const filtrosNaFolha = (f: Filtros) =>
  [f.cidade, f.convenio, f.modalidade, f.dia !== null ? 'dia' : ''].filter(Boolean).length;

/* ============================================================
   A BUSCA
   ============================================================ */

/* A semana começa na segunda para quem marca consulta. */
const ORDEM: Dia[] = [1, 2, 3, 4, 5, 6, 0];

const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const cidadeDe = (c: Consultorio) => `${c.cidade}|${c.uf}`;

/* O consultório passa quando atende a TODOS os filtros de lugar. Um
   profissional com dois consultórios aparece se um deles passar — e a
   distância e o bairro do cartão são os desse. */
function consultorioPassa(c: Consultorio, f: Filtros) {
  if (f.cidade && cidadeDe(c) !== f.cidade) return false;
  if (f.modalidade === 'presencial' && !c.presencial) return false;
  if (f.modalidade === 'teleconsulta' && !c.teleconsulta) return false;
  if (f.convenio === 'particular' && !c.particular) return false;
  if (f.convenio && f.convenio !== 'particular' && !c.convenios.includes(f.convenio)) return false;
  if (f.dia !== null && !c.dias.includes(f.dia)) return false;
  return true;
}

function termoPassa(p: Profissional, termo: string) {
  const t = sem(termo.trim());
  if (!t) return true;
  const onde = [
    p.nome,
    ...p.especialidades.map(nomeDaEspecialidade),
    ...p.consultorios.flatMap((c) => [c.nome, c.bairro ?? '', c.cidade]),
  ];
  return onde.some((s) => sem(s).includes(t));
}

export type Resultado = {
  p: Profissional;
  /** o consultório que o cartão mostra: o mais perto, ou o primeiro */
  c: Consultorio;
  /** quantos outros consultórios passaram nos filtros */
  outros: number;
  km: number | null;
};

export function buscar(lista: Profissional[], f: Filtros, perto: Ponto | null, ignorarEspecialidade = false): Resultado[] {
  const out: Resultado[] = [];
  for (const p of lista) {
    if (!ignorarEspecialidade && f.especialidade && !p.especialidades.includes(f.especialidade)) continue;
    if (!termoPassa(p, f.termo)) continue;
    const passam = p.consultorios.filter((c) => consultorioPassa(c, f));
    if (!passam.length) continue;
    const comKm = passam.map((c) => ({ c, km: perto && c.ponto && c.presencial ? distanciaKm(perto, c.ponto) : null }));
    comKm.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
    out.push({ p, c: comKm[0].c, outros: passam.length - 1, km: comKm[0].km });
  }
  /* Com o ponto da pessoa, a ordem é a distância, e quem só atende por
     vídeo vai para o fim. Sem ele, a ordem é o nome — e não um
     "destaque", que precisaria de um critério que ninguém definiu. */
  out.sort((a, b) =>
    (perto ? (a.km ?? Infinity) - (b.km ?? Infinity) : 0) ||
    semTitulo(a.p.nome).localeCompare(semTitulo(b.p.nome), 'pt-BR'));
  return out;
}

export const semTitulo = (nome: string) => nome.replace(/^(dra?|dr)\.?\s+/i, '');

/** As especialidades que existem no resultado, com quantos cada uma tem. */
export function especialidadesDaBusca(lista: Profissional[], f: Filtros, perto: Ponto | null) {
  const n = new Map<Especialidade, number>();
  for (const r of buscar(lista, f, perto, true)) {
    for (const e of r.p.especialidades) n.set(e, (n.get(e) ?? 0) + 1);
  }
  return [...n.entries()].sort((a, b) => b[1] - a[1]);
}

export function cidadesDaRede(lista: Profissional[]) {
  const n = new Map<string, { id: string; cidade: string; uf: string; n: number }>();
  for (const p of lista) {
    const vistas = new Set<string>();
    for (const c of p.consultorios) {
      const id = cidadeDe(c);
      if (vistas.has(id)) continue;
      vistas.add(id);
      const e = n.get(id) ?? { id, cidade: c.cidade, uf: c.uf, n: 0 };
      e.n += 1;
      n.set(id, e);
    }
  }
  return [...n.values()].sort((a, b) => b.n - a.n || a.cidade.localeCompare(b.cidade, 'pt-BR'));
}

/** Os dias em que alguém da rede atende, com a semana começando na segunda. */
export function diasDaRede(lista: Profissional[]): Dia[] {
  const tem = new Set<Dia>();
  for (const p of lista) for (const c of p.consultorios) c.dias.forEach((d) => tem.add(d));
  return ORDEM.filter((d) => tem.has(d));
}

export function conveniosDaRede(lista: Profissional[]) {
  const todos = new Set<string>();
  for (const p of lista) for (const c of p.consultorios) c.convenios.forEach((x) => todos.add(x));
  return [...todos].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/* ============================================================
   O QUE A TELA ESCREVE
   ============================================================ */

export const nomeDaEspecialidade = (e: Especialidade) => T.rede.especialidades[e];

/** "CRM-SP 154872 · RQE 61233", "CRN-3 48213", "CRP 06/154321" */
export function registroTxt(p: Profissional) {
  const base = p.conselho === 'CRP'
    ? `CRP ${p.regiao}/${p.registro}`
    : `${p.conselho}-${p.regiao} ${p.registro}`;
  return p.rqe?.length ? `${base} · RQE ${p.rqe.join(', ')}` : base;
}

/** "seg, qua e sex", ou "seg a sex" quando são três ou mais seguidos */
export function diasTxt(dias: Dia[]) {
  const nome = WD();
  const tem = ORDEM.filter((d) => dias.includes(d));
  const partes: string[] = [];
  let i = 0;
  while (i < tem.length) {
    let j = i;
    while (j + 1 < tem.length && ORDEM.indexOf(tem[j + 1]) === ORDEM.indexOf(tem[j]) + 1) j++;
    if (j - i >= 2) partes.push(T.rede.deAte(nome[tem[i]], nome[tem[j]]));
    else for (let k = i; k <= j; k++) partes.push(nome[tem[k]]);
    i = j + 1;
  }
  return T.comum.lista(partes);
}

const relogio = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return hm(h, m || 0);
};

/** "Seg, qua e sex · 08:00–17:00" */
export const horarioTxt = (c: Consultorio) =>
  maiuscula(T.rede.horario(diasTxt(c.dias), T.rede.faixa(relogio(c.abre), relogio(c.fecha))));

/** "a 2,3 km", "a 850 m", "1.4 mi away" */
export function distanciaTxt(S: { profile: { sistema?: 'metrico' | 'imperial' } }, km: number) {
  if (sistemaDe(S) === 'imperial') {
    const mi = km * 0.621371;
    return T.rede.aDistancia(`${nf(mi, mi < 10 ? 1 : 0)} mi`);
  }
  if (km < 1) return T.rede.aDistancia(`${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`);
  return T.rede.aDistancia(`${nf(km, km < 10 ? 1 : 0)} km`);
}

/** "Bradesco Saúde, SulAmérica e particular" */
export function conveniosTxt(c: Consultorio) {
  if (!c.convenios.length) return c.particular ? T.rede.ficha.soParticular : '';
  return T.comum.lista([...c.convenios, ...(c.particular ? [T.rede.ficha.particularNaLista] : [])]);
}

export const modalidadeTxt = (c: Consultorio) =>
  c.presencial && c.teleconsulta ? T.rede.ficha.presencialETele
    : c.teleconsulta ? T.rede.soTeleconsulta
      : T.rede.ficha.soPresencial;

/* ============================================================
   A LISTA DE EXEMPLO — só em desenvolvimento

   Nomes, registros, endereços e contatos inventados. Os contatos usam o
   domínio reservado `example.com` e números zerados, e a tela não os
   abre de qualquer jeito. Os pontos são de bairros de verdade, para a
   distância fazer sentido na demonstração.
   ============================================================ */

const EXEMPLO: Profissional[] = [
  {
    id: 'beatriz-lemos',
    nome: 'Dra. Beatriz Lemos',
    especialidades: ['endocrinologia'],
    conselho: 'CRM', regiao: 'SP', registro: '154872', rqe: ['61233'],
    sobre: 'Endocrinologista com foco em obesidade e diabetes tipo 2. Acompanho o tratamento com GLP-1 desde o começo, com retorno a cada quatro semanas enquanto a dose está sendo ajustada.',
    consultorios: [{
      id: 'pinheiros', nome: 'Consultório Pinheiros',
      endereco: 'Rua dos Pinheiros, 1000, sala 42', bairro: 'Pinheiros', cidade: 'São Paulo', uf: 'SP',
      ponto: { lat: -23.566, lng: -46.6835 },
      dias: [1, 3, 5], abre: '08:00', fecha: '17:00', presencial: true, teleconsulta: true,
      convenios: ['Bradesco Saúde', 'SulAmérica'], particular: true,
      contato: { whatsapp: '+55 11 90000-0001', telefone: '(11) 3000-0001', agenda: 'agenda.example.com/beatriz-lemos' },
    }],
  },
  {
    id: 'rafael-nogueira',
    nome: 'Dr. Rafael Nogueira',
    especialidades: ['endocrinologia'],
    conselho: 'CRM', regiao: 'SP', registro: '138455', rqe: ['57402'],
    sobre: 'Endocrinologia clínica, com atenção especial à tireoide e ao metabolismo. Atendo em dois endereços — em Santana, só aos sábados.',
    consultorios: [
      {
        id: 'moema', nome: 'Clínica Ibirapuera',
        endereco: 'Avenida Ibirapuera, 2500, conjunto 81', bairro: 'Moema', cidade: 'São Paulo', uf: 'SP',
        ponto: { lat: -23.601, lng: -46.666 },
        dias: [2, 4], abre: '09:00', fecha: '18:00', presencial: true, teleconsulta: false,
        convenios: ['Amil', 'Porto Saúde', 'Unimed'], particular: true,
        contato: { telefone: '(11) 3000-0002', site: 'rafaelnogueira.example.com' },
      },
      {
        id: 'santana', nome: 'Centro Médico Santana',
        endereco: 'Rua Voluntários da Pátria, 3200', bairro: 'Santana', cidade: 'São Paulo', uf: 'SP',
        ponto: { lat: -23.501, lng: -46.625 },
        dias: [6], abre: '08:00', fecha: '12:00', presencial: true, teleconsulta: false,
        convenios: ['Unimed'], particular: true,
        contato: { telefone: '(11) 3000-0003' },
      },
    ],
  },
  {
    id: 'camila-arantes',
    nome: 'Dra. Camila Arantes',
    especialidades: ['nutrologia'],
    conselho: 'CRM', regiao: 'SP', registro: '167321', rqe: ['70114'],
    sobre: 'Nutróloga. Trabalho a composição corporal durante o tratamento — proteína, força e o que fazer para a perda ser de gordura, e não de músculo.',
    consultorios: [{
      id: 'jardins', nome: 'Espaço Paulista',
      endereco: 'Alameda Santos, 1800, 9º andar', bairro: 'Jardim Paulista', cidade: 'São Paulo', uf: 'SP',
      ponto: { lat: -23.568, lng: -46.652 },
      dias: [1, 2, 3, 4, 5], abre: '09:00', fecha: '19:00', presencial: true, teleconsulta: true,
      convenios: [], particular: true,
      contato: { whatsapp: '+55 11 90000-0004', email: 'contato@camilaarantes.example.com', instagram: 'camilaarantes.exemplo' },
    }],
  },
  {
    id: 'marina-duarte',
    nome: 'Marina Duarte',
    especialidades: ['nutricao'],
    conselho: 'CRN', regiao: '3', registro: '48213',
    sobre: 'Nutricionista. Monto o plano alimentar junto com quem está em tratamento, em cima do que a pessoa já come — com metas de proteína que cabem na rotina.',
    consultorios: [{
      id: 'vila-mariana', nome: 'Consultório Vila Mariana',
      endereco: 'Rua Domingos de Morais, 2200, sala 5', bairro: 'Vila Mariana', cidade: 'São Paulo', uf: 'SP',
      ponto: { lat: -23.589, lng: -46.635 },
      dias: [2, 4], abre: '08:00', fecha: '18:00', presencial: true, teleconsulta: true,
      convenios: [], particular: true,
      contato: { whatsapp: '+55 11 90000-0005', agenda: 'agenda.example.com/marina-duarte' },
    }],
  },
  {
    id: 'felipe-sato',
    nome: 'Dr. Felipe Sato',
    especialidades: ['esporte'],
    conselho: 'CRM', regiao: 'SP', registro: '149903', rqe: ['66120'],
    sobre: 'Medicina do exercício e do esporte. Ajudo a montar o treino de força para preservar massa magra enquanto o peso cai.',
    consultorios: [{
      id: 'itaim', nome: 'Clínica Itaim',
      endereco: 'Rua Joaquim Floriano, 500', bairro: 'Itaim Bibi', cidade: 'São Paulo', uf: 'SP',
      ponto: { lat: -23.584, lng: -46.678 },
      dias: [1, 3], abre: '07:00', fecha: '13:00', presencial: true, teleconsulta: false,
      convenios: ['Porto Saúde', 'SulAmérica'], particular: true,
      contato: { telefone: '(11) 3000-0006', site: 'felipesato.example.com' },
    }],
  },
  {
    id: 'julia-tavares',
    nome: 'Júlia Tavares',
    especialidades: ['psicologia'],
    conselho: 'CRP', regiao: '06', registro: '154321',
    sobre: 'Psicóloga. Atendo quem está mudando a relação com a comida durante o tratamento — fome, ansiedade e o que muda quando o apetite muda.',
    consultorios: [{
      id: 'online', nome: 'Atendimento on-line',
      cidade: 'São Paulo', uf: 'SP',
      dias: [1, 2, 3, 4, 5], abre: '18:00', fecha: '21:00', presencial: false, teleconsulta: true,
      convenios: [], particular: true,
      contato: { whatsapp: '+55 11 90000-0007', agenda: 'agenda.example.com/julia-tavares' },
    }],
  },
  {
    id: 'luisa-cardoso',
    nome: 'Dra. Luísa Cardoso',
    especialidades: ['endocrinologia'],
    conselho: 'CRM', regiao: 'RJ', registro: '52871', rqe: ['30118'],
    sobre: 'Endocrinologista. Obesidade, síndrome metabólica e acompanhamento de longo prazo depois que a dose se estabiliza.',
    consultorios: [{
      id: 'botafogo', nome: 'Clínica Botafogo',
      endereco: 'Rua Voluntários da Pátria, 190, sala 301', bairro: 'Botafogo', cidade: 'Rio de Janeiro', uf: 'RJ',
      ponto: { lat: -22.953, lng: -43.187 },
      dias: [1, 3, 4], abre: '08:00', fecha: '16:00', presencial: true, teleconsulta: true,
      convenios: ['Bradesco Saúde', 'SulAmérica', 'Unimed'], particular: true,
      contato: { whatsapp: '+55 21 90000-0008', telefone: '(21) 3000-0008' },
    }],
  },
  {
    id: 'andre-moreira',
    nome: 'Dr. André Moreira',
    especialidades: ['nutrologia'],
    conselho: 'CRM', regiao: 'RJ', registro: '61240', rqe: ['34502'],
    sobre: 'Nutrólogo. Acompanho exames, suplementação e a alimentação ao longo do tratamento.',
    consultorios: [{
      id: 'barra', nome: 'Centro Médico Barra',
      endereco: 'Avenida das Américas, 4200, bloco 3', bairro: 'Barra da Tijuca', cidade: 'Rio de Janeiro', uf: 'RJ',
      ponto: { lat: -23.0, lng: -43.365 },
      dias: [2, 5, 6], abre: '09:00', fecha: '15:00', presencial: true, teleconsulta: false,
      convenios: ['Amil'], particular: true,
      contato: { telefone: '(21) 3000-0009' },
    }],
  },
  {
    id: 'patricia-menezes',
    nome: 'Dra. Patrícia Menezes',
    especialidades: ['endocrinologia'],
    conselho: 'CRM', regiao: 'MG', registro: '58210', rqe: ['29877'],
    sobre: 'Endocrinologista em Belo Horizonte. Atendo presencialmente na Savassi e por teleconsulta para quem mora no interior.',
    consultorios: [{
      id: 'savassi', nome: 'Consultório Savassi',
      endereco: 'Rua Pernambuco, 1000, sala 1102', bairro: 'Savassi', cidade: 'Belo Horizonte', uf: 'MG',
      ponto: { lat: -19.938, lng: -43.935 },
      dias: [1, 2, 3, 4], abre: '08:00', fecha: '17:00', presencial: true, teleconsulta: true,
      convenios: ['Unimed'], particular: true,
      contato: { whatsapp: '+55 31 90000-0010', telefone: '(31) 3000-0010' },
    }],
  },
];
