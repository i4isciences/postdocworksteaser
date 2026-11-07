"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArchSuccess } from "@/components/ArchSuccess";
import { COUNTRIES } from "@/lib/waitlist/countries";
import { captureAttribution, readAttribution } from "@/lib/waitlist/adTags";
import { EMAIL_CONSENT_TEXT, WHATSAPP_CONSENT_TEXT, WHATSAPP_ENABLED, toE164 } from "@/lib/waitlist/consent";

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
  const [waNumber, setWaNumber] = useState("");
  const [waConsent, setWaConsent] = useState(false);
  const [waError, setWaError] = useState("");
  const [consentGiven, setConsentGiven] = useState(false); // Box 1 (required)
  const [emailConsent, setEmailConsent] = useState(false); // Box 2 (optional)
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [messageTick, setMessageTick] = useState(0);

  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  // Bring a form-level message (server or network error) into view so a failed submit is never silent.
  useEffect(() => {
    if (messageTick > 0) messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [messageTick]);

  function showMessage(text: string) {
    setState("error");
    setMessage(text);
    setMessageTick((tick) => tick + 1);
  }

  function clearError(field: string) {
    setErrors((current) => (current[field] ? { ...current, [field]: "" } : current));
  }

  // A short red message directly under the field that needs attention.
  function fieldError(field: string) {
    return errors[field] ? (
      <p className="teaser-field-error" id={`err-${field}`} role="alert">
        {errors[field]}
      </p>
    ) : null;
  }

  function focusField(id: string) {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.focus({ preventScroll: true });
  }

  // The consent box is unticked on purpose, so a click on the greyed-out button must explain itself.
  function lockedClick() {
    setErrors({ consent: "Please tick the box to agree before joining." });
    focusField("wl-terms");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    // Read what is actually in the fields. Browser autofill can fill a field without telling React,
    // so the form itself (not React state) is the source of truth at submit time.
    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (name: string) => String(data.get(name) ?? "").trim();
    const values = {
      fullName: read("fullName"),
      email: read("email"),
      careerStage: read("careerStage") || "Postdoc",
      researchField: read("researchField"),
      institution: read("institution"),
      country: read("country"),
      city: read("city"),
      feedback: read("feedback"),
    };
    const consent = (form.elements.namedItem("consent_given") as HTMLInputElement | null)?.checked === true;
    const emailOk = (form.elements.namedItem("consent_email") as HTMLInputElement | null)?.checked === true;

    // Our own clear messages replace the browser's pop-up bubbles (easy to miss, and hidden in some browsers).
    const found: Record<string, string> = {};
    if (values.fullName.length < 2) found.fullName = "Please enter your full name.";
    if (!values.email) found.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) found.email = "Please enter a valid email address.";
    if (!values.country) found.country = "Please select your country.";
    if (!consent) found.consent = "Please tick the box to agree before joining.";

    // WhatsApp (only when switched on) is optional. Its box (Box 3) appears once a number is typed. A number is only
    // kept if that box is ticked; if the box stays unticked the number is simply not saved.
    const waTyped = WHATSAPP_ENABLED ? waNumber.trim() : "";
    const waE164 = waTyped ? toE164(waTyped) : null;
    let waProblem = "";
    if (WHATSAPP_ENABLED && waTyped && waConsent && !waE164) waProblem = "Please enter a valid WhatsApp number with country code.";
    setWaError(waProblem);

    const order: [string, string][] = [
      ["fullName", "wl-fullName"],
      ["email", "wl-email"],
      ["country", "wl-country"],
      ["consent", "wl-terms"],
    ];
    const firstBad = order.find(([key]) => found[key]);
    setErrors(found);
    if (firstBad || waProblem) {
      setState("error");
      setMessage("");
      focusField(firstBad ? firstBad[1] : "wa_number");
      return;
    }

    setState("submitting");
    setMessage("");
    // Never hang silently: give up after 30 seconds and say so.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...values,
          consent_given: consent,
          consent_email: emailOk,
          whatsapp_consent_given: WHATSAPP_ENABLED && Boolean(waTyped) && waConsent,
          whatsapp_number: WHATSAPP_ENABLED && waTyped && waConsent ? waE164 : "",
          ...readAttribution(),
          source: "eyewee-doc2postdoc-teaser",
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        console.error("Waitlist signup failed:", response.status, result.error);
        showMessage(result.error || ERROR_TEXT);
        return;
      }
      setState("success");
    } catch (error) {
      console.error("Waitlist signup request failed:", error);
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      showMessage(timedOut ? "This is taking longer than expected. Please try again, or email hello@doc2postdoc.com." : ERROR_TEXT);
    } finally {
      clearTimeout(timer);
    }
  }

  if (state === "success") {
    return (
      <div className="teaser-form-success">
        <ArchSuccess eyebrow="EARLY ACCESS" heading="You&apos;re on the list." message="We&apos;ll be in touch when early access opens." />
        <div style={{ marginTop: "26px", textAlign: "left" }}>
          <SocialSubscribeBox />
        </div>
      </div>
    );
  }

  return (
    <form className="teaser-form" onSubmit={submit} noValidate>
      <div className="teaser-form-grid" style={{ alignItems: "start" }}>
        <label>
          <span>Full name <span style={{ color: "#d93829" }}>*</span></span>
          <input
            id="wl-fullName"
            name="fullName"
            autoComplete="name"
            defaultValue=""
            onChange={() => clearError("fullName")}
            placeholder="Required"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "err-fullName" : undefined}
          />
          {fieldError("fullName")}
        </label>
        <label>
          <span>Email <span style={{ color: "#d93829" }}>*</span></span>
          <input
            id="wl-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue=""
            onChange={() => clearError("email")}
            placeholder="Required"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {fieldError("email")}
        </label>
      </div>
      <div className="teaser-form-grid">
        <label>
          <span>Career stage</span>
          <select name="careerStage" defaultValue="Postdoc">
            {careerStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Research field</span>
          <input name="researchField" defaultValue="" placeholder="Optional" />
        </label>
      </div>
      <div className="teaser-form-grid" style={{ alignItems: "start" }}>
        <label>
          <span>Institution or ORCID iD</span>
          <input name="institution" autoComplete="organization" defaultValue="" placeholder="Optional" maxLength={200} />
        </label>
        <label>
          <span>Country <span style={{ color: "#d93829" }}>*</span></span>
          <select
            id="wl-country"
            name="country"
            autoComplete="country-name"
            defaultValue=""
            onChange={() => clearError("country")}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "err-country" : undefined}
          >
            <option value="" disabled>
              Select your country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {fieldError("country")}
        </label>
      </div>
      <div className="teaser-form-grid" style={WHATSAPP_ENABLED ? { alignItems: "start" } : { gridTemplateColumns: "1fr" }}>
        <label>
          <span>City / metro area</span>
          <input name="city" autoComplete="address-level2" defaultValue="" placeholder="Optional" />
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
                if (!event.target.value.trim()) setWaConsent(false);
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
            name="feedback"
            defaultValue=""
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
      {/* Box 1 (required): the only box that unlocks the Join button */}
      <div className="teaser-consent-row">
        <input
          type="checkbox"
          id="wl-terms"
          name="consent_given"
          checked={consentGiven}
          onChange={(event) => {
            setConsentGiven(event.target.checked);
            clearError("consent");
          }}
          required
          aria-required="true"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "err-consent" : undefined}
        />
        <label htmlFor="wl-terms" style={{ display: "inline", margin: 0 }}>
          I am 18 or older, I agree to the{" "}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms of Use
          </a>
          , and I have read the{" "}
          <a href="/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </label>
      </div>
      {fieldError("consent")}
      {/* Box 2 (optional): news emails */}
      <div className="teaser-consent-row">
        <input
          type="checkbox"
          id="wl-email-consent"
          name="consent_email"
          checked={emailConsent}
          onChange={(event) => setEmailConsent(event.target.checked)}
        />
        <label htmlFor="wl-email-consent" style={{ display: "inline", margin: 0 }}>
          {EMAIL_CONSENT_TEXT}
        </label>
      </div>
      {/* Box 3 (optional): shown only once a WhatsApp number has been typed */}
      {WHATSAPP_ENABLED && waNumber.trim() && (
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
      <p className="teaser-form-note">
        Heads up: Doc2Postdoc is for PhD students and postdocs. When we open, we&apos;ll ask you to confirm with your
        institutional email. If you don&apos;t have one, your ORCID iD works.
      </p>
      <div className="teaser-form-actions">
        <span className="teaser-submit-wrap">
          <button
            className="teaser-btn teaser-btn-gold teaser-form-submit"
            disabled={state === "submitting" || !consentGiven}
            type="submit"
            style={{ cursor: !consentGiven ? "not-allowed" : "pointer" }}
          >
            {state === "submitting" ? "Joining..." : "Join the waitlist"} <ArrowRight size={16} />
          </button>
          {/* A disabled button swallows clicks silently. This transparent cover catches them and explains why. */}
          {!consentGiven && <span className="teaser-submit-guard" onClick={lockedClick} aria-hidden="true" />}
        </span>
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
