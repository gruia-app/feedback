"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackReporter = FeedbackReporter;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const capture_js_1 = require("./capture.js");
const sanitize_js_1 = require("./sanitize.js");
const traceparent_js_1 = require("./traceparent.js");
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
function FeedbackReporter({ endpoint = "/api/bug-report", allowSuggestions = true, notify, screenshotFilePrefix = "feedback", accentColor, labels: labelOverrides, enabled = true, }) {
    const labels = { ...DEFAULT_LABELS, ...labelOverrides };
    const [open, setOpen] = (0, react_1.useState)(false);
    const [reportType, setReportType] = (0, react_1.useState)("bug");
    const [title, setTitle] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)("");
    const [severity, setSeverity] = (0, react_1.useState)("medium");
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [screenshot, setScreenshot] = (0, react_1.useState)(null);
    const [capturingScreenshot, setCapturingScreenshot] = (0, react_1.useState)(false);
    const [status, setStatus] = (0, react_1.useState)(null);
    const emit = (kind, message) => {
        setStatus({ kind, message });
        notify?.(kind, message);
    };
    (0, react_1.useEffect)(() => {
        (0, capture_js_1.installFeedbackCapture)();
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
            const loaded = (await Promise.resolve().then(() => __importStar(require("html2canvas"))));
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
            const traceparent = (0, traceparent_js_1.generateTraceparent)();
            const parsedTrace = (0, traceparent_js_1.parseTraceparent)(traceparent);
            const capturedContext = (0, capture_js_1.captureFeedbackContext)({
                source_url: (0, sanitize_js_1.sanitizeUrl)(window.location.href),
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
                    url: (0, sanitize_js_1.sanitizeUrl)(window.location.href),
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "gfb-root", style: style, children: [(0, jsx_runtime_1.jsx)("div", { "data-bug-report-ignore": true, "data-feedback-ignore": true, "data-testid": "feedback-rail", className: "gfb-rail", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", title: labels.trigger, "aria-label": labels.trigger, "aria-haspopup": "dialog", "aria-expanded": open, onClick: () => setOpen(true), className: "gfb-trigger", children: [(0, jsx_runtime_1.jsx)("span", { className: "gfb-trigger-icon", children: (0, jsx_runtime_1.jsx)(BugIcon, {}) }), (0, jsx_runtime_1.jsx)("span", { className: "gfb-trigger-label", children: labels.trigger })] }) }), open ? ((0, jsx_runtime_1.jsx)("div", { "data-bug-report-ignore": true, "data-feedback-ignore": true, className: "gfb-overlay", children: (0, jsx_runtime_1.jsxs)("div", { className: "gfb-dialog", role: "dialog", "aria-modal": "true", children: [(0, jsx_runtime_1.jsxs)("div", { className: "gfb-dialog-head", children: [(0, jsx_runtime_1.jsxs)("div", { className: "gfb-dialog-title", children: [(0, jsx_runtime_1.jsx)(BugIcon, {}), reportType === "suggestion" ? labels.dialogTitleSuggestion : labels.dialogTitleBug] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setOpen(false), className: "gfb-close", "aria-label": "Close", children: (0, jsx_runtime_1.jsx)(XIcon, {}) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "gfb-dialog-body", children: [allowSuggestions ? ((0, jsx_runtime_1.jsxs)("div", { className: "gfb-type-switch", role: "tablist", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", role: "tab", "aria-selected": reportType === "bug", className: reportType === "bug" ? "gfb-type gfb-type-active" : "gfb-type", onClick: () => setReportType("bug"), children: labels.typeBug }), (0, jsx_runtime_1.jsx)("button", { type: "button", role: "tab", "aria-selected": reportType === "suggestion", className: reportType === "suggestion" ? "gfb-type gfb-type-active" : "gfb-type", onClick: () => setReportType("suggestion"), children: labels.typeSuggestion })] })) : null, (0, jsx_runtime_1.jsxs)("label", { className: "gfb-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "gfb-label", children: labels.title }), (0, jsx_runtime_1.jsx)("input", { value: title, onChange: (event) => setTitle(event.target.value), maxLength: 255, placeholder: reportType === "suggestion" ? labels.titlePlaceholderSuggestion : undefined, className: "gfb-input" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "gfb-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "gfb-label", children: labels.description }), (0, jsx_runtime_1.jsx)("textarea", { value: description, onChange: (event) => setDescription(event.target.value), rows: 5, className: "gfb-textarea" })] }), reportType === "bug" ? ((0, jsx_runtime_1.jsxs)("label", { className: "gfb-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "gfb-label", children: labels.severity }), (0, jsx_runtime_1.jsxs)("select", { value: severity, onChange: (event) => setSeverity(event.target.value), className: "gfb-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "low", children: "low" }), (0, jsx_runtime_1.jsx)("option", { value: "medium", children: "medium" }), (0, jsx_runtime_1.jsx)("option", { value: "high", children: "high" }), (0, jsx_runtime_1.jsx)("option", { value: "critical", children: "critical" })] })] })) : null, (0, jsx_runtime_1.jsxs)("div", { className: "gfb-screenshot", children: [(0, jsx_runtime_1.jsx)("div", { className: "gfb-label gfb-screenshot-label", children: labels.screenshot }), (0, jsx_runtime_1.jsxs)("div", { className: "gfb-screenshot-row", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: captureScreenshot, disabled: capturingScreenshot, className: "gfb-btn", children: [capturingScreenshot ? (0, jsx_runtime_1.jsx)(Spinner, {}) : (0, jsx_runtime_1.jsx)(CameraIcon, {}), screenshot ? labels.recapture : labels.capture] }), screenshot ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "gfb-screenshot-name", children: screenshot.filename }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setScreenshot(null), className: "gfb-btn gfb-btn-muted", children: [(0, jsx_runtime_1.jsx)(TrashIcon, {}), labels.remove] })] })) : null] })] }), status ? ((0, jsx_runtime_1.jsx)("div", { className: status.kind === "error" ? "gfb-status gfb-status-error" : "gfb-status gfb-status-ok", children: status.message })) : null, (0, jsx_runtime_1.jsxs)("div", { className: "gfb-actions", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setOpen(false), className: "gfb-btn", children: labels.cancel }), (0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: submit, disabled: submitting || !title.trim(), className: "gfb-btn gfb-btn-primary", children: [submitting ? (0, jsx_runtime_1.jsx)(Spinner, {}) : (0, jsx_runtime_1.jsx)(BugIcon, {}), labels.send] })] })] })] }) })) : null] }));
}
const iconStyle = { width: 16, height: 16, display: "block" };
const smallIconStyle = { width: 12, height: 12, display: "block" };
function BugIcon() {
    return ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: iconStyle, "aria-hidden": true, children: [(0, jsx_runtime_1.jsx)("path", { d: "m8 2 1.88 1.88" }), (0, jsx_runtime_1.jsx)("path", { d: "M14.12 3.88 16 2" }), (0, jsx_runtime_1.jsx)("path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" }), (0, jsx_runtime_1.jsx)("path", { d: "M12 20v-9" }), (0, jsx_runtime_1.jsx)("path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }), (0, jsx_runtime_1.jsx)("path", { d: "M6 13H2" }), (0, jsx_runtime_1.jsx)("path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }), (0, jsx_runtime_1.jsx)("path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }), (0, jsx_runtime_1.jsx)("path", { d: "M22 13h-4" }), (0, jsx_runtime_1.jsx)("path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" })] }));
}
function CameraIcon() {
    return ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: smallIconStyle, "aria-hidden": true, children: [(0, jsx_runtime_1.jsx)("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "13", r: "3" })] }));
}
function XIcon() {
    return ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: iconStyle, "aria-hidden": true, children: [(0, jsx_runtime_1.jsx)("path", { d: "M18 6 6 18" }), (0, jsx_runtime_1.jsx)("path", { d: "m6 6 12 12" })] }));
}
function TrashIcon() {
    return ((0, jsx_runtime_1.jsxs)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: smallIconStyle, "aria-hidden": true, children: [(0, jsx_runtime_1.jsx)("path", { d: "M3 6h18" }), (0, jsx_runtime_1.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }), (0, jsx_runtime_1.jsx)("path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }));
}
function Spinner() {
    return ((0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "gfb-spin", style: smallIconStyle, "aria-hidden": true, children: (0, jsx_runtime_1.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }) }));
}
