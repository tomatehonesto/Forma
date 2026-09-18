import type { State } from './seed';
import {
  M, cadenciaCurta, curWeight, dosesPrevistas, examLast, journeyDay,
  lostKg, lostPct, mediaDe, notasTexto, respondido,
} from './derive';
import { fmtDate, diffDays, now, nf, kg, startOfDay } from './time';

/* ============================================================
   O RESUMO PARA O MÉDICO — uma fonte para a tela e para o texto

   ⚠️ A TELA E O TEXTO COMPARTILHADO ERAM DOIS RESUMOS DIFERENTES. O
   cartão montava suas linhas com as funções do app; o texto, que é o que
   de fato chega ao médico, remontava tudo por conta própria — e nos
   pontos em que as duas versões discordavam, quem via a divergência era o
   médico.

   A cadência é o caso mais claro. A tela usava `cadenciaCurta`, que
   respeita o intervalo do perfil; o texto escrevia "1x/semana" a partir
   do catálogo do medicamento. Quem aplica a cada dez dias — e há gente
   assim, por orientação médica — via "a cada 10 dias" na tela e mandava
   "1x/semana" para a consulta.

   Aqui as duas leem a mesma lista de seções. Uma muda, as duas mudam.

   NADA AQUI É INTERPRETAÇÃO. Este arquivo transcreve registros: peso,
   dose, médias de sintoma, exames e as anotações que a própria pessoa
   escreveu. Quem lê é quem sabe interpretar — e um app que mandasse a
   sua conclusão junto estaria opinando sobre tratamento alheio.
   ============================================================ */

export type LinhaDoResumo = { k: string; v: string };
export type SecaoDoResumo = {
  titulo: string;
  /** o recorte do que está ali — "média de 6 dias respondidos" */
  nota?: string;
  linhas: LinhaDoResumo[];
  /** seção de texto corrido, como as anotações */
  texto?: string;
};

/* SEM RESPOSTA É TRAÇO, e não zero.

   A média era feita sobre os sete últimos registros somando `c[k] || 0`:
   um dia em que a pessoa não respondeu náusea entrava como náusea zero e
   puxava a média para baixo. Num resumo que vai para a consulta, isso não
   é um arredondamento — é dizer ao médico que o sintoma melhorou quando o
   que aconteceu foi a pessoa não ter respondido.

   `mediaDe` já conta só os respondidos e devolve nulo quando não há
   nenhum. O traço é a resposta honesta para nulo. */
const media = (cs: any[], k: string, casas = 1, sufixo = '') => {
  const m = mediaDe(cs, k);
  return m == null ? '—' : `${nf(m, casas)}${sufixo}`;
};

export function resumoDoTratamento(S: State): SecaoDoResumo[] {
  const p: any = S.profile;
  const med = M(S);
  const cur = curWeight(S);

  /* A JANELA É DE DIAS, e não de registros. "Últimos 7 check-ins" pode
     ser um mês para quem responde às segundas, e o médico lê aquilo como
     "a última semana". Catorze dias de calendário é um recorte que se
     descreve sozinho, e a nota diz quantos deles tiveram resposta. */
  const desde = +startOfDay(now()) - 13 * 86400000;
  const janela = (S.checkins as any[]).filter((c) => c.t >= desde);
  const comResposta = janela.filter((c) => respondido(c, 'nausea') || respondido(c, 'fome')
    || respondido(c, 'energia') || respondido(c, 'sono')).length;

  const secoes: SecaoDoResumo[] = [
    {
      titulo: 'Medicação',
      linhas: [
        { k: 'Medicamento', v: `${med.label} (${med.mol})` },
        { k: 'Dose', v: `${nf(p.dose, p.dose % 1 ? 1 : 0)} ${med.unit}` },
        { k: 'Cadência', v: cadenciaCurta(S) },
        { k: 'Tempo de tratamento', v: `${journeyDay(S)} dias` },
        /* A FRAÇÃO, E NÃO A PORCENTAGEM SOZINHA. "Adesão 91%" fala de
           pontualidade, que esta conta não mede: quem aplicou as dez doses
           sempre com três dias de atraso também dá cem por cento. "10 de
           11 previstas" diz o que a conta de fato sabe. */
        { k: 'Aplicações', v: `${S.injections.length} de ${dosesPrevistas(S)} previstas` },
      ],
    },
    {
      titulo: 'Peso',
      linhas: [
        { k: 'Início → atual', v: `${kg(p.startWeight)} → ${kg(cur)} kg` },
        { k: 'Variação', v: `−${kg(lostKg(S))} kg (${nf(lostPct(S), 1)}%)` },
        { k: 'Em', v: `${diffDays(now(), new Date(p.startT))} dias` },
        /* O NOME É O DO CADASTRO. Esta linha já se chamou "referência
           combinada", que é um terceiro nome para o número que o app
           chama de meta de peso em todas as outras telas. */
        { k: 'Meta de peso', v: `${kg(p.goalWeight)} kg` },
      ],
    },
    {
      titulo: 'Sintomas',
      nota: comResposta
        ? `Média dos últimos 14 dias · ${comResposta} com resposta`
        : 'Sem respostas nos últimos 14 dias',
      /* CADA UM COM A SUA UNIDADE. Náusea, fome e energia são escalas de
         zero a dez; sono é hora de relógio. Uma seção inteira rotulada
         "(0–10)" punha sete horas de sono na mesma régua de uma náusea
         sete. */
      linhas: [
        { k: 'Náusea', v: media(janela, 'nausea', 1, ' de 10') },
        { k: 'Fome', v: media(janela, 'fome', 1, ' de 10') },
        { k: 'Energia', v: media(janela, 'energia', 1, ' de 10') },
        { k: 'Sono', v: media(janela, 'sono', 1, ' h') },
      ],
    },
  ];

  const exames = (S.exams as any[]).slice(0, 6);
  if (exames.length) {
    secoes.push({
      titulo: 'Exames recentes',
      linhas: exames.map((e) => {
        const u = examLast(e);
        return { k: e.marker, v: `${nf(u.v, u.v % 1 ? 1 : 0)} ${e.unit} · ref ${e.ref}` };
      }),
    });
  }

  secoes.push({
    titulo: 'Anotações para a consulta',
    linhas: [],
    texto: notasTexto(S),
  });

  return secoes;
}

/* O MESMO RESUMO, EM TEXTO. É o que sai pelo compartilhar e pela
   mensagem à equipe — e agora ele é uma transcrição das seções acima, e
   não uma segunda montagem. */
export function resumoEmTexto(S: State): string {
  const p: any = S.profile;
  const linhas: string[] = [
    `RESUMO DE TRATAMENTO — ${p.name}`,
    `${fmtDate(now())}${p.doctor ? ` · para ${p.doctor}` : ''}${p.clinic ? ` (${p.clinic})` : ''}`,
  ];
  for (const s of resumoDoTratamento(S)) {
    linhas.push('', s.titulo.toUpperCase() + (s.nota ? ` — ${s.nota.toLowerCase()}` : ''));
    for (const l of s.linhas) linhas.push(`- ${l.k}: ${l.v}`);
    if (s.texto !== undefined) linhas.push(s.texto || '(sem anotações)');
  }
  /* A ORIGEM VAI JUNTO. Quem recebe este texto por mensagem precisa saber
     que ele saiu de um aplicativo de acompanhamento, e não de um
     prontuário — e que os números são o que a pessoa registrou. */
  linhas.push('', 'Gerado pelo aplicativo a partir dos registros da própria pessoa.');
  return linhas.join('\n');
}
