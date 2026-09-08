import { notFound } from "next/navigation";
import { BsShieldCheck } from "react-icons/bs";

import EnquiryForm from "@/components/site/EnquiryForm";
import FaqAccordion from "@/components/site/FaqAccordion";
import TableOfContentNav from "@/components/site/TableOfContentNav";

import {
  getServiceBySlug,
  getServiceFaqs,
  getServiceList,
  getServiceSections,
} from "@/lib/server-api";
import { stripHtml } from "@/lib/format";
import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

// Prerender every service at build time and refresh on a timer, so a visitor
// (or a crawler) gets static HTML instead of waiting on the API.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getServiceList();
  return services
    .filter((service) => service?.slug)
    .map((service) => ({ serviceSlug: service.slug }));
}

const HIGHLIGHTS = [
  { text: "What Sets Us Apart", icon: "shield" },
  { text: "MCA Experts", prefix: "500+" },
  { text: "Reviews", prefix: "10,000+" },
  { text: "Monthly Clients", prefix: "2500+" },
  { text: "Serving India Nationwide" },
];

/** displayOrder 0/null sorts last, matching the previous ordering rule. */
const byDisplayOrder = (a, b) => {
  const rank = (value) =>
    value === null || value === undefined || Number(value) === 0
      ? Number.MAX_SAFE_INTEGER
      : Number(value);
  return rank(a?.displayOrder) - rank(b?.displayOrder);
};

export async function generateMetadata({ params }) {
  const { serviceSlug } = await params;
  const service = await getServiceBySlug(serviceSlug);

  if (!service) {
    return { title: SITE_NAME, robots: { index: false, follow: false } };
  }

  const title = service.metaTitle || service.title || SITE_NAME;
  const description =
    service.metaDescription ||
    stripHtml(service.shortDescription, 160) ||
    DEFAULT_DESCRIPTION;
  const canonical = `/service/${serviceSlug}`;
  const image = service.ogImage || service.bannerImage || service.thumbnail;

  return {
    title,
    description,
    keywords: service.metaKeyword || service.metaKeywords || undefined,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical),
      title: service.ogTitle || title,
      description: service.ogDescription || description,
      siteName: SITE_NAME,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: service.ogTitle || title,
      description: service.ogDescription || description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ServicePage({ params }) {
  const { serviceSlug } = await params;

  const [service, rawSections, faqs] = await Promise.all([
    getServiceBySlug(serviceSlug),
    getServiceSections(serviceSlug),
    getServiceFaqs(serviceSlug),
  ]);

  if (!service) notFound();

  const sections = [...rawSections].sort(byDisplayOrder);

  const faqLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: stripHtml(faq.answer),
            },
          })),
        }
      : null;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description:
      service.metaDescription || stripHtml(service.shortDescription, 300),
    url: absoluteUrl(`/service/${serviceSlug}`),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    areaServed: "IN",
    ...(service.categoryName ? { category: service.categoryName } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <section className="bg-linear-to-br from-[#0E1F3A] via-[#1B3A6B] to-[#0E1F3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* LEFT SECTION */}
            <div className="w-full flex flex-col h-full">
              <div>
                <h1 className="text-xl sm:text-4xl font-bold text-white leading-snug wrap-break-words">
                  {service?.title}
                </h1>

                <div
                  className="tiptap-render text-white mt-4 text-sm sm:text-lg wrap-break-words hyphens-auto"
                  dangerouslySetInnerHTML={{
                    __html: service?.shortDescription || "",
                  }}
                />
              </div>
            </div>

            {/* RIGHT FORM SECTION */}
            <div className="w-full flex justify-center lg:justify-end mt-6 lg:mt-0">
              <div className="w-full sm:max-w-md bg-white rounded-xl shadow-xl p-3 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-green-700 text-white px-2 py-1 rounded-md text-xs font-semibold shadow whitespace-normal sm:whitespace-nowrap max-w-full">
                  Limited Time Offer
                </div>

                <h2 className="text-center text-sm sm:text-xl font-medium text-gray-800 mb-6 wrap-break-words hyphens-auto pt-2 sm:pt-0">
                  Get Free Expert Consultation
                </h2>

                <EnquiryForm />
              </div>
            </div>
          </div>

          {/* BOTTOM BADGES */}
          <div className="w-full flex justify-center mt-10">
            <div className="bg-white shadow-md rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1 sm:gap-2 shrink-0 px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
                >
                  {item.icon === "shield" && (
                    <BsShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-800 shrink-0" />
                  )}
                  {item.prefix && (
                    <span className="text-green-800">{item.prefix}</span>
                  )}
                  <span className="font-semibold text-gray-600 wrap-break-words hyphens-auto">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {service?.fullDescription && (
        <section>
          <div
            className="tiptap-render"
            dangerouslySetInnerHTML={{ __html: service.fullDescription }}
          />
        </section>
      )}

      {sections.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* LEFT SIDE - TABLE OF CONTENT */}
              <div className="lg:block">
                <TableOfContentNav
                  sections={sections.map(({ id, tabName }) => ({
                    id,
                    tabName,
                  }))}
                />
              </div>

              {/* RIGHT SIDE - CONTENT */}
              <div className="lg:col-span-2 space-y-0">
                {sections.map((item, index) => (
                  <div key={item.id}>
                    <section
                      id={`section-${item.id}`}
                      data-section-id={item.id}
                      className="scroll-mt-24 py-2"
                    >
                      <h2 className="text-3xl font-bold mb-4 text-gray-900">
                        {item.title}
                      </h2>

                      <div
                        className="tiptap-render max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: item.description || "",
                        }}
                      />
                    </section>

                    {index !== sections.length - 1 && (
                      <div className="w-full">
                        <div className="h-px w-full bg-gray-200" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <FaqAccordion faqs={faqs} />
    </>
  );
}
