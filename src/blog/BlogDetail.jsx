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

        {/* ---------------- MAIN BLOG GRID ---------------- */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* LEFT SIDE: IMAGE + BLOG CONTENT */}
            <main className="space-y-8">
              {/* Blog Image */}
              <div className="w-full aspect-[730/380] overflow-hidden rounded-2xl shadow-md bg-white">
                <img
                  src={blog?.image}
                  alt={blog?.title || "blog visual"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Blog Content */}
              <div
                className="tiptap-render"
                dangerouslySetInnerHTML={{ __html: blog?.description }}
              />
            </main>

            {/* RIGHT SIDE: ENQUIRY FORM + LATEST BLOGS */}
            <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
              {/* Enquiry Form */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
                <EnquiryForm />
              </div>

              {/* Latest Blogs */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Latest Blogs
                </h3>

                <ul className="space-y-3">
                  {blogList?.map((item, index) => (
                    <li key={index}>
                      <a
                        href={`/blog/${item.slug}`}
                        className="block text-sm leading-snug font-medium text-gray-800 hover:text-green-600 transition-colors cursor-pointer"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
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
