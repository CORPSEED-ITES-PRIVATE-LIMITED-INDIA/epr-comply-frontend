import { ArrowRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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

  // 🔹 API CALL
  useEffect(() => {
    dispatch(getClientServiceTableContentList(serviceSlug));
  }, [dispatch, serviceSlug]);


  // 🔹 SORT BY displayOrder (SAFE)
  const sortedServices = useMemo(() => {
    if (!Array.isArray(services)) return [];

    return [...services].sort((a, b) => {
      const aOrder =
        a.displayOrder === null || a.displayOrder === 0
          ? Number.MAX_SAFE_INTEGER
          : Number(a.displayOrder);

      const bOrder =
        b.displayOrder === null || b.displayOrder === 0
          ? Number.MAX_SAFE_INTEGER
          : Number(b.displayOrder);

      return aOrder - bOrder;
    });
  }, [services]);

  // 🔹 SET FIRST ACTIVE
  useEffect(() => {
    if (sortedServices.length > 0) {
      setActiveId(sortedServices[0].id);
    }
  }, [sortedServices]);

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

  if (!sortedServices.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT SIDE – TABLE OF CONTENT */}
          <div className="lg:block">
            <div className="bg-green-100 rounded-xl p-8 shadow-sm sticky top-24 h-fit">
              <div className="space-y-4">
                {sortedServices.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center p-3 rounded-lg shadow cursor-pointer transition-all duration-300
                      ${
                        activeId === item.id
                          ? "bg-white shadow-md border-l-4 border-green-700 translate-x-1"
                          : "bg-white/90 hover:bg-white"
                      }`}
                  >
                    <ArrowRight
                      className={`text-green-700 mr-3 h-4 w-4 transition-transform ${
                        activeId === item.id ? "rotate-90" : ""
                      }`}
                    />
                    <p className="font-semibold text-[15px]">
                      {item.tabName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – CONTENT */}
          <div className="lg:col-span-2 space-y-0">
            {sortedServices.map((item, index) => (
              <React.Fragment key={item.id}>
                <section
                  id={`section-${item.id}`}
                  className="scroll-mt-24 py-4"
                >
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    {item.title}
                  </h2>

                  <div
                    className="tiptap-render prose max-w-none text-gray-800 leading-relaxed
                      prose-headings:text-green-800
                      prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </section>

                {index !== sortedServices.length - 1 && (
                  <div className="w-full">
                    <div className="h-px w-full bg-gray-200" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceTableOfContent;
