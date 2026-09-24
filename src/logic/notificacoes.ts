import type { State } from './seed';
import type { Forma } from './meds';
import { T } from '../textos';
import { FORMAS, oA, doDa, noNa } from './formas';
import { doseTxt } from './time';
import { textoDeNivel } from './conquistas';

/* ============================================================
   AS NOTIFICAÇÕES — o que o aplicativo contou, guardado como fato

   ⚠️⚠️ ELAS ERAM GRAVADAS COMO FRASE PRONTA, e por isso ficavam no idioma
   de quem as escreveu. O estado guardava `title` e `body` já escritos —
   a semente em português, a tela de conquista no idioma daquele minuto
   —, e trocar para o francês deixava a lista inteira em português. É o
   defeito da constante de módulo que lê o catálogo, só que gravado no
   aparelho: o idioma congelava no disco em vez de no import.

   Agora a lista guarda o FATO — que aviso foi, com os números dele — e a
   frase é montada na hora de mostrar, no idioma de agora. O que é
   palavra de outra pessoa, como a mensagem da médica, continua como foi
   escrito: aquilo é conteúdo, não interface.

   ⚠️ E O QUE FOI GRAVADO ANTES CONTINUA APARECENDO, do jeito que foi
   escrito. Não há como traduzir uma frase pronta de volta para os dados
   que a geraram, e apagar seria perder o que a pessoa já recebeu.
   ============================================================ */

export type FaseDoCiclo = 'aplic' | 'pico' | 'estab' | 'retorno' | 'pre';

export type Notificacao = { t: number } & (
  /** o aviso da dose, com a distância que ele tinha quando chegou */
  | { tipo: 'dose'; dias: number; med: string; dose: number; unidade: string; forma: Forma }
  /** a manchete do ciclo naquele dia */
  | { tipo: 'ciclo'; fase: FaseDoCiclo }
  /** a resposta da equipe — o texto é de quem escreveu */
  | { tipo: 'mensagem'; autor: string; texto: string }
  /** o estoque que cruzou a linha de renovar */
  | { tipo: 'estoque'; restam: number; forma: Forma }
  /** um exame importado */
  | { tipo: 'exames'; nome: string; marcadores: number }
  /** um nível de conquista, com o que faltava para o seguinte naquela hora */
  | { tipo: 'conquista'; trilha: string; nivel: number; alvo: number; resta: number | null; proximo: number | null }
);

/** de quem é o aviso — é o que as pastilhas de filtro perguntam */
export type Origem = 'trat' | 'clin' | 'ia' | 'conquista' | 'exame';

export type NotificacaoLida = { t: number; ic: string; origem: Origem; titulo: string; corpo: string };

/* O TEXTO DO AVISO DE DOSE, o mesmo da tela de bloqueio. A lista conta o
   que chegou, e o que chegou foi isto — logic/avisos agenda com esta
   mesma função, e duas cópias da frase divergiriam na primeira vez que
   alguém melhorasse uma delas. */
export const textoDoAvisoDeDose = (p: { dias: number; med: string; dose: number; unidade: string; forma: Forma }) => {
  const K = T.avisos;
  const { acao, recipiente } = FORMAS()[p.forma];
  const dose = `${p.med} ${doseTxt(p.dose)} ${p.unidade}`;
  if (p.dias <= 0) return { title: K.doseHoje(acao), body: K.doseHojeCorpo(dose) };
  if (p.dias === 1) return { title: K.doseAmanha(acao), body: K.doseAmanhaCorpo(dose, `${oA(p.forma)} ${recipiente}`) };
  return { title: K.doseEmDias(p.dias, acao), body: K.doseEmDiasCorpo(dose, doDa(p.forma)) };
};

/* A manchete de cada fase é a da Home naquele dia — ver `todayBrief`. É
   função, como toda tabela que lê o catálogo. */
const MANCHETE = (): Record<FaseDoCiclo, string> => ({
  aplic: T.ciclo.aplicHead,
  pico: T.ciclo.picoHead,
  estab: T.ciclo.estabHead,
  retorno: T.ciclo.retornoHead,
  pre: T.ciclo.altoHeadHoje,
});

/** A notificação guardada, escrita no idioma de agora. */
export function lerNotificacao(S: State, n: any): NotificacaoLida | null {
  const K = T.alertas.telaNotificacoes;
  switch (n?.tipo) {
    case 'dose': {
      const x = textoDoAvisoDeDose(n);
      return { t: n.t, ic: FORMAS()[n.forma as Forma]?.injetavel === false ? 'pill' : 'syringe', origem: 'trat', titulo: x.title, corpo: x.body };
    }
    case 'ciclo':
      return { t: n.t, ic: 'spark', origem: 'ia', titulo: K.insightTitulo, corpo: MANCHETE()[n.fase as FaseDoCiclo] ?? '' };
    case 'mensagem':
      return { t: n.t, ic: 'steth', origem: 'clin', titulo: K.respondeu(n.autor), corpo: n.texto };
    case 'estoque':
      /* O título é o veredito que o aplicativo dá ao mesmo estoque em
         Aplicações — ver `penStock`. */
      return {
        t: n.t, ic: 'pill', origem: 'trat',
        titulo: n.restam <= 1 ? T.tratamento.estoqueUrgente : T.tratamento.estoqueRenovar,
        corpo: `${T.tratamento.telaAplicacoes.dosesRestantesNo(n.restam, noNa(n.forma))}.`,
      };
    case 'exames':
      return { t: n.t, ic: 'doc', origem: 'exame', titulo: K.examesTitulo, corpo: K.examesCorpo(n.nome, n.marcadores) };
    case 'conquista': {
      /* Uma trilha que saiu do catálogo não tem mais como ser escrita, e
         uma linha sem título é pior do que nenhuma. */
      const q = textoDeNivel(S, n.trilha, n.alvo, n.resta, n.proximo);
      if (!q) return null;
      return {
        t: n.t, ic: q.ic, origem: 'conquista',
        titulo: T.conquistas.marco(q.titulo, n.nivel),
        corpo: q.falta ? K.conquistaCorpo(q.desc, q.falta) : `${q.desc}. ${T.conquistas.tela.trilhaCompleta}.`,
      };
    }
    default:
      /* gravada antes, como frase: aparece como foi escrita */
      if (n?.title) return { t: n.t, ic: n.ic ?? 'bell', origem: n.kind ?? 'trat', titulo: n.title, corpo: n.body ?? '' };
      return null;
  }
}
