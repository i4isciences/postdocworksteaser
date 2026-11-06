import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LegalDoc } from "@/components/LegalDoc";
import terms from "@/lib/legal/terms.json";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use — Doc2Postdoc & eyewee",
  description: "The terms that apply to the Doc2Postdoc and eyewee early-access waitlist and services, operated by I4I Sciences LLC.",
};

export default function TermsPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <LegalDoc blocks={terms as never} />
      <SiteFooter />
    </main>
  );
}
