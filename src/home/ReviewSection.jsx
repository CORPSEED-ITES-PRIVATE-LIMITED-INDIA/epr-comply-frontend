import React, { use, useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";


const ReviewSection = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.setting.reviewList);



  return (
    <section className="max-w-7xl mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {reviews?.length > 0 && reviews?.slice(0, 5)?.map((review, i) => (
          <div key={i} className="space-y-6">
            {/* Icon & rating */}
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-500 p-5 rounded-full shadow-md">
                <FaQuoteLeft size={26} />
              </div>

              <div className="flex items-center gap-1 text-green-500">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-green-600">
              {review.serviceTitle}
            </h3>

            {/* Text */}
            <div
              className="tiptap-render text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: review.reviewMessage }}
            ></div>

            {/* Profile */}
            <div className="flex items-center gap-4">
              <img
                src={review.customerPhoto}
                alt="user"
                className="w-14 h-14 rounded-full"
                loading="lazy"
                decoding="async"
                width="56"
                height="56"
              />
              <div>
                <h4 className="text-lg font-semibold">{review.customerName}</h4>
                <p className="text-sm text-gray-500">{review.customerDesignation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
