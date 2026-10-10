import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteNav({ active }: { active?: "home" | "doc2postdoc" | "eyewee" }) {
  return (
    <header className="teaser-nav">
      <Link className="teaser-brand" href="/" aria-label="Home">
        <Image src="/doc2postdoc.png" alt="Doc2Postdoc" width={280} height={140} priority />
      </Link>

      <nav className="teaser-nav-links teaser-nav-links-desktop" aria-label="Main navigation">
        <Link className="teaser-nav-link" href="/doc2postdoc" aria-current={active === "doc2postdoc" ? "page" : undefined}>
          Doc2Postdoc
        </Link>
        <Link className="teaser-nav-link" href="/#eyewee" aria-current={active === "eyewee" ? "page" : undefined}>
          eyewee
        </Link>
        <span className="teaser-pill">Early access</span>
        <Link className="teaser-waitlist-btn teaser-blink" href="/waitlist">
          Join waitlist <ArrowRight size={15} />
        </Link>
      </nav>

      <div className="teaser-mobile-nav">
        <Link className="teaser-nav-link" href="/doc2postdoc">
          Doc2Postdoc
        </Link>
        <Link className="teaser-nav-link" href="/#eyewee">
          eyewee
        </Link>
        <Link className="teaser-waitlist-btn teaser-blink" href="/waitlist" aria-label="Join the waitlist">
          <ArrowRight size={16} />
        </Link>
      </div>
    </header>
  );
}
