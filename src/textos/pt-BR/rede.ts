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
  /* "Pinheiros • 7,8 km" — no cartão, a distância vem sem o "a" */
  lugarEDistancia: (lugar: string, distancia: string) => `${lugar} • ${distancia}`,
  soTeleconsulta: 'Só teleconsulta',
  soPresencial: 'Presencial',
  presencialETele: 'Presencial e teleconsulta',
  teleconsulta: 'Teleconsulta',
  particular: 'Particular',
  /* ⚠️ O CONVÊNIO É UMA LINHA SÓ, EM AZUL — "Aceita convênios" —, e não
     a lista: a lista inteira está na clínica. Com o filtro de convênio
     ligado, a linha diz o do filtro; a clínica só particular não leva
     linha nenhuma. */
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
     A APRESENTAÇÃO — /rede-apresentacao

     O cartão da aba Cuidado a abre na primeira vez, e a vitrine nas
     seguintes; o "Como funciona" do alto da vitrine volta a ela.

     ⚠️ OS QUATRO PASSOS SÃO O CAMINHO DE VERDADE, e não um convite
     genérico: a pessoa escolhe, marca direto com a clínica, recebe dela o
     código, e só então a equipe entra no aplicativo. "Encontre um médico e
     comece hoje" prometeria um vínculo que nós não criamos — quem cria é
     a clínica, com o código (é o que `assinatura.parceiros.conviteTextoComRede`
     diz com outras palavras).

     ⚠️ E NÃO HÁ PREÇO, pelo mesmo motivo de /parceiros: a assinatura
     ainda não existe no código.
     ============================================================ */
  apresentacao: {
    tag: 'Clínicas parceiras',
    titulo: 'Acompanhamento de perto, entre uma consulta e outra',
    subtitulo: 'Clínicas parceiras acompanham o tratamento pelo aplicativo: a equipe conversa com você, recebe o seu resumo e cuida da receita por aqui.',
    /* o título da seção dos passos, e também o link do alto da vitrine */
    comoFunciona: 'Como funciona',
    passos: [
      { titulo: 'Você escolhe a clínica', texto: 'Pela especialidade, pelo convênio e pela distância até você.' },
      { titulo: 'Marca a primeira consulta', texto: 'Direto com a clínica, pelo WhatsApp, pelo telefone ou pela agenda dela na internet. Esse contato não passa por nós.' },
      { titulo: 'Recebe o código de convite', texto: 'A clínica passa o código depois da consulta, e é ele que liga o seu aplicativo à equipe.' },
      { titulo: 'E a equipe acompanha você', texto: 'Tudo o que você já registrou continua aqui: o vínculo não recomeça nada.' },
    ],
    conhecer: 'Conhecer as clínicas parceiras',
    /* o crédito da foto do alto: a licença gratuita do Magnific (antigo
       Freepik) pede o nome de quem fotografou e o da plataforma, perto da
       imagem ou no pé da página — e nenhum dos dois se traduz. Ver
       assets/images/CREDITOS.txt. */
    credito: 'Imagem de Drazen Zigic no Magnific',
  },

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
    titulo: 'Tenha especialistas ao seu lado',
    /* ⚠️ O NOME DO APLICATIVO ENTRA COMO OBJETO, e nunca com verbo: "as
       clínicas usam o Morphi", e não "o Morphi acompanha" (ver a nota em
       companion). E no masculino, como em "Seus dados do Morphi".

       ⚠️ "POTENCIALIZAR SEUS RESULTADOS" É PROMESSA DE RESULTADO, numa
       peça que fala de médicos — está na revisão jurídica da vitrine
       (PENDENCIAS, item 34). */
    texto: 'Clínicas que usam o Morphi para acompanhar seus pacientes de perto, monitorar a evolução do tratamento e potencializar seus resultados.',
    naRede: (n: number) => `${n} ${n === 1 ? 'profissional' : 'profissionais'} na rede`,
    pertoDeVoce: (n: number) => `${n} ${n === 1 ? 'profissional' : 'profissionais'} · os mais perto de você`,
    acao: 'Ver clínicas',
  },
};
