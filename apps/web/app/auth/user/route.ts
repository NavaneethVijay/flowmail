import { NextRequest } from "next/server";
import { serverAuthApi } from "@/lib/server-api-client";


export async function GET(request: NextRequest) {
  const user = await serverAuthApi.checkAuth();
  return new Response(JSON.stringify({ user: user }), {
    status: 200,
  });
}
