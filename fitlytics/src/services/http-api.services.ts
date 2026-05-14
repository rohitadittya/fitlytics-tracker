import { useSessionStore } from "@/stores/sessions";
import { useUserStore } from "@/stores/user";
import type { PaginationRequest } from "../../../server/types/api-response";

const API_BASE_URL = import.meta.env.VITE_API_ROOT;

const httpRestClient = <T>(
    url: string,
    data?: unknown,
    options: RequestInit = {},
): Promise<T> => {
    const userStore = useUserStore();
    const jwtToken = userStore.getJWTToken();

    options = {
        method: data ? 'POST' : 'GET',

        body: data ? JSON.stringify(data) : undefined,
        ...options,

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
            ...options.headers,
        },
    };

    return fetch(url, options).then((res) => {
        if (!res.ok) {
            if (res.headers.get('Content-Type')?.includes('application/json')) {
                return res.json().then((data) => {
                    throw new Error(data.message || 'An error occurred')
                });
            }
            return res.text().then((text) => {
                throw new Error(text)
            });
        }
        return res.json() as Promise<T>
    });
};

export const httpClientWithSession = async <T>(endpoint: string, data?: unknown, options: RequestInit = {}, invalidateSessionOnFailure: boolean = false, paginationRequest?: PaginationRequest) => {
    const session = useSessionStore();
    let url = `api${endpoint}`

    if (paginationRequest) {
        url += `?${new URLSearchParams(paginationRequest as Record<string, string>)}`;
    }

    return await session.httpClientApi<T>(url, data, options, invalidateSessionOnFailure);
};

export const httpClient = async <T>(endpoint: string, data?: unknown, options: RequestInit = {}, paginationRequest?: PaginationRequest) => {
    let url = endpoint

    if (paginationRequest) {
        url += `?${new URLSearchParams(paginationRequest as Record<string, string>)}`;
    }
    return await httpRestClient<T>(url, data, options)
};
