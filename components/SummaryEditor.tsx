'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SummaryEditorProps {
  summary: string;
  summaryId: string; // ID needed for API PUT
  onSummaryChange?: (summary: string) => void; // optional, for parent to update UI
}

export default function SummaryEditor({
  summary,
  summaryId,
  onSummaryChange,
}: SummaryEditorProps) {
  const [editedSummary, setEditedSummary] = useState(summary);
  const [lastSavedSummary, setLastSavedSummary] = useState(summary);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedSummary(summary);
    setLastSavedSummary(summary);
  }, [summary]);

  const handleChange = (value: string) => {
    setEditedSummary(value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
     const res = await fetch('/api/save-summary', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: summaryId,          // rename to match API
    summary: editedSummary, // rename to match API
  }),
});

      if (!res.ok) throw new Error('Failed to save summary');
      setLastSavedSummary(editedSummary);
      if (onSummaryChange) onSummaryChange(editedSummary);
    } catch (err) {
      console.error(err);
      alert('Error saving summary. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevert = () => {
    setEditedSummary(lastSavedSummary);
    if (onSummaryChange) onSummaryChange(lastSavedSummary);
  };

  const hasChanges = editedSummary !== lastSavedSummary;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Step 3: Edit Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary-editor">Generated Summary</Label>
          <Textarea
            id="summary-editor"
            value={editedSummary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-48 font-mono text-sm"
            placeholder="Your generated summary will appear here..."
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {hasChanges && <span className="text-orange-600">• Unsaved changes</span>}
            {!hasChanges && <span className="text-green-600">• Changes saved</span>}
          </div>

          <div className="space-x-2">
            {hasChanges && (
              <Button variant="outline" size="sm" onClick={handleRevert}>
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
          <p>Character count: {editedSummary.length}</p>
          <p className="mt-1">
            Tip: You can edit the summary to add context or adjust formatting before sharing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
