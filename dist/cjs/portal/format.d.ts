export type MessageValues = Readonly<Record<string, string | number>>;
/** Replaces `{name}` placeholders. Unknown placeholders stay visible on purpose. */
export declare function formatMessage(template: string, values?: MessageValues): string;
/** Sorted, de-duplicated placeholder names used by a template. */
export declare function extractPlaceholders(template: string): string[];
/** Applies `formatMessage` to every string of a nested catalog. */
export declare function interpolateDeep<T>(value: T, values: MessageValues): T;
