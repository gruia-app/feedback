"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORTAL_LOCALE_COUNT = exports.PORTAL_MESSAGES = exports.interpolateDeep = exports.formatMessage = exports.extractPlaceholders = void 0;
exports.resolvePortalLocale = resolvePortalLocale;
exports.getPortalMessages = getPortalMessages;
exports.getReporterLabels = getReporterLabels;
exports.formatVotes = formatVotes;
exports.formatLastUpdated = formatLastUpdated;
const format_js_1 = require("./format.js");
const locales_js_1 = require("./locales.js");
const index_js_1 = require("./messages/index.js");
__exportStar(require("./locales.js"), exports);
__exportStar(require("./seo.js"), exports);
__exportStar(require("./sitemap.js"), exports);
var format_js_2 = require("./format.js");
Object.defineProperty(exports, "extractPlaceholders", { enumerable: true, get: function () { return format_js_2.extractPlaceholders; } });
Object.defineProperty(exports, "formatMessage", { enumerable: true, get: function () { return format_js_2.formatMessage; } });
Object.defineProperty(exports, "interpolateDeep", { enumerable: true, get: function () { return format_js_2.interpolateDeep; } });
var index_js_2 = require("./messages/index.js");
Object.defineProperty(exports, "PORTAL_MESSAGES", { enumerable: true, get: function () { return index_js_2.PORTAL_MESSAGES; } });
/**
 * Picks the best portal locale from a locale tag, a list of tags or an
 * `Accept-Language` header. Falls back to Spanish.
 */
function resolvePortalLocale(input) {
    if (!input)
        return locales_js_1.DEFAULT_PORTAL_LOCALE;
    const raw = typeof input === "string" ? input.split(",") : [...input];
    const ranked = raw
        .map((part, index) => {
        const [tag, ...params] = part.trim().split(";");
        const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
        const weight = q ? Number(q.slice(2)) : 1;
        return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 0, index };
    })
        .filter((entry) => entry.tag && entry.weight > 0)
        .sort((a, b) => b.weight - a.weight || a.index - b.index);
    for (const { tag } of ranked) {
        const primary = tag.split(/[-_]/)[0];
        if ((0, locales_js_1.isPortalLocale)(primary))
            return primary;
    }
    return locales_js_1.DEFAULT_PORTAL_LOCALE;
}
/** Portal catalog for a locale. Pass `appName` to interpolate `{appName}`. */
function getPortalMessages(locale, values) {
    const catalog = index_js_1.PORTAL_MESSAGES[(0, locales_js_1.isPortalLocale)(locale) ? locale : resolvePortalLocale(locale)];
    return values?.appName ? (0, format_js_1.interpolateDeep)(catalog, { appName: values.appName }) : catalog;
}
/** Ready-to-use `labels` for `<FeedbackReporter />` in the given locale. */
function getReporterLabels(locale) {
    return { ...getPortalMessages(locale).reporter };
}
/** "1 voto" / "12 votos" with locale plural rules and number formatting. */
function formatVotes(locale, count) {
    const lang = (0, locales_js_1.isPortalLocale)(locale) ? locale : resolvePortalLocale(locale);
    const { one, other } = index_js_1.PORTAL_MESSAGES[lang].common.votes;
    const form = new Intl.PluralRules(lang).select(count) === "one" ? one : other;
    return (0, format_js_1.formatMessage)(form, { count: new Intl.NumberFormat(lang).format(count) });
}
/** "Actualizado el 21 nov 2026" with locale date formatting. */
function formatLastUpdated(locale, date) {
    const lang = (0, locales_js_1.isPortalLocale)(locale) ? locale : resolvePortalLocale(locale);
    const value = typeof date === "string" ? new Date(date) : date;
    const formatted = new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeZone: "UTC" }).format(value);
    return (0, format_js_1.formatMessage)(index_js_1.PORTAL_MESSAGES[lang].common.lastUpdated, { date: formatted });
}
exports.PORTAL_LOCALE_COUNT = locales_js_1.PORTAL_LOCALES.length;
