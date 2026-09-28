/* GERADO por scripts/capturar-apresentacao.mjs — não edite à mão.
   As fotos das telas reais para a apresentação (app/apresentacao), por
   idioma e por pilar: o alto da tela e o cartão que salta dela. Rode o
   script de novo quando uma dessas telas mudar. */

export type PilarDaApresentacao = 'dose' | 'estado' | 'comida' | 'evolucao' | 'consultas' | 'companheiro';

/** o tamanho da foto da tela, em pontos: a largura do telefone e o alto que ela cobre */
export const LARGURA_DA_FOTO = 390;
export const ALTO_DA_FOTO = 700;

export type FotosDoPilar = { tela: number; peca: { src: number; w: number; h: number } };

export const TELAS_DA_APRESENTACAO: Record<string, Record<PilarDaApresentacao, FotosDoPilar>> = {
  'pt-BR': {
    dose: {
      tela: require('../../assets/apresentacao/dose-pt-BR.webp'),
      peca: { src: require('../../assets/apresentacao/dose-pt-BR-peca.webp'), w: 560, h: 186 },
    },
    estado: {
      tela: require('../../assets/apresentacao/estado-pt-BR.webp'),
      peca: { src: require('../../assets/apresentacao/estado-pt-BR-peca.webp'), w: 560, h: 160 },
    },
    comida: {
      tela: require('../../assets/apresentacao/comida-pt-BR.webp'),
      peca: { src: require('../../assets/apresentacao/comida-pt-BR-peca.webp'), w: 560, h: 282 },
    },
    evolucao: {
      tela: require('../../assets/apresentacao/evolucao-pt-BR.webp'),
      peca: { src: require('../../assets/apresentacao/evolucao-pt-BR-peca.webp'), w: 560, h: 282 },
    },
    consultas: {
      tela: require('../../assets/apresentacao/consultas-pt-BR.webp'),
      peca: { src: require('../../assets/apresentacao/consultas-pt-BR-peca.webp'), w: 560, h: 120 },
    },
    companheiro: {
      tela: require('../../assets/apresentacao/companheiro-pt-BR.webp'),
      peca: { src: require('../../assets/apresentacao/companheiro-pt-BR-peca.webp'), w: 560, h: 92 },
    },
  },
  'en-US': {
    dose: {
      tela: require('../../assets/apresentacao/dose-en-US.webp'),
      peca: { src: require('../../assets/apresentacao/dose-en-US-peca.webp'), w: 560, h: 186 },
    },
    estado: {
      tela: require('../../assets/apresentacao/estado-en-US.webp'),
      peca: { src: require('../../assets/apresentacao/estado-en-US-peca.webp'), w: 560, h: 160 },
    },
    comida: {
      tela: require('../../assets/apresentacao/comida-en-US.webp'),
      peca: { src: require('../../assets/apresentacao/comida-en-US-peca.webp'), w: 560, h: 282 },
    },
    evolucao: {
      tela: require('../../assets/apresentacao/evolucao-en-US.webp'),
      peca: { src: require('../../assets/apresentacao/evolucao-en-US-peca.webp'), w: 560, h: 282 },
    },
    consultas: {
      tela: require('../../assets/apresentacao/consultas-en-US.webp'),
      peca: { src: require('../../assets/apresentacao/consultas-en-US-peca.webp'), w: 560, h: 120 },
    },
    companheiro: {
      tela: require('../../assets/apresentacao/companheiro-en-US.webp'),
      peca: { src: require('../../assets/apresentacao/companheiro-en-US-peca.webp'), w: 560, h: 92 },
    },
  },
  'es-419': {
    dose: {
      tela: require('../../assets/apresentacao/dose-es-419.webp'),
      peca: { src: require('../../assets/apresentacao/dose-es-419-peca.webp'), w: 560, h: 186 },
    },
    estado: {
      tela: require('../../assets/apresentacao/estado-es-419.webp'),
      peca: { src: require('../../assets/apresentacao/estado-es-419-peca.webp'), w: 560, h: 160 },
    },
    comida: {
      tela: require('../../assets/apresentacao/comida-es-419.webp'),
      peca: { src: require('../../assets/apresentacao/comida-es-419-peca.webp'), w: 560, h: 282 },
    },
    evolucao: {
      tela: require('../../assets/apresentacao/evolucao-es-419.webp'),
      peca: { src: require('../../assets/apresentacao/evolucao-es-419-peca.webp'), w: 560, h: 282 },
    },
    consultas: {
      tela: require('../../assets/apresentacao/consultas-es-419.webp'),
      peca: { src: require('../../assets/apresentacao/consultas-es-419-peca.webp'), w: 560, h: 120 },
    },
    companheiro: {
      tela: require('../../assets/apresentacao/companheiro-es-419.webp'),
      peca: { src: require('../../assets/apresentacao/companheiro-es-419-peca.webp'), w: 560, h: 92 },
    },
  },
  'fr-FR': {
    dose: {
      tela: require('../../assets/apresentacao/dose-fr-FR.webp'),
      peca: { src: require('../../assets/apresentacao/dose-fr-FR-peca.webp'), w: 560, h: 186 },
    },
    estado: {
      tela: require('../../assets/apresentacao/estado-fr-FR.webp'),
      peca: { src: require('../../assets/apresentacao/estado-fr-FR-peca.webp'), w: 560, h: 160 },
    },
    comida: {
      tela: require('../../assets/apresentacao/comida-fr-FR.webp'),
      peca: { src: require('../../assets/apresentacao/comida-fr-FR-peca.webp'), w: 560, h: 282 },
    },
    evolucao: {
      tela: require('../../assets/apresentacao/evolucao-fr-FR.webp'),
      peca: { src: require('../../assets/apresentacao/evolucao-fr-FR-peca.webp'), w: 560, h: 282 },
    },
    consultas: {
      tela: require('../../assets/apresentacao/consultas-fr-FR.webp'),
      peca: { src: require('../../assets/apresentacao/consultas-fr-FR-peca.webp'), w: 560, h: 120 },
    },
    companheiro: {
      tela: require('../../assets/apresentacao/companheiro-fr-FR.webp'),
      peca: { src: require('../../assets/apresentacao/companheiro-fr-FR-peca.webp'), w: 560, h: 92 },
    },
  },
  'de-DE': {
    dose: {
      tela: require('../../assets/apresentacao/dose-de-DE.webp'),
      peca: { src: require('../../assets/apresentacao/dose-de-DE-peca.webp'), w: 560, h: 186 },
    },
    estado: {
      tela: require('../../assets/apresentacao/estado-de-DE.webp'),
      peca: { src: require('../../assets/apresentacao/estado-de-DE-peca.webp'), w: 560, h: 160 },
    },
    comida: {
      tela: require('../../assets/apresentacao/comida-de-DE.webp'),
      peca: { src: require('../../assets/apresentacao/comida-de-DE-peca.webp'), w: 560, h: 282 },
    },
    evolucao: {
      tela: require('../../assets/apresentacao/evolucao-de-DE.webp'),
      peca: { src: require('../../assets/apresentacao/evolucao-de-DE-peca.webp'), w: 560, h: 282 },
    },
    consultas: {
      tela: require('../../assets/apresentacao/consultas-de-DE.webp'),
      peca: { src: require('../../assets/apresentacao/consultas-de-DE-peca.webp'), w: 560, h: 120 },
    },
    companheiro: {
      tela: require('../../assets/apresentacao/companheiro-de-DE.webp'),
      peca: { src: require('../../assets/apresentacao/companheiro-de-DE-peca.webp'), w: 560, h: 92 },
    },
  },
  'it-IT': {
    dose: {
      tela: require('../../assets/apresentacao/dose-it-IT.webp'),
      peca: { src: require('../../assets/apresentacao/dose-it-IT-peca.webp'), w: 560, h: 186 },
    },
    estado: {
      tela: require('../../assets/apresentacao/estado-it-IT.webp'),
      peca: { src: require('../../assets/apresentacao/estado-it-IT-peca.webp'), w: 560, h: 160 },
    },
    comida: {
      tela: require('../../assets/apresentacao/comida-it-IT.webp'),
      peca: { src: require('../../assets/apresentacao/comida-it-IT-peca.webp'), w: 560, h: 282 },
    },
    evolucao: {
      tela: require('../../assets/apresentacao/evolucao-it-IT.webp'),
      peca: { src: require('../../assets/apresentacao/evolucao-it-IT-peca.webp'), w: 560, h: 282 },
    },
    consultas: {
      tela: require('../../assets/apresentacao/consultas-it-IT.webp'),
      peca: { src: require('../../assets/apresentacao/consultas-it-IT-peca.webp'), w: 560, h: 120 },
    },
    companheiro: {
      tela: require('../../assets/apresentacao/companheiro-it-IT.webp'),
      peca: { src: require('../../assets/apresentacao/companheiro-it-IT-peca.webp'), w: 560, h: 92 },
    },
  },
};
