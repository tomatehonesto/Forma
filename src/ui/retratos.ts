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
export type Retrato = {
  src: any;
  /* ⚠️ O PONTO DE FOCO, E ELE EXISTE PORQUE FOTO NÃO SE ENQUADRA SOZINHA.

     O aplicativo corta a mesma imagem em cinco tamanhos: a pilha de 30px
     da aba Cuidado, o quadrado de 48 da lista da clínica, o de 76 da área
     médica e o cabeçalho de 330. Em todos eles o corte é `cover`, e `cover`
     precisa saber que pedaço manter.

     'topo' é o certo para retrato de estúdio, com o rosto no terço de
     cima — que é o enquadramento de três das quatro fotos aqui. 'centro'
     é o certo para foto de ambiente, com a pessoa sentada no meio do
     quadro. Medido na responsável: pelo topo o rosto dela cai a 51% do
     cabeçalho, dentro da faixa que a página cobre; pelo centro sobe para
     31% e fica limpo. Nas outras três é o contrário — pelo centro o corte
     quadrado come a testa.

     Era um `contentPosition` escrito à mão em cada tela, e cada tela
     escolhia um. Aqui ele vive junto da imagem que descreve, que é o
     único lugar onde a resposta é a mesma em todas elas.

     ⚠️ E ISTO NÃO SUBSTITUI O RECORTE NO ENVIO. Escolher entre duas
     posições à mão resolve ESTAS quatro fotos; mil fotos de mil clínicas
     pedem um recortador na hora do upload — continua em PENDENCIAS. */
  foco?: 'topo' | 'centro';
};

export const RETRATOS: Record<string, Retrato> = {
  responsavel: { src: require('../../assets/images/equipe/responsavel.jpg'), foco: 'centro' },
  renata: { src: require('../../assets/images/equipe/renata.jpg') },
  carla: { src: require('../../assets/images/equipe/carla.jpg') },
  rafael: { src: require('../../assets/images/equipe/rafael.jpg') },
};

/** A imagem de quem tem, e `undefined` para quem não tem. */
export const fotoDe = (id?: string) => (id ? RETRATOS[id]?.src : undefined);

/** Onde ancorar o corte. Sem resposta, o topo — é o enquadramento da
    maioria dos retratos profissionais, e errar para cima corta o queixo,
    enquanto errar para baixo corta os olhos. */
export const focoDe = (id?: string) =>
  (id && RETRATOS[id]?.foco === 'centro' ? 'center' : 'top center');

/* ⚠️ E AGORA É UMA FOTO, E ERA UM RECORTE EM PNG.

   A troca não é de arquivo, é de premissa. O recorte vinha com fundo
   transparente e a pessoa inteira dentro do quadro: a ficha podia
   desenhar um degradê atrás dela, encaixá-la `contain` e escrever o nome
   por cima, porque o rodapé da imagem era o degradê e não a foto.

   Ninguém manda recorte. O que chega de uma clínica é o que a assessoria
   tirou: a pessoa sentada numa poltrona, fora do centro, com planta,
   janela e parede. Projetar em cima do recorte era projetar para o único
   caso que não vai acontecer — então o recorte saiu, e o desenho passou a
   ser o da foto comum.

   ⚠️ ISTO CONTINUA SENDO SEMENTE. São rostos reais numa tela que fala de
   profissionais de saúde: no dia em que a clínica mandar as fotos dela,
   estas saem. */

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
  /* ⚠️ FOTO DE SEMENTE, do mesmo tipo dos retratos acima: é uma sala de
     verdade que não é a desta clínica. Ela existe porque o cabeçalho com
     imagem é metade do desenho da tela e não dá para julgá-lo com o mapa
     vazio — e sai no dia em que a clínica mandar a dela. */
  'Clínica Vitalis': { foto: require('../../assets/images/clinicas/vitalis.jpg') },
};

/* ============================================================
   AS IMAGENS DA REDE PARCEIRA — ver logic/rede

   Do portal vem o ENDEREÇO da foto, e a tela a carrega de lá. Na lista de
   exemplo, que só existe em desenvolvimento, não há endereço nenhum: as
   imagens são as mesmas da semente, emprestadas para a vitrine poder ser
   julgada com rosto.

   ⚠️ O RETRATO DO RAFAEL NÃO ENTRA AQUI. O jaleco dele tem outro nome
   bordado — é a foto de um médico de verdade —, e emprestá-la a um médico
   inventado, com CRM inventado, seria pôr o rosto de alguém num registro
   que não é dele. Ele fica na inicial. Ver PENDENCIAS, item 34.
   ============================================================ */
