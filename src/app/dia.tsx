import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { nextInjectionDate, M, respostaNoDia, respondido } from '../logic/derive';
import { startOfDay, now, diffDays, nf, dataComDiaDaSemana, maiuscula } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { useTrocarDeTela } from '../ui/useTrocarDeTela';
import { pesoTxt } from '../logic/medidas';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.home.telaDia;

/* ============================================================
   UM DIA

   O sheet de um quadradinho da fileira de sete dias. Ele existe para
   resolver o caso que mais acontece na prática: a pessoa lembra na quarta
   que esqueceu de registrar a terça.

   Por isso a frase do pé é a mais importante da tela — "você pode
   preencher depois, sem prazo". Um diário que só aceita hoje transforma
   qualquer dia corrido em buraco permanente, e buraco permanente é o que
   faz a pessoa parar de registrar.
   ============================================================ */

export default function Dia() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const dia = t ? +startOfDay(new Date(Number(t))) : +startOfDay(now());
  const d = new Date(dia);
  const titulo = maiuscula(dataComDiaDaSemana(d));

  const med = M(S);
  const aplicou = (S.injections as any[]).find((x) => +startOfDay(new Date(x.t)) === dia);
  const checkin = (S.checkins as any[]).find((x) => x.t === dia);
  /* O registro do dia existe assim que a água entra. O selo "feito" é do
     check-in, e por isso pergunta se há resposta, não se há linha — e o
     resumo só cita a energia quando alguém respondeu a energia. */
  const fez = respostaNoDia(checkin);
  const E = T.escalas.telaCheckin;
  const resumoCheckin = !fez ? K().semRegistro
    : respondido(checkin, 'energia') ? K().escalaDe(E.energia, checkin.energia, 10)
    : respondido(checkin, 'mood') ? K().escalaDe(E.humor, checkin.mood, 5)
    : K().respondidoNesteDia;
  const peso = (S.weights as any[]).find((x) => +startOfDay(new Date(x.t)) === dia);

  const prevista = diffDays(nextInjectionDate(S), d) === 0;
  const nada = !aplicou && !fez && !peso;

  const sub = [
    prevista || aplicou ? K().diaDeAplicacao : null,
    nada ? K().nadaRegistrado : null,
  ].filter(Boolean).join(' · ');

  /* Fechar antes de navegar: o sheet é um transparentModal, e empilhar uma
     tela cheia por cima dele deixaria o scrim vivo atrás dela. */
  const ir = useTrocarDeTela();

  return (
    <SheetScreen titulo={titulo} sub={sub || K().registrosDeste} onClose={() => router.back()}>
      <View style={{ marginTop: 18, gap: 10 }}>
        <Cartao>
          <Linha
            titulo={K().aplicacao}
            sub={aplicou
              ? K().doseLinha(med.label, nf(aplicou.dose, 1), med.unit)
              : K().doseLinha(med.label, nf(S.profile.dose, 1), med.unit,
                prevista ? K().prevista : K().semRegistroMinusculo)}
            selo={aplicou ? K().seloFeita : K().seloRegistrar}
            seloTom={aplicou ? 'verde' : 'neutra'}
            seta={false}
            onPress={aplicou ? undefined : () => ir('/aplicacao')}
          />
          <Linha
            titulo={T.home.evento.checkin}
            sub={resumoCheckin}
            selo={fez ? K().seloFeito : K().seloRegistrar}
            seloTom={fez ? 'verde' : 'neutra'}
            seta={false}
            onPress={fez ? undefined : () => ir('/checkin')}
          />
          <Linha
            titulo={T.home.evento.peso}
            sub={peso ? `${pesoTxt(S, peso.kg)}` : K().semRegistro}
            selo={peso ? K().seloFeito : K().seloRegistrar}
            seloTom={peso ? 'verde' : 'neutra'}
            seta={false}
            onPress={peso ? undefined : () => ir('/medir-peso')}
          />
        </Cartao>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>{K().semPrazo}</Txt>
      </View>
    </SheetScreen>
  );
}
