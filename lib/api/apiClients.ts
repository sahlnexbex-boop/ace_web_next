// lib/api/apiClients.ts
import { getToken } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function apiRequest(
  url: string,
  method: string = "GET",
  data?: any,
  isFormData: boolean = false,
  skipAuth: boolean = false
) {
  const headers: Record<string, string> = {};

  // Only add JSON Content-Type if not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Attach token unless explicitly skipped
  if (!skipAuth) {
    const token = getToken?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  // Build correct full URL
  const fullUrl = `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  // Prepare fetch options
  const options: RequestInit = {
    method,
    headers,
  };

  // Add body only if there’s data
  if (data) {
    if (isFormData) {
      options.body = data; // FormData as-is
      delete headers["Content-Type"]; // Browser will set correct multipart boundary
    } else {
      options.body = JSON.stringify(data);
    }
  }

  let response: Response;
  try {
    response = await fetch(fullUrl, options);
  } catch (err: any) {
    throw new Error(`Network error: ${err.message || err}`);
  }

  // Read response as text first (so we can handle non-JSON gracefully)
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";

  let parsed: any = null;
  if (contentType.includes("application/json")) {
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `Invalid JSON response from ${fullUrl}. Raw response: ${text.slice(0, 200)}`
      );
    }
  } else {
    // Not JSON — could be an HTML error page
    if (!response.ok) {
      const snippet = text.slice(0, 300);
      throw new Error(
        `Unexpected non-JSON error response (HTTP ${response.status}): ${snippet}`
      );
    }
    // Successful non-JSON response (rare) — return raw text
    return text;
  }

  // Handle API errors properly
  if (!response.ok) {
    const msg =
      parsed?.message ||
      parsed?.error ||
      parsed?.msg ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new Error(msg);
  }

  // ✅ Return parsed JSON
  return parsed;
}
