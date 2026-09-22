import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostdocWorks — Early Access",
  description: "PostdocWorks turns hard-earned academic experience into momentum — Doc2Postdoc peer matching and eyewee, the AI companion for postdocs. Join the early-access waitlist.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
