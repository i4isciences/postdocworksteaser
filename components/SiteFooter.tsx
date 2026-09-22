import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="teaser-footer">
      <Link className="teaser-footer-brand" href="/" aria-label="PostdocWorks home">
        <Image src="/postdocworks.svg" alt="PostdocWorks logo" width={180} height={120} />
        <span className="teaser-brand-copy">
          <small>You say it — eyewee carries it, guides it, and cracks the toughest problems</small>
        </span>
      </Link>
      <span className="teaser-footer-powered">Powered by i4iSciences&trade;</span>
      <nav className="teaser-footer-legal" aria-label="Legal">
        <Link href="/terms">Terms of Service</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </nav>
      <a className="teaser-footer-contact" href="mailto:hello@postdocworks.io">
        hello@postdocworks.io
      </a>
    </footer>
  );
}
