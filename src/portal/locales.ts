/** Locales served by the public roadmap and suggestions portal. */
export const PORTAL_LOCALES = ["es", "en", "fr", "de", "pt", "it"] as const;
export type PortalLocale = (typeof PORTAL_LOCALES)[number];

/** Spanish is the source locale and the `x-default` target. */
export const DEFAULT_PORTAL_LOCALE: PortalLocale = "es";

/** Public pages of the portal. Slugs are stable across locales. */
export const PORTAL_PAGES = ["roadmap", "suggestions"] as const;
export type PortalPage = (typeof PORTAL_PAGES)[number];

/** Lifecycle of a roadmap item, in display order. */
export const ROADMAP_STATUSES = ["considering", "planned", "inProgress", "shipped", "declined"] as const;
export type RoadmapStatus = (typeof ROADMAP_STATUSES)[number];

export function isPortalLocale(value: unknown): value is PortalLocale {
  return typeof value === "string" && (PORTAL_LOCALES as readonly string[]).includes(value);
}
