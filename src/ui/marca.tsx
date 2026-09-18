import React from 'react';
import Svg, { Path } from 'react-native-svg';

/* ============================================================
   A MARCA

   Os caminhos vêm do SVG oficial, copiados sem retoque — símbolo e
   letreiro. Antes disto havia aqui um redesenho a olho, feito a partir de
   uma imagem: acertava a silhueta e errava todo o resto, que é o tipo de
   erro que passa despercebido num app e salta impresso ao lado do
   original. Marca não se aproxima.

   `LOCKUP` é a caixa do arquivo inteiro — símbolo mais letreiro. `SIMBOLO`
   é a do símbolo sozinho, que por acaso começa na origem: o M ocupa de
   (0,0) a (533,222) dentro do mesmo desenho, então o mesmo `d` serve para
   os dois, só muda a viewBox.

   O SÍMBOLO SERVE TAMBÉM DE CONTORNO, sem preenchimento e com o traço
   apagado: é o que a abertura usa como fundo. Uma marca gigante e vazada
   atrás do conteúdo é textura que continua sendo a marca — ao contrário
   de arcos e réguas emprestados de outro app, que eram só enfeite.
   ============================================================ */

/** o M, em duas partes: a onda da esquerda e o ombro da direita */
const D_SIMBOLO = 'M203.376 0C205.033 0 206.372 1.34348 206.417 2.9997C206.783 16.2343 209.567 29.2994 214.64 41.5469C220.096 54.7188 228.093 66.6872 238.174 76.7686C248.255 86.8499 260.224 94.8467 273.396 100.303C286.567 105.759 300.685 108.567 314.942 108.567V214.135C314.942 215.792 313.599 217.137 311.942 217.114C284.449 216.734 257.268 211.136 231.849 200.606C205.505 189.694 181.568 173.7 161.405 153.537C141.243 133.374 125.249 109.438 114.337 83.0938C107.155 65.7547 102.267 47.5962 99.7646 29.0781V218.047C99.7646 219.704 98.4215 221.047 96.7646 221.047H3C1.34315 221.047 0 219.704 0 218.047V3C0 1.34315 1.34315 0 3 0H203.376ZM314.942 3C314.942 1.34314 316.286 -0.00216601 317.942 0.0207247C345.436 0.4006 372.616 5.99922 398.036 16.5283C424.38 27.4403 448.318 43.4349 468.48 63.5977C488.643 83.7604 504.637 107.697 515.549 134.041C526.078 159.461 531.677 186.642 532.056 214.135C532.079 215.791 530.734 217.135 529.077 217.135H426.51C424.853 217.135 423.514 215.791 423.468 214.135C423.103 200.9 420.319 187.835 415.246 175.588C409.79 162.416 401.792 150.448 391.711 140.366C381.63 130.285 369.661 122.287 356.489 116.831C343.317 111.375 329.199 108.567 314.942 108.567V3Z';

