"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getVideoClasses,
  createVideoClass,
  updateVideoClass,
  deleteVideoClass,
  getVideoClassCategoryOptions,
} from "@/lib/api/videoClass";

export default function VideoClassPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
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

  // ✅ Load video classes list (no default status filter)
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

  // ✅ Fields for create/edit form
  const fields = [
    { name: "class_title", label: "Class Title", type: "text", required: true },
    { name: "date_time", label: "Date & Time", type: "datetime-local", required: true },
    { name: "video_url", label: "Video URL", type: "text", required: true },
    { name: "category_id", label: "Category", type: "select", options: categoryOptions, required: true },
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
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Video Classes</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Video Class
        </button>
      </div>

      {/* ✅ Dynamic Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "class_id", label: "ID" },
          { key: "class_title", label: "Title" },
          {
            key: "category_id",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          {
            key: "date_time",
            label: "Date & Time",
            render: (r) => new Date(r.date_time).toLocaleString(),
          },
          {
            key: "class_image",
            label: "Image",
            render: (r) =>
              r.class_image ? (
                <img
                  src={r.class_image}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                "—"
              ),
          },
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
      />

      {/* ✅ Add/Edit Modal */}
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
    </div>
  );
}
