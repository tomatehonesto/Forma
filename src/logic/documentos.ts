/* ============================================================
   OS DOCUMENTOS — Termos de Uso e Política de Privacidade

   ⚠️ ISTO É UMA MINUTA, E NÃO UM PARECER. Foi escrita a partir do que o
   aplicativo de fato faz — cada afirmação daqui é conferível no código —,
   mas quem publica documento jurídico de aplicativo de saúde é advogado.
   Antes de entrar no ar, os dois precisam de revisão profissional.

   POR QUE ELES MORAM AQUI, e não numa página na internet. Um aplicativo
   que guarda dado de saúde precisa mostrar os termos no momento do
   aceite, e um link que depende de rede escolhe a pior hora para falhar:
   a pessoa está no cadastro, sem contexto, decidindo se confia. Dentro
   do app eles abrem sempre.

   A mesma minuta serve para publicar na internet depois — as lojas
   pedem uma URL pública para a política —, e é por isso que o texto está
   em dados, e não espalhado em JSX.

   ⚠️ E ELES NÃO APARECEM ENQUANTO O BLOCO `EMPRESA` ESTIVER INCOMPLETO. Um
   documento jurídico sem quem responde por ele não é documento: é texto.
   O aceite do cadastro e a tela de Privacidade só desenham o link quando
   houver identificação — a mesma regra que já valia quando eles não
   existiam.

   COMO A LINGUAGEM FOI ESCOLHIDA. A LGPD pede informação "clara, adequada
   e ostensiva" (art. 9º). Português direto não é informalidade aqui: é o
   que o artigo pede. O que não se pode perder é a precisão — cada
   finalidade, cada base legal e cada destinatário tem de estar nomeado.
   ============================================================ */

/* ------------------------------------------------------------------ */
/* ⚠️ PREENCHA ESTE BLOCO. Enquanto faltar um campo, os documentos
   existem no código e não aparecem no aplicativo.

   O encarregado (DPO) é exigido pelo art. 41 da LGPD e precisa ser um
   canal que alguém responde — um e-mail monitorado, não uma caixa
   decorativa. É por ele que chegam os pedidos de acesso e eliminação,
   com prazo de resposta. */
export const EMPRESA = {
  nome: 'The Delusional Company Desenvolvimento de Software sob Encomenda Ltda.',
  cnpj: '67.758.390/0001-34',
  endereco: 'Rua Carvalho de Freitas, 325, apto. 141 — Vila Andrade, São Paulo/SP, CEP 05728-030',
  /* ⚠️ FALTAM OS DOIS CANAIS, e são eles que fazem o documento funcionar.

     O e-mail do cartão do CNPJ é o da contabilidade, e não serve: quem
     escreve para um canal de privacidade espera resposta de quem opera o
     serviço, com prazo. E o encarregado é exigência do art. 41 da LGPD —
     precisa ser uma caixa que alguém lê.

     Enquanto estiverem vazios, os documentos não aparecem no aplicativo. */
  email: '',
  encarregado: '',
};

/* ⚠️ O CONTATO ENTRA NA CONTA. Um documento com razão social e sem canal
   de atendimento diz quem responde e não diz por onde — e é justamente
   por onde que a LGPD exige. */
export const temIdentificacao = () => !!(EMPRESA.nome && EMPRESA.cnpj && EMPRESA.email && EMPRESA.encarregado);

/** Sobe quando o conteúdo mudar de forma relevante — e conversa com a
    versão do aviso de consentimento, em src/logic/consentimento.ts. */
export const VERSAO_DOS_DOCUMENTOS = 1;
export const ATUALIZADO_EM = 'setembro de 2026';

/** A idade mínima. Dado de saúde de menor de idade tem regra própria
    (LGPD, art. 14) e exige consentimento de quem responde por ele — um
    fluxo que este aplicativo não tem. Enquanto não tiver, o limite é 18. */
export const IDADE_MINIMA = 18;

export type Secao = {
  titulo: string;
  paragrafos?: string[];
  /** itens de lista, quando o conteúdo é uma enumeração */
  itens?: string[];
  /** parágrafos que vêm DEPOIS da lista — a ordem importa, e chave de
      objeto não carrega ordem de leitura */
  depois?: string[];
};

