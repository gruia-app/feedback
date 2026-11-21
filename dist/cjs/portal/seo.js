"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portalPath = portalPath;
exports.portalUrl = portalUrl;
exports.buildHreflangAlternates = buildHreflangAlternates;
exports.buildPortalMetadata = buildPortalMetadata;
exports.buildPortalJsonLd = buildPortalJsonLd;
exports.serializeJsonLd = serializeJsonLd;
exports.renderPortalHeadTags = renderPortalHeadTags;
const format_js_1 = require("./format.js");
const locales_js_1 = require("./locales.js");
const index_js_1 = require("./messages/index.js");
function trimSlashes(value) {
    return value.replace(/^\/+|\/+$/g, "");
}
/** Path of a portal page: `{basePath}/{locale}/{page}`. */
function portalPath(locale, page, basePath = "") {
    const base = trimSlashes(basePath);
    return `${base ? `/${base}` : ""}/${locale}/${page}`;
}
/** Absolute URL of a portal page. */
function portalUrl(locale, page, options) {
    return `${options.baseUrl.replace(/\/+$/, "")}${portalPath(locale, page, options.basePath)}`;
}
/** One alternate per locale plus `x-default` (Spanish). */
function buildHreflangAlternates(page, options) {
    const alternates = locales_js_1.PORTAL_LOCALES.map((locale) => ({
        hreflang: index_js_1.PORTAL_MESSAGES[locale].meta.htmlLang,
        href: portalUrl(locale, page, options),
    }));
    alternates.push({ hreflang: "x-default", href: portalUrl(locales_js_1.DEFAULT_PORTAL_LOCALE, page, options) });
    return alternates;
}
function buildPortalMetadata(options) {
    const { locale, page, appName } = options;
    const messages = index_js_1.PORTAL_MESSAGES[locale];
    const seo = messages[page].seo;
    const fill = (text) => (0, format_js_1.formatMessage)(text, { appName });
    const canonical = portalUrl(locale, page, options);
    const alternates = buildHreflangAlternates(page, options);
    const title = fill(seo.title);
    const description = fill(seo.description);
    const ogTitle = fill(seo.ogTitle);
    const ogDescription = fill(seo.ogDescription);
    const images = options.ogImageUrl
        ? [{ url: options.ogImageUrl, alt: fill(seo.ogImageAlt), width: 1200, height: 630 }]
        : [];
    return {
        lang: messages.meta.htmlLang,
        title,
        description,
        canonical,
        alternates,
        languages: Object.fromEntries(alternates.map((a) => [a.hreflang, a.href])),
        robots: "index, follow",
        openGraph: {
            type: "website",
            siteName: fill(messages.common.siteName),
            title: ogTitle,
            description: ogDescription,
            url: canonical,
            locale: messages.meta.ogLocale,
            alternateLocale: locales_js_1.PORTAL_LOCALES.filter((l) => l !== locale).map((l) => index_js_1.PORTAL_MESSAGES[l].meta.ogLocale),
            images,
        },
        twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images: images.map((i) => i.url) },
    };
}
/** Schema.org graph: WebPage, BreadcrumbList and FAQPage for one portal page. */
function buildPortalJsonLd(options) {
    const { locale, page, appName } = options;
    const messages = index_js_1.PORTAL_MESSAGES[locale];
    const fill = (text) => (0, format_js_1.formatMessage)(text, { appName });
    const url = portalUrl(locale, page, options);
    const home = `${options.baseUrl.replace(/\/+$/, "")}${options.basePath ? `/${trimSlashes(options.basePath)}` : ""}/${locale}`;
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: fill(messages[page].seo.title),
                description: fill(messages[page].seo.description),
                inLanguage: messages.meta.htmlLang,
                isPartOf: { "@type": "WebSite", name: fill(messages.common.siteName), url: home },
                breadcrumb: { "@id": `${url}#breadcrumb` },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: messages.common.nav.home, item: home },
                    { "@type": "ListItem", position: 2, name: messages.common.nav[page], item: url },
                ],
            },
            {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                inLanguage: messages.meta.htmlLang,
                mainEntity: messages[page].faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: { "@type": "Answer", text: item.answer },
                })),
            },
        ],
    };
}
function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
/** JSON for a `<script type="application/ld+json">` body, safe against `</script>`. */
function serializeJsonLd(data) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028")
        .replace(new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029");
}
/** `<head>` tags for frameworks without a metadata API. */
function renderPortalHeadTags(options) {
    const meta = buildPortalMetadata(options);
    const tags = [
        `<title>${escapeHtml(meta.title)}</title>`,
        `<meta name="description" content="${escapeHtml(meta.description)}">`,
        `<meta name="robots" content="${meta.robots}">`,
        `<link rel="canonical" href="${escapeHtml(meta.canonical)}">`,
        ...meta.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}">`),
        `<meta property="og:type" content="website">`,
        `<meta property="og:site_name" content="${escapeHtml(meta.openGraph.siteName)}">`,
        `<meta property="og:title" content="${escapeHtml(meta.openGraph.title)}">`,
        `<meta property="og:description" content="${escapeHtml(meta.openGraph.description)}">`,
        `<meta property="og:url" content="${escapeHtml(meta.openGraph.url)}">`,
        `<meta property="og:locale" content="${meta.openGraph.locale}">`,
        ...meta.openGraph.alternateLocale.map((l) => `<meta property="og:locale:alternate" content="${l}">`),
        ...meta.openGraph.images.flatMap((i) => [
            `<meta property="og:image" content="${escapeHtml(i.url)}">`,
            `<meta property="og:image:alt" content="${escapeHtml(i.alt)}">`,
        ]),
        `<meta name="twitter:card" content="summary_large_image">`,
        `<script type="application/ld+json">${serializeJsonLd(buildPortalJsonLd(options))}</script>`,
    ];
    return tags.join("\n");
}