const RETRATOS_DE_EXEMPLO: Record<string, string> = {
  'beatriz-lemos': 'responsavel',
  'marina-duarte': 'renata',
  'camila-arantes': 'carla',
};
/* ⚠️ AS FOTOS DAS CLÍNICAS DE EXEMPLO SÃO DO UNSPLASH, com licença livre
   e a origem de cada uma em assets/images/CREDITOS.txt — e nenhuma é da
   clínica que ela ilustra, que também não existe. A da Lemos é a da
   semente (a sala da Vitalis). Saem todas quando o portal mandar as
   fotos de verdade; ver PENDENCIAS, item 34. */
const CLINICAS_DE_EXEMPLO: Record<string, { foto?: any }> = {
  lemos: { foto: require('../../assets/images/clinicas/vitalis.jpg') },
  ibirapuera: { foto: require('../../assets/images/clinicas/ibirapuera.jpg') },
  santana: { foto: require('../../assets/images/clinicas/santana.jpg') },
  paulista: { foto: require('../../assets/images/clinicas/paulista.jpg') },
  'julia-tavares': { foto: require('../../assets/images/clinicas/julia-tavares.jpg') },
  botafogo: { foto: require('../../assets/images/clinicas/botafogo.jpg') },
  barra: { foto: require('../../assets/images/clinicas/barra.jpg') },
  savassi: { foto: require('../../assets/images/clinicas/savassi.jpg') },
};

/** A foto de quem está na rede: a do portal, ou a de exemplo em desenvolvimento. */
export const fotoDaRede = (p?: { id: string; foto?: string }) =>
  (!p ? undefined : p.foto ? { uri: p.foto } : __DEV__ ? fotoDe(RETRATOS_DE_EXEMPLO[p.id]) : undefined);

export const focoDaRede = (p?: { id: string; foto?: string }) =>
  (p && !p.foto ? focoDe(RETRATOS_DE_EXEMPLO[p.id]) : 'top center');

/* ⚠️ O PAPEL DE RESPONSÁVEL PODE TER VINDO DA REDE, e aí o rosto é o de
   quem passou o código — e não o da semente. `responsavel` tem retrato
   fixo porque a semente tem uma responsável só; quem se conecta pelo
   código de uma clínica da rede ganha outra pessoa nesse papel, e o
   retrato fixo poria o rosto de uma ao lado do nome de outra. Sem retrato
   na rede, a inicial — que é o que a vitrine já mostra para ela. */
type ComVinculo = { profile?: any };

const daRedeNoPapel = (S: ComVinculo | undefined, id?: string) => {
  const v = id === 'responsavel'
    ? (S?.profile?.vinculo as { profissional?: string; retrato?: string } | null | undefined)
    : undefined;
  return v?.profissional ? { id: v.profissional, foto: v.retrato } : undefined;
};

/** A foto de alguém da equipe da pessoa, pelo papel ou pelo id. */
export const fotoDaEquipe = (S: ComVinculo | undefined, id?: string) => {
  const r = daRedeNoPapel(S, id);
  return r ? fotoDaRede(r) : fotoDe(id);
};

export const focoDaEquipe = (S: ComVinculo | undefined, id?: string) => {
  const r = daRedeNoPapel(S, id);
  return r ? focoDaRede(r) : focoDe(id);
};

/** A foto e a marca de uma clínica da rede — as duas podem faltar. */
export const imagensDaRede = (c: { id: string; foto?: string; logo?: string }): { foto?: any; logo?: any } => ({
  foto: c.foto ? { uri: c.foto } : __DEV__ ? CLINICAS_DE_EXEMPLO[c.id]?.foto : undefined,
  logo: c.logo ? { uri: c.logo } : undefined,
});

/** As duas primeiras iniciais: "Clínica Vitalis" dá "CV". É o que um logo
    ausente vira — e duas letras leem como marca, uma lê como falta. */
export const iniciaisDaClinica = (n: string) =>
  n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');

/** A inicial do nome, pulando o tratamento: "Dra. Helena Costa" dá "H". */
export const inicialDoNome = (n: string) =>
  (n.split(/\s+/).find((w) => !w.endsWith('.')) ?? n).charAt(0).toUpperCase();
