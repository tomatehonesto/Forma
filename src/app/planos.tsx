import React from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../logic/store';
import { PLANOS, RECOMENDADO, reais, economiaEmReais, isento, assinar, type Plano } from '../logic/assinatura';
import { useAurora } from '../ui/aurora';
import { TEM_REDE_PARCEIRA } from '../logic/mercado';
import { D_SIMBOLO, RAZAO_SIMBOLO } from '../ui/marca';
import { Txt, Row } from '../ui/kit';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { paletaDe, mix, alfa, radius, font } from '../theme';

/* ============================================================
   PLANOS — a tela que pede dinheiro

   ⚠️ O BOTÃO NÃO COMPRA NADA, E ELE DIZ ISSO.

   Não há loja ligada (ver src/logic/assinatura.ts e PENDENCIAS.md, item
   5). A tela está inteira — é o desenho que a integração vai vestir —, e
   o toque no botão devolve o estado real em vez de uma animação de
   sucesso. Um paywall que finge cobrar é a pior porta emparedada que um
   aplicativo pode ter, porque a pessoa sai dela achando que pagou.

   ⚠️ ELA JÁ É O FIM DO CADASTRO, e é a única porta por enquanto: o
   botão "Ver planos" da tela de plano inicial entrega aqui. Nenhuma
   outra tela do aplicativo empurra para cá, e nenhuma função está
   trancada atrás dela — quem fechar segue com tudo, porque a cobrança
   não existe. Os outros gatilhos entram com a loja.

   O QUE ESTA TELA DELIBERADAMENTE NÃO FAZ

     · não inventa prêmio nem depoimento. As telas de plano que se
       copiam por aí abrem com "Apple Design Award" e cinco estrelas de
       um usuário chamado Volan_deMort — e uma recomendação que não
       existe é mentira mesmo quando é só um rascunho de layout, porque
       é exatamente o tipo de coisa que sobrevive até a produção;
     · não anuncia teste grátis. Os Termos dão sete dias de
       arrependimento (CDC art. 49), que é direito de quem JÁ comprou.
       Vender um como o outro é o tipo de atalho que depois vira
       reclamação com razão;
     · não esconde o preço cheio atrás do "por mês". O anual aparece
       pelos dois números, porque quem decide precisa dos dois.

   A LINHA DO CÓDIGO FICA EMBAIXO DOS PREÇOS, e é o lugar certo dela: no
   cadastro, perguntar por indicação antes de mostrar o custo era
   anunciar um prêmio e depois fazer a pergunta que o concede. Aqui a
   ordem se inverte — a pessoa já viu o preço, e quem tem código digita
   porque tem.
   ============================================================ */

