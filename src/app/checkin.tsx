import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { ENERGIA, SONO, HUMOR, INTENSIDADE, SINTOMA, INTESTINO } from '../logic/escalas';
import { TelaInterna, Titulao, Campo, Opcoes, Opc, Escala, Texto, Aviso, Botao } from '../ui/internas';

/* ============================================================
   CHECK-IN DO DIA

   A tela tem duas partes, e a ordem delas é a resposta a "o que esta tela
   quer de mim?".

   Primeiro as PERGUNTAS FIXAS: energia, sono, humor. Todo dia tem as três
   — ninguém "teve ou não teve" humor —, então elas aparecem sempre, em
   escala, e respondê-las é um gesto de três toques. Quem só tem trinta
   segundos responde essas e sai com o dia registrado.

   Depois os SINTOMAS, que são o contrário: a pessoa é quem diz quais
   existiram. Marca o que teve, e só então aparece quanto, uma escala por
   sintoma marcado. Um dia sem sintoma nenhum não pede toque nenhum aqui.

   Elas estavam na ordem inversa, e isso fazia a tela abrir pedindo que a
   pessoa procurasse na lista de sete sintomas o que tinha sentido — a
   parte mais lenta e a mais fácil de ser "nenhum" — antes das três
   perguntas que a tela realmente faz todo dia.

   Nada nasce preenchido. Um campo em branco continua em branco no
   registro, porque ausência não é zero: quem não respondeu sono não
   dormiu zero hora.
   ============================================================ */

/* `store` é a chave numérica legada que derive.ts já lê. Os três primeiros
   sintomas têm coluna própria desde o início; os outros vivem só no mapa
   `sint` do check-in, e entram nas leituras quando ganharem derivação. */
const SINTOMAS: { id: string; label: string; store?: string }[] = [
  { id: 'nausea', label: 'Náusea', store: 'nausea' },
  { id: 'intestino', label: 'Intestino' },
  { id: 'vomito', label: 'Vômito' },
  { id: 'dor', label: 'Dor abdominal' },
  { id: 'refluxo', label: 'Refluxo', store: 'refluxo' },
  { id: 'fadiga', label: 'Fadiga' },
  { id: 'cefaleia', label: 'Dor de cabeça' },
  { id: 'tontura', label: 'Tontura' },
  { id: 'outro', label: 'Outro' },
];

/* A lista cresceu para caber o que a literatura mais registra. Faltavam
   três dos mais frequentes: vômito, dor abdominal — a queixa mais
   relatada de todas em dados de mundo real — e o lado "solto" do
   intestino, que a tela simplesmente não tinha como receber.

   E "Constipação" virou "Intestino". Prender e soltar não são sintomas
   diferentes: são as duas pontas do mesmo efeito, e apareciam quase
   empatados nos estudos. Com um sintoma só para o lado preso, quem tivesse
   diarreia não tinha onde dizer, e quem alternasse tinha que escolher
   metade da verdade.

   Isso também encerra uma divergência que já existia: "Como o corpo
   reagiu" guardava `gut` com normal/preso/solto enquanto o check-in
   guardava `constip` como intensidade. As duas telas podiam afirmar
   coisas contrárias sobre o mesmo dia. Agora as duas escrevem `gut`, da
   mesma lista de valores, e `constip` continua sendo gravado quando o
   intestino está preso — é a coluna que Ritmo, Semana e Sintomas já
   leem. */
const OUTRO = 'outro';
const GUT = 'intestino';
const DOR = 'dor';

/* O único sintoma desta tela que muda de urgência conforme a intensidade.

   Dor abdominal forte ou que não passa é o que toda bula de GLP-1 manda
   relatar sem esperar — os outros sintomas viram assunto na próxima
   consulta, esse não. Um diário que registra e cala nesse ponto cumpre a
   função de arquivo e falha na de acompanhamento.

   O aviso entra em 4 ("precisei parar o dia") e 5 ("dor que não passou"),
   a mesma régua de 4 que "como o corpo reagiu" usa para o enjoo. Ele diz
   o que fazer e não nomeia diagnóstico: quem lê já está com dor, e um
   nome de doença aqui assusta sem ajudar a decidir. */
