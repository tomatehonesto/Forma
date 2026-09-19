/* ============================================================
   OS RETRATOS DA EQUIPE

   ⚠️ MAPA ESCRITO À MÃO, e não montado por template.

   O Metro resolve `require` em tempo de compilação: `require(caminho)`
   com variável não existe, e um caminho para arquivo que não existe
   QUEBRA O BUILD — não degrada, não avisa, não cai no `catch`.

   Por isso só entra aqui quem já tem arquivo. Faltam Renata, Carla e
   Rafael; até chegarem, as três caem no círculo com a inicial. Quando
   chegarem, são três linhas — e nenhuma outra mudança em lugar nenhum.

   ⚠️ E ELE MORA AQUI, E NÃO NA TELA, porque são duas telas: o carrossel
   do hub e a ficha de cada pessoa. A mesma pessoa com retrato numa e
   inicial na outra é o tipo de diferença que ninguém descreve e todo
   mundo sente — e foi assim que a equipe já tinha sido escrita à mão
   dentro de um JSX uma vez.

   ⚠️ RETRATO ENVELHECE. São rostos numa tela que fala de profissionais de
   saúde: no dia em que a clínica mandar as fotos de verdade, elas entram
   por aqui e estas saem.
   ============================================================ */
export const RETRATOS: Record<string, any> = {
  responsavel: require('../../assets/images/especialista.png'),
};

/** A inicial do nome, pulando o tratamento: "Dra. Helena Costa" dá "H". */
export const inicialDoNome = (n: string) =>
  (n.split(/\s+/).find((w) => !w.endsWith('.')) ?? n).charAt(0).toUpperCase();
