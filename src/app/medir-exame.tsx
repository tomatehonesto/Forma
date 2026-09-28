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
import {
  unidadesDe, unidadePadrao, converterValor, converterFaixa, faixaTxt,
} from '../logic/unidadesDeExame';

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
export default function MedirExame() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [marcador, setMarcador] = useState('HbA1c');
  const [valor, setValor] = useState('');
  /* A unidade escolhida nas pastilhas, por marcador: trocar de marcador e
     voltar não desfaz a escolha. */
  const [escolhida, setEscolhida] = useState<Record<string, string>>({});

  const existente = (S.exams as any[]).find((e) => e.marker === marcador);
  const num = parseFloat(valor.replace(',', '.'));
  const valido = !isNaN(num) && num > 0;

  /* A UNIDADE: a do laudo, escolhida nas pastilhas. Sem escolha, a do
     registro que já existe, ou a que o país costuma ler — ver
     logic/unidadesDeExame. O registro antigo sem unidade está na de
     referência, que era a única que a folha conhecia. */
  const padrao = REFERENCIA_DOS_MARCADORES[marcador];
  const opcoes = unidadesDe(marcador);
  const doRegistro = existente ? (existente.unit || padrao?.unit || '') : null;
  const unidade = escolhida[marcador] ?? doRegistro ?? unidadePadrao(marcador) ?? padrao?.unit ?? '';
  const converte = (de: string | null | undefined) =>
    !!de && de !== unidade && opcoes.some((u) => u.id === de) && opcoes.some((u) => u.id === unidade);
  /* A faixa e o último valor, já na unidade escolhida. */
  const faixaDe = existente?.ref ? doRegistro : padrao?.unit;
  const faixaBase = existente?.ref || padrao?.ref || '';
  const faixa = converte(faixaDe) ? converterFaixa(marcador, faixaBase, faixaDe!, unidade) : faixaBase;
  const ultimo = existente?.values.length
    ? converterValor(marcador, existente.values[existente.values.length - 1].v, doRegistro || unidade, unidade)
    : null;
  /* Trocar a unidade de um marcador que já tem história converte a
     história junto: a linha do tempo não pode misturar escalas. */
  const trocaHistoria = existente?.values.length ? converte(doRegistro) : false;

  const salvar = () => {
    if (!valido) return;
    update((s: any) => {
      const e = s.exams.find((x: any) => x.marker === marcador);
      if (e) {
        const antiga = e.unit || padrao?.unit || '';
        if (converte(antiga)) {
          e.values = e.values.map((x: any) => ({ ...x, v: Number(converterValor(marcador, x.v, antiga, unidade).toFixed(3)) }));
          if (e.ref) e.ref = converterFaixa(marcador, e.ref, antiga, unidade);
        }
        e.unit = unidade;
        /* o que foi anotado antes sem faixa nem direção ganha as usuais */
        if (padrao) {
          if (!e.ref) e.ref = converterFaixa(marcador, padrao.ref, padrao.unit, unidade);
          if (!e.good) e.good = padrao.good;
        }
        e.values.push({ t: +now(), v: num });
      } else {
        s.exams.push({
          marker: marcador,
          unit: unidade,
          ref: padrao ? converterFaixa(marcador, padrao.ref, padrao.unit, unidade) : '',
          good: padrao?.good ?? '',
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
                ultimo != null
                  ? `${K().ultimo}: ${nf(ultimo, ultimo % 1 ? 1 : 0)}${unidade ? `\u00A0${unidade}` : ''}`
                  : K().primeiro,
                faixa ? `${K().referencia}: ${faixaTxt(faixa).replace(/ /g, '\u00A0').replace(/–/g, '–\u2060')}${unidade ? `\u00A0${unidade}` : ''}` : null,
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

        {/* AS PASTILHAS DA UNIDADE, só quando o marcador tem mais de uma.
            Embaixo do número, e não em cima: primeiro se procura o valor
            no laudo, e a unidade está escrita logo ao lado dele. */}
        {opcoes.length > 1 ? (
          <View style={{ borderTopWidth: 1, borderTopColor: c.line, paddingVertical: 12 }}>
            <Row gap={8} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Txt v="micro" c={c.tx3}>{K().unidadeDoLaudo}</Txt>
              {opcoes.map((u) => {
                const on = u.id === unidade;
                return (
                  <Pressable key={u.id} onPress={() => setEscolhida((x) => ({ ...x, [marcador]: u.id }))}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                    <View style={{ backgroundColor: on ? c.tx : c.bg2, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 }}>
                      <Txt v="micro" c={on ? c.bg1 : c.tx2}>{u.id}</Txt>
                    </View>
                  </Pressable>
                );
              })}
            </Row>
            {trocaHistoria ? (
              <Txt v="micro" c={c.tx3} style={{ marginTop: 8 }}>{K().converteAnteriores(unidade)}</Txt>
            ) : null}
          </View>
        ) : null}
      </View>

      <Pressable onPress={salvar} disabled={!valido} style={({ pressed }) => [{ marginTop: 16, opacity: !valido ? 0.4 : pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' }}>
          <Txt v="body" c={c.accentInk}>{K().registrar(nomeDoMarcador(marcador))}</Txt>
        </View>
      </Pressable>
    </SheetScreen>
  );
}
