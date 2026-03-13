"use client";

import { useEffect, useState, useRef } from "react";
import { IconFileDownload, IconPlus, IconFileTypeXls } from "@tabler/icons-react";
import DataTable from "@/components/dynamicTable";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import DynamicFormModal from "@/components/dynamicModal";
import TableFilter from "@/components/filter_button";
import { useDebounce } from "@/hooks/debounce";

import {
    getJobApplications,
    getJobApplicationById,
    deleteJobApplication,
    createJobApplication,
    updateJobApplication,
    getJobs,
    downloadJobApplicationsExcel,
} from "@/lib/api/job";
import { IconDownload } from "@tabler/icons-react";

export default function JobApplicationsPage() {
    const [data, setData] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [selected, setSelected] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [viewData, setViewData] = useState<any>(null);
    const [openDownload, setOpenDownload] = useState(false);
    const downloadRef = useRef<HTMLDivElement | null>(null);
    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const debouncedSearch = useDebounce(search, 500);

    // Fetch jobs for filter options
    const loadJobs = async () => {
        try {
            const res = await getJobs(1, 10);
            setJobs(res.data || []);
        } catch (err) {
            console.error("Error loading jobs:", err);
        }
    };

    // Fetch applications
    const loadData = async () => {
        try {
            const res = await getJobApplications(
                page,
                10,
                debouncedSearch,
                filters.status !== undefined && filters.status !== "" ? Number(filters.status) : undefined,
                filters.application_status !== undefined && filters.application_status !== "" ? Number(filters.application_status) : undefined,
                filters.job_id !== undefined && filters.job_id !== "" ? Number(filters.job_id) : undefined
            );

            setData(res.data || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error("Error loading job applications:", err);
        }
    };

    useEffect(() => {
        loadJobs();
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

    useEffect(() => {
        loadData();
    }, [page, debouncedSearch, filters]);

    const handleDownload = async (options: { exportAll?: boolean }) => {
        try {
            await downloadJobApplicationsExcel({
                ...options,
                page: options.exportAll ? undefined : page,
                limit: 10,
                search: debouncedSearch,
                status: filters.status !== undefined && filters.status !== "" ? Number(filters.status) : undefined,
                application_status: filters.application_status !== undefined && filters.application_status !== "" ? Number(filters.application_status) : undefined,
                job_id: filters.job_id !== undefined && filters.job_id !== "" ? Number(filters.job_id) : undefined
            });
        } catch (err) {
            console.error("Excel download failed", err);
        }
    };

    const jobOptions = jobs.map((j) => ({
        label: j.job_title,
        value: String(j.job_id),
    }));

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h1 className="text-2xl font-semibold text-cyan-700">Job Applications</h1>

                <div className="flex items-center gap-3">
                    <TableFilter
                        fields={[
                            {
                                key: "job_id",
                                label: "Filter by Job",
                                type: "select",
                                options: jobOptions,
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
                            {
                                key: "application_status",
                                label: "Request Status",
                                type: "select",
                                options: [
                                    { label: "Requested", value: "1" },
                                    { label: "Ongoing", value: "2" },
                                    { label: "Closed", value: "3" },
                                ],
                            },
                        ]}
                        onChange={(f) => {
                            setFilters(f);
                            setPage(1);
                        }}
                    />

                    {/* DOWNLOAD DROPDOWN */}
                    <div className="relative" ref={downloadRef}>
                        <button
                            onClick={() => setOpenDownload((p) => !p)}
                            className="flex gap-2 items-center border border-cyan-700 text-cyan-700 px-4 py-2 rounded-md hover:text-white hover:bg-cyan-700 cursor-pointer"
                        >
                            <IconFileTypeXls size={18} />
                            <span>Download</span>
                        </button>

                        {openDownload && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                                <button
                                    className="w-full flex gap-2 cursor-pointer text-left px-4 py-2 text-sm hover:bg-cyan-50/80"
                                    onClick={async () => {
                                        setOpenDownload(false);
                                        await handleDownload({ exportAll: false });
                                    }}
                                >
                                    <IconDownload size={18} className="text-cyan-800" />
                                    <span>Current Page</span>
                                </button>

                                <button
                                    className="w-full flex gap-2 cursor-pointer text-left px-4 py-2 text-sm hover:bg-cyan-50/80"
                                    onClick={async () => {
                                        setOpenDownload(false);
                                        await handleDownload({ exportAll: true });
                                    }}
                                >
                                    <IconDownload size={18} className="text-cyan-800" />
                                    <span>Full Data</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setSelected(null);
                            setOpenForm(true);
                        }}
                        className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
                    >
                        Add Application <IconPlus size={20} />
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
                    { key: "candidate_name", label: "Applicant Name" },
                    { key: "candidate_email", label: "Email" },
                    { key: "candidate_phone", label: "Phone" },
                    {
                        key: "job",
                        label: "Applied For",
                        render: (r) => r.Job?.job_title || "—",
                    },
                    {
                        key: "application_date",
                        label: "Date",
                        render: (r) =>
                            r.application_date
                                ? new Date(r.application_date).toLocaleDateString("en-IN")
                                : "—",
                    },
                    {
                        key: "application_status",
                        label: "Request Status",
                        render: (r) => {
                            switch (Number(r.application_status)) {
                                case 1:
                                    return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">Requested</span>;
                                case 2:
                                    return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Ongoing</span>;
                                case 3:
                                    return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">Closed</span>;
                                default:
                                    return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">Unknown</span>;
                            }
                        }
                    },
                    {
                        key: "resume_file",
                        label: "Resume",
                        render: (r) =>
                            r.resume_file ? (
                                <a
                                    href={server_url + r.resume_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-600 hover:underline flex items-center gap-1"
                                >
                                    <IconFileDownload size={16} /> View Resume
                                </a>
                            ) : (
                                "—"
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
                        job_id: String(row.job_id),
                        application_status: String(row.application_status),
                        status: String(row.status),
                    });
                    setOpenForm(true);
                }}
                onDelete={(row) => {
                    setSelected(row);
                    setOpenDelete(true);
                }}
                onRowClick={async (row) => {
                    const res = await getJobApplicationById(row.application_id);
                    const a = res?.data;

                    const formatted = {
                        "Applicant Name": a.candidate_name,
                        Email: a.candidate_email,
                        Phone: a.candidate_phone,
                        "Applied For": a.Job?.job_title || "—",
                        "Cover Letter": (
                            <div className="whitespace-pre-wrap text-gray-700">
                                {a.cover_letter || "No cover letter provided."}
                            </div>
                        ),
                        "Request Status": (
                            Number(a.application_status) === 1 ? <span className="text-blue-600 font-medium">Requested</span> :
                                Number(a.application_status) === 2 ? <span className="text-green-600 font-medium">Ongoing</span> :
                                    Number(a.application_status) === 3 ? <span className="text-red-600 font-medium">Closed</span> : "Unknown"
                        ),
                        "Applied On": new Date(a.application_date).toLocaleString("en-IN"),
                        Resume: a.resume_file ? (
                            <a
                                href={server_url + a.resume_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-md border border-cyan-200 flex items-center gap-2 w-fit"
                            >
                                <IconFileDownload size={18} /> Download/View Resume
                            </a>
                        ) : (
                            "—"
                        ),
                    };

                    setViewData(formatted);
                    setOpenView(true);
                }}
            />

            {/* FORM MODAL */}
            <DynamicFormModal
                title={selected ? "Edit Application" : "Add Job Application"}
                isOpen={openForm}
                onClose={() => setOpenForm(false)}
                fields={[
                    {
                        name: "candidate_name",
                        label: "Candidate Name",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "candidate_email",
                        label: "Email",
                        type: "email",
                        required: true,
                    },
                    {
                        name: "candidate_phone",
                        label: "Phone",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "candidate_address",
                        label: "Address",
                        type: "textarea",
                    },
                    {
                        name: "job_id",
                        label: "Applied For (Job)",
                        type: "select",
                        options: jobOptions,
                        required: true,
                    },
                    {
                        name: "cover_letter",
                        label: "Cover Letter",
                        type: "textarea",
                    },
                    {
                        name: "resume_file",
                        label: "Resume (PDF)",
                        type: "file",
                        required: !selected,
                    },
                    {
                        name: "application_status",
                        label: "Request Status",
                        type: "select",
                        options: [
                            { label: "Requested", value: "1" },
                            { label: "Ongoing", value: "2" },
                            { label: "Closed", value: "3" },
                        ],
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Inactive", value: "0" },
                        ],
                    },
                ]}
                defaultValues={selected}
                onSubmit={async (fd) => {
                    if (selected) await updateJobApplication(selected.application_id, fd);
                    else await createJobApplication(fd);
                }}
                onSuccess={loadData}
            />

            {/* DELETE MODAL */}
            <ConfirmDeleteModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={async () => {
                    if (selected) {
                        await deleteJobApplication(selected.application_id);
                        setOpenDelete(false);
                        loadData();
                    }
                }}
                title="Delete Application"
                message={`Are you sure you want to delete application from "${selected?.candidate_name}"?`}
            />

            {/* VIEW MODAL */}
            <DynamicViewModal
                isOpen={openView}
                onClose={() => setOpenView(false)}
                title="View Application"
                data={viewData}
            />
        </div>
    );
}
