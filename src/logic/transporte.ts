/* ============================================================
   O TRANSPORTE — a sincronia falando com o Supabase de verdade

   É o outro lado de `Transporte` (logic/sincronia): as mesmas oito
   perguntas que o servidor de mentira da trava responde
   (scripts/duble/servidor.ts), agora feitas às tabelas de
   supabase/migrations. O motor não sabe qual dos dois está do outro lado.

   O QUE ESTE ARQUIVO TRADUZ, e mais nada:
     - os nomes das colunas (`apagado_em`, `versao_consentimento`…);
     - os instantes: o motor conta em milissegundos, o banco guarda
       `timestamptz`;
     - as falhas: cada erro vira uma das quatro que o motor entende.

   ⚠️ A DESCIDA É PAGINADA PELA CHAVE, e não pela posição. O servidor
   entrega no máximo mil linhas por pedido (`max_rows`), e uma linha
   mudada no meio da leitura vai para o fim da ordem: contar por posição
   pularia a linha que veio depois dela.
   ============================================================ */
import { isAuthRetryableFetchError, type SupabaseClient } from '@supabase/supabase-js';
import { FalhaDoTransporte, type Transporte } from './sincronia';
import { PARTES, type PerguntaDoServidor, type RegistroDoServidor } from './traducao';

const PAGINA = 1000;
const iso = (ms: number) => new Date(ms).toISOString();

/** A falha que o motor entende, a partir do que o cliente devolveu. */
export function falhaDe(status: number, erro: { code?: string; message?: string } | null): FalhaDoTransporte {
  const codigo = erro?.code ?? '';
  /* sem resposta nenhuma: a rede */
  if (status === 0 || /fetch|network/i.test(erro?.message ?? '')) return new FalhaDoTransporte('rede', erro?.message);
  /* o token venceu ou foi recusado */
  if (status === 401 || codigo === 'PGRST301' || codigo === 'PGRST303') return new FalhaDoTransporte('sessao', erro?.message);
  /* ⚠️ A CHAVE ESTRANGEIRA DO DONO: o token ainda vale (dura uma hora),
     mas a conta que ele diz não existe mais. */
  if (codigo === '23503') return new FalhaDoTransporte('conta-apagada', erro?.message);
  return new FalhaDoTransporte('recusado', `${codigo} ${erro?.message ?? ''}`.trim());
}

