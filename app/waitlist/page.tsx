import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  alternates: { canonical: "/waitlist" },
  title: "Join the waitlist — eyewee & Doc2Postdoc",
  description: "Early Access. We're opening Doc2Postdoc metro by metro, based on where people join from. Tell us your city so we know where to open next. If you ticked the news box, we'll email you when your field and region open. Otherwise, visit doc2postdoc.com anytime.",
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
          We&apos;re opening Doc2Postdoc metro by metro, based on where people join from. Tell us your city so we know where to open next. If you ticked the news box, we&apos;ll email you when your field and region open. Otherwise, visit doc2postdoc.com anytime.
        </p>
        <WaitlistForm />
      </div>
      <SiteFooter />
    </main>
  );
}
