import React, { useEffect, useMemo, useState } from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  carregarRede, buscar, useVitrine, redeDeExemplo, cidadesDaRede, nomeDaEspecialidade,
  especialidadesDaClinica, responsavelDe, ondeDoCartao, atendeHoje, horarioTxt, SEMANA_DE_CONSULTA,
  type Clinica, type Resultado, type Filtro,
} from '../logic/rede';
import { inicialDoDia } from '../logic/alertas';
import { localizacaoDisponivel, pedirLocalizacao } from '../logic/localizacao';
import { WD, maiuscula } from '../logic/time';
import { Txt, Row, Vazio, Rolagem } from '../ui/kit';
import { Aviso, Cartao } from '../ui/internas';
import { BarraQueColapsa } from '../ui/capa';
import { Nevoa } from '../ui/nevoa';
import { Icon } from '../ui/Icon';
import { fotoDaRede, focoDaRede, imagensDaRede, iniciaisDaClinica } from '../ui/retratos';
import { useTheme } from '../ui/useTheme';
import { ty, radius, font } from '../theme';
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
                <CartaoDaClinica key={r.c.id} r={r} convenio={v.convenio} onPress={() => router.push(`/clinica?rede=${r.c.id}` as any)} />
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
   Sem retrato, a foto da clínica; sem nenhuma das duas, a névoa da paleta
   com as iniciais — a mesma névoa que a clínica sem foto tem no alto da
   tela dela.

   ⚠️ E A IMAGEM OCUPA A ALTURA TODA, encostada na borda. Era um quadrado
   de 72 dentro do respiro do cartão, e cada linha a mais de texto deixava
   um vão embaixo dele; agora a imagem é a coluna da esquerda, com 128 de
   largura, e cresce com o cartão. Os cantos da esquerda são os do cartão,
   e os da direita têm o mesmo raio — a imagem lê como uma peça, e não
   como uma faixa cortada.

   ⚠️ O REGISTRO NO CONSELHO NÃO ESTÁ AQUI, e está em /clinica, ao lado
   do nome de cada pessoa da equipe. O cartão responde se vale abrir; a
   credencial é o que se confere depois de abrir.

   ⚠️ E O CONVÊNIO É UMA LINHA SÓ, EM AZUL — "Aceita convênios" —, e não
   a lista. Já foi uma etiqueta por convênio, depois a lista numa linha
   com "+N", depois uma etiqueta; nas duas primeiras o cartão lia nomes
   que a pessoa não procurava, e a terceira pesava mais que o endereço. A
   lista inteira está na clínica. Com o filtro de convênio ligado, a
   linha diz o do filtro ("Aceita Unimed"); a clínica só particular não
   leva linha nenhuma.

   A teleconsulta não está no cartão: ela é filtro (Modalidade) e está na
   clínica, ao lado do horário.

   ⚠️ A COR DO CARTÃO É A AGENDA. Os sete dias em inicial, com os de
   atendimento em azul — a semana inteira num olhar, sem uma frase —, e
   "Atende hoje" em verde sobre a foto, quando hoje é dia e o horário
   ainda não acabou. As duas cores dizem uma coisa cada; nenhuma é enfeite.
------------------------------------------------------------------ */
/* ⚠️ TODOS OS CARTÕES TÊM A MESMA ALTURA, e é isso que faz a lista ler
   como lista. Para caber, cada linha do texto é UMA linha — o nome corta
   com reticências —, e o lugar da etiqueta de convênio existe mesmo sem
   ela. Quem quer o nome inteiro ou a lista de convênios abre a clínica. */
const ALTURA_DO_CARTAO = 158;

