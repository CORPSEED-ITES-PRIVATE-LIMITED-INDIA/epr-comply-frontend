import Link from "next/link";

import EnquiryForm from "@/components/site/EnquiryForm";
import PaginationControl from "@/components/site/PaginationControl";
import { getBlogPage } from "@/lib/server-api";
import { formatApiDate } from "@/lib/format";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const revalidate = 300;

const PAGE_SIZE = 6;

const readPage = (value) => {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isFinite(page) && page > 1 ? page - 1 : 0;
};

export async function generateMetadata({ searchParams }) {
  const { page } = await searchParams;
  const current = readPage(page);
  const canonical = current === 0 ? "/blog" : `/blog?page=${current + 1}`;

  const title =
    current === 0
      ? "Blog Center | EPR Compliance Articles & Guides | EPR Comply"
      : `Blog Center - Page ${current + 1} | EPR Comply`;

  return {
    title,
    description:
      "Articles, guides and strategies on CPCB EPR registration, plastic, e-waste, battery and tyre waste compliance in India.",
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical),
      title,
      siteName: SITE_NAME,
      description:
        "Articles, guides and strategies on EPR registration and waste-management compliance in India.",
    },
  };
}

export default async function BlogListPage({ searchParams }) {
  const { page } = await searchParams;
  const requested = readPage(page);

  const { content, currPage, totalPage } = await getBlogPage(
    requested,
    PAGE_SIZE,
  );

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: content.map((blog, index) => ({
      "@type": "ListItem",
      position: currPage * PAGE_SIZE + index + 1,
      url: absoluteUrl(`/blog/${blog.slug}`),
      name: blog.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      <div className="min-h-screen w-full">
        <div className="h-full w-[90%] mx-auto py-4">
          <div className="flex flex-col pb-5 border-b border-black/10">
            <h1 className="text-3xl font-semibold mb-2 tracking-tighter">
              Blog Center
            </h1>
            <p>Articles, guides, and strategies - clean UI fast reading</p>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:col-span-2">
              {content.map((blog) => (
                <Link
                  href={`/blog/${blog?.slug || ""}`}
                  key={blog.id}
                  prefetch={false}
                  className="w-full max-w-[390px] min-h-[430px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg mb-6"
                >
                  <div className="flex h-[210px] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                    {blog?.image ? (
                      // Editor-uploaded media lives on an arbitrary host.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.image}
                        alt={blog?.title || "Blog image"}
                        width={390}
                        height={210}
                        loading="lazy"
                        decoding="async"
                        className="h-full min-w-full object-contain rounded-md"
                      />
                    ) : null}
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
                        {formatApiDate(blog?.modifyDate || blog?.postDate)}
                      </span>
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-700">
                      {blog?.summary}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {blog?.categoryName || "Blog"}
                      </span>

                      <span className="text-sm font-semibold text-slate-900 transition-colors hover:text-blue-700">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              <div className="md:col-span-2 flex justify-center pt-2">
                <PaginationControl
                  basePath="/blog"
                  currPage={currPage}
                  totalPage={totalPage}
                />
              </div>
            </div>

            <div className="h-fit lg:sticky lg:top-24 col-span-1">
              <div className="w-full flex justify-center lg:justify-end mt-6 lg:mt-0 border border-gray-200 rounded-lg">
                <div className="w-full sm:max-w-md bg-white rounded-xl shadow-xl p-3 sm:p-8 relative overflow-hidden">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-green-700 text-white px-2 py-1 rounded-md text-xs font-semibold shadow whitespace-normal sm:whitespace-nowrap max-w-full">
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
}