export type Documento = {
  id: 'termos' | 'privacidade';
  titulo: string;
  lead: string;
  secoes: Secao[];
};

const QUEM = () => (EMPRESA.nome ? `${EMPRESA.nome} (CNPJ ${EMPRESA.cnpj})` : '[identificação pendente]');

/* ============================================================
   POLÍTICA DE PRIVACIDADE
   ============================================================ */
export const PRIVACIDADE = (): Documento => ({
  id: 'privacidade',
  titulo: 'Política de Privacidade',
  lead: `Atualizada em ${ATUALIZADO_EM}. Ela descreve quais dados o Morphi trata, para quê, com quem compartilha e o que você pode exigir a qualquer momento.`,
  secoes: [
    {
      titulo: '1. Quem trata os seus dados',
      paragrafos: [
        `O controlador dos seus dados é ${QUEM()}, com sede em ${EMPRESA.endereco || '[endereço pendente]'}.`,
        `Encarregado pelo tratamento de dados pessoais: ${EMPRESA.encarregado || '[encarregado pendente]'}. É por esse canal que você pede acesso, correção ou eliminação — e é ele que responde.`,
      ],
    },
    {
      titulo: '2. Que dados o Morphi trata',
      paragrafos: [
        'Tudo que está abaixo é informado por você ou gerado a partir do que você registra. O aplicativo não coleta a sua localização, não lê a sua agenda e não acessa os seus contatos.',
      ],
      itens: [
        'Identificação: nome ou apelido, data de nascimento e como você se identifica.',
        'Dados de saúde: altura, peso, medidas corporais, medicamento em uso, dose, datas e locais de aplicação, sintomas, sono, humor, energia, resultados de exames, restrições alimentares e as anotações que você escreve.',
        'Hábitos: refeições, proteína, hidratação e exercício que você registra.',
        'Fotos: a foto de perfil, quando você escolhe uma, e as fotos de progresso que você guarda.',
        'Preferências: metas diárias, horários de lembrete e tema do aplicativo.',
        'Registro do consentimento: a data e a versão do aviso que você aceitou.',
      ],
    },
    {
      titulo: '3. Dados de saúde são dados sensíveis',
      paragrafos: [
        'A maior parte do que está acima é dado pessoal sensível, na definição do art. 5º, II da LGPD. Isso significa uma régua mais alta: eles só podem ser tratados com o seu consentimento específico e destacado, ou nas outras hipóteses do art. 11 — e é por isso que o aplicativo pede o seu aceite antes de montar o seu plano, com um texto que diz o que será feito.',
        'Você pode retirar esse consentimento a qualquer momento, apagando os seus dados nas configurações do aplicativo ou escrevendo para o encarregado.',
      ],
    },
    {
      titulo: '4. Para que cada dado é usado',
      itens: [
        'Montar as suas metas diárias de proteína, água e movimento, a partir de altura, peso, meta e nível de atividade.',
        'Acompanhar a evolução do tratamento: curvas de peso e medidas, ciclo da dose, adesão às aplicações e padrões nos seus sintomas.',
        'Organizar o que você leva para a consulta, no resumo para o médico.',
        'Enviar os lembretes que você mesmo configurou.',
        'Ler a foto do prato, quando você usa essa função, para sugerir os itens da refeição.',
        'Cumprir obrigações legais e regulatórias que se apliquem a nós.',
      ],
      depois: [
        'Nada disso é diagnóstico. O aplicativo não prescreve, não ajusta dose e não substitui a avaliação de quem acompanha você.',
        'Os seus dados de saúde não são usados para publicidade, não são vendidos e não são cedidos a terceiros para fins comerciais.',
      ],
    },
    {
      titulo: '5. Onde os seus dados ficam',
      paragrafos: [
        'Os seus registros são gravados no armazenamento do aplicativo, no seu próprio aparelho. Não há conta nem senha: ninguém acessa os seus dados com um login, porque não existe login.',
        'Como não há cópia em servidor, desinstalar o aplicativo apaga os registros — e não é possível recuperá-los depois. Antes disso, você pode gerar um arquivo com tudo, em Configurações › Exportar seus dados.',
      ],
    },
    {
      titulo: '6. O que sai do seu aparelho, e quando',
      paragrafos: ['São duas situações, e as duas dependem de um toque seu.'],
      itens: [
        'O que você envia à sua equipe de saúde: o resumo para o médico e as mensagens que você escreve. Nada do seu diário é transmitido automaticamente.',
        'A foto do prato, quando você usa a leitura por foto: a imagem é reduzida no aparelho e enviada para ser interpretada. Ela não é armazenada — nem no registro da refeição, nem no serviço que faz a intermediação.',
      ],
    },
    {
      titulo: '7. Com quem compartilhamos',
      itens: [
        'A equipe de saúde que você vincular, e apenas o conteúdo que você enviar a ela.',
        'Operadores que processam dados por nossa conta e sob nossas instruções: o provedor de infraestrutura que hospeda a função de leitura de foto (servidores no Brasil) e o provedor do modelo que interpreta a imagem.',
        'Autoridades públicas, quando houver obrigação legal ou ordem judicial — e, nesse caso, apenas o estritamente exigido.',
      ],
    },
    {
      titulo: '8. Transferência internacional',
      paragrafos: [
        'A leitura da foto do prato é feita por um provedor de modelo de inteligência artificial sediado nos Estados Unidos, o que configura transferência internacional nos termos do art. 33 da LGPD. Ela acontece apenas quando você usa essa função, envolve apenas a imagem enviada, e a imagem não é armazenada por nós nem por ele para essa finalidade.',
        'Se você não quiser que isso aconteça, registre as refeições manualmente: o registro à mão não envia nada.',
      ],
    },
    {
      titulo: '9. Aplicativos de saúde do celular',
      paragrafos: [
        'Com a sua autorização, o Morphi lê pesagens registradas no Apple Saúde (iPhone) ou no Health Connect (Android) — que é por onde chegam os números da sua balança, do seu relógio ou de outro aplicativo. A leitura é apenas de peso, e o Morphi nunca escreve nada nesses aplicativos.',
        'A autorização é concedida e revogada nos ajustes do sistema operacional, a qualquer momento. Sem ela, o aplicativo continua funcionando: o peso passa a ser digitado por você.',
      ],
    },
    {
      titulo: '10. Por quanto tempo guardamos',
      paragrafos: [
        'Os seus registros ficam no seu aparelho enquanto você quiser. Você pode apagar cada registro individualmente, onde ele aparece, ou apagar tudo de uma vez em Configurações › Apagar meus dados — e o que sai dali não volta.',
        'O que você tiver enviado à sua equipe de saúde fica sob a guarda dela, que tem obrigações próprias de prontuário e de prazo. Para apagar o que já chegou lá, o pedido é feito a ela.',
      ],
    },
    {
      titulo: '11. Os seus direitos',
      paragrafos: ['O art. 18 da LGPD garante a você, sobre os seus dados:'],
      itens: [
        'Confirmar que há tratamento e acessar os dados — no próprio aplicativo, que mostra tudo que você registrou.',
        'Corrigir dados incompletos, inexatos ou desatualizados — todo registro é editável onde aparece.',
        'Levar os seus dados embora, em formato estruturado e legível por máquina — em Configurações › Exportar seus dados.',
        'Eliminar os dados tratados com o seu consentimento — em Configurações › Apagar meus dados.',
        'Saber com quem compartilhamos, o que está na seção 7.',
        'Revogar o consentimento, e ser informado das consequências de não o dar.',
        'Se opor a um tratamento feito sem consentimento e pedir revisão de decisão automatizada.',
      ],
    },
    {
      titulo: '12. Como exercer os seus direitos',
      paragrafos: [
        `Acesso, correção, portabilidade e eliminação estão dentro do aplicativo, e não dependem de pedido. Para qualquer outro direito, ou se preferir falar com uma pessoa, escreva para ${EMPRESA.encarregado || '[encarregado pendente]'}.`,
        'Respondemos em até 15 dias. Se um pedido não puder ser atendido, você recebe a justificativa — e pode reclamar à Autoridade Nacional de Proteção de Dados.',
      ],
    },
    {
      titulo: '13. Segurança',
      paragrafos: [
        'Os dados ficam na área privada do aplicativo, protegida pelo próprio sistema operacional do aparelho, e o tráfego da leitura de foto é criptografado.',
        'Nenhum sistema é inviolável, e não prometemos o contrário. O que podemos afirmar é o desenho: como não mantemos banco de dados com os seus registros, não existe um servidor nosso de onde eles possam vazar.',
        'A segurança do seu aparelho é parte disso. Manter bloqueio de tela e o sistema atualizado protege o que está guardado aqui.',
      ],
    },
    {
      titulo: '14. Menores de idade',
      paragrafos: [
        `O Morphi é para maiores de ${IDADE_MINIMA} anos. Não tratamos conscientemente dados de crianças e adolescentes; se identificarmos um cadastro nessa situação, ele é encerrado e os dados, eliminados.`,
      ],
    },
    {
      titulo: '15. Mudanças nesta política',
      paragrafos: [
        'Se mudarmos alguma coisa relevante — uma nova finalidade, um novo destinatário —, avisamos dentro do aplicativo antes de a mudança valer, e pedimos o seu aceite de novo quando for o caso.',
        'A data no alto desta página é a da última alteração.',
      ],
    },
  ],
});

