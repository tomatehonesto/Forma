import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useStore } from '../logic/store';
import { M, nextSite, siteLabel, lastInjection, penStock } from '../logic/derive';
import { MO_LONG, DOW_PT, now, fmtTime, nf } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import { TelaInterna, Titulao, Campo, Opcoes, Opc, Stepper, Botao } from '../ui/internas';
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

type Zona = { id: string; x: number; y: number; w: number; h: number; r: number };

/* Coordenadas no viewBox 112×176 — a silhueta é esquemática de propósito:
   detalhe anatômico aqui só atrapalharia o reconhecimento das seis áreas. */
const ZONAS: Zona[] = [
  { id: 'braco-e', x: 15, y: 44, w: 16, h: 22, r: 8 },
  { id: 'braco-d', x: 81, y: 44, w: 16, h: 22, r: 8 },
  { id: 'abd-d', x: 40, y: 60, w: 15, h: 20, r: 7 },
  { id: 'abd-e', x: 57, y: 60, w: 15, h: 20, r: 7 },
  { id: 'coxa-d', x: 41, y: 100, w: 12, h: 26, r: 6 },
  { id: 'coxa-e', x: 59, y: 100, w: 12, h: 26, r: 6 },
];

function MapaCorpo({ escolhido, sugerido, onEscolher }: {
  escolhido: string; sugerido: string; onEscolher: (id: string) => void;
}) {
  const { c } = useTheme();
  /* A silhueta fica no tom mais claro da escala e as zonas recebem a
     lavagem azul: assim o que é TOCÁVEL se separa do que é só contorno.
     Zona e corpo no mesmo cinza — a primeira versão — deixava as seis
     áreas invisíveis, e o mapa virava desenho. */
  const corpo = c.bg2;
  return (
    <Svg width={112} height={176} viewBox="0 0 112 176">
      <Circle cx={56} cy={18} r={12} fill={corpo} />
      <Rect x={38} y={34} width={36} height={52} rx={12} fill={corpo} />
      <Rect x={14} y={38} width={18} height={52} rx={9} fill={corpo} />
      <Rect x={80} y={38} width={18} height={52} rx={9} fill={corpo} />
      <Rect x={40} y={92} width={14} height={70} rx={7} fill={corpo} />
      <Rect x={58} y={92} width={14} height={70} rx={7} fill={corpo} />

      {ZONAS.map((z) => {
        const on = z.id === escolhido;
        const sug = z.id === sugerido;
        return (
          <Rect
            key={z.id}
            x={z.x} y={z.y} width={z.w} height={z.h} rx={z.r}
            fill={on ? c.accent : sug ? c.limeSoft : c.accentWeak}
            stroke={on ? c.accent : sug ? c.limeDim : c.accentLine}
            strokeWidth={1.5}
            strokeDasharray={!on && sug ? '3 3' : undefined}
            onPress={() => onEscolher(z.id)}
          />
        );
      })}
    </Svg>
  );
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

  const [quando, setQuando] = useState('agora');
  const [dose, setDose] = useState<number>(S.profile.dose);
  const [site, setSite] = useState(sugerido);
  const [outraCaneta, setOutraCaneta] = useState(false);

  const passo = (d: number) => {
    const i = med.doses.indexOf(dose);
    const j = Math.max(0, Math.min(med.doses.length - 1, (i < 0 ? 0 : i) + d));
    setDose(med.doses[j]);
  };

  const hoje = now();
  const salvar = () => {
    update((s: any) => {
      s.injections.push({ t: +now(), med: s.profile.med, dose, site, note: '' });
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

      <Campo rotulo="Quando">
        <Opcoes>
          <Opc label={`Agora · ${fmtTime(hoje)}`} on={quando === 'agora'} onPress={() => setQuando('agora')} />
          <Opc label="Outro horário" on={quando === 'hora'} onPress={() => setQuando('hora')} />
          <Opc label="Outro dia" on={quando === 'dia'} onPress={() => setQuando('dia')} />
        </Opcoes>
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
