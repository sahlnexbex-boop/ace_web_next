"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button"; 
import { useDebounce } from "@/hooks/debounce";
import {
  getSuccessStories,
  getSuccessStoryById,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "@/lib/api/successStories";
import { getCourseCategories } from "@/lib/api/courseCategory";
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
  const [filters, setFilters] = useState<{
    status?: string;
    year?: string;
    category_id?: string;
  }>({});
  const debouncedSearch = useDebounce(search, 500);

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCategories(list);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  const loadStories = async () => {
    try {
      const res = await getSuccessStories(
        page,
        10,
        debouncedSearch,
        filters.year || "",
        filters.status ? Number(filters.status) : undefined,
        filters.category_id ? Number(filters.category_id) : undefined
      );
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching success stories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadStories();
  }, [page, debouncedSearch, filters]);

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const handleView = async (row: any) => {
    try {
      const res = await getSuccessStoryById(row.stories_id);
      if (res?.data) {
        const s = res.data;

        const formatted: Record<string, React.ReactNode> = {
          "Story Title": s.stories_title || "—",
          "Candidate Name": s.name_of_candidate || "—",
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
              className="text-cyan-700 underline"
            >
              {s.youtube_video_link}
            </a>
          ) : (
            "—"
          ),
          Status:
            s.status == 1 || s.status == "1" ? (
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
      }
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
      label: "Category",
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
      label: "Thumbnail Image - (Ratio 3:2)",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Success Stories
        </h1>

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
                key: "category_id",
                label: "Category",
                options: categoryOptions,
              },
              {
                key: "year",
                label: "Year",
                type: "year",
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
            Create Story <IconPlus size={20} />
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
          { key: "stories_title", label: "Title" },
          { key: "name_of_candidate", label: "Candidate" },
          { key: "year", label: "Year" },
          {
            key: "category_id",
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
                  className="text-cyan-700 underline"
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
            course_category_id: String(row.course_category_id),
            status: String(row.status),
            year: String(row.year),
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
        title={selected ? "Edit Success Story" : "Create Success Story"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateSuccessStory(selected.stories_id, fd);
          else await createSuccessStory(fd);
        }}
        onSuccess={loadStories}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteSuccessStory(selected.stories_id);
            setOpenDelete(false);
            loadStories();
          }
        }}
        title="Delete Success Story"
        message={`Are you sure you want to delete "${selected?.stories_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Success Story"
        data={viewData}
      />
    </div>
  );
}
