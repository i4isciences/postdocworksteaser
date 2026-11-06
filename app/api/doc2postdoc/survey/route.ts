import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/waitlist/db";
import schema from "@/components/doc2postdoc/doc2postdoc-survey-schema.json";

type Q = { id: string; type: "single" | "multi"; other: boolean; optional?: boolean; options: string[] };

const QUESTIONS: Q[] = (schema.sections as { items: Q[] }[]).flatMap((s) => s.items);
const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
const TABLE = "doc2postdoc_survey_responses";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Consent is checked here, on the server, whatever the page did.
    if (body.consentGiven !== true || body.consentAgeConfirmed !== true) {
      return NextResponse.json({ error: "Consent is required to submit." }, { status: 400 });
    }

    const raw = body.answers;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
    }

    // Allowlist: only question ids that exist in the schema are kept. Anything else is silently dropped.
    const clean: Record<string, string[]> = {};
    const invalid: string[] = [];
    for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
      const q = BY_ID.get(id);
      if (!q) continue;
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
        invalid.push(id);
        continue;
      }
      const picked = Array.from(new Set(value as string[]));
      const ok = picked.every((v) => {
        if (q.options.includes(v)) return true;
        return q.other && v.startsWith("Other: ") && v.slice(7).trim().length > 0 && v.length <= 220;
      });
      if (!ok || picked.length === 0 || (q.type === "single" && picked.length > 1)) {
        invalid.push(id);
        continue;
      }
      clean[id] = picked;
    }
    if (invalid.length) {
      return NextResponse.json({ error: "Some answers were not valid.", missing: invalid }, { status: 400 });
    }

    const missing = QUESTIONS.filter((q) => !q.optional && !clean[q.id]).map((q) => q.id);
    if (missing.length) {
      return NextResponse.json({ error: "Please answer all required questions.", missing }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error } = await getAdminClient()
      .from(TABLE)
      .insert({
        consent_given: true,
        consent_age_confirmed: true,
        consent_timestamp: now,
        answers: clean,
        source_page: typeof body.sourcePage === "string" ? body.sourcePage.slice(0, 60) : "doc2postdoc_teaser",
        locale: "en",
      });

    if (error) {
      console.error("Survey response was NOT saved:", error.message);
      return NextResponse.json({ error: "We could not save your response. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Survey submission handler failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
