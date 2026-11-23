import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { summarizeClientFeedback } from "../dist/esm/clientSummary.js";
import { createClientSummaryHandler } from "../dist/esm/clientSummaryServer.js";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

let recSeq = 0;
const rec = (over = {}) => ({
  id: `rec-${++recSeq}`,
  kind: "csat_survey",
  clientId: "cli-a",
  occurredAt: "2025-06-01T10:00:00.000Z",
  ...over,
});

const DAY_MS = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// summarizeClientFeedback
// ---------------------------------------------------------------------------

describe("summarizeClientFeedback - csat", () => {
  it("aggregates valid 1-10 scores into responses/index/averageScore", () => {
    const records = [
      rec({ score: 8 }),
      rec({ score: 9 }),
      rec({ score: 10 }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.csat.responses, 3);
    assert.equal(summary.csat.index, 90);
    assert.equal(summary.csat.averageScore, 9);
    assert.equal(summary.csat.scaleMax, 10);
  });

  it("ignores out-of-range and non-numeric csat scores", () => {
    const records = [
      rec({ score: 8 }),
      rec({ score: 9 }),
      rec({ score: 10 }),
      rec({ score: 0 }),
      rec({ score: 11 }),
      rec({ score: "x" }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.csat.responses, 3);
    assert.equal(summary.csat.index, 90);
    assert.equal(summary.csat.averageScore, 9);
  });

  it("returns responses=0 and index=null when there are no surveys", () => {
    const summary = summarizeClientFeedback([]);
    assert.equal(summary.csat.responses, 0);
    assert.equal(summary.csat.index, null);
    assert.equal(summary.csat.averageScore, null);
  });
});

describe("summarizeClientFeedback - ratings", () => {
  it("counts per-score distribution and averages 1-5 ratings", () => {
    const records = [
      rec({ kind: "rating", score: 5 }),
      rec({ kind: "rating", score: 3 }),
      rec({ kind: "rating", score: 5 }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.ratings.count, 3);
    assert.deepEqual(summary.ratings.distribution, {
      "1": 0,
      "2": 0,
      "3": 1,
      "4": 0,
      "5": 2,
    });
    assert.equal(summary.ratings.averageScore, 4.3);
  });
});

describe("summarizeClientFeedback - incidents", () => {
  it("counts total/open/resolved across known resolved statuses", () => {
    const records = [
      rec({ kind: "incident", status: "open" }),
      rec({ kind: "incident", status: "resolved" }),
      rec({ kind: "incident" }), // no status -> open
      rec({ kind: "incident", status: "closed" }),
      rec({ kind: "incident", status: "CANCELLED" }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.incidents.total, 5);
    assert.equal(summary.incidents.resolved, 3);
    assert.equal(summary.incidents.open, 2);
  });
});

describe("summarizeClientFeedback - approvals", () => {
  it("counts approval statuses and computes approvalRate", () => {
    const records = [
      rec({ kind: "deliverable_approval", status: "approved" }),
      rec({ kind: "deliverable_approval", status: "pending" }),
      rec({ kind: "deliverable_approval", status: "rejected" }),
      rec({ kind: "deliverable_approval", status: "changes_requested" }),
      rec({ kind: "deliverable_approval" }), // no status -> pending
    ];
    const summary = summarizeClientFeedback(records);
    const approvals = summary.approvals;
    assert.equal(approvals.total, 5);
    assert.equal(approvals.approved, 1);
    assert.equal(approvals.pending, 2);
    assert.equal(approvals.rejected, 2);
    // approvalRate = approved/total as a percentage, rounded.
    assert.equal(approvals.approvalRate, 20);
  });

  it("accepts Spanish status aliases", () => {
    const records = [
      rec({ kind: "deliverable_approval", status: "aprobado" }),
      rec({ kind: "deliverable_approval", status: "rechazado" }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.approvals.approved, 1);
    assert.equal(summary.approvals.rejected, 1);
    assert.equal(summary.approvals.approvalRate, 50);
  });

  it("returns approvalRate=null when there are no approvals", () => {
    const summary = summarizeClientFeedback([rec({ score: 5 })]);
    assert.equal(summary.approvals.total, 0);
    assert.equal(summary.approvals.approvalRate, null);
  });
});

describe("summarizeClientFeedback - estado and period", () => {
  it("always reports estado=borrador", () => {
    const summary = summarizeClientFeedback([rec({ score: 7 })]);
    assert.equal(summary.estado, "borrador");
  });

  it("derives period from min/max occurredAt when no options are given", () => {
    const records = [
      rec({ score: 7, occurredAt: "2025-03-05T12:00:00.000Z" }),
      rec({ kind: "rating", score: 4, occurredAt: "2025-01-10T08:30:00.000Z" }),
      rec({ kind: "incident", status: "open", occurredAt: "2025-02-20T00:00:00.000Z" }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.period.from, "2025-01-10T08:30:00.000Z");
    assert.equal(summary.period.to, "2025-03-05T12:00:00.000Z");
  });

  it("respects options.from/options.to when provided", () => {
    const records = [rec({ score: 7, occurredAt: "2025-03-05T12:00:00.000Z" })];
    const summary = summarizeClientFeedback(records, {
      from: "2025-01-01",
      to: "2025-01-31",
    });
    assert.equal(summary.period.from, "2025-01-01");
    assert.equal(summary.period.to, "2025-01-31");
  });
});

describe("summarizeClientFeedback - scoping and garbage tolerance", () => {
  it("drops records from other clients when options.clientId is set", () => {
    const records = [
      rec({ score: 9, clientId: "cli-a" }),
      rec({ score: 1, clientId: "cli-b" }),
      rec({ kind: "incident", status: "open", clientId: "cli-b" }),
    ];
    const summary = summarizeClientFeedback(records, { clientId: "cli-a" });
    assert.equal(summary.clientId, "cli-a");
    assert.equal(summary.csat.responses, 1);
    assert.equal(summary.csat.averageScore, 9);
    assert.equal(summary.incidents.total, 0);
  });

  it("ignores null records, unknown kinds and malformed entries", () => {
    const records = [
      null,
      undefined,
      "garbage",
      { kind: "other" },
      { kind: "csat" }, // unknown kind
      { kind: "rating", score: "high" },
      rec({ score: 6 }),
    ];
    const summary = summarizeClientFeedback(records);
    assert.equal(summary.csat.responses, 1);
    assert.equal(summary.csat.averageScore, 6);
    assert.equal(summary.estado, "borrador");
  });
});

// ---------------------------------------------------------------------------
// createClientSummaryHandler
// ---------------------------------------------------------------------------

const makeBackend = (over = {}) => {
  const calls = { auth: [], list: [] };
  const backend = {
    async authenticateClient(token) {
      calls.auth.push(token);
      return { ok: true, clientId: "cli-a" };
    },
    async listFeedbackRecords(clientId, range) {
      calls.list.push({ clientId, range });
      return [];
    },
    calls,
    ...over,
  };
  return backend;
};

const req = (query = {}, headers = {}) => ({ query, headers });
const authHeaders = (token) => ({ authorization: `Bearer ${token}` });

describe("createClientSummaryHandler - auth", () => {
  it("returns 401 missing_client_token without credentials", async () => {
    const handler = createClientSummaryHandler(makeBackend());
    const res = await handler(req());
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "missing_client_token");
  });

  it("returns 401 for an empty bearer token", async () => {
    const handler = createClientSummaryHandler(makeBackend());
    const res = await handler(req({}, { authorization: "Bearer   " }));
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "missing_client_token");
  });

  it("accepts the token via x-client-token header", async () => {
    const backend = makeBackend();
    const handler = createClientSummaryHandler(backend);
    const res = await handler(req({}, { "x-client-token": "tok-x" }));
    assert.equal(res.status, 200);
    assert.deepEqual(backend.calls.auth, ["tok-x"]);
  });

  it("returns 401 client_auth_failed when authenticateClient fails", async () => {
    const backend = makeBackend({
      async authenticateClient() {
        return { ok: false, reason: "unknown token" };
      },
    });
    const handler = createClientSummaryHandler(backend);
    // client_id in the query must not influence authentication.
    const res = await handler(req({ client_id: "cli-b" }, authHeaders("bad-token")));
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "client_auth_failed");
    assert.equal(backend.calls.list.length, 0);
  });

  it("returns 401 (not 500) when authenticateClient throws", async () => {
    const backend = makeBackend({
      async authenticateClient() {
        throw new Error("auth backend down");
      },
    });
    const handler = createClientSummaryHandler(backend);
    const res = await handler(req({}, authHeaders("tok")));
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "client_auth_failed");
  });
});

describe("createClientSummaryHandler - aggregation and isolation", () => {
  it("aggregates only the authenticated client's records", async () => {
    const records = [
      rec({ score: 10, clientId: "cli-a" }),
      rec({ score: 8, clientId: "cli-a" }),
      rec({ score: 1, clientId: "cli-b" }), // foreign record
      rec({ kind: "incident", status: "open", clientId: "cli-b" }), // foreign
      rec({ kind: "deliverable_approval", status: "approved", clientId: "cli-a" }),
    ];
    const backend = makeBackend();
    backend.listFeedbackRecords = async (clientId, range) => {
      backend.calls.list.push({ clientId, range });
      return records;
    };
    const handler = createClientSummaryHandler(backend);
    // client_id=cli-b in the query must be ignored: auth decides the tenant.
    const res = await handler(req({ client_id: "cli-b" }, authHeaders("tok-a")));
    assert.equal(res.status, 200);
    assert.equal(res.body.ok, true);
    const summary = res.body.resumen;
    assert.equal(summary.clientId, "cli-a");
    assert.equal(summary.csat.responses, 2);
    assert.equal(summary.csat.averageScore, 9);
    assert.equal(summary.incidents.total, 0);
    assert.equal(summary.approvals.total, 1);
    assert.equal(summary.approvals.approved, 1);
    // The backend was queried for cli-a only; foreign records are discarded.
    assert.equal(backend.calls.list.length, 1);
    assert.equal(backend.calls.list[0].clientId, "cli-a");
    assert.equal(res.body.meta.recordsDescartados, 2);
  });

  it("returns a draft summary body without raw records or tokens", async () => {
    const records = [
      rec({
        score: 9,
        clientId: "cli-a",
        comment: "RAW_RECORD_MARKER_do-not-leak",
      }),
    ];
    const backend = makeBackend({
      async listFeedbackRecords() {
        return records;
      },
    });
    const handler = createClientSummaryHandler(backend);
    const res = await handler(req({}, authHeaders("super-secret-token-123")));
    assert.equal(res.status, 200);
    const body = res.body;
    assert.equal(body.ok, true);
    assert.equal(body.resumen.estado, "borrador");
    assert.equal(typeof body.nota, "string");
    assert.ok(body.nota.length > 0);
    const raw = JSON.stringify(body);
    assert.ok(!raw.includes("RAW_RECORD_MARKER_do-not-leak"));
    assert.ok(!raw.includes("super-secret-token-123"));
    assert.ok(!raw.includes('"records"'));
  });
});

describe("createClientSummaryHandler - store errors", () => {
  it("returns 502 feedback_store_unavailable when listFeedbackRecords throws", async () => {
    const backend = makeBackend({
      async listFeedbackRecords() {
        throw new Error("db gone");
      },
    });
    const handler = createClientSummaryHandler(backend);
    const res = await handler(req({}, authHeaders("tok")));
    assert.equal(res.status, 502);
    assert.equal(res.body.error, "feedback_store_unavailable");
  });
});

describe("createClientSummaryHandler - range handling", () => {
  it("propagates valid from/to query params to the backend", async () => {
    const backend = makeBackend();
    const handler = createClientSummaryHandler(backend);
    const res = await handler(
      req({ from: "2025-01-01", to: "2025-01-31" }, authHeaders("tok")),
    );
    assert.equal(res.status, 200);
    assert.equal(backend.calls.list.length, 1);
    const range = backend.calls.list[0].range;
    assert.ok(range.from.startsWith("2025-01-01"));
    assert.ok(range.to.startsWith("2025-01-31"));
  });

  it("returns 400 invalid_range for a malformed from param", async () => {
    const backend = makeBackend();
    const handler = createClientSummaryHandler(backend);
    const res = await handler(
      req({ from: "no-es-fecha", to: "2025-01-31" }, authHeaders("tok")),
    );
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "invalid_range");
    assert.equal(backend.calls.list.length, 0);
  });

  it("returns 400 invalid_range when from is after to", async () => {
    const backend = makeBackend();
    const handler = createClientSummaryHandler(backend);
    const res = await handler(
      req({ from: "2025-12-31", to: "2025-01-01" }, authHeaders("tok")),
    );
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "invalid_range");
  });

  it("clips ranges wider than maxRangeDays before calling the backend", async () => {
    const backend = makeBackend();
    const handler = createClientSummaryHandler(backend, { maxRangeDays: 30 });
    const res = await handler(
      req({ from: "2025-01-01", to: "2025-12-31" }, authHeaders("tok")),
    );
    assert.equal(res.status, 200);
    assert.equal(backend.calls.list.length, 1);
    const range = backend.calls.list[0].range;
    const fromMs = Date.parse(range.from);
    const toMs = Date.parse(range.to);
    assert.ok(Number.isFinite(fromMs) && Number.isFinite(toMs));
    assert.ok(toMs - fromMs <= 30 * DAY_MS + 1000);
    // The window keeps the most recent end and moves `from` forward.
    assert.ok(fromMs > Date.parse("2025-01-01"));
    assert.equal(range.to.slice(0, 10), "2025-12-31");
  });
});
