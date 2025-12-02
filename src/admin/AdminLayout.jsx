import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {

    const sidebarMenu = [
  { title: "Dashboard", icon: "📊", path: "/dashboard" },
  { title: "Category", icon: "👤", path: "category" },
  { title: "Orders", icon: "🧾", path: "/orders" },
  { title: "Settings", icon: "⚙️", path: "/settings" }
];



  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ---------- Sidebar (Desktop Only) ---------- */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-md">
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
      </aside>

      {/* ---------- Main Content Area ---------- */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>

          <div className="flex items-center gap-4">
            <span className="font-medium">Avnish</span>
            {/* <img
              src="https://via.placeholder.com/35"
              alt="profile"
              className="w-9 h-9 rounded-full border"
            /> */}
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 overflow-y-auto">
          <Outlet/>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
