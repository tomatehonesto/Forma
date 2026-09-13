import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { Txt, Row, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, shadowSoft } from '../theme';

const FOTO = require('../../assets/images/especialista.png');

/* ============================================================
   ESPECIALISTA — quem assina o seu tratamento

   Existe por uma razão específica: o Morphi não prescreve nada. Dose,
   protocolo e ajuste são decisão médica, e o app repete isso em todas as
   telas. Então a pergunta "quem é essa pessoa que decide?" precisa ter
   uma resposta, e ela precisa ser verificável — CRM, formação, tempo de
   atuação — e não só um nome no topo de um card.

   A avaliação aparece AQUI e não na aba Cuidado. Nota serve para
   escolher; depois de escolhida, ela vira ruído sobre alguém em quem
   você já decidiu confiar. Quem abre esta tela está avaliando; quem abre
   a aba está sendo cuidado.
   ============================================================ */

const PAD = 24;

export default function Especialista() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const go = (to: string) => () => router.push(to as any);

  const info: any = (S.profile as any).doctorInfo ?? {};

  const acoes: [string, string, string][] = [
    ['companion', 'Mensagem', '/medico'],
    ['cal', 'Consultas', '/consultas'],
    ['doc', 'Protocolos', '/protocolos'],
    ['heart', 'Clínica', '/medico'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Retrato sangrando de borda a borda. É o único lugar do app onde
            uma pessoa ocupa a tela inteira — proposital: a escala comunica
            que ali há alguém, não um registro.

            O nome fica SOBRE a foto, no rodapé dela, apoiado por uma queda
            ao fundo da tela. Pôr o nome abaixo da imagem separaria a pessoa
            do nome dela em dois blocos; sobreposto, é a mesma coisa. */}
        <View style={{ height: 430 }}>
          {/* fundo próprio, porque o retrato é recorte com transparência —
              sem ele a pessoa apareceria flutuando sobre o cinza da página */}
          <LinearGradient
            colors={[c.bluePale, c.bg1, c.bg]}
            locations={[0, 0.62, 1]}
            start={{ x: 0.2, y: 0 }} end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Image
            source={FOTO}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 400 }}
            contentFit="contain"
            contentPosition="bottom center"
          />

          {/* queda para o fundo da página: o retrato não termina numa linha */}
          <LinearGradient
            colors={['rgba(245,246,250,0)', 'rgba(245,246,250,0.04)', 'rgba(245,246,250,0.35)', 'rgba(245,246,250,0.85)', c.bg]}
            locations={[0, 0.5, 0.74, 0.9, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={{ flex: 1, paddingHorizontal: PAD, paddingTop: insets.top + 12, justifyContent: 'space-between' }}>
            <Row>
              <CircleBtn name="back" onPress={() => router.back()} />
            </Row>

            <View style={{ paddingBottom: 8 }}>
              {!!info.rating && (
                <Row gap={6} style={{
                  alignSelf: 'flex-start', marginBottom: 12,
                  backgroundColor: 'rgba(255,255,255,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
                  borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6,
                }}>
                  <Icon name="trophy" size={13} color={c.accent} sw={2} />
                  <Txt v="micro" c={c.tx}>{String(info.rating).replace('.', ',')}</Txt>
                  <Txt v="micro" c={c.tx3}>· {info.avaliacoes} avaliações</Txt>
                </Row>
              )}
              <Txt v="h1" style={{ fontSize: 28 }}>{S.profile.doctor}</Txt>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>
                {info.especialidade} · {info.crm}
              </Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{S.profile.clinic}</Txt>
            </View>
          </View>
        </View>

        {/* Ações em vidro, montadas na divisa entre a foto e a página. É a
            peça que costura os dois planos — e translúcida ela deixa a
            passagem acontecer por trás em vez de tapá-la. */}
        <View style={{ paddingHorizontal: PAD, marginTop: -26 }}>
          <Row gap={8} style={{
            backgroundColor: 'rgba(255,255,255,0.66)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
            borderRadius: radius.xl, paddingVertical: 16,
            ...shadowSoft(c),
          }}>
            {acoes.map(([ic, label, to]) => (
              <Pressable key={label} onPress={go(to)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.6 : 1 }]}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={ic} size={19} color={c.tx} sw={1.8} />
                  </View>
                  <Txt v="micro" c={c.tx2} style={{ marginTop: 7 }}>{label}</Txt>
                </View>
              </Pressable>
            ))}
          </Row>
        </View>

        <View style={{ paddingHorizontal: PAD }}>
          {/* números que sustentam a credencial, na mesma faixa da aba */}
          {!!info.anos && (
            <Row style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 18, paddingVertical: 18 }}>
              {[
                [`${info.anos} anos`, 'de experiência'],
                [`${(info.pacientes / 1000).toFixed(1).replace('.', ',')}k+`, 'pacientes atendidos'],
                [`${info.avaliacoes}`, 'avaliações'],
              ].map(([valor, label], i) => (
                <React.Fragment key={label}>
                  {i > 0 && <View style={{ width: 1, backgroundColor: c.line2, marginVertical: 2 }} />}
                  <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 6 }}>
                    <Txt v="h2">{valor}</Txt>
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 3, textAlign: 'center' }}>{label}</Txt>
                  </View>
                </React.Fragment>
              ))}
            </Row>
          )}

          {!!info.sobre && (
            <View style={{ marginTop: 32 }}>
              <Txt v="h2">Sobre</Txt>
              <Txt v="body" c={c.tx2} style={{ marginTop: 12, lineHeight: 26 }}>{info.sobre}</Txt>
            </View>
          )}

          {!!info.abordagens?.length && (
            <View style={{ marginTop: 30 }}>
              <Txt v="h2">Abordagens</Txt>
              <Row gap={8} style={{ flexWrap: 'wrap', marginTop: 14 }}>
                {info.abordagens.map((a: string) => (
                  <View key={a} style={{ borderWidth: 1, borderColor: c.line, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9, marginBottom: 8 }}>
                    <Txt v="caption" c={c.tx2}>{a}</Txt>
                  </View>
                ))}
              </Row>
            </View>
          )}

          {/* O limite dito na cara. Não é rodapé legal: é a fronteira que dá
              sentido ao resto do app — a IA observa e organiza, esta pessoa
              decide. */}
          <View style={{ marginTop: 32, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
            <Row gap={10} style={{ alignItems: 'flex-start' }}>
              <View style={{ marginTop: 2 }}>
                <Icon name="shield" size={17} color={c.tx3} sw={1.9} />
              </View>
              <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>
                Dose, protocolo e qualquer ajuste no tratamento são decisão de {S.profile.doctor}.
                O Morphi organiza seus registros e prepara o que levar — não prescreve.
              </Txt>
            </Row>
          </View>

          <Divider style={{ marginTop: 28 }} />

          <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 20, opacity: pressed ? 0.85 : 1 }]}>
            <Row gap={8} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, justifyContent: 'center' }}>
              <Icon name="companion" size={18} color={c.accentInk} sw={1.9} />
              <Txt v="body" c={c.accentInk}>Enviar mensagem</Txt>
            </Row>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
