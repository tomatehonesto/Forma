import React from 'react';
import { View, Pressable, Switch, Linking, Platform, AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { doseReminderDate, pesoReminderDate, dailyReminderDate, reminderWhen } from '../logic/derive';
import { DOW_SHORT, hm } from '../logic/time';
import { Screen, Txt, Card, Row, CircleBtn, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { estadoDaPermissao, pedirPermissao, type Permissao } from '../logic/avisos';

const HOURS = [7, 8, 9, 12, 15, 20];

export default function Lembretes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const R: any = S.reminders;

  const set = (key: string, field: string, val: any) => update((s: any) => { s.reminders[key][field] = val; });

  /* A PERMISSÃO DO SISTEMA É PARTE DO ESTADO DESTA TELA.

     Um lembrete ligado aqui e bloqueado no aparelho é uma chave verde que
     não faz nada — e a pessoa só descobre no dia em que o aviso não vem.
     A tela pergunta ao sistema quando abre, e mostra o que ele respondeu.

     Reconsultar ao voltar do foco é o que cobre o caminho mais provável:
     a pessoa sai daqui para as configurações do aparelho, muda lá, e
     volta. Sem isso o aviso ficaria na tela depois de resolvido. */
  const [permissao, setPermissao] = React.useState<Permissao>('concedida');
  const conferir = React.useCallback(() => { estadoDaPermissao().then(setPermissao); }, []);
  React.useEffect(() => {
    conferir();
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') conferir(); });
    return () => sub.remove();
  }, [conferir]);

  /* LIGAR UM LEMBRETE É PEDIR PERMISSÃO NA HORA CERTA.

     O sistema só pergunta uma vez. Pedir na abertura do app, antes de a
     pessoa querer aviso nenhum, é como se perde a permissão para sempre:
     um "não" dado sem contexto não tem volta de dentro do app.

     Negado, a chave não liga. Guardar "ligado" para algo que o sistema
     vai engolir seria a tela mentindo em silêncio — e a faixa acima diz
     onde resolver. */
  const alternar = async (k: string, v: boolean) => {
    if (!v) { set(k, 'on', false); return; }
    const p = permissao === 'concedida' ? 'concedida' : await pedirPermissao();
    setPermissao(p);
    if (p === 'negada') return;
    set(k, 'on', true);
  };

  const ligados = ['dose', 'peso', 'agua', 'proteina'].some((k) => R[k]?.on);
  const bloqueado = permissao === 'negada' && ligados;
  const semSuporte = permissao === 'indisponivel' && ligados;

  const Chip = ({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) => (
    <Pressable onPress={onPress}>
      <View style={{ paddingHorizontal: 11, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: on ? c.accentWeak : c.bg2, borderWidth: 1.1, borderColor: on ? c.accent : c.line }}>
        <Txt v="micro" c={on ? c.accent : c.tx3}>{label}</Txt>
      </View>
    </Pressable>
  );

  /* RÓTULO E FILEIRA, com a quebra alinhada.

     As pastilhas viviam no mesmo Row do rótulo, com wrap: ao passar da
     largura, a segunda fileira voltava para a margem esquerda e ficava
     embaixo da palavra "Horário", em vez de embaixo da primeira
     pastilha. A correção é a fileira ter caixa própria — o rótulo ocupa
     a coluna dele, e a quebra acontece dentro do que sobra. */
  const Campo = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Row style={{ marginTop: 10, alignItems: 'flex-start' }} gap={6}>
      <Txt v="caption" c={c.tx3} style={{ width: 62, paddingTop: 6 }}>{label}</Txt>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{children}</View>
    </Row>
  );

  const HourRow = ({ k }: { k: string }) => (
    <Campo label="Horário">
      {HOURS.map((h) => <Chip key={h} on={R[k].hour === h} label={hm(h, 0)} onPress={() => set(k, 'hour', h)} />)}
    </Campo>
  );

  const RemCard = ({ k, ic, title, desc, children, preview }: { k: string; ic: string; title: string; desc: string; children?: React.ReactNode; preview: string | null }) => {
    const on = R[k].on;
    /* Ligado é a vontade da pessoa; avisar mesmo depende do aparelho. */
    const avisaMesmo = on && permissao === 'concedida';
    return (
      <Card style={{ paddingVertical: 15 }}>
        <Row style={{ alignItems: 'flex-start' }} gap={12}>
          {/* O ÍCONE SOLTO, pela mesma regra do resto do app: a pastilha
              de cor repetida numa coluna vira fileira de botões que não
              são botões. A largura fixa fica, porque é ela que alinha os
              títulos entre si — e a cor continua dizendo se o lembrete
              está ligado, que é informação e não decoração. */}
          <View style={{ width: 32, alignItems: 'center', paddingTop: 2 }}>
            <Icon name={ic} size={21} color={on ? c.accent : c.tx4} sw={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="title">{title}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 17 }}>{desc}</Txt>
          </View>
          <Switch value={on} onValueChange={(v) => alternar(k, v)} trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff" />
        </Row>
        {on && (
          <View style={{ marginTop: 4 }}>
            {children}
            <Divider style={{ marginTop: 12 }} />
            {/* A LINHA DO PRÓXIMO AVISO SÓ APARECE QUANDO ELE VAI SAIR.
                Ela dizia "Próximo: quando chegar o dia" quando não havia
                data — uma frase para um caso que não existe, já que sem
                lembrete ligado este bloco nem é desenhado. E com o aviso
                bloqueado no aparelho ela seria pior: um horário marcado
                para algo que o sistema não vai deixar chegar. */}
            <Row gap={6} style={{ marginTop: 10 }}>
              <Icon name="bell" size={12} color={avisaMesmo ? c.accent : c.tx4} sw={2} />
              <Txt v="micro" c={c.tx3}>
                {avisaMesmo && preview
                  ? `Próximo: ${preview}`
                  : permissao === 'indisponivel'
                    ? 'Guardado — os avisos saem pelo celular'
                    : 'Sem aviso enquanto estiver bloqueado'}
              </Txt>
            </Row>
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="h1" style={{ flex: 1 }}>Lembretes</Txt>
      </Row>
      {/* O SUBTÍTULO EM LINHA PRÓPRIA. Ao lado do botão de voltar ele
          dividia a largura com o título e com o círculo, e terminava
          cortado no meio da palavra. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 12 }}>
        No seu ritmo — você escolhe o quê e quando.
      </Txt>

      {/* O QUE O APARELHO TEM A DIZER. Nas duas situações em que o aviso
          não sai — permissão negada no sistema, ou app aberto no
          navegador —, a tela conta antes de a pessoa descobrir pelo
          silêncio. A faixa só aparece quando há lembrete ligado: sem
          nenhum, não há promessa a desmentir. */}
      {bloqueado || semSuporte ? (
        <Row gap={11} style={{
          marginTop: 16, alignItems: 'flex-start',
          backgroundColor: c.amberBg, borderRadius: radius.lg, padding: 14,
        }}>
          <Icon name="bell" size={18} color={c.amber} sw={1.9} />
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{bloqueado ? 'Os avisos estão bloqueados' : 'No navegador não dá para avisar'}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 19 }}>
              {bloqueado
                ? 'O aparelho está barrando as notificações deste app. Enquanto estiver assim, nada do que você ligar aqui vai chegar.'
                : 'O que você escolher fica guardado e passa a valer quando abrir o app no celular.'}
            </Txt>
            {bloqueado && Platform.OS !== 'web' ? (
              <Pressable onPress={() => Linking.openSettings()} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.6 : 1 }]}>
                <Row gap={6}>
                  <Txt v="label" c={c.accent2}>Abrir as configurações</Txt>
                  <Icon name="chev" size={13} color={c.accent2} sw={2.2} />
                </Row>
              </Pressable>
            ) : null}
          </View>
        </Row>
      ) : null}

      <View style={{ marginTop: 18, gap: 12 }}>
        <RemCard k="dose" ic="syringe" title="Aplicação da caneta" desc="Um aviso antes da próxima dose, para manter o tratamento em dia." preview={reminderWhen(doseReminderDate(S))}>
          <Campo label="Avisar">
            {[0, 1, 2].map((n) => <Chip key={n} on={R.dose.lead === n} label={n === 0 ? 'no dia' : `${n} dia${n > 1 ? 's' : ''} antes`} onPress={() => set('dose', 'lead', n)} />)}
          </Campo>
          <HourRow k="dose" />
        </RemCard>

        <RemCard k="peso" ic="scale" title="Pesagem" desc="Um toque no dia que você escolher — semanal ou todo dia." preview={reminderWhen(pesoReminderDate(S))}>
          <Campo label="Frequência">
            <Chip on={R.peso.freq === 'semanal'} label="semanal" onPress={() => set('peso', 'freq', 'semanal')} />
            <Chip on={R.peso.freq === 'diaria'} label="diária" onPress={() => set('peso', 'freq', 'diaria')} />
          </Campo>
          {R.peso.freq === 'semanal' && (
            <Campo label="Dia">
              {[1, 2, 3, 4, 5, 6, 0].map((n) => <Chip key={n} on={R.peso.dow === n} label={DOW_SHORT[n]} onPress={() => set('peso', 'dow', n)} />)}
            </Campo>
          )}
          <HourRow k="peso" />
        </RemCard>

        <RemCard k="agua" ic="water" title="Hidratação" desc="Um empurrãozinho para beber água — ajuda com saciedade e enjoo." preview={reminderWhen(dailyReminderDate(R.agua))}>
          <HourRow k="agua" />
        </RemCard>

        <RemCard k="proteina" ic="flame" title="Proteína" desc="Lembrete para priorizar proteína em uma refeição do dia." preview={reminderWhen(dailyReminderDate(R.proteina))}>
          <HourRow k="proteina" />
        </RemCard>
      </View>

      <Row gap={8} style={{ marginTop: 16, paddingHorizontal: 4, alignItems: 'flex-start' }}>
        <Icon name="info" size={13} color={c.tx4} sw={1.8} />
        {/* "DÁ PARA ADIAR" SAIU: não existe adiar. O aviso chega na tela
            de bloqueio e se dispensa como qualquer outro, e prometer um
            botão de soneca que não está lá é a mesma espécie de promessa
            que esta tela inteira acabou de deixar de fazer. */}
        <Txt v="micro" c={c.tx4} style={{ flex: 1, lineHeight: 17 }}>Um aviso é um convite, não uma cobrança. Se um dia passar, nada aqui vira atraso.</Txt>
      </Row>
    </Screen>
  );
}
