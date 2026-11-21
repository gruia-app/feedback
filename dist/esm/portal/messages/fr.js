const messages = {
    meta: {
        languageName: "Français",
        ogLocale: "fr_FR",
        htmlLang: "fr",
    },
    common: {
        siteName: "Roadmap et suggestions de {appName}",
        nav: {
            home: "Accueil",
            roadmap: "Roadmap",
            suggestions: "Suggestions",
            languageSwitcher: "Langue",
            skipToContent: "Aller au contenu",
            breadcrumb: "Fil d’Ariane",
        },
        votes: {
            one: "{count} vote",
            other: "{count} votes",
        },
        lastUpdated: "Mis à jour le {date}",
        loading: "Chargement en cours",
        loadError: "Le chargement a échoué. Réessayez dans un instant.",
        retry: "Réessayer",
    },
    status: {
        considering: {
            label: "À l’étude",
            description: "L’équipe examine cette idée et n’a pas encore décidé.",
        },
        planned: {
            label: "Planifié",
            description: "L’équipe a accepté cette idée. Elle attend son tour.",
        },
        inProgress: {
            label: "En cours",
            description: "L’équipe développe cette amélioration en ce moment.",
        },
        shipped: {
            label: "Livré",
            description: "Cette amélioration est disponible dans l’application.",
        },
        declined: {
            label: "Refusé",
            description: "L’équipe ne le fera pas pour le moment. Elle en donne la raison.",
        },
    },
    roadmap: {
        seo: {
            title: "Roadmap {appName} : évolutions du produit",
            description: "Consultez la roadmap de {appName} : les évolutions du produit à l’étude, planifiées, en cours ou livrées, avec leur statut et leur dernière mise à jour.",
            ogTitle: "Roadmap de {appName} : statuts des évolutions du produit",
            ogDescription: "Suivez les évolutions de {appName} par statut : à l’étude, planifié, en cours, livré ou refusé. Chaque élément affiche sa date de dernière mise à jour.",
            ogImageAlt: "Aperçu de la roadmap de {appName} avec les évolutions classées par statut",
        },
        h1: "Roadmap de {appName}",
        intro: "Cette page montre où en sont les évolutions du produit. Chaque élément affiche son statut et sa dernière mise à jour. Les suggestions de la communauté y arrivent après examen par l’équipe.",
        sections: [
            {
                heading: "Comment lire la roadmap",
                body: "La roadmap classe les évolutions du produit par statut. Elle ne promet aucune date. Elle montre ce que l’équipe examine, prévoit, construit ou a déjà livré.",
                subsections: [
                    {
                        heading: "Des statuts, pas des dates",
                        body: "Un statut décrit l’état du travail. Il ne donne pas de date de livraison. Quand le travail change, le statut change.",
                    },
                    {
                        heading: "Ce qui entre dans la roadmap",
                        body: "La roadmap contient des suggestions déjà examinées dans le backlog produit. Une suggestion n’y entre pas automatiquement. L’équipe la lit d’abord, puis elle décide.",
                    },
                ],
            },
            {
                heading: "Comment nous fixons les priorités",
                body: "L’équipe ne classe pas les idées sur un seul critère. Elle compare plusieurs signaux avant de choisir. Les votes en font partie, mais ils ne suffisent pas.",
                subsections: [
                    {
                        heading: "Les signaux que nous pesons",
                        body: "L’équipe regarde la fréquence du problème, l’effort nécessaire et l’adéquation avec le produit. Elle regarde aussi le nombre de votes. Chaque signal compte, aucun ne décide seul.",
                    },
                    {
                        heading: "Pourquoi les votes ne décident pas seuls",
                        body: "Un vote montre un intérêt, pas un besoin. Une idée très votée peut coûter cher ou s’écarter du produit. Une idée peu votée peut corriger un vrai problème.",
                    },
                ],
            },
            {
                heading: "De la roadmap à votre écran",
                body: "Un élément de la roadmap change de statut au fil du travail. Vous pouvez suivre chaque évolution sur cette page. Quand un élément est livré, il est disponible dans l’application.",
                subsections: [
                    {
                        heading: "Quand un statut change",
                        body: "Un statut change quand le travail change. Il n’y a pas de calendrier fixe. La date de mise à jour de l’élément indique le dernier changement.",
                    },
                    {
                        heading: "Comment suivre un élément",
                        body: "Revenez sur cette page pour vérifier un élément. Il affiche son statut et sa date de dernière mise à jour. Vous voyez ainsi si le travail avance.",
                    },
                ],
            },
        ],
        statusTable: {
            caption: "Statuts de la roadmap, leur sens et ce que vous pouvez faire",
            headers: ["Statut", "Ce que cela signifie", "Ce que vous pouvez faire"],
            rows: [
                [
                    "À l’étude",
                    "L’équipe examine l’idée et n’a pas encore décidé.",
                    "Voter, ou compléter la suggestion avec votre contexte.",
                ],
                [
                    "Planifié",
                    "L’équipe a accepté l’idée. Elle attend son tour.",
                    "Suivre l’élément sur cette page.",
                ],
                [
                    "En cours",
                    "L’équipe développe l’amélioration en ce moment.",
                    "Suivre l’élément. Il sera bientôt disponible.",
                ],
                [
                    "Livré",
                    "L’amélioration est disponible dans l’application.",
                    "L’essayer, puis envoyer une nouvelle suggestion si besoin.",
                ],
                [
                    "Refusé",
                    "L’équipe ne le fera pas pour le moment, et elle en donne la raison.",
                    "Lire la raison. Vous pouvez proposer une idée voisine.",
                ],
            ],
        },
        faq: [
            {
                question: "Y a-t-il des dates de livraison ?",
                answer: "Non. La roadmap affiche des statuts, pas des dates de livraison. Un statut décrit l’état du travail à un moment donné. Chaque élément montre sa date de dernière mise à jour, afin que vous voyiez quand il a changé.",
            },
            {
                question: "Comment proposer une nouveauté ?",
                answer: "Ouvrez le bouton « Signaler » dans l’application et choisissez « Suggestion ». Écrivez un titre court et décrivez le problème, le contexte et le résultat attendu. La suggestion arrive dans le backlog produit, où l’équipe l’examine.",
            },
            {
                question: "Voter sert-il à quelque chose ?",
                answer: "Oui, un vote est un signal utile. L’équipe le compare à d’autres signaux : la fréquence du problème, l’effort nécessaire et l’adéquation avec le produit. Les votes seuls ne décident pas. Une idée très votée n’est donc pas toujours la première réalisée.",
            },
            {
                question: "Pourquoi une idée a-t-elle été refusée ?",
                answer: "Le statut « Refusé » signifie que l’équipe ne fera pas cette idée pour le moment. Elle en donne la raison sur l’élément. La raison peut être l’effort, l’écart avec le produit ou un autre choix. Vous pouvez proposer une idée voisine.",
            },
            {
                question: "Les bugs apparaissent-ils dans la roadmap ?",
                answer: "Non. Les bugs vont dans le suivi des bugs, pas dans la roadmap. La roadmap montre les améliorations du produit. Pour signaler une erreur, ouvrez le bouton « Signaler » dans l’application et choisissez « Bug ».",
            },
            {
                question: "À quelle fréquence la roadmap est-elle mise à jour ?",
                answer: "Il n’y a pas de rythme fixe. Un statut change quand le travail change, pas selon un calendrier. Chaque élément affiche sa date de dernière mise à jour. Revenez sur cette page pour voir l’état actuel.",
            },
        ],
        cta: {
            heading: "Il manque quelque chose ?",
            body: "Si une idée vous manque, dites-le-nous. L’équipe lit chaque suggestion.",
            primaryLabel: "Envoyer une suggestion",
            secondaryLabel: "Voir les suggestions",
        },
        emptyState: "La roadmap ne contient encore aucun élément.",
        columnEmpty: "Aucun élément dans ce statut.",
    },
    suggestions: {
        seo: {
            title: "Suggestions pour {appName} : envoyer un feedback",
            description: "Envoyez une suggestion ou un feedback pour {appName}. Découvrez comment la rédiger, où elle va et quelles données le signalement contient.",
            ogTitle: "Suggestions pour {appName} : envoyez votre feedback produit",
            ogDescription: "Proposez une amélioration pour {appName} depuis le bouton Signaler de l’application. Voyez comment rédiger une bonne suggestion et quelles données le signalement contient.",
            ogImageAlt: "Liste des suggestions de {appName} avec votes et statuts",
        },
        h1: "Suggestions pour {appName}",
        intro: "Ici, vous voyez les idées envoyées pour ce produit et vous pouvez voter. Pour proposer une idée, utilisez le bouton « Signaler » dans l’application. L’équipe lit chaque suggestion avant de décider.",
        guide: {
            heading: "Comment envoyer une suggestion",
            intro: "L’envoi se fait depuis l’application. Il prend quelques minutes.",
            steps: [
                {
                    title: "Ouvrez le bouton « Signaler »",
                    body: "Dans l’application que vous utilisez, cliquez sur le bouton « Signaler ». Une fenêtre s’ouvre.",
                },
                {
                    title: "Choisissez « Suggestion »",
                    body: "Dans la fenêtre, choisissez le type « Suggestion ». L’autre type, « Bug », sert aux erreurs.",
                },
                {
                    title: "Écrivez un titre court et concret",
                    body: "Le titre dit l’idée en une phrase. Évitez les titres vagues comme « Améliorer l’appli ».",
                },
                {
                    title: "Décrivez le problème, le contexte et le résultat attendu",
                    body: "Expliquez ce que vous essayez de faire et ce qui vous gêne. Dites aussi ce que vous attendez à la place.",
                },
                {
                    title: "Joignez une capture d’écran si elle aide, puis envoyez",
                    body: "La capture est facultative. Après l’envoi, la suggestion arrive dans le backlog produit.",
                },
            ],
        },
        comparisonTable: {
            caption: "Différences entre un bug et une suggestion",
            headers: ["Critère", "Bug", "Suggestion"],
            rows: [
                [
                    "Quand l’utiliser",
                    "Quelque chose ne fonctionne pas comme prévu.",
                    "Vous voulez ajouter ou améliorer quelque chose.",
                ],
                [
                    "Exemple",
                    "Le bouton d’enregistrement ne répond pas.",
                    "Ajouter un filtre par date dans la liste.",
                ],
                [
                    "Gravité",
                    "Faible, moyenne, haute ou critique.",
                    "Ne s’applique pas.",
                ],
                [
                    "Capture d’écran",
                    "Recommandée.",
                    "Facultative.",
                ],
                [
                    "Destination",
                    "Suivi des bugs. Un signalement peut créer une fonctionnalité liée.",
                    "Backlog produit. Jamais de fonctionnalité créée automatiquement.",
                ],
                [
                    "Et ensuite",
                    "L’équipe reproduit le problème et le corrige.",
                    "L’équipe l’examine. Elle peut la placer dans la roadmap, à l’étude.",
                ],
            ],
        },
        sections: [
            {
                heading: "Comment rédiger une bonne suggestion",
                body: "Une bonne suggestion est claire et courte. Elle aide l’équipe à comprendre le besoin sans deviner. Deux habitudes suffisent.",
                subsections: [
                    {
                        heading: "Décrivez le problème, pas seulement la solution",
                        body: "Dites ce que vous essayez de faire et ce qui vous bloque. L’équipe peut alors trouver la meilleure solution, pas forcément celle que vous imaginiez.",
                    },
                    {
                        heading: "Une idée par suggestion",
                        body: "Envoyez chaque idée séparément. Une suggestion avec trois idées est difficile à examiner et à suivre. Séparées, elles gardent chacune leur statut.",
                    },
                ],
            },
            {
                heading: "Confidentialité et données du signalement",
                body: "Un signalement contient du contexte technique pour aider l’équipe. Certaines données sont exclues ou masquées avant l’envoi. Voici ce qui part et ce qui reste protégé.",
                subsections: [
                    {
                        heading: "Ce qui est joint",
                        body: "Le signalement contient l’URL et la route de la page, le navigateur, la taille de la fenêtre et de l’écran, la langue et le fuseau horaire. Il contient aussi les 10 dernières erreurs, les 10 dernières requêtes réseau échouées et les 30 derniers clics.",
                    },
                    {
                        heading: "Ce qui est protégé",
                        body: "La capture d’écran exclut les champs de mot de passe, les champs masqués et les zones que l’application marque comme sensibles ou à ignorer. Les valeurs qui ressemblent à des secrets, comme les jetons, les clés et les en-têtes Authorization, sont masquées avant l’envoi. Le serveur de l’application définit l’identité du signalement, et il le signe avant de le transmettre. Le secret du webhook n’atteint jamais le navigateur.",
                    },
                ],
            },
        ],
        faq: [
            {
                question: "Où va ma suggestion ?",
                answer: "Elle va dans le backlog produit. Une suggestion ne crée jamais de fonctionnalité automatiquement. L’équipe l’examine d’abord. Si elle la retient, elle peut la placer dans la roadmap avec le statut « À l’étude ».",
            },
            {
                question: "Ai-je besoin d’un compte ?",
                answer: "L’envoi passe par l’application que vous utilisez. Il suit les règles de session de cette application. Si l’application demande une connexion, vous vous connectez comme d’habitude. Le portail ne vous demande pas de compte en plus.",
            },
            {
                question: "Puis-je joindre une capture d’écran, et que montre-t-elle ?",
                answer: "Oui, la capture est facultative. Elle montre la page que vous voyez, sans les champs de mot de passe, les champs masqués ni les zones que l’application marque comme sensibles ou à ignorer. Vous pouvez la refaire ou la retirer avant l’envoi.",
            },
            {
                question: "Quelle est la différence entre un bug et une suggestion ?",
                answer: "Un bug signale quelque chose qui ne fonctionne pas comme prévu. Il porte une gravité et va dans le suivi des bugs. Une suggestion propose une amélioration et va dans le backlog produit. Si vous hésitez, choisissez « Suggestion » et décrivez la situation.",
            },
            {
                question: "Recevrai-je une réponse ?",
                answer: "L’équipe ne promet pas de réponse individuelle. Elle lit chaque suggestion et peut la faire avancer. Pour suivre l’évolution, consultez la roadmap. Elle affiche le statut de chaque élément et sa date de dernière mise à jour.",
            },
            {
                question: "Des données sensibles sont-elles envoyées ?",
                answer: "L’envoi limite ces données. La capture exclut les mots de passe et les champs masqués. Les valeurs qui ressemblent à des secrets sont masquées dans les messages et dans les paramètres d’URL. Évitez malgré tout d’écrire des mots de passe dans le titre ou la description.",
            },
        ],
        cta: {
            heading: "Une idée ?",
            body: "Écrivez-la en quelques lignes. L’équipe la lira.",
            primaryLabel: "Envoyer une suggestion",
            secondaryLabel: "Voir la roadmap",
        },
        list: {
            sortTop: "Les plus votées",
            sortNew: "Les plus récentes",
            filterAll: "Tous les statuts",
            filterByStatus: "Filtrer par statut",
            searchPlaceholder: "Rechercher une suggestion",
            emptyState: "Aucune suggestion ne correspond pour le moment.",
            vote: "Voter",
            voted: "Vote enregistré",
        },
    },
    reporter: {
        trigger: "Signaler",
        dialogTitleBug: "Signaler un bug",
        dialogTitleSuggestion: "Suggérer une amélioration",
        typeBug: "Bug",
        typeSuggestion: "Suggestion",
        title: "Titre",
        titlePlaceholderSuggestion: "Que devrait mieux faire cette application ?",
        description: "Description",
        severity: "Gravité",
        severityLow: "Faible",
        severityMedium: "Moyenne",
        severityHigh: "Haute",
        severityCritical: "Critique",
        screenshot: "Capture d’écran",
        capture: "Capturer",
        recapture: "Recapturer",
        remove: "Retirer",
        cancel: "Annuler",
        send: "Envoyer",
        sending: "Envoi en cours",
        attached: "Capture d’écran jointe",
        captureFailed: "La capture d’écran a échoué",
        bugSent: "Bug signalé",
        suggestionSent: "Suggestion envoyée au backlog produit",
        sendFailed: "L’envoi a échoué",
        bugAndFeatureCreated: "Bug et fonctionnalité créés",
        close: "Fermer",
    },
};
export default messages;
