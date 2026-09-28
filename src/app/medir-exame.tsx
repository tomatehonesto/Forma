import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { examCats, nomeDoMarcador, REFERENCIA_DOS_MARCADORES } from '../logic/derive';
import { now, nf } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.exames.anotar;

/* Novo exame — captura.

   Importar PDF depende de leitor de documento e de extração de marcadores,
   que o app não tem. O que dá para fazer hoje é anotar um marcador de cada
   vez, que é o que a pessoa faz ao sair do laboratório com o papel na mão.

   ⚠️ E A FOLHA NÃO PROMETE MAIS O QUE NÃO FAZ (28/09/2026). Ela abria com
   "Importar PDF do laboratório — ainda não disponível", apagado, e com o
   rótulo "ANOTAR À MÃO" embaixo — um aviso de função que não existe, na
   loja, logo na primeira linha. Os textos estavam escritos à mão em
   português; foram para textos/<idioma>/exames, em `anotar`. */
/** O último valor do marcador, com a vírgula de quem lê. */
const ultimoValor = (e: any) => {
  const v = e.values[e.values.length - 1].v;
  return nf(v, v % 1 ? 1 : 0);
};

export default function MedirExame() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [marcador, setMarcador] = useState('HbA1c');
  const [valor, setValor] = useState('');

  const existente = (S.exams as any[]).find((e) => e.marker === marcador);
  const num = parseFloat(valor.replace(',', '.'));
  const valido = !isNaN(num) && num > 0;

  /* A unidade e a faixa usual do marcador — ver REFERENCIA_DOS_MARCADORES. */
  const padrao = REFERENCIA_DOS_MARCADORES[marcador];
  const unidade = existente?.unit || padrao?.unit || '';
  const faixa = existente?.ref || padrao?.ref || '';

  const salvar = () => {
    if (!valido) return;
    update((s: any) => {
      const e = s.exams.find((x: any) => x.marker === marcador);
      if (e) {
        e.values.push({ t: +now(), v: num });
        /* o que foi anotado antes, sem unidade nem faixa, ganha as usuais */
        if (padrao) {
          if (!e.unit) e.unit = padrao.unit;
          if (!e.ref) e.ref = padrao.ref;
          if (!e.good) e.good = padrao.good;
        }
      } else {
        s.exams.push({
          marker: marcador,
          unit: padrao?.unit ?? '', ref: padrao?.ref ?? '', good: padrao?.good ?? '',
          values: [{ t: +now(), v: num }],
        });
      }
    });
    /* O marcador vai no caminho porque a confirmação fala dele: sem saber
       qual chegou, ela só poderia dizer "resultado registrado". */
    router.replace(`/registro-ok?tipo=exame&ref=${encodeURIComponent(marcador)}` as any);
  };

  return (
    <SheetScreen titulo={K().titulo} sub={K().sub} onClose={() => router.back()}>
      <View style={{ height: 20 }} />

      {examCats().map(([cat, marcadores]) => (
        <View key={cat} style={{ marginBottom: 12 }}>
          <Txt v="micro" c={c.tx4} style={{ marginBottom: 7 }}>{cat.toUpperCase()}</Txt>
          <Row gap={6} style={{ flexWrap: 'wrap' }}>
            {marcadores.map((m) => {
              const on = marcador === m;
              return (
                <Pressable key={m} onPress={() => setMarcador(m)} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                  <View style={{ backgroundColor: on ? c.tx : c.bg1, borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 8, marginBottom: 6 }}>
                    {/* `bg1` e não `onHero`: a pastilha escolhida é
                        `c.tx`, que no escuro é branca — ver a nota em
                        (tabs)/jornada, onde o mesmo par aparece. */}
                    <Txt v="caption" c={on ? c.bg1 : c.tx2}>{nomeDoMarcador(m)}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>
        </View>
      ))}

      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 18 }}>
        <Row style={{ paddingVertical: 14 }}>
          <View style={{ flex: 1 }}>
            <Txt v="body">{nomeDoMarcador(marcador)}</Txt>
            {/* O último valor, ou que é o primeiro — e a faixa, dita como
                usual: a do laudo pode ser outra. */}
            <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>
              {[
                existente?.values.length
                  ? `${K().ultimo}: ${ultimoValor(existente)}${unidade ? `\u00A0${unidade}` : ''}`
                  : K().primeiro,
                faixa ? `${K().referencia}: ${faixa.replace(/ /g, '\u00A0')}${unidade ? `\u00A0${unidade}` : ''}` : null,
              ].filter(Boolean).join(' · ')}
            </Txt>
          </View>
          <TextInput
            value={valor} onChangeText={setValor} keyboardType="decimal-pad" autoFocus
            placeholder="—" placeholderTextColor={c.tx4}
            style={{ width: 92, textAlign: 'right', color: c.tx, fontFamily: font.body, fontSize: 24, paddingVertical: 4 }}
          />
          {unidade ? <Txt v="caption" c={c.tx3} style={{ marginLeft: 6 }}>{unidade}</Txt> : null}
        </Row>
      </View>

      <Pressable onPress={salvar} disabled={!valido} style={({ pressed }) => [{ marginTop: 16, opacity: !valido ? 0.4 : pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>{K().registrar(nomeDoMarcador(marcador))}</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
