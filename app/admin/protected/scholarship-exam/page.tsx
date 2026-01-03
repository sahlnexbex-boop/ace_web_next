"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";
import { IconPlus } from "@tabler/icons-react";

import {
  getScholarshipExams,
  getScholarshipExamById,
  createScholarshipExam,
  updateScholarshipExam,
  deleteScholarshipExam,
} from "@/lib/api/scholarshipExam";

const BASE_IMG = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function ScholarshipExamPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const debouncedSearch = useDebounce(search, 500);

  /* ================= LOAD DATA ================= */
  const loadExams = async () => {
    const status =
      filters.status !== undefined && filters.status !== ""
        ? Number(filters.status)
        : undefined;

    const res = await getScholarshipExams(page, 10, debouncedSearch, status);
    setData(res?.data || []);
    setTotalPages(res?.totalPages || 1);
  };

  useEffect(() => {
    loadExams();
  }, [page, debouncedSearch, filters]);

  /* ================= VIEW ================= */
  const handleRowClick = async (row: any) => {
    const res = await getScholarshipExamById(row.exam_id);
    if (!res?.data) return;

    const d = res.data;

    setViewData({
      Image: d.exam_image ? (
        <Image
          src={BASE_IMG + d.exam_image}
          alt="Exam Image"
          width={320}
          height={200}
          className="rounded-md object-cover"
        />
      ) : (
        "—"
      ),
      "Exam Title": d.exam_title,
      Description: d.exam_description || "—",
      "Exam Date": new Date(d.exam_date).toLocaleDateString("en-IN"),
      "Exam Time": d.exam_time,
      Location: d.exam_location,
      "Last Apply Date": new Date(d.last_apply_date).toLocaleDateString(
        "en-IN"
      ),
      Status: d.status === 1 ? "Active" : "Inactive",
    });

    setOpenView(true);
  };

  /* ================= FORM FIELDS ================= */
  const fields = [
    { name: "exam_title", label: "Exam Title", type: "text", required: true },
    {
      name: "exam_description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    { name: "exam_date", label: "Exam Date", type: "date", required: true },
    {
      name: "exam_time",
      label: "Exam Time",
      type: "text",
      required: true,
      placeholder: "10:00 AM - 12:00 PM",
    },
    {
      name: "exam_location",
      label: "Location",
      type: "text",
      required: true,
    },
    {
      name: "last_apply_date",
      label: "Last Apply Date",
      type: "date",
      required: true,
    },
    {
      name: "exam_image",
      label: "Exam Image",
      type: "file",
      accept: "image/*",
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
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Scholarship Exams
        </h1>

        <div className="flex gap-3">
          <TableFilter
            fields={[
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
            className="bg-cyan-700 cursor-pointer text-white px-4 py-2 rounded-md flex gap-2"
          >
            Create Exam <IconPlus size={18} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "exam_title", label: "Title" },
          {
            key: "exam_date",
            label: "Date",
            render: (r) => new Date(r.exam_date).toLocaleDateString("en-IN"),
          },
          { key: "exam_time", label: "Time" },
          { key: "exam_location", label: "Location" },
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
        onRowClick={handleRowClick}
        onEdit={(row) => {
          setSelected({
            ...row,
            exam_date: row.exam_date?.split("T")[0],
            last_apply_date: row.last_apply_date?.split("T")[0],
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

      {/* FORM */}
      <DynamicFormModal
        title={selected ? "Edit Exam" : "Create Exam"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          // IMPORTANT: DO NOT CONVERT TO OBJECT
          if (selected) {
            await updateScholarshipExam(selected.exam_id, fd);
          } else {
            await createScholarshipExam(fd);
          }
        }}
        onSuccess={loadExams}
      />

      {/* DELETE */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteScholarshipExam(selected.exam_id);
          setOpenDelete(false);
          loadExams();
        }}
        title="Delete Exam"
        message={`Delete "${selected?.exam_title}"?`}
      />

      {/* VIEW */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Scholarship Exam Details"
        data={viewData}
      />
    </div>
  );
}
