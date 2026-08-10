import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../logic/store';
import { MO_LONG, nf } from '../logic/time';
import { journeyDay, hasClinic, penStock, M } from '../logic/derive';
import { Screen, Txt, Row, SectionHead, CircleBtn, ListRow } from '../ui/kit';
import { Malha, Segmentado } from '../ui/instrumentos';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { radius } from '../theme';

/* ============================================================
   PERFIL — a ficha e os controles

   É a última área da árvore, e a mais fácil de fazer errado: tela de
   configuração vira, por inércia, uma pilha de linhas cinzas com
   chevron. Funciona e não diz nada — e num app de tratamento ela é onde
   moram os números que TODO o resto calcula.

   Por isso a tela tem duas naturezas e as separa de propósito:

   Em cima, a ficha. Altura, peso inicial, meta, medicamento e dose não
   são preferências: são os parâmetros do tratamento, e cada gráfico do
   app é uma conta feita em cima deles. Ganham forma de dado — valor
   grande, rótulo pequeno — porque é o que são.

   Embaixo, os controles. Aí sim linha com chevron, que é a gramática
   certa para navegação e a mesma do resto do app.

   O QUE ESTA TELA NÃO FAZ

   Não pinta. A malha escura é a voz da inteligência do Morphi — hero de
   Cuidado, card do Morphi em Insights — e usá-la aqui diluiria o
   significado dela em troca de bonito. O princípio 6 diz que atmosfera é
   evento; configuração não é evento. A malha clara aparece uma vez, atrás
   da identidade, no mesmo papel que tem no banner da especialista: fundo
   de retrato, não superfície de marca.
   ============================================================ */

/* casa decimal só quando existe: "68,0 kg" para uma meta redonda finge
   uma precisão que a pessoa não definiu, e num par lado a lado com
   "82,4 kg" a simetria dos dois faz o zero parecer medido */
const kg = (n: number) => nf(n, n % 1 ? 1 : 0).replace('.', ',');

/** Um número da ficha. Valor e unidade como dois elementos (princípio 9):
    a coluna alinha pela base do valor e o olho compara antes de ler. */
function Dado({ valor, unidade, label, onPress }: {
  valor: string; unidade?: string; label: string; onPress?: () => void;
}) {
  const { c } = useTheme();
  const corpo = (
    <View style={{ flex: 1, backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
      <Row gap={4} style={{ alignItems: 'baseline' }}>
        <Txt v="h1" style={{ fontSize: 24 }}>{valor}</Txt>
        {!!unidade && <Txt v="caption" c={c.tx3}>{unidade}</Txt>}
      </Row>
      <Txt v="micro" c={c.tx3} style={{ marginTop: 6 }}>{label}</Txt>
    </View>
  );
  if (!onPress) return corpo;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]}>
      {corpo}
    </Pressable>
  );
}

/** Grupo de linhas dentro de um card, com fio entre elas — o mesmo padrão
    de "Gerar resumos" no Insights e da área médica na Home. Repetir poupa
    a pessoa de aprender um terceiro jeito de ler a mesma coisa. */
