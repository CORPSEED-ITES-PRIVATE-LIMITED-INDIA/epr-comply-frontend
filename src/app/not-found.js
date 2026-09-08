import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import NotFoundContent from "@/components/site/NotFoundContent";
import { getBlogList, getServiceList } from "@/lib/server-api";

export const metadata = {
  title: "Page Not Found | EPR Comply",
  robots: { index: false, follow: false },
};

/**
 * Global 404. Rendered with the real site chrome so a visitor who lands on a
 * dead URL still has the full navigation available.
 */
export default async function NotFound() {
  const [services, blogs] = await Promise.all([
    getServiceList(),
    getBlogList(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header services={services} blogs={blogs} />
      <main className="flex flex-1 flex-col justify-center">
        <NotFoundContent />
      </main>
      <Footer services={services} blogs={blogs} />
    </div>
  );
}
