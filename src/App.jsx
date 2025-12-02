import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./home/HomePage";
import Layout from "./Layout";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/login/Login";
import Category from "./admin/category/Category";
import Service from "./services/Service";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="service" element={<Service />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/:userId/admin" element={<AdminLayout />}>
          <Route path="category" element={<Category />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
