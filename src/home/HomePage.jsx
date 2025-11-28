import React, { useState } from "react";
import img1 from "../assets/nature1.jfif";
import img2 from "../assets/nature2.webp";
import img3 from "../assets/nature3.jpg";
import wind from "../assets/wind.jfif";

const images = [img1, img2, img3];

const HomePage = () => {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${images[index]})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* LEFT CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-center pl-8 md:pl-20 text-white max-w-3xl">
          <p className="text-sm md:text-base font-semibold tracking-wide mb-4">
            Complete Commercial, Residential & Industrial Solar Systems
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            We Invest In The <br /> Future Of Planet!
          </h1>

          <p className="text-base md:text-lg max-w-xl mb-6">
            As a worldwide distributor of solar supplies, we endeavor to provide
            fast and knowledgeable service. We can get you materials by sea or
            air.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              More About Us
            </button>

            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              More About Us!
            </button>
          </div>
        </div>

        {/* Prev Arrow (hidden on mobile) */}
        <button
          onClick={prevImage}
          className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white text-4xl font-thin hover:opacity-80 cursor-pointer"
        >
          ❮
        </button>

        {/* Next Arrow (hidden on mobile) */}
        <button
          onClick={nextImage}
          className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-20 text-white text-4xl font-thin hover:opacity-80 cursor-pointer"
        >
          ❯
        </button>

        {/* DOTS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 
          ${
            index === i ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
          }`}
            ></button>
          ))}
        </div>
      </section>

      {/* ➤ About / Energy Section */}
      <section className="w-full py-20 bg-white px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {/* TOP TEXT */}
          <div className="w-full flex flex-col items-center text-center px-4">
            <p className="text-green-600 font-semibold mb-3">
              Leading The Way In Building And Civil Construction
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
              We Are Ready For Solar Energy,
              <br />
              All We Need Is To Use It Well!
            </h2>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* LEFT SIDE – STATS + IMAGE */}
            <div className="flex flex-col lg:flex-row justify-between gap-12 w-full">
              {/* STATS */}
              <div className="flex flex-col gap-12 lg:py-10 shrink-0">
                <div>
                  <h3 className="text-5xl md:text-6xl text-green-600 font-bold">
                    6,154
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Projects Completed In Last 5 Years
                  </p>
                </div>

                <div>
                  <h3 className="text-5xl md:text-6xl text-green-600 font-bold">
                    2,512
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Qualified Employees & Workers With Us
                  </p>
                </div>

                <div>
                  <h3 className="text-5xl md:text-6xl text-green-600 font-bold">
                    241
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Awards Milestones Awarded To Us
                  </p>
                </div>
              </div>

              {/* IMAGE CONTAINER */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={wind}
                    alt="Wind Energy"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Play Button */}
                <button
                  className="absolute top-4 left-4 bg-white/80 backdrop-blur-md 
              rounded-full w-16 h-16 flex items-center justify-center shadow-lg 
              hover:scale-105 transition"
                >
                  <span className="text-green-600 text-3xl">▶</span>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE – TEXT BLOCK */}
            <div className="w-full">
              {/* Icon */}
              <div className="bg-green-100 text-green-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <span className="text-5xl">🌿</span>
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed text-lg">
                We drive the transition to more sustainable, reliable, and
                affordable energy systems. With our innovative technologies, we
                energize society — that’s our aim!
              </p>

              <p className="text-gray-500 mt-4 leading-relaxed">
                The increase in extreme weather events and rising sea levels are
                unmistakable signs of climate change. Roughly 850 million people
                still live without access to electricity, which is the
                foundation of sustainable development. How can we meet the
                growing demand for electricity while protecting our climate and
                make planet a better place?
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
