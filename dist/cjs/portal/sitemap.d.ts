import { type PortalPage } from "./locales.js";
import { type PortalUrlOptions } from "./seo.js";
export type PortalSitemapOptions = PortalUrlOptions & {
    /** Last modification of the portal content. Defaults to now. */
    lastModified?: Date | string;
    pages?: readonly PortalPage[];
};
/** Next.js `MetadataRoute.Sitemap` compatible entries. */
export type PortalSitemapEntry = {
    url: string;
    lastModified: string;
    changeFrequency: "daily";
    priority: number;
    alternates: {
        languages: Record<string, string>;
    };
};
export declare function buildPortalSitemapEntries(options: PortalSitemapOptions): PortalSitemapEntry[];
/** Standalone `sitemap.xml` with `xhtml:link` hreflang alternates. */
export declare function buildPortalSitemapXml(options: PortalSitemapOptions): string;
