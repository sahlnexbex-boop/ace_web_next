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
    getBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
} from "@/lib/api/branches";

export default function BranchesPage() {
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
    const [v2Branches, setV2Branches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const debouncedSearch = useDebounce(search, 500);

    // Fetch V2 branches when create/edit form modal opens
    useEffect(() => {
        if (!openForm) return;

        const fetchV2Branches = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_ACEAPP_V2_URL}/course_mang/getallbranches/`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setV2Branches(data);
                }
            } catch (err) {
                console.error("Error fetching V2 branches:", err);
            }
        };
        fetchV2Branches();
    }, [openForm]);

    // Fetch jobs
    const loadData = async () => {
        setLoading(true);
        try {
            const status =
                filters.status && filters.status !== ""
                    ? Number(filters.status)
                    : undefined;

            const res = await getBranches(
                page,
                10,
                debouncedSearch,
                status
            );

            setData(res.data || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error("Error loading branches:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, debouncedSearch, filters]);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h1 className="text-2xl font-semibold text-cyan-700">Manage Branches</h1>

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
                        className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
                    >
                        Create Branch <IconPlus size={20} />
                    </button>
                </div>
            </div>

            <DataTable
                isLoading={loading}
                columns={[
                    {
                        key: "sno",
                        label: "S.No",
                        render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10,
                    },
                    {
                        key: "branch_name",
                        label: "Branch Name",
                        render: (r) =>
                            r.branch_name ? (
                                <span>
                                    {r.branch_name}
                                </span>
                            ) : (
                                "—"
                            ),
                    },
                    { key: "branch_phone", label: "Phone No" },
                    { key: "branch_address", label: "Address" },
                    {
                        key: "V2_branch",
                        label: "V2 Connected Branch",
                        render: (r) => {
                            if (!r.V2_branch) return "—";
                            const branchName = r.V2_branch_name || v2Branches.find(
                                (b) => String(b.id) === String(r.V2_branch)
                            )?.name;
                            return branchName ? `${branchName} (ID: ${r.V2_branch})` : `ID: ${r.V2_branch}`;
                        },
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
                        apply_deadline: row.apply_deadline
                            ? row.apply_deadline.split("T")[0]
                            : "",
                        status: String(row.status),
                        V2_branch: row.V2_branch ? String(row.V2_branch) : "",
                    });
                    setOpenForm(true);
                }}
                onDelete={(row) => {
                    setSelected(row);
                    setOpenDelete(true);
                }}
                onRowClick={async (row) => {
                    const res = await getBranchById(row.branch_id);
                    const j = res?.data;
                    const branchName = j.V2_branch_name || (j.V2_branch
                        ? v2Branches.find((b) => String(b.id) === String(j.V2_branch))?.name
                        : null);

                    const formatted = {
                        "Branch Name": j.branch_name,
                        "Branch Phone": j.branch_phone,
                        "Branch Address": j.branch_address,
                        "V2 Branch Connection": branchName ? `${branchName} (${j.V2_branch})` : "—",
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
                    };

                    setViewData(formatted);
                    setOpenView(true);
                }}
            />

            {/* FORM MODAL */}
            <DynamicFormModal
                title={selected ? "Edit Branch" : "Create Branch"}
                isOpen={openForm}
                onClose={() => setOpenForm(false)}
                fields={[
                    {
                        name: "branch_name",
                        label: "Branch Name",
                        type: "text",
                        required: true,
                    },
                    {
                        name: "branch_phone",
                        label: "Phone No",
                        type: "number",
                        required: true,
                    },
                    {
                        name: "branch_address",
                        label: "Address",
                        type: "textarea",
                        required: false,
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
                    {
                        name: "V2_branch",
                        label: "V2 Connected Branch",
                        type: "select",
                        options: v2Branches.map((b) => ({
                            label: b.name,
                            value: String(b.id),
                        })),
                        required: false,
                    },
                ]}
                defaultValues={selected}
                onSubmit={async (fd) => {
                    const payload: any = {};
                    fd.forEach((value, key) => {
                        if (key === "status") {
                            payload[key] = Number(value);
                        } else if (key === "V2_branch") {
                            payload[key] = value ? Number(value) : null;
                        } else {
                            payload[key] = value;
                        }
                    });
                    if (selected) await updateBranch(selected.branch_id, payload);
                    else await createBranch(payload);
                }}
                onSuccess={loadData}
            />

            {/* DELETE MODAL */}
            <ConfirmDeleteModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={async () => {
                    if (selected) {
                        await deleteBranch(selected.branch_id);
                        setOpenDelete(false);
                        loadData();
                    }
                }}
                title="Delete Branch"
                message={`Are you sure you want to delete "${selected?.branch_name}" Branch ?`}
            />

            {/* VIEW MODAL */}
            <DynamicViewModal
                isOpen={openView}
                onClose={() => setOpenView(false)}
                title="View Branch"
                data={viewData}
            />
        </div>
    );
}
