import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service — eyewee & Doc2Postdoc",
  description: "The terms governing use of Doc2Postdoc and eyewee.",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Who this covers",
    body: [
      "These Terms of Service (“Terms”) govern your use of Doc2Postdoc and eyewee (together, “the Services”), operated by I4I Sciences LLC dba i4iSciences (“i4iSciences,” “we,” “us”). By joining the waitlist, creating an account, or otherwise using the Services, you agree to these Terms. If you don’t agree, please don’t use the Services.",
    ],
  },
  {
    heading: "2. Early access",
    body: [
      "Features described on this website are not yet generally available. Joining the waitlist reserves your place; it does not guarantee a launch date, a feature set, or that your field or metro area will open first.",
    ],
  },
  {
    heading: "3. Eligibility and your account",
    body: [
      "You must be at least 18 years old to use the Services. When registration opens, one account covers Doc2Postdoc and eyewee — you don’t sign up for each separately. You’re responsible for the accuracy of the information you give us (including on the waitlist form) and for keeping your account credentials secure once accounts exist.",
    ],
  },
  {
    heading: "4. Acceptable use",
    body: [
      "You agree not to misrepresent your identity, credentials, or affiliation when submitting information to us; use the Services to harass, defraud, or endanger another person; attempt to access accounts, data, or systems that aren’t yours; scrape, resell, or redistribute data from the Services without our written permission; or use the Services in a way that violates applicable law.",
    ],
  },
  {
    heading: "5. Verification and matching",
    body: [
      "We may offer ways to confirm information members share. Any confirmation reflects only what we could check at that time and is not a guarantee of a person's qualifications, character, or fitness. We do not vet every member's conduct, and you are responsible for your own judgment in any connection made through the Services.",
    ],
  },
  {
    heading: "6. eyewee",
    body: [
      "eyewee is an AI-assisted feature. It can make mistakes, and its responses are not a substitute for professional medical, legal, immigration, tax, or financial advice, and are not equipped to handle a mental health crisis or emergency. If you are in crisis or an emergency, call 911 or your local emergency number, or call or text 988 (US), 9-8-8 (Canada) or Tele-MANAS 14416 (India).",
    ],
  },
  {
    heading: "7. Intellectual property",
    body: [
      "The Services, including their design, software, and the Doc2Postdoc and eyewee names and marks, are owned by i4iSciences or its licensors. We don’t claim ownership of the content you submit (your profile, credentials, messages), but by submitting it you give us a license to use it to operate and improve the Services.",
    ],
  },
  {
    heading: "8. Termination",
    body: [
      "You may stop using the Services, or ask us to delete your waitlist entry or account, at any time by emailing hello@doc2postdoc.com. We may suspend or terminate access for conduct that violates these Terms or puts other members at risk.",
    ],
  },
  {
    heading: "9. Disclaimer, limitation of liability, and governing law",
    body: [
      "The Services are provided “as is” and “as available,” without warranties of any kind, express or implied, during this early-access period and beyond. To the fullest extent permitted by law, i4iSciences will not be liable for indirect, incidental, or consequential damages arising from your use of the Services.",
      "Governing law. These Terms are governed by the laws of [state], and disputes go to the courts in [county, state].",
      "Our total liability is limited to [amount].",
    ],
  },
  {
    heading: "10. Changes to these Terms",
    body: [
      "We may update these Terms as the Services move out of early access. We’ll update the date at the top of this page when we do, and for material changes, we’ll email registered members and waitlist members in advance where practical.",
    ],
  },
  {
    heading: "11. Contact",
    body: ["Questions about these Terms: hello@doc2postdoc.com"],
  },
];

export default function TermsPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <div className="teaser-legal-body">
        <h1>Terms of Service</h1>
        <p className="teaser-legal-updated">Last updated October 12, 2026</p>
        {sections.map((section) => (
          <section className="teaser-legal-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <SiteFooter />
    </main>
  );
}
