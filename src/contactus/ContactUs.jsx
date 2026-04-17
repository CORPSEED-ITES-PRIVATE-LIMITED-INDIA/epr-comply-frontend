import React from "react";

const ContactUs = () => {
  return (
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
            {/* Card 1 */}
            <div className="bg-green-100 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">📞 Call Us</h2>
              <p className="text-gray-700">+91 75586 40644</p>
            </div>

            {/* Card 2 */}
            <div className="bg-green-100 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">📧 Email</h2>
              <p className="text-gray-700">info@eprcomply.com</p>
              {/* <p className="text-gray-700">info@yourcompany.com</p> */}
            </div>

            {/* Card 3 */}
            <div className="bg-green-100 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">📍 Offices</h2>
              <p className="text-gray-700 font-medium">Head Office</p>
              <p className="text-gray-500 text-sm">
                3rd Floor, A-5, Grovy Optiva, Block A, Sector 68, Noida, Basi
                Bahuddin Nagar, Uttar Pradesh - 201316
              </p>

              {/* <p className="text-gray-700 font-medium mt-3">Branch Office</p>
              <p className="text-gray-500 text-sm">Mumbai, India</p>
 
              <p className="text-gray-700 font-medium mt-3">International</p>
              <p className="text-gray-500 text-sm">Dubai, UAE</p> */}
            </div>
          </div>

          {/* RIGHT SIDE - ENQUIRY FORM */}
          <div className="lg:col-span-2 bg-green-50 p-10 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">
              📝 Enquiry Form
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <input
                type="text"
                placeholder="Subject"
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="md:col-span-2 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              ></textarea>

              <button
                type="submit"
                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* GOOGLE MAP */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            📍 Find Us on Map
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://maps.google.com/maps?q=Grovy%20Optiva&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
