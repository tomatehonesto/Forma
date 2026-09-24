import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  carregarRede, buscar, useVitrine, cidadesDaRede, conveniosDaRede, diasDaRede, especialidadesDaBusca,
  nomeDaEspecialidade, type Clinica, type Filtro, type Filtros,
} from '../logic/rede';
import { diasDaSemana, maiuscula } from '../logic/time';
import { Txt, Row, SheetScreen } from '../ui/kit';
import { Cartao } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

const K = () => T.rede.folha;

/* ============================================================
   UM FILTRO DA VITRINE — a folha que o chip abre

   Uma pergunta por folha, e a resposta fecha a folha: é escolha única, e
   o toque que escolhe é o mesmo que confirma. Quem quer desfazer toca na
   primeira linha, que é sempre o "qualquer".

   ⚠️ CADA LINHA DIZ QUANTAS CLÍNICAS SOBRAM com ela, contando os outros
   filtros que já estão ligados. A que não deixaria ninguém aparece
   apagada e não se toca — escolhê-la seria pedir uma lista vazia.

   ⚠️ E SÓ ENTRA O QUE A REDE TEM. Convênio, dia e cidade saem da lista
   de clínicas, e não de uma tabela fixa: oferecer domingo sem ninguém
   que atenda no domingo seria desenhar uma porta para um quarto vazio.
   ============================================================ */

type Opcao = { id: string; nome: string; valor: Partial<Filtros>; on: boolean };

export default function FiltroDaRede() {
  const router = useRouter();
  const { qual: q } = useLocalSearchParams<{ qual?: string }>();
  const qual = (['especialidade', 'convenio', 'modalidade', 'dia', 'cidade'].includes(q ?? '') ? q : 'especialidade') as Filtro;
  const v = useVitrine();
  const [lista, setLista] = useState<Clinica[]>([]);
  useEffect(() => { carregarRede().then(setLista).catch(() => {}); }, []);

  const opcoes = useMemo((): Opcao[] => {
    if (qual === 'especialidade') {
      return [
        { id: '', nome: K().todas, valor: { especialidade: '' }, on: !v.especialidade },
        ...especialidadesDaBusca(lista, { ...v, especialidade: '' }, v.perto).map(([e]) => ({
          id: e, nome: nomeDaEspecialidade(e), valor: { especialidade: e }, on: v.especialidade === e,
        })),
      ];
    }
    if (qual === 'convenio') {
      return [
        { id: '', nome: K().qualquer, valor: { convenio: '' }, on: !v.convenio },
        { id: 'particular', nome: T.rede.particular, valor: { convenio: 'particular' }, on: v.convenio === 'particular' },
        ...conveniosDaRede(lista).map((x) => ({ id: x, nome: x, valor: { convenio: x }, on: v.convenio === x })),
      ];
    }
    if (qual === 'modalidade') {
      return [
        { id: '', nome: K().presencialOuTele, valor: { modalidade: '' }, on: !v.modalidade },
        { id: 'presencial', nome: K().presencial, valor: { modalidade: 'presencial' }, on: v.modalidade === 'presencial' },
        { id: 'teleconsulta', nome: K().teleconsulta, valor: { modalidade: 'teleconsulta' }, on: v.modalidade === 'teleconsulta' },
      ];
    }
    if (qual === 'dia') {
      return [
        { id: '', nome: K().qualquerDia, valor: { dia: null }, on: v.dia === null },
        ...diasDaRede(lista).map((d) => ({
          id: String(d), nome: maiuscula(diasDaSemana()[d]), valor: { dia: d }, on: v.dia === d,
        })),
      ];
    }
    return [
      { id: '', nome: K().todasAsCidades, valor: { cidade: '' }, on: !v.cidade },
      ...cidadesDaRede(lista).map((x) => ({
        id: x.id, nome: `${x.cidade} · ${x.uf}`, valor: { cidade: x.id }, on: v.cidade === x.id,
      })),
    ];
  }, [qual, lista, v]);

  const escolher = (o: Opcao) => {
    v.mudar(o.valor);
    router.back();
  };

  return (
    <SheetScreen titulo={K()[qual]} onClose={() => router.back()}>
      <View style={{ marginTop: 14 }}>
        <Cartao>
          {opcoes.map((o) => (
            <Linha
              key={o.id || 'todas'}
              nome={o.nome}
              n={buscar(lista, { ...v, ...o.valor }, v.perto).length}
              on={o.on}
              onPress={() => escolher(o)}
            />
          ))}
        </Cartao>
      </View>
    </SheetScreen>
  );
}

/* A linha: o nome, quantas clínicas sobram, e o visto na escolhida. */
function Linha({ nome, n, on, onPress }: { nome: string; n: number; on: boolean; onPress: () => void }) {
  const { c } = useTheme();
  const vazia = n === 0 && !on;
  return (
    <Pressable
      onPress={vazia ? undefined : onPress}
      disabled={vazia}
      style={({ pressed }) => [{ opacity: vazia ? 0.4 : pressed ? 0.6 : 1 }]}
    >
      <Row gap={12} style={{ paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center' }}>
        <Txt v="body" c={on ? c.tx : c.tx2} style={{ flex: 1 }}>{nome}</Txt>
        <Txt v="caption" c={c.tx4}>{n}</Txt>
        <View style={{ width: 18, alignItems: 'flex-end' }}>
          {on ? <Icon name="check" size={16} color={c.accent} sw={2.4} /> : null}
        </View>
      </Row>
    </Pressable>
  );
}
