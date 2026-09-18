import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useStore } from '../logic/store';
import { trocarIcone } from '../logic/icone';
import { useAurora } from '../ui/aurora';
import { D_SIMBOLO, RAZAO_SIMBOLO } from '../ui/marca';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { PALETAS, paletaDe, alfa, mix, radius, font } from '../theme';
import type { Tema } from '../logic/seed';

/* ============================================================
   APARÊNCIA

   ⚠️ A ESCOLHA ERA DE DUAS CORES SOLTAS, e isso empurrava para a pessoa
   uma decisão que é de design: ação e alcançado próximas fazem o botão
   que leva a algum lugar e a marca do que já foi feito virarem a mesma
   coisa. São cinco paletas fechadas agora, cada uma um conjunto já olhado
   junto.

   ⚠️ E ERAM DOZE, EM TRÊS FILEIRAS. Doze bolinhas viram uma grade, e uma
   grade se examina: a pessoa compara, volta, desiste. Cinco numa linha só
   se veem de uma vez — a escolha inteira cabe num olhar, que é o tamanho
   certo para uma decisão que não tem resposta errada.

   ⚠️ E A GRADE JÁ FOI DE ÍCONES. Cada opção era o ícone do aplicativo
   naquela paleta — bonito, e ruim para escolher: quadrados com a mesma
   marca dentro obrigam a comparar desenhos iguais para achar duas cores. A bolinha partida ao meio diz a mesma coisa num relance, e
   é a forma que qualquer pessoa já reconhece de "esta é a cor".

   O ÍCONE NÃO SUMIU: subiu para a prévia, onde ele é o que de fato é —
   uma consequência da escolha, e não o seletor dela.

   A PRÉVIA É WIREFRAME DE PROPÓSITO. Ela não tenta parecer o aplicativo:
   tenta mostrar ONDE cada cor cai. Barra cinza é texto, retângulo cheio é
   botão, pastilha é o alcançado, e a faixa de cima é a aurora com o véu
   por cima. Uma miniatura realista competiria com a coisa real e perderia;
   um esqueleto responde a única pergunta que a tela faz.
   ============================================================ */

const MODOS: { id: Tema; nome: string; ic: string }[] = [
  { id: 'system', nome: 'Sistema', ic: 'contrast' },
  { id: 'light', nome: 'Claro', ic: 'sun' },
  { id: 'dark', nome: 'Escuro', ic: 'moon' },
];

/* O ÍCONE DESENHADO, com a mesma rampa e as mesmas proporções de
   scripts/gerar-icones.mjs. Prévia e arquivo precisam ser o mesmo
   desenho: senão a tela promete um ícone e o telefone mostra outro. */
