import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-white">
      {/* HERO / BANNER */}
      <div className="bg-green-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            About Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We are committed to delivering excellence in engineering,
            construction, project management, and innovative sustainable
            solutions.
          </p>
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
          {/* <p className="text-gray-700 leading-relaxed">
            Our team consists of dedicated engineers, architects, planners, and
            industry specialists who bring innovative ideas and a deep
            understanding of modern infrastructure needs.
          </p> */}
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
            className="rounded-xl shadow-lg w-full object-cover h-80"
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
            We dive deep into the heart of CPCB frameworks, wielding
            cutting-edge tools to orchestrate seamless EPR journeys, from
            electrifying registrations to genius credit strategies and
            transformative waste rebirth. Our vibrant team of visionaries and
            experts doesn't just solve problems; we ignite possibilities,
            forging circular economies where waste becomes wonder. Partner with
            us to unleash your brand's green potential, slash risks, amplify
            impact, and lead the charge toward a vibrant, waste-free India that
            captivates hearts and commands admiration.
          </p>
        </div>
      </div>

      {/* VALUES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Integrity</h3>
            <p className="text-gray-600">
              We uphold the highest standards of honesty, transparency, and
              professionalism in everything we do.
            </p>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-gray-600">
              Our solutions are driven by creativity, research, and modern
              technologies to ensure sustainable progress.
            </p>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Quality</h3>
            <p className="text-gray-600">
              We never compromise on quality and ensure every project reflects
              our standards of excellence.
            </p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Experienced Team</h3>
              <p className="text-gray-600">
                Our experts bring decades of industry experience.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Sustainable Practices
              </h3>
              <p className="text-gray-600">
                We focus on eco-friendly and energy-efficient solutions.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                End-to-End Solutions
              </h3>
              <p className="text-gray-600">
                From planning to construction—we handle everything.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">On-Time Delivery</h3>
              <p className="text-gray-600">
                We value your time and deliver as per committed schedules.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Client-Centric Approach
              </h3>
              <p className="text-gray-600">
                Your satisfaction and goals come first—always.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We ensure unmatched quality in every step of the project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
