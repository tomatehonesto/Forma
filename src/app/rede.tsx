import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  carregarRede, buscar, useVitrine, redeDeExemplo, cidadesDaRede, nomeDaEspecialidade,
  especialidadesDaClinica, responsavelDe, ondeTxt,
  type Clinica, type Resultado, type Filtro,
} from '../logic/rede';
import { localizacaoDisponivel, pedirLocalizacao } from '../logic/localizacao';
import { WD, maiuscula } from '../logic/time';
import { Txt, Row, Vazio, Rolagem } from '../ui/kit';
import { Aviso, Cartao } from '../ui/internas';
import { BarraQueColapsa } from '../ui/capa';
import { Nevoa } from '../ui/nevoa';
import { Icon } from '../ui/Icon';
import { fotoDaRede, focoDaRede, imagensDaRede, iniciaisDaClinica } from '../ui/retratos';
import { useTheme } from '../ui/useTheme';
import { ty, radius } from '../theme';
import { T } from '../textos';

const K = () => T.rede;
const PAD = 16;

/* ============================================================
   A VITRINE DA REDE PARCEIRA

   Para quem está no Brasil e não tem acompanhamento nenhum: ela se abre
   pelo cartão do fim da aba Cuidado, e só quando há de onde ler a lista
   (ver `redeNoAr`, em logic/rede). Cada cartão é uma CLÍNICA, e tocar
   nele abre /clinica — a mesma tela de quem já tem vínculo, na versão
   de quem olha de fora.

   ⚠️ ELA NÃO É MAIS UMA TELA INTERNA. As telas internas começam no
   título grande sobre o fundo liso, e esta é uma porta de entrada: o alto
   é a névoa da paleta (ui/nevoa), o título mora dentro dela, e a barra só
   ganha fundo quando ele sobe.

   ⚠️ OS FILTROS SÃO CHIPS, e cada chip abre a sua folha. A fileira diz de
   uma vez o que está ligado — o chip ligado mostra o valor no lugar do
   nome —, e cada pergunta abre só as suas respostas.

   ⚠️ A ORDEM É DISTÂNCIA OU NOME, e nada além disso. "Destaque" pediria
   um critério, e o cartão não tem nota: nota pediria alguém avaliando.
   ============================================================ */

type EstadoDoLugar = '' | 'pedindo' | 'negada' | 'falhou';

const FILTROS: Filtro[] = ['especialidade', 'convenio', 'modalidade', 'dia', 'cidade'];

