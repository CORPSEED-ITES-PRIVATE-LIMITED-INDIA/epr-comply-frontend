"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { FileSliders, Folder, Grid2x2, List, Star } from "lucide-react";

import logo from "@/assets/logo.png";
import { logoutUser } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/ToastProvider";

const SIDEBAR_MENU = [
  { title: "Dashboard", icon: <Grid2x2 />, path: "dashboard" },
  { title: "Category", icon: <Folder />, path: "category" },
  { title: "Services", icon: <FileSliders />, path: "services" },
  { title: "Blogs", icon: "🧾", path: "blogs" },
  { title: "Rating", icon: <Star />, path: "rating" },
  { title: "Enquiry", icon: <List />, path: "enquiry" },
  { title: "Reviews", icon: <List />, path: "reviews" },
];

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useParams();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const adminBase = `/${userId}/admin`;

  const handleLogout = () => {
    dispatch(logoutUser())
      .then((resp) => {
        if (resp.meta.requestStatus === "fulfilled") {
          showToast({
            title: "Success!",
            description: "User logged out successfully !.",
            status: "success",
          });
          localStorage.clear();
          router.replace("/login");
        } else {
          showToast({
            title: "Error!",
            description: resp.payload || "Logout failed",
            status: "error",
          });
        }
      })
      .catch(() => {
        showToast({
          title: "Something went wrong !.",
          description: "Failed to logout.",
          status: "error",
        });
      });
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ---------- Sidebar ---------- */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col">
        <div>
          <div className="p-5">
            <Image src={logo} alt="logo" className="h-10 w-auto" height={40} />
          </div>

          <nav className="mt-4">
            {SIDEBAR_MENU.map((item) => {
              const href = `${adminBase}/${item.path}`;
              const active = pathname?.startsWith(href);

              return (
                <Link
                  key={item.path}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-5 py-3 font-medium ${
                    active ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-700">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-200">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-red-50 text-red-600 font-medium cursor-pointer"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------- Main Content Area ---------- */}
      <div className="flex-1 flex flex-col">
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
