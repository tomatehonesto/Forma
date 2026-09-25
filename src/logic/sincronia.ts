/* ============================================================
   A SINCRONIA — o diário do aparelho e o do servidor

   O aplicativo registra sem esperar ninguém: tudo é gravado no aparelho,
   e esta peça leva ao servidor o que mudou e traz de lá o que mudou em
   outro aparelho. Nenhuma tela sabe que ela existe.

   ⚠️ NINGUÉM A LIGA AINDA. É a fase 3 do plano
   (docs/superpowers/plans/2026-09-25-supabase-ponte-plano.md): o motor
   está inteiro, com o transporte, o store e o armazenamento recebidos de
   fora, e é assim que a trava (scripts/sincronia.ts) o prova contra um
   servidor de mentira. A fase 4 o liga, quando existir conta.

   A BASE. A sincronia guarda como o servidor estava da última vez que os
   dois conversaram (`norte.sincronia.v1`): um resumo de cada linha e de
   cada parte do perfil, as perguntas que já subiram e até onde já
   desceu. O que mudou é o que difere da base — e isso é a fila. Ela não
   é guardada, é calculada: fechar o aplicativo no meio não perde nada, e
   reenviar não duplica, porque cada linha sobe pelo seu id. A base só
   avança quando o servidor confirma.

   ⚠️ A BASE É DE UM DIÁRIO SÓ: o do dono (`S.conta`), na identidade que
   ele tem neste aparelho (`S.diario`). Com qualquer um dos dois
   diferente, ela é jogada fora e a conversa recomeça pela descida. Sem
   isso, um diário vazio comparado com a base do anterior viraria uma
   lista de apagados — e subiria apagando a conta de antes.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PARTES, canonico, ida, misturar, tamanhoNoBanco,
  type Consentimento, type Parte, type Pergunta, type PerguntaDoServidor, type PerfilDoServidor,
  type Registro, type RegistroDoServidor, type TipoDeRegistro,
} from './traducao';

export const CHAVE_DA_BASE = 'norte.sincronia.v1';
/** As linhas sobem em lotes deste tamanho. */
export const LOTE = 500;
/** ⚠️ A DESCIDA VOLTA UM MINUTO ANTES DO CURSOR. Uma transação que
    demorou pode ter carimbado a linha antes do cursor e só aparecido
    depois dele; descer de novo o que já desceu não muda nada. */
export const FOLGA_DO_CURSOR = 60_000;
/** Mudanças em sequência se juntam: sobe dois segundos depois da última. */
export const JUNTAR = 2_000;
/** Os tetos das regras do banco (supabase/migrations). */
export const TETO_DOS_DADOS = 65_536;
export const TETO_DA_PARTE = 262_144;

/** A espera antes de tentar de novo, depois de `n` falhas seguidas:
    2 s, 4 s, 8 s… até um minuto. */
export const esperaDepoisDe = (n: number) => Math.min(60_000, 2_000 * 2 ** Math.max(0, n - 1));

/* ============================================================
   O QUE A SINCRONIA RECEBE DE FORA
   ============================================================ */

export type Falha = 'rede' | 'sessao' | 'conta-apagada' | 'recusado';

/** O transporte avisa por aqui o que deu errado: sem rede, sessão
    recusada, conta que não existe mais, ou o banco recusou a escrita. */
export class FalhaDoTransporte extends Error {
  constructor(readonly falha: Falha, mensagem?: string) {
    super(mensagem ?? falha);
  }
}

/** Uma linha que sobe para `registros`: viva, ou marcada como apagada. */
export type RegistroParaSubir = Registro & { apagado: boolean };

/** O que sobe para `perfis`: só o que mudou. */
export type PerfilParaSubir = {
  partes?: Partial<Record<Parte, Record<string, unknown>>>;
  consentimento?: Consentimento;
  perguntasParaUso?: boolean;
};

