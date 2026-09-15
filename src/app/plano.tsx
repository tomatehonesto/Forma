import React from 'react';
import { View, Pressable, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { MEDS, CADENCE_DAYS } from '../logic/meds';
import {
  ATIVIDADES, FAIXAS_IMC, curWeight, faixaDoIMC, idadeDe, litros, planoDoCadastro,
} from '../logic/derive';
import type { PlanoInicial } from '../logic/derive';
import { FONTES } from '../logic/fontes';
import { MO_LONG, doseTxt, kgTxt, milhar, nf, now, startOfDay } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Botao, Grade2 } from '../ui/internas';
import { AreaCurve } from '../ui/charts';
import { Lavagem } from '../ui/lavagem';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   O PLANO — o que as respostas do cadastro viraram

   Vive em dois lugares e é o mesmo componente nos dois: no fim do
   cadastro, como a devolutiva de quem acabou de responder quinze
   perguntas, e em /plano, para quem quiser rever depois. A diferença
   entre os dois é uma linha — para onde vai o botão do rodapé.

   ELE NÃO LÊ A LOJA. Recebe os números prontos em `dados`, porque no
   cadastro eles ainda não foram gravados em lugar nenhum: são respostas
   na memória de uma tela. Quem lê a loja é a rota, no fim deste arquivo.

   É UM RESUMO VISUAL, e por isso o texto é curto: toda frase aqui disputa
   espaço com um número, e o número é o assunto.

   O QUE NÃO VEIO DAS REFERÊNCIAS:

     · "você começa a ver diferença em 30 de setembro". A linha do tempo
       aqui é aritmética do ritmo escolhido, e diz isso.
     · a curva caindo em exponencial. A linha é reta porque "1 kg por
       semana" desenha uma reta, e tracejada porque nada disso aconteceu.
     · o selo de "baseado em evidência" sem nada atrás. A etiqueta do topo
       só existe porque a última seção existe, e lá cada trabalho abre.
   ============================================================ */

export type DadosDoPlano = {
  nome: string;
  peso: number;
  meta: number;
  /** kg por semana; null quando não há o que perder */
  ritmo: number | null;
  /** id do catálogo, ou 'indefinido' */
  med: string;
  dose: number | null;
  /** intervalo fora do padrão da caneta, em dias */
  intervalo: number | null;
  plano: PlanoInicial;
};

