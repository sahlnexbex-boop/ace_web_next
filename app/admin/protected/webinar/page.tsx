"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
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
} from "@/lib/api/webinar";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function WebinarsPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string; course_category_id?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(1, 100);
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadWebinars = async () => {
    try {
      const res = await getWebinars(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined,
        filters.course_category_id ? Number(filters.course_category_id) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading webinars:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadWebinars();
  }, [page, debouncedSearch, filters]);

  const categoryOptions = Array.isArray(categories)
    ? categories.map((c) => ({
        label: c.category_name,
        value: String(c.category_id),
      }))
    : [];

  const handleView = async (row: any) => {
    try {
      const res = await getWebinarById(row.webinar_id);
      const w = res?.data || res;

      const formatted = {
        "Webinar Title": w.webinar_title,
        "Course Category": w.category?.category_name || "—",
        "Date & Time": w.date_time
          ? new Date(w.date_time).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "—",
        Duration: w.webinar_duration || "—",
        "Speaker Name": w.speaker_name || "—",
        "Speaker Position": w.speaker_position || "—",
        "Webinar Link": (
          <a
            href={w.webinar_link}
            target="_blank"
            className="text-cyan-700 underline"
            rel="noopener noreferrer"
          >
            {w.webinar_link}
          </a>
        ),
        Description: (
          <p className="text-gray-700 whitespace-pre-line">{w.webinar_description || "—"}</p>
        ),
        Status:
          w.status === 1 || w.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Webinar Image": w.webinar_image ? (
          <div className="flex justify-end">
            <img src={w.webinar_image} alt="Webinar" className="w-20 h-20 object-cover rounded-lg" />
          </div>
        ) : (
          "—"
        ),
        "Created At": w.created_at
          ? new Date(w.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": w.updated_at
          ? new Date(w.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load webinar details:", err);
    }
  };

  const fields = [
    { name: "webinar_title", label: "Webinar Title", type: "text", required: true },
    { name: "date_time", label: "Date & Time", type: "datetime-local", required: true },
    { name: "webinar_duration", label: "Duration", type: "text", required: true },
    {
      name: "course_category_id",
      label: "Course Category",
      type: "select",
      options: categoryOptions,
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
    { name: "webinar_image", label: "Webinar Image - (Ratio 3:2)", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Webinars</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ],
              },
              {
                key: "course_category_id",
                label: "Course Category",
                options: categoryOptions,
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Webinar <IconPlus size={20} />
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "webinar_title", label: "Title" },
          { key: "speaker_name", label: "Speaker Name" },
          { key: "speaker_position", label: "Speaker Position" },
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
          { key: "course_category_id", label: "Category", render: (r) => r.category?.category_name || "—" },
          {
            key: "webinar_image",
            label: "Image",
            render: (r) =>
              r.webinar_image ? (
                <img
                  src={r.webinar_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Webinar"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status === "1" ? (
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
            course_category_id: String(row.course_category_id),
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
        onRowClick={handleView}
      />

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

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Webinar"
        data={viewData}
      />
    </div>
  );
}