export type Transporte = {
  /** A conta da sessão, ou nulo sem sessão. */
  usuario(): Promise<string | null>;
  baixarPerfil(): Promise<PerfilDoServidor | null>;
  /** As linhas que mudaram depois do instante (ISO) — todas, sem ele. */
  baixarRegistros(desde: string | null): Promise<RegistroDoServidor[]>;
  /** As que chegaram depois do instante — sem ele, as 12 últimas. */
  baixarPerguntas(desde: string | null): Promise<PerguntaDoServidor[]>;
  subirPerfil(p: PerfilParaSubir): Promise<void>;
  /** `upsert` pelo id. */
  subirRegistros(linhas: RegistroParaSubir[]): Promise<void>;
  /** `insert` que ignora as que já estão lá. */
  subirPerguntas(linhas: Pergunta[]): Promise<void>;
  /** Todas as perguntas da pessoa. */
  apagarPerguntas(): Promise<void>;
};

/** O store: ler o estado, mudá-lo (e gravar), e saber quando ele muda. */
export type Loja = {
  ler(): any;
  mudar(mut: (s: any) => void): void;
  assinar(ouvinte: () => void): () => void;
};

export type Guarda = {
  getItem(chave: string): Promise<string | null>;
  setItem(chave: string, valor: string): Promise<void>;
  removeItem(chave: string): Promise<void>;
};

export type Relogio = { depois(ms: number, fn: () => void): unknown; cancelar(id: unknown): void };

const RELOGIO: Relogio = {
  depois: (ms, fn) => setTimeout(fn, ms),
  cancelar: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
};

/** O que a tela lê. */
export type EstadoDaSincronia =
  /** nada a fazer: o exemplo, a prévia do Perfil, ou o diário sem dono */
  | 'desligada'
  /** o diário tem jeito de ser de alguém, e ainda não tem conta */
  | 'sem-conta'
  | 'guardado'
  | 'guardando'
  | 'sem-internet'
  /** a sessão caiu ou foi recusada — nada se apaga por isso */
  | 'entrar-de-novo'
  /** a sessão é de outra conta que não a dona deste diário */
  | 'outra-conta'
  | 'conta-apagada';

/* ============================================================
   A BASE
   ============================================================ */
type Base = {
  versao: 1;
  dono: string;
  diario: string;
  /** a primeira descida deste diário já terminou */
  iniciada: boolean;
  /** até onde `registros` já desceu (o `atualizado_em` mais novo visto) */
  cursor: string | null;
  /** até onde `perguntas` já desceu (o `criado_em` mais novo visto) */
  cursorPerguntas: string | null;
  /** id → o tipo e o resumo da linha como o servidor a tem */
  registros: Record<string, string>;
  partes: Partial<Record<Parte, string>>;
  consentimento: Consentimento | null;
  /** a escolha das perguntas como o servidor a tem */
  escolha: boolean;
  /** a escolha foi desligada, e as perguntas do servidor ainda não saíram */
  apagarPerguntas: boolean;
  /** as perguntas da janela que o servidor já tem */
  perguntas: string[];
};

const baseNova = (dono: string, diario: string): Base => ({
  versao: 1, dono, diario, iniciada: false, cursor: null, cursorPerguntas: null,
  registros: {}, partes: {}, consentimento: null, escolha: false, apagarPerguntas: false, perguntas: [],
});

/* Um resumo do conteúdo, que não depende da ordem das chaves. Duas
   passadas com sementes diferentes: uma mudança que desse o mesmo resumo
   não subiria. */
