"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getCurrentAffairs,
  createCurrentAffair,
  updateCurrentAffair,
  deleteCurrentAffair,
} from "@/lib/api/current-affair";

import { getCourseCategories } from "@/lib/api/courseCategory";

export default function CurrentAffairPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const loadAffairs = async () => {
    try {
      const res = await getCurrentAffairs(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading affairs:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCourseCategories(1, 100);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadAffairs(); }, [page, debouncedSearch]);

  const categoryOptions = categories.map(c => ({ label: c.category_name, value: String(c.category_id) }));

  const fields = [
    { name: "affair_title", label: "Title", type: "text", required: true },
    { name: "affair_description", label: "Description", type: "textarea", required: true },
    { name: "affair_price", label: "Price", type: "text", required: true },
    { name: "publishing_date", label: "Publishing Date", type: "date", required: true, placeholder: "YYYY-MM-DD" },
    { name: "category_id", label: "Category", type: "select", options: categoryOptions, required: true },
    { name: "status", label: "Status", type: "select", options: [{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }], required: true },
    { name: "affair_file", label: "File", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Current Affairs</h1>
        <button
          onClick={() => { setSelected(null); setOpenForm(true); }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Affair
        </button>
      </div>

      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, idx) => idx + 1 + (page - 1) * 10 },
          { key: "affair_id", label: "ID" },
          { key: "affair_title", label: "Title" },
          { key: "affair_price", label: "Price" },
          { key: "publishing_date", label: "Publishing Date", render: r => new Date(r.publishing_date).toLocaleDateString() },
          { key: "category_id", label: "Category", render: r => r.category?.category_name || "—" },
          { key: "status", label: "Status", render: r => r.status ? (<div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">Active</div>) : (<div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">Inactive</div>) },
        ]}
        data={data}
        page={page}
        totalPages={totalPages}
        search={search}
        setPage={setPage}
        setSearch={setSearch}
        onEdit={(row) => { setSelected({ ...row, status: String(row.status), category_id: String(row.category_id) }); setOpenForm(true); }}
        onDelete={(row) => { setSelected(row); setOpenDelete(true); }}
      />

      <DynamicFormModal
        title={selected ? "Edit Affair" : "Create Affair"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateCurrentAffair(selected.affair_id, fd);
          else await createCurrentAffair(fd);
        }}
        onSuccess={loadAffairs}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCurrentAffair(selected.affair_id);
            setOpenDelete(false);
            loadAffairs();
          }
        }}
        title="Delete Affair"
        message={`Are you sure you want to delete "${selected?.affair_title}"?`}
      />
    </div>
  );
}
