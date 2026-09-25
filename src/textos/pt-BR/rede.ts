/* ============================================================
   A REDE PARCEIRA — a vitrine, os filtros e o cartão da aba Cuidado

   A rede é brasileira (ver logic/pais), mas quem mora aqui pode usar o
   aplicativo em qualquer um dos seis idiomas — e por isso a vitrine fala
   todos. O que NÃO se traduz é o que a clínica escreveu no portal: nome,
   apresentação, endereço e o nome de cada profissional aparecem como ela
   escreveu. Especialidade, modalidade e dia são chaves, e se traduzem
   aqui.

   ⚠️ QUEM FALA É O APLICATIVO, e o aplicativo não indica ninguém. A
   vitrine mostra quem está na rede e como falar com a clínica; o
   primeiro contato é da pessoa com a clínica, e não passa por nós.

   A tela da clínica, aberta pelo cartão, é /clinica — e os textos dela
   moram em `cuidado.telaClinica`.
   ============================================================ */

export const rede = {
  titulo: 'Clínicas parceiras',
  lead: 'Clínicas que acompanham o tratamento pelo aplicativo. O primeiro contato é direto com elas.',

  /* Só aparece com a lista de exemplo, que só existe em desenvolvimento. */
  exemploTitulo: 'Clínicas de exemplo',
  exemploTexto: 'Nomes, registros e contatos são inventados, só para ver como a vitrine fica. A lista de verdade vem do portal da rede.',

  busca: 'Clínica, médico ou especialidade',

  /* ⚠️ A PERMISSÃO SE PEDE NO TOQUE do chip, e a linha de baixo só
     aparece quando há o que dizer. Para que serve a localização e que
     ela não sai do aparelho está no pedido do próprio sistema. */
  perto: 'Perto de mim',
  localizacao: {
    pedindo: 'Procurando onde você está…',
    negada: 'Sem permissão para a localização. Dá para escolher a cidade.',
    falhou: 'Não conseguimos saber onde você está agora. Dá para escolher a cidade.',
  },

  /* Os chips — cada um abre a sua folha. */
  filtro: {
    especialidade: 'Especialidade',
    convenio: 'Convênio',
    modalidade: 'Modalidade',
    dia: 'Dia',
    cidade: 'Cidade',
  },

  especialidades: {
    endocrinologia: 'Endocrinologia',
    nutrologia: 'Nutrologia',
    nutricao: 'Nutrição',
    esporte: 'Medicina do esporte',
    psicologia: 'Psicologia',
  },

  resultados: (n: number) => `${n} ${n === 1 ? 'clínica' : 'clínicas'}`,

  /* ---------- o cartão ---------- */
  aDistancia: (quanto: string) => `a ${quanto}`,
  soTeleconsulta: 'Só teleconsulta',
  soPresencial: 'Presencial',
  presencialETele: 'Presencial e teleconsulta',
  teleconsulta: 'Teleconsulta',
  particular: 'Particular',
  /* ⚠️ O CONVÊNIO É UMA ETIQUETA SÓ, e não a lista: a lista inteira está
     na clínica. Com o filtro de convênio ligado, a etiqueta diz o do
     filtro; a clínica só particular não leva etiqueta nenhuma. */
  aceitaConvenios: 'Aceita convênios',
  aceita: (convenio: string) => `Aceita ${convenio}`,
  /* ⚠️ "HOJE" É DIA DE ATENDIMENTO COM O HORÁRIO AINDA ABERTO — ver
     `atendeHoje`, em logic/rede. Feriado não entra, porque a agenda que o
     portal manda é a da semana; quando ele mandar as exceções, entram lá.

     ⚠️ E ELA MORA SOBRE A FOTO DO CARTÃO, que tem 128 de largura: onze
     letras, no máximo. Por isso o alemão é "Heute offen" e o francês,
     "Aujourd’hui" — as frases longas quebravam em duas linhas. */
  atendeHoje: 'Atende hoje',
  /* "seg a sex" — três dias seguidos ou mais viram intervalo */
  deAte: (de: string, ate: string) => `${de} a ${ate}`,
  /* ⚠️ O U+2060 EM VOLTA DO TRAÇO NÃO É SUJEIRA: sem ele a linha quebrava
     em "08:00–" e "17:00". Ele é invisível e não deixa quebrar ali. */
  faixa: (abre: string, fecha: string) => `${abre}\u2060–\u2060${fecha}`,
  horario: (dias: string, faixa: string) => `${dias} · ${faixa}`,

  vazioTitulo: 'Nenhuma clínica com esses filtros',
  vazioTexto: 'Tente outra especialidade, ou tire um dos filtros.',
  limparFiltros: 'Limpar filtros',
  erroTitulo: 'Não conseguimos abrir a rede',
  erroTexto: 'Confira a internet e tente de novo.',
  tentarDeNovo: 'Tentar de novo',

  jaTenhoCodigo: 'Já tenho um código de convite',

  /* ============================================================
     AS FOLHAS DOS FILTROS — uma por chip
     ============================================================ */
  folha: {
    especialidade: 'Especialidade',
    convenio: 'Convênio',
    modalidade: 'Modalidade',
    dia: 'Dia de atendimento',
    cidade: 'Cidade',
    todas: 'Todas',
    qualquer: 'Qualquer um',
    qualquerDia: 'Qualquer dia',
    todasAsCidades: 'Todas as cidades',
    presencialOuTele: 'Presencial ou teleconsulta',
    presencial: 'Presencial',
    teleconsulta: 'Teleconsulta',
    limpar: 'Limpar',
  },

  /* ============================================================
     O CARTÃO DA ABA CUIDADO — para quem não tem acompanhamento

     ⚠️ "PERTO DE VOCÊ" SÓ QUANDO É VERDADE. A aba não pede a localização:
     se a pessoa já deixou antes, os rostos são dos mais próximos e a
     frase diz isso; se não, são da rede, e a frase também diz isso.
     ============================================================ */
  cartao: {
    tag: 'Clínicas parceiras',
    titulo: 'Tenha o acompanhamento de especialistas',
    naRede: (n: number) => `${n} ${n === 1 ? 'profissional' : 'profissionais'} na rede`,
    pertoDeVoce: (n: number) => `${n} ${n === 1 ? 'profissional' : 'profissionais'} · os mais perto de você`,
    acao: 'Ver clínicas',
  },
};
