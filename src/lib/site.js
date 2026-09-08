export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.eprcomply.com"
).replace(/\/$/, "");

export const SITE_NAME = "EPR Comply";

export const DEFAULT_TITLE =
  "EPR Comply #1 CPCB EPR Registration & Compliance Solutions";

export const DEFAULT_DESCRIPTION =
  "Get complete CPCB EPR registration and compliance support with EPR Comply. Trusted experts for EPR filing, credits, and end-to-end solutions across India.";

export const DEFAULT_KEYWORDS =
  "EPR compliance, EPR registration, waste management, plastic epr, india compliance";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-VGMWSHF7VF";

export const GOOGLE_SITE_VERIFICATION =
  "8uG8nRyRUbTwKNpXyFNE9mycNpgeQcswopoFlU01alM";

export const ORG_PHONE = "+91-9311225007";

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
