import React, { useState } from "react";

const faqs = [
  {
    question: "What services do you provide?",
    answer:
      "We provide end-to-end digital services including web development, mobile apps, SEO, and digital marketing.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Project timelines depend on requirements. Typically, small projects take 2–4 weeks, while larger ones may take longer.",
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      "Yes, we offer maintenance and support packages after project delivery.",
  },
  {
    question: "How can I get a quotation?",
    answer:
      "You can contact us via the contact form or directly email us with your requirements.",
  },
];

const ServiceFAQS = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-gray-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* HEADING */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Find answers to common questions about our services
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                {/* QUESTION */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-5 py-4
                             text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`ml-4 text-xl font-bold transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-green-600" : "text-gray-400"
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* ANSWER */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 sm:max-h-32" : "max-h-0"
                  }`}
                >
                  <div className="px-5 pb-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQS;
