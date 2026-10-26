import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the waitlist — eyewee & Doc2Postdoc",
  description: "Early Access. We're opening Doc2Postdoc metro by metro, starting with Chicago and St. Louis. Join the waitlist and we'll email you when it opens in your field.",
};

export default function WaitlistPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <div className="teaser-waitlist-page">
        <Link className="teaser-back-link" href="/">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <p className="teaser-label">EARLY ACCESS</p>
        <h1>Join the waitlist</h1>
        <p>
          We&apos;re opening Doc2Postdoc metro by metro, starting with Chicago and St. Louis. Join the waitlist and we&apos;ll email you when it opens in your field.
        </p>
        <WaitlistForm />
      </div>
      <SiteFooter />
    </main>
  );
}
