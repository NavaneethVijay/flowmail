import apiClient from "@/lib/server-api-client";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const response = await apiClient.post(`/projects/${body.boardId}/columns`, { columns: body.columns });
        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    }
}
