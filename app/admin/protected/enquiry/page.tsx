"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  downloadEnquiryExcel,
} from "@/lib/api/enquiry";
import { getCourses } from "@/lib/api/course";
import { IconPlus, IconDownload, IconFileTypeXls } from "@tabler/icons-react";

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
  const [courses, setCourses] = useState<any[]>([]);
  const [enquiryType, setEnquiryType] = useState<string>("");
  const [openDownload, setOpenDownload] = useState(false);
  const downloadRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await getCourses(1, 100, "");
        setCourses(res?.data || []);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    loadCourses();
  }, []);

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

  const downloadExcel = async (options: {
    page?: number;
    limit?: number;
    exportAll?: boolean;
  }): Promise<void> => {
    try {
      await downloadEnquiryExcel({
        ...options,
        search: debouncedSearch,
        status: filters.status ? Number(filters.status) : undefined,
        enquiry_type: filters.enquiry_type ? Number(filters.enquiry_type) : undefined,
        enquiry_status: filters.enquiry_status ? Number(filters.enquiry_status) : undefined,
      });
    } catch (err) {
      console.error("Excel download failed", err);
    }
  };

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
        "Course": d.course_name || "Not Available",

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

  const fields = useMemo(() => [
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
      onChange: (val: string) => {
        setEnquiryType(val);
        // Clear course_id when enquiry_type is not "2" (Course)
        if (val !== "2" && selected) {
          setSelected({
            ...selected,
            course_id: "",
          });
        }
      },
    },
    {
      name: "course_id",
      label: "Course",
      type: "select",
      required: false,
      disabled: enquiryType !== "2",
      options: courses.map((course) => ({
        value: String(course.course_id),
        label: course.course_name || "—",
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
  ], [courses, enquiryType]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-cyan-700">Enquiries</h1>

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
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                {/* CURRENT PAGE */}
                <button
                  className="w-full flex gap-2 cursor-pointer text-left px-4 py-2 text-sm hover:bg-cyan-50/80"
                  onClick={async () => {
                    setOpenDownload(false);
                    await downloadExcel({
                      page,
                      limit: 10,
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
                    await downloadExcel({
                      exportAll: true,
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
              setEnquiryType("");
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
            key: "course_name",
            label: "Course",
            render: (r) => r.course_name || "Not Available",
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
          const enquiryTypeValue = String(row.enquiry_type);
          setEnquiryType(enquiryTypeValue);
          setSelected({
            ...row,
            status: String(row.status),
            enquiry_type: enquiryTypeValue,
            enquiry_status: String(row.enquiry_status),
            course_id: row.course_id ? String(row.course_id) : "",
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
        onClose={() => {
          setOpenForm(false);
          setEnquiryType("");
        }}
        fields={fields}
        defaultValues={selected}
        onSubmit={async (fd: FormData) => {
          const plainObj = Object.fromEntries(fd.entries());
          
          // Remove course_id if enquiry_type is not "2" (Course)
          if (plainObj.enquiry_type !== "2") {
            delete plainObj.course_id;
          }
          
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