export function transporteDoSupabase(cliente: SupabaseClient): Transporte {
  /* O dono das linhas vai escrito em cada pedido: as regras do banco já
     filtram, mas a clínica também lê registros (fase 6), e o filtro
     explícito é o que usa o índice. */
  let dono: string | null = null;
  const quem = () => {
    if (!dono) throw new FalhaDoTransporte('sessao');
    return dono;
  };

  return {
    async usuario() {
      const { data, error } = await cliente.auth.getSession();
      if (error) {
        /* Renovar o token precisa de rede; sem ela, a sessão não caiu. */
        if (isAuthRetryableFetchError(error)) throw new FalhaDoTransporte('rede', error.message);
        dono = null;
        return null;
      }
      dono = data.session?.user.id ?? null;
      return dono;
    },

    async baixarPerfil() {
      /* ⚠️ A CONTA APAGADA EM OUTRO APARELHO. O token que este aparelho
         tem ainda vale (dura uma hora), e com ele as leituras só voltam
         vazias — o diário pareceria guardado. Perguntar quem é, uma vez
         por descida, é o que traz o sinal: o usuário não existe mais. */
      const quemE = await cliente.auth.getUser();
      if (quemE.error) {
        if (quemE.error.code === 'user_not_found') throw new FalhaDoTransporte('conta-apagada');
        if (isAuthRetryableFetchError(quemE.error)) throw new FalhaDoTransporte('rede', quemE.error.message);
        throw new FalhaDoTransporte('sessao', quemE.error.message);
      }
      const r = await cliente
        .from('perfis')
        .select(`${PARTES.join(',')},versao_consentimento,consentido_em,perguntas_para_uso,atualizado_em`)
        .eq('user_id', quem())
        .maybeSingle();
      if (r.error) throw falhaDe(r.status, r.error);
      const p = r.data as any;
      if (!p) return null;
      return {
        partes: Object.fromEntries(PARTES.map((parte) => [parte, p[parte] ?? {}])),
        consentimento: p.versao_consentimento != null && p.consentido_em
          ? { versao: p.versao_consentimento, em: Date.parse(p.consentido_em) }
          : null,
        perguntasParaUso: p.perguntas_para_uso === true,
        atualizadoEm: p.atualizado_em,
      };
    },

    async baixarRegistros(desde) {
      const u = quem();
      const todas: RegistroDoServidor[] = [];
      let depoisDe: { em: string; id: string } | null = null;
      for (;;) {
        let q = cliente
          .from('registros')
          .select('id,tipo,quando,dados,atualizado_em,apagado_em')
          .eq('user_id', u)
          .order('atualizado_em', { ascending: true })
          .order('id', { ascending: true })
          .limit(PAGINA);
        if (depoisDe) {
          q = q.or(`atualizado_em.gt."${depoisDe.em}",and(atualizado_em.eq."${depoisDe.em}",id.gt.${depoisDe.id})`);
        } else if (desde) {
          q = q.gt('atualizado_em', desde);
        }
        const r = await q;
        if (r.error) throw falhaDe(r.status, r.error);
        const linhas = (r.data ?? []) as any[];
        for (const l of linhas) {
          todas.push({
            id: l.id, tipo: l.tipo, quando: l.quando === null ? null : Date.parse(l.quando),
            dados: l.dados ?? {}, atualizadoEm: l.atualizado_em, apagadoEm: l.apagado_em,
          });
        }
        if (linhas.length < PAGINA) return todas;
        const ultima = linhas[linhas.length - 1];
        depoisDe = { em: ultima.atualizado_em, id: ultima.id };
      }
    },

    async baixarPerguntas(desde) {
      const u = quem();
      const base = cliente.from('perguntas').select('id,quando,texto,origem,criado_em').eq('user_id', u);
      const r = desde
        ? await base.gt('criado_em', desde).order('criado_em', { ascending: true }).limit(PAGINA)
        : await base.order('criado_em', { ascending: false }).limit(12);
      if (r.error) throw falhaDe(r.status, r.error);
      const linhas = ((r.data ?? []) as any[]).map((p): PerguntaDoServidor => ({
        id: p.id, quando: Date.parse(p.quando), texto: p.texto, origem: p.origem, criadoEm: p.criado_em,
      }));
      return desde ? linhas : linhas.reverse();
    },

    async subirPerfil(p) {
      const linha: Record<string, unknown> = { user_id: quem(), ...(p.partes ?? {}) };
      if (p.consentimento) {
        linha.versao_consentimento = p.consentimento.versao;
        linha.consentido_em = iso(p.consentimento.em);
      }
      if (p.perguntasParaUso !== undefined) linha.perguntas_para_uso = p.perguntasParaUso;
      const r = await cliente.from('perfis').upsert(linha, { onConflict: 'user_id' });
      if (r.error) throw falhaDe(r.status, r.error);
    },

    async subirRegistros(linhas) {
      const u = quem();
      const r = await cliente.from('registros').upsert(
        linhas.map((l) => ({
          id: l.id, user_id: u, tipo: l.tipo,
          quando: l.quando === null ? null : iso(l.quando),
          dados: l.apagado ? {} : l.dados,
          /* o servidor troca pela hora dele — e mantém a primeira, se já
             estava apagado */
          apagado_em: l.apagado ? new Date().toISOString() : null,
        })),
        { onConflict: 'id' },
      );
      if (r.error) throw falhaDe(r.status, r.error);
    },

    async subirPerguntas(linhas) {
      const u = quem();
      /* ⚠️ SÓ AS COLUNAS QUE A PERMISSÃO DEIXA ESCREVER, e o `insert` que
         ignora a repetida: uma pergunta nunca muda depois de subir. */
      const r = await cliente.from('perguntas').upsert(
        linhas.map((p) => ({ id: p.id, user_id: u, quando: iso(p.quando), texto: p.texto, origem: p.origem })),
        { onConflict: 'id', ignoreDuplicates: true },
      );
      if (r.error) throw falhaDe(r.status, r.error);
    },

    async apagarPerguntas() {
      const r = await cliente.from('perguntas').delete().eq('user_id', quem());
      if (r.error) throw falhaDe(r.status, r.error);
    },
  };
}
