import React from "react";

function PaginationControl({ currPage = 0, totalPage = 2, onPageChange }) {
  if (totalPage <= 1) return null;

  const getAllPages = () => {
    const pages = [];
    const visible = 3;

    let start = Math.max(0, currPage - 2);
    let end = Math.min(totalPage - 1, start + visible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleChangePage = (page) => {
    if (page < 0 || page >= totalPage || page === currPage) return;

    onPageChange(page);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => handleChangePage(0)}
        disabled={currPage === 0}
        className="border border-blue-600 text-sm px-3 py-2  rounded-lg cursor-pointer hover:bg-blue-200 transition-all duration-150"
      >
        First
      </button>
      <button
        onClick={() => handleChangePage(currPage - 1)}
        disabled={currPage === 0}
        className="border border-blue-600 text-sm px-3 py-2  rounded-lg cursor-pointer hover:bg-blue-200 transition-all duration-150"
      >
        Prev
      </button>

      {getAllPages().map((page) => (
        <button
          key={page + 1}
          onClick={() => handleChangePage(page)}
          className={`px-3 py-2 cursor-pointer text-sm rounded-md font-medium ${page === currPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => handleChangePage(currPage + 1)}
        disabled={currPage === totalPage - 1}
        className="border border-blue-600 text-sm px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition-all duration-150"
      >
        Next
      </button>
      <button
        onClick={() => handleChangePage(totalPage - 1)}
        disabled={currPage === totalPage - 1}
        className="border border-blue-600 text-sm px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition-all duration-150"
      >
        Last
      </button>
    </div>
  );
}

export default PaginationControl;
