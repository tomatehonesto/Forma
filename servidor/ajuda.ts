/* ============================================================
   OS NÚMEROS DE AJUDA, POR PAÍS

   A IA é um consultor global (docs/revisao-clinica/2026-10-01-auditoria-
   da-base.md): a orientação clínica é uma só, e o país só entra no que é
   fato local. Telefone é o fato local mais perigoso de errar — o CVV 188
   não atende ninguém em Lisboa —, e por isso ele não mora na base nem na
   memória do modelo: sai desta tabela, conferida nas fontes oficiais, e
   vai no bloco da pessoa.

   ⚠️ SÓ ENTRA NÚMERO CONFERIDO NUMA FONTE OFICIAL ABERTA. A fonte de
   cada um está em `FONTES`.

   ⚠️ SÓ CRISE E EMERGÊNCIA (decidido pelo dono em 01/10/2026). São os
   dois momentos em que procurar o número é o passo que a pessoa não vai
   dar. A toxicologia (dose a mais por engano) fica genérica em todo
   lugar — "o centro de toxicologia ou quem prescreve" —: é menos
   urgente, e França, Alemanha e Itália nem têm um número nacional.

   ⚠️ SEM PAÍS, NENHUM NÚMERO. O bloco diz "não informado" e a IA fala
   "o serviço de emergência do seu país". Inventar o país custa mais do
   que não dar o número.
   ============================================================ */

export type Numero = { numero: string; nome: string; nota?: string };
export type Ajuda = {
  emergencia: Numero | null;
  crise: (Numero & { h24: boolean }) | null;
};

/* Conferidos em 01/10/2026 (docs/revisao-clinica/numeros-de-ajuda.md). Portugal: o
   número está no gov.pt, mas as 24 horas vêm de imprensa, e por isso não
   são ditas; conferir no site do SNS 24 antes de publicar. */
export const NUMEROS: Record<string, Ajuda> = {
  BR: {
    emergencia: { numero: '192', nome: 'SAMU' },
    crise: { numero: '188', nome: 'CVV', h24: true },
  },
  PT: {
    emergencia: { numero: '112', nome: 'Número Europeu de Emergência' },
    crise: { numero: '808 24 24 24', nome: 'SNS 24, aconselhamento psicológico (opção 4)', h24: false },
  },
  US: {
    emergencia: { numero: '911', nome: '911' },
    crise: { numero: '988', nome: '988 Suicide & Crisis Lifeline', h24: true },
  },
  CA: {
    emergencia: { numero: '911', nome: '9-1-1' },
    crise: { numero: '988', nome: '9-8-8 Suicide Crisis Helpline', h24: true },
  },
  GB: {
    emergencia: { numero: '999', nome: 'emergency' },
    crise: { numero: '116 123', nome: 'Samaritans', h24: true },
  },
  IE: {
    emergencia: { numero: '112 ou 999', nome: 'emergência' },
    crise: { numero: '116 123', nome: 'Samaritans Ireland', h24: true },
  },
  AU: {
    emergencia: { numero: '000', nome: 'Triple Zero' },
    crise: { numero: '13 11 14', nome: 'Lifeline', h24: true },
  },
  MX: {
    emergencia: { numero: '911', nome: '911' },
    crise: { numero: '800 911 2000', nome: 'Línea de la Vida', h24: true },
  },
  AR: {
    emergencia: { numero: '911', nome: 'emergencias' },
    crise: { numero: '0800 999 0091', nome: 'Línea de Salud Mental', h24: true },
  },
  CO: {
    emergencia: { numero: '123', nome: 'Línea 123' },
    crise: { numero: '106', nome: 'Línea 106 de salud mental', h24: true },
  },
  CL: {
    emergencia: { numero: '131', nome: 'SAMU' },
    crise: { numero: '*4141', nome: 'Línea de Prevención del Suicidio', h24: true },
  },
  PE: {
    emergencia: { numero: '106', nome: 'SAMU', nota: 'em Lima e em 16 regiões; fora delas, os Bombeiros, 116' },
    crise: { numero: '113', nome: 'Línea 113 Salud, opción 5 (salud mental)', h24: true },
  },
  UY: {
    emergencia: { numero: '911', nome: '911' },
    crise: { numero: '0800 0767', nome: 'Línea Vida', nota: 'ou *0767 do celular', h24: true },
  },
  ES: {
    emergencia: { numero: '112', nome: '112' },
    crise: { numero: '024', nome: 'Línea 024', h24: true },
  },
  FR: {
    emergencia: { numero: '15', nome: 'SAMU' },
    crise: { numero: '3114', nome: 'numéro national de prévention du suicide', h24: true },
  },
  BE: {
    emergencia: { numero: '112', nome: 'urgences' },
    crise: { numero: '0800 32 123', nome: 'Centre de Prévention du Suicide (em francês)', nota: 'em neerlandês, Zelfmoordlijn 1813', h24: true },
  },
  CH: {
    emergencia: { numero: '144', nome: 'ambulância' },
    crise: { numero: '143', nome: 'Die Dargebotene Hand / La Main Tendue', h24: true },
  },
  LU: {
    emergencia: { numero: '112', nome: 'urgences' },
    crise: { numero: '45 45 45', nome: 'SOS Détresse', nota: 'das 11h às 23h (sexta e sábado até as 3h); fora desse horário, 112', h24: false },
  },
  IT: {
    emergencia: { numero: '112', nome: 'Numero Unico di Emergenza' },
    crise: { numero: '02 2327 2327', nome: 'Telefono Amico', h24: true },
  },
  DE: {
    emergencia: { numero: '112', nome: 'Rettungsdienst' },
    crise: { numero: '0800 111 0 111', nome: 'TelefonSeelsorge', nota: 'ou 0800 111 0 222', h24: true },
  },
  AT: {
    emergencia: { numero: '144', nome: 'Rettung' },
    crise: { numero: '142', nome: 'Telefonseelsorge', h24: true },
  },
};

