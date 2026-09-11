import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { cicloFases, M } from '../logic/derive';
import { DOW_PT, MO_LONG } from '../logic/time';
import { Txt } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Progresso, Sanfona, SanfonaLinha, Aviso, Botao,
} from '../ui/internas';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   CICLO DA DOSE

   A tela responde uma pergunta que a pessoa faz por volta do quinto dia:
   "por que a fome voltou?". A resposta é que o ciclo tem forma — sobe,
   estabiliza, cede — e que o ponto em que ela está é o ponto em que isso
   acontece com todo mundo.

   Por isso a tela abre dizendo o DIA, não a fase: "Dia 5 depois da
   aplicação" é o fato que ela pode conferir; "descida" é a interpretação,
   e vem logo abaixo, na linha que já está aberta.

   A versão anterior tinha anel, stepper horizontal, carrossel de sintomas
   e curva de previsão — quatro instrumentos para dizer uma coisa só. Uma
   barra e quatro linhas dizem o mesmo e sobra tela para o conteúdo, que é
   o que a pessoa veio ler.
   ============================================================ */

const porExtenso = (d: Date) => `${DOW_PT[d.getDay()]}, ${d.getDate()} de ${MO_LONG[d.getMonth()]}`;

export default function Ciclo() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const cic = cicloFases(S);
  const med = M(S);

  return (
    <TelaInterna
      titulo="Ciclo da dose"
      rodape={<Botao label="Registrar aplicação" onPress={() => router.push('/aplicacao' as any)} />}
    >
      <Titulao
        titulo={`Dia ${cic.dayIn} depois${'\n'}da aplicação`}
        lead="O efeito da caneta sobe nos primeiros dias e vai cedendo até a próxima dose. O que você sente muda junto — e isso é esperado."
      />

      <Progresso
        label="Ciclo atual"
        valor={`dia ${cic.dayIn} de ${cic.total}`}
        pct={cic.pct}
        nota={`Próxima dose ${porExtenso(cic.nextDose)}`}
      />

      <Bloco titulo="As quatro fases">
        <Sanfona>
          {cic.fases.map((f) => {
            const itens: [string, string][] = [['Comum', f.comum], ['Ajuda', f.ajuda]];
            if (f.atencao) itens.push(['Atenção', f.atencao]);
            return (
              <SanfonaLinha
                key={f.key}
                titulo={f.titulo}
                sub={f.sub}
                selo={f.selo}
                seloTom={f.estado === 'agora' ? 'verde' : 'neutra'}
                /* a fase de agora já vem aberta: é a única que a pessoa
                   abriu o app para ler, e fazê-la tocar para descobrir isso
                   é cobrar um gesto pelo conteúdo principal da tela */
                aberta={f.estado === 'agora'}
                itens={itens}
              />
            );
          })}
        </Sanfona>
      </Bloco>

      <Aviso
        titulo="Isto é conteúdo geral"
        texto={`O ciclo varia de pessoa para pessoa e com a dose. Nada aqui substitui a orientação do seu médico.`}
      />

      {/* Rodapé do conteúdo, não da tela: diz de qual medicamento a leitura
          acima está falando, sem ocupar o topo com isso. */}
      <View style={{ alignItems: 'center', marginTop: -10 }}>
        <Txt v="caption" c={c.tx4}>
          Baseado no comportamento típico da {med.mol.toLowerCase()}
        </Txt>
      </View>
    </TelaInterna>
  );
}