function IconeDaPaleta({ acao, marca, lado }: { acao: string; marca: string; lado: number }) {
  const largura = lado * 0.56;
  return (
    <LinearGradient
      colors={[mix(acao, '#FFFFFF', 0.2), mix(acao, '#000000', 0.42)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: lado, height: lado, borderRadius: lado * 0.225,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Svg width={largura} height={largura / RAZAO_SIMBOLO} viewBox="0 0 533 222">
        <Path d={D_SIMBOLO} fill={marca} />
      </Svg>
    </LinearGradient>
  );
}

/* A BOLINHA DE DUAS CORES — em cima a que age, embaixo a do alcançado.

   ⚠️ O CORTE ERA HORIZONTAL E PASSOU A SER DIAGONAL. Reto, a bolinha lia
   como duas faixas empilhadas — e faixa empilhada é gráfico, é barra de
   progresso, é qualquer coisa menos "aqui estão duas cores". Na diagonal
   as duas metades se encostam pelo canto, que é como amostra de cor se
   apresenta desde sempre.

   E é SVG, e não duas Views cortadas: um triângulo com hipotenusa curva
   não se desenha com borda e raio. O caminho é o círculo inteiro na cor
   de ação, com a metade de baixo-esquerda por cima — arco de 135° a 315°,
   que é a diagonal. */
function Duas({ acao, alcancado, lado }: { acao: string; alcancado: string; lado: number }) {
  const r = lado / 2;
  const d = r * 0.70710678;
  const metade = `M ${r - d} ${r - d} A ${r} ${r} 0 0 0 ${r + d} ${r + d} Z`;
  return (
    <Svg width={lado} height={lado} viewBox={`0 0 ${lado} ${lado}`}>
      <Circle cx={r} cy={r} r={r} fill={acao} />
      <Path d={metade} fill={alcancado} />
    </Svg>
  );
}

/** Uma barra de esqueleto — é o que representa texto na prévia. */
function Barra({ larg, alt = 7, cor }: { larg: any; alt?: number; cor: string }) {
  return <View style={{ width: larg, height: alt, borderRadius: alt / 2, backgroundColor: cor }} />;
}

export default function Aparencia() {
  const { c, isDark } = useTheme();
  const aurora = useAurora();
  const setTheme = useStore((s) => s.setTheme);
  const setPaleta = useStore((s) => s.setPaleta);
  const tema = useStore((s) => s.S.theme) as Tema;
  const paletaId = useStore((s) => (s.S as any).paleta as string) ?? 'original';
  const paleta = paletaDe(paletaId);

  /* A PALETA MUDA NA HORA, E O ÍCONE TENTA. A cor do app não espera o
     sistema responder: se o aparelho recusar a troca do ícone, o
     aplicativo já está da cor nova. Ver src/logic/icone.ts. */
  const escolher = (id: string) => { setPaleta(id); trocarIcone(id); };

  return (
    <TelaInterna titulo="Aparência">
      <Titulao
        titulo="Aparência"
        lead="Deixe o aplicativo com a sua cara. A cor que você escolher vai para todas as telas — e até para o ícone, na sua tela inicial."
      />

      {/* ---- a prévia ----

          ⚠️ ELA PRECISA DIZER QUE É PRÉVIA. Sem o rótulo em cima, um cartão
          com aurora, ícone e botão no alto de uma tela de ajuste lê como
          conteúdo de verdade — e a pessoa tenta tocar no "Registrar". */}
      <View style={{ gap: 10 }}>
        <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1.4 }}>EXEMPLO DE COMO FICA</Txt>

        <View style={{
          borderRadius: radius.xl, overflow: 'hidden',
          backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
        }}>
          {/* A faixa de cima é o hero: a aurora da paleta com o véu dela
              por cima, que é exatamente a composição das telas de verdade. */}
          <View style={{ height: 136, justifyContent: 'space-between', paddingBottom: 14 }}>
            <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={[alfa(c.veu, 0.5), alfa(c.veu, 0.3), alfa(c.veu, 0.72)]}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />

            {/* TEXTO DE EXEMPLO, e não nome de gente: "Bom dia, Ana" numa
                prévia faria a pessoa achar que o app trocou o nome dela.
                As frases são genéricas de propósito — o que a prévia
                mostra é onde a cor cai, não quem usa o aplicativo. */}
            <Row gap={12} style={{ padding: 16, alignItems: 'center' }}>
              <IconeDaPaleta acao={paleta.acaoClara} marca={paleta.alcancado} lado={40} />
              <View style={{ flex: 1, gap: 3 }}>
                <Txt v="bodyMed" c="#FFFFFF">Bom dia</Txt>
                <Txt v="micro" c="rgba(255,255,255,0.72)">Dia 12 · semana 2</Txt>
              </View>
            </Row>

            {/* ⚠️ A PASTILHA GANHOU UM CHECK. Sem ele, um retângulo
                arredondado e cheio de cor a dois centímetros de um botão
                arredondado e cheio de cor lê como um segundo botão — e o
                que ela é na Home é o contrário: a marca do que já
                aconteceu, e não algo a tocar. */}
            <View style={{ paddingHorizontal: 16 }}>
              <Row gap={6} style={{
                alignSelf: 'flex-start', alignItems: 'center',
                backgroundColor: paleta.alcancado, borderRadius: radius.pill,
                paddingLeft: 9, paddingRight: 12, paddingVertical: 6,
              }}>
                <Icon name="check" size={12} color={paleta.alcancadoInk} sw={3} />
                <Txt v="tag" c={paleta.alcancadoInk} style={{ fontFamily: font.bodyMed }}>Check-in feito</Txt>
              </Row>
            </View>
          </View>

          {/* E embaixo a folha, com as duas coisas que a cor de ação faz:
              o botão cheio e o link. */}
          <View style={{ padding: 16, gap: 14 }}>
            <View style={{ gap: 6 }}>
              <Txt v="bodyMed">Suas metas de hoje</Txt>
              <Barra larg="62%" cor={c.bg3} />
            </View>
            <Row gap={14} style={{ alignItems: 'center' }}>
              <View style={{
                backgroundColor: isDark ? paleta.acaoEscura : paleta.acaoClara,
                borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 9,
              }}>
                <Txt v="tag" c={isDark ? paleta.inkEscuro : paleta.inkClaro} style={{ fontFamily: font.bodyMed }}>
                  Registrar
                </Txt>
              </View>
              <Txt v="tag" c={isDark ? paleta.acaoEscura : paleta.acaoClara}>Ver a jornada</Txt>
            </Row>
          </View>
        </View>
      </View>

      {/* ---- claro ou escuro ----

          ⚠️ ERAM TRÊS CARTÕES ALTOS, com o ícone numa linha e o rótulo em
          outra: quase cento e vinte pixels para uma decisão de três
          opções, no meio de uma tela cujo assunto é outro. A escolha de
          tema não é o que traz alguém aqui — a cor é. Em pastilha de uma
          linha ela ocupa um terço e continua dizendo a mesma coisa. */}
      {/* ⚠️ SEM NOTA NOS DOIS BLOCOS. Elas explicavam o que as opções
          logo abaixo já mostram — "pode acompanhar o seu telefone" acima
          de uma pastilha escrita "Sistema", "toque na que você mais
          gosta" acima de cinco bolinhas coloridas. Texto que descreve o
          controle que está a um centímetro dele é o app lendo a tela em
          voz alta para quem está olhando. */}
      <Bloco titulo="Escolha o tema">
        <Row gap={8}>
          {MODOS.map((m) => {
            const on = tema === m.id;
            return (
              <Pressable key={m.id} onPress={() => setTheme(m.id)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                {/* ⚠️ O CHIP ESCOLHIDO ERA PRETO, e preto não é cor deste
                    app: quem marca o escolhido em toda tela daqui é a cor
                    de ação — a mesma do botão, da aba ativa, do link. Um
                    neutro aqui fazia a única seleção do aplicativo que não
                    se parece com as outras.

                    O anel das bolinhas continua neutro, e por um motivo
                    oposto: ali a cor de ação é a metade de cima do próprio
                    círculo escolhido, e o anel sumiria dentro dele. */}
                <Row gap={7} style={{
                  justifyContent: 'center', alignItems: 'center',
                  backgroundColor: on ? c.accent : c.bg1,
                  borderRadius: radius.pill,
                  borderWidth: 1, borderColor: on ? c.accent : c.line,
                  paddingVertical: 10,
                }}>
                  <Icon name={m.ic} size={15} color={on ? c.accentInk : c.tx3} sw={1.9} />
                  <Txt v="label" c={on ? c.accentInk : c.tx2}>{m.nome}</Txt>
                </Row>
              </Pressable>
            );
          })}
        </Row>
      </Bloco>

      {/* ---- as paletas ---- */}
      {/* ⚠️ SEM `flexWrap`, E ISSO É A REGRA E NÃO O ACASO. A fileira é
          uma linha só por definição: se uma sexta paleta entrar um dia, o
          certo é ela não caber e alguém ter de decidir — e não a grade
          quebrar sozinha numa segunda fileira com um item solto. */}
      <Bloco titulo="Escolha a sua cor">
        <Row>
          {PALETAS.map((p) => {
            const on = p.id === paletaId;
            const acao = isDark ? p.acaoEscura : p.acaoClara;
            return (
              <Pressable
                key={p.id}
                onPress={() => escolher(p.id)}
                style={({ pressed }) => [{ flex: 1, alignItems: 'center', paddingVertical: 4, opacity: pressed ? 0.7 : 1 }]}
              >
                {/* O ANEL FICA FORA DA BOLINHA, com ar no meio: encostado
                    nela ele vira borda — parte do desenho da cor, e não
                    sinal de escolha. */}
                <View style={{
                  width: 66, height: 66, borderRadius: 33,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1.5, borderColor: on ? c.tx : 'transparent',
                }}>
                  <Duas acao={acao} alcancado={p.alcancado} lado={54} />
                </View>
                {/* ⚠️ O NOME PRECISA CABER NUMA COLUNA DE 65 PIXELS, e é
                    por isso que nenhum deles passa de oito letras: num
                    telefone de 360pt "Framboesa" pedia 66,1 e virava
                    "Framboe…". A regra mora na lista, em src/theme.ts. O
                    `numberOfLines` fica de rede — com o texto do sistema
                    aumentado, truncar é melhor do que empurrar a fileira. */}
                <Txt
                  v="micro"
                  c={on ? c.tx : c.tx3}
                  numberOfLines={1}
                  style={[{ marginTop: 6 }, on ? { fontFamily: font.bodyMed } : null]}
                >
                  {p.nome}
                </Txt>
              </Pressable>
            );
          })}
        </Row>
      </Bloco>

      <View />
    </TelaInterna>
  );
}