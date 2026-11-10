"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, AlertCircle } from "lucide-react";

type Status = "working" | "done" | "error";

export function UnsubscribeClient({ e, t }: { e: string; t: string }) {
  const [status, setStatus] = useState<Status>(e && t ? "working" : "error");
  const [message, setMessage] = useState(e && t ? "" : "This unsubscribe link is not valid.");

  useEffect(() => {
    if (!e || !t) return;
    let cancelled = false;
    fetch(`/api/unsubscribe?e=${encodeURIComponent(e)}&t=${encodeURIComponent(t)}`, { method: "POST" })
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        if (cancelled) return;
        if (response.ok) setStatus("done");
        else {
          setStatus("error");
          setMessage(data.error || "We could not update your preference. Please email hello@doc2postdoc.com.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
        setMessage("We could not update your preference. Please email hello@doc2postdoc.com.");
      });
    return () => {
      cancelled = true;
    };
  }, [e, t]);

  return (
    <div className="teaser-form-success" role="status" aria-live="polite">
      <span className="teaser-success-icon" style={status === "error" ? { background: "#fdecea", color: "#b3261e" } : undefined}>
        {status === "error" ? <AlertCircle size={23} /> : <Check size={23} />}
      </span>
      <p className="teaser-label" style={{ textAlign: "center" }}>
        EMAIL PREFERENCES
      </p>
      {status === "working" && <h2>Updating your preference…</h2>}
      {status === "done" && (
        <>
          <h2>You are unsubscribed.</h2>
          <p>You will not get news or launch emails from us. If this was a mistake, write to hello@doc2postdoc.com.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h2>We could not unsubscribe you.</h2>
          <p>{message}</p>
        </>
      )}
      <p style={{ marginTop: 22 }}>
        <Link className="teaser-back-link" href="/">
          Back to home
        </Link>
      </p>
    </div>
  );
}
