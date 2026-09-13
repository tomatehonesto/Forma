import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { registroDoDia } from '../logic/derive';
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

export default function Checkin() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();

  const [marcados, setMarcados] = useState<string[]>([]);
  const [grau, setGrau] = useState<Record<string, number>>({});
  const [energia, setEnergia] = useState<number>(6);
  const [nota, setNota] = useState('');
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

      c.energia = energia;
      c.sint = Object.fromEntries(marcados.map((id) => [id, grau[id] ?? 3]));
      c.note = nota;

      /* Sono, humor e fome NÃO entram. A tela não pergunta, e antes ela
         gravava 7 horas, humor 3 e fome 5 de enfeite — números que a
         pessoa nunca disse e que saíam daqui para as médias da Jornada e
         para o radar como se fossem resposta dela.
         Ausente é ausente; quem lê estado agora sabe lidar com isso. */

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
