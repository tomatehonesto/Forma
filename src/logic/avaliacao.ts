import { nuvem } from './nuvem';
import { localAtual } from './local';
import { paisLidoDoAparelho } from './pais';
import { lerConversas } from './conversa';

/* ============================================================
   O 👍 E O 👎 DA MORPHI INTELLIGENCE

   Decidido pelo dono em 01/10/2026. A conversa mora no aparelho e nós não
   a lemos; a avaliação é o único caminho para ela aprender com o uso.

   ⚠️ O 👍 MANDA SÓ A NOTA. O 👎 abre uma folha (app/avaliar-resposta)
   com o motivo e um aviso do que sai, e só manda a pergunta e a resposta
   quando a pessoa confirma. O resumo da jornada não vai nunca. É um
   consentimento por envio (LGPD, art. 11, I), dito na Política (seções
   4, 6 e 10).

   ⚠️ A NOTA FICA NA MENSAGEM, NO APARELHO (`avaliacao`, em
   MensagemDaConversa), para o ícone continuar marcado ao reabrir a
   conversa. Avaliar de novo não manda de novo.

   Do lado do banco: supabase/migrations/…_avaliacao_das_respostas.sql.
   ============================================================ */

export type Nota = 1 | -1;
export const MOTIVOS = ['errada', 'nao-respondeu', 'tom', 'arriscada', 'outro'] as const;
export type Motivo = (typeof MOTIVOS)[number];

export type ResultadoDaAvaliacao = { ok: true } | { ok: false; motivo: 'sem-conta' | 'limite' | 'sem-rede' };

export async function avaliarResposta(a: { nota: Nota; motivo?: Motivo; pergunta?: string; resposta?: string }): Promise<ResultadoDaAvaliacao> {
  const cliente = nuvem();
  if (!cliente) return { ok: false, motivo: 'sem-rede' };
  const { data: sessao } = await cliente.auth.getSession();
  if (!sessao.session) return { ok: false, motivo: 'sem-conta' };
  const comTexto = a.nota === -1;
  const { data, error } = await cliente.rpc('avaliar_resposta', {
    nota: a.nota,
    motivo: comTexto ? a.motivo ?? 'outro' : null,
    pergunta: comTexto ? (a.pergunta ?? '').slice(0, 1000) : null,
    resposta: comTexto ? (a.resposta ?? '').slice(0, 8000) : null,
    idioma: localAtual(),
    pais: paisLidoDoAparelho(),
  });
  if (error) return { ok: false, motivo: 'sem-rede' };
  if ((data as any)?.ok === true) return { ok: true };
  return { ok: false, motivo: (data as any)?.motivo === 'limite' ? 'limite' : 'sem-rede' };
}

/** Marca a nota na mensagem guardada (pela hora dela), na conversa `id`. */
export function marcarAvaliacao(s: any, conversaId: string, t: number, nota: Nota) {
  const g = lerConversas(s);
  const c = g.lista.find((x) => x.id === conversaId);
  const m = c?.msgs.find((x) => x.t === t && x.who === 'ai');
  if (!c || !m) return;
  m.avaliacao = nota;
  s.conversa = { atual: g.atual, lista: g.lista };
}
