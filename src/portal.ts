/**
 * Client follow-up for @gruia/feedback (server only, `@gruia/feedback/portal`).
 *
 * Lets an authenticated client list the reports it sent, with their status, and
 * create new ones. Two ways to authenticate:
 *   - a scoped client token (`Authorization: Bearer gfc1...`), used by the CLI;
 *   - the app's own session, through the `authenticate` callback (browser view).
 *
 * Isolation rules:
 *   - the client id comes only from the token or the session, never from the
 *     query, the body or a custom header;
 *   - records the store returns for another client are dropped (defense in depth);
 *   - the response is an allow-list view: internal comments, assignees, triage
 *     notes, stack traces and any other stored field never leave the server.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { buildSignedReportPayload } from "./server.js";
import type {
  ClientFeedbackItem,
  ClientFeedbackReply,
  ClientFeedbackStatus,
  ReportType,
  Severity,
} from "./types.js";

export const CLIENT_TOKEN_PREFIX = "gfc1";
export const CLIENT_TOKEN_SCOPES = ["feedback:list", "feedback:create"] as const;
export type ClientTokenScope = (typeof CLIENT_TOKEN_SCOPES)[number];

const DEFAULT_TOKEN_TTL_SECONDS = 30 * 24 * 3600;
const MAX_TOKEN_TTL_SECONDS = 90 * 24 * 3600;
const MIN_SECRET_LENGTH = 32;
const MAX_TOKEN_LENGTH = 2048;
const MAX_REPLY_LENGTH = 4000;
const MAX_DESCRIPTION_LENGTH = 5000;
const CLIENT_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,127}$/;
const SEVERITIES: readonly Severity[] = ["low", "medium", "high", "critical"];

export interface ClientTokenClaims {
  clientId: string;
  scopes: ClientTokenScope[];
  expiresAt: number;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function isScope(value: unknown): value is ClientTokenScope {
  return typeof value === "string" && (CLIENT_TOKEN_SCOPES as readonly string[]).includes(value);
}

function tokenSignature(body: string, secret: string): string {
  return createHmac("sha256", secret).update(`${CLIENT_TOKEN_PREFIX}.`).update(body).digest("base64url");
}

export function isValidClientId(value: unknown): value is string {
  return typeof value === "string" && CLIENT_ID_RE.test(value);
}

/**
 * Issues a scoped client token. Use a secret that is NOT the webhook HMAC token.
 * Default scopes: list + create. Default lifetime: 30 days (90 days max).
 */
export function issueClientToken(
  clientId: string,
  secret: string,
  options: { ttlSeconds?: number; scopes?: ClientTokenScope[]; now?: number } = {},
): string {
  if (typeof secret !== "string" || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`client token secret must have at least ${MIN_SECRET_LENGTH} characters`);
  }
  if (!isValidClientId(clientId)) throw new Error("invalid clientId");
  const ttl = options.ttlSeconds ?? DEFAULT_TOKEN_TTL_SECONDS;
  if (!Number.isInteger(ttl) || ttl <= 0 || ttl > MAX_TOKEN_TTL_SECONDS) {
    throw new Error(`ttlSeconds must be an integer between 1 and ${MAX_TOKEN_TTL_SECONDS}`);
  }
  const scopes = options.scopes ?? [...CLIENT_TOKEN_SCOPES];
  if (!scopes.length || !scopes.every(isScope)) throw new Error("invalid scopes");
  const exp = (options.now ?? nowSeconds()) + ttl;
  const body = Buffer.from(JSON.stringify({ sub: clientId, scp: [...new Set(scopes)], exp }), "utf8").toString(
    "base64url",
  );
  return `${CLIENT_TOKEN_PREFIX}.${body}.${tokenSignature(body, secret)}`;
}

/** Returns the claims of a valid, unexpired token, or null. Never throws. */
export function verifyClientToken(
  token: string | undefined,
  secret: string,
  now: number = nowSeconds(),
): ClientTokenClaims | null {
  if (typeof secret !== "string" || secret.length < MIN_SECRET_LENGTH) return null;
  if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LENGTH) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== CLIENT_TOKEN_PREFIX || !parts[1] || !parts[2]) return null;
  const [, body, signature] = parts;
  const expected = Buffer.from(tokenSignature(body, secret), "utf8");
  const received = Buffer.from(signature, "utf8");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  let claims: unknown;
  try {
    claims = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!claims || typeof claims !== "object" || Array.isArray(claims)) return null;
  const { sub, scp, exp } = claims as Record<string, unknown>;
  if (!isValidClientId(sub)) return null;
  if (typeof exp !== "number" || !Number.isInteger(exp) || exp <= now) return null;
  if (!Array.isArray(scp) || !scp.length || !scp.every(isScope)) return null;
  return { clientId: sub, scopes: scp, expiresAt: exp };
}

