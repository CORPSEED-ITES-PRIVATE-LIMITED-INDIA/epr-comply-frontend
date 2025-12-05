import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import { megaMenu } from "../navData";
import { FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [popoverPos, setPopoverPos] = useState({ left: 0, width: 900 });
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Track nav item DOM nodes
  const navRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => {
        if (prev !== isScrolled) return isScrolled;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavHover = (item) => {
    if (!megaMenu[item]) {
      setOpenMenu(null);
      return;
    }

    const rect = navRefs.current[item]?.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    const dropdownWidth = 900;
    let leftPos = centerX - dropdownWidth / 2;

    // Avoid going outside screen edges
    if (leftPos < 20) leftPos = 20;
    if (leftPos + dropdownWidth > window.innerWidth - 20)
      leftPos = window.innerWidth - dropdownWidth - 20;

    setPopoverPos({
      left: leftPos,
      width: dropdownWidth,
    });

    setOpenMenu(item);
    setActiveCategoryIndex(0);
  };

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <header
        className={`w-full bg-white sticky top-0 z-[10000] ${
          scrolled ? "shadow-md border-b border-gray-200" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="w-full flex items-center justify-between py-4">
            <a href="/" alt="home_page">
              <img src={logo} alt="logo" className="h-10 w-auto" />
            </a>

            <div className="flex items-center justify-end gap-4">
              <nav className="hidden lg:flex items-center gap-8 relative">
                {["Services", "Blogs", "About Us", "Contact Us"].map(
                  (item) => (
                    <div
                      key={item}
                      ref={(el) => (navRefs.current[item] = el)}
                      className="relative"
                      onMouseEnter={() => handleNavHover(item)}
                    >
                      <span className="cursor-pointer font-semibold hover:text-green-600 flex items-center gap-1">
                        {item}
                        {megaMenu[item] && <span className="text-sm">▾</span>}
                      </span>
                    </div>
                  )
                )}

                {openMenu && (
                  <div
                    className="fixed top-20 bg-white shadow-xl rounded-2xl border border-gray-200 h-[400px] flex opacity-0 translate-y-2 transition-all duration-200 ease-out"
                    style={{
                      left: popoverPos.left,
                      width: popoverPos.width,
                      opacity: 1,
                      transform: "translateY(0)",
                    }}
                    onMouseEnter={() => setOpenMenu(openMenu)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    {/* LEFT SIDE TITLES */}
                    <div className="w-1/3 border-r border-gray-200 overflow-y-auto py-4">
                      {megaMenu[openMenu].categories.map((cat, index) => (
                        <div
                          key={index}
                          className={`px-4 py-3 cursor-pointer font-medium ${
                            activeCategoryIndex === index
                              ? "bg-orange-500 text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onMouseEnter={() => setActiveCategoryIndex(index)}
                        >
                          {cat.title}
                        </div>
                      ))}
                    </div>

                    <div className="w-2/3 p-6 overflow-y-auto grid grid-cols-3 gap-4">
                      {megaMenu[openMenu].categories[
                        activeCategoryIndex
                      ].items.map((sub, i) => (
                        <Link
                          to={"service"}
                          key={i}
                          className="text-gray-700 hover:text-green-600"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </nav>

              <button
                className="lg:hidden text-3xl"
                onClick={() => setDrawerOpen(true)}
              >
                ☰
              </button>
            </div>
            <div className="hidden lg:flex items-center">
              <FiSearch
                size={20}
                className="text-gray-700 cursor-pointer"
                onClick={() => setOpen(!open)}
              />

              <div
                ref={wrapperRef}
                className={`overflow-hidden transition-all duration-300 
                ${open ? "w-44" : "w-0"}`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  className={`border border-gray-300 rounded-full px-4 py-1 text-sm outline-none bg-white transition-all duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    width: open ? "100%" : "0px",
                    paddingLeft: open ? "16px" : "0px",
                    paddingRight: open ? "16px" : "0px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`fixed top-0 right-0 h-full w-screen max-w-[320px] bg-white shadow-xl z-[99999] 
  transition-transform duration-300 overflow-y-auto overflow-x-hidden
  ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-bold text-green-600">Menu</h2>

          <button
            className="text-3xl text-gray-700"
            onClick={() => setDrawerOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="px-4 py-4 flex flex-col gap-3">
          {Object.keys(megaMenu).map((menu, i) => (
            <div key={i}>
              {/* PARENT ITEM */}
              <div
                className="flex justify-between items-center py-3 cursor-pointer border-b"
                onClick={() =>
                  setOpenCategory(openCategory === menu ? null : menu)
                }
              >
                <span className="font-medium text-gray-800">{menu}</span>
                <span className="text-green-600 font-bold">
                  {openCategory === menu ? "−" : "+"}
                </span>
              </div>

              {/* COLLAPSIBLE CHILDREN */}
              {openCategory === menu && (
                <div className="pl-4 py-2 flex flex-col gap-4">
                  {megaMenu[menu].categories.map((cat, j) => (
                    <div key={j}>
                      <p className="text-green-600 font-semibold">
                        {cat.title}
                      </p>
                      <ul className="pl-3 mt-1 flex flex-col gap-1">
                        {cat.items.map((item, k) => (
                          <li
                            key={k}
                            className="text-gray-600 hover:text-green-600 cursor-pointer"
                          >
                            <Link to={"service"}>{item}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BACKDROP */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        ></div>
      )}
    </>
  );
};

export default Header;
