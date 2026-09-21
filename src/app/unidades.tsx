import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opc } from '../ui/internas';
import {
  sistemaDe, pesoTxt, alturaTxt, compTxt, aguaTxt, unidadesDe, type Sistema,
} from '../logic/medidas';

/* ============================================================
   AS UNIDADES

   ⚠️⚠️ NINGUÉM ESCOLHE PELO NOME DO SISTEMA. "Métrico" e "imperial" são
   palavras de enciclopédia: quem cresceu com uma delas raramente sabe
   qual é o nome. O que se reconhece é a unidade — quilo, libra,
   polegada —, e é ela que decide.

   Então cada opção traz as unidades dela embaixo do nome, e a linha de
   baixo traz os números DA PESSOA no sistema em uso, com os valores
   reais do perfil e não com exemplos inventados: as unidades para
   escolher, o próprio peso escrito para confirmar.

   ⚠️ E NADA SE CONVERTE NO ESTADO ao trocar. O aplicativo guarda tudo em
   métrico e converte na hora de escrever — ver logic/medidas. Trocar aqui
   muda como os números aparecem, e não o que está guardado; a série de
   peso de alguém continua sendo a mesma série, comparável com ela mesma.
   É por isso que esta tela não avisa nada nem pede confirmação: não há o
   que dar errado.
   ============================================================ */

const OPCOES: [Sistema, string][] = [
  ['metrico', 'Métrico'],
  ['imperial', 'Imperial'],
];

export default function Unidades() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const atual = sistemaDe(S);
  const p = S.profile as any;

  /* Os números são os da pessoa. O peso e a altura vêm do perfil; a
     cintura, da última medição, e sem medição alguma a linha sai — não há
     por que mostrar "0 cm" para escolher unidade. */
  const ultima = (S.measures as any[])[(S.measures as any[]).length - 1];
  const exemplo = (sis: Sistema) => [
    pesoTxt(sis, p.startWeight),
    alturaTxt(sis, p.height),
    ...(ultima?.cintura > 0 ? [compTxt(sis, ultima.cintura, 0)] : []),
    aguaTxt(sis, p.targets.waterMl),
  ].join(' · ');

  return (
    <SheetScreen
      titulo="Unidades de medida"
      sub="Muda só como os números aparecem."
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo="Como você lê medidas" nu>
          {/* ⚠️ O ESCOLHIDO É CHEIO, COMO NO CADASTRO, e antes era uma
              pastilha escrita "em uso" no canto da linha.

              São a mesma decisão em dois lugares do mesmo aplicativo, e
              tinham dois desenhos: no cadastro a opção marcada é
              preenchida e salta antes da leitura; aqui a pessoa precisava
              procurar um selo de três letras para saber em qual estava.
              Quem trocou a unidade no cadastro reconhece o gesto — e é
              justamente ela que volta aqui para trocar de novo. */}
          <View style={{ gap: 8 }}>
            {/* ⚠️ E CADA OPÇÃO DIZ AS UNIDADES DELA. O nome do sistema é
                palavra de enciclopédia — ver o alto de logic/medidas —, e
                sozinho ele pede que a pessoa saiba de cor em qual dos
                dois cresceu. "Quilos, metros, centímetros e litros" se
                reconhece sem pensar. */}
            {OPCOES.map(([id, nome]) => (
              <Opc
                key={id}
                cheia
                label={nome}
                sub={unidadesDe(id)}
                on={atual === id}
                onPress={() => update((st: any) => { st.profile.sistema = id; })}
              />
            ))}
          </View>
        </Campo>

        {/* ⚠️ OS NÚMEROS DELA CONTINUAM À VISTA, e continuam sendo o motivo
            de esta tela existir: "métrico" e "imperial" são palavras de
            enciclopédia, e o que a pessoa reconhece é o próprio peso
            escrito. O que mudou foi o lugar — eram o subtítulo de cada
            opção, e viraram uma linha só embaixo, do sistema em uso. */}
        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          {exemplo(atual)}
        </Txt>

        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          A dose do medicamento continua em miligrama, e a proteína em grama —
          são as mesmas unidades nos dois sistemas.
        </Txt>
      </View>
    </SheetScreen>
  );
}
