import { create } from 'zustand';
import { temRedeParceira } from './pais';
import { distanciaKm, type Ponto } from './localizacao';
import { sistemaDe } from './medidas';
import { WD, hm, nf, maiuscula } from './time';
import type { FichaDaClinica, FichaDaEquipe } from './derive';
import { T } from '../textos';

/* ============================================================
   A REDE PARCEIRA — o catálogo da vitrine

   ⚠️ A UNIDADE É A CLÍNICA, e não o médico. É com a clínica que o vínculo
   acontece, é ela que passa o código de convite, e é a tela dela
   (/clinica, na versão parceira) que a pessoa abre ao tocar num cartão.
   Quem trabalha lá é a equipe — e a busca continua achando pelo nome de
   cada um.

   As clínicas vêm do portal da rede, onde cada uma é cadastrada e mantém
   a própria ficha. Os tipos abaixo são o CONTRATO: o que a vitrine
   precisa receber do portal, e nada além disso.

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

/** Os canais que a clínica cadastrou. Canal vazio não aparece. */
export type Contato = {
  whatsapp?: string;
  telefone?: string;
  /** endereço da agenda on-line da clínica */
  agenda?: string;
  site?: string;
  email?: string;
  instagram?: string;
};

export type Profissional = {
  id: string;
  /** como o profissional escreveu no portal, com o título se ele usa */
  nome: string;
  /** endereço da foto no portal */
  foto?: string;
  especialidades: Especialidade[];
  conselho: Conselho;
  /** a região do conselho: UF no CRM ("SP"), número no CRN ("3") e no CRP ("06") */
  regiao: string;
  registro: string;
  /** Registro de Qualificação de Especialista — só de médico, um por especialidade */
  rqe?: string[];
  /** quem responde pela clínica; é o rosto do cartão */
  responsavel?: boolean;
};

export type Clinica = {
  id: string;
  nome: string;
  /** a fachada ou a recepção, e a marca — as duas podem faltar */
  foto?: string;
  logo?: string;
  /** com as palavras da própria clínica */
  sobre?: string;
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
  equipe: Profissional[];
};

/* ============================================================
   A FONTE
   ============================================================ */

type Fonte = () => Promise<Clinica[]>;
const FONTE: Fonte | null = __DEV__ ? async () => EXEMPLO : null;

/** Se a vitrine tem de onde ler. Sem isso, a porta dela não aparece. */
export const redeNoAr = () => temRedeParceira() && FONTE !== null;

/** Se o que está na tela é a lista inventada. Nesse caso nenhum contato abre. */
export const redeDeExemplo = () => __DEV__ && FONTE !== null;

/* A última lista lida, para /clinica abrir sem esperar a rede de novo. */
let ultima: Clinica[] | null = null;

export async function carregarRede(): Promise<Clinica[]> {
  if (!FONTE) return [];
  ultima = await FONTE();
  return ultima;
}

