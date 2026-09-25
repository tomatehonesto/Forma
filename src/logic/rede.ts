import { create } from 'zustand';
import { temRedeParceira } from './pais';
import { distanciaKm, type Ponto } from './localizacao';
import { sistemaDe } from './medidas';
import { WD, hm, nf, maiuscula, now } from './time';
import { normalizarConvite, vinculoDoConvite } from './assinatura';
import { contaLigada, nuvem } from './nuvem';
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
   existem em `__DEV__`, a vitrine avisa no alto que são de exemplo, e os
   contatos deles abrem o aplicativo certo sem chegar a ninguém: os
   números começam com 0, que o plano de numeração brasileiro não usa, e
   os endereços são do domínio reservado example.com.
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
  /** clínica da semente do projeto de desenvolvimento — a vitrine avisa */
  exemplo?: boolean;
};

/* ============================================================
   A FONTE — o banco (fase 6 do plano do Supabase)

   As clínicas publicadas, com a equipe e os campos públicos de cada
   profissional, numa consulta só. Quem mantém é o portal; aqui só se lê.

   ⚠️ SEM A CONTA LIGADA, NÃO HÁ REDE — é o caso das builds de loja até a
   fase 8. A vitrine não abre, e o bloco da aba Cuidado continua levando a
   /parceiros. A lista de exemplo saiu do aplicativo: ela mora na semente
   do projeto de desenvolvimento (supabase/seed.sql), e cada clínica dela
   vem marcada como `exemplo`.
   ============================================================ */

/** Se a vitrine tem de onde ler. Sem isso, a porta dela não aparece. */
export const redeNoAr = () => temRedeParceira() && contaLigada();

/* A última lista lida, para /clinica abrir sem esperar a rede de novo. */
let ultima: Clinica[] | null = null;

/** Se o que está na tela é de exemplo: as clínicas lidas vêm marcadas. Aí
    a vitrine avisa, e os contatos abrem sem chegar a ninguém. */
export const redeDeExemplo = () => !!ultima?.some((c) => c.exemplo);

/* O que o banco devolve, na forma da vitrine. A mesma forma serve para a
   clínica de `clinica_json`, a das funções do convite (supabase/
   migrations, "funcoes_do_convite"). */
const numero = (x: unknown) => (typeof x === 'number' ? x : Number(x));

export function profissionalDoBanco(p: any, responsavel = !!p?.responsavel): Profissional {
  return {
    id: p.id,
    nome: p.nome,
    ...(p.foto ? { foto: p.foto } : {}),
    especialidades: p.especialidades ?? [],
    conselho: p.conselho,
    regiao: p.regiao,
    registro: p.registro,
    ...(Array.isArray(p.rqe) && p.rqe.length ? { rqe: p.rqe } : {}),
    ...(responsavel ? { responsavel: true } : {}),
  };
}

export function clinicaDoBanco(c: any): Clinica {
  const lat = c.ponto?.lat ?? c.lat;
  const lng = c.ponto?.lng ?? c.lng;
  return {
    id: c.id,
    nome: c.nome,
    ...(c.foto ? { foto: c.foto } : {}),
    ...(c.logo ? { logo: c.logo } : {}),
    ...(c.sobre ? { sobre: c.sobre } : {}),
    ...(c.endereco ? { endereco: c.endereco } : {}),
    ...(c.bairro ? { bairro: c.bairro } : {}),
    cidade: c.cidade,
    uf: c.uf,
    ...(lat != null && lng != null ? { ponto: { lat: numero(lat), lng: numero(lng) } } : {}),
    dias: (c.dias ?? []) as Dia[],
    abre: c.abre,
    fecha: c.fecha,
    presencial: !!c.presencial,
    teleconsulta: !!c.teleconsulta,
    convenios: c.convenios ?? [],
    particular: !!c.particular,
    contato: c.contato ?? {},
    equipe: c.equipe ?? [],
    ...(c.exemplo ? { exemplo: true } : {}),
  };
}

