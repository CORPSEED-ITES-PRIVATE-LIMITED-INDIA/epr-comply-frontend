import React, { useEffect } from "react";
import Header from "./header/Header";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import { useDispatch } from "react-redux";
import { getClientServiceList } from "./toolkit/slices/serviceSlice";
import { getClientBlogList } from "./toolkit/slices/blogSlice";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientServiceList());
    console.log(getClientServiceList)
    dispatch(getClientBlogList());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
