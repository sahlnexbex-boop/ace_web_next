"use client";

import { useState, useEffect } from "react";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DataTable from "@/components/dynamicTable";
import { useDebounce } from "@/hooks/debounce";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategoryOptions,
} from "@/lib/api/course";

export default function CoursesPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const loadCourses = async () => {
    try {
      const res = await getCourses(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCourseCategoryOptions();
      setCategories(res || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadCourses(); }, [page, debouncedSearch]);

  const categoryOptions = categories.map(c => ({ label: c.category_name, value: String(c.category_id) }));

  const fields = [
    { name: "course_name", label: "Course Name", type: "text", required: true },
    { name: "course_description", label: "Course Description", type: "textarea", required: true },
    { name: "course_rating", label: "Course Rating", type: "text", required: true },
    { name: "course_category_id", label: "Category", type: "select", options: categoryOptions, required: true },
    { name: "course_duration", label: "Duration (Hours)", type: "text", required: true },
    { name: "course_fee", label: "Fee", type: "text", required: true },
    { name: "course_overview", label: "Overview", type: "textarea", required: false },
    { name: "course_syllabus", label: "Syllabus", type: "textarea", required: false },
    { name: "course_study_material", label: "Study Material", type: "textarea", required: false },
    { name: "course_syllabus_file", label: "Syllabus File", type: "file", required: false },
    { name: "course_questions_file", label: "Questions File", type: "file", required: false },
    { name: "course_image", label: "Course Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Courses</h1>
        <button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Course
        </button>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "course_id", label: "ID" },
          { key: "course_name", label: "Name" },
          { key: "course_category_id", label: "Category", render: r => r.category?.category_name || "—" },
          { key: "course_rating", label: "Rating" },
          { key: "course_fee", label: "Fee" },
          { key: "course_duration", label: "Duration" },
           { key: "course_image", label: "Image", render: r =>
            r.course_image ? <img src={r.course_image} className="w-10 h-10 object-cover rounded-full" /> : "—"
          },
          { key: "status", label: "Status", render: r => r.status ? (<div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">Active</div>): (<div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">Inactive</div>) },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => { setSelected({ ...row, course_category_id: String(row.course_category_id) }); setOpenForm(true); }}
        onDelete={(row) => { setSelected(row); setOpenDelete(true); }}
      />

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
    </div>
  );
}