/* As linhas de `equipe`, com o profissional embutido, na ordem do portal. */
const equipeDoBanco = (linhas: any[] | null | undefined): Profissional[] =>
  (linhas ?? [])
    .filter((e) => e?.ativo && e.profissionais)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || String(a.profissionais.nome).localeCompare(b.profissionais.nome))
    .map((e) => profissionalDoBanco(e.profissionais, e.papel === 'responsavel'));

const COLUNAS = 'id,nome,foto,logo,sobre,endereco,bairro,cidade,uf,lat,lng,dias,abre,fecha,presencial,teleconsulta,convenios,particular,contato,exemplo,'
  + 'equipe(papel,ativo,ordem,profissionais(id,nome,foto,especialidades,conselho,regiao,registro,rqe))';

export async function carregarRede(): Promise<Clinica[]> {
  const cliente = contaLigada() ? nuvem() : null;
  if (!cliente) return [];
  const { data, error } = await cliente.from('clinicas').select(COLUNAS).eq('publicada', true).order('nome');
  if (error) throw error;
  ultima = (data ?? []).map((c: any) => clinicaDoBanco({ ...c, equipe: equipeDoBanco(c.equipe) }));
  return ultima;
}

/** Uma clínica pelo id — da lista lida, ou do banco: a do próprio vínculo
    vem pela regra do banco, publicada ou não. */
export async function clinicaDaRede(id: string): Promise<Clinica | null> {
  const achada = ultima?.find((c) => c.id === id);
  if (achada) return achada;
  const cliente = contaLigada() ? nuvem() : null;
  if (!cliente) return null;
  const { data } = await cliente.from('clinicas').select(COLUNAS).eq('id', id).maybeSingle();
  return data ? clinicaDoBanco({ ...(data as any), equipe: equipeDoBanco((data as any).equipe) }) : null;
}

/* ============================================================
   A APRESENTAÇÃO — só na primeira vez

   O cartão da aba Cuidado abre /rede-apresentacao enquanto ela não foi
   vista, e a vitrine depois disso. O formato é o dos outros "já mostrei
   isso" do aplicativo (`vistoEmConquistas`, `descobertasVistas`): mapa
   por id, lido com `?? {}`, escrito preguiçosamente — e o valor é quando
   ela foi vista pela primeira vez.
   ============================================================ */
type ComApresentacoes = { apresentacoesVistas?: Record<string, number> };

export const viuApresentacaoDaRede = (S: ComApresentacoes) => !!S.apresentacoesVistas?.rede;

export const marcarApresentacaoDaRede = (S: ComApresentacoes) => {
  const m = S.apresentacoesVistas ?? (S.apresentacoesVistas = {});
  if (!m.rede) m.rede = +now();
};

/* ============================================================
   O CONVITE — de quem é o código que a pessoa digitou

   O código vem da clínica, e o banco sabe de qual clínica ele é e quem o
   passou (`conferir_convite`). Conferir antes de ligar é o que deixa a
   folha do código perguntar "É essa a sua clínica?" com o nome da clínica
   e de quem atende — e é o que impede um erro de digitação de ligar a
   pessoa à clínica errada.

   ⚠️ SEM A CONTA LIGADA, NÃO HÁ O QUE CONFERIR, e o código liga como
   sempre ligou (ver `vinculoDoConvite`, em logic/assinatura). É o caso de
   produção até a fase 8.

   ⚠️ E "NÃO ACHAMOS" SÓ EXISTE QUANDO HOUVE A QUEM PERGUNTAR. Sem conexão
   é outra coisa, e a folha diz outra frase.
   ============================================================ */
export type ConviteDaRede = { codigo: string; clinica: Clinica; profissional: Profissional };

export type ConferenciaDoConvite =
  | { tipo: 'sem-fonte' }
  | { tipo: 'sem-internet' }
  | { tipo: 'nao-achou' }
  | { tipo: 'achou'; convite: ConviteDaRede };

const semRede = (e: { message?: string; code?: string } | null | undefined) =>
  !!e && (!e.code || /fetch|network/i.test(e.message ?? ''));

