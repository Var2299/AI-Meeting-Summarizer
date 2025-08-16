'use client';

import { useState } from 'react';
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

  const handleSummaryGenerated = async (generatedSummary: string, prompt: string) => {
    setSummary(generatedSummary);
    setCustomPrompt(prompt);
    
    // Auto-save the summary
    await handleSaveSummary(generatedSummary, prompt);
  };

  const handleSaveSummary = async (summaryToSave?: string, prompt?: string) => {
    const summaryData = summaryToSave || summary;
    const promptData = prompt || customPrompt;
    
    setIsSaving(true);
    
    try {
      if (summaryId) {
        // Update existing summary
        const response = await fetch('/api/save-summary', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: summaryId,
            summary: summaryData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update summary');
        }
      } else {
        // Create new summary
        const response = await fetch('/api/save-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript,
            customPrompt: promptData,
            summary: summaryData,
            meetingTitle: meetingTitle || 'Untitled Meeting',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save summary');
        }

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
    // Optional: Add any post-email-send logic here
    console.log('Email sent successfully');
  };

  const handleGenerateStart = () => {
    setIsGenerating(true);
  };

  const handleGenerateComplete = (generatedSummary: string, prompt: string) => {
    setIsGenerating(false);
    handleSummaryGenerated(generatedSummary, prompt);
  };

  const modifiedSummaryGenerator = {
    ...SummaryGenerator,
    handleGenerateSummary: async function(transcript: string, customPrompt: string) {
      handleGenerateStart();
      
      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: transcript.trim(),
            customPrompt: customPrompt.trim(),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to generate summary');
        }

        const { summary } = await response.json();
        handleGenerateComplete(summary, customPrompt);
      } catch (error) {
        console.error('Error generating summary:', error);
        alert(`Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsGenerating(false);
      }
    }
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
            onSummaryGenerated={handleGenerateComplete}
            isGenerating={isGenerating}
          />

          {summary && (
            <SummaryEditor
              summary={summary}
              onSummaryChange={setSummary}
              onSaveSummary={() => handleSaveSummary()}
              isSaving={isSaving}
            />
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