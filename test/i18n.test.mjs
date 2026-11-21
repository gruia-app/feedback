import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_PORTAL_LOCALE,
  PORTAL_LOCALES,
  PORTAL_MESSAGES,
  PORTAL_PAGES,
  ROADMAP_STATUSES,
  buildPortalJsonLd,
  buildPortalMetadata,
  buildPortalSitemapEntries,
  buildPortalSitemapXml,
  extractPlaceholders,
  formatVotes,
  getReporterLabels,
  renderPortalHeadTags,
  resolvePortalLocale,
} from "../dist/esm/portal/index.js";

const SOURCE = PORTAL_MESSAGES[DEFAULT_PORTAL_LOCALE];
const ALLOWED = new Set(["appName", "count", "date"]);
const APP_NAME_PATHS = new Set([
  "common.siteName",
  "roadmap.h1",
  "suggestions.h1",
  ...["roadmap", "suggestions"].flatMap((p) =>
    ["title", "description", "ogTitle", "ogDescription", "ogImageAlt"].map((k) => `${p}.seo.${k}`),
  ),
]);
// Case-sensitive markers: "todo" is a normal word in Spanish and Portuguese.
const BANNED = /\b(TODO|FIXME|TBD|XXX)\b|\b[Ll]orem\b|\b[Ii]psum\b|\.\.\.|…|\[[a-z ]+\]/;

/** Flattens a catalog to [path, string] pairs; array indexes become path segments. */
function leaves(value, path = "") {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
}
const shape = (catalog) => leaves(catalog).map(([p]) => p).sort();
const fill = (s) => s.replaceAll("{appName}", "GruIA");

describe("portal i18n completeness", () => {
  it("ships exactly the six expected locales", () => {
    assert.deepEqual([...PORTAL_LOCALES].sort(), ["de", "en", "es", "fr", "it", "pt"]);
    assert.deepEqual(Object.keys(PORTAL_MESSAGES).sort(), [...PORTAL_LOCALES].sort());
  });

  const sourceShape = shape(SOURCE);
  for (const locale of PORTAL_LOCALES) {
    describe(locale, () => {
      const messages = PORTAL_MESSAGES[locale];
      const flat = leaves(messages);

      it("has the same keys and array lengths as the Spanish source", () => {
        assert.deepEqual(shape(messages), sourceShape);
      });

      it("has no empty, placeholder or truncated strings", () => {
        for (const [path, text] of flat) {
          assert.ok(text.trim().length > 0, `${locale}:${path} is empty`);
          assert.equal(text, text.trim(), `${locale}:${path} has outer whitespace`);
          assert.doesNotMatch(text, BANNED, `${locale}:${path} looks unfinished: ${text}`);
        }
      });

      it("uses only allowed placeholders, identical to the source per key", () => {
        const source = new Map(leaves(SOURCE));
        for (const [path, text] of flat) {
          const names = extractPlaceholders(text);
          for (const name of names) assert.ok(ALLOWED.has(name), `${locale}:${path} uses {${name}}`);
          assert.deepEqual(names, extractPlaceholders(source.get(path)), `${locale}:${path} placeholder drift`);
          const bare = path.replace(/\[\d+\]/g, "");
          assert.equal(names.includes("appName"), APP_NAME_PATHS.has(bare), `${locale}:${path} {appName} rule`);
          assert.doesNotMatch(text.replace(/\{[A-Za-z]+\}/g, ""), /[{}]/, `${locale}:${path} has stray braces`);
        }
      });

      it("declares coherent language metadata", () => {
        assert.equal(messages.meta.htmlLang, locale);
        assert.match(messages.meta.ogLocale, new RegExp(`^${locale}_[A-Z]{2}$`));
        assert.deepEqual(Object.keys(messages.status).sort(), [...ROADMAP_STATUSES].sort());
      });

      it("respects the content structure", () => {
        assert.equal(messages.roadmap.sections.length, 3);
        assert.equal(messages.suggestions.sections.length, 2);
        for (const s of [...messages.roadmap.sections, ...messages.suggestions.sections]) {
          assert.equal(s.subsections.length, 2);
        }
        assert.equal(messages.roadmap.faq.length, 6);
        assert.equal(messages.suggestions.faq.length, 6);
        assert.equal(messages.suggestions.guide.steps.length, 5);
        assert.equal(messages.roadmap.statusTable.rows.length, ROADMAP_STATUSES.length);
        assert.equal(messages.suggestions.comparisonTable.rows.length, 6);
        for (const table of [messages.roadmap.statusTable, messages.suggestions.comparisonTable]) {
          assert.equal(table.headers.length, 3);
          for (const row of table.rows) assert.equal(row.length, table.headers.length);
        }
      });

      it("keeps SEO snippets inside search-result limits", () => {
        for (const page of PORTAL_PAGES) {
          const seo = messages[page].seo;
          assert.ok(fill(seo.title).length <= 60, `${locale}:${page} title is ${fill(seo.title).length} chars`);
          const d = fill(seo.description).length;
          assert.ok(d >= 110 && d <= 165, `${locale}:${page} description is ${d} chars`);
          const og = fill(seo.ogDescription).length;
          assert.ok(og >= 90 && og <= 210, `${locale}:${page} og description is ${og} chars`);
        }
        const titles = PORTAL_PAGES.map((p) => messages[p].seo.title);
        assert.equal(new Set(titles).size, titles.length, "page titles must differ");
      });

      it("provides every reporter label", () => {
        const labels = getReporterLabels(locale);
        assert.equal(Object.keys(labels).length, 27);
        assert.deepEqual(Object.keys(labels).sort(), Object.keys(SOURCE.reporter).sort());
      });
    });
  }
});

