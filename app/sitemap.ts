import type { MetadataRoute } from "next";

const HOST = "https://doc2postdoc.com";

// lastModified = date of the last change to each page's own files in the repository.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${HOST}/`, lastModified: "2026-11-11" },
    { url: `${HOST}/waitlist`, lastModified: "2026-11-11" },
    { url: `${HOST}/terms`, lastModified: "2026-11-11" },
    { url: `${HOST}/privacy`, lastModified: "2026-11-11" },
    { url: `${HOST}/doc2postdoc`, lastModified: "2026-11-03" },
  ];
}
