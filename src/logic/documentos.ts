/* ============================================================
   OS DOCUMENTOS — Termos de Uso e Política de Privacidade

   ⚠️⚠️ O SUPABASE VAI DERRUBAR METADE DISTO. ⚠️⚠️

   O aplicativo vai passar a ter conta, autenticação e banco. Hoje não
   tem, e por isso o que está escrito aqui é verdade: um app sem
   servidor, sem login e sem cópia. No dia em que o Supabase entrar,
   cada frase sobre "fica no seu aparelho" vira declaração falsa numa
   política de privacidade — que é o pior lugar possível para uma.

   Não reescreva antes: descrever tratamento que ainda não acontece é o
   erro simétrico. A lista frase por frase está em PENDENCIAS.md, item 10
   — junto com a região já escolhida, São Paulo (sa-east-1), que mantém o
   histórico de saúde no Brasil e poupa a seção de transferência
   internacional.

   ⚠️ ISTO É UMA MINUTA, E NÃO UM PARECER. Foi escrita a partir do que o
   aplicativo de fato faz — cada afirmação daqui é conferível no código —,
   mas quem publica documento jurídico de aplicativo de saúde é advogado.
   Antes de entrar no ar, os dois precisam de revisão profissional.

   A ESTRUTURA VEIO DO SELLO, o outro aplicativo da mesma empresa, que já
   está no ar. Quatro coisas de lá que faltavam aqui e entraram:

     · BASE LEGAL ARTIGO POR ARTIGO. Dizer "tratamos com o seu
       consentimento" é menos do que a LGPD pede — cada finalidade tem a
       sua hipótese, e num app de saúde elas não são todas a mesma.
     · OPERADORES COM NOME. "Um provedor de infraestrutura" não permite a
       ninguém conferir nada; Vercel e Anthropic, sim.
     · RETENÇÃO POR TIPO DE DADO, e não um parágrafo genérico sobre
       "enquanto necessário".
     · REVISÃO HUMANA (art. 20). O aplicativo tem leitura por modelo, e
       quem é lido por máquina tem direito de pedir gente.

   POR QUE ELES MORAM DENTRO DO APP, e não numa página na internet. Um
   aplicativo que guarda dado de saúde precisa mostrar os termos no
   momento do aceite, e um link que depende de rede escolhe a pior hora
   para falhar: a pessoa está no cadastro, sem contexto, decidindo se
   confia. A mesma minuta serve para publicar depois — as lojas pedem uma
   URL pública para a política —, e é por isso que o texto está em dados.

   ⚠️ E ELES NÃO APARECEM ENQUANTO O BLOCO `EMPRESA` ESTIVER INCOMPLETO.
   Um documento jurídico sem quem responde por ele não é documento: é
   texto.

   COMO A LINGUAGEM FOI ESCOLHIDA. A LGPD pede informação "clara, adequada
   e ostensiva" (art. 9º). Português direto não é informalidade aqui: é o
   que o artigo pede. O que não se pode perder é a precisão — cada
   finalidade, cada base legal e cada destinatário tem de estar nomeado.
   ============================================================ */

/* ------------------------------------------------------------------ */
/* ⚠️ PREENCHA O QUE FALTA. Enquanto faltar um campo, os documentos
   existem no código e não aparecem no aplicativo. */
export const EMPRESA = {
  nome: 'The Delusional Company Desenvolvimento de Software sob Encomenda Ltda.',
  cnpj: '67.758.390/0001-34',
  /* ⚠️ O ENDEREÇO SAIU, E VOLTA QUANDO A ASSINATURA ENTRAR.

     O do cartão do CNPJ é residencial, e publicá-lo aqui expõe muito
     mais do que o cadastro público já expõe: lá alguém precisa ir
     procurar; aqui ele chega junto do aplicativo, na mão de quem usa. A
     LGPD pede identificação e canal de contato do controlador
     (art. 9º, III), e o e-mail atende.

     A exigência de endereço FÍSICO vem de outro lugar: o Decreto
     7.962/2013, que regula a venda pela internet, manda o fornecedor
     exibir endereço físico e eletrônico em local de destaque. Ele passa
     a valer no dia em que houver assinatura paga — e aí o certo é entrar
     com um endereço comercial ou fiscal, e não voltar com o de casa. */
  endereco: '',
  /* ⚠️⚠️ ENDEREÇO DE MARCAÇÃO — TROCAR ANTES DE SUBIR PARA A LOJA. ⚠️⚠️

     O domínio do Morphi ainda não foi registrado. Este endereço está aqui
     para que os documentos existam e sejam lidos durante o
     desenvolvimento, e ele NÃO RECEBE NADA: quem escrever para ele hoje
     escreve para o vazio.

     Ele aparece em oito lugares — abertura da política, controlador,
     direitos, revisão humana, menores, encarregado, contato dos termos e
     o relato de problema do perfil —, e em todos sai deste campo. Trocar
     é mudar esta linha.

     O e-mail do cartão do CNPJ é o da contabilidade e não serve: quem
     escreve para um canal de privacidade espera resposta de quem opera o
     serviço, com prazo de quinze dias.

     Ver PENDENCIAS.md, na raiz do projeto. */
  email: 'contato@morphi.app.br',
};

