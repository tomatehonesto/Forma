import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { apagarRefeicao, checkinToday } from '../logic/derive';
import { relDay } from '../logic/time';
import { gramasDaFaixa } from '../logic/escalas';
import { Txt, Row, Vazio } from '../ui/kit';
import { TelaInterna, Titulao, Bloco, Cartao, Linha, Botao, ItemApagavel } from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, shadowCard } from '../theme';

/* ============================================================
   ALIMENTAÇÃO

   A tela do que sustenta o tratamento. Ela não conta caloria de
   propósito: num tratamento de GLP-1 a fome cai sozinha, e o risco
   deixa de ser comer demais e passa a ser comer pouca PROTEÍNA — que é
   o que segura a massa magra enquanto o peso desce.

   Dois caminhos para registrar, e é a mesma decisão que a folha de
   registro já tomou: a foto para quem não sabe quantos gramas tem um
   filé, e a mão para quem prefere escrever. O botão fixo embaixo é o
   manual, porque é o que sempre funciona; o de escanear fica em cima,
   perto do número que ele move.
   ============================================================ */

/* A origem de cada refeição, pela mesma regra dos treinos: ausência quer
   dizer manual, porque manual é o que existia antes de haver origem —
   mas a tela nunca mostra ausência, mostra "por você". */
const origem = (fonte?: string) => (fonte === 'foto' ? 'pela foto' : 'por você');

export default function Alimentacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  /* Zero é zero. O 70 de antes era um número inventado: quem ainda não
     tinha registrado nada abria a tela e via a barra em 78% de uma meta
     que ninguém tinha começado a cumprir. Proteína é acumulador como
     água e exercício — o dia começa vazio e isso é a verdade dele. */
  const prot = Math.round(checkinToday(S)?.prot || 0);
  const alvo = (S.profile as any).targets.prot as number;
  const falta = Math.max(0, alvo - prot);

  return (
    <TelaInterna
      titulo="Alimentação"
      rodape={<Botao label="Registrar uma refeição" onPress={() => router.push('/medir-refeicao' as any)} />}
    >
      <Titulao
        titulo="Alimentação"
        lead="Aqui não se conta caloria. O que o tratamento pede é proteína, que é o que segura a massa magra enquanto o peso desce."
      />

      {/* O NÚMERO DO DIA, e o que ainda falta dele.

          A barra sozinha dizia a proporção e deixava a conta para a
          pessoa. "Faltam 60 g" é a mesma informação já resolvida, e é
          ela que muda o que se almoça. */}
      <View style={{ gap: 10 }}>
        <View style={[{ backgroundColor: c.bg1, borderRadius: radius.card, padding: 16 }, shadowCard(c)]}>
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="body">Proteína de hoje</Txt>
              <Txt v="note" c={c.tx3} style={{ marginTop: 2 }}>
                {prot === 0
                  ? `Meta de ${alvo} g`
                  : falta > 0 ? `Faltam ${falta} g para a meta` : 'Meta do dia alcançada'}
              </Txt>
            </View>
            <Txt v="metric">
              {prot}
              <Txt v="label" c={c.tx3}>{` / ${alvo} g`}</Txt>
            </Txt>
          </Row>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: c.track, marginTop: 14, overflow: 'hidden' }}>
            <LinearGradient
              colors={[c.gradFrom, c.gradTo]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ width: `${Math.min(100, (prot / alvo) * 100)}%`, height: '100%' }}
            />
          </View>
        </View>

        {/* O caminho da foto. Ele tinha esta mesma cara e NENHUM onPress:
            um botão em gradiente, com ícone de câmera, que não fazia nada
            ao ser tocado. Agora abre a folha de registro com a câmera já
            no ar — que é onde ele sempre devia ter ido. */}
        <Pressable
          onPress={() => router.push('/medir-refeicao?cam=1' as any)}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
          <LinearGradient
            colors={[c.gradFrom, c.gradTo]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          >
            <Icon name="camera" size={16} color={c.onHero} sw={2} />
            <Txt v="title" c={c.onHero}>Escanear uma refeição</Txt>
          </LinearGradient>
        </Pressable>
      </View>

      {/* O REGISTRO

          Cada refeição pode ser apagada daqui. Registrar três vezes por
          dia produz engano — o almoço que entrou como jantar, a busca que
          somou dois frangos —, e sem uma saída o número do dia fica
          errado para sempre com a pessoa sabendo que está.

          Apagar devolve a proteína ao dia, não zera: o que as outras
          refeições trouxeram continua lá. */}
      <Bloco
        titulo="Registro recente"
        nota={S.meals.length ? 'Toque na lixeira para apagar uma refeição que entrou errada.' : undefined}
      >
        {S.meals.length ? (
          <View style={{ gap: 10 }}>
            {S.meals.map((m: any, i: number) => {
              const g = m.g ?? gramasDaFaixa(m.prot) ?? 0;
              return (
                <View key={`${m.t}-${i}`} style={[{ backgroundColor: c.bg1, borderRadius: radius.card }, shadowCard(c)]}>
                  <ItemApagavel
                    pergunta={`Apagar ${String(m.name).toLowerCase()} de ${relDay(new Date(m.t))}?`}
                    onApagar={() => update((s: any) => apagarRefeicao(s, m.t, g))}
                  >
                    <Row style={{ alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Txt v="body">{m.name}</Txt>
                        {m.tag && m.tag !== m.name ? (
                          <Txt v="caption" c={c.tx3} style={{ marginTop: 2 }}>{m.tag}</Txt>
                        ) : null}
                        {/* Gramas e origem na mesma linha, como nos treinos:
                            a origem qualifica o número — 30 g que você
                            escreveu e 30 g que a foto estimou não se
                            conferem do mesmo jeito.

                            A faixa ("proteína alta") saiu. Ela é DERIVADA
                            dos gramas, e mostrar as duas era o mesmo fato
                            em duas resoluções ocupando duas pastilhas. */}
                        <Txt v="micro" c={c.tx4} style={{ marginTop: 6 }}>
                          {relDay(new Date(m.t))} · {origem(m.fonte)}
                        </Txt>
                      </View>
                      <Txt v="bodyMed" c={c.accent}>~{g} g</Txt>
                    </Row>
                  </ItemApagavel>
                </View>
              );
            })}
          </View>
        ) : (
          <Vazio
            ic="utensils"
            titulo="Nenhuma refeição registrada"
            texto="O que você registrar entra na proteína do dia."
          />
        )}
      </Bloco>

      {/* OS FAVORITOS — o atalho de quem repete a mesma comida.

          Eles abrem a folha de registro com o nome já escrito, em vez de
          gravar por conta própria. Gravando sozinhos, a refeição aparecia
          na lista e a barra do dia não andava — duas versões do mesmo dia
          na mesma tela. */}
      <Bloco
        titulo="Favoritos"
        nota={S.favMeals.length ? 'Abrem o registro com o prato já escrito.' : undefined}
      >
        {S.favMeals.length ? (
          <Cartao>
            {S.favMeals.map((f: string) => (
              <Linha
                key={f}
                ic="leaf"
                titulo={f}
                onPress={() => router.push(`/medir-refeicao?oque=${encodeURIComponent(f)}` as any)}
              />
            ))}
          </Cartao>
        ) : (
          <Vazio ic="leaf" titulo="Nenhum favorito ainda" />
        )}
      </Bloco>
    </TelaInterna>
  );
}
