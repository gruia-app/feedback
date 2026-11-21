"use client";

import { useEffect, useState } from "react";
import type { ClientFeedbackItem, ClientFeedbackStatus } from "./types.js";

export const CLIENT_STATUS_LABELS: Record<ClientFeedbackStatus, string> = {
  received: "Recibida",
  in_review: "En revisión",
  planned: "Planificada",
  in_progress: "En curso",
  resolved: "Resuelta",
  closed: "Cerrada",
  declined: "Descartada",
};

export type ClientFeedbackListProps = {
  /** App-local route backed by `handleClientFeedbackRequest` (session auth). */
  endpoint: string;
  /** Extra request headers, e.g. CSRF. */
  headers?: Record<string, string>;
  statusLabels?: Partial<Record<ClientFeedbackStatus, string>>;
  emptyText?: string;
  errorText?: string;
  loadingText?: string;
  className?: string;
};

type ListState = { kind: "loading" } | { kind: "error" } | { kind: "ready"; items: ClientFeedbackItem[] };

/** Read-only list of the signed-in client's reports and their status. */
export function ClientFeedbackList({
  endpoint,
  headers,
  statusLabels,
  emptyText = "Todavía no has enviado ninguna incidencia ni sugerencia.",
  errorText = "No se pudo cargar el seguimiento.",
  loadingText = "Cargando…",
  className,
}: ClientFeedbackListProps) {
  const [state, setState] = useState<ListState>({ kind: "loading" });
  const headerKey = JSON.stringify(headers ?? {});

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    fetch(endpoint, {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json", ...(JSON.parse(headerKey) as Record<string, string>) },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        const data = (await response.json()) as { items?: unknown };
        if (!cancelled) {
          setState({ kind: "ready", items: Array.isArray(data.items) ? (data.items as ClientFeedbackItem[]) : [] });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, headerKey]);

  const labels = { ...CLIENT_STATUS_LABELS, ...statusLabels };
  const rootClass = ["gruia-feedback-list", className].filter(Boolean).join(" ");

  if (state.kind === "loading") return <p className={rootClass}>{loadingText}</p>;
  if (state.kind === "error") return <p className={rootClass} role="alert">{errorText}</p>;
  if (!state.items.length) return <p className={rootClass}>{emptyText}</p>;

  return (
    <ul className={rootClass}>
      {state.items.map((item) => (
        <li key={item.id} className="gruia-feedback-list__item" data-status={item.status}>
          <div className="gruia-feedback-list__head">
            <span className="gruia-feedback-list__type">{item.report_type === "suggestion" ? "Sugerencia" : "Bug"}</span>
            <strong className="gruia-feedback-list__title">{item.title}</strong>
            <span className="gruia-feedback-list__status">{labels[item.status] ?? item.status}</span>
          </div>
          {item.updated_at || item.created_at ? (
            <time className="gruia-feedback-list__date" dateTime={item.updated_at || item.created_at}>
              {item.updated_at || item.created_at}
            </time>
          ) : null}
          {item.replies.length ? (
            <ul className="gruia-feedback-list__replies">
              {item.replies.map((reply, index) => (
                <li key={index}>{reply.body}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
