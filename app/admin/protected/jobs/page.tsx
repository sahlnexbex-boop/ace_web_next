"use client";

import { useEffect, useState } from "react";
import { IconPlus, IconBriefcase } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";

import {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
} from "@/lib/api/job";
import { getBranches } from "@/lib/api/branches";

export default function JobsPage() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [openForm, setOpenForm] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [viewData, setViewData] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const debouncedSearch = useDebounce(search, 500);

    // Fetch branches
    useEffect(() => {
        const loadBranches = async () => {
            try {
                const res = await getBranches(1, 100, "", 1);
                setBranches(res.data || []);
            } catch (err) {
                console.error("Error loading branches:", err);
            }
        };
        loadBranches();
    }, []);

    // Fetch jobs
    const loadData = async () => {
        try {
            const status =
                filters.status && filters.status !== ""
                    ? Number(filters.status)
                    : undefined;

            const res = await getJobs(
                page,
                10,
                debouncedSearch,
                status,
                filters.type,
                filters.branch
            );

            setData(res.data || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error("Error loading jobs:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, debouncedSearch, filters]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h1 className="text-2xl font-semibold text-cyan-700">Manage Jobs</h1>

                <div className="flex items-center gap-3">
                    <TableFilter
                        fields={[
                            {
                                key: "type",
                                label: "Job Type",
                                type: "select",
                                options: [
                                    { label: "Full Time", value: "Full Time" },
                                    { label: "Part Time", value: "Part Time" },
                                    { label: "Contract", value: "Contract" },
                                    { label: "Internship", value: "Internship" },
                                ],
                            },
                            {
                                key: "branch",
                                label: "Branch",
                                type: "select",
                                options: branches.map((b) => ({
                                    label: b.branch_name,
                                    value: String(b.branch_id),
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
                        className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
                    >
                        Create Job <IconPlus size={20} />
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
                    {
                        key: "job_image",
                        label: "Image",
                        render: (r) =>
                            r.job_image ? (
                                <img
                                    src={server_url + r.job_image}
                                    alt={r.job_title}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            ) : (
                                "—"
                            ),
                    },
                    { key: "job_title", label: "Title" },
                    {
                        key: "job_branches",
                        label: "Branches",
                        render: (r) => {
                            if (!r.job_branches) return "—";
                            let list = r.job_branches;
                            if (typeof list === "string") {
                                try { list = JSON.parse(list); } catch { list = []; }
                            }
                            if (!Array.isArray(list)) return "—";
                            const names = list
                                .map((item: any) => {
                                    if (item && typeof item === "object") {
                                        return item.branch_name;
                                    }
                                    const b = branches.find((br) => br.branch_id === Number(item));
                                    return b ? b.branch_name : null;
                                })
                                .filter(Boolean);
                            if (names.length === 0) return "—";
                            if (names.length === 1) return names[0];
                            return (
                                <span className="flex items-center gap-1.5">
                                    {names[0]}
                                    <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                        +{names.length - 1}
                                    </span>
                                </span>
                            );
                        }
                    },
                    { key: "job_type", label: "Type" },
                    {
                        key: "apply_deadline",
                        label: "Deadline",
                        render: (r) =>
                            r.apply_deadline
                                ? new Date(r.apply_deadline).toLocaleDateString("en-IN")
                                : "—",
                    },
                    {
                        key: "status",
                        label: "Status",
                        render: (r) =>
                            r.status == 1 ? (
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
                        job_branches: Array.isArray(row.job_branches)
                            ? row.job_branches.map((b: any) => typeof b === "object" ? b.branch_id : b)
                            : [],
                        apply_deadline: row.apply_deadline
                            ? row.apply_deadline.split("T")[0]
                            : "",
                        status: String(row.status),
                    });
                    setOpenForm(true);
                }}
                onDelete={(row) => {
                    setSelected(row);
                    setOpenDelete(true);
                }}
                onRowClick={async (row) => {
                    const res = await getJobById(row.job_id);
                    const j = res?.data;

                    const formatted = {
                        "Job Title": j.job_title,
                        Branches: (() => {
                            if (!j.job_branches) return "—";
                            let list = j.job_branches;
                            if (typeof list === "string") {
                                try { list = JSON.parse(list); } catch { list = []; }
                            }
                            if (!Array.isArray(list)) return "—";
                            const names = list
                                .map((item: any) => {
                                    if (item && typeof item === "object") {
                                        return item.branch_name;
                                    }
                                    const b = branches.find((br) => br.branch_id === Number(item));
                                    return b ? b.branch_name : null;
                                })
                                .filter(Boolean);
                            return names.join(", ") || "—";
                        })(),
                        Type: j.job_type,
                        "Experience Level": j.experiance_level,
                        "Opening Seats": j.opening_seats || "N/A",
                        Description: (
                            <div
                                className="ck-content text-gray-700"
                                dangerouslySetInnerHTML={{ __html: j.job_description }}
                            />
                        ),
                        Deadline: new Date(j.apply_deadline).toLocaleDateString("en-IN"),
                        Status:
                            j.status == 1 ? (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                    Active
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                                    Inactive
                                </span>
                            ),
                        Image: j.job_image ? (
                            <img
                                src={server_url + j.job_image}
                                className="w-14 h-14 rounded object-cover"
                            />
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
                title={selected ? "Edit Job" : "Create Job"}
                isOpen={openForm}
                onClose={() => setOpenForm(false)}
                fields={[
                    {
                        name: "job_title",
                        label: "Job Title",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "job_branches",
                        label: "Branches",
                        type: "multi-select",
                        options: branches.map((b) => ({
                            label: b.branch_name,
                            value: String(b.branch_id),
                        })),
                        required: true,
                        multiple: true,
                    },
                    {
                        name: "job_type",
                        label: "Job Type",
                        type: "select",
                        options: [
                            { label: "Full Time", value: "Full Time" },
                            { label: "Part Time", value: "Part Time" },
                            { label: "Contract", value: "Contract" },
                            { label: "Internship", value: "Internship" },
                        ],
                        required: true,
                    },
                    {
                        name: "experiance_level",
                        label: "Experience Level",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "opening_seats",
                        label: "Opening Seats",
                        type: "number",
                    },
                    {
                        name: "job_description",
                        label: "Job Description",
                        type: "richtext",
                        required: true,
                    },
                    {
                        name: "apply_deadline",
                        label: "Application Deadline",
                        type: "date",
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
                    },
                    { name: "job_image", label: "Job Image", type: "file" },
                ]}
                defaultValues={selected}
                onSubmit={async (fd) => {
                    if (selected) await updateJob(selected.job_id, fd);
                    else await createJob(fd);
                }}
                onSuccess={loadData}
            />

            {/* DELETE MODAL */}
            <ConfirmDeleteModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={async () => {
                    if (selected) {
                        await deleteJob(selected.job_id);
                        setOpenDelete(false);
                        loadData();
                    }
                }}
                title="Delete Job"
                message={`Are you sure you want to delete "${selected?.job_title}"?`}
            />

            {/* VIEW MODAL */}
            <DynamicViewModal
                isOpen={openView}
                onClose={() => setOpenView(false)}
                title="View Job"
                data={viewData}
            />
        </div>
    );
}
