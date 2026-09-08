import "./admin.css";
import AdminProviders from "@/components/admin/AdminProviders";

// Nothing under this group should ever be indexed.
export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminGroupLayout({ children }) {
  return <AdminProviders>{children}</AdminProviders>;
}
