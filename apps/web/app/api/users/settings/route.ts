import apiClient from "@/lib/server-api-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const response = await apiClient.get('/auth/settings');
        return new Response(JSON.stringify(response.data), { status: response.status });
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }
}
