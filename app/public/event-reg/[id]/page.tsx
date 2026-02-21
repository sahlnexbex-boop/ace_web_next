"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDynamicEventById } from "@/lib/api/dynamicEvents";
import { createSubmission } from "@/lib/api/dynamicFormSubmissions";
import { useToast } from "@/contexts/ToastContext";
import { Calendar, MapPin, Loader2, Clock } from "lucide-react";

interface FormField {
    form_field_id: number;
    form_field_key: string;
    form_field_label: string;
    form_field_type: string;
    is_required: number;
    options: string | null;
}

interface DynamicEvent {
    dynmc_event_id: number;
    dynmc_event_title: string;
    dynmc_event_description: string;
    dynmc_event_location: string;
    dynmc_event_date_time: string;
    dynmc_event_image: string;
    dynmc_form_header: string;
    dynmc_form_description: string;
    form_fields: FormField[];
}

export default function EventRegPage() {
    const router = useRouter();
    const params = useParams();
    const { showSuccess, showError } = useToast();

    const id = params.id as string;
    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [event, setEvent] = useState<DynamicEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // normal text/number/select fields
    const [textValues, setTextValues] = useState<Record<number, string>>({});
    // file fields
    const [fileValues, setFileValues] = useState<Record<number, File | null>>({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await getDynamicEventById(Number(id));
                setEvent(res.data);
            } catch (err) {
                console.error("Failed to load event details", err);
                showError("Failed to load event details. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchEvent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleTextChange = (fieldId: number, val: string) => {
        setTextValues((prev) => ({ ...prev, [fieldId]: val }));
    };

    const handleFileChange = (fieldId: number, file: File | null) => {
        setFileValues((prev) => ({ ...prev, [fieldId]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;

        // validation
        for (const field of event.form_fields) {
            if (field.is_required === 1) {
                if (field.form_field_type === "file") {
                    if (!fileValues[field.form_field_id]) {
                        showError(`Please upload a file for ${field.form_field_label}`);
                        return;
                    }
                } else {
                    if (!textValues[field.form_field_id]) {
                        showError(`Please enter ${field.form_field_label}`);
                        return;
                    }
                }
            }
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("dynmc_event_id", String(event.dynmc_event_id));

            const submitted_values: any[] = [];

            event.form_fields.forEach(field => {
                if (field.form_field_type === "file") {
                    const file = fileValues[field.form_field_id];
                    if (file) {
                        formData.append(`field_${field.form_field_id}`, file);
                    }
                } else {
                    const val = textValues[field.form_field_id];
                    if (val !== undefined) {
                        submitted_values.push({
                            form_field_id: String(field.form_field_id),
                            form_field_value: val
                        });
                    }
                }
            });

            formData.append("submitted_values", JSON.stringify(submitted_values));

            await createSubmission(formData);
            showSuccess("Registration submitted successfully!");
            router.push("/public/home");

        } catch (err) {
            console.error("Submission failed", err);
            showError("Failed to submit registration. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-500 shadow-xl" size={48} />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">
                Event not found
            </div>
        );
    }

    return (
        <div className="min-h-screen tution-registration-page bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-10">
            {/* CSS Hack to force Autocomplete/Autofill to match the dark theme */}
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active,
                select:-webkit-autofill,
                select:-webkit-autofill:hover, 
                select:-webkit-autofill:focus, 
                select:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 1000px #0f172a inset !important; /* Matches slate-900 */
                    -webkit-text-fill-color: #f1f5f9 !important; /* Matches slate-100 */
                    transition: background-color 5000s ease-in-out 0s;
                    caret-color: white;
                }
            `}</style>

            <div className="relative w-full max-w-3xl">
                {/* Glow behind card */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 blur-3xl opacity-60 pointer-events-none" />

                {/* Glassmorphism Card */}
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/15 md:rounded-3xl rounded-lg shadow-2xl px-4 py-5 md:px-10 md:py-10 text-white">
                    <div className="mb-6 md:mb-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
                            {event.dynmc_form_header || event.dynmc_event_title}
                        </h1>
                        <p className="mt-3 text-sm md:text-base text-slate-200/80 max-w-2xl mx-auto">
                            {event.dynmc_form_description || event.dynmc_event_description}
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-cyan-200/90 font-medium">
                            {event.dynmc_event_date_time && (
                                <>
                                    <div className="flex items-center gap-2 bg-[#1A2E44] px-4 py-2 rounded-full border border-white/5 shadow-inner">
                                        <Calendar size={18} className="text-cyan-300" />
                                        <span className="text-cyan-100/90">
                                            {new Date(event.dynmc_event_date_time).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#1A2E44] px-4 py-2 rounded-full border border-white/5 shadow-inner">
                                        <Clock size={18} className="text-cyan-300" />
                                        <span className="text-cyan-100/90">
                                            {new Date(event.dynmc_event_date_time).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </>
                            )}
                            {event.dynmc_event_location && (
                                <div className="flex items-center gap-2 bg-[#1A2E44] px-4 py-2 rounded-full border border-white/5 shadow-inner">
                                    <MapPin size={18} className="text-cyan-300" />
                                    <span className="text-cyan-100/90">{event.dynmc_event_location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-4">
                            {event.form_fields.map((field) => (
                                <div
                                    key={field.form_field_id}
                                    className={`flex flex-col space-y-1.5 ${field.form_field_type === 'textarea' ? 'md:col-span-2' : ''}`}
                                >
                                    <label className="text-xs md:text-sm text-slate-100/90">
                                        {field.form_field_label}
                                        {field.is_required === 1 && <span className="text-red-400 ml-1">*</span>}
                                    </label>

                                    {field.form_field_type === "textarea" ? (
                                        <textarea
                                            value={textValues[field.form_field_id] || ""}
                                            onChange={(e) => handleTextChange(field.form_field_id, e.target.value)}
                                            className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                                            placeholder={`Enter ${field.form_field_label.toLowerCase()}`}
                                            rows={3}
                                        />
                                    ) : field.form_field_type === "select" ? (
                                        <select
                                            value={textValues[field.form_field_id] || ""}
                                            onChange={(e) => handleTextChange(field.form_field_id, e.target.value)}
                                            className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                                        >
                                            <option value="" className="bg-slate-900">Select an option</option>
                                            {field.options?.split(",").map((opt) => (
                                                <option key={opt.trim()} value={opt.trim()} className="bg-slate-900">
                                                    {opt.trim()}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.form_field_type === "file" ? (
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                handleFileChange(field.form_field_id, file);
                                            }}
                                            className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 file:cursor-pointer"
                                        />
                                    ) : (
                                        <input
                                            type={field.form_field_type || "text"}
                                            value={textValues[field.form_field_id] || ""}
                                            onChange={(e) => handleTextChange(field.form_field_id, e.target.value)}
                                            className="w-full md:rounded-xl rounded-md bg-slate-900/40 border border-slate-500/40 px-3 py-2 text-sm md:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/80"
                                            placeholder={`Enter ${field.form_field_label.toLowerCase()}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => router.push("/public/home")}
                                className="text-slate-200/80 text-sm hidden md:block hover:text-white transition-colors cursor-pointer font-medium"
                            >
                                ← Back to Home
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex w-full justify-center md:w-auto items-center px-6 py-2.5 md:rounded-xl rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-sm md:text-base font-semibold shadow-lg shadow-cyan-500/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-white"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Registration"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
