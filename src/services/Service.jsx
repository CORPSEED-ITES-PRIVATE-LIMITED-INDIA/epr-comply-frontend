import { BsShieldCheck } from "react-icons/bs";
import { useEffect } from "react";
import ServiceTableOfContent from "./ServiceTableOfContent";
import EnquiryForm from "../components/EnquiryForm";
import { useDispatch, useSelector } from "react-redux";
import { getClientServiceDetailBySlug } from "../toolkit/slices/serviceSlice";
import { useParams } from "react-router-dom";
import ServiceFAQS from "./ServiceFAQS";

const Service = () => {
  const { serviceSlug } = useParams();
  const dispatch = useDispatch();
  const serviceDetail = useSelector(
    (state) => state.service.clientServiceDetail
  );

  useEffect(() => {
    dispatch(getClientServiceDetailBySlug(serviceSlug));
  }, [dispatch, serviceSlug]);

  return (
    <>
      <section className="bg-gradient-to-br from-[#0E1F3A] via-[#1B3A6B] to-[#0E1F3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* LEFT SECTION */}
            <div className="w-full">
              <h1 className="text-xl sm:text-4xl font-bold text-white leading-snug break-words">
                {serviceDetail?.title}
              </h1>
              <div
                className="text-white mt-4 text-sm sm:text-lg break-words hyphens-auto"
                dangerouslySetInnerHTML={{
                  __html: serviceDetail?.shortDescription,
                }}
              />
            </div>

            {/* RIGHT FORM SECTION */}
            <div className="w-full flex justify-center lg:justify-end mt-6 lg:mt-0">
              <div className="w-full sm:max-w-md bg-white rounded-xl shadow-xl p-3 sm:p-8 relative overflow-hidden">
                {/* Badge */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow whitespace-normal sm:whitespace-nowrap max-w-full">
                  Limited Time Offer
                </div>

                <h2 className="text-center text-lg sm:text-2xl font-semibold text-gray-800 mb-6 break-words hyphens-auto pt-2 sm:pt-0">
                  Get Free Expert Consultation
                </h2>

                <EnquiryForm />
              </div>
            </div>
          </div>

          {/* BOTTOM BADGES */}
          <div className="w-full flex justify-center mt-10">
            <div className="bg-white shadow-md rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-hide">
              {[
                {
                  text: "What Sets Us Apart",
                  icon: (
                    <BsShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-700 flex-shrink-0" />
                  ),
                },
                {
                  text: "MCA Experts",
                  icon: <span className="text-green-700">500+</span>,
                },
                {
                  text: "Reviews",
                  icon: <span className="text-green-700">10,000+</span>,
                },
                {
                  text: "Monthly Clients",
                  icon: <span className="text-green-700">2500+</span>,
                },
                { text: "Serving India Nationwide" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 sm:gap-2 flex-shrink-0 px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
                >
                  {item.icon && item.icon}
                  <span className="font-semibold text-gray-600 break-words hyphens-auto">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div
          dangerouslySetInnerHTML={{ __html: serviceDetail?.fullDescription }}
        />
      </section>
      <ServiceTableOfContent />
      <ServiceFAQS/>
    </>
  );
};

export default Service;
