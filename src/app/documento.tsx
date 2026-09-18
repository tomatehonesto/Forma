import React from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { documentoDe, type Secao } from '../logic/documentos';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   UM DOCUMENTO — Termos de Uso ou Política de Privacidade

   Uma tela para os dois, porque são o mesmo objeto: título, uma frase de
   entrada e seções numeradas. Duas telas quase iguais divergiriam no
   primeiro ajuste de entrelinha, e num documento jurídico a diferença
   entre as duas viraria dúvida sobre qual é a versão boa.

   O DESENHO AQUI É DE LEITURA LONGA, e não de lista de configuração.
   Medida de linha confortável, entrelinha generosa, seção separada por
   espaço em vez de fio — quem abre isto vai ler parágrafos, não bater o
   olho num valor.

   E NÃO É PAPEL. A tela do resumo para o médico já ensinou a lição: quem
   lê aqui é a pessoa, no telefone dela, e imitar a folha impressa só
   piora o que ela veio fazer. O documento continua sendo documento pela
   estrutura — seções numeradas, linguagem precisa —, e não por fingir
   ter margem de impressora.
   ============================================================ */

function Bloco({ s }: { s: Secao }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Txt v="bodyMed" style={{ letterSpacing: -0.2 }}>{s.titulo}</Txt>
      {(s.paragrafos ?? []).map((p, i) => (
        <Txt key={`p${i}`} v="caption" c={c.tx2} style={{ lineHeight: 22 }}>{p}</Txt>
      ))}
      {s.itens?.length ? (
        <View style={{ gap: 8, marginTop: 2 }}>
          {s.itens.map((it, i) => (
            /* O MARCADOR É UM PONTO ALINHADO COM A PRIMEIRA LINHA, e o
               texto tem coluna própria: sem isso a segunda linha de cada
               item volta para debaixo do marcador e a lista deixa de se
               ler como lista. */
            <Row key={`i${i}`} gap={9} style={{ alignItems: 'flex-start' }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: c.tx4, marginTop: 9 }} />
              <Txt v="caption" c={c.tx2} style={{ flex: 1, lineHeight: 22 }}>{it}</Txt>
            </Row>
          ))}
        </View>
      ) : null}
      {(s.depois ?? []).map((p, i) => (
        <Txt key={`d${i}`} v="caption" c={c.tx2} style={{ lineHeight: 22, marginTop: 2 }}>{p}</Txt>
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
      <Titulao titulo={doc.titulo} lead={doc.lead} />

      <View style={{ gap: 26 }}>
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
