import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useStore } from '../logic/store';
import { trocarIcone, suportaIcone } from '../logic/icone';
import { D_SIMBOLO, RAZAO_SIMBOLO } from '../ui/marca';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Aviso } from '../ui/internas';
import { Segmentado } from '../ui/instrumentos';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { CORES, DESTAQUES, corDe, destaqueDe, radius, font } from '../theme';

/* ============================================================
   APARÊNCIA — as duas cores do aplicativo

   ⚠️ A ESCOLHA ERA UMA FILEIRA DE PASTILHAS NO PERFIL, e ela só dava
   conta de uma cor. Este app tem duas que significam coisas diferentes,
   e a diferença é o que sustenta metade da leitura das telas:

     a AÇÃO — botão, link, tab ativa, gradiente do painel;
     o ALCANÇADO — check-in feito, meta batida, nível de conquista.

   Escolher as duas em cinco pastilhas soltas seria escolher no escuro:
   o que importa não é cada cor, é o PAR. Uma cor de ação e uma de
   destaque muito próximas fazem o botão que leva a algum lugar e a marca
   do que já foi feito virarem a mesma coisa — e não há como perceber
   isso olhando duas pastilhas em linhas diferentes.

   Por isso a tela abre com a prévia, e não com as opções. Ela mostra o
   ícone, um botão de ação e um selo de alcançado, lado a lado, na
   combinação atual. Qualquer toque embaixo muda o de cima na hora.

   O ÍCONE MUDA DE VERDADE, e é por isso que ele está na prévia: a
   escolha sai do aplicativo e vai para a tela inicial do telefone. Onde
   isso não é possível — navegador, Expo Go —, a prévia continua
   mostrando o desenho e a linha embaixo diz que o de fora não acompanha.
   Ver src/logic/icone.ts.
   ============================================================ */

/* O SÍMBOLO DESENHADO AQUI, e não uma das vinte e cinco imagens: a
   prévia precisa responder no toque, e carregar PNG a cada mudança
   piscaria. É o mesmo caminho que gerou os arquivos. */
function IconePrevia({ fundo, marca, lado = 72 }: { fundo: string; marca: string; lado?: number }) {
  const larguraMarca = lado * 0.56;
  return (
    <View style={{
      width: lado, height: lado, borderRadius: lado * 0.225,
      backgroundColor: fundo, alignItems: 'center', justifyContent: 'center',
    }}>
      <Svg width={larguraMarca} height={larguraMarca / RAZAO_SIMBOLO} viewBox="0 0 533 222">
        <Path d={D_SIMBOLO} fill={marca} />
      </Svg>
    </View>
  );
}

function Pastilhas({ itens, atual, onEscolhe, tom }: {
  itens: { id: string; nome: string; claro: string; escuro?: string }[];
  atual: string; onEscolhe: (id: string) => void; tom: (x: any) => string;
}) {
  return (
    <Row gap={12} style={{ flexWrap: 'wrap' }}>
      {itens.map((x) => {
        const on = x.id === atual;
        const cor = tom(x);
        return (
          <Pressable key={x.id} onPress={() => onEscolhe(x.id)} hitSlop={6} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            {/* O ANEL MARCA A ESCOLHIDA, e ele é da própria cor com um vão
                no meio: um check branco por cima funcionaria no azul e
                sumiria no ouro. */}
            <View style={{
              width: 38, height: 38, borderRadius: 19,
              alignItems: 'center', justifyContent: 'center',
              borderWidth: on ? 2 : 0, borderColor: cor,
            }}>
              <View style={{ width: on ? 26 : 34, height: on ? 26 : 34, borderRadius: 17, backgroundColor: cor }} />
            </View>
          </Pressable>
        );
      })}
    </Row>
  );
}

