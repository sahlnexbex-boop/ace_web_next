"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";
import {
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryById,
} from "@/lib/api/enquiry";
import { IconPlus } from "@tabler/icons-react";

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
  const [filters, setFilters] = useState<Record<string, string>>({});

  const debouncedSearch = useDebounce(search, 500);

  const loadEnquiries = async () => {
    try {
      const { status, enquiry_type, enquiry_status } = filters;

      const res = await getEnquiries(
        page,
        10,
        debouncedSearch,
        status ? Number(status) : undefined,
        enquiry_type ? Number(enquiry_type) : undefined,
        enquiry_status ? Number(enquiry_status) : undefined
      );

      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading enquiries:", err);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [page, debouncedSearch, filters]);

  const handleRowClick = async (row: any) => {
    try {
      const res = await getEnquiryById(row.enquiry_id);
      if (!res?.data) return;

      const d = res.data;

      const formatted: Record<string, React.ReactNode> = {
        "Customer Name": d.cstmr_name || "—",
        Email: d.cstmr_email || "—",
        Phone: d.cstmr_phone || "—",
        Message: (
          <p className="text-gray-700 whitespace-pre-line">
            {d.cstmr_message || "—"}
          </p>
        ),
        "Enquiry Type": ENQUIRY_TYPE[d.enquiry_type] || "—",

        "Enquiry Status":
          d.enquiry_status === 1 ? (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
              Requested
            </span>
          ) : d.enquiry_status === 2 ? (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
              Ongoing
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              Completed
            </span>
          ),

        "Submitted On": d.submit_date
          ? new Date(d.submit_date).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "—",

        Status:
          d.status === 1 || d.status === "1" ? (
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
      console.error("Failed to load enquiry details", err);
    }
  };

  const fields = [
    {
      name: "cstmr_name",
      label: "Customer Name",
      type: "text",
      required: true,
    },
    { name: "cstmr_email", label: "Email", type: "email", required: true },
    {
      name: "cstmr_phone",
      label: "Phone Number",
      type: "text",
      required: true,
    },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Enquiries</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
              {
                key: "enquiry_type",
                label: "Enquiry Type",
                type: "select",
                options: Object.entries(ENQUIRY_TYPE).map(([val, label]) => ({
                  value: val,
                  label,
                })),
              },
              {
                key: "enquiry_status",
                label: "Enquiry Status",
                type: "select",
                options: Object.entries(ENQUIRY_STATUS).map(([val, label]) => ({
                  value: val,
                  label,
                })),
              },
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Create Enquiry <IconPlus size={20} />
          </button>
        </div>
      </div>

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
            key: "enquiry_status",
            label: "Update Status",
            render: (r) =>
              r.enquiry_status === 1 ? (
                <div className="bg-orange-100 text-orange-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  Requested
                </div>
              ) : r.enquiry_status === 2 ? (
                <div className="bg-yellow-100 text-yellow-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  Ongoing
                </div>
              ) : (
                <div className="bg-green-100 text-green-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
                  Completed
                </div>
              ),
          },
          // {
          //   key: "status",
          //   label: "Status",
          //   render: (r) =>
          //     r.status === 1 || r.status === "1" ? (
          //       <div className="bg-green-100 text-green-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
          //         Active
          //       </div>
          //     ) : (
          //       <div className="bg-red-100 text-red-800 w-fit px-3 py-0.5 rounded-full text-xs font-medium">
          //         Inactive
          //       </div>
          //     ),
          // },
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
            enquiry_type: String(row.enquiry_type),
            enquiry_status: String(row.enquiry_status),
          });
          setOpenForm(true);
        }}
        onDelete={(row: any) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

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

      <DynamicViewModal
        isOpen={openView}
        onClose={() => setOpenView(false)}
        title="View Enquiry Details"
        data={viewData}
      />
    </div>
  );
}
