"use client";

import { useState, useEffect } from "react";
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
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  // Load list
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

  const handleModalSubmit = async (fd: FormData) => {
    normalizeTagsFormData(fd);
    if (selected) await updateBlog(selected.blog_id, fd);
    else await createBlog(fd);
  };

  const handleView = async (row: any) => {
    try {
      const res = await getBlogById(row.blog_id);
      if (res?.data) {
        const blog = res.data;

        let parsedTags = "";
        try {
          parsedTags = Array.isArray(JSON.parse(blog.tags))
            ? JSON.parse(blog.tags).join(", ")
            : blog.tags;
        } catch {
          parsedTags = blog.tags;
        }

        const formattedData = {
          "Blog Title": blog.blog_title,
          "Blog Author": blog.blog_author,
          "Blog Content": blog.blog_content,
          "Publishing Date": new Date(blog.publishing_date).toLocaleDateString(
            "en-IN"
          ),
          Tags: parsedTags || "—",
          Status: blog.status ? "Active" : "Inactive",
          "Blog Image": blog.blog_image ? blog.blog_image :  "—",
          "Created At": new Date(blog.created_at).toLocaleString("en-IN"),
          "Updated At": new Date(blog.updated_at).toLocaleString("en-IN"),
        };

        setViewData(formattedData);
        setOpenView(true);
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
    }
  };

  const fields = [
    { name: "blog_title", label: "Blog Title", type: "text", required: true },
    { name: "blog_author", label: "Author", type: "text", required: true },
    {
      name: "blog_content",
      label: "Content",
      type: "textarea",
      required: true,
    },
    {
      name: "publishing_date",
      label: "Publishing Date",
      type: "date",
      required: true,
    },
    {
      name: "tags",
      label: "Tags (comma separated)",
      type: "text",
      required: false,
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
    { name: "blog_image", label: "Blog Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
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
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "blog_id", label: "ID" },
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
        onRowClick={handleView}
      />

      <DynamicFormModal
        title={selected ? "Edit Blog" : "Create Blog"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={handleModalSubmit}
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

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Blog"
        data={viewData}
      />
    </div>
  );
}
