import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getClientServiceTableContentList } from "../toolkit/slices/serviceSlice";

const ServiceTableOfContent = () => {
  const dispatch = useDispatch();
  const { serviceSlug } = useParams();
  const services = useSelector(
    (state) => state.service.clientServiceTableOfContentList
  );

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    dispatch(getClientServiceTableContentList(serviceSlug));
  }, [dispatch, serviceSlug]);

  useEffect(() => {
    if (services?.length > 0) {
      setActiveId(services[0].id);
    }
  }, [services]);

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveId(id);
    }
  };

  return (
    services?.length > 0 && (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:block">
              <div className="bg-green-100 rounded-xl p-8 shadow-sm sticky top-24 h-fit">
                <div className="space-y-4">
                  {services?.length > 0 &&
                    services?.map((item) => (
                      <div
                        key={item?.id}
                        onClick={() => scrollToSection(item?.id)}
                        className={`flex items-center p-3 rounded-lg shadow cursor-pointer transition-all duration-300 
                    ${
                      activeId === item?.id
                        ? "bg-white shadow-md border-l-4 border-green-700 translate-x-1"
                        : "bg-white/90 hover:bg-white"
                    }`}
                      >
                        <ArrowRight
                          className={`text-green-700 mr-3 h-4 w-4 transition-transform ${
                            activeId === item?.id ? "rotate-90" : ""
                          }`}
                        />
                        <p className="font-semibold text-[15px]">
                          {item?.tabName}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-16">
              {services?.length > 0 &&
                services?.map((item) => (
                  <div
                    key={item?.id}
                    id={`section-${item?.id}`}
                    className="scroll-mt-24 pb-10 border-b border-gray-100 last:border-0"
                  >
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                      {item?.title}
                    </h2>
                    <div
                      className="prose max-w-none text-gray-800 leading-relaxed prose-headings:text-green-800 prose-a:text-blue-600"
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default ServiceTableOfContent;
