import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../logic/store';
import {
  hasClinic, nextConsult, lastMessage, carePending, careDocs, penStock, M,
} from '../../logic/derive';
import { fmtDate, relDay, DOW_PT, nf } from '../../logic/time';
import { Txt, Card, Row, IconBadge, SectionHead, Divider } from '../../ui/kit';
import { Icon } from '../../ui/Icon';
import { useTheme } from '../../ui/useTheme';
import { radius } from '../../theme';

/* ============================================================
   CUIDADO — a aba das pessoas

   As outras três abas são sobre dados: a Home mostra o dia, a Jornada a
   história, o Insights a interpretação. Esta é sobre quem cuida — e por
   isso é a única sem hero colorido.

   A identidade vem da ausência: fundo claro, tipografia grande e muito
   ar. Um degradê aqui poria a tela no mesmo registro das outras, e o
   assunto pede o contrário — calma, não energia. Quem abre esta aba
   normalmente está com uma dúvida ou uma pendência, não explorando.

   Duas telas dentro de uma. Com clínica vinculada, é o painel do
   acompanhamento; sem vínculo, é a porta de entrada para encontrar um
   especialista — e nesse caso nada aqui finge que já existe uma equipe.
   ============================================================ */

const PAD = 24;

/* ------------------------------------------------------------------ *
 * COM VÍNCULO
 * ------------------------------------------------------------------ */

/** Quem cuida de você. Abre a tela porque é a resposta à pergunta que traz
    a pessoa aqui — "com quem eu falo?" — e não um cabeçalho decorativo. */
function Equipe() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const inicial = S.profile.doctor.replace(/^Dr[a]?\.\s*/, '')[0];
  const msg = lastMessage(S);

  return (
    <View style={{ marginTop: 26 }}>
      <Row gap={16}>
        {/* sem foto no perfil ainda — a inicial ocupa o lugar dela sem
            fingir um avatar que não existe */}
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
          <Txt v="h1" c={c.accent} style={{ fontSize: 28 }}>{inicial}</Txt>
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8 }}>SUA ESPECIALISTA</Txt>
          <Txt v="h2" style={{ marginTop: 4 }}>{S.profile.doctor}</Txt>
          <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>{S.profile.clinic}</Txt>
        </View>
      </Row>

      {/* Duas ações, lado a lado e do mesmo tamanho. Mensagem é a que a
          pessoa mais usa, então vem cheia; consulta é evento marcado, e
          botão cheio para uma coisa que já está agendada promete uma ação
          que não existe. */}
      <Row gap={10} style={{ marginTop: 20 }}>
        <Pressable onPress={go('/medico')} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}>
          <Row gap={8} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 14, justifyContent: 'center' }}>
            <Icon name="companion" size={17} color={c.accentInk} sw={1.9} />
            <Txt v="label" c={c.accentInk}>Mensagem</Txt>
            {S.unread > 0 && (
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c.lime, alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="micro" c={c.limeInk}>{S.unread}</Txt>
              </View>
            )}
          </Row>
        </Pressable>
        <Pressable onPress={go('/consultas')} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
          <Row gap={8} style={{ borderWidth: 1, borderColor: c.line, borderRadius: radius.pill, paddingVertical: 14, justifyContent: 'center' }}>
            <Icon name="cal" size={17} color={c.tx} sw={1.9} />
            <Txt v="label" c={c.tx}>Consultas</Txt>
          </Row>
        </Pressable>
      </Row>

      {!!msg && (
        <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 20, opacity: pressed ? 0.6 : 1 }]}>
          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
            <Row gap={8}>
              <Txt v="micro" c={c.tx3} style={{ letterSpacing: 0.8, flex: 1 }}>
                {msg.daEquipe ? 'ÚLTIMA MENSAGEM DELA' : 'VOCÊ ESCREVEU'} · {msg.quando.toUpperCase()}
              </Txt>
              {S.unread > 0 && msg.daEquipe && (
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.bad }} />
              )}
            </Row>
            <Txt v="body" c={c.tx2} style={{ marginTop: 10, lineHeight: 24 }} numberOfLines={3}>
              {msg.text}
            </Txt>
            <Row gap={6} style={{ marginTop: 14 }}>
              <Txt v="label" c={c.accent2}>Abrir conversa</Txt>
              <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
            </Row>
          </View>
        </Pressable>
      )}
    </View>
  );
}

