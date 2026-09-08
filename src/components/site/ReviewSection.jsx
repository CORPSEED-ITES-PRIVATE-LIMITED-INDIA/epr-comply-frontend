import { FaQuoteLeft, FaStar } from "react-icons/fa";

/**
 * Server component: reviews are fetched during render, so the testimonials are
 * part of the indexed HTML instead of appearing after a client round-trip.
 */
const ReviewSection = ({ reviews = [] }) => {
  if (reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-8 defer-render defer-render-reviews">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {reviews.slice(0, 5).map((review, i) => (
          <div key={review?.id ?? i} className="space-y-6">
            {/* Icon & rating */}
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-500 p-5 rounded-full shadow-md">
                <FaQuoteLeft size={26} />
              </div>

              <div className="flex items-center gap-1 text-green-500">
                {Array.from({ length: Number(review?.rating) || 0 }).map(
                  (_, starIndex) => (
                    <FaStar key={starIndex} />
                  ),
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-green-600">
              {review.serviceTitle}
            </h3>

            {/* Text */}
            <div
              className="tiptap-render text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: review.reviewMessage || "" }}
            />

            {/* Profile */}
            <div className="flex items-center gap-4">
              {review?.customerPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.customerPhoto}
                  alt={review?.customerName || "Reviewer"}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : null}

              <div>
                <h4 className="text-lg font-semibold">{review.customerName}</h4>
                <p className="text-sm text-gray-500">
                  {review.customerDesignation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;
