import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { MEDS, cabeDe } from '../logic/meds';
import { FORMAS, concordar, formaDe, faixaDaMolecula, meioDaFaixa, noNa, oA } from '../logic/formas';
import { doseTxt, now, maiuscula } from '../logic/time';
import { dosesPorRecipiente, mgDoCatalogo } from '../logic/derive';
import { SheetScreen, Txt } from '../ui/kit';
import { useTheme } from '../ui/useTheme';
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
  const { c } = useTheme();
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
  /* ============================================================
     QUANTO CABE NESTE RECIPIENTE (02/10/2026, parte B3 de
     docs/superpowers/specs/2026-10-01-oral-e-diario-design.md)

     ⚠️⚠️ ERA "4 DOSES POR …" PARA TODO REMÉDIO, escrito na ajuda e gravado
     no recipiente. Agora vem do catálogo (`cabe`, em logic/meds), pelo
     remédio e pela dose escolhidos AQUI — não pelos do perfil, que esta
     folha pode trocar:

     · caneta de dose ajustável (Saxenda, Victoza): 18 mg, e as doses são
       a conta com a dose do chip — a ajuda muda quando o chip muda;
     · caixa de comprimidos: a folha PERGUNTA quantos vêm, com o número já
       marcado — 30, ou o da última caixa do mesmo remédio. É a decisão do
       dono: padrão 30, confirmado ao abrir uma caixa nova. E sem pergunta
       de validade, como já era (ver `perguntaValidade`);
     · caneta de dose fixa: como sempre foi. */
  const cabe = cabeDe(med);
  const [comprimidos, setComprimidos] = useState<number>(() => dosesPorRecipiente(S, med, dose));
  const porCaneta = cabe.em === 'comprimidos' ? comprimidos : dosesPorRecipiente(S, med, dose);
  /* ⚠️ A CAIXA QUE JÁ ESTAVA EM USO (02/10/2026, achado da revisão da
     parte B3). Cuidado, Doses e a tela do medicamento pedem "Registre a
     caixa, e contamos as doses que restam" — e esta folha, o único
     caminho, contava toda caixa como cheia. Quem já tomava Rybelsus antes
     do aplicativo, com dez comprimidos na mão, lia "30 de 30" e ficava sem
     aviso nenhum quando acabasse. A caneta tem essa pergunta na folha da
     dose; a caixa a tem aqui. Começa em "nova", que é o que o título diz e
     o que esta folha sempre registrou. */
  const [estadoDaCaixa, setEstadoDaCaixa] = useState<'nova' | 'emUso'>('nova');
  const [jaSairam, setJaSairam] = useState<number>(1);
  const usadasAntes = cabe.em === 'comprimidos' && estadoDaCaixa === 'emUso' && comprimidos > 1
    ? Math.min(Math.max(1, jaSairam), comprimidos - 1)
    : 0;

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
  const deste = concordar(formaDe(S), T.tratamento.telaCaneta.desteM, T.tratamento.telaCaneta.desteF);
  /* as frases da pergunta "já estava em uso" são as da folha da dose */
  const KA = T.tratamento.telaRegistrarAplicacao;
  /* A pergunta existe quando o catálogo NÃO SABE o prazo — `shelf: 0` —, e
     só para quem injeta: cartela de comprimido não vence depois de aberta
     do jeito que um frasco vence. Ver o bloco de `shelf` em logic/meds. */
  const perguntaValidade = vocab.injetavel && catalogo.shelf === 0;
  /* ⚠️ OS ATALHOS SÃO CANETAS, e quem abre uma cartela não troca de via
     aqui (01/10/2026): numa folha chamada "Nova cartela", tocar em
     Mounjaro faria do comprimido uma caneta. Para quem não injeta, o
     atalho é o remédio dela, e qualquer outro passa pelo perfil ("Outro"). */
  const atalhos = vocab.injetavel ? ATALHOS : [S.profile.med];
  /* Sem escada de bula, a dose é livre e a faixa vem da molécula na mesma
     via — ver logic/formas. */
  const faixa = catalogo.doses.length ? null : faixaDaMolecula(catalogo.mol, formaDe(S));
  /* A ajuda das doses segue o jeito de contar — ver o campo, abaixo. */
  const quantasCabem = cabe.em === 'comprimidos'
    ? ''
    : cabe.em === 'mg'
      ? (dose > 0 ? K().ajudaMg(doseTxt(cabe.mg), catalogo.unit, vocab.recipiente, porCaneta, doseTxt(dose)) : '')
      : K().ajudaDoses(porCaneta, vocab.recipiente);
  const ajudaDasDoses = quantasCabem
    ? quantasCabem + (catalogo.shelf > 0 ? K().ajudaValidade(catalogo.shelf, aberto) : '')
    : undefined;

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
        /* a caneta de dose ajustável leva os miligramas (02/10/2026) */
        ...mgDoCatalogo(med),
        /* e a caixa, os comprimidos confirmados — e os que já tinham saído
           dela, quando já estava em uso (ver `comprimidos` e `usadasAntes`
           em logic/derive) */
        ...(cabe.em === 'comprimidos' ? { comprimidos } : {}),
        ...(usadasAntes > 0 ? { usadasAntes } : {}),
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
            {atalhos.map((k) => (
              <Opc key={k} label={MEDS[k].label} on={med === k} onPress={() => trocarMed(k)} />
            ))}
            <Opc
              label={K().outro}
              on={!atalhos.includes(med)}
              onPress={() => { router.back(); router.push('/perfil' as any); }}
            />
          </Opcoes>
        </Campo>

        <Campo
          rotulo={K().concentracaoEDoses}
          /* ⚠️ A FRASE DA VALIDADE SÓ SAI QUANDO ELA EXISTE. Com o
             catálogo em zero, isto escrevia "validade de 0 dias após
             aberta" — o aplicativo dizendo que a coisa vence no dia em
             que foi aberta.

             ⚠️ E A DAS DOSES SEGUE O JEITO DE CONTAR (02/10/2026): na
             caneta de dose ajustável, os miligramas e a conta na dose do
             chip (sem dose escolhida, nada — a conta não chuta um
             degrau); na caixa de comprimidos, nada aqui, porque a pergunta
             logo abaixo é ela. */
          ajuda={ajudaDasDoses}
        >
          {/* ⚠️ SEM ESCADA, A RÉGUA — e sem isto a seção ficava VAZIA para
              manipulado: rótulo, linha de ajuda e nada embaixo. É a mesma
              regra da folha de registrar e do passo do cadastro: com
              degraus de bula, chips; sem eles, o número é livre e quem o
              define é a receita. */}
          {catalogo.doses.length ? (
            <Opcoes>
              {/* ⚠️ A ESCADA INTEIRA (01/10/2026). Era `slice(0, 4)`, e quem
                  abria uma caneta de Mounjaro 12,5 ou 15 mg, Wegovy 2,4 ou
                  Saxenda 3 mg não achava a própria dose. É o que a folha de
                  registrar já mostra; os chips quebram linha. */}
              {catalogo.doses.map((d) => (
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

        {/* ⚠️ QUANTOS COMPRIMIDOS VÊM NA CAIXA (02/10/2026, decisão do
            dono). O número já vem marcado — 30, ou o da última caixa do
            mesmo remédio —, e registrar com ele à vista é a confirmação; a
            régua existe para quem compra outra embalagem. É com ele que o
            estoque conta os dias que a caixa cobre. */}
        {cabe.em === 'comprimidos' ? (
          <Campo rotulo={K().quantosComprimidos(noNa(formaDe(S)))} ajuda={K().comprimidosAjuda}>
            <Regua
              min={1} max={120} passo={1} tracoCada={1} casas={0}
              salto={1}
              valor={comprimidos} unidade={K().comprimidos} onEscolhe={(v) => setComprimidos(Math.round(v))}
            />
          </Campo>
        ) : null}

        {/* Nova, ou já em uso — e então quantas já tinham saído, de uma
            até a penúltima (com todas fora, não haveria o que registrar).
            A régua abre na primeira, que fica à vista como resposta. */}
        {cabe.em === 'comprimidos' && comprimidos > 1 ? (
          <Campo
            rotulo={maiuscula(vocab.recipiente)}
            ajuda={estadoDaCaixa === 'emUso'
              ? (comprimidos - usadasAntes <= 1 ? KA.ultimaDose(deste, vocab.recipiente) : KA.restamDoses(comprimidos - usadasAntes))
              : undefined}
          >
            <Opcoes>
              <Opc
                label={concordar(formaDe(S), T.tratamento.telaCaneta.novoM, T.tratamento.telaCaneta.novoF)}
                on={estadoDaCaixa === 'nova'}
                onPress={() => setEstadoDaCaixa('nova')}
              />
              <Opc label={KA.jaEmUso} on={estadoDaCaixa === 'emUso'} onPress={() => setEstadoDaCaixa('emUso')} />
            </Opcoes>
            {estadoDaCaixa === 'emUso' ? (
              <>
                <Txt v="caption" c={c.tx2}>{KA.quantasJaSairam(deste, vocab.recipiente)}</Txt>
                <Regua
                  min={1} max={comprimidos - 1} passo={1} tracoCada={1} casas={0}
                  esp={14} salto={1}
                  valor={usadasAntes || 1} unidade={KA.dosesUnidade(usadasAntes || 1)}
                  onEscolhe={(v) => setJaSairam(Math.min(comprimidos - 1, Math.max(1, Math.round(v))))}
                />
              </>
            ) : null}
          </Campo>
        ) : null}

        {/* Opcional, e começa em "não sei" — ver ui/recipiente. */}
        {perguntaValidade ? (
          <PerguntaDaValidade aberto={aberto} valor={validade} onMuda={setValidade} />
        ) : null}

        {/* ⚠️ SEM MEDICAMENTO OU SEM DOSE, NÃO HÁ RECIPIENTE. O botão
            registrava "Ainda não definido · 0 mg" — uma caneta de nada, que
            a conta de doses passaria a tratar como de verdade. */}
        <Botao
          label={usadasAntes > 0 ? K().registrarRecipiente(`${oA(formaDe(S))} ${vocab.recipiente}`) : K().registrar(novo)}
          onPress={registrar}
          desligado={med === 'indefinido' || !(dose > 0) || !(porCaneta > 0)}
        />
      </View>
    </SheetScreen>
  );
}
