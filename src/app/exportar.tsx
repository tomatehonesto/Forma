import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { notasAbertas } from '../logic/derive';
import { dadosParaExportar, nomeDoArquivo, gerarArquivo } from '../logic/exportacao';
import { MO_LONG, DAY, now } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Campo, Opcoes, Opc, Cartao, Linha, Aviso, Botao,
} from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';

/* ============================================================
   EXPORTAR — levar os dados embora

   A tela monta o que sai do aplicativo, e por isso a decisão central
   dela é o que FICA DE FORA.

   Cada linha de "o que entra" é um interruptor, não um item de leitura.
   Isso existe porque nem tudo que o app registra é da conta de quem vai
   receber: refeições e água são hábito, e muita gente não quer entregar
   isso numa consulta de endocrinologia. O padrão deixa esse bloco fora, e
   quem quiser inclui.

   ⚠️ E ATÉ AQUI OS INTERRUPTORES NÃO DECIDIAM SOBRE OS DADOS. O botão
   montava seis linhas de CONTAGEM — "Aplicações: 10", "Pesagens: 23" — e
   abria a folha de compartilhamento com esse texto; as chaves mexiam só
   em quais dessas frases apareciam. Quem pedisse os próprios dados
   recebia o número deles, e desligar "peso" tirava a frase que dizia
   quantas pesagens havia, não as pesagens.

   Agora sai um arquivo com os registros, e a regra do que entra vale
   sobre eles. Ver src/logic/exportacao.ts.
   ============================================================ */

const dataLonga = (t: number) => { const d = new Date(t); return `${d.getDate()} de ${MO_LONG[d.getMonth()]}`; };
const semanas = (ms: number) => Math.max(1, Math.round(ms / (7 * DAY)));

export default function Exportar() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [per, setPer] = useState('consulta');
  const [inclui, setInclui] = useState<Record<string, boolean>>({
    aplicacoes: true, peso: true, sintomas: true, exames: true, notas: true, habitos: false,
  });
  const [estado, setEstado] = useState<'parado' | 'gerando' | 'pronto' | 'erro'>('parado');
  const alterna = (k: string) => { setInclui((x) => ({ ...x, [k]: !x[k] })); setEstado('parado'); };
  const periodo = (v: string) => () => { setPer(v); setEstado('parado'); };

  const ultimaConsulta = (S.consultsHistory as any[])[0]?.t ?? S.profile.startT;
  const desde = per === '4s' ? +now() - 28 * DAY : per === 'consulta' ? ultimaConsulta : S.profile.startT;

  const conta = useMemo(() => {
    const apos = (a: any[]) => (a || []).filter((x) => x.t >= desde).length;
    return {
      aplicacoes: apos(S.injections as any[]),
      pesagens: apos(S.weights as any[]),
      medidas: apos(S.measures as any[]),
      checkins: apos(S.checkins as any[]),
      exames: (S.exams as any[]).reduce((n, e) => n + ((e.values || []).filter((v: any) => v.t >= desde).length), 0),
      notas: notasAbertas(S).filter((n) => n.t >= desde).length,
      refeicoes: apos((S as any).meals || []),
    };
  }, [S, desde]);

  /* NADA É GERADO ANTES DO TOQUE. Montar o arquivo a cada mudança de
     chave escreveria no aparelho por conta própria, e o que esta tela
     promete é o contrário. */
  const gerar = async () => {
    setEstado('gerando');
    const dados = dadosParaExportar(S, { desde, inclui });
    const r = await gerarArquivo(JSON.stringify(dados, null, 2), nomeDoArquivo());
    setEstado(r === 'erro' || r === 'sem-suporte' ? 'erro' : 'pronto');
  };

  const linha = (k: string, titulo: string, sub: string) => (
    <Linha
      titulo={titulo}
      sub={sub}
      selo={inclui[k] ? 'incluído' : 'fora'}
      seloTom={inclui[k] ? 'verde' : 'neutra'}
      seta={false}
      onPress={() => alterna(k)}
    />
  );

  return (
    <TelaInterna
      titulo="Exportar"
      rodape={
        <>
          <Botao
            label={estado === 'gerando' ? 'Gerando...' : 'Gerar o arquivo'}
            desligado={estado === 'gerando'}
            onPress={gerar}
          />
          <Botao label="Ver o resumo para o médico" tom="fantasma" onPress={() => router.push('/resumo-medico' as any)} />
        </>
      }
    >
      <Titulao
        titulo="Exportar"
        lead="Um arquivo com os seus registros, para guardar ou levar para outro lugar."
      />

      <Campo
        rotulo="Período"
        ajuda={`De ${dataLonga(desde)} a ${dataLonga(+now())} · ${semanas(+now() - desde)} semanas`}
      >
        <Opcoes>
          <Opc label="Últimas 4 semanas" on={per === '4s'} onPress={periodo('4s')} />
          <Opc label="Desde a última consulta" on={per === 'consulta'} onPress={periodo('consulta')} />
          <Opc label="Tratamento inteiro" on={per === 'tudo'} onPress={periodo('tudo')} />
        </Opcoes>
      </Campo>

      <Bloco titulo="O que entra" nota="Toque para incluir ou tirar. O que ficar de fora não entra no arquivo.">
        <Cartao>
          {linha('aplicacoes', 'Aplicações', `${conta.aplicacoes} ${conta.aplicacoes === 1 ? 'registro' : 'registros'} · data, dose e local`)}
          {linha('peso', 'Peso e medidas', `${conta.pesagens} ${conta.pesagens === 1 ? 'pesagem' : 'pesagens'} · ${conta.medidas} ${conta.medidas === 1 ? 'medida' : 'medidas'}`)}
          {linha('sintomas', 'Check-ins', `${conta.checkins} ${conta.checkins === 1 ? 'dia' : 'dias'} · sintoma a sintoma`)}
          {linha('exames', 'Exames', `${conta.exames} ${conta.exames === 1 ? 'coleta' : 'coletas'} · valor e referência`)}
          {linha('notas', 'Notas para a consulta', `${conta.notas} ${conta.notas === 1 ? 'anotação' : 'anotações'}`)}
          {linha('habitos', 'Refeições, água e exercício', `${conta.refeicoes} ${conta.refeicoes === 1 ? 'refeição' : 'refeições'} e o diário do dia`)}
        </Cartao>
      </Bloco>

      {/* O FORMATO VAI DITO, e sem eufemismo. Um .json não é um documento
          para ler no sofá, e prometer que é seria a mesma mentira do
          "PDF" que esta tela oferecia sem gerar nenhum. Quem quer a
          versão legível tem o resumo, que é o outro botão. */}
      <Aviso
        ic="doc"
        titulo="Sai um arquivo .json"
        texto="É o formato que outro aplicativo consegue abrir e ler — serve para guardar uma cópia ou levar os registros para outro lugar. Para a versão feita para alguém ler, use o resumo para o médico."
      />

      {estado === 'pronto' ? (
        <Row gap={8} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={14} color={c.ok} sw={2.6} />
          <Txt v="micro" c={c.tx3}>Arquivo gerado. Ele só vai para onde você escolher.</Txt>
        </Row>
      ) : estado === 'erro' ? (
        <Txt v="micro" c={c.tx3} style={{ textAlign: 'center' }}>
          Não deu para gerar o arquivo neste aparelho. Os seus registros continuam aqui, intactos.
        </Txt>
      ) : (
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>
          Nada sai daqui sem o seu toque.
        </Txt>
      )}

      <View />
    </TelaInterna>
  );
}
