
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Star, Send, User, Clock, ThumbsUp, AlertTriangle } from 'lucide-react';

export const SurgeonNurseFeedbackFlow = () => {
  const [activeTab, setActiveTab] = useState('submit');

  const feedbackCategories = [
    'Communication',
    'Teamwork',
    'Technical Skills',
    'Patient Safety',
    'Equipment/Supplies',
    'Process Improvement',
    'Training Need'
  ];

  const feedbackItems = [
    {
      id: 1,
      category: 'Communication',
      type: 'Positive',
      from: 'Dr. Smith',
      to: 'Nurse Johnson',
      surgery: 'CABG - John Doe',
      date: '2024-01-15',
      time: '10:30 AM',
      rating: 5,
      feedback: 'Excellent communication during critical phase. Anticipated needs perfectly.',
      status: 'Acknowledged'
    },
    {
      id: 2,
      category: 'Process Improvement',
      type: 'Suggestion',
      from: 'Nurse Davis',
      to: 'OT Team',
      surgery: 'Hip Replacement - Jane Smith',
      date: '2024-01-15',
      time: '08:15 AM',
      rating: 4,
      feedback: 'Consider pre-positioning instruments for faster access during procedure.',
      status: 'Under Review'
    },
    {
      id: 3,
      category: 'Patient Safety',
      type: 'Concern',
      from: 'Dr. Johnson',
      to: 'Equipment Team',
      surgery: 'General',
      date: '2024-01-14',
      time: '02:45 PM',
      rating: 2,
      feedback: 'Equipment malfunction in OT-2. Need immediate attention to prevent delays.',
      status: 'Action Taken'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Positive': return 'bg-green-100 text-green-800';
      case 'Suggestion': return 'bg-blue-100 text-blue-800';
      case 'Concern': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Acknowledged': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Action Taken': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StarRating = ({ rating, onRatingChange, readOnly = false }: { rating: number, onRatingChange?: (rating: number) => void, readOnly?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${!readOnly ? 'cursor-pointer' : ''}`}
            onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-green-600" />
          Surgeon & Nurse Feedback Flow
        </h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveTab('submit')}
            variant={activeTab === 'submit' ? 'default' : 'outline'}
          >
            Submit Feedback
          </Button>
          <Button 
            onClick={() => setActiveTab('review')}
            variant={activeTab === 'review' ? 'default' : 'outline'}
          >
            Review Feedback
          </Button>
        </div>
      </div>

      {activeTab === 'submit' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit New Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Feedback Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Feedback Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive Feedback</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="concern">Concern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Related Surgery (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surgery" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cabg">CABG - John Doe</SelectItem>
                      <SelectItem value="hip">Hip Replacement - Jane Smith</SelectItem>
                      <SelectItem value="appendix">Appendectomy - Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Feedback For</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="nurse-johnson">Nurse Johnson</SelectItem>
                      <SelectItem value="ot-team">OT Team</SelectItem>
                      <SelectItem value="equipment-team">Equipment Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Overall Rating</Label>
                  <div className="pt-2">
                    <StarRating rating={0} onRatingChange={() => {}} />
                  </div>
                </div>
              </div>

              <div>
                <Label>Detailed Feedback</Label>
                <Textarea
                  placeholder="Provide detailed feedback, suggestions, or concerns..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="anonymous" />
                <Label htmlFor="anonymous">Submit anonymously</Label>
              </div>

              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <ThumbsUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {feedbackItems.filter(f => f.type === 'Positive').length}
                </div>
                <p className="text-sm text-gray-600">Positive Feedback</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {feedbackItems.filter(f => f.type === 'Suggestion').length}
                </div>
                <p className="text-sm text-gray-600">Suggestions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  {feedbackItems.filter(f => f.type === 'Concern').length}
                </div>
                <p className="text-sm text-gray-600">Concerns</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-yellow-600">
                  {(feedbackItems.reduce((sum, f) => sum + f.rating, 0) / feedbackItems.length).toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {feedbackItems.map(feedback => (
              <Card key={feedback.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor(feedback.type)}>{feedback.type}</Badge>
                      <Badge variant="outline">{feedback.category}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        {feedback.from} → {feedback.to}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Clock className="h-3 w-3" />
                        {feedback.date} at {feedback.time}
                      </div>
                      <Badge className={getStatusColor(feedback.status)}>{feedback.status}</Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Related to: {feedback.surgery}</p>
                    <StarRating rating={feedback.rating} readOnly />
                  </div>

                  <p className="text-gray-800 mb-4">{feedback.feedback}</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Respond
                    </Button>
                    <Button size="sm" variant="outline">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
