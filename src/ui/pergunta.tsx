import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt, Rolagem } from './kit';
import { Icon } from './Icon';
import { Lavagem } from './lavagem';
import { useTheme } from './useTheme';

/* ============================================================
   A TELA DE UMA PERGUNTA — o desenho do cadastro, fora dele

   Cada passo do cadastro é a tela inteira: a lavagem azul no alto, a
   seta nua, a pergunta em peso, uma frase de apoio, a resposta escrita na
   própria tela, e um botão no pé que sobe junto com o teclado. É o
   desenho que a pessoa acabou de atravessar pergunta por pergunta.

   A conta vem logo depois dele — é a saída dos planos —, e perguntava o
   e-mail e o código numa tela interna: título fino, seta num quadrado,
   campo com moldura. Era outro aplicativo no meio do mesmo corredor, e o
   dono pediu o e-mail "igual à tela do nome" (26/09/2026). Esta peça é o
   mesmo desenho para quem pergunta fora do cadastro.

   ⚠️ O CADASTRO TEM O DELE, e não usa este. O dele carrega o fio de
   progresso, o modo de edição e as telas de desenho próprio (saúde,
   consentimento), e trocar tudo de uma vez é outra mudança. Os números
   daqui são os de lá: se um mudar, o outro muda junto.
   ============================================================ */
export function TelaDePergunta({ titulo, lead, onVoltar, rodape, children }: {
  titulo: string;
  lead?: string;
  onVoltar: () => void;
  /* o botão do pé — ele sobe com o teclado. Sem ele, não há pé: o código
     da conta se confere sozinho, e um botão que só repetiria o que já
     aconteceu é um botão a mais. */
  rodape?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();

  /* ⚠️ COM O TECLADO ABERTO, O PÉ PERDE A MARGEM DA BARRA DE GESTOS: o
     teclado já ocupa aquele espaço, e somar os dois deixava o botão
     boiando acima dele. `willShow` no iOS porque ele avisa antes da
     animação, e o botão sobe junto com o teclado em vez de dar um pulo no
     fim. É o mesmo trecho do cadastro. */
  const [teclado, setTeclado] = useState(false);
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const abre = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () => setTeclado(true));
    const fecha = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setTeclado(false));
    return () => { abre.remove(); fecha.remove(); };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Lavagem altura={insets.top + 280} />

      {/* A SETA NUA, como no cadastro: voltar é o gesto mais barato da
          tela, e moldura em volta dele dava peso de ação principal. */}
      <View style={{ paddingHorizontal: 16, paddingTop: insets.top + 12 }}>
        <Pressable
          onPress={onVoltar}
          hitSlop={14}
          style={({ pressed }) => [{ alignSelf: 'flex-start', opacity: pressed ? 0.5 : 1 }]}
        >
          <Icon name="back" size={26} color={c.tx} sw={2} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Rolagem
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 26, paddingBottom: rodape ? 24 : insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Txt v="h1">{titulo}</Txt>
          {lead ? (
            <Txt v="note" c={c.tx2} style={{ marginTop: 10, marginBottom: 28 }}>{lead}</Txt>
          ) : <View style={{ height: 28 }} />}
          {children}
        </Rolagem>

        {/* O PÉ É OPACO: sem fundo, o que rola passava por baixo do botão e
            aparecia cortado atrás de uma pílula translúcida. */}
        {rodape ? (
          <View style={{
            paddingHorizontal: 20, paddingTop: 12,
            paddingBottom: teclado ? 24 : insets.bottom + 20,
            backgroundColor: c.bg,
          }}>
            {rodape}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}
