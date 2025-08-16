'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SummaryGeneratorProps {
  transcript: string;
  onSummaryGenerated: (summary: string, prompt: string) => void;
  isGenerating: boolean;
}

export default function SummaryGenerator({
  transcript,
  onSummaryGenerated,
  isGenerating,
}: SummaryGeneratorProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const promptTemplates = [
    {
      value: 'executive',
      label: 'Executive Summary',
      prompt: 'create a concise executive summary with key decisions, action items, and next steps in bullet points',
    },
    {
      value: 'action-items',
      label: 'Action Items Only',
      prompt: 'extract and list only the action items, decisions, and tasks assigned to specific people',
    },
    {
      value: 'detailed',
      label: 'Detailed Summary',
      prompt: 'provide a comprehensive summary including main topics discussed, decisions made, and follow-up actions',
    },
    {
      value: 'key-points',
      label: 'Key Points',
      prompt: 'summarize the main discussion points and conclusions in a structured format',
    },
  ];

  const handleTemplateSelect = (value: string) => {
    setSelectedTemplate(value);
    const template = promptTemplates.find(t => t.value === value);
    if (template) {
      setCustomPrompt(template.prompt);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      alert('Please provide a transcript first');
      return;
    }

    if (!customPrompt.trim()) {
      alert('Please provide a custom prompt');
      return;
    }

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
      onSummaryGenerated(summary, customPrompt);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert(`Error generating summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 2: Generate AI Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Quick Templates (Optional)</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template or write custom prompt below" />
            </SelectTrigger>
            <SelectContent>
              {promptTemplates.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-prompt">Custom Instructions</Label>
          <Textarea
            id="custom-prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom instructions (e.g., 'Summarize in bullet points for executives' or 'Highlight only action items')"
            className="min-h-24"
          />
        </div>

        <Button
          onClick={handleGenerateSummary}
          disabled={!transcript.trim() || !customPrompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating Summary...' : 'Generate Summary'}
        </Button>

        {!transcript.trim() && (
          <p className="text-sm text-muted-foreground">
            Please upload or paste a transcript first.
          </p>
        )}
      </CardContent>
    </Card>
  );
}