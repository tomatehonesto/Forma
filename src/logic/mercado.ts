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

/** Existe rede de clínicas parceiras neste mercado? */
export const TEM_REDE_PARCEIRA = true;
