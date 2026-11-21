import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  handleClientFeedbackRequest,
  issueClientToken,
  toClientFeedbackItem,
  toClientStatus,
  verifyClientToken,
} from "../dist/esm/portal.js";
import { runCli } from "../dist/esm/cli.js";

const SECRET = "s".repeat(40);
const NOW = 1_800_000_000;

function fakeStore(records = []) {
  const calls = { list: [], create: [] };
  return {
    calls,
    async listByClient(clientId) {
      calls.list.push(clientId);
      // Deliberately leaky store: returns every client's rows.
      return records;
    },
    async createForClient(clientId, payload) {
      calls.create.push({ clientId, payload });
      return { id: 99, client_id: clientId, title: payload.title, report_type: payload.report_type, status: "new" };
    },
  };
}

const RECORDS = [
  {
    id: 1,
    client_id: "acme",
    title: "Checkout falla",
    report_type: "bug",
    severity: "high",
    status: "triaged",
    assignee: "dev@team",
    internal_notes: "root cause in pricing svc",
    stack: "Error at x.js:1",
    fingerprint: "abc",
    comments: [
      { body: "Mirad el svc de precios", visibility: "internal" },
      { body: "secreto", visibility: "public", internal: true },
      { body: "Gracias, lo estamos revisando", visibility: "public", created_at: "2026-11-20T10:00:00Z" },
      { body: "sin visibilidad" },
    ],
  },
  { id: 2, client_id: "globex", title: "Otro cliente", status: "new" },
  { id: 3, client_id: "acme", title: "Modo oscuro", report_type: "suggestion", severity: "critical", status: "wontfix" },
  { id: 4, title: "Sin dueño" },
];

const opts = (store, extra = {}) => ({ store, appKey: "ecommerce", tokenSecret: SECRET, now: () => NOW, ...extra });
const bearer = (clientId, scopes) => ({
  authorization: `Bearer ${issueClientToken(clientId, SECRET, { now: NOW, scopes })}`,
});

describe("client tokens", () => {
  it("round-trips and rejects tampering, wrong secret and expiry", () => {
    const token = issueClientToken("acme", SECRET, { now: NOW, ttlSeconds: 60 });
    assert.deepEqual(verifyClientToken(token, SECRET, NOW), {
      clientId: "acme",
      scopes: ["feedback:list", "feedback:create"],
      expiresAt: NOW + 60,
    });
    assert.equal(verifyClientToken(token, "x".repeat(40), NOW), null);
    assert.equal(verifyClientToken(token, SECRET, NOW + 60), null);
    const [p, body, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "globex", scp: ["feedback:list"], exp: NOW + 60 })).toString(
      "base64url",
    );
    assert.equal(verifyClientToken(`${p}.${forged}.${sig}`, SECRET, NOW), null);
    assert.equal(verifyClientToken(`${p}.${body}`, SECRET, NOW), null);
    assert.equal(verifyClientToken(undefined, SECRET, NOW), null);
  });

  it("validates issue inputs", () => {
    assert.throws(() => issueClientToken("acme", "short"));
    assert.throws(() => issueClientToken("../evil", SECRET));
    assert.throws(() => issueClientToken("acme", SECRET, { ttlSeconds: 365 * 24 * 3600 }));
    assert.throws(() => issueClientToken("acme", SECRET, { scopes: ["feedback:admin"] }));
  });
});

describe("client view", () => {
  it("maps statuses to the client vocabulary", () => {
    assert.equal(toClientStatus(undefined), "received");
    assert.equal(toClientStatus("Triaged"), "in_review");
    assert.equal(toClientStatus("wont-fix"), "declined");
    assert.equal(toClientStatus("some_internal_state"), "in_review");
  });

  it("exposes only allow-listed fields and public replies", () => {
    const item = toClientFeedbackItem(RECORDS[0]);
    assert.deepEqual(Object.keys(item).sort(), ["id", "replies", "report_type", "severity", "status", "title"]);
    assert.deepEqual(item.replies, [{ body: "Gracias, lo estamos revisando", created_at: "2026-11-20T10:00:00Z" }]);
    assert.equal(toClientFeedbackItem(RECORDS[2]).severity, undefined);
  });
});

