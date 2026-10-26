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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://doc2postdoc.com";

export function buildWelcomeEmail({
  fullName,
  email,
  careerStage,
  researchField,
  institution,
  country,
  city,
  feedback,
}: WelcomeEmailParams) {
  const firstName = fullName.split(" ")[0] || fullName;
  const fieldLine = researchField ? ` in ${researchField}` : "";
  const locationLine = [institution, city, country].filter(Boolean).join(" · ");

  const subject = "Welcome to Doc2Postdoc℠ | Where the Next Step Has Already Been Taken";

  const text = `Hi ${firstName},

Thank you for joining the Doc2Postdoc℠ waitlist! Your early-access spot is confirmed.

SUBMISSION DETAILS:
• Name: ${fullName}
• Email: ${email}
• Career Stage: ${careerStage}${fieldLine}
• Country: ${country || "Not specified"}
${city ? `• City: ${city}\n` : ""}${institution ? `• Institution: ${institution}\n` : ""}${feedback ? `• Your Feedback: "${feedback}"\n` : ""}
WHAT YOU GET WITH DOC2POSTDOC:
1. Peer Matching Up-line: Connect directly with researchers and postdocs one step ahead of you who have already navigated your exact transition, discipline, and career stage.
2. eyewee™ AI Guidance: Ask in plain text or voice — guidance and answers backed by verified postdoc experiences.
3. Your Circle, Reachable in One Ring: Instant outreach to people you already trust when you need answers fast.
4. Privacy by Default: Your conversations and work remain strictly yours. Sharing ideas or drafts never transfers ownership.

EARLY ACCESS ROLLOUT:
We're opening Doc2Postdoc metro by metro, starting with Chicago and St. Louis. You will receive an email as soon as connections in your discipline open.

Explore more anytime: ${SITE_URL}
Questions or feedback? Reach us directly at hello@doc2postdoc.com

Warm regards,
The Doc2Postdoc Team
Powered by i4iSciences™`;

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
                  Doc<span style="color:#F4A725;">2</span>Postdoc<sup style="font-size:11px;color:#F4A725;">SM</sup>
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
                  EARLY ACCESS CONFIRMED
                </div>

                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#182D5A;font-weight:700;">
                  Hi ${firstName}, welcome to Doc2Postdoc.
                </h1>

                <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4B5468;">
                  Thank you for joining our early-access waitlist. You&apos;re confirmed to receive priority access as a <strong>${careerStage}</strong>${fieldLine}.
                </p>

                <!-- Submission Summary Card -->
                <div style="background-color:#F7F8FB;border:1px solid #E5E8F0;border-radius:8px;padding:18px 20px;margin-bottom:26px;">
                  <div style="font-size:11px;font-weight:700;color:#F4A725;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">
                    Your Registration Summary
                  </div>
                  <table role="presentation" width="100%" style="font-size:13.5px;line-height:1.6;color:#182D5A;">
                    <tr>
                      <td style="width:36%;color:#6B768E;padding:3px 0;">Name:</td>
                      <td style="font-weight:600;padding:3px 0;">${fullName}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B768E;padding:3px 0;">Email:</td>
                      <td style="font-weight:600;padding:3px 0;">${email}</td>
                    </tr>
                    <tr>
                      <td style="color:#6B768E;padding:3px 0;">Career Stage:</td>
                      <td style="font-weight:600;padding:3px 0;">${careerStage}</td>
                    </tr>
                    ${researchField ? `<tr><td style="color:#6B768E;padding:3px 0;">Field:</td><td style="font-weight:600;padding:3px 0;">${researchField}</td></tr>` : ""}
                    ${institution ? `<tr><td style="color:#6B768E;padding:3px 0;">Institution:</td><td style="font-weight:600;padding:3px 0;">${institution}</td></tr>` : ""}
                    <tr>
                      <td style="color:#6B768E;padding:3px 0;">Country:</td>
                      <td style="font-weight:600;padding:3px 0;">${country || "—"}</td>
                    </tr>
                    ${city ? `<tr><td style="color:#6B768E;padding:3px 0;">City / Metro:</td><td style="font-weight:600;padding:3px 0;">${city}</td></tr>` : ""}
                    ${feedback ? `<tr><td style="color:#6B768E;vertical-align:top;padding:3px 0;">Your Feedback:</td><td style="font-weight:500;font-style:italic;color:#182D5A;padding:3px 0;">“${feedback}”</td></tr>` : ""}
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
                      <strong style="color:#182D5A;font-size:14px;">Peer Matching Up-line:</strong>
                      <span style="color:#4B5468;font-size:13.5px;line-height:1.5;display:block;margin-top:2px;">
                        Talk to postdocs who have already made your exact transition by research discipline and stage — not generic institutional advice.
                      </span>
                    </div>
                  </div>

                  <div style="margin-bottom:14px;display:flex;align-items:flex-start;">
                    <div style="font-size:16px;color:#F4A725;margin-right:10px;line-height:1.2;">✦</div>
                    <div>
                      <strong style="color:#182D5A;font-size:14px;">eyewee™ AI Guidance:</strong>
                      <span style="color:#4B5468;font-size:13.5px;line-height:1.5;display:block;margin-top:2px;">
                        Your intelligent companion for answers, stage-by-stage due dates, and career roadmaps in plain language.
                      </span>
                    </div>
                  </div>

                  <div style="margin-bottom:14px;display:flex;align-items:flex-start;">
                    <div style="font-size:16px;color:#F4A725;margin-right:10px;line-height:1.2;">✦</div>
                    <div>
                      <strong style="color:#182D5A;font-size:14px;">Privacy by Default:</strong>
                      <span style="color:#4B5468;font-size:13.5px;line-height:1.5;display:block;margin-top:2px;">
                        Safe, lab-independent conversations. Discuss what you can&apos;t ask in your current group with full intellectual property protection.
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Rollout Notice -->
                <div style="background-color:#FFF8EC;border-left:4px solid #F4A725;border-radius:4px;padding:14px 16px;margin-bottom:28px;">
                  <p style="margin:0;font-size:13.5px;line-height:1.6;color:#855507;">
                    <strong>Next steps:</strong> We&apos;re opening Doc2Postdoc metro by metro, starting with Chicago and St. Louis. When your field and region open, you&apos;ll receive your invite link directly at this email address.
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
                  Questions or need support? Reply directly to this email or reach us at <a href="mailto:hello@doc2postdoc.com" style="color:#182D5A;font-weight:600;text-decoration:none;">hello@doc2postdoc.com</a>.
                </p>
                <p style="margin:0;font-size:11px;color:#94A0B8;">
                  © 2026 Doc2Postdoc℠ · Powered by i4iSciences™ ·
                  <a href="${SITE_URL}/privacy" style="color:#94A0B8;text-decoration:underline;">Privacy Policy</a> ·
                  <a href="${SITE_URL}/terms" style="color:#94A0B8;text-decoration:underline;">Terms of Service</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
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
}: WelcomeEmailParams & { source?: string }) {
  const subject = `[Waitlist Submission] ${fullName} (${country ? `${country} · ` : ""}${careerStage}) - hello@doc2postdoc.com`;

  const text = `New waitlist submission received:

Name: ${fullName}
Email: ${email}
Career stage: ${careerStage}
Research field: ${researchField || "Not specified"}
Institution: ${institution || "Not specified"}
Country: ${country || "Not specified"}
City: ${city || "Not specified"}
Feedback / Thoughts: ${feedback || "None provided"}
Source: ${source || "Doc2Postdoc Waitlist"}
Time: ${new Date().toISOString()}`;

  const html = `<!DOCTYPE html>
<html>
  <body style="font-family:Arial,sans-serif;color:#182D5A;padding:20px;background:#F5F3EE;">
    <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border-radius:8px;padding:26px;border:1px solid #E2E6F0;box-shadow:0 4px 16px rgba(24,45,90,0.06);">
      <h2 style="color:#182D5A;margin-top:0;border-bottom:2px solid #F4A725;padding-bottom:12px;font-size:18px;">
        New Doc2Postdoc Waitlist Submission
      </h2>
      <table style="width:100%;font-size:14px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="color:#6B768E;width:140px;padding:7px 0;"><strong>Full Name:</strong></td><td style="padding:7px 0;font-weight:600;">${fullName}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Email:</strong></td><td style="padding:7px 0;"><a href="mailto:${email}" style="color:#182D5A;font-weight:600;">${email}</a></td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Career Stage:</strong></td><td style="padding:7px 0;">${careerStage}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Research Field:</strong></td><td style="padding:7px 0;">${researchField || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Institution:</strong></td><td style="padding:7px 0;">${institution || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Country:</strong></td><td style="padding:7px 0;font-weight:600;">${country || "—"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>City / Metro:</strong></td><td style="padding:7px 0;">${city || "—"}</td></tr>
        <tr>
          <td style="color:#6B768E;vertical-align:top;padding:8px 0;"><strong>Feedback / Thoughts:</strong></td>
          <td style="padding:8px 0;">
            ${
              feedback
                ? `<div style="background:#F7F8FB;border-left:3px solid #F4A725;padding:10px 14px;border-radius:4px;color:#182D5A;white-space:pre-wrap;font-style:italic;">${feedback}</div>`
                : `<span style="color:#8A93A6;">None provided</span>`
            }
          </td>
        </tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Source:</strong></td><td style="padding:7px 0;">${source || "Doc2Postdoc"}</td></tr>
        <tr><td style="color:#6B768E;padding:7px 0;"><strong>Timestamp:</strong></td><td style="padding:7px 0;">${new Date().toLocaleString()}</td></tr>
      </table>
    </div>
  </body>
</html>`;

  return { subject, html, text };
}
