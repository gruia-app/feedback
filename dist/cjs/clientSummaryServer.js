"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientSummaryHandler = createClientSummaryHandler;
const clientSummary_js_1 = require("./clientSummary.js");
const DEFAULT_RANGE_DAYS = 90;
const DEFAULT_MAX_RANGE_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function response(status, body) {
    return { status, body };
}
function findHeader(headers, wanted) {
    for (const [name, value] of Object.entries(headers)) {
        if (name.toLowerCase() === wanted && typeof value === "string") {
            return value;
        }
    }
    return undefined;
}
/**
 * Extracts the client token from request headers.
 * Looks for `authorization: Bearer <token>` (case-insensitive header name)
 * and falls back to `x-client-token`. Returns the trimmed token or null.
 */
function extractToken(headers) {
    const auth = findHeader(headers, "authorization");
    if (auth) {
        const match = /^Bearer\s+(.+)$/i.exec(auth.trim());
        if (match && match[1].trim()) {
            return match[1].trim();
        }
    }
    const fallback = findHeader(headers, "x-client-token");
    if (fallback) {
        const trimmed = fallback.trim();
        if (trimmed) {
            return trimmed;
        }
    }
    return null;
}
function parseIsoParam(value) {
    if (value === undefined || value.trim() === "") {
        return { ok: true, value: "" };
    }
    const trimmed = value.trim();
    if (Number.isNaN(Date.parse(trimmed))) {
        return { ok: false };
    }
    return { ok: true, value: trimmed };
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
function createClientSummaryHandler(backend, options) {
    const defaultRangeDays = options?.defaultRangeDays ?? DEFAULT_RANGE_DAYS;
    const maxRangeDays = options?.maxRangeDays ?? DEFAULT_MAX_RANGE_DAYS;
    return async (request) => {
        const headers = isRecord(request?.headers)
            ? request.headers
            : {};
        const query = isRecord(request?.query)
            ? request.query
            : {};
        // 1-3. Token extraction and authentication (fail-closed).
        const token = extractToken(headers);
        if (!token) {
            return response(401, { ok: false, error: "missing_client_token" });
        }
        let authResult;
        try {
            authResult = await backend.authenticateClient(token);
        }
        catch {
            return response(401, { ok: false, error: "client_auth_failed" });
        }
        if (!authResult || !authResult.ok) {
            return response(401, { ok: false, error: "client_auth_failed" });
        }
        const clientId = authResult.clientId;
        // 4. Tenant identifiers in query are intentionally ignored: clientId only
        //    comes from authenticateClient.
        // 5. Range parsing and clamping.
        const fromParam = parseIsoParam(query.from);
        const toParam = parseIsoParam(query.to);
        if (!fromParam.ok || !toParam.ok) {
            return response(400, { ok: false, error: "invalid_range" });
        }
        const nowMs = Date.now();
        let fromMs;
        let toMs;
        if (fromParam.value && toParam.value) {
            fromMs = Date.parse(fromParam.value);
            toMs = Date.parse(toParam.value);
        }
        else if (fromParam.value) {
            fromMs = Date.parse(fromParam.value);
            toMs = nowMs;
        }
        else if (toParam.value) {
            toMs = Date.parse(toParam.value);
            fromMs = toMs - defaultRangeDays * DAY_MS;
        }
        else {
            toMs = nowMs;
            fromMs = nowMs - defaultRangeDays * DAY_MS;
        }
        if (fromMs > toMs) {
            return response(400, { ok: false, error: "invalid_range" });
        }
        if (toMs - fromMs > maxRangeDays * DAY_MS) {
            fromMs = toMs - maxRangeDays * DAY_MS;
        }
        const from = new Date(fromMs).toISOString();
        const to = new Date(toMs).toISOString();
        // 6-7. Fetch records and filter defensively by tenant.
        let records;
        try {
            records = await backend.listFeedbackRecords(clientId, { from, to });
        }
        catch {
            return response(502, { ok: false, error: "feedback_store_unavailable" });
        }
        if (!Array.isArray(records)) {
            records = [];
        }
        const ownRecords = records.filter((record) => !!record &&
            isRecord(record) &&
            typeof record.clientId === "string" &&
            record.clientId === clientId);
        const discardedCount = records.length - ownRecords.length;
        const resumen = (0, clientSummary_js_1.summarizeClientFeedback)(ownRecords, {
            from,
            to,
            clientId,
        });
        const body = {
            ok: true,
            resumen,
            generado_en: new Date().toISOString(),
            nota: "Resumen en estado borrador; requiere revision humana antes de enviarse al cliente.",
        };
        if (discardedCount > 0) {
            body.meta = { recordsDescartados: discardedCount };
        }
        return response(200, body);
    };
}
