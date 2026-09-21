import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Cartao, Linha } from '../ui/internas';
import {
  sistemaDe, pesoTxt, alturaTxt, compTxt, aguaTxt, type Sistema,
} from '../logic/medidas';

/* ============================================================
   AS UNIDADES

   ⚠️⚠️ A ESCOLHA SE FAZ COM OS NÚMEROS DELA À VISTA, e não com os nomes
   dos sistemas.

   "Métrico" e "imperial" são palavras de enciclopédia: quem cresceu com
   uma delas raramente sabe qual é o nome. O que a pessoa reconhece é o
   próprio peso escrito — 82,4 kg ou 181,7 lb —, e é por isso que cada
   opção mostra os quatro números DELA, com os valores reais do perfil e
   não com exemplos inventados.

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
      titulo="Unidades"
      sub="Muda só como os números aparecem."
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo="Como você lê medidas" nu>
          <View style={{ gap: 8 }}>
            {OPCOES.map(([id, nome]) => (
              <Cartao key={id}>
                <Linha
                  titulo={nome}
                  sub={exemplo(id)}
                  selo={atual === id ? `em uso` : undefined}
                  seloTom="lima"
                  seta={false}
                  onPress={() => update((st: any) => { st.profile.sistema = id; })}
                />
              </Cartao>
            ))}
          </View>
        </Campo>

        <Txt v="caption" c="#8A8F98" style={{ paddingHorizontal: 2 }}>
          A dose do medicamento continua em miligrama, e a proteína em grama —
          são as mesmas unidades nos dois sistemas.
        </Txt>
      </View>
    </SheetScreen>
  );
}
