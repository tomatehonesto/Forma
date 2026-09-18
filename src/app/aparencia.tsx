import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
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
   coisa. São doze paletas fechadas agora, cada uma um conjunto já olhado
   junto.

   ⚠️ E A GRADE JÁ FOI DE ÍCONES. Cada opção era o ícone do aplicativo
   naquela paleta — bonito, e ruim para escolher: doze quadrados com a
   mesma marca dentro obrigam a comparar doze desenhos iguais para achar
   duas cores. A bolinha partida ao meio diz a mesma coisa num relance, e
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
        lead="O Morphi pode ter a sua cara. Escolha uma paleta e ela vai para tudo — inclusive para o ícone na sua tela inicial."
      />

      {/* ---- a prévia ---- */}
      <View style={{
        borderRadius: radius.xl, overflow: 'hidden',
        backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line,
      }}>
        {/* A faixa de cima é o hero: a aurora da paleta com o véu dela por
            cima, que é exatamente a composição das telas de verdade. */}
        <View style={{ height: 132, justifyContent: 'space-between', paddingBottom: 14 }}>
          <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={[alfa(c.veu, 0.5), alfa(c.veu, 0.3), alfa(c.veu, 0.72)]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Row gap={12} style={{ padding: 16, alignItems: 'center' }}>
            <IconeDaPaleta acao={paleta.acaoClara} marca={paleta.alcancado} lado={40} />
            <View style={{ gap: 6, flex: 1 }}>
              <Barra larg={96} cor="rgba(255,255,255,0.85)" />
              <Barra larg={62} alt={6} cor="rgba(255,255,255,0.45)" />
            </View>
          </Row>
          {/* A pastilha do alcançado sobre a aurora: é onde ela aparece na
              Home, no botão de check-in. */}
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{
              alignSelf: 'flex-start', backgroundColor: paleta.alcancado,
              borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <Txt v="tag" c={paleta.alcancadoInk} style={{ fontFamily: font.bodyMed }}>Feito hoje</Txt>
            </View>
          </View>
        </View>

        {/* E embaixo a folha, com as duas coisas que a cor de ação faz: o
            botão cheio e o link. */}
        <View style={{ padding: 16, gap: 14 }}>
          <View style={{ gap: 7 }}>
            <Barra larg="70%" cor={c.bg3} />
            <Barra larg="46%" cor={c.bg3} />
          </View>
          <Row gap={12} style={{ alignItems: 'center' }}>
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

      {/* ---- claro ou escuro ---- */}
      <Bloco titulo="Claro ou escuro" nota="Pode deixar o Morphi acompanhar o seu telefone — ou decidir por conta própria.">
        <Row gap={10}>
          {MODOS.map((m) => {
            const on = tema === m.id;
            return (
              <Pressable key={m.id} onPress={() => setTheme(m.id)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                <View style={{
                  backgroundColor: c.bg1, borderRadius: radius.lg,
                  borderWidth: on ? 2 : 1, borderColor: on ? c.tx : c.line,
                  paddingHorizontal: 12, paddingVertical: 14, gap: 12,
                }}>
                  <Icon name={m.ic} size={20} color={on ? c.tx : c.tx4} sw={1.9} />
                  <Txt v="bodyMed" c={on ? c.tx : c.tx3}>{m.nome}</Txt>
                </View>
              </Pressable>
            );
          })}
        </Row>
      </Bloco>

      {/* ---- as paletas ---- */}
      <Bloco
        titulo="Escolha a sua cor"
        nota={`Agora você está no ${paleta.nome}. Toque em qualquer uma para experimentar — dá para trocar quantas vezes quiser.`}
      >
        <Row style={{ flexWrap: 'wrap' }}>
          {PALETAS.map((p) => {
            const on = p.id === paletaId;
            const acao = isDark ? p.acaoEscura : p.acaoClara;
            return (
              <Pressable
                key={p.id}
                onPress={() => escolher(p.id)}
                style={({ pressed }) => [{ width: '25%', alignItems: 'center', paddingVertical: 10, opacity: pressed ? 0.7 : 1 }]}
              >
                {/* A BOLINHA É PARTIDA AO MEIO: em cima a cor que age,
                    embaixo a do alcançado. Corte na diagonal ficaria mais
                    bonito e diria menos — na horizontal as duas metades têm
                    o mesmo peso, que é o que elas têm no aplicativo. */}
                <View style={{
                  width: 54, height: 54, borderRadius: 27,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: on ? c.tx : 'transparent',
                }}>
                  <View style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden' }}>
                    <View style={{ height: '50%', backgroundColor: acao }} />
                    <View style={{ height: '50%', backgroundColor: p.alcancado }} />
                  </View>
                </View>
                <Txt
                  v="micro"
                  c={on ? c.tx : c.tx3}
                  numberOfLines={1}
                  style={[{ marginTop: 7 }, on ? { fontFamily: font.bodyMed } : null]}
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
