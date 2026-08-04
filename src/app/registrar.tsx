import React, { useState } from 'react';
import { View, Pressable, TextInput, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  quickCapture, nextSite, siteLabel, curWeight, checkinToday, waterMlToday, streak,
  type QuickKey,
} from '../logic/derive';
import { now, startOfDay, nf } from '../logic/time';
import { Txt, Row, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* ============================================================
   REGISTRAR — captura de um momento, não menu de funcionalidade.

   A tela pergunta "o que aconteceu agora?" e a pessoa responde. Por isso
   os itens são acontecimentos em primeira pessoa ("Acabei de me pesar"),
   não nomes de tela ("Peso"): ela está acrescentando um momento à jornada,
   não escolhendo um formulário.

   Duas camadas, separadas pelo esforço:
     · agora — três atalhos CONTEXTUAIS, que mudam com o momento do
       tratamento e priorizam o que acontece todo dia
     · leva um minuto — os registros que pedem mais informação
   ============================================================ */

type Item = { ic: string; titulo: string; sub: string; to?: string; acao?: () => void; destaque?: boolean };

export default function Registrar() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: alturaJanela } = useWindowDimensions();

  const [pesoAberto, setPesoAberto] = useState(false);
  const [peso, setPeso] = useState('');
  const [feito, setFeito] = useState<string | null>(null);

  const piscar = (k: string) => { setFeito(k); setTimeout(() => setFeito(null), 1600); };
  const fechar = () => router.back();
  /* fecha antes de navegar: tela empilhada sobre sheet prende a pessoa em
     duas camadas de volta */
  const irPara = (to: string) => () => { router.back(); setTimeout(() => router.push(to as any), 60); };

  const ci = checkinToday(S);
  const stk = streak(S);
  const litros = (waterMlToday(S) / 1000).toFixed(1).replace('.', ',');
  const alvoL = ((S.profile as any).targets.waterMl / 1000).toFixed(1).replace('.', ',');
  const { motivo, acoes } = quickCapture(S);

  const registrarAplicacao = () => {
    update((s: any) => { s.injections.push({ t: +now(), med: s.profile.med, dose: s.profile.dose, site: nextSite(s), note: '' }); });
    piscar('aplicacao');
  };
  const maisAgua = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      const c2 = s.checkins.find((x: any) => x.t === t);
      if (c2) c2.agua = (c2.agua || 0) + 1;
      else s.checkins.push({ t, mood: 3, fome: 5, nausea: 0, sono: 7, gut: 'normal', energia: 6, agua: 1, prot: 0, exerc: 0, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    piscar('agua');
  };
  const treinou = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      const c2 = s.checkins.find((x: any) => x.t === t);
      if (c2) c2.exerc = (c2.exerc || 0) + 30;
      else s.checkins.push({ t, mood: 3, fome: 5, nausea: 0, sono: 7, gut: 'normal', energia: 6, agua: 0, prot: 0, exerc: 30, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    piscar('exercicio');
  };
  const salvarPeso = () => {
    const v = parseFloat(peso.replace(',', '.'));
    if (!v || v < 30 || v > 250) return;
    update((s: any) => { s.weights.push({ t: +now(), kg: v }); });
    setPeso(''); setPesoAberto(false); piscar('peso');
  };

  /* Catálogo em primeira pessoa. O que a pessoa lê é o acontecimento; o
     nome da funcionalidade fica para a tela de destino. */
  const CATALOGO: Record<QuickKey, Item> = {
    agua: { ic: 'water', titulo: 'Bebi água', sub: feito === 'agua' ? 'mais um copo' : `${litros} de ${alvoL} L hoje`, acao: maisAgua },
    exercicio: { ic: 'dumbbell', titulo: 'Me movimentei', sub: feito === 'exercicio' ? 'mais 30 min' : `${ci?.exerc || 0} min hoje`, acao: treinou },
    aplicacao: { ic: 'syringe', titulo: 'Apliquei a dose', sub: feito === 'aplicacao' ? 'registrada' : siteLabel(nextSite(S)), acao: registrarAplicacao },
    checkin: { ic: 'leaf', titulo: ci ? 'Revisar como estou' : 'Como estou agora', sub: ci ? 'já registrei hoje' : stk > 0 ? `${stk} dias seguidos` : 'menos de 30s', to: '/checkin', destaque: !ci },
    refeicao: { ic: 'utensils', titulo: 'Fiz uma refeição', sub: `${S.meals.length} registradas`, to: '/alimentacao' },
    sintomas: { ic: 'waves', titulo: 'Meu corpo reagiu', sub: 'enjoo, fome, intestino', to: '/sintomas' },
    exame: { ic: 'doc', titulo: 'Recebi um exame', sub: 'PDF ou foto', to: '/exames' },
    anotacoes: { ic: 'pencil', titulo: 'Anotei da consulta', sub: 'o que a médica orientou', to: '/consultas' },
  };

  /* Registros completos — o que não coube nos atalhos de agora. Peso fica
     sempre aqui: pede um número, mas resolve sem sair do sheet. */
  const completos: Item[] = [
    { ic: 'utensils', titulo: 'Fiz uma refeição', sub: 'o que comi e a proteína', to: '/alimentacao' },
    { ic: 'waves', titulo: 'Meu corpo reagiu', sub: 'enjoo, fome, intestino, humor', to: '/sintomas' },
    { ic: 'camera', titulo: 'Tirei uma foto de progresso', sub: 'para comparar depois', to: '/fotos' },
    { ic: 'ruler', titulo: 'Medi meu corpo', sub: 'cintura, quadril, composição', to: '/medidas' },
    { ic: 'doc', titulo: 'Recebi um exame', sub: 'importar PDF ou foto', to: '/exames' },
    { ic: 'leaf', titulo: 'Como estou agora', sub: 'check-in do dia', to: '/checkin' },
  ].filter((it) => !acoes.some((k) => CATALOGO[k].titulo === it.titulo));

  return (
    <View style={{ height: alturaJanela, justifyContent: 'flex-end' }}>
      <Pressable onPress={fechar} style={[StyleSheet.absoluteFillObject, { backgroundColor: c.scrim }]} />

      <View style={{
        backgroundColor: c.bg, maxHeight: alturaJanela * 0.88,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        paddingBottom: (insets.bottom || 12) + 16,
      }}>
        <Pressable onPress={fechar} style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 16 }}>
          <View style={{ width: 40, height: 4, borderRadius: radius.pill, backgroundColor: c.bg3 }} />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* a pergunta é o comando da tela */}
          <Txt v="h2">O que aconteceu agora?</Txt>
          <Row gap={7} style={{ marginTop: 6 }}>
            <Icon name="spark" size={13} color={c.accent} sw={2} />
            <Txt v="note" c={c.tx3}>{motivo}</Txt>
          </Row>

          {/* --- agora: três atalhos que mudam com o momento --- */}
          <Row gap={7} style={{ marginTop: 18, alignItems: 'stretch' }}>
            {acoes.map((k) => {
              const it = CATALOGO[k];
              const ok = feito === k;
              const lima = !!it.destaque;
              return (
                <Pressable
                  key={k}
                  onPress={it.acao ?? irPara(it.to!)}
                  style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}
                >
                  <View style={{ flex: 1, backgroundColor: ok ? c.lime : lima ? c.lime : c.bg1, borderRadius: radius.lg, padding: 14, alignItems: 'center' }}>
                    <Icon name={ok ? 'check' : it.ic} size={21} color={ok || lima ? c.limeInk : c.accent} sw={2} />
                    <Txt v="caption" c={ok || lima ? c.limeInk : c.tx} style={{ marginTop: 10, textAlign: 'center' }} numberOfLines={2}>{it.titulo}</Txt>
                    <Txt v="micro" c={ok || lima ? c.limeInk : c.tx3} style={{ marginTop: 3, textAlign: 'center', opacity: lima && !ok ? 0.7 : 1 }} numberOfLines={1}>{it.sub}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>

          {/* --- peso: um número, resolvido sem sair daqui --- */}
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 7, paddingHorizontal: 16 }}>
            <Pressable onPress={() => setPesoAberto((v) => !v)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <Row style={{ paddingVertical: 15 }}>
                <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={feito === 'peso' ? 'check' : 'scale'} size={17} color={feito === 'peso' ? c.accent : c.tx} sw={1.9} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="body">{feito === 'peso' ? 'Peso registrado' : 'Acabei de me pesar'}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                    {feito === 'peso' ? 'sua evolução foi atualizada' : `último: ${nf(curWeight(S), 1).replace('.', ',')} kg`}
                  </Txt>
                </View>
                <Icon name={pesoAberto ? 'chevup' : 'chevdown'} size={15} color={c.tx4} sw={2} />
              </Row>
            </Pressable>

            {pesoAberto && (
              <Row gap={10} style={{ paddingBottom: 15 }}>
                <TextInput
                  value={peso} onChangeText={setPeso} keyboardType="decimal-pad" autoFocus
                  placeholder={nf(curWeight(S), 1).replace('.', ',')} placeholderTextColor={c.tx4}
                  style={{ flex: 1, backgroundColor: c.bg2, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, color: c.tx, fontFamily: font.body, fontSize: 19 }}
                />
                <Txt v="body" c={c.tx3}>kg</Txt>
                <Pressable onPress={salvarPeso}>
                  <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 13 }}>
                    <Txt v="label" c={c.accentInk}>Salvar</Txt>
                  </View>
                </Pressable>
              </Row>
            )}
          </View>

          {/* --- separação pelo esforço, não por categoria --- */}
          <Row gap={10} style={{ marginTop: 24, marginBottom: 12 }}>
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>LEVA UM MINUTO</Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
          </Row>

          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
            {completos.map((it, i) => (
              <React.Fragment key={it.titulo}>
                {i > 0 && <Divider />}
                <Pressable onPress={irPara(it.to!)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row style={{ paddingVertical: 14 }}>
                    <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={it.ic} size={17} color={c.tx} sw={1.9} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Txt v="body">{it.titulo}</Txt>
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={1}>{it.sub}</Txt>
                    </View>
                    <Icon name="chev" size={15} color={c.tx4} sw={2} />
                  </Row>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
