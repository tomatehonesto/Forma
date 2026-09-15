import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import {
  M, nextSite, siteLabel, lastInjection, penStock, diasParaAplicar, instanteDaAplicacao,
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
function MapaCorpo({ escolhido, sugerido, onEscolher }: {
  escolhido: string; sugerido: string; onEscolher: (id: string) => void;
}) {
  const { c } = useTheme();
  /* O QUE AS CORES DIZEM AQUI: azul cheio é o escolhido, lima tracejado é
     o que a rotação sugere, e o resto é área disponível. */
  const tons = Object.fromEntries(ZONAS.map((z) => {
    const on = z.id === escolhido;
    const sug = z.id === sugerido;
    return [z.id, {
      fill: on ? c.accent : sug ? c.limeSoft : c.accentWeak,
      stroke: on ? c.accent : sug ? c.limeDim : c.accentLine,
      tracejada: !on && sug,
    }];
  }));
  return <Corpo tons={tons} onEscolher={onEscolher} />;
}

/* "no abdômen (esq.)" mas "na coxa (dir.)" — a lista de locais tem os dois
   gêneros, e concordar errado numa frase curta é o tipo de detalhe que faz
   o app soar automático. */
const artigo = (site: string) => (site.startsWith('coxa') ? 'na' : 'no');

export default function Aplicacao() {
  const S = useStore((s) => s.S);
  const update = useStore((s) => s.update);
  const { c } = useTheme();
  const router = useRouter();

  const med = M(S);
  const sugerido = nextSite(S);
  const ultima = lastInjection(S);
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
      <Titulao
        titulo={`Registrar${'\n'}aplicação`}
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
        <Row style={{ gap: 14, alignItems: 'center' }}>
          <MapaCorpo escolhido={site} sugerido={sugerido} onEscolher={setSite} />
          <View style={{ flex: 1, gap: 8 }}>
            <View>
              <Txt v="bodyMed">{siteLabel(site)}</Txt>
              <Txt v="caption" c={c.tx2} style={{ marginTop: 2 }}>
                {site === sugerido
                  ? `Sugerido: a última aplicação foi ${ultima ? `${artigo(ultima.site)} ${siteLabel(ultima.site).toLowerCase()}` : 'em outro local'}.`
                  : 'Fora da rotação sugerida — sem problema, é só um lembrete.'}
              </Txt>
            </View>
            <Row gap={7}>
              <View style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: c.limeSoft, borderWidth: 1, borderColor: c.limeDim }} />
              <Txt v="caption" c={c.tx2}>sugerido pela rotação</Txt>
            </Row>
            <Row gap={7}>
              <View style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: c.accent }} />
              <Txt v="caption" c={c.tx2}>escolhido</Txt>
            </Row>
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
