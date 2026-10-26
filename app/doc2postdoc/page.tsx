import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Doc2Postdoc — Early Access",
  description: "Talk to someone who has already made your move. Doc2Postdoc connects PhD researchers with postdocs who have already made the move.",
};

const whyItWorks = [
  {
    title: "Advisors rarely know what the jump feels like",
    body: "Career offices and advisors give generic advice. They haven't necessarily made your exact transition, in your exact field.",
  },
  {
    title: "Generic career advice fits no one specifically",
    body: "A postdoc in HBV virology and a postdoc in theoretical physics are not navigating the same job market, visa process, or lab dynamics.",
  },
];

export default function Doc2PostdocPage() {
  return (
    <main className="teaser-site">
      <SiteNav active="doc2postdoc" />

      {/* Hero */}
      <section className="teaser-hero">
        <p className="teaser-label" style={{ textAlign: "center" }}>
          Doc2Postdoc
        </p>
        <h1>Talk to someone who has already made your move.</h1>
        <p className="teaser-hero-lead">
          Doc2Postdoc connects PhD researchers with postdocs who have already made the move.
        </p>
        <div className="teaser-hero-ctas">
          <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
            Join waitlist <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* The problem it solves - 2 cards */}
      <section className="teaser-section" aria-label="The problem Doc2Postdoc solves">
        <div className="teaser-section-inner">
          <p className="teaser-label">The problem it solves</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)", letterSpacing: "-.03em", lineHeight: 1.2, maxWidth: "720px" }}>
            Nobody around you has done this exact thing before. Someone, somewhere, has.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "36px" }}>
            {whyItWorks.map((item) => (
              <div className="teaser-step" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="teaser-section" aria-label="What you get">
        <div className="teaser-section-inner">
          <p className="teaser-label">What you get</p>
          <h2 style={{ margin: "0 0 24px", color: "var(--navy)", fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)", letterSpacing: "-.03em", lineHeight: 1.2, maxWidth: "760px" }}>
            What you get
          </h2>
          <ul className="teaser-checklist" style={{ maxWidth: "680px" }}>
            <li>
              <Check size={18} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px" }} />
              <span><strong>A relevant match:</strong> someone who has made a move like yours.</span>
            </li>
            <li>
              <Check size={18} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px" }} />
              <span><strong>A real conversation</strong> about what you can&apos;t ask at your own lab.</span>
            </li>
            <li>
              <Check size={18} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px" }} />
              <span><strong>Help when it matters.</strong></span>
            </li>
            <li>
              <Check size={18} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px" }} />
              <span><strong>Privacy by default.</strong></span>
            </li>
          </ul>
        </div>
      </section>

      {/* Confidentiality & IP */}
      <section className="teaser-section" style={{ background: "#fff" }} aria-label="Confidentiality & IP">
        <div className="teaser-section-inner teaser-section-narrow">
          <article className="teaser-card" style={{ maxWidth: "640px", margin: "0 auto" }}>
            <p className="teaser-card-kicker">Confidentiality &amp; IP</p>
            <h3 style={{ color: "var(--navy)" }}>Your work stays yours.</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Your conversations are private by default. Sharing an idea or a draft does not transfer ownership.
            </p>
          </article>
        </div>
      </section>

      {/* What Doc2Postdoc does for you - Ring the Bell */}
      <section className="teaser-section" aria-label="Doc2Postdoc features">
        <div className="teaser-section-inner teaser-section-narrow">
          <p className="teaser-label">What Doc2Postdoc does for you</p>
          <article className="teaser-card teaser-card-dark" style={{ background: "#182D5A", color: "#ffffff", padding: "34px 30px", borderRadius: "14px", border: "1px solid #182D5A" }}>
            <p className="teaser-card-kicker" style={{ color: "#F4A725", opacity: 1, fontWeight: 700 }}>Ring the Bell</p>
            <h3 style={{ color: "#ffffff", fontSize: "1.45rem", margin: "0 0 12px" }}>Your circle, reachable in one ring.</h3>
            <p style={{ color: "#ffffff", fontSize: "15px", lineHeight: 1.65, margin: 0, opacity: 0.95 }}>
              Need help fast? eyewee reaches out to people you already trust.
            </p>
          </article>
          <p style={{ marginTop: "24px", color: "var(--muted)", fontStyle: "italic", fontSize: "14px", textAlign: "center" }}>
            More ways to help each other are coming.
          </p>
        </div>
      </section>

      {/* Helping others is part of the journey */}
      <section className="teaser-section" style={{ background: "#fff" }} aria-label="Helping others is part of the journey">
        <div className="teaser-section-inner teaser-section-narrow" style={{ textAlign: "center" }}>
          <p className="teaser-label teaser-eyebrow-center">It&apos;s not one-way</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-.03em", lineHeight: 1.25 }}>
            Helping others is part of the journey.
          </h2>
          <p style={{ maxWidth: "56ch", margin: "16px auto 0", color: "var(--muted)", fontFamily: "Arial, sans-serif", fontSize: "15.5px", lineHeight: 1.7 }}>
            Postdocs who mentor help the next generation of researchers.
          </p>
        </div>
      </section>

      {/* Get started */}
      <section className="teaser-band">
        <p className="teaser-label" style={{ color: "var(--gold)" }}>
          Get started
        </p>
        <h2>Be matched when your field opens.</h2>
        <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
          Join waitlist <ArrowRight size={17} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
