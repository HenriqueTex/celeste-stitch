import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/** Origin of the API (e.g. https://api-bolaoceleste.bytexas.com.br), the only place the site fetches from. */
function apiOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "").origin;
  } catch {
    return "";
  }
}

/**
 * Sessions live in localStorage, so the CSP is what keeps an injected script from loading
 * code or sending a token anywhere but the API. Next's inline bootstrap scripts need
 * 'unsafe-inline'; dev also needs eval and websockets for hot reload, so it gets no CSP.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Team crests and avatars come from the R2 bucket; QR codes are data: URLs.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin()}`.trim(),
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]),
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The reset link carries its token in the URL; it must not leak to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
