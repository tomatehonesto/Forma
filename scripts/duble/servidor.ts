/* ============================================================
   O SERVIDOR DE MENTIRA — o banco do Supabase, em memória, para a trava
   da sincronia (scripts/sincronia.ts)

   Imita o que as regras de supabase/migrations fazem com as três tabelas
   do diário, e só isso:

     - o relógio é o do servidor: `atualizado_em` e `criado_em` são
       carimbados aqui, a cada escrita;
     - apagar um registro é marcá-lo, e o conteúdo sai junto;
     - cada um só escreve e lê o que é seu, e uma linha de outra conta não
       é sobrescrita;
     - a versão do consentimento não diminui;
     - pergunta só entra com a escolha ligada no perfil, e a repetida é
       ignorada.

   E sabe falhar do jeito que a rede falha: sem conexão, no meio de um
   lote, e com uma transação que demora para aparecer.

   Nada aqui roda no aplicativo.
   ============================================================ */
import {
  FalhaDoTransporte, type PerfilParaSubir, type RegistroParaSubir, type Transporte,
} from '../../src/logic/sincronia';
import {
  tamanhoNoBanco,
  type Consentimento, type Parte, type Pergunta, type PerguntaDoServidor, type PerfilDoServidor, type RegistroDoServidor,
} from '../../src/logic/traducao';

type Linha = {
  id: string;
  usuario: string;
  tipo: string;
  quando: number | null;
  dados: Record<string, unknown>;
  atualizadoEm: number;
  apagadoEm: number | null;
  /** a transação ainda não terminou: quem desce não vê */
  escondida: boolean;
};

type Perfil = {
  partes: Partial<Record<Parte, Record<string, unknown>>>;
  consentimento: Consentimento | null;
  perguntasParaUso: boolean;
  atualizadoEm: number;
};

type LinhaDePergunta = Pergunta & { usuario: string; criadoEm: number };

const iso = (ms: number) => new Date(ms).toISOString();
const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x));

export class ServidorFalso {
  relogio = Date.parse('2026-09-25T12:00:00.000Z');
  registros = new Map<string, Linha>();
  perfis = new Map<string, Perfil>();
  perguntas = new Map<string, LinhaDePergunta>();
  contas = new Set<string>();

  /** sem conexão: toda chamada falha como a rede falha */
  semRede = false;
  /** o enésimo lote de registros daqui em diante é gravado inteiro, e a
      resposta se perde no caminho — o aparelho não fica sabendo */
  perderRespostaDoLote: number | null = null;
  /** o próximo lote demora: é carimbado agora, e só aparece em `terminarTransacoes` */
  demorarProximoLote = false;
  /** quantas perguntas tentaram subir, aceitas ou não */
  perguntasTentadas = 0;
  /** quantas chamadas de subida chegaram */
  subidas = 0;

  criarConta(id: string) {
    this.contas.add(id);
  }

  /** O que `auth.admin.deleteUser` faz: a conta e, em cascata, tudo dela. */
  apagarConta(id: string) {
    this.contas.delete(id);
    for (const [k, l] of this.registros) if (l.usuario === id) this.registros.delete(k);
    for (const [k, p] of this.perguntas) if (p.usuario === id) this.perguntas.delete(k);
    this.perfis.delete(id);
  }

  terminarTransacoes() {
    for (const l of this.registros.values()) l.escondida = false;
  }

  private agora() {
    this.relogio += 1;
    return this.relogio;
  }

  /** As linhas de uma conta, como o banco as tem. */
  linhasDe(usuario: string) {
    return [...this.registros.values()].filter((l) => l.usuario === usuario);
  }
  perguntasDe(usuario: string) {
    return [...this.perguntas.values()].filter((p) => p.usuario === usuario);
  }

