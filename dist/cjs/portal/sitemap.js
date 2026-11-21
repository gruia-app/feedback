"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPortalSitemapEntries = buildPortalSitemapEntries;
exports.buildPortalSitemapXml = buildPortalSitemapXml;
const locales_js_1 = require("./locales.js");
const seo_js_1 = require("./seo.js");
function buildPortalSitemapEntries(options) {
    const lastModified = new Date(options.lastModified ?? Date.now()).toISOString();
    const pages = options.pages ?? locales_js_1.PORTAL_PAGES;
    return pages.flatMap((page) => {
        const languages = Object.fromEntries((0, seo_js_1.buildHreflangAlternates)(page, options).map((a) => [a.hreflang, a.href]));
        return locales_js_1.PORTAL_LOCALES.map((locale) => ({
            url: (0, seo_js_1.portalUrl)(locale, page, options),
            lastModified,
            changeFrequency: "daily",
            priority: page === "roadmap" ? 0.8 : 0.7,
            alternates: { languages },
        }));
    });
}
function escapeXml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
/** Standalone `sitemap.xml` with `xhtml:link` hreflang alternates. */
function buildPortalSitemapXml(options) {
    const urls = buildPortalSitemapEntries(options).map((entry) => {
        const links = Object.entries(entry.alternates.languages)
            .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`)
            .join("\n");
        return [
            "  <url>",
            `    <loc>${escapeXml(entry.url)}</loc>`,
            `    <lastmod>${entry.lastModified}</lastmod>`,
            `    <changefreq>${entry.changeFrequency}</changefreq>`,
            `    <priority>${entry.priority.toFixed(1)}</priority>`,
            links,
            "  </url>",
        ].join("\n");
    });
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...urls,
        "</urlset>",
        "",
    ].join("\n");
}
