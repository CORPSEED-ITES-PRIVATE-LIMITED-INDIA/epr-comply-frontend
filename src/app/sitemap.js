import { getBlogList, getServiceList } from "@/lib/server-api";
import { parseApiDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const lastModified = (value) => {
  const time = parseApiDate(value);
  return time ? new Date(time) : new Date();
};

export default async function sitemap() {
  const [services, blogs] = await Promise.all([
    getServiceList(),
    getBlogList(),
  ]);

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/aboutus`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contactus`, changeFrequency: "yearly", priority: 0.5 },
  ].map((route) => ({ ...route, lastModified: new Date() }));

  const serviceRoutes = services
    .filter((service) => service?.slug)
    .map((service) => ({
      url: `${SITE_URL}/service/${service.slug}`,
      lastModified: lastModified(service.postDate),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  const blogRoutes = blogs
    .filter((blog) => blog?.slug)
    .map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: lastModified(blog.modifyDate || blog.postDate),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
