import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminClient, insertSignup, isUnsubscribed } from "@/lib/waitlist/db";
import { AD_TAG_FIELDS } from "@/lib/waitlist/adTags";
import { CONSENT_TEXT, CONSENT_TEXT_VERSION, WHATSAPP_CONSENT_TEXT, WHATSAPP_ENABLED, toE164 } from "@/lib/waitlist/consent";
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
    const consentGiven = body.consent_given === true || body.consent_given === "true";
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
      return NextResponse.json({ success: false, error: "Please accept the Terms of Service and Privacy Policy to continue." }, { status: 400 });
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
        consent_given: consentGiven,
        consented_at: now,
        consent_text: CONSENT_TEXT,
        consent_text_version: CONSENT_TEXT_VERSION,
        consent_at_utc: now,
        ...attribution,
        ...(waNumber ? { whatsapp_number: waNumber, whatsapp_consent_given: true, whatsapp_consent_text: WHATSAPP_CONSENT_TEXT } : {}),
        ...(previouslyUnsubscribed ? { unsubscribed: true, unsubscribed_at: now } : {}),
      };
      // A missing column only drops that one column (see insertSignup), so nothing else is lost.
      const result = await insertSignup(supabase, row);
      if (!result.ok) console.error("Signup was NOT saved to the database:", result.error);
      else if (result.dropped.length) console.warn("Signup saved, but these columns are missing in eyewee_waitlist:", result.dropped.join(", "));
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
        body: JSON.stringify({ fullName, email, careerStage, researchField, institution, country, city, feedback, consentText: CONSENT_TEXT, consentTextVersion: CONSENT_TEXT_VERSION, whatsappNumber: waNumber, ...attribution, source }),
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist submission overall handler failed:", error);
    return NextResponse.json({ success: false, error: "We could not process that signup. Please try again." }, { status: 500 });
  }
}
