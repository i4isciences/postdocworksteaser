import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LegalDoc } from "@/components/LegalDoc";
import privacy from "@/lib/legal/privacy.json";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy — Doc2Postdoc & eyewee",
  description: "How I4I Sciences LLC (Doc2Postdoc and eyewee) handles personal information collected through the early-access waitlist.",
};

export default function PrivacyPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <LegalDoc blocks={privacy as never} />
      <SiteFooter />
    </main>
  );
}
