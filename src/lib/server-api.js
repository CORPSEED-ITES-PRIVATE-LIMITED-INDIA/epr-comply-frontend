/**
 * Server-side data access for the public site.
 *
 * Every read goes straight to Spring Boot from the Node process, so the HTML
 * a crawler (or a first-time visitor) receives is already populated - no
 * client-side fetch waterfall. Responses are cached by the Next data cache and
 * revalidated on a timer, which is what keeps navigation instant.
 */

import { parseApiDate } from "./format";

const API_BASE = process.env.BACKEND_URL || "http://localhost:8000";

// How long a cached content response stays fresh, in seconds.
const REVALIDATE = Number(process.env.CONTENT_REVALIDATE_SECONDS || 300);

async function getJson(path, { revalidate = REVALIDATE, tags } = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate, ...(tags ? { tags } : {}) },
    });

    // 204 (and any error status) means "nothing to render" rather than a crash:
    // the public pages are expected to degrade to their empty state.
    if (!res.ok || res.status === 204) return null;

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

const asArray = (value) => (Array.isArray(value) ? value : []);

/* ------------------------------- services ------------------------------- */

export const getServiceList = async () =>
  asArray(await getJson("/client/services", { tags: ["services"] }));

export const getServiceBySlug = (slug) =>
  getJson(`/client/services/${encodeURIComponent(slug)}`, {
    tags: ["services", `service:${slug}`],
  });

export const getServiceSections = async (slug) =>
  asArray(
    await getJson(`/client/services/${encodeURIComponent(slug)}/sections`, {
      tags: [`service:${slug}`],
    }),
  );

export const getServiceFaqs = async (slug) =>
  asArray(
    await getJson(`/client/services/${encodeURIComponent(slug)}/faqs`, {
      tags: [`service:${slug}`],
    }),
  );

/* -------------------------------- blogs --------------------------------- */

export const getBlogList = async () =>
  asArray(await getJson("/client/blogs", { tags: ["blogs"] }));

export const getBlogBySlug = (slug) =>
  getJson(`/client/blogs/${encodeURIComponent(slug)}`, {
    tags: ["blogs", `blog:${slug}`],
  });

export const getBlogFaqs = async (slug) =>
  asArray(
    await getJson(`/client/blogs/${encodeURIComponent(slug)}/faqs`, {
      tags: [`blog:${slug}`],
    }),
  );

/**
 * Page of published blogs for /blog.
 *
 * The Vite build paged through `/api/blogs/getAllBlogs`, which the backend
 * guards behind admin auth (401 for anonymous visitors). The public
 * `/client/blogs` feed carries the same records, so the listing is paged here
 * instead - same page size, same controls, and it works while logged out.
 */
export const getBlogPage = async (page = 0, size = 6) => {
  const all = await getBlogList();

  const sorted = [...all].sort(
    (a, b) => parseApiDate(b?.postDate) - parseApiDate(a?.postDate),
  );

  const totalPage = Math.max(1, Math.ceil(sorted.length / size));
  const currPage = Math.min(Math.max(0, page), totalPage - 1);

  return {
    content: sorted.slice(currPage * size, currPage * size + size),
    currPage,
    totalPage,
    totalElements: sorted.length,
  };
};

/* -------------------------------- reviews -------------------------------- */

export const getReviews = async () =>
  asArray(await getJson("/api/reviews/all", { tags: ["reviews"] }));
