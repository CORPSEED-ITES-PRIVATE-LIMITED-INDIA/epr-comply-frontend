import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

const ServiceTableOfContent = () => {
  // Dummy service menu + HTML content
  const services = [
    {
      id: 1,
      title: "Architecture & Building",
      content: `
        <h2 class="text-3xl font-bold mb-4">Overview</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Wind turbines are manufactured in a wide range of vertical and horizontal axis.
          The smallest turbines are used for applications such as battery charging for
          auxiliary power for boats or caravans or to power traffic warning signs.
        </p>
        <p class="text-gray-700 leading-relaxed mb-4">
          Larger turbines can be used for making contributions to a domestic power supply
          while selling unused power back to the utility supplier via the electrical grid.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276"
               class="rounded-lg w-full h-64 object-cover shadow" />
          <img src="https://images.unsplash.com/photo-1505739718596-052e80b91c1d"
               class="rounded-lg w-full h-64 object-cover shadow" />
        </div>
      `,
    },
    {
      id: 2,
      title: "Construction Consultants",
      content: `
        <h2 class="text-3xl font-bold mb-4">Construction Consultants</h2>
        <p class="text-gray-700 leading-relaxed">
          We provide consulting services to ensure your construction project runs smoothly,
          with proper planning, cost estimation, and quality control.
        </p>
      `,
    },
    {
      id: 3,
      title: "Construction Management",
      content: `<h2 class="text-3xl font-bold mb-4">Construction Management</h2>
        <p class="text-gray-700">Our team manages your entire construction process efficiently.</p>`,
    },
    {
      id: 4,
      title: "Tiling And Painting",
      content: `<h2 class="text-3xl font-bold mb-4">Tiling And Painting</h2>
        <p class="text-gray-700">We offer premium tiling and painting solutions.</p>`,
    },
    {
      id: 5,
      title: "Planning And Scheduling",
      content: `<h2 class="text-3xl font-bold mb-4">Planning & Scheduling</h2>
        <p class="text-gray-700">We help you schedule and plan your entire workflow.</p>`,
    },
    {
      id: 6,
      title: "Design Build Contracts",
      content: `<h2 class="text-3xl font-bold mb-4">Design Build Contracts</h2>
        <p class="text-gray-700">One-stop solution for designing and building your projects.</p>`,
    },
  ];

  const [active, setActive] = useState(services[0]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT COLUMN */}
          <div className="bg-green-100 rounded-xl p-8 shadow-sm h-fit sticky top-6">
            <h2 className="text-2xl font-semibold mb-6">Services</h2>

            <div className="space-y-4">
              {services.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActive(item)}
                  className={`flex items-center p-4 rounded-lg shadow cursor-pointer transition 
                    ${
                      active.id === item.id
                        ? "bg-white shadow-md"
                        : "bg-white/90 hover:bg-white"
                    }`}
                >
                  <ArrowRight className="text-green-700 text-xl mr-3" />
                  <p className="font-semibold">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - HTML CONTENT */}
          <div className="lg:col-span-2 max-h-screen overflow-auto">
            <div
              className="prose max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: active.content }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTableOfContent;
