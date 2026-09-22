import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookCheck, Check, Compass, Languages, ShieldQuestion, UserCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "PostdocWorks — Early Access",
  description:
    "PostdocWorks is an AI-guided platform built for postdoctoral researchers — real career paths, verifiable trust signals, and a community of peers who've already taken the next step. Join the early-access waitlist.",
};

const challenges = [
  {
    icon: Compass,
    title: "What's next isn't clear",
    body: "After years of deep, specialized research, there's rarely an obvious roadmap for what comes after — academia, industry, or something else entirely.",
  },
  {
    icon: Languages,
    title: "Skills don't “translate” on paper",
    body: "Years of research experience can look invisible to employers who don't speak “academic.”",
  },
  {
    icon: ShieldQuestion,
    title: "Hard to know who to trust",
    body: "Job boards and cold outreach make it hard to find real, verified opportunities — or to be found by them.",
  },
];

const pillars = [
  "Built for postdocs, by people who understand academia",
  "Combines real AI guidance with human trust signals",
  "One platform: career guidance, verification, and peer connection",
];

const badges = [
  {
    icon: BookCheck,
    title: "Publication-Verified",
    tag: "Auto-populated, not self-reported",
    body: "Automatically confirmed against real, checkable publications — no manual claims needed.",
  },
  {
    icon: UserCheck,
    title: "PI-Endorsed",
    tag: "Your PI has your back",
    body: "A genuine endorsement from the postdoc's own research supervisor — a real person vouching for them.",
  },
  {
    icon: Activity,
    title: "Platform-Proven",
    tag: "Real activity, not a one-time signup",
    body: "Shows sustained, genuine engagement with the community — not just a one-time signup.",
  },
];

export default function Home() {
  return (
    <main className="teaser-site">
      <SiteNav active="home" />

      <section className="teaser-hero">
        <span className="teaser-pill">Early access</span>
        <h1>An AI-guided platform helping postdoctoral researchers find real career paths.</h1>
        <p className="teaser-hero-lead">
          PostdocWorks pairs every postdoc with{" "}
          <Link href="/eyewee" style={{ color: "var(--navy)", textDecoration: "underline" }}>
            eyewee
          </Link>
          , your built-in AI companion — so research, grants, and the next career move get simpler, not just busier.
        </p>
        <div className="teaser-hero-ctas">
          <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
            Join waitlist <ArrowRight size={16} />
          </Link>
          <a className="teaser-btn teaser-btn-outline" href="#what-is-postdocworks">
            What is PostdocWorks?
          </a>
        </div>
      </section>

      <section className="teaser-section" style={{ background: "#fff" }} aria-label="What postdocs are carrying">
        <div className="teaser-section-inner teaser-section-narrow" style={{ textAlign: "center" }}>
          <p className="teaser-label teaser-eyebrow-center">What postdocs carry</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)", letterSpacing: "-.03em", lineHeight: 1.2 }}>
            Family. Funding. A new country. Twenty things at once.
          </h2>
          <p style={{ maxWidth: "56ch", margin: "18px auto 0", color: "var(--muted)", fontFamily: "Arial, sans-serif", fontSize: "15.5px", lineHeight: 1.7 }}>
            Postdocs and PhD students carry research, grants, visas, relocation, and family pressure at the same time. PostdocWorks helps carry it — so
            the next step doesn&apos;t have to wait.
          </p>
        </div>
      </section>

      <section className="teaser-section" aria-label="The reality for postdocs">
        <div className="teaser-section-inner">
          <p className="teaser-label">The reality</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", letterSpacing: "-.03em", lineHeight: 1.15, maxWidth: "760px" }}>
            Finishing a PhD is just the beginning.
          </h2>

          <dl className="teaser-definition">
            <div>
              <dt>Postdoc</dt>
              <dd>
                A researcher who has finished their PhD and is doing further specialized research — often the training ground before a permanent job in
                academia or industry.
              </dd>
            </div>
          </dl>

          <div className="teaser-steps">
            {challenges.map((item) => {
              const Icon = item.icon;
              return (
                <div className="teaser-step" key={item.title}>
                  <div className="teaser-step-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="teaser-section" id="what-is-postdocworks" style={{ background: "#fff" }} aria-label="What is PostdocWorks">
        <div className="teaser-section-inner">
          <p className="teaser-label">i4iSciences &middot; PostdocWorks</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", letterSpacing: "-.03em", lineHeight: 1.15, maxWidth: "760px" }}>
            What Is PostdocWorks?
          </h2>
          <p style={{ maxWidth: "62ch", margin: "20px 0 0", color: "var(--muted)", fontFamily: "Arial, sans-serif", fontSize: "16px", lineHeight: 1.7 }}>
            PostdocWorks is an AI-guided platform built specifically for postdoctoral researchers — connecting them with real career paths, verifiable
            trust signals, and a community of peers who&apos;ve already taken the next step.
          </p>

          <ul className="teaser-checklist">
            {pillars.map((item) => (
              <li key={item}>
                <Check size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="teaser-callout">
            <div>
              <strong>Guiding the next step</strong>
              <span>Career guidance + verification + peer community, in one place.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="teaser-section" aria-label="Building trust you can verify">
        <div className="teaser-section-inner">
          <p className="teaser-label">Verification</p>
          <h2 style={{ margin: 0, color: "var(--navy)", fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", letterSpacing: "-.03em", lineHeight: 1.15, maxWidth: "760px" }}>
            Building Trust You Can Verify
          </h2>
          <p style={{ maxWidth: "62ch", margin: "20px 0 0", color: "var(--muted)", fontFamily: "Arial, sans-serif", fontSize: "16px", lineHeight: 1.7 }}>
            Three badges show real, verified credibility — not just claims.
          </p>

          <div className="teaser-badges">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <article className="teaser-badge" key={badge.title}>
                  <div className="teaser-badge-icon">
                    <Icon size={24} />
                  </div>
                  <h3>{badge.title}</h3>
                  <p className="teaser-badge-tag">{badge.tag}</p>
                  <p>{badge.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="teaser-band">
        <p className="teaser-label" style={{ color: "var(--gold)" }}>
          The first step is yours
        </p>
        <h2>Be first in your field — join the waitlist.</h2>
        <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
          Join waitlist <ArrowRight size={17} />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