function Grupo({ title, children }: { title: string; children: React.ReactNode }) {
  const { c } = useTheme();
  const linhas = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={{ marginTop: 32 }}>
      <SectionHead title={title} />
      <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
        {linhas.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={{ height: 1, backgroundColor: c.line, marginVertical: 12 }} />}
            {l}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

export default function Perfil() {
  const S = useStore((s) => s.S);
  const setTheme = useStore((s) => s.setTheme);
  const { c, isDark } = useTheme();
  const router = useRouter();
  const go = (p: string) => () => router.push(p as any);

  const startD = new Date(S.profile.startT);
  /* mês por extenso: "membro desde Jun de 2026" tem o corte de abreviação
     no meio de uma frase corrida, e abreviar economiza quatro letras num
     lugar onde não falta espaço */
  const desde = `${MO_LONG[startD.getMonth()]} de ${startD.getFullYear()}`;
  const linked = hasClinic(S);
  const med = M(S);
  const p = penStock(S);
  const dose = nf(S.profile.dose, S.profile.dose % 1 ? 1 : 0);

  return (
    <Screen>
      <Row style={{ marginTop: 4 }} gap={12}>
        <CircleBtn name="back" onPress={() => router.back()} />
        <Txt v="h1" style={{ flex: 1 }}>Perfil</Txt>
      </Row>

      {/* ---- identidade ----

          Card único e alto em vez de linha de avatar com texto ao lado. A
          diferença é de assunto: linha apresenta um item de lista, card
          apresenta uma pessoa — e esta tela é sobre ela.

          A malha entra em meia força, atrás. É a mesma peça do banner da
          especialista em Cuidado, no mesmo papel: dar corpo a um retrato
          sem virar superfície de marca. */}
      <View style={{ borderRadius: radius.xl, overflow: 'hidden', marginTop: 20, backgroundColor: c.bg1 }}>
        <Malha id="perfilIdent" forca={0.5} />
        <View style={{ padding: 22 }}>
          <Row gap={16}>
            <View>
              {/* Inicial em degradê, não foto. Não existe upload de avatar
                  no app, e boneco genérico é pior que ausência: ele ocupa o
                  lugar da pessoa com uma que não é ela. A inicial em corpo
                  grande identifica sem fingir. */}
              <LinearGradient
                colors={[c.accent, c.accent2]}
                start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
                style={{ width: 68, height: 68, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
              >
                <Txt v="h1" c={c.accentInk} style={{ fontSize: 28 }}>{S.profile.name[0]}</Txt>
              </LinearGradient>
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="h2">{S.profile.name}</Txt>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 3 }}>{S.profile.email}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 8 }}>
                {S.profile.idade} anos · membro desde {desde}
              </Txt>
            </View>
          </Row>

          {/* A linha de continuidade. Ela é o que transforma a ficha em
              relação: "dia 71" diz há quanto tempo esta pessoa aparece, e é
              a informação que uma tela de conta normalmente não dá. */}
          <Row gap={7} style={{ marginTop: 18, alignSelf: 'flex-start', backgroundColor: c.limeWeak, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Icon name="spark" size={13} color={c.tx} sw={2} />
            {/* Só o dia. A semana também estava aqui e vinha de
                journeySummary, que a lê de protocol.week — uma terceira
                definição de "semana atual", diferente da que a régua de
                Cuidado usa. Duas contagens da mesma coisa em telas
                vizinhas é pior que uma contagem a menos. */}
            <Txt v="micro" c={c.tx}>Dia {journeyDay(S)} da sua jornada</Txt>
          </Row>
        </View>
      </View>

      {/* ---- a ficha ----

          Estes cinco números não são configuração, são o tratamento. Peso
          inicial define a perda; a meta define o quanto falta; a altura
          define o IMC; medicamento e dose definem a cadência, o ciclo e o
          estoque. Trocar qualquer um redesenha metade do app.

          Por isso ficam em forma de dado e no alto, e não escondidos atrás
          de "Dados pessoais" numa lista. Numa tela de tratamento, os
          parâmetros do tratamento são o conteúdo principal. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Sua ficha" />
        <Txt v="note" c={c.tx3} style={{ marginTop: 4 }}>
          Os números que o Morphi usa para calcular tudo o que te mostra.
        </Txt>

        <Row gap={10} style={{ marginTop: 14 }}>
          <Dado valor={kg(S.profile.startWeight)} unidade="kg" label="peso inicial" />
          <Dado valor={kg(S.profile.goalWeight)} unidade="kg" label="peso de referência" onPress={go('/metas')} />
        </Row>
        <Row gap={10} style={{ marginTop: 10 }}>
          <Dado valor={nf(S.profile.height, 2).replace('.', ',')} unidade="m" label="altura" />
          <Dado valor={String(S.profile.planoSemanas ?? 16)} unidade="semanas" label="plano da equipe" />
        </Row>

        {/* O medicamento sai da grade e vira linha inteira: ele não é um
            número entre outros, é o que dá nome ao tratamento — e é o único
            item da ficha que leva a algum lugar com conteúdo próprio. */}
        <Pressable onPress={go('/aplicacoes')} style={({ pressed }) => [{ marginTop: 10, opacity: pressed ? 0.7 : 1 }]}>
          <Row gap={14} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, padding: 16 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.accentWeak, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="syringe" size={19} color={c.accent} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">{med.label} {dose} {med.unit}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 3 }}>
                {med.cad === 'weekly' ? '1× por semana' : 'uso diário'} · {p.left} de {p.total} doses na caneta
              </Txt>
            </View>
            <Icon name="chev" size={14} color={c.tx4} sw={2} />
          </Row>
        </Pressable>
      </View>

      {/* ---- clínica ----
          Ganha camada própria só quando há vínculo. Sem ele, o card é
          convite e não item de configuração — por isso o texto explica o
          que muda em vez de nomear uma tela. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Sua clínica" />
        <Pressable onPress={linked ? go('/medico') : undefined} style={({ pressed }) => [{ marginTop: 14, opacity: pressed && linked ? 0.7 : 1 }]}>
          <Row gap={14} style={{ backgroundColor: linked ? c.bg1 : c.accentWeak, borderRadius: radius.lg, padding: 18 }}>
            <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: linked ? c.bg2 : c.bg1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="steth" size={19} color={linked ? c.tx2 : c.accent} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="bodyMed">{linked ? S.profile.clinic : 'Conectar a uma clínica'}</Txt>
              <Txt v="micro" c={c.tx3} style={{ marginTop: 3, lineHeight: 17 }}>
                {linked
                  ? `${S.profile.doctor} · mensagens, consultas e equipe`
                  : 'Opcional — o Morphi funciona completo sem vínculo.'}
              </Txt>
            </View>
            {linked && <Icon name="chev" size={14} color={c.tx4} sw={2} />}
          </Row>
        </Pressable>
      </View>

      {/* ---- aparência ----
          Segmentado e não linha que alterna ao toque. A linha escondia o
          estado atrás da ação: para saber em que tema estava, era preciso
          ler o texto do subtítulo. Com dois recortes visíveis, o estado É
          a interface, e o toque leva direto ao que se quer em vez de
          alternar. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Aparência" />
        <Row gap={14} style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
          <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={isDark ? 'moonToggle' : 'sun'} size={17} color={c.tx} sw={1.8} />
          </View>
          <Txt v="body" style={{ flex: 1 }}>Tema</Txt>
          <Segmentado
            opcoes={['Claro', 'Escuro']}
            valor={isDark ? 'Escuro' : 'Claro'}
            onChange={(v) => setTheme(v === 'Escuro' ? 'dark' : 'light')}
          />
        </Row>
      </View>

      <Grupo title="Acompanhamento">
        <ListRow ic="target" title="Metas diárias"
          sub={`${S.profile.targets.prot} g de proteína · ${nf(S.profile.targets.waterMl / 1000, 1).replace('.', ',')} L de água`}
          onPress={go('/metas')} />
        <ListRow ic="clock" title="Lembretes"
          sub="Dose, pesagem, água e proteína" onPress={go('/lembretes')} />
        <ListRow ic="bell" title="Notificações" dot={S.notifications.length > 0}
          sub={`${S.notifications.length} ${S.notifications.length === 1 ? 'aviso recente' : 'avisos recentes'}`}
          onPress={go('/notificacoes')} />
        <ListRow ic="trend" title="Dispositivos e integrações"
          sub="Apple Health, Withings e mais" onPress={go('/integracoes')} />
      </Grupo>

      <Grupo title="Seus registros">
        <ListRow ic="ruler" title="Histórico completo"
          sub="Tudo o que você registrou, dia a dia" onPress={go('/historico')} />
        <ListRow ic="trophy" title="Conquistas"
          sub="O que você já alcançou no tratamento" onPress={go('/conquistas')} />
        <ListRow ic="doc" title="Resumo para o médico"
          sub="Documento com a evolução completa" onPress={go('/resumo-medico')} />
      </Grupo>

      {/* ---- privacidade ----

          Estas três linhas não navegam, e é uma decisão e não uma pendência:
          o que elas têm a dizer cabe na própria linha. Chevron que não leva
          a lugar nenhum é a pior linha de uma lista — ela promete conteúdo
          e cobra um toque para revelar que não há.

          O texto da privacidade é literal e verificável: não existe backend,
          então os dados estão de fato só no aparelho. No dia em que houver
          sincronização, esta frase muda antes do código. */}
      <View style={{ marginTop: 32 }}>
        <SectionHead title="Privacidade" />
        <View style={{ backgroundColor: c.bg1, borderRadius: radius.lg, marginTop: 14, padding: 16 }}>
          <Row gap={12} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="lock" size={17} color={c.tx} sw={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="body">Seus dados ficam no seu aparelho</Txt>
              <Txt v="caption" c={c.tx3} style={{ marginTop: 3, lineHeight: 19 }}>
                Peso, sintomas, aplicações e fotos não saem daqui. Nada é enviado
                para a clínica sem você tocar em enviar.
              </Txt>
            </View>
          </Row>
          <View style={{ height: 1, backgroundColor: c.line, marginVertical: 14 }} />
          <Row gap={12}>
            <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="info" size={17} color={c.tx} sw={1.8} />
            </View>
            <Txt v="body" style={{ flex: 1 }}>Morphi</Txt>
            <Txt v="caption" c={c.tx3}>versão 1.0.0</Txt>
          </Row>
        </View>
      </View>

      {/* Sair em texto e não em card tingido de vermelho. O card vermelho
          dava a "sair da conta" o peso visual de um alerta clínico, que é o
          que a cor de erro precisa continuar significando neste app —
          sintoma grave, exame fora da faixa. Sair é reversível: você
          entra de novo. */}
      <Pressable style={({ pressed }) => [{ marginTop: 32, alignSelf: 'center', opacity: pressed ? 0.6 : 1 }]}>
        <Row gap={9}>
          <Icon name="logout" size={17} color={c.tx3} sw={1.9} />
          <Txt v="bodyMed" c={c.tx3}>Sair da conta</Txt>
        </Row>
      </Pressable>
    </Screen>
  );
}
