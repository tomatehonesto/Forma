import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../logic/store';
import { hasClinic } from '../../logic/derive';
import { now, diffDays, fmtDate, relDay, DOW_PT } from '../../logic/time';
import { Screen, Txt, Card, Row, IconBadge, Chevron, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

/* Cuidado — a área da equipe médica. Tem dois estados bem diferentes:
   com vínculo, é o painel do acompanhamento; sem vínculo, é a porta de
   entrada para encontrar um especialista.

   Esta é uma primeira versão: cobre "Visão geral" e "Equipe" da árvore,
   e leva às telas que já existem. Consultas/Conversas/Documentos ainda
   não têm frame — quando chegarem, viram seções próprias aqui. */

function Overview() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const consultD = new Date(S.consult.t);
  const cDays = diffDays(consultD, now());
  const exame = S.protocol.tasks.find((t: any) => !t.done && /exame/i.test(t.t));

  type Item = { ic: string; title: string; sub: string; to: string; warn?: boolean; dot?: boolean };
  const items: Item[] = [];
  items.push({
    ic: 'cal', title: cDays <= 0 ? 'Consulta hoje' : `Consulta ${relDay(consultD)}`,
    sub: `${S.consult.type} · ${fmtDate(consultD)}, ${DOW_PT[consultD.getDay()]}`,
    to: '/consultas', warn: cDays <= 1,
  });
  if (S.unread > 0) items.push({
    ic: 'companion', title: `${S.unread} ${S.unread === 1 ? 'nova mensagem' : 'novas mensagens'}`,
    sub: `De ${S.profile.doctor}`, to: '/medico', dot: true,
  });
  items.push({ ic: 'pill', title: 'Renovar receita', sub: 'Restam 3 doses na caneta', to: '/medico' });
  if (exame) items.push({ ic: 'doc', title: exame.t, sub: 'Pendente no protocolo desta semana', to: '/exames' });

  return (
    <>
      <Txt v="h2" style={{ marginTop: 28 }}>Visão geral</Txt>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {items.map((it, i) => (
          <React.Fragment key={it.title}>
            {i > 0 && <Divider style={{ marginVertical: 12 }} />}
            <Pressable onPress={go(it.to)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row style={{ height: 48 }}>
                <View>
                  <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: it.warn ? c.ctaWeak : 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={it.ic} size={18} color={it.warn ? c.cta : c.tx} sw={1.8} />
                  </View>
                  {it.dot && <View style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: c.bad }} />}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt v="body">{it.title}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={1}>{it.sub}</Txt>
                </View>
                <Chevron size={15} color={c.tx2} />
              </Row>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </>
  );
}

function Team() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const people = [
    { role: 'Médica', name: S.profile.doctor, ic: 'steth' },
    ...(S.profile.nutri ? [{ role: 'Nutricionista', name: S.profile.nutri, ic: 'leaf' }] : []),
  ];
  return (
    <>
      <Txt v="h2" style={{ marginTop: 32 }}>Equipe de cuidado</Txt>
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {people.map((p, i) => (
          <React.Fragment key={p.name}>
            {i > 0 && <Divider style={{ marginVertical: 14 }} />}
            <Pressable onPress={() => router.push('/medico' as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row>
                <View style={{ width: 52, height: 52, borderRadius: radius.md, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
                  <Txt v="h2" c={c.accent}>{p.name.replace(/^Dr[a]?\.\s*/, '')[0]}</Txt>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.6 }}>{p.role.toUpperCase()}</Txt>
                  <Txt v="title" style={{ marginTop: 2 }}>{p.name}</Txt>
                </View>
                <Chevron size={15} color={c.tx2} />
              </Row>
            </Pressable>
          </React.Fragment>
        ))}
        <Divider style={{ marginVertical: 14 }} />
        <Row>
          <IconBadge name="heart" size={52} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.6 }}>CLÍNICA</Txt>
            <Txt v="title" style={{ marginTop: 2 }}>{S.profile.clinic}</Txt>
          </View>
        </Row>
      </View>
    </>
  );
}

/* Sem vínculo: descoberta de especialistas credenciados.
   O diretório real depende de backend (cadastro de profissionais), que o
   app ainda não tem — então aqui não há lista falsa, só o convite. */
function Discovery() {
  const { c } = useTheme();
  const router = useRouter();
  const bullets = [
    ['steth', 'Especialistas credenciados', 'Médicos que acompanham tratamento com GLP-1.'],
    ['doc', 'Seus dados já organizados', 'Peso, aplicações, sintomas e exames prontos para a primeira consulta.'],
    ['companion', 'Conversa direta', 'Mensagens e retorno sem precisar remarcar consulta.'],
  ];
  return (
    <>
      <Card tint={c.accentWeak} style={{ marginTop: 22 }}>
        <IconBadge name="heart" size={48} bg={c.bg1} />
        <Txt v="h2" style={{ marginTop: 14 }}>Encontre quem acompanhe seu tratamento</Txt>
        <Txt v="note" c={c.tx2} style={{ marginTop: 8 }}>
          Você pode seguir sozinho no Forma. Mas quem tem acompanhamento profissional costuma
          ajustar dose e protocolo com mais segurança — e você não decide isso sozinho.
        </Txt>
      </Card>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {bullets.map(([ic, t, sub], i) => (
          <React.Fragment key={t}>
            {i > 0 && <Divider style={{ marginVertical: 14 }} />}
            <Row style={{ alignItems: 'flex-start' }}>
              <IconBadge name={ic} size={38} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt v="body">{t}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{sub}</Txt>
              </View>
            </Row>
          </React.Fragment>
        ))}
      </View>

      <Pressable onPress={() => router.push('/perfil' as any)} style={({ pressed }) => [{ marginTop: 16, opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>Vincular uma clínica</Txt>
        </View>
      </Pressable>
    </>
  );
}

export default function Cuidado() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const linked = hasClinic(S);
  return (
    <Screen>
      <View style={{ marginTop: 8 }}>
        <Txt v="h1">Cuidado</Txt>
        <Txt v="note" c={c.tx3} style={{ marginTop: 6 }}>
          {linked ? 'Sua equipe, suas consultas e o que está pendente.' : 'Ninguém precisa fazer isso sozinho.'}
        </Txt>
      </View>
      {linked ? <><Overview /><Team /></> : <Discovery />}
    </Screen>
  );
}
