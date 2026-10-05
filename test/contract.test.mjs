import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseTraceparent, sanitizeText, sanitizeUrl } from "../dist/esm/index.js";
import {
  MAX_FEEDBACK_BODY_BYTES,
  buildSignedReportPayload,
  forwardFeedbackReport,
  signFeedbackPayload,
} from "../dist/esm/server.js";

describe("sanitize", () => {
  it("redacts secret-looking key/value pairs", () => {
    assert.equal(sanitizeText("token=abc123 ok"), "token=[REDACTED] ok");
    assert.match(sanitizeText("Authorization: Bearer xyz"), /Bearer \[REDACTED\]|auth[^=]*=\[REDACTED\]/i);
  });

  it("redacts sensitive query params but keeps the rest", () => {
    const url = sanitizeUrl("https://app.example/path?token=abc&view=grid");
    assert.equal(url, "https://app.example/path?token=%5BREDACTED%5D&view=grid");
  });
});

describe("traceparent", () => {
  it("generates and parses W3C traceparents", () => {
    const tp = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01";
    assert.deepEqual(parseTraceparent(tp), {
      trace_id: "4bf92f3577b34da6a3ce929d0e0e4736",
      span_id: "00f067aa0ba902b7",
    });
    assert.equal(parseTraceparent("garbage"), null);
  });
});

describe("buildSignedReportPayload", () => {
  const identity = { appKey: "ecommerce", environment: "preview", service: "ecommerce-web" };

  it("forces server-side identity over client tampering", () => {
    const built = buildSignedReportPayload(
      JSON.stringify({
        title: "x",
        app_key: "autonomous-coding-v2",
        organization_id: "evil",
        user: { id: "spoof" },
        actor: "admin",
      }),
      identity,
    );
    assert.equal(built.ok, true);
    assert.equal(built.payload.app_key, "ecommerce");
    assert.equal(built.payload.user, undefined);
    assert.equal(built.payload.organization_id, undefined);
    assert.equal(built.payload.actor, undefined);
    assert.equal(built.payload.service, "ecommerce-web");
  });

  it("defaults report_type to bug and validates known types", () => {
    const bug = buildSignedReportPayload(JSON.stringify({ title: "x" }), identity);
    assert.equal(bug.payload.report_type, "bug");
    const bad = buildSignedReportPayload(JSON.stringify({ title: "x", report_type: "feature" }), identity);
    assert.equal(bad.ok, false);
    assert.equal(bad.status, 400);
  });

  it("strips severity from suggestions so they can never auto-create a feature", () => {
    const built = buildSignedReportPayload(
      JSON.stringify({ title: "idea", report_type: "suggestion", severity: "critical" }),
      identity,
    );
    assert.equal(built.ok, true);
    assert.equal(built.payload.report_type, "suggestion");
    assert.equal(built.payload.severity, undefined);
  });

  it("preserves the incoming traceparent into payload.trace", () => {
    const tp = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01";
    const built = buildSignedReportPayload(JSON.stringify({ title: "x" }), {
      ...identity,
      requestHeaders: { traceparent: tp },
    });
    assert.equal(built.payload.trace.traceparent, tp);
  });

  it("rejects oversize bodies and missing titles", () => {
    const big = buildSignedReportPayload("x".repeat(MAX_FEEDBACK_BODY_BYTES + 1), identity);
    assert.equal(big.status, 413);
    const noTitle = buildSignedReportPayload(JSON.stringify({ description: "d" }), identity);
    assert.equal(noTitle.status, 400);
  });
});

describe("forwardFeedbackReport", () => {
  it("signs the exact forwarded bytes with the per-app token", async () => {
    let captured;
    const fetchImpl = async (url, init) => {
      captured = { url, init };
      return new Response(JSON.stringify({ processed: true }), { status: 200 });
    };
    const result = await forwardFeedbackReport(JSON.stringify({ title: "bug" }), {
      token: "tok",
      backendUrl: "https://coding.gruia.app",
      appKey: "ecommerce",
      fetchImpl,
    });
    assert.equal(result.status, 200);
    assert.equal(captured.url, "https://coding.gruia.app/api/v1/webhooks/bug-report");
    const timestamp = captured.init.headers["X-Simplia-Bug-Report-Timestamp"];
    const { signature } = signFeedbackPayload(captured.init.body, "tok", timestamp);
    assert.equal(captured.init.headers["X-Simplia-Bug-Report-Signature"], signature);
    assert.equal(JSON.parse(captured.init.body).app_key, "ecommerce");
  });

  it("fails closed without a configured token", async () => {
    const result = await forwardFeedbackReport(JSON.stringify({ title: "bug" }), {
      token: "",
      backendUrl: "https://coding.gruia.app",
      appKey: "ecommerce",
    });
    assert.equal(result.status, 503);
  });
});