export default function Rede() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const v = useVitrine();

  const [lista, setLista] = useState<Clinica[] | null>(null);
  const [erro, setErro] = useState(false);
  const [lugar, setLugar] = useState<EstadoDoLugar>('');
  const [passou, setPassou] = useState(false);

  const ler = () => {
    setErro(false);
    carregarRede().then(setLista).catch(() => setErro(true));
  };
  useEffect(() => { ler(); }, []);

  const resultados = useMemo(() => (lista ? buscar(lista, v, v.perto) : []), [lista, v]);

  const alternarLugar = async () => {
    if (v.perto) { v.usarPonto(null); return; }
    setLugar('pedindo');
    const r = await pedirLocalizacao();
    if (r.ok) { v.usarPonto(r.ponto); setLugar(''); return; }
    setLugar(r.motivo === 'negada' ? 'negada' : 'falhou');
  };

  /* O chip ligado mostra o valor escolhido no lugar do nome do filtro. */
  const valor = (qual: Filtro): string | null => {
    if (qual === 'especialidade') return v.especialidade ? nomeDaEspecialidade(v.especialidade) : null;
    if (qual === 'convenio') return v.convenio ? (v.convenio === 'particular' ? K().particular : v.convenio) : null;
    if (qual === 'modalidade') return v.modalidade ? (v.modalidade === 'presencial' ? K().soPresencial : K().teleconsulta) : null;
    if (qual === 'dia') return v.dia !== null ? maiuscula(WD()[v.dia]) : null;
    const cid = v.cidade && lista ? cidadesDaRede(lista).find((x) => x.id === v.cidade) : null;
    return cid ? cid.cidade : null;
  };

  const L = K().localizacao;
  const avisoDoLugar = lugar === 'pedindo' ? L.pedindo : lugar === 'negada' ? L.negada : lugar === 'falhou' ? L.falhou : '';
  /* O título desce para dentro da névoa, e não logo abaixo do botão: é
     o respiro de cima que faz a cor ser o cabeçalho da tela. */
  const topo = insets.top + 128;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Rolagem
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        scrollEventThrottle={16}
        onScroll={(ev) => setPassou(ev.nativeEvent.contentOffset.y > 120)}
      >
        <Nevoa altura={topo + 280} />

        {/* ---- o título, dentro da névoa ---- */}
        <View style={{ paddingTop: topo, paddingHorizontal: PAD + 2 }}>
          <Txt v="hero" style={{ letterSpacing: -1 }}>{K().titulo}</Txt>
          <Txt v="note" c={c.tx2} style={{ marginTop: 10 }}>{K().lead}</Txt>
        </View>

        <View style={{ paddingHorizontal: PAD, marginTop: 26, gap: 14 }}>
          {redeDeExemplo() ? <Aviso ic="info" titulo={K().exemploTitulo} texto={K().exemploTexto} /> : null}

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
        </View>

        {/* ---- os chips ---- */}
        <Rolagem
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
          contentContainerStyle={{ paddingHorizontal: PAD, gap: 8 }}
        >
          {localizacaoDisponivel() ? (
            <Chip
              ic="pin"
              rotulo={K().perto}
              on={!!v.perto}
              onPress={lugar === 'pedindo' ? undefined : alternarLugar}
            />
          ) : null}
          {FILTROS.map((qual) => {
            const escolhido = valor(qual);
            return (
              <Chip
                key={qual}
                rotulo={escolhido ?? K().filtro[qual]}
                on={!!escolhido}
                seta
                onPress={() => router.push(`/rede-filtros?qual=${qual}` as any)}
              />
            );
          })}
        </Rolagem>
        {avisoDoLugar ? (
          <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: PAD + 2, marginTop: 10 }}>{avisoDoLugar}</Txt>
        ) : null}

        {/* ---- a lista ---- */}
        <View style={{ paddingHorizontal: PAD, marginTop: 22, gap: 12 }}>
          {erro ? (
            <Vazio ic="alerta" titulo={K().erroTitulo} texto={K().erroTexto} acao={K().tentarDeNovo} onAcao={ler} />
          ) : !lista ? null : !resultados.length ? (
            <Vazio ic="steth" titulo={K().vazioTitulo} texto={K().vazioTexto} acao={K().limparFiltros} onAcao={v.limparTudo} />
          ) : (
            <>
              <Txt v="caption" c={c.tx3} style={{ paddingHorizontal: 2 }}>{K().resultados(resultados.length)}</Txt>
              {resultados.map((r) => (
                <CartaoDaClinica key={r.c.id} r={r} onPress={() => router.push(`/clinica?rede=${r.c.id}` as any)} />
              ))}
            </>
          )}

          {/* A porta de quem já chegou pela clínica. */}
          <Pressable
            onPress={() => router.push('/parceiros' as any)}
            style={({ pressed }) => [{ alignSelf: 'center', paddingVertical: 10, opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.accent2}>{K().jaTenhoCodigo}</Txt>
          </Pressable>
        </View>
      </Rolagem>

      <BarraQueColapsa titulo={K().titulo} passou={passou} repouso="normal" />
    </View>
  );
}

