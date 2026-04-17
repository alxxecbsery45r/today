import { ApiError, customFetch, type CustomFetchOptions } from "@workspace/api-client-react/custom-fetch";
import { authStore, csrfManager } from "./auth-context";

const getRawApiUrl = () => import.meta.env.VITE_API_URL || "/api";

export const getApiBase = () => {
  const apiUrl = getRawApiUrl().replace(/\/$/, "");
  return `${apiUrl}/admin`;
};

/**
 * Get token from secure session storage (not localStorage)
 * Prevents XSS attacks from stealing tokens
 */
export const getToken = () => {
  return authStore.getToken();
};

/**
 * Set token in secure session storage
 * @param token The auth token to store
 * @param expiresIn Token expiration time in milliseconds
 */
export const setToken = (token: string, expiresIn?: number) => {
  authStore.setToken(token, expiresIn);
};

/**
 * Atomic token removal - handles 401 errors safely without race conditions.
 * Uses secureAuthStore to prevent race conditions
 */
export function removeAdminToken(): void {
  authStore.clearToken();
}

export const uploadAdminImage = async (file: File): Promise<string> => {
  const token = getToken();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        // Get CSRF token for file upload
        const csrfToken = await csrfManager.getOrFetchToken().catch(() => "");
        const data = await customFetch<{ url: string }>(`${getApiBase()}/uploads/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "x-admin-token": token } : {}),
            ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
          },
          body: JSON.stringify({ base64, mimeType: file.type }),
          responseType: "json",
        });
        resolve(data.url as string);
      } catch (e) {
        reject(normalizeApiError(e, token));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const fetcher = async <T = any>(endpoint: string, options: CustomFetchOptions & RequestInit = {}): Promise<T> => {
  const token = getToken();
  const method = (options.method || "GET").toString().toUpperCase();
  const shouldFetchCsrf = !!token && !["GET", "HEAD", "OPTIONS"].includes(method);
  let csrfToken = "";

  if (shouldFetchCsrf && (options.headers as Record<string, any>)?.["x-csrf-token"] === undefined) {
    csrfToken = await csrfManager.getOrFetchToken().catch(() => "");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { "x-admin-token": token } : {}),
    ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
    ...(options.headers as Record<string, string>),
  };

  try {
    return await customFetch<T>(`${getApiBase()}${endpoint}`, {
      ...options,
      headers: headers as HeadersInit,
      responseType: "json",
    });
  } catch (e) {
    throw normalizeApiError(e, token);
  }
};

/**
 * Fetcher for unauthenticated endpoints (login, etc)
 * Does not require CSRF token since user is not yet authenticated
 */
export const fetcherPublic = async <T = any>(endpoint: string, options: CustomFetchOptions & RequestInit = {}): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  try {
    return await customFetch<T>(`${getApiBase()}${endpoint}`, {
      ...options,
      headers: headers as HeadersInit,
      responseType: "json",
    });
  } catch (e) {
    throw normalizeApiError(e, null);
  }
};

function normalizeApiError(error: unknown, token: string | null): Error {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Check if token exists at time of error - if it does, remove it atomically
      if (getToken()) {
        removeAdminToken();
      }
    }
    const data = error.data as Record<string, unknown> | null;
    const message = typeof data?.error === "string"
      ? data.error
      : typeof data?.message === "string"
        ? data.message
        : error.message;
    return Object.assign(new Error(message || "An error occurred"), { status: error.status, responseData: data });
  }
  if (error instanceof Error) return error;
  return new Error("An error occurred");
}
