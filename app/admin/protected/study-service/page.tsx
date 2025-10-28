"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getStudyServices,
  getStudyServiceById,
  createStudyService,
  updateStudyService,
  deleteStudyService,
  getStudyCategoryOptions,
} from "@/lib/api/studyService";
import { IconPlus } from "@tabler/icons-react";

const study_service_type: Record<number, string> = {
  1: "Syllabus",
  2: "Study Materials",
  3: "Previous Papers",
  4: "Model Papers",
  5: "Answer Keys",
};

export default function StudyServicePage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const loadCategories = async () => {
    try {
      const res = await getStudyCategoryOptions();
      setCategories(res || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadServices = async () => {
    try {
      const res = await getStudyServices(page, 10, debouncedSearch);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("StudyService fetch error:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, [page, debouncedSearch]);

  const categoryOptions = categories.map((c) => ({
    label: c.category_name,
    value: String(c.category_id),
  }));

  const serviceTypeOptions = Object.entries(study_service_type).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  // ✅ Handle View (open modal)
  const handleView = async (row: any) => {
    try {
      const res = await getStudyServiceById(row.service_id);
      if (res?.data) {
        const s = res.data;

        const formatted: Record<string, React.ReactNode> = {
          "Service Title": s.service_title || "—",
          Description: (
            <p className="text-gray-700 whitespace-pre-line">
              {s.service_description || "—"}
            </p>
          ),
          Category: s.category?.category_name || "—",
          "Service Type": study_service_type[s.service_type] || "—",
          "Subject Name": s.subject_name || "—",
          "Exam Name": s.exam_name || "—",
          "Service File": s.service_file ? (
            <a
              href={s.service_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
              {s.service_file}
            </a>
          ) : (
            "—"
          ),
          Status:
            s.status === 1 || s.status === "1" ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                Inactive
              </span>
            ),
          "Created At": s.created_at
            ? new Date(s.created_at).toLocaleString("en-IN")
            : "—",
          "Updated At": s.updated_at
            ? new Date(s.updated_at).toLocaleString("en-IN")
            : "—",
        };

        setViewData(formatted);
        setOpenView(true);
      }
    } catch (err) {
      console.error("Error fetching study service details:", err);
    }
  };

  const fields = [
    {
      name: "service_title",
      label: "Service Title",
      type: "text",
      required: true,
    },
    {
      name: "service_description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categoryOptions,
      required: true,
    },
    {
      name: "service_type",
      label: "Service Type",
      type: "select",
      options: serviceTypeOptions,
      required: true,
    },
    {
      name: "subject_name",
      label: "Subject Name",
      type: "text",
      required: true,
    },
    { name: "exam_name", label: "Exam Name", type: "text", required: true },
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
      name: "service_file",
      label: "Service File",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Study Services</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
        >
          Create Service <IconPlus size={20} />
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
          // { key: "service_id", label: "ID" },
          { key: "service_title", label: "Title" },
          {
            key: "category_id",
            label: "Category",
            render: (r) => r.category?.category_name || "—",
          },
          {
            key: "service_type",
            label: "Type",
            render: (r) => study_service_type[r.service_type] || "—",
          },
          { key: "subject_name", label: "Subject" },
          { key: "exam_name", label: "Exam" },
          {
            key: "service_file",
            label: "File",
            render: (r) =>
              r.service_file ? (
                <a
                  href={r.service_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 underline"
                >
                  View File
                </a>
              ) : (
                "—"
              ),
          },
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
            category_id: String(row.category_id),
            service_type: String(row.service_type),
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView} // ✅ Row click opens view modal
      />

      {/* Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Study Service" : "Create Study Service"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateStudyService(selected.service_id, fd);
          else await createStudyService(fd);
        }}
        onSuccess={loadServices}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteStudyService(selected.service_id);
            setOpenDelete(false);
            loadServices();
          }
        }}
        title="Delete Study Service"
        message={`Are you sure you want to delete "${selected?.service_title}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Study Service"
        data={viewData}
      />
    </div>
  );
}
