import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '../logic/store';
import { nomeDoMarcador } from '../logic/derive';
import { dataComAno, now, DAY } from '../logic/time';
import { numeroEnxuto } from '../logic/local';
import { unidadesDe, faixaTxt } from '../logic/unidadesDeExame';
import {
  aceitouLeituraDoLaudo, registrarAceiteDoLaudo, lerLaudo, gravarLaudo,
  type Arquivo, type LaudoLido, type MotivoDoLaudo,
} from '../logic/laudo';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Botao, Cartao, Linha, Aviso } from '../ui/internas';
import { RodaQueViraVisto } from '../ui/espera';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, font } from '../theme';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.exames.laudo;

/* ============================================================
   LER O LAUDO — do arquivo à lista conferida

   Cinco momentos numa folha só: o aceite (só na primeira vez), de onde
   vem o arquivo, a espera, o erro com a porta de volta para anotar à
   mão, e a revisão. A revisão é a parte que importa: cada resultado lido
   aparece editável, com a unidade do laudo e a faixa que o laboratório
   imprimiu, e sai da lista com um toque. Só o que ficou na lista é
   gravado — ver `gravarLaudo`, em logic/laudo.
   ============================================================ */

type Fase = 'aceite' | 'escolher' | 'lendo' | 'erro' | 'revisao';
type Item = { marcador: string; valor: string; unidade: string | null; referencia: string | null };

/* O LAUDO DE EXEMPLO — só em desenvolvimento, para a revisão poder ser
   vista sem a função publicada. Tem um de cada caso: unidade conhecida,
   unidade de outro país e unidade que a pessoa precisa escolher. */
const EXEMPLO = (): LaudoLido => ({
  coleta: +now() - 3 * DAY,
  resultados: [
    { marcador: 'HbA1c', valor: 5.4, unidade: '%', referencia: '< 5,7' },
    { marcador: 'Glicemia jejum', valor: 5.1, unidade: 'mmol/L', referencia: '3,9–5,5' },
    { marcador: 'LDL', valor: 112, unidade: null, referencia: '< 130' },
  ],
  naoReconhecidos: ['Hemograma completo', 'Sódio'],
});

const RECADO = (): Record<MotivoDoLaudo, string> => ({
  'sem-servidor': K().erroSemServidor,
  'sem-rede': K().erroSemRede,
  'nao-reconheci': K().erroNaoReconheci,
  grande: K().erroGrande,
  'sem-conta': T.comum.ia.semConta,
  limite: T.comum.ia.limite,
  /* o teto de 30 dias é só da conversa; aqui não chega, mas o tipo é o da porta */
  'limite-do-mes': T.comum.ia.limite,
});

