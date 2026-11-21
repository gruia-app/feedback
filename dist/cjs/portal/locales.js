"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROADMAP_STATUSES = exports.PORTAL_PAGES = exports.DEFAULT_PORTAL_LOCALE = exports.PORTAL_LOCALES = void 0;
exports.isPortalLocale = isPortalLocale;
/** Locales served by the public roadmap and suggestions portal. */
exports.PORTAL_LOCALES = ["es", "en", "fr", "de", "pt", "it"];
/** Spanish is the source locale and the `x-default` target. */
exports.DEFAULT_PORTAL_LOCALE = "es";
/** Public pages of the portal. Slugs are stable across locales. */
exports.PORTAL_PAGES = ["roadmap", "suggestions"];
/** Lifecycle of a roadmap item, in display order. */
exports.ROADMAP_STATUSES = ["considering", "planned", "inProgress", "shipped", "declined"];
function isPortalLocale(value) {
    return typeof value === "string" && exports.PORTAL_LOCALES.includes(value);
}
