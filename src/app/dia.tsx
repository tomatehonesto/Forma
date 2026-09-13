import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { nextInjectionDate, M } from '../logic/derive';
import { MO_LONG, DOW_PT, startOfDay, now, diffDays, nf } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Cartao, Linha } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

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
  const dow = DOW_PT[d.getDay()];
  const titulo = `${dow.charAt(0).toUpperCase()}${dow.slice(1)}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;

  const med = M(S);
  const aplicou = (S.injections as any[]).find((x) => +startOfDay(new Date(x.t)) === dia);
  const checkin = (S.checkins as any[]).find((x) => x.t === dia);
  const peso = (S.weights as any[]).find((x) => +startOfDay(new Date(x.t)) === dia);

  const prevista = diffDays(nextInjectionDate(S), d) === 0;
  const nada = !aplicou && !checkin && !peso;

  const sub = [
    prevista || aplicou ? 'Dia de aplicação' : null,
    nada ? 'nada registrado ainda' : null,
  ].filter(Boolean).join(' · ');

  /* Fechar antes de navegar: o sheet é um transparentModal, e empilhar uma
     tela cheia por cima dele deixaria o scrim vivo atrás dela. */
  const ir = (rota: string) => { router.back(); setTimeout(() => router.push(rota as any), 60); };

  return (
    <SheetScreen titulo={titulo} sub={sub || 'Registros deste dia'} onClose={() => router.back()}>
      <View style={{ marginTop: 18, gap: 10 }}>
        <Cartao>
          <Linha
            titulo="Aplicação"
            sub={aplicou
              ? `${med.label} ${nf(aplicou.dose, 1).replace('.', ',')} ${med.unit}`
              : `${med.label} ${nf(S.profile.dose, 1).replace('.', ',')} ${med.unit} · ${prevista ? 'prevista para hoje' : 'sem registro'}`}
            selo={aplicou ? 'feita' : 'registrar'}
            seloTom={aplicou ? 'verde' : 'neutra'}
            seta={false}
            onPress={aplicou ? undefined : () => ir('/aplicacao')}
          />
          <Linha
            titulo="Check-in"
            sub={checkin ? `Energia ${checkin.energia} de 10` : 'Sem registro'}
            selo={checkin ? 'feito' : 'registrar'}
            seloTom={checkin ? 'verde' : 'neutra'}
            seta={false}
            onPress={checkin ? undefined : () => ir('/checkin')}
          />
          <Linha
            titulo="Peso"
            sub={peso ? `${nf(peso.kg, 1).replace('.', ',')} kg` : 'Sem registro'}
            selo={peso ? 'feito' : 'registrar'}
            seloTom={peso ? 'verde' : 'neutra'}
            seta={false}
            onPress={peso ? undefined : () => ir('/medir-peso')}
          />
        </Cartao>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center' }}>
          Dias sem registro ficam em branco. Você pode preencher depois, sem prazo.
        </Txt>
      </View>
    </SheetScreen>
  );
}
