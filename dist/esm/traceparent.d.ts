/** Generates a W3C traceparent (version 00, sampled) for one feedback submission. */
export declare function generateTraceparent(): string;
export declare function parseTraceparent(value: string): {
    trace_id: string;
    span_id: string;
} | null;
