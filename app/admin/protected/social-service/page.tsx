"use client";

import { useState, useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";

import {
  getSocialServices,
  getSocialServiceById,
  createSocialService,
  updateSocialService,
  deleteSocialService,
} from "@/lib/api/socialService";

export default function SocialServicesPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<Record<string, any> | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // 🔹 Load social services
  const loadSocialServices = async () => {
    try {
      const status =
        filters.status && filters.status !== "" ? filters.status : undefined;
      const date =
        filters.date && filters.date !== "" ? filters.date : undefined;

      const res = await getSocialServices(page, 10, debouncedSearch, status, date);
      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading social services:", err);
    }
  };

  useEffect(() => {
    loadSocialServices();
  }, [page, debouncedSearch, filters]);

  // 🔹 Handle View
  const handleView = async (row: any) => {
    try {
      const res = await getSocialServiceById(row.service_id);
      const s = res?.data || res;

      let otherImgs: string[] = [];
      try {
        otherImgs = JSON.parse(s.other_images || "[]");
      } catch {
        otherImgs = [];
      }

      const formatted: Record<string, any> = {
        "Service Title": s.service_title,
        Description: (
          <p className="text-gray-700 whitespace-pre-line">
            {s.service_description || "—"}
          </p>
        ),
        Date: s.service_date
          ? new Date(s.service_date).toLocaleDateString("en-IN")
          : "—",
        Location: s.service_location || "—",
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
        "Main Image": s.service_image ? (
          <div className="flex justify-end">
            <img
              src={s.service_image}
              alt="Main Service"
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        ) : (
          "—"
        ),
        "Other Images": otherImgs.length ? (
          <div className="grid grid-cols-3 gap-1">
            {otherImgs.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Other ${i + 1}`}
                className="w-14 h-14 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          "—"
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
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  // 🔹 Fields for Create/Edit Modal
  const fields = [
    { name: "service_title", label: "Service Title", type: "text", required: true },
    { name: "service_description", label: "Description", type: "textarea", required: true },
    { name: "service_date", label: "Service Date", type: "date", required: true },
    { name: "service_location", label: "Location", type: "text", required: true },
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
    { name: "service_image", label: "Main Image", type: "file", required: false },
    { name: "other_images", label: "Other Images", type: "file", multiple: true, required: false },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Social Services</h1>

        <div className="flex items-center gap-3">
          {/* ✅ Filter Button (Status + Date) */}
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
              {
                key: "date",
                label: "Date",
                type: "date",
              },
            ]}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />

          {/* Create Button */}
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
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          { key: "service_title", label: "Title" },
          { key: "service_location", label: "Location" },
          {
            key: "service_date",
            label: "Date",
            render: (r) =>
              r.service_date
                ? new Date(r.service_date).toLocaleDateString("en-IN")
                : "—",
          },
          {
            key: "service_image",
            label: "Main Image",
            render: (r) =>
              r.service_image ? (
                <img
                  src={r.service_image}
                  className="w-10 h-10 object-cover rounded-full"
                  alt="Service"
                />
              ) : (
                "—"
              ),
          },
          {
            key: "status",
            label: "Status",
            render: (r) =>
              r.status === 1 || r.status === "1" ? (
                <span className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full">
                  Inactive
                </span>
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
            service_date: row.service_date
              ? new Date(row.service_date).toISOString().split("T")[0]
              : "",
          });
          setOpenForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setOpenDelete(true);
        }}
        onRowClick={handleView}
      />

      {/* Modals */}
      <DynamicFormModal
        title={selected ? "Edit Social Service" : "Create Social Service"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateSocialService(selected.service_id, fd);
          else await createSocialService(fd);
        }}
        onSuccess={loadSocialServices}
      />

      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteSocialService(selected.service_id);
            setOpenDelete(false);
            loadSocialServices();
          }
        }}
        title="Delete Social Service"
        message={`Are you sure you want to delete "${selected?.service_title}"?`}
      />

      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Social Service Details"
        data={viewData}
      />
    </div>
  );
}
