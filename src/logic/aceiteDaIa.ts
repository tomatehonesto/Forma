import { now } from './time';

/* ============================================================
   O ACEITE DA MORPHI INTELLIGENCE — um só, para toda a IA

   Decidido pelo dono em 01/10/2026: em vez de um aceite por função (a
   conversa, a leitura da semana, a leitura do laudo), um só, na primeira
   vez que a pessoa usa qualquer função de IA — inclusive a foto do prato
   e a estimativa pelo nome, que antes não pediam nada.

   O texto (textos/<idioma>/companion, `telaConversa.aceite*`) lista cada
   finalidade numa linha, o que sai do aparelho e para onde vai: é o que
   faz um aceite único continuar específico (LGPD, art. 8º, § 4º, e art.
   11, I). A pergunta de se isso basta está no pacote do advogado.

   ⚠️ A VERSÃO SOBE QUANDO O TEXTO MUDA DE SENTIDO, e a pessoa aceita de
   novo. Os aceites antigos (`aceiteDaConversa`, `aceiteDoLaudo`,
   `aceiteDaLeitura` com versão) não valem por este: as finalidades
   aumentaram.

   ⚠️ "AGORA NÃO" VALE 4 SEMANAS PARA O QUE O APLICATIVO OFERECE SOZINHO
   (o convite do resumo da semana no carrossel). O que a pessoa pede — a
   foto, a conversa, o laudo — pergunta de novo na próxima vez que ela
   pedir, porque foi ela quem pediu.
   ============================================================ */

export const VERSAO_DO_ACEITE_DA_IA = 1;
export const SEMANAS_ATE_OFERECER_DE_NOVO = 4;

export const aceitouAIa = (S: any) => (S?.profile?.aceiteDaIa?.versao ?? 0) >= VERSAO_DO_ACEITE_DA_IA;

export const registrarAceiteDaIa = (s: any) => {
  s.profile.aceiteDaIa = { em: +now(), versao: VERSAO_DO_ACEITE_DA_IA };
};

export const registrarRecusaDaIa = (s: any) => {
  s.profile.aceiteDaIa = { em: +now(), recusou: true };
};

/** A pessoa disse "agora não" há menos de 4 semanas. */
export const recusouAIaHaPouco = (S: any, agora: number = +now()) => {
  const a = S?.profile?.aceiteDaIa;
  return !!a?.recusou && !aceitouAIa(S) && agora - (a.em ?? 0) < SEMANAS_ATE_OFERECER_DE_NOVO * 7 * 864e5;
};
