import React, { useState } from 'react';
import { View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import {
  quickCapture, nextSite, siteLabel, curWeight, checkinToday, waterMlToday, streak,
  type QuickKey,
} from '../logic/derive';
import { now, startOfDay, nf } from '../logic/time';
import { Txt, Row, Divider } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius, ty } from '../theme';

/* ============================================================
   REGISTRAR — o "+" da tab bar, e tudo que abre aqui é um registro.

   A tela pergunta "o que deseja registrar?" e a pessoa escolhe. Os itens
   seguem em primeira pessoa ("Acabei de me pesar"), não em nome de tela
   ("Peso"): o que ela escolhe é o acontecimento, e o formulário é
   consequência.

   Três camadas, e a ordem é a da frequência esperada:
     · check-in — o único que se espera TODO dia, e por isso tem faixa
       própria, selo e o maior peso visual do sheet
     · agora — três atalhos contextuais, que mudam com o momento do
       tratamento
     · leva um minuto — os registros que pedem mais informação
   ============================================================ */

type Item = { ic: string; titulo: string; sub: string; to?: string; acao?: () => void; destaque?: boolean };

export default function Registrar() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: alturaJanela } = useWindowDimensions();

  const [feito, setFeito] = useState<string | null>(null);

  const piscar = (k: string) => { setFeito(k); setTimeout(() => setFeito(null), 1600); };
  const fechar = () => router.back();
  /* fecha antes de navegar: tela empilhada sobre sheet prende a pessoa em
     duas camadas de volta */
  const irPara = (to: string) => () => { router.back(); setTimeout(() => router.push(to as any), 60); };

  const ci = checkinToday(S);
  const stk = streak(S);

  /* Tinta e véu do banner do check-in. Sobre o azul saturado a tinta é
     branca; sobre a lavagem verde, o verde escuro do par — os mesmos dois
     tons que o selo "verde" usa nas telas internas. O véu das pastilhas é
     a tinta a 12%, e não uma terceira cor. */
  const tinta = ci ? c.ok : c.accentInk;
  const veu = ci ? 'rgba(60,107,44,0.12)' : 'rgba(255,255,255,0.18)';
  const litros = (waterMlToday(S) / 1000).toFixed(1).replace('.', ',');
  const alvoL = ((S.profile as any).targets.waterMl / 1000).toFixed(1).replace('.', ',');
  const { acoes } = quickCapture(S);

  /* A aplicação era o único item que salvava aqui dentro, num toque, com
     dose e local no automático. Deixou de ser: ela é o registro que mais
     pede escolha (local da rotação, dose, qual caneta) e o único que mexe
     na contagem de doses — salvar no escuro deixava o estoque errado e
     tirava da pessoa a decisão de onde aplicar. Agora abre /aplicacao,
     que já chega com tudo preenchido para quem só quer confirmar. */

  /* Catálogo em primeira pessoa. O que a pessoa lê é o acontecimento; o
     nome da funcionalidade fica para a tela de destino. */
  const CATALOGO: Record<QuickKey, Item> = {
    agua: { ic: 'water', titulo: 'Me hidratei', sub: `${litros} de ${alvoL} L`, to: '/medir-agua' },
    exercicio: { ic: 'dumbbell', titulo: 'Me exercitei', sub: `${ci?.exerc || 0} min hoje`, to: '/medir-exercicio' },
    aplicacao: { ic: 'syringe', titulo: 'Apliquei a dose', sub: siteLabel(nextSite(S)), to: '/aplicacao' },
    checkin: { ic: 'leaf', titulo: ci ? 'Revisar como estou' : 'Como estou agora', sub: ci ? 'já registrei hoje' : stk > 0 ? `${stk} dias seguidos` : 'menos de 30s', to: '/checkin', destaque: !ci },
    refeicao: { ic: 'utensils', titulo: 'Fiz uma refeição', sub: `${S.meals.length} registradas`, to: '/medir-refeicao' },
    sintomas: { ic: 'waves', titulo: 'Meu corpo reagiu', sub: 'enjoo, fome, intestino', to: '/medir-sintomas' },
    exame: { ic: 'doc', titulo: 'Recebi um exame', sub: 'anotar resultado', to: '/medir-exame' },
    anotacoes: { ic: 'pencil', titulo: 'Anotei da consulta', sub: 'o que a médica orientou', to: '/medir-anotacao' },
  };

  /* Registros completos — o que não coube nos atalhos de agora. Peso fica
     sempre aqui: pede um número, mas resolve sem sair do sheet.

     A aplicação abre a lista e está sempre presente. Ela também é um dos
     atalhos contextuais, mas só no dia da dose — e adiantar ou atrasar uma
     aplicação é exatamente a situação em que a pessoa precisa registrar
     fora do dia. O filtro de baixo tira a duplicata quando os dois
     coincidem. */
  const completos: Item[] = [
    { ic: 'syringe', titulo: 'Apliquei a dose', sub: siteLabel(nextSite(S)), to: '/aplicacao' },
    { ic: 'scale', titulo: 'Acabei de me pesar', sub: `último: ${nf(curWeight(S), 1).replace('.', ',')} kg`, to: '/medir-peso' },
    { ic: 'utensils', titulo: 'Fiz uma refeição', sub: 'o que comi e a proteína', to: '/medir-refeicao' },
    { ic: 'waves', titulo: 'Meu corpo reagiu', sub: 'enjoo, fome e intestino', to: '/medir-sintomas' },
    { ic: 'camera', titulo: 'Tirei uma foto de progresso', sub: 'para comparar depois', to: '/medir-foto' },
    { ic: 'ruler', titulo: 'Medi meu corpo', sub: 'cintura, quadril, braço e coxa', to: '/medir-medidas' },
    { ic: 'doc', titulo: 'Recebi um exame', sub: 'anotar o resultado', to: '/medir-exame' },
  ].filter((it) => !acoes.some((k) => CATALOGO[k].titulo === it.titulo));

  return (
    <View style={{ height: alturaJanela, justifyContent: 'flex-end' }}>
      <Pressable onPress={fechar} style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} />

      {/* Ancorado na base, cobrindo a tab bar — padrão de bottom sheet. */}
      <View style={{
        backgroundColor: c.bg, maxHeight: alturaJanela * 0.86,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        paddingBottom: (insets.bottom || 12) + 16,
      }}>
        <Pressable onPress={fechar} style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 14 }}>
          <View style={{ width: 40, height: 4, borderRadius: radius.pill, backgroundColor: c.bg3 }} />
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* A pergunta é o comando da tela. Saiu a linha de contexto que
              vinha embaixo ("um dia comum de tratamento"): ela comentava o
              momento em vez de ajudar a escolher, e o sheet abre para
              escolher. */}
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="h2">O que deseja registrar?</Txt>
            </View>
            <Pressable onPress={fechar} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, marginTop: 2 }]}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={16} color={c.tx2} sw={2.2} />
              </View>
            </Pressable>
          </Row>

          {/* --- check-in: banner fixo, nunca sai da tela ---
              Sai da rotação dos atalhos e ganha lugar próprio: é o registro
              que alimenta insights, radar e streak, e some-lo quando já foi
              feito tirava a confirmação de que o dia está em dia. Feito, ele
              vira comprovante com opção de ajustar. */}
          {/* A cor carrega o estado, e os dois estados querem volumes
              diferentes de atenção.

              Pendente é azul saturado — a cor de ação do app —, porque é
              uma coisa por fazer e deve puxar o olho. Concluído é a lavagem
              verde: já resolvido, então recua. Manter os dois no mesmo lima
              obrigava a LER para saber em qual deles se está; agora a cor
              responde antes do texto.

              A tinta acompanha o fundo, e as pastilhas internas são um véu
              da própria tinta, não uma cor nova. */}
          <Pressable onPress={irPara('/checkin')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, marginTop: 18 }]}>
            <View style={{ backgroundColor: ci ? c.okBg : c.accent, borderRadius: radius.lg, padding: 18 }}>
              {/* O selo nomeia o que isto é. Os outros itens do sheet são
                  registros avulsos — um copo, uma refeição —, e este é o
                  único que se espera todo dia. Dizer "diário" na etiqueta
                  faz essa diferença sem precisar de uma frase. */}
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ backgroundColor: veu, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Txt v="tag" c={tinta}>Check-in diário</Txt>
                </View>
                {ci ? (
                  <View style={{ backgroundColor: veu, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}>
                    <Txt v="tag" c={tinta}>Editar</Txt>
                  </View>
                ) : null}
              </Row>

              <Row gap={14} style={{ marginTop: 14 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: veu, alignItems: 'center', justifyContent: 'center' }}>
                  {/* Pendente pergunta como foi o dia, e o rosto é o ícone
                      que faz essa pergunta. A folha de antes falava de
                      saúde em geral, não de como a pessoa esteve. */}
                  <Icon name={ci ? 'check' : 'mood'} size={24} color={tinta} sw={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt v="title" c={tinta}>
                    {ci ? 'Check-in concluído' : 'Como foi o seu dia?'}
                  </Txt>
                  <Txt v="caption" c={tinta} style={{ marginTop: 3, opacity: 0.75 }}>
                    {stk > 0 ? `${stk} dias seguidos` : ci ? 'registrado hoje' : 'menos de 30s'}
                  </Txt>
                </View>
                {!ci ? <Icon name="chev" size={17} color={tinta} sw={2.2} /> : null}
              </Row>
            </View>
          </Pressable>

          {/* --- agora: três atalhos que mudam com o momento --- */}
          <Row gap={7} style={{ marginTop: 7, alignItems: 'stretch' }}>
            {acoes.map((k) => {
              const it = CATALOGO[k];
              const ok = feito === k;
              const lima = !!it.destaque;
              return (
                <Pressable
                  key={k}
                  onPress={it.acao ?? irPara(it.to!)}
                  style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}
                >
                  {/* Duas linhas de título para os três, sempre.

                      "Me hidratei" cabe em uma linha; "Fiz uma refeição"
                      precisa de duas. Deixando cada rótulo ocupar o que
                      pede, os tiles saíam de alturas diferentes e o
                      subtítulo de cada um parava numa altura sua.

                      A caixa do título tem altura de duas linhas nos três, e
                      o rótulo fica centrado nela: o curto não cola no ícone
                      nem abre buraco embaixo, e os três subtítulos caem na
                      mesma linha. */}
                  <View style={{ flex: 1, backgroundColor: ok || lima ? c.lime : c.bg1, borderRadius: radius.lg, paddingHorizontal: 10, paddingVertical: 12, alignItems: 'center' }}>
                    <Icon name={ok ? 'check' : it.ic} size={19} color={ok || lima ? c.limeInk : c.accent} sw={2} />
                    <View style={{ height: ty.caption.lineHeight * 2, marginTop: 8, justifyContent: 'center' }}>
                      <Txt
                        v="caption"
                        c={ok || lima ? c.limeInk : c.tx}
                        style={{ textAlign: 'center' }}
                        numberOfLines={2}
                      >
                        {it.titulo}
                      </Txt>
                    </View>
                    <Txt v="micro" c={ok || lima ? c.limeInk : c.tx3} style={{ textAlign: 'center', opacity: lima && !ok ? 0.7 : 1 }} numberOfLines={1}>{it.sub}</Txt>
                  </View>
                </Pressable>
              );
            })}
          </Row>

          {/* --- separação pelo esforço, não por categoria --- */}
          <Row gap={10} style={{ marginTop: 24, marginBottom: 12 }}>
            <Txt v="micro" c={c.tx3} style={{ letterSpacing: 1 }}>LEVA UM MINUTO</Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
          </Row>

          <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, paddingHorizontal: 16 }}>
            {/* peso é sempre a primeira linha, então todas as seguintes
                vêm precedidas de divisor */}
            {completos.map((it) => (
              <React.Fragment key={it.titulo}>
                <Divider />
                <Pressable onPress={irPara(it.to!)} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                  <Row style={{ paddingVertical: 14 }}>
                    <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={it.ic} size={17} color={c.tx} sw={1.9} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Txt v="body">{it.titulo}</Txt>
                      <Txt v="caption" c={c.tx3} style={{ marginTop: 1 }} numberOfLines={1}>{it.sub}</Txt>
                    </View>
                    <Icon name="chev" size={15} color={c.tx4} sw={2} />
                  </Row>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
