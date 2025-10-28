"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getVideoClasses,
  getVideoClassById,
  createVideoClass,
  updateVideoClass,
  deleteVideoClass,
  getVideoClassCategoryOptions,
} from "@/lib/api/videoClass";
import { IconPlus } from "@tabler/icons-react";

export default function VideoClassPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<Record<string, React.ReactNode> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load category options
  const loadCategories = async () => {
    try {
      const res = await getVideoClassCategoryOptions();
      setCategories(res || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // ✅ Load video class list
  const loadVideoClasses = async () => {
    try {
      const res = await getVideoClasses(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("VideoClass fetch error:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadVideoClasses();
  }, [page, debouncedSearch]);

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  // ✅ Handle View Modal (click row)
  const handleView = async (row: any) => {
    try {
      const res = await getVideoClassById(row.class_id);
      if (res?.data) {
        const s = res.data;

        const formatted: Record<string, React.ReactNode> = {
          "Class Title": s.class_title || "—",
          "Category": s.category?.category_name || "—",
          "Video URL": s.video_url ? (
            <a
              href={s.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
              {s.video_url}
            </a>
          ) : (
            "—"
          ),
          "Date & Time": s.date_time
            ? new Date(s.date_time).toLocaleString("en-IN")
            : "—",
          "Class Image": s.class_image ? (
            <div className="flex justify-end">
            <img
              src={s.class_image}
              alt="Class"
              className="w-16 h-16 object-cover rounded-lg shadow"
            />
            </div>
          ) : (
            "—"
          ),
          "Status":
            s.status === 1 || s.status === "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
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
      }
    } catch (err) {
      console.error("Error fetching video class details:", err);
    }
  };

  // ✅ Fields for form
  const fields = [
    { name: "class_title", label: "Class Title", type: "text", required: true },
    { name: "date_time", label: "Date & Time", type: "datetime-local", required: true },
    { name: "video_url", label: "Video URL", type: "text", required: true },
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
    { name: "class_image", label: "Class Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Video Classes</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
        >
          Create Class <IconPlus size={20} />
        </button>
      </div>

      {/* ✅ Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "class_title", label: "Title" },
          {
            key: "category_id",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          {
            key: "date_time",
            label: "Date & Time",
            render: (r) =>
              r.date_time ? new Date(r.date_time).toLocaleString("en-IN") : "—",
          },
          {
            key: "class_image",
            label: "Image",
            render: (r) =>
              r.class_image ? (
                <img
                  src={r.class_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Class"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status == "1" ? (
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
            category_id: String(row.category_id),
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView} // ✅ Row click opens view modal
      />

      {/* ✅ Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Video Class" : "Create Video Class"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateVideoClass(selected.class_id, fd);
          else await createVideoClass(fd);
        }}
        onSuccess={loadVideoClasses}
      />

      {/* ✅ Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteVideoClass(selected.class_id);
            setOpenDelete(false);
            loadVideoClasses();
          }
        }}
        title="Delete Video Class"
        message={`Are you sure you want to delete "${selected?.class_title}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Video Class"
        data={viewData}
      />
    </div>
  );
}
