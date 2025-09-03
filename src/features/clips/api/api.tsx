import { CuratorData } from "@/types/types";
import apiRequest from "@/lib/api/apiRequest";

export const clipsAPI = {
    create: (title: string, curatorData: CuratorData) => {
        const { clipUrl, timestamps } = curatorData;
        return apiRequest('/clips/create', {
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