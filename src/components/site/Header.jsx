import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo-header.webp";
import { formatMegaMenu } from "@/lib/nav";
import HeaderSearch from "./HeaderSearch";
import MobileMenu from "./MobileMenu";
import ServicesMegaMenu from "./ServicesMegaMenu";

/**
 * Site header.
 *
 * Server component: the bar itself (logo + nav links) is plain HTML, and the
 * three interactive pieces - search, the Services panel and the mobile drawer -
 * are separate client islands. Grouping the mega-menu data happens here too,
 * rather than on every visitor's main thread.
 */
const Header = ({ services = [], blogs = [] }) => {
  const megaMenu = formatMegaMenu(services, blogs);
  const serviceCategories = megaMenu.Services.categories;
  const blogCategories = megaMenu.Blogs.categories;

  return (
    <header className="w-full bg-white sticky border-b border-gray-800/10 top-0 z-[10000]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" prefetch={false} aria-label="EPR Comply home">
            <Image
              src={logo}
              alt="EPR-Logo"
              height={40}
              width={51}
              sizes="51px"
              quality={75}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-4">
            <ServicesMegaMenu categories={serviceCategories} />

            <Link href="/blog" className="font-semibold hover:text-green-600">
              Blogs
            </Link>
            <Link href="/aboutus" className="font-semibold hover:text-green-600">
              About Us
            </Link>
            <Link
              href="/contactus"
              className="font-semibold hover:text-green-600"
            >
              Contact Us
            </Link>
          </nav>

          <HeaderSearch />

          <MobileMenu
            serviceCategories={serviceCategories}
            blogCategories={blogCategories}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
