import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteNav({ active }: { active?: "home" | "doc2postdoc" | "eyewee" }) {
  return (
    <header className="teaser-nav">
      <Link className="teaser-brand" href="/" aria-label="Home" style={{ textDecoration: "none" }}>
        <Image
          src="/doc2postdoc.png"
          alt="Doc2Postdoc"
          width={72}
          height={60}
          priority
          style={{ height: "54px", width: "auto", flexShrink: 0 }}
        />
        <div className="teaser-brand-text">
          <div className="teaser-brand-name">
            Doc<span className="teaser-brand-num">2</span>Postdoc<sup className="teaser-brand-sm">SM</sup>
          </div>
          <div className="teaser-brand-motto">
            Where the next step has already been taken
          </div>
        </div>
      </Link>

      <nav className="teaser-nav-links teaser-nav-links-desktop" aria-label="Main navigation">
        <Link
          className="teaser-nav-link"
          href="/doc2postdoc"
          aria-current={active === "doc2postdoc" ? "page" : undefined}
        >
          Doc2Postdoc
        </Link>
        <a className="teaser-nav-link" href="/#svc">
          Services
        </a>
        <a className="teaser-nav-link" href="/#eyewee">
          eyewee
        </a>
        <span className="teaser-pill">Early access</span>
        <a className="teaser-waitlist-btn teaser-blink" href="#waitlist">
          Join waitlist <ArrowRight size={15} />
        </a>
      </nav>

      <div className="teaser-mobile-nav">
        <Link className="teaser-nav-link" href="/doc2postdoc">
          Doc2Postdoc
        </Link>
        <a className="teaser-nav-link" href="/#svc">
          Services
        </a>
        <a className="teaser-waitlist-btn teaser-blink" href="#waitlist" aria-label="Join the waitlist">
          <ArrowRight size={16} />
        </a>
      </div>
    </header>
  );
}
