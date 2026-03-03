import React, { useEffect, useState, useRef, useMemo } from "react";
import logo from "../assets/logo1.webp";
import { formatMegaMenu } from "../navData";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../toolkit/slices/settingSlice";
import { getClientMegaMenu } from "../toolkit/slices/serviceSlice";

const DROPDOWN_NAV_ITEMS = ["Services", "Blogs"];

const Header = () => {
  const dispatch = useDispatch();

  // lists
  const serviceList = useSelector((state) => state.service.clientServiceList);
  const blogList = useSelector((state) => state.blogs.clientBlogList);

  // (kept, in case you still need it elsewhere)
  const megaMenu = useSelector((state) => state.service.clientMegaMenu);

  // header ui
  const [scrolled, setScrolled] = useState(false);

  // mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // desktop mega menu
  const [openMenu, setOpenMenu] = useState(null); // "Services" | "Blogs" | null
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // desktop search (pill)
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [results, setResults] = useState({ blogs: [], services: [] });

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // ✅ ORDERED mega data for BOTH services + blogs
  const megaMenuData = useMemo(() => {
    // IMPORTANT: formatMegaMenu should already apply ordering inside
    // (categories + items) for BOTH lists
    return formatMegaMenu(serviceList, blogList);
  }, [serviceList, blogList]);

  // ✅ active categories based on openMenu ("Services" OR "Blogs")
  const activeCategories = useMemo(() => {
    if (!openMenu) return [];
    return megaMenuData?.[openMenu]?.categories || [];
  }, [megaMenuData, openMenu]);

  // reset active category when switching menu
  useEffect(() => {
    if (openMenu) setActiveCategoryIndex(0);
  }, [openMenu]);

  // sticky header border on scroll
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fetch mega menu (kept as-is)
  useEffect(() => {
    dispatch(getClientMegaMenu());
  }, [dispatch]);

  // close search pill when clicking outside wrapperRef (kept)
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

  // ✅ open desktop mega menu only if data exists for that tab
  const handleNavHover = (menu) => {
    if (!DROPDOWN_NAV_ITEMS.includes(menu)) {
      setOpenMenu(null);
      return;
    }

    const hasData = (megaMenuData?.[menu]?.categories || []).length > 0;
    if (!hasData) {
      setOpenMenu(null);
      return;
    }

    setOpenMenu(menu);
  };

  // global search api (kept)
  useEffect(() => {
    if (!query) return;

    const timer = setTimeout(async () => {
      const res = await dispatch(globalSearch(query)).unwrap();
      setResults({
        blogs: res?.blogs || [],
        services: res?.services || [],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  // close dropdown on click outside ".mega-search" (kept)
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

  // ✅ Mobile ordering (use the same ordered megaMenuData)
  const mobileServicesCategories = useMemo(() => {
    return megaMenuData?.Services?.categories || [];
  }, [megaMenuData]);

  const mobileBlogsCategories = useMemo(() => {
    return megaMenuData?.Blogs?.categories || [];
  }, [megaMenuData]);

  return (
    <>
      <header
        className={`w-full bg-white sticky top-0 z-[10000] transition-all duration-200 ${
          scrolled ? "border-b border-gray-200" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/">
              <img src={logo} alt="logo" className="h-10" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-4">
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

            {/* Desktop search */}
            <div className="hidden lg:flex items-center relative mega-search">
              <div
                ref={wrapperRef}
                // className={`flex items-center border border-gray-200 rounded-full px-3 py-1 transition-all duration-300 ${
                //   open ? "max-w-[180px]" : "max-w-[36px]"
                // }`}

                     className={`flex items-center border border-gray-200 rounded-full px-3 py-1 transition-all duration-300 max-w-[180px]`}
              >
                <FiSearch
                  size={18}
                  className="cursor-pointer shrink-0 text-gray-400"
                  onClick={() => setOpen(true)}
                />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  // className={`ml-2 bg-transparent outline-none text-sm transition-all duration-300 ${
                  //   open ? "w-full opacity-100" : "w-0 opacity-0"
                  // }`}
                     className={`ml-2 bg-transparent outline-none text-sm transition-all duration-300 w-full opacity-100
`}
                  value={query}
                  onChange={(e) => {
                    const v = e.target.value;
                    setQuery(v);
                    setShowDropdown(v.length > 0);
                  }}
                />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-3xl cursor-pointer"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* ✅ Desktop Mega Menu (NOW depends on openMenu: Services OR Blogs) */}
        {openMenu && (
          <div
            className="hidden lg:flex fixed top-[88px] left-1/2 -translate-x-1/2 w-[75vw] h-[400px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[9999]"
            onMouseEnter={() => setOpenMenu(openMenu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {/* LEFT - CATEGORIES */}
            <div className="w-1/4 border-r border-gray-200 overflow-y-auto py-4">
              {activeCategories.map((cat, idx) => (
                <div
                  key={cat.title + idx}
                  onMouseEnter={() => setActiveCategoryIndex(idx)}
                  className={`px-4 py-3 cursor-pointer font-medium ${
                    activeCategoryIndex === idx
                      ? "bg-[#006400] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat.title}
                </div>
              ))}
            </div>

            {/* RIGHT - ITEMS */}
            <div className="w-3/4 grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-7 p-3 content-start overflow-y-auto">
              {(activeCategories[activeCategoryIndex]?.items || []).map((x) => (
                <Link
                  key={x.id}
                  to={x.type === "blog" ? `/blog/${x.slug}` : `/${x.slug}`}
                  className="text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100 p-3 rounded-md cursor-pointer"
                >
                  {x.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search dropdown results (kept exactly like yours) */}
      {showDropdown && (
        <div className="fixed top-[72px] left-0 w-screen bg-white shadow-lg z-50 mega-search">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Blogs
              </h3>

              {results.blogs.length === 0 ? (
                <p className="text-sm text-gray-400">No blogs found</p>
              ) : (
                <ul className="space-y-2 max-h-[60vh] overflow-auto">
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

            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Services
              </h3>

              {results.services.length === 0 ? (
                <p className="text-sm text-gray-400">No services found</p>
              ) : (
                <ul className="space-y-2 max-h-[60vh] overflow-auto">
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

      {/* ✅ Mobile drawer (safe + DOES NOT disturb your UI)
          - Uses ordered megaMenuData for both Services and Blogs
          - If you already have your own drawer UI elsewhere, replace this block
            with your existing drawer, and only use the computed
            mobileServicesCategories/mobileBlogsCategories. */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[10001]">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* panel */}
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="font-semibold">Menu</div>
              <button
                className="text-2xl cursor-pointer"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-4 space-y-6">
              {/* Services */}
              <div>
                <div className="text-sm font-semibold text-gray-800 mb-2">
                  Services
                </div>

                {mobileServicesCategories.length === 0 ? (
                  <div className="text-sm text-gray-400">No services</div>
                ) : (
                  <div className="space-y-4">
                    {mobileServicesCategories.map((cat, idx) => (
                      <div key={cat.title + idx}>
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          {cat.title}
                        </div>
                        <div className="space-y-1">
                          {(cat.items || []).map((x) => (
                            <Link
                              key={x.id}
                              to={`/${x.slug}`}
                              onClick={() => setDrawerOpen(false)}
                              className="block text-sm text-gray-700 hover:text-green-600 px-2 py-1 rounded cursor-pointer"
                            >
                              {x.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Blogs */}
              <div>
                <div className="text-sm font-semibold text-gray-800 mb-2">
                  Blogs
                </div>

                {mobileBlogsCategories.length === 0 ? (
                  <div className="text-sm text-gray-400">No blogs</div>
                ) : (
                  <div className="space-y-4">
                    {mobileBlogsCategories.map((cat, idx) => (
                      <div key={cat.title + idx}>
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          {cat.title}
                        </div>
                        <div className="space-y-1">
                          {(cat.items || []).map((x) => (
                            <Link
                              key={x.id}
                              to={`/blogs/${x.slug}`}
                              onClick={() => setDrawerOpen(false)}
                              className="block text-sm text-gray-700 hover:text-green-600 px-2 py-1 rounded cursor-pointer"
                            >
                              {x.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Static links */}
              <div className="space-y-2 pt-2 border-t">
                <Link
                  to="/aboutus"
                  onClick={() => setDrawerOpen(false)}
                  className="block font-semibold hover:text-green-600 cursor-pointer"
                >
                  About Us
                </Link>
                <Link
                  to="/contactus"
                  onClick={() => setDrawerOpen(false)}
                  className="block font-semibold hover:text-green-600 cursor-pointer"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Header);