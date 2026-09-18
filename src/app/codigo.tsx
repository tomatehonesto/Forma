import React from 'react';
import { TextInput, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { normalizarConvite } from '../logic/assinatura';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { SheetScreen, Txt, Row } from '../ui/kit';
import { Botao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { usePaletaDeVenda } from '../ui/paletaVenda';
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
   mesma fricção que tirar o campo do lugar. O que existe é uma saída no
   pé, para quem descobriu aqui dentro que não tem código nenhum — e ela
   leva ao nome da tela que abre, não a uma promessa.
   ============================================================ */

export default function Codigo() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  /* ⚠️ A FOLHA VESTE A TELA QUE A ABRIU, e é por isso que o parâmetro
     existe. Do paywall ela sobe por cima de uma tela escura e precisa ser
     escura; do Perfil ela abre dentro do aplicativo e precisa obedecer ao
     tema que a pessoa escolheu no telefone. Sem isto era sempre a segunda
     — uma folha branca deslizando sobre preto, que parece troca de app.

     Os dois ganchos são chamados sempre: escolher qual vale é depois. */
  const { venda } = useLocalSearchParams<{ venda?: string }>();
  const daVenda = usePaletaDeVenda();
  const { c: doTema } = useTheme();
  const c = venda === '1' ? daVenda : doTema;

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
      sub="É o código que a clínica parceira te passou."
      onClose={() => router.back()}
      paleta={venda === '1' ? daVenda : undefined}
      rodape={<Botao label="Guardar código" onPress={guardar} desligado={!vale} paleta={venda === '1' ? daVenda : undefined} />}
    >
      <TextInput
        value={codigo}
        onChangeText={(v) => setCodigo(v.toUpperCase())}
        placeholder="Digite o código"
        placeholderTextColor={c.tx4}
        autoFocus
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        /* Um convite não é uma senha nem um nome próprio: sem sugestão do
           teclado, sem corretor, e com teto — um campo sem limite aceita
           um parágrafo colado sem avisar que aquilo não é um código. */
        maxLength={24}
        /* outlineStyle é do react-native-web: sem ele o navegador desenha o
           anel de foco dele por cima da borda desenhada aqui. No aparelho
           não existe e não custa nada. */
        style={[ty.h2, { outlineStyle: 'none' } as any, {
          marginTop: 18,
          color: c.tx, backgroundColor: c.bg1,
          borderWidth: 1, borderColor: codigo.length > 0 && vale ? c.accentLine : c.line,
          borderRadius: radius.lg, paddingHorizontal: 18, paddingVertical: 16,
          letterSpacing: 2,
        }]}
      />

      {/* ⚠️ O PISO DE QUATRO É DESTE CAMPO, E A FRASE DIZ ISSO. Ninguém
          aqui sabe como são os códigos da rede — não há servidor que os
          conheça —, então prometer "os códigos têm 4 letras" seria
          inventar uma regra alheia. O que se pode afirmar é o que este
          campo faz, e a diferença entre as duas frases é a diferença
          entre informar e chutar.

          E ela só aparece depois da primeira tecla: nascer com um aviso
          de erro é repreender quem ainda não fez nada. */}
      {codigo.length > 0 && !vale ? (
        <Txt v="micro" c={c.tx4} style={{ marginTop: 8 }}>Digite pelo menos 4 caracteres.</Txt>
      ) : null}

      {/* ⚠️ A FOLHA DIZ O QUE ACONTECE DEPOIS DE GUARDAR, porque guardar
          não conecta nada: quem transforma código em vínculo é um
          servidor que ainda não existe. Sem esta linha, fechar a folha
          depois de digitar parece ter dado certo — e a pessoa fica
          esperando a equipe aparecer. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 14, lineHeight: 20 }}>
        O código fica guardado com você. A conferência acontece depois, com a clínica — e é
        ela que libera as mensagens, o envio do resumo e a agenda.
      </Txt>

      {/* ⚠️ A SAÍDA DE QUEM NÃO TEM CÓDIGO, e ela faltava. Abrir esta folha
          é dizer "tenho um" — mas o paywall não tinha nenhuma porta para
          quem lê "código de convite" e quer saber o que é isso. O único
          caminho era fechar.

          O nome do link é o nome da tela que ele abre. A pergunta acima
          dele é contexto; se um dia o link virar "Conseguir um código",
          ele estará prometendo uma coisa que /parceiros não faz — lá não
          há diretório de médicos, e nem poderia haver. */}
      {TEM_REDE_PARCEIRA ? (
        <Row gap={8} style={{ alignItems: 'center', marginTop: 16 }}>
          <Txt v="micro" c={c.tx4}>Não tem um código?</Txt>
          <Pressable
            onPress={() => router.push('/parceiros' as any)}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Row gap={6} style={{ alignItems: 'center' }}>
              <Txt v="micro" c={c.accent2}>Médicos parceiros</Txt>
              <Icon name="chev" size={12} color={c.accent2} sw={2.2} />
            </Row>
          </Pressable>
        </Row>
      ) : null}
    </SheetScreen>
  );
}
