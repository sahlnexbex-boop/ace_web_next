"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/api/blogs";

export default function BlogsPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  // Load blogs
  const loadBlogs = async () => {
    try {
      const res = await getBlogs(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [page, debouncedSearch]);

  // Modal fields (unchanged)
  const fields = [
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
  ];

  // Helper: convert tags input (string) -> JSON array string
  const normalizeTagsFormData = (fd: FormData) => {
    const tagsValue = fd.get("tags");
    if (!tagsValue) {
      // if no tags present, ensure we don't send an invalid value
      fd.set("tags", JSON.stringify([]));
      return;
    }

    const tagsStr = String(tagsValue).trim();

    // If user already provided a JSON array string, try to validate it
    if (tagsStr.startsWith("[")) {
      try {
        const parsed = JSON.parse(tagsStr);
        if (Array.isArray(parsed)) {
          fd.set("tags", JSON.stringify(parsed.map((t) => String(t).trim()).filter(Boolean)));
          return;
        }
      } catch {
        // fall through to treat as comma-separated
      }
    }

    // Split by comma for normal comma separated input
    const arr = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    fd.set("tags", JSON.stringify(arr));
  };

  // onSubmit wrapper passed to DynamicFormModal
  const handleModalSubmit = async (fd: FormData) => {
    // convert tags field into JSON array string
    normalizeTagsFormData(fd);

    // call API (create or update)
    if (selected) {
      await updateBlog(selected.blog_id, fd);
    } else {
      await createBlog(fd);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Blogs</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Blog
        </button>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "blog_id", label: "ID" },
          {
            key: "blog_image",
            label: "Image",
            render: (row) =>
              row.blog_image ? (
                <img
                  src={row.blog_image}
                  alt={row.blog_title}
                  className="w-16 h-16 object-cover rounded"
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
            render: (row) => new Date(row.publishing_date).toLocaleDateString(),
          },
          {
            key: "tags",
            label: "Tags",
            render: (row) => {
              try {
                const tagsArray = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags;
                return Array.isArray(tagsArray) ? tagsArray.join(", ") : String(row.tags || "");
              } catch {
                return String(row.tags || "");
              }
            },
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">Active</div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">Inactive</div>
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
          // normalize tags for editing: show comma-separated string in modal
          let tagsValue = "";
          try {
            if (row.tags) {
              const parsed = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags;
              if (Array.isArray(parsed)) tagsValue = parsed.join(", ");
              else tagsValue = String(row.tags);
            }
          } catch {
            tagsValue = String(row.tags || "");
          }

          setSelected({
            ...row,
            publishing_date: row.publishing_date ? row.publishing_date.split("T")[0] : "",
            status: String(row.status),
            tags: tagsValue,
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

      <DynamicFormModal
        title={selected ? "Edit Blog" : "Create Blog"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          await handleModalSubmit(fd);
        }}
        onSuccess={loadBlogs}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteBlog(selected.blog_id);
            setOpenDelete(false);
            loadBlogs();
          }
        }}
        title="Delete Blog"
        message={`Are you sure you want to delete "${selected?.blog_title}"?`}
      />
    </div>
  );
}
