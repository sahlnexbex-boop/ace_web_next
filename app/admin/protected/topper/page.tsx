"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";

import {
  getToppers,
  getTopperById,
  createTopper,
  updateTopper,
  deleteTopper,
} from "@/lib/api/topper";

import { getCourseCategories } from "@/lib/api/courseCategory";
import { IconPlus } from "@tabler/icons-react";

export default function ToppersPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const debouncedSearch = useDebounce(search, 500);

  // Load categories only
  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(
          1, // page
          100, // limit
          "", // search
          { status: "1" } // only active categories
      );
      const arr = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setCategories(arr);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  const loadToppers = async () => {
  try {
    const { status, category_id, year } = filters;

    const res = await getToppers(
      page,                                  // page
      10,                                    // limit
      debouncedSearch,                       // search
      status ? Number(status) : undefined,   // status
      category_id ? Number(category_id) : undefined, // ✔ category_id
      year ? Number(year) : undefined        // ✔ year
    );

    setData(res?.data || []);
    setTotalPages(res?.totalPages || 1);
  } catch (err) {
    console.error("Error loading toppers:", err);
  }
};

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadToppers();
  }, [page, debouncedSearch, filters]);

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const handleView = async (row: any) => {
    try {
      const res = await getTopperById(row.topper_id);
      if (res?.data) {
        const t = res.data;

        const formatted: Record<string, React.ReactNode> = {
          "Topper Name": t.topper_name || "—",
          "Exam Name": t.exam_name || "—",
          Rank: t.topper_rank || "—",
          Year: t.year || "—",
          Category: t.category?.category_name || "—",
          Status:
            t.status === 1 ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
            ),
          "Topper Image": t.topper_image ? (
            <div className="flex justify-end">
              <img
                src={server_url +t.topper_image}
                alt="Topper"
                className="w-16 h-16 rounded object-cover"
              />
            </div>
          ) : (
            "—"
          ),
          "Created At": t.created_at
            ? new Date(t.created_at).toLocaleString("en-IN")
            : "—",
          "Updated At": t.updated_at
            ? new Date(t.updated_at).toLocaleString("en-IN")
            : "—",
        };

        setViewData(formatted);
        setOpenView(true);
      }
    } catch (err) {
      console.error("Error fetching topper details:", err);
    }
  };

  // Fields for form (NO BASED TYPE, NO COURSE)
  const fields = [
    { name: "topper_name", label: "Topper Name", type: "text", required: true },
    { name: "topper_rank", label: "Rank", type: "number", required: true },
    { name: "year", label: "Year", type: "number", required: true },
    { name: "exam_name", label: "Exam Name", type: "text", required: true },

    {
      name: "category_id",
      label: "Select Category",
      type: "select",
      required: true,
      options: categoryOptions,
    },

    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },

    { name: "topper_image", label: "Topper Image - (Ratio 1:1)", type: "file" },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Toppers</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "category_id",
                label: "Category",
                type: "select",
                options: categoryOptions,
              },
              {
                key: "year",
                label: "Year",
                type: "year",
              },
              {
                key: "status",
                label: "Status",
                type: "select",
                options: [
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ],
              },
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />

          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800 cursor-pointer"
          >
            Create Topper <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "topper_name", label: "Topper Name" },
          { key: "exam_name", label: "Exam Name" },
          { key: "topper_rank", label: "Rank" },
          { key: "year", label: "Year" },
          {
            key: "topper_image",
            label: "Image",
            render: (r) =>
              r.topper_image ? (
                <img
                  src={server_url + r.topper_image}
                  alt="Topper"
                  className="w-10 h-10 object-cover rounded-md"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status === 1 || r.status === "1" ? (
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
        onEdit={(row) => {
          setSelected({
            ...row,
            category_id: row.category_id ? String(row.category_id) : "",
            status: String(row.status),
            year: String(row.year),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Topper" : "Create Topper"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateTopper(selected.topper_id, fd);
          else await createTopper(fd);
        }}
        onSuccess={loadToppers}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Topper"
        message={`Are you sure you want to delete "${selected?.topper_name}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteTopper(selected.topper_id);
            setOpenDelete(false);
            loadToppers();
          }
        }}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Topper Details"
        data={viewData}
      />
    </div>
  );
}
