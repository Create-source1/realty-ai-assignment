import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { 
  Edit, 
  Trash2, 
  Sparkles, 
  Save, 
  X, 
  Clock,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { api } from '../api/axiosConfig';
import { toast } from 'sonner';

const NoteCard = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(note.transcript);
  const [summarizing, setSummarizing] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTranscript(note.transcript);
  };

  const handleSave = async () => {
    if (editedTranscript.trim() === note.transcript) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/notes/${note.id}`, {
        transcript: editedTranscript.trim()
      });
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTranscript(note.transcript);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${note.id}`);
        onDelete(note.id);
        toast.success('Note deleted successfully');
      } catch (error) {
        toast.error('Failed to delete note');
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const response = await api.post(`/summarize/${note.id}`);
      const updatedNote = { ...note, summary: response.data.summary };
      onUpdate(updatedNote);
      toast.success('Summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
      console.error('Error generating summary:', error);
    } finally {
      setSummarizing(false);
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="card group relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Voice Note</span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              disabled={isEditing}
              className="hover:bg-blue-50 hover:text-blue-600 rounded-full p-1.5"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="hover:bg-red-50 hover:text-red-600 rounded-full p-1.5"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Transcript Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript</h4>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                placeholder="Edit your transcript..."
                className="min-h-[100px] resize-none input-field"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center space-x-1"
                >
                  <X className="h-3 w-3" />
                  <span>Cancel</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || editedTranscript.trim() === ''}
                  className="btn-primary flex items-center space-x-1"
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed text-sm">
              {truncateText(note.transcript)}
            </p>
          )}
        </div>

        {/* Summary Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">AI Summary</h4>
            {!note.summary && !isEditing && (
              <Button
                size="sm"
                onClick={handleSummarize}
                disabled={summarizing}
                className="btn-primary flex items-center space-x-1 text-xs"
              >
                {summarizing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                <span>{summarizing ? 'Generating...' : 'Summarize'}</span>
              </Button>
            )}
          </div>
          
          {note.summary ? (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {truncateText(note.summary)}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No summary available. Click "Summarize" to generate an AI summary.
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Created {formatDate(note.created_at)}</span>
          </div>
          
          {note.summary && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
              <Sparkles className="h-2 w-2 mr-1" />
              Summarized
            </Badge>
          )}
        </div>

        {note.updated_at !== note.created_at && (
          <div className="text-xs text-gray-400 text-center">
            Last edited {formatDate(note.updated_at)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;