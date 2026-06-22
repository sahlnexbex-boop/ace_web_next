import { apiRequest } from "./apiClients";

export const getBranches = async (
    page = 1,
    limit = 10,
    search = "",
    status?: number,
) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search) params.append("search", search);
    if (status !== undefined) params.append("status", String(status));

    return apiRequest(`/api/branches?${params.toString()}`, "GET");
};

export const getBranchById = (id: number) =>
    apiRequest(`/api/branches/${id}`, "GET");

export const createBranch = (data: any) =>
    apiRequest("/api/branches", "POST", data);

export const updateBranch = (id: number, data: any) =>
    apiRequest(`/api/branches/${id}`, "PUT", data);

export const deleteBranch = (id: number) =>
    apiRequest(`/api/branches/${id}`, "DELETE");