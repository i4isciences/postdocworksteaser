import type { MetadataRoute } from "next";

// Crawlers may read the whole site except the server routes. The animation files carry their own noindex header.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/unsubscribe"] }],
    sitemap: "https://doc2postdoc.com/sitemap.xml",
  };
}
