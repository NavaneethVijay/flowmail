import apiClient from "@/lib/server-api-client";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const response = await apiClient.post('/auth/logout');
    if (response.status === 200) {
        // @ts-ignore
        cookies().set('access_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.flowmail.in' : undefined,
            maxAge: 0  // This ensures the cookie is immediately expired
        });
        // @ts-ignore
        cookies().delete('access_token');
    }
    return new Response(JSON.stringify(response.data), { status: response.status });
}
