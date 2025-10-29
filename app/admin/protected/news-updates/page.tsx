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
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "@/lib/api/news";

export default function NewsPage() {
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load News
  const loadNews = async () => {
    try {
      const res = await getNews(
        page,
        10,
        debouncedSearch,
        filters.status ? Number(filters.status) : undefined
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading news:", err);
    }
  };

  useEffect(() => {
    loadNews();
  }, [page, debouncedSearch, filters]);

  // ✅ View Logic
  const handleView = async (row: any) => {
    try {
      const res = await getNewsById(row.news_id);
      const n = res?.data || res;

      const formatted = {
        "News Title": n.news_title || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {n.news_description || "—"}
          </p>
        ),
        "Date & Time": n.date_time
          ? new Date(n.date_time).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "—",
        Status:
          n.status === 1 || n.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "News Image": n.news_image ? (
          <div className="flex justify-end">
            <img
              src={n.news_image}
              alt="News"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        ) : (
          "—"
        ),
        "Created At": n.created_at
          ? new Date(n.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": n.updated_at
          ? new Date(n.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load news details:", err);
    }
  };

  // ✅ Form Fields
  const fields = [
    { name: "news_title", label: "News Title", type: "text", required: true },
    {
      name: "news_description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "date_time",
      label: "Date & Time",
      type: "datetime-local",
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
    { name: "news_image", label: "News Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">News</h1>

        <div className="flex items-center gap-3">
          {/* ✅ Dynamic Filter */}
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
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />

          {/* Create Button */}
          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create News <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ✅ Data Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "news_title", label: "Title" },
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
          {
            key: "news_description",
            label: "Description",
            render: (r) => (
              <div className="truncate max-w-[250px]" title={r.news_description}>
                {r.news_description || "—"}
              </div>
            ),
          },
          {
            key: "news_image",
            label: "Image",
            render: (r) =>
              r.news_image ? (
                <img
                  src={r.news_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="News"
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

      {/* ✅ Create/Edit Modal */}
      <DynamicFormModal
        title={selected ? "Edit News" : "Create News"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateNews(selected.news_id, fd);
          else await createNews(fd);
        }}
        onSuccess={loadNews}
      />

      {/* ✅ Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteNews(selected.news_id);
            setOpenDelete(false);
            loadNews();
          }
        }}
        title="Delete News"
        message={`Are you sure you want to delete "${selected?.news_title}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View News"
        data={viewData}
      />
    </div>
  );
}
