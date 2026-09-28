/* GERADO por scripts/capturar-apresentacao.mjs — não edite à mão.
   As fotos das telas reais para a apresentação (app/apresentacao), por
   idioma e por pilar: o alto da tela. Rode o script de novo quando uma
   dessas telas mudar. */

export type PilarDaApresentacao = 'dose' | 'estado' | 'comida' | 'evolucao' | 'consultas' | 'companheiro';

/** o tamanho da foto da tela, em pontos: a largura do telefone e o alto que ela cobre */
export const LARGURA_DA_FOTO = 390;
export const ALTO_DA_FOTO = 730;

export const TELAS_DA_APRESENTACAO: Record<string, Record<PilarDaApresentacao, number>> = {
  'pt-BR': {
    dose: require('../../assets/apresentacao/dose-pt-BR.webp'),
    estado: require('../../assets/apresentacao/estado-pt-BR.webp'),
    comida: require('../../assets/apresentacao/comida-pt-BR.webp'),
    evolucao: require('../../assets/apresentacao/evolucao-pt-BR.webp'),
    consultas: require('../../assets/apresentacao/consultas-pt-BR.webp'),
    companheiro: require('../../assets/apresentacao/companheiro-pt-BR.webp'),
  },
  'en-US': {
    dose: require('../../assets/apresentacao/dose-en-US.webp'),
    estado: require('../../assets/apresentacao/estado-en-US.webp'),
    comida: require('../../assets/apresentacao/comida-en-US.webp'),
    evolucao: require('../../assets/apresentacao/evolucao-en-US.webp'),
    consultas: require('../../assets/apresentacao/consultas-en-US.webp'),
    companheiro: require('../../assets/apresentacao/companheiro-en-US.webp'),
  },
  'es-419': {
    dose: require('../../assets/apresentacao/dose-es-419.webp'),
    estado: require('../../assets/apresentacao/estado-es-419.webp'),
    comida: require('../../assets/apresentacao/comida-es-419.webp'),
    evolucao: require('../../assets/apresentacao/evolucao-es-419.webp'),
    consultas: require('../../assets/apresentacao/consultas-es-419.webp'),
    companheiro: require('../../assets/apresentacao/companheiro-es-419.webp'),
  },
  'fr-FR': {
    dose: require('../../assets/apresentacao/dose-fr-FR.webp'),
    estado: require('../../assets/apresentacao/estado-fr-FR.webp'),
    comida: require('../../assets/apresentacao/comida-fr-FR.webp'),
    evolucao: require('../../assets/apresentacao/evolucao-fr-FR.webp'),
    consultas: require('../../assets/apresentacao/consultas-fr-FR.webp'),
    companheiro: require('../../assets/apresentacao/companheiro-fr-FR.webp'),
  },
  'de-DE': {
    dose: require('../../assets/apresentacao/dose-de-DE.webp'),
    estado: require('../../assets/apresentacao/estado-de-DE.webp'),
    comida: require('../../assets/apresentacao/comida-de-DE.webp'),
    evolucao: require('../../assets/apresentacao/evolucao-de-DE.webp'),
    consultas: require('../../assets/apresentacao/consultas-de-DE.webp'),
    companheiro: require('../../assets/apresentacao/companheiro-de-DE.webp'),
  },
  'it-IT': {
    dose: require('../../assets/apresentacao/dose-it-IT.webp'),
    estado: require('../../assets/apresentacao/estado-it-IT.webp'),
    comida: require('../../assets/apresentacao/comida-it-IT.webp'),
    evolucao: require('../../assets/apresentacao/evolucao-it-IT.webp'),
    consultas: require('../../assets/apresentacao/consultas-it-IT.webp'),
    companheiro: require('../../assets/apresentacao/companheiro-it-IT.webp'),
  },
};
