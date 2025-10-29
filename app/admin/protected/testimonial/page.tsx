"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/api/testimonial";

export default function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{ status?: string }>({});
  const debouncedSearch = useDebounce(search, 500);

  // ✅ Load Testimonials
  const loadTestimonials = async () => {
    try {
      const res = await getTestimonials(page, 10, debouncedSearch, filters);
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error loading testimonials:", err);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [page, debouncedSearch, filters]);

  // ✅ View Logic
  const handleView = async (row: any) => {
    try {
      const res = await getTestimonialById(row.testimonial_id);
      if (res?.data) {
        const t = res.data;

        const formatted = {
          "Candidate Name": t.name_of_candidate || "—",
          Position: t.position_of_candidate || "—",
          Content: <p className="text-gray-700 whitespace-pre-line">{t.content || "—"}</p>,
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
          "Candidate Image": t.image_of_candidate ? (
            <div className="flex justify-end">
              <img
                src={t.image_of_candidate}
                alt={t.name_of_candidate}
                className="w-16 h-16 object-cover rounded"
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
    } catch (err) {
      console.error("Error fetching testimonial details:", err);
    }
  };

  // ✅ Form Fields
  const fields = [
    { name: "name_of_candidate", label: "Candidate Name", type: "text", required: true },
    { name: "position_of_candidate", label: "Position", type: "text", required: true },
    { name: "content", label: "Content", type: "textarea", required: true },
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
      name: "image_of_candidate",
      label: "Candidate Image",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Testimonials</h1>

        <div className="flex items-center gap-3">
          {/* ✅ Filter Button */}
          <TableFilter
            fields={[
              {
                key: "status",
                label: "Status",
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

          {/* ✅ Create Button */}
          <button
            onClick={() => {
              setSelected(null);
              setOpenForm(true);
            }}
            className="bg-cyan-700 flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Testimonial <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* ✅ Data Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
          { key: "name_of_candidate", label: "Candidate Name" },
          { key: "position_of_candidate", label: "Position" },
          {
            key: "image_of_candidate",
            label: "Image",
            render: (r) =>
              r.image_of_candidate ? (
                <img
                  src={r.image_of_candidate}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Candidate"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "content",
            label: "Content",
            render: (r) => (
              <div className="truncate max-w-[250px]" title={r.content}>
                {r.content || "—"}
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status == 1 || r.status === "1" ? (
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
          setSelected({ ...row, status: String(row.status) });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      {/* ✅ Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Testimonial" : "Create Testimonial"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateTestimonial(selected.testimonial_id, fd);
          else await createTestimonial(fd);
        }}
        onSuccess={loadTestimonials}
      />

      {/* ✅ Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteTestimonial(selected.testimonial_id);
            setOpenDelete(false);
            loadTestimonials();
          }
        }}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${selected?.name_of_candidate}"?`}
      />

      {/* ✅ View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Testimonial"
        data={viewData}
      />
    </div>
  );
}
