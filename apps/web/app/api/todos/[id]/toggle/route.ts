import { NextRequest } from "next/server";
import { todoApi } from "@/lib/server-api-client";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const response = await todoApi.toggleTodo(id);

        // Map the response back to frontend Todo interface
        const updatedTodo = {
            ...response,
            description: response.details, // map details back to description for FE
        };

        return new Response(JSON.stringify(updatedTodo), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to toggle todo';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}