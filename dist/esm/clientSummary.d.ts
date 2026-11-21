/**
 * Aggregates feedback records for a single client into a draft summary.
 * Pure and deterministic: no clocks, no I/O, no external dependencies.
 */
export type FeedbackRecordKind = "rating" | "csat_survey" | "incident" | "deliverable_approval";
export interface ClientFeedbackRecord {
    id: string;
    clientId: string;
    kind: FeedbackRecordKind;
    /** ISO-8601 timestamp. */
    occurredAt: string;
    /** 1-5 for rating, 1-10 for csat_survey. Ignored otherwise. */
    score?: number;
    /** Free-text comment, already sanitized upstream. */
    comment?: string;
    /** Free-form status, e.g. "open"|"resolved" for incidents, "approved"|"pending"|"rejected" for approvals. */
    status?: string;
    deliverableId?: string;
    meta?: Record<string, unknown>;
}
export interface SummaryPeriod {
    from: string | null;
    to: string | null;
}
export interface ClientSummary {
    clientId: string;
    period: SummaryPeriod;
    /** Always "borrador": summaries are drafts for human review, never auto-sent. */
    estado: "borrador";
    csat: {
        responses: number;
        averageScore: number | null;
        index: number | null;
        scaleMax: 10;
    };
    ratings: {
        count: number;
        averageScore: number | null;
        distribution: Record<string, number>;
    };
    incidents: {
        total: number;
        open: number;
        resolved: number;
    };
    approvals: {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
        approvalRate: number | null;
    };
}
export interface SummarizeOptions {
    from?: string;
    to?: string;
    clientId?: string;
}
/**
 * Summarizes feedback records for one client.
 *
 * The caller must pass only records belonging to the authenticated client.
 * Records with an unknown kind or a clientId other than `options.clientId`
 * (when provided) are ignored. The summary clientId is `options.clientId` if
 * given, otherwise the clientId of the first usable record, else "".
 */
export declare function summarizeClientFeedback(records: ClientFeedbackRecord[], options?: SummarizeOptions): ClientSummary;
