const sensitivePatterns = [
    /token/i,
    /password/i,
    /secret/i,
    /api[_-]?key/i,
    /auth/i,
    /bearer/i,
    /cookie/i,
    /session/i,
];
export function sanitizeText(value, maxLength = 2000) {
    let text = value instanceof Error ? `${value.name}: ${value.message}` : String(value ?? "");
    for (const pattern of sensitivePatterns) {
        text = text.replace(new RegExp(`(${pattern.source})[=:\\s]+[^\\s&]+`, "gi"), "$1=[REDACTED]");
    }
    return text.length > maxLength ? `${text.slice(0, maxLength)}...[truncated]` : text;
}
export function sanitizeUrl(value) {
    try {
        const url = new URL(value);
        for (const key of Array.from(url.searchParams.keys())) {
            if (sensitivePatterns.some((pattern) => pattern.test(key))) {
                url.searchParams.set(key, "[REDACTED]");
            }
        }
        return url.toString();
    }
    catch {
        return sanitizeText(value, 500);
    }
}
export function pushBounded(target, item, limit) {
    target.push(item);
    while (target.length > limit)
        target.shift();
}
