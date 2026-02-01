import { InviteRole, Role } from "@/types/user-type";
import axios from "axios";
import Cookies from "js-cookie";

// Create a small store for tokens outside of React
// Initialize from cookies for better client-side support on refresh
export let accessToken: string | null = typeof window !== 'undefined' ? Cookies.get("access_token") || null : null;
export let refreshToken: string | null = typeof window !== 'undefined' ? Cookies.get("refresh_token") || null : null;

// Helper to get cookies on the server
const getServerSideCookies = async () => {
    if (typeof window === 'undefined') {
        try {
            const { cookies } = await import("next/headers");
            return cookies();
        } catch (error) {
            return null;
        }
    }
    return null;
};

export const setApiTokens = (access: string | null, refresh: string | null) => {
    accessToken = access;
    refreshToken = refresh;

    if (typeof window !== 'undefined') {
        if (access) {
            Cookies.set("access_token", access, { expires: 7 });
        } else {
            Cookies.remove("access_token");
        }

        if (refresh) {
            Cookies.set("refresh_token", refresh, { expires: 30 });
        } else {
            Cookies.remove("refresh_token");
        }
    }
};

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});


// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        let token = accessToken;

        // If on server, try to get token from cookies
        if (typeof window === 'undefined') {
            const cookieStore = await getServerSideCookies();
            if (cookieStore) {
                token = cookieStore.get("access_token")?.value || null;
                // Forward all cookies for secondary auth (HttpOnly cookies)
                config.headers.Cookie = cookieStore.toString();
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//Response interceptor to handle refresh token

apiClient.interceptors.response.use(
    (response) => {
        // Note: Usually tokens are updated via setSession in the AuthProvider
        // but we can also handle it here if the API returns them in the response.
        return response;
    },
    async (error) => {
        console.log(error);
        const originalRequest = error.config;

        // Check if error.response exists before accessing status
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                let rToken = refreshToken;
                let cookieString = '';

                if (typeof window === 'undefined') {
                    const cookieStore = await getServerSideCookies();
                    if (cookieStore) {
                        rToken = cookieStore.get("refresh_token")?.value || null;
                        cookieString = cookieStore.toString();
                    }
                }

                if (!rToken && typeof window === 'undefined') {
                    throw new Error("No refresh token available");
                }

                // Use a separate axios instance or a direct call to avoid interceptor loop if needed
                const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`,
                    { refreshToken: rToken },
                    {
                        withCredentials: true,
                        headers: typeof window === 'undefined' ? { Cookie: cookieString } : {}
                    }
                );

                const { access_token, refresh_token } = response.data;

                // Update local tokens
                setApiTokens(access_token, refresh_token);

                // We still need a way to tell the AuthProvider to update its state.
                // This is usually done via a callback or by having AuthProvider listen to events.
                // For now, let's just update the header and retry.

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                setApiTokens(null, null);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: async (data: { email: string, password: string }) => {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    },
    register: async (data: { email: string, password: string, name: string, token?: string }) => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },
    refreshToken: async (data: { refreshToken: string }) => {
        const response = await apiClient.post("/auth/refresh-token", data);
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },

    acceptInvite: async (data: { token: string }) => {
        const response = await apiClient.post("/teams/invites/accept", data);
        return response.data;
    }
}

export const teamApi = {

    getTeams: async () => {
        const response = await apiClient.get("/teams");
        return response.data;
    },

    getTeam: async (teamId: string) => {
        const response = await apiClient.get(`/teams/${teamId}`);
        return response.data;
    },

    getTeamMembers: async (teamId: string) => {
        const response = await apiClient.get(`/teams/${teamId}/members`);
        return response.data;
    },
    createTeam: async (data: { name: string }) => {
        const response = await apiClient.post(`/teams`, data);
        return response.data;
    },
    updateTeam: async (teamId: string, data: { name: string }) => {
        const response = await apiClient.patch(`/teams/${teamId}`, data);
        return response.data;
    },
    deleteTeam: async (teamId: string) => {
        const response = await apiClient.delete(`/teams/${teamId}`);
        return response.data;
    },
    getTeamsByMemberId: async (userId: string) => {
        const response = await apiClient.get(`/teams/member/${userId}`);
        return response.data.teams;
    },
    inviteMember: async (data: { email: string, role: InviteRole }, teamid: string) => {
        const response = await apiClient.post(`/teams/${teamid}/invites`, data);
        return response.data;
    }
}

export const todoApi = {
    getTodos: async (teamId: string) => {
        const response = await apiClient.get(`/todo/${teamId}`);
        return response.data;
    },
    createTodo: async (data: { title: string, teamId: string }) => {
        const response = await apiClient.post(`/todo`, data);
        return response.data;
    },
    updateTodo: async (todoId: string, data: { title: string, teamId: string }) => {
        const response = await apiClient.patch(`/todo/${todoId}`, data);
        return response.data;
    },
    deleteTodo: async (todoId: string) => {
        const response = await apiClient.delete(`/todo/${todoId}`);
        return response.data;
    }
}
