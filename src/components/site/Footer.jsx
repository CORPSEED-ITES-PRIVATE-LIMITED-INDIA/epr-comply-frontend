import Link from "next/link";
import { groupServicesByCategory } from "@/lib/nav";

/**
 * Server component: the grouping is pure, so the footer ships zero JS while
 * still emitting every internal link into the initial HTML (which is what
 * gives crawlers a path to each service and blog page).
 */
const Footer = ({ services = [], blogs = [] }) => {
  const servicesByCategory = groupServicesByCategory(services);
  const blogsByCategory = groupServicesByCategory(blogs);

  return (
    <footer className="bg-[#0e0e0e] text-white pt-16 pb-10">
      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Quick Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
          <p className="text-gray-400 mb-4">
            If you have any questions or need help, feel free to contact with
            our team.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">
              <Link href="/aboutus" prefetch={false} className="inline-block py-1">
                About Us
              </Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link href="/contactus" prefetch={false} className="inline-block py-1">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Blogs by category */}
        {Object.values(blogsByCategory).map((category, catIdx) => (
          <div key={category?.categorySlug || catIdx}>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {category?.categoryName}
            </h3>

            <ul className="space-y-2 text-gray-400">
              {category?.services?.slice(0, 5)?.map((blog) => (
                <li key={blog?.id} className="hover:text-white cursor-pointer">
                  <Link
                    href={`/blog/${blog?.slug}`}
                    prefetch={false}
                    className="inline-block py-1"
                  >
                    {blog?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Services by category */}
        {Object.values(servicesByCategory).map((category, catIdx) => (
          <div key={category?.categorySlug || catIdx}>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {category?.categoryName}
            </h3>

            <ul className="space-y-2 text-gray-400">
              {category?.services?.slice(0, 5)?.map((service) => (
                <li
                  key={service?.id}
                  className="hover:text-white cursor-pointer"
                >
                  <Link
                    href={`/service/${service?.slug}`}
                    prefetch={false}
                    className="inline-block py-1"
                  >
                    {service?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 mt-12 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span className="hover:text-white cursor-pointer">
              Terms &amp; Conditions
            </span>
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <a href="/sitemap.xml" className="hover:text-white inline-block py-1">
              Sitemap
            </a>
          </div>

          <div className="text-center">
            &copy; 2025 EPR Comply, All Rights Reserved.{" "}
            <a
              href="https://www.eprcomply.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline hover:text-green-300 cursor-pointer"
            >
              eprcomply.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
