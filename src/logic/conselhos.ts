import type { State } from './seed';
import { ALIMENTOS } from './alimentos';
import { listaPt, metasDoDia, diaDaRefeicao } from './derive';
import { nutrientesDe, gramasItem, MOMENTOS, type ItemComida } from './prato';
import { DAY, now, startOfDay } from './time';
import { fontesDeProteina } from './restricoes';
import { T } from '../textos';

/* ============================================================
   O QUE DÁ PARA NOTAR NA ROTINA

   Nenhuma destas frases foi escrita para um caso imaginado. Cada uma
   nasce de uma contagem sobre o que a pessoa registrou, e traz o número
   junto — "o seu café da manhã vem com 9 g" pode ser conferido na tela
   de baixo, "você está indo bem no café da manhã" não pode ser conferido
   de lugar nenhum. Elogio sem número é a forma mais rápida de um app
   soar como um cartão de autoajuda.

   DUAS SEMANAS, e só dias com registro. Rotina é o que se repete, e uma
   semana curta demais transforma um domingo atípico em padrão. Dia sem
   nada anotado não é dia de zero: é dia que a pessoa não registrou, e
   dividir por quatorze faria esquecimento virar falta de fibra.

   O PISO DE EVIDÊNCIA É EXPLÍCITO: sem um mínimo de registros, a seção
   inteira não aparece. Um app que opina sobre três refeições está
   adivinhando, e adivinhação com cara de leitura de dados é pior do que
   silêncio.

   E NADA AQUI É PRESCRIÇÃO. As frases apontam o que a contagem mostra e
   sugerem um próximo prato; nenhuma diz à pessoa que ela está errada,
   porque o app não sabe o que o médico dela combinou.
   ============================================================ */

export type Conselho = {
  id: string;
  ic: string;
  /** o fato, com o número dentro */
  titulo: string;
  /** o que fazer com ele, ou por que ele importa */
  texto: string;
  /** confirma o que já está acontecendo, em vez de pedir mudança */
  bom: boolean;
  /* A PERGUNTA QUE O CARTÃO ABRE NO MORPHI. Ela existe porque um achado
     termina sempre no mesmo lugar: "e agora?". A tela conta e sugere; o
     resto é conversa, e conversa é de outra tela. Vai escrita em primeira
     pessoa, como a pessoa perguntaria — o campo do Morphi recebe texto,
     e um título de seção colado ali leria como comando de máquina. */
  q: string;
};

/** Dias com pelo menos uma refeição registrada nas últimas duas semanas. */
const JANELA = 14;
/** Abaixo disto a seção não fala: é amostra, e não rotina. */
const MINIMO_DE_DIAS = 4;

type Dia = { t: number; refeicoes: any[] };

function diasComRegistro(S: State): Dia[] {
  const hoje = +startOfDay(now());
  const porDia = new Map<number, any[]>();
  for (const m of S.meals as any[]) {
    const t = diaDaRefeicao(m);
    if (t > hoje || t <= hoje - JANELA * DAY) continue;
    porDia.set(t, [...(porDia.get(t) || []), m]);
  }
  return [...porDia.entries()]
    .map(([t, refeicoes]) => ({ t, refeicoes }))
    .sort((a, b) => a.t - b.t);
}

const itensDe = (m: any): ItemComida[] => (m.itens || []) as ItemComida[];

/* Os corredores do mercado que respondem por verdura no prato. Fruta fica
   de fora de propósito: ela também tem fibra, mas a frase sugere salada
   no almoço, e uma maçã de tarde não é a mesma conversa. */
const CORREDOR_VERDE = ['Verduras e legumes'];

