/* ============================================================
   OS NÚMEROS DE AJUDA, POR PAÍS

   A IA é um consultor global (docs/revisao-clinica/2026-10-01-auditoria-
   da-base.md): a orientação clínica é uma só, e o país só entra no que é
   fato local. Telefone é o fato local mais perigoso de errar — o CVV 188
   não atende ninguém em Lisboa —, e por isso ele não mora na base nem na
   memória do modelo: sai desta tabela, conferida nas fontes oficiais, e
   vai no bloco da pessoa.

   ⚠️ SÓ ENTRA NÚMERO CONFERIDO NUMA FONTE OFICIAL ABERTA. A fonte de
   cada um está em `FONTES`. Toxicologia nula quer dizer que o país não
   tem um número nacional único (França, Alemanha e Itália têm centros
   regionais): aí a orientação é a emergência.

   ⚠️ SEM PAÍS, NENHUM NÚMERO. O bloco diz "não informado" e a IA fala
   "o serviço de emergência do seu país". Inventar o país custa mais do
   que não dar o número.
   ============================================================ */

export type Numero = { numero: string; nome: string };
export type Ajuda = {
  emergencia: Numero | null;
  crise: (Numero & { h24: boolean }) | null;
  toxicologia: Numero | null;
};

export const NUMEROS: Record<string, Ajuda> = {};

export const FONTES: Record<string, string[]> = {};

/** O país que chegou no pedido: duas letras maiúsculas, ou null. */
export const lerPais = (p: unknown): string | null =>
  typeof p === 'string' && /^[A-Z]{2}$/.test(p) ? p : null;

/* ⚠️ O PALPITE PELO IDIOMA SÓ VALE QUANDO O CAMPO NÃO VEIO. O aplicativo
   manda `pais` sempre — a região do aparelho, ou null quando não sabe.
   O campo ausente é de quem ainda não manda: a avaliação
   (scripts/avaliacao, travada) e um build antigo. Para eles, o idioma do
   pedido dá o país mais provável, e é o mesmo comportamento de antes
   (o CVV em português). Null do aplicativo continua sendo "não sei". */
const PALPITE_DO_IDIOMA: Record<string, string> = {
  'pt-BR': 'BR', 'en-US': 'US', 'fr-FR': 'FR', 'de-DE': 'DE', 'it-IT': 'IT',
};
export const paisDoPedido = (corpo: any, idioma: string): string | null =>
  corpo && 'pais' in corpo ? lerPais(corpo.pais) : PALPITE_DO_IDIOMA[idioma] ?? null;

const nomeDoPais = (p: string) => {
  try {
    return new Intl.DisplayNames(['pt-BR'], { type: 'region' }).of(p) ?? p;
  } catch {
    return p;
  }
};

/** O bloco que vai junto do resumo da pessoa: o país e os números dele. */
export function blocoDeAjuda(pais: string | null): string {
  if (!pais) {
    return 'PAÍS DA PESSOA: não informado.\nNÚMEROS DE AJUDA: nenhum. Não dite telefone: diga "o serviço de emergência do seu país" ou "a linha de apoio emocional do seu país".';
  }
  const a = NUMEROS[pais];
  const linhas = [`PAÍS DA PESSOA: ${nomeDoPais(pais)} (${pais}).`];
  if (!a) {
    linhas.push('NÚMEROS DE AJUDA: nenhum conferido para este país. Não dite telefone: diga "o serviço de emergência do seu país" ou "a linha de apoio emocional do seu país".');
    return linhas.join('\n');
  }
  linhas.push('NÚMEROS DE AJUDA DESTE PAÍS (use só estes):');
  linhas.push(`- emergência: ${a.emergencia ? `${a.emergencia.nome}, ${a.emergencia.numero}` : 'não conferido; diga "o serviço de emergência do seu país"'}`);
  linhas.push(`- apoio emocional: ${a.crise ? `${a.crise.nome}, ${a.crise.numero}${a.crise.h24 ? ' (24 horas)' : ''}` : 'não conferido; diga "a linha de apoio emocional do seu país"'}`);
  linhas.push(`- toxicologia (dose a mais por engano): ${a.toxicologia ? `${a.toxicologia.nome}, ${a.toxicologia.numero}` : 'não há número nacional; oriente a emergência'}`);
  return linhas.join('\n');
}
