/**
 * Aggregates feedback records for a single client into a draft summary.
 * Pure and deterministic: no clocks, no I/O, no external dependencies.
 */
const VALID_KINDS = new Set([
    "rating",
    "csat_survey",
    "incident",
    "deliverable_approval",
]);
const INCIDENT_RESOLVED_STATUSES = new Set(["resolved", "closed", "done", "cancelled"]);
const APPROVED_STATUSES = new Set(["approved", "accepted", "aprobado"]);
const REJECTED_STATUSES = new Set(["rejected", "changes_requested", "rechazado"]);
/** Rounds a number to one decimal place, returning null for non-finite input. */
function round1(value) {
    if (!Number.isFinite(value))
        return null;
    return Math.round(value * 10) / 10;
}
/** Returns the score if it is a finite number inside the inclusive range. */
function scoreInRange(score, min, max) {
    if (typeof score !== "number" || !Number.isFinite(score))
        return null;
    if (score < min || score > max)
        return null;
    return score;
}
/**
 * Summarizes feedback records for one client.
 *
 * The caller must pass only records belonging to the authenticated client.
 * Records with an unknown kind or a clientId other than `options.clientId`
 * (when provided) are ignored. The summary clientId is `options.clientId` if
 * given, otherwise the clientId of the first usable record, else "".
 */
export function summarizeClientFeedback(records, options) {
    const scopedClientId = options?.clientId;
    const used = [];
    for (const record of records) {
        if (!record || typeof record !== "object")
            continue;
        if (!VALID_KINDS.has(record.kind))
            continue;
        if (scopedClientId !== undefined && record.clientId !== scopedClientId)
            continue;
        used.push(record);
    }
    const clientId = scopedClientId ?? used[0]?.clientId ?? "";
    // Period: explicit options win; otherwise derive min/max from ISO timestamps.
    let from = options?.from ?? null;
    let to = options?.to ?? null;
    if (from === null || to === null) {
        let minTs = null;
        let maxTs = null;
        for (const record of used) {
            const ts = record.occurredAt;
            if (typeof ts !== "string")
                continue;
            if (minTs === null || ts < minTs)
                minTs = ts;
            if (maxTs === null || ts > maxTs)
                maxTs = ts;
        }
        if (from === null)
            from = minTs;
        if (to === null)
            to = maxTs;
    }
    // CSAT surveys: score must be finite and within [1, 10].
    const csatScores = [];
    for (const record of used) {
        if (record.kind !== "csat_survey")
            continue;
        const score = scoreInRange(record.score, 1, 10);
        if (score !== null)
            csatScores.push(score);
    }
    const csatCount = csatScores.length;
    const csatAvg = csatCount > 0 ? csatScores.reduce((a, b) => a + b, 0) / csatCount : null;
    const csatAverage = csatAvg === null ? null : round1(csatAvg);
    const csatIndex = csatAverage === null ? null : Math.round((csatAverage / 10) * 100);
    // Ratings: score must be finite and within [1, 5].
    const ratingScores = [];
    const distribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    for (const record of used) {
        if (record.kind !== "rating")
            continue;
        const score = scoreInRange(record.score, 1, 5);
        if (score === null)
            continue;
        ratingScores.push(score);
        const bucket = String(Math.round(score));
        if (bucket in distribution) {
            distribution[bucket] += 1;
        }
    }
    const ratingCount = ratingScores.length;
    const ratingAvg = ratingCount > 0 ? ratingScores.reduce((a, b) => a + b, 0) / ratingCount : null;
    // Incidents: missing or unrecognized status counts as open.
    let incidentTotal = 0;
    let incidentResolved = 0;
    for (const record of used) {
        if (record.kind !== "incident")
            continue;
        incidentTotal += 1;
        const status = record.status?.trim().toLowerCase();
        if (status !== undefined && INCIDENT_RESOLVED_STATUSES.has(status)) {
            incidentResolved += 1;
        }
    }
    // Deliverable approvals: statuses are normalized to lowercase.
    let approvalTotal = 0;
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    for (const record of used) {
        if (record.kind !== "deliverable_approval")
            continue;
        approvalTotal += 1;
        const status = record.status?.trim().toLowerCase();
        if (status !== undefined && APPROVED_STATUSES.has(status)) {
            approved += 1;
        }
        else if (status !== undefined && REJECTED_STATUSES.has(status)) {
            rejected += 1;
        }
        else {
            pending += 1;
        }
    }
    const approvalRate = approvalTotal > 0 ? Math.round((approved / approvalTotal) * 100) : null;
    return {
        clientId,
        period: { from, to },
        estado: "borrador",
        csat: {
            responses: csatCount,
            averageScore: csatAverage,
            index: csatIndex,
            scaleMax: 10,
        },
        ratings: {
            count: ratingCount,
            averageScore: ratingAvg === null ? null : round1(ratingAvg),
            distribution,
        },
        incidents: {
            total: incidentTotal,
            open: incidentTotal - incidentResolved,
            resolved: incidentResolved,
        },
        approvals: {
            total: approvalTotal,
            approved,
            pending,
            rejected,
            approvalRate,
        },
    };
}
