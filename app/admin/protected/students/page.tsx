"use client";

import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/api/student";

export default function StudentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const debouncedSearch = useDebounce(search, 500);

  /* ================= LOAD STUDENTS ================= */
  const loadData = async () => {
    try {
      const status =
        filters.status && filters.status !== ""
          ? Number(filters.status)
          : undefined;

      const res = await getStudents(page, 10, debouncedSearch, status);

      setData(res.data || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch, filters]);

  /* ================= VIEW HANDLER ================= */
  const handleView = async (row: any) => {
    const res = await getStudentById(row.std_id);
    const s = res?.data;

    const formatted = {
      "Student Name": s.std_name,
      Email: s.std_email,
      Phone: s.std_phone || "—",
      "Admission No": s.admission_no || "—",
      "Register No": s.registre_no || "—",
      "ACE Student": s.is_ace_std ? "Yes" : "No",
      Status:
        s.status == 1 ? (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
            Inactive
          </span>
        ),
      Photo: s.std_photo ? (
        <img
          src={server_url + s.std_photo}
          className="w-16 h-16 rounded object-cover"
        />
      ) : (
        "—"
      ),
    };

    setViewData(formatted);
    setOpenView(true);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Students</h1>

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
            Create Student <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "std_photo",
            label: "Photo",
            render: (r) =>
              r.std_photo ? (
                <img
                  src={server_url + r.std_photo}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                "—"
              ),
          },
          { key: "std_name", label: "Name" },
          { key: "std_email", label: "Email" },
          { key: "std_phone", label: "Phone" },
          {
            key: "is_ace_std",
            label: "ACE",
            render: (r) => (r.is_ace_std ? "Yes" : "No"),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 ? (
                <div className="bg-green-100 px-3 py-0.5 rounded-full w-fit">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 px-3 py-0.5 rounded-full w-fit">
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
            status: String(row.status),
            is_ace_std: row.is_ace_std ? "true" : "false",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      {/* ================= FORM MODAL ================= */}
      <DynamicFormModal
        title={selected ? "Edit Student" : "Create Student"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={[
          { name: "std_name", label: "Student Name", type: "text", required: true },
          { name: "std_email", label: "Email", type: "email", required: true },
          { name: "std_phone", label: "Phone", type: "text" },
          { name: "password", label: "Password", type: "password", required: !selected },
          { name: "admission_no", label: "Admission No", type: "text" },
          { name: "registre_no", label: "Register No", type: "text" },
          {
            name: "is_ace_std",
            label: "ACE Student",
            type: "select",
            options: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
          { name: "std_photo", label: "Student Photo", type: "file" },
        ]}
        defaultValues={selected}
        onSubmit={async (fd) => {
          if (selected) await updateStudent(selected.std_id, fd);
          else await createStudent(fd);
        }}
        onSuccess={loadData}
      />

      {/* ================= DELETE MODAL ================= */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Student"
        message={`Are you sure you want to delete "${selected?.std_name}"?`}
        onConfirm={async () => {
          if (selected) {
            await deleteStudent(selected.std_id);
            setOpenDelete(false);
            loadData();
          }
        }}
      />

      {/* ================= VIEW MODAL ================= */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Student"
        data={viewData}
      />
    </div>
  );
}
