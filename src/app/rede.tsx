import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  carregarRede, buscar, especialidadesDaBusca, useVitrine, filtrosNaFolha, redeDeExemplo,
  nomeDaEspecialidade, registroTxt, horarioTxt, distanciaTxt, semTitulo, cidadesDaRede,
  type Profissional, type Resultado,
} from '../logic/rede';
import { localizacaoDisponivel, pedirLocalizacao } from '../logic/localizacao';
import { WD, maiuscula } from '../logic/time';
import { Txt, Row, Retrato, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Aviso, Chips, Cartao, Linha, Selo } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';
import { T } from '../textos';

const K = () => T.rede;

/* ============================================================
   A VITRINE DA REDE PARCEIRA

   Para quem está no Brasil e não tem acompanhamento nenhum: ela se abre
   pelo bloco do fim da aba Cuidado, e só quando há de onde ler a lista
   (ver `redeNoAr`, em logic/rede).

   ⚠️ A ORDEM É DISTÂNCIA OU NOME, e nada além disso. Sem a localização
   da pessoa, a lista vem em ordem alfabética — "destaque" pediria um
   critério, e a tela não inventa um.

   ⚠️ E O CARTÃO NÃO TEM NOTA. Nota de profissional precisaria de alguém
   avaliando, e ninguém avalia ninguém aqui.
   ============================================================ */

type EstadoDoLugar = '' | 'pedindo' | 'negada' | 'falhou';

export default function Rede() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const v = useVitrine();

  const [lista, setLista] = useState<Profissional[] | null>(null);
  const [erro, setErro] = useState(false);
  const [lugar, setLugar] = useState<EstadoDoLugar>('');

  const ler = () => {
    setErro(false);
    carregarRede().then(setLista).catch(() => setErro(true));
  };
  useEffect(() => { ler(); }, []);

  const resultados = useMemo(() => (lista ? buscar(lista, v, v.perto) : []), [lista, v]);
  const especialidades = useMemo(() => (lista ? especialidadesDaBusca(lista, v, v.perto) : []), [lista, v]);
  const semEspecialidade = useMemo(
    () => (lista ? buscar(lista, { ...v, especialidade: '' }, v.perto).length : 0), [lista, v]);

  const alternarLugar = async () => {
    if (v.perto) { v.usarPonto(null); return; }
    setLugar('pedindo');
    const r = await pedirLocalizacao();
    if (r.ok) { v.usarPonto(r.ponto); setLugar(''); return; }
    setLugar(r.motivo === 'negada' ? 'negada' : 'falhou');
  };

  /* O resumo dos filtros ligados, no lugar da explicação do que eles são. */
  const resumo = (() => {
    const partes: string[] = [];
    if (v.cidade && lista) {
      const cid = cidadesDaRede(lista).find((x) => x.id === v.cidade);
      if (cid) partes.push(cid.cidade);
    }
    if (v.modalidade) partes.push(v.modalidade === 'presencial' ? K().folha.presencial : K().folha.teleconsulta);
    if (v.convenio) partes.push(v.convenio === 'particular' ? K().folha.particular : v.convenio);
    if (v.dia !== null) partes.push(maiuscula(WD()[v.dia]));
    return partes.join(' · ');
  })();
  const nFiltros = filtrosNaFolha(v);

  const L = K().localizacao;
  const linhaDoLugar = v.perto
    ? { titulo: L.ligada, sub: L.ligadaSub }
    : { titulo: L.usar, sub: lugar === 'pedindo' ? L.pedindo : lugar === 'negada' ? L.negada : lugar === 'falhou' ? L.falhou : L.usarSub };

  return (
    <TelaInterna titulo={K().titulo}>
      <Titulao titulo={K().titulo} lead={K().lead} />

      {redeDeExemplo() ? <Aviso ic="info" titulo={K().exemploTitulo} texto={K().exemploTexto} /> : null}

      <View style={{ gap: 12 }}>
        {/* a busca — o mesmo campo de Alimentos */}
        <Row
          gap={10}
          style={{
            backgroundColor: c.bg1, borderRadius: radius.md,
            borderWidth: 1, borderColor: c.line, paddingHorizontal: 13,
          }}
        >
          <Icon name="filter" size={16} color={c.tx4} sw={1.9} />
          <TextInput
            value={v.termo}
            onChangeText={(termo) => v.mudar({ termo })}
            placeholder={K().busca}
            placeholderTextColor={c.tx4}
            autoCorrect={false}
            style={[ty.body, { flex: 1, color: c.tx, paddingVertical: 13 }]}
          />
        </Row>

        {/* A ESPECIALIDADE EM PRATELEIRA, como em Alimentos: a contagem é
            a do que o toque entrega, com os outros filtros já aplicados. */}
        {especialidades.length > 1 || v.especialidade ? (
          <Chips
            itens={[
              { id: '', label: K().todas, n: semEspecialidade },
              ...especialidades.map(([e, n]) => ({ id: e, label: nomeDaEspecialidade(e), n })),
            ]}
            valor={v.especialidade}
            onChange={(id) => v.mudar({ especialidade: id as typeof v.especialidade })}
          />
        ) : null}

        <Cartao>
          {localizacaoDisponivel() ? (
            <Linha
              ic="pin"
              titulo={linhaDoLugar.titulo}
              sub={linhaDoLugar.sub}
              seta={false}
              onPress={lugar === 'pedindo' ? undefined : alternarLugar}
            />
          ) : null}
          <Linha
            ic="filter"
            titulo={K().filtros}
            sub={resumo || K().filtrosSub}
            selo={nFiltros ? String(nFiltros) : undefined}
            onPress={() => router.push('/rede-filtros' as any)}
          />
        </Cartao>
      </View>

      {/* ---- a lista ---- */}
      {erro ? (
        <Vazio ic="alerta" titulo={K().erroTitulo} texto={K().erroTexto} acao={K().tentarDeNovo} onAcao={ler} />
      ) : !lista ? null : !resultados.length ? (
        <Vazio ic="steth" titulo={K().vazioTitulo} texto={K().vazioTexto} acao={K().limparFiltros} onAcao={v.limparTudo} />
      ) : (
        <View style={{ gap: 12 }}>
          <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>{K().resultados(resultados.length)}</Txt>
          {resultados.map((r) => (
            <CartaoDoProfissional key={r.p.id} r={r} onPress={() => router.push(`/profissional?id=${r.p.id}` as any)} />
          ))}
        </View>
      )}

      {/* A porta de quem já chegou pelo consultório. */}
      <Pressable
        onPress={() => router.push('/parceiros' as any)}
        style={({ pressed }) => [{ alignSelf: 'center', paddingVertical: 8, opacity: pressed ? 0.6 : 1 }]}
      >
        <Txt v="label" c={c.accent2}>{K().jaTenhoCodigo}</Txt>
      </Pressable>
    </TelaInterna>
  );
}

