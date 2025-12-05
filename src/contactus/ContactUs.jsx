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
              <p className="text-gray-700">+91 98765 43210</p>
              <p className="text-gray-700">+91 91234 56789</p>
            </div>

            {/* Card 2 */}
            <div className="bg-green-100 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">📧 Email</h2>
              <p className="text-gray-700">support@yourcompany.com</p>
              <p className="text-gray-700">info@yourcompany.com</p>
            </div>

            {/* Card 3 */}
            <div className="bg-green-100 p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">📍 Offices</h2>
              <p className="text-gray-700 font-medium">Head Office</p>
              <p className="text-gray-500 text-sm">Delhi, India</p>

              <p className="text-gray-700 font-medium mt-3">Branch Office</p>
              <p className="text-gray-500 text-sm">Mumbai, India</p>

              <p className="text-gray-700 font-medium mt-3">International</p>
              <p className="text-gray-500 text-sm">Dubai, UAE</p>
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
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.136761853624!2d77.21672187480117!3d28.627392675651167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37e1bf9731%3A0xdeb6ebadc177a64!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1705730000000`}
              width="100%"
              height="350"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg border"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
