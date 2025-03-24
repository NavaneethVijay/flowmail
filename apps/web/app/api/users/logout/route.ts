import apiClient from "@/lib/server-api-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const response = await apiClient.post('/auth/logout');

    const res = new NextResponse(JSON.stringify(response.data), { status: response.status });

    if (response.status === 200) {
        res.headers.append('Set-Cookie', `access_token=; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === 'production' ? 'true' : 'false'}; SameSite=${process.env.NODE_ENV === 'production' ? 'None' : 'Lax'}; Max-Age=0; Domain=${process.env.NODE_ENV === 'production' ? '.flowmail.in' : ''}`);
    }

    return res;
}
