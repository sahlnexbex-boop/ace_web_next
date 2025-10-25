"use client";

import { useState, useEffect } from "react";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DataTable from "@/components/dynamicTable";
import { useDebounce } from "@/hooks/debounce";

import {
  getCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
} from "@/lib/api/courseCategory";

import { getCourseTypes } from "@/lib/api/courseType";

export default function CourseCategoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [courseTypes, setCourseTypes] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadCourseTypes = async () => {
    try {
      const res = await getCourseTypes(1, "");
      setCourseTypes(res.data || []);
    } catch (err) {
      console.error("Error loading course types:", err);
    }
  };

  useEffect(() => { loadCourseTypes(); }, []);
  useEffect(() => { loadCategories(); }, [page, debouncedSearch]);

  const typeOptions = courseTypes.map(t => ({ label: t.type_name, value: String(t.type_id) }));

  const fields = [
    { name: "category_name", label: "Category Name", type: "text", required: true },
    { name: "category_description", label: "Category Description", type: "textarea", required: true },
    { name: "course_type_id", label: "Course Type", type: "select", options: typeOptions, required: true },
    { name: "category_image", label: "Category Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Course Categories</h1>
        <button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Category
        </button>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "category_id", label: "ID" },
          { key: "category_name", label: "Name" },
          { key: "category_description", label: "Description" },
          { key: "courseType.type_name", label: "Course Type", render: r => r.courseType?.type_name || "—" },
          { key: "category_image", label: "Image", render: r =>
            r.category_image ? <img src={r.category_image} className="w-10 h-10 object-cover rounded-full" /> : "—"
          },
          // { key: "created_at", label: "Created At", render: r =>
          //   new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
          // },
          { key: "status", label: "Status", render: (r) => r.status ? (<div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">Active</div>): (<div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">Inactive</div>) },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => { setSelected({ ...row, course_type_id: String(row.course_type_id) }); setOpenForm(true); }}
        onDelete={(row) => { setSelected(row); setOpenDelete(true); }}
      />

      <DynamicFormModal
        title={selected ? "Edit Category" : "Create Category"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCourseCategory(selected.category_id, fd);
          else await createCourseCategory(fd);
        }}
        onSuccess={loadCategories}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourseCategory(selected.category_id);
            setOpenDelete(false);
            loadCategories();
          }
        }}
        title="Delete Category"
        message={`Are you sure you want to delete "${selected?.category_name}"?`}
      />
    </div>
  );
}
