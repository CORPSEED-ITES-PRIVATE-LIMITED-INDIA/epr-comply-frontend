import Image from "next/image";
import aboutImg from "@/assets/service2.jpg";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const TITLE = "About EPR Comply | CPCB EPR & Waste Management Experts";
const DESCRIPTION =
  "EPRComply turns India's EPR regulations into an advantage for producers, importers and brand owners - registration, filings, credits and verified recycling.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/aboutus" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/aboutus"),
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE_NAME,
  },
};

const PRINCIPLES = [
  {
    title: "Transparency",
    body: "We operate with unwavering openness, making every EPR step, from registration to certified recycling, fully verifiable, fostering unbreakable trust and giving you complete peace of mind.",
    justify: true,
  },
  {
    title: "Innovation",
    body: "We harness cutting-edge technology and bold ideas to transform complex regulations into automated, game-changing pathways that accelerate sustainability and simplify your journey.",
    justify: true,
  },
  {
    title: "Excellence",
    body: "We pursue nothing short of mastery, delivering superior results that strengthen compliance, amplify efficiency, and push your green impact far beyond expectations.",
    justify: true,
  },
];

const DIFFERENTIATORS = [
  {
    title: "Expert Trailblazers",
    body: "Our seasoned navigators decode EPR complexities with decades of insight, turning regulatory challenges into strategic advantages that keep you confidently ahead.",
    justify: true,
  },
  {
    title: "Eco-Smart Strategists",
    body: "We design regenerative solutions that minimize environmental footprints, maximize credits, and ignite zero-waste revolutions for lasting planet-positive power.",
  },
  {
    title: "Full-Cycle Guardians",
    body: "From initial filing to final certificate, we orchestrate every phase seamlessly, freeing you to focus on growth while we weave total transformation.",
  },
  {
    title: "Deadline Masters",
    body: "Deadlines are our symphony; we deliver filings, reports, and results with perfect timing, ensuring penalty-free progress and zero stress.",
  },
  {
    title: "Your Success Champions",
    body: "Your goals lead the way; we craft personalized strategies with responsive, adaptive support that celebrates your victories as our own.",
  },
  {
    title: "Proven Impact Illuminators",
    body: "We provide audit-ready, traceable outcomes backed by certified partners, spotlighting verifiable triumphs that shine as beacons of reliability and inspiration.",
  },
];

export default function AboutUsPage() {
  return (
    <section className="bg-white">
      {/* HERO / BANNER */}
      <div className="bg-green-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            About Us
          </h1>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Our Visionary Roots
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            EPRComply is a trailblazing force born from a bold dream: to rewrite
            the rules of waste in India by turning daunting regulations into
            dynamic superpowers for businesses. We are the alchemists of
            sustainability, blending razor-sharp regulatory mastery with
            groundbreaking tech innovations to spark a nationwide revolution in
            EPR and waste management. Fueled by passion for a planet that
            thrives, we empower producers to soar beyond compliance, crafting
            legacies of innovation and eco-excellence that inspire industries
            and protect our shared tomorrow.
          </p>
        </div>

        <div>
          {/* The Vite build pulled this from images.unsplash.com. Bundled
              instead so the page never depends on a third-party host. */}
          <Image
            src={aboutImg}
            alt="Sustainable infrastructure powering EPR compliance"
            quality={65}
            className="rounded-xl shadow-lg w-full object-cover h-80"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* MISSION SECTION */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            Our Unstoppable Drive
          </h2>

          <p className="text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            We dive deep into the heart of CPCB frameworks, wielding cutting-edge
            tools to orchestrate seamless EPR journeys, from electrifying
            registrations to genius credit strategies and transformative waste
            rebirth. Our vibrant team of visionaries and experts doesn&apos;t
            just solve problems; we ignite possibilities, forging circular
            economies where waste becomes wonder. Partner with us to unleash
            your brand&apos;s green potential, slash risks, amplify impact, and
            lead the charge toward a vibrant, waste-free India that captivates
            hearts and commands admiration.
          </p>
        </div>
      </div>

      {/* VALUES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Our Guiding Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRINCIPLES.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p
                className={`text-gray-600 ${item.justify ? "text-justify" : ""}`}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            What Sets EPRComply Apart?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p
                  className={`text-gray-600 ${
                    item.justify ? "text-justify" : ""
                  }`}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
