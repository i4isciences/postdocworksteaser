"use client";

import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { FormEvent, useState } from "react";

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

const careerStages = ["Postdoc", "PhD student", "Medical resident / fellow", "Faculty / PI", "Other"];

export function WaitlistForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [careerStage, setCareerStage] = useState("Postdoc");
  const [researchField, setResearchField] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [feedback, setFeedback] = useState("");
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
    if (!fullName.trim() || !email.trim() || !country.trim()) {
      setState("error");
      setMessage("Please fill in your name, email, and country to continue.");
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
          country,
          city,
          feedback,
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
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Jane Doe" required />
        </label>
        <label>
          <span>Email <span style={{ color: "#d93829" }}>*</span></span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@university.edu" required />
        </label>
      </div>
      <label>
        <span>Career stage (optional)</span>
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
          <span>Research field (optional)</span>
          <input value={researchField} onChange={(event) => setResearchField(event.target.value)} placeholder="e.g. HBV virology" />
        </label>
        <label>
          <span>Institution (optional)</span>
          <input value={institution} onChange={(event) => setInstitution(event.target.value)} placeholder="University or lab" />
        </label>
      </div>
      <div className="teaser-form-grid">
        <label>
          <span>Country <span style={{ color: "#d93829" }}>*</span></span>
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="e.g. United States"
            required
          />
        </label>
        <label>
          <span>City / metro area (optional)</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. Chicago, IL"
          />
        </label>
      </div>
      <label>
        <span>Feedback & suggestions (optional)</span>
        <textarea
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="What are the biggest challenges you're navigating with your next step, or features you'd like to see in Doc2Postdoc?"
          rows={3}
          maxLength={1500}
        />
      </label>
      <SocialSubscribeBox />
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
