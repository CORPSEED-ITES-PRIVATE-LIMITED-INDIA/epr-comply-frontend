import FullPageLoader from "@/components/site/FullPageLoader";

/**
 * Shown while a page (and its layout data) is still streaming. Covers the
 * whole viewport because at this point the site shell has not rendered yet.
 */
export default function Loading() {
  return <FullPageLoader label="Loading page" />;
}
