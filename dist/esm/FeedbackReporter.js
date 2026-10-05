"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { captureFeedbackContext, installFeedbackCapture } from "./capture.js";
import { sanitizeUrl } from "./sanitize.js";
import { generateTraceparent, parseTraceparent } from "./traceparent.js";
const DEFAULT_LABELS = {
    trigger: "Report",
    dialogTitleBug: "Report Bug",
    dialogTitleSuggestion: "Suggest improvement",
    typeBug: "Bug",
    typeSuggestion: "Sugerencia",
    title: "Title",
    titlePlaceholderSuggestion: "What should this app do better?",
    description: "Description",
    severity: "Severity",
    screenshot: "Screenshot",
    capture: "Capture",
    recapture: "Recapture",
    remove: "Remove",
    cancel: "Cancel",
    send: "Send",
    sending: "Sending",
    attached: "Screenshot attached",
    captureFailed: "Screenshot capture failed",
    bugSent: "Bug report sent",
    suggestionSent: "Suggestion sent to the product backlog",
    sendFailed: "Report failed",
};
export function FeedbackReporter({ endpoint = "/api/bug-report", allowSuggestions = true, notify, screenshotFilePrefix = "feedback", accentColor, labels: labelOverrides, enabled = true, }) {
    const labels = { ...DEFAULT_LABELS, ...labelOverrides };
    const [open, setOpen] = useState(false);
    const [reportType, setReportType] = useState("bug");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("medium");
    const [submitting, setSubmitting] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [capturingScreenshot, setCapturingScreenshot] = useState(false);
    const [status, setStatus] = useState(null);
    const emit = (kind, message) => {
        setStatus({ kind, message });
        notify?.(kind, message);
    };
    useEffect(() => {
        installFeedbackCapture();
    }, []);
    if (!enabled)
        return null;
    const style = (accentColor ? { "--gfb-accent": accentColor } : {});
    const captureScreenshot = async () => {
        setCapturingScreenshot(true);
        try {
            // html2canvas ships CJS/UMD with a default export; under NodeNext the
            // interop shape is ambiguous, so accept either the callable module or
            // its .default.
            const loaded = (await import("html2canvas"));
            const html2canvas = typeof loaded === "function" ? loaded : loaded.default;
            const canvas = await html2canvas(document.body, {
                backgroundColor: "#09090b",
                scale: Math.min(window.devicePixelRatio || 1, 2),
                useCORS: true,
                ignoreElements: (element) => element.hasAttribute("data-bug-report-ignore") ||
                    element.hasAttribute("data-feedback-ignore") ||
                    Boolean(element.closest("[data-bug-report-ignore],[data-feedback-ignore]")) ||
                    element.matches('input[type="password"],input[type="hidden"],[data-feedback-sensitive]'),
            });
            setScreenshot({
                dataUrl: canvas.toDataURL("image/jpeg", 0.72),
                filename: `${screenshotFilePrefix}-screenshot-${Date.now()}.jpg`,
                mimeType: "image/jpeg",
            });
            emit("success", labels.attached);
        }
        catch (error) {
            emit("error", error instanceof Error ? error.message : labels.captureFailed);
        }
        finally {
            setCapturingScreenshot(false);
        }
    };
    const submit = async () => {
        if (!title.trim())
            return;
        setSubmitting(true);
        setStatus(null);
        try {
            const traceparent = generateTraceparent();
            const parsedTrace = parseTraceparent(traceparent);
            const capturedContext = captureFeedbackContext({
                source_url: sanitizeUrl(window.location.href),
                route: window.location.pathname,
                component: "gruia-feedback-reporter",
                session: {
                    captured_at: new Date().toISOString(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    visibility_state: document.visibilityState,
                },
            });
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", traceparent },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    report_type: reportType,
                    severity: reportType === "bug" ? severity : undefined,
                    route: window.location.pathname,
                    url: sanitizeUrl(window.location.href),
                    browser: {
                        userAgent: navigator.userAgent,
                        viewport: { width: window.innerWidth, height: window.innerHeight },
                        screenSize: { width: window.screen.width, height: window.screen.height },
                        locale: navigator.language,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    context: capturedContext,
                    recent_errors: capturedContext.recentErrors,
                    recent_network: capturedContext.recentNetwork,
                    recent_user_actions: capturedContext.recentUserActions,
                    trace: parsedTrace ? { traceparent, ...parsedTrace } : { traceparent },
                    attachments: screenshot
                        ? [
                            {
                                kind: "screenshot",
                                data_url: screenshot.dataUrl,
                                filename: screenshot.filename,
                                mime_type: screenshot.mimeType,
                            },
                        ]
                        : undefined,
                }),
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.reason || payload?.detail || `HTTP ${response.status}`);
            }
            emit("success", reportType === "suggestion"
                ? labels.suggestionSent
                : payload?.feature_id
                    ? "Bug and feature created"
                    : labels.bugSent);
            setOpen(false);
            setTitle("");
            setDescription("");
            setSeverity("medium");
            setReportType("bug");
            setScreenshot(null);
            const destination = reportType === "suggestion"
                ? null
                : payload?.urls?.feature_url || payload?.urls?.bug_url || payload?.urls?.control_tower_url || null;
            if (destination)
                window.location.assign(destination);
        }
        catch (error) {
            emit("error", error instanceof Error ? error.message : labels.sendFailed);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "gfb-root", style: style, children: [_jsx("div", { "data-bug-report-ignore": true, "data-feedback-ignore": true, "data-testid": "feedback-rail", className: "gfb-rail", children: _jsxs("button", { type: "button", title: labels.trigger, "aria-label": labels.trigger, "aria-haspopup": "dialog", "aria-expanded": open, onClick: () => setOpen(true), className: "gfb-trigger", children: [_jsx("span", { className: "gfb-trigger-icon", children: _jsx(BugIcon, {}) }), _jsx("span", { className: "gfb-trigger-label", children: labels.trigger })] }) }), open ? (_jsx("div", { "data-bug-report-ignore": true, "data-feedback-ignore": true, className: "gfb-overlay", children: _jsxs("div", { className: "gfb-dialog", role: "dialog", "aria-modal": "true", children: [_jsxs("div", { className: "gfb-dialog-head", children: [_jsxs("div", { className: "gfb-dialog-title", children: [_jsx(BugIcon, {}), reportType === "suggestion" ? labels.dialogTitleSuggestion : labels.dialogTitleBug] }), _jsx("button", { type: "button", onClick: () => setOpen(false), className: "gfb-close", "aria-label": "Close", children: _jsx(XIcon, {}) })] }), _jsxs("div", { className: "gfb-dialog-body", children: [allowSuggestions ? (_jsxs("div", { className: "gfb-type-switch", role: "tablist", children: [_jsx("button", { type: "button", role: "tab", "aria-selected": reportType === "bug", className: reportType === "bug" ? "gfb-type gfb-type-active" : "gfb-type", onClick: () => setReportType("bug"), children: labels.typeBug }), _jsx("button", { type: "button", role: "tab", "aria-selected": reportType === "suggestion", className: reportType === "suggestion" ? "gfb-type gfb-type-active" : "gfb-type", onClick: () => setReportType("suggestion"), children: labels.typeSuggestion })] })) : null, _jsxs("label", { className: "gfb-field", children: [_jsx("span", { className: "gfb-label", children: labels.title }), _jsx("input", { value: title, onChange: (event) => setTitle(event.target.value), maxLength: 255, placeholder: reportType === "suggestion" ? labels.titlePlaceholderSuggestion : undefined, className: "gfb-input" })] }), _jsxs("label", { className: "gfb-field", children: [_jsx("span", { className: "gfb-label", children: labels.description }), _jsx("textarea", { value: description, onChange: (event) => setDescription(event.target.value), rows: 5, className: "gfb-textarea" })] }), reportType === "bug" ? (_jsxs("label", { className: "gfb-field", children: [_jsx("span", { className: "gfb-label", children: labels.severity }), _jsxs("select", { value: severity, onChange: (event) => setSeverity(event.target.value), className: "gfb-input", children: [_jsx("option", { value: "low", children: "low" }), _jsx("option", { value: "medium", children: "medium" }), _jsx("option", { value: "high", children: "high" }), _jsx("option", { value: "critical", children: "critical" })] })] })) : null, _jsxs("div", { className: "gfb-screenshot", children: [_jsx("div", { className: "gfb-label gfb-screenshot-label", children: labels.screenshot }), _jsxs("div", { className: "gfb-screenshot-row", children: [_jsxs("button", { type: "button", onClick: captureScreenshot, disabled: capturingScreenshot, className: "gfb-btn", children: [capturingScreenshot ? _jsx(Spinner, {}) : _jsx(CameraIcon, {}), screenshot ? labels.recapture : labels.capture] }), screenshot ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "gfb-screenshot-name", children: screenshot.filename }), _jsxs("button", { type: "button", onClick: () => setScreenshot(null), className: "gfb-btn gfb-btn-muted", children: [_jsx(TrashIcon, {}), labels.remove] })] })) : null] })] }), status ? (_jsx("div", { className: status.kind === "error" ? "gfb-status gfb-status-error" : "gfb-status gfb-status-ok", children: status.message })) : null, _jsxs("div", { className: "gfb-actions", children: [_jsx("button", { type: "button", onClick: () => setOpen(false), className: "gfb-btn", children: labels.cancel }), _jsxs("button", { type: "button", onClick: submit, disabled: submitting || !title.trim(), className: "gfb-btn gfb-btn-primary", children: [submitting ? _jsx(Spinner, {}) : _jsx(BugIcon, {}), labels.send] })] })] })] }) })) : null] }));
}
const iconStyle = { width: 16, height: 16, display: "block" };
const smallIconStyle = { width: 12, height: 12, display: "block" };
function BugIcon() {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: iconStyle, "aria-hidden": true, children: [_jsx("path", { d: "m8 2 1.88 1.88" }), _jsx("path", { d: "M14.12 3.88 16 2" }), _jsx("path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }), _jsx("path", { d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" }), _jsx("path", { d: "M12 20v-9" }), _jsx("path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }), _jsx("path", { d: "M6 13H2" }), _jsx("path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }), _jsx("path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }), _jsx("path", { d: "M22 13h-4" }), _jsx("path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" })] }));
}
function CameraIcon() {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: smallIconStyle, "aria-hidden": true, children: [_jsx("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }), _jsx("circle", { cx: "12", cy: "13", r: "3" })] }));
}
function XIcon() {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: iconStyle, "aria-hidden": true, children: [_jsx("path", { d: "M18 6 6 18" }), _jsx("path", { d: "m6 6 12 12" })] }));
}
function TrashIcon() {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: smallIconStyle, "aria-hidden": true, children: [_jsx("path", { d: "M3 6h18" }), _jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }), _jsx("path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }));
}
function Spinner() {
    return (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "gfb-spin", style: smallIconStyle, "aria-hidden": true, children: _jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }) }));
}
