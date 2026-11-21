/** Locales served by the public roadmap and suggestions portal. */
export const PORTAL_LOCALES = ["es", "en", "fr", "de", "pt", "it"];
/** Spanish is the source locale and the `x-default` target. */
export const DEFAULT_PORTAL_LOCALE = "es";
/** Public pages of the portal. Slugs are stable across locales. */
export const PORTAL_PAGES = ["roadmap", "suggestions"];
/** Lifecycle of a roadmap item, in display order. */
export const ROADMAP_STATUSES = ["considering", "planned", "inProgress", "shipped", "declined"];
export function isPortalLocale(value) {
    return typeof value === "string" && PORTAL_LOCALES.includes(value);
}
