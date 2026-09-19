import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useStore } from '../logic/store';
import { clinicaConectada } from '../logic/derive';
import { Txt } from '../ui/kit';
import { TelaInterna, Titulao, Cartao, Linha, Aviso, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { dataComAno } from '../logic/time';

/* ============================================================
   UMA PRESCRIÇÃO

   ⚠️⚠️ ESTA TELA NÃO É UMA RECEITA, E DIZ ISSO NA CARA.

   O pedido que a criou foi "poder usar na farmácia". Não dá, e fingir que
   dá seria o erro mais grave que este aplicativo poderia cometer: receita
   é documento assinado por quem prescreve, com validade e número, e o que
   existe aqui é o REGISTRO de uma — medicamento, dose, cadência, quem
   prescreveu e quando. Desenhar isso com cara de documento faria alguém
   chegar ao balcão com um print que não vale nada, e num tratamento com
   medicamento tarjado isso não é um contratempo, é uma viagem perdida no
   dia em que a caneta acabou.

   Então a tela mostra o que ela tem, chamando pelo nome, e resolve o
   problema de verdade pela única porta que existe: pedir a receita à
   clínica. O pedido já existia em /conversa, e agora tem entrada aqui,
   que é onde a pessoa percebe que precisa dele.

   ⚠️ E SE A CLÍNICA MANDAR O ARQUIVO, ELE APARECE. `documents` guarda o
   que veio de lá; no dia em que houver uma receita entre eles, a linha
   dela entra aqui e passa a ser o que se leva. Enquanto não houver, a
   tela não promete arquivo nenhum.
   ============================================================ */

export default function Prescricao() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const { t } = useLocalSearchParams<{ t?: string }>();

  const p = ((S.prescriptions ?? []) as any[]).find((x) => String(x.t) === String(t));
  const conectada = clinicaConectada(S);

  /* A receita de verdade, se a clínica já tiver mandado alguma. */
  const arquivo = ((S.documents ?? []) as any[]).find((d) => /receita/i.test(d.kind));

  if (!p) {
    return (
      <TelaInterna titulo="Prescrição" tituloFixo>
        <Txt v="note" c={c.tx3} style={{ lineHeight: 23 }}>
          Esta prescrição não está mais no seu registro.
        </Txt>
      </TelaInterna>
    );
  }

  return (
    <TelaInterna
      titulo={p.name}
      rodape={conectada
        ? <Botao label="Pedir a receita à equipe" onPress={() => router.push('/conversa?pedir=receita' as any)} />
        : undefined}
    >
      <Titulao titulo={p.name} lead={p.detail} />

      <Cartao>
        <Linha ic="steth" titulo="Quem prescreveu" sub={p.by} seta={false} />
        <Linha ic="cal" titulo="Prescrita em" sub={dataComAno(p.t)} seta={false} />
        {arquivo ? (
          <Linha
            ic="doc"
            titulo={arquivo.name}
            sub="Documento enviado pela clínica"
            onPress={() => router.push('/exames' as any)}
          />
        ) : null}
      </Cartao>

      {/* ⚠️ O AVISO NÃO É RODAPÉ LEGAL, É A INFORMAÇÃO PRINCIPAL DA TELA.
          Quem abre uma prescrição às vésperas de comprar precisa saber, na
          primeira leitura, que o que está na mão não serve no balcão — e
          precisa saber antes de sair de casa, não depois. */}
      <Aviso
        ic="alerta"
        titulo="Isto é o seu registro, não a receita"
        texto={conectada
          ? 'A receita é o documento que a clínica emite, com assinatura e validade — é ele que a farmácia aceita. Este registro serve para você acompanhar o que está em uso; se a sua receita venceu, dá para pedir uma nova aqui embaixo.'
          : 'A receita é o documento que quem prescreve emite, com assinatura e validade — é ele que a farmácia aceita. Este registro serve para você acompanhar o que está em uso.'}
      />
    </TelaInterna>
  );
}
