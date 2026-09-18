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

   ⚠️ NÃO EXISTE "TESTE GRÁTIS" AQUI, e a ausência é deliberada. Os Termos
   descrevem o direito de arrependimento do CDC (art. 49) — sete dias para
   desistir e receber o dinheiro de volta —, que é outra coisa: um direito
   de quem comprou, e não um período antes da compra. Anunciar "7 dias
   grátis" apoiado nesse artigo seria vender um como o outro. Se um dia
   houver trial, ele entra pela loja e é declarado aqui.
   ============================================================ */

export type Plano = {
  id: 'mensal' | 'anual';
  nome: string;
  /** o que a loja cobra, na periodicidade do plano */
  preco: number;
  periodo: string;
  /** quanto sai por mês — é a conta que a pessoa faz de cabeça */
  porMes: number;
  /** quanto se economiza contra o mensal, em pontos percentuais */
  economia?: number;
};

/* ⚠️ PREÇOS DE MARCAÇÃO — nenhum destes números foi decidido. */
export const PLANOS: Plano[] = [
  { id: 'mensal', nome: 'Mensal', preco: 29.9, periodo: 'por mês', porMes: 29.9 },
  { id: 'anual', nome: 'Anual', preco: 199.9, periodo: 'por ano', porMes: 199.9 / 12, economia: 44 },
];

export const RECOMENDADO: Plano['id'] = 'anual';

export const reais = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

/* ⚠️ QUANTO SE ECONOMIZA, EM DINHEIRO E NÃO EM PORCENTAGEM.

   "−44%" é o número do anúncio: some do bolso e não responde a pergunta
   que a pessoa faz, que é quanto ela deixa de gastar. A conta é a
   diferença entre doze mensalidades e o anual, e ela sai daqui para
   ninguém escrever à mão um número que depois muda de preço. */
export const economiaEmReais = () => {
  const mensal = PLANOS.find((p) => p.id === 'mensal');
  const anual = PLANOS.find((p) => p.id === 'anual');
  if (!mensal || !anual) return 0;
  return mensal.preco * 12 - anual.preco;
};

/** Quem não paga: o vínculo com clínica parceira é o que isenta, e é o
    que os Termos prometem na seção de assinatura. */
export const isento = (S: State) => clinicaConectada(S);

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
