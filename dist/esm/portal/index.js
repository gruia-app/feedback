import { formatMessage, interpolateDeep } from "./format.js";
import { DEFAULT_PORTAL_LOCALE, PORTAL_LOCALES, isPortalLocale } from "./locales.js";
import { PORTAL_MESSAGES } from "./messages/index.js";
export * from "./locales.js";
export * from "./seo.js";
export * from "./sitemap.js";
export { extractPlaceholders, formatMessage, interpolateDeep } from "./format.js";
export { PORTAL_MESSAGES } from "./messages/index.js";
/**
 * Picks the best portal locale from a locale tag, a list of tags or an
 * `Accept-Language` header. Falls back to Spanish.
 */
export function resolvePortalLocale(input) {
    if (!input)
        return DEFAULT_PORTAL_LOCALE;
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
        if (isPortalLocale(primary))
            return primary;
    }
    return DEFAULT_PORTAL_LOCALE;
}
/** Portal catalog for a locale. Pass `appName` to interpolate `{appName}`. */
export function getPortalMessages(locale, values) {
    const catalog = PORTAL_MESSAGES[isPortalLocale(locale) ? locale : resolvePortalLocale(locale)];
    return values?.appName ? interpolateDeep(catalog, { appName: values.appName }) : catalog;
}
/** Ready-to-use `labels` for `<FeedbackReporter />` in the given locale. */
export function getReporterLabels(locale) {
    return { ...getPortalMessages(locale).reporter };
}
/** "1 voto" / "12 votos" with locale plural rules and number formatting. */
export function formatVotes(locale, count) {
    const lang = isPortalLocale(locale) ? locale : resolvePortalLocale(locale);
    const { one, other } = PORTAL_MESSAGES[lang].common.votes;
    const form = new Intl.PluralRules(lang).select(count) === "one" ? one : other;
    return formatMessage(form, { count: new Intl.NumberFormat(lang).format(count) });
}
/** "Actualizado el 21 nov 2026" with locale date formatting. */
export function formatLastUpdated(locale, date) {
    const lang = isPortalLocale(locale) ? locale : resolvePortalLocale(locale);
    const value = typeof date === "string" ? new Date(date) : date;
    const formatted = new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeZone: "UTC" }).format(value);
    return formatMessage(PORTAL_MESSAGES[lang].common.lastUpdated, { date: formatted });
}
export const PORTAL_LOCALE_COUNT = PORTAL_LOCALES.length;
