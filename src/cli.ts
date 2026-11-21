/**
 * Client CLI for @gruia/feedback (`gruia-feedback`). Two commands only:
 *   list    the reports this client sent, with their status;
 *   create  a new bug or suggestion.
 *
 * The token comes from GRUIA_FEEDBACK_TOKEN or --token-file, never from argv
 * (argv shows up in `ps` and shell history). The endpoint must be https, except
 * for localhost. Redirects are refused so the token never reaches another host.
 *
 * Exit codes: 0 ok, 1 remote or network error, 2 usage or validation error.
 */

import type { ClientFeedbackItem } from "./types.js";

export interface CliIO {
  env: Record<string, string | undefined>;
  stdout: (line: string) => void;
  stderr: (line: string) => void;
  readFile?: (path: string) => string;
  fetchImpl?: typeof fetch;
}

export const CLI_USAGE = `Usage:
  gruia-feedback list   [--url URL] [--token-file PATH] [--json]
  gruia-feedback create --title TEXT [--description TEXT] [--type bug|suggestion]
                        [--severity low|medium|high|critical] [--route PATH]
                        [--url URL] [--token-file PATH] [--json]

Environment:
  GRUIA_FEEDBACK_URL    client feedback endpoint of the app (https)
  GRUIA_FEEDBACK_TOKEN  client token (gfc1...), unless --token-file is given`;

const COMMON_FLAGS = ["url", "token-file", "json", "help"];
const COMMAND_FLAGS: Record<string, string[]> = {
  list: COMMON_FLAGS,
  create: [...COMMON_FLAGS, "title", "description", "type", "severity", "route"],
};
const BOOLEAN_FLAGS = new Set(["json", "help"]);
const SEVERITIES = ["low", "medium", "high", "critical"];
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const TOKEN_RE = /^[A-Za-z0-9._-]{1,2048}$/;

type Flags = Record<string, string | true>;

function parseFlags(args: string[], allowed: string[]): { flags: Flags } | { error: string } {
  const flags: Flags = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--")) return { error: `unexpected argument: ${arg}` };
    const eq = arg.indexOf("=");
    const name = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
    if (name === "token") return { error: "--token is not accepted; use GRUIA_FEEDBACK_TOKEN or --token-file" };
    if (!allowed.includes(name)) return { error: `unknown option: --${name}` };
    if (BOOLEAN_FLAGS.has(name)) {
      if (eq !== -1) return { error: `--${name} takes no value` };
      flags[name] = true;
      continue;
    }
    let value: string | undefined;
    if (eq !== -1) {
      value = arg.slice(eq + 1);
    } else {
      value = args[i + 1];
      if (value === undefined || value.startsWith("--")) return { error: `--${name} needs a value` };
      i++;
    }
    flags[name] = value;
  }
  return { flags };
}

function resolveEndpoint(raw: string | undefined): URL | string {
  if (!raw) return "missing endpoint: set GRUIA_FEEDBACK_URL or pass --url";
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return "invalid endpoint URL";
  }
  if (url.username || url.password) return "credentials inside the URL are not allowed";
  if (url.protocol === "https:") return url;
  if (url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname)) return url;
  return "the endpoint must use https (http only for localhost)";
}

function resolveToken(flags: Flags, io: CliIO): string | { error: string } {
  let token: string | undefined;
  const tokenFile = flags["token-file"];
  if (typeof tokenFile === "string") {
    if (!io.readFile) return { error: "--token-file is not supported here" };
    try {
      token = io.readFile(tokenFile).trim();
    } catch {
      return { error: `cannot read token file: ${tokenFile}` };
    }
  } else {
    token = io.env.GRUIA_FEEDBACK_TOKEN?.trim();
  }
  if (!token) return { error: "missing client token: set GRUIA_FEEDBACK_TOKEN or pass --token-file" };
  if (!TOKEN_RE.test(token)) return { error: "malformed client token" };
  return token;
}