  /** O transporte de um aparelho, com a sessão que ele tiver no momento. */
  transporte(sessao: () => string | null): Transporte {
    const s = this;
    const entrar = () => {
      if (s.semRede) throw new FalhaDoTransporte('rede');
      const u = sessao();
      if (!u) throw new FalhaDoTransporte('sessao');
      if (!s.contas.has(u)) throw new FalhaDoTransporte('conta-apagada');
      return u;
    };
    return {
      async usuario() {
        if (s.semRede) throw new FalhaDoTransporte('rede');
        return sessao();
      },

      async baixarPerfil(): Promise<PerfilDoServidor | null> {
        const u = entrar();
        const p = s.perfis.get(u);
        return p ? { ...copia({ partes: p.partes, consentimento: p.consentimento }), perguntasParaUso: p.perguntasParaUso, atualizadoEm: iso(p.atualizadoEm) } : null;
      },

      async baixarRegistros(desde) {
        const u = entrar();
        const limite = desde === null ? -Infinity : Date.parse(desde);
        return s.linhasDe(u)
          .filter((l) => !l.escondida && l.atualizadoEm > limite)
          .sort((a, b) => a.atualizadoEm - b.atualizadoEm)
          .map((l): RegistroDoServidor => ({
            id: l.id, tipo: l.tipo as any, quando: l.quando, dados: copia(l.dados),
            atualizadoEm: iso(l.atualizadoEm), apagadoEm: l.apagadoEm === null ? null : iso(l.apagadoEm),
          }));
      },

      async baixarPerguntas(desde) {
        const u = entrar();
        const minhas = s.perguntasDe(u).sort((a, b) => a.criadoEm - b.criadoEm);
        const escolhidas = desde === null ? minhas.slice(-12) : minhas.filter((p) => p.criadoEm > Date.parse(desde));
        return escolhidas.map((p): PerguntaDoServidor => ({
          id: p.id, quando: p.quando, texto: p.texto, origem: p.origem, criadoEm: iso(p.criadoEm),
        }));
      },

      async subirPerfil(p: PerfilParaSubir) {
        const u = entrar();
        s.subidas += 1;
        const atual: Perfil = s.perfis.get(u) ?? { partes: {}, consentimento: null, perguntasParaUso: false, atualizadoEm: 0 };
        if (p.consentimento && atual.consentimento && p.consentimento.versao < atual.consentimento.versao) {
          throw new FalhaDoTransporte('recusado', 'a versão do consentimento não diminui');
        }
        const novo: Perfil = copia(atual);
        for (const [parte, valor] of Object.entries(p.partes ?? {})) novo.partes[parte as Parte] = copia(valor);
        if (p.consentimento) novo.consentimento = copia(p.consentimento);
        if (p.perguntasParaUso !== undefined) novo.perguntasParaUso = p.perguntasParaUso;
        novo.atualizadoEm = s.agora();
        s.perfis.set(u, novo);
      },

      async subirRegistros(linhas: RegistroParaSubir[]) {
        const u = entrar();
        s.subidas += 1;
        if (new Set(linhas.map((l) => l.id)).size !== linhas.length) {
          throw new FalhaDoTransporte('recusado', 'o mesmo id duas vezes no lote');
        }
        /* O lote é uma transação só: entra inteiro ou não entra. */
        for (const l of linhas) {
          const antes = s.registros.get(l.id);
          if (antes && antes.usuario !== u) throw new FalhaDoTransporte('recusado', 'a linha é de outra conta');
          if (tamanhoNoBanco(l.dados) > 65_536) throw new FalhaDoTransporte('recusado', 'registros_dados_cabem');
        }
        const escondida = s.demorarProximoLote;
        s.demorarProximoLote = false;
        for (const l of linhas) {
          const antes = s.registros.get(l.id);
          const agora = s.agora();
          s.registros.set(l.id, {
            id: l.id, usuario: u, tipo: l.tipo, quando: l.quando,
            dados: l.apagado ? {} : copia(l.dados),
            atualizadoEm: agora,
            apagadoEm: l.apagado ? antes?.apagadoEm ?? agora : null,
            escondida,
          });
        }
        if (s.perderRespostaDoLote !== null) {
          s.perderRespostaDoLote -= 1;
          if (s.perderRespostaDoLote === 0) {
            s.perderRespostaDoLote = null;
            throw new FalhaDoTransporte('rede');
          }
        }
      },

      async subirPerguntas(linhas: Pergunta[]) {
        const u = entrar();
        s.subidas += 1;
        s.perguntasTentadas += linhas.length;
        if (!s.perfis.get(u)?.perguntasParaUso) throw new FalhaDoTransporte('recusado', 'a escolha está desligada');
        for (const p of linhas) {
          if (s.perguntas.has(p.id)) continue;
          s.perguntas.set(p.id, { ...copia(p), usuario: u, criadoEm: s.agora() });
        }
      },

      async apagarPerguntas() {
        const u = entrar();
        s.subidas += 1;
        for (const [k, p] of s.perguntas) if (p.usuario === u) s.perguntas.delete(k);
      },
    };
  }
}
