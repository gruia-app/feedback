import type { FeedbackReporterLabels } from "../FeedbackReporter.js";
import { type PortalLocale } from "./locales.js";
import type { PortalMessages } from "./types.js";
export * from "./locales.js";
export * from "./seo.js";
export * from "./sitemap.js";
export { extractPlaceholders, formatMessage, interpolateDeep, type MessageValues } from "./format.js";
export { PORTAL_MESSAGES } from "./messages/index.js";
export type * from "./types.js";
/**
 * Picks the best portal locale from a locale tag, a list of tags or an
 * `Accept-Language` header. Falls back to Spanish.
 */
export declare function resolvePortalLocale(input?: string | readonly string[] | null): PortalLocale;
/** Portal catalog for a locale. Pass `appName` to interpolate `{appName}`. */
export declare function getPortalMessages(locale: string, values?: {
    appName?: string;
}): PortalMessages;
/** Ready-to-use `labels` for `<FeedbackReporter />` in the given locale. */
export declare function getReporterLabels(locale: string): FeedbackReporterLabels;
/** "1 voto" / "12 votos" with locale plural rules and number formatting. */
export declare function formatVotes(locale: string, count: number): string;
/** "Actualizado el 21 nov 2026" with locale date formatting. */
export declare function formatLastUpdated(locale: string, date: Date | string): string;
export declare const PORTAL_LOCALE_COUNT: 6;
