import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    const apiResponse = await apiClient.get(
        `/projects/${id}/emails?forceRefresh=${forceRefresh}`
    );

    const headers = new Headers();
    if (!forceRefresh) {
        headers.set('Cache-Control', 'public, max-age=600'); // Cache for 10 minutes
    } else {
        headers.set('Cache-Control', 'no-cache');
    }
    return new Response(JSON.stringify(apiResponse.data), {
        status: 200,
        headers,
    });
}
