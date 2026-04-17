import React, { useEffect } from "react";
import Header from "./header/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer/Footer";
import { useDispatch } from "react-redux";
import { getClientServiceList } from "./toolkit/slices/serviceSlice";
import { getClientBlogList } from "./toolkit/slices/blogSlice";
import { Helmet } from "react-helmet-async";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const canonicalUrl = `https://www.eprcomply.com${location.pathname}`;

  useEffect(() => {
    dispatch(getClientServiceList());
    console.log(getClientServiceList);
    dispatch(getClientBlogList());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>
          EPR Comply #1 CPCB EPR Registration & Compliance Solutions
        </title>
        <meta
          name="description"
          content="Get complete CPCB EPR registration and compliance support with EPR Comply. Trusted experts for EPR filing, credits, and end-to-end solutions across India."
        />
        <meta
          name="keywords"
          content="EPR compliance, EPR registration, waste management, plastic epr, india compliance"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="EPR Registration & Compliance Consultant in India | EPR Comply"
        />
        <meta
          property="og:description"
          content="Get fast CPCB EPR registration for Plastic, E-waste, Battery & Tyre waste. Trusted EPR consultants in India."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.eprcomply.com/" />
        <meta
          property="og:image"
          content="https://www.eprcomply.com/og-image.jpg"
        />
        <meta property="og:site_name" content="EPR Comply" />
        <meta property="og:locale" content="en_IN" />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
