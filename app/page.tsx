'use client';

import { useState, useRef, useEffect } from 'react';
import TranscriptUpload from '@/components/TranscriptUpload';
import SummaryGenerator from '@/components/SummaryGenerator';
import SummaryEditor from '@/components/SummaryEditor';
import EmailSharer from '@/components/EmailSharer';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [summaryId, setSummaryId] = useState<string | null>(null);

  const summaryContainerRef = useRef<HTMLDivElement>(null);

  // Handles AI summary generation
  const handleSummaryGenerated = async (generatedSummary: string, prompt: string) => {
    setSummary(generatedSummary);
    setCustomPrompt(prompt);

    // Auto-save the summary
    await handleSaveSummary(generatedSummary, prompt);

    // Auto-scroll to summary container after DOM update
    setTimeout(() => {
      summaryContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

  };

  // Handles saving summary (new or update)
  const handleSaveSummary = async (summaryToSave?: string, prompt?: string) => {
    const summaryData = summaryToSave ?? summary;
    const promptData = prompt ?? customPrompt;

    setIsSaving(true);

    try {
      if (summaryId) {
        // Update existing summary
        const response = await fetch('/api/save-summary', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: summaryId, summary: summaryData }),
        });
        if (!response.ok) throw new Error('Failed to update summary');
      } else {
        // Create new summary
        const response = await fetch('/api/save-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript,
            customPrompt: promptData,
            summary: summaryData,
            meetingTitle: meetingTitle || 'Untitled Meeting',
          }),
        });
        if (!response.ok) throw new Error('Failed to save summary');

        const { id } = await response.json();
        setSummaryId(id);
      }
    } catch (error) {
      console.error('Error saving summary:', error);
      alert('Error saving summary. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailSent = () => {
    console.log('Email sent successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Meeting Summarizer
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload transcripts, generate AI summaries, and share via email
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          <TranscriptUpload
            transcript={transcript}
            title={meetingTitle}
            onTranscriptChange={setTranscript}
            onTitleChange={setMeetingTitle}
          />

          <SummaryGenerator
            transcript={transcript}
            onSummaryGenerated={handleSummaryGenerated}
            isGenerating={isGenerating}
          />

          {summary && (
            <div ref={summaryContainerRef}>
              <SummaryEditor
                summary={summary}
                onSummaryChange={setSummary} // keeps it editable
                onSaveSummary={() => handleSaveSummary()} // Save button works
                isSaving={isSaving}
              />
            </div>
          )}

          {summary && (
            <EmailSharer
              summary={summary}
              meetingTitle={meetingTitle}
              onEmailSent={handleEmailSent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
