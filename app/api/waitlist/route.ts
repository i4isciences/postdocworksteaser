import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminClient, insertSignup, isUnsubscribed, signupExists, updateConsent } from "@/lib/waitlist/db";
import { AD_TAG_FIELDS } from "@/lib/waitlist/adTags";
import { CONSENT_VERSION, EMAIL_CONSENT_TEXT, TERMS_CONSENT_TEXT, WHATSAPP_CONSENT_TEXT, WHATSAPP_ENABLED, toE164 } from "@/lib/waitlist/consent";
import { buildWelcomeEmail, buildAdminNotificationEmail } from "@/lib/waitlist/emails";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAREER_STAGES = new Set(["Postdoc", "PhD student", "Medical resident / fellow", "Faculty / PI", "Other"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const careerStage = typeof body.careerStage === "string" && CAREER_STAGES.has(body.careerStage) ? body.careerStage : "Postdoc";
    const researchField = typeof body.researchField === "string" ? body.researchField.trim() : "";
    const institution = typeof body.institution === "string" ? body.institution.trim() : "";
    const country = typeof body.country === "string" ? body.country.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";
    // Never trust the browser for consent: it must be exactly true (or the string "true").
    // Box 1 (required) is the Terms/Privacy/18+ box. Box 2 (news emails) and Box 3 (WhatsApp) are optional and separate.
    const consentGiven = body.consent_given === true || body.consent_given === "true";
    const emailConsent = body.consent_email === true || body.consent_email === "true";
    // WhatsApp is switched off until sending is set up (NEXT_PUBLIC_WHATSAPP_ENABLED=true turns it on).
    const waConsent = WHATSAPP_ENABLED && (body.whatsapp_consent_given === true || body.whatsapp_consent_given === "true");
    // The WhatsApp number is kept only when its own box was ticked and it converts to E.164.
    const waNumber = waConsent && typeof body.whatsapp_number === "string" ? toE164(body.whatsapp_number) : null;
    const attribution: Record<string, string> = {};
    for (const key of AD_TAG_FIELDS) {
      const value = body[key];
      attribution[key] = typeof value === "string" ? value.slice(0, 100) : "";
    }
    const source = typeof body.source === "string" ? body.source : "doc2postdoc-waitlist";

    if (fullName.length < 2 || !emailPattern.test(email)) {
      return NextResponse.json({ success: false, error: "Please add your name and email so we know where to send your invite." }, { status: 400 });
    }
    if (!country) {
      return NextResponse.json({ success: false, error: "Please select or provide your country." }, { status: 400 });
    }
    if (!consentGiven) {
      return NextResponse.json({ success: false, error: "Please accept the Terms of Use and Privacy Policy to continue." }, { status: 400 });
    }

    // 1. Save to Supabase database
    // If this person unsubscribed earlier we never email them again (they stay flagged, even if they sign up again).
    let previouslyUnsubscribed = false;
    try {
      const supabase = getAdminClient();
      previouslyUnsubscribed = await isUnsubscribed(supabase, email);
      const now = new Date().toISOString();
      // Saved with every signup. The consent wording and the time come from the SERVER, never the browser.
      const row: Record<string, unknown> = {
        full_name: fullName,
        email,
        career_stage: careerStage,
        research_field: researchField,
        institution,
        city: city ? `${city}, ${country}` : country,
        country,
        feedback,
        // Box 1: Terms of Use / Privacy Policy / 18+
        consent_given: consentGiven,
        consented_at: now,
        consent_text: TERMS_CONSENT_TEXT,
        consent_text_version: CONSENT_VERSION,
        consent_at_utc: now,
        // Box 2: news emails. false = confirmation email only, no news emails.
        email_opt_in: emailConsent,
        email_opt_in_at: emailConsent ? now : null,
        email_opt_in_text: emailConsent ? EMAIL_CONSENT_TEXT : null,
        email_opt_in_version: emailConsent ? CONSENT_VERSION : null,
        ...attribution,
        // Box 3: WhatsApp (only when a number was typed and its own box ticked)
        ...(waNumber
          ? {
              whatsapp_number: waNumber,
              whatsapp_consent_given: true,
              whatsapp_consent_text: WHATSAPP_CONSENT_TEXT,
              whatsapp_consent_at: now,
              whatsapp_consent_version: CONSENT_VERSION,
            }
          : {}),
        ...(previouslyUnsubscribed ? { unsubscribed: true, unsubscribed_at: now } : {}),
      };
      if (await signupExists(supabase, email)) {
        // Already on the list (for example signed up under the old single box): keep the existing row and record only
        // the new consent choices. They stay "not opted in to email" until they tick Box 2.
        const patch: Record<string, unknown> = { ...row };
        delete patch.email;
        delete patch.full_name;
        if (!emailConsent) for (const k of ["email_opt_in", "email_opt_in_at", "email_opt_in_text", "email_opt_in_version"]) delete patch[k];
        const updated = await updateConsent(supabase, email, patch);
        if (!updated.ok) console.error("Returning signup consent was NOT saved:", updated.error);
        else if (updated.dropped.length) console.warn("Consent saved, but these columns are missing in eyewee_waitlist:", updated.dropped.join(", "));
      } else {
        // A missing column only drops that one column (see insertSignup), so nothing else is lost.
        const result = await insertSignup(supabase, row);
        if (!result.ok) console.error("Signup was NOT saved to the database:", result.error);
        else if (result.dropped.length) console.warn("Signup saved, but these columns are missing in eyewee_waitlist:", result.dropped.join(", "));
      }
    } catch (dbError) {
      console.error("Database connection error (continuing to email delivery):", dbError);
    }

    // 2. Deliver submission emails via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      // Always send from the verified doc2postdoc.com sender. There is deliberately no fallback to another
      // sender: a different From domain would fail DMARC alignment and land in spam.
      const DEFAULT_FROM = "Doc2Postdoc <hello@doc2postdoc.com>";
      const envFrom = (process.env.RESEND_FROM_EMAIL || "").trim();
      // Safety net: only the verified doc2postdoc.com domain may send. A stale value in the environment
      // (an old brand or domain) is ignored, because a different From domain would fail DMARC and land in junk.
      const configuredFrom = /@doc2postdoc\.com>?$/i.test(envFrom) ? envFrom : DEFAULT_FROM;
      if (envFrom && configuredFrom !== envFrom) console.warn("RESEND_FROM_EMAIL is not a @doc2postdoc.com address; using the default sender instead.");

      const adminRecipients = Array.from(
        new Set(["hello@doc2postdoc.com", process.env.WAITLIST_NOTIFY_EMAIL].filter(Boolean))
      ) as string[];

      const sendSafe = async (params: {
        from: string;
        to: string[];
        replyTo?: string;
        subject: string;
        html: string;
        text: string;
        headers?: Record<string, string>;
      }) => {
        const kind = params.to.includes(email) ? "welcome email to the signup" : "admin notification";
        try {
          const res = await resend.emails.send(params);
          if (res.error) {
            const status = (res.error as { statusCode?: number | null }).statusCode;
            console.error(`EMAIL NOT SENT (${kind}) from "${params.from}":`, res.error);
            if (status === 403 || status === 401) {
              console.error(
                "ACTION NEEDED: the RESEND_API_KEY in this environment is not allowed to send from that domain. " +
                  "In Resend > API Keys, create a key with Sending access for doc2postdoc.com (or Full access), " +
                  "set it as RESEND_API_KEY in Vercel (Production), then redeploy."
              );
            }
          }
        } catch (sendErr) {
          console.error(`EMAIL NOT SENT (${kind}) - request threw:`, sendErr);
        }
      };

      const sends: Promise<void>[] = [];

      // A. Admin notification email to hello@doc2postdoc.com (includes country and feedback)
      const adminEmail = buildAdminNotificationEmail({
        fullName,
        email,
        careerStage,
        researchField,
        institution,
        country,
        city,
        feedback,
        whatsappNumber: waNumber || undefined,
        source,
      });

      sends.push(
        sendSafe({
          from: configuredFrom,
          to: adminRecipients,
          replyTo: email,
          subject: adminEmail.subject,
          html: adminEmail.html,
          text: adminEmail.text,
        })
      );

      // B. User submission-cum-marketing confirmation email (includes summary & feedback)
      const userEmail = buildWelcomeEmail({
        fullName,
        email,
        careerStage,
        researchField,
        institution,
        country,
        city,
        feedback,
      });

      // Someone who unsubscribed earlier is never emailed again.
      if (!previouslyUnsubscribed) {
        sends.push(
          sendSafe({
            from: configuredFrom,
            to: [email],
            replyTo: "hello@doc2postdoc.com",
            headers: userEmail.headers,
            subject: userEmail.subject,
            html: userEmail.html,
            text: userEmail.text,
          })
        );
      }

      await Promise.allSettled(sends);
    } else {
      console.error("RESEND_API_KEY is not set -- skipping waitlist email sends");
    }

    // 3. Optional webhook (e.g. n8n or CRM)
    const webhook = process.env.N8N_LEAD_WEBHOOK_URL;
    if (webhook) {
      void fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, careerStage, researchField, institution, country, city, feedback, consentVersion: CONSENT_VERSION, emailOptIn: emailConsent, whatsappNumber: waNumber, ...attribution, source }),
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist submission overall handler failed:", error);
    return NextResponse.json({ success: false, error: "We could not process that signup. Please try again." }, { status: 500 });
  }
}
