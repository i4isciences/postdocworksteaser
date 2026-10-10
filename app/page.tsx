import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { EyeweeSection } from "@/components/eyewee/EyeweeSection";

export const metadata: Metadata = {
  title: "eyewee & Doc2Postdoc — Early Access",
  description:
    "eyewee is an AI-guided companion built for postdoctoral researchers, and Doc2Postdoc connects you with peers who've already taken the next step. Join the early-access waitlist.",
};

export default function Home() {
  return (
    <main className="teaser-site" id="top">
      <SiteNav active="home" />

      <section className="teaser-hero">
        <span className="teaser-pill">Early access</span>
        <h1>An AI-guided platform helping postdoctoral researchers find real career paths.</h1>
        <p className="teaser-hero-lead">
          Every postdoc is paired with{" "}
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
            What is eyewee?
          </a>
        </div>
      </section>

      <EyeweeSection />

      <SiteFooter />
    </main>
  );
}
