// /lib/api/apiClients.ts
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

  // ✅ Add JSON Content-Type only when not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // ✅ Attach token unless explicitly skipped
  if (!skipAuth) {
    const token = getToken?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    if (isFormData) {
      // Browser will handle boundary & content-type automatically
      options.body = data;
      delete headers["Content-Type"];
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
    if (!response.ok) {
      throw new Error(
        `Unexpected non-JSON error response (HTTP ${response.status}): ${text.slice(
          0,
          300
        )}`
      );
    }
    return text;
  }

  if (!response.ok) {
    const msg =
      parsed?.message ||
      parsed?.error ||
      parsed?.msg ||
      `HTTP ${response.status} ${response.statusText}`;
    throw new Error(msg);
  }

  return parsed;
}
