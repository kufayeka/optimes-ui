// import { BASE_URL2,BASE_PORT2 } from "./api-config";
export const BASE_URL2 = 'http://192.168.68.77'
export const BASE_PORT2 = '7200'

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Centralized API fetch function
const apiFetch = async (endpoint, method = "GET", options = {}) => {
  const { headers, body, query, credentials = "include", ...restOptions } = options;

  // Build URL with query parameters if provided
  const url = new URL(`${BASE_URL2}:${BASE_PORT2}${endpoint}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      credentials,
      ...restOptions,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || `HTTP error! Status: ${response.status}`);
    }

    // Handle non-JSON responses (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { status: response.status, data: null };
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
};

// Public API methods
export const useApiNew = () => {
  return {
    get: (endpoint, options = {}) => apiFetch(endpoint, "GET", options),
    post: (endpoint, body, options = {}) => apiFetch(endpoint, "POST", { ...options, body }),
    put: (endpoint, body, options = {}) => apiFetch(endpoint, "PUT", { ...options, body }),
    del: (endpoint, options = {}) => apiFetch(endpoint, "DELETE", options),
    patch: (endpoint, body, options = {}) => apiFetch(endpoint, "PATCH", { ...options, body }),
  };
};