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

   ⚠️ E OS PREÇOS ESTÃO DECIDIDOS, MAS NÃO EXISTEM NA LOJA. R$ 49,90 por
   mês e R$ 299,00 por ano são os números escolhidos — não são mais de
   marcação. O que falta é o outro lado: enquanto os produtos não forem
   criados na App Store Connect e no Google Play com exatamente estes
   valores, a tela anuncia um preço que a loja não cobra. Ver
   PENDENCIAS.md, item 5.

   Trocá-los é mudar este arquivo, e só ele — mas trocar aqui sem trocar
   na loja é pior do que não trocar.

   O MODELO É DE CAMADA ÚNICA, e isso não é uma escolha desta tela: os
   Termos já dizem que "o acesso é por assinatura", sem plano melhor nem
   função guardada atrás dele. Quem assina tem o aplicativo; quem tem
   vínculo com clínica parceira tem o mesmo aplicativo sem pagar.

   ⚠️⚠️ O TESTE GRÁTIS É UMA PROMESSA QUE A LOJA PRECISA CUMPRIR. ⚠️⚠️

   `TESTE_DIAS` abaixo é decisão de produto, e a tela a anuncia em corpo
   grande. Mas quem concede período gratuito não é o aplicativo: é a
   oferta introdutória configurada na App Store Connect e no Google Play
   Console — e agora presa ao produto MENSAL, que é o único que oferece o
   teste. Configurá-la no anual por engano dá um ano de graça a cada três
   dias de teste.

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

/** Dias de teste gratuito antes da primeira cobrança, no plano que o
    oferece. Zero desliga o anúncio do teste na tela inteira — é assim que
    se tira, e não apagando frase por frase. */
export const TESTE_DIAS = 3;

export type Plano = {
  id: 'mensal' | 'anual';
  nome: string;
  /** o que a loja cobra, na periodicidade do plano */
  preco: number;
  /** por extenso, para frase corrida: "R$ 299,00 por ano, renovando…" */
  periodo: string;
  /** curto, para colar no número: "R$ 299,00 /ano" */
  sufixo: string;
  /* ⚠️ O MESMO PREÇO NA OUTRA UNIDADE, e para os dois planos.
     Antes só o anual trazia o equivalente mensal, e o mensal ficava com
     uma frase de recheio. Mas o desconto anunciado no selo é uma conta
     entre as duas unidades, e quem afirma o desconto deve mostrar os dois
     lados dele: R$ 16,66 por mês de um lado, R$ 358,80 por ano do outro.
     Só com os dois números na tela a pessoa consegue conferir os −50%. */
  outraUnidade: { valor: number; periodo: string };
  /** quanto se economiza contra o mensal, em pontos percentuais */
  economia?: number;
  /* ⚠️ O TESTE É DE UM PLANO SÓ, E ISSO É A TELA INTEIRA EM UMA LINHA.

     Ele era global: os dois cartões ofereciam três dias grátis e o botão
     dizia a mesma coisa em qualquer escolha, o que deixava os dois planos
     com o mesmo argumento e uma diferença de preço no meio.

     Cada cartão passa a defender uma coisa. O mensal oferece o teste —
     é o plano de quem ainda não decidiu, e o que ele precisa é de uma
     porta barata para experimentar. O anual oferece o desconto — é o
     plano de quem já decidiu, e o que ele precisa é de uma razão para
     comprometer o ano. Oferecer os dois nos dois é não oferecer nenhum.

     Zero, ou ausente, desliga o anúncio do teste na tela inteira. */
  teste?: number;
};

/* ⚠️ O SELO DE ECONOMIA É UMA CONTA, e ela precisa fechar: 299 contra
   49,90 × 12 = 598,80 dá 50,07% — arredondado para baixo, para 50, porque
   o número anunciado nunca deve ser maior do que o real. Mexer em
   `preco` sem refazer esta conta faz a tela mentir em voz alta, e os dois
   valores de `outraUnidade` estão logo abaixo para quem quiser conferir. */
export const PLANOS: Plano[] = [
  {
    id: 'mensal', nome: 'Mensal', preco: 49.9, periodo: 'por mês', sufixo: '/mês',
    outraUnidade: { valor: 49.9 * 12, periodo: 'por ano' }, teste: TESTE_DIAS,
  },
  {
    id: 'anual', nome: 'Anual', preco: 299, periodo: 'por ano', sufixo: '/ano',
    outraUnidade: { valor: 299 / 12, periodo: 'por mês' }, economia: 50,
  },
];

export const RECOMENDADO: Plano['id'] = 'anual';

export const reais = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

/* A economia em reais viveu aqui por uma passagem, e saiu com a linha
   que a mostrava: com o teste grátis anunciado embaixo do botão, a barra
   tinha três textos disputando o mesmo lugar, e o desconto é o menos
   urgente dos três. O "−50%" no cartão continua dizendo a mesma coisa em
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

export type Vinculo = { desde: number; convite: string };

/* ⚠️ O CÓDIGO É O VÍNCULO, E NÃO UM PEDIDO DE VÍNCULO.

   O aplicativo nasceu com dois estados: `convite`, o que a pessoa
   digitou, e `vinculo`, o que sobrava depois de alguém da clínica
   confirmar. Duas telas diziam a ela "a conferência acontece depois" — e
   a conta não fecha.

   Quem tem o código recebeu o código DA clínica. Não há nada para a
   clínica confirmar: ela já confirmou quando entregou o papel. O que a
   espera criava era uma pessoa parada na quinta à noite, com o código na
   mão e o aplicativo trancado, esperando a segunda-feira abrir.

   Então digitar é entrar. `convite` continua existindo porque é o que
   ela escreveu, e `vinculo` é o que o aplicativo faz com isso — mas
   agora os dois nascem no mesmo toque.

   ⚠️⚠️ E NINGUÉM CONFERE O CÓDIGO, QUE É O BURACO DESTA DECISÃO. ⚠️⚠️

   Não existe lista de códigos válidos em lugar nenhum: qualquer quatro
   caracteres ligam o vínculo e isentam a assinatura. Hoje isso é
   inofensivo, porque não há cobrança para burlar. No dia em que houver,
   é o aplicativo inteiro de graça para quem digitar "ABCD".

   É esta função que vira a chamada ao Supabase — ela já é o único lugar
   que transforma código em vínculo, e por isso já está no formato certo
   para virar assíncrona. O que muda quando isso acontecer: ela passa a
   devolver uma promessa, e as três telas que a chamam passam a ter um
   estado de espera e um de recusa. Ver PENDENCIAS.md, itens 5 e 10. */
export const vinculoDoConvite = (codigo: string): Vinculo =>
  ({ desde: Date.now(), convite: normalizarConvite(codigo) });

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
