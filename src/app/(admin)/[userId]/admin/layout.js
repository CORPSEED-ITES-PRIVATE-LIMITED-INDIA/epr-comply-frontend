import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

export const metadata = {
  title: "Admin | EPR Comply",
  robots: { index: false, follow: false },
};

export default function AdminSectionLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
