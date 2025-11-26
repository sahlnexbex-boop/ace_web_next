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

import { getCourses } from "@/lib/api/course";

export default function BlogsPage() {
  const [data, setData] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
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

  // Load courses
  const loadCourses = async () => {
    try {
      const res = await getCourses(1, 200, "");
      setCourses(res?.data || []);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  // Fetch blogs
  const loadData = async () => {
    try {
      const status =
        filters.status && filters.status !== "" ? Number(filters.status) : undefined;

      const course_id =
        filters.course_id && filters.course_id !== ""
          ? Number(filters.course_id)
          : undefined;

      const res = await getBlogs(
        page,
        10,
        debouncedSearch,
        status,
        course_id // ✔ ADDED
      );

      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading blogs:", err);
    }
  };


  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  const courseOptions = courses.map((c) => ({
    label: c.course_name,
    value: String(c.course_id),
  }));

  // Normalizing tag list
  const normalizeTagsFormData = (fd: FormData) => {
    const tagsValue = fd.get("tags");
    if (!tagsValue) {
      fd.set("tags", JSON.stringify([]));
      return;
    }

    const tagsStr = String(tagsValue).trim();
    const arr = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    fd.set("tags", JSON.stringify(arr));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Blogs</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "course_id",
                label: "Course",
                type: "select",
                options: courseOptions,
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Blog <IconPlus size={20} />
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

          // ✔ NEW COLUMN
          {
            key: "course",
            label: "Course",
            render: (r) => r.course?.course_name || "—",
          },

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
                const arr =
                  typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags;
                return Array.isArray(arr) ? arr.join(", ") : "—";
              } catch {
                return "—";
              }
            },
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 ? (
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
              tagsValue = Array.isArray(parsed) ? parsed.join(", ") : "";
            }
          } catch {}

          setSelected({
            ...row,
            course_id: row.course_id ? String(row.course_id) : "",
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

          let parsedTags = "—";
          try {
            const arr = JSON.parse(b.tags);
            parsedTags = Array.isArray(arr) ? arr.join(", ") : "—";
          } catch {}

          const formatted = {
            "Blog Title": b.blog_title,
            Author: b.blog_author,
            Course: b.course?.course_name || "—",

            "Blog Content": (
              <p className="text-gray-700 whitespace-pre-line">
                {b.blog_content}
              </p>
            ),
            "Publishing Date": new Date(b.publishing_date).toLocaleDateString(
              "en-IN"
            ),
            Tags: parsedTags,
            Status:
              b.status == 1 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive
                </span>
              ),
            Image: b.blog_image ? (
              <img
                src={b.blog_image}
                className="w-14 h-14 rounded object-cover"
              />
            ) : (
              "—"
            ),
          };

          setViewData(formatted);
          setOpenView(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Blog" : "Create Blog"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "blog_title", label: "Blog Title", type: "text", required: true },
          { name: "blog_author", label: "Author", type: "text", required: true },
          { name: "blog_content", label: "Content", type: "textarea", required: true },
          { name: "publishing_date", label: "Publishing Date", type: "date", required: true },

          // ✔ NEW FIELD
          {
            name: "course_id",
            label: "Select Course",
            type: "select",
            options: courseOptions,
            required: true,
          },

          { name: "tags", label: "Tags (comma separated)", type: "text" },

          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },

          { name: "blog_image", label: "Blog Image", type: "file" },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          normalizeTagsFormData(fd);

          if (selected) await updateBlog(selected.blog_id, fd);
          else await createBlog(fd);
        }}
        onSuccess={loadData}
      />

      {/* DELETE MODAL */}
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

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Blog"
        data={viewData}
      />
    </div>
  );
}
