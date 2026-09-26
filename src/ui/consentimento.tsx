import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AVISO, TERMOS, POLITICA } from '../logic/consentimento';
import { temIdentificacao } from '../logic/documentos';
import { Txt, Row } from './kit';
import { Icon } from './Icon';
import { useTheme } from './useTheme';
import { radius } from '../theme';
import { T } from '../textos';

/* ============================================================
   O AVISO DE CONSENTIMENTO, EM LISTA — o último passo do cadastro e a
   folha do consentimento novo (/consentimento)

   ⚠️ ERAM QUATRO CARTÕES DE TEXTO CORRIDO, e o passo parecia um contrato
   (pedido do dono, 26/09/2026). Agora é uma lista curta, com um ícone
   por assunto: onde fica, para que serve, o que sai e o controle. O
   inteiro continua na Política e na tela de Privacidade — o aviso é o
   que cabe numa tela de aceite, e não o documento.

   ⚠️ UMA LISTA SÓ PARA AS DUAS TELAS. Quem se cadastra hoje e quem aceita
   a versão nova leem o mesmo aviso; duas cópias divergiriam na primeira
   vez que alguém mexesse numa.
   ============================================================ */
export function ListaDoAviso() {
  const { c } = useTheme();
  return (
    <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingVertical: 6 }}>
      {AVISO().map((a, i) => (
        <Row key={a.titulo} gap={14} style={{
          alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 12,
          borderTopWidth: i ? 1 : 0, borderTopColor: c.line2,
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg3,
            alignItems: 'center', justifyContent: 'center', marginTop: 1,
          }}>
            <Icon name={a.ic} size={17} color={c.accent} sw={1.9} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Txt v="bodyMed">{a.titulo}</Txt>
            <Txt v="caption" c={c.tx2} style={{ lineHeight: 20 }}>{a.texto}</Txt>
          </View>
        </Row>
      ))}
    </View>
  );
}

/* ⚠️⚠️ A FRASE É O QUE FAZ DO "CONTINUAR" UM ACEITE. Consentimento para
   dado de saúde precisa ser um ato claro (LGPD, art. 11, I), e um botão
   que só diz "Continuar" seria alguém concordando sem saber que
   concordou. A frase fica colada no botão e nomeia o botão pelo mesmo
   rótulo, nos seis idiomas — por isso ela é três pedaços, com os dois
   documentos no meio, e não uma frase com os links costurados.

   Os documentos só viram link com a identificação da empresa completa
   (`temIdentificacao`); sem ela, o nome fica, sem toque. */
export function FraseDoAceite() {
  const { c } = useTheme();
  const router = useRouter();
  const K = T.aviso;
  const link = temIdentificacao();
  const doc = (nome: string, rota: string) => (
    <Txt v="caption" c={link ? c.accent : c.tx2} onPress={link ? () => router.push(rota as any) : undefined}>
      {nome}
    </Txt>
  );
  return (
    <Txt v="caption" c={c.tx2} style={{ lineHeight: 20, textAlign: 'center' }}>
      {K.aceiteAntes}
      {doc(K.termosDeUso, TERMOS)}
      {K.aceiteEntre}
      {doc(K.politicaDePrivacidade, POLITICA)}
      {K.aceiteDepois}
    </Txt>
  );
}