const DOR_AVISA = 4;

/* O outro ponto em que a tela deixa de só anotar.

   Sete ou mais idas num dia é onde a graduação clínica de diarreia troca
   de patamar — é a faixa em que o risco deixa de ser o incômodo e passa a
   ser perder água e sal mais rápido do que a sede repõe. Os degraus
   abaixo, a própria graduação descreve como algo que não atrapalha o dia,
   e avisar neles seria assustar por um número. */
const SOLTO_AVISA = 5;

/* "Outro" não tem régua, e não podia ter: a escala mede quanto pesou um
   sintoma que a tela sabe nomear, e aqui a tela não sabe qual é.
   Perguntar a intensidade antes do nome é pedir o adjetivo sem o
   substantivo — então ele abre um campo de escrever, e o que a pessoa
   digitar é o registro. Vive em `outroTexto`, fora do mapa `sint`, que
   continua só com números. */

/* Armazenamento é 0–10; a tela fala 1–5. A conversão mora na fronteira,
   nos dois sentidos, e é a mesma de medir-sintomas. Vale para os sintomas
   e para a energia, que também é lida em 0–10 pelo radar, pelas metas e
   pela série do balanço. */
const paraTela = (v: any) => (typeof v === 'number' && v > 0 ? Math.round(v / 2) : null);

