import { NextRequest } from "next/server";
import { todoApi } from "@/lib/server-api-client";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const response = await todoApi.updateTodo(id, body);
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to update todo';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await todoApi.deleteTodo(id);
        return new Response(null, { status: 204 });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to delete todo';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}