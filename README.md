# @gruia/feedback

Shared in-app feedback reporter for the GruIA ecosystem. Extracted from the
ACV2 Control Tower bug reporter (`ControlTowerBugReporter`).

## What it does

- Floating "Report" rail + dialog with two report types: **Bug** and
  **Sugerencia**. Suggestions go to the product backlog (`report_type=suggestion`
  upstream) and never auto-create a Feature.
- Screenshot capture via `html2canvas`, excluding `data-bug-report-ignore` /
  `data-feedback-ignore` subtrees and password/hidden inputs.
- Bounded capture buffers (10 errors, 10 failed network calls, 30 clicks) with
  secret-aware sanitization of messages and URL query strings.
- A fresh W3C `traceparent` per submission, sent as a header and embedded in
  `trace.trace_id` so the report can be linked to SigNoz traces.
- Server helpers that enforce server-side identity (`app_key`, `environment`,
  `service`), drop client-supplied actor/tenant fields, and HMAC-sign the exact
  forwarded bytes to `POST {backendUrl}/api/v1/webhooks/bug-report`.

## Install (git dep, pinned SHA)

```json
"@gruia/feedback": "github:gruia-app/feedback#<commit-sha>"
```

React >= 18 is a peer dependency. Import the stylesheet once:

```ts
import "@gruia/feedback/styles.css";
```

## Browser side

```tsx
import { FeedbackReporter } from "@gruia/feedback";

<FeedbackReporter endpoint="/api/bug-report" />
```

Props: `endpoint`, `allowSuggestions` (default true), `notify` (e.g. sonner's
`toast`), `screenshotFilePrefix`, `accentColor`, `labels`, `enabled`.

## Server side (app-local route)

The browser never sees the webhook secret. Each app exposes its own
`/api/bug-report` route that applies its session/auth rules and then calls
`forwardFeedbackReport` from `@gruia/feedback/server`:

```ts
import { forwardFeedbackReport } from "@gruia/feedback/server";

const result = await forwardFeedbackReport(rawBody, {
  token: process.env.BUG_REPORT_WEBHOOK_TOKEN ?? "",
  backendUrl: process.env.ACV2_BACKEND_URL ?? "https://coding.gruia.app",
  appKey: "ecommerce",          // canonical, server-defined
  environment: process.env.APP_ENV,
  service: "ecommerce-web",
  requestHeaders: { traceparent: req.headers.get("traceparent") ?? undefined },
});
```

`buildSignedReportPayload` is also exported for frameworks that need the
payload without the forward. Signing format: `sha256={hmac}` over
`{timestamp}.{raw body}`, headers `X-Simplia-Bug-Report-Signature` /
`X-Simplia-Bug-Report-Timestamp`.

Backend contract: see `docs/observability/signoz-open-bugs-ecosystem-rollout.md`
in autonomous-coding-v2. `app_key` must be registered in `public.apps_registry`
and have a token in `BUG_REPORT_WEBHOOK_TOKENS_JSON`.

## Public portal: roadmap and suggestions (i18n + SEO)

`@gruia/feedback/portal` ships the copy and SEO helpers for two public pages per
locale: `/{locale}/roadmap` and `/{locale}/suggestions`. Locales: `es` (source and
`x-default`), `en`, `fr`, `de`, `pt`, `it`. The module has no React dependency.

```ts
import {
  buildPortalMetadata,
  buildPortalJsonLd,
  buildPortalSitemapEntries,
  getPortalMessages,
  getReporterLabels,
  resolvePortalLocale,
} from "@gruia/feedback/portal";

const locale = resolvePortalLocale(request.headers.get("accept-language"));
const copy = getPortalMessages(locale, { appName: "Ecommerce" });
const meta = buildPortalMetadata({ locale, page: "roadmap", appName: "Ecommerce", baseUrl: "https://feedback.gruia.app" });
// meta.canonical, meta.languages (hreflang + x-default), meta.openGraph, meta.twitter
const jsonLd = buildPortalJsonLd({ locale, page: "roadmap", appName: "Ecommerce", baseUrl: "https://feedback.gruia.app" });
// WebPage + BreadcrumbList + FAQPage graph; render it with serializeJsonLd()
```

- `buildPortalSitemapEntries()` returns Next.js `MetadataRoute.Sitemap` entries;
  `buildPortalSitemapXml()` returns a standalone `sitemap.xml` with `xhtml:link` alternates.
- `renderPortalHeadTags()` returns escaped `<head>` tags for apps without a metadata API.
- `getReporterLabels(locale)` gives localized `labels` for `<FeedbackReporter />`.
- `formatVotes(locale, n)` and `formatLastUpdated(locale, date)` use `Intl` plural and date rules.

Placeholders are `{appName}`, `{count}` and `{date}`. `test/i18n.test.mjs` fails if a
locale misses a key, changes an array length, drifts a placeholder, leaves a
`TODO`/`Lorem`/`...`, or breaks the title (max 60) and description (110 to 165) limits.
Run it alone with `pnpm run test:i18n` after a build.

## Build

`dist/` is committed so git-dep consumers need no build step.
`pnpm build` compiles `src/` with tsc; `pnpm test` runs `node --test`.
