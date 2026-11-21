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

## Client follow-up (portal + CLI)

`@gruia/feedback/portal` (server only) lets a client see the reports it sent and their status.
It also lets the client create new ones. The client id comes only from a scoped client token or from the app session.
It never comes from the query, the body or a header. Responses are an allow-list view.
Internal comments, assignees, triage notes and stack traces never leave the server.
A team comment reaches the client only with `visibility: "public"`.

```ts
// app/api/feedback/mine/route.ts
import { handleClientFeedbackRequest } from "@gruia/feedback/portal";

const options = {
  appKey: "ecommerce",
  tokenSecret: process.env.FEEDBACK_CLIENT_TOKEN_SECRET, // >= 32 chars, NOT the webhook token
  authenticate: async () => (await getSession())?.clientId ?? null, // browser view
  store: {
    listByClient: (clientId) => db.feedback.findMany({ where: { client_id: clientId } }),
    createForClient: (clientId, payload) => db.feedback.create({ data: { ...payload, client_id: clientId } }),
  },
};

async function handle(req: Request) {
  const res = await handleClientFeedbackRequest(
    { method: req.method, headers: Object.fromEntries(req.headers), body: req.method === "POST" ? await req.text() : undefined },
    options,
  );
  return Response.json(res.body, { status: res.status, headers: res.headers });
}
export { handle as GET, handle as POST };
```

- `issueClientToken(clientId, secret, { ttlSeconds, scopes })` issues a `gfc1.` token. Scopes: `feedback:list`, `feedback:create`. Lifetime: 30 days by default, 90 days max.
- A present but invalid `Authorization` header gets 401. It never falls back to the session.
- The handler drops any record whose `client_id` is not the caller's, even if the store returns it.
- Statuses collapse to `received | in_review | planned | in_progress | resolved | closed | declined`.

Browser view: `<ClientFeedbackList endpoint="/api/feedback/mine" />` from `@gruia/feedback`.

CLI (`gruia-feedback`), limited to the client's own reports:

```sh
export GRUIA_FEEDBACK_URL=https://app.example/api/feedback/mine
export GRUIA_FEEDBACK_TOKEN=gfc1....        # or --token-file PATH; --token is refused
gruia-feedback list [--json]
gruia-feedback create --title "Checkout falla" [--type bug|suggestion] [--severity high] [--description "..."]
```

The CLI needs https (http only for localhost) and refuses redirects. Exit codes: 0 ok, 1 remote error, 2 usage error.

## Build

`dist/` is committed so git-dep consumers need no build step.
`pnpm build` compiles `src/` with tsc; `pnpm test` runs `node --test`.
