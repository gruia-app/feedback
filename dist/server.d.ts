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
export declare const FEEDBACK_SIGNATURE_HEADER = "X-Simplia-Bug-Report-Signature";
export declare const FEEDBACK_TIMESTAMP_HEADER = "X-Simplia-Bug-Report-Timestamp";
/** Screenshots ride inside the JSON body as data URLs; leave room for one capture plus context. */
export declare const MAX_FEEDBACK_BODY_BYTES: number;
export declare const REPORT_TYPES: readonly ["bug", "suggestion"];
export interface FeedbackForwardOptions {
    /** Per-app webhook signing secret (BUG_REPORT_WEBHOOK_TOKENS_JSON entry). */
    token: string;
    /** ACV2 backend base URL, e.g. https://coding.gruia.app */
    backendUrl: string;
    /** Canonical app_key asserted by this app; overrides any client-supplied value. */
    appKey: string;
    /** Deployment environment (prod|stable|preview|dev); defaults applied upstream. */
    environment?: string;
    /** Service name reported upstream, e.g. "ecommerce-web". */
    service?: string;
    /** Incoming request headers (for traceparent / request id propagation). */
    requestHeaders?: Record<string, string | undefined>;
    /** Forward to `?dry_run=true` for intake smoke tests. */
    dryRun?: boolean;
    /** fetch implementation (defaults to global fetch). */
    fetchImpl?: typeof fetch;
}
export interface FeedbackForwardResult {
    status: number;
    body: unknown;
}
/**
 * Validates and re-shapes a raw client JSON body into the upstream webhook payload.
 * Returns the failure status/reason to mirror back to the client.
 */
export declare function buildSignedReportPayload(rawBody: string, options: Pick<FeedbackForwardOptions, "appKey" | "environment" | "service" | "requestHeaders">): {
    ok: true;
    payload: Record<string, unknown>;
} | {
    ok: false;
    status: number;
    reason: string;
};
export declare function signFeedbackPayload(rawPayload: string, token: string, timestamp?: string): {
    signature: string;
    timestamp: string;
};
/**
 * Signs the (already re-shaped) report and POSTs it to the ACV2 webhook.
 * Returns the upstream status and parsed body for the caller to relay.
 */
export declare function forwardFeedbackReport(rawBody: string, options: FeedbackForwardOptions): Promise<FeedbackForwardResult>;
