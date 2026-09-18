import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { State } from './seed';
import { M, cadenciaCurta, siteLabel } from './derive';
import { now } from './time';

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
   Quem quer a versão para pessoa ler já tem o resumo para o médico, que
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
    aviso: 'Registros feitos pela própria pessoa no aplicativo. Não é prontuário nem laudo.',
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
    out.pesagens = apos(S.weights as any[]).map((x: any) => ({ data: iso(x.t), peso_kg: x.kg }));
    out.medidas = apos(S.measures as any[]).map((x: any) => ({
      data: iso(x.t),
      cintura_cm: x.cintura, quadril_cm: x.quadril, braco_cm: x.braco, coxa_cm: x.coxa,
      gordura_pct: x.gordura || null, massa_magra_kg: x.musculo || null,
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
      dialogTitle: 'Seus dados do Morphi',
    });
    return 'compartilhado';
  } catch {
    return 'erro';
  }
}
