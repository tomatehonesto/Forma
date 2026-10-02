import { T } from '../textos';
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { State } from './seed';
import { M, cadenciaCurta, siteLabel, doseDiaria, inicioDoDiario, dosesPrevistas, dosesFeitas } from './derive';
import { MEDS } from './meds';
import { doseInjetavel, injetavelDe, localDaDose } from './formas';
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
   `injections` e `prot` são o vocabulário deste código; quem abrir o
   arquivo daqui a dois anos, ou noutro programa, lê "peso_kg", "data",
   "doses" e "proteina_g". O arquivo é para fora.

   ⚠️ ESTE COMENTÁRIO PROMETIA "local_da_aplicacao", e a chave sempre foi
   `local` — corrigido em 01/10/2026, junto com o bloco das doses (ver lá).
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
/* A VIA É UM VALOR FIXO, e não a palavra do idioma: quem lê o arquivo por
   máquina compara com 'oral', e uma exportação em alemão não pode mudar o
   que ela compara. Só há duas — toda forma que não se injeta é comprimido. */
const viaDe = (injetavel: boolean) => (injetavel ? 'injetavel' : 'oral');
/* ⚠️ O DIA DO CALENDÁRIO DE QUEM EXPORTA, e não o de Greenwich (02/10/2026).
   As datas da constância diária são meias-noites locais, e `dia` as passa
   por `toISOString`: em Berlim, a meia-noite de 2 de outubro é 22h de 1º
   em UTC, e o arquivo diria que a contagem começou na véspera. */
const diaLocal = (t: number) => {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
/** O dia (00h) `k` dias depois de `t`, pelo calendário. */
const noCalendario = (t: number, k: number) => {
  const d = new Date(t);
  return +new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
};

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
      /* sem remédio escolhido ainda, não há via a afirmar */
      via: p.med === 'indefinido' ? null : viaDe(injetavelDe(S)),
      cadencia: cadenciaCurta(S),
      inicio: p.startT ? dia(p.startT) : null,
      peso_inicial_kg: p.startWeight || null,
      meta_de_peso_kg: p.goalWeight || null,
    },
  };

  /* ⚠️ QUEM TOMA TODO DIA LEVA A CONSTÂNCIA EM DIAS (02/10/2026, parte B5
     de docs/superpowers/specs/2026-10-01-oral-e-diario-design.md). É a
     mesma conta do resumo do médico — `dosesFeitas` de `dosesPrevistas`,
     que no diário são os dias do regime diário de agora —, escrita para
     máquina: de que dia a que dia se contou, quantos dias contam e em
     quantos houve pelo menos uma dose registrada. Hoje só conta depois da
     dose de hoje, e por isso o `ate` vai escrito: sem ele, quem lê o
     arquivo de manhã acharia um dia a menos. Dia sem registro é dia sem
     REGISTRO, e o nome do campo diz isso.

     Sem regime diário a contar (trocou e ainda não registrou o
     comprimido), datas nulas e zero dias — e não um bloco que some.
     Ela sai das doses, e por isso só entra com elas: quem desligou as
     doses não leva uma conta feita sobre elas.
     ⚠️ SÓ NO DIÁRIO: o arquivo de quem toma por semana sai como era,
     campo a campo (scripts/congelar.ts confere). */
  if (r.inclui.aplicacoes && doseDiaria(S)) {
    const desdeRegime = inicioDoDiario(S);
    const dias = dosesPrevistas(S);
    const conta = desdeRegime != null && dias > 0;
    out.tratamento.constancia_diaria = {
      desde: conta ? diaLocal(desdeRegime) : null,
      /* os dias contados são seguidos, do `desde` em diante */
      ate: conta ? diaLocal(noCalendario(desdeRegime, dias - 1)) : null,
      dias_contados: dias,
      dias_com_dose_registrada: dosesFeitas(S),
    };
  }

  /* ⚠️⚠️ AS DOSES, CADA UMA COM O SEU REMÉDIO E A SUA VIA (01/10/2026).

     O bloco se chamava `aplicacoes` e dizia três coisas falsas para quem
     toma comprimido ou trocou de remédio: o nome (comprimido não se
     aplica), a unidade (a do remédio de HOJE, em toda linha) e o local (até
     01/10/2026 o comprimido era gravado com um local de injeção inventado).

     · `doses` — o substantivo de todas as formas, o mesmo do PDF. A chave
       foi renomeada porque nada lia `aplicacoes`: nem o app, nem script,
       nem servidor (o arquivo é só de saída). O interruptor `inclui.
       aplicacoes` continua com o nome interno, como `S.injections`.
     · `medicamento` e `unidade` saem do `med` gravado em cada dose, e não
       do perfil. Vão em toda linha, e não só quando há troca: para quem lê
       por máquina, uma coluna que some e aparece é pior do que repetida.
     · `via` diz se a dose foi injetada ou tomada — o arquivo se descreve
       sozinho, sem quem o lê precisar do nosso catálogo de remédios.
     · `local` é nulo quando a dose não foi injetada (`localDaDose`), e
       também quando foi e ninguém disse onde.

     ⚠️ O DIÁRIO COMPLETO, mais abaixo, continua com o registro como está
     guardado — é a cópia fiel —, inclusive um `site` antigo de comprimido. */
  if (r.inclui.aplicacoes) {
    out.doses = apos(S.injections as any[]).map((x: any) => {
      const m = MEDS[x.med] ?? med;
      const local = localDaDose(S, x);
      return {
        data: iso(x.t),
        medicamento: m.label,
        dose: x.dose,
        unidade: m.unit,
        via: viaDe(doseInjetavel(S, x)),
        local: local ? siteLabel(local) : null,
      };
    });
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
