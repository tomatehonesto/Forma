import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useAurora } from '../ui/aurora';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { marcarComoVistas, novosNiveis, type Conquista } from '../logic/conquistas';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, alfa } from '../theme';

/* ============================================================
   CONQUISTA ALCANÇADA

   O app calculava as conquistas e não contava nenhuma. A pessoa fazia o
   quinquagésimo check-in, subia de nível, e só descobria se um dia
   abrisse a tela de Conquistas — que é a última que alguém abre depois de
   responder um formulário. Uma conquista que ninguém conta é quase uma
   conquista que não aconteceu.

   ESTA TELA É O CONTAR. Ela aparece sozinha, logo depois do registro que
   fechou a conta, e some quando a pessoa toca. Não é uma tela que se
   procura: é um momento que o app devolve.

   NÃO É CONFETE. O app diz de si que os marcos são discretos, e este é o
   lugar onde essa promessa é mais fácil de quebrar: tela cheia, tudo
   comemorando. O que ela tem é a aurora — o mesmo fundo do check-in
   concluído, que é a outra tela de momento do app —, o ícone da trilha em
   lima, e o número do nível. Sem exclamação, sem "parabéns", sem medalha
   girando.

   E ELA DIZ O QUE VEM DEPOIS, como todas as confirmações deste app: a
   linha de baixo é o próximo nível, com o que falta. Quem acabou de
   chegar a cinquenta check-ins quer saber que cem existe.

   VÁRIAS DE UMA VEZ ACONTECEM. Um check-in pode fechar "Check-ins nível
   4" e "Dias seguidos nível 3" no mesmo toque. A tela mostra a primeira
   inteira e as outras como linha — três telas em fila seriam três toques
   para sair de um lugar onde ninguém pediu para entrar.
   ============================================================ */


export default function ConquistaOk() {
  const aurora = useAurora();
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* CONGELA NA MONTAGEM. Fechar a tela grava a marca d'água, o estado
     muda, e sem isto a lista se esvaziaria embaixo do próprio conteúdo
     antes de a navegação acontecer — a pessoa veria a tela piscar vazia
     no caminho de saída. */
  const novas = useMemo<Conquista[]>(() => novosNiveis(S), []);
  const [primeira, ...resto] = novas;

  /* SAIR DEIXA O RECADO NA LISTA. A tela cheia é o momento, e momento
     passa: quem fechou sem ler direito, ou quem só quis sair dali, não
     pode perder a notícia. A notificação é o mesmo fato em outro lugar,
     que é onde ele fica.

     Uma por nível, e com a data de agora — que é quando a pessoa soube,
     e não quando o registro que fechou a conta aconteceu. A lista de
     notificações conta o que o app disse; o quando da conquista mora na
     trilha. */
  const sair = () => {
    update((s: any) => {
      const lista = s.notifications ?? (s.notifications = []);
      for (const q of novas) {
        lista.unshift({
          t: Date.now(), ic: q.ic, kind: 'conquista',
          title: `${q.titulo} · nível ${q.nivel}`,
          body: q.falta ? `${q.desc}. ${q.falta} para o próximo nível.` : `${q.desc}. Trilha completa.`,
        });
      }
      marcarComoVistas(s);
    });
    router.back();
  };

  /* Sem nada a contar, a tela não existe: ela pode ser alcançada por um
     segundo toque enquanto a de trás ainda está fechando. */
  if (!primeira) { router.back(); return null; }

  return (
    <View style={{ flex: 1, backgroundColor: '#05143F' }}>
      <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
      {/* O véu escurece o alto e o pé, onde mora texto pequeno, e deixa a
          aurora aparecer no meio — é o mesmo tratamento do check-in
          concluído. */}
      <LinearGradient
        colors={[alfa(c.veu, 0.55), alfa(c.veu, 0.2), alfa(c.veu, 0.75)]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={{
        flex: 1, paddingTop: insets.top + 24,
        paddingBottom: (insets.bottom || 12) + 20, paddingHorizontal: 24,
        alignItems: 'center', justifyContent: 'center', gap: 18,
      }}>
        <Txt v="micro" c={c.onHero2} style={{ letterSpacing: 1.4 }}>CONQUISTA ALCANÇADA</Txt>

        <View style={{
          width: 96, height: 96, borderRadius: 34, backgroundColor: c.lime,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={primeira.ic} size={44} color={c.limeInk} sw={1.9} />
        </View>

        <View style={{ alignItems: 'center', gap: 6 }}>
          <Txt v="h1" c={c.onHero} style={{ fontSize: 30, lineHeight: 36, textAlign: 'center' }}>
            {primeira.titulo}
          </Txt>
          <Txt v="note" c={c.onHero2} style={{ textAlign: 'center' }}>{primeira.desc}</Txt>
        </View>

        {/* AS BOLINHAS, as mesmas do cartão: a trilha inteira numa olhada,
            e o nível recém-chegado como o último aceso. */}
        <Row gap={6} style={{ justifyContent: 'center' }}>
          {Array.from({ length: primeira.niveis }, (_, i) => (
            <View
              key={i}
              style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: i < primeira.nivel ? c.lime : c.onHeroLine,
              }}
            />
          ))}
        </Row>
        <Txt v="caption" c={c.onHero2}>Nível {primeira.nivel} de {primeira.niveis}</Txt>

        {/* O QUE VEM DEPOIS. Toda confirmação deste app termina apontando
            para a frente, e não em parabéns. */}
        {primeira.falta ? (
          <Row gap={8} style={{
            backgroundColor: c.glass, borderColor: c.glassLine, borderWidth: 1,
            borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9,
          }}>
            <Icon name="chevup" size={14} color={c.onHero2} sw={2.2} />
            <Txt v="caption" c={c.onHero}>Próximo nível: {primeira.falta.toLowerCase()}</Txt>
          </Row>
        ) : (
          <Row gap={8} style={{
            backgroundColor: c.glass, borderColor: c.glassLine, borderWidth: 1,
            borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9,
          }}>
            <Icon name="check" size={14} color={c.lime} sw={2.6} />
            <Txt v="caption" c={c.onHero}>Trilha completa</Txt>
          </Row>
        )}

        {resto.length ? (
          <View style={{ alignSelf: 'stretch', gap: 8, marginTop: 6 }}>
            <Txt v="micro" c={c.onHero2} style={{ textAlign: 'center', letterSpacing: 1 }}>
              NO MESMO REGISTRO
            </Txt>
            {resto.map((q) => (
              <Row key={q.id} gap={10} style={{
                backgroundColor: c.glass, borderRadius: radius.md,
                paddingHorizontal: 13, paddingVertical: 11, alignItems: 'center',
              }}>
                <Icon name={q.ic} size={17} color={c.lime} sw={1.9} />
                <Txt v="caption" c={c.onHero} style={{ flex: 1 }}>{q.titulo}</Txt>
                <Txt v="micro" c={c.onHero2}>nível {q.nivel}</Txt>
              </Row>
            ))}
          </View>
        ) : null}
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: (insets.bottom || 12) + 18 }}>
        <Pressable onPress={sair} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <View style={{
            backgroundColor: c.lime, borderRadius: radius.pill,
            paddingVertical: 17, alignItems: 'center',
          }}>
            <Txt v="bodyMed" c={c.limeInk}>Continuar</Txt>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
