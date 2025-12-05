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
          Our Guiding Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Transparency </h3>
            <p className="text-gray-600 text-justify">
              We operate with unwavering openness, making every EPR step, from
              registration to certified recycling, fully verifiable, fostering
              unbreakable trust and giving you complete peace of mind.
            </p>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-gray-600 text-justify">
              We harness cutting-edge technology and bold ideas to transform
              complex regulations into automated, game-changing pathways that
              accelerate sustainability and simplify your journey.
            </p>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600 text-justify">
              We pursue nothing short of mastery, delivering superior results
              that strengthen compliance, amplify efficiency, and push your
              green impact far beyond expectations.
            </p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            What Sets EPRComply Apart?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Expert Trailblazers{" "}
              </h3>
              <p className="text-gray-600 text-justify">
                Our seasoned navigators decode EPR complexities with decades of
                insight, turning regulatory challenges into strategic advantages
                that keep you confidently ahead.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Eco-Smart Strategists
              </h3>
              <p className="text-gray-600">
                We design regenerative solutions that minimize environmental
                footprints, maximize credits, and ignite zero-waste revolutions
                for lasting planet-positive power.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Full-Cycle Guardians{" "}
              </h3>
              <p className="text-gray-600">
                From initial filing to final certificate, we orchestrate every
                phase seamlessly, freeing you to focus on growth while we weave
                total transformation.{" "}
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">Deadline Masters </h3>
              <p className="text-gray-600">
                Deadlines are our symphony; we deliver filings, reports, and
                results with perfect timing, ensuring penalty-free progress and
                zero stress.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Your Success Champions
              </h3>
              <p className="text-gray-600">
                Your goals lead the way; we craft personalized strategies with
                responsive, adaptive support that celebrates your victories as
                our own.
              </p>
            </div>

            <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">
                Proven Impact Illuminators{" "}
              </h3>
              <p className="text-gray-600">
                We provide audit-ready, traceable outcomes backed by certified
                partners, spotlighting verifiable triumphs that shine as beacons
                of reliability and inspiration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
