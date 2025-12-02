import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Table({
  columns = [],
  dataSource = [],
  rowKey = "id",
  scroll = {},
  topContent,
  pagination = false,
}) {
  const { x = "100%", y = 400 } = scroll;

  return (
    <div className="w-full space-y-4">
      {/* TOP CONTENT (Search bar, filters, etc.) */}
      {topContent && <div>{topContent}</div>}

      {/* TABLE WRAPPER */}
      <div
        className="relative border border-gray-200 rounded-xl shadow-md bg-white"
        style={{ overflow: "hidden" }}
      >
        {/* SCROLL CONTAINER */}
        <div
          className="overflow-auto"
          style={{
            maxHeight: y,
          }}
        >
          <div
            className="overflow-auto"
            style={{
              minWidth: typeof x === "number" ? `${x}px` : x,
            }}
          >
            <table className="border-collapse w-full text-left">
              {/* HEADER */}
              <thead className="bg-gray-100 sticky top-0 z-20 border-b border-gray-200">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key || col.dataIndex}
                      className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200 last:border-r-0"
                      style={{ width: col.width ? col.width : "auto" }}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                <AnimatePresence>
                  {dataSource.length > 0 ? (
                    dataSource.map((row, index) => (
                      <motion.tr
                        key={row[rowKey] || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {columns.map((col) => (
                          <td
                            key={col.key || col.dataIndex}
                            className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap border-r border-gray-50 last:border-r-0"
                          >
                            {col.render
                              ? col.render(row[col.dataIndex], row)
                              : row[col.dataIndex]}
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <td
                        colSpan={columns.length}
                        className="py-6 text-gray-500"
                      >
                        No data found
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION (OPTIONAL) */}
        {pagination && (
          <div className="p-4 border-t border-gray-200 flex justify-end">
            {pagination}
          </div>
        )}
      </div>
    </div>
  );
}
