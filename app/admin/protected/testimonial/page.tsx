"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/api/testimonial";

export default function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const loadTestimonials = async () => {
    try {
      const res = await getTestimonials(page, 10, debouncedSearch);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading testimonials:", err);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [page, debouncedSearch]);

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
    { name: "image_of_candidate", label: "Candidate Image", type: "file", required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Testimonials</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Testimonial
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: "sno", label: "S.No", render: (_, i) => i + 1 + (page - 1) * 10 },
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
                {r.content}
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status === 1 || r.status === "1" ? (
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
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

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
    </div>
  );
}
