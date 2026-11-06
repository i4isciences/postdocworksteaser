import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="teaser-footer">
      <Link className="teaser-brand" href="/" aria-label="Home" style={{ textDecoration: "none" }}>
        <Image
          src="/doc2postdoc.png"
          alt="Doc2Postdoc"
          width={72}
          height={60}
          style={{ height: "46px", width: "auto", flexShrink: 0 }}
        />
        <div className="teaser-brand-text">
          <div className="teaser-brand-name" style={{ fontSize: "20px" }}>
            Doc<span className="teaser-brand-num">2</span>Postdoc<span className="teaser-brand-sm">℠</span>
          </div>
          <div className="teaser-brand-motto" style={{ fontSize: "11.5px" }}>
            Where the next step has already been taken
          </div>
        </div>
      </Link>
      <span className="teaser-footer-powered">Powered by i4iSciences&trade;</span>
      <nav className="teaser-footer-legal" aria-label="Legal">
        <Link href="/terms">Terms of Service</Link>
        <Link href="/privacy">Privacy Policy</Link>
      </nav>
      <span className="teaser-footer-contact">
        <span>
          Privacy: <a href="mailto:privacy@doc2postdoc.org">privacy@doc2postdoc.org</a>
        </span>
        <span>
          General: <a href="mailto:hello@doc2postdoc.com">hello@doc2postdoc.com</a>
        </span>
      </span>
    </footer>
  );
}