/** o letreiro, uma letra por caminho */
const D_LETREIRO = [
  'M1413.27 213V83.2801H1432.86V213H1413.27ZM1422.93 55.1281C1419.25 55.1281 1416.12 53.8401 1413.54 51.2641C1410.97 48.5041 1409.68 45.2841 1409.68 41.6041C1409.68 37.7401 1410.97 34.5201 1413.54 31.9441C1416.12 29.3681 1419.25 28.0801 1422.93 28.0801C1426.98 28.0801 1430.2 29.3681 1432.59 31.9441C1435.16 34.5201 1436.45 37.7401 1436.45 41.6041C1436.45 45.2841 1435.16 48.5041 1432.59 51.2641C1430.2 53.8401 1426.98 55.1281 1422.93 55.1281Z',
  'M1357.53 213V136.824C1357.53 125.416 1354.13 116.216 1347.32 109.224C1340.69 102.048 1331.86 98.4598 1320.82 98.4598C1313.28 98.4598 1306.65 100.116 1300.95 103.428C1295.25 106.74 1290.74 111.248 1287.43 116.952C1284.11 122.656 1282.46 129.188 1282.46 136.548L1273.63 131.58C1273.63 121.828 1275.93 113.088 1280.53 105.36C1285.13 97.6318 1291.29 91.5598 1299.02 87.1438C1306.93 82.7278 1315.95 80.5198 1326.07 80.5198C1336 80.5198 1344.83 82.8198 1352.56 87.4198C1360.29 91.8358 1366.27 97.9998 1370.5 105.912C1374.92 113.824 1377.13 123.024 1377.13 133.512V213H1357.53ZM1263.14 213V17.5918H1282.46V213H1263.14Z',
  'M1168.76 215.76C1158.82 215.76 1149.9 213.736 1141.99 209.688C1134.07 205.64 1127.54 200.12 1122.39 193.128C1117.42 185.952 1114.39 177.672 1113.28 168.288V127.716C1114.39 118.148 1117.51 109.868 1122.67 102.876C1127.82 95.6995 1134.35 90.1795 1142.26 86.3155C1150.36 82.4515 1159.19 80.5195 1168.76 80.5195C1180.72 80.5195 1191.48 83.5555 1201.05 89.6275C1210.62 95.5155 1218.16 103.612 1223.68 113.916C1229.39 124.036 1232.24 135.536 1232.24 148.416C1232.24 161.112 1229.48 172.52 1223.96 182.64C1218.44 192.76 1210.8 200.856 1201.05 206.928C1191.48 212.816 1180.72 215.76 1168.76 215.76ZM1101.69 267.648V83.2795H1121.01V116.4L1117.15 147.864L1121.01 179.604V267.648H1101.69ZM1165.45 197.268C1174.65 197.268 1182.74 195.244 1189.73 191.196C1196.73 186.964 1202.15 181.168 1206.02 173.808C1210.07 166.264 1212.09 157.708 1212.09 148.14C1212.09 138.388 1210.07 129.832 1206.02 122.472C1202.15 115.112 1196.73 109.316 1189.73 105.084C1182.74 100.852 1174.74 98.7355 1165.72 98.7355C1156.71 98.7355 1148.7 100.852 1141.71 105.084C1134.9 109.316 1129.57 115.112 1125.7 122.472C1121.84 129.832 1119.91 138.388 1119.91 148.14C1119.91 157.708 1121.84 166.264 1125.7 173.808C1129.57 181.168 1134.9 186.964 1141.71 191.196C1148.52 195.244 1156.43 197.268 1165.45 197.268Z',
  'M991.182 213V83.2795H1010.5V213H991.182ZM1010.5 137.376L1002.5 133.788C1002.5 117.412 1006.45 104.44 1014.37 94.8715C1022.46 85.3035 1033.5 80.5195 1047.49 80.5195C1053.93 80.5195 1059.81 81.7155 1065.15 84.1075C1070.49 86.3155 1075.45 89.9035 1080.05 94.8715L1067.36 108.396C1064.23 104.9 1060.73 102.416 1056.87 100.944C1053.19 99.4715 1048.96 98.7355 1044.17 98.7355C1034.24 98.7355 1026.14 102.048 1019.89 108.672C1013.63 115.112 1010.5 124.68 1010.5 137.376Z',
  'M893.103 215.76C880.591 215.76 869.183 212.724 858.879 206.652C848.759 200.58 840.663 192.392 834.591 182.088C828.703 171.784 825.759 160.284 825.759 147.588C825.759 135.076 828.703 123.76 834.591 113.64C840.663 103.52 848.759 95.5155 858.879 89.6275C869.183 83.5555 880.591 80.5195 893.103 80.5195C905.799 80.5195 917.207 83.4635 927.327 89.3515C937.447 95.2395 945.451 103.336 951.339 113.64C957.411 123.76 960.447 135.076 960.447 147.588C960.447 160.468 957.411 172.06 951.339 182.364C945.451 192.484 937.447 200.58 927.327 206.652C917.207 212.724 905.799 215.76 893.103 215.76ZM893.103 196.992C902.303 196.992 910.399 194.876 917.391 190.644C924.567 186.412 930.179 180.524 934.227 172.98C938.459 165.436 940.575 156.972 940.575 147.588C940.575 138.204 938.459 129.924 934.227 122.748C930.179 115.388 924.567 109.592 917.391 105.36C910.399 101.128 902.303 99.0115 893.103 99.0115C884.087 99.0115 875.991 101.128 868.815 105.36C861.639 109.592 856.027 115.388 851.979 122.748C847.931 129.924 845.907 138.204 845.907 147.588C845.907 157.156 847.931 165.712 851.979 173.256C856.027 180.616 861.639 186.412 868.815 190.644C875.991 194.876 884.087 196.992 893.103 196.992Z',
  'M608.288 213V23.1123H622.64L704.612 157.524H694.4L776.372 23.1123H790.724V213H770.3V58.4403L774.992 59.5443L706.544 171.876H692.192L623.744 59.5443L628.436 58.4403V213H608.288Z',
];

