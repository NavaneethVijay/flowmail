import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";
import { todoApi } from "@/lib/server-api-client";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const response = await todoApi.getTodosByEmailId(id);
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to fetch todos';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}