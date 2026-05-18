import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientBlogDetailBySlug } from "../toolkit/slices/blogSlice";
import { useParams } from "react-router-dom";
import BlogFAQS from "./BlogFAQS";
import EnquiryForm from "../components/EnquiryForm";
import { Helmet } from "react-helmet-async";

const BlogDetail = () => {
  const { blogSlug } = useParams();
  const dispatch = useDispatch();

  const blog = useSelector((state) => state.blogs.clientBlogDetail);
  const blogList = useSelector((state) => state.blogs.clientBlogList);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getClientBlogDetailBySlug(blogSlug));
  }, [dispatch, blogSlug]);

  return (
    <>
      <Helmet>
        <title>{blog?.metaTitle || blog?.title || "EPR Comply Blog"}</title>

        <meta
          name="description"
          content={
            blog?.metaDescription ||
            blog?.shortDescription ||
            "Read latest compliance and regulatory insights from EPR Comply"
          }
        />

        {blog?.metaKeywords && (
          <meta
            name="keywords"
            content={
              Array.isArray(blog.metaKeywords)
                ? blog.metaKeywords.join(", ")
                : blog.metaKeywords
            }
          />
        )}

        <meta
          property="og:title"
          content={blog?.ogTitle || blog?.metaTitle || blog?.title}
        />

        <meta
          property="og:description"
          content={
            blog?.ogDescription ||
            blog?.metaDescription ||
            blog?.shortDescription
          }
        />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />

        {(blog?.ogImage || blog?.image) && (
          <meta property="og:image" content={blog?.ogImage || blog?.image} />
        )}

        {blog?.publishedAt && (
          <meta property="article:published_time" content={blog.publishedAt} />
        )}
      </Helmet>

      <div className="w-full bg-gray-50 dark:bg-slate-100 text-gray-900 dark:text-black">
        {/* ---------------- TOP BANNER ---------------- */}
        <div
          className="w-full min-h-[160px] flex flex-col justify-center px-6 md:px-8 text-white bg-gray-600"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${blog?.bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
              {blog?.title}
            </h1>

            {blog?.metaDescription && (
              <p className="text-base md:text-lg opacity-90 drop-shadow-md mt-2 max-w-4xl">
                {blog?.metaDescription}
              </p>
            )}
          </div>
        </div>

        {/* ---------------- MAIN CONTENT SECTION ---------------- */}
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-10 items-start">
            {/* ---------------- LEFT COLUMN: IMAGE + BLOG CONTENT ---------------- */}
            <main className="min-w-0">
              {/* Blog Image */}
              {blog?.image && (
                <div className="w-full h-[260px] sm:h-[360px] lg:h-[450px] overflow-hidden rounded-2xl shadow-md bg-white">
                  <img
                    src={blog?.image}
                    alt={blog?.title || "blog visual"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Blog Rich Text */}
              <div
                className="
                  tiptap-render
                  mt-8
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-sm
                  p-5
                  md:p-7
                  max-w-none
                "
                dangerouslySetInnerHTML={{ __html: blog?.description }}
              />
            </main>

            {/* ---------------- RIGHT COLUMN: ENQUIRY FORM + SIDEBAR ---------------- */}
            <aside className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* Enquiry Form */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enquiry Form
                </h3>
                <EnquiryForm />
              </div>

              {/* Latest Blogs */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Latest Blogs
                </h3>

                {blogList?.length > 0 ? (
                  <ul className="space-y-3">
                    {blogList?.map((item, index) => (
                      <li
                        key={item?.id || item?.slug || index}
                        className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
                      >
                        <a
                          href={`/blog/${item.slug}`}
                          className="
                            block
                            text-sm
                            leading-snug
                            font-medium
                            text-gray-800
                            hover:text-green-600
                            transition-colors
                            cursor-pointer
                          "
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No latest blogs found.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* ---------------- FAQ SECTION ---------------- */}
        {/* 
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <BlogFAQS />
        </div> 
        */}
      </div>
    </>
  );
};

export default BlogDetail;
