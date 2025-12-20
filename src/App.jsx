import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./home/HomePage";
import Layout from "./Layout";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/login/Login";
import Category from "./admin/category/Category";
import Service from "./services/Service";
import SubCategory from "./admin/subcategory/SubCategory";
import Services from "./admin/service/Services";
import Blogs from "./admin/blogs/Blogs";
import Dashboard from "./admin/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AboutUs from "./aboutus/AboutUs";
import ContactUs from "./contactus/ContactUs";
import Rating from "./admin/rating/Rating";
import BlogDetail from "./blog/BlogDetail";
import Enquiry from "./admin/enquiry/Enquiry";
import ServiceTableOfContentss from "./admin/service/ServiceTableOfContentss";
import ServiceFAQS from "./admin/service/ServiceFAQS";
import BlogFAQS from "./admin/blogs/BlogFAQS";
import Reviews from "./admin/reviews/Reviews";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/:serviceSlug" element={<Service />} />
          <Route path="/blog/:blogSlug" element={<BlogDetail />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<ContactUs />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/:userId/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="category/:categoryId/subcategory"
            element={
              <ProtectedRoute>
                <SubCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/:serviceId/detail"
            element={
              <ProtectedRoute>
                <ServiceTableOfContentss />
              </ProtectedRoute>
            }
          />
          <Route
            path="services/:serviceId/faqs"
            element={
              <ProtectedRoute>
                <ServiceFAQS />
              </ProtectedRoute>
            }
          />
          <Route
            path="blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="blogs/:blogId/blogFaq"
            element={
              <ProtectedRoute>
                <BlogFAQS />
              </ProtectedRoute>
            }
          />
          <Route
            path="rating"
            element={
              <ProtectedRoute>
                <Rating />
              </ProtectedRoute>
            }
          />
          <Route
            path="enquiry"
            element={
              <ProtectedRoute>
                <Enquiry />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