/* O ENCARREGADO É O MESMO CANAL, e isso é uma escolha declarada, não um
   descuido: numa empresa deste tamanho inventar um segundo endereço que
   ninguém lê seria pior do que assumir que é a mesma caixa. O art. 41 da
   LGPD pede que a identidade e as informações de contato do encarregado
   sejam divulgadas publicamente, e é isso que a seção final faz. */
export const CANAL = () => EMPRESA.email || '[e-mail pendente]';

/* ⚠️ O CONTATO ENTRA NA CONTA. Um documento com razão social e sem canal
   de atendimento diz quem responde e não diz por onde — e é justamente
   por onde que a LGPD exige. */
export const temIdentificacao = () => !!(EMPRESA.nome && EMPRESA.cnpj && EMPRESA.email);

/** Sobe quando o conteúdo mudar de forma relevante — e conversa com a
    versão do aviso de consentimento, em src/logic/consentimento.ts. */
export const VERSAO_DOS_DOCUMENTOS = '1.0';
export const VIGENTE_DESDE = '18 de setembro de 2026';
/* PRÉ-LANÇAMENTO VAI ESCRITO, como no Sello. Um documento que descreve
   um serviço que ainda não abriu precisa dizer isso: parte do que está
   aqui — a assinatura, o envio à equipe — entra em vigor no dia em que a
   função existir, e quem lê tem direito de saber em que fase está. */
export const FASE = 'Pré-lançamento';

/** A idade mínima. Dado de saúde de menor de idade tem regra própria
    (LGPD, art. 14) e exige consentimento de quem responde por ele. A
    decisão de produto é ser exclusivo para maiores. */
export const IDADE_MINIMA = 18;

export type Secao = {
  titulo: string;
  /** aceitam <b>ênfase</b> */
  paragrafos?: string[];
  itens?: string[];
  /** parágrafos que vêm DEPOIS da lista — a ordem importa, e chave de
      objeto não carrega ordem de leitura */
  depois?: string[];
};

export type Documento = {
  id: 'termos' | 'privacidade';
  /** a sobrelinha, que diz de que lei o documento vive */
  sobre: string;
  titulo: string;
  /** o parágrafo de abertura, antes da primeira seção */
  abertura: string;
  secoes: Secao[];
};

const QUEM = () => (EMPRESA.nome ? `<b>${EMPRESA.nome}</b>, inscrita no CNPJ sob o nº ${EMPRESA.cnpj}` : '[identificação pendente]');

/* ============================================================
   POLÍTICA DE PRIVACIDADE
   ============================================================ */
