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

     ⚠️ E NÃO HÁ PREÇO — há a isenção. A faixa embaixo dos passos diz que
     quem se trata numa clínica parceira não paga, que é a regra da casa;
     valor nenhum aparece aqui, pelo mesmo motivo que a antiga /parceiros não dava: a
     cobrança ainda não existe no código (PENDENCIAS, item 5).
     ============================================================ */
  apresentacao: {
    tag: 'Clínicas parceiras',
    titulo: 'Acompanhamento de perto, entre uma consulta e outra',
    subtitulo: 'Clínicas parceiras acompanham seu tratamento pelo aplicativo: a equipe conversa com você, acompanha sua evolução e recebe as informações da sua jornada.',
    /* o título da seção dos passos, e também o link do alto da vitrine */
    comoFunciona: 'Como funciona',
    passos: [
      { titulo: 'Encontre uma clínica', texto: 'Escolha pela especialidade, convênio ou distância até você.' },
      { titulo: 'Marque sua primeira consulta', texto: 'Entre em contato diretamente com a clínica e agende sua consulta.' },
      { titulo: 'Receba seu código de convite', texto: 'A clínica envia o código depois da consulta. É ele que conecta seu aplicativo à equipe.' },
      { titulo: 'A equipe acompanha seu tratamento', texto: 'Tudo o que você já registrou continua aqui. O vínculo com a clínica não apaga nada.' },
    ],
    /* ⚠️ A ISENÇÃO É A REGRA DA CASA, e não uma promoção: quem tem vínculo
       com clínica parceira não paga — ver `isento`, em logic/assinatura, e
       os Termos. É a mesma frase que a tela de Assinatura já diz. E o nome
       vai no masculino até a decisão do artigo (PENDENCIAS, item 35). */
    isencaoTitulo: 'E tem mais: você não paga pelo Morphi',
    isencaoTexto: 'Quem faz o tratamento com uma clínica parceira tem acesso gratuito ao aplicativo.',
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

     ⚠️ O TÍTULO E O TEXTO SÃO DOS DOIS CARTÕES: o da rede, com os rostos
     e "Ver clínicas", e o de antes, que leva à apresentação (ou ao
     código, sem a rede no ar). Os dois falam da mesma coisa, e dizer de dois jeitos
     faria a pessoa achar que são duas.

     ⚠️ E NÃO HÁ CONTAGEM. "9 profissionais na rede" saiu do cartão: os
     rostos já dizem que há gente do outro lado.
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
    acao: 'Ver clínicas',
    /* o botão do cartão com a rede no ar e a lista ainda chegando: ele leva
       à apresentação, que não é lista de clínicas — "Ver clínicas" ali seria mentira */
    saibaMais: 'Saiba mais',
  },

  /* ============================================================
     O VÍNCULO NO SERVIDOR — o consentimento de compartilhar, o código
     guardado, desconectar e os avisos (fase 6 do plano do Supabase)

     ⚠️ A LISTA DO QUE A CLÍNICA VÊ SAI DA TABELA DE TRADUÇÃO
     (logic/compartilhamento): todo tipo de registro e toda parte do
     perfil que a equipe lê. Um tipo novo sem frase aqui derruba a trava.
     ============================================================ */
  vinculo: {
    titulo: 'O que a clínica passa a ver',
    itens: {
      peso: 'Pesagens',
      aplicacao: 'Aplicações',
      checkin: 'Check-ins: sintomas, sono, fome, água, proteína e movimento',
      refeicao: 'Refeições',
      refeicao_favorita: 'Refeições favoritas',
      medida: 'Medidas do corpo',
      exame: 'Exames',
      laudo: 'Laudos',
      sinal_vital: 'Sinais vitais',
      documento: 'Documentos',
      anotacao: 'Anotações',
      meta_pessoal: 'Metas pessoais',
      caneta: 'Os recipientes do medicamento',
      pessoal: 'Seus dados: nome, nascimento, altura e foto',
      tratamento: 'O tratamento, com o histórico de saúde: condições, alergias e medicamentos',
      acompanhamento: 'Quem acompanha você, e as consultas que você anotou',
      protocolo: 'O protocolo da semana e as metas',
      preferencias: 'Preferências do aplicativo, como idioma e lembretes',
      vistos: 'O que o aplicativo já mostrou a você',
    },
    antes: 'Inclui o que você registrou antes de conectar.',
    perguntas: 'As perguntas que você faz ao Morphi não entram.',
    dura: 'A clínica vê enquanto a conexão durar. Dá para desconectar a qualquer momento, na tela da clínica.',
    guarda: 'O que for registrado durante o acompanhamento fica guardado pela clínica, como prontuário, mesmo depois de desconectar.',
    aceitar: 'Conectar é concordar com o compartilhamento acima.',
    semInternet: 'Conferir o código precisa de internet. Tente de novo quando a conexão voltar.',
    naoValeuAgora: 'Esse código não valeu: ele já foi usado ou venceu. Peça outro à clínica.',
    entrarPrimeiro: 'Para conectar, entre de novo na sua conta. O código fica guardado.',
    guardadoTitulo: 'Código guardado',
    guardadoTexto: 'Conectamos a clínica assim que a sua conta for criada.',
    desconectar: 'Desconectar da clínica',
    desconectarPergunta: 'A equipe deixa de ver o seu diário, e a isenção do aplicativo pela clínica acaba. Os seus registros ficam todos aqui.',
    desconectarSim: 'Desconectar',
    desconectarCancelar: 'Cancelar',
    desconectarSemInternet: 'Desconectar precisa de internet. Nada mudou.',
    avisoEncerrouTitulo: 'A clínica encerrou o acompanhamento',
    avisoEncerrouTexto: 'O seu diário continua aqui, inteiro.',
    avisoNaoConfirmadoTitulo: 'O código de convite não foi confirmado',
    avisoNaoConfirmadoTexto: 'Ele nunca chegou a ser conferido com a clínica. Dá para digitar de novo na aba Cuidado.',
    avisoNaoValeuTitulo: 'O código de convite não valeu',
    avisoNaoValeuTexto: 'Ele já tinha sido usado ou venceu. Dá para digitar outro na aba Cuidado.',
  },
};
