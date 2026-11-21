const messages = {
    meta: {
        languageName: "Deutsch",
        ogLocale: "de_DE",
        htmlLang: "de",
    },
    common: {
        siteName: "{appName} Roadmap und Vorschläge",
        nav: {
            home: "Startseite",
            roadmap: "Roadmap",
            suggestions: "Vorschläge",
            languageSwitcher: "Sprache",
            skipToContent: "Zum Inhalt springen",
            breadcrumb: "Brotkrumennavigation",
        },
        votes: {
            one: "{count} Stimme",
            other: "{count} Stimmen",
        },
        lastUpdated: "Aktualisiert am {date}",
        loading: "Lädt",
        loadError: "Das Laden hat nicht geklappt. Versuche es gleich noch einmal.",
        retry: "Erneut versuchen",
    },
    status: {
        considering: {
            label: "In Prüfung",
            description: "Das Team prüft die Idee und hat noch nicht entschieden.",
        },
        planned: {
            label: "Geplant",
            description: "Das Team hat die Idee angenommen. Sie wartet auf ihren Platz in der Reihe.",
        },
        inProgress: {
            label: "In Arbeit",
            description: "Das Team baut diese Verbesserung gerade.",
        },
        shipped: {
            label: "Umgesetzt",
            description: "Die Verbesserung ist in der App verfügbar.",
        },
        declined: {
            label: "Abgelehnt",
            description: "Das Team setzt die Idee vorerst nicht um. Es nennt dazu einen Grund.",
        },
    },
    roadmap: {
        seo: {
            title: "{appName} Roadmap: Produktentwicklung im Überblick",
            description: "Die Roadmap von {appName}: Sieh, welche Produktideen in Prüfung, geplant, in Arbeit oder umgesetzt sind, mit Status und Datum der letzten Aktualisierung.",
            ogTitle: "{appName} Roadmap: Status aller Produktverbesserungen",
            ogDescription: "Verfolge die Entwicklung von {appName} nach Status: in Prüfung, geplant, in Arbeit, umgesetzt oder abgelehnt. Jeder Eintrag zeigt das Datum seiner letzten Aktualisierung.",
            ogImageAlt: "Roadmap von {appName} mit Produktverbesserungen nach Status geordnet",
        },
        h1: "Die Roadmap von {appName}",
        intro: "Diese Seite zeigt, wie weit die Verbesserungen am Produkt sind. Jeder Eintrag nennt seinen Status und sein letztes Update. Vorschläge aus der Community kommen hierher, nachdem das Team sie geprüft hat.",
        sections: [
            {
                heading: "So liest du die Roadmap",
                body: "Die Roadmap ordnet Produktverbesserungen nach Status. Sie nennt keine Termine. Sie zeigt, was das Team prüft, plant, baut oder schon umgesetzt hat.",
                subsections: [
                    {
                        heading: "Status statt Termine",
                        body: "Ein Status beschreibt den Stand der Arbeit. Er nennt kein Lieferdatum. Wenn sich die Arbeit ändert, ändert sich der Status.",
                    },
                    {
                        heading: "Was in die Roadmap kommt",
                        body: "Die Roadmap enthält Vorschläge aus dem Produkt-Backlog, die das Team schon geprüft hat. Ein Vorschlag landet nicht automatisch dort. Das Team liest ihn zuerst und entscheidet dann.",
                    },
                ],
            },
            {
                heading: "So setzen wir Prioritäten",
                body: "Das Team ordnet Ideen nicht nach einem einzigen Kriterium. Es vergleicht mehrere Signale, bevor es entscheidet. Stimmen gehören dazu, aber sie reichen nicht aus.",
                subsections: [
                    {
                        heading: "Die Signale, die wir abwägen",
                        body: "Das Team schaut, wie oft ein Problem auftritt, wie groß der Aufwand ist und wie gut die Idee zum Produkt passt. Auch die Zahl der Stimmen zählt. Jedes Signal hat Gewicht, keines entscheidet allein.",
                    },
                    {
                        heading: "Warum Stimmen nicht allein entscheiden",
                        body: "Eine Stimme zeigt Interesse, nicht unbedingt Bedarf. Eine Idee mit vielen Stimmen kann teuer sein oder nicht zum Produkt passen. Eine Idee mit wenigen Stimmen kann ein echtes Problem lösen.",
                    },
                ],
            },
            {
                heading: "Von der Roadmap auf deinen Bildschirm",
                body: "Ein Eintrag wechselt seinen Status, während die Arbeit voranschreitet. Du kannst jede Verbesserung auf dieser Seite verfolgen. Sobald ein Eintrag umgesetzt ist, steht er in der App bereit.",
                subsections: [
                    {
                        heading: "Wann sich ein Status ändert",
                        body: "Ein Status ändert sich, wenn sich die Arbeit ändert. Es gibt keinen festen Rhythmus. Das Datum am Eintrag zeigt die letzte Änderung.",
                    },
                    {
                        heading: "So verfolgst du einen Eintrag",
                        body: "Schau auf dieser Seite nach. Jeder Eintrag zeigt seinen Status und das Datum seiner letzten Aktualisierung. So siehst du, ob die Arbeit vorankommt.",
                    },
                ],
            },
        ],
        statusTable: {
            caption: "Roadmap-Status, ihre Bedeutung und was du tun kannst",
            headers: ["Status", "Was er bedeutet", "Was du tun kannst"],
            rows: [
                [
                    "In Prüfung",
                    "Das Team prüft die Idee und hat noch nicht entschieden.",
                    "Stimme ab oder ergänze den Vorschlag mit deinem Kontext.",
                ],
                [
                    "Geplant",
                    "Das Team hat die Idee angenommen. Sie wartet auf ihren Platz in der Reihe.",
                    "Verfolge den Eintrag auf dieser Seite.",
                ],
                [
                    "In Arbeit",
                    "Das Team baut die Verbesserung gerade.",
                    "Verfolge den Eintrag. Er steht bald bereit.",
                ],
                [
                    "Umgesetzt",
                    "Die Verbesserung ist in der App verfügbar.",
                    "Probiere sie aus und sende bei Bedarf einen neuen Vorschlag.",
                ],
                [
                    "Abgelehnt",
                    "Das Team setzt die Idee vorerst nicht um und nennt einen Grund.",
                    "Lies den Grund. Du kannst eine verwandte Idee vorschlagen.",
                ],
            ],
        },
        faq: [
            {
                question: "Gibt es Liefertermine?",
                answer: "Nein. Die Roadmap zeigt Status, keine Liefertermine. Ein Status beschreibt den Stand der Arbeit zu einem bestimmten Zeitpunkt. Jeder Eintrag zeigt das Datum seiner letzten Aktualisierung. So siehst du, wann er sich zuletzt geändert hat.",
            },
            {
                question: "Wie schlage ich etwas Neues vor?",
                answer: "Öffne in der App den Button „Melden“ und wähle „Vorschlag“. Schreibe einen kurzen Titel und beschreibe das Problem, den Kontext und das erwartete Ergebnis. Der Vorschlag landet im Produkt-Backlog, wo das Team ihn prüft.",
            },
            {
                question: "Hilft es, abzustimmen?",
                answer: "Ja, eine Stimme ist ein nützliches Signal. Das Team vergleicht sie mit anderen Signalen: wie oft ein Problem auftritt, wie groß der Aufwand ist und wie gut die Idee zum Produkt passt. Stimmen allein entscheiden nicht. Eine Idee mit vielen Stimmen kommt deshalb nicht immer zuerst.",
            },
            {
                question: "Warum wurde eine Idee abgelehnt?",
                answer: "Der Status „Abgelehnt“ bedeutet: Das Team setzt die Idee vorerst nicht um. Es nennt den Grund am Eintrag. Das kann der Aufwand sein, eine Abweichung vom Produkt oder eine andere Entscheidung. Du kannst eine verwandte Idee vorschlagen.",
            },
            {
                question: "Erscheinen Bugs in der Roadmap?",
                answer: "Nein. Bugs gehen ins Bug-Tracking, nicht in die Roadmap. Die Roadmap zeigt Verbesserungen am Produkt. Um einen Fehler zu melden, öffne in der App den Button „Melden“ und wähle „Bug“.",
            },
            {
                question: "Wie oft wird die Roadmap aktualisiert?",
                answer: "Es gibt keinen festen Rhythmus. Ein Status ändert sich, wenn sich die Arbeit ändert, nicht nach einem Kalender. Jeder Eintrag zeigt das Datum seiner letzten Aktualisierung. Schau auf dieser Seite nach, um den aktuellen Stand zu sehen.",
            },
        ],
        cta: {
            heading: "Fehlt dir etwas?",
            body: "Wenn dir eine Idee fehlt, sag es uns. Das Team liest jeden Vorschlag.",
            primaryLabel: "Vorschlag senden",
            secondaryLabel: "Vorschläge ansehen",
        },
        emptyState: "Die Roadmap enthält noch keine Einträge.",
        columnEmpty: "Keine Einträge in diesem Status.",
    },
    suggestions: {
        seo: {
            title: "Vorschläge für {appName}: Feedback senden",
            description: "Sende einen Vorschlag oder Feedback für {appName}. Lies, wie du ihn schreibst, wohin er geht und welche Daten die Meldung enthält.",
            ogTitle: "Vorschläge für {appName}: Dein Produkt-Feedback",
            ogDescription: "Schlage eine Verbesserung für {appName} über den Melden-Button in der App vor. Lies, wie du einen guten Vorschlag schreibst und welche Daten die Meldung enthält.",
            ogImageAlt: "Liste der Vorschläge für {appName} mit Stimmen und Status",
        },
        h1: "Vorschläge für {appName}",
        intro: "Hier siehst du die Ideen, die für das Produkt eingegangen sind, und kannst abstimmen. Für eine neue Idee nutzt du den Button „Melden“ in der App. Das Team liest jeden Vorschlag, bevor es entscheidet.",
        guide: {
            heading: "So sendest du einen Vorschlag",
            intro: "Du sendest den Vorschlag direkt aus der App. Es dauert wenige Minuten.",
            steps: [
                {
                    title: "Öffne den Button „Melden“",
                    body: "Klicke in der App, die du gerade nutzt, auf „Melden“. Ein Dialog öffnet sich.",
                },
                {
                    title: "Wähle „Vorschlag“",
                    body: "Wähle im Dialog den Typ „Vorschlag“. Der andere Typ, „Bug“, ist für Fehler gedacht.",
                },
                {
                    title: "Schreibe einen kurzen, konkreten Titel",
                    body: "Der Titel nennt die Idee in einem Satz. Vermeide vage Titel wie „App verbessern“.",
                },
                {
                    title: "Beschreibe Problem, Kontext und erwartetes Ergebnis",
                    body: "Erkläre, was du erreichen willst und was dich stört. Sag auch, was du stattdessen erwartest.",
                },
                {
                    title: "Hänge einen Screenshot an, wenn er hilft, und sende ab",
                    body: "Der Screenshot ist optional. Nach dem Senden landet der Vorschlag im Produkt-Backlog.",
                },
            ],
        },
        comparisonTable: {
            caption: "Unterschiede zwischen Bug und Vorschlag",
            headers: ["Kriterium", "Bug", "Vorschlag"],
            rows: [
                [
                    "Wann du ihn nutzt",
                    "Etwas funktioniert nicht wie erwartet.",
                    "Du möchtest etwas hinzufügen oder verbessern.",
                ],
                [
                    "Beispiel",
                    "Der Speichern-Button reagiert nicht.",
                    "Ein Datumsfilter für die Liste.",
                ],
                [
                    "Schweregrad",
                    "Niedrig, mittel, hoch oder kritisch.",
                    "Entfällt.",
                ],
                [
                    "Screenshot",
                    "Empfohlen.",
                    "Optional.",
                ],
                [
                    "Ziel",
                    "Bug-Tracking. Eine Meldung kann ein verknüpftes Feature anlegen.",
                    "Produkt-Backlog. Nie ein automatisch angelegtes Feature.",
                ],
                [
                    "Wie es weitergeht",
                    "Das Team reproduziert den Fehler und behebt ihn.",
                    "Das Team prüft den Vorschlag. Es kann ihn als „In Prüfung“ in die Roadmap aufnehmen.",
                ],
            ],
        },
        sections: [
            {
                heading: "So schreibst du einen guten Vorschlag",
                body: "Ein guter Vorschlag ist klar und kurz. Er hilft dem Team, den Bedarf zu verstehen, ohne zu raten. Zwei Gewohnheiten genügen.",
                subsections: [
                    {
                        heading: "Beschreibe das Problem, nicht nur die Lösung",
                        body: "Sag, was du erreichen willst und woran du scheiterst. Dann findet das Team die beste Lösung, nicht unbedingt die, die du dir vorgestellt hast.",
                    },
                    {
                        heading: "Eine Idee pro Vorschlag",
                        body: "Sende jede Idee einzeln. Ein Vorschlag mit drei Ideen ist schwer zu prüfen und zu verfolgen. Einzeln behält jede Idee ihren eigenen Status.",
                    },
                ],
            },
            {
                heading: "Datenschutz und Meldedaten",
                body: "Eine Meldung enthält technischen Kontext, der dem Team hilft. Manche Daten schließt die App aus oder maskiert sie vor dem Senden. Hier steht, was mitgeht und was geschützt bleibt.",
                subsections: [
                    {
                        heading: "Was angehängt wird",
                        body: "Die Meldung enthält die URL und die Route der Seite, den Browser, die Größe von Fenster und Bildschirm, die Sprache und die Zeitzone. Dazu kommen die letzten 10 Fehler, die letzten 10 fehlgeschlagenen Netzwerkanfragen und die letzten 30 Klicks.",
                    },
                    {
                        heading: "Was geschützt wird",
                        body: "Der Screenshot schließt Passwortfelder, versteckte Felder und Bereiche aus, die die App als sensibel oder zu ignorieren markiert. Werte, die wie Geheimnisse aussehen, etwa Tokens, Schlüssel und Authorization-Header, werden vor dem Senden maskiert. Der Server der App legt die Identität der Meldung fest und signiert sie, bevor er sie weiterleitet. Das Webhook-Secret erreicht nie den Browser.",
                    },
                ],
            },
        ],
        faq: [
            {
                question: "Wohin geht mein Vorschlag?",
                answer: "Er geht ins Produkt-Backlog. Ein Vorschlag legt nie automatisch ein Feature an. Das Team prüft ihn zuerst. Wenn es ihn aufnimmt, kann es ihn mit dem Status „In Prüfung“ in die Roadmap setzen.",
            },
            {
                question: "Brauche ich ein Konto?",
                answer: "Das Senden läuft über die App, die du nutzt. Es folgt den Sitzungsregeln dieser App. Wenn die App eine Anmeldung verlangt, meldest du dich wie gewohnt an. Das Portal verlangt kein zusätzliches Konto.",
            },
            {
                question: "Kann ich einen Screenshot anhängen, und was zeigt er?",
                answer: "Ja, der Screenshot ist optional. Er zeigt die Seite, die du siehst, ohne Passwortfelder, versteckte Felder und Bereiche, die die App als sensibel oder zu ignorieren markiert. Du kannst ihn vor dem Senden neu aufnehmen oder entfernen.",
            },
            {
                question: "Was ist der Unterschied zwischen Bug und Vorschlag?",
                answer: "Ein Bug meldet etwas, das nicht wie erwartet funktioniert. Er hat einen Schweregrad und geht ins Bug-Tracking. Ein Vorschlag regt eine Verbesserung an und geht ins Produkt-Backlog. Wenn du unsicher bist, wähle „Vorschlag“ und beschreibe die Lage.",
            },
            {
                question: "Bekomme ich eine Antwort?",
                answer: "Das Team verspricht keine persönliche Antwort. Es liest jeden Vorschlag und kann ihn weiterbringen. Um den Verlauf zu verfolgen, schau in die Roadmap. Sie zeigt den Status jedes Eintrags und das Datum seiner letzten Aktualisierung.",
            },
            {
                question: "Werden sensible Daten gesendet?",
                answer: "Das Senden begrenzt solche Daten. Der Screenshot schließt Passwörter und versteckte Felder aus. Werte, die wie Geheimnisse aussehen, werden in Nachrichten und in URL-Parametern maskiert. Schreibe trotzdem keine Passwörter in Titel oder Beschreibung.",
            },
        ],
        cta: {
            heading: "Du hast eine Idee?",
            body: "Schreibe sie in wenigen Zeilen auf. Das Team liest sie.",
            primaryLabel: "Vorschlag senden",
            secondaryLabel: "Roadmap ansehen",
        },
        list: {
            sortTop: "Meiste Stimmen",
            sortNew: "Neueste",
            filterAll: "Alle Status",
            filterByStatus: "Nach Status filtern",
            searchPlaceholder: "Vorschläge durchsuchen",
            emptyState: "Im Moment passt kein Vorschlag.",
            vote: "Abstimmen",
            voted: "Abgestimmt",
        },
    },
    reporter: {
        trigger: "Melden",
        dialogTitleBug: "Bug melden",
        dialogTitleSuggestion: "Verbesserung vorschlagen",
        typeBug: "Bug",
        typeSuggestion: "Vorschlag",
        title: "Titel",
        titlePlaceholderSuggestion: "Was sollte diese App besser machen?",
        description: "Beschreibung",
        severity: "Schweregrad",
        severityLow: "Niedrig",
        severityMedium: "Mittel",
        severityHigh: "Hoch",
        severityCritical: "Kritisch",
        screenshot: "Screenshot",
        capture: "Aufnehmen",
        recapture: "Neu aufnehmen",
        remove: "Entfernen",
        cancel: "Abbrechen",
        send: "Senden",
        sending: "Wird gesendet",
        attached: "Screenshot angehängt",
        captureFailed: "Screenshot-Aufnahme fehlgeschlagen",
        bugSent: "Bug-Meldung gesendet",
        suggestionSent: "Vorschlag ans Produkt-Backlog gesendet",
        sendFailed: "Senden fehlgeschlagen",
        bugAndFeatureCreated: "Bug und Feature angelegt",
        close: "Schließen",
    },
};
export default messages;
