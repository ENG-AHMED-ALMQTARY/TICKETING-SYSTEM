import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/Base';

interface CommentBoxProps {
  onSubmit: (message: string) => Promise<void>;
}

export const CommentBox: React.FC<CommentBoxProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setComment('');
    } catch (error) {
      // Error handling is managed by parent or store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">Discussion</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment or internal note..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
        />
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting} disabled={!comment.trim()} size="sm">
            <Send className="w-4 h-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
};