"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";
import {
  getRankHolders,
  createRankHolder,
  updateRankHolder,
  deleteRankHolder,
  getRankHolderById,
} from "@/lib/api/rankHolders";
import { getCourses } from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { IconPlus } from "@tabler/icons-react";

export default function RankHoldersPage() {
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

  const debouncedSearch = useDebounce(search, 500);

  // --- Load Courses & Categories ---
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
      setCategories([]);
    }
  };

  // --- Load Rank Holders (with filters) ---
  const loadRankHolders = async () => {
    try {
      const { status, based_type, course_id, category_id, year, approval_status } = filters;

      const res = await getRankHolders(
        page,
        10,
        debouncedSearch,
        status ? Number(status) : undefined,
        based_type ? Number(based_type) : undefined,
        based_type === "1" ? Number(course_id) : undefined,
        based_type === "2" ? Number(category_id) : undefined,
        year ? Number(year) : undefined,
        approval_status ? Number(approval_status) : undefined
      );

      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading rank holders:", err);
    }
  };

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, []);

  useEffect(() => {
    loadRankHolders();
  }, [page, debouncedSearch, filters]);

  // --- Dropdown Options ---
  const courseOptions = courses.map((c) => ({
    label: c.course_name,
    value: String(c.course_id),
  }));

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  // --- View Modal ---
  const handleRowClick = async (row: any) => {
    try {
      const res = await getRankHolderById(row.rank_holder_id);
      const d = res?.data || res;

      const formattedData = {
        "Student Name": d.student_name || "—",
        "Student Photo": d.student_photo ? (
          <div className="flex justify-end">
            <img
              src={d.student_photo}
              alt="Student"
              className="w-14 h-14 object-cover rounded"
            />
          </div>
        ) : (
          "—"
        ),
        "Student Rank": d.student_rank || "—",
        "Based Type":
          d.based_type === 1
            ? "Course"
            : d.based_type === 2
            ? "Course Category"
            : "—",
        "Exam Name": d.exam_name || "—",
        Year: d.year || "—",
        "Joining Date": d.joining_date
          ? new Date(d.joining_date).toLocaleDateString()
          : "—",
        "Office Name": d.name_of_office || "—",
        Place: d.place || "—",
        "Phone No": d.phone_no || "—",
        "Approval Status":
          d.approval_status === 2
            ? "Approved"
            : d.approval_status === 3
            ? "Rejected"
            : "Pending",
        Status: d.status === 1 || d.status === "1" ? "Active" : "Inactive",
      };

      setViewData(formattedData);
      setOpenView(true);
    } catch (err) {
      console.error("Error fetching rank holder details:", err);
    }
  };

  // --- Form Fields ---
  const fields = [
    { name: "student_name", label: "Student Name", type: "text", required: true },
    { name: "student_rank", label: "Student Rank", type: "number", required: true },
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
    { name: "exam_name", label: "Exam Name", type: "text", required: true },
    { name: "joining_date", label: "Joining Date", type: "date", required: true },
    { name: "name_of_office", label: "Office Name", type: "text", required: true },
    { name: "place", label: "Place", type: "text", required: true },
    { name: "phone_no", label: "Phone No", type: "text", required: true },
    {
      name: "approval_status",
      label: "Approval Status",
      type: "select",
      options: [
        { label: "Pending", value: "1" },
        { label: "Approved", value: "2" },
        { label: "Rejected", value: "3" },
      ],
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
    { name: "year", label: "Year", type: "number", required: true },
    { name: "student_photo", label: "Student Photo", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Rank Holders</h1>

        <div className="flex items-center gap-3">
          {/* ✅ Filter Button */}
          <TableFilter
            fields={[
              {
                key: "based_type",
                label: "Based Type",
                type: "select",
                options: [
                  { label: "Course", value: "1" },
                  { label: "Course Category", value: "2" },
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
                key: "approval_status",
                label: "Approval Status",
                type: "select",
                options: [
                  { label: "Pending", value: "1" },
                  { label: "Approved", value: "2" },
                  { label: "Rejected", value: "3" },
                ],
              },
              {
                key: "year",
                label: "Year",
                type: "year", // 👈 Year-only picker
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

          {/* Create Button */}
          <button
            onClick={() => {
              setSelected(null);
              setBasedType("");
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Rank Holder <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "student_name", label: "Student Name" },
          { key: "student_rank", label: "Rank" },
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
          { key: "exam_name", label: "Exam Name" },
          {
            key: "student_photo",
            label: "Photo",
            render: (r) =>
              r.student_photo ? (
                <img
                  src={r.student_photo}
                  alt="Student"
                  className="w-10 h-10 object-cover rounded-md"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "approval_status",
            label: "Approval",
            render: (r) =>
              r.approval_status === 2 ? (
                <span className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Approved
                </span>
              ) : r.approval_status === 3 ? (
                <span className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Rejected
                </span>
              ) : (
                <span className="bg-yellow-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Pending
                </span>
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
            based_type: String(row.based_type),
            approval_status: String(row.approval_status),
            status: String(row.status),
            year: String(row.year),
            joining_date: row.joining_date
              ? new Date(row.joining_date).toISOString().split("T")[0]
              : "",
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

      {/* Modals */}
      <DynamicFormModal
        title={selected ? "Edit Rank Holder" : "Create Rank Holder"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateRankHolder(selected.rank_holder_id, fd);
          else await createRankHolder(fd);
        }}
        onSuccess={loadRankHolders}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Rank Holder"
        message={`Are you sure you want to delete "${selected?.student_name}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteRankHolder(selected.rank_holder_id);
            setOpenDelete(false);
            loadRankHolders();
          }
        }}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Rank Holder Details"
        data={viewData}
      />
    </div>
  );
}
