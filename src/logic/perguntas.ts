/* ============================================================
   AS PERGUNTAS AO COMPANHEIRO — a janela e a origem

   `asked` guarda as 12 últimas perguntas feitas ao Morphi, sem repetir: a
   mesma pergunta feita de novo sai de onde estava e entra no fim. É o que
   o Insights lê para oferecer "continue de onde parou".

   A ORIGEM diz se a pessoa digitou a pergunta ou tocou numa que o
   aplicativo sugeriu. Sem ela, as sugestões se misturariam com as dúvidas
   de verdade, e ler as perguntas não diria nada sobre o uso (a decisão 2
   do plano do Supabase). É gravada em cada item, por quem faz a pergunta.

   ⚠️ A JANELA É SÓ DO APARELHO. No servidor, as perguntas só crescem
   (tabela `perguntas`): sair da janela não é apagar. Ver logic/sincronia.
   ============================================================ */

export type OrigemDaPergunta = 'digitada' | 'sugerida';

export type PerguntaFeita = { t: number; q: string; origem?: OrigemDaPergunta; rid?: string };

export const JANELA_DE_PERGUNTAS = 12;

/** A pergunta nova entra no fim, e a mesma pergunta feita antes sai de onde estava. */
export function acrescentarPergunta(
  asked: PerguntaFeita[],
  q: string,
  origem: OrigemDaPergunta | undefined,
  t: number,
): PerguntaFeita[] {
  return [
    ...asked.filter((x) => x.q !== q),
    { t, q, ...(origem ? { origem } : {}) },
  ].slice(-JANELA_DE_PERGUNTAS);
}

/** A janela montada a partir de perguntas soltas — as que desceram do
    servidor junto com as do aparelho: pela hora, sem repetir o texto (fica
    a vez mais recente), as 12 últimas. É o que `acrescentarPergunta`
    produziria se elas tivessem sido feitas todas aqui. */
export function janelaDePerguntas(lista: PerguntaFeita[]): PerguntaFeita[] {
  const pelaHora = lista.slice().sort((a, b) => a.t - b.t);
  const ultimaVez = new Map<string, number>();
  pelaHora.forEach((p, i) => ultimaVez.set(p.q, i));
  return pelaHora.filter((p, i) => ultimaVez.get(p.q) === i).slice(-JANELA_DE_PERGUNTAS);
}

/* ============================================================
   A ORIGEM QUE VIAJA NO ENDEREÇO

   Toda porta para o companheiro com uma pergunta pronta é um atalho que o
   aplicativo ofereceu — a Home, o Cuidado, a Alimentação, as pastilhas do
   Insights —, e por isso a pergunta que chega pelo endereço, sem mais
   nada, é `sugerida`. Só duas portas dizem outra coisa:

     'digitada' — o campo do Insights, que manda o que a pessoa escreveu;
     'recente'  — uma pergunta que a pessoa já fez, tocada no Insights. Ela
                  herda a origem da vez anterior, lida em `asked`: tocar de
                  novo numa dúvida que foi digitada continua sendo a dúvida
                  dela, e não uma sugestão nossa.
   ============================================================ */

export type OrigemNoEndereco = 'digitada' | 'recente';

/** O endereço do companheiro com a pergunta pronta. */
export const enderecoDoCompanheiro = (q: string, origem?: OrigemNoEndereco) =>
  `/companion?q=${encodeURIComponent(q)}${origem ? `&origem=${origem}` : ''}`;

/** A origem de uma pergunta que chegou pelo endereço. Uma recente feita
    antes de a origem existir continua sem ela. */
export function origemDoEndereco(
  asked: PerguntaFeita[],
  q: string,
  origem: string | undefined,
): OrigemDaPergunta | undefined {
  if (origem === 'digitada') return 'digitada';
  if (origem === 'recente') {
    const texto = q.trim();
    for (let i = asked.length - 1; i >= 0; i--) if (asked[i].q === texto) return asked[i].origem;
    return undefined;
  }
  return 'sugerida';
}
