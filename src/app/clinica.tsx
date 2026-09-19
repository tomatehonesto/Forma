import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { fichaDaClinica } from '../logic/derive';
import { Screen, Txt, Card, Row, CircleBtn, Chevron, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { RETRATOS, inicialDoNome } from '../ui/retratos';
import { useTheme } from '../ui/useTheme';
import { dataComAno } from '../logic/time';
import { radius } from '../theme';
import { Image } from 'expo-image';

/* ============================================================
   A CLÍNICA — quem está do outro lado, como instituição

   ⚠️ ELA EXISTE PORQUE A EQUIPE PRECISAVA DE UM LUGAR, e o carrossel do
   hub não era esse lugar.

   Havia uma fileira de três cartões com foto e nome no meio da tela de
   equipe, e ela tinha dois problemas ao mesmo tempo: gastava a largura
   toda para dizer o que cabia numa lista, e pressupunha que sempre há
   mais de uma pessoa. Quem se trata com uma médica sozinha via um
   carrossel de um item — que é uma fileira que não rola, ocupando o
   espaço de uma que rolaria.

   A equipe é da clínica. Aqui ela é uma lista, cada linha abre a ficha, e
   uma pessoa só continua sendo uma linha.

   ⚠️ E ESTA TELA SÓ EXISTE QUANDO HÁ CLÍNICA. Quem se trata com um
   profissional sem clínica nenhuma não tem a ação "Clínica" no cartão do
   hub — e a ficha dele continua completa em /especialista, porque a
   pessoa nunca dependeu da instituição para ter credencial.

   ⚠️ NÃO HÁ TELEFONE, SITE NEM ENDEREÇO. O estado não guarda nenhum
   deles, e inventá-los na semente não é como inventar um CRN: um CRN
   falso não faz nada, um telefone falso faz alguém ligar para a casa de
   um estranho. O canal que existe é a conversa, e ela está aqui.

   ⚠️ E ELA VAI SERVIR PARA APRESENTAR PARCEIROS um dia — é a tela que
   alguém vê antes de decidir. Por isso o que ela diz precisa ser o que a
   clínica afirmou sobre si, e não o que o aplicativo inferiu: `sobre`,
   especialidade e cidade vêm de `clinicInfo`, e sumem inteiros quando
   ela não mandou nada.
   ============================================================ */

export default function Clinica() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const go = (to: string) => () => router.push(to as any);

  const f = fichaDaClinica(S);

  if (!f) {
    return (
      <Screen>
        <Row style={{ marginTop: 4 }} gap={12}>
          <CircleBtn name="back" onPress={() => router.back()} />
          <Txt v="title" style={{ flex: 1 }}>Clínica</Txt>
        </Row>
        <Txt v="note" c={c.tx3} style={{ marginTop: 28, lineHeight: 23 }}>
          Você não tem clínica vinculada. Quem acompanha o seu tratamento aparece em Sua equipe.
        </Txt>
      </Screen>
    );
  }

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="title" style={{ flex: 1 }}>Clínica</Txt>
      </Row>

      {/* ---- identidade ---- */}
      <View style={{ marginTop: 20 }}>
        <View style={{
          width: 56, height: 56, borderRadius: radius.md,
          backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="heart" size={24} color={c.accent} sw={1.9} />
        </View>
        <Txt v="h1" style={{ fontSize: 28, marginTop: 16 }}>{f.nome}</Txt>
        {!!f.especialidade && (
          <Txt v="caption" c={c.tx2} style={{ marginTop: 6 }}>{f.especialidade}</Txt>
        )}
        {!!f.cidade && (
          <Row gap={5} style={{ alignItems: 'center', marginTop: 3 }}>
            <Icon name="target" size={13} color={c.tx4} sw={1.9} />
            <Txt v="caption" c={c.tx3}>{f.cidade}</Txt>
          </Row>
        )}
      </View>

      {!!f.sobre && (
        <Txt v="body" c={c.tx2} style={{ marginTop: 22, lineHeight: 26 }}>{f.sobre}</Txt>
      )}

      {/* ---- a equipe ----

          ⚠️ LISTA, E NÃO CARROSSEL. A lista serve uma pessoa e serve seis;
          o carrossel só serve três ou mais, e com menos vira uma fileira
          que não rola ocupando o espaço de uma que rolaria.

          A responsável entra junto, e não separada: aqui a pergunta é
          "quem trabalha nesta clínica", e ela é a primeira resposta. */}
      {f.equipe.length ? (
        <View style={{ marginTop: 30 }}>
          <Txt v="h2" style={{ marginBottom: 10 }}>
            {f.equipe.length === 1 ? 'Quem acompanha você' : 'A equipe'}
          </Txt>
          <Card style={{ paddingVertical: 4 }}>
            {f.equipe.map((m, i) => (
              <View key={m.id}>
                {i > 0 && <Divider style={{ marginLeft: 66 }} />}
                <Pressable
                  onPress={go(`/especialista?id=${m.id}`)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Row gap={14} style={{ paddingVertical: 12, alignItems: 'center' }}>
                    <Avatar ficha={m} />
                    <View style={{ flex: 1 }}>
                      <Txt v="bodyMed" numberOfLines={1}>{m.nome}</Txt>
                      {/* Duas linhas: "Endocrinologista · responsável" não cabe
                          em uma, e cortar o papel de alguém com reticências
                          numa lista de profissionais de saúde é o tipo de
                          economia que não vale. */}
                      <Txt v="caption" c={c.tx3} numberOfLines={2} style={{ marginTop: 1, lineHeight: 19 }}>
                        {[m.papel, m.responsavel ? 'responsável' : null].filter(Boolean).join(' · ')}
                      </Txt>
                    </View>
                    <Chevron />
                  </Row>
                </Pressable>
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      {/* ---- o vínculo ---- */}
      {!!f.desde && (
        <View style={{ marginTop: 26, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 18 }}>
          <Row gap={10} style={{ alignItems: 'flex-start' }}>
            <View style={{ marginTop: 2 }}>
              <Icon name="check" size={16} color={c.lime} sw={2.4} />
            </View>
            <Txt v="caption" c={c.tx3} style={{ flex: 1, lineHeight: 20 }}>
              Você está vinculada a esta clínica desde {dataComAno(f.desde)} — e é esse vínculo
              que cobre o aplicativo para você.
            </Txt>
          </Row>
        </View>
      )}

      {/* ⚠️ UMA AÇÃO, E ELA É A QUE EXISTE. O desenho de referência tem
          quatro — WhatsApp, telefone, site e Instagram — e nenhuma das
          quatro tem dado no estado. Uma que abre vale mais do que quatro
          que param. */}
      <Pressable onPress={go('/conversa')} style={({ pressed }) => [{ marginTop: 26, opacity: pressed ? 0.85 : 1 }]}>
        <Row gap={8} style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 15, justifyContent: 'center' }}>
          <Icon name="companion" size={18} color={c.accentInk} sw={1.9} />
          <Txt v="body" c={c.accentInk}>Escrever para a equipe</Txt>
        </Row>
      </Pressable>
    </Screen>
  );
}

/* O mesmo quadrado de canto redondo da tela de equipe — é a mesma pessoa
   nas duas telas, e ela não pode mudar de forma no caminho. */
function Avatar({ ficha }: { ficha: { id: string; nome: string } }) {
  const { c } = useTheme();
  const foto = RETRATOS[ficha.id];
  const lado = 48;
  if (foto) {
    return (
      <Image
        source={foto}
        style={{ width: lado, height: lado, borderRadius: radius.sm, backgroundColor: c.bg2 }}
        contentFit="cover"
        contentPosition="top center"
      />
    );
  }
  return (
    <View style={{
      width: lado, height: lado, borderRadius: radius.sm,
      backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center',
    }}>
      <Txt v="bodyMed" c={c.accent}>{inicialDoNome(ficha.nome)}</Txt>
    </View>
  );
}
