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

## Client summary endpoint (gestor feed)

`@gruia/feedback/client-summary` and `@gruia/feedback/client-summary-server`
expose a bounded, framework-agnostic handler that summarizes a client's own
feedback feed for the gestor: CSAT index, ratings, reported incidents and
deliverable approvals.

Multi-tenant isolation is fail-closed: the `clientId` is resolved only from a
client token via the injected `ClientSummaryBackend.authenticateClient`.
Tenant identifiers in the query are ignored, and records from other clients
are dropped before aggregation. Summaries always return `estado: "borrador"`;
human review is required before anything is sent to the client.

```ts
import { createClientSummaryHandler } from "@gruia/feedback/client-summary-server";

const handler = createClientSummaryHandler({
  async authenticateClient(token) {
    // resolve token -> { ok: true, clientId } or { ok: false, reason }
  },
  async listFeedbackRecords(clientId, range) {
    // return only this client's ClientFeedbackRecord[]
  },
});

// Framework-agnostic: wrap request/response however your app does.
const res = await handler({ headers: req.headers, query: req.query });
// res = { status: 200, body: { ok: true, resumen, generado_en, nota } }
```

`summarizeClientFeedback` from `@gruia/feedback/client-summary` is the pure
aggregation function if you need the summary without the HTTP boundary.

## Build

`dist/` is committed so git-dep consumers need no build step.
`pnpm build` compiles `src/` with tsc; `pnpm test` runs `node --test`.
