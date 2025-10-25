"use client";

import { useState, useEffect } from "react";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DataTable from "@/components/dynamicTable";
import { useDebounce } from "@/hooks/debounce";

import {
  getCourseTypes,
  createCourseType,
  updateCourseType,
  deleteCourseType,
} from "@/lib/api/courseType";

export default function CourseTypesPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const loadData = async () => {
    try {
      const res = await getCourseTypes(page, debouncedSearch, 10);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading course types:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch]);

  const fields = [
    { name: "type_name", label: "Course Type Name", type: "text", required: true },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Course Types</h1>
        <button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Course Type
        </button>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "type_id", label: "ID" },
          { key: "type_name", label: "Type Name" },
          { key: "created_at", label: "Created At", render: (r) =>
            new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
          },
          { key: "status", label: "Status", render: (r) => r.status ? (<div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">Active</div>): (<div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">Inactive</div>) },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => { setSelected(row); setOpenForm(true); }}
        onDelete={(row) => { setSelected(row); setOpenDelete(true); }}
      />

      <DynamicFormModal
        title={selected ? "Edit Course Type" : "Create Course Type"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          const payload = { type_name: fd.get("type_name") };
          if (selected) await updateCourseType(selected.type_id, payload);
          else await createCourseType(payload);
        }}
        onSuccess={loadData}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourseType(selected.type_id);
            setOpenDelete(false);
            loadData();
          }
        }}
        title="Delete Course Type"
        message={`Are you sure you want to delete "${selected?.type_name}"?`}
      />
    </div>
  );
}