export const FONTES: Record<string, string[]> = {
  BR: ['https://www.gov.br/saude/pt-br/composicao/saes/samu-192', 'https://cvv.org.br/', 'https://www.gov.br/anvisa/pt-br/assuntos/agrotoxicos/disque-intoxicacao'],
  PT: ['https://digital-strategy.ec.europa.eu/en/policies/112', 'https://www.gov.pt/noticias/linha-de-aconselhamento-psicologico-do-sns-24-disponivel-em-ingles', 'https://www.rtp.pt/noticias/pais/linha-de-aconselhamento-psicologico-atendeu-perto-de-meio-milhao-de-chamadas-em-seis-anos_n1730886', 'https://www.rtp.pt/noticias/pais/centro-de-informacao-antivenenos-realizou-cerca-de-70-consultas-diarias-em-2022_n1468383'],
  US: ['https://www.911.gov/', 'https://988lifeline.org/', 'https://www.poison.org/'],
  CA: ['https://988.ca/', 'https://www.canada.ca/en/health-canada/news/2023/03/canada-launches-new-toll-free-1-844-poison-x-number-for-poison-centres.html', 'https://www.aboutkidshealth.ca/poison-information-centres-in-canada'],
  GB: ['https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/', 'https://www.samaritans.org/how-we-can-help/contact-samaritan/', 'https://www.nhs.uk/conditions/poisoning/'],
  IE: ['https://112.ie/making-an-emergency-call/', 'https://www.samaritans.org/samaritans-ireland/', 'https://www.poisons.ie/'],
  AU: ['https://www.healthdirect.gov.au/poisoning', 'https://www.lifeline.org.au/'],
  MX: ['https://www.gob.mx/911', 'https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000', 'https://www.gob.mx/conasama/prensa/linea-de-la-vida-celebra-25-anos-de-servicio-humano-para-poblacion-con-problemas-de-salud-mental'],
  AR: ['https://www.argentina.gob.ar/node/9642', 'https://www.argentina.gob.ar/dispositivo-0800', 'https://www.argentina.gob.ar/node/145981'],
  CO: ['https://www.policia.gov.co/noticia/policia-nacional-sensibiliza-comunidad-sobre-uso-las-lineas-emergencia-123-155', 'https://www.fomag.gov.co/wp-content/uploads/2026/06/directorio-salud-mental-prevencion-suicidio-minsalud-4-11.pdf', 'https://minsalud.gov.co/salud/prestacion-servicios/Paginas/linea-nacional-de-toxicologia.aspx'],
  CL: ['https://www.camara.cl/cms/2024/06/11/exponen-problematica-de-la-atencion-de-urgencia-en-comision-de-zonas-extremas/', 'https://www.ventanillaunicasocial.gob.cl/ficha/310/fono-prevencion-suicidio', 'https://www.cituc.cl/', 'https://cituc.uc.cl/quienes-somos/'],
  PE: ['https://www.gob.pe/547', 'https://www.gob.pe/555'],
  UY: ['https://www.gub.uy/tramites/sanciones-llamadas-maliciosas-servicio-emergencia', 'https://www.gub.uy/ministerio-salud-publica/comunicacion/noticias/same-105-se-integro-centro-comando-unificado-para-fortalecer-atencion', 'https://www.gub.uy/ministerio-salud-publica/comunicacion/noticias/indice-suicidios-se-mantuvo-estable-2018-2025-cada-100000-habitantes', 'https://toxicologia.hc.edu.uy/index.php%3Foption=com_content&view=article&id=72:ciat&catid=42&Itemid=75.html'],
  ES: ['https://digital-strategy.ec.europa.eu/en/policies/112', 'https://www.sanidad.gob.es/linea024/home.htm', 'https://www.mjusticia.gob.es/es/institucional/organismos/instituto-nacional/servicios/servicio-informacion/servicio-informacion1'],
  FR: ['https://www.service-public.gouv.fr/particuliers/vosdroits/F33954', 'https://3114.fr/', 'https://www.centres-antipoison.net/'],
  BE: ['https://www.112.be/fr', 'https://www.preventionsuicide.be/la-ligne-decoute-0800-32-123', 'https://www.zelfmoord1813.be/', 'https://www.centreantipoisons.be/a-propos'],
  CH: ['https://www.zh.ch/de/migration-integration/willkommen/deutsch/notfaelle.html', 'https://www.143.ch/', 'https://www.toxinfo.ch/'],
  LU: ['https://112.public.lu/', 'https://454545.lu/notre-offre/telephone/', 'https://www.centreantipoisons.be/a-propos', 'https://findahelpline.com/countries/lu'],
  IT: ['https://digital-strategy.ec.europa.eu/en/policies/112', 'https://www.regione.lombardia.it/sanita/emergenze-e-urgenze/chiaamta-del-soccorso-sanitario-where-areu-112-salutile-pronto-soccorso', 'https://www.telefonoamico.it/', 'https://www.iss.it/en/consigli-al-consumatore/-/asset_publisher/JHgxEFj4YPn0/content/centri-antiveleni-e-intossicazioni-da-sostanze-chimiche'],
  DE: ['https://gesund.bund.de/gesundheitsversorgung/beratung-und-hilfe', 'https://www.telefonseelsorge.de/', 'https://www.bfr.bund.de/en/chemical-safety/product-notifications-and-poisonings/posion-control-centres/', 'https://www.gesundheit.gv.at/service/notruf/deutschsprachige-giftinformationszentralen.html'],
  AT: ['https://www.gesundheit.gv.at/service/notruf/vergiftungsinformationszentrale.html', 'https://www.gesundheit.gv.at/service/notruf/deutschsprachige-giftinformationszentralen.html', 'https://www.telefonseelsorge.at/'],
};

