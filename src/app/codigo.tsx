import React from 'react';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { normalizarConvite } from '../logic/assinatura';
import { SheetScreen, Txt } from '../ui/kit';
import { Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';

/* ============================================================
   O CÓDIGO DE CONVITE — a folha

   ⚠️ ELE JÁ FOI UM CAMPO DENTRO DA BARRA DE PLANOS, e o problema não era
   o campo: era onde ele abria. A barra é a área de decisão, ancorada no
   pé da tela, e o teclado sobe exatamente por cima dela — a pessoa
   digitava com o botão de assinar encostado no dedo e o preço sumindo
   atrás do teclado. Duas ações do mesmo tamanho no mesmo lugar.

   Numa folha, o código tem a tela inteira por um instante: o teclado
   empurra a folha em vez de cobrir o que importa, e fechar devolve a
   pessoa exatamente onde ela estava.

   ⚠️ E ELA NÃO EXPLICA A PARCERIA. Quem chega aqui já tem o código na
   mão; a explicação do que o vínculo muda mora em /parceiros, que é para
   quem ainda não tem. Uma folha que ensina antes de deixar digitar é a
   mesma fricção que tirar o campo do lugar.
   ============================================================ */

export default function Codigo() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();

  const guardado = ((S.profile as any).convite as string) || '';
  const [codigo, setCodigo] = React.useState(guardado);
  const vale = normalizarConvite(codigo).length >= 4;

  /* A normalização é a de assinatura.ts, e não uma cópia: "abc123 " e
     "ABC123" precisam virar o mesmo convite nas três telas que o pedem. */
  const guardar = () => {
    update((st: any) => { st.profile.convite = normalizarConvite(codigo); });
    router.back();
  };

  return (
    <SheetScreen
      titulo="Código de convite"
      sub="É o código que a clínica parceira te passou."
      onClose={() => router.back()}
      rodape={<Botao label="Guardar código" onPress={guardar} desligado={!vale} />}
    >
      <TextInput
        value={codigo}
        onChangeText={(v) => setCodigo(v.toUpperCase())}
        placeholder="Digite o código"
        placeholderTextColor={c.tx4}
        autoFocus
        autoCapitalize="characters"
        autoCorrect={false}
        style={[ty.h2, {
          color: c.tx, backgroundColor: c.bg1,
          borderWidth: 1, borderColor: c.line,
          borderRadius: radius.lg, paddingHorizontal: 18, paddingVertical: 16,
          letterSpacing: 2,
        }]}
      />

      {/* ⚠️ A FOLHA DIZ O QUE ACONTECE DEPOIS DE GUARDAR, porque guardar
          não conecta nada: quem transforma código em vínculo é um
          servidor que ainda não existe. Sem esta linha, fechar a folha
          depois de digitar parece ter dado certo — e a pessoa fica
          esperando a equipe aparecer. */}
      <Txt v="caption" c={c.tx3} style={{ lineHeight: 20 }}>
        O código fica guardado com você. A conferência acontece depois, com a clínica — e é
        ela que libera as mensagens, o envio do resumo e a agenda.
      </Txt>

      <View />
    </SheetScreen>
  );
}
