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
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function CoursesPage() {
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
  const [filters, setFilters] = useState<{ status?: string; category_id?: string }>({});
  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load Categories
  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(1, 100);
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // ✅ Load Courses
  const loadCourses = async () => {
    try {
      const res = await getCourses(page, 10, debouncedSearch, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [page, debouncedSearch, filters]);

  const categoryOptions = Array.isArray(categories)
    ? categories.map((c) => ({
        label: c.category_name,
        value: String(c.category_id),
      }))
    : [];

  // ✅ View Logic
  const handleView = async (row: any) => {
    try {
      const res = await getCourseById(row.course_id);
      if (res?.data) {
        const c = res.data;

        const formatted = {
          "Course Name": c.course_name || "—",
          Description: (
            <p className="text-gray-700 whitespace-pre-line">
              {c.course_description || "—"}
            </p>
          ),
          Category: c.category?.category_name || "—",
          Rating: c.course_rating || "—",
          Duration: c.course_duration || "—",
          Fee: c.course_fee || "—",
          Overview: c.course_overview || "—",
          Syllabus: c.course_syllabus || "—",
          "Study Material": c.course_study_material || "—",
          "Syllabus File": c.course_syllabus_file ? (
            <a
              href={c.course_syllabus_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
             {c.course_syllabus_file}
            </a>
          ) : (
            "—"
          ),
          "Questions File": c.course_questions_file ? (
            <a
              href={c.course_questions_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
              {c.course_questions_file}
            </a>
          ) : (
            "—"
          ),
          "Course Image": c.course_image ? (
            <div className="flex justify-end">
              <img
                src={c.course_image}
                alt="Course"
                className="w-16 h-16 object-cover rounded"
              />
            </div>
          ) : (
            "—"
          ),
          Status:
            c.status == 1 || c.status == "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
            ),
          "Created At": c.created_at
            ? new Date(c.created_at).toLocaleString("en-IN")
            : "—",
          "Updated At": c.updated_at
            ? new Date(c.updated_at).toLocaleString("en-IN")
            : "—",
        };

        setViewData(formatted);
        setOpenView(true);
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
    }
  };

  // ✅ Extended Form Fields
  const fields = [
    { name: "course_name", label: "Course Name", type: "text", required: true },
    {
      name: "course_description",
      label: "Course Description",
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
    { name: "course_rating", label: "Rating", type: "text", required: false },
    { name: "course_duration", label: "Duration (Hours)", type: "text", required: false },
    { name: "course_fee", label: "Fee", type: "text", required: false },
    {
      name: "course_overview",
      label: "Course Overview",
      type: "textarea",
      required: false,
    },
    {
      name: "course_syllabus",
      label: "Course Syllabus",
      type: "textarea",
      required: false,
    },
    {
      name: "course_study_material",
      label: "Study Material",
      type: "textarea",
      required: false,
    },
    {
      name: "course_syllabus_file",
      label: "Syllabus File (PDF)",
      type: "file",
      required: false,
    },
    {
      name: "course_questions_file",
      label: "Questions File (PDF)",
      type: "file",
      required: false,
    },
    {
      name: "course_image",
      label: "Course Image",
      type: "file",
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
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Courses</h1>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
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
            className="bg-cyan-700 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Course <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "course_name", label: "Name" },
          {
            key: "category",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          { key: "course_rating", label: "Rating" },
          { key: "course_fee", label: "Fee" },
          { key: "course_duration", label: "Duration" },
          {
            key: "course_image",
            label: "Image",
            render: (r) =>
              r.course_image ? (
                <img
                  src={r.course_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Class"
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
            course_category_id: String(row.course_category_id),
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      {/* Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Course" : "Create Course"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCourse(selected.course_id, fd);
          else await createCourse(fd);
        }}
        onSuccess={loadCourses}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourse(selected.course_id);
            setOpenDelete(false);
            loadCourses();
          }
        }}
        title="Delete Course"
        message={`Are you sure you want to delete "${selected?.course_name}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Course"
        data={viewData}
      />
    </div>
  );
}
