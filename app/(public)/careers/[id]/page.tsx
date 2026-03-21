"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { getJobById, createJobApplication } from "@/lib/api/job";
import {
    IconMapPin,
    IconBriefcase,
    IconUsers,
    IconCalendar,
    IconClock,
    IconChevronLeft,
    IconSend,
    IconFileText,
    IconMail,
    IconPhone,
    IconUser,
    IconHome,
} from "@tabler/icons-react";
import { useToast } from "@/contexts/ToastContext";
import CourseHeader from "@/components/courseHeader";

export default function JobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formState, setFormState] = useState({
        candidate_name: "",
        candidate_email: "",
        candidate_phone: "",
        candidate_address: "",
        cover_letter: "",
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await getJobById(Number(id));
                setJob(res.data);
            } catch (err) {
                console.error("Error fetching job details:", err);
                showError("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchJob();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            showError("Please upload your resume");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("job_id", String(id));
            formData.append("candidate_name", formState.candidate_name);
            formData.append("candidate_email", formState.candidate_email);
            formData.append("candidate_phone", formState.candidate_phone);
            formData.append("candidate_address", formState.candidate_address);
            formData.append("cover_letter", formState.cover_letter);
            formData.append("resume_file", resumeFile);

            await createJobApplication(formData);
            showSuccess("Application submitted successfully!");
            // Reset form
            setFormState({
                candidate_name: "",
                candidate_email: "",
                candidate_phone: "",
                candidate_address: "",
                cover_letter: "",
            });
            setResumeFile(null);
        } catch (err: any) {
            console.error("Error submitting application:", err);
            showError(err?.message || "Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (!job) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => router.back()}
                    className="hidden mb-6 cursor-pointer md:flex items-center gap-2 text-gray-600 hover:text-cyan-700 transition-colors font-medium group"
                >
                    <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:shadow-md transition-all">
                        <IconChevronLeft size={20} />
                    </div>
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* LEFT COLUMN: JOB DETAILS */}
                    <div className="space-y-8">
                        <div className="rounded-3xl md:p-8 ">
                            <div className="mb-10">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                                    {job.job_title}
                                </h1>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="h-1 w-12 bg-cyan-600 rounded-full"></div>
                                    <p className="text-cyan-600 font-bold uppercase tracking-widest text-[10px]">
                                        Open Position in {job.job_location || "Manjeri"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-300">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                        <IconMapPin size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</p>
                                        <p className="font-semibold">{job.job_location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                        <IconBriefcase size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Experience</p>
                                        <p className="font-semibold">{job.experiance_level}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                        <IconClock size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Job Type</p>
                                        <p className="font-semibold">{job.job_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                        <IconUsers size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Openings</p>
                                        <p className="font-semibold">{job.opening_seats || "Multiple"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        Job Description
                                    </h2>
                                    <div
                                        className="text-gray-700 leading-relaxed space-y-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-4"
                                        dangerouslySetInnerHTML={{ __html: job.job_description }}
                                    ></div>
                                </section>

                                {job.job_info && (
                                    <section>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
                                        <div
                                            className="text-gray-600 space-y-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                                            dangerouslySetInnerHTML={{ __html: job.job_info }}
                                        ></div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: APPLY FORM */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl md:p-8 px-4 py-6 shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for this position</h2>
                            <p className="text-gray-500 mb-8 text-sm">Fill out the form below and we'll get back to you shortly.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                            <IconUser size={16} className="text-cyan-600" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="candidate_name"
                                            value={formState.candidate_name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                            <IconMail size={16} className="text-cyan-600" /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="candidate_email"
                                            value={formState.candidate_email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                            <IconPhone size={16} className="text-cyan-600" /> Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            name="candidate_phone"
                                            value={formState.candidate_phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 999 000 0000"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                            <IconHome size={16} className="text-cyan-600" /> Address
                                        </label>
                                        <textarea
                                            name="candidate_address"
                                            value={formState.candidate_address}
                                            onChange={handleInputChange}
                                            placeholder="Your full address..."
                                            required
                                            rows={2}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                            <IconFileText size={16} className="text-cyan-600" /> Cover Letter
                                        </label>
                                        <textarea
                                            name="cover_letter"
                                            value={formState.cover_letter}
                                            onChange={handleInputChange}
                                            placeholder="Briefly explain why you're a good fit..."
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                            Resume (PDF)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="resume-upload"
                                            />
                                            <label
                                                htmlFor="resume-upload"
                                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-cyan-500 hover:bg-cyan-50 transition-all cursor-pointer"
                                            >
                                                <IconSend size={28} className="text-cyan-600 mb-2" />
                                                <span className="text-sm font-medium text-gray-600">
                                                    {resumeFile ? resumeFile.name : "Click to upload CV"}
                                                </span>
                                                <span className="text-xs text-gray-400 mt-1">PDF max 5MB</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application <IconSend size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