export const PRIVACIDADE = (): Documento => ({
  id: 'privacidade',
  sobre: 'POLÍTICA · LGPD',
  titulo: 'Política de Privacidade',
  abertura: `Esta política descreve quais dados o Morphi trata, para quê, com quem compartilha e por quanto tempo. Está escrita para ser lida de fato, sem jargão decorativo. Dúvidas: ${CANAL()}.`,
  secoes: [
    {
      titulo: '1. Quem é o controlador',
      paragrafos: [
        `O controlador dos dados pessoais tratados neste aplicativo é ${QUEM()}${EMPRESA.endereco ? `, com sede em ${EMPRESA.endereco}` : ', com sede em São Paulo/SP'}. Canal oficial de contato: ${CANAL()}.`,
      ],
    },
    {
      titulo: '2. Quais dados o Morphi trata',
      paragrafos: [
        'Tudo abaixo é informado por você ou calculado a partir do que você registra. O aplicativo <b>não coleta a sua localização</b>, não lê a sua agenda e não acessa os seus contatos.',
      ],
      itens: [
        '<b>Identificação</b> — nome ou apelido, data de nascimento e como você se identifica.',
        '<b>Dados de saúde</b> — altura, peso, medidas corporais, medicamento, dose, datas e locais de aplicação, sintomas, sono, humor, energia, resultados de exames, restrições alimentares e as anotações que você escreve.',
        '<b>Hábitos</b> — refeições, proteína, hidratação e exercício que você registra.',
        '<b>Fotos</b> — a foto de perfil, quando você escolhe uma.',
        '<b>Preferências</b> — metas diárias, horários de lembrete e tema do aplicativo.',
        '<b>Registro do consentimento</b> — a data e a versão do aviso que você aceitou.',
      ],
      depois: [
        'A maior parte disso é <b>dado pessoal sensível</b>, na definição do art. 5º, II da LGPD. Isso significa uma régua mais alta, e é o que a seção 4 detalha.',
      ],
    },
    {
      titulo: '3. Por que tratamos',
      itens: [
        '<b>Metas diárias</b> — para calcular proteína, água e movimento a partir da sua altura, peso, meta e nível de atividade.',
        '<b>Acompanhamento</b> — para montar as curvas de peso e medidas, o ciclo da dose, a adesão às aplicações e os padrões nos seus sintomas.',
        '<b>Consulta</b> — para organizar o resumo que você leva ao seu médico.',
        '<b>Lembretes</b> — para disparar os alertas que você mesmo configurou.',
        '<b>Leitura de foto</b> — para sugerir os itens do prato quando você fotografa uma refeição.',
        '<b>Obrigações legais</b> — quando a lei exigir de nós.',
      ],
      depois: [
        'Nada disso é diagnóstico. O aplicativo não prescreve, não ajusta dose e não substitui a avaliação de quem acompanha você.',
        'Não vendemos dados, não usamos os seus dados de saúde para perfilamento publicitário e não os enviamos para redes de anúncio.',
      ],
    },
    {
      titulo: '4. Base legal (LGPD arts. 7º e 11)',
      itens: [
        '<b>Dados de saúde</b> — <b>consentimento específico e destacado</b> (art. 11, I). É o aceite que você dá no cadastro, antes de o plano ser montado, com um aviso que diz o que será feito.',
        '<b>Envio à sua equipe de saúde</b> — <b>tutela da saúde</b>, em procedimento realizado por profissionais de saúde (art. 11, II, "f"), somado ao seu comando de enviar.',
        '<b>Cadastro e funcionamento do aplicativo</b> — <b>execução de contrato</b> (art. 7º, V): sem esses dados o app não funciona.',
        '<b>Leitura da foto do prato</b> — <b>consentimento</b> (art. 7º, I), dado no momento em que você escolhe usar a câmera em vez do registro manual.',
        '<b>Leitura do aplicativo de saúde do celular</b> — <b>consentimento</b>, concedido e revogado nos ajustes do sistema operacional.',
      ],
      depois: [
        'Você pode <b>revogar o consentimento a qualquer momento</b>, apagando os seus dados em Configurações ou escrevendo para o nosso canal. A revogação não invalida o tratamento feito antes dela.',
      ],
    },
    {
      titulo: '5. Onde os seus dados ficam',
      paragrafos: [
        'Os seus registros são gravados no armazenamento do aplicativo, <b>no seu próprio aparelho</b>. Não há conta nem senha: ninguém acessa os seus dados com um login, porque não existe login.',
        'Como não mantemos banco de dados com os seus registros, <b>não existe um servidor nosso de onde eles possam vazar</b>. A contrapartida é que desinstalar o aplicativo apaga tudo, sem cópia para restaurar — por isso a exportação existe e está em Configurações.',
      ],
    },
    {
      titulo: '6. O que sai do seu aparelho',
      paragrafos: ['São duas situações, e as duas dependem de um toque seu.'],
      itens: [
        '<b>O que você envia à sua equipe</b> — o resumo para consulta e as mensagens que você escreve. Nada do seu diário é transmitido automaticamente.',
        '<b>A foto do prato</b>, quando você usa a leitura por foto — a imagem é reduzida no aparelho e enviada para ser interpretada. Ela <b>não é armazenada</b>: nem no registro da refeição, nem no serviço que faz a intermediação.',
      ],
      depois: [
        'Registrar a refeição manualmente não envia nada.',
      ],
    },
    {
      titulo: '7. Compartilhamento com terceiros',
      paragrafos: ['Compartilhamos dados estritamente com operadores que fazem o Morphi funcionar:'],
      itens: [
        '<b>Vercel</b> (infraestrutura) — hospeda a função que intermedeia a leitura da foto, em servidores no Brasil. Não guarda a imagem e não tem banco de dados nosso.',
        '<b>Anthropic</b> (modelo de IA) — interpreta a foto do prato e devolve os itens. A imagem não é usada para treinar modelos.',
        '<b>A sua equipe de saúde</b>, quando houver vínculo — e apenas o conteúdo que você enviar a ela.',
        '<b>Autoridades públicas</b>, diante de obrigação legal ou ordem judicial, e apenas o estritamente exigido.',
      ],
      depois: [
        'O aplicativo <b>não usa serviço de telemetria, analytics ou monitoramento de erro</b>. Não compartilhamos com anunciantes, brokers de dados ou terceiros para fins de marketing.',
      ],
    },
    {
      titulo: '8. Transferência internacional',
      paragrafos: [
        'A interpretação da foto do prato é feita por provedor sediado nos <b>Estados Unidos</b>, o que configura transferência internacional nos termos do <b>art. 33 da LGPD</b>. Ela acontece apenas quando você usa essa função, envolve apenas a imagem enviada, e a imagem não é armazenada para essa finalidade.',
        'Se preferir que isso não aconteça, registre as refeições manualmente.',
      ],
    },
    {
      titulo: '9. Aplicativos de saúde do celular',
      paragrafos: [
        'Com a sua autorização, o Morphi lê pesagens registradas no <b>Apple Saúde</b> (iPhone) ou no <b>Health Connect</b> (Android) — que é por onde chegam os números da sua balança, do seu relógio ou de outro aplicativo.',
        'A leitura é <b>apenas de peso</b>, e o Morphi <b>nunca escreve</b> nada nesses aplicativos. A autorização é concedida e revogada nos ajustes do sistema, a qualquer momento; sem ela, o peso passa a ser digitado por você e o resto continua igual.',
      ],
    },
    {
      titulo: '10. Por quanto tempo guardamos',
      itens: [
        '<b>Registros do tratamento</b> — no seu aparelho, enquanto você quiser. Você apaga cada um onde ele aparece, ou todos de uma vez em Configurações.',
        '<b>Foto do prato</b> — não é guardada. Existe durante a chamada e é descartada.',
        '<b>O que você enviou à sua equipe</b> — fica sob a guarda dela, que tem obrigações próprias de prontuário e de prazo. Para apagar o que já chegou lá, o pedido é feito a ela.',
        '<b>Registro do consentimento</b> — enquanto o aplicativo estiver instalado, porque é a prova de que ele foi dado e em que versão.',
      ],
    },
    {
      titulo: '11. Os seus direitos (LGPD art. 18)',
      paragrafos: ['Você pode, a qualquer momento:'],
      itens: [
        'Confirmar que há tratamento e <b>acessar</b> os seus dados — o aplicativo mostra tudo que você registrou.',
        '<b>Corrigir</b> dados incompletos, inexatos ou desatualizados — todo registro é editável onde aparece.',
        'Pedir <b>anonimização, bloqueio ou eliminação</b> de dados desnecessários ou tratados fora da lei.',
        '<b>Levar os seus dados embora</b>, em formato estruturado e legível por máquina — Configurações › Exportar seus dados.',
        '<b>Eliminar</b> os dados tratados com o seu consentimento — Configurações › Apagar meus dados.',
        'Saber com quem compartilhamos, o que está na seção 7.',
        '<b>Revogar o consentimento</b>, e ser informado das consequências de não o dar.',
        '<b>Opor-se</b> a tratamento feito sem consentimento.',
      ],
      depois: [
        'Acesso, correção, portabilidade e eliminação estão dentro do aplicativo e não dependem de pedido. Para os demais, ou se preferir falar com uma pessoa, escreva para ' + CANAL() + '. <b>Respondemos em até 15 dias.</b>',
      ],
    },
    {
      titulo: '12. Decisões automatizadas e revisão humana (art. 20)',
      paragrafos: [
        'Duas partes do aplicativo são produzidas por máquina: a <b>leitura da foto do prato</b> e as <b>descobertas</b>, que apontam padrões nos seus próprios registros. As duas são probabilísticas e <b>podem errar</b>.',
        'Nenhuma delas decide nada sobre o seu tratamento — a lista da foto vai para a sua conferência antes de salvar, e as descobertas são leitura, não conduta. Ainda assim, você pode contestar qualquer uma delas e <b>pedir revisão por uma pessoa</b>: escreva para ' + CANAL() + '.',
        '<b>Não tome decisão sobre dose, sintoma, alergia ou restrição alimentar com base apenas no que a máquina escreveu.</b> Confirme com a sua equipe de saúde.',
      ],
    },
    {
      titulo: '13. Cookies e rastreadores',
      paragrafos: [
        'O Morphi <b>não usa cookies</b> de terceiros, pixels de rastreamento, identificadores de publicidade nem ferramentas de analytics. Não usamos Google Analytics, Meta Pixel ou similares.',
      ],
    },
    {
      titulo: '14. Segurança',
      paragrafos: [
        'Os dados ficam na área privada do aplicativo, protegida pelo sistema operacional do aparelho, e todo o tráfego da leitura de foto é criptografado via HTTPS.',
        'Nenhum sistema é inviolável, e não prometemos o contrário. Em caso de incidente de segurança que possa acarretar risco relevante, comunicaremos a <b>ANPD</b> e as pessoas afetadas, conforme o <b>art. 48 da LGPD</b>.',
        'A segurança do seu aparelho é parte disso: manter bloqueio de tela e o sistema atualizado protege o que está guardado aqui.',
      ],
    },
    {
      titulo: '15. Menores de idade',
      paragrafos: [
        `O Morphi é <b>exclusivo para maiores de ${IDADE_MINIMA} anos</b> e não se destina a crianças e adolescentes. Não tratamos conscientemente dados de menores.`,
        `Pais, responsáveis ou qualquer pessoa que identifique um cadastro de menor pode solicitar a exclusão imediata em ${CANAL()}.`,
      ],
    },
    {
      titulo: '16. Mudanças nesta política',
      paragrafos: [
        'Quando ampliarmos as funções do Morphi, esta política será atualizada. Mudanças relevantes — uma nova finalidade, um novo destinatário — são comunicadas dentro do aplicativo <b>antes de entrarem em vigor</b>, e pedimos o seu aceite de novo quando for o caso.',
        `A versão e a data de vigência estão no alto desta página.`,
      ],
    },
    {
      titulo: '17. Encarregado e contato',
      paragrafos: [
        `O <b>Encarregado pelo Tratamento de Dados Pessoais</b>, nos termos do art. 41 da LGPD e da Resolução CD/ANPD nº 18, de 16 de julho de 2024, é designado por ${EMPRESA.nome || '[identificação pendente]'} e pode ser contatado pelo canal oficial: ${CANAL()}.`,
        'Você também pode registrar reclamação junto à <b>Autoridade Nacional de Proteção de Dados (ANPD)</b>, em gov.br/anpd.',
      ],
    },
  ],
});

