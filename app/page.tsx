import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { EyeweeSection } from "@/components/eyewee/EyeweeSection";

import { LandingHeroAndServices } from "@/components/LandingHeroAndServices";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: "Doc2Postdoc | Your next step is easier with someone who has taken it" },
  description: "Connects PhDs and postdocs with someone one step ahead in their field. Free to join the waitlist.",
  openGraph: {
    title: "Doc2Postdoc | Your next step is easier with someone who has taken it",
    description: "Connects PhDs and postdocs with someone one step ahead in their field. Free to join the waitlist.",
    type: "website",
    url: "https://doc2postdoc.com",
    images: [{ url: "https://doc2postdoc.com/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doc2Postdoc | Your next step is easier with someone who has taken it",
    description: "Connects PhDs and postdocs with someone one step ahead in their field. Free to join the waitlist.",
    images: ["https://doc2postdoc.com/og.jpg"],
  },
};

// Structured data: only facts already on the page. sameAs (LinkedIn) is added once the exact URL is confirmed.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://doc2postdoc.com/#organization",
      name: "Doc2Postdoc",
      url: "https://doc2postdoc.com",
      logo: "https://doc2postdoc.com/doc2postdoc.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://doc2postdoc.com/#website",
      name: "Doc2Postdoc",
      url: "https://doc2postdoc.com",
      publisher: { "@id": "https://doc2postdoc.com/#organization" },
    },
  ],
};

export default function Home() {
  return (
    <main className="teaser-site" id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteNav active="home" />

      <LandingHeroAndServices />

      <EyeweeSection />

      <SiteFooter />
    </main>
  );
}
