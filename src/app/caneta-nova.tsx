import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { MEDS } from '../logic/meds';
import { nf } from '../logic/time';
import { SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Botao } from '../ui/internas';

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
  const catalogo = MEDS[med] ?? MEDS.mounjaro;
  const porCaneta = (S as any).pen?.dosesPerPen ?? 4;

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
      s.pen = { dosesLeft: porCaneta, dosesPerPen: porCaneta };
    });
    router.back();
  };

  return (
    <SheetScreen titulo="Nova caneta" sub="Zera a contagem de doses." onClose={() => router.back()}>
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
          ajuda={`${porCaneta} doses por caneta · validade de ${catalogo.shelf} dias após aberta`}
        >
          <Opcoes>
            {catalogo.doses.slice(0, 4).map((d) => (
              <Opc
                key={d}
                label={`${nf(d, d % 1 ? 1 : 0).replace('.', ',')} ${catalogo.unit}`}
                on={dose === d}
                onPress={() => setDose(d)}
              />
            ))}
          </Opcoes>
        </Campo>

        <Botao label="Registrar caneta" onPress={registrar} />
      </View>
    </SheetScreen>
  );
}
