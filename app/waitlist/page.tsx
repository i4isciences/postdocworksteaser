import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the waitlist — eyewee & Doc2Postdoc",
  description: "Be first in your field. Join the eyewee & Doc2Postdoc early-access waitlist.",
};

export default function WaitlistPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <div className="teaser-waitlist-page">
        <Link className="teaser-back-link" href="/">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <p className="teaser-label">Be first in your field</p>
        <h1>Join the eyewee &amp; Doc2Postdoc waitlist.</h1>
        <p>
          We&apos;re opening Doc2Postdoc metro by metro, field by field — Chicago and St. Louis first. Join now and you&apos;re matched the moment your
          field opens, ahead of general signups.
        </p>
        <WaitlistForm />
      </div>
      <SiteFooter />
    </main>
  );
}
