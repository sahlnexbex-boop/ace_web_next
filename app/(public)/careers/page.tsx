"use client";

import { useEffect, useState } from "react";
import CourseHeader from "@/components/courseHeader";
import { useRouter } from "next/navigation";
import { getJobs } from "@/lib/api/job";
import {
    IconMapPin,
    IconBriefcase,
    IconUsers,
    IconCalendar,
    IconManualGearbox,
    IconClock
} from "@tabler/icons-react";
import { useToast } from "@/contexts/ToastContext";

export default function Careers() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { showError } = useToast();

    const data = {
        header: "Careers",
        content_01: "Join our team and grow your career with Ace Institute.",
        content_02: "Explore exciting opportunities and become part of our success story.",
    };

    const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch active jobs (status 1)
                const res = await getJobs(1, 100, "", 1);
                setJobs(res.data || []);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Removed handleApply and handleSubmitApplication as they move to the details page

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <CourseHeader data={data} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Open Vacancies</h2>
                        <p className="text-gray-600 mt-2">Find the role that fits your ambition</p>
                    </div>
                </div> */}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xxl:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                </div>
                                <div className="mt-6 h-10 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xxl:grid-cols-3 gap-12">
                        {jobs.map((job) => (
                            <div
                                key={job.job_id}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
                                        {job.job_image ? (
                                            <img
                                                src={server_url + job.job_image}
                                                alt={job.job_title}
                                                className="w-full h-full object-cover rounded-[10px]"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-[10px] flex flex-col items-center justify-center text-white text-[10px] font-bold text-center leading-tight p-1">
                                                <span>{job.job_title.split(' ')[0]}</span>
                                                <span>{job.job_title.split(' ')[1] || ""}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{job.job_title}</h3>
                                        <div className="mt-1 text-sm text-gray-500 line-clamp-2 min-h-[40px] line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: job.job_description }}>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-8 mb-5">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <IconBriefcase size={18} className="text-cyan-500" />
                                        <span>{job.experiance_level}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <IconMapPin size={18} className="text-cyan-500" />
                                        <span className="truncate">{job.job_location}</span>
                                    </div>
                                </div>
                                <div className="flex gap-8 mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                                            {job.job_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <IconUsers size={18} className="text-cyan-500" />
                                        <span>{job.opening_seats || "Multiple"} Seats Available</span>
                                    </div>
                                </div>
                                <div className="flex w-full justify-end">
                                    <button
                                        onClick={() => router.push(`/careers/${job.job_id}`)}
                                        className="mt-auto py-2 px-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer w-fit text-sm"
                                    >
                                        View Details
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IconBriefcase size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No open positions right now</h3>
                        <p className="text-gray-500 mt-2">Check back later or send us your resume for future consideration.</p>
                    </div>
                )}
            </div>

        </main >
    );
}
