"use client";

import { useState } from "react";

export function AdminStatusControl({ id, initial, type }: { id: string; initial: string; type: "projects" | "inquiries" }) {
  const [status, setStatus] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const options = type === "projects" ? ["draft","published","archived"] : ["new","reviewing","qualified","discussion","proposal-sent","won","declined","archived"];
  async function update(next: string) {
    const previous = status;
    setStatus(next); setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/${type}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    const result = await response.json().catch(() => ({ message: "Update failed." })) as { ok?: boolean; message?: string };
    if (!response.ok || !result.ok) { setStatus(previous); setMessage(result.message ?? "Update failed."); }
    setBusy(false);
  }
  return <div><select value={status} disabled={busy} aria-label={`${type === "projects" ? "Project" : "Inquiry"} status`} onChange={(event) => update(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option.replaceAll("-", " ")}</option>)}</select>{message && <p role="alert" style={{ color: "#a32c08", margin: "5px 0 0" }}>{message}</p>}</div>;
}

