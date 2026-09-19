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

/* ============================================================
   A IMAGEM DA CLÍNICA

   Duas peças diferentes, e as duas podem faltar:

   · `logo` é a marca, e aparece no quadrado ao lado do nome;
   · `foto` é a fachada ou a recepção, e aparece como faixa no alto.

   ⚠️ NENHUMA DAS DUAS EXISTE AINDA, e este mapa vazio é o lugar certo
   para elas — com os arquivos em `assets/images/clinicas/`, entram como
   duas linhas e as duas telas mudam juntas. Vazio, a tela cai nas
   iniciais e pula a faixa, sem buraco nenhum.

   ⚠️ E O MAPA É POR CLÍNICA, com o nome como chave. Enquanto houver uma
   clínica por pessoa isso é excesso; no dia em que a rede tiver várias, é
   o que impede a foto de uma aparecer na tela da outra. */
export const IMAGENS_DA_CLINICA: Record<string, { logo?: any; foto?: any }> = {
  /* ⚠️ FOTO DE ESTUDO, E SÓ EM __DEV__. O cabeçalho com imagem é metade
     do desenho da tela e não dá para julgá-lo com o mapa vazio — mas uma
     folha de acelga não é a recepção de ninguém, e ela não pode sair
     daqui. O `require` é estático, então o Metro resolve; o que o
     `__DEV__` tira é a ENTRADA do mapa, e em produção a tela cai no
     cabeçalho sem foto, que é o que ela vai fazer mesmo.

     Sai no dia em que a clínica mandar a dela. */
  ...(__DEV__ ? { 'Clínica Vitalis': { foto: require('../../assets/images/alimentacao-hero.jpg') } } : {}),
};

/** As duas primeiras iniciais: "Clínica Vitalis" dá "CV". É o que um logo
    ausente vira — e duas letras leem como marca, uma lê como falta. */
export const iniciaisDaClinica = (n: string) =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');

/** A inicial do nome, pulando o tratamento: "Dra. Helena Costa" dá "H". */
export const inicialDoNome = (n: string) =>
  (n.split(/\s+/).find((w) => !w.endsWith('.')) ?? n).charAt(0).toUpperCase();
