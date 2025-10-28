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
  getCourseCategories,
  getCourseCategoryById,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
} from "@/lib/api/courseCategory";
import { getCourseTypes } from "@/lib/api/courseType";

export default function CourseCategoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [courseTypes, setCourseTypes] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ status?: string; type_id?: string }>(
    {}
  );

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load Course Types
  const loadCourseTypes = async () => {
    try {
      const res = await getCourseTypes(1, "");
      setCourseTypes(res.data || []);
    } catch (err) {
      console.error("Error loading course types:", err);
    }
  };

  // ✅ Load Course Categories
  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(page, 10, debouncedSearch, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCourseTypes();
  }, []);

  useEffect(() => {
    loadCategories();
  }, [page, debouncedSearch, filters]);

  const typeOptions = courseTypes.map((t) => ({
    label: t.type_name,
    value: String(t.type_id),
  }));

  // ✅ Handle View
  const handleView = async (row: any) => {
    try {
      const res = await getCourseCategoryById(row.category_id);
      if (!res?.data) return;
      const c = res.data;

      const formatted = {
        "Category Name": c.category_name || "—",
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {c.category_description || "—"}
          </p>
        ),
        "Course Type": c.courseType?.type_name || "—",
        "Category Image": c.category_image ? (
          <div className="flex justify-end">
            <img
              src={c.category_image}
              alt="Category"
              className="w-16 h-16 rounded object-cover"
            />
          </div>
        ) : (
          "—"
        ),
        Status:
          c.status === 1 || c.status === "1" ? (
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
    } catch (err) {
      console.error("Error fetching category details:", err);
    }
  };

  // ✅ Form Fields
  const fields = [
    {
      name: "category_name",
      label: "Category Name",
      type: "text",
      required: true,
    },
    {
      name: "category_description",
      label: "Category Description",
      type: "textarea",
      required: true,
    },
    {
      name: "course_type_id",
      label: "Course Type",
      type: "select",
      options: typeOptions,
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
    {
      name: "category_image",
      label: "Category Image",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Course Categories
        </h1>

        <div className="flex items-center gap-3">
          {/* ✅ Reusable Filter Component */}
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
                key: "type_id", // ✅ backend expects `type_id`, not `course_type_id`
                label: "Course Type",
                options: typeOptions,
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
            Create Category <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ✅ Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "category_name", label: "Name" },
          { key: "category_description", label: "Description" },
          {
            key: "courseType.type_name",
            label: "Course Type",
            render: (r) => r.courseType?.type_name || "—",
          },
          {
            key: "category_image",
            label: "Image",
            render: (r) =>
              r.category_image ? (
                <img
                  src={r.category_image}
                  className="w-10 h-10 object-cover rounded-full"
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
            course_type_id: String(row.course_type_id),
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

      {/* ✅ Form Modal */}
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

      {/* ✅ Delete Modal */}
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

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Course Category"
        data={viewData}
      />
    </div>
  );
}
