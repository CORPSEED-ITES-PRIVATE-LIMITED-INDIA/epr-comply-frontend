import React, { useEffect, useRef, useState } from "react";
import frontImage from "../assets/front_page.jpg";
import img1 from "../assets/nature1.jfif";
import img2 from "../assets/nature2.webp";
import img3 from "../assets/nature3.jpg";
import wind from "../assets/wind.jfif";
import { cards } from "../navData";
// import solarImg from "../assets/service2.jpg";
import solarImg from "../assets/section1.jpg";
import businessImg from "../assets/business.webp";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import bgImg from "../assets/serviceimg.jpg";
import LogoInfiniteScroller from "./LogoInfiniteScroll";
import ReviewSection from "./ReviewSection";
import BlogsCarousel from "./BlogsCarousel";
import google from "../assets/googleIcon.png";
import glassdoor from "../assets/glassdoorIcon.png";
import mouthshut from "../assets/moutshutlogoIcon.png";
import { BsShieldCheck } from "react-icons/bs";
import Rating45 from "../components/Rating45";

const images = [frontImage, img1, img2, img3];

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const rafIdRef = useRef(null);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const speedRef = useRef(1.2);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const step = () => {
    const container = scrollRef.current;
    if (!container) {
      rafIdRef.current = null;
      runningRef.current = false;
      return;
    }

    if (!pausedRef.current && !isDown) {
      container.scrollLeft += speedRef.current;
      const half = container.scrollWidth / 2;
      if (container.scrollLeft >= half) {
        container.scrollLeft -= half;
      }
    }

    rafIdRef.current = requestAnimationFrame(step);
  };

  const startAuto = () => {
    pausedRef.current = false;
    if (!runningRef.current) {
      runningRef.current = true;
      rafIdRef.current = requestAnimationFrame(step);
    }
  };

  const stopAuto = () => {
    pausedRef.current = true;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    runningRef.current = false;
  };

  useEffect(() => {
    startAuto();
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const onMouseDown = (e) => {
    stopAuto();
    setIsDown(true);
    const container = scrollRef.current;
    startXRef.current = e.pageX - container.offsetLeft;
    startScrollRef.current = container.scrollLeft;
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const container = scrollRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = x - startXRef.current;
    container.scrollLeft = startScrollRef.current - walk;
  };

  const onMouseUp = () => {
    setIsDown(false);
    setTimeout(() => {
      if (!pausedRef.current) startAuto();
    }, 30);
  };

  const onMouseLeave = () => {
    if (isDown) {
      setIsDown(false);
      setTimeout(() => {
        if (!pausedRef.current) startAuto();
      }, 30);
    }
  };

  const handleMouseEnter = () => {
    pausedRef.current = true;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      runningRef.current = false;
    }
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
    if (!isDown) startAuto();
  };

  return (
    <>
      <section className="relative w-full py-14 md:py-16 overflow-hidden">
        {/* 🔥 Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
          style={{ backgroundImage: `url(${images[index]})` }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#0A3558]/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center text-white px-5">
          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Revolutionize Sustainability Confidently with Reliable EPR Solutions{" "}
          </h2>

          {/* Sub Text */}
          <p className="text-base md:text-lg text-gray-200 max-w-6xl mx-auto mb-10">
            Revolutionize your approach to EPR with solutions focused on
            compliance, circularity, and cost efficiency. Our end-to-end support
            covers registration, returns filing, credit trading, and waste
            recycling, ensuring regulatory adherence and substantial financial
            savings.
          </p>

          {/* Search Field */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-2xl">
              <input
                type="text"
                placeholder="EPR Registration for Plastic Waste"
                className="flex-1 px-4 py-2 text-gray-800 focus:outline-none"
              />
              <button className="bg-blue-600 px-6 text-white font-semibold hover:bg-blue-700 cursor-pointer">
                Search
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 w-full">
            {[
              "EPR Compliance for Plastic Waste",
              "EPR Registration",
              "EPR Registration for Battery Waste",
              "EPR Registration for Used Tyres",
              "EPR Compliance for Plastic Waste",
              "CPCB EPR Credits",
            ].map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-[12px] hover:bg-white/20 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Ratings Row */}
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            {/* Google Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5">
                <img src={google} className="h-6 mb-1" alt="Google" />
                <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating45 />
                <p className="text-gray-300 text-sm">(1,284)</p>
              </div>
            </div>

            {/* Glassdoor Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5">
                <img src={glassdoor} className="h-6 mb-1" alt="Glassdoor" />
                <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating45 />
                <p className="text-gray-300 text-sm">(1,204)</p>
              </div>
            </div>

            {/* Trustpilot Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5">
                <img src={mouthshut} className="h-6 mb-1" alt="Trustpilot" />
                <p className="text-yellow-400 font-semibold">4.5 Out of 5</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating45 />
                <p className="text-gray-300 text-sm">(1,084)</p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10">
            <div className="bg-white shadow-md rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
              {[
                {
                  text: "What Sets Us Apart",
                  icon: (
                    <BsShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-700 font-bold flex-shrink-0" />
                  ),
                },
                {
                  text: "MCA Experts",
                  icon: (
                    <span className="text-green-700 font-medium">500+ </span>
                  ),
                },
                {
                  text: " Reviews",
                  icon: (
                    <span className="text-green-700 font-medium">10,000+</span>
                  ),
                },
                {
                  text: " Monthly Clients",
                  icon: (
                    <span className="text-green-700 font-medium">2500+ </span>
                  ),
                },
                { text: "Serving India Nationwide" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 px-2 py-1 bg-gray-200 rounded-full text-xs sm:text-sm"
                >
                  {item.icon && item.icon}
                  <span className="font-semibold text-gray-600 break-words hyphens-auto">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LogoInfiniteScroller />
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 items-center">
          <div className="relative">
            <img
              src={solarImg}
              alt="Solar Panels"
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <div className="hidden md:block absolute right-10 -bottom-8 bg-green-600 text-white p-6 rounded-xl max-w-xs shadow-xl">
              <h3 className="text-xl font-semibold mb-2">
                Fostering Growth Of Solar Energy!
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                Benefiting from 20 years experience in the solar material
                procurement sector and PV manufacturing.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-green-600 font-semibold">
              A World Wide Distributor Of Solar Supplies
            </p>

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
                <p className="text-green-400 font-medium mb-3">
                  Making Tomorrow Different Today.
                </p>
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

              {/* <button className="mt-8 w-fit flex items-center gap-2 bg-green-600 px-6 py-3 rounded-md hover:bg-green-700 transition">
                Explore All Features!
                <FiArrowRight />
              </button> */}
            </div>
            <div className="flex justify-end">
              <img src={businessImg} alt="business" className="rounded" />
            </div>
          </div>

          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onMouseLeave={(e) => {
              onMouseLeave(e);
              handleMouseLeave();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseOver={handleMouseEnter}
            className="
              mt-14 flex gap-6 overflow-x-auto 
              cursor-grab active:cursor-grabbing
              select-none py-4 custom-scroll-hide
            "
            style={{ touchAction: "pan-y" }}
          >
            {[...cards, ...cards].map((item, index) => (
              <div
                key={index}
                className="min-w-[280px] bg-white text-black rounded-xl p-6 shadow"
              >
                <img src={item.img} className="w-12 mb-3" alt="" />
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.text}</p>
                <div className="mt-4 text-green-600">
                  <FiArrowRight />
                </div>
              </div>
            ))}
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
                src={bgImg}
                className="rounded-xl shadow-xl w-full h-[390px] object-cover z-10"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <BlogsCarousel />
      <ReviewSection />
    </>
  );
};

export default HomePage;
