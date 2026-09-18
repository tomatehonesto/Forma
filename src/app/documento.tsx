import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  documentoDe, VERSAO_DOS_DOCUMENTOS, VIGENTE_DESDE, FASE, type Secao,
} from '../logic/documentos';
import { Txt, Row, Rich } from '../ui/kit';
import { TelaInterna } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM DOCUMENTO — Termos de Uso ou Política de Privacidade

   Uma tela para os dois, porque são o mesmo objeto: sobrelinha, título,
   versão, abertura e seções numeradas. Duas telas quase iguais
   divergiriam no primeiro ajuste de entrelinha, e num documento jurídico
   a diferença entre as duas viraria dúvida sobre qual é a versão boa.

   O CABEÇALHO VEIO DO SELLO, e ele carrega três coisas que um Titulão
   comum não tem:

     · a SOBRELINHA diz de que lei o documento vive — "POLÍTICA · LGPD" —,
       e isso enquadra a leitura antes da primeira linha;
     · a VERSÃO e a VIGÊNCIA existem porque documento jurídico sem data é
       documento sem efeito: quem aceitou precisa saber o que aceitou, e
       a versão é o que liga o aceite guardado no perfil a este texto;
     · o FIO fecha o cabeçalho e abre o corpo, que é a única régua desta
       tela — as seções depois se separam por espaço, e não por fios.

   O DESENHO É DE LEITURA LONGA, e não de lista de configuração. Medida de
   linha confortável, entrelinha generosa, ênfase em negrito dentro do
   parágrafo em vez de cor. Quem abre isto vai ler parágrafos.
   ============================================================ */

function Bloco({ s }: { s: Secao }) {
  const { c } = useTheme();
  const Paragrafo = ({ t }: { t: string }) => (
    <Rich text={t} v="caption" base={c.tx2} bold={c.tx} style={{ lineHeight: 22 }} />
  );

  return (
    <View style={{ gap: 10 }}>
      <Txt v="bodyMed" style={{ letterSpacing: -0.2 }}>{s.titulo}</Txt>
      {(s.paragrafos ?? []).map((p, i) => <Paragrafo key={`p${i}`} t={p} />)}

      {s.itens?.length ? (
        <View style={{ gap: 9, marginTop: 2 }}>
          {s.itens.map((it, i) => (
            /* O MARCADOR É UM PONTO ALINHADO COM A PRIMEIRA LINHA, e o
               texto tem coluna própria: sem isso a segunda linha de cada
               item volta para debaixo do marcador e a lista deixa de se
               ler como lista. */
            <Row key={`i${i}`} gap={10} style={{ alignItems: 'flex-start' }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c.tx4, marginTop: 9 }} />
              <View style={{ flex: 1 }}><Paragrafo t={it} /></View>
            </Row>
          ))}
        </View>
      ) : null}

      {(s.depois ?? []).map((p, i) => (
        <View key={`d${i}`} style={{ marginTop: 2 }}><Paragrafo t={p} /></View>
      ))}
    </View>
  );
}

export default function DocumentoTela() {
  const { c } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const doc = id ? documentoDe(id) : null;
  if (!doc) { router.back(); return null; }

  return (
    <TelaInterna titulo={doc.titulo}>
      <View style={{ gap: 10 }}>
        <Txt v="micro" c={c.cta} style={{ letterSpacing: 2 }}>{doc.sobre}</Txt>
        <Txt v="h1" style={{ letterSpacing: -1 }}>{doc.titulo}</Txt>
        <Txt v="caption" c={c.tx3}>
          Versão {VERSAO_DOS_DOCUMENTOS} — {FASE} · Vigente desde {VIGENTE_DESDE}
        </Txt>
      </View>

      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.line }} />

      <Rich text={doc.abertura} v="caption" base={c.tx2} bold={c.tx} style={{ lineHeight: 22 }} />

      <View style={{ gap: 28 }}>
        {doc.secoes.map((s) => <Bloco key={s.titulo} s={s} />)}
      </View>

      {/* O PÉ DIZ O QUE FALTA AO DOCUMENTO — e enquanto ele existir, esta
          tela não deveria estar acessível a ninguém de fora. É a última
          linha de defesa: se o link acender por engano antes da revisão,
          quem ler sabe o que tem na mão. */}
      <Txt v="micro" c={c.tx4} style={{ textAlign: 'center', lineHeight: 17 }}>
        Minuta sujeita a revisão jurídica antes da publicação.
      </Txt>

      <View />
    </TelaInterna>
  );
}
