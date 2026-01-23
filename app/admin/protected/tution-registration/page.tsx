"use client";

import { useState, useEffect, useRef } from "react";
import { IconPlus, IconDownload, IconFileTypeXls } from "@tabler/icons-react";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";
import { getTutions } from "@/lib/api/tution";
import {
  getTutionRegistrations,
  getTutionRegistrationById,
  createTutionRegistration,
  updateTutionRegistration,
  deleteTutionRegistration,
  downloadTutionRegistrationExcel,
} from "@/lib/api/tutionRegistration";

const REQUEST_STATUS: Record<number, string> = {
  1: "Requested",
  2: "Ongoing",
  3: "Completed",
};

export default function TutionRegistrationPage() {
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
  const [tutionOptions, setTutionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [openDownload, setOpenDownload] = useState(false);
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  /* ========== LOAD MASTER DATA ========== */
  const loadTutionOptions = async () => {
    try {
      const res = await getTutions(1, 100, "", 1);
      const options =
        res?.data?.map((t: any) => ({
          label: t.tution_title,
          value: String(t.tution_id),
        })) || [];
      setTutionOptions(options);
    } catch (err) {
      console.error("Failed to load tutions:", err);
    }
  };

  /* ========== LOAD DATA ========== */
  const loadRegistrations = async () => {
    try {
      const status =
        filters.status !== undefined && filters.status !== ""
          ? Number(filters.status)
          : undefined;
      const request_status =
        filters.request_status !== undefined && filters.request_status !== ""
          ? Number(filters.request_status)
          : undefined;
      const medium =
        filters.medium && filters.medium !== "" ? filters.medium : undefined;
      const tution_id =
        filters.tution_id && filters.tution_id !== ""
          ? Number(filters.tution_id)
          : undefined;

      const res = await getTutionRegistrations(
        page,
        10,
        debouncedSearch,
        status,
        request_status,
        medium,
        tution_id
      );

      setData(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Error loading tution registrations:", err);
    }
  };

  useEffect(() => {
    loadTutionOptions();
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        downloadRef.current &&
        !downloadRef.current.contains(e.target as Node)
      ) {
        setOpenDownload(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ========== VIEW ========== */
  const handleRowClick = async (row: any) => {
    const res = await getTutionRegistrationById(row.registration_id);
    if (!res?.data) return;

    const d = res.data;

    setViewData({
      "Tution Title": d.tution_title || "—",
      "Student Name": d.std_name || "—",
      "Guardian Name": d.guardian_name || "—",
      "Guardian Contact": d.guardian_contact || "—",
      School: d.school || "—",
      Standard: d.standard || "—",
      Medium: d.medium || "—",
      "Request Status": REQUEST_STATUS[d.request_status] || "—",
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
      name: "tution_id",
      label: "Tuition",
      type: "select",
      options: tutionOptions,
      required: true,
    },
    {
      name: "std_name",
      label: "Student Name",
      type: "text",
      required: true,
    },
    {
      name: "guardian_name",
      label: "Guardian Name",
      type: "text",
      required: true,
    },
    {
      name: "guardian_contact",
      label: "Guardian Contact",
      type: "text",
      required: true,
    },
    {
      name: "school",
      label: "School",
      type: "text",
      required: true,
    },
    {
      name: "standard",
      label: "Standard",
      type: "text",
      required: true,
    },
    {
      name: "medium",
      label: "Medium",
      type: "select",
      options: [
        { label: "English", value: "english" },
        { label: "Malayalam", value: "malayalam" },
      ],
      required: true,
    },
    {
      name: "request_status",
      label: "Request Status",
      type: "select",
      options: Object.entries(REQUEST_STATUS).map(([value, label]) => ({
        label,
        value,
      })),
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

  /* ========== UI ========== */
  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">
          Tuition Registrations
        </h1>

        <div className="flex items-center gap-3">
          {/* DOWNLOAD EXCEL */}
          <div className="relative" ref={downloadRef}>
            <button
              onClick={() => setOpenDownload((p) => !p)}
              className="flex gap-1 border border-cyan-700 text-cyan-700 px-4 py-2 rounded-md hover:text-white hover:bg-cyan-700 cursor-pointer"
            >
              <IconFileTypeXls size={18} />
              <span>Download</span>
            </button>

            {openDownload && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                {/* CURRENT PAGE */}
                <button
                  className="w-full flex gap-2 cursor-pointer text-left px-4 py-2 text-sm hover:bg-cyan-50/80"
                  onClick={async () => {
                    setOpenDownload(false);
                    await downloadTutionRegistrationExcel({
                      page,
                      limit: 10,
                      search: debouncedSearch,
                      status:
                        filters.status && filters.status !== ""
                          ? Number(filters.status)
                          : undefined,
                      request_status:
                        filters.request_status && filters.request_status !== ""
                          ? Number(filters.request_status)
                          : undefined,
                      medium:
                        filters.medium && filters.medium !== ""
                          ? filters.medium
                          : undefined,
                      tution_id:
                        filters.tution_id && filters.tution_id !== ""
                          ? Number(filters.tution_id)
                          : undefined,
                    });
                  }}
                >
                  <IconDownload size={18} className="text-cyan-800" />
                  <span>Current Page</span>
                </button>

                {/* FULL DATA */}
                <button
                  className="w-full flex gap-2 cursor-pointer text-left px-4 py-2 text-sm hover:bg-cyan-50/80"
                  onClick={async () => {
                    setOpenDownload(false);
                    await downloadTutionRegistrationExcel({
                      exportAll: true,
                      search: debouncedSearch,
                      status:
                        filters.status && filters.status !== ""
                          ? Number(filters.status)
                          : undefined,
                      request_status:
                        filters.request_status && filters.request_status !== ""
                          ? Number(filters.request_status)
                          : undefined,
                      medium:
                        filters.medium && filters.medium !== ""
                          ? filters.medium
                          : undefined,
                      tution_id:
                        filters.tution_id && filters.tution_id !== ""
                          ? Number(filters.tution_id)
                          : undefined,
                    });
                  }}
                >
                  <IconDownload size={18} className="text-cyan-800" />
                  <span>Full Data</span>
                </button>
              </div>
            )}
          </div>

          <TableFilter
            fields={[
              {
                key: "tution_id",
                label: "Tuition",
                type: "select",
                options: tutionOptions,
              },
              {
                key: "medium",
                label: "Medium",
                type: "select",
                options: [
                  { label: "English", value: "english" },
                  { label: "Malayalam", value: "malayalam" },
                ],
              },
              {
                key: "request_status",
                label: "Request Status",
                type: "select",
                options: Object.entries(REQUEST_STATUS).map(
                  ([value, label]) => ({
                    label,
                    value,
                  })
                ),
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
            className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-cyan-800 cursor-pointer"
          >
            Create Registration <IconPlus size={20} />
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
            label: "Tuition",
          },
          {
            key: "std_name",
            label: "Student Name",
          },
          {
            key: "guardian_name",
            label: "Guardian Name",
          },
          {
            key: "school",
            label: "School",
            render: (r: any) => (
                <div className="truncate max-w-[130px]" title={r.school}>
                    {r.school || "—"}
                </div>
            )
          },
          {
            key: "standard",
            label: "Standard",
          },
          {
            key: "medium",
            label: "Medium",
          },
          {
            key: "request_status",
            label: "Request Status",
            render: (r: any) =>
            r.request_status == 1 ? (
                <span className="bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full text-xs font-medium">
                    Requested
                </span>
            ) : r.request_status == 2 ? (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-0.5 rounded-full text-xs font-medium">
                    Ongoing
                </span>
            ) : r.request_status == 3 ? (
                <span className="bg-green-100 text-green-700 px-3 py-0.5 rounded-full text-xs font-medium">
                    Completed
                </span>
            ) : "—",
          },
        //   {
        //     key: "status",
        //     label: "Status",
        //     render: (r: any) =>
        //       r.status === 1 || r.status === "1" ? (
        //         <span className="bg-green-100 text-green-800 px-3 py-0.5 rounded-full text-xs font-medium">
        //           Active
        //         </span>
        //       ) : (
        //         <span className="bg-red-100 text-red-800 px-3 py-0.5 rounded-full text-xs font-medium">
        //           Inactive
        //         </span>
        //       ),
        //   },
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
            request_status: String(row.request_status),
            tution_id: String(row.tution_id),
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
        title={selected ? "Edit Registration" : "Create Registration"}
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          const plain = Object.fromEntries(fd.entries());
          if (selected)
            await updateTutionRegistration(selected.registration_id, plain);
          else await createTutionRegistration(plain);
        }}
        onSuccess={loadRegistrations}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          if (selected) {
            await deleteTutionRegistration(selected.registration_id);
            setOpenDelete(false);
            loadRegistrations();
          }
        }}
        title="Delete Registration"
        message={`Are you sure you want to delete "${selected?.std_name}"?`}
      />

      {/* VIEW MODAL */}
      <DynamicViewModal
        isOpen={openView}
        onClose={() => {
          setOpenView(false);
          setViewData(null);
        }}
        title="View Registration"
        data={viewData}
      />
    </div>
  );
}