export const LIMA_MARCA = '#DAFC29';
const LOCKUP = '0 0 1437 268';
const SIMBOLO = '0 0 533 222';
/** a proporção do arquivo: quem pede altura recebe a largura certa */
export const RAZAO_LOCKUP = 1437 / 268;
export const RAZAO_SIMBOLO = 533 / 222;

/** símbolo e letreiro juntos, na proporção do arquivo */
export function Marca({ altura = 22, tinta = '#FFFFFF' }: { altura?: number; tinta?: string }) {
  return (
    <Svg width={altura * RAZAO_LOCKUP} height={altura} viewBox={LOCKUP}>
      <Path d={D_SIMBOLO} fill={LIMA_MARCA} />
      {D_LETREIRO.map((d) => <Path key={d.slice(0, 12)} d={d} fill={tinta} />)}
    </Svg>
  );
}

/** só o M, cheio — o Morphi de pé ao lado do app de saúde */
export function Simbolo({ altura = 40, cor = LIMA_MARCA }: { altura?: number; cor?: string }) {
  return (
    <Svg width={altura * RAZAO_SIMBOLO} height={altura} viewBox={SIMBOLO}>
      <Path d={D_SIMBOLO} fill={cor} />
    </Svg>
  );
}

/** só o M, vazado — o fundo da abertura */
export function MarcaContorno({
  largura, cor = LIMA_MARCA, opacidade = 0.22, traco = 2.5,
}: { largura: number; cor?: string; opacidade?: number; traco?: number }) {
  return (
    <Svg width={largura} height={largura / RAZAO_SIMBOLO} viewBox={SIMBOLO}>
      <Path
        d={D_SIMBOLO}
        fill="none"
        stroke={cor}
        strokeOpacity={opacidade}
        strokeWidth={traco}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ============================================================
   AS MARCAS DOS SERVIÇOS DE SAÚDE

   ⚠️ SÃO DESENHOS NOSSOS, E NÃO OS LOGOTIPOS DELES. Apple Saúde, Health
   Connect, Garmin, Fitbit e Withings são marcas registradas com regra de
   uso própria, e usar o arquivo de cada uma sem licença é o tipo de
   economia que vira carta de advogado. O que está aqui é uma peça na COR
   de cada serviço — o suficiente para a fileira ser lida de relance, e
   longe o bastante de se passar pelo original.

   A cor faz quase todo o trabalho. Num quadrado de 34 px, ninguém lê o
   desenho: lê o tom. Por isso o Apple Saúde é o rosa-vermelho, o Health
   Connect é o azul, a Garmin é o azul-escuro dela, a Fitbit é o turquesa
   e a Withings é o verde-água — e a figura em cima é genérica.

   No dia em que houver licença e os arquivos entrarem em assets/images,
   estas duas funções viram <Image> e somem.
   ============================================================ */

const CORACAO = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

/** O coração do app de saúde do aparelho — rosa no iOS, azul no Android. */
export function CoracaoDeSaude({ tamanho = 40, de = 'ios' }: { tamanho?: number; de?: 'ios' | 'android' }) {
  const cor = de === 'ios' ? '#F43B47' : '#1A56DB';
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24">
      <Path d={CORACAO} fill={cor} />
    </Svg>
  );
}
