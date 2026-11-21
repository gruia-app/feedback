import type { PortalMessages } from "../types.js";

const messages: PortalMessages = {
  meta: {
    languageName: "Español",
    ogLocale: "es_ES",
    htmlLang: "es",
  },
  common: {
    siteName: "Roadmap y sugerencias de {appName}",
    nav: {
      home: "Inicio",
      roadmap: "Roadmap",
      suggestions: "Sugerencias",
      languageSwitcher: "Idioma",
      skipToContent: "Saltar al contenido",
      breadcrumb: "Ruta de navegación",
    },
    votes: { one: "{count} voto", other: "{count} votos" },
    lastUpdated: "Actualizado el {date}",
    loading: "Cargando",
    loadError: "No se pudo cargar la lista.",
    retry: "Reintentar",
  },
  status: {
    considering: {
      label: "En estudio",
      description: "El equipo está revisando la idea. Aún no hay decisión.",
    },
    planned: {
      label: "Planificado",
      description: "El equipo aceptó la idea. Espera su turno.",
    },
    inProgress: {
      label: "En desarrollo",
      description: "El equipo trabaja en ello ahora.",
    },
    shipped: {
      label: "Publicado",
      description: "Ya está disponible en la aplicación.",
    },
    declined: {
      label: "Descartado",
      description: "No se hará por ahora. Cada idea descartada indica el motivo.",
    },
  },
  roadmap: {
    seo: {
      title: "Roadmap de {appName}: mejoras y estado",
      description:
        "Consulta el roadmap de {appName}: qué mejoras del producto estudia, planifica, desarrolla o publica el equipo. Estados claros, sin fechas.",
      ogTitle: "Roadmap de {appName}",
      ogDescription:
        "Mira qué mejoras del producto revisa el equipo de {appName}, cuáles planifica, cuáles construye y cuáles ya publicó. Sin fechas, con estados.",
      ogImageAlt: "Roadmap de {appName} con las mejoras del producto por estado",
    },
    h1: "Roadmap de {appName}",
    intro:
      "Aquí ves qué mejoras del producto tiene el equipo en cuenta. Cada una muestra su estado y la fecha de su última actualización. No publicamos fechas de entrega.",
    sections: [
      {
        heading: "Cómo leer el roadmap",
        body: "El roadmap muestra el estado de cada mejora. No es un calendario. Cada elemento indica en qué punto está y cuándo cambió por última vez.",
        subsections: [
          {
            heading: "Estados, no fechas",
            body: "Un estado dice si el equipo estudia, planifica, construye o ya publicó una mejora. No promete un día de entrega. Un estado cambia cuando cambia el trabajo.",
          },
          {
            heading: "Qué entra en el roadmap",
            body: "Entran las sugerencias que el equipo revisa desde el backlog del producto. Una sugerencia nunca crea una Feature de forma automática. Primero la revisa una persona del equipo.",
          },
        ],
      },
      {
        heading: "Cómo priorizamos",
        body: "El equipo pesa varias señales a la vez. Ninguna decide por sí sola. Así evitamos que una idea ruidosa pase por delante de otra más útil.",
        subsections: [
          {
            heading: "Señales que pesamos",
            body: "Miramos con qué frecuencia aparece un problema, cuánto esfuerzo cuesta resolverlo y si encaja con el producto. Los votos son una señal más.",
          },
          {
            heading: "Por qué los votos no deciden solos",
            body: "Un voto indica interés, pero no mide el impacto ni el coste. Una idea con pocos votos puede resolver un problema grave. Por eso los votos nunca deciden solos.",
          },
        ],
      },
      {
        heading: "Del roadmap a tu pantalla",
        body: "Una mejora recorre varios estados hasta llegar a la aplicación. Esta página refleja ese recorrido. No hace falta que preguntes: puedes comprobarlo aquí.",
        subsections: [
          {
            heading: "Cuándo cambia un estado",
            body: "Un estado cambia cuando cambia el trabajo. Por ejemplo, cuando el equipo acepta una idea o empieza a construirla. No hay un calendario fijo de revisiones.",
          },
          {
            heading: "Cómo seguir un elemento",
            body: "Vuelve a esta página y busca el elemento. Cada uno muestra su estado y la fecha de su última actualización. Ahí ves si algo avanzó.",
          },
        ],
      },
    ],
    statusTable: {
      caption: "Estados del roadmap, su significado y qué puedes hacer",
      headers: ["Estado", "Qué significa", "Qué puedes hacer"],
      rows: [
        [
          "En estudio",
          "El equipo revisa la idea.",
          "Añade contexto en una sugerencia nueva o vota si ya existe.",
        ],
        [
          "Planificado",
          "El equipo aceptó la idea y espera su turno.",
          "Sigue el estado en esta página.",
        ],
        [
          "En desarrollo",
          "El equipo la construye ahora.",
          "Sigue el estado en esta página.",
        ],
        [
          "Publicado",
          "Ya está disponible en la aplicación.",
          "Pruébala y cuéntanos qué mejorarías.",
        ],
        [
          "Descartado",
          "No se hará por ahora. Se indica el motivo.",
          "Lee el motivo. Si cambia el contexto, envía una sugerencia nueva.",
        ],
      ],
    },
    faq: [
      {
        question: "¿Hay fechas de entrega?",
        answer:
          "No. El roadmap muestra estados, no fechas. Un estado dice en qué punto está una mejora, pero no cuándo llegará. Cada elemento muestra la fecha de su última actualización, para que sepas si ha habido novedades desde tu última visita.",
      },
      {
        question: "¿Cómo propongo algo nuevo?",
        answer:
          "Abre el botón Reportar dentro de la aplicación que usas. Elige Sugerencia, escribe un título breve y describe el problema. Con poco texto basta. La sugerencia va al backlog del producto. El equipo la revisa antes de decidir si entra en el roadmap.",
      },
      {
        question: "¿Sirve de algo votar?",
        answer:
          "Sí, pero los votos no deciden solos. Son una señal entre otras: la frecuencia del problema, el esfuerzo y el encaje con el producto. Un voto ayuda al equipo a ver cuánto interés hay. Después el equipo pesa el conjunto de señales.",
      },
      {
        question: "¿Por qué se descartó una idea?",
        answer:
          "Una idea descartada no se hará por ahora. Cada una indica su motivo en esta página. Por ejemplo, puede no encajar con el producto o costar demasiado esfuerzo. Si el contexto cambia, puedes enviar una sugerencia nueva con la información actualizada.",
      },
      {
        question: "¿Los bugs aparecen en el roadmap?",
        answer:
          "No. Los bugs van al seguimiento de errores del equipo. El roadmap muestra mejoras del producto. Si encuentras un fallo, abre el botón Reportar y elige Bug. Indica también la gravedad, de baja a crítica, para que el equipo sepa qué atender antes.",
      },
      {
        question: "¿Cada cuánto se actualiza?",
        answer:
          "No hay una frecuencia fija. Un estado cambia cuando cambia el trabajo, no según un calendario. Cada elemento muestra la fecha de su última actualización. Mira esa fecha para saber si hay novedades. Si no cambia, es que el trabajo no ha cambiado.",
      },
    ],
    cta: {
      heading: "¿Echas algo en falta?",
      body: "Cuéntanos qué mejorarías. Es un minuto y no necesitas explicarlo todo.",
      primaryLabel: "Enviar una sugerencia",
      secondaryLabel: "Ver sugerencias",
    },
    emptyState: "Todavía no hay elementos en el roadmap.",
    columnEmpty: "No hay elementos con este estado.",
  },
  suggestions: {
    seo: {
      title: "Sugerencias de {appName}: envía tu feedback",
      description:
        "Envía una sugerencia para {appName}: pasos, ejemplos y diferencias con un bug. Qué datos se adjuntan y cómo los protegemos. Sin cuenta aparte.",
      ogTitle: "Sugerencias para {appName}",
      ogDescription:
        "Aprende a enviar una sugerencia de producto a {appName} desde la propia aplicación. Qué escribir, qué datos se adjuntan y cómo se protegen.",
      ogImageAlt: "Guía para enviar sugerencias y feedback a {appName}",
    },
    h1: "Sugerencias para {appName}",
    intro:
      "Una sugerencia es una idea para mejorar el producto. La envías desde la propia aplicación y llega al backlog del producto. El equipo la revisa antes de decidir nada.",
    guide: {
      heading: "Cómo enviar una sugerencia",
      intro: "Son cinco pasos y se hacen dentro de la aplicación que usas.",
      steps: [
        {
          title: "Abre el botón Reportar",
          body: "Busca el botón Reportar en la aplicación. Púlsalo para abrir el diálogo.",
        },
        {
          title: "Elige Sugerencia",
          body: "En el diálogo, elige el tipo Sugerencia. El otro tipo es Bug.",
        },
        {
          title: "Escribe un título breve y concreto",
          body: "Resume la idea en una frase. Un buen título dice qué quieres cambiar y dónde.",
        },
        {
          title: "Describe el problema, el contexto y el resultado esperado",
          body: "Explica qué problema tienes y en qué situación aparece. Añade qué esperarías que pasara. La descripción es opcional, pero ayuda mucho.",
        },
        {
          title: "Adjunta una captura si ayuda y envía",
          body: "Una captura de pantalla es opcional. Si la adjuntas, pulsa Enviar. La sugerencia va al backlog del producto.",
        },
      ],
    },
    comparisonTable: {
      caption: "Diferencias entre un bug y una sugerencia",
      headers: ["Criterio", "Bug", "Sugerencia"],
      rows: [
        [
          "Cuándo usarlo",
          "Algo no funciona como debería.",
          "Quieres que el producto haga algo mejor o distinto.",
        ],
        [
          "Ejemplo",
          "El botón de guardar no responde.",
          "Querría poder filtrar la lista por fecha.",
        ],
        [
          "Gravedad",
          "Se elige de baja a crítica.",
          "No aplica.",
        ],
        [
          "Captura de pantalla",
          "Recomendada.",
          "Opcional.",
        ],
        [
          "Destino",
          "Seguimiento de errores. Puede crear una feature vinculada.",
          "Backlog del producto. Nunca crea una Feature de forma automática.",
        ],
        [
          "Qué ocurre después",
          "El equipo reproduce el fallo y lo corrige.",
          "El equipo la revisa y puede pasarla al roadmap como En estudio.",
        ],
      ],
    },
    sections: [
      {
        heading: "Cómo escribir una buena sugerencia",
        body: "Una buena sugerencia es fácil de entender sin preguntar nada más. Cuenta qué te pasa y qué esperas. El equipo decide la solución con más información.",
        subsections: [
          {
            heading: "Describe el problema, no solo la solución",
            body: "Di qué intentabas hacer y qué te lo impidió. Con el problema claro, el equipo puede encontrar una solución mejor que la que imaginaste.",
          },
          {
            heading: "Una idea por sugerencia",
            body: "Envía cada idea por separado. Así el equipo puede revisarla, votarla y darle un estado propio. Una sugerencia con varias ideas se queda a medias.",
          },
        ],
      },
      {
        heading: "Privacidad y datos del reporte",
        body: "Cada reporte lleva contexto técnico para que el equipo lo entienda. También lleva protecciones para que no salgan datos sensibles. Aquí tienes qué se adjunta y qué se protege.",
        subsections: [
          {
            heading: "Qué se adjunta",
            body: "Cada reporte incluye la URL y la ruta de la página, el navegador, el tamaño de la ventana y de la pantalla, el idioma y la zona horaria. Incluye también los últimos 10 errores, las últimas 10 peticiones de red fallidas y los últimos 30 clics. Cada reporte recibe un identificador de traza (W3C traceparent) para enlazarlo con las trazas técnicas.",
          },
          {
            heading: "Qué se protege",
            body: "La captura excluye los campos de contraseña, los campos ocultos y las zonas que la aplicación marca como sensibles o ignoradas. Los valores que parecen secretos, como tokens, claves y cabeceras Authorization, se ocultan en los mensajes y en las URL antes del envío. El servidor de la aplicación, no el navegador, fija a qué aplicación, entorno y servicio pertenece el reporte, y descarta los campos de identidad que envía el cliente. El secreto del webhook nunca llega al navegador: el servidor firma cada reporte (HMAC) antes de reenviarlo.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "¿Adónde va mi sugerencia?",
        answer:
          "Va al backlog del producto. Allí la revisa el equipo. Una sugerencia nunca crea una Feature de forma automática. Si el equipo la acepta, puede pasar al roadmap con el estado En estudio y después seguir su camino. Tú puedes seguir ese estado en la página del roadmap.",
      },
      {
        question: "¿Necesito una cuenta?",
        answer:
          "El envío pasa por la aplicación que usas y sigue las reglas de sesión de esa aplicación. Este portal no pide una cuenta aparte. Si la aplicación te deja usar el botón Reportar, puedes enviar la sugerencia desde ahí. Si tienes dudas, consulta las reglas de esa aplicación.",
      },
      {
        question: "¿Puedo adjuntar una captura y qué muestra?",
        answer:
          "Sí, la captura es opcional. Muestra lo que ves en la página, pero excluye los campos de contraseña, los campos ocultos y las zonas que la aplicación marca como sensibles o ignoradas. Puedes volver a capturarla o quitarla antes de enviar. En un bug, la captura es recomendable.",
      },
      {
        question: "¿Qué diferencia hay entre un bug y una sugerencia?",
        answer:
          "Un bug es algo que no funciona como debería. Una sugerencia es una idea para mejorar el producto. Un bug lleva una gravedad, de baja a crítica, y va al seguimiento de errores. Una sugerencia va al backlog del producto y el equipo la revisa antes de decidir.",
      },
      {
        question: "¿Recibiré una respuesta?",
        answer:
          "No prometemos una respuesta individual. Lo que sí puedes hacer es seguir el estado de las mejoras en el roadmap. Cada elemento muestra su estado y la fecha de su última actualización. Si el equipo acepta tu idea, la verás allí. Si la descarta, verás el motivo.",
      },
      {
        question: "¿Se envían datos sensibles?",
        answer:
          "El reporte lleva contexto técnico, pero con protecciones. Los valores que parecen secretos se ocultan antes del envío. La captura excluye los campos de contraseña y los ocultos. Aun así, no escribas contraseñas ni datos personales en el título o en la descripción. El secreto del webhook nunca llega al navegador.",
      },
    ],
    cta: {
      heading: "¿Tienes una idea?",
      body: "Cuéntanosla desde la aplicación. Un título y dos líneas bastan para empezar.",
      primaryLabel: "Enviar una sugerencia",
      secondaryLabel: "Ver el roadmap",
    },
    list: {
      sortTop: "Más votadas",
      sortNew: "Más recientes",
      filterAll: "Todas",
      filterByStatus: "Filtrar por estado",
      searchPlaceholder: "Buscar sugerencias",
      emptyState: "No hay sugerencias que coincidan.",
      vote: "Votar",
      voted: "Votado",
    },
  },
  reporter: {
    trigger: "Reportar",
    dialogTitleBug: "Reportar un bug",
    dialogTitleSuggestion: "Sugerir una mejora",
    typeBug: "Bug",
    typeSuggestion: "Sugerencia",
    title: "Título",
    titlePlaceholderSuggestion: "¿Qué debería hacer mejor esta aplicación?",
    description: "Descripción",
    severity: "Gravedad",
    severityLow: "Baja",
    severityMedium: "Media",
    severityHigh: "Alta",
    severityCritical: "Crítica",
    screenshot: "Captura de pantalla",
    capture: "Capturar",
    recapture: "Capturar de nuevo",
    remove: "Quitar",
    cancel: "Cancelar",
    send: "Enviar",
    sending: "Enviando",
    attached: "Captura adjunta",
    captureFailed: "No se pudo hacer la captura",
    bugSent: "Bug enviado",
    suggestionSent: "Sugerencia enviada al backlog del producto",
    sendFailed: "No se pudo enviar el reporte",
    bugAndFeatureCreated: "Bug y feature creados",
    close: "Cerrar",
  },
};

export default messages;
