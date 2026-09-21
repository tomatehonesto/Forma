import React from 'react';
import { View, Pressable } from 'react-native';
import { useAurora } from '../ui/aurora';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  ALVOS, curWeight, goalProgress, journeyGoals, startWeight, procedenciaDoAlvo, type ChaveDeAlvo,
} from '../logic/derive';
import { kg } from '../logic/time';
import { Txt, Row, Vazio, Chevron } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { Bloco, Cartao, Linha, Selo } from '../ui/internas';
import { AtalhoDaCapa, CapaDeHabito, FolhaDeHabito, TelaDeHabito } from '../ui/capa';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   ONDE QUERO CHEGAR

   A tela chamava-se "Metas além do peso" e abria com o peso. Listava
   quatro coisas, não deixava mexer em nenhuma, e calculava as
   porcentagens com uma segunda cópia da conta que já existia em derive —
   as duas com recortes diferentes, então a mesma meta de sono aparecia
   com um número aqui e outro na Jornada.

   E ERA UM BECO SEM SAÍDA DUPLO. O perfil manda para cá em duas linhas:
   "meta de peso" e "metas diárias". Nenhuma das duas existia aqui.
   Os quatro números que o app cobra todo dia — proteína, água, exercício
   e o peso — não tinham onde ser mudados em lugar nenhum do app.

   A TELA AGORA TEM DOIS ANDARES, e eles respondem perguntas diferentes:

     os alvos      os números que o app cobra. Mudar aqui muda a barra da
                   alimentação, a tracejada do exercício e o protocolo.

     as metas      onde a pessoa quer chegar. Umas o app mede pelos
                   check-ins, outras só ela sabe dizer.

   A CAPA é a viagem do peso, que é a única meta com aritmética fechada:
   de 82,4 para 68, e onde ela está entre as duas. Não é a tela virando
   balança — é o número que responde "onde quero chegar" com a conta que
   existe, enquanto as outras metas ocupam o corpo da tela.
   ============================================================ */


