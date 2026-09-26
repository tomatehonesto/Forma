import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../logic/store';
import { notasAbertas } from '../logic/derive';
import { dadosParaExportar, nomeDoArquivo, gerarArquivo } from '../logic/exportacao';
import { perguntasParaExportar } from '../logic/conta';
import { DAY, now, dataLonga } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Campo, Opcoes, Opc, Cartao, Linha, Aviso, Botao,
} from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

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

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo, e constante
   de módulo congela o idioma no import. */
const K = () => T.aviso.telaExportar;

const semanas = (ms: number) => Math.max(1, Math.round(ms / (7 * DAY)));

export default function Exportar() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const router = useRouter();
  const [per, setPer] = useState('consulta');
  const [inclui, setInclui] = useState<Record<string, boolean>>({
    aplicacoes: true, peso: true, sintomas: true, exames: true, notas: true, habitos: false, completo: true,
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
    /* as perguntas da conta só são pedidas quando o diário completo entra */
    const perguntas = inclui.completo ? await perguntasParaExportar() : undefined;
    const dados = dadosParaExportar(S, { desde, inclui, perguntas });
    const r = await gerarArquivo(JSON.stringify(dados, null, 2), nomeDoArquivo());
    setEstado(r === 'erro' || r === 'sem-suporte' ? 'erro' : 'pronto');
  };

  const linha = (k: string, titulo: string, sub: string) => (
    <Linha
      titulo={titulo}
      sub={sub}
      selo={inclui[k] ? K().incluido : K().fora}
      seloTom={inclui[k] ? 'verde' : 'neutra'}
      seta={false}
      onPress={() => alterna(k)}
    />
  );

  return (
    <TelaInterna
      titulo={K().titulo}
      rodape={
        <>
          <Botao
            label={estado === 'gerando' ? K().gerando : K().gerar}
            desligado={estado === 'gerando'}
            onPress={gerar}
          />
          <Botao label={K().verResumo} tom="fantasma" onPress={() => router.push('/resumo-medico' as any)} />
        </>
      }
    >
      <Titulao titulo={K().titulo} lead={K().lead} />

      <Campo
        rotulo={K().periodo}
        ajuda={K().periodoAjuda(dataLonga(desde), dataLonga(+now()), semanas(+now() - desde))}
      >
        <Opcoes>
          <Opc label={K().ultimas4} on={per === '4s'} onPress={periodo('4s')} />
          <Opc label={K().desdeAConsulta} on={per === 'consulta'} onPress={periodo('consulta')} />
          <Opc label={K().tratamentoInteiro} on={per === 'tudo'} onPress={periodo('tudo')} />
        </Opcoes>
      </Campo>

      <Bloco titulo={K().oQueEntra} nota={K().oQueEntraNota}>
        <Cartao>
          {linha('aplicacoes', K().aplicacoes, K().aplicacoesSub(conta.aplicacoes))}
          {linha('peso', K().pesoEMedidas, K().pesoEMedidasSub(conta.pesagens, conta.medidas))}
          {linha('sintomas', K().checkins, K().checkinsSub(conta.checkins))}
          {linha('exames', K().exames, K().examesSub(conta.exames))}
          {linha('notas', K().notas, K().notasSub(conta.notas))}
          {linha('habitos', K().habitos, K().habitosSub(conta.refeicoes))}
          {linha('completo', K().completo, K().completoSub)}
        </Cartao>
      </Bloco>

      {/* O FORMATO VAI DITO, e sem eufemismo. Um .json não é um documento
          para ler no sofá, e prometer que é seria a mesma mentira do
          "PDF" que esta tela oferecia sem gerar nenhum. Quem quer a
          versão legível tem o resumo, que é o outro botão. */}
      <Aviso ic="doc" titulo={K().formatoTitulo} texto={K().formatoTexto} />

      {estado === 'pronto' ? (
        <Row gap={8} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={14} color={c.ok} sw={2.6} />
          <Txt v="micro" c={c.tx3}>{K().pronto}</Txt>
        </Row>
      ) : estado === 'erro' ? (
        <Txt v="micro" c={c.tx3} style={{ textAlign: 'center' }}>{K().erro}</Txt>
      ) : (
        <Txt v="micro" c={c.tx4} style={{ textAlign: 'center' }}>{K().parado}</Txt>
      )}

      <View />
    </TelaInterna>
  );
}
