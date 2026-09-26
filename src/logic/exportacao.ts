import { T } from '../textos';
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { State } from './seed';
import { M, cadenciaCurta, siteLabel } from './derive';
import { now } from './time';
import { pesoU, pesoV, compU, compV } from './medidas';
import { ida, type Pergunta } from './traducao';

/* ============================================================
   LEVAR OS DADOS EMBORA

   ⚠️ O QUE A TELA DE EXPORTAR MANDAVA NÃO ERAM OS DADOS. Ela montava seis
   linhas de CONTAGEM — "Aplicações: 10", "Pesagens: 23" — e abria a
   folha de compartilhamento com esse texto. Quem pedisse os próprios
   dados recebia o número deles.

   E os interruptores de "o que entra" mexiam só nessas linhas: desligar
   "peso" tirava a frase que dizia quantas pesagens havia, e não as
   pesagens. Eram cinco chaves que decidiam sobre um resumo, numa tela
   chamada exportar.

   Agora sai um ARQUIVO com os registros, e as chaves decidem sobre eles.

   POR QUE JSON. Portabilidade quer dizer poder levar embora para outro
   lugar, e para isso o formato precisa ser lido por máquina — é um
   arquivo que outro aplicativo consegue abrir, e não uma foto de tela.
   Quem quer a versão para pessoa ler já tem o resumo para consulta, que
   é a outra porta desta mesma tela.

   NOMES EM PORTUGUÊS, e não as chaves internas do estado. `kg`, `t`,
   `site` e `prot` são o vocabulário deste código; quem abrir o arquivo
   daqui a dois anos, ou noutro programa, lê "peso_kg", "data",
   "local_da_aplicacao" e "proteina_g". O arquivo é para fora.
   ============================================================ */

export type Recorte = {
  /** início do período, em milissegundos */
  desde: number;
  inclui: Record<string, boolean>;
  /** as perguntas do diário completo — da conta, somadas às do aparelho
      (ver `perguntasParaExportar`, em logic/conta). Sem isto, só as do
      aparelho. */
  perguntas?: { lista: Pergunta[]; completas: boolean };
};

const iso = (t: number) => new Date(t).toISOString();
const dia = (t: number) => new Date(t).toISOString().slice(0, 10);

