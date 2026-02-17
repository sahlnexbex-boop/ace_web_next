"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconArrowLeft, IconDownload, IconFilter } from "@tabler/icons-react";
import DataTable from "@/components/dynamicTable";
import DynamicViewModal from "@/components/dynamicViewModal";
import { getDynamicEventById } from "@/lib/api/dynamicEvents";
import { getSubmissions, downloadSubmissionsExcel } from "@/lib/api/dynamicFormSubmissions";
import { toast } from "@/components/ui/use-toast";
import TableFilter from "@/components/filter_button";

export default function EventEnquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);

    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("");

    // View Modal
    const [openView, setOpenView] = useState(false);
    const [viewData, setViewData] = useState<any>(null);

    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Load Event Details & Submissions
    useEffect(() => {
        if (eventId) {
            loadEventAndSubmissions();
        }
    }, [eventId, page, search, statusFilter]);

    const loadEventAndSubmissions = async () => {
        setLoading(true);
        try {
            // 1. Fetch Event Details (for headers)
            if (!event) {
                const eventRes = await getDynamicEventById(Number(eventId));
                const eventData = eventRes?.data || eventRes;
                setEvent(eventData);
                buildColumns(eventData);
            }

            // 2. Fetch Submissions with status filter
            const subRes = await getSubmissions(
                page,
                10,
                search,
                Number(eventId),
                statusFilter ? Number(statusFilter) : undefined
            );

            // Map submissions to flat structure for DataTable
            const flatData = (subRes?.data || []).map((sub: any) => {
                const row: any = {
                    submission_id: sub.submission_id,
                    created_at: sub.created_at,
                    status: sub.status,
                };

                // Map values
                if (sub.values && Array.isArray(sub.values)) {
                    sub.values.forEach((val: any) => {
                        row[`field_${val.form_field_id}`] = val;
                    });
                }
                return row;
            });

            setSubmissions(flatData);
            setTotalPages(subRes?.totalPages || 1);

        } catch (err) {
            console.error("Error loading data:", err);
            toast({
                title: "Error",
                description: "Failed to load event data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const buildColumns = (eventData: any) => {

        const baseCols = [
            { key: "sno", label: "S.No", render: (_: any, i: number) => (i ?? 0) + 1 + (page - 1) * 10 },
        ];

        const allFieldCols = (eventData.form_fields || []).map((field: any) => ({
            key: `field_${field.form_field_id}`,
            label: field.form_field_label,
            render: (row: any) => {
                const valObj = row[`field_${field.form_field_id}`];
                if (!valObj) return "—";

                let val = valObj.form_field_value;

                // Parse if it's a JSON-stringified value
                if (typeof val === 'string') {
                    try {
                        // If the string starts with a quote, it's likely double-stringified
                        if (val.startsWith('"') && val.endsWith('"')) {
                            val = JSON.parse(val);
                        }
                    } catch (e) {
                        // If parsing fails, use as-is
                    }
                }

                const type = field.form_field_type;

                if (type === 'file') {
                    // Ensure val is a clean path
                    const filePath = typeof val === 'string' ? val : String(val);
                    return (
                        <a
                            href={`${server_url}${filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:underline text-xs"
                            onClick={(e) => e.stopPropagation()}
                        >
                            View File
                        </a>
                    );
                }

                // Truncate long text
                if (typeof val === 'string' && val.length > 50) {
                    return <span title={val}>{val.substring(0, 50)}...</span>;
                }

                return val;
            }
        }));

        // Only show first 5 fields in table
        const displayFieldCols = allFieldCols.slice(0, 5);

        const baseCols2 = [{
            key: "created_at",
            label: "Date",
            render: (r: any) => new Date(r.created_at).toLocaleString("en-IN")
        }];

        setColumns([...baseCols, ...displayFieldCols, ...baseCols2]);
    };

    const handleViewSubmission = (row: any) => {
        if (!event) return;

        const formatted: any = {
            "Submission ID": row.submission_id,
            "Date": new Date(row.created_at).toLocaleString("en-IN"),
            "Status": row.status == 1 ? "Active" : "Inactive",
        };

        // Add all field values
        (event.form_fields || []).forEach((field: any) => {
            const valObj = row[`field_${field.form_field_id}`];
            if (valObj) {
                let val = valObj.form_field_value;

                // Parse if it's a JSON-stringified value
                if (typeof val === 'string') {
                    try {
                        if (val.startsWith('"') && val.endsWith('"')) {
                            val = JSON.parse(val);
                        }
                    } catch (e) {
                        // If parsing fails, use as-is
                    }
                }

                const type = field.form_field_type;

                if (type === 'file') {
                    const filePath = typeof val === 'string' ? val : String(val);
                    formatted[field.form_field_label] = (
                        <a
                            href={`${server_url}${filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:underline"
                        >
                            View File
                        </a>
                    );
                } else {
                    formatted[field.form_field_label] = val || "—";
                }
            } else {
                formatted[field.form_field_label] = "—";
            }
        });

        setViewData(formatted);
        setOpenView(true);
    };

    const handleDownloadExcel = async () => {
        try {
            await downloadSubmissionsExcel({
                event_id: Number(eventId),
                // status: statusFilter // If API supported it
                exportAll: true
            });
            toast({ title: "Success", description: "Download started" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Download failed", variant: "destructive" });
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-cyan-700 mb-4 transition-colors"
            >
                <IconArrowLeft size={20} /> Back to Events
            </button>

            {event && (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {event.dynmc_event_image && (
                            <img
                                src={server_url + event.dynmc_event_image}
                                alt={event.dynmc_event_title}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.dynmc_event_title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    📍 {event.dynmc_event_location}
                                </span>
                                <span className="flex items-center gap-1">
                                    📅 {new Date(event.dynmc_event_date_time).toLocaleString("en-IN")}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.status == 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}>
                                    {event.status == 1 ? "Active" : "Inactive"}
                                </span>
                            </div>
                            {/* <p className="mt-3 text-gray-600 text-sm max-w-2xl">
                                {event.dynmc_event_description}
                            </p> */}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h2 className="text-lg font-semibold text-gray-700">Registrations</h2>

                <div className="flex gap-3">
                    {/* Status Filter (Mock for now as backend might not filter by status yet, but UI is here) */}
                    {/* <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-cyan-500 text-sm h-full"
                        >
                            <option value="">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <IconFilter size={16} />
                        </div>
                    </div> */}

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
                            setStatusFilter(f.status);
                            setPage(1);
                        }}
                    />

                    <button
                        onClick={handleDownloadExcel}
                        className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm"
                    >
                        <IconDownload size={18} /> Excel Export
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={submissions}
                page={page}
                totalPages={totalPages}
                search={search}
                setPage={setPage}
                setSearch={setSearch}
                onRowClick={handleViewSubmission}
            />

            <DynamicViewModal
                isOpen={openView}
                onClose={() => setOpenView(false)}
                title="Registration Details"
                data={viewData}
            />
        </div>
    );
}
