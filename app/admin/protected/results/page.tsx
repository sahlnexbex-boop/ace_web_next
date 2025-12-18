"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";
import {
  getResults,
  createResult,
  updateResult,
  deleteResult,
  getResultById,
} from "@/lib/api/result";
import { getCourses } from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { IconPlus } from "@tabler/icons-react";

export default function ResultsPage() {
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
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [basedType, setBasedType] = useState<string>("");
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const debouncedSearch = useDebounce(search, 500);

  const loadCourses = async () => {
    try {
      const res = await getCourses(1, 100, "");
      setCourses(res?.data || []);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

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
    }
  };

  const loadResults = async () => {
    try {
      const { status, based_type, result_type, course_id, category_id } =
        filters;

      const res = await getResults(
        page,
        10,
        debouncedSearch,
        status,
        based_type,
        result_type,
        based_type === "1" ? course_id : undefined,
        based_type === "2" ? category_id : undefined
      );

      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading results:", err);
    }
  };

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, []);

  useEffect(() => {
    loadResults();
  }, [page, debouncedSearch, filters]);

  const courseOptions = courses.map((c) => ({
    label: c.course_name,
    value: String(c.course_id),
  }));

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const handleRowClick = async (row: any) => {
    try {
      const res = await getResultById(row.result_id);
      const r = res?.data || res;

      const formatted: Record<string, React.ReactNode> = {
        "Result Title": r.result_title,
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {r.result_description || "—"}
          </p>
        ),
        "Result Date": r.result_date
          ? new Date(r.result_date).toLocaleDateString("en-IN")
          : "—",
        "Result Type":
          r.result_type === 1 || r.result_type === "1"
            ? "Notification"
            : "Result",
        "Based On":
          r.based_type === 1 || r.based_type === "1"
            ? "Course"
            : r.based_type === 2 || r.based_type === "2"
            ? "Category"
            : "—",
        "Linked Course":
          r.course?.course_name ||
          (r.based_type === 1 ? "No linked course" : "—"),
        "Linked Course Category":
          r.category?.category_name ||
          (r.based_type === 2 ? "No linked category" : "—"),
        "Result File": r.result_file ? (
          <a
            href={server_url +r.result_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {server_url + r.result_file}
          </a>
        ) : (
          "—"
        ),
        Status:
          r.status === 1 || r.status === "1" ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Created At": r.created_at
          ? new Date(r.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": r.updated_at
          ? new Date(r.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Error fetching result details:", err);
    }
  };

  const fields = [
    {
      name: "result_title",
      label: "Result Title",
      type: "text",
      required: true,
    },
    {
      name: "result_description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    { name: "result_date", label: "Result Date", type: "date", required: true },
    {
      name: "result_type",
      label: "Result Type",
      type: "select",
      required: true,
      options: [
        { label: "Notification", value: "1" },
        { label: "Result", value: "2" },
      ],
    },
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
      label: "Select Course Category",
      type: "select",
      options: categoryOptions,
      required: false,
      disabled: basedType !== "2",
    },
    {
      name: "result_file",
      label: "Result File - (PDF)",
      type: "file",
      required: false,
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
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Results</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "based_type",
                label: "Based Type",
                type: "select",
                options: [
                  { label: "Course", value: "1" },
                  { label: "Category", value: "2" },
                ],
              },
              {
                key: "course_id",
                label: "Course",
                type: "select",
                options: courseOptions,
                showIf: { field: "based_type", value: "1" },
              },
              {
                key: "category_id",
                label: "Category",
                type: "select",
                options: categoryOptions,
                showIf: { field: "based_type", value: "2" },
              },
              {
                key: "result_type",
                label: "Result Type",
                type: "select",
                options: [
                  { label: "Notification", value: "1" },
                  { label: "Result", value: "2" },
                ],
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
              setBasedType("");
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
          >
            Create Result <IconPlus size={20} />
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
          { key: "result_title", label: "Title" },
          {
            key: "result_date",
            label: "Date",
            render: (r) =>
              r.result_date
                ? new Date(r.result_date).toLocaleDateString("en-IN")
                : "—",
          },
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
            key: "result_type",
            label: "Result Type",
            render: (r) => (r.result_type === 1 ? "Notification" : "Result"),
          },
          {
            key: "result_file",
            label: "File",
            render: (r) =>
              r.result_file ? (
                <a
                  href={server_url + r.result_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  View
                </a>
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status === 1 || r.status === "1" ? (
                <span className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </span>
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
            result_date: row.result_date
              ? new Date(row.result_date).toISOString().split("T")[0]
              : "",
            result_type: String(row.result_type),
            based_type: String(row.based_type),
            status: String(row.status),
            course_id: row.course_id ? String(row.course_id) : "",
            category_id: row.category_id ? String(row.category_id) : "",
          });
          setBasedType(String(row.based_type));
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleRowClick}
      />

      <DynamicFormModal
        title={selected ? "Edit Result" : "Create Result"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateResult(selected.result_id, fd);
          else await createResult(fd);
        }}
        onSuccess={loadResults}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Result"
        message={`Are you sure you want to delete "${selected?.result_title}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteResult(selected.result_id);
            setOpenDelete(false);
            loadResults();
          }
        }}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Result Details"
        data={viewData}
      />
    </div>
  );
}
