"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { captureAttribution } from "@/lib/waitlist/adTags";

export function SiteNav({ active }: { active?: "home" | "doc2postdoc" | "eyewee" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="teaser-nav" ref={navRef}>
      <Link className="teaser-brand" href="/" aria-label="Home" style={{ textDecoration: "none" }}>
        <Image
          src="/doc2postdoc.png"
          alt="Doc2Postdoc"
          width={72}
          height={60}
          priority
          style={{ height: "46px", width: "auto", flexShrink: 0 }}
        />
        <div className="teaser-brand-text">
          <div className="teaser-brand-name">
            Doc<span className="teaser-brand-num">2</span>Postdoc<span className="teaser-brand-sm">℠</span>
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
        <Link className="teaser-nav-link" href="/#svc">
          Services
        </Link>
        <Link className="teaser-nav-link" href="/#eyewee">
          eyewee
        </Link>
        <span className="teaser-pill">Early access</span>
        <a className="teaser-waitlist-btn teaser-blink" href="/waitlist">
          Join the waitlist <ArrowRight size={15} />
        </a>
      </nav>

      <div className="teaser-mobile-nav">
        {/* 3 lines hamburger menu button left of yellow arrow */}
        <button
          type="button"
          className={`teaser-menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Yellow arrow waitlist button */}
        <a
          className="teaser-waitlist-btn teaser-blink"
          href="/waitlist"
          aria-label="Join the waitlist"
        >
          <ArrowRight size={16} />
        </a>
      </div>

      {/* Clean Mobile Dropdown Menu with eyewee and doc2postdoc */}
      {menuOpen && (
        <div className="teaser-mobile-dropdown">
          <nav className="teaser-mobile-dropdown-inner" aria-label="Mobile navigation">
            <Link
              className={`teaser-mobile-dropdown-link ${active === "doc2postdoc" ? "active" : ""}`}
              href="/doc2postdoc"
              onClick={() => setMenuOpen(false)}
            >
              <div className="teaser-mobile-dropdown-link-title">
                Doc<span className="teaser-brand-num">2</span>Postdoc<span className="teaser-brand-sm">℠</span>
              </div>
              <span className="teaser-mobile-dropdown-badge">Community</span>
            </Link>

            <Link
              className="teaser-mobile-dropdown-link"
              href="/#eyewee"
              onClick={() => setMenuOpen(false)}
            >
              <div className="teaser-mobile-dropdown-link-title">
                eyewee<span className="teaser-brand-sm">™</span>
              </div>
              <span className="teaser-mobile-dropdown-badge">AI Companion</span>
            </Link>

            <Link
              className="teaser-mobile-dropdown-link"
              href="/#svc"
              onClick={() => setMenuOpen(false)}
            >
              <div className="teaser-mobile-dropdown-link-title">Services</div>
              <span className="teaser-mobile-dropdown-badge">Overview</span>
            </Link>

            <Link
              className="teaser-mobile-dropdown-btn teaser-blink"
              href="/waitlist"
              onClick={() => setMenuOpen(false)}
            >
              Join the waitlist <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