describe("handleClientFeedbackRequest isolation", () => {
  it("lists only the token owner's reports, ignoring spoofed identity", async () => {
    const store = fakeStore(RECORDS);
    const res = await handleClientFeedbackRequest(
      { method: "GET", headers: { ...bearer("acme"), "x-client-id": "globex" }, body: '{"client_id":"globex"}' },
      opts(store),
    );
    assert.equal(res.status, 200);
    assert.equal(res.headers["Cache-Control"], "no-store");
    assert.deepEqual(store.calls.list, ["acme"]);
    assert.deepEqual(res.body.items.map((i) => i.id), ["1", "3"]);
    const raw = JSON.stringify(res.body);
    for (const leak of ["dev@team", "pricing", "Error at", "secreto", "Mirad", "globex", "client_id"]) {
      assert.equal(raw.includes(leak), false, `leaked ${leak}`);
    }
  });

  it("creates for the token owner and strips client identity fields", async () => {
    const store = fakeStore();
    const res = await handleClientFeedbackRequest(
      {
        method: "POST",
        headers: bearer("acme"),
        body: JSON.stringify({ title: "Nuevo", client_id: "globex", app_key: "other", report_type: "suggestion" }),
      },
      opts(store),
    );
    assert.equal(res.status, 201);
    assert.equal(store.calls.create[0].clientId, "acme");
    assert.equal(store.calls.create[0].payload.client_id, undefined);
    assert.equal(store.calls.create[0].payload.app_key, "ecommerce");
    assert.deepEqual(res.body.item, { id: "99", title: "Nuevo", report_type: "suggestion", status: "received", replies: [] });
  });

  it("rejects missing, bad and under-scoped auth", async () => {
    const store = fakeStore(RECORDS);
    assert.equal((await handleClientFeedbackRequest({ method: "GET", headers: {} }, opts(store))).status, 401);
    const bad = await handleClientFeedbackRequest(
      { method: "GET", headers: { Authorization: "Bearer gfc1.bad.sig" } },
      opts(store, { authenticate: () => "acme" }),
    );
    assert.equal(bad.status, 401, "a bad bearer must not fall back to the session");
    const noSecret = await handleClientFeedbackRequest(
      { method: "GET", headers: bearer("acme") },
      opts(store, { tokenSecret: undefined }),
    );
    assert.equal(noSecret.status, 401);
    const listOnly = await handleClientFeedbackRequest(
      { method: "POST", headers: bearer("acme", ["feedback:list"]), body: '{"title":"x"}' },
      opts(store),
    );
    assert.equal(listOnly.status, 403);
    assert.equal(store.calls.create.length, 0);
    const del = await handleClientFeedbackRequest({ method: "DELETE", headers: bearer("acme") }, opts(store));
    assert.equal(del.status, 405);
    assert.equal(del.headers.Allow, "GET, POST");
  });

  it("supports session auth and validates bodies", async () => {
    const store = fakeStore(RECORDS);
    const session = opts(store, { tokenSecret: undefined, authenticate: () => "globex" });
    const list = await handleClientFeedbackRequest({ method: "GET", headers: {} }, session);
    assert.deepEqual(list.body.items.map((i) => i.id), ["2"]);
    assert.equal((await handleClientFeedbackRequest({ method: "POST", headers: {}, body: "{}" }, session)).status, 400);
    const badType = await handleClientFeedbackRequest(
      { method: "POST", headers: {}, body: '{"title":"x","report_type":"feature"}' },
      session,
    );
    assert.equal(badType.status, 400);
    const denied = opts(store, { tokenSecret: undefined, authenticate: () => "../../etc" });
    assert.equal((await handleClientFeedbackRequest({ method: "GET", headers: {} }, denied)).status, 401);
  });

  it("hides store failures and refuses foreign records from the store", async () => {
    const failing = { listByClient: async () => { throw new Error("db password=hunter2"); }, createForClient: async () => ({}) };
    const res = await handleClientFeedbackRequest({ method: "GET", headers: bearer("acme") }, opts(failing));
    assert.equal(res.status, 502);
    assert.equal(JSON.stringify(res.body).includes("hunter2"), false);
    const foreign = { ...fakeStore(), createForClient: async () => ({ id: 1, client_id: "globex", title: "x" }) };
    const created = await handleClientFeedbackRequest(
      { method: "POST", headers: bearer("acme"), body: '{"title":"x"}' },
      opts(foreign),
    );
    assert.equal(created.status, 502);
  });
});

