
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

interface FeedbackPromptProps {
  appointmentId: string;
  doctorName: string;
  onClose: () => void;
}

export const FeedbackPrompt = ({ appointmentId, doctorName, onClose }: FeedbackPromptProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ rating, feedback }: { rating: number; feedback: string }) => {
      // In a real app, this would save to a feedback table
      const { error } = await supabase
        .from('appointments')
        .update({
          notes: JSON.stringify({
            feedback: { rating, comments: feedback, submitted_at: new Date().toISOString() }
          })
        })
        .eq('id', appointmentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully."
      });
      onClose();
    },
    onError: (error) => {
      console.error('Feedback submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    submitFeedbackMutation.mutate({ rating, feedback });
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          How was your appointment?
        </CardTitle>
        <CardDescription>
          Help us improve by sharing your experience with {doctorName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Overall Rating</Label>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="feedback" className="text-sm font-medium">
            Additional Comments (Optional)
          </Label>
          <Textarea
            id="feedback"
            placeholder="Tell us about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || submitFeedbackMutation.isPending}
            className="flex-1 flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            {submitFeedbackMutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
