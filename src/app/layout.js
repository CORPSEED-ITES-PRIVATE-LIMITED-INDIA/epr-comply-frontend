import Analytics from "@/components/site/Analytics";
import "./globals.css";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  GA_MEASUREMENT_ID,
  GOOGLE_SITE_VERIFICATION,
  ORG_PHONE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: SITE_URL,
    title:
      "EPR Registration & Compliance Consultant in India | EPR Comply",
    description:
      "Get fast CPCB EPR registration for Plastic, E-waste, Battery & Tyre waste. Trusted EPR consultants in India.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EPR Registration & Compliance Consultant in India | EPR Comply",
    description:
      "Get fast CPCB EPR registration for Plastic, E-waste, Battery & Tyre waste. Trusted EPR consultants in India.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  // Tab + home-screen icons come from src/app/icon.png and apple-icon.png.
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006400",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Get fast and hassle-free EPR registration for Plastic, E-Waste & Battery Waste. Trusted CPCB EPR consultants in India. Apply today.",
  sameAs: [
    "https://www.linkedin.com/company/eprcomply",
    "https://www.facebook.com/eprcomply",
    "https://twitter.com/eprcomply",
  ],
};

const professionalServiceLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  image: `${SITE_URL}/logo.png`,
  url: `${SITE_URL}/`,
  telephone: ORG_PHONE,
  address: {
    "@type": "PostalAddress",
    streetAddress: "3rd Floor, A-5, Grovy Optiva, Block A, Sector 68",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201316",
    addressCountry: "IN",
  },
  areaServed: "India",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceLd),
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden md:overflow-x-clip antialiased">
        {children}

        <Analytics measurementId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
