import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="teaser-footer">
      <Link className="teaser-footer-brand" href="/" aria-label="Home">
        <Image src="/doc2postdoc.png" alt="Doc2Postdoc logo" width={240} height={120} />
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
