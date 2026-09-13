import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { checkinToday, registroDoDia } from '../logic/derive';
import { now, startOfDay } from '../logic/time';
import { SINTOMA, FOME, INTESTINO } from '../logic/escalas';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Escala, Opcoes, Opc, Aviso, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   COMO O CORPO REAGIU — captura, não histórico

   Só o que muda com a medicação: enjoo, fome e intestino. Sono e humor
   ficam no check-in, para as duas telas não perguntarem a mesma coisa.

   Enjoo é o campo que as duas telas dividem, e por isso usa a MESMA
   escala do check-in — 1 a 5, ancorada na experiência ("mal percebo" /
   "atrapalha o dia") em vez de um 0 a 10 abstrato. Antes eram dois
   controles diferentes para o mesmo dado: quem respondesse 7 no slider e
   depois abrisse o check-in via uma escala que não sabia representar 7.

   E as duas telas abrem com o que a outra já gravou. Editar um valor é
   corrigir o mesmo número, não escrever um segundo por cima.
   ============================================================ */

/* O armazenamento é 0–10 e continua sendo: derives, seed e histórico já
   leem nessa régua. A tela fala 1–5 e converte na fronteira. */
const paraTela = (v: any) => (typeof v === 'number' && v > 0 ? Math.round(v / 2) : null);

export default function MedirSintomas() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const router = useRouter();
  const { c: cor } = useTheme();

  const ci: any = checkinToday(S);
  const [nausea, setNausea] = useState<number | null>(paraTela(ci?.nausea));
  const [fome, setFome] = useState<number | null>(paraTela(ci?.fome));
  const [gut, setGut] = useState<string | null>(ci?.gut ?? null);

  const salvar = () => {
    update((s: any) => {
      const c = registroDoDia(s, +startOfDay(now()));
      /* Só o respondido entra — em branco continua ausente, não zero. */
      if (nausea != null) c.nausea = nausea * 2;
      if (fome != null) c.fome = fome * 2;
      if (gut != null) c.gut = gut;
    });
    router.back();
  };

  const nada = nausea == null && fome == null && gut == null;

  return (
    <SheetScreen
      titulo="Como seu corpo reagiu?"
      sub="Só o que costuma mudar com a medicação"
      onClose={() => router.back()}
    >
      <View style={{ marginTop: 18, gap: 10 }}>
        {/* As legendas são as mesmas do check-in, porque a coluna é a
            mesma. A linha de ajuda saiu: ela dizia só as pontas, e a
            legenda diz as cinco. */}
        {/* O aviso sai por baixo do campo que o provocou. Solto lá embaixo,
            depois do intestino, ele estava a três blocos da pergunta sobre
            a qual fala. */}
        <Campo
          rotulo="Enjoo"
          saia={nausea != null && nausea >= 4 ? (
            <Aviso
              dentro
              ic="aura"
              titulo="Enjoo forte merece ser conversado"
              texto="Vale registrar e comentar com sua equipe na próxima consulta."
            />
          ) : undefined}
        >
          <Escala
            suave valores={[1, 2, 3, 4, 5]} valor={nausea}
            onChange={(v) => setNausea(Number(v))} onLimpar={() => setNausea(null)}
            legendas={SINTOMA.nausea}
          />
        </Campo>

        <Campo rotulo="Fome">
          <Escala
            suave valores={[1, 2, 3, 4, 5]} valor={fome}
            onChange={(v) => setFome(Number(v))} onLimpar={() => setFome(null)}
            legendas={FOME}
          />
        </Campo>

        <Campo rotulo="Intestino">
          <Opcoes>
            {INTESTINO.map(([k, rotulo]) => (
              <Opc key={k} label={rotulo} on={gut === k} onPress={() => setGut(k)} />
            ))}
          </Opcoes>
        </Campo>

        <Botao label="Registrar como estou" onPress={salvar} />

        {nada ? (
          <Txt v="caption" c={cor.tx3} style={{ textAlign: 'center' }}>
            Nada marcado também é uma resposta — salvar sem escolher deixa o dia em branco.
          </Txt>
        ) : null}
      </View>
    </SheetScreen>
  );
}