function IconeDoApp({ lado }: { lado: number }) {
  const S = useStore((s) => s.S);
  const p = paletaDe((S as any).paleta);
  const largura = lado * 0.56;
  return (
    <LinearGradient
      colors={[mix(p.acaoClara, '#FFFFFF', 0.2), mix(p.acaoClara, '#000000', 0.42)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: lado, height: lado, borderRadius: lado * 0.225, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={largura} height={largura / RAZAO_SIMBOLO} viewBox="0 0 533 222">
        <Path d={D_SIMBOLO} fill={p.alcancado} />
      </Svg>
    </LinearGradient>
  );
}

/* O QUE A ASSINATURA DÁ É O APLICATIVO, e a lista diz isso em coisas que
   a pessoa reconhece de tê-las usado — não em substantivos de marketing.
   Cinco linhas, porque a sexta ninguém lê. */
const ENTRA: [string, string][] = [
  ['check', 'O dia registrado, do peso ao sintoma'],
  ['spark', 'As leituras dos seus próprios números'],
  ['doc', 'O resumo pronto para qualquer consulta'],
  ['chart', 'Exames, medidas e fotos com histórico'],
  ['companion', 'O assistente e a leitura do prato por foto'],
];

export default function Planos() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  /* ⚠️ O X PRECISA FUNCIONAR NAS DUAS ENTRADAS.

     Quem chega pelo fim do cadastro chega por `replace`: não há tela
     atrás, e um `back` puro não faria nada — o botão de fechar de uma
     tela que pede dinheiro é o último lugar do aplicativo onde um toque
     pode não responder. Havendo história, volta; não havendo, entra no
     aplicativo, que é para onde essa pessoa ia de qualquer jeito. */
  const fechar = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)' as any);
  };

  const aurora = useAurora();
  const [escolhido, setEscolhido] = React.useState<Plano['id']>(RECOMENDADO);
  /* ⚠️ QUEM É ISENTA TAMBÉM PODE QUERER VER O PREÇO, e até aqui não
     podia: a tela dela era uma folha só, com "você não paga" e nenhuma
     saída. Era um beco, e um beco em cima da única pergunta que essa
     pessoa tem motivo para fazer — quanto custaria se o vínculo
     terminasse. Os próprios Termos prometem avisá-la antes de qualquer
     cobrança começar; esconder o valor até lá é prometer um aviso sobre
     um número secreto. */
  const [verPrecos, setVerPrecos] = React.useState(false);
  const [recusa, setRecusa] = React.useState(false);

  const plano = PLANOS.find((x) => x.id === escolhido)!;

  const comprar = async () => {
    const r = await assinar(escolhido);
    if (!r.ok) setRecusa(true);
  };

  /* Quem tem vínculo não vê preço. Ela não está fora de uma oferta: está
     dentro do acordo que a clínica já fez por ela, e os Termos prometem
     aviso antes de qualquer cobrança começar. */
  if (isento(S) && !verPrecos) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 12 }}>
        <Row style={{ paddingHorizontal: 20, justifyContent: 'flex-end' }}>
          <Pressable onPress={fechar} hitSlop={10}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={16} color={c.tx2} sw={2.2} />
            </View>
          </Pressable>
        </Row>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 }}>
          <IconeDoApp lado={64} />
          <Txt v="h2" style={{ textAlign: 'center' }}>Você não paga pelo aplicativo</Txt>
          <Txt v="note" c={c.tx3} style={{ textAlign: 'center', lineHeight: 22 }}>
            O acesso vem do seu vínculo com {S.profile.clinic || 'a clínica que acompanha você'}, e
            vale enquanto ele durar. Se ele terminar, avisamos antes de qualquer cobrança.
          </Txt>
          <Pressable
            onPress={() => setVerPrecos(true)}
            hitSlop={8}
            style={({ pressed }) => [{ marginTop: 6, opacity: pressed ? 0.6 : 1 }]}
          >
            <Txt v="label" c={c.accent2}>Ver os planos mesmo assim</Txt>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* ---- o alto ----

            ⚠️ A AURORA, E NÃO UM FUNDO CHAPADO. As telas de plano que se
            copiam por aí abrem com gradiente, orbe ou foto — e a razão é
            boa: uma tela que pede dinheiro precisa parecer o produto, e
            não um formulário. Só que o gradiente delas é decoração
            genérica; este é a mesma imagem que abre a Home e o Insights,
            na cor que a pessoa escolheu.

            É a diferença entre "parece um app bonito" e "é o app que eu
            estou usando", e é de graça: a peça já existe, já segue a
            paleta e já veste o resto do aplicativo. */}
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 30 }}>
          <Image source={aurora.hero} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={[alfa(c.veu, 0.55), alfa(c.veu, 0.34), c.bg]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* O X, E NÃO A SETA. Seta diz "volte um passo"; X diz "isto é
              uma interrupção, e você pode encerrá-la". Numa tela que pede
              dinheiro, a diferença entre as duas é quem está no comando. */}
          <Row style={{ justifyContent: 'flex-end' }}>
            <Pressable onPress={fechar} hitSlop={10} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={16} color="#FFFFFF" sw={2.2} />
              </View>
            </Pressable>
          </Row>

          <View style={{ alignItems: 'center', gap: 12, marginTop: 10 }}>
            <IconeDoApp lado={64} />
            <Txt v="h1" c="#FFFFFF" style={{ textAlign: 'center', letterSpacing: -1 }}>
              O tratamento inteiro,{'\n'}num lugar só
            </Txt>
            <Txt v="note" c="rgba(255,255,255,0.78)" style={{ textAlign: 'center', lineHeight: 22 }}>
              Um plano só, com tudo dentro. Não existe função melhor guardada atrás de
              um plano melhor.
            </Txt>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
        {/* A faixa existe para a isenta não achar que perdeu o benefício
            ao chegar aqui. Ela veio ver um número, e não trocar de
            condição. */}
        {isento(S) ? (
          <View style={{ backgroundColor: c.limeWeak, borderRadius: radius.lg, padding: 14, marginBottom: 18 }}>
            <Txt v="caption" c={c.tx} style={{ lineHeight: 19 }}>
              Você não paga nada hoje — isto é o que valeria se o vínculo com a clínica
              terminasse.
            </Txt>
          </View>
        ) : null}
        {/* ⚠️ UMA LINHA POR ITEM, E NÃO UM PARÁGRAFO.

            Cada um destes já foi uma frase de duas linhas — "o registro do
            dia inteiro, peso, aplicações, sintomas, água, proteína e
            movimento" —, e cinco parágrafos empilhados numa tela de preço
            é o texto que ninguém lê exatamente onde a pessoa mais precisa
            entender. A lista é uma varredura, não uma leitura. */}
        <View style={{ gap: 11, marginTop: 4 }}>
          {ENTRA.map(([ic, t]) => (
            <Row key={t} gap={11} style={{ alignItems: 'center' }}>
              <Icon name={ic} size={16} color={c.accent} sw={2} />
              <Txt v="caption" c={c.tx2} style={{ flex: 1 }}>{t}</Txt>
            </Row>
          ))}
        </View>

        {/* ---- os planos ---- */}
        <Row gap={10} style={{ marginTop: 28, alignItems: 'stretch' }}>
          {PLANOS.map((p) => {
            const on = p.id === escolhido;
            return (
              <Pressable key={p.id} onPress={() => { setEscolhido(p.id); setRecusa(false); }} style={{ flex: 1 }}>
                <View style={{
                  backgroundColor: on ? c.accentWeak : c.bg1,
                  borderWidth: 1.5, borderColor: on ? c.accent : c.line,
                  borderRadius: radius.lg, padding: 16, gap: 3, minHeight: 116, justifyContent: 'center',
                }}>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Txt v="label" c={on ? c.accent2 : c.tx2}>{p.nome}</Txt>
                    {p.economia ? (
                      <View style={{ backgroundColor: on ? c.accent : c.bg3, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Txt v="micro" c={on ? c.accentInk : c.tx3}>−{p.economia}%</Txt>
                      </View>
                    ) : null}
                  </Row>
                  <Txt v="h2" style={{ marginTop: 6 }}>{reais(p.porMes)}</Txt>
                  <Txt v="micro" c={c.tx3}>por mês</Txt>
                  {/* ⚠️ O PREÇO CHEIO FICA À VISTA. Mostrar só "por mês" num
                      plano anual é a conta que o anúncio faz e a fatura
                      desmente. */}
                  {p.id === 'anual' ? (
                    <Txt v="micro" c={c.tx4} style={{ marginTop: 3 }}>{reais(p.preco)} {p.periodo}</Txt>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </Row>

        {/* ⚠️ A ECONOMIA EM DINHEIRO, e não só em porcentagem. "−44%"
            é o número do anúncio; quanto se deixa de gastar é a conta que
            a pessoa faz. Ela aparece só quando o anual está escolhido,
            porque no mensal ela é uma cutucada. */}
        {escolhido === 'anual' ? (
          <Txt v="caption" c={c.tx3} style={{ marginTop: 12, textAlign: 'center' }}>
            São {reais(economiaEmReais())} a menos do que doze meses no mensal.
          </Txt>
        ) : null}

        {recusa ? (
          /* ⚠️ A RECUSA HONESTA. Enquanto a loja não está ligada, o botão
             responde o que é verdade — e não com um erro genérico, que
             faria a pessoa tentar de novo. */
          <View style={{ marginTop: 16, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16, gap: 5 }}>
            <Txt v="bodyMed">A assinatura ainda não está ligada</Txt>
            <Txt v="caption" c={c.tx3} style={{ lineHeight: 19 }}>
              Esta tela existe, a cobrança ainda não. Nada foi cobrado de você, e o aplicativo
              segue inteiro do jeito que está.
            </Txt>
          </View>
        ) : null}

        <Pressable onPress={comprar} style={({ pressed }) => [{ marginTop: 18, opacity: pressed ? 0.85 : 1 }]}>
          <View style={{ backgroundColor: c.accent, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' }}>
            <Txt v="body" c={c.accentInk} style={{ fontFamily: font.bodyMed }}>
              Assinar {plano.nome.toLowerCase()} — {reais(plano.preco)}
            </Txt>
          </View>
        </Pressable>

        {/* A LETRA MIÚDA DIZ O QUE ACONTECE DEPOIS, que é o que falta em
            quase toda tela de plano: quando renova, como cancela, e o
            prazo de arrependimento que a lei dá. */}
        <Txt v="micro" c={c.tx4} style={{ marginTop: 12, textAlign: 'center', lineHeight: 17 }}>
          Renova automaticamente {plano.id === 'anual' ? 'a cada ano' : 'a cada mês'} até você cancelar,
          pela própria loja. Sete dias para desistir com reembolso integral, e cancelar não apaga
          nenhum registro seu.
        </Txt>

        {/* ---- o código ---- */}
        {TEM_REDE_PARCEIRA ? (
          <Pressable
            onPress={() => router.push('/parceiros' as any)}
            style={({ pressed }) => [{ marginTop: 22, opacity: pressed ? 0.6 : 1 }]}
          >
            <Row gap={8} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="steth" size={15} color={c.accent2} sw={1.9} />
              <Txt v="label" c={c.accent2}>Tenho um código de um especialista parceiro</Txt>
            </Row>
          </Pressable>
        ) : null}

        <Row gap={16} style={{ marginTop: 24, justifyContent: 'center' }}>
          {([
            ['Restaurar compras', null],
            ['Termos', '/documento?id=termos'],
            ['Privacidade', '/documento?id=privacidade'],
          ] as [string, string | null][]).map(([rotulo, to]) => (
            <Pressable
              key={rotulo}
              onPress={() => { if (to) router.push(to as any); else setRecusa(true); }}
              hitSlop={8}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Txt v="micro" c={c.tx3}>{rotulo}</Txt>
            </Pressable>
          ))}
        </Row>

        <View style={{ height: insets.bottom + 8 }} />
        </View>
      </ScrollView>
    </View>
  );
}
