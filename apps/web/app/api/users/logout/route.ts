import apiClient from "@/lib/server-api-client";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const response = await apiClient.post('/auth/logout');
    if (response.status === 200) {
        // @ts-ignore
        cookies().delete('access_token');
    }
    return new Response(JSON.stringify(response.data), { status: response.status });
}
