import FullPageLoader from "@/components/site/FullPageLoader";

/** Fills the admin content area (the sidebar stays put) while a screen loads. */
export default function AdminLoading() {
  return (
    <FullPageLoader
      height="min-h-[calc(100vh_-_3rem)]"
      background="bg-gray-100"
      label="Loading admin screen"
    />
  );
}
