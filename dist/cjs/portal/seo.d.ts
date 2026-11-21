import { type PortalLocale, type PortalPage } from "./locales.js";
export type PortalUrlOptions = {
    /** Public origin, e.g. "https://feedback.gruia.app". */
    baseUrl: string;
    /** Optional mount path, e.g. "/portal". */
    basePath?: string;
};
export type PortalPageOptions = PortalUrlOptions & {
    locale: PortalLocale;
    page: PortalPage;
    appName: string;
    /** Absolute URL of the OpenGraph image (1200x630 recommended). */
    ogImageUrl?: string;
};
export type HreflangAlternate = {
    hreflang: string;
    href: string;
};
export type PortalMetadata = {
    lang: string;
    title: string;
    description: string;
    canonical: string;
    alternates: HreflangAlternate[];
    /** Next.js `metadata.alternates.languages` shape. */
    languages: Record<string, string>;
    robots: string;
    openGraph: {
        type: "website";
        siteName: string;
        title: string;
        description: string;
        url: string;
        locale: string;
        alternateLocale: string[];
        images: Array<{
            url: string;
            alt: string;
            width: number;
            height: number;
        }>;
    };
    twitter: {
        card: "summary_large_image";
        title: string;
        description: string;
        images: string[];
    };
};
/** Path of a portal page: `{basePath}/{locale}/{page}`. */
export declare function portalPath(locale: PortalLocale, page: PortalPage, basePath?: string): string;
/** Absolute URL of a portal page. */
export declare function portalUrl(locale: PortalLocale, page: PortalPage, options: PortalUrlOptions): string;
/** One alternate per locale plus `x-default` (Spanish). */
export declare function buildHreflangAlternates(page: PortalPage, options: PortalUrlOptions): HreflangAlternate[];
export declare function buildPortalMetadata(options: PortalPageOptions): PortalMetadata;
/** Schema.org graph: WebPage, BreadcrumbList and FAQPage for one portal page. */
export declare function buildPortalJsonLd(options: PortalPageOptions): Record<string, unknown>;
/** JSON for a `<script type="application/ld+json">` body, safe against `</script>`. */
export declare function serializeJsonLd(data: unknown): string;
/** `<head>` tags for frameworks without a metadata API. */
export declare function renderPortalHeadTags(options: PortalPageOptions): string;
