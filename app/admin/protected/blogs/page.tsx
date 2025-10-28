"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/api/blogs";

export default function BlogsPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load Blogs
  const loadData = async () => {
  try {
    const status =
      filters.status && filters.status !== "" ? Number(filters.status) : undefined;
    const res = await getBlogs(page, 10, debouncedSearch, status);
    setData(res.data || []);
    setTotalPages(res.totalPages || 1);
  } catch (err) {
    console.error("Error loading blogs:", err);
  }
};


  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  // ✅ Tags normalize helper
  const normalizeTagsFormData = (fd: FormData) => {
    const tagsValue = fd.get("tags");
    if (!tagsValue) {
      fd.set("tags", JSON.stringify([]));
      return;
    }

    const tagsStr = String(tagsValue).trim();
    if (tagsStr.startsWith("[")) {
      try {
        const parsed = JSON.parse(tagsStr);
        if (Array.isArray(parsed)) {
          fd.set(
            "tags",
            JSON.stringify(parsed.map((t) => String(t).trim()).filter(Boolean))
          );
          return;
        }
      } catch {}
    }

    const arr = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    fd.set("tags", JSON.stringify(arr));
  };

  return (
    <div className="p-4 sm:p-6">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Blogs</h1>

        <div className="flex items-center gap-3">
          {/* ✅ Reusable Filter */}
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

          {/* ✅ Create Button */}
          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Blog <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ✅ Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "blog_image",
            label: "Image",
            render: (r) =>
              r.blog_image ? (
                <img
                  src={r.blog_image}
                  alt={r.blog_title}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                "—"
              ),
          },
          { key: "blog_title", label: "Title" },
          { key: "blog_author", label: "Author" },
          {
            key: "publishing_date",
            label: "Date",
            render: (r) =>
              r.publishing_date
                ? new Date(r.publishing_date).toLocaleDateString("en-IN")
                : "—",
          },
          {
            key: "tags",
            label: "Tags",
            render: (r) => {
              try {
                const tagsArray =
                  typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags;
                return Array.isArray(tagsArray)
                  ? tagsArray.join(", ")
                  : String(r.tags || "");
              } catch {
                return String(r.tags || "");
              }
            },
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
          {
            key: "created_at",
            label: "Created At",
            render: (r) =>
              r.created_at
                ? new Date(r.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—",
          },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => {
          let tagsValue = "";
          try {
            if (row.tags) {
              const parsed =
                typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags;
              if (Array.isArray(parsed)) tagsValue = parsed.join(", ");
              else tagsValue = String(row.tags);
            }
          } catch {
            tagsValue = String(row.tags || "");
          }

          setSelected({
            ...row,
            publishing_date: row.publishing_date
              ? row.publishing_date.split("T")[0]
              : "",
            status: String(row.status),
            tags: tagsValue,
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={async (row) => {
          const res = await getBlogById(row.blog_id);
          const b = res?.data;
          if (!b) return;

          let parsedTags = "—";
          try {
            const tagsArray = JSON.parse(b.tags);
            if (Array.isArray(tagsArray) && tagsArray.length > 0) {
              parsedTags = tagsArray.join(", ");
            }
          } catch {
            parsedTags = b.tags || "—";
          }

          const formatted = {
            "Blog Title": b.blog_title || "—",
            "Blog Author": b.blog_author || "—",
            "Blog Content": (
              <p className="text-gray-700 whitespace-pre-line">
                {b.blog_content || "—"}
              </p>
            ),
            "Publishing Date": b.publishing_date
              ? new Date(b.publishing_date).toLocaleDateString("en-IN")
              : "—",
            Tags: parsedTags,
            Status:
              b.status == 1 || b.status == "1" ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive
                </span>
              ),
            "Blog Image": b.blog_image ? (
              <div className="flex justify-end">
              <img
                src={b.blog_image}
                alt="Blog"
                className="w-14 h-14 object-cover rounded"
              />
              </div>
            ) : (
              "—"
            ),
            "Created At": b.created_at
              ? new Date(b.created_at).toLocaleString("en-IN")
              : "—",
            "Updated At": b.updated_at
              ? new Date(b.updated_at).toLocaleString("en-IN")
              : "—",
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* ✅ Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Blog" : "Create Blog"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "blog_title", label: "Blog Title", type: "text", required: true },
          { name: "blog_author", label: "Author", type: "text", required: true },
          { name: "blog_content", label: "Content", type: "textarea", required: true },
          { name: "publishing_date", label: "Publishing Date", type: "date", required: true },
          { name: "tags", label: "Tags (comma separated)", type: "text", required: false },
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
          { name: "blog_image", label: "Blog Image", type: "file", required: false },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          normalizeTagsFormData(fd);
          if (selected) await updateBlog(selected.blog_id, fd);
          else await createBlog(fd);
        }}
        onSuccess={loadData}
      />

      {/* ✅ Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteBlog(selected.blog_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Blog"
        message={`Are you sure you want to delete "${selected?.blog_title}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Blog"
        data={viewData}
      />
    </div>
  );
}
