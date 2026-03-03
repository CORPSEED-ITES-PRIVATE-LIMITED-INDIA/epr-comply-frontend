import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "./components/Loader";

const HomePage = lazy(() => import("./home/HomePage"));
const Service = lazy(() => import("./services/Service"));
const BlogDetail = lazy(() => import("./blog/BlogDetail"));
const AboutUs = lazy(() => import("./aboutus/AboutUs"));
const Sitemap = lazy(() => import("./sitemap/Sitemap"));
const ContactUs = lazy(() => import("./contactus/ContactUs"));

const Login = lazy(() => import("./admin/login/Login"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const Dashboard = lazy(() => import("./admin/dashboard/Dashboard"));
const Category = lazy(() => import("./admin/category/Category"));
const SubCategory = lazy(() => import("./admin/subcategory/SubCategory"));
const Services = lazy(() => import("./admin/service/Services"));
const ServiceTableOfContentss = lazy(
  () => import("./admin/service/ServiceTableOfContentss")
);
const ServiceFAQS = lazy(() => import("./admin/service/ServiceFAQS"));
const Blogs = lazy(() => import("./admin/blogs/Blogs"));
const BlogFAQS = lazy(() => import("./admin/blogs/BlogFAQS"));
const Rating = lazy(() => import("./admin/rating/Rating"));
const Enquiry = lazy(() => import("./admin/enquiry/Enquiry"));
const Reviews = lazy(() => import("./admin/reviews/Reviews"));

const App = () => {
  
  return (
    <BrowserRouter>
      <Suspense fallback={""}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/:serviceSlug" element={<Service />} />
            <Route path="/blog/:blogSlug" element={<BlogDetail />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="sitemap" element={<Sitemap />} />
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
