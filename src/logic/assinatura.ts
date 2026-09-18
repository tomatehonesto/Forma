import type { State } from './seed';
import { clinicaConectada } from './derive';

/* ============================================================
   A ASSINATURA — um lugar só para dizer quanto custa e quem paga

   ⚠️⚠️ A COBRANÇA NÃO ESTÁ LIGADA. ⚠️⚠️

   Não há StoreKit, não há Google Play Billing, não há intermediário.
   `assinar()` abaixo é a costura por onde a loja entra um dia, e hoje ela
   devolve, em voz alta, que não entrou. A tela de planos mostra esse
   estado em vez de fingir uma compra — a sessão inteira foi gasta
   removendo portas emparedadas, e não é agora que se constrói uma.

   ⚠️ E OS PREÇOS SÃO DE MARCAÇÃO. Os números abaixo existem para a tela
   ter o que desenhar; ninguém decidiu nenhum deles. Ver PENDENCIAS.md,
   item 5 — e trocá-los é mudar este arquivo, e só ele.

   O MODELO É DE CAMADA ÚNICA, e isso não é uma escolha desta tela: os
   Termos já dizem que "o acesso é por assinatura", sem plano melhor nem
   função guardada atrás dele. Quem assina tem o aplicativo; quem tem
   vínculo com clínica parceira tem o mesmo aplicativo sem pagar.

   ⚠️⚠️ O TESTE GRÁTIS É UMA PROMESSA QUE A LOJA PRECISA CUMPRIR. ⚠️⚠️

   `TESTE_DIAS` abaixo é decisão de produto, e a tela a anuncia em corpo
   grande. Mas quem concede período gratuito não é o aplicativo: é a
   oferta introdutória configurada na App Store Connect e no Google Play
   Console, presa ao mesmo produto de assinatura.

   Enquanto ela não estiver configurada lá, a tela promete três dias que
   a loja não vai dar — e o dia em que a cobrança for ligada sem isso é o
   dia em que o aplicativo cobra alguém que leu "comece o teste". Está em
   PENDENCIAS.md, item 5.

   E ELE NÃO É O ARREPENDIMENTO DO CDC. Os Termos descrevem sete dias
   para desistir e receber o dinheiro de volta (art. 49): um direito de
   quem JÁ comprou. O teste é antes da compra, e os dois convivem — mas
   nenhum dos dois pode ser anunciado no lugar do outro, e a seção 7 dos
   Termos ainda não fala do teste. Ver o mesmo item.
   ============================================================ */

export type Plano = {
  id: 'mensal' | 'anual';
  nome: string;
  /** o que a loja cobra, na periodicidade do plano */
  preco: number;
  /** por extenso, para frase corrida: "R$ 199,90 por ano, renovando…" */
  periodo: string;
  /** curto, para colar no número: "R$ 199,90 /ano" */
  sufixo: string;
  /* ⚠️ O MESMO PREÇO NA OUTRA UNIDADE, e para os dois planos.
     Antes só o anual trazia o equivalente mensal, e o mensal ficava com
     uma frase de recheio. Mas o desconto anunciado no selo é uma conta
     entre as duas unidades, e quem afirma o desconto deve mostrar os dois
     lados dele: R$ 16,66 por mês de um lado, R$ 358,80 por ano do outro.
     Só com os dois números na tela a pessoa consegue conferir os −44%. */
  outraUnidade: { valor: number; periodo: string };
  /** quanto se economiza contra o mensal, em pontos percentuais */
  economia?: number;
};

/* ⚠️ PREÇOS DE MARCAÇÃO — nenhum destes números foi decidido. */
export const PLANOS: Plano[] = [
  {
    id: 'mensal', nome: 'Mensal', preco: 29.9, periodo: 'por mês', sufixo: '/mês',
    outraUnidade: { valor: 29.9 * 12, periodo: 'por ano' },
  },
  {
    id: 'anual', nome: 'Anual', preco: 199.9, periodo: 'por ano', sufixo: '/ano',
    outraUnidade: { valor: 199.9 / 12, periodo: 'por mês' }, economia: 44,
  },
];

export const RECOMENDADO: Plano['id'] = 'anual';

/** Dias de teste gratuito antes da primeira cobrança. Zero desliga o
    anúncio do teste na tela inteira — é assim que se tira, e não
    apagando frase por frase. */
export const TESTE_DIAS = 3;

export const reais = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

/* A economia em reais viveu aqui por uma passagem, e saiu com a linha
   que a mostrava: com o teste grátis anunciado embaixo do botão, a barra
   tinha três textos disputando o mesmo lugar, e o desconto é o menos
   urgente dos três. O "−44%" no cartão continua dizendo a mesma coisa em
   dois caracteres. */

/** Quem não paga: o vínculo com clínica parceira é o que isenta, e é o
    que os Termos prometem na seção de assinatura. */
export const isento = (S: State) => clinicaConectada(S);

/* ⚠️ O CÓDIGO SE GUARDA NUM LUGAR SÓ, e agora há duas telas que o
   pedem: a de parceiros, que explica o que ele faz, e a de planos, que é
   onde a pessoa está quando ele importa. Normalizar em dois lugares é
   como "ABC123" e "abc123 " viram dois convites diferentes no dia em que
   um servidor for conferi-los. */
export const normalizarConvite = (v: string) => v.trim().toUpperCase();

export type Resultado = { ok: false; motivo: 'nao-implementado' };

/* ⚠️ A COSTURA. Quando a loja entrar, é esta função que passa a abrir a
   folha de compra nativa e a devolver o resultado dela — e é o único
   lugar do aplicativo que precisa saber disso.

   Ela devolve a recusa em vez de lançar erro porque a tela precisa
   MOSTRAR o estado: um botão que não faz nada e não explica é o defeito
   que este projeto passou a semana inteira apagando. */
export async function assinar(_plano: Plano['id']): Promise<Resultado> {
  return { ok: false, motivo: 'nao-implementado' };
}
