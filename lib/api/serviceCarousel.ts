import { apiRequest } from "./apiClients";

export const getServiceCarousels = async (
    page = 1,
    limit = 10,
    search = "",
    status?: number
) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search) params.append("search", search);
    if (status !== undefined) params.append("status", String(status));

    return apiRequest(
        `/api/service-carousel?${params.toString()}`,
        "GET"
    );
};

export const getServiceCarouselById = (id: number) =>
    apiRequest(`/api/service-carousel/${id}`, "GET");


export const createServiceCarousel = (data: FormData) =>
    apiRequest(
        "/api/service-carousel",
        "POST",
        data,
        true
    );


export const bulkDeleteServiceCarousel = (ids: number[]) =>
    apiRequest(
        "/api/service-carousel/bulk-delete",
        "POST",
        { ids },
        false
    );


export const bulkServiceCarouselStatusUpdate = (
    ids: number[],
    status: number
) =>
    apiRequest(
        "/api/service-carousel/bulk-status",
        "POST",
        { ids, status },
        false
    );
