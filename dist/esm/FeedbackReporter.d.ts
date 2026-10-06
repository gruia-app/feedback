import type { Notify } from "./types.js";
export type FeedbackReporterLabels = {
    trigger: string;
    dialogTitleBug: string;
    dialogTitleSuggestion: string;
    typeBug: string;
    typeSuggestion: string;
    title: string;
    titlePlaceholderSuggestion: string;
    description: string;
    severity: string;
    screenshot: string;
    capture: string;
    recapture: string;
    remove: string;
    cancel: string;
    send: string;
    sending: string;
    attached: string;
    captureFailed: string;
    bugSent: string;
    suggestionSent: string;
    sendFailed: string;
};
export interface FeedbackReporterProps {
    /** App-local server route that signs and forwards the report. */
    endpoint?: string;
    /** Show the Bug/Sugerencia type switcher. Suggestions never auto-create work. */
    allowSuggestions?: boolean;
    /** Optional toast/notification sink (e.g. sonner's `toast`). */
    notify?: Notify;
    /** Prefix for the screenshot filename. */
    screenshotFilePrefix?: string;
    /** Accent style: "dark-red" (default) keeps the original terminal look. */
    accentColor?: string;
    labels?: Partial<FeedbackReporterLabels>;
    /** Extra headers for the app-local request (e.g. a BFF CSRF token). */
    requestHeaders?: Record<string, string>;
    /** Set false to render nothing (e.g. gated contexts). */
    enabled?: boolean;
}
export declare function FeedbackReporter({ endpoint, allowSuggestions, notify, screenshotFilePrefix, accentColor, labels: labelOverrides, requestHeaders, enabled, }: FeedbackReporterProps): import("react").JSX.Element | null;
