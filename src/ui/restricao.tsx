import React from 'react';
import { View, Pressable } from 'react-native';
import { useStore } from '../logic/store';
import { AVISO_DE_RESTRICAO, RESTRICOES } from '../logic/restricoes';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius } from '../theme';

/* ============================================================
   O SELETOR DE RESTRIÇÃO

   A mesma resposta do cadastro, mexível de onde ela faz efeito. Uma
   pergunta que só se responde uma vez, na porta de entrada, envelhece
   com a pessoa: dieta muda, intolerância aparece depois dos trinta, e
   ninguém vai refazer o cadastro por causa disso.

   ELE ESCREVE NO PERFIL, e não num estado da tela. É a mesma lista que a
   tabela de alimentos filtra e que os achados obedecem — duas cópias
   divergiriam no primeiro toque.

   E ELE DIZ O QUE NÃO É. Intolerância cobra desconforto; alergia cobra
   hospital. O app não tem dado de rótulo, de marca nem de contaminação
   cruzada, e um filtro que se deixasse confundir com garantia de
   segurança seria pior do que filtro nenhum.
   ============================================================ */

export function SeletorDeRestricao({ compacto }: { compacto?: boolean }) {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const atuais = ((S.profile as any).restricoes ?? []) as string[];

  const trocar = (id: string) => update((s: any) => {
    const antes = (s.profile.restricoes ?? []) as string[];
    s.profile.restricoes = antes.includes(id) ? antes.filter((x: string) => x !== id) : [...antes, id];
  });

  return (
    <View style={{ gap: 10 }}>
      <Row style={{ flexWrap: 'wrap', gap: 7 }}>
        {/* "NENHUMA" É UMA PASTILHA, e não a ausência das outras. Sem ela,
            desmarcar a última restrição é um gesto que não existe em
            lugar nenhum da tela — e quem marcou por engano fica preso. */}
        <Pastilha
          label="Nenhuma"
          on={atuais.length === 0}
          onPress={() => update((s: any) => { s.profile.restricoes = []; })}
        />
        {RESTRICOES.map((x) => (
          <Pastilha
            key={x.id}
            label={x.titulo}
            on={atuais.includes(x.id)}
            onPress={() => trocar(x.id)}
          />
        ))}
      </Row>
      {!compacto || atuais.length ? (
        <Txt v="micro" c={c.tx4}>{AVISO_DE_RESTRICAO}</Txt>
      ) : null}
    </View>
  );
}

function Pastilha({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <Row gap={6} style={{
        backgroundColor: on ? c.accent : c.bg2,
        borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8,
      }}>
        {on ? <Icon name="check" size={12} color={c.accentInk} sw={3} /> : null}
        <Txt v="caption" c={on ? c.accentInk : c.tx}>{label}</Txt>
      </Row>
    </Pressable>
  );
}