export default function Aparencia() {
  const { c, isDark } = useTheme();
  const setTheme = useStore((s) => s.setTheme);
  const setCor = useStore((s) => s.setCor);
  const setDestaque = useStore((s) => s.setDestaque);
  const corId = useStore((s) => (s.S as any).cor as string) ?? 'azul';
  const destId = useStore((s) => (s.S as any).destaque as string) ?? 'lima';

  const cor = corDe(corId);
  const dest = destaqueDe(destId);
  const fundoDoIcone = cor.claro;

  /* O ÍCONE SEGUE A ESCOLHA, e a escolha não espera o ícone: a cor do
     app muda no mesmo instante, e a troca lá fora acontece se o aparelho
     deixar. Ver por que o erro é engolido em src/logic/icone.ts. */
  const escolherCor = (id: string) => { setCor(id); trocarIcone(id, destId); };
  const escolherDestaque = (id: string) => { setDestaque(id); trocarIcone(corId, id); };

  const [temIcone] = React.useState(() => suportaIcone());

  return (
    <TelaInterna titulo="Aparência">
      <Titulao
        titulo="Aparência"
        lead="Duas cores: a que age e a que celebra. Toque para ver o aplicativo inteiro mudar."
      />

      {/* A PRÉVIA VEM ANTES DAS OPÇÕES porque é ela que dá sentido a elas.
          O ícone, um botão e um selo: as três coisas em que o par de
          cores aparece junto, e as três em que ele pode dar errado. */}
      <Cartao style={{ padding: 20 }}>
        <Row gap={18} style={{ alignItems: 'center' }}>
          <IconePrevia fundo={fundoDoIcone} marca={dest.claro} />
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 11, alignItems: 'center' }}>
              <Txt v="label" c={c.accentInk}>Registrar</Txt>
            </View>
            <Row gap={8} style={{ alignItems: 'center' }}>
              <View style={{ backgroundColor: c.lime, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 }}>
                <Txt v="tag" c={c.limeInk} style={{ fontFamily: font.bodyMed }}>Feito hoje</Txt>
              </View>
              <Txt v="micro" c={c.accent}>Ver a jornada</Txt>
            </Row>
          </View>
        </Row>
      </Cartao>

      <Bloco titulo="Tema">
        <Cartao>
          <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
            <View style={{ width: 34, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={isDark ? 'moonToggle' : 'sun'} size={20} color={c.accent} sw={1.8} />
            </View>
            <Txt v="body" style={{ flex: 1 }}>Claro ou escuro</Txt>
            <Segmentado
              opcoes={['Claro', 'Escuro']}
              valor={isDark ? 'Escuro' : 'Claro'}
              onChange={(v) => setTheme(v === 'Escuro' ? 'dark' : 'light')}
            />
          </Row>
        </Cartao>
      </Bloco>

      <Bloco titulo="Cor de ação" nota={`${cor.nome} · botões, links, abas e o painel da Jornada.`}>
        <Cartao style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Pastilhas
            itens={CORES}
            atual={corId}
            onEscolhe={escolherCor}
            tom={(x) => (isDark ? x.escuro : x.claro)}
          />
        </Cartao>
      </Bloco>

      {/* O NOME DO GRUPO NÃO É "COR DE DESTAQUE", e sim o que ela quer
          dizer. Destaque é palavra de ferramenta de design; "o que você
          alcançou" é o que essa cor significa em toda tela do app. */}
      <Bloco titulo="Cor do que você alcançou" nota={`${dest.nome} · check-in feito, meta batida, conquista.`}>
        <Cartao style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Pastilhas
            itens={DESTAQUES}
            atual={destId}
            onEscolhe={escolherDestaque}
            tom={(x) => x.claro}
          />
        </Cartao>
      </Bloco>

      <Aviso
        ic="palette"
        titulo={temIcone ? 'O ícone muda junto' : 'Aqui o ícone não muda'}
        texto={temIcone
          ? 'A combinação que você escolher também vira o ícone do Morphi na tela inicial do telefone.'
          : 'Neste ambiente o aplicativo não troca o próprio ícone — isso acontece no aplicativo instalado. As cores das telas mudam do mesmo jeito.'}
      />

      <View />
    </TelaInterna>
  );
}
