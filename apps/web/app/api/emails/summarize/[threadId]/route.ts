import apiClient from '@/lib/server-api-client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

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