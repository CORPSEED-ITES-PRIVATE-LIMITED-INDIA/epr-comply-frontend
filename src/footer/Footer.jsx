import React from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { groupServicesByCategory } from "../navData";

const Footer = () => {
  const serviceList = useSelector((state) => state.service.clientServiceList);
  const [servicesByCategory, setServicesByCategory] = React.useState({});

  React.useEffect(() => {
    const groupedServices = groupServicesByCategory(serviceList);
    setServicesByCategory(groupedServices);
  }, [serviceList]);

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

          {/* <div className="flex items-center gap-3 text-green-500 text-xl font-bold mb-4">
            <FaPhoneAlt /> <span>55 654 541 17</span>
          </div>

          <p className="text-gray-400 leading-relaxed">
            2307 Beverley Rd Brooklyn, New York 11226 United States.
          </p>

          <div className="flex items-center gap-2 mt-4 text-white hover:text-green-500 cursor-pointer">
            <FaMapMarkerAlt />
            <span>Get Directions</span>
          </div> */}
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">
              <Link to={"aboutus"}>About Us</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to={"contactus"}>Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        {Object.values(servicesByCategory).map(
          (category, catIdx) => (
            <div key={catIdx}>
              <h3 className="text-lg font-semibold mb-4 text-white">
                {category.categoryName}
              </h3>

              <ul className="space-y-2 text-gray-400">
                {category.services.map((service) => (
                  <li
                    key={service.id}
                    className="hover:text-white cursor-pointer"
                  >
                    <Link to={`${service.slug}`}>{service.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {/* Support */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-white cursor-pointer">Shipping Policy</li>
            <li className="hover:text-white cursor-pointer">Delivery Tips</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
          </ul>
        </div> */}

        {/* Products Catalogue */}
        {/* <div>
          <h3 className="text-lg font-semibold mb-4">Products Catalogue</h3>

          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 mb-6 transition">
            <FaFilePdf /> Download PDF
          </button>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center border border-gray-700 hover:border-green-500 hover:text-green-500 cursor-pointer">
              <FaFacebookF />
            </div>

            <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center border border-gray-700 hover:border-green-500 hover:text-green-500 cursor-pointer">
              <FaInstagram />
            </div>

            <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center border border-gray-700 hover:border-green-500 hover:text-green-500 cursor-pointer">
              <FaTwitter />
            </div>
          </div>
        </div> */}
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 mt-12 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          {/* Left Links */}
          <div className="flex gap-6 mb-4 md:mb-0">
            <span className="hover:text-white cursor-pointer">
              Terms & Conditions
            </span>
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer">Sitemap</span>
          </div>

          {/* Copyright */}
          <div className="text-center">
            © 2025 EPR Comply, All Rights Reserved.
            <a
              href="https://www.eprcomply.com"
              target="_blank"
              className="text-green-500 hover:text-green-400 cursor-pointer"
            >
              eprcomply.com
            </a>
          </div>
        </div>
      </div>

      {/* SCROLL TO TOP BUTTON
      <div className="fixed bottom-6 right-6 bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700">
        ↑
      </div> */}
    </footer>
  );
};

export default Footer;
