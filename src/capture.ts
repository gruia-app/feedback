import { pushBounded, sanitizeText, sanitizeUrl } from "./sanitize.js";
import type { CapturedContext, CapturedEvent, CapturedUserAction } from "./types.js";

export const MAX_ERRORS = 10;
export const MAX_NETWORK = 10;
export const MAX_ACTIONS = 30;

const recentErrors: CapturedEvent[] = [];
const recentNetwork: CapturedEvent[] = [];
const recentUserActions: CapturedUserAction[] = [];
let captureInstalled = false;

export function installFeedbackCapture(): void {
  if (captureInstalled || typeof window === "undefined") return;
  captureInstalled = true;

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    pushBounded(
      recentErrors,
      {
        timestamp: new Date().toISOString(),
        type: "error",
        message: sanitizeText(args.map((arg) => sanitizeText(arg)).join(" ")),
      },
      MAX_ERRORS,
    );
    originalConsoleError.apply(console, args);
  };

  window.addEventListener("error", (event) => {
    pushBounded(
      recentErrors,
      {
        timestamp: new Date().toISOString(),
        type: "unhandled",
        message: sanitizeText(event.message),
        stack: sanitizeText(event.error?.stack || "", 4000) || undefined,
        url: event.filename ? sanitizeUrl(event.filename) : undefined,
      },
      MAX_ERRORS,
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    pushBounded(
      recentErrors,
      {
        timestamp: new Date().toISOString(),
        type: "unhandled",
        message: sanitizeText(event.reason?.message || event.reason),
        stack: sanitizeText(event.reason?.stack || "", 4000) || undefined,
      },
      MAX_ERRORS,
    );
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
        pushBounded(
          recentNetwork,
          {
            timestamp: new Date().toISOString(),
            type: "network",
            message: `HTTP ${response.status}: ${response.statusText}`,
            method: String(method || "GET").toUpperCase(),
            status: response.status,
            statusText: response.statusText,
            requestId: response.headers.get("x-request-id") || undefined,
            url: sanitizeUrl(url),
          },
          MAX_NETWORK,
        );
      }
      return response;
    } catch (error) {
      pushBounded(
        recentNetwork,
        {
          timestamp: new Date().toISOString(),
          type: "network",
          message: error instanceof Error ? sanitizeText(error.message) : "Network error",
          method: String(method || "GET").toUpperCase(),
          url: sanitizeUrl(url),
        },
        MAX_NETWORK,
      );
      throw error;
    }
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const element = target?.closest("button,a,input,textarea,select,[role='button'],[data-testid]") || target;
      pushBounded(
        recentUserActions,
        {
          timestamp: new Date().toISOString(),
          type: "click",
          url: sanitizeUrl(window.location.href),
          element: element
            ? {
                tag: element.tagName?.toLowerCase(),
                id: element.id || undefined,
                role: element.getAttribute("role") || undefined,
                label: element.getAttribute("aria-label") || undefined,
                dataTestId: element.getAttribute("data-testid") || undefined,
                text: sanitizeText(element.textContent || "", 120) || undefined,
              }
            : undefined,
        },
        MAX_ACTIONS,
      );
    },
    true,
  );
}

export function captureFeedbackContext(extra: Record<string, unknown> = {}): CapturedContext {
  return {
    url: sanitizeUrl(window.location.href),
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
export function resetFeedbackCaptureForTests(): void {
  recentErrors.length = 0;
  recentNetwork.length = 0;
  recentUserActions.length = 0;
}
