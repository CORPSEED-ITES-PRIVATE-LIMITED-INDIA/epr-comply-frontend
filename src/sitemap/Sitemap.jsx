import React from "react";

const Sitemap = () => {
  const categories = [
    "START COMPANY",
    "FINANCIAL SERVICES",
    "POLLUTION ADVISORY",
    "LICENSE & CERTIFICATION",
    "CHANGES IN BUSINESS",
    "BUSINESS COMPLIANCE",
  ];

  return (
    <div className="w-full">
      {/* Top Section */}
      <div className="bg-[#ffff0014] py-20 px-6 md:px-25">
        <h1 className="text-3xl font-semibold mb-6">
          <span className="text-green-700">EPR</span>{" "}
          <span className="text-black">Comply</span>
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Find a service"
            className="flex-1 px-4 py-3 border  bg-white border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-100"
          />
          <button className="px-8 py-3 border border-green-600 text-green-700 rounded-md hover:bg-green-700 hover:text-white transition">
            Search
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-10 px-6 md:px-24">
        <div className="flex flex-wrap gap-4">
          {categories.map((item, index) => (
            <button
              key={index}
              className="bg-[#ffff00] text-black font-16px px-4 py-2 rounded-md transition"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;