export default function Laudo() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const [fase, setFase] = useState<Fase>(aceitouLeituraDoLaudo(S) ? 'escolher' : 'aceite');
  const [motivo, setMotivo] = useState<MotivoDoLaudo>('nao-reconheci');
  const [coleta, setColeta] = useState<number | null>(null);
  const [itens, setItens] = useState<Item[]>([]);
  const [outros, setOutros] = useState<string[]>([]);

  const anotarAMao = () => router.replace('/medir-exame' as any);

  const mostrar = (laudo: LaudoLido) => {
    setColeta(laudo.coleta);
    setItens(laudo.resultados.map((r) => ({
      marcador: r.marcador, valor: numeroEnxuto(r.valor, 3), unidade: r.unidade, referencia: r.referencia,
    })));
    setOutros(laudo.naoReconhecidos);
    setFase('revisao');
  };

  const ler = async (a: Arquivo) => {
    setFase('lendo');
    const r = await lerLaudo(a);
    if (r.ok) mostrar(r.laudo);
    else { setMotivo(r.motivo); setFase('erro'); }
  };

  const escolherPdf = async () => {
    const r = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true, base64: true });
    const a = !r.canceled ? r.assets[0] : null;
    if (a) ler({ uri: a.uri, tipo: 'pdf', tamanho: a.size, base64Web: (a as any).base64 });
  };
  const tirarFoto = async () => {
    const p = await ImagePicker.requestCameraPermissionsAsync();
    if (!p.granted) return;
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!r.canceled && r.assets[0]) ler({ uri: r.assets[0].uri, tipo: 'foto' });
  };
  const daGaleria = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!r.canceled && r.assets[0]) ler({ uri: r.assets[0].uri, tipo: 'foto' });
  };

  /* A revisão só salva o que está inteiro: número válido e unidade
     escolhida em cada linha que ficou. */
  const numero = (s: string) => parseFloat(s.replace(',', '.'));
  const prontos = itens.filter((i) => i.unidade && Number.isFinite(numero(i.valor)) && numero(i.valor) >= 0);
  const podeSalvar = itens.length > 0 && prontos.length === itens.length;
  const salvar = () => {
    if (!podeSalvar) return;
    update((s: any) => {
      gravarLaudo(s, itens.map((i) => ({
        marcador: i.marcador, valor: numero(i.valor), unidade: i.unidade!, referencia: i.referencia,
      })), coleta);
    });
    router.replace('/exames' as any);
  };
  const mudar = (k: number, parte: Partial<Item>) =>
    setItens((xs) => xs.map((x, i) => (i === k ? { ...x, ...parte } : x)));
  const tirar = (k: number) => setItens((xs) => xs.filter((_, i) => i !== k));

  /* ------------------------------------------------------------ */
  if (fase === 'aceite') {
    return (
      <SheetScreen titulo={K().aceiteTitulo} onClose={() => router.back()}>
        <View style={{ marginTop: 18, gap: 12 }}>
          {[K().aceite1, K().aceite2, K().aceite3].map((t, i) => (
            <Row key={i} gap={12} style={{ alignItems: 'flex-start' }}>
              <Icon name={['lock', 'check', 'info'][i]} size={17} color={c.accent} sw={1.9} />
              <Txt v="body" c={c.tx2} style={{ flex: 1, lineHeight: 23 }}>{t}</Txt>
            </Row>
          ))}
          <Pressable onPress={() => router.push('/documento?id=privacidade' as any)} hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, alignSelf: 'flex-start', marginTop: 4 }]}>
            <Txt v="label" c={c.accent2}>{K().politica}</Txt>
          </Pressable>
          <View style={{ gap: 10, marginTop: 14 }}>
            <Botao label={K().aceitar} onPress={() => { update((s: any) => { registrarAceiteDoLaudo(s); }); setFase('escolher'); }} />
            <Botao label={K().recusar} tom="fantasma" onPress={anotarAMao} />
          </View>
        </View>
      </SheetScreen>
    );
  }

  if (fase === 'escolher') {
    return (
      <SheetScreen titulo={K().escolherTitulo} onClose={() => router.back()}>
        <View style={{ marginTop: 18 }}>
          <Cartao>
            <Linha ic="doc" titulo={K().pdf} onPress={escolherPdf} />
            <Linha ic="camera" titulo={K().foto} onPress={tirarFoto} />
            <Linha ic="photo" titulo={K().galeria} onPress={daGaleria} />
            {__DEV__ ? <Linha ic="spark" titulo={K().exemplo} onPress={() => mostrar(EXEMPLO())} /> : null}
          </Cartao>
        </View>
      </SheetScreen>
    );
  }

  if (fase === 'lendo') {
    return (
      <SheetScreen onClose={() => router.back()}>
        <View style={{ alignItems: 'center', paddingVertical: 40, gap: 14 }}>
          <RodaQueViraVisto pronto={false} cor={c.accent} />
          <Txt v="h2">{K().lendo}</Txt>
          <Txt v="caption" c={c.tx3}>{K().lendoSub}</Txt>
        </View>
      </SheetScreen>
    );
  }

  if (fase === 'erro') {
    return (
      <SheetScreen onClose={() => router.back()}>
        <View style={{ marginTop: 18, gap: 10 }}>
          <Aviso ic="info" texto={RECADO()[motivo]} />
          {motivo !== 'sem-servidor' ? <Botao label={K().tentarDeNovo} onPress={() => setFase('escolher')} /> : null}
          <Botao label={K().anotarAMao} tom={motivo === 'sem-servidor' ? undefined : 'fantasma'} onPress={anotarAMao} />
        </View>
      </SheetScreen>
    );
  }

  /* ---- a revisão ---- */
  return (
    <SheetScreen
      titulo={K().revisaoTitulo}
      sub={K().revisaoSub}
      onClose={() => router.back()}
      rodape={<Botao label={K().salvar(itens.length)} desligado={!podeSalvar} onPress={salvar} />}
    >
      <Txt v="caption" c={coleta ? c.tx2 : c.tx3} style={{ marginTop: 14 }}>
        {coleta ? K().coleta(dataComAno(coleta)) : K().semColeta}
      </Txt>

      <View style={{ marginTop: 14, gap: 10 }}>
        {itens.map((it, k) => {
          const opcoes = unidadesDe(it.marcador);
          return (
            <View key={it.marcador} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 12 }}>
              <Row style={{ alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Txt v="body">{nomeDoMarcador(it.marcador)}</Txt>
                  {it.referencia ? (
                    <Txt v="micro" c={c.tx3} style={{ marginTop: 2 }}>
                      {K().faixa(`${faixaTxt(it.referencia).replace(/ /g, '\u00A0').replace(/–/g, '–\u2060')}${it.unidade ? `\u00A0${it.unidade}` : ''}`)}
                    </Txt>
                  ) : null}
                </View>
                <TextInput
                  value={it.valor} onChangeText={(v) => mudar(k, { valor: v })} keyboardType="decimal-pad"
                  style={{ width: 84, textAlign: 'right', color: c.tx, fontFamily: font.body, fontSize: 22, paddingVertical: 2 }}
                />
                {it.unidade ? <Txt v="caption" c={c.tx3} style={{ marginLeft: 6 }}>{it.unidade}</Txt> : null}
                <Pressable onPress={() => tirar(k)} hitSlop={10} accessibilityLabel={K().tirar}
                  style={({ pressed }) => [{ marginLeft: 12, opacity: pressed ? 0.5 : 1 }]}>
                  <Icon name="x" size={16} color={c.tx4} sw={2} />
                </Pressable>
              </Row>
              {/* As pastilhas aparecem quando há o que escolher — e são
                  obrigatórias quando o laudo trouxe uma unidade que o
                  marcador não conhece. */}
              {opcoes.length > 1 || !it.unidade ? (
                <View style={{ marginTop: 10 }}>
                  {!it.unidade ? <Txt v="micro" c={c.cta} style={{ marginBottom: 6 }}>{K().escolhaUnidade}</Txt> : null}
                  <Row gap={6} style={{ flexWrap: 'wrap' }}>
                    {opcoes.map((u) => {
                      const on = u.id === it.unidade;
                      return (
                        <Pressable key={u.id} onPress={() => mudar(k, { unidade: u.id })}
                          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                          <View style={{ backgroundColor: on ? c.tx : c.bg2, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 5 }}>
                            <Txt v="micro" c={on ? c.bg1 : c.tx2}>{u.id}</Txt>
                          </View>
                        </Pressable>
                      );
                    })}
                  </Row>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {outros.length ? (
        <Txt v="micro" c={c.tx3} style={{ marginTop: 14, lineHeight: 17 }}>
          {K().tambem(outros.join(', '))}
        </Txt>
      ) : null}
    </SheetScreen>
  );
}
