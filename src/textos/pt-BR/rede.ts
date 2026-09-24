/* ============================================================
   A REDE PARCEIRA — a vitrine e a ficha do profissional

   A rede é brasileira (ver logic/pais), mas quem mora aqui pode usar o
   aplicativo em qualquer um dos seis idiomas — e por isso a vitrine fala
   todos. O que NÃO se traduz é o que o profissional escreveu no portal:
   nome, apresentação, nome do consultório e endereço aparecem como ele
   escreveu. Especialidade, modalidade e dia são chaves, e se traduzem
   aqui.

   ⚠️ QUEM FALA É O APLICATIVO, e o aplicativo não indica ninguém. A
   vitrine mostra quem está na rede e como falar com o consultório; o
   primeiro contato é da pessoa com o consultório, e não passa por nós.
   ============================================================ */

export const rede = {
  titulo: 'Rede parceira',
  lead: 'Profissionais que acompanham o tratamento pelo aplicativo. O primeiro contato é direto com o consultório.',

  /* Só aparece com a lista de exemplo, que só existe em desenvolvimento. */
  exemploTitulo: 'Profissionais de exemplo',
  exemploTexto: 'Nomes, registros e contatos são inventados, só para ver como a vitrine fica. A lista de verdade vem do portal da rede.',

  busca: 'Nome ou especialidade',

  /* ⚠️ A PERMISSÃO SE PEDE NO TOQUE, e a linha diz para que ela serve
     antes do pedido — e que a localização não sai do aparelho, que é a
     pergunta que vem logo depois. */
  localizacao: {
    usar: 'Usar minha localização',
    usarSub: 'Para ver a distância até cada consultório. Ela fica no aparelho.',
    pedindo: 'Procurando onde você está…',
    ligada: 'Mais perto primeiro',
    ligadaSub: 'Em ordem de distância. Toque para desligar.',
    negada: 'Sem permissão para a localização. Dá para escolher a cidade nos filtros.',
    falhou: 'Não conseguimos saber onde você está agora. Dá para escolher a cidade nos filtros.',
  },

  especialidades: {
    endocrinologia: 'Endocrinologia',
    nutrologia: 'Nutrologia',
    nutricao: 'Nutrição',
    esporte: 'Medicina do esporte',
    psicologia: 'Psicologia',
  },
  todas: 'Todas',

  filtros: 'Filtros',
  filtrosSub: 'Cidade, convênio, modalidade e dia',
  resultados: (n: number) => `${n} ${n === 1 ? 'profissional' : 'profissionais'}`,

  /* ---------- o cartão ---------- */
  aDistancia: (quanto: string) => `a ${quanto}`,
  soTeleconsulta: 'Só teleconsulta',
  teleconsulta: 'Teleconsulta',
  outrosLocais: (n: number) => `mais\u00A0${n}\u00A0${n === 1 ? 'local' : 'locais'}`,
  /* "seg a sex" — três dias seguidos ou mais viram intervalo */
  /* ⚠️ O U+2060 EM VOLTA DO TRAÇO NÃO É SUJEIRA: sem ele a linha quebrava
     em "08:00–" e "17:00". Ele é invisível e não deixa quebrar ali. */
  deAte: (de: string, ate: string) => `${de} a ${ate}`,
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Ninguém com esses filtros',
  vazioTexto: 'Tente outra especialidade, ou tire um dos filtros.',
  limparFiltros: 'Limpar filtros',
  erroTitulo: 'Não conseguimos abrir a rede',
  erroTexto: 'Confira a internet e tente de novo.',
  tentarDeNovo: 'Tentar de novo',

  jaTenhoCodigo: 'Já tenho um código de convite',

  /* ============================================================
     A FOLHA DE FILTROS
     ============================================================ */
  folha: {
    titulo: 'Filtros',
    cidade: 'Cidade',
    todasAsCidades: 'Todas',
    modalidade: 'Modalidade',
    todas: 'Todas',
    presencial: 'Presencial',
    teleconsulta: 'Teleconsulta',
    convenio: 'Convênio',
    qualquer: 'Qualquer um',
    particular: 'Particular',
    dia: 'Atende em',
    qualquerDia: 'Qualquer dia',
    ver: (n: number) => (n ? `Ver ${n} ${n === 1 ? 'profissional' : 'profissionais'}` : 'Nenhum profissional'),
    limpar: 'Limpar',
  },

  /* ============================================================
     A FICHA DO PROFISSIONAL
     ============================================================ */
  ficha: {
    sobre: 'Sobre',
    ondeAtende: 'Onde atende',
    presencialETele: 'Presencial e teleconsulta',
    soPresencial: 'Presencial',
    convenios: 'Convênios',
    soParticular: 'Só particular',
    /* o último item de "Amil, Unimed e particular" */
    particularNaLista: 'particular',
    comoChegar: 'Como chegar',
    falar: 'Falar com o consultório',
    falarNota: 'Os canais que o consultório cadastrou. Cada um abre fora do aplicativo.',
    agenda: 'Agendar pela internet',
    exemploContatos: 'Contatos de exemplo — não abrem nada.',
    /* ⚠️ O PASSO SEGUINTE É DO CONSULTÓRIO, e a ficha diz qual é. Sem
       isto, a pessoa marca a consulta e fica esperando que o aplicativo
       perceba sozinho — e ele não tem como. */
    proximoTitulo: 'Depois da primeira consulta',
    proximoTexto: 'O consultório passa um código de convite. É ele que liga o acompanhamento ao aplicativo — mensagens entre as consultas, o seu resumo chegando na equipe e a agenda já preenchida.',
    jaTenhoCodigo: 'Já tenho um código',
    naoEncontrado: 'Não encontramos este profissional na rede.',
  },
};
