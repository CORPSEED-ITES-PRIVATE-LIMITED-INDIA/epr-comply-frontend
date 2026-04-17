import React, { useEffect, useState } from "react";
import { data } from "../dummydata.js";
import EnquiryForm from "../components/EnquiryForm";
import PaginationControl from "./PaginationControl.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../toolkit/slices/blogSlice.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ClientBlogs = () => {
  const [currPage, setCurrPage] = useState(0);

  const dispatch = useDispatch();

  const blogsRes = useSelector((state) => state.blogs.blogsList);
  const totalPage = useSelector((state) => state.blogs.totalPage);

  dayjs.extend(customParseFormat);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getBlogs(currPage));
  }, [dispatch, currPage]);

  return (
    <>
      <Helmet>
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content="2026-04-17" />
        <meta property="article:modified_time" content="2026-04-19" />
        <meta property="article:author" content="EPR Comply" />
      </Helmet>
      <div className="min-h-screen w-full">
        <div className="h-full w-[90%] mx-auto py-4">
          <div className="flex flex-col pb-5 border-b border-black/10">
            <h2 className="text-3xl font-semibold mb-2 tracking-tighter">
              Blog Center
            </h2>
            <p>Articles, guides, and strategies - clean UI fast reading</p>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:col-span-2">
              {blogsRes?.map((blog, index) => (
                <Link
                  to={`/blog/${blog?.slug || ""}`}
                  key={blog.id + "-" + index}
                  className="w-[390px] min-h-[430px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg mb-6"
                >
                  <div className="flex h-[210px] w-full items-center justify-center overflow-hidden rounded-lg ">
                    <img
                      src={blog?.image}
                      alt={blog?.title || "Blog image"}
                      className="h-full min-w-full object-contain rounded-md"
                    />
                  </div>

                  <div className="flex h-[calc(100%-210px)] flex-col px-1 pt-4">
                    <h2 className="line-clamp-2 text-xl font-semibold leading-7 text-slate-900 hover:underline tracking-tighter">
                      {blog?.title}
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-slate-500">
                      <span>{blog?.postedByName || "Admin"}</span>
                      <span className="mx-2">|</span>
                      <span>
                        Updated:{" "}
                        {blog?.modifyDate
                          ? dayjs(blog?.modifyDate, "DD-MM-YYYY").format(
                              "DD-MM-YYYY",
                            )
                          : "N/A"}
                      </span>
                    </p>

                    <p className="mt-3 text-[14px] line-clamp-3 text-sm leading-5 text-slate-700">
                      {blog?.summary}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {blog?.categoryName || "Blog"}
                      </span>

                      <p className="text-sm font-semibold text-slate-900 transition-colors hover:text-blue-700">
                        Read →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="md:col-span-2 flex justify-center pt-2">
                <PaginationControl
                  currPage={currPage}
                  totalPage={totalPage}
                  onPageChange={setCurrPage}
                />
              </div>
            </div>
            <div className="h-fit lg:sticky lg:top-24 col-span-1">
              <div className="w-full flex justify-center lg:justify-end mt-6 lg:mt-0 border border-gray-200 rounded-lg">
                <div className="w-full sm:max-w-md bg-white rounded-xl shadow-xl p-3 sm:p-8 relative overflow-hidden">
                  {/* Badge */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow whitespace-normal sm:whitespace-nowrap max-w-full">
                    Limited Time Offer
                  </div>

                  <h2 className="text-center text-sm sm:text-xl font-medium text-gray-800 mb-6 wrap-break-words hyphens-auto pt-2 sm:pt-0">
                    Get Free Expert Consultation
                  </h2>

                  <EnquiryForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientBlogs;
