"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import TableFilter from "@/components/filter_button";
import DynamicFormModal from "@/components/dynamicModal";
import ConfirmDeleteModal from "@/components/deleteModal";
import { useDebounce } from "@/hooks/debounce";

import {
    getServiceCarousels,
    createServiceCarousel,
    bulkDeleteServiceCarousel,
    bulkServiceCarouselStatusUpdate,
} from "@/lib/api/serviceCarousel";

export default function ServiceCarouselPage() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // modal & delete
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<any | null>(null);

    // checkbox
    const [checked, setChecked] = useState<Record<number, boolean>>({});
    const checkedCount = useMemo(
        () => Object.values(checked).filter(Boolean).length,
        [checked]
    );

    // bulk
    const [bulkAction, setBulkAction] = useState("");
    const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // load data
    const load = async () => {
        setLoading(true);
        try {
            const status =
                filters.status && filters.status !== ""
                    ? Number(filters.status)
                    : undefined;

            const res = await getServiceCarousels(
                page,
                limit,
                debouncedSearch,
                status
            );

            setData(res.data || []);
            setTotalPages(res.totalPages || 1);
            setChecked({});
        } catch (err) {
            console.error("Failed to load service carousel", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [page, debouncedSearch, filters]);


    const toggleCheck = (id: number) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const clearAll = () => setChecked({});

    const openCreate = () => setOpenForm(true);

    const onSubmitForm = async (fd: FormData) => {
        await createServiceCarousel(fd);
    };

    const handleDeleteSingle = (item: any) => {
        setRemoveTarget(item);
        setOpenDelete(true);
    };

    const confirmDeleteSingle = async () => {
        if (!removeTarget) return;
        await bulkDeleteServiceCarousel([removeTarget.service_carousel_id]);
        setOpenDelete(false);
        load();
    };

    // bulk action
    const doBulkAction = async () => {
        const ids = Object.entries(checked)
            .filter(([_, v]) => v)
            .map(([k]) => Number(k));

        if (!ids.length) return;

        if (bulkAction === "delete") {
            await bulkDeleteServiceCarousel(ids);
        } else if (bulkAction === "active") {
            await bulkServiceCarouselStatusUpdate(ids, 1);
        } else if (bulkAction === "inactive") {
            await bulkServiceCarouselStatusUpdate(ids, 0);
        }

        setBulkAction("");
        clearAll();
        load();
    };

    // preview
    const renderPreview = (url: string) => {
        if (!url)
            return (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    File
                </div>
            );

        return (
            <img
                src={serverUrl + url}
                className="w-full h-40 object-contain p-2"
                alt="carousel"
            />
        );
    };

    return (
        <div className="p-4 sm:p-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h1 className="text-2xl font-semibold text-cyan-700">
                    Service Carousel
                </h1>

                <div className="flex items-center gap-3">
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
                        ]}
                        onChange={(f) => {
                            setFilters(f);
                            setPage(1);
                        }}
                    />

                    <button
                        className="bg-cyan-700 cursor-pointer text-white px-4 py-2 rounded-md flex items-center gap-2"
                        onClick={openCreate}
                    >
                        <IconPlus size={18} /> Add Images
                    </button>
                </div>
            </div>

            {/* BULK TOOLBAR */}
            {checkedCount > 0 && (
                <div className="flex items-center justify-between gap-4 bg-gray-100 p-3 rounded mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium bg-cyan-100 py-1 px-2 rounded-md">
                            {checkedCount} selected
                        </span>

                        <button
                            onClick={clearAll}
                            className="text-gray-600 text-sm underline hover:text-red-400 cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="">Select action...</option>
                            <option value="delete">Delete</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <button
                            disabled={!bulkAction}
                            onClick={doBulkAction}
                            className="px-4 py-2 cursor-pointer bg-cyan-800 text-white rounded disabled:opacity-40"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
                {data.map((item) => (
                    <div
                        key={item.service_carousel_id}
                        className="bg-white rounded shadow relative"
                    >
                        <div
                            onClick={() =>
                                window.open(
                                    serverUrl + item.image_url,
                                    "_blank"
                                )
                            }
                            className="cursor-pointer"
                        >
                            {renderPreview(item.image_url)}
                        </div>

                        <div className="p-3 text-sm">
                            <div className="flex justify-between mb-2">
                                <input
                                    type="checkbox"
                                    checked={!!checked[item.service_carousel_id]}
                                    onChange={() =>
                                        toggleCheck(item.service_carousel_id)
                                    }
                                />

                                {item.status == 1 ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                                        Active
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleDeleteSingle(item)}
                                className="bg-gray-100 p-1 rounded cursor-pointer"
                            >
                                <IconTrash size={16} className="text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-2 rounded bg-gray-200 ${page <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-300"
                        }`}
                >
                    Prev
                </button>

                <span className="font-medium">
                    Page {page} / {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-2 rounded bg-gray-200 ${page >= totalPages
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-300"
                        }`}
                >
                    Next
                </button>
            </div>

            {/* CREATE MODAL */}
            <DynamicFormModal
                title="Upload Service Carousel Images"
                isOpen={openForm}
                onClose={() => setOpenForm(false)}
                fields={[
                    {
                        name: "image_url",
                        label: "Images (Multiple)",
                        type: "file",
                        multiple: true,
                        required: true,
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        required: true,
                        options: [
                            { value: "1", label: "Active" },
                            { value: "0", label: "Inactive" },
                        ],
                    },
                ]}
                onSubmit={onSubmitForm}
                onSuccess={load}
            />

            {/* DELETE CONFIRM */}
            <ConfirmDeleteModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={confirmDeleteSingle}
                title="Delete Image"
                message="Are you sure you want to delete this image?"
            />
        </div>
    );
}