import React from 'react';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { normalizarConvite, vinculoDoConvite } from '../logic/assinatura';
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

   ⚠️ E CONFIRMAR LIGA NA HORA. A folha já disse que a clínica conferia
   depois, e isso punha uma pessoa parada na quinta à noite, com o código
   na mão e o aplicativo trancado, esperando a segunda abrir — para uma
   clínica que não tem nada a conferir, porque foi ela quem entregou o
   código. O porquê inteiro está em assinatura.ts, em `vinculoDoConvite`,
   junto com o buraco que essa decisão abre.
   ============================================================ */

export default function Codigo() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c } = useTheme();

  /* ⚠️ O CAMPO NASCE COM O QUE JÁ EXISTE, e o vínculo é a segunda fonte
     porque a primeira pode estar vazia: quem chegou com o vínculo pronto
     — a semente, e quem vier de uma migração — tem `vinculo.convite` e não
     tem `profile.convite`. Lendo só o primeiro, a folha abria em branco
     para quem tem código, e quem veio TROCAR de clínica não tinha como
     saber qual era o atual. */
  const vinculo = (S.profile as any).vinculo as { convite?: string } | null;
  const guardado = ((S.profile as any).convite as string) || vinculo?.convite || '';
  const [codigo, setCodigo] = React.useState(guardado);
  const limpo = normalizarConvite(codigo);
  const vale = limpo.length >= 4;
  /* ⚠️ O AVISO ESPERA O DEDO SAIR DO CAMPO.

     Ele aparecia na primeira tecla, e quem digita um código de oito
     letras passava pelo "faltam caracteres" quatro vezes antes de chegar
     ao fim — o aplicativo reclamando de alguém que está no meio da
     palavra. Um aviso que nasce enquanto a pessoa ainda escreve não é
     ajuda, é interrupção.

     Fora do foco, a frase vale: ela parou, e o que ela parou não serve. */
  const [focado, setFocado] = React.useState(true);

  /* A normalização é a de assinatura.ts, e não uma cópia: "abc123 " e
     "ABC123" precisam virar o mesmo convite nas três telas que o pedem.

     ⚠️ E FECHAR A FOLHA É A CONFIRMAÇÃO, sem tela de parabéns no meio. A
     pessoa volta para o paywall e ele não pede mais dinheiro — é a
     própria tela que ela veio resolver dizendo que foi resolvida. Um
     aviso de sucesso por cima disso seria contar o que já está à vista. */
  const confirmar = () => {
    update((st: any) => {
      st.profile.convite = limpo;
      st.profile.vinculo = vinculoDoConvite(limpo);
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo="Código de convite"
      sub="O código que a clínica parceira te passou."
      onClose={() => router.back()}
      rodape={<Botao label="Confirmar código" onPress={confirmar} desligado={!vale} />}
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
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
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

          E ela espera o campo perder o foco, além de precisar de algo
          escrito: nascer com um aviso de erro é repreender quem não fez
          nada, e aparecer no meio da digitação é repreender quem está
          fazendo. */}
      {!focado && codigo.length > 0 && !vale ? (
        <Txt v="micro" c={c.tx4} style={{ marginTop: 8 }}>Digite pelo menos 4 caracteres.</Txt>
      ) : null}

      {/* ⚠️ DUAS FRASES, E CADA UMA RESPONDE UM MEDO DIFERENTE.

          A primeira é "vou ter que esperar?", que é a pergunta de quem
          digita um código à noite. A segunda é a regra da casa, e ela
          precisa estar dita AQUI: mudar de clínica, ou entrar numa, é
          exatamente o momento em que um aplicativo se sente autorizado a
          "começar do zero com a equipe". Não começa. Peso, aplicações,
          check-ins, sintomas, exames e fotos são dela, e ela chegou com
          eles.

          Duas frases anteriores morreram nesta linha: "o código fica
          guardado com você", que soava a consolo, e "quem confirma é a
          clínica", que mandava esperar quem não tinha o que esperar. */}
      <Txt v="caption" c={c.tx3} style={{ marginTop: 14, lineHeight: 20 }}>
        O código libera o aplicativo na hora. Nada do que você já registrou muda de lugar.
      </Txt>
    </SheetScreen>
  );
}
