import  { useEffect, useRef, useState } from "react";
import React, { Suspense } from "react";
import secondSection from "../assets/optimized/secondSection.webp";
import { getAllReviews } from "../toolkit/slices/settingSlice";
import { BsShieldCheck } from "react-icons/bs";
import Rating45 from "../components/Rating45";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const LogoInfiniteScroller = React.lazy(() => import("./LogoInfiniteScroll"));
const BlogsCarousel = React.lazy(() => import("./BlogsCarousel"));
const ReviewSection = React.lazy(() => import("./ReviewSection"));
import { useDispatch } from "react-redux";
import { getClientServiceList } from "../toolkit/slices/serviceSlice";
import { getClientBlogList } from "../toolkit/slices/blogSlice";




const HomePage = () => {
  // const scrollRef = useRef(null);
  const serviceList = useSelector((state) => state.service.clientServiceList);
  const [index, setIndex] = useState(0);
  // const [isDown, setIsDown] = useState(false);
  // const startXRef = useRef(0);
  // const startScrollRef = useRef(0);
  // const rafIdRef = useRef(null);
  // const runningRef = useRef(false);
  // const pausedRef = useRef(false);
  // const speedRef = useRef(1.2);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  // const nextImage = () => {
  //   setIndex((prev) => (prev + 1) % images.length);
  // };

  // const prevImage = () => {
  //   setIndex((prev) => (prev - 1 + images.length) % images.length);
  // };
  
useEffect(() => {
  dispatch(getClientServiceList()); // hero needs this

  const idle =
    window.requestIdleCallback ||
    ((cb) => setTimeout(cb, 1000));

  idle(() => {
    dispatch(getClientBlogList());
  });
}, [dispatch]);


  // const step = () => {
  //   const container = scrollRef.current;
  //   if (!container) {
  //     rafIdRef.current = null;
  //     runningRef.current = false;
  //     return;
  //   }

  //   if (!pausedRef.current && !isDown) {
  //     container.scrollLeft += speedRef.current;
  //     const half = container.scrollWidth / 2;
  //     if (container.scrollLeft >= half) {
  //       container.scrollLeft -= half;
  //     }
  //   }

  //   rafIdRef.current = requestAnimationFrame(step);
  // };

  // const startAuto = () => {
  //   pausedRef.current = false;
  //   if (!runningRef.current) {
  //     runningRef.current = true;
  //     rafIdRef.current = requestAnimationFrame(step);
  //   }
  // };

  // const stopAuto = () => {
  //   pausedRef.current = true;
  //   if (rafIdRef.current) {
  //     cancelAnimationFrame(rafIdRef.current);
  //     rafIdRef.current = null;
  //   }
  //   runningRef.current = false;
  // };

  // useEffect(() => {
  //   startAuto();
  //   return () => {
  //     if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  //   };
  // }, []);

  // const onMouseDown = (e) => {
  //   stopAuto();
  //   setIsDown(true);
  //   const container = scrollRef.current;
  //   startXRef.current = e.pageX - container.offsetLeft;
  //   startScrollRef.current = container.scrollLeft;
  // };

  // const onMouseMove = (e) => {
  //   if (!isDown) return;
  //   e.preventDefault();
  //   const container = scrollRef.current;
  //   const x = e.pageX - container.offsetLeft;
  //   const walk = x - startXRef.current;
  //   container.scrollLeft = startScrollRef.current - walk;
  // };

  // const onMouseUp = () => {
  //   setIsDown(false);
  //   setTimeout(() => {
  //     if (!pausedRef.current) startAuto();
  //   }, 30);
  // };

  // const onMouseLeave = () => {
  //   if (isDown) {
  //     setIsDown(false);
  //     setTimeout(() => {
  //       if (!pausedRef.current) startAuto();
  //     }, 30);
  //   }
  // };

  // const handleMouseEnter = () => {
  //   pausedRef.current = true;
  //   if (rafIdRef.current) {
  //     cancelAnimationFrame(rafIdRef.current);
  //     rafIdRef.current = null;
  //     runningRef.current = false;
  //   }
  // };

  // const handleMouseLeave = () => {
  //   pausedRef.current = false;
  //   if (!isDown) startAuto();
  // };

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredServices = serviceList?.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{" #1 EPR Compliance & Registration Consultant in India "}</title>

        <meta
          name="description"
          content={
            " Get fast and hassle-free EPR registration for Plastic, E-Waste & Battery Waste. Trusted CPCB EPR consultants in India. Apply today"
          }
        />

        {/* <meta name="keywords" content={serviceDetail.metaKeywords} /> */}

        {/* Canonical (IMPORTANT) */}
        <link rel="canonical" href={`https://www.eprcomply.com`} />

        {/* Open Graph */}
        {/* <meta
              property="og:title"
              content={
                serviceDetail?.ogTitle ||
                serviceDetail?.metaTitle ||
                serviceDetail?.title
              }
            /> */}

        {/* <meta
              property="og:description"
              content={
                serviceDetail?.ogDescription ||
                serviceDetail?.metaDescription ||
                serviceDetail?.shortDescription
              }
            /> */}

        {/* <meta property="og:type" content="website" /> */}
        {/* <meta
              property="og:url"
              content={`https://www.eprcomply.com`}
            /> */}
        {/* <meta property="og:image" content={serviceDetail.ogImage} /> */}
      </Helmet>
      <section className="relative w-full py-14 md:py-16 overflow-hidden">
       {/* <img
        src={"https://eprcomply.s3.ap-south-1.amazonaws.com/455ca58f-1411-4f84-9c24-f8f0c8e59ffd.webp"}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
        fetchpriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        width="1920"
        height="800"
      /> */}
      <img
        src="https://eprcomply.s3.ap-south-1.amazonaws.com/455ca58f-1411-4f84-9c24-f8f0c8e59ffd.webp"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
        fetchpriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        width="1920"
        height="800"
      />
        <div className="absolute inset-0 bg-[#0A3558]/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white px-5">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-snug md:leading-tight">
            Revolutionize Sustainability Confidently with Reliable EPR
            Solutions{" "}
          </h2>

          <p className="text-base md:text-lg text-gray-200 max-w-6xl mx-auto mb-10">
            Revolutionize your approach to EPR with solutions focused on
            compliance, circularity, and cost efficiency. Our end-to-end support
            covers registration, returns filing, credit trading, and waste
            recycling, ensuring regulatory adherence and substantial financial
            savings.
          </p>

          <div className="flex justify-center mb-6 relative" ref={dropdownRef}>
            <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-2xl relative z-20">
              <input
                type="text"
                placeholder="Search for EPR Services..."
                className="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              {/* <button className="bg-blue-600 px-6 text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                Search
              </button> */}
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchTerm.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white mt-1 rounded-lg shadow-2xl overflow-hidden z-50 border border-gray-200">
                {filteredServices?.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto">
                    {filteredServices.map((service, idx) => (
                      <li key={idx}>
                        <Link
                          to={`${service.slug}`}
                          className="block px-4 py-3 text-left text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-none"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="font-medium">{service.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-left">
                    No services found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10 w-full">
            {serviceList?.length > 0 &&
              serviceList.slice(0, 6).map((item, index) => (
                <Link
                  to={`${item?.slug}`}
                  key={index}
                  className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-[12px] hover:bg-white/20 cursor-pointer"
                >
                  {item?.title}
                </Link>
              ))}
          </div>

          <div className="flex flex-wrap justify-center gap-10 mb-12">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5">
                {/* <img src={google} className="h-6 mb-1" alt="Google" /> */}
                <img src={"https://eprcomply.s3.ap-south-1.amazonaws.com/c01236b8-27a5-440f-a9e0-bb21cc6997ec.webp"} alt="Google" className="h-6 mb-1" width={24} height={24} loading="lazy" decoding="async" />
                <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating45 />
                <p className="text-gray-300 text-sm">(284)</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5">
                <img src={"https://eprcomply.s3.ap-south-1.amazonaws.com/37df5364-6cf1-49c3-9f9b-cf82e23d14c3.webp"} className="h-6 mb-1" alt="Glassdoor" />
                <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating45 />
                <p className="text-gray-300 text-sm">(1,04)</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5">
                <img src={"https://eprcomply.s3.ap-south-1.amazonaws.com/1b464288-1332-41a1-bbe6-d1a11fbc0eb1.webp"} className="h-6 mb-1" alt="Trustpilot" />
                <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating45 />
                <p className="text-gray-300 text-sm">(384)</p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10">
            <div className="bg-white shadow-md rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
              {[
                {
                  text: "What Sets Us Apart",
                  icon: (
                    <BsShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-700 font-bold shrink-0" />
                  ),
                },
                {
                  text: "Experts",
                  icon: (
                    <span className="text-green-700 font-medium">100+ </span>
                  ),
                },
                {
                  text: " Reviews",
                  icon: (
                    <span className="text-green-700 font-medium">1,000+</span>
                  ),
                },
                {
                  text: " Monthly Clients",
                  icon: (
                    <span className="text-green-700 font-medium">500+ </span>
                  ),
                },
                { text: "Serving India Nationwide" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 sm:gap-2 shrink-0 px-2 py-1 bg-gray-200 rounded-full text-xs sm:text-sm"
                >
                  {item.icon && item.icon}
                  <span className="font-semibold text-gray-600 wrap-break-word hyphens-auto">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div style={{ height: 120 }} />}>
  <LogoInfiniteScroller />
</Suspense>
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 items-center">
          <div className="relative">
            <img
              src={secondSection}
              alt="Solar Panels"
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
              className="rounded-lg shadow-lg"
            />
            {/* <div className="hidden md:block absolute right-10 -bottom-8 bg-green-600 text-white p-6 rounded-xl max-w-xs shadow-xl">
              <h3 className="text-xl font-semibold mb-2">
                Fostering Growth Of Solar Energy!
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                Benefiting from 20 years experience in the solar material
                procurement sector and PV manufacturing.
              </p>
            </div> */}
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
            {/* 
            <div className="pt-6">
              <div className="h-8 opacity-40">
                <img
                  src="https://dummyimage.com/120x40/ffffff/000000&text=Signature"
                  alt=""
                  className="opacity-60"
                />
              </div>

              <p className="text-lg font-semibold mt-2">Michael Brian</p>
              <p className="text-green-600 font-medium text-sm">
                Solatec Founder
              </p>
            </div> */}
          </div>
        </div>
      </section>
      <section className="bg-black text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center">
            <div className="flex flex-col">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  EPR Registration & CPCB Compliance Services in India
                </h2>
              </div>

              <div className="max-w-3xl mt-6 text-gray-300 text-justify">
                Dive into expert-guided EPR mastery and waste transformation
                services that turn regulatory hurdles into powerful engines of
                innovation, efficiency, and earth-friendly triumph for your
                brand.
              </div>

              {/* <button className="mt-8 w-fit flex items-center gap-2 bg-green-600 px-6 py-3 rounded-md hover:bg-green-700 transition">
                Explore All Features!
                <FiArrowRight />
              </button> */}
            </div>
            <div className="flex justify-end">
              {/* <img src={businessImg} alt="business" className="rounded" /> */}
              <img
                src={"https://eprcomply.s3.ap-south-1.amazonaws.com/8d6aed74-eebf-4308-99cc-fc00378f8385.webp"}
                alt="business"
                className="rounded"
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
              />
            </div>
          </div>

         {/* <div className="mt-14 flex gap-6 overflow-x-auto snap-x snap-mandatory py-4">
          {serviceList?.map((item, index) => (
            <Link key={index} to={`${item.slug}`} className="snap-start shrink-0">
              <div className="w-[280px] h-[200px] bg-white text-black rounded-xl p-6 shadow flex flex-col">
                <img src={item.img} className="w-12 mb-3" alt="" loading="lazy" decoding="async" />
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <div
                  className="tiptap-render line-clamp-3 prose max-w-none text-sm flex-1 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: item.metaDescription }}
                />
                <div className="mt-4 text-green-600">
                  <FiArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div> */}
        <div className="mt-14 overflow-hidden relative">
          <div className="flex gap-6 animate-scrol">
            {[...serviceList, ...serviceList].map((item, index) => (
      <Link key={index} to={`${item.slug}`} className="shrink-0">
        <div className="w-[280px] h-[200px] bg-white text-black rounded-xl p-6 shadow flex flex-col">
          <img src={item.img} className="w-12 mb-3" alt="" loading="lazy" />
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {item.title}
          </h3>

          <div
            className="tiptap-render line-clamp-3 prose max-w-none text-sm flex-1 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: item.metaDescription }}
          />

          <div className="mt-4 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
            ))}
          </div>
        </div>
          
        </div>
        <div className="bg-black text-white pt-20 pb-40">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT TEXT */}
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
                    recycler networks.{" "}
                  </li>
                  <li>
                    Highest traceability with end-to-end documentation and
                    certified proof of recycling.
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full md:absolute md:-top-36 md:right-10 md:w-2xl order-1 md:order-2">
              <img
                src={"https://eprcomply.s3.ap-south-1.amazonaws.com/48a38340-6b83-4900-a876-571c2a35c1f0.webp"}
                className="rounded-xl shadow-xl w-full h-[390px] object-cover z-10"
                alt="service illustration"
              />
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <BlogsCarousel />
      </Suspense>

      <Suspense fallback={null}>
        <ReviewSection />
      </Suspense>
    </>
  );
};

export default HomePage;