/* ------------------------------------------------------------------
   O CARTÃO — quem é, onde atende e quando

   Três perguntas, na ordem em que a pessoa as faz: é o tipo de
   profissional que procuro? fica perto? atende no dia que eu posso?
------------------------------------------------------------------ */
function CartaoDoProfissional({ r, onPress }: { r: Resultado; onPress: () => void }) {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const { p, c: cons } = r;

  const onde = cons.presencial && cons.bairro
    ? [`${cons.bairro}, ${cons.cidade}`, r.km != null ? distanciaTxt(S, r.km) : ''].filter(Boolean).join(' · ')
    : K().soTeleconsulta;
  const mais = r.outros ? ` · ${K().outrosLocais(r.outros)}` : '';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <Cartao>
        <Row gap={14} style={{ padding: 16, alignItems: 'flex-start' }}>
          <Retrato foto={p.foto} nome={semTitulo(p.nome)} tam={52} />
          <View style={{ flex: 1 }}>
            <Txt v="bodyMed">{p.nome}</Txt>
            <Txt v="caption" c={c.tx2} style={{ marginTop: 1 }}>
              {p.especialidades.map(nomeDaEspecialidade).join(' · ')}
            </Txt>
            <Txt v="tag" c={c.tx3} style={{ marginTop: 2 }}>{registroTxt(p)}</Txt>

            <Row gap={7} style={{ marginTop: 12, alignItems: 'flex-start' }}>
              <View style={{ marginTop: 3 }}><Icon name="pin" size={14} color={c.tx4} sw={1.9} /></View>
              <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{onde}{mais}</Txt>
            </Row>
            <Row gap={7} style={{ marginTop: 5, alignItems: 'flex-start' }}>
              <View style={{ marginTop: 3 }}><Icon name="clock" size={14} color={c.tx4} sw={1.9} /></View>
              <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{horarioTxt(cons)}</Txt>
            </Row>

            {cons.presencial && cons.teleconsulta ? (
              <View style={{ marginTop: 12 }}><Selo label={K().teleconsulta} tom="neutra" /></View>
            ) : null}
          </View>
          <View style={{ marginTop: 4 }}><Icon name="chev" size={14} color={c.tx4} sw={2} /></View>
        </Row>
      </Cartao>
    </Pressable>
  );
}
