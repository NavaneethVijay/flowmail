import axios from 'axios';
import { cookies } from 'next/headers';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const createServerApiClient = () => {
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
};
const apiClient = createServerApiClient();

apiClient.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("error in interceptor", error.response?.status);
        if (error.response?.status === 401) {
            const cookieStore = await cookies();
            cookieStore.delete('access_token')
        }
        return Promise.reject(error);
    }
);

export const serverAuthApi = {
    checkAuth: async () => {
        const response = await apiClient.get('/auth/check-auth');
        return response.data;
    }
};

export const emailApi = {
    getEmailDomainStats: async () => {
        const response = await apiClient.get('/projects/domain-stats');
        return response.data;
    },
    listEmails: async () => {
        const response = await apiClient.get('/emails/list');
        return response.data;
    },

    getEmail: async (id: string) => {
        const response = await apiClient.get(`/emails/${id}`);
        return response.data;
    },

    sendEmail: async (data: { to: string; subject: string; body: string }) => {
        const response = await apiClient.post('/emails/send', data);
        return response.data;
    },
    getEmailsByProjectId: async (id: string, forceRefresh: boolean = false) => {
        const response = await apiClient.get(`/emails/project/${id}?refresh=${forceRefresh}`);
        return response.data;
    },

    getProjects: async () => {
        const response = await apiClient.get('/projects');
        return response.data;
    },
    createProject: async (data: { name: string; description: string; domain_list: string; url_slug: string }) => {
        const response = await apiClient.post('/projects', data);
        return response.data;
    },
    deleteProject: async (id: number) => {
        const response = await apiClient.delete(`/projects/${id}`);
        return response.data;
    },

    getProjectBoardBySlug: async (slug: string) => {
        const response = await apiClient.get(`/projects/board/${slug}`);
        return response.data;
    },
    updateBoardColumns: async (boardId: number, columns: []) => {
        const response = await apiClient.post(`/projects/${boardId}/columns`, { columns });
        return response.data;
    },
};

export default apiClient
