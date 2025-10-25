// lib/api/apiClients.ts
import { getToken } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(
  url: string,
  method = "GET",
  data?: any,
  isFormData = false,
  skipAuth = false
) {
  const headers: Record<string, string> = {};

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (!skipAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: data
      ? isFormData
        ? data
        : JSON.stringify(data)
      : undefined,
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "API Error");
  return result;
}
