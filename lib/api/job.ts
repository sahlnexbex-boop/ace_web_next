import { apiRequest } from "./apiClients";

export const getJobs = async (
    page = 1,
    limit = 10,
    search = "",
    status?: number,
    type?: string,
    location?: string
) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search) params.append("search", search);
    if (status !== undefined) params.append("status", String(status));
    if (type) params.append("type", type);
    if (location) params.append("location", location);

    return apiRequest(`/api/jobs?${params.toString()}`, "GET");
};

export const getJobById = (id: number) =>
    apiRequest(`/api/jobs/${id}`, "GET");

export const createJob = (data: FormData) =>
    apiRequest("/api/jobs", "POST", data, true);

export const updateJob = (id: number, data: FormData) =>
    apiRequest(`/api/jobs/${id}`, "PUT", data, true);

export const deleteJob = (id: number) =>
    apiRequest(`/api/jobs/${id}`, "DELETE", undefined, true);

// Job Applications
export const getJobApplications = async (
    page = 1,
    limit = 10,
    search = "",
    status?: number,
    application_status?: number,
    job_id?: number
) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search) params.append("search", search);
    if (status !== undefined) params.append("status", String(status));
    if (application_status !== undefined) params.append("application_status", String(application_status));
    if (job_id !== undefined) params.append("job_id", String(job_id));

    return apiRequest(`/api/job-applications?${params.toString()}`, "GET");
};

export const getJobApplicationById = (id: number) =>
    apiRequest(`/api/job-applications/${id}`, "GET");

export const createJobApplication = (data: FormData) =>
    apiRequest("/api/job-applications", "POST", data, true);

export const updateJobApplication = (id: number, data: FormData) =>
    apiRequest(`/api/job-applications/${id}`, "PUT", data, true);

export const deleteJobApplication = (id: number) =>
    apiRequest(`/api/job-applications/${id}`, "DELETE", undefined, true);

export const downloadJobApplicationsExcel = async (options?: {
    page?: number;
    limit?: number;
    exportAll?: boolean;
    search?: string;
    status?: number;
    application_status?: number;
    job_id?: number;
}) => {
    const params = new URLSearchParams();

    if (options?.exportAll) {
        params.append("export", "all");
    } else {
        params.append("page", String(options?.page || 1));
        params.append("limit", String(options?.limit || 10));
    }

    if (options?.search) params.append("search", options.search);
    if (options?.status !== undefined) params.append("status", String(options.status));
    if (options?.application_status !== undefined)
        params.append("application_status", String(options.application_status));
    if (options?.job_id !== undefined) params.append("job_id", String(options.job_id));

    const response = (await apiRequest(
        `/api/job-applications/download-excel?${params.toString()}`,
        "GET"
    )) as Response;

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = options?.exportAll
        ? "job_applications_full.xlsx"
        : `job_applications_page_${options?.page || 1}.xlsx`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
