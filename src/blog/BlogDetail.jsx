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
        {/* Title */}
        <title>{blog?.metaTitle || blog?.title || "EPR Comply Blog"}</title>

        {/* Meta Description */}
        <meta
          name="description"
          content={
            blog?.metaDescription ||
            blog?.shortDescription ||
            "Read latest compliance and regulatory insights from EPR Comply"
          }
        />

        {/* Meta Keywords */}
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

        {/* Open Graph */}
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

        {/* OG Image */}
        {(blog?.ogImage || blog?.image) && (
          <meta property="og:image" content={blog?.ogImage || blog?.image} />
        )}

        {/* Optional: Article meta */}
        {blog?.publishedAt && (
          <meta property="article:published_time" content={blog.publishedAt} />
        )}
      </Helmet>

      <div className="w-full bg-gray-50 dark:bg-gray-50">
        {/* ---------------- TOP BANNER ---------------- */}
        <div
          className="w-full h-[120px] flex flex-col justify-center px-8 text-white bg-gray-600"
          style={{
            backgroundImage: `url(${blog?.bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-3xl font-bold drop-shadow-lg">{blog?.title}</h1>
          <p className="text-lg opacity-90 drop-shadow-md mt-1.5">
            {blog?.metaDescription}
          </p>
        </div>

        {/* ---------------- IMAGE + FORM SECTION ---------------- */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
            {/* Left Image */}
            <div className="h-[450px] overflow-hidden rounded-2xl shadow-md">
              <img
                src={blog?.image}
                alt="blog visual"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Enquiry Form */}
            <div className="bg-white dark:bg-white border border-gray-200 dark:border-gray-200 shadow-sm rounded-2xl p-6">
              <EnquiryForm />
            </div>
          </div>
        </div>

        {/* ---------------- RICH TEXT + LATEST BLOGS ---------------- */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
            {/* LEFT: Blog Content */}
            <div
              className="
              prose max-w-none
                       
                        [&_h2]:text-3xl
                        [&_h2]:font-bold
                        [&_h2]:mt-6
                        [&_h2]:mb-3
                        [&_ul[data-type=taskList]]:list-none
                        [&_li[data-type=taskItem]]:flex
                        [&_li[data-type=taskItem]]:gap-2
                        [&_input[type=checkbox]]:hidden
                        [&_li[data-type=taskItem]::before]:content-['👉']
                        [&_li[data-type=taskItem]::before]:mr-2
                        [&_li[data-type=taskItem]::before]:mb-2
            "
              dangerouslySetInnerHTML={{ __html: blog?.description }}
            />

            {/* RIGHT: Latest Blogs */}
            <aside
              className="
              sticky
              top-28
              h-fit
              rounded-2xl
              border
              border-gray-200
              dark:border-gray-200
              bg-white
              dark:bg-white
              p-6
              shadow-sm
            "
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Latest Blogs
              </h3>

              <ul className="space-y-3">
                {blogList?.map((item, index) => (
                  <li key={index}>
                    <a
                      href={`/blog/${item.slug}`}
                      className="
                      block
                      text-sm
                      leading-snug
                      font-medium
                      text-gray-800
                      dark:text-gray-200
                      hover:text-green-600
                      dark:hover:text-green-400
                      transition-colors
                      cursor-pointer
                    "
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>

        {/* ---------------- FAQ SECTION ---------------- */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <BlogFAQS />
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
