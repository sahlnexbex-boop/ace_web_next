"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getWebinars,
  getWebinarById,
  createWebinar,
  updateWebinar,
  deleteWebinar,
  getCourseCategoryOptions,
} from "@/lib/api/webinar";

export default function WebinarsPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load webinars
  const loadWebinars = async () => {
    try {
      const res = await getWebinars(page, 10, debouncedSearch);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading webinars:", err);
    }
  };

  // ✅ Load categories
  const loadCategories = async () => {
    try {
      const res = await getCourseCategoryOptions();
      setCategories(
        res.map((cat: any) => ({
          label: cat.category_name,
          value: cat.category_id,
        }))
      );
    } catch (err) {
      console.error("Error loading course categories:", err);
    }
  };

  useEffect(() => {
    loadWebinars();
    loadCategories();
  }, [page, debouncedSearch]);

  // ✅ Handle row click to show Dynamic View Modal
  const handleRowClick = async (row: any) => {
    try {
      const res = await getWebinarById(row.webinar_id);
      setViewData(res?.data || res);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load webinar details:", err);
    }
  };

  // ✅ Form fields
  const fields = [
    { name: "webinar_title", label: "Webinar Title", type: "text", required: true },
    { name: "date_time", label: "Date & Time", type: "datetime-local", required: true },
    { name: "webinar_duration", label: "Duration", type: "text", required: true },
    {
      name: "course_category_id",
      label: "Course Category",
      type: "select",
      options: categories,
      required: true,
    },
    { name: "speaker_name", label: "Speaker Name", type: "text", required: true },
    { name: "speaker_position", label: "Speaker Position", type: "text", required: true },
    { name: "webinar_description", label: "Description", type: "textarea", required: true },
    { name: "webinar_link", label: "Webinar Link", type: "text", required: true },
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
    { name: "webinar_image", label: "Webinar Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Webinars</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Webinar
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "webinar_title", label: "Title" },
          {
            key: "date_time",
            label: "Date & Time",
            render: (r) =>
              r.date_time
                ? new Date(r.date_time).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—",
          },
          { key: "webinar_duration", label: "Duration" },
          { key: "speaker_name", label: "Speaker Name" },
          { key: "speaker_position", label: "Speaker Position" },
          {
            key: "webinar_image",
            label: "Image",
            render: (r) =>
              r.webinar_image ? (
                <img
                  src={r.webinar_image}
                  alt="Webinar"
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
            status: String(row.status),
            course_category_id: row.course_category_id || "",
            date_time: row.date_time
              ? new Date(row.date_time).toISOString().slice(0, 16)
              : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleRowClick} // 👈 View Modal trigger
      />

      {/* Create/Edit Modal */}
      <DynamicFormModal
        title={selected ? "Edit Webinar" : "Create Webinar"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateWebinar(selected.webinar_id, fd);
          else await createWebinar(fd);
        }}
        onSuccess={loadWebinars}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteWebinar(selected.webinar_id);
            setOpenDelete(false);
            loadWebinars();
          }
        }}
        title="Delete Webinar"
        message={`Are you sure you want to delete "${selected?.webinar_title}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Webinar Details"
        data={viewData}
      />
    </div>
  );
}
