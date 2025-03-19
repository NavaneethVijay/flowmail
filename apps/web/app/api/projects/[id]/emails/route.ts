import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const response = await apiClient.post(`/projects/${id}/emails`, body);
        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to add email to project';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}