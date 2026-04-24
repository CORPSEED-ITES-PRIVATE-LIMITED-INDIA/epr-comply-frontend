import { Link } from "react-router-dom";
import Header from "../header/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="h-full bg-white flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center p-8 md:p-12 mt-4 md:mt-6  lg:mt-10">
          <div className="mx-auto   mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-400/40 text-green-600 text-3xl font-bold">
            !
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-black">
            4<span className="text-green-600">0</span>4
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-black">Page Not Found</h2>

          <p className="mt-3 text-gray-600">
            The page you are looking for does not exist or may have been moved.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/"
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Go Home
            </Link>

            <Link
              to="/contactus"
              className="rounded-full border border-green-500 px-6 py-3 text-sm font-semibold text-black hover:border-green-600 hover:text-green-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
