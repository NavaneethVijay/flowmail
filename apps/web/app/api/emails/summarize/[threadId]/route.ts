import apiClient from '@/lib/server-api-client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = params.threadId;

    // Add your logic here to generate or fetch the summary
    // For example:
    // const summary = await yourSummaryLogic(threadId);
    const response = await apiClient.get(`/emails/summarize/${threadId}`);

    return NextResponse.json({
      summary: response.data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}