function buildCreateBody(flags: Flags): Record<string, unknown> | { error: string } {
  const title = typeof flags.title === "string" ? flags.title.trim() : "";
  if (!title) return { error: "--title is required" };
  if (title.length > 200) return { error: "--title must have at most 200 characters" };
  const description = typeof flags.description === "string" ? flags.description.trim() : "";
  if (description.length > 5000) return { error: "--description must have at most 5000 characters" };
  const type = typeof flags.type === "string" ? flags.type.toLowerCase() : "bug";
  if (type !== "bug" && type !== "suggestion") return { error: "--type must be bug or suggestion" };
  const severity = typeof flags.severity === "string" ? flags.severity.toLowerCase() : undefined;
  if (severity !== undefined) {
    if (type !== "bug") return { error: "--severity applies only to --type bug" };
    if (!SEVERITIES.includes(severity)) return { error: "--severity must be low, medium, high or critical" };
  }
  const route = typeof flags.route === "string" && flags.route.trim() ? flags.route.trim() : "cli";
  const body: Record<string, unknown> = {
    title,
    report_type: type,
    route,
    url: "cli://gruia-feedback",
    context: { source: "gruia-feedback-cli" },
  };
  if (description) body.description = description;
  if (severity) body.severity = severity;
  return body;
}

function formatItem(item: ClientFeedbackItem): string[] {
  const date = item.updated_at || item.created_at || "";
  const lines = [`#${item.id}  [${item.status}]  ${item.report_type}  ${item.title}${date ? `  (${date})` : ""}`];
  for (const reply of item.replies ?? []) lines.push(`    team: ${reply.body}`);
  return lines;
}

async function callEndpoint(
  io: CliIO,
  url: URL,
  token: string,
  init: { method: "GET" | "POST"; body?: string },
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; message: string }> {
  const fetchImpl = io.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(url.toString(), {
      method: init.method,
      redirect: "error",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body,
    });
  } catch {
    return { ok: false, message: `cannot reach ${url.origin}` };
  }
  const text = await response.text().catch(() => "");
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  const record = data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : {};
  if (!response.ok) {
    const reason = typeof record.reason === "string" ? record.reason : response.statusText || "request failed";
    return { ok: false, message: `error ${response.status}: ${reason}` };
  }
  return { ok: true, data: record };
}

export async function runCli(argv: string[], io: CliIO): Promise<number> {
  const [command, ...rest] = argv;
  if (!command || command === "--help" || command === "help") {
    io.stdout(CLI_USAGE);
    return command ? 0 : 2;
  }
  const allowed = COMMAND_FLAGS[command];
  if (!allowed) {
    io.stderr(`unknown command: ${command}\n\n${CLI_USAGE}`);
    return 2;
  }
  const parsed = parseFlags(rest, allowed);
  if ("error" in parsed) {
    io.stderr(parsed.error);
    return 2;
  }
  const { flags } = parsed;
  if (flags.help) {
    io.stdout(CLI_USAGE);
    return 0;
  }
  const endpoint = resolveEndpoint(typeof flags.url === "string" ? flags.url : io.env.GRUIA_FEEDBACK_URL);
  if (typeof endpoint === "string") {
    io.stderr(endpoint);
    return 2;
  }
  const token = resolveToken(flags, io);
  if (typeof token !== "string") {
    io.stderr(token.error);
    return 2;
  }

  if (command === "list") {
    const result = await callEndpoint(io, endpoint, token, { method: "GET" });
    if (!result.ok) {
      io.stderr(result.message);
      return 1;
    }
    const items = Array.isArray(result.data.items) ? (result.data.items as ClientFeedbackItem[]) : [];
    if (flags.json) {
      io.stdout(JSON.stringify(items, null, 2));
    } else if (!items.length) {
      io.stdout("No reports yet.");
    } else {
      for (const item of items) for (const line of formatItem(item)) io.stdout(line);
    }
    return 0;
  }

  const body = buildCreateBody(flags);
  if ("error" in body) {
    io.stderr(String(body.error));
    return 2;
  }
  const result = await callEndpoint(io, endpoint, token, { method: "POST", body: JSON.stringify(body) });
  if (!result.ok) {
    io.stderr(result.message);
    return 1;
  }
  const item = result.data.item as ClientFeedbackItem | undefined;
  if (flags.json) io.stdout(JSON.stringify(item ?? null, null, 2));
  else io.stdout(item ? `created #${item.id} [${item.status}]` : "created");
  return 0;
}
