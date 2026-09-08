/** @type {import('next').NextConfig} */

// Spring Boot backends. Overridable per-environment.
const API_BASE = process.env.BACKEND_URL || "http://localhost:8000";
const LEAD_BASE = process.env.LEAD_SERVICE_URL || "http://localhost:9001";

const nextConfig = {
  // Hide the floating Next dev-tools badge in the corner of the page.
  devIndicators: false,

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Keep the browser talking to same-origin paths (exactly like the Vite dev
  // proxy did) so no CORS/preflight round-trips are added on the client.
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_BASE}/api/:path*` },
      { source: "/client/:path*", destination: `${API_BASE}/client/:path*` },
      { source: "/leadService/:path*", destination: `${LEAD_BASE}/leadService/:path*` },
    ];
  },

  images: {
    // No remotePatterns on purpose: a wildcard here turns /_next/image into
    // an open image proxy for any host. Admin-uploaded media is rendered with
    // a plain <img>, so nothing needs it. Add your CDN host explicitly if you
    // later want those images optimised too.
    // Next only honours <Image quality> values listed here.
    qualities: [50, 60, 70, 75],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    // Only pull the icon modules that are actually referenced.
    optimizePackageImports: ["react-icons", "lucide-react", "framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
