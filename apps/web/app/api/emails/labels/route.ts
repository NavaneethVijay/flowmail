import apiClient from "@/lib/server-api-client";
import { NextRequest } from "next/server";

export async function GET() {
    const response = await apiClient.get(`/emails/labels`);
    return new Response(JSON.stringify(response.data), { status: 200 });
}