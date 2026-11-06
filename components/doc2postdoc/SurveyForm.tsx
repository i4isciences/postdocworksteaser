/**
 * Doc2Postdoc — PhD & Postdoc Pain-Point Survey
 * Renders from doc2postdoc-survey-schema.json (same folder). Edit question text/options in the JSON, not here.
 * POSTs to /api/doc2postdoc/survey.
 *
 * [PRIVACY CONTACT EMAIL] is filled in below. [RETENTION PERIOD] is still waiting on Ran: it stays highlighted
 * in yellow on the page so it cannot ship unnoticed.
 */
"use client";

import { useMemo, useState } from "react";
import schema from "./doc2postdoc-survey-schema.json";
import styles from "./SurveyForm.module.css";

type QuestionType = "single" | "multi";
type Layout = "inline" | "list";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  layout: Layout;
  other: boolean;
  optional?: boolean;
  options: string[];
}

interface Section {
  id: string;
  title: string;
  optional?: boolean;
  items: Question[];
}

interface Schema {
  formId: string;
  version: string;
  title: string;
  sections: Section[];
  consent: {
    heading: string;
    paragraphs: string[];
    checkboxLabel: string;
    placeholders: string[];
  };
}

const SCHEMA = schema as unknown as Schema;

const PRIVACY_EMAIL = "privacy@doc2postdoc.org";

// answers[questionId] = string[] of selected option labels; "Other: <text>" stored literally if used
type Answers = Record<string, string[]>;
type OtherText = Record<string, string>;

const OTHER_SENTINEL = "__OTHER__";

function allQuestions(s: Schema): Question[] {
  return s.sections.flatMap((sec) => sec.items);
}

