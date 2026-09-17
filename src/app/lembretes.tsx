import React from 'react';
import { View, Pressable, Switch, Linking, Platform, AppState } from 'react-native';
import { doseReminderDate, pesoReminderDate, dailyReminderDate, reminderWhen } from '../logic/derive';
import { useStore } from '../logic/store';
import { DOW_SHORT, hm } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Sanfona, Campo, Opcoes, Opc, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';
import { estadoDaPermissao, pedirPermissao, type Permissao } from '../logic/avisos';

/* ============================================================
   LEMBRETES

   A tela usava o cabeçalho antigo — botão redondo, título e legenda numa
   fileira solta — enquanto as telas internas vizinhas já abrem com a
   barra fixa e o titulão embaixo. Duas gramáticas de abertura em telas
   que se alcançam uma da outra é o que faz um app parecer montado aos
   pedaços.

   E OS QUATRO LEMBRETES ERAM QUATRO CARTÕES FLUTUANDO, com espaço igual
   entre eles: o olho contava blocos em vez de ler uma lista de quatro
   coisas do mesmo tipo. Agora são quatro linhas de um cartão só,
   separadas por um fio — o mesmo desenho do diário de refeições, das
   notificações e do perfil.

   CADA LINHA SE ABRE QUANDO É LIGADA. As opções de um lembrete desligado
   não têm o que configurar, e mostrá-las apagadas fazia a tela abrir com
   quatro painéis de controle inertes. A chave é a pergunta; o resto é a
   resposta.

   E AS OPÇÕES VIRARAM AS OPÇÕES DO APP — o mesmo botão do cadastro e do
   check-in, em vez de uma pastilha desenhada só aqui. O rótulo saiu da
   coluna de 62 px à esquerda e virou o rótulo em caixa alta que os campos
   do app já usam: assim a fileira ocupa a largura inteira e a quebra cai
   onde deve.
   ============================================================ */

const HORAS = [7, 8, 9, 12, 15, 20];
const PAD = 16;

