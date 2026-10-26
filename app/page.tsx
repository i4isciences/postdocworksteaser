import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { EyeweeSection } from "@/components/eyewee/EyeweeSection";

import { LandingHeroAndServices } from "@/components/LandingHeroAndServices";

export const metadata: Metadata = {
  title: "Doc2Postdoc℠ | Where the Next Step Has Already Been Taken",
  description:
    "Meet people one step ahead of you, and get help with everything that comes with the move, all the way to settled. eyewee guides you through each service.",
};

export default function Home() {
  return (
    <main className="teaser-site" id="top">
      <SiteNav active="home" />

      <LandingHeroAndServices />

      <EyeweeSection />

      <SiteFooter />
    </main>
  );
}
