"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/dynamicTable";
import { getDynamicEvents } from "@/lib/api/dynamicEvents";
import { IconFilter } from "@tabler/icons-react";

export default function EventEnquiryListPage() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();

    const loadEvents = async () => {
        setLoading(true);
        try {
            const res = await getDynamicEvents(page, 10, search);
            setData(res?.data || []);
            setTotalPages(res?.totalPages || 1);
        } catch (err) {
            console.error("Error loading events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [page, search]);

    const handleRowClick = (row: any) => {
        router.push(`/admin/protected/event-enquiry/${row.dynmc_event_id}`);
    };

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-semibold text-cyan-700 mb-6">Events Enquiry's</h1>

            <DataTable
                columns={[
                    { key: "sno", label: "S.No", render: (_, i) => (i ?? 0) + 1 + (page - 1) * 10 },
                    { key: "dynmc_event_title", label: "Event Title" },
                    { key: "dynmc_event_location", label: "Location" },
                    {
                        key: "dynmc_event_date_time",
                        label: "Date & Time",
                        render: (r) =>
                            r.dynmc_event_date_time
                                ? new Date(r.dynmc_event_date_time).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })
                                : "—",
                    },
                    {
                        key: "dynmc_event_image",
                        label: "Image",
                        render: (r) =>
                            r.dynmc_event_image ? (
                                <img
                                    src={server_url + r.dynmc_event_image}
                                    className="w-10 h-10 object-cover rounded-full"
                                    alt="Event"
                                />
                            ) : (
                                "—"
                            ),
                    },
                    {
                        key: "status",
                        label: "Status",
                        render: (r) =>
                            r.status == 1 || r.status === "1" ? (
                                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full text-xs">
                                    Active
                                </div>
                            ) : (
                                <div className="bg-red-100 text-black w-fit px-3 py-0.5 rounded-full text-xs">
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
            />
        </div>
    );
}
