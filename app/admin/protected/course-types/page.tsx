"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import { IconPlus } from "@tabler/icons-react";

import {
  getCourseTypes,
  getCourseTypeById,
  createCourseType,
  updateCourseType,
  deleteCourseType,
} from "@/lib/api/courseType";

export default function CourseTypesPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load Course Types
  const loadCourseTypes = async () => {
    try {
      const res = await getCourseTypes(page, debouncedSearch, 10);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading course types:", err);
    }
  };

  useEffect(() => {
    loadCourseTypes();
  }, [page, debouncedSearch]);

  // ✅ Handle View (fetch single type and format)
  const handleView = async (row: any) => {
    try {
      const res = await getCourseTypeById(row.type_id);
      if (res?.data) {
        const t = res.data;

        const formatted: Record<string, React.ReactNode> = {
          "Type ID": t.type_id || "—",
          "Type Name": t.type_name || "—",
          Status:
            t.status == 1 || t.status == "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
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
    } catch (err) {
      console.error("Error fetching course type details:", err);
    }
  };

  // ✅ Form Fields
  const fields = [
    {
      name: "type_name",
      label: "Course Type Name",
      type: "text",
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
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-semibold text-cyan-700">Course Types</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
        >
          Create Type <IconPlus size={20} />
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
          { key: "type_name", label: "Type Name" },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status == "1" ? (
                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </div>
              ) : (
                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </div>
              ),
          },
          {
            key: "created_at",
            label: "Created At",
            render: (r) =>
              new Date(r.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
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
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView} // ✅ Click row to open View Modal
      />

      {/* Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Course Type" : "Create Course Type"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          const payload = {
            type_name: fd.get("type_name"),
            status: fd.get("status"),
          };
          if (selected)
            await updateCourseType(selected.type_id, payload);
          else await createCourseType(payload);
        }}
        onSuccess={loadCourseTypes}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteCourseType(selected.type_id);
            setOpenDelete(false);
            loadCourseTypes();
          }
        }}
        title="Delete Course Type"
        message={`Are you sure you want to delete "${selected?.type_name}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Course Type"
        data={viewData}
      />
    </div>
  );
}