/** O país que chegou no pedido: duas letras maiúsculas, ou null. */
export const lerPais = (p: unknown): string | null =>
  typeof p === 'string' && /^[A-Z]{2}$/.test(p) ? p : null;

/* ⚠️ O PALPITE PELO IDIOMA SÓ VALE QUANDO O CAMPO NÃO VEIO. O aplicativo
   manda `pais` sempre — a região do aparelho, ou null quando não sabe.
   O campo ausente é de quem ainda não manda: a avaliação
   (scripts/avaliacao, travada) e um build antigo. Para eles, o idioma do
   pedido dá o país mais provável, e é o mesmo comportamento de antes
   (o CVV em português). Null do aplicativo continua sendo "não sei". */
const PALPITE_DO_IDIOMA: Record<string, string> = {
  'pt-BR': 'BR', 'en-US': 'US', 'fr-FR': 'FR', 'de-DE': 'DE', 'it-IT': 'IT',
};
export const paisDoPedido = (corpo: any, idioma: string): string | null =>
  corpo && 'pais' in corpo ? lerPais(corpo.pais) : PALPITE_DO_IDIOMA[idioma] ?? null;

const nomeDoPais = (p: string) => {
  try {
    return new Intl.DisplayNames(['pt-BR'], { type: 'region' }).of(p) ?? p;
  } catch {
    return p;
  }
};

/** O bloco que vai junto do resumo da pessoa: o país e os números dele. */
const TOXICOLOGIA = '- dose a mais por engano: "o centro de toxicologia do seu país ou quem prescreve", sem número.';
const SEM_NUMERO = 'Não dite telefone: diga "o serviço de emergência do seu país" ou "a linha de apoio emocional do seu país".';

export function blocoDeAjuda(pais: string | null): string {
  if (!pais) {
    return ['PAÍS DA PESSOA: não informado.', `NÚMEROS DE AJUDA: nenhum. ${SEM_NUMERO}`, TOXICOLOGIA].join('\n');
  }
  const a = NUMEROS[pais];
  const linhas = [`PAÍS DA PESSOA: ${nomeDoPais(pais)} (${pais}).`];
  if (!a) {
    linhas.push(`NÚMEROS DE AJUDA: nenhum conferido para este país. ${SEM_NUMERO}`, TOXICOLOGIA);
    return linhas.join('\n');
  }
  linhas.push('NÚMEROS DE AJUDA DESTE PAÍS (use só estes):');
  linhas.push(`- emergência: ${a.emergencia ? `${a.emergencia.nome}, ${a.emergencia.numero}${a.emergencia.nota ? ` (${a.emergencia.nota})` : ""}` : 'não conferido; diga "o serviço de emergência do seu país"'}`);
  linhas.push(`- apoio emocional: ${a.crise ? `${a.crise.nome}, ${a.crise.numero}${a.crise.h24 ? ' (24 horas)' : ''}${a.crise.nota ? ` (${a.crise.nota})` : ''}` : 'não conferido; diga "a linha de apoio emocional do seu país"'}`);
  linhas.push(TOXICOLOGIA);
  return linhas.join('\n');
}
