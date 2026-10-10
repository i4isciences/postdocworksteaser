type WelcomeEmailParams = {
  fullName: string;
  careerStage: string;
  researchField: string;
};

const SITE_URL = "https://postdocworks.io";

export function buildWelcomeEmail({ fullName, careerStage, researchField }: WelcomeEmailParams) {
  const firstName = fullName.split(" ")[0] || fullName;
  const fieldLine = researchField ? ` in ${researchField}` : "";

  const subject = "You're on the eyewee & Doc2Postdoc waitlist";

  const text = `Hi ${firstName},

Thanks for joining the eyewee & Doc2Postdoc early-access waitlist as a ${careerStage.toLowerCase()}${fieldLine}.

You're confirmed on the list. We'll email you as soon as eyewee, your built-in AI companion, and Doc2Postdoc open up in your field and metro -- one email, when it's your turn, no spam in the meantime.

In the meantime, feel free to explore what we're building at ${SITE_URL}.

Thanks for your patience and interest,
The eyewee & Doc2Postdoc Team`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f5f3ee;font-family:Georgia,'Times New Roman',serif;color:#17233f;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ee;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid #d9dfe8;">
            <tr>
              <td style="padding:28px 36px;border-bottom:3px solid #f4ae27;">
                <span style="font-family:Arial,sans-serif;font-size:20px;font-weight:800;color:#162b59;letter-spacing:-.02em;">eyewee &amp; Doc2Postdoc</span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px;">
                <p style="font-family:Arial,sans-serif;font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#a36d0b;margin:0 0 18px;">You're on the list</p>
                <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;color:#162b59;">Hi ${firstName}, welcome to early access.</h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#17233f;">
                  Thanks for signing up as a <strong>${careerStage.toLowerCase()}</strong>${fieldLine}. You're confirmed on the eyewee &amp; Doc2Postdoc early-access waitlist.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#17233f;">
                  We'll email you the moment <strong>eyewee</strong>, your built-in AI companion, and <strong>Doc2Postdoc</strong> open up in your field and metro. No spam -- just one email, when it's your turn.
                </p>
                <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#17233f;">
                  In the meantime, feel free to explore what we're building.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#f4ae27;">
                      <a href="${SITE_URL}" style="display:inline-block;padding:13px 24px;font-family:Arial,sans-serif;font-size:13px;font-weight:800;color:#162b59;text-decoration:none;">Visit the site</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;border-top:1px solid #e4e6ea;">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#697286;">
                  Thanks for your patience and interest,<br />The eyewee &amp; Doc2Postdoc Team
                </p>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:18px 0 0;font-family:Arial,sans-serif;font-size:11px;line-height:1.6;color:#a3a9b7;">
            You're receiving this because you joined the eyewee &amp; Doc2Postdoc waitlist. Read our
            <a href="${SITE_URL}/privacy" style="color:#a3a9b7;">Privacy Policy</a> and
            <a href="${SITE_URL}/terms" style="color:#a3a9b7;">Terms of Service</a>.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
