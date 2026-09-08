import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import NavigationLoader from "@/components/site/NavigationLoader";
import RouteTransition from "@/components/site/RouteTransition";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { getBlogList, getServiceList } from "@/lib/server-api";

/**
 * Public site shell.
 *
 * The nav/footer data is fetched here once, on the server, and cached by the
 * Next data cache. Pages below therefore render with a fully populated header
 * and footer in the very first byte of HTML - no client fetch, no layout shift.
 */
export default async function SiteLayout({ children }) {
  const [services, blogs] = await Promise.all([
    getServiceList(),
    getBlogList(),
  ]);

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Header services={services} blogs={blogs} />

        <main className="flex flex-1 flex-col">
          <RouteTransition>{children}</RouteTransition>
        </main>

        <Footer services={services} blogs={blogs} />
      </div>

      <NavigationLoader />
    </ToastProvider>
  );
}