export default function Lembretes() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const R: any = S.reminders;

  const set = (key: string, field: string, val: any) => update((s: any) => { s.reminders[key][field] = val; });

  /* A PERMISSÃO DO SISTEMA É PARTE DO ESTADO DESTA TELA.

     Um lembrete ligado aqui e bloqueado no aparelho é uma chave verde que
     não faz nada — e a pessoa só descobre no dia em que o aviso não vem.
     A tela pergunta ao sistema quando abre, e mostra o que ele respondeu.

     Reconsultar ao voltar do foco cobre o caminho mais provável: sair
     daqui para as configurações do aparelho, mudar lá, e voltar. */
  const [permissao, setPermissao] = React.useState<Permissao>('concedida');
  React.useEffect(() => {
    const conferir = () => { estadoDaPermissao().then(setPermissao); };
    conferir();
    const sub = AppState.addEventListener('change', (e) => { if (e === 'active') conferir(); });
    return () => sub.remove();
  }, []);

  /* LIGAR UM LEMBRETE É PEDIR PERMISSÃO NA HORA CERTA. O sistema só
     pergunta uma vez, e um "não" dado antes de a pessoa querer aviso
     nenhum não tem volta de dentro do app. Negado, a chave não liga:
     guardar "ligado" para algo que o sistema vai engolir seria a tela
     mentindo em silêncio. */
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

  const Hora = ({ k }: { k: string }) => (
    <Campo nu rotulo="Horário">
      <Opcoes>
        {HORAS.map((h) => (
          <Opc key={h} label={hm(h, 0)} on={R[k].hour === h} onPress={() => set(k, 'hour', h)} />
        ))}
      </Opcoes>
    </Campo>
  );

  const Item = ({ k, ic, titulo, desc, proximo, children }: {
    k: string; ic: string; titulo: string; desc: string;
    proximo: string | null; children?: React.ReactNode;
  }) => {
    const on = R[k].on;
    /* Ligado é a vontade da pessoa; avisar mesmo depende do aparelho. */
    const avisa = on && permissao === 'concedida';
    return (
      <View>
        <Row gap={12} style={{ paddingHorizontal: PAD, paddingVertical: 14, alignItems: 'flex-start' }}>
          {/* O ícone solto, pela mesma regra do resto do app — e a cor
              dele continua dizendo se o lembrete está ligado, que é
              informação e não decoração. */}
          <View style={{ width: 26, alignItems: 'center', paddingTop: 2 }}>
            <Icon name={ic} size={20} color={on ? c.accent : c.tx4} sw={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{titulo}</Txt>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 2, lineHeight: 19 }}>{desc}</Txt>
          </View>
          <Switch
            value={on} onValueChange={(v) => alternar(k, v)}
            trackColor={{ false: c.track, true: c.accent }} thumbColor="#fff"
          />
        </Row>

        {on ? (
          /* NA LARGURA INTEIRA DO CARTÃO, e não recuado até a coluna do
             texto. O recuo alinhava bonito com o título e custava 38 px de
             cada fileira de opções — o suficiente para "2 dias antes"
             descer sozinho para uma segunda linha. O que prende esta
             configuração ao lembrete de cima é o fio que separa dos
             outros, não um degrau de margem. */
          <View style={{ paddingHorizontal: PAD, paddingBottom: 16, gap: 14 }}>
            {children}
            <Hora k={k} />
            {/* A LINHA DO PRÓXIMO AVISO SÓ PROMETE O QUE VAI ACONTECER.
                Ela dizia "Próximo: quando chegar o dia" quando não havia
                data — frase para um caso que não existe, já que sem
                lembrete ligado este bloco nem é desenhado. E com o aviso
                barrado no aparelho, um horário marcado aqui seria a
                promessa que esta tela acabou de deixar de fazer. */}
            <Row gap={7} style={{ alignItems: 'center' }}>
              <Icon name="bell" size={13} color={avisa ? c.accent : c.tx4} sw={2} />
              <Txt v="micro" c={c.tx3}>
                {avisa && proximo
                  ? `Próximo: ${proximo}`
                  : permissao === 'indisponivel'
                    ? 'Guardado — os avisos saem pelo celular'
                    : 'Sem aviso enquanto estiver bloqueado'}
              </Txt>
            </Row>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <TelaInterna titulo="Lembretes">
      <Titulao titulo="Lembretes" lead="No seu ritmo — você escolhe o quê e quando." />

      {/* O QUE O APARELHO TEM A DIZER. Nas duas situações em que o aviso
          não sai — permissão negada no sistema, ou app aberto no
          navegador —, a tela conta antes de a pessoa descobrir pelo
          silêncio. Só aparece com algum lembrete ligado: sem nenhum, não
          há promessa a desmentir. */}
      {bloqueado || semSuporte ? (
        <Row gap={11} style={{
          alignItems: 'flex-start', backgroundColor: c.amberBg,
          borderRadius: radius.card, padding: PAD,
        }}>
          <Icon name="bell" size={18} color={c.amber} sw={1.9} />
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{bloqueado ? 'Os avisos estão bloqueados' : 'No navegador não dá para avisar'}</Txt>
            <Txt v="caption" c={c.tx2} style={{ marginTop: 3, lineHeight: 20 }}>
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

      <Sanfona>
        <Item
          k="dose" ic="syringe" titulo="Aplicação da caneta"
          desc="Um aviso antes da próxima dose, para manter o tratamento em dia."
          proximo={reminderWhen(doseReminderDate(S))}
        >
          {/* "1 DIA ANTES" VIROU "1 DIA", e o rótulo passou a carregar a
              palavra que sobrava. Repetida em cada opção, "antes" empurrava
              a terceira para uma linha só dela; dita uma vez no rótulo,
              vale para as três. */}
          <Campo nu rotulo="Antecedência">
            <Opcoes>
              {[0, 1, 2].map((n) => (
                <Opc
                  key={n} label={n === 0 ? 'No dia' : `${n} dia${n > 1 ? 's' : ''}`}
                  on={R.dose.lead === n} onPress={() => set('dose', 'lead', n)}
                />
              ))}
            </Opcoes>
          </Campo>
        </Item>

        <Item
          k="peso" ic="scale" titulo="Pesagem"
          desc="Um toque no dia que você escolher — semanal ou todo dia."
          proximo={reminderWhen(pesoReminderDate(S))}
        >
          <Campo nu rotulo="Frequência">
            <Opcoes>
              <Opc label="Toda semana" on={R.peso.freq === 'semanal'} onPress={() => set('peso', 'freq', 'semanal')} />
              <Opc label="Todo dia" on={R.peso.freq === 'diaria'} onPress={() => set('peso', 'freq', 'diaria')} />
            </Opcoes>
          </Campo>
          {R.peso.freq === 'semanal' ? (
            <Campo nu rotulo="Dia da semana">
              <Opcoes>
                {[1, 2, 3, 4, 5, 6, 0].map((n) => (
                  <Opc key={n} label={DOW_SHORT[n]} on={R.peso.dow === n} onPress={() => set('peso', 'dow', n)} />
                ))}
              </Opcoes>
            </Campo>
          ) : null}
        </Item>

        <Item
          k="agua" ic="water" titulo="Hidratação"
          desc="Um empurrãozinho para beber água — ajuda com saciedade e enjoo."
          proximo={reminderWhen(dailyReminderDate(R.agua))}
        />

        <Item
          k="proteina" ic="flame" titulo="Proteína"
          desc="Lembrete para priorizar proteína em uma refeição do dia."
          proximo={reminderWhen(dailyReminderDate(R.proteina))}
        />
      </Sanfona>

      {/* "DÁ PARA ADIAR" SAIU: não existe adiar. O aviso chega na tela de
          bloqueio e se dispensa como qualquer outro, e prometer uma
          soneca que não está lá é a mesma espécie de promessa que esta
          tela acabou de deixar de fazer. */}
      <Aviso ic="info" texto="Um aviso é um convite, não uma cobrança. Se um dia passar, nada aqui vira atraso." />
    </TelaInterna>
  );
}