function cyrb53(texto: string, semente: number) {
  let h1 = 0xdeadbeef ^ semente;
  let h2 = 0x41c6ce57 ^ semente;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
export const resumo = (v: unknown) => {
  const texto = canonico(v);
  return `${cyrb53(texto, 1).toString(36)}.${cyrb53(texto, 2).toString(36)}`;
};
export const marcaDoRegistro = (r: Registro) => `${r.tipo}|${resumo({ q: r.quando, d: r.dados })}`;
const tipoDaMarca = (m: string) => m.slice(0, m.indexOf('|')) as TipoDeRegistro;

const comFolga = (cursor: string | null) =>
  cursor ? new Date(Date.parse(cursor) - FOLGA_DO_CURSOR).toISOString() : null;

const maisRecente = (atual: string | null, vistos: string[]) =>
  vistos.reduce<string | null>((a, b) => (a === null || Date.parse(b) > Date.parse(a) ? b : a), atual);

/* ============================================================
   O QUE MUDOU — a fila, calculada
   ============================================================ */
type Pendencias = {
  ida: ReturnType<typeof ida>;
  /** o que sobe agora */
  registros: RegistroParaSubir[];
  /** o que mudou aqui e o servidor ainda não tem: a descida não toca */
  intocaveis: Set<string>;
  partes: Parte[];
  partesIntocaveis: Set<Parte>;
  consentimento: Consentimento | null;
  /** a escolha a subir, ou nulo */
  escolha: boolean | null;
  perguntas: Pergunta[];
  total: number;
};

function calcular(S: any, base: Base): Pendencias {
  const traduzido = ida(S);
  const { perfil } = traduzido;
  const registros: RegistroParaSubir[] = [];
  const intocaveis = new Set<string>();
  const locais = new Set<string>();
  /* ⚠️ MAIOR QUE O TETO DO BANCO NÃO SOBE, e continua aqui: a descida não
     pode trocá-lo pela versão antiga do servidor. E ele conta no que
     falta — "tudo guardado" não pode ser dito com uma linha de fora. */
  let grandes = 0;

  for (const r of traduzido.registros) {
    locais.add(r.id);
    if (base.registros[r.id] === marcaDoRegistro(r)) continue;
    intocaveis.add(r.id);
    if (tamanhoNoBanco(r.dados) <= TETO_DOS_DADOS) registros.push({ ...r, apagado: false });
    else grandes += 1;
  }
  /* O que o servidor tem e o aparelho não tem mais: apagado aqui. */
  for (const [id, marca] of Object.entries(base.registros)) {
    if (locais.has(id)) continue;
    intocaveis.add(id);
    registros.push({ id, tipo: tipoDaMarca(marca), quando: null, dados: {}, apagado: true });
  }

  /* ⚠️ ANTES DA PRIMEIRA DESCIDA, NENHUMA PARTE É MUDANÇA. Num aparelho
     que acabou de entrar numa conta, o perfil do aparelho é o do estado
     vazio — e subi-lo apagaria o perfil de verdade. Quem vale, na
     primeira vez, é o servidor; o que ele não tiver sobe depois. */
  const partesIntocaveis = new Set<Parte>(
    base.iniciada ? PARTES.filter((p) => resumo(perfil.partes[p]) !== base.partes[p]) : [],
  );
  const partes = [...partesIntocaveis].filter((p) => tamanhoNoBanco(perfil.partes[p]) <= TETO_DA_PARTE);
  grandes += partesIntocaveis.size - partes.length;

  const consentimento = base.iniciada && perfil.consentimento
    && (!base.consentimento || perfil.consentimento.versao > base.consentimento.versao)
    ? perfil.consentimento
    : null;
  const escolha = base.iniciada && perfil.perguntasParaUso !== base.escolha ? perfil.perguntasParaUso : null;

  /* ⚠️ SEM A ESCOLHA, NENHUMA PERGUNTA SAI DO APARELHO. E não existe
     "sumiu" aqui: sair da janela das 12 não é apagar. */
  const conhecidas = new Set(base.perguntas);
  const perguntas = perfil.perguntasParaUso ? traduzido.perguntas.filter((p) => !conhecidas.has(p.id)) : [];

  const total = registros.length + partes.length + (consentimento ? 1 : 0) + (escolha === null ? 0 : 1)
    + perguntas.length + (base.apagarPerguntas ? 1 : 0) + grandes;
  return { ida: traduzido, registros, intocaveis, partes, partesIntocaveis, consentimento, escolha, perguntas, total };
}

/** A base só guarda as perguntas que ainda estão na janela: as que
    saíram dela nunca mais são conferidas. */
function podar(base: Base, S: any) {
  const naJanela = new Set(((Array.isArray(S?.asked) ? S.asked : []) as any[]).map((p) => p?.rid));
  base.perguntas = [...new Set(base.perguntas)].filter((id) => naJanela.has(id));
}

/* ============================================================
   O MOTOR
   ============================================================ */
export type Sincronia = {
  /** Uma volta inteira: desce (quando pedido, ou na primeira vez) e sobe. */
  sincronizar(opcoes?: { baixar?: boolean }): Promise<void>;
  /** Assina o store: junta as mudanças, sobe, e tenta de novo quando falha. */
  iniciar(): void;
  /** Para, e espera a volta que estiver no meio. */
  parar(): Promise<void>;
  /** A volta ao aplicativo: desce o que mudou em outro aparelho. */
  voltouAoAplicativo(): void;
  /** Troca o diário: para, apaga a base, muda o estado — nessa ordem. */
  trocarDeDiario(mudar: () => void | Promise<void>): Promise<void>;
  estado(): EstadoDaSincronia;
  aoMudar(ouvinte: (e: EstadoDaSincronia) => void): () => void;
  /** Quanto falta subir — para a trava e para a tela. */
  pendentes(): Promise<number>;
};

type Dependencias = {
  transporte: Transporte;
  loja: Loja;
  guarda: Guarda;
  /** a prévia do Perfil está no ar (ver logic/modo) */
  fingindo: () => boolean;
  relogio?: Relogio;
};

let ligada: Sincronia | null = null;

export function criarSincronia({ transporte, loja, guarda, fingindo, relogio = RELOGIO }: Dependencias): Sincronia {
  let atual: EstadoDaSincronia = 'desligada';
  const ouvintes = new Set<(e: EstadoDaSincronia) => void>();
  const mudarEstado = (e: EstadoDaSincronia) => {
    if (e === atual) return;
    atual = e;
    for (const o of ouvintes) o(e);
  };

  let corrente: Promise<void> = Promise.resolve();
  let parada = false;
  let rodando = false;
  let desassinar: (() => void) | null = null;
  let timer: unknown = null;
  let descerNaProxima = false;
  let falhas = 0;

  /** O dono e o diário que a sincronia pode olhar agora — ou nulo, e por quê. */
  function quem(S: any): { dono: string; diario: string } | EstadoDaSincronia {
    /* ⚠️ COM A PRÉVIA NO AR, ELA NÃO OLHA. O estado servido é a máscara,
       sem a clínica — compará-lo com a base mandaria apagar a clínica de
       verdade. */
    if (fingindo()) return 'desligada';
    /* ⚠️ E O EXEMPLO NUNCA SOBE: a Mariana é inventada. */
    if (!S || S.semente) return 'desligada';
    if (!S.conta?.id) return S.onboardDone ? 'sem-conta' : 'desligada';
    if (typeof S.diario !== 'string' || !S.diario) return 'desligada';
    return { dono: S.conta.id, diario: S.diario };
  }
  const mesmoDiario = (S: any, dono: string, diario: string) => {
    const q = quem(S);
    return typeof q === 'object' && q.dono === dono && q.diario === diario;
  };

  async function lerBase(dono: string, diario: string): Promise<Base> {
    try {
      const b = JSON.parse((await guarda.getItem(CHAVE_DA_BASE)) ?? 'null') as Base | null;
      if (b && b.versao === 1 && b.dono === dono && b.diario === diario) return b;
    } catch {}
    return baseNova(dono, diario);
  }
  const gravarBase = (b: Base) => guarda.setItem(CHAVE_DA_BASE, JSON.stringify(b));

  /* ---------------- descer ---------------- */
  async function descer(base: Base, dono: string, diario: string) {
    const perfil = await transporte.baixarPerfil();
    const registros = await transporte.baixarRegistros(comFolga(base.cursor));
    const perguntas = await transporte.baixarPerguntas(base.iniciada ? comFolga(base.cursorPerguntas) : null);
    if (parada) return;

    /* O estado pode ter mudado enquanto a rede respondia. */
    const S = loja.ler();
    if (!mesmoDiario(S, dono, diario)) return;
    const p = calcular(S, base);

    /* O que desceu igual ao que está aqui já chegou lá: a resposta da
       subida é que se perdeu no caminho. */
    const locais = new Map(p.ida.registros.map((r) => [r.id, marcaDoRegistro(r)]));
    for (const r of registros) {
      if (!p.intocaveis.has(r.id)) continue;
      const aqui = locais.get(r.id);
      if (r.apagadoEm ? aqui === undefined : aqui === marcaDoRegistro(r)) p.intocaveis.delete(r.id);
    }

    let ignorados = new Set<string>();
    loja.mudar((s) => {
      ignorados = misturar(s, { registros, perguntas, perfil }, {
        registro: (id) => p.intocaveis.has(id),
        parte: (parte) => p.partesIntocaveis.has(parte),
        escolha: p.escolha !== null,
      }).ignorados;
    });

    /* A base aprende o que o servidor tem — menos o que ficou de fora da
       mistura: uma linha que o aparelho não soube pôr no estado, se
       entrasse na base, voltaria como apagada. */
    for (const r of registros) {
      if (p.intocaveis.has(r.id) || ignorados.has(r.id)) continue;
      if (r.apagadoEm) delete base.registros[r.id];
      else base.registros[r.id] = marcaDoRegistro(r);
    }
    if (perfil) {
      for (const parte of PARTES) {
        const valor = perfil.partes[parte];
        if (valor && Object.keys(valor).length && !p.partesIntocaveis.has(parte)) base.partes[parte] = resumo(valor);
      }
      if (perfil.consentimento && (!base.consentimento || perfil.consentimento.versao >= base.consentimento.versao)) {
        base.consentimento = perfil.consentimento;
      }
      if (p.escolha === null) base.escolha = perfil.perguntasParaUso;
    }
    base.perguntas.push(...perguntas.map((q) => q.id));
    base.cursor = maisRecente(base.cursor, registros.map((r) => r.atualizadoEm));
    base.cursorPerguntas = maisRecente(base.cursorPerguntas, perguntas.map((q) => q.criadoEm));
    base.iniciada = true;
    podar(base, loja.ler());
    await gravarBase(base);
  }

  /* ---------------- subir ---------------- */
  async function subir(base: Base, dono: string, diario: string) {
    /* Algumas voltas: o que mudar enquanto um lote sobe entra na seguinte. */
    for (let volta = 0; volta < 4; volta++) {
      const S = loja.ler();
      if (parada || !mesmoDiario(S, dono, diario)) return;
      const p = calcular(S, base);
      let enviou = false;

      /* 1. O perfil vem antes de tudo: a regra do banco para as
            perguntas lê a escolha nele. */
      const perfil: PerfilParaSubir = {};
      if (p.partes.length) perfil.partes = Object.fromEntries(p.partes.map((x) => [x, p.ida.perfil.partes[x]]));
      if (p.consentimento) perfil.consentimento = p.consentimento;
      if (p.escolha !== null) perfil.perguntasParaUso = p.escolha;
      if (Object.keys(perfil).length) {
        enviou = true;
        await transporte.subirPerfil(perfil);
        for (const x of p.partes) base.partes[x] = resumo(p.ida.perfil.partes[x]);
        if (p.consentimento) base.consentimento = p.consentimento;
        if (p.escolha !== null) {
          /* ⚠️ DESLIGAR A ESCOLHA APAGA AS QUE SUBIRAM, e a escolha
             desligada no servidor vem antes: com ela, a regra do banco já
             recusa pergunta nova de outro aparelho. */
          if (base.escolha && !p.escolha) base.apagarPerguntas = true;
          base.escolha = p.escolha;
        }
        await gravarBase(base);
      }

      if (base.apagarPerguntas) {
        enviou = true;
        await transporte.apagarPerguntas();
        base.apagarPerguntas = false;
        base.perguntas = [];
        await gravarBase(base);
      }

      /* 2. As linhas, em lotes. A base avança a cada lote confirmado. */
      for (let i = 0; i < p.registros.length; i += LOTE) {
        if (parada) return;
        const lote = p.registros.slice(i, i + LOTE);
        enviou = true;
        await transporte.subirRegistros(lote);
        for (const r of lote) {
          if (r.apagado) delete base.registros[r.id];
          else base.registros[r.id] = marcaDoRegistro(r);
        }
        await gravarBase(base);
      }

      /* 3. As perguntas, só com a escolha ligada e confirmada lá. */
      if (base.escolha && p.perguntas.length) {
        enviou = true;
        await transporte.subirPerguntas(p.perguntas);
        base.perguntas.push(...p.perguntas.map((q) => q.id));
        podar(base, loja.ler());
        await gravarBase(base);
      }

      if (!enviou) return;
    }
  }

  /* ---------------- a volta inteira ---------------- */
  async function volta({ baixar = false }: { baixar?: boolean }) {
    const S = loja.ler();
    const q = quem(S);
    if (typeof q !== 'object') {
      mudarEstado(q);
      return;
    }
    const usuario = await transporte.usuario();
    if (!usuario) {
      mudarEstado('entrar-de-novo');
      return;
    }
    /* ⚠️ O DIÁRIO COM DONO NÃO SOBE PARA OUTRA CONTA. */
    if (usuario !== q.dono) {
      mudarEstado('outra-conta');
      return;
    }
    const base = await lerBase(q.dono, q.diario);
    mudarEstado('guardando');
    if (baixar || !base.iniciada) await descer(base, q.dono, q.diario);
    /* Sem a primeira descida, nada sobe: o servidor ainda não disse o que
       tem. */
    if (!base.iniciada) return;
    await subir(base, q.dono, q.diario);
    const fim = loja.ler();
    if (parada || !mesmoDiario(fim, q.dono, q.diario)) return;
    mudarEstado(calcular(fim, base).total ? 'guardando' : 'guardado');
  }

  async function sincronizarAgora(opcoes: { baixar?: boolean }) {
    try {
      await volta(opcoes);
      falhas = 0;
    } catch (e) {
      const falha = e instanceof FalhaDoTransporte ? e.falha : 'recusado';
      if (falha === 'sessao') return mudarEstado('entrar-de-novo');
      if (falha === 'conta-apagada') return mudarEstado('conta-apagada');
      mudarEstado(falha === 'rede' ? 'sem-internet' : 'guardando');
      /* Um erro que não veio do transporte é defeito daqui, e aparece. */
      if (!(e instanceof FalhaDoTransporte)) console.warn('[sincronia]', e);
      falhas += 1;
      /* ⚠️ A RECUSA DO BANCO TENTA DE NOVO DESCENDO PRIMEIRO. A causa mais
         provável é o servidor saber algo que o aparelho não sabe — a
         escolha das perguntas desligada em outro aparelho —, e subir de
         novo, sem descer, seria recusado de novo. */
      if (rodando) agendar(esperaDepoisDe(falhas), !!opcoes.baixar || falha === 'recusado');
    }
  }

  function sincronizar(opcoes: { baixar?: boolean } = {}) {
    const esta = corrente.then(() => (parada ? undefined : sincronizarAgora(opcoes)));
    corrente = esta.catch(() => {});
    return esta;
  }

  function agendar(ms: number, baixar: boolean) {
    descerNaProxima = descerNaProxima || baixar;
    if (timer !== null) relogio.cancelar(timer);
    timer = relogio.depois(ms, () => {
      timer = null;
      const b = descerNaProxima;
      descerNaProxima = false;
      void sincronizar({ baixar: b });
    });
  }

  async function parar() {
    parada = true;
    rodando = false;
    desassinar?.();
    desassinar = null;
    if (timer !== null) relogio.cancelar(timer);
    timer = null;
    if (ligada === api) ligada = null;
    await corrente;
  }

  const api: Sincronia = {
    sincronizar,
    iniciar() {
      parada = false;
      rodando = true;
      ligada = api;
      desassinar?.();
      desassinar = loja.assinar(() => agendar(JUNTAR, false));
      agendar(0, true);
    },
    parar,
    voltouAoAplicativo: () => {
      if (rodando) agendar(0, true);
    },
    async trocarDeDiario(mudar) {
      const estavaRodando = rodando;
      await parar();
      await guarda.removeItem(CHAVE_DA_BASE);
      await mudar();
      parada = false;
      if (estavaRodando) api.iniciar();
    },
    estado: () => atual,
    aoMudar(ouvinte) {
      ouvintes.add(ouvinte);
      return () => ouvintes.delete(ouvinte);
    },
    async pendentes() {
      const S = loja.ler();
      const q = quem(S);
      if (typeof q !== 'object') return 0;
      return calcular(S, await lerBase(q.dono, q.diario)).total;
    },
  };
  return api;
}

/** ⚠️ TROCAR DE DIÁRIO COMEÇA AQUI: para a sincronia que estiver ligada
    e apaga a base, antes de o estado mudar. É o que "Apagar meus dados",
    reconstruir a semente, "Sair da conta" e "Já tenho conta" chamam. */
export async function esquecerSincronia(guarda: Guarda = AsyncStorage) {
  await ligada?.parar();
  await guarda.removeItem(CHAVE_DA_BASE);
}
