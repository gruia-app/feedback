"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { captureFeedbackContext, installFeedbackCapture } from "./capture.js";
import { sanitizeUrl } from "./sanitize.js";
import { generateTraceparent, parseTraceparent } from "./traceparent.js";
import type { Notify, ReportType, ScreenshotAttachment, Severity } from "./types.js";
import type { Options as Html2CanvasOptions } from "html2canvas";

type Html2CanvasFn = (element: HTMLElement, options?: Partial<Html2CanvasOptions>) => Promise<HTMLCanvasElement>;

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

const DEFAULT_LABELS: FeedbackReporterLabels = {
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
  /** Set false to render nothing (e.g. gated contexts). */
  enabled?: boolean;
}

export function FeedbackReporter({
  endpoint = "/api/bug-report",
  allowSuggestions = true,
  notify,
  screenshotFilePrefix = "feedback",
  accentColor,
  labels: labelOverrides,
  enabled = true,
}: FeedbackReporterProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [submitting, setSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<ScreenshotAttachment | null>(null);
  const [capturingScreenshot, setCapturingScreenshot] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const emit = (kind: "success" | "error", message: string) => {
    setStatus({ kind, message });
    notify?.(kind, message);
  };

  useEffect(() => {
    installFeedbackCapture();
  }, []);

  if (!enabled) return null;

  const style = (accentColor ? { "--gfb-accent": accentColor } : {}) as CSSProperties;

  const captureScreenshot = async () => {
    setCapturingScreenshot(true);
    try {
      // html2canvas ships CJS/UMD with a default export; under NodeNext the
      // interop shape is ambiguous, so accept either the callable module or
      // its .default.
      const loaded = (await import("html2canvas")) as unknown as
        | Html2CanvasFn
        | { default?: Html2CanvasFn };
      const html2canvas: Html2CanvasFn =
        typeof loaded === "function" ? loaded : (loaded as { default: Html2CanvasFn }).default;
      const canvas = await html2canvas(document.body, {
        backgroundColor: "#09090b",
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
        ignoreElements: (element: Element) =>
          element.hasAttribute("data-bug-report-ignore") ||
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
    } catch (error) {
      emit("error", error instanceof Error ? error.message : labels.captureFailed);
    } finally {
      setCapturingScreenshot(false);
    }
  };

  const submit = async () => {
    if (!title.trim()) return;
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
      emit(
        "success",
        reportType === "suggestion"
          ? labels.suggestionSent
          : payload?.feature_id
            ? "Bug and feature created"
            : labels.bugSent,
      );
      setOpen(false);
      setTitle("");
      setDescription("");
      setSeverity("medium");
      setReportType("bug");
      setScreenshot(null);
      const destination =
        reportType === "suggestion"
          ? null
          : payload?.urls?.feature_url || payload?.urls?.bug_url || payload?.urls?.control_tower_url || null;
      if (destination) window.location.assign(destination);
    } catch (error) {
      emit("error", error instanceof Error ? error.message : labels.sendFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gfb-root" style={style}>
      <div data-bug-report-ignore data-feedback-ignore data-testid="feedback-rail" className="gfb-rail">
        <button
          type="button"
          title={labels.trigger}
          aria-label={labels.trigger}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="gfb-trigger"
        >
          <span className="gfb-trigger-icon">
            <BugIcon />
          </span>
          <span className="gfb-trigger-label">{labels.trigger}</span>
        </button>
      </div>

      {open ? (
        <div data-bug-report-ignore data-feedback-ignore className="gfb-overlay">
          <div className="gfb-dialog" role="dialog" aria-modal="true">
            <div className="gfb-dialog-head">
              <div className="gfb-dialog-title">
                <BugIcon />
                {reportType === "suggestion" ? labels.dialogTitleSuggestion : labels.dialogTitleBug}
              </div>
              <button type="button" onClick={() => setOpen(false)} className="gfb-close" aria-label="Close">
                <XIcon />
              </button>
            </div>
            <div className="gfb-dialog-body">
              {allowSuggestions ? (
                <div className="gfb-type-switch" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={reportType === "bug"}
                    className={reportType === "bug" ? "gfb-type gfb-type-active" : "gfb-type"}
                    onClick={() => setReportType("bug")}
                  >
                    {labels.typeBug}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={reportType === "suggestion"}
                    className={reportType === "suggestion" ? "gfb-type gfb-type-active" : "gfb-type"}
                    onClick={() => setReportType("suggestion")}
                  >
                    {labels.typeSuggestion}
                  </button>
                </div>
              ) : null}
              <label className="gfb-field">
                <span className="gfb-label">{labels.title}</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={255}
                  placeholder={reportType === "suggestion" ? labels.titlePlaceholderSuggestion : undefined}
                  className="gfb-input"
                />
              </label>
              <label className="gfb-field">
                <span className="gfb-label">{labels.description}</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  className="gfb-textarea"
                />
              </label>
              {reportType === "bug" ? (
                <label className="gfb-field">
                  <span className="gfb-label">{labels.severity}</span>
                  <select
                    value={severity}
                    onChange={(event) => setSeverity(event.target.value as Severity)}
                    className="gfb-input"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                  </select>
                </label>
              ) : null}
              <div className="gfb-screenshot">
                <div className="gfb-label gfb-screenshot-label">{labels.screenshot}</div>
                <div className="gfb-screenshot-row">
                  <button
                    type="button"
                    onClick={captureScreenshot}
                    disabled={capturingScreenshot}
                    className="gfb-btn"
                  >
                    {capturingScreenshot ? <Spinner /> : <CameraIcon />}
                    {screenshot ? labels.recapture : labels.capture}
                  </button>
                  {screenshot ? (
                    <>
                      <span className="gfb-screenshot-name">{screenshot.filename}</span>
                      <button
                        type="button"
                        onClick={() => setScreenshot(null)}
                        className="gfb-btn gfb-btn-muted"
                      >
                        <TrashIcon />
                        {labels.remove}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
              {status ? (
                <div className={status.kind === "error" ? "gfb-status gfb-status-error" : "gfb-status gfb-status-ok"}>
                  {status.message}
                </div>
              ) : null}
              <div className="gfb-actions">
                <button type="button" onClick={() => setOpen(false)} className="gfb-btn">
                  {labels.cancel}
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting || !title.trim()}
                  className="gfb-btn gfb-btn-primary"
                >
                  {submitting ? <Spinner /> : <BugIcon />}
                  {labels.send}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const iconStyle: CSSProperties = { width: 16, height: 16, display: "block" };
const smallIconStyle: CSSProperties = { width: 12, height: 12, display: "block" };

function BugIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden>
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={smallIconStyle} aria-hidden>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={smallIconStyle} aria-hidden>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gfb-spin" style={smallIconStyle} aria-hidden>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
