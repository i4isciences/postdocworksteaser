"use client";

import { ArrowRight, Check } from "lucide-react";
import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const careerStages = ["Postdoc", "PhD student", "Medical resident / fellow", "Faculty / PI", "Other"];

export function WaitlistForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [careerStage, setCareerStage] = useState("Postdoc");
  const [researchField, setResearchField] = useState("");
  const [institution, setInstitution] = useState("");
  const [city, setCity] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consentGiven) {
      setState("error");
      setMessage("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      setState("error");
      setMessage("Please add your name and email so we know where to send your invite.");
      return;
    }
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          careerStage,
          researchField,
          institution,
          city,
          consentGiven,
          source: "eyewee-doc2postdoc-teaser",
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "We could not process that signup.");
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="teaser-form-success">
        <span className="teaser-success-icon">
          <Check size={23} />
        </span>
        <p className="teaser-label" style={{ textAlign: "center" }}>
          EARLY ACCESS
        </p>
        <h2>Thanks, you&apos;re on the list.</h2>
        <p>We&apos;ll email you when Doc2Postdoc opens in your field.</p>
      </div>
    );
  }

  return (
    <form className="teaser-form" onSubmit={submit}>
      <div className="teaser-form-grid">
        <label>
          <span>Full name <span style={{ color: "#d93829" }}>*</span></span>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Jane Doe" required />
        </label>
        <label>
          <span>Email <span style={{ color: "#d93829" }}>*</span></span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@university.edu" required />
        </label>
      </div>
      <label>
        Career stage (optional)
        <select value={careerStage} onChange={(event) => setCareerStage(event.target.value)}>
          {careerStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </label>
      <div className="teaser-form-grid">
        <label>
          Research field (optional)
          <input value={researchField} onChange={(event) => setResearchField(event.target.value)} placeholder="e.g. HBV virology" />
        </label>
        <label>
          Institution (optional)
          <input value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="University or lab" />
        </label>
      </div>
      <label>
        City / metro area (optional)
        <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Chicago, IL" />
      </label>
      <div className="teaser-consent-row" style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <input
          type="checkbox"
          id="wl-terms"
          checked={consentGiven}
          onChange={(event) => setConsentGiven(event.target.checked)}
          required
        />
        <label htmlFor="wl-terms" style={{ display: "inline", margin: 0 }}>
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>.
        </label>
      </div>
      {message && (
        <p className="teaser-form-error" role="alert">
          {message}
        </p>
      )}
      <button
        className="teaser-btn teaser-btn-gold teaser-form-submit"
        disabled={state === "submitting" || !consentGiven}
        type="submit"
        style={{ opacity: !consentGiven ? 0.6 : 1, cursor: !consentGiven ? "not-allowed" : "pointer" }}
      >
        {state === "submitting" ? "Joining..." : "Join the waitlist"} <ArrowRight size={16} />
      </button>
    </form>
  );
}
