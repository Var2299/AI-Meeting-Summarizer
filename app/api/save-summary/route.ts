import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/** 
 * POST /api/save-summary
 * Save a new summary to the database
 */
export async function POST(request: NextRequest) {
  try {
    const { transcript, customPrompt, summary, meetingTitle } = await request.json();

    if (!summary?.trim()) {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('summaries');

    const result = await collection.insertOne({
      transcript: transcript || '',
      customPrompt: customPrompt || '',
      summary: summary.trim(),
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
    return NextResponse.json({ error: 'Failed to save summary' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, summary, customPrompt, transcript, meetingTitle } = await request.json();

    if (!id || !summary?.trim()) {
      return NextResponse.json({ error: 'ID and summary are required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid summary ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('summaries');

    // Fetch existing document
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: 'Summary not found' }, { status: 404 });
    }

    // Merge changes: only overwrite if provided, otherwise keep existing
    const updatedDoc = {
      summary: summary?.trim() ?? existing.summary,
      customPrompt: customPrompt ?? existing.customPrompt,
      transcript: transcript ?? existing.transcript,
      meetingTitle: meetingTitle ?? existing.meetingTitle,
      updatedAt: new Date(),
    };

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedDoc }
    );

    return NextResponse.json({ success: true, updatedFields: updatedDoc });
  } catch (error) {
    console.error('Error updating summary:', error);
    return NextResponse.json({ error: 'Failed to update summary' }, { status: 500 });
  }
}
