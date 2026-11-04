"use client";

import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { captureAttribution, readAttribution } from "@/lib/waitlist/adTags";
import { WHATSAPP_CONSENT_TEXT, WHATSAPP_ENABLED, toE164 } from "@/lib/waitlist/consent";

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const SOCIAL_CHANNELS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/doc2postdoc",
    label: "Subscribe to Doc2Postdoc on LinkedIn",
    icon: <LinkedInIcon size={16} />,
    className: "teaser-social-linkedin",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/doc2postdoc",
    label: "Subscribe to Doc2Postdoc on Instagram",
    icon: <InstagramIcon size={16} />,
    className: "teaser-social-instagram",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/doc2postdoc",
    label: "Subscribe to Doc2Postdoc on Facebook",
    icon: <FacebookIcon size={16} />,
    className: "teaser-social-facebook",
  },
];

function SocialSubscribeBox() {
  return (
    <div className="teaser-social-subscribe">
      <p className="teaser-social-subscribe-text">
        Subscribe to{" "}
        <a
          href={SOCIAL_CHANNELS[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="teaser-social-text-link"
        >
          LinkedIn
        </a>
        ,{" "}
        <a
          href={SOCIAL_CHANNELS[1].url}
          target="_blank"
          rel="noopener noreferrer"
          className="teaser-social-text-link"
        >
          Instagram
        </a>{" "}
        and{" "}
        <a
          href={SOCIAL_CHANNELS[2].url}
          target="_blank"
          rel="noopener noreferrer"
          className="teaser-social-text-link"
        >
          Facebook
        </a>
      </p>
      <div className="teaser-social-grid">
        {SOCIAL_CHANNELS.map((channel) => (
          <a
            key={channel.name}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`teaser-social-card ${channel.className}`}
            aria-label={channel.label}
          >
            <span className="teaser-social-icon">{channel.icon}</span>
            <span className="teaser-social-name">{channel.name}</span>
            <ExternalLink size={12} className="teaser-social-arrow" />
          </a>
        ))}
      </div>
    </div>
  );
}

type FormState = "idle" | "submitting" | "success" | "error";

const ERROR_TEXT = "Something went wrong. Please try again, or email hello@doc2postdoc.com.";
const careerStages = ["Postdoc", "PhD student", "Medical resident / fellow", "Faculty / PI", "Other"];

export function WaitlistForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [careerStage, setCareerStage] = useState("Postdoc");
  const [researchField, setResearchField] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waConsent, setWaConsent] = useState(false);
  const [waError, setWaError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  // Bring a form-level error into view so a failed submit is never silent.
  useEffect(() => {
    if (message) messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [message]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consentGiven) {
      setState("error");
      setMessage("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !country.trim()) {
      setState("error");
      setMessage("Please fill in your name, email, and country to continue.");
      return;
    }
    // WhatsApp (only when switched on) is optional and separate from the email consent.
    const waTyped = WHATSAPP_ENABLED ? waNumber.trim() : "";
    const waE164 = waTyped ? toE164(waTyped) : null;
    if (WHATSAPP_ENABLED && waTyped && !waConsent) {
      setWaError("Please tick the WhatsApp box, or clear the number.");
      document.getElementById("wa_number")?.focus();
      return;
    }
    if (WHATSAPP_ENABLED && waConsent && !waE164) {
      setWaError("Please enter a valid WhatsApp number with country code.");
      document.getElementById("wa_number")?.focus();
      return;
    }
    setWaError("");
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
          country,
          city,
          feedback,
          consent_given: consentGiven,
          whatsapp_consent_given: WHATSAPP_ENABLED && waConsent,
          whatsapp_number: WHATSAPP_ENABLED && waConsent ? waE164 : "",
          ...readAttribution(),
          source: "eyewee-doc2postdoc-teaser",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || ERROR_TEXT);
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.message !== "Failed to fetch" ? error.message : ERROR_TEXT);
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
        <h2>You&apos;re on the list.</h2>
        <p>We&apos;ll email you when early access opens in your field.</p>
        <div style={{ marginTop: "26px", textAlign: "left" }}>
          <SocialSubscribeBox />
        </div>
      </div>
    );
  }

  return (
    <form className="teaser-form" onSubmit={submit}>
      <div className="teaser-form-grid">
        <label>
          <span>Full name <span style={{ color: "#d93829" }}>*</span></span>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Required" required />
        </label>
        <label>
          <span>Email <span style={{ color: "#d93829" }}>*</span></span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Required" required />
        </label>
      </div>
      <div className="teaser-form-grid">
        <label>
          <span>Career stage</span>
          <select value={careerStage} onChange={(event) => setCareerStage(event.target.value)}>
            {careerStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Research field</span>
          <input value={researchField} onChange={(event) => setResearchField(event.target.value)} placeholder="Optional" />
        </label>
      </div>
      <div className="teaser-form-grid">
        <label>
          <span>Institution</span>
          <input value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="Optional" />
        </label>
        <label>
          <span>Country <span style={{ color: "#d93829" }}>*</span></span>
          <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Required" required />
        </label>
      </div>
      <div className="teaser-form-grid" style={WHATSAPP_ENABLED ? { alignItems: "start" } : { gridTemplateColumns: "1fr" }}>
        <label>
          <span>City / metro area</span>
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Optional" />
        </label>
        {WHATSAPP_ENABLED && (
          <div style={{ display: "grid", gap: "7px" }}>
            <label htmlFor="wa_number">
              <span>WhatsApp number (optional)</span>
            </label>
            <input
              type="tel"
              id="wa_number"
              name="whatsapp_number"
              autoComplete="tel"
              value={waNumber}
              onChange={(event) => {
                setWaNumber(event.target.value);
                setWaError("");
              }}
              placeholder="+1 314 555 0100"
              aria-describedby="wa_hint wa_error"
            />
            <p className="teaser-field-hint" id="wa_hint">
              Start with your country code, for example +1 or +91.
            </p>
            {waError && (
              <p className="teaser-form-error" id="wa_error" role="alert">
                {waError}
              </p>
            )}
          </div>
        )}
      </div>
      <div style={{ display: "grid", gap: "7px" }}>
        <label>
          <span>Feedback &amp; suggestions</span>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Optional"
            rows={2}
            maxLength={1500}
            aria-describedby="wl-feedback-hint"
          />
        </label>
        <p className="teaser-field-hint" id="wl-feedback-hint">
          Please do not include sensitive personal information.
        </p>
      </div>
      <SocialSubscribeBox />
      <div className="teaser-consent-row">
        <input
          type="checkbox"
          id="wl-terms"
          name="consent_given"
          checked={consentGiven}
          onChange={(event) => setConsentGiven(event.target.checked)}
          required
        />
        <label htmlFor="wl-terms" style={{ display: "inline", margin: 0 }}>
          I agree to receive early-access updates about Doc2Postdoc&#8480; at this email address, and I have read the{" "}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          . I am 18 or older. I can unsubscribe at any time.
        </label>
      </div>
      {WHATSAPP_ENABLED && (
        <div className="teaser-consent-row consent-wa">
          <input
            type="checkbox"
            id="wa_consent"
            name="whatsapp_consent_given"
            checked={waConsent}
            onChange={(event) => {
              setWaConsent(event.target.checked);
              setWaError("");
            }}
          />
          <label htmlFor="wa_consent" style={{ display: "inline", margin: 0 }}>
            {WHATSAPP_CONSENT_TEXT}
          </label>
        </div>
      )}
      {message && (
        <p className="teaser-form-error" role="alert" ref={messageRef}>
          {message}
        </p>
      )}
      <div className="teaser-form-actions">
        <button
          className="teaser-btn teaser-btn-gold teaser-form-submit"
          disabled={state === "submitting" || !consentGiven}
          type="submit"
          style={{ cursor: !consentGiven ? "not-allowed" : "pointer" }}
        >
          {state === "submitting" ? "Joining..." : "Join the waitlist"} <ArrowRight size={16} />
        </button>
        <span className="teaser-form-hint" id="join-hint" aria-live="polite" hidden={consentGiven}>
          Tick the box above to join.
        </span>
      </div>
      <p className="teaser-form-privacy">
        Privacy questions: <a href="mailto:privacy@doc2postdoc.org">privacy@doc2postdoc.org</a>
      </p>
    </form>
  );
}
