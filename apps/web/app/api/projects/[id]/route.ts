import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const response = await apiClient.delete(`/projects/${id}`);
    return new Response(JSON.stringify(response.data), { status: 200 });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const response = await apiClient.get(`/projects/board/${id}`);
    return new Response(JSON.stringify(response.data), { status: 200 });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const body = await request.json();
    const response = await apiClient.put(`/projects/${id}`, body);
    return new Response(JSON.stringify(response.data), { status: 200 });
}