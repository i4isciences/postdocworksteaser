import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "eyewee & Doc2Postdoc — Early Access",
  description: "Doc2Postdoc peer matching and eyewee, the AI companion for postdocs, turn hard-earned academic experience into momentum. Join the early-access waitlist.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
