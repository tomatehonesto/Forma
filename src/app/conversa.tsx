import React from 'react';
import { View, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { penStock, medComDose, fichaDe } from '../logic/derive';
import { Txt, Row, CircleBtn, Rolagem } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { now, relDay, fmtTime } from '../logic/time';
import { formaDe, noNa } from '../logic/formas';
import { radius, font } from '../theme';

/* ============================================================
   CONVERSA — o canal com a clínica

   ⚠️ ELA ERA UM CARD DENTRO DE OUTRA TELA, e isso é o defeito que esta
   tela existe para consertar.

   O histórico morava numa caixa de 250 px no meio de uma página que
   rolava: uma rolagem dentro de outra, o teclado subindo por cima do que
   a pessoa estava escrevendo, e a única parte VIVA da relação com a
   clínica com o mesmo peso visual que a lista de documentos.

   Conversa é tela. Ela ocupa tudo, o teclado empurra em vez de cobrir, e
   o histórico inteiro está a um gesto — não a um gesto dentro de outro.

   ⚠️ É UMA CONVERSA SÓ, COM A CLÍNICA, e não uma por pessoa. Quem
   responde pode ser qualquer um da equipe; mandar mensagem para uma
   pessoa específica cria a mensagem que morre esperando alguém que está
   de férias. A decisão está no §2 do spec.

   ⚠️ E O AUTOR DA RESPOSTA AINDA É SEMPRE A RESPONSÁVEL, porque o estado
   guarda só `from: 'me' | 'doc'`. Quando houver servidor, a mensagem
   chega com quem a escreveu e esta tela passa a mostrar o nome certo —
   até lá ela mostra o único nome que tem, em vez de inventar um.

   ⚠️ NADA DISTO TRANSMITE. As mensagens são gravadas no aparelho e não
   saem dele. Ver PENDENCIAS.md, item 6.
   ============================================================ */

export default function Conversa() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();

  const [msg, setMsg] = React.useState('');
  const listaRef = React.useRef<ScrollView>(null);
  const campoRef = React.useRef<TextInput>(null);

  const responsavel = fichaDe(S);
  const clinica = S.profile.clinic || 'Sua equipe';

  /* ⚠️ ABRIR A CONVERSA É LER AS MENSAGENS, e por isso o contador zera
     aqui e não no hub. Enquanto a caixa era um card, "lido" acontecia ao
     abrir uma tela que tem outras seis coisas — a pessoa podia zerar o
     aviso sem nunca ter rolado até a mensagem. */
  React.useEffect(() => {
    if (S.unread) update((s: any) => { s.unread = 0; });
  }, []);

  /* A CONVERSA ABRE NO FIM, e não no começo: a mensagem recente é o
     motivo de alguém entrar aqui. Sem animação — não é um movimento, é o
     lugar onde a tela começa. */
  React.useEffect(() => {
    const t = setTimeout(() => listaRef.current?.scrollToEnd({ animated: false }), 60);
    return () => clearTimeout(t);
  }, [S.messages.length]);

  const enviar = () => {
    const t = msg.trim();
    if (!t) return;
    update((s: any) => { s.messages.push({ t: +now(), from: 'me', text: t }); });
    setMsg('');
    setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 80);
  };

  /* ============================================================
     PEDIR RECEITA É MANDAR UMA MENSAGEM

     ⚠️ ESTE FLUXO MUDOU DE CASA JUNTO COM A CONVERSA. Ele nasceu no hub,
     onde o campo de texto morava; com o campo aqui, o rascunho tem que
     ser escrito aqui. As chamadas que traziam `?pedir=receita` para
     /medico agora trazem para cá.

     ⚠️⚠️ E O RASCUNHO NÃO SE ENVIA SOZINHO. O aplicativo escreve a frase e
     para. Quem manda é ela, no mesmo botão de sempre, depois de ler e
     mudar o que quiser — porque isto vai para um profissional de saúde,
     com o nome dela em cima, e um aplicativo que fala por alguém numa
     conversa clínica é o tipo de atalho que ninguém pediu.

     O rascunho carrega o que a equipe precisa para responder sem
     perguntar de volta: o medicamento com a dose e quantas doses
     sobraram na caneta. Os dois saem do estado. */
  const { pedir } = useLocalSearchParams<{ pedir?: string }>();
  const estoque = penStock(S);

  React.useEffect(() => {
    if (pedir !== 'receita') return;
    const restam = estoque.left === 1 ? 'Resta 1 dose' : `Restam ${estoque.left} doses`;
    setMsg(`Oi! Queria pedir a renovação da receita de ${medComDose(S)}. ${restam} ${noNa(formaDe(S))}.`);
    const t = setTimeout(() => campoRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [pedir]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {/* ---- o cabeçalho ----

          Fixo, e não rolando com a conversa: ele diz COM QUEM se está
          falando, e essa é a pergunta que volta quando a pessoa rola
          quarenta mensagens para trás. */}
      <View style={{
        paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: c.line,
      }}>
        <Row gap={12} style={{ alignItems: 'center' }}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <View style={{ flex: 1 }}>
            <Txt v="title" numberOfLines={1}>{clinica}</Txt>
            {responsavel ? (
              <Txt v="micro" c={c.tx3} numberOfLines={1} style={{ marginTop: 1 }}>
                {responsavel.nome}{responsavel.papel ? ` · ${responsavel.papel}` : ''}
              </Txt>
            ) : null}
          </View>
        </Row>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <Rolagem
          ref={listaRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {S.messages.map((m: any, i: number) => {
            const meu = m.from !== 'doc';
            return (
              <View
                key={i}
                style={{
                  alignSelf: meu ? 'flex-end' : 'flex-start',
                  maxWidth: '84%', marginBottom: 10,
                  backgroundColor: meu ? c.accent : c.bg1,
                  borderRadius: radius.lg, padding: 13,
                  borderBottomRightRadius: meu ? 5 : radius.lg,
                  borderBottomLeftRadius: meu ? radius.lg : 5,
                }}
              >
                {!meu && responsavel ? (
                  <Txt v="micro" c={c.tx3} style={{ marginBottom: 3 }}>{responsavel.nome}</Txt>
                ) : null}
                <Txt v="body" c={meu ? c.accentInk : c.tx} style={{ lineHeight: 23 }}>{m.text}</Txt>
                <Txt
                  v="micro"
                  c={meu ? 'rgba(255,255,255,0.72)' : c.tx4}
                  style={{ marginTop: 5 }}
                >
                  {relDay(new Date(m.t))} · {fmtTime(new Date(m.t))}
                </Txt>
              </View>
            );
          })}
        </Rolagem>

        {/* ---- o campo ---- */}
        <View style={{
          paddingHorizontal: 16, paddingTop: 10,
          paddingBottom: insets.bottom + 10,
          borderTopWidth: 1, borderTopColor: c.line, backgroundColor: c.bg,
        }}>
          <Row gap={10} style={{ alignItems: 'flex-end' }}>
            <TextInput
              ref={campoRef}
              value={msg}
              onChangeText={setMsg}
              placeholder="Escrever para a equipe…"
              placeholderTextColor={c.tx4}
              multiline
              /* ⚠️ SEM `onSubmitEditing`, e multilinha. O campo antigo
                 enviava no Enter — numa mensagem para profissional de
                 saúde, onde quebrar linha é normal, isso manda metade da
                 frase. O envio é o botão, e só ele. */
              style={[{
                flex: 1, maxHeight: 120,
                backgroundColor: c.bg1, borderRadius: radius.lg,
                borderWidth: 1, borderColor: c.line,
                paddingHorizontal: 15, paddingVertical: 12,
                color: c.tx, fontFamily: font.body, fontSize: 17, lineHeight: 23,
              }, { outlineStyle: 'none' } as any]}
            />
            <Pressable onPress={enviar} disabled={!msg.trim()} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: msg.trim() ? c.accent : c.bg2,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="send" size={18} color={msg.trim() ? c.accentInk : c.tx4} sw={2} />
              </View>
            </Pressable>
          </Row>

          {/* A promessa do canal, que já existia e continua valendo. */}
          <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', marginTop: 9 }}>
            Canal organizado com a clínica — some do WhatsApp, entra no seu histórico
          </Txt>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
