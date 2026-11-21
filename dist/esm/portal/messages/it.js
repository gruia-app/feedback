const messages = {
    meta: {
        languageName: "Italiano",
        ogLocale: "it_IT",
        htmlLang: "it",
    },
    common: {
        siteName: "Roadmap e suggerimenti di {appName}",
        nav: {
            home: "Home",
            roadmap: "Roadmap",
            suggestions: "Suggerimenti",
            languageSwitcher: "Lingua",
            skipToContent: "Vai al contenuto",
            breadcrumb: "Percorso di navigazione",
        },
        votes: {
            one: "{count} voto",
            other: "{count} voti",
        },
        lastUpdated: "Aggiornato il {date}",
        loading: "Caricamento",
        loadError: "Non siamo riusciti a caricare questo contenuto.",
        retry: "Riprova",
    },
    status: {
        considering: {
            label: "In valutazione",
            description: "Il team sta valutando l’idea. Per ora non c’è nessun impegno.",
        },
        planned: {
            label: "Pianificato",
            description: "Il team ha accettato l’idea. Aspetta il suo turno.",
        },
        inProgress: {
            label: "In corso",
            description: "Il team lo sta sviluppando adesso.",
        },
        shipped: {
            label: "Rilasciato",
            description: "È disponibile nell’app.",
        },
        declined: {
            label: "Rifiutato",
            description: "Per ora il team non lo farà. Ogni elemento indica il motivo.",
        },
    },
    roadmap: {
        seo: {
            title: "Roadmap di {appName}: stato del prodotto",
            description: "Segui la roadmap del prodotto {appName}. Scopri quali idee sono in valutazione, pianificate, in corso o rilasciate e come il feedback degli utenti guida le scelte.",
            ogTitle: "Roadmap del prodotto {appName}",
            ogDescription: "Scopri cosa il team di {appName} valuta, pianifica, sviluppa e rilascia. La roadmap mostra gli stati e la data dell’ultimo aggiornamento, in base al feedback degli utenti.",
            ogImageAlt: "Roadmap del prodotto {appName} con gli elementi raggruppati per stato",
        },
        h1: "Roadmap di {appName}",
        intro: "Questa pagina mostra cosa il team valuta, pianifica, sviluppa e rilascia. Elenca stati, non date. Ogni elemento mostra il suo ultimo aggiornamento.",
        sections: [
            {
                heading: "Come leggere la roadmap",
                body: "La roadmap raggruppa i miglioramenti del prodotto per stato. Ogni stato indica a che punto è un elemento oggi. Non è una promessa di data di consegna.",
                subsections: [
                    {
                        heading: "Stati, non date",
                        body: "Un elemento passa da in valutazione a pianificato, in corso e rilasciato. Non pubblichiamo date di consegna. Una data suggerirebbe una certezza che non abbiamo.",
                    },
                    {
                        heading: "Cosa entra nella roadmap",
                        body: "I suggerimenti vanno prima nel backlog di prodotto. Il team li esamina lì. Quando un suggerimento merita attenzione, compare nella roadmap come in valutazione.",
                    },
                ],
            },
            {
                heading: "Come stabiliamo le priorità",
                body: "Il team pesa più segnali prima di accettare un elemento. Nessun numero decide da solo l’ordine. Rivediamo l’ordine quando arrivano nuove informazioni.",
                subsections: [
                    {
                        heading: "I segnali che pesiamo",
                        body: "Guardiamo quanto spesso compare un problema, quanto impegno richiede il lavoro e quanto l’idea si adatta al prodotto. I voti sono un segnale in più in questo elenco.",
                    },
                    {
                        heading: "Perché i voti non decidono da soli",
                        body: "Un voto mostra interesse, ma non mostra impegno né coerenza con il prodotto. Un’idea popolare può essere difficile da realizzare o portare il prodotto in un’altra direzione. Per questo i voti da soli non decidono.",
                    },
                ],
            },
            {
                heading: "Dalla roadmap al tuo schermo",
                body: "Un elemento arriva nell’app quando il team finisce il lavoro. Fino ad allora la roadmap mostra il suo stato attuale. Puoi controllarlo quando vuoi.",
                subsections: [
                    {
                        heading: "Quando cambia uno stato",
                        body: "Uno stato cambia quando cambia il lavoro. Non esiste un calendario fisso. Se nulla cambia, lo stato resta lo stesso.",
                    },
                    {
                        heading: "Come seguire un elemento",
                        body: "Torna su questa pagina e cerca l’elemento. Ogni elemento mostra il suo stato e la data dell’ultimo aggiornamento. Entrambi ti dicono cosa è cambiato dalla tua ultima visita.",
                    },
                ],
            },
        ],
        statusTable: {
            caption: "Stati della roadmap e loro significato",
            headers: ["Stato", "Cosa significa", "Cosa puoi fare"],
            rows: [
                [
                    "In valutazione",
                    "Il team sta valutando l’idea.",
                    "Aggiungi dettagli in un nuovo suggerimento se hai più contesto.",
                ],
                [
                    "Pianificato",
                    "Il team ha accettato l’idea e aspetta il suo turno.",
                    "Vota per mostrare che per te è importante.",
                ],
                [
                    "In corso",
                    "Il team lo sta sviluppando adesso.",
                    "Controlla questa pagina per gli aggiornamenti.",
                ],
                [
                    "Rilasciato",
                    "L’elemento è disponibile nell’app.",
                    "Provalo e invia un suggerimento se manca qualcosa.",
                ],
                [
                    "Rifiutato",
                    "Per ora il team non lo farà. L’elemento indica il motivo.",
                    "Leggi il motivo. Invia un nuovo suggerimento se il tuo caso è diverso.",
                ],
            ],
        },
        faq: [
            {
                question: "Ci sono date di consegna?",
                answer: "No. La roadmap mostra stati, non date di consegna. Uno stato indica a che punto è un elemento oggi. Non indica quando sarà pronto, perché non possiamo prevederlo con certezza. Ogni elemento mostra la data dell’ultimo aggiornamento, così vedi quando è cambiato.",
            },
            {
                question: "Come propongo qualcosa di nuovo?",
                answer: "Apri il pulsante Segnala nell’app e scegli Suggerimento. Scrivi un titolo breve e descrivi il problema, il contesto e il risultato che ti aspetti. Il suggerimento va nel backlog di prodotto. Il team lo esamina lì prima che possa arrivare nella roadmap.",
            },
            {
                question: "Votare serve?",
                answer: "Sì, un voto è un segnale per il team. Il team pesa anche quanto spesso compare un problema, quanto impegno richiede il lavoro e quanto l’idea si adatta al prodotto. I voti da soli non decidono l’ordine della roadmap. Per questo conviene anche descrivere bene il problema nel suggerimento.",
            },
            {
                question: "Perché un’idea è stata rifiutata?",
                answer: "Rifiutato significa che per ora il team non farà quell’elemento. L’elemento indica il motivo. Un motivo comune è che l’idea non si adatta al prodotto. Un altro è che l’impegno è troppo alto rispetto al beneficio. Il team può rivedere la decisione più avanti. Se pensi che il motivo non valga per il tuo caso, invia un nuovo suggerimento.",
            },
            {
                question: "I bug compaiono nella roadmap?",
                answer: "No. I bug vanno nel tracciamento dei bug, dove il team li riproduce e li corregge. La roadmap mostra i miglioramenti del prodotto. Se trovi un errore nell’app, scegli Bug nella finestra di segnalazione e indica la gravità. Il team lo tratta come un bug, non come un’idea di prodotto.",
            },
            {
                question: "Ogni quanto viene aggiornata?",
                answer: "Non esiste un calendario fisso di aggiornamento. Uno stato cambia quando cambia il lavoro. Ogni elemento mostra la data dell’ultimo aggiornamento. Controlla quella data per sapere quanto sono recenti le informazioni. Se la data non cambia da tempo, il lavoro non è cambiato.",
            },
        ],
        cta: {
            heading: "Manca qualcosa?",
            body: "Se un’idea non è nella roadmap, dillo al team. Basta un minuto dal pulsante Segnala nell’app.",
            primaryLabel: "Invia un suggerimento",
            secondaryLabel: "Vedi i suggerimenti",
        },
        emptyState: "Nella roadmap non ci sono ancora elementi.",
        columnEmpty: "Nessun elemento in questo stato.",
    },
    suggestions: {
        seo: {
            title: "Suggerimenti per {appName}: invia feedback e idee",
            description: "Invia suggerimenti e feedback sul prodotto {appName}. Scopri come scrivere un suggerimento utile, in cosa si differenzia da un bug e come proteggiamo i tuoi dati.",
            ogTitle: "Invia un suggerimento per {appName}",
            ogDescription: "Scopri come inviare feedback e suggerimenti sul prodotto {appName}. Vedi la differenza tra un bug e un suggerimento e quali dati include ogni segnalazione.",
            ogImageAlt: "Pagina dei suggerimenti di {appName} con l’elenco delle idee e dei voti",
        },
        h1: "Suggerimenti per {appName}",
        intro: "Qui puoi leggere le idee degli altri utenti e votarle. Puoi anche imparare a inviare la tua. Il team esamina ogni suggerimento prima che arrivi nella roadmap.",
        guide: {
            heading: "Come inviare un suggerimento",
            intro: "Invii il suggerimento dall’interno dell’app. Bastano cinque passaggi.",
            steps: [
                {
                    title: "Apri il pulsante Segnala",
                    body: "Trova il pulsante Segnala nell’app che stai usando. Cliccalo per aprire la finestra.",
                },
                {
                    title: "Scegli Suggerimento",
                    body: "Seleziona Suggerimento come tipo di segnalazione. Usa Bug solo per gli errori.",
                },
                {
                    title: "Scrivi un titolo breve e concreto",
                    body: "Descrivi l’idea in una riga. Un titolo chiaro aiuta il team a ritrovarla.",
                },
                {
                    title: "Descrivi il problema",
                    body: "Spiega il problema, il contesto e il risultato che ti aspetti. Dettagli concreti aiutano il team più di un testo lungo.",
                },
                {
                    title: "Allega uno screenshot e invia",
                    body: "Allega uno screenshot se serve, poi invia la segnalazione. Il suggerimento va nel backlog di prodotto.",
                },
            ],
        },
        comparisonTable: {
            caption: "Differenze tra un bug e un suggerimento",
            headers: ["Criterio", "Bug", "Suggerimento"],
            rows: [
                [
                    "Quando usarlo",
                    "Qualcosa non funziona come dovrebbe.",
                    "Vuoi che il prodotto faccia qualcosa di nuovo o di meglio.",
                ],
                [
                    "Esempio",
                    "Un pulsante non fa nulla quando lo clicchi.",
                    "Un filtro che ti aiuta a ritrovare più in fretta gli elementi vecchi.",
                ],
                [
                    "Gravità",
                    "Scegli da bassa a critica.",
                    "Non si applica.",
                ],
                [
                    "Screenshot",
                    "Consigliato.",
                    "Facoltativo.",
                ],
                [
                    "Destinazione",
                    "Tracciamento dei bug. Può creare una funzionalità collegata.",
                    "Il backlog di prodotto. Non crea mai una Feature in automatico.",
                ],
                [
                    "Cosa succede dopo",
                    "Il team riproduce l’errore e lo corregge.",
                    "Il team lo esamina e può spostarlo nella roadmap come in valutazione.",
                ],
            ],
        },
        sections: [
            {
                heading: "Come scrivere un buon suggerimento",
                body: "Un buon suggerimento aiuta il team a capire la tua esigenza. È breve e concreto. Dà abbastanza contesto per valutare l’idea senza fare altre domande.",
                subsections: [
                    {
                        heading: "Descrivi il problema, non solo la soluzione",
                        body: "Racconta cosa cerchi di fare e cosa ti blocca. Il team può trovare una soluzione migliore di quella che immagini. Aggiungi il risultato che ti aspetti.",
                    },
                    {
                        heading: "Un’idea per suggerimento",
                        body: "Invia ogni idea come suggerimento separato. Così il team può esaminarla e tu puoi seguirla nella roadmap. Un suggerimento che mescola più idee è più difficile da valutare.",
                    },
                ],
            },
            {
                heading: "Privacy e dati della segnalazione",
                body: "Una segnalazione porta con sé un contesto tecnico che aiuta il team a capirla. L’app e il server proteggono quei dati prima che escano dal tuo browser. Questa sezione spiega cosa viene allegato e cosa viene protetto.",
                subsections: [
                    {
                        heading: "Cosa viene allegato",
                        body: "Ogni segnalazione include l’URL e la route della pagina, il browser, le dimensioni di viewport e schermo, la lingua e il fuso orario. Include anche gli ultimi 10 errori, le ultime 10 richieste di rete fallite e gli ultimi 30 clic. Ogni segnalazione riceve un identificativo di traccia (W3C traceparent), così il team può collegarla alle tracce tecniche.",
                    },
                    {
                        heading: "Cosa viene protetto",
                        body: "Gli screenshot escludono i campi password, i campi nascosti e le aree che l’app segna come sensibili o ignorate. I valori che sembrano segreti, come token, chiavi e header Authorization, vengono oscurati nei messaggi e nelle query string degli URL prima dell’invio. Il server dell’app, non il browser, stabilisce app, ambiente e servizio. Il segreto del webhook non arriva mai al browser, e il server firma ogni segnalazione prima di inoltrarla.",
                    },
                ],
            },
        ],
        faq: [
            {
                question: "Dove va il mio suggerimento?",
                answer: "Il tuo suggerimento va nel backlog di prodotto. Il team lo esamina lì. Un suggerimento non crea mai una Feature in automatico. Se il team accetta l’idea, può comparire nella roadmap, prima come in valutazione. Se l’idea non si adatta al prodotto, il team può rifiutarla e indicare il motivo.",
            },
            {
                question: "Mi serve un account?",
                answer: "Invii la segnalazione dall’interno dell’app che usi, quindi l’invio passa da quell’app. Segue le regole di sessione di quell’app. Se l’app ti chiede di accedere, accedi lì. Controlla l’app per sapere chi può inviare segnalazioni. Questo portale non cambia quelle regole.",
            },
            {
                question: "Posso allegare uno screenshot e cosa mostra?",
                answer: "Sì, lo screenshot è facoltativo per un suggerimento e consigliato per un bug. Mostra la pagina come la vedi tu. Esclude i campi password, i campi nascosti e le aree che l’app segna come sensibili o ignorate. Puoi rimuoverlo o rifarlo prima di inviare.",
            },
            {
                question: "Qual è la differenza tra un bug e un suggerimento?",
                answer: "Un bug è qualcosa che non funziona come dovrebbe. Indichi una gravità da bassa a critica e la segnalazione va nel tracciamento dei bug. Un suggerimento è un’idea per migliorare il prodotto. Va nel backlog di prodotto e non ha gravità. Se non sei sicuro, scegli Suggerimento: il team può sempre rivedere il tipo.",
            },
            {
                question: "Riceverò una risposta?",
                answer: "Non promettiamo una risposta individuale. Il team legge ogni suggerimento, ma non può rispondere a tutti. Per seguire la tua idea, controlla il suo stato nella roadmap. Ogni elemento mostra la data dell’ultimo aggiornamento. Controlla quella data per vedere se la tua idea si è mossa.",
            },
            {
                question: "Vengono inviati dati sensibili?",
                answer: "L’app rimuove i dati sensibili prima di inviare una segnalazione. Gli screenshot escludono i campi password e i campi nascosti. I valori che sembrano segreti vengono oscurati nei messaggi e nelle query string degli URL. Non scrivere password o dati personali nel titolo o nella descrizione.",
            },
        ],
        cta: {
            heading: "Hai un’idea?",
            body: "Dillo al team dal pulsante Segnala nell’app. Basta un suggerimento breve e concreto.",
            primaryLabel: "Invia un suggerimento",
            secondaryLabel: "Vedi la roadmap",
        },
        list: {
            sortTop: "Più votati",
            sortNew: "Più recenti",
            filterAll: "Tutti gli stati",
            filterByStatus: "Filtra per stato",
            searchPlaceholder: "Cerca suggerimenti",
            emptyState: "Non ci sono ancora suggerimenti.",
            vote: "Vota",
            voted: "Votato",
        },
    },
    reporter: {
        trigger: "Segnala",
        dialogTitleBug: "Segnala un bug",
        dialogTitleSuggestion: "Suggerisci un miglioramento",
        typeBug: "Bug",
        typeSuggestion: "Suggerimento",
        title: "Titolo",
        titlePlaceholderSuggestion: "Cosa dovrebbe fare meglio questa app?",
        description: "Descrizione",
        severity: "Gravità",
        severityLow: "Bassa",
        severityMedium: "Media",
        severityHigh: "Alta",
        severityCritical: "Critica",
        screenshot: "Screenshot",
        capture: "Cattura",
        recapture: "Cattura di nuovo",
        remove: "Rimuovi",
        cancel: "Annulla",
        send: "Invia",
        sending: "Invio in corso",
        attached: "Screenshot allegato",
        captureFailed: "Cattura dello screenshot non riuscita",
        bugSent: "Segnalazione del bug inviata",
        suggestionSent: "Suggerimento inviato al backlog di prodotto",
        sendFailed: "Segnalazione non riuscita",
        bugAndFeatureCreated: "Bug e funzionalità creati",
        close: "Chiudi",
    },
};
export default messages;
