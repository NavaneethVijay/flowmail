import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await apiClient.post('/todos', body);
        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to create todo';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}