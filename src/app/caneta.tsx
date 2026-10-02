import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { canetaAtual, siteLabel, M, coberturaDoEstoque } from '../logic/derive';
import { FORMAS, formaDe, concordar, oA, iconeDaDose, doseInjetavel } from '../logic/formas';
import { doseTxt, fmtDate, fmtPeriodo, dataComDiaDaSemana, dataLonga, maiuscula } from '../logic/time';
import {
  TelaInterna, Titulao, Bloco, Progresso, Grade2, Metrica, Aviso, Cartao, Linha,
  Sanfona, SanfonaLinha, Botao,
} from '../ui/internas';
import { cabeDe } from '../logic/meds';
import { T } from '../textos';

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.tratamento.telaCaneta;

/* ============================================================
   CANETA E RECEITA

   Duas contagens diferentes moram aqui, e confundi-las é o erro clássico
   deste tipo de tela:

     doses da caneta — quantas aplicações ainda cabem no dispositivo
     validade        — quantos dias a caneta dura depois de aberta

   Uma caneta pode ter dose sobrando e estar vencida. A grade de dois
   coloca as duas lado a lado justamente para que a pessoa leia as duas.

   A terceira contagem é a receita, e ela é a única que exige AÇÃO fora do
   app: pedir renovação leva dias. Por isso ela vira aviso com texto, e não
   mais um número na grade.
   ============================================================ */


