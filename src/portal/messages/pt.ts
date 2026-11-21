import type { PortalMessages } from "../types.js";

const messages: PortalMessages = {
  meta: {
    languageName: "Português",
    ogLocale: "pt_BR",
    htmlLang: "pt",
  },
  common: {
    siteName: "Roadmap e sugestões do {appName}",
    nav: {
      home: "Início",
      roadmap: "Roadmap",
      suggestions: "Sugestões",
      languageSwitcher: "Idioma",
      skipToContent: "Pular para o conteúdo",
      breadcrumb: "Caminho de navegação",
    },
    votes: { one: "{count} voto", other: "{count} votos" },
    lastUpdated: "Atualizado em {date}",
    loading: "Carregando",
    loadError: "Não foi possível carregar a lista.",
    retry: "Tentar de novo",
  },
  status: {
    considering: {
      label: "Em análise",
      description: "A equipe está revisando a ideia. Ainda não há decisão.",
    },
    planned: {
      label: "Planejado",
      description: "A equipe aceitou a ideia. Ela espera a sua vez.",
    },
    inProgress: {
      label: "Em desenvolvimento",
      description: "A equipe trabalha nisso agora.",
    },
    shipped: {
      label: "Publicado",
      description: "Já está disponível no aplicativo.",
    },
    declined: {
      label: "Descartado",
      description: "Não será feito por enquanto. Cada ideia descartada informa o motivo.",
    },
  },
  roadmap: {
    seo: {
      title: "Roadmap do {appName}: melhorias e status",
      description:
        "Veja o roadmap do {appName}: quais melhorias do produto a equipe analisa, planeja, desenvolve ou publica. Status claros, sem datas de entrega.",
      ogTitle: "Roadmap do {appName}",
      ogDescription:
        "Veja quais melhorias do produto a equipe do {appName} analisa, planeja, desenvolve e já publicou. Sem datas de entrega, só o status de cada item.",
      ogImageAlt: "Roadmap do {appName} com as melhorias do produto por status",
    },
    h1: "Roadmap do {appName}",
    intro:
      "Aqui você vê quais melhorias do produto a equipe tem em vista. Cada uma mostra o seu status e a data da última atualização. Não publicamos datas de entrega.",
    sections: [
      {
        heading: "Como ler o roadmap",
        body: "O roadmap mostra o status de cada melhoria. Ele não é um calendário. Cada item indica em que ponto está e quando mudou pela última vez.",
        subsections: [
          {
            heading: "Status, não datas",
            body: "Um status diz se a equipe analisa, planeja, constrói ou já publicou uma melhoria. Ele não promete um dia de entrega. O status muda quando o trabalho muda.",
          },
          {
            heading: "O que entra no roadmap",
            body: "Entram as sugestões que a equipe revisa a partir do backlog do produto. Uma sugestão nunca cria uma Feature automaticamente. Primeiro, uma pessoa da equipe a revisa.",
          },
        ],
      },
      {
        heading: "Como priorizamos",
        body: "A equipe pesa vários sinais ao mesmo tempo. Nenhum deles decide sozinho. Assim, uma ideia barulhenta não passa na frente de outra mais útil.",
        subsections: [
          {
            heading: "Sinais que pesamos",
            body: "Olhamos com que frequência um problema aparece, quanto esforço custa resolvê-lo e se ele combina com o produto. Os votos são mais um sinal.",
          },
          {
            heading: "Por que os votos não decidem sozinhos",
            body: "Um voto indica interesse, mas não mede impacto nem custo. Uma ideia com poucos votos pode resolver um problema grave. Por isso, os votos nunca decidem sozinhos.",
          },
        ],
      },
      {
        heading: "Do roadmap até a sua tela",
        body: "Uma melhoria passa por vários status até chegar ao aplicativo. Esta página mostra esse caminho. Você não precisa perguntar: pode conferir aqui.",
        subsections: [
          {
            heading: "Quando um status muda",
            body: "Um status muda quando o trabalho muda. Por exemplo, quando a equipe aceita uma ideia ou começa a construí-la. Não existe um calendário fixo de revisões.",
          },
          {
            heading: "Como acompanhar um item",
            body: "Volte a esta página e procure o item. Cada um mostra o seu status e a data da última atualização. Assim você vê se algo avançou.",
          },
        ],
      },
    ],
    statusTable: {
      caption: "Status do roadmap, o que significam e o que você pode fazer",
      headers: ["Status", "O que significa", "O que você pode fazer"],
      rows: [
        [
          "Em análise",
          "A equipe está revisando a ideia.",
          "Acrescente contexto em uma nova sugestão ou vote, se ela já existir.",
        ],
        [
          "Planejado",
          "A equipe aceitou a ideia e ela espera a sua vez.",
          "Acompanhe o status nesta página.",
        ],
        [
          "Em desenvolvimento",
          "A equipe está construindo agora.",
          "Acompanhe o status nesta página.",
        ],
        [
          "Publicado",
          "Já está disponível no aplicativo.",
          "Experimente e conte o que você melhoraria.",
        ],
        [
          "Descartado",
          "Não será feito por enquanto. O motivo é informado.",
          "Leia o motivo. Se o contexto mudar, envie uma nova sugestão.",
        ],
      ],
    },
    faq: [
      {
        question: "Existem datas de entrega?",
        answer:
          "Não. O roadmap mostra status, não datas. Um status diz em que ponto está uma melhoria, mas não quando ela chega. Cada item mostra a data da última atualização, para você saber se houve novidades desde a sua última visita.",
      },
      {
        question: "Como proponho algo novo?",
        answer:
          "Abra o botão Reportar dentro do aplicativo que você usa. Escolha Sugestão, escreva um título curto e descreva o problema. Com pouco texto já basta. A sugestão vai para o backlog do produto. A equipe a revisa antes de decidir se ela entra no roadmap.",
      },
      {
        question: "Votar ajuda?",
        answer:
          "Ajuda, mas os votos não decidem sozinhos. Eles são um sinal entre outros: a frequência do problema, o esforço e o encaixe com o produto. Um voto mostra à equipe quanto interesse existe. Depois, a equipe pesa o conjunto de sinais.",
      },
      {
        question: "Por que uma ideia foi descartada?",
        answer:
          "Uma ideia descartada não será feita por enquanto. Cada uma informa o motivo nesta página. Por exemplo, ela pode não combinar com o produto ou custar esforço demais. Se o contexto mudar, você pode enviar uma nova sugestão com a informação atualizada.",
      },
      {
        question: "Os bugs aparecem no roadmap?",
        answer:
          "Não. Os bugs vão para o acompanhamento de erros da equipe. O roadmap mostra melhorias do produto. Se você encontrar uma falha, abra o botão Reportar e escolha Bug. Informe também a gravidade, de baixa a crítica, para a equipe saber o que atender primeiro.",
      },
      {
        question: "Com que frequência a página é atualizada?",
        answer:
          "Não há uma frequência fixa. Um status muda quando o trabalho muda, não segundo um calendário. Cada item mostra a data da última atualização. Olhe essa data para saber se há novidades. Se ela não mudou, o trabalho também não mudou.",
      },
    ],
    cta: {
      heading: "Sentiu falta de algo?",
      body: "Conte o que você melhoraria. Leva um minuto e você não precisa explicar tudo.",
      primaryLabel: "Enviar uma sugestão",
      secondaryLabel: "Ver sugestões",
    },
    emptyState: "Ainda não há itens no roadmap.",
    columnEmpty: "Não há itens com este status.",
  },
  suggestions: {
    seo: {
      title: "Sugestões para o {appName}: envie seu feedback",
      description:
        "Envie uma sugestão para o {appName}: passos, exemplos e a diferença para um bug. Veja quais dados seguem junto e como os protegemos.",
      ogTitle: "Sugestões para o {appName}",
      ogDescription:
        "Aprenda a enviar uma sugestão de produto ao {appName} pelo próprio aplicativo. O que escrever, quais dados seguem junto e como eles são protegidos.",
      ogImageAlt: "Guia para enviar sugestões e feedback ao {appName}",
    },
    h1: "Sugestões para o {appName}",
    intro:
      "Uma sugestão é uma ideia para melhorar o produto. Você a envia pelo próprio aplicativo e ela chega ao backlog do produto. A equipe a revisa antes de decidir qualquer coisa.",
    guide: {
      heading: "Como enviar uma sugestão",
      intro: "São cinco passos, todos feitos dentro do aplicativo que você usa.",
      steps: [
        {
          title: "Abra o botão Reportar",
          body: "Procure o botão Reportar no aplicativo. Clique nele para abrir a janela.",
        },
        {
          title: "Escolha Sugestão",
          body: "Na janela, escolha o tipo Sugestão. O outro tipo é Bug.",
        },
        {
          title: "Escreva um título curto e concreto",
          body: "Resuma a ideia em uma frase. Um bom título diz o que você quer mudar e onde.",
        },
        {
          title: "Descreva o problema, o contexto e o resultado esperado",
          body: "Explique qual problema você tem e em que situação ele aparece. Diga o que você esperaria que acontecesse. A descrição é opcional, mas ajuda muito.",
        },
        {
          title: "Anexe uma captura se ajudar e envie",
          body: "A captura de tela é opcional. Se você a anexar, clique em Enviar. A sugestão vai para o backlog do produto.",
        },
      ],
    },
    comparisonTable: {
      caption: "Diferenças entre um bug e uma sugestão",
      headers: ["Critério", "Bug", "Sugestão"],
      rows: [
        [
          "Quando usar",
          "Algo não funciona como deveria.",
          "Você quer que o produto faça algo melhor ou diferente.",
        ],
        [
          "Exemplo",
          "O botão de salvar não responde.",
          "Eu gostaria de filtrar a lista por data.",
        ],
        [
          "Gravidade",
          "Você escolhe de baixa a crítica.",
          "Não se aplica.",
        ],
        [
          "Captura de tela",
          "Recomendada.",
          "Opcional.",
        ],
        [
          "Destino",
          "Acompanhamento de erros. Pode criar uma feature vinculada.",
          "Backlog do produto. Nunca cria uma Feature automaticamente.",
        ],
        [
          "O que acontece depois",
          "A equipe reproduz a falha e a corrige.",
          "A equipe a revisa e pode levá-la ao roadmap como Em análise.",
        ],
      ],
    },
    sections: [
      {
        heading: "Como escrever uma boa sugestão",
        body: "Uma boa sugestão é fácil de entender sem perguntas extras. Conte o que acontece com você e o que você espera. A equipe escolhe a solução com mais informação.",
        subsections: [
          {
            heading: "Descreva o problema, não só a solução",
            body: "Diga o que você tentava fazer e o que o impediu. Com o problema claro, a equipe pode achar uma solução melhor que a que você imaginou.",
          },
          {
            heading: "Uma ideia por sugestão",
            body: "Envie cada ideia separadamente. Assim a equipe pode revisá-la, votá-la e dar a ela um status próprio. Uma sugestão com várias ideias fica pela metade.",
          },
        ],
      },
      {
        heading: "Privacidade e dados do reporte",
        body: "Cada reporte leva contexto técnico para a equipe entendê-lo. Ele também leva proteções para que dados sensíveis não saiam. Aqui você vê o que segue junto e o que é protegido.",
        subsections: [
          {
            heading: "O que é anexado",
            body: "Cada reporte inclui a URL e a rota da página, o navegador, o tamanho da janela e da tela, o idioma e o fuso horário. Inclui também os últimos 10 erros, as últimas 10 requisições de rede que falharam e os últimos 30 cliques. Cada reporte recebe um identificador de rastreio (W3C traceparent) para ser ligado aos rastros técnicos.",
          },
          {
            heading: "O que é protegido",
            body: "A captura exclui campos de senha, campos ocultos e áreas que o aplicativo marca como sensíveis ou ignoradas. Valores que parecem segredos, como tokens, chaves e cabeçalhos Authorization, são ocultados nas mensagens e nas URLs antes do envio. O servidor do aplicativo, e não o navegador, define a qual aplicativo, ambiente e serviço o reporte pertence, e descarta os campos de identidade enviados pelo cliente. O segredo do webhook nunca chega ao navegador: o servidor assina cada reporte (HMAC) antes de encaminhá-lo.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Para onde vai a minha sugestão?",
        answer:
          "Ela vai para o backlog do produto. Lá, a equipe a revisa. Uma sugestão nunca cria uma Feature automaticamente. Se a equipe a aceitar, ela pode entrar no roadmap com o status Em análise e seguir o seu caminho. Você acompanha esse status na página do roadmap.",
      },
      {
        question: "Preciso de uma conta?",
        answer:
          "O envio passa pelo aplicativo que você usa e segue as regras de sessão desse aplicativo. Este portal não pede uma conta à parte. Se o aplicativo deixa você usar o botão Reportar, você pode enviar a sugestão por ali. Em caso de dúvida, consulte as regras desse aplicativo.",
      },
      {
        question: "Posso anexar uma captura e o que ela mostra?",
        answer:
          "Pode, a captura é opcional. Ela mostra o que você vê na página, mas exclui campos de senha, campos ocultos e áreas que o aplicativo marca como sensíveis ou ignoradas. Você pode capturar de novo ou remover a imagem antes de enviar. Em um bug, a captura é recomendada.",
      },
      {
        question: "Qual é a diferença entre um bug e uma sugestão?",
        answer:
          "Um bug é algo que não funciona como deveria. Uma sugestão é uma ideia para melhorar o produto. Um bug leva uma gravidade, de baixa a crítica, e vai para o acompanhamento de erros. Uma sugestão vai para o backlog do produto, e a equipe a revisa antes de decidir.",
      },
      {
        question: "Vou receber uma resposta?",
        answer:
          "Não prometemos uma resposta individual. O que você pode fazer é acompanhar o status das melhorias no roadmap. Cada item mostra o seu status e a data da última atualização. Se a equipe aceitar a sua ideia, você a verá lá. Se a descartar, verá o motivo.",
      },
      {
        question: "Dados sensíveis são enviados?",
        answer:
          "O reporte leva contexto técnico, mas com proteções. Valores que parecem segredos são ocultados antes do envio. A captura exclui campos de senha e campos ocultos. Mesmo assim, não escreva senhas nem dados pessoais no título ou na descrição. O segredo do webhook nunca chega ao navegador.",
      },
    ],
    cta: {
      heading: "Tem uma ideia?",
      body: "Conte pelo aplicativo. Um título e duas linhas bastam para começar.",
      primaryLabel: "Enviar uma sugestão",
      secondaryLabel: "Ver o roadmap",
    },
    list: {
      sortTop: "Mais votadas",
      sortNew: "Mais recentes",
      filterAll: "Todas",
      filterByStatus: "Filtrar por status",
      searchPlaceholder: "Buscar sugestões",
      emptyState: "Nenhuma sugestão encontrada.",
      vote: "Votar",
      voted: "Votado",
    },
  },
  reporter: {
    trigger: "Reportar",
    dialogTitleBug: "Reportar um bug",
    dialogTitleSuggestion: "Sugerir uma melhoria",
    typeBug: "Bug",
    typeSuggestion: "Sugestão",
    title: "Título",
    titlePlaceholderSuggestion: "O que este aplicativo deveria fazer melhor?",
    description: "Descrição",
    severity: "Gravidade",
    severityLow: "Baixa",
    severityMedium: "Média",
    severityHigh: "Alta",
    severityCritical: "Crítica",
    screenshot: "Captura de tela",
    capture: "Capturar",
    recapture: "Capturar de novo",
    remove: "Remover",
    cancel: "Cancelar",
    send: "Enviar",
    sending: "Enviando",
    attached: "Captura anexada",
    captureFailed: "Não foi possível fazer a captura",
    bugSent: "Bug enviado",
    suggestionSent: "Sugestão enviada ao backlog do produto",
    sendFailed: "Não foi possível enviar o reporte",
    bugAndFeatureCreated: "Bug e feature criados",
    close: "Fechar",
  },
};

export default messages;
