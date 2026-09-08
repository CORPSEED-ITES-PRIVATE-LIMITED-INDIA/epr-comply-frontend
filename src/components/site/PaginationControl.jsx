import Link from "next/link";

const hrefFor = (basePath, page) =>
  page <= 0 ? basePath : `${basePath}?page=${page + 1}`;

const baseButton =
  "border border-blue-600 text-sm px-3 py-2 rounded-lg transition-all duration-150";

/**
 * Server component: real links instead of buttons, so each page of the listing
 * is crawlable and prefetched on hover - navigation is instant and needs no JS.
 */
const PaginationControl = ({ basePath = "/blog", currPage = 0, totalPage = 1 }) => {
  if (totalPage <= 1) return null;

  const start = Math.max(0, currPage - 2);
  const end = Math.min(totalPage - 1, start + 2);
  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  const atFirst = currPage === 0;
  const atLast = currPage === totalPage - 1;

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2"
      aria-label="Blog pagination"
    >
      {atFirst ? (
        <span className={`${baseButton} opacity-50`}>First</span>
      ) : (
        <Link href={hrefFor(basePath, 0)} className={`${baseButton} hover:bg-blue-200`}>
          First
        </Link>
      )}

      {atFirst ? (
        <span className={`${baseButton} opacity-50`}>Prev</span>
      ) : (
        <Link
          href={hrefFor(basePath, currPage - 1)}
          className={`${baseButton} hover:bg-blue-200`}
          rel="prev"
        >
          Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(basePath, page)}
          aria-current={page === currPage ? "page" : undefined}
          className={`px-3 py-2 text-sm rounded-md font-medium ${
            page === currPage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page + 1}
        </Link>
      ))}

      {atLast ? (
        <span className={`${baseButton} opacity-50`}>Next</span>
      ) : (
        <Link
          href={hrefFor(basePath, currPage + 1)}
          className={`${baseButton} hover:bg-blue-200`}
          rel="next"
        >
          Next
        </Link>
      )}

      {atLast ? (
        <span className={`${baseButton} opacity-50`}>Last</span>
      ) : (
        <Link
          href={hrefFor(basePath, totalPage - 1)}
          className={`${baseButton} hover:bg-blue-200`}
        >
          Last
        </Link>
      )}
    </nav>
  );
};

export default PaginationControl;
