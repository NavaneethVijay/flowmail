import apiClient from "@/lib/server-api-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const response = await apiClient.get('/projects');
        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to fetch projects';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await apiClient.post('/projects', body);
        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to create project';
        return new Response(JSON.stringify({ error: message }), { status });
    }
}