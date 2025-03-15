import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const response = await apiClient.get(`/emails/${id}`);
    return new Response(JSON.stringify(response.data), { status: 200 });
}
