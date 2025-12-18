"use client";

import { useState, useEffect, useRef } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getCurrentAffairs,
  getCurrentAffairById,
  createCurrentAffair,
  updateCurrentAffair,
  deleteCurrentAffair,
} from "@/lib/api/current-affair";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { IconPlus, IconFilter } from "@tabler/icons-react";

export default function CurrentAffairPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const debouncedSearch = useDebounce(search, 500);
  const filterRef = useRef<HTMLDivElement>(null);

  const loadAffairs = async () => {
    try {
      const res = await getCurrentAffairs(page, 10, debouncedSearch, {
        status: statusFilter,
        category_id: categoryFilter,
      });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading affairs:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(1, 100);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadAffairs();
  }, [page, debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const handleView = async (row: any) => {
    try {
      const res = await getCurrentAffairById(row.affair_id);
      const s = res?.data;
      if (!s) return;

      const formatted: Record<string, React.ReactNode> = {
        "Affair Title": s.affair_title,
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {s.affair_description}
          </p>
        ),
        Price: s.affair_price || "—",
        "Publishing Date": s.publishing_date
          ? new Date(s.publishing_date).toLocaleDateString("en-IN")
          : "—",
        Category: s.category?.category_name || "—",
        Status:
          s.status === 1 || s.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        File: s.affair_file ? (
          <a
            href={server_url +s.affair_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
           {server_url + s.affair_file}
          </a>
        ) : (
          "—"
        ),
        "Created At": s.created_at
          ? new Date(s.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": s.updated_at
          ? new Date(s.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Error fetching affair by ID:", err);
    }
  };

  const fields = [
    { name: "affair_title", label: "Title", type: "text", required: true },
    {
      name: "affair_description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    { name: "affair_price", label: "Price", type: "text", required: true },
    {
      name: "publishing_date",
      label: "Publishing Date",
      type: "date",
      required: true,
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categoryOptions,
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
      required: true,
    },
    { name: "affair_file", label: "File (PDF)", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Current Affairs
        </h1>
        <div className="flex items-center gap-3 relative">
          {/*  Search Field from DataTable */}
          {/* handled inside DataTable — so skip here */}

          {/*  Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 border px-3 py-2 rounded-md shadow-sm transition"
            >
              <IconFilter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {filtersOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-3 z-50"
                style={{ zIndex: 9999 }}
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      className="mt-1 w-full border rounded-md p-2 text-sm"
                    >
                      <option value="">All</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setPage(1);
                      }}
                      className="mt-1 w-full border rounded-md p-2 text-sm"
                    >
                      <option value="">All</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/*  Create Button */}
          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Affair <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/*  Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "affair_title", label: "Title" },
          { key: "affair_price", label: "Price" },
          {
            key: "publishing_date",
            label: "Publishing Date",
            render: (r) => new Date(r.publishing_date).toLocaleDateString(),
          },
          {
            key: "category_id",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          {
            key: "affair_file",
            label: "File",
            render: (r) => (
              <a
                href={server_url + r.affair_file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 underline"
                onClick={(e) => e.stopPropagation()}
              >
                View
              </a>
            )},
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </div>
              ),
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onRowClick={handleView}
        onEdit={(row) => {
          setSelected({
            ...row,
            status: String(row.status),
            category_id: String(row.category_id),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

      {/*  Create / Edit Modal */}
      <DynamicFormModal
        title={selected ? "Edit Affair" : "Create Affair"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCurrentAffair(selected.affair_id, fd);
          else await createCurrentAffair(fd);
        }}
        onSuccess={loadAffairs}
      />

      {/*  View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Current Affair"
        data={viewData}
      />

      {/*  Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCurrentAffair(selected.affair_id);
            setOpenDelete(false);
            loadAffairs();
          }
        }}
        title="Delete Affair"
        message={`Are you sure you want to delete "${selected?.affair_title}"?`}
      />
    </div>
  );
}
