import React, { useMemo, useState } from 'react';
import { View, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { notasAbertas } from '../logic/derive';
import { MO_LONG, DAY, now } from '../logic/time';
import {
  TelaInterna, Titulao, Bloco, Campo, Opcoes, Opc, Cartao, Linha, Aviso, Botao,
} from '../ui/internas';

/* ============================================================
   EXPORTAR HISTÓRICO

   A tela monta o que a outra pessoa vai ler — e por isso a decisão
   central dela é o que FICA DE FORA.

   Cada linha de "o que entra" é um interruptor, não um item de leitura.
   Isso existe porque nem tudo que o app registra é da conta do médico:
   refeições e água são hábito, e muita gente não quer entregar isso numa
   consulta de endocrinologia. O padrão deixa esse bloco fora, e quem
   quiser inclui.

   E nada sai daqui sem passar pela prévia: a pessoa lê exatamente o que a
   outra vai ler, antes de existir link nenhum.
   ============================================================ */

const dataLonga = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };
const semanas = (ms: number) => Math.max(1, Math.round(ms / (7 * DAY)));

export default function Exportar() {
  const S = useStore((s) => s.S);
  const router = useRouter();
  const [per, setPer] = useState('consulta');
  const [fmt, setFmt] = useState('pdf');
  const [inclui, setInclui] = useState<Record<string, boolean>>({
    aplicacoes: true, peso: true, sintomas: true, notas: true, habitos: false,
  });
  const alterna = (k: string) => setInclui((x) => ({ ...x, [k]: !x[k] }));

  const ultimaConsulta = (S.consultsHistory as any[])[0]?.t ?? S.profile.startT;
  const desde = per === '4s' ? +now() - 28 * DAY : per === 'consulta' ? ultimaConsulta : S.profile.startT;

  const conta = useMemo(() => {
    const apos = (a: any[]) => a.filter((x) => x.t >= desde).length;
    return {
      aplicacoes: apos(S.injections as any[]),
      pesagens: apos(S.weights as any[]),
      medidas: apos(S.measures as any[]),
      checkins: apos(S.checkins as any[]),
      notas: notasAbertas(S).filter((n) => n.t >= desde).length,
      refeicoes: (S.checkins as any[]).filter((x) => x.t >= desde).reduce((s, x) => s + (x.refeicoes || 0), 0),
    };
  }, [S, desde]);

  const enviar = () => {
    const linhas = [
      `Histórico de tratamento · ${dataLonga(desde)} a ${dataLonga(+now())}`,
      inclui.aplicacoes ? `Aplicações: ${conta.aplicacoes}` : null,
      inclui.peso ? `Pesagens: ${conta.pesagens} · medidas: ${conta.medidas}` : null,
      inclui.sintomas ? `Check-ins: ${conta.checkins}` : null,
      inclui.notas ? `Notas para a consulta: ${conta.notas}` : null,
      '',
      'A prévia completa está no resumo para o médico.',
    ].filter(Boolean);
    Share.share({ message: linhas.join('\n') }).catch(() => {});
  };

  return (
    <TelaInterna
      titulo="Exportar histórico"
      rodape={
        <>
          <Botao label="Ver a prévia" onPress={() => router.push('/resumo-medico' as any)} />
          <Botao label="Enviar agora" tom="fantasma" onPress={enviar} />
        </>
      }
    >
      <Titulao
        titulo="Exportar"
        lead={`Monte o que ${S.profile.doctor} vai ver. Você pode revisar antes de enviar.`}
      />

      <Campo
        rotulo="Período"
        ajuda={`De ${dataLonga(desde)} a ${dataLonga(+now())} · ${semanas(+now() - desde)} semanas`}
      >
        <Opcoes>
          <Opc label="Últimas 4 semanas" on={per === '4s'} onPress={() => setPer('4s')} />
          <Opc label="Desde a última consulta" on={per === 'consulta'} onPress={() => setPer('consulta')} />
          <Opc label="Tratamento inteiro" on={per === 'tudo'} onPress={() => setPer('tudo')} />
        </Opcoes>
      </Campo>

      <Bloco titulo="O que entra">
        <Cartao>
          <Linha
            titulo="Aplicações"
            sub={`${conta.aplicacoes} registros · dose e local`}
            selo={inclui.aplicacoes ? 'incluído' : 'fora'}
            seloTom={inclui.aplicacoes ? 'verde' : 'neutra'}
            seta={false}
            onPress={() => alterna('aplicacoes')}
          />
          <Linha
            titulo="Peso e medidas"
            sub={`${conta.pesagens} ${conta.pesagens === 1 ? 'pesagem' : 'pesagens'} · ${conta.medidas} ${conta.medidas === 1 ? 'medida' : 'medidas'}`}
            selo={inclui.peso ? 'incluído' : 'fora'}
            seloTom={inclui.peso ? 'verde' : 'neutra'}
            seta={false}
            onPress={() => alterna('peso')}
          />
          <Linha
            titulo="Sintomas e check-ins"
            sub={`${conta.checkins} check-ins · intensidade por sintoma`}
            selo={inclui.sintomas ? 'incluído' : 'fora'}
            seloTom={inclui.sintomas ? 'verde' : 'neutra'}
            seta={false}
            onPress={() => alterna('sintomas')}
          />
          <Linha
            titulo="Notas para a consulta"
            sub={`${conta.notas} ${conta.notas === 1 ? 'anotação' : 'anotações'}`}
            selo={inclui.notas ? 'incluído' : 'fora'}
            seloTom={inclui.notas ? 'verde' : 'neutra'}
            seta={false}
            onPress={() => alterna('notas')}
          />
          <Linha
            titulo="Refeições e hidratação"
            sub={`${conta.refeicoes} registros`}
            selo={inclui.habitos ? 'incluído' : 'fora'}
            seloTom={inclui.habitos ? 'verde' : 'neutra'}
            seta={false}
            onPress={() => alterna('habitos')}
          />
        </Cartao>
      </Bloco>

      <Campo
        rotulo="Formato"
        ajuda={fmt === 'link'
          ? 'O link expira em 30 dias e pode ser revogado a qualquer momento por você.'
          : 'O documento é gerado no seu aparelho e você escolhe para onde enviar.'}
      >
        <Opcoes>
          <Opc label="PDF" on={fmt === 'pdf'} onPress={() => setFmt('pdf')} />
          <Opc label="Link" on={fmt === 'link'} onPress={() => setFmt('link')} />
        </Opcoes>
      </Campo>

      <Aviso
        ic="doc"
        titulo="Revise antes de enviar"
        texto="A prévia mostra exatamente o que a outra pessoa vai ler."
      />

      <View />
    </TelaInterna>
  );
}
