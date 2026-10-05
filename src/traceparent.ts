const TRACEPARENT_RE = /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/;

function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Generates a W3C traceparent (version 00, sampled) for one feedback submission. */
export function generateTraceparent(): string {
  return `00-${randomHex(16)}-${randomHex(8)}-01`;
}

export function parseTraceparent(value: string): { trace_id: string; span_id: string } | null {
  if (!TRACEPARENT_RE.test(value)) return null;
  return { trace_id: value.slice(3, 35), span_id: value.slice(36, 52) };
}
