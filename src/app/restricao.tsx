import React from 'react';
import { View, Switch } from 'react-native';
import { useStore } from '../logic/store';
import { AVISO_DE_RESTRICAO, RESTRICOES } from '../logic/restricoes';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Aviso } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   O QUE VOCÊ NÃO COME

   Tela própria, e não pastilhas soltas no meio de outra.

   Isto se responde uma vez e se esquece — é da mesma natureza da
   integração com o app de saúde: um ajuste que a pessoa liga no começo e
   revisita quando a vida muda. Como fileira de pastilhas no alto da
   tabela de alimentos, virava um controle pedindo atenção toda vez que
   alguém só queria procurar quanta proteína tem um ovo.

   CHAVE, E NÃO PASTILHA. Restrição não é filtro de sessão: ela vale
   enquanto valer. A chave diz isso pelo formato — ela fica ligada quando
   a pessoa sai da tela, e é assim que ela entende que ninguém precisa
   remarcar amanhã.

   E O AVISO FICA AQUI, inteiro, em vez de virar letra miúda embaixo de
   um seletor: é a tela onde a pessoa está decidindo, e é onde ela precisa
   saber o que o app faz e o que ele não garante.
   ============================================================ */

export default function Restricao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const atuais = ((S.profile as any).restricoes ?? []) as string[];

  const trocar = (id: string, on: boolean) => update((s: any) => {
    const antes = ((s.profile.restricoes ?? []) as string[]).filter((x) => x !== id);
    s.profile.restricoes = on ? [...antes, id] : antes;
  });

  return (
    <TelaInterna titulo="Restrição alimentar">
      <Titulao
        titulo="O que você não come"
        lead="O Morphi passa a sugerir só o que cabe, e a tabela de alimentos mostra primeiro o que serve."
      />

      <Bloco>
        <Cartao>
          {RESTRICOES.map((x) => (
            <Row key={x.id} style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Txt v="body">{x.titulo}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{x.sub}</Txt>
              </View>
              <Switch
                value={atuais.includes(x.id)}
                onValueChange={(v) => trocar(x.id, v)}
                trackColor={{ false: c.track, true: c.accent }}
                thumbColor="#fff"
              />
            </Row>
          ))}
        </Cartao>
      </Bloco>

      <Aviso ic="info" titulo="Isto é orientação, e não garantia" texto={AVISO_DE_RESTRICAO} />
    </TelaInterna>
  );
}
