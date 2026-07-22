import React, { useState } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { nextSite, siteLabel, curWeight, checkinToday, GOAL_WATER } from '../logic/derive';
import { now, startOfDay, kg } from '../logic/time';
import { Txt, Card, Row, IconBadge, Chevron, CircleBtn } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { space, radius, font } from '../theme';

export default function Registrar() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pesoOpen, setPesoOpen] = useState(false);
  const [peso, setPeso] = useState('');
  const [done, setDone] = useState<string | null>(null);

  const flash = (k: string) => { setDone(k); setTimeout(() => setDone(null), 1600); };

  const registrarAplicacao = () => {
    update((s: any) => { s.injections.push({ t: +now(), med: s.profile.med, dose: s.profile.dose, site: nextSite(s), note: '' }); });
    flash('aplic');
  };
  const salvarPeso = () => {
    const v = parseFloat(peso.replace(',', '.'));
    if (!v || v < 30 || v > 250) return;
    update((s: any) => { s.weights.push({ t: +now(), kg: v }); });
    setPeso(''); setPesoOpen(false); flash('peso');
  };
  const maisAgua = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      const ci = s.checkins.find((x: any) => x.t === t);
      if (ci) ci.agua = Math.min(GOAL_WATER + 4, (ci.agua || 0) + 1);
      else s.checkins.push({ t, mood: 3, fome: 5, nausea: 0, sono: 7, gut: 'normal', energia: 6, agua: 1, prot: 0, exerc: 0, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    flash('agua');
  };
  const aguaHoje = checkinToday(S)?.agua || 0;
  const treinou = () => {
    update((s: any) => {
      const t = +startOfDay(now());
      const ci = s.checkins.find((x: any) => x.t === t);
      if (ci) ci.exerc = (ci.exerc || 0) + 30;
      else s.checkins.push({ t, mood: 3, fome: 5, nausea: 0, sono: 7, gut: 'normal', energia: 6, agua: 0, prot: 0, exerc: 30, refluxo: 0, ansiedade: 0, constip: 0 });
    });
    flash('exerc');
  };
  const exercHoje = checkinToday(S)?.exerc || 0;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 6 }}>
      <Row style={{ justifyContent: 'space-between', paddingHorizontal: space.lg }}>
        <View>
          <Txt v="display" style={{ fontSize: 26 }}>Registrar</Txt>
          <Txt v="bodyMed" c={c.tx3} style={{ marginTop: 3 }}>O que você quer fazer agora?</Txt>
        </View>
        <CircleBtn name="x" onPress={() => router.back()} />
      </Row>

      <ScrollView contentContainerStyle={{ paddingHorizontal: space.lg, paddingTop: 18, paddingBottom: (insets.bottom || 12) + 16, gap: 11 }} showsVerticalScrollIndicator={false}>
        {/* check-in */}
        <Card style={{ paddingVertical: 15 }} onPress={() => { router.back(); setTimeout(() => router.push('/checkin' as any), 60); }}>
          <Row>
            <IconBadge name="leaf" size={42} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Check-in de hoje</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Como você está · menos de 30s</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>

        {/* aplicação — 1 toque, real */}
        <Card style={{ paddingVertical: 15 }} onPress={registrarAplicacao}>
          <Row>
            <IconBadge name="syringe" size={42} color={done === 'aplic' ? '#fff' : undefined} bg={done === 'aplic' ? c.accent : undefined} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">{done === 'aplic' ? 'Aplicação registrada' : 'Registrar aplicação'}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{done === 'aplic' ? 'Histórico atualizado' : `Dose de hoje · local sugerido: ${siteLabel(nextSite(S))}`}</Txt>
            </View>
            {done === 'aplic' ? <Icon name="check" size={20} color={c.accent} sw={2.4} /> : <Chevron />}
          </Row>
        </Card>

        {/* peso — expande input, real */}
        <Card style={{ paddingVertical: 15 }} onPress={() => setPesoOpen((v) => !v)}>
          <Row>
            <IconBadge name="scale" size={42} color={done === 'peso' ? '#fff' : undefined} bg={done === 'peso' ? c.accent : undefined} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">{done === 'peso' ? 'Peso registrado' : 'Registrar peso'}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{done === 'peso' ? 'Evolução atualizada' : `Atualiza sua evolução · hoje ${kg(curWeight(S))} kg`}</Txt>
            </View>
            {done === 'peso' ? <Icon name="check" size={20} color={c.accent} sw={2.4} /> : <Icon name={pesoOpen ? 'chevup' : 'chevdown'} size={17} color={c.tx4} sw={2} />}
          </Row>
          {pesoOpen && (
            <Row gap={10} style={{ marginTop: 12 }}>
              <TextInput
                value={peso} onChangeText={setPeso} keyboardType="decimal-pad" placeholder={kg(curWeight(S))} placeholderTextColor={c.tx4}
                style={{ flex: 1, backgroundColor: c.bg2, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, color: c.tx, fontFamily: font.bodySemi, fontSize: 17 }}
              />
              <Txt v="label" c={c.tx3}>kg</Txt>
              <Pressable onPress={salvarPeso}>
                <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 12 }}>
                  <Txt v="label" c="#fff">Salvar</Txt>
                </View>
              </Pressable>
            </Row>
          )}
        </Card>

        {/* água — 1 toque, real */}
        <Card style={{ paddingVertical: 15 }} onPress={maisAgua}>
          <Row>
            <IconBadge name="water" size={42} color={c.water} bg={c.waterBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">{done === 'agua' ? 'Copo registrado' : 'Mais um copo de água'}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{aguaHoje} de {GOAL_WATER} copos hoje</Txt>
            </View>
            {done === 'agua' ? <Icon name="check" size={20} color={c.water} sw={2.4} /> : <Icon name="plus" size={18} color={c.water} sw={2.2} />}
          </Row>
        </Card>

        {/* refeição */}
        <Card style={{ paddingVertical: 15 }} onPress={() => { router.back(); setTimeout(() => router.push('/alimentacao' as any), 60); }}>
          <Row>
            <IconBadge name="utensils" size={42} color={c.amber} bg={c.amberBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Registrar refeição</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Favoritos e proteína do dia</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>

        {/* exercício — 1 toque, real */}
        <Card style={{ paddingVertical: 15 }} onPress={treinou}>
          <Row>
            <IconBadge name="dumbbell" size={42} color={done === 'exerc' ? '#fff' : c.accent2} bg={done === 'exerc' ? c.accent2 : c.waterBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">{done === 'exerc' ? 'Treino registrado' : 'Registrar exercício'}</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{done === 'exerc' ? 'Mais 30 min no seu dia' : `+30 min de movimento · hoje ${exercHoje} min`}</Txt>
            </View>
            {done === 'exerc' ? <Icon name="check" size={20} color={c.accent2} sw={2.4} /> : <Icon name="plus" size={18} color={c.accent2} sw={2.2} />}
          </Row>
        </Card>

        {/* foto */}
        <Card style={{ paddingVertical: 15 }} onPress={() => { router.back(); setTimeout(() => router.push('/fotos' as any), 60); }}>
          <Row>
            <IconBadge name="camera" size={42} color={c.purple} bg={c.purpleBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Foto de progresso</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Evolução visual, antes e depois</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>

        {/* medidas / sintomas / exame */}
        <Card style={{ paddingVertical: 15 }} onPress={() => { router.back(); setTimeout(() => router.push('/medidas' as any), 60); }}>
          <Row>
            <IconBadge name="ruler" size={42} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Medidas do corpo</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Cintura, quadril, composição</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
        <Card style={{ paddingVertical: 15 }} onPress={() => { router.back(); setTimeout(() => router.push('/sintomas' as any), 60); }}>
          <Row>
            <IconBadge name="waves" size={42} color={c.rose} bg={c.roseBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Sintomas</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>Como seu corpo tem reagido</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
        <Card style={{ paddingVertical: 15 }} onPress={() => { router.back(); setTimeout(() => router.push('/exames' as any), 60); }}>
          <Row>
            <IconBadge name="doc" size={42} color={c.amber} bg={c.amberBg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt v="title">Importar exame</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>PDF ou foto, organizado pela IA</Txt>
            </View>
            <Chevron />
          </Row>
        </Card>
      </ScrollView>
    </View>
  );
}
