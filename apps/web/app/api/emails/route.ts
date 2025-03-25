import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const pageToken = request.nextUrl.searchParams.get('pageToken');
    const response = await apiClient.get(`/emails/recent-inbox-emails?pageToken=${pageToken}`);

    return new Response(JSON.stringify(response.data), {
        status: 200,
        headers: {
            "Cache-Control": "public, max-age=60"
        }
    });
}