import type { FeedbackReporterLabels } from "../FeedbackReporter.js";
import type { RoadmapStatus } from "./locales.js";
/**
 * Placeholders use single braces: `{appName}`, `{count}`, `{date}`.
 * Only the keys documented below may contain them, and every locale must use
 * exactly the same placeholder set per key (checked by test/i18n.test.mjs).
 */
/** Page-level SEO copy. Every field contains `{appName}`. */
export type PortalSeo = {
    /** `<title>`. Max 60 characters once `{appName}` is replaced by a 5-letter name. */
    title: string;
    /** `<meta name="description">`. 120 to 160 characters once interpolated. */
    description: string;
    /** `og:title`. */
    ogTitle: string;
    /** `og:description`. 100 to 200 characters once interpolated. */
    ogDescription: string;
    /** `og:image:alt`. */
    ogImageAlt: string;
};
/** Rendered as H3 + paragraph. */
export type PortalSubsection = {
    heading: string;
    body: string;
};
/** Rendered as H2 + paragraph + H3 subsections. */
export type PortalSection = {
    heading: string;
    body: string;
    subsections: PortalSubsection[];
};
/** Rendered as `<table>` with `<caption>`. Every row has `headers.length` cells. */
export type PortalTable = {
    caption: string;
    headers: string[];
    rows: string[][];
};
/** Rendered as visible FAQ and as Schema.org FAQPage JSON-LD. */
export type PortalFaqItem = {
    question: string;
    answer: string;
};
export type PortalCta = {
    heading: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
};
export type PortalStep = {
    title: string;
    body: string;
};
export type PortalMessages = {
    meta: {
        /** Native language name, e.g. "Español". */
        languageName: string;
        /** OpenGraph locale, e.g. "es_ES". */
        ogLocale: string;
        /** BCP 47 tag for `<html lang>` and hreflang, e.g. "es". */
        htmlLang: string;
    };
    common: {
        /** `og:site_name`. Contains `{appName}`. */
        siteName: string;
        nav: {
            home: string;
            roadmap: string;
            suggestions: string;
            languageSwitcher: string;
            skipToContent: string;
            breadcrumb: string;
        };
        /** Contain `{count}`. */
        votes: {
            one: string;
            other: string;
        };
        /** Contains `{date}`. */
        lastUpdated: string;
        loading: string;
        loadError: string;
        retry: string;
    };
    status: Record<RoadmapStatus, {
        label: string;
        description: string;
    }>;
    roadmap: {
        seo: PortalSeo;
        /** Contains `{appName}`. */
        h1: string;
        intro: string;
        /** Exactly 3 sections, each with exactly 2 subsections. */
        sections: PortalSection[];
        /** 3 headers; 5 rows in ROADMAP_STATUSES order. */
        statusTable: PortalTable;
        /** Exactly 6 items. */
        faq: PortalFaqItem[];
        cta: PortalCta;
        emptyState: string;
        columnEmpty: string;
    };
    suggestions: {
        seo: PortalSeo;
        /** Contains `{appName}`. */
        h1: string;
        intro: string;
        /** Exactly 5 steps. */
        guide: {
            heading: string;
            intro: string;
            steps: PortalStep[];
        };
        /** 3 headers (criterion, bug, suggestion); exactly 6 rows. */
        comparisonTable: PortalTable;
        /** Exactly 2 sections, each with exactly 2 subsections. */
        sections: PortalSection[];
        /** Exactly 6 items. */
        faq: PortalFaqItem[];
        cta: PortalCta;
        list: {
            sortTop: string;
            sortNew: string;
            filterAll: string;
            filterByStatus: string;
            searchPlaceholder: string;
            emptyState: string;
            vote: string;
            voted: string;
        };
    };
    /** Labels for the in-app `<FeedbackReporter labels={...} />`. */
    reporter: FeedbackReporterLabels;
};
