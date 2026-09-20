import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { apagarRefeicao, refeicaoEm } from '../logic/derive';
import { iconeDaRefeicao } from '../logic/prato';
import { MO_LONG, DOW_PT, semanaDoTratamento } from '../logic/time';
import { Txt, Row, IconBadge, SheetScreen } from '../ui/kit';
import { Cartao, Linha, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UMA REFEIÇÃO

   A folha que abre ao tocar numa linha do diário de refeições. Ela
   mostra, e só depois oferece as duas ações — a mesma forma da folha de
   treino, e pela mesma razão: quem toca num registro ainda não decidiu
   mexer nele, pode estar só conferindo o que comeu naquele dia. Abrir o
   formulário direto assume a edição e coloca campos editáveis na frente
   de quem veio ler.

   Um FATO e um RESTO, também como a de treino. O fato é a proteína, em
   número grande e dizendo de que ela é — "g" sozinho num app que não
   conta caloria ainda deixa a dúvida de qual grama é aquele. O resto é
   o que o cabeçalho não diz: o que tinha no prato e de onde veio o
   número.
   ============================================================ */

export default function Refeicao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const quando = Number(t);
  const m = refeicaoEm(S, quando);

  const d = new Date(quando);
  const dataLonga = `${DOW_PT[d.getDay()]}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;
  const hora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const semana = semanaDoTratamento(d, S.profile.startT);

  const apagar = () => {
    update((s: any) => apagarRefeicao(s, quando, m?.g ?? 0));
    router.back();
  };

  if (!m) {
    return (
      <SheetScreen titulo="Refeição" sub="Não encontrei este registro" onClose={() => router.back()}>
        <Txt v="caption" c={c.tx3} style={{ marginTop: 18 }}>
          Ela pode ter sido apagada em outra tela.
        </Txt>
      </SheetScreen>
    );
  }

  const g = m.g ?? 0;
  const pelaFoto = m.fonte === 'foto';

  return (
    <SheetScreen titulo={m.name} sub={dataLonga} onClose={() => router.back()}>
      <View style={{ marginTop: 20, gap: 10 }}>
        {/* O FATO: quanta proteína.

            "de proteína" escrito por extenso, e não só "g". Num app que
            recusa contar caloria, um grama sem dono é justamente a dúvida
            que a tela existe para não deixar: é o peso do prato? é
            carboidrato? É a proteína, e ela é o assunto. */}
        <Cartao>
          <Row gap={14} style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <IconBadge name={iconeDaRefeicao(m.name)} size={52} iconSize={24} sw={1.9} />
            <View style={{ flex: 1 }}>
              <Txt v="metric">
                ~{g}
                <Txt v="label" c={c.tx3}> g de proteína</Txt>
              </Txt>
              <Txt v="caption" c={c.tx3}>às {hora} · semana {semana} do tratamento</Txt>
            </View>
          </Row>
        </Cartao>

        <Cartao>
          {m.tag ? <Linha ic="utensils" titulo="No prato" sub={m.tag} seta={false} /> : null}
          {/* De onde veio o número. Numa folha cujas duas ações são
              corrigir e apagar, saber se os gramas foram calculados do que
              você escreveu ou estimados de uma foto é o que decide se
              "está errado" é um item faltando ou a foto tendo chutado a
              porção. */}
          <Linha
            ic={pelaFoto ? 'camera' : 'pencil'}
            titulo="Origem"
            sub={pelaFoto
              ? 'Pela foto — a câmera leu o prato e estimou'
              : 'Por você — registrado nesta tela'}
            seta={false}
          />
        </Cartao>

        <View style={{ marginTop: 8, gap: 8 }}>
          <Botao
            label="Corrigir"
            tom="fantasma"
            onPress={() => { router.back(); router.push(`/medir-refeicao?t=${quando}` as any); }}
          />
          <Botao label="Apagar" tom="perigo" onPress={apagar} />
        </View>

        <Txt v="caption" c={c.tx3} style={{ textAlign: 'center', marginTop: 2 }}>
          Apagar tira os {g} g da proteína daquele dia.
        </Txt>
      </View>
    </SheetScreen>
  );
}
