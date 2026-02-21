"use client";

import { useState, useEffect } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import TableFilter from "@/components/filter_button";
import DataTable from "@/components/dynamicTable";
import ConfirmDeleteModal from "@/components/deleteModal";
import DynamicViewModal from "@/components/dynamicViewModal";
import { useDebounce } from "@/hooks/debounce";
import { toast } from "@/components/ui/use-toast";

import {
    getDynamicEvents,
    getDynamicEventById,
    createDynamicEvent,
    updateDynamicEvent,
    deleteDynamicEvent,
} from "@/lib/api/dynamicEvents";

interface FormField {
    form_field_id?: number;
    form_field_key: string;
    form_field_label: string;
    form_field_type: string;
    is_required: number;
    options: string;
}

export default function DynamicEventsPage() {
    const [data, setData] = useState<any[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [viewData, setViewData] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<{ status?: string }>({});
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const debouncedSearch = useDebounce(search, 500);

    // Form state
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        dynmc_event_title: "",
        dynmc_event_image: null as File | null,
        dynmc_event_image_url: "",
        dynmc_event_description: "",
        dynmc_event_location: "",
        dynmc_event_date_time: "",
        dynmc_event_form_available: "0",
        dynmc_form_header: "",
        dynmc_form_description: "",
        status: "1",
    });
    const [formFields, setFormFields] = useState<FormField[]>([]);

    const loadDynamicEvents = async () => {
        try {
            // filters.status holds the status or undefined
            const res = await getDynamicEvents(page, 10, debouncedSearch, filters.status);
            setData(res?.data || []);
            setTotalPages(res?.totalPages || 1);
        } catch (err) {
            console.error("Error loading dynamic events:", err);
        }
    };

    useEffect(() => {
        loadDynamicEvents();
    }, [page, debouncedSearch, filters]);

    const handleView = async (row: any) => {
        try {
            // Call single API to get full details including form fields
            const res = await getDynamicEventById(row.dynmc_event_id);
            const e = res?.data || res;

            const formatted: any = {
                "Event Title": e.dynmc_event_title || "—",
                Description: (
                    <p className="text-gray-700 whitespace-pre-line">
                        {e.dynmc_event_description || "—"}
                    </p>
                ),
                "Event Location": e.dynmc_event_location || "—",
                "Event Date & Time": e.dynmc_event_date_time
                    ? new Date(e.dynmc_event_date_time).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                    : "—",
                "Form Available":
                    e.dynmc_event_form_available === 1 ||
                        e.dynmc_event_form_available === "1" ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            Yes
                        </span>
                    ) : (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                            No
                        </span>
                    ),
                "Form Header": e.dynmc_form_header || "—",
                "Form Description": e.dynmc_form_description ? (
                    <p className="text-gray-700 whitespace-pre-line">
                        {e.dynmc_form_description}
                    </p>
                ) : (
                    "—"
                ),
                Status:
                    e.status === 1 || e.status === "1" ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            Active
                        </span>
                    ) : (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                            Inactive
                        </span>
                    ),
                "Event Image": e.dynmc_event_image ? (
                    <div className="flex justify-end">
                        <img
                            src={server_url + e.dynmc_event_image}
                            alt="Event"
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    </div>
                ) : (
                    "—"
                ),
            };

            // Add form fields if available
            if (e.form_fields && Array.isArray(e.form_fields) && e.form_fields.length > 0) {
                formatted["Form Fields"] = (
                    <div className="space-y-2">
                        {e.form_fields.map((field: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="col-span-2 md:col-span-1">
                                        <span className="font-medium text-gray-700">Key:</span>{" "}
                                        <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{field.form_field_key}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Label:</span>{" "}
                                        <span className="text-gray-600">{field.form_field_label}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Type:</span>{" "}
                                        <span className="text-gray-600">{field.form_field_type}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Required:</span>{" "}
                                        <span className="text-gray-600">
                                            {field.is_required ? "Yes" : "No"}
                                        </span>
                                    </div>
                                    {field.options && (
                                        <div className="col-span-2">
                                            <span className="font-medium text-gray-700">Options:</span>{" "}
                                            <span className="text-gray-600">
                                                {Array.isArray(field.options)
                                                    ? field.options.join(", ")
                                                    : (typeof field.options === 'string' ? field.options : JSON.stringify(field.options))}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }

            formatted["Created At"] = e.created_at
                ? new Date(e.created_at).toLocaleString("en-IN")
                : "—";
            formatted["Updated At"] = e.updated_at
                ? new Date(e.updated_at).toLocaleString("en-IN")
                : "—";

            setViewData(formatted);
            setOpenView(true);
        } catch (err) {
            console.error("Failed to load dynamic event details:", err);
            toast({
                title: "Error",
                description: "Failed to load event details",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setFormData({
            dynmc_event_title: "",
            dynmc_event_image: null,
            dynmc_event_image_url: "",
            dynmc_event_description: "",
            dynmc_event_location: "",
            dynmc_event_date_time: "",
            dynmc_event_form_available: "0",
            dynmc_form_header: "",
            dynmc_form_description: "",
            status: "1",
        });
        setFormFields([]);
        setImagePreview(null);
        setSelected(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setOpenForm(true);
    };

    const handleOpenEdit = async (row: any) => {
        try {
            setLoading(true);
            const res = await getDynamicEventById(row.dynmc_event_id);
            const event = res?.data || res;

            setFormData({
                dynmc_event_title: event.dynmc_event_title || "",
                dynmc_event_image: null,
                dynmc_event_image_url: event.dynmc_event_image || "",
                dynmc_event_description: event.dynmc_event_description || "",
                dynmc_event_location: event.dynmc_event_location || "",
                dynmc_event_date_time: event.dynmc_event_date_time
                    ? new Date(event.dynmc_event_date_time).toISOString().slice(0, 16)
                    : "",
                dynmc_event_form_available: String(event.dynmc_event_form_available || 0),
                dynmc_form_header: event.dynmc_form_header || "",
                dynmc_form_description: event.dynmc_form_description || "",
                status: String(event.status || 1),
            });

            if (event.dynmc_event_image) {
                setImagePreview(server_url + event.dynmc_event_image);
            }

            if (event.form_fields && Array.isArray(event.form_fields)) {
                setFormFields(
                    event.form_fields.map((field: any) => ({
                        form_field_id: field.form_field_id,
                        form_field_key: field.form_field_key || "",
                        form_field_label: field.form_field_label || "",
                        form_field_type: field.form_field_type || "text",
                        is_required: field.is_required || 0,
                        options: Array.isArray(field.options) ? field.options.join(", ") : (field.options || ""),
                    }))
                );
            }

            setSelected(event);
            setOpenForm(true);
        } catch (error) {
            console.error("Error loading event:", error);
            toast({
                title: "Error",
                description: "Failed to load event data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, dynmc_event_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addFormField = () => {
        setFormFields([
            ...formFields,
            {
                form_field_key: "",
                form_field_label: "",
                form_field_type: "text",
                is_required: 0,
                options: "",
            },
        ]);
    };

    const removeFormField = (index: number) => {
        setFormFields(formFields.filter((_, i) => i !== index));
    };

    const updateFormField = (index: number, field: string, value: any) => {
        const updated = [...formFields];
        updated[index] = { ...updated[index], [field]: value };
        setFormFields(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("dynmc_event_title", formData.dynmc_event_title);
            fd.append("dynmc_event_description", formData.dynmc_event_description);
            fd.append("dynmc_event_location", formData.dynmc_event_location);
            fd.append("dynmc_event_date_time", formData.dynmc_event_date_time);
            fd.append("dynmc_event_form_available", String(formData.dynmc_event_form_available));
            fd.append("dynmc_form_header", formData.dynmc_form_header || "");
            fd.append("dynmc_form_description", formData.dynmc_form_description || "");
            fd.append("status", String(formData.status));
            fd.append("created_by", "1"); // Update with actual user ID if available
            fd.append("updated_by", "1"); // Update with actual user ID if available

            // Handle image
            if (formData.dynmc_event_image) {
                fd.append("dynmc_event_image", formData.dynmc_event_image);
            } else if (formData.dynmc_event_image_url) {
                fd.append("dynmc_event_image", formData.dynmc_event_image_url);
            }

            // Add form fields as JSON string
            let fields: any[] = [];
            if (formData.dynmc_event_form_available === "1") {
                fields = formFields.map((field) => ({
                    form_field_key: field.form_field_key,
                    form_field_label: field.form_field_label,
                    form_field_type: field.form_field_type,
                    is_required: Number(field.is_required),
                    options: field.options ? field.options.split(",").map((o) => o.trim()) : null,
                }));
            }
            fd.append("form_fields", JSON.stringify(fields));

            if (selected) {
                await updateDynamicEvent(selected.dynmc_event_id, fd);
                toast({
                    title: "Success",
                    description: "Dynamic Event updated successfully!",
                });
            } else {
                await createDynamicEvent(fd);
                toast({
                    title: "Success",
                    description: "Dynamic Event created successfully!",
                });
            }

            setOpenForm(false);
            resetForm();
            loadDynamicEvents();
        } catch (error: any) {
            console.error("Error saving dynamic event:", error);
            toast({
                title: "Error",
                description: error?.message || "Failed to save dynamic event",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h1 className="text-2xl font-semibold text-cyan-700">Dynamic Events</h1>

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
                        onClick={handleOpenCreate}
                        className="bg-cyan-700 flex items-center gap-2 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-cyan-800"
                    >
                        Create Dynamic Event <IconPlus size={20} />
                    </button>
                </div>
            </div>

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
                        key: "dynmc_event_form_available",
                        label: "Form Available",
                        render: (r) =>
                            r.dynmc_event_form_available == 1 || r.dynmc_event_form_available === "1" ? (
                                <div className="bg-green-100 text-black w-fit px-3 py-0.5 rounded-full">
                                    Yes
                                </div>
                            ) : (
                                <div className="bg-gray-100 text-black w-fit px-3 py-0.5 rounded-full">
                                    No
                                </div>
                            ),
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
                onEdit={handleOpenEdit}
                onDelete={(row) => {
                    setSelected(row);
                    setOpenDelete(true);
                }}
                onRowClick={handleView}
            />

            {/* Form Modal */}
            {openForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl my-8">
                        <div className="p-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-cyan-700">
                                    {selected ? "Edit Dynamic Event" : "Create Dynamic Event"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setOpenForm(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Event Details Section */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Event Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="dynmc_event_title"
                                                value={formData.dynmc_event_title}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Event Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="dynmc_event_description"
                                                value={formData.dynmc_event_description}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Event Location <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="dynmc_event_location"
                                                value={formData.dynmc_event_location}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Event Date & Time <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="dynmc_event_date_time"
                                                value={formData.dynmc_event_date_time}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Event Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            />
                                            {imagePreview && (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                            >
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Configuration Section */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Registration Form Configuration
                                    </h3>

                                    <div className="mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.dynmc_event_form_available === "1"}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dynmc_event_form_available: e.target.checked ? "1" : "0",
                                                    }))
                                                }
                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Enable Registration Form
                                            </span>
                                        </label>
                                    </div>

                                    {formData.dynmc_event_form_available === "1" && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Form Header
                                                </label>
                                                <input
                                                    type="text"
                                                    name="dynmc_form_header"
                                                    value={formData.dynmc_form_header}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Form Description
                                                </label>
                                                <textarea
                                                    name="dynmc_form_description"
                                                    value={formData.dynmc_form_description}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                />
                                            </div>

                                            {/* Form Fields Builder */}
                                            <div className="border-t pt-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-md font-semibold text-gray-800">Form Fields</h4>
                                                    <button
                                                        type="button"
                                                        onClick={addFormField}
                                                        className="bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-cyan-800 text-sm"
                                                    >
                                                        <IconPlus size={16} /> Add Field
                                                    </button>
                                                </div>

                                                {formFields.map((field, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white p-4 rounded-lg mb-3 border border-gray-200"
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h5 className="font-medium text-gray-700 text-sm">
                                                                Field {index + 1}
                                                            </h5>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFormField(index)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <IconTrash size={16} />
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    Field Key (Unique identifier)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={field.form_field_key}
                                                                    onChange={(e) =>
                                                                        updateFormField(index, "form_field_key", e.target.value)
                                                                    }
                                                                    placeholder="e.g. first_name"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    Field Label
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={field.form_field_label}
                                                                    onChange={(e) =>
                                                                        updateFormField(index, "form_field_label", e.target.value)
                                                                    }
                                                                    placeholder="e.g. First Name"
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    Field Type
                                                                </label>
                                                                <select
                                                                    value={field.form_field_type}
                                                                    onChange={(e) =>
                                                                        updateFormField(index, "form_field_type", e.target.value)
                                                                    }
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                                >
                                                                    <option value="text">Text</option>
                                                                    <option value="email">Email</option>
                                                                    <option value="number">Number</option>
                                                                    <option value="tel">Phone</option>
                                                                    <option value="date">Date</option>
                                                                    <option value="textarea">Textarea</option>
                                                                    <option value="select">Select</option>
                                                                    <option value="radio">Radio</option>
                                                                    <option value="checkbox">Checkbox</option>
                                                                    <option value="file">File</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="flex items-center gap-2 cursor-pointer mt-5">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={field.is_required === 1}
                                                                        onChange={(e) =>
                                                                            updateFormField(
                                                                                index,
                                                                                "is_required",
                                                                                e.target.checked ? 1 : 0
                                                                            )
                                                                        }
                                                                        className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                                                    />
                                                                    <span className="text-xs font-medium text-gray-700">
                                                                        Required Field
                                                                    </span>
                                                                </label>
                                                            </div>

                                                            {(field.form_field_type === "select" ||
                                                                field.form_field_type === "radio" ||
                                                                field.form_field_type === "checkbox") && (
                                                                    <div className="md:col-span-2">
                                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                            Options (comma-separated)
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={field.options}
                                                                            onChange={(e) =>
                                                                                updateFormField(
                                                                                    index,
                                                                                    "options",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            placeholder="Option 1, Option 2, Option 3"
                                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                                                        />
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {formFields.length === 0 && (
                                                    <p className="text-gray-500 text-center py-6 text-sm">
                                                        No form fields added yet. Click "Add Field" to create form fields.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center gap-3 justify-end pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenForm(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-cyan-700 text-white px-6 py-2 rounded-md hover:bg-cyan-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Saving..." : selected ? "Update Event" : "Create Event"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={async () => {
                    if (selected) {
                        await deleteDynamicEvent(selected.dynmc_event_id);
                        setOpenDelete(false);
                        loadDynamicEvents();
                    }
                }}
                title="Delete Dynamic Event"
                message={`Are you sure you want to delete "${selected?.dynmc_event_title}"?`}
            />

            <DynamicViewModal
                isOpen={openView}
                onClose={() => {
                    setOpenView(false);
                    setViewData(null);
                }}
                title="View Dynamic Event"
                data={viewData}
            />
        </div>
    );
}
