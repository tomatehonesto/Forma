import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, nextSite, siteLabel, penStock, diasParaAplicar, instanteDaAplicacao, rodizioDeLocais,
} from '../logic/derive';
import { MO_LONG, DOW_PT, now, fmtTime, nf } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Campo, Chips, Opcoes, Opc, Stepper, Botao } from '../ui/internas';
import { Corpo, ZONAS } from '../ui/corpo';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   REGISTRAR APLICAÇÃO

   O formulário mais importante do app, e o que mais precisa sair da
   frente: quem está com a caneta na mão quer terminar isso em segundos.
   Por isso tudo chega preenchido — hora agora, dose atual, caneta em uso,
   local sugerido pela rotação — e cada campo existe só para o caso de a
   pessoa querer discordar do padrão.

   O mapa do corpo é a única parte que pede atenção, e é intencional. A
   rotação de local não é burocracia: repetir o mesmo ponto causa nódulo e
   irritação, e é o tipo de coisa que ninguém lembra de controlar de
   cabeça. O mapa mostra o sugerido em lima tracejado e aceita qualquer
   outro sem reclamar — a legenda diz "sem problema, é só um lembrete",
   porque escolher outro lugar é decisão dela, não erro.
   ============================================================ */

/* O corpo mora em src/ui/corpo.tsx: duas telas desenham a mesma
   silhueta e querem coisas diferentes dela — aqui ela é um seletor, na
   tela de aplicações ela mostra o rodízio. */
/* O MAPA PASSA A MOSTRAR O DESCANSO, e não só a sugestão.

   Antes ele tinha duas cores: azul no escolhido, lima tracejado no
   sugerido, e todo o resto igual. A pessoa via QUAL o app recomenda, e
   não POR QUÊ — que é a informação que faz ela concordar ou discordar
   com conhecimento de causa.

   Agora cada local tem a força do tempo que descansa: cheio é o que foi
   usado por último, e vai clareando. É o mesmo desenho do rodízio na
   tela de aplicações — quem viu lá reconhece aqui. */
function MapaCorpo({ escolhido, sugerido, rodizio, onEscolher }: {
  escolhido: string; sugerido: string;
  rodizio: { id: string; semanas: number | null }[];
  onEscolher: (id: string) => void;
}) {
  const { c } = useTheme();
  const tons = Object.fromEntries(ZONAS.map((z) => {
    const on = z.id === escolhido;
    const sug = z.id === sugerido;
    const l = rodizio.find((x) => x.id === z.id);
    /* Quatro semanas é o teto: além disso o local está tão livre quanto
       qualquer outro, e continuar clareando inventaria diferença. */
    const desc = l?.semanas == null ? 1 : Math.min(1, l.semanas / 4);
    return [z.id, {
      fill: on ? c.accent : c.accent,
      opacidade: on ? 1 : 0.40 * (1 - desc) + 0.05,
      stroke: on ? c.accent : sug ? c.limeDim : c.accentLine,
      tracejada: !on && sug,
    }];
  }));
  return <Corpo tons={tons} onEscolher={onEscolher} />;
}