export async function conferirConvite(codigo: string): Promise<ConferenciaDoConvite> {
  const cliente = contaLigada() ? nuvem() : null;
  if (!cliente) return { tipo: 'sem-fonte' };
  try {
    const { data, error } = await cliente.rpc('conferir_convite', { codigo: normalizarConvite(codigo) });
    if (error) return semRede(error) ? { tipo: 'sem-internet' } : { tipo: 'nao-achou' };
    if (!data) return { tipo: 'nao-achou' };
    const d = data as any;
    return {
      tipo: 'achou',
      convite: { codigo: d.codigo, clinica: clinicaDoBanco(d.clinica), profissional: profissionalDoBanco(d.profissional) },
    };
  } catch {
    return { tipo: 'sem-internet' };
  }
}

/** Os códigos da semente de desenvolvimento, para a folha poder dizer
    quais são. Só os nomes: de quem é cada um, quem sabe é o banco.
    ⚠️ A mesma lista de supabase/seed.sql — scripts/regras.mjs confere. */
const CODIGOS_DE_EXEMPLO = ['LEMOS26', 'IBIRAPUERA26', 'SANTANA26', 'PAULISTA26', 'TAVARES26', 'BOTAFOGO26', 'BARRA26', 'SAVASSI26'];
export const codigosDeExemplo = () => (__DEV__ && redeNoAr() && redeDeExemplo() ? CODIGOS_DE_EXEMPLO : []);

/* ============================================================
   O VÍNCULO — o servidor é a fonte, e o aparelho guarda a cópia

   `profile.vinculo` é a cópia do vínculo ativo, com o `id` da linha de
   `vinculos`. Ele nasce de `usar_convite` — que exige o consentimento de
   compartilhar, na versão que a pessoa leu (logic/compartilhamento) — e
   acaba em `encerrar_vinculo`, pela pessoa ou pela clínica.
   ============================================================ */
export type ResultadoDoVinculo =
  | { ok: true; vinculo: any }
  | { ok: false; erro: 'sem-internet' | 'sem-sessao' | 'nao-valeu' };

/** Usa o código: o banco confere de novo, liga, e devolve o vínculo. */
export async function usarConvite(codigo: string, versao: number): Promise<ResultadoDoVinculo> {
  const cliente = contaLigada() ? nuvem() : null;
  if (!cliente) return { ok: false, erro: 'sem-sessao' };
  try {
    const { data, error } = await cliente.rpc('usar_convite', {
      codigo: normalizarConvite(codigo), versao_consentimento: versao,
    });
    if (error) return { ok: false, erro: semRede(error) ? 'sem-internet' : error.code === '42501' ? 'sem-sessao' : 'nao-valeu' };
    return data ? { ok: true, vinculo: data } : { ok: false, erro: 'nao-valeu' };
  } catch {
    return { ok: false, erro: 'sem-internet' };
  }
}

/** Desconecta: o banco encerra o vínculo ativo da pessoa. */
export async function encerrarVinculo(): Promise<{ ok: true } | { ok: false; erro: 'sem-internet' | 'sem-sessao' }> {
  const cliente = contaLigada() ? nuvem() : null;
  if (!cliente) return { ok: false, erro: 'sem-sessao' };
  try {
    const { error } = await cliente.rpc('encerrar_vinculo', {});
    if (error) return { ok: false, erro: semRede(error) ? 'sem-internet' : 'sem-sessao' };
    return { ok: true };
  } catch {
    return { ok: false, erro: 'sem-internet' };
  }
}

/** O último vínculo da pessoa no banco — o ativo, ou o que acabou por
    último —, como `vinculo_json` o escreveria. Nulo quando não há nenhum;
    `undefined` quando não deu para perguntar. */