const STATUS_MAP: Record<string, ClientFeedbackStatus> = {
  new: "received",
  open: "received",
  pending: "received",
  received: "received",
  triage: "in_review",
  triaged: "in_review",
  in_review: "in_review",
  investigating: "in_review",
  needs_info: "in_review",
  accepted: "planned",
  backlog: "planned",
  planned: "planned",
  queued: "planned",
  in_progress: "in_progress",
  running: "in_progress",
  fixing: "in_progress",
  done: "resolved",
  fixed: "resolved",
  deployed: "resolved",
  resolved: "resolved",
  closed: "closed",
  duplicate: "closed",
  declined: "declined",
  rejected: "declined",
  wontfix: "declined",
  wont_fix: "declined",
};

/** Maps an internal status to the client vocabulary. Unknown states show as "in_review". */
export function toClientStatus(raw: unknown): ClientFeedbackStatus {
  if (raw === undefined || raw === null || raw === "") return "received";
  const key = String(raw).trim().toLowerCase().replace(/[\s-]+/g, "_");
  return STATUS_MAP[key] ?? "in_review";
}

/** Shape the app store returns. Extra fields are allowed and are never exposed. */
export interface FeedbackRecord {
  id: string | number;
  client_id: string;
  title?: unknown;
  report_type?: unknown;
  status?: unknown;
  severity?: unknown;
  description?: unknown;
  route?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
  /** Only entries with `visibility: "public"` (and not `internal: true`) reach the client. */
  comments?: unknown;
  [key: string]: unknown;
}

function optionalString(value: unknown, maxLength = 512): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function publicReplies(comments: unknown): ClientFeedbackReply[] {
  if (!Array.isArray(comments)) return [];
  const replies: ClientFeedbackReply[] = [];
  for (const comment of comments) {
    if (!comment || typeof comment !== "object") continue;
    const entry = comment as Record<string, unknown>;
    // Default deny: a comment is public only when the team said so explicitly.
    if (entry.visibility !== "public" || entry.internal === true) continue;
    const body = optionalString(entry.body, MAX_REPLY_LENGTH);
    if (!body) continue;
    const reply: ClientFeedbackReply = { body };
    const createdAt = optionalString(entry.created_at, 64);
    if (createdAt) reply.created_at = createdAt;
    replies.push(reply);
  }
  return replies;
}

/** Builds the client view of one stored record (allow-list). */
export function toClientFeedbackItem(record: FeedbackRecord): ClientFeedbackItem {
  const reportType: ReportType = String(record.report_type ?? "").toLowerCase() === "suggestion" ? "suggestion" : "bug";
  const item: ClientFeedbackItem = {
    id: String(record.id),
    title: optionalString(record.title, 300) ?? "",
    report_type: reportType,
    status: toClientStatus(record.status),
    replies: publicReplies(record.comments),
  };
  const severity = String(record.severity ?? "").toLowerCase() as Severity;
  if (reportType === "bug" && SEVERITIES.includes(severity)) item.severity = severity;
  const description = optionalString(record.description, MAX_DESCRIPTION_LENGTH);
  if (description) item.description = description;
  const route = optionalString(record.route);
  if (route) item.route = route;
  const createdAt = optionalString(record.created_at, 64);
  if (createdAt) item.created_at = createdAt;
  const updatedAt = optionalString(record.updated_at, 64);
  if (updatedAt) item.updated_at = updatedAt;
  return item;
}

function ownsRecord(record: unknown, clientId: string): record is FeedbackRecord {
  if (!record || typeof record !== "object") return false;
  const entry = record as Record<string, unknown>;
  const idOk = typeof entry.id === "string" || typeof entry.id === "number";
  return idOk && typeof entry.client_id === "string" && entry.client_id === clientId;
}

/** Persistence the app provides. Both calls receive the authenticated client id only. */
export interface ClientFeedbackStore {
  listByClient(clientId: string): Promise<unknown[]>;
  /** `payload` is the validated, identity-stripped report (same shape as the webhook payload). */
  createForClient(clientId: string, payload: Record<string, unknown>): Promise<unknown>;
}

