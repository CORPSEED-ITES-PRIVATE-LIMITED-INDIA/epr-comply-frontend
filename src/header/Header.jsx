import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import { formatMegaMenu } from "../navData";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DROPDOWN_NAV_ITEMS = ["Services", "Blogs"];

const Header = () => {
  const serviceList = useSelector((state) => state.service.clientServiceList);
  const blogList = useSelector((state) => state.blogs.clientBlogList);

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Desktop mega menu
  const [openMenu, setOpenMenu] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Search
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const megaMenuData = formatMegaMenu(serviceList, blogList);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- SEARCH OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  /* ---------------- NAV HOVER ---------------- */
  const handleNavHover = (menu) => {
    if (!DROPDOWN_NAV_ITEMS.includes(menu)) {
      setOpenMenu(null);
      return;
    }

    if (!megaMenuData[menu]) {
      setOpenMenu(null);
      return;
    }

    setOpenMenu(menu);
    setActiveCategoryIndex(0);
  };

  return (
    <>
      <header
        className={`w-full bg-white sticky top-0 z-[10000] ${
          scrolled ? "shadow-md border-b border-gray-200" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* LOGO */}
            <Link to="/">
              <img src={logo} alt="logo" className="h-10" />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-8">
              {DROPDOWN_NAV_ITEMS.map((menu) => (
                <span
                  key={menu}
                  onMouseEnter={() => handleNavHover(menu)}
                  className="cursor-pointer font-semibold hover:text-green-600"
                >
                  {menu}
                </span>
              ))}

              <Link
                to="/aboutus"
                onMouseEnter={() => setOpenMenu(null)}
                className="font-semibold hover:text-green-600"
              >
                About Us
              </Link>

              <Link
                to="/contactus"
                onMouseEnter={() => setOpenMenu(null)}
                className="font-semibold hover:text-green-600"
              >
                Contact Us
              </Link>
            </nav>

            {/* SEARCH */}
            <div className="hidden lg:flex items-center gap-2">
              <FiSearch
                size={20}
                className="cursor-pointer"
                onClick={() => setOpen(!open)}
              />

              <div
                ref={wrapperRef}
                className={`overflow-hidden transition-all duration-300 ${
                  open ? "w-44" : "w-0"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  className={`border rounded-full px-4 py-1 text-sm transition-all duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="lg:hidden text-3xl"
              onClick={() => setDrawerOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* COMMON MEGA DROPDOWN */}
        {openMenu && (
          <div
            className="hidden lg:flex fixed top-[88px] left-1/2 -translate-x-1/2
                       w-[65vw] h-[400px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[9999]"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {/* LEFT */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto py-4">
              {megaMenuData[openMenu]?.categories?.map((cat, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCategoryIndex(idx)}
                  className={`px-4 py-3 cursor-pointer font-medium ${
                    activeCategoryIndex === idx
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat.title}
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="w-2/3 p-6 grid grid-cols-3 gap-4 overflow-y-auto">
              {megaMenuData[openMenu]?.categories[
                activeCategoryIndex
              ]?.items?.map((item, i) => (
                <Link
                  key={i}
                  to={
                    item?.type === "blog"
                      ? `/blog/${item.slug}`
                      : `/${item.slug}`
                  }
                  className="text-gray-700 hover:text-green-600"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
