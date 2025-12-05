import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../toolkit/slices/authSlice";
import { useToast } from "../components/ToastProvider";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const sidebarMenu = [
    { title: "Dashboard", icon: "📊", path: "dashboard" },
    { title: "Category", icon: "👤", path: "category" },
    { title: "Blogs", icon: "🧾", path: "blogs" },
    { title: "Settings", icon: "⚙️", path: "setting" },
  ];

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
          navigate(`/login`);
          window.location.reload()
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
      {/* ---------- Sidebar (Desktop Only) ---------- */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col">
        {/* Top Section */}
        <div>
          <div className="p-5">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>

          <nav className="mt-4">
            {sidebarMenu.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-200"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-gray-700">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="mt-auto border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-red-50 text-red-600 font-medium cursor-pointer"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ---------- Main Content Area ---------- */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold">{headings[lastSegment]}</h2>

          <div className="flex items-center gap-4">
            <span className="font-medium">Avnish</span>
          </div>
        </header> */}

        {/* Page Body */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