export function dadosParaExportar(S: State, r: Recorte) {
  const p: any = S.profile;
  const med = M(S);
  const desde = r.desde;
  const apos = <T extends { t: number }>(a: T[]) => (a || []).filter((x) => x.t >= desde);

  const out: any = {
    /* A PROCEDÊNCIA VEM NO ARQUIVO. Quem recebe isto precisa saber de
       onde saiu e de quando é — sem isso é um objeto solto. */
    gerado_em: iso(+now()),
    gerado_por: 'Morphi',
    aviso: T.aviso.exportacaoAviso,
    periodo: { de: dia(desde), ate: dia(+now()) },
    pessoa: {
      nome: p.name || null,
      nascimento: p.nascimento ? dia(p.nascimento) : null,
      altura_m: p.height || null,
      identidade: p.identidade || null,
    },
    tratamento: {
      medicamento: med.label,
      molecula: med.mol,
      dose: p.dose || null,
      unidade_da_dose: med.unit,
      cadencia: cadenciaCurta(S),
      inicio: p.startT ? dia(p.startT) : null,
      peso_inicial_kg: p.startWeight || null,
      meta_de_peso_kg: p.goalWeight || null,
    },
  };

  if (r.inclui.aplicacoes) {
    out.aplicacoes = apos(S.injections as any[]).map((x: any) => ({
      data: iso(x.t),
      dose: x.dose,
      unidade: med.unit,
      local: x.site ? siteLabel(x.site) : null,
    }));
  }

  if (r.inclui.peso) {
    /* ⚠️⚠️ O ARQUIVO SEGUE A UNIDADE DE QUEM EXPORTA, e o NOME DA COLUNA
       carrega a unidade junto.

       Quem exporta em libra provavelmente está indo a uma consulta onde se
       fala libra; entregar quilo ali obrigaria a médica a converter à mão,
       que é exatamente o erro que um relatório existe para evitar.

       E a ambiguidade se resolve no cabeçalho, não numa nota de rodapé:
       `peso_kg` vira `peso_lb`, `cintura_cm` vira `cintura_in`. O arquivo já
       fazia isso com o sufixo métrico — só passou a dizer a verdade nos
       dois casos. Quem lê a coluna sabe o que o número é sem saber nada
       sobre quem o gerou. */
    const uP = pesoU(S);
    const uC = compU(S);
    const n2 = (v: number) => Math.round(v * 100) / 100;
    out.pesagens = apos(S.weights as any[]).map((x: any) => ({
      data: iso(x.t), [`peso_${uP}`]: n2(pesoV(S, x.kg)),
    }));
    out.medidas = apos(S.measures as any[]).map((x: any) => ({
      data: iso(x.t),
      [`cintura_${uC}`]: n2(compV(S, x.cintura)),
      [`quadril_${uC}`]: n2(compV(S, x.quadril)),
      [`braco_${uC}`]: n2(compV(S, x.braco)),
      [`coxa_${uC}`]: n2(compV(S, x.coxa)),
      gordura_pct: x.gordura || null,
      [`massa_magra_${uP}`]: x.musculo ? n2(pesoV(S, x.musculo)) : null,
    }));
  }

  if (r.inclui.sintomas) {
    /* O CHECK-IN INTEIRO, campo a campo, e sem completar o que ficou em
       branco. Dia sem resposta sai como nulo — que é diferente de zero, e
       é a diferença que o resto do app passou a respeitar. */
    out.checkins = apos(S.checkins as any[]).map((x: any) => ({
      data: dia(x.t),
      nausea: x.nausea ?? null,
      fome: x.fome ?? null,
      energia: x.energia ?? null,
      sono_h: x.sono ?? null,
      humor: x.mood ?? null,
      intestino: x.gut ?? null,
      outros_sintomas: x.sint ?? null,
      anotacao: x.outroTexto || null,
    }));
  }

  if (r.inclui.exames) {
    out.exames = (S.exams as any[]).map((e: any) => ({
      marcador: e.marker,
      unidade: e.unit || null,
      referencia: e.ref || null,
      coletas: (e.values || []).filter((v: any) => v.t >= desde).map((v: any) => ({ data: dia(v.t), valor: v.v })),
    })).filter((e: any) => e.coletas.length);
  }

  if (r.inclui.notas) {
    out.notas_para_a_consulta = apos(S.notes as any[]).map((n: any) => ({
      data: iso(n.t), texto: n.text, ja_conversada: !!n.done,
    }));
  }

  if (r.inclui.habitos) {
    out.refeicoes = apos((S as any).meals || []).map((m: any) => ({
      data: iso(m.t), refeicao: m.name || null, proteina_g: m.g ?? null, itens: m.tag || null,
    }));
    out.hidratacao = apos(S.checkins as any[])
      .filter((c: any) => (c.aguas || []).length)
      .flatMap((c: any) => (c.aguas as any[]).map((a) => ({ data: iso(a.t), ml: a.ml, bebida: a.bebida ?? 'agua' })));
    out.exercicio = apos(S.checkins as any[])
      .filter((c: any) => (c.treinos || []).length)
      .flatMap((c: any) => (c.treinos as any[]).map((t) => ({ data: dia(c.t), tipo: t.tipo, minutos: t.min })));
  }

  /* ⚠️⚠️ O DIÁRIO COMPLETO É A PORTABILIDADE (fase 8 do plano do Supabase).
     As seções de cima são a leitura para gente, e deixavam de fora sinais
     vitais, laudos, documentos, metas pessoais, canetas, o histórico de
     saúde e os sintomas próprios. Esta sai da MESMA função que monta o que
     sobe para a conta (`ida`, em logic/traducao) — então leva tudo o que a
     conta guarda, por construção, e um tipo novo entra aqui sem ninguém
     lembrar. A trava da tradução (scripts/sincronia.ts) confere.

     ⚠️ Os nomes de dentro de `dados` são os do aplicativo, e não os
     traduzidos de cima: é a cópia fiel, no formato do banco.

     ⚠️ Os registros de foto (`foto`, que só a semente tem — o aplicativo
     não tem mais a tela das fotos do corpo) ficam fora, como ficam fora da
     conta. */
  if (r.inclui.completo) {
    const i = ida(S);
    const registros: Record<string, any[]> = {};
    for (const reg of i.registros) {
      if (reg.tipo === 'foto') continue;
      (registros[reg.tipo] ??= []).push({ id: reg.id, data: reg.quando !== null ? iso(reg.quando) : null, dados: reg.dados });
    }
    const perguntas = r.perguntas ?? { lista: i.perguntas, completas: !i.perfil.perguntasParaUso };
    out.diario_completo = {
      registros,
      perfil: i.perfil.partes,
      consentimento: i.perfil.consentimento
        ? { versao: i.perfil.consentimento.versao, em: iso(i.perfil.consentimento.em) }
        : null,
      leitura_das_perguntas_permitida: i.perfil.perguntasParaUso,
      perguntas: perguntas.lista.map((p) => ({ data: iso(p.quando), texto: p.texto, origem: p.origem })),
      ...(perguntas.completas ? {} : { perguntas_aviso: T.aviso.exportacaoPerguntasRecentes }),
    };
  }

  return out;
}

export const nomeDoArquivo = () => `morphi-dados-${dia(+now())}.json`;

export type ResultadoDoArquivo = 'compartilhado' | 'baixado' | 'sem-suporte' | 'erro';

/* ESCREVER E ENTREGAR. O arquivo nasce na pasta de cache do aplicativo e
   sai pela folha do sistema — no navegador, onde compartilhar arquivo
   local não existe, ele desce como download.

   Cache, e não Documentos: é um arquivo de passagem. Depois de entregue
   ele não tem por que continuar ocupando o aparelho de ninguém. */
export async function gerarArquivo(conteudo: string, nome: string): Promise<ResultadoDoArquivo> {
  try {
    if (Platform.OS === 'web') {
      const blob = new Blob([conteudo], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = nome;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      return 'baixado';
    }

    const arquivo = new File(Paths.cache, nome);
    if (arquivo.exists) arquivo.delete();
    arquivo.create();
    arquivo.write(conteudo);

    if (!(await Sharing.isAvailableAsync())) return 'sem-suporte';
    await Sharing.shareAsync(arquivo.uri, {
      mimeType: 'application/json',
      UTI: 'public.json',
      dialogTitle: T.aviso.exportacaoTitulo,
    });
    return 'compartilhado';
  } catch {
    return 'erro';
  }
}
