import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Doc2Postdoc — PostdocWorks",
  description: "Where the Next Step Has Already Been Taken. Doc2Postdoc pairs every PhD facing the postdoc transition with peers and postdocs who've already made the same move.",
};

const matchInputs = [
  { num: "01", title: "Research area & specialty", body: "Field and subfield overlap, not just “academia in general.” You're matched to someone who has actually worked in your corner of the discipline." },
  { num: "02", title: "Career stage", body: "Matched to someone at a relevant point in their own trajectory — recently made the exact jump you're facing, not decades removed from it." },
  { num: "03", title: "Institution & geography", body: "Shared context — institution type, country, metro area — weighted into the match, but never required if the field and stage fit is strong." },
];

const whyItWorks = [
  { title: "Advisors rarely know what the jump feels like", body: "Career offices and advisors give generic advice. They haven't necessarily made your exact transition, in your exact field." },
  { title: "Generic career advice fits no one specifically", body: "A postdoc in HBV virology and a postdoc in theoretical physics are not navigating the same job market, visa process, or lab dynamics." },
  { title: "It's hard to know whose credentials are real", body: "Online “mentors” are easy to claim and hard to verify. Doc2Postdoc starts from a credibility layer, not a self-written bio." },
];

export default function Doc2PostdocPage() {
  return (
    <main className="teaser-site">
      <SiteNav active="doc2postdoc" />

      <section className="teaser-hero">
        <p className="teaser-label" style={{ textAlign: "center" }}>
          Doc2Postdoc
        </p>
        <h1>Where the next step has already been taken.</h1>
        <p className="teaser-hero-lead">
          Doc2Postdoc pairs every PhD facing the postdoc transition with peers and postdocs who&apos;ve already made the exact same move &mdash; by field,
          career stage, and institution type. Not generic career advice: a guide who has walked the same path.
        </p>
        <div className="teaser-hero-ctas">
          <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
            Join waitlist <ArrowRight size={16} />
          </Link>
          <a className="teaser-btn teaser-btn-outline" href="#how-it-works">
            See how it works
          </a>
        </div>
      </section>

      <section className="teaser-section" aria-label="The problem Doc2Postdoc solves">
        <div className="teaser-section-inner">
          <p className="teaser-label">The problem it solves</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)", letterSpacing: "-.03em", lineHeight: 1.2, maxWidth: "720px" }}>
            Nobody around you has done this exact thing before. Someone, somewhere, has.
          </h2>
          <div className="teaser-steps">
            {whyItWorks.map((item) => (
              <div className="teaser-step" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="teaser-section" id="how-it-works" aria-label="How matching works">
        <div className="teaser-section-inner">
          <p className="teaser-label">How matching works</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)", letterSpacing: "-.03em", lineHeight: 1.2, maxWidth: "760px" }}>
            Three inputs between &quot;I don&apos;t know anyone who&apos;s done this&quot; and a direct conversation with someone who has.
          </h2>
          <div className="teaser-steps">
            {matchInputs.map((step) => (
              <div className="teaser-step" key={step.num}>
                <p className="teaser-step-num">{step.num}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="teaser-section" style={{ background: "#fff" }} aria-label="Built on real credibility">
        <div className="teaser-section-inner">
          <div className="teaser-grid-2">
            <article className="teaser-card">
              <p className="teaser-card-kicker">Built on real credibility</p>
              <h3 style={{ color: "var(--navy)" }}>Not a self-written bio.</h3>
              <p style={{ color: "var(--muted)" }}>
                Every postdoc mentor has a Research Credibility Profile built from their actual academic record &mdash; publications and endorsements
                &mdash; not self-reported claims. It&apos;s the same trust layer as the rest of PostdocWorks, not a parallel one, so a verified mentor
                means the same thing everywhere on the platform.
              </p>
            </article>
            <article className="teaser-card">
              <p className="teaser-card-kicker">Confidentiality &amp; IP</p>
              <h3 style={{ color: "var(--navy)" }}>Your work stays yours.</h3>
              <p style={{ color: "var(--muted)" }}>
                Matched-pair conversations are private by default. Sharing a draft or an idea with a match doesn&apos;t transfer ownership of it &mdash;
                the original author keeps their intellectual property, full stop.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="teaser-section" aria-label="Doc2Postdoc features">
        <div className="teaser-section-inner">
          <p className="teaser-label">What Doc2Postdoc does for you</p>
          <div className="teaser-grid-2">
            <article className="teaser-card teaser-card-dark">
              <p className="teaser-card-kicker">Ring the Bell</p>
              <h3>Your circle, reachable in one ring.</h3>
              <p>
                Ring the Bell reaches the people who already said yes to helping you first &mdash; your accepted connections, all at once, with a
                two-hour window. Only if nobody answers does it widen further. You&apos;re never routed to an anonymous stranger first.
              </p>
            </article>
            <article className="teaser-card teaser-card-dark">
              <p className="teaser-card-kicker">Travel Companion</p>
              <h3>Someone at the gate, even when you can&apos;t be.</h3>
              <p>
                When family is flying in and a deadline won&apos;t let you leave the lab, Travel Companion matches you with someone else already headed
                to the same airport &mdash; the same safety layer as every other Doc2Postdoc connection, and a badge for both of you once the trip is
                done.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="teaser-section" style={{ background: "#fff" }} aria-label="It's not one-way">
        <div className="teaser-section-inner teaser-section-narrow" style={{ textAlign: "center" }}>
          <p className="teaser-label teaser-eyebrow-center">It&apos;s not one-way</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-.03em", lineHeight: 1.25 }}>
            Mentoring builds the mentor&apos;s own standing.
          </h2>
          <p style={{ maxWidth: "56ch", margin: "18px auto 0", color: "var(--muted)", fontFamily: "Arial, sans-serif", fontSize: "15.5px", lineHeight: 1.7 }}>
            Guidance a postdoc gives is visible, tracked recognition on the platform &mdash; feeding into the same signal that drives career-advancement
            standing. Not a quiet favor done off the books; a credited part of a postdoc&apos;s own record.
          </p>
        </div>
      </section>

      <section className="teaser-band">
        <p className="teaser-label" style={{ color: "var(--gold)" }}>
          Get started
        </p>
        <h2>Be matched the moment your field opens.</h2>
        <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
          Join waitlist <ArrowRight size={17} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
