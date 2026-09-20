import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { latestMeasure } from '../logic/derive';
import { now, nf } from '../logic/time';
import { Txt, SheetScreen, Divider } from '../ui/kit';
import { Regua, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* Novas medidas — captura, não a tela de histórico. Abre com a última
   medição preenchida: circunferência muda devagar, então quase sempre é
   ajuste de um ou dois campos, não digitar os quatro.

   ⚠️ SÃO RÉGUAS, E ERAM QUATRO CAMPOS DE TECLADO.

   É a mesma pergunta que o peso faz uma tela antes, e o peso já tinha
   deixado o campo pela régua: mais e menos servem para corrigir um passo,
   e o teclado serve para quem já sabe o número — mas nenhum dos dois
   mostra a VIZINHANÇA, que é o que diz se 94 é perto ou longe do que a
   pessoa mediu da última vez. Dois controles diferentes para medir o
   próprio corpo em duas telas seguidas é a pessoa reaprendendo a cada
   sheet.

   ⚠️ CADA UMA TEM A SUA FAIXA. Uma régua só, de 20 a 200, faria o braço
   viver num canto de uma fita gigante — a régua ganha dos botões porque
   mostra os vizinhos, e vizinho a cem centímetros de distância não é
   vizinho.

   ⚠️ E O PADRÃO SÓ VALE DEPOIS DE TOCADO. Régua precisa começar em algum
   lugar, e quem nunca mediu não tem esse lugar: os números abaixo são
   ponto de partida do controle, não sugestão de corpo. Por isso, sem
   medição anterior, o botão só acende quando a pessoa passou por todas as
   quatro — senão um toque em "Registrar" gravaria quatro números que
   ninguém mediu. */
const CAMPOS: [string, string, number, number, number][] = [
  // chave, rótulo, mínimo, máximo, onde a régua abre sem histórico
  ['cintura', 'Cintura', 50, 180, 90],
  ['quadril', 'Quadril', 60, 190, 100],
  ['braco', 'Braço', 15, 70, 32],
  ['coxa', 'Coxa', 25, 110, 55],
];

const n1 = (x: number) => nf(x, 1).replace('.', ',');

export default function MedirMedidas() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const ultima: any = latestMeasure(S);
  const [vals, setVals] = useState<Record<string, number>>(
    Object.fromEntries(CAMPOS.map(([k, , , , padrao]) => [k, ultima?.[k] || padrao])),
  );
  const [tocados, setTocados] = useState<string[]>([]);

  const mexer = (k: string, v: number) => {
    setVals((x) => ({ ...x, [k]: v }));
    setTocados((t) => (t.includes(k) ? t : [...t, k]));
  };

  const valido = CAMPOS.every(([k]) => vals[k] > 0 && (!!ultima || tocados.includes(k)));

  const salvar = () => {
    if (!valido) return;
    update((s: any) => {
      s.measures.push({
        t: +now(),
        cintura: vals.cintura, quadril: vals.quadril,
        braco: vals.braco, coxa: vals.coxa,
        /* composição não é medida com fita — herda a última leitura até
           existir balança de bioimpedância conectada */
        gordura: ultima ? ultima.gordura : 0,
        musculo: ultima ? ultima.musculo : 0,
      });
    });
    router.replace('/registro-ok?tipo=medidas' as any);
  };

  return (
    <SheetScreen
      titulo="Quais são suas medidas?"
      sub={ultima ? 'começa da última medição — ajuste o que mudou' : undefined}
      onClose={() => router.back()}
    >
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 18, paddingHorizontal: 18 }}>
        {CAMPOS.map(([k, rotulo, min, max], i) => {
          const antes = ultima ? ultima[k] : null;
          const d = antes != null ? vals[k] - antes : 0;
          return (
            <React.Fragment key={k}>
              {i > 0 && <Divider />}
              <View style={{ paddingVertical: 16, gap: 12 }}>
                {/* O rótulo fica em cima da régua, e não ao lado do número:
                    o número já é a coisa maior da linha, e disputar a mesma
                    altura com ele faria os dois encolherem. */}
                <Txt v="bodyMed">{rotulo}</Txt>
                <Regua
                  min={min} max={max} passo={0.5} tracoCada={1} casas={1} esp={9} salto={0.5}
                  valor={vals[k]} unidade="cm" onEscolhe={(v) => mexer(k, v)}
                />
                {Math.abs(d) >= 0.1 ? (
                  <Txt v="micro" c={d < 0 ? c.limeSoftInk : c.tx3} style={{ textAlign: 'center' }}>
                    {d < 0 ? '−' : '+'}{n1(Math.abs(d))} cm desde a última
                  </Txt>
                ) : null}
              </View>
            </React.Fragment>
          );
        })}
      </View>

      {/* O <Botao> do resto do aplicativo, e era um Pressable desenhado à
          mão aqui dentro. Ele já sabe ficar desligado — e o desligado passa
          a importar mais: sem medição anterior, é ele que segura o registro
          até a pessoa ter passado pelas quatro réguas. */}
      <View style={{ marginTop: 16 }}>
        <Botao label="Registrar medidas" onPress={salvar} desligado={!valido} />
      </View>
    </SheetScreen>
  );
}
