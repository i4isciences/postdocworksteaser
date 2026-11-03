import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, requireSupabaseEnv } from "@/lib/waitlist/env";
import { AD_TAG_FIELDS } from "@/lib/waitlist/adTags";
import { CONSENT_TEXT, CONSENT_TEXT_VERSION, WHATSAPP_CONSENT_TEXT, toE164 } from "@/lib/waitlist/consent";
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
    const waConsent = body.whatsapp_consent_given === true || body.whatsapp_consent_given === "true";
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
    try {
      const { url, publishableKey } = requireSupabaseEnv();
      const secretKey = getSupabaseSecretKey();
      const supabase = createClient(url, secretKey || publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const record: Record<string, unknown> = {
        full_name: fullName,
        email,
        career_stage: careerStage,
        research_field: researchField,
        institution,
        city: city ? `${city}, ${country}` : country,
        consent_given: consentGiven,
        consented_at: new Date().toISOString(),
      };
      // Saved with every signup. The consent wording and the time come from the SERVER. If the table does
      // not have the newer columns yet, retry with fewer of them so the signup itself is never lost.
      const consentExtras: Record<string, unknown> = {
        consent_text: CONSENT_TEXT,
        consent_text_version: CONSENT_TEXT_VERSION,
        consent_at_utc: new Date().toISOString(),
        ...attribution,
      };
      const waExtras: Record<string, unknown> = waNumber
        ? { whatsapp_number: waNumber, whatsapp_consent_given: true, whatsapp_consent_text: WHATSAPP_CONSENT_TEXT }
        : {};
      const attempts: Record<string, unknown>[] = [
        { ...record, country, ...consentExtras, ...waExtras },
        { ...record, country, ...consentExtras },
        { ...record, country },
        record,
      ];
      for (const attempt of attempts) {
        const { error } = await supabase.from("eyewee_waitlist").insert(attempt);
        if (!error) break;
        console.warn("Supabase insert attempt failed, trying a reduced record:", error.message);
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
      const configuredFrom = process.env.RESEND_FROM_EMAIL || "Doc2Postdoc <hello@doc2postdoc.com>";

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
        try {
          const res = await resend.emails.send(params);
          if (res.error) console.error("Email send failed:", res.error);
        } catch (sendErr) {
          console.error("Email send threw:", sendErr);
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