function CartaoDaClinica({ r, convenio, onPress }: { r: Resultado; convenio: string; onPress: () => void }) {
  const S = useStore((s) => s.S);
  const { c, isDark } = useTheme();
  const cl = r.c;
  const rosto = responsavelDe(cl);
  const retrato = fotoDaRede(rosto);
  const foto = retrato ?? imagensDaRede(cl).foto;

  const pedido = convenio && convenio !== 'particular' && cl.convenios.includes(convenio) ? convenio : '';
  const aceita = pedido ? K().aceita(pedido) : cl.convenios.length ? K().aceitaConvenios : '';
  const hoje = atendeHoje(cl);
  /* A etiqueta mora sobre a foto, então precisa ser legível sobre
     qualquer uma: verde claro com texto escuro no modo claro, verde cheio
     com o texto na cor do fundo no escuro. */
  const [fundoHoje, tintaHoje] = isDark ? [c.ok, c.bg] : [c.okBg, c.ok];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}>
      <Cartao>
        <Row style={{ alignItems: 'stretch', height: ALTURA_DO_CARTAO }}>
          <View style={{
            width: 128, backgroundColor: c.bg2, overflow: 'hidden',
            borderTopRightRadius: radius.card, borderBottomRightRadius: radius.card,
          }}>
            {foto ? (
              <Image
                source={foto}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                contentPosition={retrato ? focoDaRede(rosto) : 'center'}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                <Nevoa altura={200} capa />
                <Txt v="h2" c={isDark ? c.onHero : c.accent2}>{iniciaisDaClinica(cl.nome)}</Txt>
              </View>
            )}
            {hoje ? (
              <View style={{
                position: 'absolute', left: 8, bottom: 8, maxWidth: 112,
                flexDirection: 'row', alignItems: 'center', gap: 5,
                backgroundColor: fundoHoje, borderRadius: radius.pill,
                paddingLeft: 7, paddingRight: 9, paddingVertical: 3,
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tintaHoje }} />
                <Txt v="micro" c={tintaHoje} numberOfLines={1} style={{ fontFamily: font.bodyMed, flexShrink: 1 }}>
                  {K().atendeHoje}
                </Txt>
              </View>
            ) : null}
          </View>
          <View style={{ flex: 1, paddingVertical: 14, paddingLeft: 14, paddingRight: 6, justifyContent: 'center' }}>
            <Txt v="bodyMed" numberOfLines={1}>{cl.nome}</Txt>
            <Txt v="caption" c={c.tx2} numberOfLines={1} style={{ marginTop: 1 }}>{especialidadesDaClinica(cl)}</Txt>
            <View style={{ marginTop: 8, gap: 3 }}>
              <Onde onde={ondeDoCartao(S, r)} />
              {/* O lugar da linha tem altura fixa, com ou sem ela: é o que
                  mantém o nome e os dias na mesma altura em todos. */}
              <View style={{ height: 21 }}>
                {aceita ? <Meta ic="shield" texto={aceita} azul /> : null}
              </View>
            </View>
            {/* A semana em iniciais. Quem usa leitor de tela ouve os dias
                e o horário por extenso, e não sete letras soltas. */}
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 10 }}
              accessible
              accessibilityLabel={horarioTxt(cl)}
            >
              {SEMANA_DE_CONSULTA.map((d) => {
                const atende = cl.dias.includes(d);
                return (
                  <View
                    key={d}
                    style={{
                      width: 20, height: 20, borderRadius: 6,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: atende ? c.accentWeak : 'transparent',
                    }}
                  >
                    <Txt v="micro" c={atende ? c.accent : c.tx4} style={{ fontFamily: atende ? font.bodyMed : font.body }}>
                      {inicialDoDia(d)}
                    </Txt>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={{ justifyContent: 'center', paddingRight: 14 }}>
            <Icon name="chev" size={14} color={c.tx4} sw={2} />
          </View>
        </Row>
      </Cartao>
    </Pressable>
  );
}

/* "Pinheiros • 7,8 km" — o bairro encurta com reticências, e a distância
   fica sempre inteira: ela é a razão de a linha ter mudado. Quem usa
   leitor de tela ouve a frase inteira. */
function Onde({ onde }: { onde: { lugar: string; distancia: string | null } }) {
  const { c } = useTheme();
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}
      accessible
      accessibilityLabel={onde.distancia ? K().lugarEDistancia(onde.lugar, onde.distancia) : onde.lugar}
    >
      <View style={{ marginTop: 3 }}>
        <Icon name="pin" size={13} color={c.tx4} sw={1.9} />
      </View>
      <Txt v="caption" c={c.tx3} numberOfLines={1} style={{ flexShrink: 1 }}>{onde.lugar}</Txt>
      {onde.distancia ? <Txt v="caption" c={c.tx3} numberOfLines={1} style={{ flexShrink: 0 }}>{`• ${onde.distancia}`}</Txt> : null}
    </View>
  );
}

/* Uma linha do cartão: o ícone pequeno e o texto recuado. A do convênio
   sai em azul — é a única que responde "aceita o meu?". */
function Meta({ ic, texto, azul }: { ic: string; texto: string; azul?: boolean }) {
  const { c } = useTheme();
  return (
    <Row gap={6} style={{ alignItems: 'flex-start' }}>
      <View style={{ marginTop: 3 }}>
        <Icon name={ic} size={13} color={azul ? c.accent : c.tx4} sw={1.9} />
      </View>
      <Txt v="caption" c={azul ? c.accent2 : c.tx3} numberOfLines={1} style={{ flex: 1 }}>{texto}</Txt>
    </Row>
  );
}
