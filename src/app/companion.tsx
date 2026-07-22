import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import type { State } from '../logic/seed';
import { M, curWeight, lostKg, lostPct, adesao, hungerForecast, nextInjectionDate, lastInjection, siteLabel, waterToday, GOAL_WATER } from '../logic/derive';
import { now, diffDays, fmtDate, relDay, nf, kg } from '../logic/time';
import { Txt, Row, CircleBtn, Rich } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { space, radius, font } from '../theme';

type Msg = { who: 'me' | 'ai'; text: string; mini?: string };
const QCHIPS = ['Como está minha evolução?', 'Prepare minha consulta', 'Por que sinto mais fome?', 'O que registrar antes de dormir?'];

/* porta verbatim do protótipo — respostas heurísticas ancoradas nos dados reais */
function companionReply(S: State, text: string): Msg {
  const t = text.toLowerCase();
  const has = (...k: string[]) => k.some((x) => t.includes(x));
  const med = M(S);
  if (has('evolu', 'progress', 'como estou', 'como vou', 'peso')) {
    const days = diffDays(now(), new Date(S.profile.startT));
    return { who: 'ai', text: `Nos <b>${days} dias</b> de tratamento você saiu de ${kg(S.profile.startWeight)} para <b>${kg(curWeight(S))} kg</b> — menos ${kg(lostKg(S))} kg (${nf(lostPct(S), 1)}%). Já passou dos 5% de perda, uma marca clínica que reduz riscos. Sua adesão às aplicações está em ${adesao(S)}%.`, mini: `Ritmo saudável e constante: cerca de ${kg(lostKg(S) / (days / 7))} kg por semana. O peso é um sinal entre vários — energia, sono e exames também contam.` };
  }
  if (has('consulta', 'prepar', 'médic', 'doutora', 'helena')) {
    return { who: 'ai', text: `Montei um resumo pra sua ${S.consult.type.toLowerCase()} <b>${relDay(new Date(S.consult.t))}</b> com a ${S.consult.doctor}:`, mini: `• Peso: ${kg(curWeight(S))} kg (−${kg(lostKg(S))} kg / ${nf(lostPct(S), 1)}%)\n• Dose atual: ${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}, adesão ${adesao(S)}%\n• Sintomas: náusea leve nos dias pós-aplicação, já melhorando\n• Perguntas sugeridas: manter ou ajustar a dose? o platô é esperado? exames a repetir?` };
  }
  if (has('fome', 'saciedade', 'vontade de comer')) {
    const hf = hungerForecast(S);
    return { who: 'ai', text: `A fome acompanha o nível da ${med.mol.toLowerCase()} no seu corpo. Logo após a aplicação ele está alto e a saciedade é maior; <b>perto da próxima dose ele cai</b> e a fome volta. ${hf ? `No seu caso, esse ponto mais baixo é ${hf.inDays <= 1 ? 'nestes dias' : `em ${hf.inDays} dias`}.` : ''}`, mini: `Ajuda nesses dias: priorizar proteína, hidratar bem e não pular refeições. Se a fome estiver difícil de controlar, vale anotar pra conversar com a Dra. Helena — quem ajusta dose é ela.` };
  }
  if (has('náusea', 'nausea', 'enjoo', 'enjôo', 'mal estar', 'sintoma')) {
    return { who: 'ai', text: `Sentir náusea leve, principalmente nos primeiros dias após aumentar a dose, é comum e costuma <b>diminuir com o tempo</b> — seus próprios registros já mostram isso melhorando.`, mini: `O que costuma ajudar: refeições menores, evitar frituras e comer devagar. Se ficar forte, persistente ou vier com vômito, me avisa que eu destaco isso pra sua equipe.` };
  }
  if (has('dose', 'aplica', 'aplicar', 'injeç', 'caneta')) {
    const nd = nextInjectionDate(S); const li = lastInjection(S);
    return { who: 'ai', text: `Sua próxima aplicação é <b>${relDay(nd)}</b> (${fmtDate(nd)}), ${med.label} ${nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0)} ${med.unit}. Sugiro alternar o local — da última vez foi ${li ? siteLabel(li.site) : 'abdômen'}.`, mini: `Importante: eu não altero doses nem protocolos. Qualquer mudança é decisão da Dra. Helena. Posso te lembrar no dia e registrar a aplicação.` };
  }
  if (has('água', 'agua', 'hidrat')) {
    return { who: 'ai', text: `Hoje você registrou <b>${waterToday(S)} de ${GOAL_WATER} copos</b>. Reparei que aos fins de semana a hidratação cai — e a água ajuda bastante com saciedade e com a náusea.`, mini: `Quer que eu te lembre de beber água nos sábados e domingos?` };
  }
  if (has('proteína', 'proteina')) {
    return { who: 'ai', text: `Proteína é uma das suas metas — e você vem cumprindo bem. Manter a ingestão alta durante a perda de peso <b>protege sua massa magra</b>, o que sustenta seu metabolismo.`, mini: `Média recente perto de 90 g/dia. Boas fontes práticas: ovos, iogurte natural, frango, peixe e leguminosas.` };
  }
  if (has('meta', 'objetivo', 'jeans', 'roupa', 'energia', 'dormir', 'sono')) {
    return { who: 'ai', text: `Suas metas vão além do peso, e é assim que deve ser. Sono e energia estão sendo acompanhados nos seus check-ins, e o peso segue uma tendência constante. Transformação é o conjunto, não só a balança.`, mini: `Quer adicionar uma nova meta, além da balança? Posso te levar até lá.` };
  }
  if (has('exame', 'hba1c', 'colesterol', 'glicemia', 'ldl', 'hdl', 'triglic', 'vitamina', 'ferritina', 'tsh', 'insulina', 'creatinina')) {
    return { who: 'ai', text: `Seus exames vêm melhorando junto com o tratamento. Destaques: <b>HbA1c 6,3 → 5,6%</b>, LDL e triglicerídeos em queda, HDL e vitamina D em alta.`, mini: `Posso abrir um marcador específico e explicar o que ele significa — é só ir em Exames. Não substituo a leitura da sua médica.` };
  }
  if (has('medicament', 'remédio', 'remedio', 'tirzep', 'semaglut', 'bula', 'como funciona')) {
    return { who: 'ai', text: `${med.label} tem como princípio ativo a <b>${med.mol.toLowerCase()}</b>, aplicada ${med.cad === 'weekly' ? '1×/semana' : 'diariamente'}. Ela aumenta a saciedade e ajuda no controle da glicose.`, mini: `Efeitos comuns no começo: náusea leve e menos apetite. Dúvidas sobre dose ou troca de medicação são sempre com a Dra. Helena.` };
  }
  if (has('protocolo', 'missão', 'missao', 'tarefa', 'checklist')) {
    const p = S.protocol, done = p.tasks.filter((x: any) => x.done).length;
    const next = p.tasks.find((x: any) => !x.done);
    return { who: 'ai', text: `No protocolo da <b>semana ${p.week}</b> você concluiu ${done} de ${p.tasks.length} itens. ${next ? `Falta: ${next.t}.` : 'Tudo em dia.'}`, mini: `Quer que eu te lembre das tarefas ao longo da semana?` };
  }
  if (has('oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'obrigad', 'valeu')) {
    return { who: 'ai', text: `Tô aqui com você. Pode me perguntar sobre sua evolução, sintomas, exames, a próxima dose ou a consulta — o que fizer sua semana mais leve.` };
  }
  return { who: 'ai', text: `Entendi. Posso te ajudar melhor com algo específico da sua jornada — sua evolução, um sintoma, a linha da medicação, ou preparar a consulta com a Dra. Helena. Só lembrando que <b>não tomo decisões médicas</b>: pra dose e protocolo, quem decide é sua equipe.` };
}

export default function Companion() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: 'ai', text: `Oi, ${S.profile.name.split(' ')[0]}. Estou aqui do seu lado no tratamento. Conheço toda a sua jornada — posso resumir sua evolução, preparar sua consulta, explicar um sintoma ou organizar perguntas pra ${S.profile.doctor}. No que te ajudo agora?` },
  ]);
  const [input, setInput] = useState('');

  // camada transversal: chegou com ?q= (CTA contextual), pergunta sozinho
  const { q } = useLocalSearchParams<{ q?: string }>();
  const askedRef = useRef(false);
  useEffect(() => {
    if (q && !askedRef.current) { askedRef.current = true; setTimeout(() => ask(String(q)), 380); }
  }, [q]);

  const ask = (text: string) => {
    const t = text.trim(); if (!t) return;
    setInput('');
    setMsgs((m) => [...m, { who: 'me', text: t }]);
    setTimeout(() => {
      setMsgs((m) => [...m, companionReply(S, t)]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 90);
    }, 450);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 90);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      {/* header */}
      <Row style={{ paddingTop: insets.top + 6, paddingHorizontal: space.lg, paddingBottom: 10 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="aura" size={20} color={c.accent} sw={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="h2" style={{ fontSize: 17 }}>Companion</Txt>
          <Row gap={5}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.good }} />
            <Txt v="micro" c={c.tx3}>conhece sua jornada · não substitui o médico</Txt>
          </Row>
        </View>
      </Row>

      {/* thread */}
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 12, gap: 10 }} showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
        {msgs.map((m, i) => m.who === 'me' ? (
          <View key={i} style={{ alignSelf: 'flex-end', maxWidth: '84%', backgroundColor: c.accent, borderRadius: radius.lg, borderBottomRightRadius: 5, paddingHorizontal: 14, paddingVertical: 11 }}>
            <Txt v="bodyMed" c="#fff" style={{ lineHeight: 20 }}>{m.text}</Txt>
          </View>
        ) : (
          <Row key={i} style={{ alignItems: 'flex-end', maxWidth: '92%' }} gap={8}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="aura" size={15} color={c.accent} sw={1.9} />
            </View>
            <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: c.line, paddingHorizontal: 14, paddingVertical: 12 }}>
              <Rich v="bodyMed" base={c.tx} bold={c.accent} style={{ lineHeight: 20 }} text={m.text} />
              {!!m.mini && (
                <View style={{ marginTop: 9, backgroundColor: c.accentWeak, borderRadius: radius.sm, padding: 10 }}>
                  <Txt v="caption" c={c.tx2} style={{ lineHeight: 18 }}>{m.mini}</Txt>
                </View>
              )}
            </View>
          </Row>
        ))}
      </ScrollView>

      {/* quick chips + composer */}
      <View style={{ paddingBottom: (insets.bottom || 10) + 6, backgroundColor: c.bg }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 8, paddingVertical: 8 }}>
          {QCHIPS.map((q) => (
            <Pressable key={q} onPress={() => ask(q)}>
              <View style={{ paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line2 }}>
                <Txt v="label" c={c.tx2}>{q}</Txt>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <Row style={{ paddingHorizontal: space.lg, marginTop: 2 }} gap={8}>
          <TextInput
            value={input} onChangeText={setInput} onSubmitEditing={() => ask(input)}
            placeholder="Pergunte sobre sua jornada..." placeholderTextColor={c.tx4}
            style={{ flex: 1, backgroundColor: c.bg1, borderWidth: 1, borderColor: c.line, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 12, color: c.tx, fontFamily: font.body, fontSize: 15 }}
          />
          <Pressable onPress={() => ask(input)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="send" size={19} color="#fff" sw={2} />
            </View>
          </Pressable>
        </Row>
      </View>
    </KeyboardAvoidingView>
  );
}
