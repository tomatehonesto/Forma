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
import { radius } from '../theme';

/* ============================================================
   REGISTRAR — captura de um momento, não menu de funcionalidade.

   A tela pergunta "o que aconteceu agora?" e a pessoa responde. Por isso
   os itens são acontecimentos em primeira pessoa ("Acabei de me pesar"),
   não nomes de tela ("Peso"): ela está acrescentando um momento à jornada,
   não escolhendo um formulário.

   Duas camadas, separadas pelo esforço:
     · agora — três atalhos CONTEXTUAIS, que mudam com o momento do
       tratamento e priorizam o que acontece todo dia
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
  const litros = (waterMlToday(S) / 1000).toFixed(1).replace('.', ',');
  const alvoL = ((S.profile as any).targets.waterMl / 1000).toFixed(1).replace('.', ',');
  const { motivo, acoes } = quickCapture(S);

  /* A aplicação era o único item que salvava aqui dentro, num toque, com
     dose e local no automático. Deixou de ser: ela é o registro que mais
     pede escolha (local da rotação, dose, qual caneta) e o único que mexe
     na contagem de doses — salvar no escuro deixava o estoque errado e
     tirava da pessoa a decisão de onde aplicar. Agora abre /aplicacao,
     que já chega com tudo preenchido para quem só quer confirmar. */

  /* Catálogo em primeira pessoa. O que a pessoa lê é o acontecimento; o
     nome da funcionalidade fica para a tela de destino. */
  const CATALOGO: Record<QuickKey, Item> = {
    agua: { ic: 'water', titulo: 'Bebi água', sub: `${litros} de ${alvoL} L hoje`, to: '/medir-agua' },
    exercicio: { ic: 'dumbbell', titulo: 'Me movimentei', sub: `${ci?.exerc || 0} min hoje`, to: '/medir-exercicio' },
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
      <Pressable onPress={fechar} style={[StyleSheet.absoluteFillObject, { backgroundColor: c.scrim }]} />

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
          {/* a pergunta é o comando da tela */}
          <Row style={{ alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Txt v="h2">O que aconteceu agora?</Txt>
              <Row gap={7} style={{ marginTop: 6 }}>
                <Icon name="spark" size={13} color={c.accent} sw={2} />
                <Txt v="note" c={c.tx3}>{motivo}</Txt>
              </Row>
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
          <Pressable onPress={irPara('/checkin')} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, marginTop: 18 }]}>
            <Row gap={14} style={{ backgroundColor: c.lime, borderRadius: radius.lg, padding: 16 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={ci ? 'check' : 'leaf'} size={20} color={c.limeInk} sw={2.2} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt v="body" c={c.limeInk}>
                  {ci ? 'Check-in concluído' : 'Como você está agora?'}
                </Txt>
                <Txt v="caption" c={c.limeInk} style={{ marginTop: 2, opacity: 0.7 }}>
                  {stk > 0 ? `${stk} dias seguidos` : ci ? 'registrado hoje' : 'menos de 30s'}
                </Txt>
              </View>
              {ci ? (
                <View style={{ backgroundColor: 'rgba(0,0,0,0.10)', borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7 }}>
                  <Txt v="label" c={c.limeInk}>Editar</Txt>
                </View>
              ) : (
                <Icon name="chev" size={17} color={c.limeInk} sw={2.2} />
              )}
            </Row>
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
                  <View style={{ flex: 1, backgroundColor: ok ? c.lime : lima ? c.lime : c.bg1, borderRadius: radius.lg, padding: 14, alignItems: 'center' }}>
                    <Icon name={ok ? 'check' : it.ic} size={21} color={ok || lima ? c.limeInk : c.accent} sw={2} />
                    <Txt v="caption" c={ok || lima ? c.limeInk : c.tx} style={{ marginTop: 10, textAlign: 'center' }} numberOfLines={2}>{it.titulo}</Txt>
                    <Txt v="micro" c={ok || lima ? c.limeInk : c.tx3} style={{ marginTop: 3, textAlign: 'center', opacity: lima && !ok ? 0.7 : 1 }} numberOfLines={1}>{it.sub}</Txt>
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
