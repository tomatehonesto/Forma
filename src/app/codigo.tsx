import React from 'react';
import { TextInput } from 'react-native';
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

   ⚠️ E ELA SEGUE O TEMA DO APARELHO, mesmo abrindo por cima do paywall,
   que é escuro à força. Chegou a ser escura junto com ele, e a conta não
   fechou: esta folha também abre pelo Perfil, no meio do aplicativo, e
   ali o escuro seria a folha desobedecendo ao que a pessoa escolheu no
   telefone. Entre uma emenda de cor por um segundo e uma tela que ignora
   a preferência dela, a emenda é o preço mais barato.

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
  const limpo = normalizarConvite(codigo);
  const vale = limpo.length >= 4;

  /* A normalização é a de assinatura.ts, e não uma cópia: "abc123 " e
     "ABC123" precisam virar o mesmo convite nas três telas que o pedem. */
  const guardar = () => {
    update((st: any) => { st.profile.convite = limpo; });
    router.back();
  };

  return (
    <SheetScreen
      titulo="Código de convite"
      sub="O código que a clínica parceira te passou."
      onClose={() => router.back()}
      rodape={<Botao label="Guardar código" onPress={guardar} desligado={!vale} />}
    >
      {/* ⚠️ O CAMPO SÓ VESTE O CORPO GRANDE QUANDO EXISTE O QUE VESTIR, e
          isso não é enfeite: no React Native o texto de exemplo não tem
          estilo próprio, ele herda o do campo. Com o corpo do código —
          grande, seminegrito, com dois pontos de rastro entre as letras —
          um simples "Digite o código" saía espaçado e duro, parecendo já
          um código digitado em vez de um convite para digitar.

          A altura é fixa nos dois estados, senão a folha daria um pulo na
          primeira tecla. */}
      <TextInput
        value={codigo}
        onChangeText={(v) => setCodigo(v.toUpperCase())}
        placeholder="Digite o código"
        placeholderTextColor={c.tx4}
        autoFocus
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        /* Um convite não é senha nem nome próprio: sem sugestão do
           teclado, sem corretor, e com teto — um campo sem limite aceita
           um parágrafo colado sem avisar que aquilo não é um código. */
        maxLength={24}
        /* outlineStyle é do react-native-web: sem ele o navegador desenha
           o anel de foco dele por cima da borda desenhada aqui. No
           aparelho não existe e não custa nada. */
        style={[
          codigo ? ty.h2 : ty.body,
          { outlineStyle: 'none' } as any,
          {
            marginTop: 18, height: 62, letterSpacing: codigo ? 2 : 0,
            color: c.tx, backgroundColor: c.bg1,
            borderWidth: 1, borderColor: vale ? c.accentLine : c.line,
            borderRadius: radius.lg, paddingHorizontal: 18,
          },
        ]}
      />

      {/* ⚠️ O PISO DE QUATRO É DESTE CAMPO, E A FRASE DIZ ISSO. Ninguém
          aqui sabe como são os códigos da rede — não há servidor que os
          conheça —, então prometer "os códigos têm quatro letras" seria
          inventar uma regra alheia. O que se pode afirmar é o que este
          campo faz.

          E ela só aparece depois da primeira tecla: nascer com um aviso
          de erro é repreender quem ainda não fez nada. */}
      {codigo.length > 0 && !vale ? (
        <Txt v="micro" c={c.tx4} style={{ marginTop: 8 }}>Digite pelo menos 4 caracteres.</Txt>
      ) : null}

      {/* ⚠️ A FOLHA DIZ QUE GUARDAR NÃO CONECTA NADA, porque não conecta:
          quem transforma código em vínculo é um servidor que ainda não
          existe. Sem esta linha, fechar a folha depois de digitar parece
          ter dado certo — e a pessoa fica esperando a equipe aparecer.

          A frase anterior começava com "o código fica guardado com você",
          que soava a consolo e não a informação: ninguém digita um
          convite para ficar com ele. O que ela precisa saber é o que
          falta acontecer, e quem faz acontecer. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 14, lineHeight: 20 }}>
        Guardar o código ainda não liga o vínculo. Quem confirma é a clínica — e é a
        confirmação dela que abre as mensagens, o envio do resumo e a agenda.
      </Txt>
    </SheetScreen>
  );
}