describe("portal SEO", () => {
  const base = { baseUrl: "https://feedback.example/", appName: "GruIA", ogImageUrl: "https://feedback.example/og.png" };

  it("builds canonical, hreflang and OpenGraph metadata", () => {
    const meta = buildPortalMetadata({ ...base, locale: "fr", page: "roadmap" });
    assert.equal(meta.canonical, "https://feedback.example/fr/roadmap");
    assert.equal(meta.lang, "fr");
    assert.equal(meta.alternates.length, PORTAL_LOCALES.length + 1);
    assert.equal(meta.languages["x-default"], "https://feedback.example/es/roadmap");
    assert.equal(meta.languages.de, "https://feedback.example/de/roadmap");
    assert.equal(meta.openGraph.locale, "fr_FR");
    assert.equal(meta.openGraph.alternateLocale.length, PORTAL_LOCALES.length - 1);
    assert.doesNotMatch(JSON.stringify(meta), /\{appName\}/);
  });

  it("supports a base path", () => {
    const meta = buildPortalMetadata({ ...base, basePath: "/portal/", locale: "it", page: "suggestions" });
    assert.equal(meta.canonical, "https://feedback.example/portal/it/suggestions");
  });

  it("emits a valid FAQPage graph per locale and page", () => {
    for (const locale of PORTAL_LOCALES) {
      for (const page of PORTAL_PAGES) {
        const graph = JSON.parse(JSON.stringify(buildPortalJsonLd({ ...base, locale, page })))["@graph"];
        const faq = graph.find((node) => node["@type"] === "FAQPage");
        assert.equal(faq.mainEntity.length, 6);
        for (const q of faq.mainEntity) {
          assert.equal(q["@type"], "Question");
          assert.ok(q.name && q.acceptedAnswer.text);
        }
        assert.ok(graph.some((node) => node["@type"] === "BreadcrumbList"));
      }
    }
  });

  it("renders escaped head tags", () => {
    const html = renderPortalHeadTags({ ...base, appName: "A</script>B", locale: "de", page: "roadmap" });
    assert.match(html, /<link rel="canonical" href="https:\/\/feedback.example\/de\/roadmap">/);
    assert.match(html, /hreflang="x-default"/);
    assert.equal((html.match(/<\/script>/g) || []).length, 1, "JSON-LD must not break out of its script tag");
  });

  it("lists every locale and page in the sitemap", () => {
    const entries = buildPortalSitemapEntries({ baseUrl: "https://feedback.example", lastModified: "2026-11-21" });
    assert.equal(entries.length, PORTAL_LOCALES.length * PORTAL_PAGES.length);
    const xml = buildPortalSitemapXml({ baseUrl: "https://feedback.example", lastModified: "2026-11-21" });
    assert.equal((xml.match(/<url>/g) || []).length, entries.length);
    assert.equal((xml.match(/<xhtml:link /g) || []).length, entries.length * (PORTAL_LOCALES.length + 1));
    assert.match(xml, /<lastmod>2026-11-21T00:00:00.000Z<\/lastmod>/);
  });
});

describe("portal locale helpers", () => {
  it("resolves Accept-Language headers", () => {
    assert.equal(resolvePortalLocale("fr-CH,fr;q=0.9,en;q=0.8"), "fr");
    assert.equal(resolvePortalLocale("nl-NL,pt-BR;q=0.7,en;q=0.5"), "pt");
    assert.equal(resolvePortalLocale("en;q=0,de;q=0.4"), "de");
    assert.equal(resolvePortalLocale("ja"), "es");
    assert.equal(resolvePortalLocale(undefined), "es");
  });

  it("formats vote counts with plural rules", () => {
    for (const locale of PORTAL_LOCALES) {
      assert.match(formatVotes(locale, 1), /1/);
      assert.notEqual(formatVotes(locale, 1).replace("1", ""), formatVotes(locale, 2).replace("2", ""));
    }
  });
});
