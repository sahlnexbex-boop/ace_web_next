"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import {
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryById,
} from "@/lib/api/enquiry";

export default function EnquiryPage() {
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

  // 🔹 Enquiry type & status mappings
  const enquiryTypeLabels: Record<number, string> = {
    1: "General",
    2: "Course",
    3: "Event",
    4: "Others",
  };

  const enquiryStatusLabels: Record<number, string> = {
    1: "Requested",
    2: "Ongoing",
    3: "Completed",
  };

  // 🔹 Load all Enquiries
  const loadEnquiries = async () => {
    try {
      const res = await getEnquiries(page, 10, debouncedSearch);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading enquiries:", err);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [page, debouncedSearch]);

  // 🔹 Handle row view
  const handleRowClick = async (row: any) => {
    try {
      const res = await getEnquiryById(row.enquiry_id);
      setViewData(res?.data || res);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load enquiry details", err);
    }
  };

  // 🔹 Form Fields
  const fields = [
    { name: "cstmr_name", label: "Customer Name", type: "text", required: true },
    { name: "cstmr_email", label: "Email", type: "email", required: true },
    { name: "cstmr_phone", label: "Phone", type: "text", required: true },
    {
      name: "enquiry_type",
      label: "Enquiry Type",
      type: "select",
      required: true,
      options: [
        { label: "General", value: "1" },
        { label: "Course", value: "2" },
        { label: "Event", value: "3" },
        { label: "Others", value: "4" },
      ],
    },
    {
      name: "enquiry_status",
      label: "Enquiry Status",
      type: "select",
      required: true,
      options: [
        { label: "Requested", value: "1" },
        { label: "Ongoing", value: "2" },
        { label: "Completed", value: "3" },
      ],
    },
    { name: "cstmr_message", label: "Message", type: "textarea", required: true },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-cyan-700">Enquiries</h1>
        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800"
        >
          Create Enquiry
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
          { key: "cstmr_name", label: "Name" },
          { key: "cstmr_email", label: "Email" },
          { key: "cstmr_phone", label: "Phone" },
          {
            key: "enquiry_type",
            label: "Type",
            render: (r: any) =>
              enquiryTypeLabels[r.enquiry_type] || "—",
          },
          {
            key: "enquiry_status",
            label: "Status",
            render: (r: any) => {
              const label = enquiryStatusLabels[r.enquiry_status] || "—";
              const color =
                r.enquiry_status === 1
                  ? "bg-yellow-100"
                  : r.enquiry_status === 2
                  ? "bg-blue-100"
                  : "bg-green-100";
              return (
                <div className={`${color} text-black w-fit px-3 py-0.5 rounded-full`}>
                  {label}
                </div>
              );
            },
          },
          {
            key: "cstmr_message",
            label: "Message",
            render: (r: any) => (
              <div className="truncate max-w-[250px]" title={r.cstmr_message}>
                {r.cstmr_message || "—"}
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
            enquiry_type: String(row.enquiry_type),
            enquiry_status: String(row.enquiry_status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleRowClick}
      />

      {/* Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Enquiry" : "Create Enquiry"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateEnquiry(selected.enquiry_id, fd);
          else await createEnquiry(fd);
        }}
        onSuccess={loadEnquiries}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteEnquiry(selected.enquiry_id);
            setOpenDelete(false);
            loadEnquiries();
          }
        }}
        title="Delete Enquiry"
        message={`Are you sure you want to delete "${selected?.cstmr_name}"?`}
      />

      {/* View Modal */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Enquiry Details"
        data={viewData}
      />
    </div>
  );
}
