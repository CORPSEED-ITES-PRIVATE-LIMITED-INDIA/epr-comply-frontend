import React from "react";
import { BsShieldCheck, BsWhatsapp } from "react-icons/bs";

const Service = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* LEFT SECTION */}
        <div className="w-full">
          <h1 className="text-xl sm:text-4xl font-bold text-[#0a2c1f] leading-snug break-words">
            Udyam (MSME) Registration <br className="hidden sm:block" /> Online in India
          </h1>

          <p className="text-gray-600 mt-4 text-sm sm:text-lg break-words hyphens-auto">
            Register your Micro, Small & Medium Enterprise (MSME) easily to
            avail of government benefits and subsidies.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "Udyam Registration Support",
              "Loan & Subsidy Application Help",
              "Expert Registration Assistance",
              "Fast Online MSME Registration",
              "Trusted by 20,000+ Startups",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 sm:gap-3 break-words hyphens-auto"
              >
                <span className="text-green-600 text-xl flex-shrink-0 mt-0.5">✔</span>
                <span className="text-gray-700 text-xs sm:text-base break-words hyphens-auto">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full flex justify-center lg:justify-end mt-6 lg:mt-0">
          <div className="w-full sm:max-w-md bg-white rounded-xl shadow-xl p-3 sm:p-8 relative overflow-hidden">
            {/* Badge */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow whitespace-normal sm:whitespace-nowrap max-w-full">
              Limited Time Offer
            </div>

            <h2 className="text-center text-lg sm:text-2xl font-semibold text-gray-900 mb-6 break-words hyphens-auto pt-2 sm:pt-0">
              Get Free Expert Consultation
            </h2>

            {/* Form */}
            <form className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />

              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />

              <select className="w-full px-3 py-2.5 border rounded-lg text-gray-600 focus:ring-2 focus:ring-green-500 text-sm sm:text-base appearance-none">
                <option>Select State</option>
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
              </select>

              {/* WhatsApp */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm pt-1 sm:pt-2">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <span className="text-gray-700 break-words hyphens-auto min-w-0 flex-1">Get Update on</span>
                  <BsWhatsapp 
                    color="green" 
                    className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" 
                  />
                  <span className="font-medium break-words hyphens-auto min-w-0 flex-1">WhatsApp</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-0 sm:ml-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-8 h-4 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transform peer-checked:translate-x-3.5 transition-all duration-300"></div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 mt-3 sm:mt-4 rounded-lg transition text-sm sm:text-base"
              >
                GET STARTED NOW
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM BADGES */}
      <div className="w-full flex justify-center mt-10">
        <div className="w-full max-w-full bg-white shadow-md rounded-full px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
          {[
            {
              text: "What Sets Us Apart",
              icon: <BsShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-700 flex-shrink-0" />,
            },
            { text: "500+ MCA Experts" },
            { text: "10,000+ Reviews" },
            { text: "2500+ Monthly Clients" },
            { text: "Serving India Nationwide" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 sm:gap-2 flex-shrink-0 px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
            >
              {item.icon && item.icon}
              <span className="font-semibold text-green-500 break-words hyphens-auto">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;