export async function clinicaDaRede(id: string): Promise<Clinica | null> {
  const lista = ultima ?? (await carregarRede());
  return lista.find((c) => c.id === id) ?? null;
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

/** Os filtros que abrem folha — cada chip da vitrine é um deles. */
export type Filtro = 'especialidade' | 'convenio' | 'modalidade' | 'dia' | 'cidade';

export const SEM_FILTRO: Filtros = { termo: '', especialidade: '', cidade: '', convenio: '', modalidade: '', dia: null };

type Vitrine = Filtros & {
  /** o ponto da pessoa, quando ela deixou usar */
  perto: Ponto | null;
  mudar: (f: Partial<Filtros>) => void;
  limparTudo: () => void;
  usarPonto: (p: Ponto | null) => void;
};

export const useVitrine = create<Vitrine>((set) => ({
  ...SEM_FILTRO,
  perto: null,
  mudar: (f) => set(f),
  limparTudo: () => set({ ...SEM_FILTRO }),
  usarPonto: (p) => set({ perto: p }),
}));

/* ============================================================
   A BUSCA
   ============================================================ */

/* A semana começa na segunda para quem marca consulta. */
const ORDEM: Dia[] = [1, 2, 3, 4, 5, 6, 0];
/** A semana na ordem da vitrine — a fileira de dias do cartão usa a mesma. */
export const SEMANA_DE_CONSULTA: readonly Dia[] = ORDEM;

/** Se a clínica ainda atende hoje: é dia de atendimento, e o horário não
    acabou. Às oito da noite, quem fecha às cinco não "atende hoje" para
    ninguém que esteja procurando agora. */
export function atendeHoje(c: Clinica, agora = new Date()) {
  if (!c.dias.includes(agora.getDay() as Dia)) return false;
  const [h, m] = c.fecha.split(':').map(Number);
  return agora.getHours() * 60 + agora.getMinutes() < h * 60 + (m || 0);
}

const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const cidadeDe = (c: Clinica) => `${c.cidade}|${c.uf}`;

function passa(c: Clinica, f: Filtros, ignorarEspecialidade: boolean) {
  if (f.cidade && cidadeDe(c) !== f.cidade) return false;
  if (f.modalidade === 'presencial' && !c.presencial) return false;
  if (f.modalidade === 'teleconsulta' && !c.teleconsulta) return false;
  if (f.convenio === 'particular' && !c.particular) return false;
  if (f.convenio && f.convenio !== 'particular' && !c.convenios.includes(f.convenio)) return false;
  if (f.dia !== null && !c.dias.includes(f.dia)) return false;
  if (!ignorarEspecialidade && f.especialidade && !c.equipe.some((p) => p.especialidades.includes(f.especialidade as Especialidade))) return false;
  const t = sem(f.termo.trim());
  if (t) {
    const onde = [
      c.nome, c.bairro ?? '', c.cidade,
      ...c.equipe.flatMap((p) => [p.nome, ...p.especialidades.map(nomeDaEspecialidade)]),
    ];
    if (!onde.some((s) => sem(s).includes(t))) return false;
  }
  return true;
}

export type Resultado = { c: Clinica; km: number | null };

export const kmAte = (c: Clinica, perto: Ponto | null) =>
  perto && c.ponto && c.presencial ? distanciaKm(perto, c.ponto) : null;

export function buscar(lista: Clinica[], f: Filtros, perto: Ponto | null, ignorarEspecialidade = false): Resultado[] {
  const out = lista
    .filter((c) => passa(c, f, ignorarEspecialidade))
    .map((c) => ({ c, km: kmAte(c, perto) }));
  /* Com o ponto da pessoa, a ordem é a distância, e quem só atende por
     vídeo vai para o fim. Sem ele, a ordem é o nome — e não um
     "destaque", que precisaria de um critério que ninguém definiu. */
  out.sort((a, b) =>
    (perto ? (a.km ?? Infinity) - (b.km ?? Infinity) : 0) ||
    a.c.nome.localeCompare(b.c.nome, 'pt-BR'));
  return out;
}

/** As especialidades que existem no resultado, com quantas clínicas cada uma tem. */
export function especialidadesDaBusca(lista: Clinica[], f: Filtros, perto: Ponto | null) {
  const n = new Map<Especialidade, number>();
  for (const r of buscar(lista, f, perto, true)) {
    const tem = new Set(r.c.equipe.flatMap((p) => p.especialidades));
    for (const e of tem) n.set(e, (n.get(e) ?? 0) + 1);
  }
  return [...n.entries()].sort((a, b) => b[1] - a[1]);
}

export function cidadesDaRede(lista: Clinica[]) {
  const n = new Map<string, { id: string; cidade: string; uf: string; n: number }>();
  for (const c of lista) {
    const id = cidadeDe(c);
    const e = n.get(id) ?? { id, cidade: c.cidade, uf: c.uf, n: 0 };
    e.n += 1;
    n.set(id, e);
  }
  return [...n.values()].sort((a, b) => b.n - a.n || a.cidade.localeCompare(b.cidade, 'pt-BR'));
}

export function conveniosDaRede(lista: Clinica[]) {
  const todos = new Set<string>();
  for (const c of lista) c.convenios.forEach((x) => todos.add(x));
  return [...todos].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/** Os dias em que alguma clínica da rede atende, com a semana começando na segunda. */
export function diasDaRede(lista: Clinica[]): Dia[] {
  const tem = new Set<Dia>();
  for (const c of lista) c.dias.forEach((d) => tem.add(d));
  return ORDEM.filter((d) => tem.has(d));
}

/** Quantas pessoas a rede tem, contando uma vez quem atende em duas clínicas. */
export const profissionaisDaRede = (lista: Clinica[]) =>
  new Set(lista.flatMap((c) => c.equipe.map((p) => p.id))).size;

/* ============================================================
   O QUE A TELA ESCREVE
   ============================================================ */

export const nomeDaEspecialidade = (e: Especialidade) => T.rede.especialidades[e];

/** Quem responde pela clínica — o rosto do cartão. */
export const responsavelDe = (c: Clinica) => c.equipe.find((p) => p.responsavel) ?? c.equipe[0];

/** "Endocrinologia · Nutrição", sem repetir quem tem a mesma */
export const especialidadesDaClinica = (c: Clinica) =>
  [...new Set(c.equipe.flatMap((p) => p.especialidades))].map(nomeDaEspecialidade).join(' · ');

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
export const horarioTxt = (c: Clinica) =>
  maiuscula(T.rede.horario(diasTxt(c.dias), T.rede.faixa(relogio(c.abre), relogio(c.fecha))));

export const modalidadeTxt = (c: Clinica) =>
  c.presencial && c.teleconsulta ? T.rede.presencialETele
    : c.teleconsulta ? T.rede.soTeleconsulta
      : T.rede.soPresencial;

/** "a 2,3 km", "a 850 m", "1.4 mi away" */
export function distanciaTxt(S: { profile: { sistema?: 'metrico' | 'imperial' } }, km: number) {
  if (sistemaDe(S) === 'imperial') {
    const mi = km * 0.621371;
    return T.rede.aDistancia(`${nf(mi, mi < 10 ? 1 : 0)} mi`);
  }
  if (km < 1) return T.rede.aDistancia(`${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`);
  return T.rede.aDistancia(`${nf(km, km < 10 ? 1 : 0)} km`);
}

/** "Pinheiros · a 2,9 km", ou "Só teleconsulta" */
export function ondeTxt(S: { profile: { sistema?: 'metrico' | 'imperial' } }, r: Resultado) {
  if (!r.c.presencial) return T.rede.soTeleconsulta;
  return [r.c.bairro ?? r.c.cidade, r.km != null ? distanciaTxt(S, r.km) : ''].filter(Boolean).join(' · ');
}

/* ============================================================
   A FICHA — o que /clinica lê quando a clínica vem da rede

   /clinica foi desenhada lendo a clínica do PERFIL, e é a mesma tela para
   a clínica que vem daqui: a ficha tem a mesma forma, e a tela não
   precisa saber de onde ela veio.
   ============================================================ */
export function fichaDaRede(
  c: Clinica, S: { profile: { sistema?: 'metrico' | 'imperial' } }, perto: Ponto | null,
): FichaDaClinica {
  const km = kmAte(c, perto);
  const equipe = [...c.equipe].sort((a, b) => Number(!!b.responsavel) - Number(!!a.responsavel));
  return {
    nome: c.nome,
    especialidade: especialidadesDaClinica(c),
    cidade: [c.bairro ? `${c.bairro}, ${c.cidade}` : c.cidade, km != null ? distanciaTxt(S, km) : ''].filter(Boolean).join(' · '),
    sobre: c.sobre,
    endereco: c.presencial ? c.endereco : undefined,
    horario: `${horarioTxt(c)} · ${modalidadeTxt(c)}`,
    convenios: [...c.convenios, ...(c.particular ? [T.rede.particular] : [])],
    contato: c.contato,
    equipe: equipe.map((p): FichaDaEquipe => ({
      id: p.id,
      nome: p.nome,
      papel: p.especialidades.map(nomeDaEspecialidade).join(' · '),
      responsavel: !!p.responsavel && c.equipe.length > 1,
      registro: registroTxt(p),
    })),
  };
}

/* ============================================================
   A LISTA DE EXEMPLO — só em desenvolvimento

   Nomes, registros, endereços e contatos inventados. Os contatos usam o
   domínio reservado `example.com` e números zerados, e a tela não os
   abre de qualquer jeito. Os pontos são de bairros de verdade, para a
   distância fazer sentido na demonstração. As fotos são as da semente —
   ver `fotoDaRede`, em ui/retratos.
   ============================================================ */

const EXEMPLO: Clinica[] = [
  {
    id: 'lemos', nome: 'Clínica Lemos',
    sobre: 'Endocrinologia e nutrição no mesmo lugar. Acompanhamos o tratamento com GLP-1 desde o começo, com retorno a cada quatro semanas enquanto a dose está sendo ajustada.',
    endereco: 'Rua dos Pinheiros, 1000, sala 42', bairro: 'Pinheiros', cidade: 'São Paulo', uf: 'SP',
    ponto: { lat: -23.566, lng: -46.6835 },
    dias: [1, 3, 5], abre: '08:00', fecha: '17:00', presencial: true, teleconsulta: true,
    convenios: ['Bradesco Saúde', 'SulAmérica'], particular: true,
    contato: { whatsapp: '+55 11 90000-0001', telefone: '(11) 3000-0001', agenda: 'agenda.example.com/clinica-lemos' },
    equipe: [
      { id: 'beatriz-lemos', nome: 'Dra. Beatriz Lemos', especialidades: ['endocrinologia'], conselho: 'CRM', regiao: 'SP', registro: '154872', rqe: ['61233'], responsavel: true },
      { id: 'marina-duarte', nome: 'Marina Duarte', especialidades: ['nutricao'], conselho: 'CRN', regiao: '3', registro: '48213' },
    ],
  },
  {
    id: 'ibirapuera', nome: 'Clínica Ibirapuera',
    sobre: 'Endocrinologia clínica, com atenção especial à tireoide e ao metabolismo.',
    endereco: 'Avenida Ibirapuera, 2500, conjunto 81', bairro: 'Moema', cidade: 'São Paulo', uf: 'SP',
    ponto: { lat: -23.601, lng: -46.666 },
    dias: [2, 4], abre: '09:00', fecha: '18:00', presencial: true, teleconsulta: false,
    convenios: ['Amil', 'Porto Saúde', 'Unimed'], particular: true,
    contato: { telefone: '(11) 3000-0002', site: 'clinicaibirapuera.example.com' },
    equipe: [
      { id: 'rafael-nogueira', nome: 'Dr. Rafael Nogueira', especialidades: ['endocrinologia'], conselho: 'CRM', regiao: 'SP', registro: '138455', rqe: ['57402'], responsavel: true },
    ],
  },
  {
    id: 'santana', nome: 'Centro Médico Santana',
    endereco: 'Rua Voluntários da Pátria, 3200', bairro: 'Santana', cidade: 'São Paulo', uf: 'SP',
    ponto: { lat: -23.501, lng: -46.625 },
    dias: [6], abre: '08:00', fecha: '12:00', presencial: true, teleconsulta: false,
    convenios: ['Unimed'], particular: true,
    contato: { telefone: '(11) 3000-0003' },
    equipe: [
      { id: 'rafael-nogueira', nome: 'Dr. Rafael Nogueira', especialidades: ['endocrinologia'], conselho: 'CRM', regiao: 'SP', registro: '138455', rqe: ['57402'], responsavel: true },
    ],
  },
  {
    id: 'paulista', nome: 'Espaço Paulista',
    sobre: 'Nutrologia com foco em composição corporal: proteína, força e o que fazer para a perda ser de gordura, e não de músculo.',
    endereco: 'Alameda Santos, 1800, 9º andar', bairro: 'Jardim Paulista', cidade: 'São Paulo', uf: 'SP',
    ponto: { lat: -23.568, lng: -46.652 },
    dias: [1, 2, 3, 4, 5], abre: '09:00', fecha: '19:00', presencial: true, teleconsulta: true,
    convenios: [], particular: true,
    contato: { whatsapp: '+55 11 90000-0004', email: 'contato@espacopaulista.example.com', instagram: 'espacopaulista.exemplo' },
    equipe: [
      { id: 'camila-arantes', nome: 'Dra. Camila Arantes', especialidades: ['nutrologia'], conselho: 'CRM', regiao: 'SP', registro: '167321', rqe: ['70114'], responsavel: true },
      { id: 'felipe-sato', nome: 'Dr. Felipe Sato', especialidades: ['esporte'], conselho: 'CRM', regiao: 'SP', registro: '149903', rqe: ['66120'] },
    ],
  },
  {
    id: 'julia-tavares', nome: 'Júlia Tavares Psicologia',
    sobre: 'Atendimento on-line para quem está mudando a relação com a comida durante o tratamento — fome, ansiedade e o que muda quando o apetite muda.',
    cidade: 'São Paulo', uf: 'SP',
    dias: [1, 2, 3, 4, 5], abre: '18:00', fecha: '21:00', presencial: false, teleconsulta: true,
    convenios: [], particular: true,
    contato: { whatsapp: '+55 11 90000-0007', agenda: 'agenda.example.com/julia-tavares' },
    equipe: [
      { id: 'julia-tavares', nome: 'Júlia Tavares', especialidades: ['psicologia'], conselho: 'CRP', regiao: '06', registro: '154321', responsavel: true },
    ],
  },
  {
    id: 'botafogo', nome: 'Clínica Botafogo',
    sobre: 'Obesidade, síndrome metabólica e acompanhamento de longo prazo depois que a dose se estabiliza.',
    endereco: 'Rua São Clemente, 190, sala 301', bairro: 'Botafogo', cidade: 'Rio de Janeiro', uf: 'RJ',
    ponto: { lat: -22.953, lng: -43.187 },
    dias: [1, 3, 4], abre: '08:00', fecha: '16:00', presencial: true, teleconsulta: true,
    convenios: ['Bradesco Saúde', 'SulAmérica', 'Unimed'], particular: true,
    contato: { whatsapp: '+55 21 90000-0008', telefone: '(21) 3000-0008' },
    equipe: [
      { id: 'luisa-cardoso', nome: 'Dra. Luísa Cardoso', especialidades: ['endocrinologia'], conselho: 'CRM', regiao: 'RJ', registro: '52871', rqe: ['30118'], responsavel: true },
    ],
  },
  {
    id: 'barra', nome: 'Centro Médico Barra',
    endereco: 'Avenida das Américas, 4200, bloco 3', bairro: 'Barra da Tijuca', cidade: 'Rio de Janeiro', uf: 'RJ',
    ponto: { lat: -23.0, lng: -43.365 },
    dias: [2, 5, 6], abre: '09:00', fecha: '15:00', presencial: true, teleconsulta: false,
    convenios: ['Amil'], particular: true,
    contato: { telefone: '(21) 3000-0009' },
    equipe: [
      { id: 'andre-moreira', nome: 'Dr. André Moreira', especialidades: ['nutrologia'], conselho: 'CRM', regiao: 'RJ', registro: '61240', rqe: ['34502'], responsavel: true },
    ],
  },
  {
    id: 'savassi', nome: 'Consultório Savassi',
    sobre: 'Endocrinologia em Belo Horizonte, com teleconsulta para quem mora no interior.',
    endereco: 'Rua Pernambuco, 1000, sala 1102', bairro: 'Savassi', cidade: 'Belo Horizonte', uf: 'MG',
    ponto: { lat: -19.938, lng: -43.935 },
    dias: [1, 2, 3, 4], abre: '08:00', fecha: '17:00', presencial: true, teleconsulta: true,
    convenios: ['Unimed'], particular: true,
    contato: { whatsapp: '+55 31 90000-0010', telefone: '(31) 3000-0010' },
    equipe: [
      { id: 'patricia-menezes', nome: 'Dra. Patrícia Menezes', especialidades: ['endocrinologia'], conselho: 'CRM', regiao: 'MG', registro: '58210', rqe: ['29877'], responsavel: true },
    ],
  },
];
