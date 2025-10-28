"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getToppers,
  getTopperById,
  createTopper,
  updateTopper,
  deleteTopper,
} from "@/lib/api/topper";
import { getCourses } from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { IconPlus } from "@tabler/icons-react";

export default function ToppersPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [basedType, setBasedType] = useState<string>("");

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load toppers
  const loadToppers = async () => {
    try {
      const res = await getToppers(page, 10, debouncedSearch);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading toppers:", err);
    }
  };

  // ✅ Load courses
  const loadCourses = async () => {
    try {
      const res = await getCourses(1, 100, "");
      setCourses(res?.data || []);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  // ✅ Load course categories
  const loadCategories = async () => {
    try {
      const res = await getCourseCategories();
      const arr = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setCategories(arr);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadToppers();
    loadCourses();
    loadCategories();
  }, [page, debouncedSearch]);

  const courseOptions = courses.map((c: any) => ({
    label: c.course_name,
    value: String(c.course_id),
  }));

  const categoryOptions = categories.map((c: any) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  // ✅ View details handler
  const handleView = async (row: any) => {
    try {
      const res = await getTopperById(row.topper_id);
      if (res?.data) {
        const t = res.data;

        const formatted: Record<string, React.ReactNode> = {
          "Topper Name": t.topper_name || "—",
          "Exam Name": t.exam_name || "—",
          Rank: t.topper_rank || "—",
          Year: t.year || "—",
          "Based Type":
            t.based_type === 1 || t.based_type === "1"
              ? "Course"
              : t.based_type === 2 || t.based_type === "2"
              ? "Category"
              : "—",
          "Course / Category":
            t.based_type === 1
              ? t.course?.course_name || "—"
              : t.category?.category_name || "—",
          Status:
            t.status === 1 || t.status === "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
            ),
          "Topper Image": t.topper_image ? (
            <div className="flex justify-end">
            <img
              src={t.topper_image}
              alt="Topper"
              className="w-16 h-16 rounded object-cover"
            />
            </div>
          ) : (
            "—"
          ),
          "Created At": t.created_at
            ? new Date(t.created_at).toLocaleString("en-IN")
            : "—",
          "Updated At": t.updated_at
            ? new Date(t.updated_at).toLocaleString("en-IN")
            : "—",
        };

        setViewData(formatted);
        setOpenView(true);
      }
    } catch (error) {
      console.error("Error fetching topper details:", error);
    }
  };

  // ✅ Form fields
  const fields = [
    { name: "topper_name", label: "Topper Name", type: "text", required: true },
    { name: "topper_rank", label: "Rank", type: "number", required: true },
    { name: "year", label: "Year", type: "number", required: true },
    { name: "exam_name", label: "Exam Name", type: "text", required: true },
    {
      name: "based_type",
      label: "Based Type",
      type: "select",
      required: true,
      options: [
        { label: "Course", value: "1" },
        { label: "Course Category", value: "2" },
      ],
      onChange: (val: string) => setBasedType(val),
    },
    {
      name: "course_id",
      label: "Select Course",
      type: "select",
      options: courseOptions,
      required: false,
      disabled: basedType !== "1",
    },
    {
      name: "category_id",
      label: "Select Category",
      type: "select",
      options: categoryOptions,
      required: false,
      disabled: basedType !== "2",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
    {
      name: "topper_image",
      label: "Topper Image",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Toppers</h1>
        <button
          onClick={() => {
            setSelected(null);
            setBasedType("");
            setOpenForm(true);
          }}
          className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
        >
          Create Topper <IconPlus size={20} />
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "topper_name", label: "Topper Name" },
          { key: "exam_name", label: "Exam Name" },
          { key: "topper_rank", label: "Rank" },
          { key: "year", label: "Year" },
          {
            key: "based_type",
            label: "Based On",
            render: (r) =>
              r.based_type === 1
                ? "Course"
                : r.based_type === 2
                ? "Course Category"
                : "—",
          },
          {
            key: "topper_image",
            label: "Image",
            render: (r) =>
              r.topper_image ? (
                <img
                  src={r.topper_image}
                  alt="Topper"
                  className="w-10 h-10 object-cover rounded-md"
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
            based_type: String(row.based_type),
            course_id: row.course_id ? String(row.course_id) : "",
            category_id: row.category_id ? String(row.category_id) : "",
            status: String(row.status),
            year: String(row.year),
          });
          setBasedType(String(row.based_type));
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
        title={selected ? "Edit Topper" : "Create Topper"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateTopper(selected.topper_id, fd);
          else await createTopper(fd);
        }}
        onSuccess={loadToppers}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Topper"
        message={`Are you sure you want to delete "${selected?.topper_name}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteTopper(selected.topper_id);
            setOpenDelete(false);
            loadToppers();
          }
        }}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Topper Details"
        data={viewData}
      />
    </div>
  );
}
