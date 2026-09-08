import ContactForm from "@/components/site/ContactForm";
import LazyMap from "@/components/site/LazyMap";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const TITLE = "Contact EPR Comply | Talk to a CPCB EPR Consultant";
const DESCRIPTION =
  "Reach the EPR Comply team in Noida for CPCB EPR registration, annual returns, credit trading and recycling support. Call +91 75586 40644 or send an enquiry.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contactus" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contactus"),
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
  },
};

const contactLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: absoluteUrl("/contactus"),
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    telephone: "+91-7558640644",
    email: "info@eprcomply.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5th Floor, 501, Pegasus Tower, A-10, Block A, Sector 68",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201309",
      addressCountry: "IN",
    },
  },
};

export default function ContactUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />

      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* PAGE TITLE */}
          <h1 className="text-4xl font-bold text-green-700 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Have questions? Reach out to us and our team will get back to you
            shortly.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT SIDE - CONTACT INFO */}
            <div className="space-y-6">
              <div className="bg-green-100 p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-3">📞 Call Us</h2>
                <a
                  href="tel:+917558640644"
                  className="text-gray-700 hover:text-green-700"
                >
                  +91 75586 40644
                </a>
              </div>

              <div className="bg-green-100 p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-3">📧 Email</h2>
                <a
                  href="mailto:info@eprcomply.com"
                  className="text-gray-700 hover:text-green-700"
                >
                  info@eprcomply.com
                </a>
              </div>

              <div className="bg-green-100 p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-3">📍 Offices</h2>
                <p className="text-gray-700 font-medium">Head Office</p>
                <address className="text-gray-600 text-sm not-italic">
                  5th Floor, 501, Pegasus Tower, A-10, Block A, Sector 68,
                  Noida, Uttar Pradesh 201309
                </address>
              </div>
            </div>

            {/* RIGHT SIDE - ENQUIRY FORM */}
            <div className="lg:col-span-2 bg-green-50 p-10 rounded-2xl shadow">
              <h2 className="text-2xl font-semibold text-green-700 mb-6">
                📝 Enquiry Form
              </h2>

              <ContactForm />
            </div>
          </div>

          {/* GOOGLE MAP */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              📍 Find Us on Map
            </h2>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <LazyMap
                title="EPR Comply office location"
                src="https://maps.google.com/maps?q=Grovy%20Optiva&t=&z=15&ie=UTF8&iwloc=&output=embed"
                height={400}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