export function Plano({ dados: d, aoSair, rotuloSair }: {
  dados: DadosDoPlano;
  aoSair: () => void;
  rotuloSair: string;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const med = MEDS[d.med] ?? null;
  const padrao = CADENCE_DAYS(d.med);
  const perder = d.peso - d.meta;
  const plano = d.plano;
  const primeiro = d.nome.trim().split(' ')[0];
  const marca = d.med !== 'indefinido' && med ? ` com o ${med.label}®` : '';
  const alvo = perder > 0.05 ? `perder ${kgTxt(perder)} kg`
    : perder < -0.05 ? `ganhar ${kgTxt(-perder)} kg`
      : 'manter o seu peso';
  const inter = d.intervalo ?? padrao;
  const cadTexto = inter === 1 ? 'todos os dias'
    : inter === 7 ? 'uma vez por semana' : `a cada ${inter} dias`;
  /* A LINHA DO TEMPO É ARITMÉTICA, e não previsão. Três marcos: hoje, o
     meio do caminho e a meta, cada um com a data que o ritmo escolhido
     produz. A referência promete aqui "quando você começa a ver
     efeito"; isso ninguém sabe, e a conta do ritmo, sim. */
  const marcos = plano.semanas && d.ritmo
    ? (() => {
      const meio = Math.max(1, Math.round(plano.semanas / 2));
      const quando = (sem: number) => {
        const d = new Date(+startOfDay(now()) + sem * 7 * 86400000);
        return `${d.getDate()} de ${MO_LONG[d.getMonth()].slice(0, 3)}`;
      };
      return [
        { sem: 0, kg: d.peso, rot: 'hoje', quando: quando(0) },
        { sem: meio, kg: d.peso - (d.ritmo as number) * meio, rot: `${meio} semanas`, quando: quando(meio) },
        { sem: plano.semanas, kg: d.meta, rot: `${plano.semanas} semanas`, quando: quando(plano.semanas) },
      ];
    })()
    : null;
  const pos = (v: number) => Math.max(0, Math.min(1, (v - 15) / 25));
  /* AS CORES DA RÉGUA SÃO UMA ESCALA CATEGÓRICA, e por isso são valores
     fixos e não tokens: elas não querem dizer "fundo", "acento" ou
     "alerta" — querem dizer primeira faixa, segunda, terceira. São os
     tons da paleta do Morphi nas versões mais claras, que é o que
     sobrevive sobre o branco sem virar mancha: lavanda, turquesa, lima,
     ouro, rosa e coral. O que estava feio antes eram o verde-oliva e o
     mostarda das cores de texto, e dois vermelhos iguais no fim. */
  const CORES_IMC = ['#9D86FF', '#15E4CB', '#DDF62C', '#E0BC4A', '#F26A9B', '#FF5A5A'];
  const fxHoje = faixaDoIMC(plano.imc);
  const fxMeta = faixaDoIMC(plano.imcMeta);
  const iHoje = FAIXAS_IMC.indexOf(fxHoje);
  const iMeta = FAIXAS_IMC.indexOf(fxMeta);
  const AJUDA: [string, string, string][] = [
    ['syringe', 'Cada dose no lugar certo', 'o rodízio dos locais e o ciclo da caneta, sem você contar'],
    ['mood', 'O enjoo em números', 'o que você sente vira padrão, e o padrão vai para a consulta'],
    ['scale', 'A sua curva de peso', 'cada pesagem entra na linha, com a leitura do que mudou'],
    ['doc', 'Um resumo para a consulta', 'doses, sintomas e peso organizados numa página só'],
  ];
  const Secao = ({ t }: { t: string }) => (
    <Txt v="micro" c={c.tx4} style={{ letterSpacing: 1.2, marginBottom: 12 }}>{t}</Txt>
  );
  const cartao = { backgroundColor: c.bg1, borderRadius: radius.lg };
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <Lavagem altura={insets.top + 380} />
        <View style={{
          paddingTop: insets.top + 34, paddingHorizontal: 24, paddingBottom: 32,
          alignItems: 'center', gap: 14,
        }}>
          <View style={{
            width: 58, height: 58, borderRadius: 29, backgroundColor: c.lime,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={27} color={c.limeInk} sw={2.6} />
          </View>
          <Txt v="h1" style={{ textAlign: 'center' }}>
            {`${primeiro}, seu plano personalizado está pronto!`}
          </Txt>
          <Txt v="note" c={c.tx2} style={{ textAlign: 'center' }}>
            {`Para ${alvo}${marca}.`}
          </Txt>
          {/* A SEGUNDA ETIQUETA SÓ PODE EXISTIR PORQUE A ÚLTIMA SEÇÃO
              EXISTE. "Com base em estudos" é a frase mais fácil de
              estampar e a mais fácil de mentir; aqui ela é um índice —
              cada trabalho listado lá embaixo sustenta uma conta desta
              tela, e abre no toque. */}
          <Row style={{ gap: 8, justifyContent: 'center' }}>
            {([['user', 'Das suas respostas'], ['book', 'Com base em estudos']] as [string, string][])
              .map(([ic, t]) => (
                <Row key={t} style={{
                  gap: 6, alignItems: 'center', backgroundColor: c.bg1,
                  borderWidth: 1, borderColor: c.line, borderRadius: radius.pill,
                  paddingHorizontal: 11, paddingVertical: 7,
                }}>
                  <Icon name={ic} size={13} color={c.tx3} sw={2} />
                  <Txt v="micro" c={c.tx2}>{t}</Txt>
                </Row>
              ))}
          </Row>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 30 }}>
          {/* ---------- o dia ---------- */}
          <View>
            <Secao t="O SEU DIA" />

            {/* A ENERGIA É O NÚMERO GRANDE porque é dela que os outros
                saem: carboidrato e gordura são fatia de uma meta de
                energia, e não existem sem ela. */}
            <View style={{
              backgroundColor: c.accentWeak, borderRadius: radius.lg, padding: 16, gap: 8,
            }}>
              <Row style={{ gap: 9, alignItems: 'center' }}>
                <Icon name="flame" size={17} color={c.accent} sw={1.9} />
                <Txt v="micro" c={c.accent} style={{ letterSpacing: 1 }}>CALORIAS</Txt>
              </Row>
              <Row style={{ alignItems: 'baseline', gap: 5 }}>
                <Txt v="metric" c={c.accent}>{milhar(plano.kcal)}</Txt>
                <Txt v="caption" c={c.tx2}>kcal por dia</Txt>
              </Row>
              {/* QUANDO O RITMO NÃO CABE, A TELA DIZ. Dois quilos por
                  semana pedem 2.200 kcal de déficit por dia — mais do
                  que o gasto inteiro de muita gente. A meta para no piso
                  e a frase explica, em vez de o número aparecer menor do
                  que a conta sem motivo visível. */}
              <Txt v="caption" c={c.tx2}>
                {plano.noPiso
                  ? `No ritmo que você escolheu, a conta pediria menos do que o mínimo seguro sem acompanhamento médico. A meta parou aí.`
                  : `Do seu gasto estimado de ${milhar(plano.gasto)} kcal, menos o déficit do ritmo que você escolheu.`}
              </Txt>
            </View>

            <View style={{ marginTop: 10 }}>
              <Grade2>
                {([
                  ['utensils', c.rose, c.roseBg, 'Proteína', `${plano.prot}`, 'g'],
                  ['leaf', c.ok, c.okBg, 'Carboidrato', `${plano.carb}`, 'g'],
                  ['drop2', c.amber, c.amberBg, 'Gordura', `${plano.gord}`, 'g'],
                  ['gut', c.purple, c.purpleBg, 'Fibra', `${plano.fibra}`, 'g'],
                ] as [string, string, string, string, string, string][])
                  .map(([ic, cor, fundo, nome, val, un]) => (
                    <View key={nome} style={[cartao, { flex: 1, padding: 14 }]}>
                      <Row style={{ gap: 8, alignItems: 'center' }}>
                        <View style={{
                          width: 26, height: 26, borderRadius: 8, backgroundColor: fundo,
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Icon name={ic} size={14} color={cor} sw={1.9} />
                        </View>
                        <Txt v="caption" c={c.tx3}>{nome}</Txt>
                      </Row>
                      <Row style={{ marginTop: 10, alignItems: 'baseline' }}>
                        <Txt v="metric" style={{ fontSize: 26, lineHeight: 32 }}>{val}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginLeft: 3 }}>{un}</Txt>
                      </Row>
                    </View>
                  ))}
              </Grade2>
            </View>

            <Row style={[cartao, { marginTop: 10, padding: 14, gap: 12, alignItems: 'center' }]}>
              <View style={{
                width: 26, height: 26, borderRadius: 8, backgroundColor: c.waterBg,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="water" size={14} color={c.water} sw={1.9} />
              </View>
              <Txt v="caption" c={c.tx3} style={{ flex: 1 }}>Água</Txt>
              <Row style={{ alignItems: 'baseline' }}>
                <Txt v="metric" style={{ fontSize: 26, lineHeight: 32 }}>{litros(plano.agua)}</Txt>
                <Txt v="caption" c={c.tx3} style={{ marginLeft: 3 }}>L</Txt>
              </Row>
            </Row>
          </View>

          {/* ---------- a dose ---------- */}
          <View>
            <Secao t="A SUA DOSE" />
            <View style={[cartao, { padding: 16, gap: 12 }]}>
              {d.med === 'indefinido' ? (
                <>
                  <Row style={{ gap: 12, alignItems: 'center' }}>
                    <View style={{
                      width: 44, height: 44, borderRadius: 14, backgroundColor: c.bg2,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="syringe" size={21} color={c.tx3} sw={1.9} />
                    </View>
                    <Txt v="body" style={{ flex: 1 }}>Ainda a definir</Txt>
                  </Row>
                  <Txt v="caption" c={c.tx3}>
                    Quando você souber a caneta, eu monto a escada de doses e o ciclo.
                  </Txt>
                </>
              ) : (
                <>
                  <Row style={{ gap: 12, alignItems: 'center' }}>
                    <View style={{
                      width: 44, height: 44, borderRadius: 14, backgroundColor: c.accentWeak,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="syringe" size={21} color={c.accent} sw={1.9} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt v="body">{`${med?.label}®`}</Txt>
                      <Txt v="note" c={c.tx3} style={{ marginTop: 1 }}>{cadTexto}</Txt>
                    </View>
                    {d.dose ? (
                      <Row style={{ alignItems: 'center' }}>
                        <Txt v="metric" style={{ fontSize: 28, lineHeight: 34 }}>{doseTxt(d.dose)}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 4 }}>{med?.unit}</Txt>
                      </Row>
                    ) : null}
                  </Row>
                  <Txt v="caption" c={c.tx3}>
                    O ciclo começa na primeira aplicação que você registrar.
                  </Txt>
                </>
              )}
            </View>
          </View>

          {/* ---------- a linha do tempo ---------- */}
          {marcos ? (
            <View>
              <Secao t="ATÉ A SUA META" />
              {/* A LINHA DESCENDO, que é o que a pessoa veio ver. Ela é
                  RETA porque "1 kg por semana" desenha uma reta — a
                  exponencial da referência afirmaria um modelo de como o
                  peso cai que ninguém calculou. E é TRACEJADA porque
                  nada disso aconteceu ainda: traço cheio é medida, e no
                  primeiro dia existe uma pesagem só.

                  Os três nós são os marcos, e os rótulos embaixo caem
                  debaixo de cada um. */}
              <View style={[cartao, { overflow: 'hidden' }]}>
                <Row style={{ padding: 16, paddingBottom: 4, alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Txt v="body">{perder > 0 ? 'Peso a perder' : 'Peso a ganhar'}</Txt>
                    <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
                      {`em ${plano.semanas} semanas`}
                    </Txt>
                  </View>
                  <Row style={{ alignItems: 'center' }}>
                    <Txt v="metric">{kgTxt(Math.abs(perder))}</Txt>
                    <Txt v="caption" c={c.tx3} style={{ marginLeft: 3, marginTop: 6 }}>kg</Txt>
                  </Row>
                </Row>

                <AreaCurve
                  pts={[{ x: 0, y: 1 }, { x: 0.5, y: 0.5 }, { x: 1, y: 0 }]}
                  height={104} padT={16} padB={12} padX={20} strokeW={2.4}
                  id="pl" dashed={false} tracejada nodes fill={0.15}
                />

                <Row style={{ paddingHorizontal: 14, paddingBottom: 16, gap: 6 }}>
                  {marcos.map((m, i) => (
                    <View key={m.rot} style={{
                      flex: 1,
                      alignItems: i === 0 ? 'flex-start' : i === 1 ? 'center' : 'flex-end',
                    }}>
                      <Row style={{ alignItems: 'baseline', gap: 3 }}>
                        <Txt v="label" c={i === 2 ? c.accent : c.tx}>{nf(m.kg, 1)}</Txt>
                        <Txt v="micro" c={c.tx4}>kg</Txt>
                      </Row>
                      <Txt v="micro" c={c.tx4} style={{ marginTop: 1 }}>
                        {m.sem === 0 ? 'hoje' : m.quando}
                      </Txt>
                    </View>
                  ))}
                </Row>
              </View>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>
                {`É a conta de ${nf(d.ritmo ?? 0, 1)} kg por semana, o ritmo que você escolheu — não é previsão.`}
              </Txt>
            </View>
          ) : null}

          {/* ---------- o corpo ---------- */}
          <View>
            <Secao t="O SEU CORPO" />
            <View style={[cartao, { padding: 18, gap: 18 }]}>
              <Row style={{ alignItems: 'center', gap: 10 }}>
                {([[fxHoje, 'IMC de hoje', plano.imc, iHoje, 'flex-start'],
                  [fxMeta, 'Na sua meta', plano.imcMeta, iMeta, 'flex-end']] as const)
                  .map(([fx, rot, val, idx, lado], i) => (
                    <React.Fragment key={rot}>
                      {i ? <Icon name="chev" size={15} color={c.tx4} sw={2} /> : null}
                      <View style={{ flex: 1, gap: 4, alignItems: lado }}>
                        <Txt v="caption" c={c.tx3}>{rot}</Txt>
                        <Txt v="metric" style={{ fontSize: 28, lineHeight: 34 }}>{nf(val, 1)}</Txt>
                        <Row style={{ gap: 6, alignItems: 'center' }}>
                          <View style={{
                            width: 7, height: 7, borderRadius: 4, backgroundColor: CORES_IMC[idx],
                          }} />
                          <Txt v="micro" c={c.tx2}>{fx.nome}</Txt>
                        </Row>
                      </View>
                    </React.Fragment>
                  ))}
              </Row>

              {/* A RÉGUA TEM NÍVEIS SEPARADOS — o degradê apagava
                  justamente o que ela existe para mostrar, que é onde
                  uma faixa acaba e a outra começa. As duas que importam
                  ficam cheias; as outras continuam legíveis, porque a
                  régua mostra a escala inteira. */}
              <View>
                <Row style={{ gap: 3 }}>
                  {FAIXAS_IMC.map((fx, i) => (
                    <View key={fx.nome} style={{
                      flex: fx.ate - fx.de, height: 10, borderRadius: 5,
                      backgroundColor: CORES_IMC[i],
                      opacity: i === iHoje || i === iMeta ? 1 : 0.45,
                    }} />
                  ))}
                </Row>
                <View style={{
                  position: 'absolute', top: -4, left: `${pos(plano.imcMeta) * 100}%`,
                  marginLeft: -9, width: 18, height: 18, borderRadius: 9,
                  borderWidth: 3, borderColor: c.tx, backgroundColor: c.bg1,
                }} />
                <View style={{
                  position: 'absolute', top: -4, left: `${pos(plano.imc) * 100}%`,
                  marginLeft: -9, width: 18, height: 18, borderRadius: 9,
                  borderWidth: 3, borderColor: c.bg1, backgroundColor: c.tx,
                }} />
              </View>

              <Txt v="caption" c={c.tx3}>
                O IMC é ponto de partida: ele não separa músculo de gordura.
              </Txt>
            </View>
          </View>

          {/* ---------- como eu ajudo ---------- */}
          <View>
            <Secao t="COMO EU TE AJUDO" />
            <View style={{ gap: 16 }}>
              {AJUDA.map(([ic, t, sub]) => (
                <Row key={t} style={{ gap: 13, alignItems: 'center' }}>
                  <View style={{
                    width: 42, height: 42, borderRadius: 13, backgroundColor: c.accentWeak,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={ic} size={20} color={c.accent} sw={1.9} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt v="bodyMed">{t}</Txt>
                    <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }}>{sub}</Txt>
                  </View>
                </Row>
              ))}
            </View>
          </View>

          {/* ---------- por que esses números ----------

              O QUE SE LÊ É O QUE SE SABE, e não o nome do artigo. "Equação
              de Mifflin-St Jeor para gasto energético de repouso" é o nome
              certo da coisa e não diz nada a quem acabou de terminar um
              cadastro; quem quer o nome certo toca na linha e chega ao
              trabalho. Em tela fica o que aquilo quer dizer para essa
              pessoa, com a instituição embaixo — que é o que dá lastro sem
              virar aula.

              É o contrário do selo: em vez de pedir confiança, mostra o que
              se sabe, quem estudou, e deixa conferir. */}
          <View>
            <Secao t="POR QUE ESSES NÚMEROS" />
            <View style={[cartao, { paddingHorizontal: 16 }]}>
              {FONTES.map((fo, i) => (
                <Pressable
                  key={fo.id}
                  onPress={() => Linking.openURL(fo.url)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Row style={{
                    gap: 10, alignItems: 'center', paddingVertical: 14,
                    borderTopWidth: i ? 1 : 0, borderTopColor: c.line2,
                  }}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Txt v="caption">{fo.frase}</Txt>
                      <Txt v="micro" c={c.tx4}>
                        {`${fo.onde}${fo.ano ? `, ${fo.ano}` : ''}`}
                      </Txt>
                    </View>
                    <Icon name="chev" size={14} color={c.tx4} sw={2} />
                  </Row>
                </Pressable>
              ))}
            </View>
            <Txt v="caption" c={c.tx3} style={{ marginTop: 10 }}>
              São ponto de partida, não prescrição — e nada aqui substitui quem te acompanha.
            </Txt>
          </View>
        </View>
      </ScrollView>

      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 20,
        backgroundColor: c.bg,
      }}>
        <Botao pilula label={rotuloSair} onPress={aoSair} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * /plano — A PORTA PARA OLHAR A TELA, e não uma tela do app
 *
 * O plano é a ÚLTIMA TELA DO CADASTRO, e é só isso: não existe "meu
 * plano" na área logada, e nada no app leva até aqui. Esta rota existe
 * porque, sem ela, ver uma vírgula fora do lugar custava responder quinze
 * perguntas de novo — e trabalho que se repete a cada ajuste é ajuste que
 * deixa de ser feito.
 *
 * Ela monta a tela com o perfil que estiver na loja, que é o jeito de ter
 * números de gente de verdade em vez dos zeros de um formulário vazio. Se
 * um dia o plano virar tela de produto, é aqui que ele nasce — mas hoje
 * não é, e o comentário existe para que ninguém confunda porta de serviço
 * com porta de entrada.
 * ------------------------------------------------------------------ */
export default function PreviaDoPlano() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const p = S.profile as any;
  const peso = curWeight(S);
  const nivel = Math.max(0, ATIVIDADES.findIndex((x) => x.id === p.atividade));
  const plano = planoDoCadastro({
    altura: p.height,
    peso,
    meta: p.goalWeight,
    ritmo: typeof p.ritmo === 'number' ? p.ritmo : null,
    atividade: nivel,
    idade: idadeDe(S) ?? undefined,
    sexo: p.identidade === 'f' ? 'f' : p.identidade === 'm' ? 'm' : null,
  });
  return (
    <Plano
      dados={{
        nome: p.name ?? '',
        peso,
        meta: p.goalWeight,
        ritmo: typeof p.ritmo === 'number' ? p.ritmo : null,
        med: p.med,
        dose: typeof p.dose === 'number' ? p.dose : null,
        intervalo: typeof p.intervalo === 'number' ? p.intervalo : null,
        plano,
      }}
      aoSair={() => router.back()}
      rotuloSair="Voltar"
    />
  );
}
