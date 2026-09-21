import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { MEDS } from '../logic/meds';
import { FORMAS, concordar, formaDe, faixaDaMolecula } from '../logic/formas';
import { nf } from '../logic/time';
import { SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Regua, Botao } from '../ui/internas';

/* ⚠️⚠️ A FAIXA DA PERGUNTA DE VALIDADE É ESCOLHA MINHA, e está no
   PENDENCIAS junto com os limiares de platô.

   Sete dias porque nada desta classe se guarda aberto por menos de uma
   semana; noventa porque nada se guarda por mais de três meses. Não
   consegui derivar isso de nada: os prazos que o catálogo conhece — 14,
   21, 30 e 56 — são de produto industrializado, e um manipulado não
   herda nenhum deles.

   O ponto de partida da régua é o meio da faixa, e é só isso: o lugar
   onde o controle abre. Não é recomendação, e a régua só aparece depois
   de a pessoa dizer que TEM a informação. */
const VALIDADE_MIN = 7;
const VALIDADE_MAX = 90;
const VALIDADE_MEIO = Math.round((VALIDADE_MIN + VALIDADE_MAX) / 2);

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
  const [dose, setDose] = useState<number>(S.profile.dose);
  /* null é "não sabemos", e é o estado INICIAL. Nada se grava sem um
     toque — deixar um número pré-escolhido num campo destes é exatamente
     inventar o dado que a pergunta existe para não inventar. */
  const [validade, setValidade] = useState<number | null>(null);
  const catalogo = MEDS[med] ?? MEDS.mounjaro;
  const porCaneta = (S as any).pen?.dosesPerPen ?? 4;

  const vocab = FORMAS()[formaDe(S)];
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
      /* A validade vai junto com o recipiente, e não no perfil: cada
         frasco que chega da farmácia tem o prazo dele. Sem resposta, o
         campo some do objeto e quem lê cai no catálogo — ou em nada, e aí
         cala. */
      s.pen = { dosesLeft: porCaneta, dosesPerPen: porCaneta, validadeDias: validade ?? undefined };
    });
    router.back();
  };

  return (
    <SheetScreen
      titulo={`${concordar(formaDe(S), 'Novo', 'Nova')} ${vocab.recipiente}`}
      sub="Zera a contagem de doses."
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        <Campo rotulo="Medicamento">
          <Opcoes>
            {ATALHOS.map((k) => (
              <Opc key={k} label={MEDS[k].label} on={med === k} onPress={() => trocarMed(k)} />
            ))}
            <Opc
              label="Outro"
              on={!ATALHOS.includes(med)}
              onPress={() => { router.back(); router.push('/perfil' as any); }}
            />
          </Opcoes>
        </Campo>

        <Campo
          rotulo="Concentração e doses"
          /* ⚠️ A FRASE DA VALIDADE SÓ SAI QUANDO ELA EXISTE. Com o
             catálogo em zero, isto escrevia "validade de 0 dias após
             aberta" — o aplicativo dizendo que a coisa vence no dia em
             que foi aberta. */
          ajuda={`${porCaneta} doses por ${vocab.recipiente}${catalogo.shelf > 0 ? ` · validade de ${catalogo.shelf} dias após aberta` : ''}`}
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
                  label={`${nf(d, d % 1 ? 1 : 0)} ${catalogo.unit}`}
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

        {/* ⚠️ A PERGUNTA É OPCIONAL, E COMEÇA EM "NÃO SEI".

            Quem recebe um manipulado nem sempre tem o rótulo à mão na
            hora de registrar, e travar o registro nisso seria cobrar um
            dado para deixar a pessoa guardar outro. Sem resposta, o
            aplicativo simplesmente não fala de vencimento para ela — que
            é melhor do que mandar descartar o que está bom ou autorizar o
            que não está.

            A régua só aparece depois do toque em "está no rótulo": assim
            nenhum número chega à tela antes de alguém pedir por ele. */}
        {perguntaValidade ? (
          <Campo
            rotulo="Validade depois de aberto"
            ajuda="Quem prepara define este prazo, e ele costuma vir no rótulo. Sem ele, não falamos de vencimento — preferimos calar a chutar uma data."
          >
            <Opcoes>
              <Opc
                label="Não sei"
                on={validade == null}
                onPress={() => setValidade(null)}
              />
              <Opc
                label="Está no rótulo"
                on={validade != null}
                onPress={() => setValidade((v) => v ?? VALIDADE_MEIO)}
              />
            </Opcoes>
            {validade != null ? (
              <Regua
                min={VALIDADE_MIN} max={VALIDADE_MAX} passo={1} tracoCada={7} casas={0}
                esp={7} salto={1}
                valor={validade} unidade="dias" onEscolhe={setValidade}
              />
            ) : null}
          </Campo>
        ) : null}

        <Botao
          label={`Registrar ${concordar(formaDe(S), 'novo', 'nova')} ${vocab.recipiente}`}
          onPress={registrar}
        />
      </View>
    </SheetScreen>
  );
}
