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

  // Attach JSON header only when not FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Attach token unless skipped
  if (!skipAuth) {
    const token = getToken?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    if (isFormData) {
      options.body = data;
      delete headers["Content-Type"]; // browser sets boundary
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

  const contentType = response.headers.get("content-type") || "";

  /* =========================
      HANDLE PDF / BINARY
     ========================= */
  if (
    contentType.includes("application/pdf") ||
    contentType.includes(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
  ) {
    if (!response.ok) {
      throw new Error(`File download failed (HTTP ${response.status})`);
    }
    return response; //  return raw response
  }

  /* =========================
     HANDLE JSON
     ========================= */
  if (contentType.includes("application/json")) {
    const text = await response.text();
    let parsed: any;

    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `Invalid JSON response from ${fullUrl}. Raw response: ${text.slice(
          0,
          200
        )}`
      );
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

  /* =========================
     OTHER TEXT RESPONSES
     ========================= */
  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Unexpected response (HTTP ${response.status}): ${text.slice(0, 300)}`
    );
  }

  return text;
}
