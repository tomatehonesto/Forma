/* ============================================================
   O CONSENTIMENTO DE COMPARTILHAR COM A CLÍNICA

   É outro que o geral do cadastro: é o que a pessoa lê na folha do código
   (/codigo), na etapa "É essa a sua clínica?", e aceita ao tocar em
   "Conectar". A versão vai para o vínculo no servidor
   (`vinculos.consentimento_versao`, por `usar_convite`) — é ela que prova
   que a pessoa leu ESTE texto.

   ⚠️ A LISTA DO QUE A EQUIPE VÊ NÃO É ESCRITA À MÃO: ela sai da tabela de
   tradução (logic/traducao). Todo tipo de registro que sobe e toda parte
   do perfil — é o que a regra da equipe lê no banco (`equipe_le`, em
   supabase/migrations). A trava da sincronia confere que cada um tem a
   sua frase. As perguntas ao companheiro NÃO entram: a clínica não as lê,
   por construção.

   ⚠️ "FOTOS" NÃO ENTRA NESTA ENTREGA: nenhum registro de foto sobe ainda
   (plano do Supabase, "Antes de tudo", item 1). No dia em que subir, a
   frase entra e a versão sobe.
   ============================================================ */
import { PARTES, TIPOS_DE_REGISTRO, type Parte, type TipoDeRegistro } from './traducao';
import { T } from '../textos';

/** Sobe quando a lista, ou o que se diz dela, muda de forma relevante. */
export const VERSAO_DO_COMPARTILHAMENTO = 1;

/** Os tipos de registro que a equipe passa a ver. */
export const TIPOS_COMPARTILHADOS = TIPOS_DE_REGISTRO.filter((t) => t !== 'foto');

/** O que a equipe passa a ver, na língua de agora: os registros, e depois
    as partes do perfil. */
export function oQueAEquipeVe(): string[] {
  const itens = T.rede.vinculo.itens as Record<TipoDeRegistro | Parte, string>;
  return [...TIPOS_COMPARTILHADOS, ...PARTES].map((k) => itens[k]);
}
