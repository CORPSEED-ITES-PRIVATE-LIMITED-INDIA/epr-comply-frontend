import Image from "next/image";
import Link from "next/link";
import { BsShieldCheck } from "react-icons/bs";

import solarImg from "@/assets/section1.webp";
import businessImg from "@/assets/business.webp";
import bgImg from "@/assets/serviceimg.jpg";
import google from "@/assets/googleIcon.png";
import glassdoor from "@/assets/glassdoorIcon.webp";
import mouthshut from "@/assets/moutshutlogoIcon.png";

import Rating45 from "@/components/ui/Rating45";
import HeroSearch from "@/components/site/HeroSearch";
import LogoScroller from "@/components/site/LogoScroller";
import ServiceScroller from "@/components/site/ServiceScroller";
import BlogsCarousel from "@/components/site/BlogsCarousel";
import ReviewSection from "@/components/site/ReviewSection";

import { getBlogList, getReviews, getServiceList } from "@/lib/server-api";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/site";

export const metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
};

const TRUST_BADGES = [
  { platform: "Google", logo: google, count: "(284)" },
  { platform: "Glassdoor", logo: glassdoor, count: "(1,04)" },
  { platform: "Mouthshut", logo: mouthshut, count: "(384)" },
];

const HIGHLIGHTS = [
  { text: "What Sets Us Apart", icon: "shield" },
  { text: "Experts", prefix: "100+ " },
  { text: " Reviews", prefix: "1,000+" },
  { text: " Monthly Clients", prefix: "500+ " },
  { text: "Serving India Nationwide" },
];

export default async function HomePage() {
  const [services, blogs, reviews] = await Promise.all([
    getServiceList(),
    getBlogList(),
    getReviews(),
  ]);

  return (
    <>
      {/* A CSS background is only discovered after the stylesheet parses, so the
          hero backdrop is preloaded explicitly. React hoists these into <head>. */}
      <link
        rel="preload"
        as="image"
        href="/hero-960.webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/hero-1600.webp"
        media="(min-width: 768px)"
        fetchPriority="high"
      />

      <section className="hero-backdrop relative w-full py-14 md:py-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white px-5">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-snug md:leading-tight">
            Revolutionize Sustainability Confidently with Reliable EPR Solutions
          </h1>

          <p className="text-base md:text-lg text-gray-200 max-w-6xl mx-auto mb-10">
            Revolutionize your approach to EPR with solutions focused on
            compliance, circularity, and cost efficiency. Our end-to-end support
            covers registration, returns filing, credit trading, and waste
            recycling, ensuring regulatory adherence and substantial financial
            savings.
          </p>

          <HeroSearch services={services} />

          <div className="flex flex-wrap justify-center gap-3 mb-10 w-full">
            {services.slice(0, 6).map((item) => (
              <Link
                href={`/service/${item?.slug}`}
                key={item?.id}
                prefetch={false}
                className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-[12px] hover:bg-white/20 cursor-pointer"
              >
                {item?.title}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-10 mb-12">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.platform}
                className="flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1.5">
                  {/* Static imports carry their own dimensions; passing an
                      explicit height while CSS sets the width auto is what
                      Next warns about. */}
                  <Image
                    src={badge.logo}
                    quality={60}
                    className="h-6 w-auto mb-1"
                    alt={badge.platform}
                    sizes="80px"
                  />
                  <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Rating45 />
                  <p className="text-gray-300 text-sm">{badge.count}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center mt-10">
            <div className="bg-white shadow-md rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1 sm:gap-2 shrink-0 px-2 py-1 bg-gray-200 rounded-full text-xs sm:text-sm"
                >
                  {item.icon === "shield" && (
                    <BsShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-800 font-bold shrink-0" />
                  )}
                  {item.prefix && (
                    <span className="text-green-800 font-medium">
                      {item.prefix}
                    </span>
                  )}
                  <span className="font-semibold text-gray-600 wrap-break-word hyphens-auto">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LogoScroller />

      <section className="w-full py-16 bg-white defer-render defer-render-cards">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 items-center">
          <div className="relative">
            <Image
              src={solarImg}
              alt="Sustainable EPR compliance operations"
              quality={50}
              fetchPriority="low"
              className="w-full h-auto rounded-xl shadow-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
              Smart Compliance for a Sustainable Future.
            </h2>

            <p className="text-gray-600 leading-relaxed text-justify">
              Empower your business with intelligent EPR strategies that ensure
              seamless regulatory adherence while driving genuine environmental
              progress. Our innovative approach combines cutting-edge tracking,
              proactive risk management, and tailored recycling solutions to
              minimize waste, optimize resources, and build a resilient,
              eco-conscious brand for generations ahead.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center">
            <div className="flex flex-col">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Our Comprehensive EPR and Waste Management Solutions
                </h2>
              </div>

              <div className="max-w-3xl mt-6 text-gray-300 text-justify">
                Dive into expert-guided EPR mastery and waste transformation
                services that turn regulatory hurdles into powerful engines of
                innovation, efficiency, and earth-friendly triumph for your
                brand.
              </div>
            </div>
            <div className="flex justify-end">
              <Image
                src={businessImg}
                alt="EPR and waste management consulting"
                quality={50}
                fetchPriority="low"
                className="rounded h-auto w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <ServiceScroller services={services} />
        </div>

        <div className="bg-black text-white pt-20 pb-40">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 text-green-500 text-xl">
                <span>★★★★★</span>
              </div>

              <p className="text-green-400 font-semibold mt-2 text-xl">
                99.9% Customer Satisfaction
              </p>

              <p className="text-gray-400 mt-1">
                based on 750+ reviews and 20,000 Objective Resource
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="bg-white mt-[-180px] relative z-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 relative -top-6 md:top-0">
            <div className="bg-white rounded-r-xl p-10 z-50 md:order-1 order-2">
              <div className="border-l-4 border-green-600 pl-6">
                <p className="text-gray-700 leading-relaxed text-justify">
                  While mastering the complexities of EPR regulations and waste
                  management across plastics, e-waste, batteries, and tyres, our
                  deep industry expertise empowers businesses to achieve
                  effortless compliance, optimized credit trading, and verified
                  recycling partnerships every step of the way.
                </p>

                <ul className="mt-6 space-y-4 text-gray-800 font-medium list-disc pl-4">
                  <li>
                    Penalty-free operations through proactive monitoring and
                    flawless annual filings.
                  </li>
                  <li>
                    Cost optimization via smart credit generation and strategic
                    recycler networks.
                  </li>
                  <li>
                    Highest traceability with end-to-end documentation and
                    certified proof of recycling.
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full md:absolute md:-top-36 md:right-10 md:w-2xl order-1 md:order-2">
              <Image
                src={bgImg}
                quality={50}
                fetchPriority="low"
                className="rounded-xl shadow-xl w-full h-[390px] object-cover z-10"
                alt="EPR compliance experts at work"
                sizes="(max-width: 768px) 100vw, 42rem"
              />
            </div>
          </div>
        </div>
      </section>

      <BlogsCarousel blogs={blogs} />
      <ReviewSection reviews={reviews} />
    </>
  );
}
