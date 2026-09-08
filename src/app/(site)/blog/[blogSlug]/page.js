import { notFound } from "next/navigation";
import Link from "next/link";

import EnquiryForm from "@/components/site/EnquiryForm";
import { getBlogBySlug, getBlogList } from "@/lib/server-api";
import { stripHtml, toIsoDate } from "@/lib/format";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const blogs = await getBlogList();
  return blogs
    .filter((blog) => blog?.slug)
    .map((blog) => ({ blogSlug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const { blogSlug } = await params;
  const blog = await getBlogBySlug(blogSlug);

  if (!blog) {
    return {
      title: `${SITE_NAME} Blog`,
      robots: { index: false, follow: false },
    };
  }

  const title = blog.metaTitle || blog.title || `${SITE_NAME} Blog`;
  const description =
    blog.metaDescription ||
    blog.summary ||
    stripHtml(blog.description, 160) ||
    "Read latest compliance and regulatory insights from EPR Comply";
  const canonical = `/blog/${blogSlug}`;
  const image = blog.ogImage || blog.image || blog.bannerImage;
  const keywords = Array.isArray(blog.metaKeywords)
    ? blog.metaKeywords.join(", ")
    : blog.metaKeyword || blog.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: absoluteUrl(canonical),
      title: blog.ogTitle || title,
      description: blog.ogDescription || description,
      siteName: SITE_NAME,
      publishedTime: toIsoDate(blog.publishedAt || blog.postDate),
      modifiedTime: toIsoDate(blog.modifyDate || blog.postDate),
      authors: [blog.postedByName || SITE_NAME],
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.ogTitle || title,
      description: blog.ogDescription || description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { blogSlug } = await params;

  const [blog, blogList] = await Promise.all([
    getBlogBySlug(blogSlug),
    getBlogList(),
  ]);

  if (!blog) notFound();

  const publishedTime = toIsoDate(blog.publishedAt || blog.postDate);
  const modifiedTime = toIsoDate(blog.modifyDate || blog.postDate);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.metaTitle || blog.title,
    description:
      blog.metaDescription || blog.summary || stripHtml(blog.description, 300),
    url: absoluteUrl(`/blog/${blogSlug}`),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${blogSlug}`),
    },
    ...(blog.image ? { image: [blog.image] } : {}),
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    author: { "@type": "Organization", name: blog.postedByName || SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    ...(blog.categoryName ? { articleSection: blog.categoryName } : {}),
  };

  const relatedBlogs = blogList.filter((item) => item?.slug !== blogSlug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <article className="w-full bg-gray-50 text-gray-900">
        {/* ---------------- TOP BANNER ---------------- */}
        <div
          className="w-full min-h-[160px] flex flex-col justify-center px-6 md:px-8 text-white bg-gray-600"
          style={
            blog?.bannerImage
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${blog.bannerImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
              {blog?.title}
            </h1>

            {blog?.metaDescription && (
              <p className="text-base md:text-lg opacity-90 drop-shadow-md mt-2 max-w-4xl">
                {blog.metaDescription}
              </p>
            )}
          </div>
        </div>

        {/* ---------------- MAIN CONTENT SECTION ---------------- */}
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: IMAGE + BLOG CONTENT */}
            <div className="min-w-0">
              {blog?.image && (
                <div className="w-full h-[260px] sm:h-[360px] lg:h-[450px] overflow-hidden rounded-2xl shadow-md bg-white">
                  {/* Hero media for the article: eager so it can serve as LCP. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.image}
                    alt={blog?.title || "blog visual"}
                    width={1200}
                    height={630}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className="tiptap-render mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-7 max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.description || "" }}
              />
            </div>

            {/* RIGHT COLUMN: ENQUIRY FORM + SIDEBAR */}
            <aside className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 md:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Enquiry Form
                </h2>
                <EnquiryForm />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Latest Blogs
                </h2>

                {relatedBlogs.length > 0 ? (
                  <ul className="space-y-3">
                    {relatedBlogs.map((item) => (
                      <li
                        key={item?.id || item?.slug}
                        className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
                      >
                        <Link
                          href={`/blog/${item.slug}`}
                          prefetch={false}
                          className="block text-sm leading-snug font-medium text-gray-800 hover:text-green-600 transition-colors cursor-pointer"
                        >
                          {item.title}
                        </Link>
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
      </article>
    </>
  );
}
