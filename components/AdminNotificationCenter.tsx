"use client";

import { CheckCircle2, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type AdminNotification = {
  tone: "success" | "error";
  title: string;
  message: string;
};

type Toast = AdminNotification & { id: string };

const notificationEvent = "admin:notification";

export function notifyAdmin(notification: AdminNotification) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AdminNotification>(notificationEvent, { detail: notification }));
}

function mutationCopy(pathname: string, method: string): Omit<AdminNotification, "tone"> {
  if (pathname === "/api/admin/content") return { title: "Website updated", message: "Your dashboard changes are saved and published." };
  if (pathname.startsWith("/api/admin/projects")) {
    if (method === "POST") return { title: "Project added", message: "The new project is saved in your portfolio." };
    if (method === "DELETE") return { title: "Project removed", message: "The project was removed successfully." };
    return { title: "Project updated", message: "The project changes are saved." };
  }
  if (pathname.startsWith("/api/admin/services")) return { title: "Service updated", message: "The service changes are saved and published." };
  if (pathname.startsWith("/api/admin/inquiries")) return { title: "Inquiry updated", message: "The inquiry status was changed successfully." };
  if (pathname === "/api/admin/media" && method === "DELETE") return { title: "Media removed", message: "The selected file was deleted from your media library." };
  return { title: "Change saved", message: "Your dashboard update was completed successfully." };
}

function ToastCard({ toast, dismiss }: { toast: Toast; dismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(toast.id), 5200);
    return () => window.clearTimeout(timer);
  }, [dismiss, toast.id]);

  const Icon = toast.tone === "success" ? CheckCircle2 : TriangleAlert;
  return (
    <article className={`admin-toast is-${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"} aria-live={toast.tone === "error" ? "assertive" : "polite"}>
      <span className="admin-toast-icon"><Icon aria-hidden="true" /></span>
      <div><strong>{toast.title}</strong><p>{toast.message}</p></div>
      <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification"><X aria-hidden="true" /></button>
      <span className="admin-toast-timer" aria-hidden="true" />
    </article>
  );
}

export function AdminNotificationCenter() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: string) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const show = useCallback((notification: AdminNotification) => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current.slice(-2), { ...notification, id }]);
  }, []);

  useEffect(() => {
    const handleNotification = (event: Event) => show((event as CustomEvent<AdminNotification>).detail);
    window.addEventListener(notificationEvent, handleNotification);

    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      const requestUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const target = new URL(requestUrl, window.location.origin);
      const isMutation = target.origin === window.location.origin && target.pathname.startsWith("/api/admin/") && !["GET", "HEAD", "OPTIONS"].includes(method);
      const shouldNotify = isMutation && !["/api/admin/login", "/api/admin/logout", "/api/admin/media/signature"].includes(target.pathname);

      try {
        const response = await originalFetch(input, init);
        if (shouldNotify) {
          const result = await response.clone().json().catch(() => null) as { ok?: boolean } | null;
          if (response.ok && result?.ok !== false) show({ tone: "success", ...mutationCopy(target.pathname, method) });
          else show({ tone: "error", title: "Change not saved", message: "The update could not be completed. Check the form and try again." });
        }
        return response;
      } catch (error) {
        if (shouldNotify) show({ tone: "error", title: "Connection problem", message: "The dashboard could not complete this change. Please try again." });
        throw error;
      }
    };

    return () => {
      window.removeEventListener(notificationEvent, handleNotification);
      window.fetch = originalFetch;
    };
  }, [show]);

  return <div className="admin-toast-region" aria-label="Dashboard notifications">{toasts.map((toast) => <ToastCard toast={toast} dismiss={dismiss} key={toast.id} />)}</div>;
}
