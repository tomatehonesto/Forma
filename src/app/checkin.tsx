import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { startOfDay, now } from '../logic/time';
import { TelaInterna, Titulao, Campo, Opcoes, Opc, Escala, Texto, Botao } from '../ui/internas';

/* ============================================================
   CHECK-IN DO DIA

   A tela antiga pedia cinco notas de 0 a 10, todas obrigatórias na
   prática: fome, enjoo, energia, humor, compulsão, cinco sliders sempre
   presentes. Quem não teve enjoo tinha que decidir o que fazer com o
   slider de enjoo — e a resposta honesta, "não tive", não existia.

   Aqui a pergunta vem em duas etapas. Primeiro O QUE aconteceu: a pessoa
   marca só os sintomas que teve. Só então aparece QUANTO, uma escala por
   sintoma marcado. Um dia sem sintoma nenhum é um toque em salvar — e a
   frase de abertura diz isso em voz alta, porque deixar em branco por
   medo de estar "fazendo errado" é o jeito mais comum de abandonar um
   diário de sintomas.

   A escala de sintoma é a versão suave (lavagem, não azul chapado): marcar
   5 de náusea não é uma conquista. Energia, que é o quanto você tem, segue
   em azul cheio.
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

/* Armazenamento é 0–10; a tela fala 1–5. A conversão mora na fronteira,
   nos dois sentidos, e é a mesma de medir-sintomas. */
const paraTela = (v: any) => (typeof v === 'number' && v > 0 ? Math.round(v / 2) : null);

export default function Checkin() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  /* A tela abre com o que já foi registrado hoje. Sem isso, "Revisar como
     estou" — que o sheet de registrar oferece quando o dia já tem
     check-in — abria em branco e o segundo salvamento apagava o primeiro.

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
  const [energia, setEnergia] = useState<number | null>(hoje?.energia ?? null);
  const [sono, setSono] = useState<number | null>(hoje?.sono ?? null);
  const [humor, setHumor] = useState<number | null>(hoje?.mood ?? null);
  const [nota, setNota] = useState<string>(hoje?.note ?? '');
  const [levar, setLevar] = useState(false);

  const alterna = (id: string) =>
    setMarcados((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

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
          .filter((id) => !SINTOMAS.find((x) => x.id === id)?.store)
          .map((id) => [id, grau[id] ?? 3]),
      );
      c.note = nota;

      /* Só o que foi respondido é gravado. Deixar uma escala em branco
         mantém o campo ausente, e ausente continua sendo diferente de
         zero para quem lê. */
      if (energia != null) c.energia = energia;
      if (sono != null) c.sono = sono;
      if (humor != null) c.mood = humor;

      /* Fome fica em medir-sintomas, junto de intestino: as duas telas não
         perguntam a mesma coisa. */

      if (levar && nota.trim()) {
        s.notes = [{ t: +now(), text: nota.trim(), done: false }, ...(s.notes || [])];
      }
      s.heroSeen = { milestone: 0, insight: null, replay: null };
    });
    router.replace('/(tabs)/jornada' as any);
  };

  return (
    <TelaInterna
      titulo="Check-in"
      fechar
      acao="Salvar"
      onAcao={salvar}
      rodape={<Botao label="Salvar check-in" onPress={salvar} />}
    >
      <Titulao
        titulo={`Como foi${'\n'}o seu dia?`}
        lead="Marque só o que aconteceu. Deixar em branco também é uma resposta."
      />

      <Campo rotulo="Sintomas">
        <Opcoes>
          {SINTOMAS.map((x) => (
            <Opc key={x.id} label={x.label} on={marcados.includes(x.id)} onPress={() => alterna(x.id)} />
          ))}
        </Opcoes>
      </Campo>

      {marcados.map((id, i) => {
        const s = SINTOMAS.find((x) => x.id === id)!;
        return (
          <Campo
            key={id}
            rotulo={`${s.label} · intensidade`}
            /* A régua só é explicada uma vez: repetir "1 mal percebo · 5
               atrapalha o dia" em cada sintoma vira ruído na terceira vez. */
            ajuda={i === 0 ? '1 mal percebo · 5 atrapalha o dia' : undefined}
          >
            <Escala
              suave
              valores={[1, 2, 3, 4, 5]}
              valor={grau[id] ?? null}
              onChange={(v) => setGrau((g) => ({ ...g, [id]: Number(v) }))}
            />
          </Campo>
        );
      })}

      <Campo rotulo="Energia hoje" ajuda="Alimenta a meta “ter mais energia à tarde”.">
        <Escala
          valores={[2, 4, 6, 8, 10]}
          valor={energia}
          onChange={(v) => setEnergia(Number(v))}
        />
      </Campo>

      {/* Sono e humor voltaram. Eles não são sintoma — não se "marca se
          aconteceu", todo dia tem os dois —, então aparecem sempre, em
          escala, como a energia. Mas nascem em branco: quem não responder
          deixa o dia sem essa resposta, e não com uma inventada.

          São os dois campos que a Jornada e o Insights leem e que ninguém
          escrevia desde que as telas pararam de preencher o dia de
          enfeite — a meta "Dormir 7h+", o eixo Sono do radar e o padrão de
          sono contra a fome do dia seguinte. */}
      <Campo rotulo="Quanto você dormiu" ajuda="Em horas · 9 vale para nove ou mais.">
        <Escala
          valores={[5, 6, 7, 8, 9]}
          valor={sono}
          onChange={(v) => setSono(Number(v))}
        />
      </Campo>

      <Campo rotulo="Humor" ajuda="1 um dia difícil · 5 um bom dia.">
        <Escala
          valores={[1, 2, 3, 4, 5]}
          valor={humor}
          onChange={(v) => setHumor(Number(v))}
        />
      </Campo>

      <Campo rotulo="Quer anotar alguma coisa?">
        <Texto
          valor={nota}
          onChange={setNota}
          placeholder="Opcional. Só para você — a menos que você mande para a consulta."
          linhas={3}
        />
        <View style={{ alignSelf: 'flex-start' }}>
          <Opc label="Levar para a consulta" on={levar} onPress={() => setLevar((x) => !x)} />
        </View>
      </Campo>

      <View />
    </TelaInterna>
  );
}
