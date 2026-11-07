import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import SurveyForm from "@/components/doc2postdoc/SurveyForm";

export const metadata: Metadata = {
  alternates: { canonical: "/doc2postdoc/survey" },
  title: "Doc2Postdoc — PhD & Postdoc Pain-Point Survey",
  description: "Three minutes. No name needed. Tell us how the postdoc journey really feels. Your answers shape what Doc2Postdoc builds next.",
};

export default function SurveyPage() {
  return (
    <main className="teaser-site">
      <SiteNav />
      <SurveyForm />
      <SiteFooter />
    </main>
  );
}
