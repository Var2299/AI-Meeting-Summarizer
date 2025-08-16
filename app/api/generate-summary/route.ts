export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { transcript, customPrompt } = await request.json();

    if (!transcript || !customPrompt) {
      return NextResponse.json(
        { error: 'Transcript and custom prompt are required' },
        { status: 400 }
      );
    }

    const summary = await generateSummary(transcript, customPrompt);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in generate-summary API:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}