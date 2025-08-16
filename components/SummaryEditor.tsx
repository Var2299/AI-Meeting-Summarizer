'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SummaryEditorProps {
  summary: string;
  onSummaryChange: (summary: string) => void;
  onSaveSummary: () => void;
  isSaving: boolean;
}

export default function SummaryEditor({
  summary,
  onSummaryChange,
  onSaveSummary,
  isSaving,
}: SummaryEditorProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSummary, setOriginalSummary] = useState(summary);

  useEffect(() => {
    setOriginalSummary(summary);
    setHasChanges(false);
  }, [summary]);

  const handleSummaryChange = (value: string) => {
    onSummaryChange(value);
    setHasChanges(value !== originalSummary);
  };

  const handleSave = () => {
    onSaveSummary();
    setOriginalSummary(summary);
    setHasChanges(false);
  };

  const handleRevert = () => {
    onSummaryChange(originalSummary);
    setHasChanges(false);
  };

  if (!summary) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 3: Edit Summary </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary-editor">Generated Summary</Label>
          <Textarea
            id="summary-editor"
            value={summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="min-h-48 font-mono text-sm"
            placeholder="Your generated summary will appear here..."
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {hasChanges && (
              <span className="text-orange-600">• Unsaved changes</span>
            )}
            {!hasChanges && summary !== originalSummary && (
              <span className="text-green-600">• Changes saved</span>
            )}
          </div>
          
          <div className="space-x-2">
            {hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevert}
              >
                Revert Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              size="sm"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Character count: {summary.length}
          </p>
          <p className="mt-1">
            Tip: You can edit the summary to add additional context, 
            correct any inaccuracies, or adjust the formatting before sharing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}