export default function Caneta() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const k = canetaAtual(S);
  /* ⚠️ ESTA TELA FALAVA "CANETA" TREZE VEZES, para quem pode estar usando
     um frasco. Ela foi tocada na fase da validade, e "o que se toca, se
     conserta" — deixar o cabeçalho dizendo "Caneta aberta em" na mesma
     tela onde acabei de ensinar o aplicativo a perguntar o prazo de um
     frasco seria incoerência na distância de dois centímetros.

     O resto do aplicativo ainda diz "caneta" em trinta e poucos arquivos.
     Está no PENDENCIAS, e é varredura própria. */
  const forma = formaDe(S);
  const vocab = FORMAS()[forma];
  const aberto = concordar(forma, K().abertoM, K().abertoF);
  /* A caneta registrada já em uso não tem dia de abertura conhecido: a
     data que existe é a do registro, e é ela que se diz — ver
     `recipienteDaDose`, em logic/derive. */
  const registrado = concordar(forma, K().registradoM, K().registradoF);
  const med = M(S);
  const atual = k.atual;

  const usadas = atual?.usadas ?? 0;
  /* ⚠️ O QUE CABE VEM DO ESTOQUE, e era um 4 escrito aqui (02/10/2026,
     parte B3): "Nenhuma cartela aberta · 4 doses por cartela" para quem
     toma Rybelsus. Sem recipiente aberto, é o que cabe num novo — do
     catálogo, ou da última caixa confirmada (`dosesPorRecipiente`). */
  const total = atual?.total ?? k.total;
  const cabe = cabeDe(S.profile.med);
  const dose = atual?.dose ?? S.profile.dose;
  /* em dias ou semanas, arredondado — ver `coberturaDoEstoque` */
  const cobertura = coberturaDoEstoque(S, k);

  /* ⚠️⚠️ VALIDADE E LOCAL SÓ PARA QUEM INJETA (01/10/2026).

     `shelf: 0` quer dizer duas coisas no catálogo, e esta tela só lia
     uma: no manipulado injetável é "não sabemos" — quem prepara define —,
     e no comprimido é "não se aplica" (ver o bloco de `shelf` em
     logic/meds). Quem toma Rybelsus via "Validade após aberta: não
     informada · quem prepara define o prazo", uma pergunta sem sentido
     para uma cartela. É a mesma guarda que /caneta-nova já usa.

     O local é por DOSE, e não pela forma de agora: quem trocou de caneta
     para comprimido continua vendo onde aplicou as doses da caneta. */
  const injetavel = vocab.injetavel;
  const doseEm = new Map(((S.injections ?? []) as any[]).map((i) => [i.t, i]));

  return (
    <TelaInterna
      titulo={T.tratamento.telaAplicacoes.medicamento}
      acao={concordar(forma, K().novoM, K().novoF)}
      onAcao={() => router.push('/caneta-nova' as any)}
      rodape={<Botao label={K().lembrarRenovar} onPress={() => router.push('/lembretes' as any)} />}
    >
      <Titulao
        titulo={K().tituloDose(med.label, doseTxt(dose), med.unit)}
        lead={atual?.abertaEm
          ? K().leadAberto(maiuscula(vocab.recipiente), atual.jaEmUso ? registrado : aberto, dataLonga(atual.abertaEm), total, vocab.recipiente)
          /* ⚠️ A CANETA DE MILIGRAMAS SEM DOSE AINDA ("ainda não sei", no
             cadastro) dizia "0 doses por caneta" (02/10/2026, revisão da
             B3): sem dose não há conta, e o que se sabe são os miligramas. */
          : total === 0 && cabe.em === 'mg'
            ? K().leadSemAbertoMg(concordar(forma, K().nenhumM, K().nenhumF), vocab.recipiente, aberto, doseTxt(cabe.mg), med.unit)
            : K().leadSemAberto(concordar(forma, K().nenhumM, K().nenhumF), vocab.recipiente, aberto, total)}
      />

      {/* ⚠️ SEM RECIPIENTE REGISTRADO, NADA DE PROJEÇÃO. A tela dizia
          "Nenhuma caneta aberta" e logo abaixo "Doses usadas 0 de 4",
          "Última dose desta caneta: 17 de outubro" e "Receita até 17 out"
          — datas de uma caneta que não existe. Sem registro fica o que é
          fato (quantas doses cabem, a validade de bula) e o pedido do
          registro, que é o que torna o resto verdadeiro. */}
      {atual ? (
        <Progresso
          label={K().dosesUsadas}
          valor={K().usadasDe(usadas, total)}
          pct={(usadas / total) * 100}
          nota={K().ultimaDose(concordar(forma, K().desteM, K().desteF), vocab.recipiente, dataComDiaDaSemana(k.cobreAte))}
        />
      ) : (
        <Cartao>
          <Linha
            /* O ícone segue a forma: seringa para o recipiente de quem
               injeta, comprimido para a cartela. */
            ic={iconeDaDose(S)}
            titulo={maiuscula(vocab.recipiente)}
            sub={T.tratamento.registreORecipiente(`${oA(forma)} ${vocab.recipiente}`)}
            onPress={() => router.push('/caneta-nova' as any)}
          />
        </Cartao>
      )}

      {/* Sem validade (comprimido) e sem recipiente não sobra cartão: a
          grade não entra, em vez de deixar um vão na tela. */}
      {injetavel || atual ? (
      <Grade2>
        {/* ⚠️ "NÃO INFORMADA" É UM ESTADO, e não um vazio. Manipulado não
            tem prazo de bula, e quem não respondeu no registro do
            recipiente fica sem — o cartão diz isso com todas as letras em
            vez de mostrar "0 dias", que seria o aplicativo afirmando que a
            coisa venceu no dia em que foi aberta. */}
        {/* ⚠️⚠️ OS DOIS CARTÕES SÃO SOBRE DATAS, e escreviam frases.

            `para` sai em semibold e corpo de título — é o lugar do VALOR.
            Aqui ia "vence 4 out" e "cobre até 4 out": frases inteiras
            nesse peso, que quebravam em duas linhas e faziam os dois
            cartões vizinhos parecerem desalinhados. O verbo subiu para o
            rótulo, onde ele sempre coube, e embaixo ficou a data sozinha.

            ⚠️ SEM PRAZO CONHECIDO O CARTÃO MUDA DE ASSUNTO. Ele deixa de
            ser sobre uma data — não há —, e passa a ser sobre a ausência
            dela: o rótulo volta a falar da validade, o valor é "não
            informada" com todas as letras, e a nota diz de quem é a
            resposta. "0 dias" ou um travessão seriam o aplicativo
            afirmando que a coisa venceu no dia em que foi aberta. */}
        {/* Sem recipiente, a validade é a do produto: o prazo de bula
            quando existe, e "não informada" só quando nem ele existe. */}
        {injetavel ? (
        <Metrica
          ic="clock"
          nome={k.vence ? K().venceEm : K().validadeApos(aberto)}
          selo={k.vence && k.validadeDias ? K().validadeDias(k.validadeDias) : undefined}
          seloTom="neutra"
          /* Sem data de abertura — nenhum recipiente, ou um registrado já
             em uso —, o prazo do produto, e não um vencimento. */
          para={k.vence ? fmtDate(k.vence)
            : (!atual || atual.jaEmUso) && k.validadeDias ? K().validadeDias(k.validadeDias)
              : K().validadeNaoInformada}
          nota={k.vence || k.validadeDias ? undefined : K().quemPreparaDefine}
        />
        ) : null}
        {atual ? (
          <Metrica
            ic="pill"
            nome={K().receitaAte}
            selo={K().receitaDura(cobertura)}
            para={fmtDate(k.cobreAte)}
          />
        ) : null}
      </Grade2>
      ) : null}

      {/* A caneta pode vencer antes de a última dose sair dela — com 14 dias
          de validade e quatro doses semanais, isso é a regra, não a exceção.
          O aviso constata e para por aí: o que fazer com a dose que sobra é
          conversa de médico, não decisão de app. Cartela não vence assim. */}
      {injetavel && k.venceAntesDoFim ? (
        <Aviso
          ic="clock"
          titulo={K().venceAntes(`${maiuscula(oA(forma))} ${vocab.recipiente}`)}
          /* Só chega aqui com `vence` preenchido, e `vence` exige
             `validadeDias` — mas o tipo não sabe disso. */
          texto={K().venceAntesTexto(med.label, k.validadeDias ?? 0, total, aberto)}
        />
      ) : null}

      {!k.verdict.good ? (
        <Aviso
          ic="pill"
          titulo={K().momentoDeRenovar}
          texto={K().renovarTexto(cobertura)}
        />
      ) : null}

      {k.lista.length ? (
      <Bloco titulo={K().historico(vocab.plural)}>
        <Sanfona>
          {k.lista.map((p) => (
            <SanfonaLinha
              key={p.id}
              titulo={K().tituloDose(p.label, doseTxt(p.dose), p.unit)}
              /* ⚠️ "encerrada" ESTAVA NO FEMININO FIXO, concordando com
                 "caneta" numa lista que também mostra frasco e blíster. */
              selo={p.estado === 'uso' ? K().emUso : concordar(forma, K().encerradoM, K().encerradoF)}
              seloTom="neutra"
              sub={p.estado === 'uso'
                ? K().itemEmUso(maiuscula(p.jaEmUso ? registrado : aberto), fmtDate(p.abertaEm!), p.usadas, p.total)
                /* Sem dose nenhuma saída dele (a caixa de 7 mg de quem passou
                   aos 14), o período acaba onde começou — e não em 1970
                   (02/10/2026, revisão da B3). */
                : K().itemEncerrado(fmtPeriodo(new Date(p.abertaEm!), new Date(p.ultimaEm ?? p.abertaEm!)), p.usadas, p.total)}
              /* A segunda coluna é o local da dose injetada — e "não
                 informado" só nela, que é quem tem local a informar. A dose
                 de comprimido não tem local nenhum: a coluna diz a dose.
                 `a.site` já chega vazio para ela (`canetas`, em derive). */
              itens={p.aplicacoes.map((a) => [
                fmtDate(a.t),
                a.site ? T.comum.noMeio(siteLabel(a.site))
                  : doseInjetavel(S, doseEm.get(a.t)) ? T.comum.noMeio(T.tratamento.localNaoInformado)
                    : `${doseTxt(a.dose)} ${p.unit}`,
              ] as [string, string])}
            />
          ))}
        </Sanfona>
      </Bloco>
      ) : null}

      {/* Espaço para o rodapé não cobrir a última linha da sanfona aberta. */}
      <View />
    </TelaInterna>
  );
}
