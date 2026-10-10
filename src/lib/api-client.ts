import { getStoredToken } from "./auth-storage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export class ApiError extends Error {
  code?: string;
  statusCode: number;
  errors?: unknown[];

  constructor(message: string, statusCode: number, code?: string, errors?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getStoredToken();
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: "include",
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      const errorMessage =
        data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.code, data?.errors);
    }

    // DevGauge backend formats responses as { success: true, message: string, data: ... }
    return (data?.data !== undefined ? data.data : data) as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Network error occurred", 500);
  }
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { method: "GET", ...options }),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { method: "DELETE", ...options }),
};
