"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";

export function AdminLoginForm({ next = "/admin" }: { next?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password: form.get("password"), next }),
    });
    const result = await response.json().catch(() => ({ message: "Sign-in could not be completed." })) as { ok?: boolean; next?: string; message?: string };
    if (response.ok && result.ok) {
      window.location.assign(result.next || "/admin");
      return;
    }
    setMessage(result.message ?? "Sign-in could not be completed.");
    setBusy(false);
  }

  return (
    <form className="admin-login-form" onSubmit={signIn}>
      <label>
        <span>Username</span>
        <span className="admin-input-wrap"><UserRound aria-hidden="true" /><input name="username" autoComplete="username" required maxLength={80} spellCheck={false} /></span>
      </label>
      <label>
        <span>Password</span>
        <span className="admin-input-wrap"><LockKeyhole aria-hidden="true" /><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={256} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></span>
      </label>
      {message && <p className="admin-login-error" role="alert">{message}</p>}
      <button className="admin-login-submit" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}<span>{busy ? "Verifying…" : "Enter dashboard"}</span><ArrowRight aria-hidden="true" /></button>
      <p className="admin-login-security">Protected with an encrypted, HTTP-only session. Repeated failed attempts are temporarily blocked.</p>
    </form>
  );
}
