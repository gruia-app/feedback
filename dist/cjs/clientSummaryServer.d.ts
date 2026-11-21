/**
 * Bounded endpoint for exposing a "gestor" (client) the feed of ratings,
 * CSAT, incidents and deliverable approvals for their own tenant.
 *
 * Framework-agnostic: it receives a plain request object and returns a plain
 * response object, so any host app (Express, Next, edge worker, test harness)
 * can wrap it without this module depending on any framework.
 *
 * Multi-tenant isolation is fail-closed: the clientId is resolved ONLY from
 * the client token via `authenticateClient`. Query/body tenant identifiers are
 * ignored by design. The summary is always returned in `"borrador"` state and
 * requires human review before being sent to the client.
 */
import type { ClientFeedbackRecord } from "./clientSummary.js";
/** Successful authentication result for a client token. */
export interface ClientAuthSuccess {
    ok: true;
    clientId: string;
}
/** Failed authentication result for a client token. */
export interface ClientAuthFailure {
    ok: false;
    reason: string;
}
/** Result of resolving a client token to a tenant clientId. */
export type ClientAuthResult = ClientAuthSuccess | ClientAuthFailure;
/**
 * Backend de datos inyectado por la app (BD, API interna, etc.). NUNCA hardcodear.
 */
export interface ClientSummaryBackend {
    /**
     * Resuelve el token de cliente a un clientId de tenant. Debe ser fail-closed.
     */
    authenticateClient(token: string): Promise<ClientAuthResult>;
    /**
     * Devuelve SOLO records del clientId dado; el handler además filtra defensivamente.
     */
    listFeedbackRecords(clientId: string, range: {
        from?: string;
        to?: string;
    }): Promise<ClientFeedbackRecord[]>;
}
/** Plain request object accepted by the handler. */
export interface ClientSummaryRequest {
    headers?: Record<string, string | undefined>;
    query?: Record<string, string | undefined>;
}
/** Plain response object returned by the handler. */
export interface ClientSummaryResponse {
    status: number;
    body: Record<string, unknown>;
}
/** Tunables for the handler. */
export interface ClientSummaryHandlerOptions {
    /** Días hacia atrás por defecto para acotar el rango si no viene en query. Default 90. */
    defaultRangeDays?: number;
    /** Rango máximo permitido en días. Default 366. */
    maxRangeDays?: number;
}
/**
 * Creates the bounded client summary handler.
 *
 * Guarantees:
 * - Fail-closed auth: no token -> 401; backend auth errors -> 401 (never 500).
 * - Tenant isolation: clientId comes ONLY from `authenticateClient`; tenant
 *   identifiers in query are ignored.
 * - Range validation: ISO `from`/`to` in query, clamped to `maxRangeDays`.
 * - Defense in depth: records whose `clientId` does not match are dropped.
 * - Fail-safe backend: `listFeedbackRecords` errors -> 502.
 */
export declare function createClientSummaryHandler(backend: ClientSummaryBackend, options?: ClientSummaryHandlerOptions): (request: ClientSummaryRequest) => Promise<ClientSummaryResponse>;
