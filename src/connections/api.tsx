import { CuratorData } from "@/types/types";

const API_BASE_URL = 'http://localhost:5007/api'


const apiRequest = async (endpoint: string, options: RequestInit) => {
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Always send cookies for authentication
        ...options,
    };

    try {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config); 

        if (response.status === 401) {
            // Just throw an error, let the caller handle it
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.error || errorData.message || 'API request failed');
            } else {
                const text = await response.text();
                console.error('Non-JSON error response:', text);
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export const authAPI = {
    register: (username: string, email: string, password: string) => 
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        }),

    login: (email: string, password: string) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    me: () =>
        apiRequest('/auth/me', {
            method: 'GET',
            credentials: 'include',
        }),

    logout: () =>
        apiRequest('/auth/logout', {
            method: 'POST',
            credentials: 'include',
        }),
}

export const clipsAPI = {
    create: (title: string, curatorData: CuratorData) => {
        const { clipUrl, timestamps } = curatorData;
        apiRequest('/clips/create', {
            method: 'POST',
            body: JSON.stringify({ 
                title: title, 
                clipUrl,
                timestamps
            }),
        });
    },

    getAll: () =>
        apiRequest('/clips/fetch', {
            method: 'GET',
        }),

    update: (id: string, data: any) =>
        apiRequest(`/clips/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiRequest(`/clips/${id}`, {
            method: 'DELETE',
        }),
}