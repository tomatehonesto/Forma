import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { ENERGIA, SONO, HUMOR, INTENSIDADE, SINTOMA } from '../logic/escalas';
import { TelaInterna, Titulao, Campo, Opcoes, Opc, Escala, Texto, Botao } from '../ui/internas';

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
  { id: 'constip', label: 'Constipação', store: 'constip' },
  { id: 'refluxo', label: 'Refluxo', store: 'refluxo' },
  { id: 'fadiga', label: 'Fadiga' },
  { id: 'cefaleia', label: 'Dor de cabeça' },
  { id: 'tontura', label: 'Tontura' },
  { id: 'outro', label: 'Outro' },
];

/* "Outro" é o único que não tem régua, e não podia ter: a escala mede
   quanto pesou um sintoma que a tela sabe nomear, e aqui a tela não sabe
   qual é. Perguntar a intensidade antes do nome é pedir o adjetivo sem o
   substantivo — então ele abre um campo de escrever, e o que a pessoa
   digitar é o registro. Vive em `outroTexto`, fora do mapa `sint`, que
   continua só com números. */
const OUTRO = 'outro';

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
    for (const x of SINTOMAS) {
      if (x.id === OUTRO) continue;
      const v = x.store ? paraTela(hoje?.[x.store]) : (hoje?.sint?.[x.id] ?? null);
      if (v == null) continue;
      m.push(x.id); g[x.id] = v;
    }
    /* "Outro" está marcado quando há texto, e entra por último para o
       cartão dele ficar depois dos outros, como na fileira de chips. */
    if (String(hoje?.outroTexto || '').trim()) m.push(OUTRO);
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

  /* Marcar um sintoma já grava 3 — o meio da régua — em vez de deixar a
     intensidade em branco. Aqui o vazio não cabe: o sintoma só está na
     lista porque a pessoa disse que teve, e salvar mandava 3 de qualquer
     jeito. Com a escala nascendo em branco, a tela dizia "ainda não
     respondi" e guardava "incomodou" — duas coisas diferentes sobre o
     mesmo campo. Agora ela mostra o que vai salvar, e a pessoa ajusta. */
  const alterna = (id: string) => {
    const tinha = marcados.includes(id);
    setMarcados((m) => (tinha ? m.filter((x) => x !== id) : [...m, id]));
    if (!tinha && id !== OUTRO) setGrau((g) => (g[id] == null ? { ...g, [id]: 3 } : g));
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
          .filter((id) => id !== OUTRO && !SINTOMAS.find((x) => x.id === id)?.store)
          .map((id) => [id, grau[id] ?? 3]),
      );

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
          {marcados.map((id) => {
            const s = SINTOMAS.find((x) => x.id === id)!;

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
              </Campo>
            );
          })}
        </View>
      </View>

      <View />
    </TelaInterna>
  );
}
