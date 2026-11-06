"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type StorySectionProps = {
  id: string;
  theme: "light" | "dark";
  heading: string;
  sub: string;
  /** Path of the self-contained animation page in /public/animations */
  src: string;
  title: string;
  /** Plain-language description for screen readers */
  description: string;
};

export function StorySection({ id, theme, heading, sub, src, title, description }: StorySectionProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Pause the animation while it is off-screen (saves battery/CPU), resume when it scrolls back in.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        frame.contentWindow?.postMessage({ cmd: entry.isIntersecting ? "play" : "pause" }, "*");
      },
      { threshold: 0.15 }
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`story story-${theme}`} id={id} aria-labelledby={`${id}-title`}>
      {/* The animation is a direct child of the section so it can bleed to the section's top, right and bottom edges. */}
      <div className="story-frame">
        <iframe
          ref={frameRef}
          src={`${src}?noend&nocap`}
          title={title}
          loading="lazy"
          aria-describedby={`${id}-desc`}
          tabIndex={-1}
        />
        <p className="story-sr" id={`${id}-desc`}>
          {description}
        </p>
      </div>

      <div className="story-inner">
        <div className="story-copy">
          <span className="story-logo">
            <Image src="/doc2postdoc.png" alt="" width={72} height={60} style={{ height: "34px", width: "auto" }} />
            <span className="story-logo-name">
              Doc<span className="teaser-brand-num">2</span>Postdoc<span className="teaser-brand-sm">℠</span>
            </span>
          </span>
          <h2 id={`${id}-title`}>{heading}</h2>
          <p className="story-sub">{sub}</p>
          <a className="story-cta" href="https://doc2postdoc.org">
            Doc2Postdoc.org
          </a>
        </div>
      </div>
    </section>
  );
}