/* ------------------------------------------------------------------
   O CHIP DE FILTRO

   Contorno quando desligado, cheio quando ligado — o mesmo par de
   `Chips`, em ui/internas. A seta para baixo diz que ele abre alguma
   coisa; o de localização não tem seta porque liga e desliga ali mesmo.
------------------------------------------------------------------ */
function Chip({ rotulo, on, seta, ic, onPress }: {
  rotulo: string; on: boolean; seta?: boolean; ic?: string; onPress?: () => void;
}) {
  const { c } = useTheme();
  const tinta = on ? c.bg1 : c.tx2;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingLeft: ic ? 11 : 14, paddingRight: seta ? 11 : 14, paddingVertical: 8,
        borderRadius: radius.pill, borderWidth: 1,
        borderColor: on ? c.tx : c.line, backgroundColor: on ? c.tx : c.bg1,
        opacity: pressed ? 0.7 : 1,
      }]}
    >
      {ic ? <Icon name={ic} size={14} color={tinta} sw={2} /> : null}
      <Txt v="label" c={tinta}>{rotulo}</Txt>
      {seta ? <Icon name="chevdown" size={12} color={tinta} sw={2.2} /> : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------
   O CARTÃO DA CLÍNICA — quem é, onde fica e que convênio aceita

   ⚠️ O ROSTO É DE QUEM RESPONDE PELA CLÍNICA. Clínica se escolhe por
   gente, e a foto de uma recepção diz menos do que a de quem vai atender.
   Sem retrato, a foto da clínica; sem nenhuma das duas, as iniciais dela.

   ⚠️ O REGISTRO NO CONSELHO NÃO ESTÁ AQUI, e está em /clinica, ao lado
   do nome de cada pessoa da equipe. O cartão responde se vale abrir; a
   credencial é o que se confere depois de abrir.

   ⚠️ E OS CONVÊNIOS SÃO ETIQUETAS, porque é o que se varre: a pessoa
   procura o nome do dela e não lê os outros. Até três, e o resto vira
   "+2" — a lista inteira está na clínica.
------------------------------------------------------------------ */
function CartaoDaClinica({ r, onPress }: { r: Resultado; onPress: () => void }) {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const cl = r.c;
  const rosto = responsavelDe(cl);
  const retrato = fotoDaRede(rosto);
  const foto = retrato ?? imagensDaRede(cl).foto;

  const convenios = [...cl.convenios, ...(cl.particular ? [K().particular] : [])];
  const MAX = 3;
  const vistos = convenios.slice(0, MAX);
  const resto = convenios.length - vistos.length;
  const tele = cl.presencial && cl.teleconsulta;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <Cartao>
        <View style={{ padding: 14, gap: 14 }}>
          <Row gap={14} style={{ alignItems: 'center' }}>
            {foto ? (
              <Image
                source={foto}
                style={{ width: 72, height: 72, borderRadius: radius.md, backgroundColor: c.bg2 }}
                contentFit="cover"
                contentPosition={retrato ? focoDaRede(rosto) : 'center'}
              />
            ) : (
              <View style={{
                width: 72, height: 72, borderRadius: radius.md,
                backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
              }}>
                <Txt v="h2" c={c.accent}>{iniciaisDaClinica(cl.nome)}</Txt>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed" numberOfLines={2}>{cl.nome}</Txt>
              <Txt v="caption" c={c.tx2} numberOfLines={1} style={{ marginTop: 1 }}>{especialidadesDaClinica(cl)}</Txt>
              <Row gap={5} style={{ marginTop: 6, alignItems: 'center' }}>
                <Icon name="pin" size={13} color={c.tx4} sw={1.9} />
                <Txt v="caption" c={c.tx3} numberOfLines={1} style={{ flex: 1 }}>{ondeTxt(S, r)}</Txt>
              </Row>
            </View>
            <Icon name="chev" size={14} color={c.tx4} sw={2} />
          </Row>

          {vistos.length || tele ? (
            <Row gap={6} style={{ flexWrap: 'wrap' }}>
              {tele ? <Etiqueta texto={K().teleconsulta} tom="acao" /> : null}
              {vistos.map((x) => <Etiqueta key={x} texto={x} />)}
              {resto ? <Etiqueta texto={K().maisConvenios(resto)} /> : null}
            </Row>
          ) : null}
        </View>
      </Cartao>
    </Pressable>
  );
}

/* A etiqueta de convênio é a mesma de /clinica, em tamanho de cartão:
   `limeSoft`, porque convênio é fato administrativo e não clínico. A de
   teleconsulta leva a cor de ação — é modalidade, não convênio. */
function Etiqueta({ texto, tom = 'convenio' }: { texto: string; tom?: 'convenio' | 'acao' }) {
  const { c } = useTheme();
  const [bg, fg] = tom === 'acao' ? [c.accentWeak, c.accent2] : [c.limeSoft, c.limeSoftInk];
  return (
    <View style={{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Txt v="tag" c={fg}>{texto}</Txt>
    </View>
  );
}
