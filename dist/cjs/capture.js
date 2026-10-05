"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ACTIONS = exports.MAX_NETWORK = exports.MAX_ERRORS = void 0;
exports.installFeedbackCapture = installFeedbackCapture;
exports.captureFeedbackContext = captureFeedbackContext;
exports.resetFeedbackCaptureForTests = resetFeedbackCaptureForTests;
const sanitize_js_1 = require("./sanitize.js");
exports.MAX_ERRORS = 10;
exports.MAX_NETWORK = 10;
exports.MAX_ACTIONS = 30;
const recentErrors = [];
const recentNetwork = [];
const recentUserActions = [];
let captureInstalled = false;
function installFeedbackCapture() {
    if (captureInstalled || typeof window === "undefined")
        return;
    captureInstalled = true;
    const originalConsoleError = console.error;
    console.error = (...args) => {
        (0, sanitize_js_1.pushBounded)(recentErrors, {
            timestamp: new Date().toISOString(),
            type: "error",
            message: (0, sanitize_js_1.sanitizeText)(args.map((arg) => (0, sanitize_js_1.sanitizeText)(arg)).join(" ")),
        }, exports.MAX_ERRORS);
        originalConsoleError.apply(console, args);
    };
    window.addEventListener("error", (event) => {
        (0, sanitize_js_1.pushBounded)(recentErrors, {
            timestamp: new Date().toISOString(),
            type: "unhandled",
            message: (0, sanitize_js_1.sanitizeText)(event.message),
            stack: (0, sanitize_js_1.sanitizeText)(event.error?.stack || "", 4000) || undefined,
            url: event.filename ? (0, sanitize_js_1.sanitizeUrl)(event.filename) : undefined,
        }, exports.MAX_ERRORS);
    });
    window.addEventListener("unhandledrejection", (event) => {
        (0, sanitize_js_1.pushBounded)(recentErrors, {
            timestamp: new Date().toISOString(),
            type: "unhandled",
            message: (0, sanitize_js_1.sanitizeText)(event.reason?.message || event.reason),
            stack: (0, sanitize_js_1.sanitizeText)(event.reason?.stack || "", 4000) || undefined,
        }, exports.MAX_ERRORS);
    });
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const request = args[0];
        const init = args[1];
        const url = typeof request === "string" ? request : request instanceof Request ? request.url : "";
        const method = init?.method || (request instanceof Request ? request.method : "GET");
        try {
            const response = await originalFetch(...args);
            if (!response.ok && response.status >= 400) {
                (0, sanitize_js_1.pushBounded)(recentNetwork, {
                    timestamp: new Date().toISOString(),
                    type: "network",
                    message: `HTTP ${response.status}: ${response.statusText}`,
                    method: String(method || "GET").toUpperCase(),
                    status: response.status,
                    statusText: response.statusText,
                    requestId: response.headers.get("x-request-id") || undefined,
                    url: (0, sanitize_js_1.sanitizeUrl)(url),
                }, exports.MAX_NETWORK);
            }
            return response;
        }
        catch (error) {
            (0, sanitize_js_1.pushBounded)(recentNetwork, {
                timestamp: new Date().toISOString(),
                type: "network",
                message: error instanceof Error ? (0, sanitize_js_1.sanitizeText)(error.message) : "Network error",
                method: String(method || "GET").toUpperCase(),
                url: (0, sanitize_js_1.sanitizeUrl)(url),
            }, exports.MAX_NETWORK);
            throw error;
        }
    };
    document.addEventListener("click", (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const element = target?.closest("button,a,input,textarea,select,[role='button'],[data-testid]") || target;
        (0, sanitize_js_1.pushBounded)(recentUserActions, {
            timestamp: new Date().toISOString(),
            type: "click",
            url: (0, sanitize_js_1.sanitizeUrl)(window.location.href),
            element: element
                ? {
                    tag: element.tagName?.toLowerCase(),
                    id: element.id || undefined,
                    role: element.getAttribute("role") || undefined,
                    label: element.getAttribute("aria-label") || undefined,
                    dataTestId: element.getAttribute("data-testid") || undefined,
                    text: (0, sanitize_js_1.sanitizeText)(element.textContent || "", 120) || undefined,
                }
                : undefined,
        }, exports.MAX_ACTIONS);
    }, true);
}
function captureFeedbackContext(extra = {}) {
    return {
        url: (0, sanitize_js_1.sanitizeUrl)(window.location.href),
        route: window.location.pathname,
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        screenSize: { width: window.screen.width, height: window.screen.height },
        locale: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        recentErrors: [...recentErrors],
        recentNetwork: [...recentNetwork],
        recentUserActions: [...recentUserActions],
        ...extra,
    };
}
/** Test hook: clears the captured buffers. Not part of the public app contract. */
function resetFeedbackCaptureForTests() {
    recentErrors.length = 0;
    recentNetwork.length = 0;
    recentUserActions.length = 0;
}
