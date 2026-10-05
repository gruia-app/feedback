"use strict";
/**
 * Server-side helpers for the @gruia/feedback intake contract.
 *
 * The app-local route (Next route handler, node:http endpoint, ...) authenticates
 * the end user however the app does, then calls `forwardFeedbackReport`. This
 * module is the ONLY place that touches the webhook HMAC secret: it never reaches
 * the browser bundle (the file lives behind the `@gruia/feedback/server` export).
 *
 * Identity is server-defined: `appKey`, `environment` and `service` come from the
 * app configuration, never from the client body. Client-supplied `user`,
 * `organization_id`, `project_id`, tenant or actor fields are dropped here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPORT_TYPES = exports.MAX_FEEDBACK_BODY_BYTES = exports.FEEDBACK_TIMESTAMP_HEADER = exports.FEEDBACK_SIGNATURE_HEADER = void 0;
exports.buildSignedReportPayload = buildSignedReportPayload;
exports.signFeedbackPayload = signFeedbackPayload;
exports.forwardFeedbackReport = forwardFeedbackReport;
const node_crypto_1 = require("node:crypto");
exports.FEEDBACK_SIGNATURE_HEADER = "X-Simplia-Bug-Report-Signature";
exports.FEEDBACK_TIMESTAMP_HEADER = "X-Simplia-Bug-Report-Timestamp";
/** Screenshots ride inside the JSON body as data URLs; leave room for one capture plus context. */
exports.MAX_FEEDBACK_BODY_BYTES = 2 * 1024 * 1024;
exports.REPORT_TYPES = ["bug", "suggestion"];
/** Client body fields that may be forwarded upstream. Anything else is dropped. */
const ALLOWED_BODY_FIELDS = new Set([
    "title",
    "description",
    "report_type",
    "severity",
    "route",
    "url",
    "runtime_lane",
    "status_code",
    "error_class",
    "stack",
    "fingerprint",
    "request_id",
    "trace",
    "browser",
    "context",
    "recent_errors",
    "recent_network",
    "recent_api_calls",
    "recent_user_actions",
    "attachments",
]);
function firstHeader(headers, name) {
    if (!headers)
        return undefined;
    const direct = headers[name] ?? headers[name.toLowerCase()];
    return typeof direct === "string" && direct.trim() ? direct.trim() : undefined;
}
/**
 * Validates and re-shapes a raw client JSON body into the upstream webhook payload.
 * Returns the failure status/reason to mirror back to the client.
 */
function buildSignedReportPayload(rawBody, options) {
    if (Buffer.byteLength(rawBody, "utf8") > exports.MAX_FEEDBACK_BODY_BYTES) {
        return { ok: false, status: 413, reason: "Feedback payload too large" };
    }
    let parsed;
    try {
        parsed = JSON.parse(rawBody);
    }
    catch {
        return { ok: false, status: 400, reason: "Invalid JSON" };
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { ok: false, status: 400, reason: "Invalid feedback payload" };
    }
    const body = parsed;
    if (typeof body.title !== "string" || !body.title.trim()) {
        return { ok: false, status: 400, reason: "title is required" };
    }
    const reportType = body.report_type === undefined ? "bug" : String(body.report_type).toLowerCase();
    if (!exports.REPORT_TYPES.includes(reportType)) {
        return { ok: false, status: 400, reason: "report_type must be bug or suggestion" };
    }
    const forwarded = {};
    for (const [key, value] of Object.entries(body)) {
        if (ALLOWED_BODY_FIELDS.has(key))
            forwarded[key] = value;
    }
    if (reportType === "suggestion") {
        // Severity only steers bug triage/auto-feature; suggestions go to the
        // product backlog and must never carry an execution severity upstream.
        delete forwarded.severity;
    }
    forwarded.report_type = reportType;
    const incomingTrace = body.trace && typeof body.trace === "object" && !Array.isArray(body.trace)
        ? body.trace
        : {};
    const traceparent = firstHeader(options.requestHeaders, "traceparent");
    return {
        ok: true,
        payload: {
            ...forwarded,
            app_key: options.appKey,
            environment: options.environment,
            service: options.service || `${options.appKey}-web`,
            request_id: forwarded.request_id ||
                firstHeader(options.requestHeaders, "x-request-id") ||
                firstHeader(options.requestHeaders, "x-correlation-id") ||
                undefined,
            trace: { ...incomingTrace, traceparent: traceparent || incomingTrace.traceparent },
        },
    };
}
function signFeedbackPayload(rawPayload, token, timestamp = String(Math.floor(Date.now() / 1000))) {
    const signature = (0, node_crypto_1.createHmac)("sha256", token).update(`${timestamp}.`).update(rawPayload).digest("hex");
    return { signature: `sha256=${signature}`, timestamp };
}
/**
 * Signs the (already re-shaped) report and POSTs it to the ACV2 webhook.
 * Returns the upstream status and parsed body for the caller to relay.
 */
async function forwardFeedbackReport(rawBody, options) {
    if (!options.token) {
        return { status: 503, body: { processed: false, reason: "feedback webhook token is not configured" } };
    }
    const built = buildSignedReportPayload(rawBody, options);
    if (!built.ok) {
        return { status: built.status, body: { processed: false, reason: built.reason } };
    }
    const rawPayload = JSON.stringify(built.payload);
    const { signature, timestamp } = signFeedbackPayload(rawPayload, options.token);
    const fetchImpl = options.fetchImpl || fetch;
    const base = options.backendUrl.replace(/\/+$/, "");
    const response = await fetchImpl(`${base}/api/v1/webhooks/bug-report${options.dryRun ? "?dry_run=true" : ""}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            [exports.FEEDBACK_SIGNATURE_HEADER]: signature,
            [exports.FEEDBACK_TIMESTAMP_HEADER]: timestamp,
        },
        body: rawPayload,
    });
    const responseBody = await response.json().catch(() => null);
    return { status: response.status, body: responseBody ?? { processed: false } };
}
