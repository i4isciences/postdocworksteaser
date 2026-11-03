import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "euusmimokvzlfjorwwau.supabase.co" }],
  },
  async headers() {
    return [
      // Ask search engines not to index the old vercel address.
      {
        source: "/:path*",
        has: [{ type: "host", value: "postdocworksteaser.vercel.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // Old address -> doc2postdoc.com, as a 301 (path and query are kept).
      {
        source: "/:path*",
        has: [{ type: "host", value: "postdocworksteaser.vercel.app" }],
        destination: "https://doc2postdoc.com/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
