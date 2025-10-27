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

// Label maps
const ENQUIRY_TYPE: Record<number, string> = {
  1: "General",
  2: "Course",
  3: "Event",
  4: "Others",
};

const ENQUIRY_STATUS: Record<number, string> = {
  1: "Requested",
  2: "Ongoing",
  3: "Completed",
};

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

  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [statusTypeFilter, setStatusTypeFilter] = useState<number | undefined>();

  const debouncedSearch = useDebounce(search, 500);

  const loadEnquiries = async () => {
    try {
      const res = await getEnquiries(
        page,
        10,
        debouncedSearch,
        statusFilter,
        typeFilter,
        statusTypeFilter
      );
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading enquiries:", err);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [page, debouncedSearch, statusFilter, typeFilter, statusTypeFilter]);

  // Row click handler for dynamic view modal
  const handleRowClick = async (row: any) => {
    try {
      const res = await getEnquiryById(row.enquiry_id);
      setViewData(res?.data || res);
      setOpenView(true);
    } catch (err) {
      console.error("Failed to load enquiry details", err);
    }
  };

  const fields = [
    { name: "cstmr_name", label: "Customer Name", type: "text", required: true },
    { name: "cstmr_email", label: "Email", type: "email", required: true },
    { name: "cstmr_phone", label: "Phone Number", type: "text", required: true },
    {
      name: "cstmr_message",
      label: "Message",
      type: "textarea",
      required: true,
    },
    {
      name: "enquiry_type",
      label: "Enquiry Type",
      type: "select",
      required: true,
      options: Object.entries(ENQUIRY_TYPE).map(([val, label]) => ({
        value: val,
        label,
      })),
    },
    {
      name: "enquiry_status",
      label: "Enquiry Status",
      type: "select",
      required: true,
      options: Object.entries(ENQUIRY_STATUS).map(([val, label]) => ({
        value: val,
        label,
      })),
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
          { key: "cstmr_name", label: "Customer Name" },
          { key: "cstmr_phone", label: "Phone" },
          {
            key: "enquiry_type",
            label: "Type",
            render: (r) => ENQUIRY_TYPE[r.enquiry_type] || "—",
          },
          {
            key: "enquiry_status",
            label: "Update Status",
            render: (r) => ENQUIRY_STATUS[r.enquiry_status] || "—",
          },
          {
            key: "submit_date",
            label: "Submitted On",
            render: (r) =>
              r.submit_date
                ? new Date(r.submit_date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—",
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
        onRowClick={handleRowClick}
        onEdit={(row) => {
          setSelected({
            ...row,
            status: String(row.status),
            enquiry_type: String(row.enquiry_type),
            enquiry_status: String(row.enquiry_status),
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

      {/* Form Modal */}
      <DynamicFormModal
        title={selected ? "Edit Enquiry" : "Create Enquiry"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          const plainObj = Object.fromEntries(fd.entries());
          if (selected) await updateEnquiry(selected.enquiry_id, plainObj);
          else await createEnquiry(plainObj);
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
