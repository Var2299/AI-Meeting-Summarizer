'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface EmailSharerProps {
  summary: string;
  meetingTitle: string;
  onEmailSent: () => void;
}

export default function EmailSharer({
  summary,
  meetingTitle,
  onEmailSent,
}: EmailSharerProps) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [subject, setSubject] = useState(
    meetingTitle ? `Meeting Summary: ${meetingTitle}` : 'Meeting Summary'
  );
  const [isSending, setIsSending] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addRecipient = () => {
    const email = currentEmail.trim().toLowerCase();
    
    if (!email) return;
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (recipients.includes(email)) {
      alert('This email address is already in the recipient list');
      return;
    }
    
    setRecipients([...recipients, email]);
    setCurrentEmail('');
  };

  const removeRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient();
    }
  };

  const handleSendEmail = async () => {
    if (recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    if (!summary.trim()) {
      alert('No summary to share');
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          subject: subject.trim() || 'Meeting Summary',
          summary: summary.trim(),
          meetingTitle,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send email');
      }

      alert(`Summary successfully sent to ${recipients.length} recipient(s)!`);
      onEmailSent();
      
      // Reset form
      setRecipients([]);
      setCurrentEmail('');
      setSubject(meetingTitle ? `Meeting Summary: ${meetingTitle}` : 'Meeting Summary');
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Error sending email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!summary) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 4: Share via Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-subject">Email Subject</Label>
          <Input
            id="email-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient-email">Add Recipients</Label>
          <div className="flex space-x-2">
            <Input
              id="recipient-email"
              type="email"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter email address"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addRecipient}
              disabled={!currentEmail.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {recipients.length > 0 && (
          <div className="space-y-2">
            <Label>Recipients ({recipients.length})</Label>
            <div className="flex flex-wrap gap-2">
              {recipients.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{email}</span>
                  <button
                    onClick={() => removeRecipient(email)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleSendEmail}
          disabled={recipients.length === 0 || !summary.trim() || isSending}
          className="w-full"
        >
          {isSending ? 'Sending Email...' : `Send Summary to ${recipients.length} Recipient(s)`}
        </Button>

        {recipients.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add recipient email addresses to share the summary.
          </p>
        )}
      </CardContent>
    </Card>
  );
}