export function conselhosDaRotina(S: State): Conselho[] {
  /* ⚠️ LIDO DENTRO DA FUNÇÃO, e não no topo do módulo: uma constante de
     módulo congelaria o idioma do primeiro import. */
  const K = T.alimentacao.conselhos;
  const dias = diasComRegistro(S);
  if (dias.length < MINIMO_DE_DIAS) return [];

  const metas = metasDoDia(S);
  const restricoes = ((S.profile as any).restricoes ?? []) as string[];
  const fora: Conselho[] = [];

  /* ---------- 1. A FIBRA ----------
     Primeira porque é a que tem consequência sentida: prisão de ventre é
     dos efeitos colaterais mais comuns da caneta, e a fibra é a alavanca
     de comida que existe para ela. */
  const comConta = dias.filter((d) => d.refeicoes.some((m) => nutrientesDe(itensDe(m)).contados > 0));
  if (comConta.length >= MINIMO_DE_DIAS) {
    const media = Math.round(
      comConta.reduce((x, d) => x + d.refeicoes.reduce((y, m) => y + nutrientesDe(itensDe(m)).fibra, 0), 0)
      / comConta.length,
    );
    if (media < metas.fibra * 0.8) {
      fora.push({
        id: 'fibra',
        ic: 'gut',
        bom: false,
        q: K.fibraQ,
        titulo: K.fibraTitulo(media),
        texto: K.fibraTexto(comConta.length, metas.fibra),
      });
    } else if (media >= metas.fibra) {
      fora.push({
        id: 'fibra',
        ic: 'gut',
        bom: true,
        q: K.fibraBoaQ,
        titulo: K.fibraBoaTitulo(media),
        texto: K.fibraBoaTexto(comConta.length, metas.fibra),
      });
    }
  }

  /* ---------- 2. A PROTEÍNA POR MOMENTO ----------
     O número do dia não diz ONDE consertar. A média por momento diz: um
     café da manhã de 6 g e um almoço de 40 g somam o mesmo que dois de
     23, e só o primeiro tem um próximo passo óbvio. */
  const porMomento = MOMENTOS.map(([ic, nome]) => {
    const refs = dias.flatMap((d) => d.refeicoes.filter((m) => m.name === nome));
    const comItens = refs.filter((m) => itensDe(m).length);
    const media = comItens.length
      ? Math.round(comItens.reduce((x, m) => x + itensDe(m).reduce((y, it) => y + gramasItem(it), 0), 0) / comItens.length)
      : 0;
    return { ic, nome, n: comItens.length, media };
  }).filter((x) => x.n >= MINIMO_DE_DIAS);

  if (porMomento.length >= 2) {
    const ordenado = [...porMomento].sort((a, b) => a.media - b.media);
    const pior = ordenado[0];
    const melhor = ordenado[ordenado.length - 1];
    /* A META DIÁRIA DIVIDIDA PELOS MOMENTOS QUE A PESSOA REALMENTE FAZ,
       e não por três refeições imaginadas. Quem come duas vezes por dia
       precisa de mais em cada uma, e cobrar um terço de cada seria
       inventar uma rotina que não é a dela. */
    const cota = metas.prot / porMomento.length;
    if (pior.media < cota * 0.6) {
      /* AS FONTES SAEM DA TABELA, E RESPEITAM O QUE A PESSOA COME. A
         frase dizia "um ovo, um iogurte ou um pedaço de queijo" para
         todo mundo — conselho que um vegano não pode seguir, dito pelo
         app que acabou de perguntar se ele é vegano. */
      const fontes = fontesDeProteina(restricoes, 3);
      fora.push({
        id: 'momento-fraco',
        ic: pior.ic,
        bom: false,
        q: K.momentoFracoQ(pior.nome),
        titulo: K.momentoFracoTitulo(pior.nome, pior.media),
        texto: K.momentoFracoTexto(melhor.nome, melhor.media, listaPt(fontes)),
      });
    } else if (melhor.media >= cota) {
      fora.push({
        id: 'momento-forte',
        ic: melhor.ic,
        bom: true,
        q: K.momentoForteQ,
        titulo: K.momentoForteTitulo(melhor.nome, melhor.media),
        texto: K.momentoForteTexto,
      });
    }
  }

  /* ---------- 3. VERDURA NO PRATO ----------
     A frase conta em quantos dias uma verdura APARECEU NO REGISTRO — e
     não em quantos a pessoa comeu verdura. São coisas diferentes, e um
     prato pronto pode ter legume dentro sem o app saber. Por isso ela
     mostra a contagem e sugere, em vez de afirmar falta. */
  const idVerde = new Set(ALIMENTOS().filter((a) => CORREDOR_VERDE.includes(a.onde)).map((a) => a.id));
  const comItens = dias.filter((d) => d.refeicoes.some((m) => itensDe(m).length));
  if (comItens.length >= MINIMO_DE_DIAS) {
    const verdes = comItens.filter((d) => d.refeicoes.some((m) => itensDe(m).some((it) => it.id && idVerde.has(it.id))));
    if (verdes.length <= comItens.length / 3) {
      fora.push({
        id: 'verde',
        ic: 'leaf',
        bom: false,
        q: K.verdeQ,
        titulo: K.verdeTitulo(verdes.length, comItens.length),
        texto: K.verdeTexto,
      });
    }
  }

  return fora;
}
