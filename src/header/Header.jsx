import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import { formatMegaMenu } from "../navData";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../toolkit/slices/settingSlice";

const DROPDOWN_NAV_ITEMS = ["Services", "Blogs"];

const Header = () => {
  const dispatch = useDispatch();
  const serviceList = useSelector((state) => state.service.clientServiceList);
  const blogList = useSelector((state) => state.blogs.clientBlogList);

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Desktop mega menu
  const [openMenu, setOpenMenu] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Search
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [results, setResults] = useState({
    blogs: [],
    services: [],
  });
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

  useEffect(() => {
    if (!query) return;

    const timer = setTimeout(async () => {
      // CALL API HERE
      const res = await dispatch(globalSearch(query)).unwrap();

      console.log("Search Results:", res);
      setResults({
        blogs: res.blogs || [],
        services: res.services || [],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".mega-search")) {
        setShowDropdown(false);
        setQuery("");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

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
            <div className="hidden lg:flex items-center relative">
              <div
                className={`flex items-center border border-gray-200 rounded-full px-3 py-1 transition-all duration-300
      ${open ? "max-w-[180px]" : "max-w-[36px]"}
    `}
              >
                <FiSearch
                  size={18}
                  className="cursor-pointer shrink-0 text-gray-400"
                  onClick={() => setOpen(true)}
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className={`ml-2 bg-transparent outline-none text-sm transition-all duration-300
        ${open ? "w-full opacity-100" : "w-0 opacity-0"}
      `}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(e.target.value.length > 0);
                  }}
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

      {showDropdown && (
        <div className="fixed top-[72px] left-0 w-screen bg-white shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-8">
            {/* BLOGS COLUMN */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Blogs
              </h3>

              {results.blogs.length === 0 ? (
                <p className="text-sm text-gray-400">No blogs found</p>
              ) : (
                <ul className="space-y-2">
                  {results.blogs.map((blog) => (
                    <li
                      key={blog.id}
                      className="cursor-pointer text-sm px-2 py-1.5 rounded hover:bg-gray-100"
                    >
                      {blog.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SERVICES COLUMN */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Services
              </h3>

              {results.services.length === 0 ? (
                <p className="text-sm text-gray-400">No services found</p>
              ) : (
                <ul className="space-y-2">
                  {results.services.map((service) => (
                    <li
                      key={service.id}
                      className="cursor-pointer text-sm px-2 py-1.5 rounded hover:bg-gray-100"
                    >
                      {service.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
