export type Severity = "low" | "medium" | "high" | "critical";
export type ReportType = "bug" | "suggestion";

export type CapturedEvent = {
  timestamp: string;
  type: "error" | "unhandled" | "network";
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  status?: number;
  statusText?: string;
  requestId?: string;
};

export type CapturedUserAction = {
  timestamp: string;
  type: "click";
  url: string;
  element?: Record<string, string | undefined>;
};

export type ScreenshotAttachment = {
  dataUrl: string;
  filename: string;
  mimeType: string;
};

export type CapturedContext = {
  url: string;
  route: string;
  userAgent: string;
  viewport: { width: number; height: number };
  screenSize: { width: number; height: number };
  locale: string;
  timezone: string;
  recentErrors: CapturedEvent[];
  recentNetwork: CapturedEvent[];
  recentUserActions: CapturedUserAction[];
  [key: string]: unknown;
};

export type FeedbackSubmitBody = {
  title: string;
  description?: string;
  report_type: ReportType;
  severity?: Severity;
  route: string;
  url: string;
  browser: {
    userAgent: string;
    viewport: { width: number; height: number };
    screenSize: { width: number; height: number };
    locale: string;
    timezone: string;
  };
  context: CapturedContext;
  recent_errors: CapturedEvent[];
  recent_network: CapturedEvent[];
  recent_user_actions: CapturedUserAction[];
  trace?: { traceparent?: string; trace_id?: string; span_id?: string };
  attachments?: Array<{
    kind: string;
    data_url: string;
    filename: string;
    mime_type: string;
  }>;
};

export type NotifyKind = "success" | "error";
export type Notify = (kind: NotifyKind, message: string) => void;

/** Status vocabulary shown to the reporting client. Internal triage states collapse into these. */
export type ClientFeedbackStatus =
  | "received"
  | "in_review"
  | "planned"
  | "in_progress"
  | "resolved"
  | "closed"
  | "declined";

/** A team reply the team explicitly marked as public. Internal comments never reach this shape. */
export type ClientFeedbackReply = {
  body: string;
  created_at?: string;
};

/** Client-facing view of one report: an allow-list, never the raw stored record. */
export type ClientFeedbackItem = {
  id: string;
  title: string;
  report_type: ReportType;
  status: ClientFeedbackStatus;
  severity?: Severity;
  description?: string;
  route?: string;
  created_at?: string;
  updated_at?: string;
  replies: ClientFeedbackReply[];
};
