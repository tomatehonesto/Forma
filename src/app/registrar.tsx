import React, { useState } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { nextSite, siteLabel, curWeight, checkinToday, waterMlToday, M } from '../logic/derive';
import { now, startOfDay, nf } from '../logic/time';
import { Txt, Row, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';

/* ============================================================
   REGISTRAR — bottom sheet, não tela.

   Registrar é um desvio rápido do que a pessoa estava fazendo; o contexto
   de trás continua visível e ela volta para ele. A altura segue o conteúdo
   (fitToContents em app/_layout) e quem fecha é o grabber nativo.

   A tela se divide pelo custo da ação, não por categoria:
     · três tiles que gravam num toque só
     · uma linha de peso que abre o teclado ali mesmo
     · o resto, que precisa de formulário, navega
   ============================================================ */

export default function Registrar() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [pesoAberto, setPesoAberto] = useState(false);
  const [peso, setPeso] = useState('');
  const [feito, setFeito] = useState<string | null>(null);

  const piscar = (k: string) => { setFeito(k); setTimeout(() => setFeito(null), 1600); };

  /* fecha o sheet antes de navegar: empilhar tela sobre sheet prende a
     pessoa em duas camadas de volta */
  const irPara = (to: string) => () => { router.back(); setTimeout(() => router.push(to as any), 60); };

  const ci = checkinToday(S);
  const litros = (waterMlToday(S) / 1000).toFixed(1).replace('.', ',');
  const alvoL = ((S.profile as any).targets.waterMl / 1000).toFixed(1).replace('.', ',');

  const registrarAplicacao = () => {
    update((s: any) => { s.injections.push({ t: +now(), med: s.profile.med, dose: s.profile.dose, site: nextSite(s), note: '' }); });
    piscar('aplic');
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
    piscar('exerc');
  };
  const salvarPeso = () => {
    const v = parseFloat(peso.replace(',', '.'));
    if (!v || v < 30 || v > 250) return;
    update((s: any) => { s.weights.push({ t: +now(), kg: v }); });
    setPeso(''); setPesoAberto(false); piscar('peso');
  };

  /* um toque, sem formulário */
  const rapidas: [string, string, string, string, () => void][] = [
    ['water', 'agua', 'Água', feito === 'agua' ? 'registrado' : `${litros} de ${alvoL} L`, maisAgua],
    ['dumbbell', 'exerc', 'Exercício', feito === 'exerc' ? 'registrado' : `${ci?.exerc || 0} min hoje`, treinou],
    ['syringe', 'aplic', 'Aplicação', feito === 'aplic' ? 'registrada' : siteLabel(nextSite(S)), registrarAplicacao],
  ];

  /* precisam de formulário */
  const comFormulario: [string, string, string, string][] = [
    ['leaf', 'Check-in de hoje', ci ? 'já registrado — pode revisar' : 'como você está · menos de 30s', '/checkin'],
    ['utensils', 'Refeição', 'o que você comeu e a proteína', '/alimentacao'],
    ['waves', 'Sintomas', 'como seu corpo tem reagido', '/sintomas'],
    ['camera', 'Foto de progresso', 'evolução visual, antes e depois', '/fotos'],
    ['ruler', 'Medidas do corpo', 'cintura, quadril, composição', '/medidas'],
    ['doc', 'Exame', 'importar PDF ou foto', '/exames'],
  ];

  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 24, paddingTop: 22, paddingBottom: (insets.bottom || 12) + 16 }}>
      <Txt v="h2">Registrar</Txt>
      <Txt v="note" c={c.tx3} style={{ marginTop: 3 }}>O que aconteceu agora?</Txt>

      {/* --- um toque --- */}
      <Row gap={7} style={{ marginTop: 20 }}>
        {rapidas.map(([ic, k, titulo, sub, acao]) => {
          const ok = feito === k;
          return (
            <Pressable key={k} onPress={acao} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
              <View style={{ backgroundColor: ok ? c.lime : c.bg1, borderRadius: radius.lg, padding: 14, alignItems: 'center' }}>
                <Icon name={ok ? 'check' : ic} size={20} color={ok ? c.limeInk : c.accent} sw={2} />
                <Txt v="caption" c={ok ? c.limeInk : c.tx} style={{ marginTop: 9 }}>{titulo}</Txt>
                <Txt v="micro" c={ok ? c.limeInk : c.tx3} style={{ marginTop: 2 }} numberOfLines={1}>{sub}</Txt>
              </View>
            </Pressable>
          );
        })}
      </Row>

      {/* --- peso: teclado ali mesmo, sem sair do sheet --- */}
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 7, paddingHorizontal: 16 }}>
        <Pressable onPress={() => setPesoAberto((v) => !v)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
          <Row style={{ paddingVertical: 15 }}>
            <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={feito === 'peso' ? 'check' : 'scale'} size={17} color={feito === 'peso' ? c.accent : c.tx} sw={1.9} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="body">{feito === 'peso' ? 'Peso registrado' : 'Peso'}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>
                {feito === 'peso' ? 'sua evolução foi atualizada' : `hoje ${nf(curWeight(S), 1).replace('.', ',')} kg`}
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

      {/* --- precisam de formulário --- */}
      <ScrollView style={{ marginTop: 7 }} contentContainerStyle={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {comFormulario.map(([ic, titulo, sub, to], i) => (
          <React.Fragment key={titulo}>
            {i > 0 && <Divider />}
            <Pressable onPress={irPara(to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ paddingVertical: 15 }}>
                <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={ic} size={17} color={c.tx} sw={1.9} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="body">{titulo}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={1}>{sub}</Txt>
                </View>
                <Icon name="chev" size={15} color={c.tx4} sw={2} />
              </Row>
            </Pressable>
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}
