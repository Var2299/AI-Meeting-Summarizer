'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TranscriptUploadProps {
  onTranscriptChange: (transcript: string) => void;
  onTitleChange: (title: string) => void;
  transcript: string;
  title: string;
}

export default function TranscriptUpload({
  onTranscriptChange,
  onTitleChange,
  transcript,
  title,
}: TranscriptUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      alert('Please upload a text file (.txt)');
      return;
    }

    setIsUploading(true);
    
    try {
      const text = await file.text();
      onTranscriptChange(text);
      
      // Auto-generate title from filename
      const fileName = file.name.replace('.txt', '');
      if (!title) {
        onTitleChange(fileName);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearTranscript = () => {
    onTranscriptChange('');
    onTitleChange('');
    // Reset file input
    const fileInput = document.getElementById('transcript-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 1: Upload Meeting Transcript</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meeting-title">Meeting Title (Optional)</Label>
          <Input
            id="meeting-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter meeting title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transcript-file">Upload Text File</Label>
          <Input
            id="transcript-file"
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>

        <div className="text-center">
          <span className="text-muted-foreground">OR</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transcript-text">Paste Transcript Text</Label>
          <Textarea
            id="transcript-text"
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            className="min-h-32"
          />
        </div>

        {transcript && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Character count: {transcript.length}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearTranscript}
            >
              Clear
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Uploading file...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}