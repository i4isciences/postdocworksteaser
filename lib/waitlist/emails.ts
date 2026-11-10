import { SITE_URL, SUPPORT_EMAIL, UNSUBSCRIBE_MAILTO, buildUnsubscribeHeaders, buildUnsubscribeLinks } from "@/lib/waitlist/unsubscribe";

type WelcomeEmailParams = {
  fullName: string;
  email: string;
  careerStage: string;
  researchField?: string;
  institution?: string;
  country?: string;
  city?: string;
  feedback?: string;
};

// Physical mailing address for the email footer (a PO box is fine). Set MAILING_ADDRESS in the environment.
// If it is not set the line is left out, so nothing like "[address]" is ever sent.
// Falls back to the company address in the Privacy Policy, so the footer is never without one.
const DEFAULT_MAILING_ADDRESS = "I4I Sciences LLC dba Doc2Postdoc, 117 S Lexington St STE 100, Harrisonville, MO 64701, USA";
const MAILING_ADDRESS = (process.env.MAILING_ADDRESS || "").trim() || DEFAULT_MAILING_ADDRESS;

// "2026-11-07 14:05 UTC"
function utcStamp(date = new Date()): string {
  return date.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

// Everything a visitor typed is escaped before it goes into HTML, so nobody can inject links or code.
function esc(value: string | undefined | null): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildWelcomeEmail({
  fullName,
  email,
  careerStage,
  researchField,
  institution,
  country,
  city,
}: WelcomeEmailParams) {
  const firstName = fullName.split(" ")[0] || fullName;
  const fieldLine = researchField ? ` in ${researchField}` : "";
  const h = {
    firstName: esc(firstName),
    fullName: esc(fullName),
    email: esc(email),
    careerStage: esc(careerStage),
    fieldLine: esc(fieldLine),
    researchField: esc(researchField),
    institution: esc(institution),
    country: esc(country),
    city: esc(city),
  };

  const subject = "Welcome to Doc2Postdoc℠ | Where the Next Step Has Already Been Taken";

  // Every email carries its own one-click unsubscribe link for this person (falls back to a mailto link).
  const unsubscribeUrl = buildUnsubscribeLinks(email)?.page || UNSUBSCRIBE_MAILTO;

  const text = `Hi ${firstName},

Thank you for joining the Doc2Postdoc℠ waitlist! You're on the early-access list.

SUBMISSION DETAILS:
• Name: ${fullName}
• Email: ${email}
• Career Stage: ${careerStage}${fieldLine}
• Country: ${country || "Not specified"}
• City: ${city || "Not specified"}
${institution ? `• Institution or ORCID iD: ${institution}\n` : ""}
WHAT YOU GET WITH DOC2POSTDOC:
1. Peer matching: When we open, you'll be able to connect with postdocs and researchers who have been through similar career moves.
2. eyewee™ AI Guidance: Ask in plain text or voice for practical guidance for your research career.
3. Privacy: You keep ownership of what you submit. Our Terms of Use and Privacy Policy explain how we use it.

EARLY ACCESS ROLLOUT:
We're opening Doc2Postdoc metro by metro. If you ticked the news box, we'll email you when your field and region open. Otherwise, visit doc2postdoc.com anytime.

Explore more anytime: ${SITE_URL}
Questions or feedback? Just reply to this email or write to ${SUPPORT_EMAIL}

Warm regards,
The Doc2Postdoc Team
Powered by i4iSciences™

--
You are receiving this because you joined the Doc2Postdoc℠ waitlist.
Unsubscribe: ${unsubscribeUrl}${MAILING_ADDRESS ? `\n${MAILING_ADDRESS}` : ""}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F5F3EE;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;color:#182D5A;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F3EE;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#FFFFFF;border-radius:12px;border:1px solid #E2E6F0;overflow:hidden;box-shadow:0 8px 24px rgba(24,45,90,0.06);">
            <!-- Header Bar -->
            <tr>
              <td style="background-color:#182D5A;padding:28px 36px;text-align:left;border-bottom:3px solid #F4A725;">
                <div style="font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">
                  Doc<span style="color:#F4A725;">2</span>Postdoc<span style="font-size:13px;color:#F4A725;vertical-align:super;">℠</span>
                </div>
                <div style="font-size:12px;color:#C9D3EA;margin-top:4px;letter-spacing:0.04em;">
                  Where the next step has already been taken
                </div>
              </td>
            </tr>

            <!-- Main Body -->
            <tr>
              <td style="padding:36px;">
                <div style="display:inline-block;background-color:#FFF3D6;border:1px solid #F4A725;border-radius:999px;padding:4px 14px;font-size:11px;font-weight:700;color:#182D5A;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px;">
                  ON THE EARLY-ACCESS LIST
                </div>

                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#182D5A;font-weight:700;">
                  Hi ${h.firstName}, welcome to Doc2Postdoc.
                </h1>

                <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4B5468;">
                  Thank you for joining our early-access waitlist. You&apos;re on the early-access list as a <strong>${h.careerStage}</strong>${h.fieldLine}.
                </p>

                <!-- Submission Summary Card -->
                <div style="background-color:#F7F8FB;border:1px solid #E5E8F0;border-radius:8px;padding:18px 20px;margin-bottom:26px;">
                  <div style="font-size:11px;font-weight:700;color:#F4A725;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">
                    Your Registration Summary
                  </div>
                  <table role="presentation" width="100%" style="font-size:13.5px;line-height:1.6;color:#182D5A;">
                    <tr>
                      <td style="width:36%;color:#6B768E;padding:3px 0;">Name:</td>
                      <td style="font-weight:600;padding:3px 0;">${h.fullName}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B768E;padding:3px 0;">Email:</td>
                      <td style="font-weight:600;padding:3px 0;">${h.email}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B768E;padding:3px 0;">Career Stage:</td>
                      <td style="font-weight:600;padding:3px 0;">${h.careerStage}</td>
                    </tr>
                    ${researchField ? `<tr><td style="color:#6B768E;padding:3px 0;">Field:</td><td style="font-weight:600;padding:3px 0;">${h.researchField}</td></tr>` : ""}
                    ${institution ? `<tr><td style="color:#6B768E;padding:3px 0;">Institution or ORCID iD:</td><td style="font-weight:600;padding:3px 0;">${h.institution}</td></tr>` : ""}
                    <tr>
                      <td style="color:#6B768E;padding:3px 0;">Country:</td>
                      <td style="font-weight:600;padding:3px 0;">${h.country || "—"}</td>
                    </tr>
                    <tr><td style="color:#6B768E;padding:3px 0;">City / Metro:</td><td style="font-weight:600;padding:3px 0;">${h.city || "—"}</td></tr>
                  </table>
                </div>

                <!-- Marketing / Feature Highlights -->
                <div style="margin-bottom:28px;">
                  <h2 style="font-size:16px;font-weight:700;color:#182D5A;margin:0 0 14px;border-bottom:1px solid #E8ECF4;padding-bottom:8px;">
                    What Doc2Postdoc Brings to Your Transition
                  </h2>

                  <div style="margin-bottom:14px;display:flex;align-items:flex-start;">
                    <div style="font-size:16px;color:#F4A725;margin-right:10px;line-height:1.2;">✦</div>
                    <div>
                      <strong style="color:#182D5A;font-size:14px;">Peer matching:</strong>
                      <span style="color:#4B5468;font-size:13.5px;line-height:1.5;display:block;margin-top:2px;">
                        When we open, you&apos;ll be able to connect with postdocs and researchers who have been through similar career moves.
                      </span>
                    </div>
                  </div>

                  <div style="margin-bottom:14px;display:flex;align-items:flex-start;">
                    <div style="font-size:16px;color:#F4A725;margin-right:10px;line-height:1.2;">✦</div>
                    <div>
                      <strong style="color:#182D5A;font-size:14px;">eyewee™ AI Guidance:</strong>
                      <span style="color:#4B5468;font-size:13.5px;line-height:1.5;display:block;margin-top:2px;">
                        Ask in plain text or voice for practical guidance for your research career.
                      </span>
                    </div>
                  </div>

                  <div style="margin-bottom:14px;display:flex;align-items:flex-start;">
                    <div style="font-size:16px;color:#F4A725;margin-right:10px;line-height:1.2;">✦</div>
                    <div>
                      <strong style="color:#182D5A;font-size:14px;">Privacy:</strong>
                      <span style="color:#4B5468;font-size:13.5px;line-height:1.5;display:block;margin-top:2px;">
                        You keep ownership of what you submit. Our <a href="${SITE_URL}/terms" style="color:#182D5A;text-decoration:underline;">Terms of Use</a> and <a href="${SITE_URL}/privacy" style="color:#182D5A;text-decoration:underline;">Privacy Policy</a> explain how we use it.
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Rollout Notice -->
                <div style="background-color:#FFF8EC;border-left:4px solid #F4A725;border-radius:4px;padding:14px 16px;margin-bottom:28px;">
                  <p style="margin:0;font-size:13.5px;line-height:1.6;color:#855507;">
                    <strong>Next steps:</strong> We&apos;re opening Doc2Postdoc metro by metro. If you ticked the news box, we&apos;ll email you when your field and region open. Otherwise, visit doc2postdoc.com anytime.
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin:32px 0 10px;">
                  <a href="${SITE_URL}" style="display:inline-block;background-color:#182D5A;color:#FFFFFF;padding:12px 28px;border-radius:99px;font-size:14px;font-weight:700;text-decoration:none;border:2px solid #182D5A;">
                    Visit Doc2Postdoc.com
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 36px;background-color:#F7F8FB;border-top:1px solid #E8ECF4;text-align:center;">
                <p style="margin:0 0 6px;font-size:12px;color:#6B768E;">
                  Questions or need support? Reply directly to this email or reach us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#182D5A;font-weight:600;text-decoration:none;">${SUPPORT_EMAIL}</a>.
                </p>
                <p style="margin:0 0 6px;font-size:11px;color:#94A0B8;">
                  You are receiving this because you joined the Doc2Postdoc℠ waitlist.
                  <a href="${esc(unsubscribeUrl)}" style="color:#6B768E;text-decoration:underline;">Unsubscribe</a>
                </p>
                ${MAILING_ADDRESS ? `<p style="margin:0 0 6px;font-size:11px;color:#94A0B8;">${esc(MAILING_ADDRESS)}</p>` : ""}
                <p style="margin:0;font-size:11px;color:#94A0B8;">
                  © 2026 Doc2Postdoc℠ · Powered by i4iSciences™ ·
                  <a href="${SITE_URL}/privacy" style="color:#94A0B8;text-decoration:underline;">Privacy Policy</a> ·
                  <a href="${SITE_URL}/terms" style="color:#94A0B8;text-decoration:underline;">Terms of Use</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  // List-Unsubscribe (+ One-Click) lets Gmail and Outlook show their own Unsubscribe button, which helps avoid junk.
  const headers = buildUnsubscribeHeaders(email);

  return { subject, html, text, headers };
}

export function buildAdminNotificationEmail({
  fullName,
  email,
  careerStage,
  researchField,
  institution,
  country,
  city,
  feedback,
  source,
  whatsappNumber,
}: WelcomeEmailParams & { source?: string; whatsappNumber?: string }) {
  const subject = `[Waitlist Submission] ${fullName} (${country ? `${country} · ` : ""}${careerStage}) - hello@doc2postdoc.com`;

  const text = `New waitlist submission received:

Name: ${fullName}
Email: ${email}
Career stage: ${careerStage}
Research field: ${researchField || "Not specified"}
Institution: ${institution || "Not specified"}
Country: ${country || "Not specified"}
City: ${city || "Not specified"}
WhatsApp (opted in): ${whatsappNumber || "None"}
Feedback / Thoughts: ${feedback || "None provided"}
Source: ${source || "Doc2Postdoc Waitlist"}
Time: ${utcStamp()}`;

  const html = `<!DOCTYPE html>
<html>
  <body style="font-family:Arial,sans-serif;color:#182D5A;padding:20px;background:#F5F3EE;">
    <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border-radius:8px;padding:26px;border:1px solid #E2E6F0;box-shadow:0 4px 16px rgba(24,45,90,0.06);">
      <h2 style="color:#182D5A;margin-top:0;border-bottom:2px solid #F4A725;padding-bottom:12px;font-size:18px;">
        New Doc2Postdoc Waitlist Submission
      </h2>
      <table style="width:100%;font-size:14px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="color:#6B768E;width:140px;padding:7px 0;"><strong>Full Name:</strong></td><td style="padding:7px 0;font-weight:600;">${esc(fullName)}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Email:</strong></td><td style="padding:7px 0;"><a href="mailto:${esc(email)}" style="color:#182D5A;font-weight:600;">${esc(email)}</a></td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Career Stage:</strong></td><td style="padding:7px 0;">${esc(careerStage)}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Research Field:</strong></td><td style="padding:7px 0;">${esc(researchField) || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Institution / ORCID iD:</strong></td><td style="padding:7px 0;">${esc(institution) || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Country:</strong></td><td style="padding:7px 0;font-weight:600;">${esc(country) || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>City / Metro:</strong></td><td style="padding:7px 0;">${esc(city) || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>WhatsApp (opted in):</strong></td><td style="padding:7px 0;">${esc(whatsappNumber) || "—"}</td></tr>
        <tr>
          <td style="color:#6B768E;vertical-align:top;padding:8px 0;"><strong>Feedback / Thoughts:</strong></td>
          <td style="padding:8px 0;">
            ${
              feedback
                ? `<div style="background:#F7F8FB;border-left:3px solid #F4A725;padding:10px 14px;border-radius:4px;color:#182D5A;white-space:pre-wrap;font-style:italic;">${esc(feedback)}</div>`
                : `<span style="color:#8A93A6;">None provided</span>`
            }
          </td>
        </tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Source:</strong></td><td style="padding:7px 0;">${esc(source) || "Doc2Postdoc"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Timestamp:</strong></td><td style="padding:7px 0;">${utcStamp()}</td></tr>
      </table>
    </div>
  </body>
</html>`;

  return { subject, html, text };
}
