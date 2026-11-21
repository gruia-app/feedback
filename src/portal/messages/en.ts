import type { PortalMessages } from "../types.js";

const messages: PortalMessages = {
  meta: {
    languageName: "English",
    ogLocale: "en_US",
    htmlLang: "en",
  },
  common: {
    siteName: "{appName} roadmap and suggestions",
    nav: {
      home: "Home",
      roadmap: "Roadmap",
      suggestions: "Suggestions",
      languageSwitcher: "Language",
      skipToContent: "Skip to content",
      breadcrumb: "Breadcrumb",
    },
    votes: {
      one: "{count} vote",
      other: "{count} votes",
    },
    lastUpdated: "Updated on {date}",
    loading: "Loading",
    loadError: "We could not load this content.",
    retry: "Try again",
  },
  status: {
    considering: {
      label: "Under review",
      description: "The team is reviewing the idea. It has no commitment yet.",
    },
    planned: {
      label: "Planned",
      description: "The team accepted the idea. It waits for its turn.",
    },
    inProgress: {
      label: "In progress",
      description: "The team is building it now.",
    },
    shipped: {
      label: "Shipped",
      description: "It is available in the app.",
    },
    declined: {
      label: "Declined",
      description: "The team will not do it for now. Each item shows the reason.",
    },
  },
  roadmap: {
    seo: {
      title: "{appName} Roadmap: Product Status and Updates",
      description:
        "Follow the {appName} product roadmap. See which ideas are under review, planned, in progress or shipped, and how user feedback shapes each decision.",
      ogTitle: "{appName} product roadmap",
      ogDescription:
        "See what the {appName} team is reviewing, planning, building and shipping. The roadmap shows statuses and last update dates, based on user feedback.",
      ogImageAlt: "{appName} product roadmap with items grouped by status",
    },
    h1: "{appName} roadmap",
    intro:
      "This page shows what the team is reviewing, planning, building and shipping. It lists statuses, not dates. Each item shows its last update.",
    sections: [
      {
        heading: "How to read the roadmap",
        body: "The roadmap groups product improvements by status. Each status tells you where an item stands today. It is not a promise of a delivery date.",
        subsections: [
          {
            heading: "Statuses, not dates",
            body: "An item moves from under review to planned, in progress and shipped. We do not publish delivery dates. A date would suggest a certainty that we do not have.",
          },
          {
            heading: "What enters the roadmap",
            body: "Suggestions first go to the product backlog. The team reviews them there. When a suggestion is worth considering, it appears on the roadmap as under review.",
          },
        ],
      },
      {
        heading: "How we prioritize",
        body: "The team weighs several signals before it accepts an item. No single number decides the order. We review the order when new information arrives.",
        subsections: [
          {
            heading: "Signals we weigh",
            body: "We look at how often a problem appears, how much effort the work needs and how well the idea fits the product. Votes are one more signal in this list.",
          },
          {
            heading: "Why votes do not decide alone",
            body: "A vote shows interest, but it does not show effort or fit. A popular idea can be hard to build or can pull the product in another direction. For this reason, votes alone do not decide.",
          },
        ],
      },
      {
        heading: "From the roadmap to your screen",
        body: "An item reaches the app when the team finishes the work. Until then, the roadmap shows its current status. You can check it at any time.",
        subsections: [
          {
            heading: "When a status changes",
            body: "A status changes when the work changes. There is no fixed schedule. If nothing changes, the status stays the same.",
          },
          {
            heading: "How to follow an item",
            body: "Come back to this page and find the item. Each item shows its status and its last update date. Both tell you what changed since your last visit.",
          },
        ],
      },
    ],
    statusTable: {
      caption: "Roadmap statuses and what they mean",
      headers: ["Status", "What it means", "What you can do"],
      rows: [
        [
          "Under review",
          "The team is reviewing the idea.",
          "Add details in a new suggestion if you have more context.",
        ],
        [
          "Planned",
          "The team accepted the idea and it waits for its turn.",
          "Vote to show that it matters to you.",
        ],
        [
          "In progress",
          "The team is building it now.",
          "Check this page for updates.",
        ],
        [
          "Shipped",
          "The item is available in the app.",
          "Try it and send a suggestion if something is missing.",
        ],
        [
          "Declined",
          "The team will not do it for now. The item shows the reason.",
          "Read the reason. Send a new suggestion if your case is different.",
        ],
      ],
    },
    faq: [
      {
        question: "Are there delivery dates?",
        answer:
          "No. The roadmap shows statuses, not delivery dates. A status tells you where an item stands today. It does not tell you when the item will be ready. Each item shows the date of its last update, so you can see when it changed.",
      },
      {
        question: "How do I propose something new?",
        answer:
          "Open the Report button inside the app and choose Suggestion. Write a short title and describe the problem, the context and the result you expect. Your suggestion goes to the product backlog. The team reviews it there before it can reach the roadmap.",
      },
      {
        question: "Does voting help?",
        answer:
          "Yes, a vote is one signal for the team. The team also weighs how often a problem appears, how much effort the work needs and how well the idea fits the product. Votes alone do not decide the order of the roadmap.",
      },
      {
        question: "Why was an idea declined?",
        answer:
          "Declined means the team will not do the item for now. The item shows the reason. A common reason is that the idea does not fit the product. Another reason is that the effort is too high for the benefit. The team can review the decision later.",
      },
      {
        question: "Do bugs appear on the roadmap?",
        answer:
          "No. Bugs go to bug tracking, where the team reproduces and fixes them. The roadmap shows product improvements. If you find an error in the app, choose Bug in the Report dialog and set its severity. The team then handles it as a bug, not as a product idea.",
      },
      {
        question: "How often is it updated?",
        answer:
          "There is no fixed update schedule. A status changes when the work changes. Each item shows its last update date. Check that date to see how recent the information is. If you see no date change for a long time, the work has not changed.",
      },
    ],
    cta: {
      heading: "Missing something?",
      body: "If an idea is not on the roadmap, tell the team. It takes a minute from the Report button in the app.",
      primaryLabel: "Send a suggestion",
      secondaryLabel: "See suggestions",
    },
    emptyState: "There are no items on the roadmap yet.",
    columnEmpty: "No items in this status.",
  },
  suggestions: {
    seo: {
      title: "{appName} Suggestions: Share Feedback and Ideas",
      description:
        "Send product suggestions and feedback for {appName}. Learn how to write a useful suggestion, how it differs from a bug report and how your data is protected.",
      ogTitle: "Send a suggestion for {appName}",
      ogDescription:
        "Learn how to send feedback and product suggestions for {appName}. See the difference between a bug and a suggestion, and what data each report includes.",
      ogImageAlt: "{appName} suggestions page with the list of ideas and votes",
    },
    h1: "Suggestions for {appName}",
    intro:
      "Here you can read ideas from other users and vote for them. You can also learn how to send your own. The team reviews every suggestion before it reaches the roadmap.",
    guide: {
      heading: "How to send a suggestion",
      intro: "You send a suggestion from inside the app. It takes five steps.",
      steps: [
        {
          title: "Open the Report button",
          body: "Find the Report button in the app you are using. Click it to open the dialog.",
        },
        {
          title: "Choose Suggestion",
          body: "Pick Suggestion as the type of report. Use Bug only for errors.",
        },
        {
          title: "Write a short, concrete title",
          body: "Name the idea in one line. A clear title helps the team find it later.",
        },
        {
          title: "Describe the problem",
          body: "Explain the problem, the context and the result you expect. Concrete details help the team more than a long text.",
        },
        {
          title: "Attach a screenshot and send",
          body: "Attach a screenshot if it helps, then send the report. Your suggestion goes to the product backlog.",
        },
      ],
    },
    comparisonTable: {
      caption: "Differences between a bug and a suggestion",
      headers: ["Criterion", "Bug", "Suggestion"],
      rows: [
        [
          "When to use it",
          "Something does not work as it should.",
          "You want the product to do something new or better.",
        ],
        [
          "Example",
          "A button does nothing when you click it.",
          "A filter that helps you find old items faster.",
        ],
        [
          "Severity",
          "You choose from low to critical.",
          "Does not apply.",
        ],
        [
          "Screenshot",
          "Recommended.",
          "Optional.",
        ],
        [
          "Destination",
          "Bug tracking. It may create a linked feature.",
          "The product backlog. It never creates a Feature automatically.",
        ],
        [
          "What happens next",
          "The team reproduces the error and fixes it.",
          "The team reviews it and may move it to the roadmap as under review.",
        ],
      ],
    },
    sections: [
      {
        heading: "How to write a good suggestion",
        body: "A good suggestion helps the team understand your need. It is short and concrete. It gives enough context to judge the idea without a follow-up question.",
        subsections: [
          {
            heading: "Describe the problem, not only the solution",
            body: "Tell us what you try to do and what stops you. The team may find a better solution than the one you imagine. Add the result you expect.",
          },
          {
            heading: "One idea per suggestion",
            body: "Send each idea as a separate suggestion. The team can then review it, and you can follow it on the roadmap. A mixed suggestion is harder to judge.",
          },
        ],
      },
      {
        heading: "Privacy and report data",
        body: "A report carries technical context that helps the team understand it. The app and the server protect that data before it leaves your browser. This section explains what is attached and what is protected.",
        subsections: [
          {
            heading: "What is attached",
            body: "Each report includes the page URL and route, the browser, the viewport and screen size, the language and the time zone. It also includes the last 10 errors, the last 10 failed network requests and the last 30 clicks. Each report gets a trace identifier (W3C traceparent) so the team can link it to technical traces.",
          },
          {
            heading: "What is protected",
            body: "Screenshots exclude password fields, hidden fields and areas that the app marks as sensitive or ignored. Values that look like secrets, such as tokens, keys and Authorization headers, are redacted from messages and URL query strings before sending. The app server, not the browser, sets the app, the environment and the service. The webhook secret never reaches the browser, and the server signs each report before it forwards it.",
          },
        ],
      },
    ],
    faq: [
      {
        question: "Where does my suggestion go?",
        answer:
          "Your suggestion goes to the product backlog. The team reviews it there. A suggestion never creates a Feature automatically. If the team accepts the idea, it can appear on the roadmap, first as under review. If it does not fit the product, the team can decline it and give a reason.",
      },
      {
        question: "Do I need an account?",
        answer:
          "You send the report from inside the app you use, so the submission passes through that app. It follows the session rules of that app. If the app asks you to sign in, you sign in there. Check the app for questions about who can send reports.",
      },
      {
        question: "Can I attach a screenshot, and what does it show?",
        answer:
          "Yes, a screenshot is optional for a suggestion and recommended for a bug. It shows the page as you see it. It excludes password fields, hidden fields and areas that the app marks as sensitive or ignored. You can remove or recapture it before you send. The screenshot is optional, so you can also send the report without it.",
      },
      {
        question: "What is the difference between a bug and a suggestion?",
        answer:
          "A bug is something that does not work as it should. You set a severity from low to critical, and the report goes to bug tracking. A suggestion is an idea to improve the product. It goes to the product backlog and has no severity.",
      },
      {
        question: "Will I get an answer?",
        answer:
          "We do not promise an individual answer. The team reads every suggestion, but it cannot reply to each one. To follow your idea, check its status on the roadmap. Each item shows its last update date. Check that date to see if your idea moved.",
      },
      {
        question: "Is sensitive data sent?",
        answer:
          "The app removes sensitive data before it sends a report. Screenshots exclude password and hidden fields. Values that look like secrets are redacted from messages and URL query strings. Do not type passwords or personal data in the title or description. Write only what the team needs to understand the idea.",
      },
    ],
    cta: {
      heading: "Have an idea?",
      body: "Tell the team from the Report button in the app. A short, concrete suggestion is enough.",
      primaryLabel: "Send a suggestion",
      secondaryLabel: "See the roadmap",
    },
    list: {
      sortTop: "Most voted",
      sortNew: "Newest",
      filterAll: "All statuses",
      filterByStatus: "Filter by status",
      searchPlaceholder: "Search suggestions",
      emptyState: "There are no suggestions yet.",
      vote: "Vote",
      voted: "Voted",
    },
  },
  reporter: {
    trigger: "Report",
    dialogTitleBug: "Report Bug",
    dialogTitleSuggestion: "Suggest improvement",
    typeBug: "Bug",
    typeSuggestion: "Suggestion",
    title: "Title",
    titlePlaceholderSuggestion: "What should this app do better?",
    description: "Description",
    severity: "Severity",
    severityLow: "Low",
    severityMedium: "Medium",
    severityHigh: "High",
    severityCritical: "Critical",
    screenshot: "Screenshot",
    capture: "Capture",
    recapture: "Recapture",
    remove: "Remove",
    cancel: "Cancel",
    send: "Send",
    sending: "Sending",
    attached: "Screenshot attached",
    captureFailed: "Screenshot capture failed",
    bugSent: "Bug report sent",
    suggestionSent: "Suggestion sent to the product backlog",
    sendFailed: "Report failed",
    bugAndFeatureCreated: "Bug and feature created",
    close: "Close",
  },
};

export default messages;
