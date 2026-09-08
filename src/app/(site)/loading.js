import FullPageLoader from "@/components/site/FullPageLoader";

/**
 * Route-level loading state for the public site. The header and footer are
 * already on screen, so this fills everything below the header - the footer
 * ends up below the fold, which reads as a full-page loader.
 */
export default function SiteLoading() {
  return <FullPageLoader height="min-h-[calc(100vh-5.5rem)]" />;
}
