import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useStore } from '../logic/store';
import { compartilharRelatorioPdf, recortePadrao, INCLUI_PADRAO } from '../logic/relatorioPdf';
import { DAY, now, dataLonga } from '../logic/time';
import { Txt, Row } from '../ui/kit';
import {
  TelaInterna, Titulao, Bloco, Campo, Opcoes, Opc, Cartao, Linha, Aviso, Botao,
} from '../ui/internas';
import { Icon } from '../ui/Icon';
import { useTheme } from '../ui/useTheme';
import { T } from '../textos';

/* ============================================================
   O PDF DA CONSULTA — ajustar o período e o que entra

   ⚠️ UM PDF SÓ, PARA O MÉDICO (29/09/2026, pedido do dono). Ele mora no
   Resumo para consulta, que o gera com um toque no recorte padrão (desde
   a última consulta, tudo o que é clínico). Esta tela é o "ajustar" de
   lá: quem quer outro período, ou tirar alguma coisa, vem aqui.

   Cada linha de "o que entra" é um interruptor, não um item de leitura.
   Nem tudo o que o app registra é da conta de quem vai receber: refeições
   e água são hábito, e muita gente não quer entregar isso numa consulta —
   o padrão deixa esse bloco fora, e quem quiser inclui.

   A cópia dos dados em .json (a portabilidade da LGPD) não mora aqui:
   ela é /exportar, na Privacidade.
   ============================================================ */

/* ⚠️ É FUNÇÃO, e não constante de módulo: ela lê o catálogo. */
const K = () => T.aviso.telaExportar;

const semanas = (ms: number) => Math.max(1, Math.round(ms / (7 * DAY)));

export default function PdfConsulta() {
  const S = useStore((s) => s.S);
  const { c } = useTheme();
  const [per, setPer] = useState('consulta');
  const [inclui, setInclui] = useState<Record<string, boolean>>({ ...INCLUI_PADRAO });
  const [estado, setEstado] = useState<'parado' | 'gerando' | 'pronto' | 'erro'>('parado');
  const alterna = (k: string) => { setInclui((x) => ({ ...x, [k]: !x[k] })); setEstado('parado'); };
  const periodo = (v: string) => () => { setPer(v); setEstado('parado'); };

  const desde = per === '4s' ? +now() - 28 * DAY : per === 'consulta' ? recortePadrao(S).desde : S.profile.startT;

  const conta = useMemo(() => {
    const apos = (a: any[]) => (a || []).filter((x) => x.t >= desde).length;
    return {
      aplicacoes: apos(S.injections as any[]),
      pesagens: apos(S.weights as any[]),
      medidas: apos(S.measures as any[]),
      checkins: apos(S.checkins as any[]),
      exames: (S.exams as any[]).reduce((n, e) => n + ((e.values || []).filter((v: any) => v.t >= desde).length), 0),
      notas: apos(S.notes as any[]),
      refeicoes: apos((S as any).meals || []),
    };
  }, [S, desde]);

  /* NADA É GERADO ANTES DO TOQUE: montar o arquivo a cada mudança de chave
     escreveria no aparelho por conta própria. */
  const gerar = async () => {
    setEstado('gerando');
    const r = await compartilharRelatorioPdf(S, { desde, inclui });
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
      titulo={K().pdfConsultaTitulo}
      rodape={
        <Botao
          label={estado === 'gerando' ? K().gerando : K().gerarPdf}
          desligado={estado === 'gerando'}
          onPress={gerar}
        />
      }
    >
      <Titulao titulo={K().pdfConsultaTitulo} lead={K().pdfConsultaLead} />

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
        </Cartao>
      </Bloco>

      <Aviso ic="doc" titulo={K().pdfTitulo} texto={K().pdfTexto} />

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
