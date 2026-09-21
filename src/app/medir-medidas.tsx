import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { latestMeasure } from '../logic/derive';
import { now, nf } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Regua, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* Novas medidas — captura, não a tela de histórico. É a sessão de fita
   métrica, e agora é a ÚNICA: /medir-peso trazia três medidas de carona e
   deixou de trazer, porque duas entradas no menu de registrar que fazem a
   mesma coisa é a pessoa tendo de adivinhar qual é a certa. Quem quer
   registrar circunferência chega aqui, por "Medi meu corpo".

   ⚠️ SÃO CHIPS, E ERAM QUATRO CAMPOS SEMPRE ABERTOS.

   Exigir as quatro fazia a tela decidir o que é uma medição completa. Só
   que fita métrica não é balança: a cintura se mede sozinha em dez
   segundos, a coxa pede outra posição, e quem mediu só uma tinha duas
   saídas — inventar as outras três ou não registrar nada. Agora a pessoa
   diz o que mediu, e a régua só aparece para isso.

   ⚠️ CADA UMA TEM A SUA FAIXA. Uma régua só, de 20 a 200, faria o braço
   viver num canto de uma fita gigante — a régua ganha dos botões porque
   mostra os vizinhos, e vizinho a cem centímetros de distância não é
   vizinho.

   ⚠️ E O PADRÃO SÓ VALE DEPOIS DE TOCADO. Régua precisa começar em algum
   lugar, e quem nunca mediu não tem esse lugar: os números abaixo são
   ponto de partida do controle, não sugestão de corpo. Com histórico,
   abrir o chip já é a afirmação — sem histórico, não há número para
   afirmar, e o chip aberto e intocado não grava. */
const CAMPOS: [string, string, number, number, number][] = [
  // chave, rótulo, mínimo, máximo, onde a régua abre sem histórico
  ['cintura', 'Cintura', 50, 180, 90],
  ['quadril', 'Quadril', 60, 190, 100],
  ['braco', 'Braço', 15, 70, 32],
  ['coxa', 'Coxa', 25, 110, 55],
];


export default function MedirMedidas() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const ultima: any = latestMeasure(S);
  const [abertas, setAbertas] = useState<string[]>([]);
  const [tocadas, setTocadas] = useState<string[]>([]);
  const [medidas, setMedidas] = useState<Record<string, number>>(
    Object.fromEntries(CAMPOS.map(([k, , , , padrao]) => [k, ultima?.[k] || padrao])),
  );

  const alterna = (k: string) =>
    setAbertas((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));
  const mexer = (k: string, v: number) => {
    setMedidas((m) => ({ ...m, [k]: v }));
    setTocadas((t) => (t.includes(k) ? t : [...t, k]));
  };

  const gravaveis = abertas.filter((k) => ultima || tocadas.includes(k));

  const salvar = () => {
    if (!gravaveis.length) return;
    update((s: any) => {
      /* As que ficaram fechadas herdam a última leitura, e não zero: o
         gráfico de cintura não pode cair a zero porque hoje a pessoa só
         mediu o braço. Composição não se mede com fita e herda do mesmo
         jeito, até existir balança de bioimpedância conectada. */
      const base = ultima || { cintura: 0, quadril: 0, braco: 0, coxa: 0, gordura: 0, musculo: 0 };
      s.measures.push({
        ...base,
        t: +now(),
        ...Object.fromEntries(gravaveis.map((k) => [k, medidas[k]])),
      });
    });
    router.replace('/registro-ok?tipo=medidas' as any);
  };

  return (
    <SheetScreen
      titulo="Quais são suas medidas?"
      sub={ultima ? 'as réguas abrem na última medição' : undefined}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo
          rotulo="O que você mediu"
          ajuda="Nenhuma delas é obrigatória. Medir só a cintura é um registro tão bom quanto medir as quatro."
        >
          <Opcoes>
            {CAMPOS.map(([k, rotulo]) => (
              <Opc key={k} label={rotulo} on={abertas.includes(k)} onPress={() => alterna(k)} />
            ))}
          </Opcoes>

          {abertas.map((k) => {
            const campo = CAMPOS.find(([id]) => id === k)!;
            const antes = ultima ? ultima[k] : null;
            const d = antes != null ? medidas[k] - antes : 0;
            return (
              <View key={k} style={{ gap: 10 }}>
                {/* O RÓTULO SÓ APARECE QUANDO HÁ MAIS DE UMA RÉGUA ABERTA.

                    Com uma só, o chip aceso logo acima já diz qual é — e
                    "Cintura", "Cintura", "96,0" em três linhas seguidas é a
                    tela repetindo a palavra que a pessoa acabou de tocar.
                    Com duas ou mais ele deixa de ser eco: passa a ser o que
                    diz qual régua é qual. */}
                {abertas.length > 1 ? <Txt v="caption" c={c.tx3}>{campo[1]}</Txt> : null}
                <Regua
                  min={campo[2]} max={campo[3]} passo={0.5} tracoCada={1} casas={1} esp={9} salto={0.5}
                  valor={medidas[k]} unidade="cm" onEscolhe={(v) => mexer(k, v)}
                />
                {Math.abs(d) >= 0.1 ? (
                  <Txt v="micro" c={d < 0 ? c.limeSoftInk : c.tx3} style={{ textAlign: 'center' }}>
                    {d < 0 ? '−' : '+'}{nf(Math.abs(d), 1)} cm desde a última
                  </Txt>
                ) : null}
              </View>
            );
          })}
        </Campo>

        <Botao
          label={gravaveis.length === 1 ? 'Registrar a medida' : 'Registrar as medidas'}
          onPress={salvar}
          desligado={!gravaveis.length}
        />
      </View>
    </SheetScreen>
  );
}
