import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { MEDS } from '../logic/meds';
import { FORMAS, concordar, formaDe, faixaDaMolecula, meioDaFaixa } from '../logic/formas';
import { doseTxt, now } from '../logic/time';
import { dosesPorRecipiente } from '../logic/derive';
import { SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Regua, Botao } from '../ui/internas';
import { PerguntaDaValidade } from '../ui/recipiente';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaRecipienteNovo;

/* ============================================================
   NOVA CANETA

   Abrir uma caneta zera a contagem de doses, e é por isso que isto é um
   registro explícito e não um efeito colateral da quarta aplicação: a
   pessoa pode abrir antes de terminar a anterior, pode trocar de dose no
   meio, pode receber uma caneta de concentração diferente da receita.

   O sub do sheet diz o efeito em quatro palavras — "zera a contagem de
   doses" — porque é o que ela precisa saber antes de confirmar.
   ============================================================ */

/* As quatro primeiras do catálogo cobrem o que aparece na prática; "Outro"
   leva ao perfil, onde a lista inteira mora. */
const ATALHOS = ['mounjaro', 'ozempic', 'saxenda'];

export default function CanetaNova() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  const [med, setMed] = useState<string>(S.profile.med);
  /* Sem dose no perfil — "ainda não sei", no cadastro —, a régua abre no
     meio da faixa e a escada não traz degrau escolhido; o botão espera. */
  const [dose, setDose] = useState<number>(S.profile.dose || meioDaFaixa(S.profile.med) || 0);
  /* null é "não sabemos", e é o estado INICIAL. Nada se grava sem um
     toque — deixar um número pré-escolhido num campo destes é exatamente
     inventar o dado que a pergunta existe para não inventar. */
  const [validade, setValidade] = useState<number | null>(null);
  const catalogo = MEDS[med] ?? MEDS.mounjaro;
  const porCaneta = dosesPorRecipiente(S);

  const vocab = FORMAS()[formaDe(S)];
  /* ⚠️ AS DUAS GRAFIAS VÊM DO CATÁLOGO, e estavam escritas aqui em
     português — `concordar(forma, 'Novo', 'Nova')`. Em alemão aquilo
     devolvia "Novo" ou "Nova", que é português dos dois jeitos. São duas
     formas e não uma porque o título pede o nominativo com maiúscula e o
     botão pede a forma que cabe no meio da frase — em alemão, o
     acusativo. */
  const Novo = `${concordar(formaDe(S), K().novoM, K().novoF)} ${vocab.recipiente}`;
  const novo = `${concordar(formaDe(S), K().novoMinM, K().novoMinF)} ${vocab.recipiente}`;
  /* "aberta" concordava com "caneta" e ficava em português para as
     outras formas e para os outros idiomas. O par mora na tela de
     Medicamento, que já o usava. */
  const aberto = concordar(formaDe(S), T.tratamento.telaCaneta.abertoM, T.tratamento.telaCaneta.abertoF);
  /* A pergunta existe quando o catálogo NÃO SABE o prazo — `shelf: 0` —, e
     só para quem injeta: cartela de comprimido não vence depois de aberta
     do jeito que um frasco vence. Ver o bloco de `shelf` em logic/meds. */
  const perguntaValidade = vocab.injetavel && catalogo.shelf === 0;
  /* Sem escada de bula, a dose é livre e a faixa vem da molécula na mesma
     via — ver logic/formas. */
  const faixa = catalogo.doses.length ? null : faixaDaMolecula(catalogo.mol, formaDe(S));

  const trocarMed = (k: string) => {
    setMed(k);
    /* Dose de outro medicamento quase nunca existe no catálogo do novo —
       cair na primeira da escada evita salvar uma dose impossível. */
    const doses = MEDS[k].doses;
    if (!doses.includes(dose)) setDose(doses[Math.min(1, doses.length - 1)]);
  };

  const registrar = () => {
    update((s: any) => {
      s.profile.med = med;
      s.profile.dose = dose;
      /* ⚠️ ESTA LINHA É O HISTÓRICO DE CANETAS. Ela zerava um contador, e
         a resposta — que recipiente, com que concentração, aberto quando —
         ia para o lixo; a tela de canetas então ADIVINHAVA o passado
         fatiando aplicações, e errava. Ver a nota em logic/derive.

         A validade vai junto com o recipiente, e não no perfil: cada
         frasco que chega da farmácia tem o prazo dele. Sem resposta, o
         campo some do objeto e quem lê cai no catálogo — ou em nada, e aí
         cala. */
      s.pens = [...(s.pens ?? []), {
        t: +now(),
        med,
        dose,
        dosesPerPen: porCaneta,
        validadeDias: validade ?? undefined,
      }];
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo={Novo}
      sub={K().zeraContagem}
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo={T.tratamento.telaAplicacoes.medicamento}>
          <Opcoes>
            {ATALHOS.map((k) => (
              <Opc key={k} label={MEDS[k].label} on={med === k} onPress={() => trocarMed(k)} />
            ))}
            <Opc
              label={K().outro}
              on={!ATALHOS.includes(med)}
              onPress={() => { router.back(); router.push('/perfil' as any); }}
            />
          </Opcoes>
        </Campo>

        <Campo
          rotulo={K().concentracaoEDoses}
          /* ⚠️ A FRASE DA VALIDADE SÓ SAI QUANDO ELA EXISTE. Com o
             catálogo em zero, isto escrevia "validade de 0 dias após
             aberta" — o aplicativo dizendo que a coisa vence no dia em
             que foi aberta. */
          ajuda={K().ajudaDoses(porCaneta, vocab.recipiente)
            + (catalogo.shelf > 0 ? K().ajudaValidade(catalogo.shelf, aberto) : '')}
        >
          {/* ⚠️ SEM ESCADA, A RÉGUA — e sem isto a seção ficava VAZIA para
              manipulado: rótulo, linha de ajuda e nada embaixo. É a mesma
              regra da folha de registrar e do passo do cadastro: com
              degraus de bula, chips; sem eles, o número é livre e quem o
              define é a receita. */}
          {catalogo.doses.length ? (
            <Opcoes>
              {catalogo.doses.slice(0, 4).map((d) => (
                <Opc
                  key={d}
                  label={`${doseTxt(d)} ${catalogo.unit}`}
                  on={dose === d}
                  onPress={() => setDose(d)}
                />
              ))}
            </Opcoes>
          ) : faixa ? (
            <Regua
              min={faixa.min} max={faixa.max} passo={0.05} tracoCada={0.5} casas={2}
              esp={7} salto={0.05}
              valor={dose || faixa.min} unidade={catalogo.unit} onEscolhe={setDose}
            />
          ) : null}
        </Campo>

        {/* Opcional, e começa em "não sei" — ver ui/recipiente. */}
        {perguntaValidade ? (
          <PerguntaDaValidade aberto={aberto} valor={validade} onMuda={setValidade} />
        ) : null}

        {/* ⚠️ SEM MEDICAMENTO OU SEM DOSE, NÃO HÁ RECIPIENTE. O botão
            registrava "Ainda não definido · 0 mg" — uma caneta de nada, que
            a conta de doses passaria a tratar como de verdade. */}
        <Botao
          label={K().registrar(novo)}
          onPress={registrar}
          desligado={med === 'indefinido' || !(dose > 0)}
        />
      </View>
    </SheetScreen>
  );
}
