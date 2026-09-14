import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { PROTEINA, proteinaDe } from '../logic/escalas';
import { now, startOfDay } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Grade, Opc, Texto } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   O QUE VOCÊ COMEU

   Esta tela alimenta UM número: a proteína do dia, que a home mostra
   como "faltam 36 g". E era justamente esse número que ela escondia.

   As três faixas viravam 30, 18 e 8 g em silêncio. Quem almoçasse
   "Média" todo dia fechava em 54 de 90 e não tinha como saber por quê —
   nem que existia uma conta, nem qual era. Agora a faixa diz quanto
   conta, o topo da tela mostra onde o dia está, e a legenda embaixo diz
   de onde saiu o número (um filé, dois ovos), que é a única defesa
   honesta de uma estimativa: mostrar a régua em vez do decimal.

   E a proteína deixou de vir escolhida. "Média" já nascia marcada, então
   um toque distraído em Registrar somava 18 g que ninguém afirmou — o
   mesmo silêncio-virando-dado que o check-in já tinha tirado das escalas.
   ============================================================ */

const HORARIOS = ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'];

export default function MedirRefeicao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  /* Os favoritos de /alimentacao entram por aqui, com o nome já escrito.
     Antes eles gravavam por conta própria e não mexiam na proteína do
     dia: a refeição aparecia na lista e a barra não andava. Um escritor
     só, e a conta fecha por construção. */
  const { oque: oqueParam } = useLocalSearchParams<{ oque?: string }>();

  const hora = new Date().getHours();
  const sugerido = hora < 10 ? 'Café da manhã' : hora < 15 ? 'Almoço' : hora < 18 ? 'Lanche' : 'Jantar';

  const [quando, setQuando] = useState(sugerido);
  const [prot, setProt] = useState<string | null>(null);
  const [oque, setOque] = useState(String(oqueParam || ''));

  const ci: any = checkinToday(S);
  const alvo = (S.profile as any).targets.prot as number;
  const hoje = Math.round(ci?.prot || 0);

  const t0 = +startOfDay(now());
  const doDia = (S.meals as any[]).filter((m) => +startOfDay(new Date(m.t)) === t0);

  const faixa = proteinaDe(prot);
  const pronto = !!faixa;

  const salvar = () => {
    if (!faixa) return;
    update((s: any) => {
      s.meals.unshift({
        t: +now(), name: quando, prot: faixa.id, g: faixa.g,
        /* Sem eco: o campo vazio guarda vazio. Com `|| quando` o cartão
           de /alimentacao mostrava "Almoço" em cima de "Almoço". */
        tag: oque.trim(),
      });
      const ci2 = registroDoDia(s, +startOfDay(now()));
      ci2.prot = (ci2.prot || 0) + faixa.g;
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo="O que você comeu?"
      /* O que o dia tem até agora, e não quantas refeições existem desde
         sempre. O total de todos os tempos não responde nada que se
         pergunte antes de comer. */
      sub={`${hoje} de ${alvo} g de proteína hoje`}
      onClose={() => router.back()}
      rodape={(
        <Pressable onPress={salvar} disabled={!pronto} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <View style={{
            backgroundColor: pronto ? c.accent : c.bg2,
            borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center',
          }}>
            {/* Sem os gramas aqui. Na tela de exercício o botão repete a
                duração porque a duração é o que a PESSOA afirmou; aqui o
                número é palpite do app, e palpite no botão de confirmar
                se veste de medida. */}
            <Txt v="body" c={pronto ? c.accentInk : c.tx4}>
              {pronto ? `Registrar ${quando.toLowerCase()}` : 'Diga quanta proteína tinha'}
            </Txt>
          </View>
        </Pressable>
      )}
    >
      {/* O que já entrou hoje — o lembrete de quem come quatro vezes e
          não lembra se registrou o lanche. */}
      {doDia.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 18 }}>
          {doDia.map((m, i) => (
            <View
              key={`${m.t}-${i}`}
              style={{ backgroundColor: c.bg2, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Txt v="tag" c={c.tx2}>{m.name} · {m.g ?? proteinaDe(m.prot)?.g ?? 0} g</Txt>
            </View>
          ))}
        </View>
      ) : null}

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 20, marginBottom: 10 }}>QUANDO</Txt>
      <Grade>
        {HORARIOS.map((h) => (
          <Opc key={h} cheia label={h} on={quando === h} onPress={() => setQuando(h)} />
        ))}
      </Grade>

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>O QUE TINHA NO PRATO</Txt>
      <Texto valor={oque} onChange={setOque} placeholder="Opcional. Ex.: frango, arroz e salada" linhas={1} />

      <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1, marginTop: 22, marginBottom: 10 }}>QUANTA PROTEÍNA TINHA</Txt>
      {/* Empilhadas e com os gramas à direita, em vez de três pastilhas
          lado a lado. Assim os três números aparecem juntos: dá para ver
          que "Média" é pouco mais da metade de "Bastante" antes de
          escolher, que é a informação que faltava. */}
      <Grade cols={1}>
        {PROTEINA.map((p) => (
          <Opc
            key={p.id} cheia label={p.label} dir={`~${p.g} g`}
            on={prot === p.id} onPress={() => setProt(p.id)}
          />
        ))}
      </Grade>
      {/* De onde saiu o número. Sem isso "Bastante" é vibração, e cada dia
          acaba respondido com uma régua diferente — o mesmo motivo das
          legendas do check-in. */}
      {faixa ? (
        <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>{faixa.legenda}</Txt>
      ) : null}
    </SheetScreen>
  );
}
