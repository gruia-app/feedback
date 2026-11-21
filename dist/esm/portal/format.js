const PLACEHOLDER = /\{([A-Za-z][A-Za-z0-9_]*)\}/g;
/** Replaces `{name}` placeholders. Unknown placeholders stay visible on purpose. */
export function formatMessage(template, values = {}) {
    return template.replace(PLACEHOLDER, (match, key) => Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match);
}
/** Sorted, de-duplicated placeholder names used by a template. */
export function extractPlaceholders(template) {
    return [...new Set(Array.from(template.matchAll(PLACEHOLDER), (m) => m[1]))].sort();
}
/** Applies `formatMessage` to every string of a nested catalog. */
export function interpolateDeep(value, values) {
    if (typeof value === "string")
        return formatMessage(value, values);
    if (Array.isArray(value))
        return value.map((item) => interpolateDeep(item, values));
    if (value && typeof value === "object") {
        const out = {};
        for (const [key, item] of Object.entries(value))
            out[key] = interpolateDeep(item, values);
        return out;
    }
    return value;
}