function cliIO({ env = {}, fetchImpl, files = {} } = {}) {
  const out = [];
  const err = [];
  const requests = [];
  return {
    out,
    err,
    requests,
    io: {
      env,
      stdout: (line) => out.push(line),
      stderr: (line) => err.push(line),
      readFile: (path) => {
        if (!(path in files)) throw new Error("ENOENT");
        return files[path];
      },
      fetchImpl: async (url, init) => {
        requests.push({ url, init });
        if (!fetchImpl) throw new Error("fetch must not be called");
        return fetchImpl(url, init);
      },
    },
  };
}

const ENV = { GRUIA_FEEDBACK_URL: "https://app.example/api/feedback/mine", GRUIA_FEEDBACK_TOKEN: "gfc1.abc.def" };
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("gruia-feedback CLI", () => {
  it("refuses unsafe or invalid invocations before any request", async () => {
    const cases = [
      [["delete"], ENV],
      [["list", "--token", "gfc1.a.b"], ENV],
      [["list", "--admin"], ENV],
      [["list"], { GRUIA_FEEDBACK_URL: ENV.GRUIA_FEEDBACK_URL }],
      [["list"], { ...ENV, GRUIA_FEEDBACK_URL: "http://app.example/x" }],
      [["list"], { ...ENV, GRUIA_FEEDBACK_URL: "https://u:p@app.example/x" }],
      [["create"], ENV],
      [["create", "--title", "x", "--type", "feature"], ENV],
      [["create", "--title", "x", "--type", "suggestion", "--severity", "high"], ENV],
      [["create", "--title", "x", "--severity", "urgent"], ENV],
      [["list", "--token-file", "/missing"], { GRUIA_FEEDBACK_URL: ENV.GRUIA_FEEDBACK_URL }],
    ];
    for (const [argv, env] of cases) {
      const t = cliIO({ env });
      assert.equal(await runCli(argv, t.io), 2, argv.join(" "));
      assert.equal(t.requests.length, 0);
      assert.equal(t.err.length > 0, true);
    }
  });

  it("lists with a bearer token and refuses redirects", async () => {
    const t = cliIO({
      env: { GRUIA_FEEDBACK_URL: "http://localhost:3000/api/feedback/mine" },
      files: { "/tok": "gfc1.from.file\n" },
      fetchImpl: () => json(200, { items: [{ id: "1", title: "Checkout", report_type: "bug", status: "in_review", replies: [{ body: "Visto" }] }] }),
    });
    assert.equal(await runCli(["list", "--token-file", "/tok"], t.io), 0);
    assert.equal(t.requests[0].init.method, "GET");
    assert.equal(t.requests[0].init.redirect, "error");
    assert.equal(t.requests[0].init.headers.Authorization, "Bearer gfc1.from.file");
    assert.deepEqual(t.out, ["#1  [in_review]  bug  Checkout", "    team: Visto"]);
  });

  it("creates a report and maps HTTP errors to exit 1", async () => {
    const t = cliIO({ env: ENV, fetchImpl: () => json(201, { item: { id: "7", status: "received" } }) });
    assert.equal(await runCli(["create", "--title", "Botón roto", "--severity=high", "--description", "No responde"], t.io), 0);
    const body = JSON.parse(t.requests[0].init.body);
    assert.equal(body.title, "Botón roto");
    assert.equal(body.report_type, "bug");
    assert.equal(body.severity, "high");
    assert.deepEqual(t.out, ["created #7 [received]"]);

    const denied = cliIO({ env: ENV, fetchImpl: () => json(401, { reason: "invalid or expired client token" }) });
    assert.equal(await runCli(["list"], denied.io), 1);
    assert.deepEqual(denied.err, ["error 401: invalid or expired client token"]);
  });
});
