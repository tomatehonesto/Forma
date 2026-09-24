import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  carregarRede, buscar, useVitrine, cidadesDaRede, conveniosDaRede, diasDaRede,
  type Profissional, type Modalidade,
} from '../logic/rede';
import { WD, maiuscula } from '../logic/time';
import { Txt, SheetScreen } from '../ui/kit';
import { Campo, Opcoes, Opc, Botao } from '../ui/internas';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

const K = () => T.rede.folha;

/* ============================================================
   OS FILTROS DA VITRINE — a folha

   Os quatro filtros que dizem respeito ao CONSULTÓRIO: onde fica, como
   atende, que convênio aceita e em que dia. A especialidade e a busca
   ficam na vitrine, à vista, porque são a primeira pergunta de quem abre
   a lista; estes são a segunda.

   ⚠️ CADA TOQUE JÁ VALE, e o botão de baixo diz quantos sobram. É ele que
   fecha a folha — e "Ver 3 profissionais" responde, antes de fechar, se
   a combinação escolhida deixou alguém.

   A cidade, o convênio e o dia só listam o que a rede tem: oferecer
   domingo sem ninguém que atenda no domingo seria convidar a pessoa para
   uma lista em branco.
   ============================================================ */

export default function FiltrosDaRede() {
  const router = useRouter();
  const { c } = useTheme();
  const v = useVitrine();
  const [lista, setLista] = useState<Profissional[]>([]);
  useEffect(() => { carregarRede().then(setLista).catch(() => {}); }, []);

  const cidades = useMemo(() => cidadesDaRede(lista), [lista]);
  const convenios = useMemo(() => conveniosDaRede(lista), [lista]);
  const dias = useMemo(() => diasDaRede(lista), [lista]);
  const sobram = useMemo(() => buscar(lista, v, v.perto).length, [lista, v]);

  const modalidades: [Modalidade | '', string][] = [
    ['', K().todas], ['presencial', K().presencial], ['teleconsulta', K().teleconsulta],
  ];

  return (
    <SheetScreen
      titulo={K().titulo}
      onClose={() => router.back()}
      rodape={
        <View style={{ gap: 12 }}>
          <Botao label={K().ver(sobram)} onPress={() => router.back()} desligado={!sobram} />
          <Pressable onPress={v.limparFolha} style={({ pressed }) => [{ alignSelf: 'center', padding: 6, opacity: pressed ? 0.6 : 1 }]}>
            <Txt v="label" c={c.accent2}>{K().limpar}</Txt>
          </Pressable>
        </View>
      }
    >
      <View style={{ marginTop: 18, gap: 26 }}>
        {cidades.length > 1 ? (
          <Campo rotulo={K().cidade} nu>
            <Opcoes>
              <Opc label={K().todasAsCidades} on={!v.cidade} onPress={() => v.mudar({ cidade: '' })} />
              {cidades.map((cid) => (
                <Opc
                  key={cid.id}
                  label={`${cid.cidade} · ${cid.uf}`}
                  on={v.cidade === cid.id}
                  onPress={() => v.mudar({ cidade: cid.id })}
                />
              ))}
            </Opcoes>
          </Campo>
        ) : null}

        <Campo rotulo={K().modalidade} nu>
          <Opcoes>
            {modalidades.map(([id, rotulo]) => (
              <Opc key={id || 'todas'} label={rotulo} on={v.modalidade === id} onPress={() => v.mudar({ modalidade: id })} />
            ))}
          </Opcoes>
        </Campo>

        <Campo rotulo={K().convenio} nu>
          <Opcoes>
            <Opc label={K().qualquer} on={!v.convenio} onPress={() => v.mudar({ convenio: '' })} />
            <Opc label={K().particular} on={v.convenio === 'particular'} onPress={() => v.mudar({ convenio: 'particular' })} />
            {convenios.map((nome) => (
              <Opc key={nome} label={nome} on={v.convenio === nome} onPress={() => v.mudar({ convenio: nome })} />
            ))}
          </Opcoes>
        </Campo>

        <Campo rotulo={K().dia} nu>
          <Opcoes>
            <Opc label={K().qualquerDia} on={v.dia === null} onPress={() => v.mudar({ dia: null })} />
            {dias.map((d) => (
              <Opc key={d} label={maiuscula(WD()[d])} on={v.dia === d} onPress={() => v.mudar({ dia: d })} />
            ))}
          </Opcoes>
        </Campo>
      </View>
    </SheetScreen>
  );
}