/* ============================================================
   TERMOS DE USO
   ============================================================ */
export const TERMOS = (): Documento => ({
  id: 'termos',
  sobre: 'TERMOS · CDC + MARCO CIVIL',
  titulo: 'Termos de Uso',
  abertura: 'Estes Termos regem o uso do aplicativo Morphi. Ao concluir o cadastro ou continuar usando o app, você concorda com eles e com a nossa Política de Privacidade. Se não concorda, não use o aplicativo.',
  secoes: [
    {
      titulo: '1. Sobre o Morphi',
      paragrafos: [
        `O Morphi é oferecido por ${QUEM()}.`,
        'É um aplicativo de <b>registro e acompanhamento</b> de tratamento. Ele organiza o que você anota, mostra a sua evolução e ajuda a preparar o que levar para a consulta.',
        'O Morphi <b>não é dispositivo médico</b>, não realiza diagnóstico, <b>não prescreve medicamento</b>, não indica dose, não ajusta tratamento e não substitui consulta, exame ou a orientação de quem acompanha você.',
      ],
    },
    {
      titulo: '2. Quem pode usar',
      paragrafos: [
        `Você precisa ter <b>${IDADE_MINIMA} anos completos</b> e capacidade civil para aceitar estes Termos. O serviço não se destina a menores de ${IDADE_MINIMA} anos. Pais, responsáveis ou qualquer pessoa que identifique cadastro de menor pode solicitar exclusão imediata em ${CANAL()}.`,
        'Você se compromete a fornecer informações verdadeiras: elas alimentam todas as contas do aplicativo, e um dado errado produz um acompanhamento errado.',
      ],
    },
    {
      titulo: '3. O que o Morphi faz',
      itens: [
        'Guarda os seus registros de peso, medidas, aplicações, sintomas, exames, refeições, hidratação e exercício.',
        'Calcula metas diárias e mostra a evolução do tratamento em curvas e marcos.',
        'Dispara os lembretes que você configurar, pelo próprio celular.',
        'Monta um resumo do tratamento para levar à consulta, e o envia à sua equipe quando você manda.',
        'Lê a foto de um prato, quando você escolhe, e sugere os itens da refeição.',
        'Lê pesagens do aplicativo de saúde do celular, com a sua autorização.',
      ],
    },
    {
      titulo: '4. O que o Morphi não garante',
      itens: [
        'Que as leituras, descobertas e sugestões estejam corretas — elas são cálculo e interpretação sobre o que você registrou.',
        'Que os lembretes toquem: quem dispara é o sistema operacional, e ele depende de permissão, bateria e modos de foco.',
        'Que a leitura da foto acerte o prato. Confira a lista antes de salvar.',
        'Disponibilidade ininterrupta — pode haver manutenção, falha de rede ou incompatibilidade com uma versão de sistema.',
        'A conduta de qualquer profissional ou clínica com quem você se vincule.',
      ],
      depois: [
        '<b>Conteúdo gerado por IA.</b> A leitura da foto e as descobertas usam inteligência artificial e são probabilísticas — podem conter imprecisões. <b>Não tome decisão sobre dose, sintoma, alergia ou restrição alimentar baseando-se apenas nelas.</b> Você pode pedir revisão humana de qualquer uma, conforme o art. 20 da LGPD, escrevendo para ' + CANAL() + '.',
      ],
    },
    {
      titulo: '5. Em caso de emergência',
      paragrafos: [
        'O Morphi <b>não é canal de urgência</b>. Se alguma coisa no seu corpo pede atenção imediata, procure um serviço de emergência ou a sua equipe de saúde — não espere resposta pelo aplicativo.',
      ],
    },
    {
      titulo: '6. A relação com a sua equipe de saúde',
      paragrafos: [
        'Quando você se vincula a um profissional ou clínica, o Morphi funciona como <b>canal</b> entre vocês: transmite o que você escolhe enviar.',
        'O <b>serviço de saúde é prestado por esse profissional</b>, e não por nós. Conduta, prescrição, diagnóstico e acompanhamento são responsabilidade dele, inclusive o que ele faz com o que recebe.',
      ],
    },
    {
      titulo: '7. Assinatura e pagamento',
      paragrafos: [
        'O acesso ao Morphi é por assinatura, com preço e periodicidade informados no momento da contratação. Quando a contratação ocorrer pela <b>App Store</b> ou pelo <b>Google Play</b>, a cobrança e a renovação são administradas por essas plataformas.',
        'Quem chega por indicação de <b>profissional parceiro</b>, com código de convite válido, tem o acesso isento enquanto o vínculo estiver ativo. Caso a clínica parceira nos informe que o vínculo de tratamento foi encerrado, o acesso ao aplicativo fica suspenso até você aderir a um plano Personal — e <b>nenhuma cobrança acontece sem que você escolha assinar</b>.',
        'A suspensão não apaga nada e não tranca os seus dados: os registros continuam no seu aparelho e podem ser <b>exportados a qualquer momento</b>, com ou sem assinatura.',
        '<b>Direito de arrependimento (CDC art. 49).</b> Você tem 7 dias corridos contados da contratação para desistir e receber reembolso integral, sem ônus. Quando a compra for pela loja, o reembolso segue o fluxo nativo dela.',
        'Você pode cancelar quando quiser, pela própria loja. O cancelamento interrompe a renovação seguinte; o período já pago segue valendo até o fim. Cancelar <b>não apaga os seus registros</b> — eles estão no seu aparelho.',
      ],
    },
    {
      titulo: '8. Conduta esperada',
      paragrafos: ['Você concorda em não:'],
      itens: [
        'Usar o aplicativo para finalidade ilegal ou contrária à ordem pública.',
        'Descompilar, modificar, redistribuir ou criar trabalhos derivados a partir do aplicativo.',
        'Registrar dados de saúde de outra pessoa sem que ela saiba e autorize.',
        'Apresentar o que o aplicativo mostra como diagnóstico, laudo ou prescrição.',
        'Tentar burlar limites técnicos, automatizar acesso ou interferir no funcionamento do serviço.',
      ],
      depois: [
        'O descumprimento pode levar à suspensão ou ao encerramento do acesso, sem prejuízo de medidas legais.',
      ],
    },
    {
      titulo: '9. Os seus registros',
      paragrafos: [
        'O que você registra <b>continua sendo seu</b>. Não usamos os seus dados para outra finalidade além das descritas na Política de Privacidade.',
        'Como o aplicativo funciona sem conta e sem servidor, <b>a guarda dos registros é sua</b>: desinstalar o app, perder ou trocar de aparelho leva tudo junto, e não temos cópia para restaurar. A exportação está em Configurações e serve para você manter o seu próprio backup.',
      ],
    },
    {
      titulo: '10. Propriedade intelectual',
      paragrafos: [
        'A marca Morphi, o logo, o design, o código-fonte, os textos e a base de dados do aplicativo são de propriedade exclusiva da empresa e protegidos pela legislação brasileira de direitos autorais e propriedade industrial.',
        'Você recebe uma licença pessoal, intransferível e não exclusiva de uso do aplicativo para fins não comerciais.',
      ],
    },
    {
      titulo: '11. Limitação de responsabilidade',
      paragrafos: ['Não nos responsabilizamos por:'],
      itens: [
        'Decisões clínicas tomadas com base no que o aplicativo organiza ou sugere.',
        'Conduta, orientação ou omissão de profissionais e clínicas com quem você se vincule.',
        'Perda de registros por remoção do aplicativo, perda do aparelho ou falha do sistema operacional.',
        'Falhas de serviços externos — loja de aplicativos, aplicativo de saúde do celular, rede.',
      ],
      depois: [
        'Nada nestes Termos exclui responsabilidades que a lei brasileira, em especial o <b>Código de Defesa do Consumidor</b>, imponha de forma cogente.',
      ],
    },
    {
      titulo: '12. Encerramento',
      paragrafos: [
        'Você pode parar de usar o Morphi quando quiser, e apagar tudo em <b>Configurações › Apagar meus dados</b>.',
        'Podemos suspender ou encerrar o acesso em caso de descumprimento destes Termos ou de determinação legal, com aviso prévio sempre que possível — e você continua podendo exportar o que registrou.',
      ],
    },
    {
      titulo: '13. Alterações nestes Termos',
      paragrafos: [
        'Mudanças relevantes são comunicadas dentro do aplicativo <b>antes de entrarem em vigor</b>. Continuar usando depois disso significa aceitação; se não concordar, você pode encerrar o uso e apagar os seus dados sem ônus.',
      ],
    },
    {
      titulo: '14. Lei aplicável e foro',
      paragrafos: [
        'Estes Termos são regidos pela lei brasileira, em especial pelo <b>Marco Civil da Internet</b> (Lei 12.965/14), pela <b>Lei Geral de Proteção de Dados</b> (Lei 13.709/18) e pelo <b>Código de Defesa do Consumidor</b>.',
        'Fica eleito o <b>foro do domicílio do consumidor</b> para dirimir quaisquer questões oriundas destes Termos.',
      ],
    },
    {
      titulo: '15. Contato',
      paragrafos: [
        `Dúvidas, denúncias e exercício de direitos: ${CANAL()}.`,
        'Para tratamento de dados pessoais, consulte também a nossa <b>Política de Privacidade</b>, em Configurações.',
      ],
    },
  ],
});

export const documentoDe = (id: string): Documento | null =>
  id === 'termos' ? TERMOS() : id === 'privacidade' ? PRIVACIDADE() : null;
