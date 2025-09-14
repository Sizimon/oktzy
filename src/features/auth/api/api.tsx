import apiRequest from "@/lib/api/apiRequest";

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