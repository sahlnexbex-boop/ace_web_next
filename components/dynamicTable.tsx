"use client";

import React from "react";
import { IconEdit, IconTrashX } from "@tabler/icons-react";

export interface Column {
  key: string;
  label: string;
  render?: (row: any, index?: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  page: number;
  totalPages: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRowClick?: (row: any) => void;
}

export default function DataTable({
  columns,
  data,
  page,
  totalPages,
  search,
  setPage,
  setSearch,
  onEdit,
  onDelete,
  onRowClick,
}: DataTableProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-x-auto">
      {/*  Top Search Field */}
      <div className="flex items-center justify-between p-4 gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/*  Table */}
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-cyan-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left font-medium text-cyan-700"
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-2 text-right font-medium text-cyan-700">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-6 text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-gray-50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-gray-700">
                    {col.render ? col.render(row, idx) : row[col.key] ?? "—"}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td
                    className="px-4 py-2 text-right space-x-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-cyan-600 hover:text-cyan-800 cursor-pointer"
                      >
                        <IconEdit />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        <IconTrashX />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*  Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