export default function Aplicacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const sugerido = nextSite(S);
  const rod = rodizioDeLocais(S);
  const est = penStock(S);

  /* O DIA da aplicação, e não um "quando" solto. '0' é hoje. */
  const dias = diasParaAplicar(S);
  const [dia, setDia] = useState('0');
  const [dose, setDose] = useState<number>(S.profile.dose);
  const [site, setSite] = useState(sugerido);
  const [outraCaneta, setOutraCaneta] = useState(false);

  const passo = (d: number) => {
    const i = med.doses.indexOf(dose);
    const j = Math.max(0, Math.min(med.doses.length - 1, (i < 0 ? 0 : i) + d));
    setDose(med.doses[j]);
  };

  const hoje = now();
  const quando = dias.find((d) => d.id === dia) || dias[0];
  const salvar = () => {
    update((s: any) => {
      s.injections.push({ t: instanteDaAplicacao(quando.t), med: s.profile.med, dose, site, note: '' });
      s.profile.dose = dose;
      if (s.pen) s.pen.dosesLeft = Math.max(0, s.pen.dosesLeft - 1);
    });
    router.replace('/aplicacao-ok' as any);
  };

  return (
    <TelaInterna
      titulo="Aplicação"
      fechar
      acao="Salvar"
      onAcao={salvar}
      rodape={<Botao label="Salvar aplicação" onPress={salvar} />}
    >
      {/* Em uma linha só: "Registrar" e "aplicação" quebrados viravam duas
          linhas de titulão para duas palavras que sempre andam juntas. */}
      <Titulao
        titulo="Registrar aplicação"
        lead={`${DOW_PT[hoje.getDay()].charAt(0).toUpperCase()}${DOW_PT[hoje.getDay()].slice(1)}, ${hoje.getDate()} de ${MO_LONG[hoje.getMonth()]} · dose prevista para hoje`}
      />

      {/* O DIA, e só ele.

          Eram três opções — Agora, Outro horário, Outro dia — e as três
          gravavam a hora de AGORA: a escolha era lida na tela e jogada
          fora no salvar. Quem aplicou na sexta e registrou no domingo
          ficava com uma aplicação de domingo, e a próxima data saía dois
          dias errada.

          "Outro horário" não voltou. A hora de uma aplicação não aparece
          em lugar nenhum do app — o histórico mostra data, o calendário
          conta por dia, a curva farmacológica trabalha em dias. Um
          controle cujo valor ninguém lê é uma pergunta respondida à toa. */}
      <Campo
        rotulo="Quando"
        ajuda={dia === '0'
          ? `Fica registrada agora, ${fmtTime(hoje)}.`
          : 'Registrar depois não muda nada além da data — a contagem da próxima dose sai daqui.'}
      >
        <Chips itens={dias} valor={dia} onChange={setDia} />
      </Campo>

      <Campo rotulo="Dose" ajuda={`Sua dose atual é ${nf(S.profile.dose, 1).replace('.', ',')} ${med.unit}.`}>
        <Stepper
          valor={nf(dose, 1).replace('.', ',')}
          unidade={med.unit}
          onMenos={() => passo(-1)}
          onMais={() => passo(1)}
        />
      </Campo>

      <Campo
        rotulo="Local da aplicação"
        ajuda="Alternar o local a cada semana ajuda a evitar irritação e nódulos na pele."
      >
        {/* O QUE A COLUNA DA DIREITA DIZ MUDOU DE ASSUNTO.

            Ela era uma legenda de cores — "sugerido pela rotação",
            "escolhido" —, duas linhas para explicar o próprio desenho. O
            que a pessoa precisa saber ao tocar num local é HÁ QUANTO
            TEMPO ele descansa, que é a razão inteira de existir rotação.
            A legenda sai; o fato entra, e muda a cada toque. */}
        <Row style={{ gap: 16, alignItems: 'center' }}>
          <MapaCorpo escolhido={site} sugerido={sugerido} rodizio={rod} onEscolher={setSite} />
          <View style={{ flex: 1, gap: 6 }}>
            <Txt v="bodyMed">{siteLabel(site)}</Txt>
            <Txt v="caption" c={c.tx2}>
              {(() => {
                const l = rod.find((x) => x.id === site);
                if (!l || l.semanas == null) return 'Ainda não usado neste tratamento.';
                if (l.semanas === 0) return 'Usado esta semana.';
                return `Descansando há ${l.semanas} ${l.semanas === 1 ? 'semana' : 'semanas'}.`;
              })()}
            </Txt>
            <Txt v="caption" c={site === sugerido ? c.accent : c.tx3}>
              {site === sugerido
                ? 'É o próximo da rotação.'
                : 'Fora da rotação sugerida — sem problema, é só um lembrete.'}
            </Txt>
          </View>
        </Row>
      </Campo>

      <Campo
        rotulo="Caneta"
        ajuda={est.left <= 1 ? 'Esta é a última dose desta caneta.' : `Restam ${est.left} doses nesta caneta.`}
      >
        <Opcoes>
          <Opc
            label={`${med.label} ${nf(dose, 1).replace('.', ',')} ${med.unit} · ${est.total - est.left + 1}ª dose`}
            on={!outraCaneta}
            onPress={() => setOutraCaneta(false)}
          />
          <Opc label="Outra caneta" on={outraCaneta} onPress={() => { setOutraCaneta(true); router.push('/caneta-nova' as any); }} />
        </Opcoes>
      </Campo>

      <View />
    </TelaInterna>
  );
}
