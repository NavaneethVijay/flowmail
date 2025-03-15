import { NextRequest } from "next/server";
import apiClient from "@/lib/server-api-client";

// app/api/users/route.js
export async function GET(request: NextRequest) {
    const response = await apiClient.get("/projects/domain-stats");
    return new Response(JSON.stringify(response.data), { status: 200 });
}
