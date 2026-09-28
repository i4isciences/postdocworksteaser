import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { EyeweeSection } from "@/components/eyewee/EyeweeSection";

export const metadata: Metadata = {
  title: "PostdocWorks — Early Access",
  description:
    "PostdocWorks is an AI-guided platform built for postdoctoral researchers — real career paths, verifiable trust signals, and a community of peers who've already taken the next step. Join the early-access waitlist.",
};

export default function Home() {
  return (
    <main className="teaser-site" id="top">
      <SiteNav active="home" />

      <section className="teaser-hero">
        <span className="teaser-pill">Early access</span>
        <h1>An AI-guided platform helping postdoctoral researchers find real career paths.</h1>
        <p className="teaser-hero-lead">
          PostdocWorks pairs every postdoc with{" "}
          <a href="#eyewee" style={{ color: "var(--navy)", textDecoration: "underline" }}>
            eyewee
          </a>
          , your built-in AI companion — so research, grants, and the next career move get simpler, not just busier.
        </p>
        <div className="teaser-hero-ctas">
          <Link className="teaser-btn teaser-btn-gold teaser-blink" href="/waitlist">
            Join waitlist <ArrowRight size={16} />
          </Link>
          <a className="teaser-btn teaser-btn-outline" href="#eyewee">
            What is PostdocWorks?
          </a>
        </div>
      </section>

      <EyeweeSection />

      <SiteFooter />
    </main>
  );
}