/** O que está esperando você. Só aparece quando há algo — seção vazia com
    "nada pendente" é um lembrete de olhar para o nada. */
function Pendencias() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const itens = carePending(S);
  if (!itens.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Precisa de você" />
      <View style={{ marginTop: 14 }}>
        {itens.map((it, i) => (
          <Pressable key={it.texto} onPress={() => router.push(it.to as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Row gap={14} style={{ paddingVertical: 15, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: c.line }}>
              {/* destaque em azul, não em vermelho: nada nesta lista é
                  emergência — é o que precisa de um toque seu, e o vermelho
                  fica reservado para o que é clinicamente grave */}
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: it.urgente ? c.accentWeak : c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={it.ic} size={16} color={it.urgente ? c.accent : c.tx2} sw={1.9} />
              </View>
              <Txt v="bodyMed" style={{ flex: 1, lineHeight: 22 }}>{it.texto}</Txt>
              <Icon name="chev" size={15} color={c.tx4} sw={2} />
            </Row>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** A consulta como data, não como linha de lista: é o único compromisso
    marcado da pessoa com outra pessoa, e merece o tamanho disso. */
function Consulta() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const cs = nextConsult(S);
  if (!cs) return null;

  const go = (to: string) => () => router.push(to as any);
  /* fmtDate devolve "14 ago" — dia e mês separados por espaço, não por
     barra. O bloco de calendário quer as duas metades soltas. */
  const dia = cs.data.getDate();
  const mes = (fmtDate(cs.data).split(' ')[1] ?? '').toUpperCase();

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Sua próxima consulta" link="Histórico" onPress={go('/consultas')} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 20 }}>
        <Row gap={18}>
          {/* bloco de calendário: dia grande e mês pequeno, que é como a
              pessoa guarda a data na cabeça */}
          <View style={{ width: 64, alignItems: 'center', paddingVertical: 12, borderRadius: radius.md, backgroundColor: c.accentWeak }}>
            <Txt v="h1" c={c.accent} style={{ fontSize: 28 }}>{dia}</Txt>
            <Txt v="micro" c={c.accent} style={{ letterSpacing: 0.8 }}>{mes}</Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="title">{cs.tipo}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
              {DOW_PT[cs.data.getDay()]} · {cs.doutor}
            </Txt>
            <Row gap={7} style={{ marginTop: 10 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />
              <Txt v="caption" c={c.accent2}>É {cs.label}</Txt>
            </Row>
          </View>
        </Row>

        {cs.prepararAgora && (
          <>
            <Divider style={{ marginVertical: 18 }} />
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
              Eu monto um resumo com peso, adesão e sintomas do período — você escolhe
              o que quer perguntar.
            </Txt>
            <Pressable onPress={go('/companion?q=Prepare%20minha%20consulta')} style={({ pressed }) => [{ marginTop: 14, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
              <Row gap={8} style={{ borderWidth: 1, borderColor: c.line, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11 }}>
                <Icon name="aura" size={15} color={c.accent} sw={1.9} />
                <Txt v="label" c={c.accent2}>Preparar com o Companion</Txt>
              </Row>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

/** O que está sendo tomado, e quanto ainda tem. */
function Tratamento() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);
  const med = M(S);
  const p = penStock(S);
  const dose = nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0);
  const receita = (S.prescriptions as any[])[0];
  const critico = p.left <= 1;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Seu tratamento" link="Aplicações" onPress={go('/aplicacoes')} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 20 }}>
        <Row gap={16}>
          <IconBadge name="syringe" size={44} />
          <View style={{ flex: 1 }}>
            <Txt v="title">{med.label} {dose} {med.unit}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 3 }}>
              {med.cad === 'weekly' ? '1× por semana' : 'diariamente'} · prescrito por {receita?.by ?? S.profile.doctor}
            </Txt>
          </View>
        </Row>

        <Divider style={{ marginVertical: 18 }} />

        {/* Estoque em barra: "3 doses" não diz se é muito ou pouco; a barra
            contra o total da caneta diz na hora.

            Vermelho só quando resta uma dose ou menos. "Vale renovar a
            receita" é lembrete com semanas de antecedência, e pintá-lo de
            vermelho o iguala a um problema clínico — que é o que a cor de
            alerta precisa continuar significando neste app. */}
        <Row>
          <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>Doses na caneta</Txt>
          <Txt v="caption" c={critico ? c.cta : p.verdict.good ? c.tx3 : c.accent2}>{p.verdict.label}</Txt>
        </Row>
        <Row gap={5} style={{ marginTop: 10 }}>
          {Array.from({ length: p.total }, (_, i) => (
            <View
              key={i}
              style={{
                flex: 1, height: 6, borderRadius: 3,
                backgroundColor: i < p.left ? (critico ? c.cta : c.accent) : c.bg3,
              }}
            />
          ))}
        </Row>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 8 }}>
          {p.left} de {p.total} · cerca de {p.semanas} {p.semanas === 1 ? 'semana' : 'semanas'}
        </Txt>

        {!p.verdict.good && (
          <Pressable onPress={go('/medico')} style={({ pressed }) => [{ marginTop: 16, alignSelf: 'flex-start', opacity: pressed ? 0.8 : 1 }]}>
            <Row gap={7} style={{ backgroundColor: c.accentWeak, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11 }}>
              <Txt v="label" c={c.accent2}>Pedir renovação</Txt>
              <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
            </Row>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/** Exames, resumos e receitas numa lista só, por data — é assim que a
    pessoa procura ("o que veio depois da última consulta?"), não por tipo. */
function Documentos() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const docs = careDocs(S);
  if (!docs.length) return null;

  return (
    <View style={{ marginTop: 36 }}>
      <SectionHead title="Documentos" link="Exames" onPress={() => router.push('/exames' as any)} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, paddingHorizontal: 18 }}>
        {docs.map((d, i) => (
          <React.Fragment key={d.nome + d.t}>
            {i > 0 && <View style={{ height: 1, backgroundColor: c.line2 }} />}
            <Pressable onPress={() => router.push(d.to as any)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <Row gap={14} style={{ paddingVertical: 18 }}>
                <View style={{ width: 34, height: 34, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={d.tipo === 'Receita' ? 'pill' : 'doc'} size={16} color={c.tx2} sw={1.9} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="bodyMed" numberOfLines={1}>{d.nome}</Txt>
                  <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>
                    {d.tipo} · {relDay(new Date(d.t))}
                  </Txt>
                </View>
                <Icon name="chev" size={14} color={c.tx4} sw={2} />
              </Row>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * SEM VÍNCULO — descoberta
 *
 * O diretório real de profissionais depende de backend, que o app ainda
 * não tem. Então aqui não existe lista falsa: existe o convite e o que o
 * vínculo muda na prática.
 * ------------------------------------------------------------------ */
function Descoberta() {
  const { c } = useTheme();
  const router = useRouter();
  const pontos: [string, string, string][] = [
    ['steth', 'Especialistas credenciados', 'Médicos que acompanham tratamento com GLP-1 de perto.'],
    ['doc', 'Seus dados já organizados', 'Peso, aplicações, sintomas e exames prontos para a primeira consulta.'],
    ['companion', 'Conversa direta', 'Mensagens e retorno sem precisar remarcar consulta.'],
  ];
  return (
    <>
      <Card tint={c.accentWeak} style={{ marginTop: 24 }}>
        <IconBadge name="heart" size={48} bg={c.bg1} />
        <Txt v="h2" style={{ marginTop: 14 }}>Encontre quem acompanhe seu tratamento</Txt>
        <Txt v="note" c={c.tx2} style={{ marginTop: 8 }}>
          Você pode seguir sozinha no Forma. Mas quem tem acompanhamento profissional
          ajusta dose e protocolo com mais segurança — e essa decisão não é sua para
          tomar sozinha.
        </Txt>
      </Card>

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {pontos.map(([ic, t, sub], i) => (
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
  const insets = useSafeAreaInsets();
  const linked = hasClinic(S);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PAD, paddingTop: insets.top + 20, paddingBottom: 120 }}
      >
        <Txt v="h1">Cuidado</Txt>
        <Txt v="note" c={c.tx3} style={{ marginTop: 6 }}>
          {linked ? 'Sua equipe, suas consultas e o que está pendente.' : 'Ninguém precisa fazer isso sozinho.'}
        </Txt>

        {linked ? (
          <>
            <Equipe />
            <Pendencias />
            <Consulta />
            <Tratamento />
            <Documentos />
          </>
        ) : (
          <Descoberta />
        )}
      </ScrollView>
    </View>
  );
}