export async function ultimoVinculo(): Promise<any | null | undefined> {
  const cliente = contaLigada() ? nuvem() : null;
  if (!cliente) return undefined;
  const { data: sessao } = await cliente.auth.getSession();
  const eu = sessao.session?.user.id;
  if (!eu) return undefined;
  const { data, error } = await cliente
    .from('vinculos')
    .select('id,convite,desde,encerrado_em,encerrado_por,consentimento_versao,clinica_id,profissional_id,'
      + `clinicas(${COLUNAS}),profissionais(id,nome,foto,especialidades,conselho,regiao,registro,rqe)`)
    .eq('paciente_id', eu)
    .order('encerrado_em', { ascending: false, nullsFirst: true })
    .order('desde', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return undefined;
  if (!data) return null;
  const v = data as any;
  return {
    id: v.id, convite: v.convite, desde: v.desde,
    encerrado_em: v.encerrado_em, encerrado_por: v.encerrado_por,
    consentimento_versao: v.consentimento_versao,
    clinica: v.clinicas ? { ...v.clinicas, equipe: equipeDoBanco(v.clinicas.equipe) } : { id: v.clinica_id },
    profissional: v.profissionais ?? (v.profissional_id ? { id: v.profissional_id } : null),
  };
}

/* ⚠️ CONECTAR GRAVA O QUE O SERVIDOR DEVOLVEU, e só isso: a clínica e
   quem passou o código, com o que o portal diz de cada um. É o "quem
   acompanha você" dela a partir de agora — e o diário não se mexe.

   ⚠️ E A FICHA VAI COMO TEXTO, como o resto do perfil: o horário sai
   escrito no idioma de agora. */
function gravarFicha(s: any, c: Clinica, p: Profissional | null) {
  s.profile.acompanhamento = 'proprio';
  s.profile.clinic = c.nome;
  s.profile.clinicInfo = {
    nome: c.nome,
    especialidade: especialidadesDaClinica(c),
    cidade: c.bairro ? `${c.bairro}, ${c.cidade}` : c.cidade,
    sobre: c.sobre,
    endereco: c.presencial ? c.endereco : undefined,
    horario: c.abre && c.fecha ? `${horarioTxt(c)} · ${modalidadeTxt(c)}` : undefined,
    /* o perfil guarda o particular no meio da lista, como a clínica
       escreve — ver `fichaDaClinica`, em logic/derive */
    convenios: [...c.convenios, ...(c.particular ? ['Particular'] : [])],
    contato: c.contato,
  };
  if (p) {
    s.profile.doctor = p.nome;
    s.profile.doctorInfo = {
      crm: registroTxt(p),
      especialidade: p.especialidades.map(nomeDaEspecialidade).join(' · '),
    };
  }
}

/** A cópia do vínculo que o servidor devolveu (`vinculo_json`). */
export function gravarVinculo(s: any, v: any) {
  const c = clinicaDoBanco(v.clinica ?? {});
  const p = v.profissional?.nome ? profissionalDoBanco(v.profissional) : null;
  s.profile.convite = v.convite ?? s.profile.convite ?? '';
  s.profile.vinculo = {
    id: v.id,
    desde: Date.parse(v.desde),
    convite: v.convite ?? '',
    clinica: c.id,
    ...(p ? { profissional: p.id } : {}),
    ...(p?.foto ? { retrato: p.foto } : {}),
    consentimento: v.consentimento_versao,
  };
  if (c.nome) gravarFicha(s, c, p);
}

/** O caminho sem nuvem: o código conferido pela lista de antes liga no
    aparelho. Só existe sem a conta ligada. */
export function gravarConviteDaRede(s: any, v: ConviteDaRede) {
  s.profile.convite = v.codigo;
  s.profile.vinculo = { ...vinculoDoConvite(v.codigo), clinica: v.clinica.id, profissional: v.profissional.id, retrato: v.profissional.foto };
  gravarFicha(s, v.clinica, v.profissional);
}

/** O código respondido no cadastro. ⚠️ Só escreve quando ele mudou — a
    edição da altura pelo lápis passa pelo mesmo `salvar` —, e com a nuvem
    não liga: o vínculo nasce no servidor, depois do consentimento, na
    folha do código, que abre com este código escrito. */
export function conviteDoCadastro(s: any, digitado: string) {
  const codigo = digitado ? normalizarConvite(digitado) : '';
  if (codigo === (s.profile.convite ?? '')) return;
  s.profile.convite = codigo;
  if (!contaLigada()) s.profile.vinculo = codigo ? vinculoDoConvite(codigo) : null;
}

/** Desconectado: sai o que só existe porque existe alguém do outro lado
    — o mesmo recorte de `mascarar(…, 'sem-parceira')`, em logic/store. O
    diário fica inteiro. */
export function tirarVinculo(s: any) {
  s.profile.vinculo = null;
  s.messages = [];
  s.unread = 0;
  s.prescriptions = [];
  s.team = [];
  s.materials = [];
  s.protocol = {
    ...s.protocol,
    tasks: (s.protocol?.tasks ?? []).filter((x: any) => !(x.t && /exame/i.test(x.t))),
  };
}

/* ============================================================
   O VÍNCULO QUE DESCE — a cópia acompanha o servidor

   Na abertura e na volta ao aplicativo, o último vínculo desce e a cópia
   segue o que ele diz:
     - um vínculo ativo que não é o da cópia (troca de clínica em outro
       aparelho, ou a cópia ainda não existia): a cópia passa a ser ele;
     - a cópia com o `id` de um vínculo que acabou: ela sai — e, se quem
       encerrou foi a clínica, entra um aviso ("o seu diário continua
       aqui"). Se foi a própria pessoa, em outro aparelho, sai calada;
     - ⚠️ A CÓPIA SEM `id` nasceu só no aparelho, de um código que ninguém
       conferiu. Ela sai, com um aviso honesto: o código não foi
       confirmado, e dá para digitar de novo. Ela nunca vira vínculo no
       servidor sem passar por /codigo e pelo consentimento.
   ============================================================ */
export type AvisoDoVinculo = 'clinica-encerrou' | 'nao-confirmado' | null;

export function seguirVinculoDoServidor(s: any, remoto: any | null): AvisoDoVinculo {
  const local = s.profile?.vinculo ?? null;
  const ativo = remoto && !remoto.encerrado_em ? remoto : null;

  if (ativo) {
    if (local?.id === ativo.id) {
      /* o mesmo vínculo: só a ficha pode ter mudado no portal */
      gravarVinculo(s, ativo);
      return null;
    }
    const semId = !!local && !local.id;
    gravarVinculo(s, ativo);
    return semId ? 'nao-confirmado' : null;
  }

  if (!local) return null;
  if (!local.id) {
    tirarVinculo(s);
    return 'nao-confirmado';
  }
  tirarVinculo(s);
  return remoto?.id === local.id && remoto.encerrado_por === 'clinica' ? 'clinica-encerrou' : null;
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

/** "2,3 km", "850 m", "1.4 mi" — só o número e a unidade */
export function distanciaCurta(S: { profile: { sistema?: 'metrico' | 'imperial' } }, km: number) {
  if (sistemaDe(S) === 'imperial') {
    const mi = km * 0.621371;
    return `${nf(mi, mi < 10 ? 1 : 0)} mi`;
  }
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  return `${nf(km, km < 10 ? 1 : 0)} km`;
}

/** "a 2,3 km", "a 850 m", "1.4 mi away" — a distância dentro de uma frase */
export const distanciaTxt = (S: { profile: { sistema?: 'metrico' | 'imperial' } }, km: number) =>
  T.rede.aDistancia(distanciaCurta(S, km));

/** "Pinheiros" e "7,8 km", separados: no cartão o bairro pode encurtar,
    e a distância não. Sem a localização da pessoa, só o bairro; e quem
    atende só por vídeo mostra a cidade — a teleconsulta não é assunto do
    cartão (ver /rede). */
export function ondeDoCartao(S: { profile: { sistema?: 'metrico' | 'imperial' } }, r: Resultado) {
  return {
    lugar: r.c.presencial ? (r.c.bairro ?? r.c.cidade) : r.c.cidade,
    distancia: r.km != null ? distanciaCurta(S, r.km) : null,
  };
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
    convenios: c.convenios,
    particular: c.particular,
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
