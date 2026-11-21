/** Locales served by the public roadmap and suggestions portal. */
export declare const PORTAL_LOCALES: readonly ["es", "en", "fr", "de", "pt", "it"];
export type PortalLocale = (typeof PORTAL_LOCALES)[number];
/** Spanish is the source locale and the `x-default` target. */
export declare const DEFAULT_PORTAL_LOCALE: PortalLocale;
/** Public pages of the portal. Slugs are stable across locales. */
export declare const PORTAL_PAGES: readonly ["roadmap", "suggestions"];
export type PortalPage = (typeof PORTAL_PAGES)[number];
/** Lifecycle of a roadmap item, in display order. */
export declare const ROADMAP_STATUSES: readonly ["considering", "planned", "inProgress", "shipped", "declined"];
export type RoadmapStatus = (typeof ROADMAP_STATUSES)[number];
export declare function isPortalLocale(value: unknown): value is PortalLocale;
