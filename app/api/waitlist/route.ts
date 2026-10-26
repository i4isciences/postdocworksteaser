import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, requireSupabaseEnv } from "@/lib/waitlist/env";
import { buildWelcomeEmail, buildAdminNotificationEmail } from "@/lib/waitlist/emails";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAREER_STAGES = new Set(["Postdoc", "PhD student", "Medical resident / fellow", "Faculty / PI", "Other"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: unknown;
      email?: unknown;
      careerStage?: unknown;
      researchField?: unknown;
      institution?: unknown;
      city?: unknown;
      consentGiven?: unknown;
      source?: unknown;
    };

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const careerStage = typeof body.careerStage === "string" && CAREER_STAGES.has(body.careerStage) ? body.careerStage : "Postdoc";
    const researchField = typeof body.researchField === "string" ? body.researchField.trim() : "";
    const institution = typeof body.institution === "string" ? body.institution.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";
    const consentGiven = body.consentGiven === true;
    const source = typeof body.source === "string" ? body.source : "doc2postdoc-waitlist";

    if (fullName.length < 2 || !emailPattern.test(email)) {
      return NextResponse.json({ success: false, error: "Please add your name and email so we know where to send your invite." }, { status: 400 });
    }
    if (!consentGiven) {
      return NextResponse.json({ success: false, error: "Please accept the Terms of Service and Privacy Policy to continue." }, { status: 400 });
    }

    // 1. Save to Supabase database
    try {
      const { url, publishableKey } = requireSupabaseEnv();
      const secretKey = getSupabaseSecretKey();
      const supabase = createClient(url, secretKey || publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { error } = await supabase.from("eyewee_waitlist").insert({
        full_name: fullName,
        email,
        career_stage: careerStage,
        research_field: researchField,
        institution,
        city,
        consent_given: consentGiven,
        consented_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Supabase insert error (continuing to email delivery):", error);
      }
    } catch (dbError) {
      console.error("Database connection error (continuing to email delivery):", dbError);
    }

    // 2. Deliver submission emails via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const defaultFrom = "Doc2Postdoc <onboarding@resend.dev>";
      const configuredFrom = process.env.RESEND_FROM_EMAIL || "Doc2Postdoc <hello@doc2postdoc.com>";

      const adminRecipients = Array.from(
        new Set(["hello@doc2postdoc.com", process.env.WAITLIST_NOTIFY_EMAIL].filter(Boolean))
      ) as string[];

      const sendSafe = async (params: { from: string; to: string[]; replyTo?: string; subject: string; html: string; text: string }) => {
        try {
          const res = await resend.emails.send(params);
          if (res.error) {
            console.warn("Primary send failed with error, falling back to verified sandbox sender:", res.error);
            await resend.emails.send({ ...params, from: defaultFrom });
          }
        } catch (sendErr) {
          console.warn("Send threw exception, retrying with default verified sender:", sendErr);
          try {
            await resend.emails.send({ ...params, from: defaultFrom });
          } catch (retryErr) {
            console.error("Final send retry failed:", retryErr);
          }
        }
      };

      const sends: Promise<void>[] = [];

      // A. Admin notification email to hello@doc2postdoc.com
      const adminEmail = buildAdminNotificationEmail({
        fullName,
        email,
        careerStage,
        researchField,
        institution,
        city,
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

      // B. User submission-cum-marketing confirmation email
      const userEmail = buildWelcomeEmail({
        fullName,
        email,
        careerStage,
        researchField,
        institution,
        city,
      });

      sends.push(
        sendSafe({
          from: configuredFrom,
          to: [email],
          replyTo: "hello@doc2postdoc.com",
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
        body: JSON.stringify({ fullName, email, careerStage, researchField, institution, city, source }),
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist submission overall handler failed:", error);
    return NextResponse.json({ success: false, error: "We could not process that signup. Please try again." }, { status: 500 });
  }
}
