import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { UnsubscribeClient } from "@/components/UnsubscribeClient";

export const metadata: Metadata = {
  title: "Unsubscribe — Doc2Postdoc℠",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) || "";
  return (
    <main className="teaser-site">
      <SiteNav />
      <div className="teaser-waitlist-page">
        <UnsubscribeClient e={first(params.e)} t={first(params.t)} />
      </div>
      <SiteFooter />
    </main>
  );
}
