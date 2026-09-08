"use client";

import { useState } from "react";

/**
 * FAQ list. The questions and answers are passed in already-rendered from the
 * server (so they are indexed and visible without JS); this island only owns
 * the open/closed state.
 *
 * Rows animate with a grid-row track rather than a fixed max-height, so a long
 * answer expands fully instead of being clipped.
 */
const FaqAccordion = ({
  faqs = [],
  questionKey = "question",
  answerKey = "answer",
  heading = "Frequently Asked Questions",
  subheading = "Find answers to common questions about our services",
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (faqs.length === 0) return null;

  return (
    <section className="w-full bg-gray-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {heading}
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            {subheading}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq?.id ?? index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex justify-between items-center px-3 py-2 text-left cursor-pointer focus:outline-none"
                >
                  <span className="text-gray-800 font-medium text-sm sm:text-base">
                    {faq[questionKey]}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`ml-4 text-xl font-bold transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-green-600" : "text-gray-400"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-3 pb-2 text-gray-600 text-sm sm:text-base leading-relaxed">
                      <div
                        className="tiptap-render"
                        dangerouslySetInnerHTML={{
                          __html: faq[answerKey] || "",
                        }}
                      />
                    </div>
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

export default FaqAccordion;