export default function Metas() {
  const aurora = useAurora();
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();

  const pct = Math.round(goalProgress(S));
  const perdido = startWeight(S) - curWeight(S);
  const total = startWeight(S) - S.profile.goalWeight;
  const metas = journeyGoals(S);

  const chaves: ChaveDeAlvo[] = ['peso', 'prot', 'waterMl', 'exercMin'];

  return (
    <TelaDeHabito>
      <CapaDeHabito
        foto={aurora.insights}
        titulo="Metas"
        linha={`${kg(perdido)} de ${kg(total)} kg até ${ALVOS.peso.escreve(S.profile.goalWeight)} kg`}
        pct={pct}
      >
        <AtalhoDaCapa
          titulo="Nova meta"
          cheio
          onPress={() => router.push('/meta?novo=1' as any)}
        />
      </CapaDeHabito>

      <FolhaDeHabito>
        {/* OS ALVOS — os números que o app cobra, e onde eles pegam.

            Cada linha diz o que aquele número muda no resto do app. Sem
            isso, mexer na meta de proteína é mexer num campo de perfil;
            com isso, é mexer na barra que a pessoa vê todo dia. */}
        <Bloco
          titulo="Os números do dia"
          nota="É o que as telas de água, alimentação e exercício cobram, e o que o protocolo conta."
        >
          <Cartao>
            {chaves.map((k) => {
              const a = ALVOS[k];
              /* ⚠️ A TAG DIZ DE QUEM É O NÚMERO, e antes não havia como
                 saber. Três destes quatro saíam de uma conta com as
                 respostas do cadastro — e agora qualquer um deles pode ter
                 sido definido pela equipe, anotado na consulta.

                 São três estados, e o terceiro é o que importa: quando a
                 pessoa MUDA um número que a equipe definiu, a tag não some
                 nem mente. Ela passa a dizer que foi alterada, e a folha
                 de edição mostra qual era o número da equipe. Ela pode
                 mudar — é o corpo dela —, o que o aplicativo não faz é
                 esconder que mudou. */
              const p = procedenciaDoAlvo(S, k);
              return (
                /* SEM O "onde" NA LISTA. Ele explica o que aquele número
                   muda no resto do app — e isso interessa a quem está
                   prestes a mexer, não a quem está passando o olho. Na
                   lista ele virava três linhas de texto por item; na folha
                   de edição ele é o subtítulo, lido no momento certo. */
                <Linha
                  key={k}
                  ic={a.ic}
                  titulo={a.nome}
                  sub={p.meta ? (
                    <Row gap={6} style={{ marginTop: 3 }}>
                      <Selo
                        label={p.convivem
                          ? `Sua equipe mira ${a.escreve(p.meta.valor)} ${a.un}`
                          : p.alterada ? 'Alterada por você' : 'Da sua equipe'}
                        tom={p.alterada || p.convivem ? 'neutra' : 'lima'}
                      />
                      <Txt v="note">{p.meta.por}</Txt>
                    </Row>
                  ) : undefined}
                  selo={`${a.escreve(a.le(S))} ${a.un}`}
                  seloTom="neutra"
                  onPress={() => router.push(`/meta?alvo=${k}` as any)}
                />
              );
            })}
          </Cartao>
        </Bloco>

        {/* AS METAS — e as duas naturezas.

            A medida traz uma porcentagem que é conta de verdade, saída
            dos check-ins. A pessoal traz "ainda não" ou a data em que
            aconteceu — ela perdeu a barra, porque não existe sessenta por
            cento de caber numa calça. */}
        <Bloco
          /* "As suas" porque a capa da tela já se chama Metas, e uma seção
             com o nome da tela lê como se a anterior não fosse meta — e
             a anterior são os números do dia, que são meta também. O que
             separa as duas é quem cobra: aquelas o app conta sozinho,
             estas a pessoa escreveu. */
          titulo="As suas metas"
          nota="As medidas nós acompanhamos pelos seus registros. As suas, você marca."
        >
          {metas.length ? (
            <Cartao>
              {metas.map((m: any) => (
                <Pressable
                  key={m.id}
                  onPress={() => router.push(`/meta?g=${m.id}` as any)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                    <Row gap={12}>
                      <View style={{
                        width: 34, height: 34, borderRadius: radius.md,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: m.feita ? c.accent : c.accentWeak,
                      }}>
                        <Icon
                          name={m.feita ? 'check' : m.ic}
                          size={17}
                          color={m.feita ? c.accentInk : c.accent}
                          sw={1.9}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Txt v="body">{m.label}</Txt>
                        <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{m.hint}</Txt>
                      </View>
                      {/* A porcentagem só nas medidas. Na pessoal ela seria
                          0% ou 100%, que é a caixinha dita em número. */}
                      {m.pessoal ? null : (
                        <Txt v="bodyMed" c={m.pct >= 100 ? c.accent : c.tx3}>{Math.round(m.pct)}%</Txt>
                      )}
                      <View style={{ marginLeft: 8 }}><Chevron size={15} /></View>
                    </Row>
                    {m.pessoal ? null : (
                      <View style={{
                        height: 6, borderRadius: radius.pill, backgroundColor: c.track,
                        overflow: 'hidden', marginTop: 12,
                      }}>
                        <View style={{
                          width: `${Math.max(2, m.pct)}%`, height: 6,
                          borderRadius: radius.pill, backgroundColor: c.accent,
                        }} />
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </Cartao>
          ) : (
            <Vazio
              ic="target"
              titulo="Nenhuma meta ainda"
              texto="Escreva uma coisa que você quer conseguir. Ela fica aqui até acontecer."
            />
          )}
        </Bloco>
      </FolhaDeHabito>
    </TelaDeHabito>
  );
}