export default function Checkin() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  /* A tela abre com o que já foi registrado hoje. Sem isso, "Editar" — que
     o sheet de registrar oferece quando o dia já tem check-in — abria em
     branco e o segundo salvamento apagava o primeiro.

     Cada sintoma tem UMA fonte, nunca duas. Os três com coluna própria
     (enjoo, constipação, refluxo) são lidos da coluna; os outros quatro,
     que só existem aqui, do mapa `sint`.

     Guardar os três nos dois lugares era o que eu tinha feito antes, e
     quebrou na primeira vez que medir-sintomas mexeu no enjoo: a coluna ia
     para 4 e o `sint` continuava em 4 da régua antiga, dizendo coisas
     diferentes sobre o mesmo sintoma. Uma fonte por campo elimina a
     possibilidade da divergência em vez de tentar sincronizá-la. */
  const hoje: any = checkinToday(S);
  const inicial = (() => {
    const g: Record<string, number> = {};
    const m: string[] = [];
    /* Percorre SINTOMAS, e não as chaves do registro, para os marcados
       saírem na mesma ordem dos chips. Os dois especiais têm cada um a
       sua prova de existência: "Outro" é o texto, e o intestino é `gut`
       fora do normal — `normal` gravado é uma resposta ("foi bem"), não
       um sintoma, e deixa o chip desmarcado como o zero de náusea faz. */
    for (const x of SINTOMAS) {
      if (x.id === OUTRO) {
        if (String(hoje?.outroTexto || '').trim()) m.push(OUTRO);
        continue;
      }
      if (x.id === GUT) {
        if (hoje?.gut && hoje.gut !== 'normal') m.push(GUT);
        continue;
      }
      const v = x.store ? paraTela(hoje?.[x.store]) : (hoje?.sint?.[x.id] ?? null);
      if (v == null) continue;
      m.push(x.id); g[x.id] = v;
    }
    return { marcados: m, grau: g };
  })();

  const [marcados, setMarcados] = useState<string[]>(inicial.marcados);
  const [grau, setGrau] = useState<Record<string, number>>(inicial.grau);
  /* null = ainda não respondido. Voltar a um valor padrão aqui reinventaria
     o problema que essas telas acabaram de deixar de ter: gravar como
     resposta um número que ninguém deu. */
  const [energia, setEnergia] = useState<number | null>(paraTela(hoje?.energia));
  const [sono, setSono] = useState<number | null>(hoje?.sono ?? null);
  const [humor, setHumor] = useState<number | null>(hoje?.mood ?? null);
  const [outro, setOutro] = useState<string>(hoje?.outroTexto ?? '');
  const [gut, setGut] = useState<string | null>(
    hoje?.gut && hoje.gut !== 'normal' ? hoje.gut : null,
  );
  /* Os dois lados do eixo se medem, e em unidades diferentes: preso conta
     DIAS sem ir, solto conta IDAS no dia. Por isso são dois estados, e não
     um número que troca de significado — trocar de lado não devia carregar
     o número do lado anterior. Alternar não se conta em nenhuma das duas. */
  const [dias, setDias] = useState<number | null>(paraTela(hoje?.constip));
  const [vezes, setVezes] = useState<number | null>(paraTela(hoje?.diarreia));

  /* Marcar um sintoma já grava 3 — o meio da régua — em vez de deixar a
     intensidade em branco. Aqui o vazio não cabe: o sintoma só está na
     lista porque a pessoa disse que teve, e salvar mandava 3 de qualquer
     jeito. Com a escala nascendo em branco, a tela dizia "ainda não
     respondi" e guardava "incomodou" — duas coisas diferentes sobre o
     mesmo campo. Agora ela mostra o que vai salvar, e a pessoa ajusta. */
  const alterna = (id: string) => {
    const tinha = marcados.includes(id);
    setMarcados((m) => (tinha ? m.filter((x) => x !== id) : [...m, id]));
    if (!tinha && id !== OUTRO && id !== GUT) setGrau((g) => (g[id] == null ? { ...g, [id]: 3 } : g));
  };

  /* Escolher um lado já põe a contagem no meio, pelo mesmo motivo que
     marcar um sintoma já põe a intensidade em 3: a tela mostra o que vai
     salvar. */
  const escolheGut = (k: string) => {
    setGut(k);
    if (k === 'preso') setDias((d) => (d == null ? 3 : d));
    if (k === 'solto') setVezes((v) => (v == null ? 3 : v));
  };

  const salvar = () => {
    update((s: any) => {
      const t = +startOfDay(now());

      /* Escreve DENTRO do registro do dia, em vez de apagar e recriar. A
         versão anterior filtrava o dia fora da lista e empurrava um objeto
         novo — e levava junto a água e a proteína que a pessoa já tinha
         registrado antes do check-in. Fazer check-in apagava o copo d'água
         das dez da manhã. */
      const c = registroDoDia(s, t);

      /* A escala da tela é 1–5; as colunas legadas são 0–10. Dobrar mantém
         as duas leituras coerentes sem reescrever quem já consome. */
      for (const x of SINTOMAS) {
        if (!x.store) continue;
        c[x.store] = marcados.includes(x.id) ? (grau[x.id] ?? 3) * 2 : 0;
      }

      /* `sint` guarda SÓ os sintomas sem coluna própria. Os três com coluna
         vivem na coluna e em lugar nenhum além dela. */
      c.sint = Object.fromEntries(
        marcados
          .filter((id) => id !== OUTRO && id !== GUT && !SINTOMAS.find((x) => x.id === id)?.store)
          .map((id) => [id, grau[id] ?? 3]),
      );

      /* INTESTINO — um eixo, gravado em dois lugares com papéis distintos.

         `gut` diz a DIREÇÃO e é o campo que "como o corpo reagiu" também
         escreve. `constip` continua sendo a coluna numérica de quantos
         dias sem ir, porque Ritmo, Semana e Sintomas leem dali; ela só
         tem valor quando o intestino está preso.

         Chip desmarcado grava `normal`, do mesmo jeito que um sintoma não
         marcado grava zero: é a pessoa dizendo que o intestino foi bem,
         não uma lacuna. Marcado sem escolher o estado é o único caso que
         não afirma nada — ela disse que teve algo e não disse o quê, e
         inventar um lado seria pior do que deixar como estava. */
      const marcouGut = marcados.includes(GUT);
      if (!marcouGut) { c.gut = 'normal'; c.constip = 0; c.diarreia = 0; }
      else if (gut) {
        c.gut = gut;
        c.constip = gut === 'preso' ? (dias ?? 3) * 2 : 0;
        c.diarreia = gut === 'solto' ? (vezes ?? 3) * 2 : 0;
      }

      /* Desmarcar "Outro" apaga o texto: ele é a única prova de que o
         sintoma existiu, e deixá-lo para trás faria a pessoa desmarcar na
         tela e continuar registrada no arquivo. */
      if (marcados.includes(OUTRO) && outro.trim()) c.outroTexto = outro.trim();
      else delete c.outroTexto;
      /* Só o que foi respondido é gravado. Deixar uma escala em branco
         mantém o campo ausente, e ausente continua sendo diferente de
         zero para quem lê. */
      if (energia != null) c.energia = energia * 2;
      if (sono != null) c.sono = sono;
      if (humor != null) c.mood = humor;

      /* Fome fica em medir-sintomas, junto de intestino: as duas telas não
         perguntam a mesma coisa. A anotação livre saiu por ora; `c.note`
         não é mais escrito aqui, e por isso o que já estiver gravado
         continua onde está em vez de ser apagado por um campo ausente. */

      s.heroSeen = { milestone: 0, insight: null, replay: null };
    });
    router.replace('/(tabs)/jornada' as any);
  };

  return (
    /* Sem ação no topo. O "Salvar" morava ali E no rodapé fixo, e duas
       portas para a mesma saída só fazem a pessoa decidir qual delas é a
       de verdade — ainda mais quando uma é um link pequeno e a outra um
       botão de largura inteira, que é o que a tela quer que se aperte. */
    <TelaInterna
      titulo="Check-in"
      fechar
      rodape={<Botao label="Salvar check-in" onPress={salvar} />}
    >
      <Titulao
        titulo="Como foi o seu dia?"
        lead="Responda o que fizer sentido. Deixar em branco também é uma resposta."
      />

      {/* As três quase se tocam, como os cartões de "Sua evolução" na
          Home. Elas são um bloco só — as perguntas que a tela faz todo
          dia —, e o ar de antes entre uma e outra as fazia parecer três
          assuntos empilhados por acaso. O respiro maior fica para as
          quebras que existem de verdade: o titulão e os sintomas. */}
      <View style={{ gap: 4 }}>
        <Campo rotulo="Energia">
          <Escala
            valores={[1, 2, 3, 4, 5]}
            valor={energia}
            onChange={(v) => setEnergia(Number(v))}
            onLimpar={() => setEnergia(null)}
            legendas={ENERGIA}
          />
        </Campo>

        <Campo rotulo="Sono">
          <Escala
            valores={[5, 6, 7, 8, 9]}
            valor={sono}
            onChange={(v) => setSono(Number(v))}
            onLimpar={() => setSono(null)}
            legendas={SONO}
          />
        </Campo>

        <Campo rotulo="Humor">
          <Escala
            valores={[1, 2, 3, 4, 5]}
            valor={humor}
            onChange={(v) => setHumor(Number(v))}
            onLimpar={() => setHumor(null)}
            legendas={HUMOR}
          />
        </Campo>
      </View>

      {/* Daqui para baixo é a parte que a pessoa descreve. Nada aqui é
          obrigatório, e um dia sem sintoma nenhum passa direto.

          A escolha fica FORA do cartão. Ela não é um formulário, é uma
          pergunta com respostas soltas na tela; embrulhada num cartão
          igual aos de cima, virava mais um painel numa pilha de painéis.
          Cartão só aparece depois, e um por sintoma marcado — o que dá à
          tela a forma do dia que a pessoa teve, em vez de uma grade fixa
          esperando ser preenchida. */}
      <View style={{ gap: 14 }}>
        <Campo rotulo="Teve algum sintoma?" nu>
          <Opcoes>
            {SINTOMAS.map((x) => (
              <Opc key={x.id} label={x.label} on={marcados.includes(x.id)} onPress={() => alterna(x.id)} />
            ))}
          </Opcoes>
        </Campo>

        {/* Os cartões dos sintomas são a continuação da escolha de cima,
            então ficam colados entre si e perto dela.

            Cada um traz a régua do SEU sintoma: o 5 da náusea é vomitar, o
            da constipação é o quarto dia sem ir ao banheiro. Sem escala
            aqui — quem quer desfazer desmarca o chip, que é de onde o
            cartão veio. */}
        <View style={{ gap: 4 }}>
          {/* Os cartões seguem a ordem dos chips, não a ordem em que foram
              tocados: a lista não se reembaralha conforme a pessoa marca,
              e o que ela vê embaixo tem a mesma sequência do que está em
              cima. */}
          {SINTOMAS.filter((x) => marcados.includes(x.id)).map((s) => {
            const id = s.id;

            if (id === GUT) {
              return (
                <Campo key={id} rotulo="Como foi o intestino?">
                  <Opcoes>
                    {INTESTINO.filter(([k]) => k !== 'normal').map(([k, rotulo]) => (
                      <Opc key={k} label={rotulo} on={gut === k} onPress={() => escolheGut(k)} />
                    ))}
                  </Opcoes>
                  {/* Uma régua por lado, cada uma na sua unidade: dias sem
                      ir de um lado, idas no dia do outro. Alternar fica sem
                      contagem — dizer quantas vezes num dia que teve os dois
                      pede uma resposta que ninguém tem na ponta da língua. */}
                  {gut === 'preso' ? (
                    <Escala
                      suave
                      valores={[1, 2, 3, 4, 5]}
                      valor={dias}
                      onChange={(v) => setDias(Number(v))}
                      onLimpar={() => setDias(null)}
                      legendas={SINTOMA.constip}
                    />
                  ) : null}

                  {gut === 'solto' ? (
                    <Escala
                      suave
                      valores={[1, 2, 3, 4, 5]}
                      valor={vezes}
                      onChange={(v) => setVezes(Number(v))}
                      onLimpar={() => setVezes(null)}
                      legendas={SINTOMA.diarreia}
                    />
                  ) : null}

                  {/* Dentro do cartão, abaixo de um fio: é a leitura da
                      resposta que acabou de ser dada, não um bloco novo. */}
                  {gut === 'solto' && (vezes ?? 0) >= SOLTO_AVISA ? (
                    <Aviso
                      dentro
                      ic="aura"
                      titulo="Nesse ritmo, o risco é desidratar"
                      texto="Sete ou mais idas num dia tiram mais água e sal do que a sede consegue repor. Beba ao longo do dia, sem esperar sede, e avise sua equipe se amanhã continuar assim."
                    />
                  ) : null}
                </Campo>
              );
            }

            if (id === OUTRO) {
              return (
                <Campo key={id} rotulo="Qual foi o outro sintoma?">
                  <Texto
                    valor={outro}
                    onChange={setOutro}
                    placeholder="Ex.: gosto metálico na boca"
                    linhas={1}
                  />
                </Campo>
              );
            }

            return (
              <Campo key={id} rotulo={`${s.label} · intensidade`}>
                <Escala
                  suave
                  valores={[1, 2, 3, 4, 5]}
                  valor={grau[id] ?? null}
                  onChange={(v) => setGrau((g) => ({ ...g, [id]: Number(v) }))}
                  legendas={SINTOMA[id] ?? INTENSIDADE}
                />

                {id === DOR && (grau[id] ?? 0) >= DOR_AVISA ? (
                  <Aviso
                    dentro
                    ic="aura"
                    titulo="Essa dor não espera a próxima consulta"
                    texto="Dor abdominal forte ou que não passa é a que a bula pede para relatar na hora. Registre aqui e fale com sua equipe hoje."
                  />
                ) : null}
              </Campo>
            );
          })}
        </View>
      </View>

      <View />
    </TelaInterna>
  );
}
