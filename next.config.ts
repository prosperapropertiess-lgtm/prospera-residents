import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "hwaroazxbzgmjjasgtdb.supabase.co", pathname: "/storage/v1/object/public/property-images/**" }] },
  async headers() { return [{ source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "X-Frame-Options", value: "DENY" }] }]; },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
