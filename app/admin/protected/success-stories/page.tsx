"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getSuccessStories,
  getSuccessStoryById,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  getSuccessCategoryOptions,
} from "@/lib/api/successStories";
import { IconPlus } from "@tabler/icons-react";

export default function SuccessStoriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [yearFilter, setYearFilter] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  const loadSuccessStories = async () => {
    try {
      const res = await getSuccessStories(
        page,
        10,
        debouncedSearch,
        yearFilter
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading success stories:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getSuccessCategoryOptions();
      setCategories(res || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadSuccessStories();
    loadCategories();
  }, [page, debouncedSearch, yearFilter]);

  const categoryOptions = categories.map((c: any) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const handleRowClick = async (row: any) => {
    try {
      const res = await getSuccessStoryById(row.stories_id);
      const s = res?.data || res;

      // ✅ Format all fields consistently
      const formatted: Record<string, React.ReactNode> = {
        "Story Title": s.stories_title,
        "Candidate Name": s.name_of_candidate,
        Year: s.year || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {s.description || "—"}
          </p>
        ),
        Category: s.category?.category_name || "—",
        "YouTube Video": s.youtube_video_link ? (
          <a
            href={s.youtube_video_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {s.youtube_video_link}
          </a>
        ) : (
          "—"
        ),
        Status:
          s.status === 1 || s.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Thumbnail Image": s.thumbnail_image ? (
          <div className="flex justify-end">
            <img
              src={s.thumbnail_image}
              alt="Thumbnail"
              className="w-16 h-16 object-cover rounded"
            />
          </div>
        ) : (
          "—"
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
    } catch (err) {
      console.error("Error fetching story details:", err);
    }
  };

  const fields = [
    {
      name: "stories_title",
      label: "Story Title",
      type: "text",
      required: true,
    },
    {
      name: "name_of_candidate",
      label: "Candidate Name",
      type: "text",
      required: true,
    },
    { name: "year", label: "Year", type: "number", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "course_category_id",
      label: "Course Category",
      type: "select",
      options: categoryOptions,
      required: true,
    },
    {
      name: "youtube_video_link",
      label: "YouTube Video Link",
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
    {
      name: "thumbnail_image",
      label: "Thumbnail Image",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Success Stories
        </h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
        >
          Create Story <IconPlus size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          placeholder="Filter by year..."
          className="border rounded p-2 w-40"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "stories_title", label: "Story Title" },
          { key: "name_of_candidate", label: "Candidate Name" },
          { key: "year", label: "Year" },
          {
            key: "course_category_id",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          {
            key: "youtube_video_link",
            label: "Video",
            render: (r) =>
              r.youtube_video_link ? (
                <a
                  href={r.youtube_video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Watch
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "thumbnail_image",
            label: "Thumbnail",
            render: (r) =>
              r.thumbnail_image ? (
                <img
                  src={r.thumbnail_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Thumbnail"
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
            year: String(row.year),
            course_category_id: row.course_category_id
              ? String(row.course_category_id)
              : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <DynamicFormModal
        title={selected ? "Edit Success Story" : "Create Success Story"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateSuccessStory(selected.stories_id, fd);
          else await createSuccessStory(fd);
        }}
        onSuccess={loadSuccessStories}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteSuccessStory(selected.stories_id);
            setOpenDelete(false);
            loadSuccessStories();
          }
        }}
        title="Delete Success Story"
        message={`Are you sure you want to delete "${selected?.stories_title}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Success Story"
        data={viewData}
      />
    </div>
  );
}