/* ============================================================
   TERMOS DE USO
   ============================================================ */
export const TERMOS = (): Documento => ({
  id: 'termos',
  titulo: 'Termos de Uso',
  lead: `Atualizados em ${ATUALIZADO_EM}. Eles dizem o que o Morphi é, o que ele não é, e o que cada lado pode esperar do outro.`,
  secoes: [
    {
      titulo: '1. Quem oferece o Morphi',
      paragrafos: [
        `O Morphi é oferecido por ${QUEM()}. Ao usar o aplicativo, você concorda com estes Termos e com a Política de Privacidade.`,
      ],
    },
    {
      /* A SEÇÃO MAIS IMPORTANTE DOS TERMOS, e a que não pode ficar
         enterrada no meio. Um aplicativo que fala de dose e sintoma
         precisa dizer, cedo e sem rodeio, que não é quem decide. */
      titulo: '2. O que o Morphi é — e o que ele não é',
      paragrafos: [
        'O Morphi é uma ferramenta de registro e acompanhamento. Ele organiza o que você anota sobre o seu tratamento, mostra a sua evolução e ajuda a preparar o que levar para a consulta.',
      ],
      itens: [
        'Ele não é dispositivo médico e não realiza diagnóstico.',
        'Ele não prescreve medicamento, não indica dose e não ajusta tratamento.',
        'Ele não substitui consulta, exame, nem a orientação de quem acompanha você.',
        'Os textos de apoio e as leituras que ele apresenta são informação geral sobre padrões nos seus próprios registros, e não recomendação clínica.',
      ],
    },
    {
      titulo: '3. Em caso de emergência',
      paragrafos: [
        'O Morphi não é canal de urgência. Se alguma coisa no seu corpo pede atenção imediata, procure um serviço de emergência ou a sua equipe de saúde — não espere resposta pelo aplicativo.',
      ],
    },
    {
      titulo: '4. Quem pode usar',
      paragrafos: [
        `Você precisa ter ${IDADE_MINIMA} anos ou mais e capacidade civil para aceitar estes Termos. Ao se cadastrar, você declara que as informações que fornece são verdadeiras — elas alimentam todas as contas do aplicativo, e um dado errado produz um acompanhamento errado.`,
      ],
    },
    {
      titulo: '5. A sua conta e os seus dados',
      paragrafos: [
        'O Morphi funciona sem conta e sem senha: os seus registros ficam no seu aparelho. Isso quer dizer que a guarda deles é sua — desinstalar o aplicativo, perder ou trocar de telefone leva os registros junto, e não temos cópia para restaurar.',
        'A exportação está em Configurações, e serve para você manter o seu próprio backup.',
      ],
    },
    {
      titulo: '6. A relação com a sua equipe de saúde',
      paragrafos: [
        'Quando você se vincula a um profissional ou clínica, o Morphi funciona como canal entre vocês: ele transmite o que você escolhe enviar.',
        'O serviço de saúde é prestado por esse profissional, e não por nós. Conduta, prescrição, diagnóstico e acompanhamento são responsabilidade dele, nos termos da relação que vocês têm — inclusive o que ele faz com o que recebe.',
      ],
    },
    {
      titulo: '7. Assinatura e pagamento',
      paragrafos: [
        'O acesso ao Morphi é por assinatura, com o preço e a periodicidade informados no momento da contratação. A cobrança é feita pela loja de aplicativos do seu aparelho, que também administra a renovação.',
        'Quem chega por indicação de um profissional parceiro, com código de convite válido, tem o acesso isento enquanto o vínculo estiver ativo. Se o vínculo terminar, avisamos antes de qualquer cobrança começar.',
      ],
    },
    {
      titulo: '8. Cancelamento e arrependimento',
      paragrafos: [
        'Você pode cancelar a assinatura quando quiser, pela própria loja de aplicativos. O cancelamento interrompe a renovação seguinte; o período já pago segue valendo até o fim.',
        'Nos 7 dias seguintes à contratação, você pode desistir e receber de volta o que pagou, conforme o art. 49 do Código de Defesa do Consumidor. O pedido é feito pela loja ou pelo nosso contato.',
        'Cancelar a assinatura não apaga os seus registros: eles estão no seu aparelho. Para apagá-los, use Configurações › Apagar meus dados.',
      ],
    },
    {
      titulo: '9. Uso adequado',
      paragrafos: ['Ao usar o Morphi, você concorda em não:'],
      itens: [
        'Usar o aplicativo para finalidade ilícita ou para prejudicar terceiros.',
        'Tentar burlar, copiar, descompilar ou interferir no funcionamento do serviço.',
        'Registrar dados de outra pessoa sem que ela saiba e autorize.',
        'Apresentar o que o aplicativo mostra como diagnóstico, laudo ou prescrição.',
      ],
    },
    {
      titulo: '10. Propriedade intelectual',
      paragrafos: [
        'O nome, a marca, o desenho, os textos e o software do Morphi são nossos. Usar o aplicativo não transfere nenhum desses direitos.',
        'O que é seu continua seu: os registros que você faz pertencem a você, e nós não os usamos para outra finalidade além das descritas na Política de Privacidade.',
      ],
    },
    {
      titulo: '11. Disponibilidade',
      paragrafos: [
        'Trabalhamos para manter o aplicativo funcionando, mas não prometemos disponibilidade ininterrupta: pode haver manutenção, falha de rede, incompatibilidade com uma versão de sistema operacional ou interrupção de um serviço de terceiro.',
        'Funções que dependem de rede — como a leitura da foto do prato — não funcionam sem conexão. O registro manual funciona sempre.',
      ],
    },
    {
      titulo: '12. Responsabilidade',
      paragrafos: [
        'Respondemos pelos danos que causarmos, nos termos do Código de Defesa do Consumidor. O que não assumimos é a decisão clínica: o que você faz com a informação que o aplicativo organiza, e o que a sua equipe de saúde orienta, não estão sob o nosso controle.',
        'Também não respondemos pela perda de registros causada por remoção do aplicativo, perda do aparelho ou falha do sistema operacional — é por isso que a exportação existe e está a dois toques.',
      ],
    },
    {
      titulo: '13. Mudanças nestes Termos',
      paragrafos: [
        'Se mudarmos alguma coisa relevante, avisamos dentro do aplicativo antes de a mudança valer. Continuar usando depois disso significa concordar com a nova versão; se não concordar, você pode encerrar o uso e apagar os seus dados.',
      ],
    },
    {
      titulo: '14. Encerramento',
      paragrafos: [
        'Você pode parar de usar o Morphi quando quiser. Podemos encerrar o seu acesso em caso de descumprimento destes Termos ou de exigência legal — e, quando isso acontecer, você é avisado e continua podendo exportar o que registrou.',
      ],
    },
    {
      titulo: '15. Lei aplicável e foro',
      paragrafos: [
        'Estes Termos são regidos pela lei brasileira. Fica eleito o foro do seu domicílio para resolver qualquer questão, conforme o Código de Defesa do Consumidor.',
      ],
    },
    {
      titulo: '16. Contato',
      paragrafos: [
        `Para falar sobre estes Termos: ${EMPRESA.email || '[e-mail pendente]'}. Para assuntos de dados pessoais, o canal é o encarregado, indicado na Política de Privacidade.`,
      ],
    },
  ],
});

export const documentoDe = (id: string): Documento | null =>
  id === 'termos' ? TERMOS() : id === 'privacidade' ? PRIVACIDADE() : null;
