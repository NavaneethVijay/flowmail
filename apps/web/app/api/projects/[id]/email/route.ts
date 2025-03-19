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

    return new Response(JSON.stringify(apiResponse.data), {
        status: 200,
    });
}