export default function SurveyForm() {
  const [answers, setAnswers] = useState<Answers>({});
  const [otherText, setOtherText] = useState<OtherText>({});
  const [consentChecked, setConsentChecked] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // bot trap — keep empty, hidden field
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const questions = useMemo(() => allQuestions(SCHEMA), []);

  function toggleSingle(qId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [qId]: [option] }));
    clearError(qId);
  }

  function toggleMulti(qId: string, option: string) {
    setAnswers((prev) => {
      const current = prev[qId] ?? [];
      const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [qId]: next };
    });
    clearError(qId);
  }

  function clearError(qId: string) {
    setErrors((prev) => {
      if (!prev[qId]) return prev;
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  }

  function setOther(qId: string, value: string) {
    setOtherText((prev) => ({ ...prev, [qId]: value }));
    clearError(qId);
  }

  function validate(): Record<string, string> {
    const nextErrors: Record<string, string> = {};
    for (const q of questions) {
      const selected = answers[q.id] ?? [];
      // "Other" must always be filled in when chosen, even on optional questions.
      if (selected.includes(OTHER_SENTINEL) && !otherText[q.id]?.trim()) {
        nextErrors[q.id] = "Please specify your answer.";
        continue;
      }
      if (q.optional) continue;
      if (selected.length === 0) nextErrors[q.id] = "Please select an answer.";
    }
    if (!consentChecked) {
      nextErrors["consent"] = "Please confirm you agree before submitting.";
    }
    setErrors(nextErrors);
    return nextErrors;
  }

  function buildPayload() {
    const out: Record<string, string[]> = {};
    for (const q of questions) {
      const selected = answers[q.id] ?? [];
      if (selected.length === 0) continue;
      out[q.id] = selected.map((opt) => (opt === OTHER_SENTINEL ? `Other: ${otherText[q.id]?.trim() ?? ""}` : opt));
    }
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (submitting) return;

    if (honeypot) return; // silently drop bot submissions

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // Use the freshly computed errors, not the `errors` state: setErrors() is async, so state would be stale here.
      // Walk the questions in page order so the first problem shown is the one nearest the top.
      const order = [...questions.map((q) => q.id), "consent"];
      const firstKey = order.find((key) => validationErrors[key]);
      if (firstKey) {
        document.getElementById(`q-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch("/api/doc2postdoc/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          formId: SCHEMA.formId,
          version: SCHEMA.version,
          answers: buildPayload(),
          consentGiven: consentChecked,
          consentAgeConfirmed: consentChecked, // single checkbox covers both per consent copy
          sourcePage: "doc2postdoc_teaser",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Submission failed. Please try again.");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "AbortError";
      setServerError(
        timedOut
          ? "This is taking longer than expected. Please try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      );
    } finally {
      clearTimeout(timer);
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.thankYou} role="status">
        <h2>Thank you.</h2>
        <p>
          Your responses help Doc2Postdoc identify the real challenges PhDs and postdocs face. We appreciate you taking
          the time.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <header className={styles.header}>
        <h1 className={styles.brand}>Doc2Postdoc</h1>
        <p className={styles.subtitle}>PhD &amp; Postdoc Pain-Point Survey</p>
        <p className={styles.meta}>35 Questions</p>
      </header>

      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="company_website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {SCHEMA.sections.map((section) => (
        <section key={section.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {section.items.map((q) => (
            <QuestionBlock
              key={q.id}
              question={q}
              selected={answers[q.id] ?? []}
              otherValue={otherText[q.id] ?? ""}
              error={errors[q.id]}
              onSingle={(opt) => toggleSingle(q.id, opt)}
              onMulti={(opt) => toggleMulti(q.id, opt)}
              onOtherChange={(val) => setOther(q.id, val)}
            />
          ))}
        </section>
      ))}

      <section id="q-consent" className={styles.consentBlock}>
        <h2 className={styles.sectionTitle}>{SCHEMA.consent.heading}</h2>
        {SCHEMA.consent.paragraphs.map((p, i) => (
          <p key={i} className={styles.consentText}>
            {renderConsentParagraph(p)}
          </p>
        ))}
        <label className={styles.consentCheckboxRow}>
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => {
              setConsentChecked(e.target.checked);
              clearError("consent");
            }}
          />
          <span>{SCHEMA.consent.checkboxLabel}</span>
        </label>
        {errors["consent"] && <p className={styles.errorText}>{errors["consent"]}</p>}
      </section>

      {serverError && (
        <p className={styles.errorText} role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className={styles.submitButton} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

function renderConsentParagraph(text: string) {
  // The privacy address is real. Any other [PLACEHOLDER] is highlighted so it cannot ship unfilled.
  return text.split(/(\[PRIVACY CONTACT EMAIL\]|\[RETENTION PERIOD\])/g).map((part, i) => {
    if (part === "[PRIVACY CONTACT EMAIL]") {
      return (
        <a key={i} href={`mailto:${PRIVACY_EMAIL}`}>
          {PRIVACY_EMAIL}
        </a>
      );
    }
    return part.startsWith("[") ? (
      <mark key={i} className={styles.placeholder}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

function QuestionBlock({
  question,
  selected,
  otherValue,
  error,
  onSingle,
  onMulti,
  onOtherChange,
}: {
  question: Question;
  selected: string[];
  otherValue: string;
  error?: string;
  onSingle: (opt: string) => void;
  onMulti: (opt: string) => void;
  onOtherChange: (val: string) => void;
}) {
  const isMulti = question.type === "multi";
  const inputType = isMulti ? "checkbox" : "radio";
  const handleChange = isMulti ? onMulti : onSingle;
  const groupClass = question.layout === "inline" ? styles.optionsInline : styles.optionsList;

  return (
    <div id={`q-${question.id}`} className={styles.question}>
      <p className={styles.questionText}>
        {question.text}
        {question.optional && <span className={styles.optionalTag}> (optional)</span>}
        {isMulti && <span className={styles.selectAllTag}> (Select all that apply)</span>}
      </p>
      <div className={groupClass} role="group" aria-label={question.text}>
        {question.options.map((opt) => (
          <label key={opt} className={styles.optionLabel}>
            <input
              type={inputType}
              name={question.id}
              checked={selected.includes(opt)}
              onChange={() => handleChange(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
        {question.other && (
          <label className={styles.optionLabel}>
            <input
              type={inputType}
              name={question.id}
              checked={selected.includes(OTHER_SENTINEL)}
              onChange={() => handleChange(OTHER_SENTINEL)}
            />
            <span>
              Other:{" "}
              <input
                type="text"
                className={styles.otherInput}
                value={otherValue}
                disabled={!selected.includes(OTHER_SENTINEL)}
                onChange={(e) => onOtherChange(e.target.value)}
                placeholder="Please specify"
                maxLength={200}
                aria-label={`${question.text} — other`}
              />
            </span>
          </label>
        )}
      </div>
      {error && (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
