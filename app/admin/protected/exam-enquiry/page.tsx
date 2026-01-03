"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";
import { IconPlus } from "@tabler/icons-react";
import { getScholarshipExams } from "@/lib/api/scholarshipExam";
import {
  getExamRegistrations,
  getExamRegistrationById,
  createExamRegistration,
  updateExamRegistration,
  deleteExamRegistration,
} from "@/lib/api/examRegistration";

export default function ExamRegistrationPage() {
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
  const [examOptions, setExamOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const debouncedSearch = useDebounce(search, 500);

  const BRANCH_OPTIONS = [
    { label: "BALUSSERY - BLS", value: "BLS" },
    { label: "CALICUT - CLT", value: "CLT" },
    { label: "EDAPPAL - EDP", value: "EDP" },
    { label: "MALAPPURAM - MLP", value: "MLP" },
    { label: "MANJERI - MJI", value: "MJI" },
    { label: "NILAMBUR - NLB", value: "NLB" },
    { label: "PALAKKAD - PKD", value: "PKD" },
    { label: "PATTAMBI - PTB", value: "PTB" },
    { label: "PERINTHALMANNA - PTM", value: "PTM" },
    { label: "TIRUR - TR", value: "TR" },
  ];

  /* ===========================
     LOAD DATA
  ============================ */
  const loadRegistrations = async () => {
    try {
      const status =
        filters.status !== undefined && filters.status !== ""
          ? Number(filters.status)
          : undefined;

      const res = await getExamRegistrations(page, 10, debouncedSearch, status);

      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading exam registrations:", err);
    }
  };

  //load exam options
  const loadExamOptions = async () => {
    try {
      const res = await getScholarshipExams(1, 100, "", 1); 
      const options =
        res?.data?.map((e: any) => ({
          label: e.exam_title,
          value: String(e.exam_id),
        })) || [];

      setExamOptions(options);
    } catch (err) {
      console.error("Failed to load exams:", err);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    loadExamOptions();
  }, []);

  /* ===========================
     VIEW DETAILS
  ============================ */
  const handleRowClick = async (row: any) => {
    try {
      const res = await getExamRegistrationById(row.reg_id);
      if (!res?.data) return;

      const d = res.data;

      const formatted = {
        Name: d.name,
        Mobile: d.mobile,
        Email: d.email,
        "Date of Birth": d.date_of_birth
          ? new Date(d.date_of_birth).toLocaleDateString("en-IN")
          : "—",
        Branch: d.branch,
        "Exam Title": d.ScholarshipExam?.exam_title || "—",
        "Registration Code": d.registration_code,
        "ACE Student":
          d.is_ace_std === 1 ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Yes
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              No
            </span>
          ),
        Status:
          d.status === 1 ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              Inactive
            </span>
          ),
        "Created At": d.created_at
          ? new Date(d.created_at).toLocaleString("en-IN")
          : "—",
        "Updated At": d.updated_at
          ? new Date(d.updated_at).toLocaleString("en-IN")
          : "—",
      };

      setViewData(formatted);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load registration details:", err);
    }
  };

  /* ===========================
     FORM FIELDS
  ============================ */
  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "mobile", label: "Mobile", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      type: "date",
      required: true,
    },
    {
      name: "branch",
      label: "Branch",
      type: "select",
      required: true,
      options: BRANCH_OPTIONS,
    },
    {
      name: "exam_id",
      label: "Scholarship Exam",
      type: "select",
      required: true,
      options: examOptions,
    },

    { name: "address", label: "Address", type: "textarea" },
    {
      name: "is_ace_std",
      label: "ACE Student",
      type: "select",
      required: true,
      options: [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Exam Registrations
        </h1>

        <div className="flex items-center gap-3">
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
            className="bg-cyan-700 cursor-pointer flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Registration <IconPlus size={18} />
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
          { key: "name", label: "Name" },
          { key: "mobile", label: "Mobile" },
          {
            key: "exam",
            label: "Exam",
            render: (r) => r.ScholarshipExam?.exam_title || "—",
          },
          { key: "registration_code", label: "Reg Code" },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status === 1 ? (
                <div className="bg-green-100 text-green-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
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
        onRowClick={handleRowClick}
        onEdit={(row: any) => {
          setSelected({
            ...row,
            status: String(row.status),
            is_ace_std: String(row.is_ace_std),
            date_of_birth: row.date_of_birth?.split("T")[0],
          });
          setOpenForm(true);
        }}
        onDelete={(row: any) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

      {/* FORM */}
      <DynamicFormModal
        title={selected ? "Edit Registration" : "Create Registration"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          const raw = Object.fromEntries(fd.entries());

          const payload = {
            ...raw,
            status: Number(raw.status),
            is_ace_std: Number(raw.is_ace_std),
            exam_id: Number(raw.exam_id),
          };

          if (selected) {
            await updateExamRegistration(selected.reg_id, payload);
          } else {
            await createExamRegistration(payload);
          }
        }}
        onSuccess={loadRegistrations}
      />

      {/* DELETE */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteExamRegistration(selected.reg_id);
            setOpenDelete(false);
            loadRegistrations();
          }
        }}
        title="Delete Registration"
        message={`Are you sure you want to delete "${selected?.name}"?`}
      />

      {/* VIEW */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="Exam Registration Details"
        data={viewData}
      />
    </div>
  );
}
