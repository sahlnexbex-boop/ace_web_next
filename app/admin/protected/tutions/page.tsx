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
  getTutions,
  getTutionById,
  createTution,
  updateTution,
  deleteTution,
} from "@/lib/api/tution";

const BASE_IMG = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function TutionsPage() {
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

  /* ========== LOAD DATA ========== */
  const loadTutions = async () => {
    const status =
      filters.status !== undefined && filters.status !== ""
        ? Number(filters.status)
        : undefined;

    const res = await getTutions(page, 10, debouncedSearch, status);
    setData(res?.data || []);
    setTotalPages(res?.totalPages || 1);
  };

  useEffect(() => {
    loadTutions();
  }, [page, debouncedSearch, filters]);

  /* ========== VIEW ========== */
  const handleRowClick = async (row: any) => {
    const res = await getTutionById(row.tution_id);
    if (!res?.data) return;

    const d = res.data;

    setViewData({
      Image: d.tution_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BASE_IMG + d.tution_image}
          alt={d.tution_title}
          className="w-full max-w-20 rounded-md object-cover"
        />
      ) : (
        "—"
      ),
      "Tution Title": d.tution_title || "—",
      Description: (
        <p className="text-gray-700 whitespace-pre-line">
          {d.tution_description || "—"}
        </p>
      ),
      "Start Date": d.start_date
        ? new Date(d.start_date).toLocaleDateString("en-IN")
        : "—",
      "End Date": d.end_date
        ? new Date(d.end_date).toLocaleDateString("en-IN")
        : "—",
      "Start Time": d.start_time || "—",
      "End Time": d.end_time || "—",
      Status: d.status === 1 ? "Active" : "Inactive",
      "Created At": d.created_at
        ? new Date(d.created_at).toLocaleString("en-IN")
        : "—",
      "Updated At": d.updated_at
        ? new Date(d.updated_at).toLocaleString("en-IN")
        : "—",
    });

    setOpenView(true);
  };

  /* ========== FORM FIELDS ========== */
  const fields = [
    {
      name: "tution_title",
      label: "Tution Title",
      type: "text",
      required: true,
    },
    {
      name: "tution_description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "tution_image",
      label: "Tution Image",
      type: "file",
      required: true,
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: true,
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      required: true,
    },
    {
      name: "start_time",
      label: "Start Time",
      type: "time",
      required: true,
    },
    {
      name: "end_time",
      label: "End Time",
      type: "time",
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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Tutions</h1>

        <div className="flex items-center gap-3">
          <TableFilter
            fields={[
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800 cursor-pointer"
          >
            Create Tution <IconPlus size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        columns={[
          {
            key: "sno",
            label: "S.No",
            render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
          },
          {
            key: "tution_title",
            label: "Title",
            render: (r: any) => (
              <div className="truncate max-w-[160px]" title={r.tution_title}>
                {r.tution_title || "—"}
              </div>
            ),
          },
          {
            key: "start_date",
            label: "Start Date",
            render: (r: any) =>
              r.start_date
                ? new Date(r.start_date).toLocaleDateString("en-IN")
                : "—",
          },
          {
            key: "end_date",
            label: "End Date",
            render: (r: any) =>
              r.end_date
                ? new Date(r.end_date).toLocaleDateString("en-IN")
                : "—",
          },
          {
            key: "status",
            label: "Status",
            render: (r: any) =>
              r.status === 1 || r.status === "1" ? (
                <span className="bg-green-100 text-green-800 px-3 py-0.5 rounded-full text-xs font-medium">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-0.5 rounded-full text-xs font-medium">
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
        onRowClick={handleRowClick}
        onEdit={(row: any) => {
          setSelected({
            ...row,
            status: String(row.status),
          });
          setOpenForm(true);
        }}
        onDelete={(row: any) => {
          setSelected(row);
          setOpenDelete(true);
        }}
      />

      {/* FORM MODAL */}
      <DynamicFormModal
        title={selected ? "Edit Tution" : "Create Tution"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          if (selected) await updateTution(selected.tution_id, fd);
          else await createTution(fd);
        }}
        onSuccess={loadTutions}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteTution(selected.tution_id);
            setOpenDelete(false);
            loadTutions();
          }
        }}
        title="Delete Tution"
        message={`Are you sure you want to delete "${selected?.tution_title}"?`}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Tution"
        data={viewData}
      />
    </div>
  );
}

