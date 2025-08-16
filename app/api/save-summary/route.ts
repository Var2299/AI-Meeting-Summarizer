import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { transcript, customPrompt, summary, meetingTitle } = await request.json();

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('summaries');

    const result = await collection.insertOne({
      transcript,
      customPrompt,
      summary,
      meetingTitle: meetingTitle || 'Untitled Meeting',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Error saving summary:', error);
    return NextResponse.json(
      { error: 'Failed to save summary' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, summary } = await request.json();

    if (!id || !summary) {
      return NextResponse.json(
        { error: 'ID and summary are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('summaries');
    const { ObjectId } = require('mongodb');

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          summary,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating summary:', error);
    return NextResponse.json(
      { error: 'Failed to update summary' },
      { status: 500 }
    );
  }
}