import React from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useStore } from '../logic/store';
import { trocarIcone, suportaIcone } from '../logic/icone';
import { D_SIMBOLO, RAZAO_SIMBOLO } from '../ui/marca';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Aviso } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { PALETAS, paletaDe, radius, font } from '../theme';
import type { Tema } from '../logic/seed';

/* ============================================================
   APARÊNCIA

   ⚠️ A ESCOLHA ERA DE DUAS CORES SOLTAS — uma de ação e uma de alcançado
   — e isso empurrava para a pessoa uma decisão que é de design. As duas
   juntas dão vinte e cinco combinações, e algumas delas são ruins: cores
   próximas fazem o botão que leva a algum lugar e a marca do que já foi
   feito virarem a mesma coisa. Oferecer o erro como opção não é dar
   liberdade.

   Agora são dez paletas fechadas, e a forma de mostrá-las é o ÍCONE. Ele
   não é ilustração da paleta: é literalmente o arquivo que vai para a
   tela inicial do telefone se aquela for escolhida. A grade mostra o
   resultado, e não uma representação dele.

   O ESQUEMA DE COR VEM ANTES, e ganhou "Sistema". Quem instala o app já
   escolheu claro ou escuro uma vez, nos ajustes do telefone — repetir a
   pergunta é ignorar a resposta que a pessoa já deu. Escolher aqui passa
   a ser o gesto de quem quer o contrário do sistema.
   ============================================================ */

const MODOS: { id: Tema; nome: string; ic: string }[] = [
  { id: 'system', nome: 'Sistema', ic: 'contrast' },
  { id: 'light', nome: 'Claro', ic: 'sun' },
  { id: 'dark', nome: 'Escuro', ic: 'moon' },
];

/* O ÍCONE DESENHADO, e não uma das dez imagens: a grade precisa responder
   no toque, e carregar dez PNG de um megapixel para mostrar dez
   quadradinhos seria pagar caro por nada. É o mesmo caminho que gerou os
   arquivos. */
function IconeDaPaleta({ fundo, marca, lado }: { fundo: string; marca: string; lado: number }) {
  const largura = lado * 0.56;
  return (
    <View style={{
      width: lado, height: lado, borderRadius: lado * 0.225,
      backgroundColor: fundo, alignItems: 'center', justifyContent: 'center',
    }}>
      <Svg width={largura} height={largura / RAZAO_SIMBOLO} viewBox="0 0 533 222">
        <Path d={D_SIMBOLO} fill={marca} />
      </Svg>
    </View>
  );
}

export default function Aparencia() {
  const { c, isDark } = useTheme();
  const setTheme = useStore((s) => s.setTheme);
  const setPaleta = useStore((s) => s.setPaleta);
  const tema = useStore((s) => s.S.theme) as Tema;
  const paletaId = useStore((s) => (s.S as any).paleta as string) ?? 'original';
  const paleta = paletaDe(paletaId);

  const [temIcone] = React.useState(() => suportaIcone());

  /* A PALETA MUDA NA HORA, E O ÍCONE TENTA. A cor do app não espera o
     sistema responder: se o aparelho recusar a troca do ícone — iPad com
     restrição, versão antiga —, o aplicativo já está da cor nova. Ver por
     que o erro é engolido em src/logic/icone.ts. */
  const escolher = (id: string) => { setPaleta(id); trocarIcone(id); };

  return (
    <TelaInterna titulo="Aparência">
      <Titulao
        titulo="Aparência"
        lead="O Morphi pode ter a sua cara. Escolha uma paleta e ela vai para tudo — inclusive para o ícone na sua tela inicial."
      />

      {/* ---- esquema de cor ---- */}
      <Bloco titulo="Claro ou escuro" nota="Pode deixar o Morphi acompanhar o seu telefone — ou decidir por conta própria.">
        <Row gap={10}>
          {MODOS.map((m) => {
            const on = tema === m.id;
            return (
              <Pressable key={m.id} onPress={() => setTheme(m.id)} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
                <View style={{
                  backgroundColor: c.bg1, borderRadius: radius.lg,
                  borderWidth: on ? 2 : 1, borderColor: on ? c.tx : c.line,
                  paddingHorizontal: 12, paddingVertical: 14, gap: 12,
                }}>
                  <Icon name={m.ic} size={20} color={on ? c.tx : c.tx4} sw={1.9} />
                  <Txt v="bodyMed" c={on ? c.tx : c.tx3}>{m.nome}</Txt>
                </View>
              </Pressable>
            );
          })}
        </Row>
      </Bloco>

      {/* ---- as paletas ---- */}
      <Bloco titulo="Escolha a sua cor" nota={`Agora você está no ${paleta.nome}. Toque em qualquer uma para experimentar — dá para trocar quantas vezes quiser.`}>
        <Row gap={14} style={{ flexWrap: 'wrap' }}>
          {PALETAS.map((p) => {
            const on = p.id === paletaId;
            return (
              <Pressable
                key={p.id}
                onPress={() => escolher(p.id)}
                style={({ pressed }) => [{ width: '30%', alignItems: 'center', gap: 8, opacity: pressed ? 0.7 : 1 }]}
              >
                <View>
                  {/* O ANEL FICA POR FORA DO ÍCONE, e não em cima dele:
                      uma borda desenhada dentro do quadrado comeria a cor
                      que a pessoa está justamente tentando ver. */}
                  <View style={{
                    padding: 3, borderRadius: 20,
                    borderWidth: 2, borderColor: on ? c.accent : 'transparent',
                  }}>
                    <IconeDaPaleta fundo={p.acaoClara} marca={p.alcancado} lado={64} />
                  </View>
                  {on ? (
                    <View style={{
                      position: 'absolute', right: -3, top: -3,
                      width: 22, height: 22, borderRadius: 11,
                      backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center',
                      borderWidth: 2, borderColor: c.bg,
                    }}>
                      <Icon name="check" size={11} color={c.accentInk} sw={3} />
                    </View>
                  ) : null}
                </View>
                <Txt
                  v="caption"
                  c={on ? c.tx : c.tx3}
                  numberOfLines={1}
                  style={on ? { fontFamily: font.bodyMed } : undefined}
                >
                  {p.nome}
                </Txt>
              </Pressable>
            );
          })}
        </Row>
      </Bloco>

      <Aviso
        ic="palette"
        titulo={temIcone ? 'O ícone vai junto' : 'O ícone só muda no telefone'}
        texto={temIcone
          ? 'O desenho que você tocar aqui é o mesmo que vai aparecer na sua tela inicial. Bonito de ver no meio dos outros aplicativos.'
          : 'Por aqui o ícone continua o mesmo — ele troca quando o Morphi está instalado no celular. As cores das telas você já vê mudando agora.'}
      />

      <View />
    </TelaInterna>
  );
}
