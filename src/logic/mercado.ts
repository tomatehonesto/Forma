/* ============================================================
   O MERCADO — o que existe onde o aplicativo está

   A rede de clínicas parceiras é brasileira. O aplicativo vai rodar em
   outros países, e lá ela não existe: não há convite, não há isenção por
   vínculo, não há plataforma do outro lado. Nada disso pode aparecer numa
   tela para quem nunca vai poder usar.

   ⚠️ É UM INTERRUPTOR, E NÃO UMA DETECÇÃO. Ele não olha o idioma do
   telefone nem a loja de origem: um brasileiro morando fora continua
   podendo ter a clínica daqui, e adivinhar isso pelo aparelho erraria
   justamente com quem tem mais a perder. Quando houver mais de um
   mercado, o valor vem da configuração da build.

   O QUE ELE DESLIGA é só a porta de entrada — o convite e a vitrine dos
   parceiros. Quem já tem vínculo continua tendo: `clinicaConectada` não
   passa por aqui, porque desligar a plataforma de quem já está nela seria
   tirar o acesso, e não esconder uma oferta.

   Ver MODOS.md, na raiz do projeto.
   ============================================================ */

export type Mercado = 'br' | 'us';

/* ⚠️ A TABELA DE ALIMENTOS TAMBÉM SAIU DAQUI. Ela foi a segunda coisa
   que o mercado decidia — uma base por lugar, a TACO aqui e a americana
   lá —, e virou uma lista só, para todo país, com o nome de cada comida
   nos seis idiomas (logic/alimentos). Quem está na França não cai mais
   na lista brasileira com os nomes em português. */
export const MERCADO: Mercado = 'br';

/* ⚠️ A REDE SAIU DAQUI, e é a segunda coisa que este arquivo perdeu para
   logic/pais. Ela era `MERCADO === 'br'`, uma constante de build; agora
   é `temRedeParceira()`, que segue a resposta da pessoa — um brasileiro
   que se muda continua tendo a clínica daqui, que é exatamente o caso que
   o comentário do alto deste arquivo já defendia.

   O que sobrou aqui é o PADRÃO: de onde o país e o idioma partem quando
   ninguém respondeu nada ainda. */