export interface ClientFeedbackRequest {
  method: string;
  headers: Record<string, string | undefined>;
  body?: string;
}

export interface ClientFeedbackResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

export interface ClientFeedbackHandlerOptions {
  store: ClientFeedbackStore;
  /** Canonical app_key asserted server-side for created reports. */
  appKey: string;
  environment?: string;
  service?: string;
  /** Secret for Bearer client tokens (CLI). Without it, Bearer auth is rejected. */
  tokenSecret?: string;
  /** Session auth for the browser view. Returns the client id, or null. */
  authenticate?: (request: ClientFeedbackRequest) => Promise<string | null> | string | null;
  /** Upper bound on listed items (default 200). */
  maxItems?: number;
  /** Clock override for tests (seconds). */
  now?: () => number;
}

function headerValue(headers: Record<string, string | undefined>, name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === lower && typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function reply(status: number, body: unknown, extraHeaders: Record<string, string> = {}): ClientFeedbackResponse {
  return {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extraHeaders },
    body,
  };
}

type AuthResult = { ok: true; clientId: string } | { ok: false; response: ClientFeedbackResponse };

async function resolveClient(
  request: ClientFeedbackRequest,
  options: ClientFeedbackHandlerOptions,
  scope: ClientTokenScope,
): Promise<AuthResult> {
  const authorization = headerValue(request.headers, "authorization");
  if (authorization) {
    // An Authorization header is authoritative: a bad token never falls back to the session.
    const match = /^Bearer\s+(\S+)$/i.exec(authorization);
    const claims =
      match && options.tokenSecret
        ? verifyClientToken(match[1], options.tokenSecret, (options.now ?? nowSeconds)())
        : null;
    if (!claims) {
      return {
        ok: false,
        response: reply(401, { processed: false, reason: "invalid or expired client token" }, {
          "WWW-Authenticate": "Bearer",
        }),
      };
    }
    if (!claims.scopes.includes(scope)) {
      return { ok: false, response: reply(403, { processed: false, reason: `token lacks scope ${scope}` }) };
    }
    return { ok: true, clientId: claims.clientId };
  }
  if (options.authenticate) {
    const clientId = await options.authenticate(request);
    if (isValidClientId(clientId)) return { ok: true, clientId };
  }
  return { ok: false, response: reply(401, { processed: false, reason: "authentication required" }) };
}

/**
 * Framework-neutral handler. GET lists the caller's reports; POST creates one.
 * Wire it into a Next route handler or node:http endpoint (see README).
 */
export async function handleClientFeedbackRequest(
  request: ClientFeedbackRequest,
  options: ClientFeedbackHandlerOptions,
): Promise<ClientFeedbackResponse> {
  const method = String(request.method || "").toUpperCase();
  if (method !== "GET" && method !== "POST") {
    return reply(405, { processed: false, reason: "method not allowed" }, { Allow: "GET, POST" });
  }
  const auth = await resolveClient(request, options, method === "GET" ? "feedback:list" : "feedback:create");
  if (!auth.ok) return auth.response;
  const { clientId } = auth;

  if (method === "GET") {
    let records: unknown[];
    try {
      records = await options.store.listByClient(clientId);
    } catch {
      return reply(502, { processed: false, reason: "feedback store unavailable" });
    }
    const maxItems = Math.max(1, Math.min(options.maxItems ?? 200, 1000));
    const items = (Array.isArray(records) ? records : [])
      .filter((record): record is FeedbackRecord => ownsRecord(record, clientId))
      .slice(0, maxItems)
      .map(toClientFeedbackItem);
    return reply(200, { items, count: items.length });
  }

  const built = buildSignedReportPayload(request.body ?? "", {
    appKey: options.appKey,
    environment: options.environment,
    service: options.service,
    requestHeaders: request.headers,
  });
  if (!built.ok) return reply(built.status, { processed: false, reason: built.reason });
  let created: unknown;
  try {
    created = await options.store.createForClient(clientId, built.payload);
  } catch {
    return reply(502, { processed: false, reason: "feedback store unavailable" });
  }
  if (!ownsRecord(created, clientId)) {
    return reply(502, { processed: false, reason: "feedback store returned an invalid record" });
  }
  return reply(201, { processed: true, item: toClientFeedbackItem(created) });
}
