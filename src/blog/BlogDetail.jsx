import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientBlogDetailBySlug } from "../toolkit/slices/blogSlice";
import { useParams } from "react-router-dom";
import img from "../assets/service2.jpg";
import BlogFAQS from "./BlogFAQS";
import EnquiryForm from "../components/EnquiryForm";

const BlogDetail = () => {
  const { blogSlug } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) => state.blogs.clientBlogDetail);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getClientBlogDetailBySlug(blogSlug));
  }, [dispatch, blogSlug]);

  return (
    <div className="w-full">
      {/* ---------------- TOP BANNER ---------------- */}
      <div
        className="w-full h-[120px] flex flex-col justify-center px-8 text-white bg-gray-600"
        style={{
          backgroundImage: `url(${blog.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-3xl font-bold drop-shadow-lg">{blog.title}</h1>
        <p className="text-lg opacity-90 drop-shadow-md">
          {blog.metaDescription}
        </p>
      </div>

      {/* ---------------- IMAGE + FORM SECTION ---------------- */}
      <div className="w-full flex flex-row gap-10 px-8 py-10">
        {/* Left Image */}
        <div className="w-[70%]">
          <img
            // src={blog.image}
            src={img}
            className="w-full rounded-xl shadow-lg"
            alt="blog visual"
          />
        </div>

        {/* Right Enquiry Form */}
        <div className="w-[30%] bg-white shadow-md rounded-xl p-6 ">
          <EnquiryForm />
        </div>
      </div>

      {/* ---------------- RICH TEXT HTML CONTENT ---------------- */}
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        ></div>
      </div>

      {/* ---------------- FAQ SECTION ---------------- */}
      <BlogFAQS />
    </div>
  );
};

export default BlogDetail;
