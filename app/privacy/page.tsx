import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — PostdocWorks",
  description: "What PostdocWorks, Doc2Postdoc, and eyewee collect, and how it's used.",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. What we collect",
    body: [
      "Right now, during early access, the only data we collect is what you give us on the waitlist form: your full name and email address; career stage (postdoc, PhD student, medical resident/fellow, faculty/PI, or other); research field, institution, and city/metro area, if you choose to share them; and the timestamp you gave consent.",
      "Once accounts, eyewee conversations, and Doc2Postdoc matching are live, this policy will be updated to cover that additional data before those features go live.",
    ],
  },
  {
    heading: "2. How we use it",
    body: [
      "To email you when eyewee and Doc2Postdoc open in your field and metro, and about other product updates you’d reasonably expect from joining an early-access list; to understand demand by field, career stage, and location, so we open metros and fields in a sensible order; and to operate, secure, and improve the Services.",
      "We don’t sell your data, and we don’t use it for third-party advertising.",
    ],
  },
  {
    heading: "3. Who we share it with",
    body: [
      "We share data with service providers who help us run the Services under contract — currently, our database and hosting infrastructure (Supabase) and our deployment platform. We don’t share your information with other members, employers, or anyone else without your separate consent, except as required by law.",
    ],
  },
  {
    heading: "4. How long we keep it",
    body: [
      "Waitlist data is kept until you ask us to delete it, or until a reasonable period after early access ends and you haven’t converted to a full account. You can ask for deletion at any time.",
    ],
  },
  {
    heading: "5. Your rights",
    body: ["You can ask us to access, correct, or delete the information we hold about you at any time by emailing hello@postdocworks.io."],
  },
  {
    heading: "6. Cookies and tracking",
    body: [
      "This site does not currently set marketing or analytics cookies. If that changes as the product grows, we’ll update this section to describe exactly what’s used and how to opt out.",
    ],
  },
  {
    heading: "7. Children's privacy",
    body: ["The Services are intended for postdocs, PhD students, residents/fellows, and faculty — not for children. We do not knowingly collect data from anyone under 18."],
  },
  {
    heading: "8. Changes to this policy",
    body: [
      "We’ll update the date at the top of this page whenever this policy changes, and for material changes we’ll notify waitlist and registered members by email in advance where practical.",
    ],
  },
  {
    heading: "9. Contact",
    body: ["Questions about this policy, or a request about your data: hello@postdocworks.io"],
  },
];

export default function PrivacyPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <div className="teaser-legal-body">
        <h1>Privacy Policy</h1>
        <p className="teaser-legal-updated">Last updated September 21, 2026</p>
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
