import { NextRequest, NextResponse } from 'next/server';
import { sendSummaryEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, summary, meetingTitle } = await request.json();

    if (!recipients || !recipients.length || !summary) {
      return NextResponse.json(
        { error: 'Recipients and summary are required' },
        { status: 400 }
      );
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter((email: string) => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    const success = await sendSummaryEmail(
      recipients,
      subject || 'Meeting Summary',
      summary,
      meetingTitle
    );

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}