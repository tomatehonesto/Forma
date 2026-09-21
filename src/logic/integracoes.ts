import { T } from '../textos';
import { Platform } from 'react-native';

/* ============================================================
   INTEGRAÇÕES — o que dá para ligar de verdade

   A lista desta tela tinha oito serviços e foi escrita de olho no que os
   apps de saúde costumam oferecer, e não no que ESTE app consegue
   receber. Três delas não podiam existir:

   GOOGLE FIT saiu. As APIs do Google Fit estão fechadas para novos
   cadastros desde maio de 2024 e só têm suporte até o fim de 2026 — o
   próprio Google manda migrar para o Health Connect. Não é uma
   integração que ainda não fizemos: é uma em que não dá mais nem para se
   inscrever.

   "BALANÇA INTELIGENTE" E "SMARTWATCH" saíram porque não são serviços,
   são CATEGORIAS DE APARELHO. Uma balança de wi-fi não fala com este app
   — ela fala com o app dela, que escreve no Apple Saúde ou no Health
   Connect, e é de lá que o número chega aqui. Oferecer as duas como
   chave própria fazia a pessoa procurar uma ligação que não existe, e
   escondia a única que resolve as duas.

   SOBRARAM DOIS CAMINHOS, e eles são diferentes em natureza:

   O APARELHO. Apple Saúde no iOS, Health Connect no Android. É um
   depósito local: o app pede permissão e lê, sem conta, sem senha, sem
   servidor. É por onde entra o que a balança, o relógio e os outros apps
   de saúde já registraram.

   AS CONTAS. Garmin, Fitbit e Withings têm API própria, com OAuth e
   entrega para um servidor — o serviço manda o dado para um endereço
   nosso, e não para o telefone. Sem esse servidor elas não se ligam, e a
   Garmin ainda pede aprovação no programa de parceiros dela antes de
   liberar acesso. Ficam na lista porque são reais e são o próximo passo,
   com o estado dizendo que ainda não estão de pé.
   ============================================================ */

export type Integracao = {
  id: string;
  nome: string;
  /** o que ela traz, na linguagem das telas que leem esses dados */
  traz: string;
  /** a cor da marca, para o quadrado ao lado do nome */
  cor: string;
  /** letra do quadrado, quando o serviço não tem desenho próprio nosso */
  letra?: string;
};

/* O DEPÓSITO DO APARELHO — um por sistema, e só o do sistema em que o
   app está rodando aparece. Oferecer o Apple Saúde a quem está num
   Android é uma chave que nunca vai ligar, e oferecer os dois é o app
   admitindo que não sabe em que aparelho está. */
/* A DESCRIÇÃO DIZ O QUE O APP LÊ HOJE, e não o que o depósito guarda.

   Ela prometia "peso, sono e treinos", e a leitura traz só o peso — ver
   o porquê em src/logic/saude-do-aparelho.ts. Descrição que promete três
   coisas e entrega uma é a que a pessoa cobra depois, e ela cobra com
   razão. */
/* ⚠️ É FUNÇÃO, porque lê o catálogo. Ver src/textos/README. */
export const APARELHO = (): Record<'ios' | 'android', Integracao> => ({
  ios: {
    id: 'appleHealth', nome: T.aviso.appleSaude, cor: '#F43B47',
    traz: T.aviso.trazPesagens,
  },
  android: {
    id: 'healthConnect', nome: 'Health Connect', cor: '#1A56DB',
    traz: T.aviso.trazPesagens,
  },
});

/* O que CADA UMA traria, no dia em que houver servidor. Aqui a promessa
   pode ser o que a API delas entrega, porque a linha não oferece ligar —
   ela diz o que está por vir. */
export const CONTAS: Integracao[] = [
  { id: 'garmin', nome: 'Garmin', traz: 'Treinos e frequência cardíaca', cor: '#0B2C3D', letra: 'G' },
  { id: 'fitbit', nome: 'Fitbit', traz: 'Sono e passos', cor: '#00B0B9', letra: 'F' },
  { id: 'withings', nome: 'Withings', traz: 'Balança e pressão', cor: '#00A3A1', letra: 'W' },
];

/* QUAL É O APARELHO. Fora de iOS e Android — o navegador, por exemplo —
   não há depósito de saúde nenhum para oferecer, e a tela mostra só as
   contas. */
export const aparelhoDaVez = (): Integracao | null =>
  Platform.OS === 'ios' ? APARELHO().ios : Platform.OS === 'android' ? APARELHO().android : null;
