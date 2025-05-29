
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bot, MessageSquare, Lightbulb, Bug, Star, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'submitted' | 'reviewing' | 'implemented' | 'declined';
  votes: number;
  timestamp: string;
  author: string;
}

export const FeedbackBot = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: <Bug className="h-4 w-4" />, color: 'text-red-600' },
    { value: 'feature', label: 'Feature Request', icon: <Lightbulb className="h-4 w-4" />, color: 'text-blue-600' },
    { value: 'improvement', label: 'Improvement', icon: <Star className="h-4 w-4" />, color: 'text-green-600' },
    { value: 'general', label: 'General Feedback', icon: <MessageSquare className="h-4 w-4" />, color: 'text-purple-600' }
  ];

  const categories = [
    'User Interface',
    'Community Features',
    'Doctor AMA',
    'Mood Matching',
    'Notifications',
    'Mobile App',
    'Performance',
    'Accessibility',
    'Other'
  ];

  const recentFeedback: FeedbackItem[] = [
    {
      id: '1',
      type: 'feature',
      title: 'Add voice messaging to buddy chat',
      description: 'Would love to send voice messages when typing is difficult',
      category: 'Community Features',
      priority: 'medium',
      status: 'reviewing',
      votes: 23,
      timestamp: '2 days ago',
      author: 'HealthJourney22'
    },
    {
      id: '2',
      type: 'bug',
      title: 'AMA notifications not working',
      description: 'Not receiving notifications for scheduled AMA sessions',
      category: 'Notifications',
      priority: 'high',
      status: 'implemented',
      votes: 18,
      timestamp: '1 week ago',
      author: 'CommunityMember'
    },
    {
      id: '3',
      type: 'improvement',
      title: 'Better mood tracking categories',
      description: 'More specific mood options for better buddy matching',
      category: 'Mood Matching',
      priority: 'medium',
      status: 'submitted',
      votes: 31,
      timestamp: '3 days ago',
      author: 'WellnessSeeker'
    }
  ];

  const submitFeedback = async () => {
    if (!feedbackType || !title.trim() || !description.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('🤖 Feedback submitted! Our team will review it shortly.');
      
      // Clear form
      setFeedbackType('');
      setTitle('');
      setDescription('');
      setCategory('');
    }, 1500);
  };

  const voteForFeedback = (feedbackId: string) => {
    toast.success('Vote counted! Thanks for supporting this feedback.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Community Feedback Bot
          </CardTitle>
          <CardDescription>
            Help us improve the platform by sharing your ideas, reporting bugs, and suggesting features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">147</div>
              <p className="text-sm text-gray-600">Feedback Items</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89</div>
              <p className="text-sm text-gray-600">Implemented</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24h</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Share your thoughts to help us improve the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Feedback Type *</label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div className={type.color}>
                          {type.icon}
                        </div>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                placeholder="Brief description of your feedback"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <Textarea
                placeholder="Provide detailed information about your feedback..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button 
              onClick={submitFeedback} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Community Feedback</CardTitle>
            <CardDescription>
              See what others are suggesting and vote for your favorites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className={feedbackTypes.find(t => t.value === item.type)?.color || 'text-gray-600'}>
                        {feedbackTypes.find(t => t.value === item.type)?.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status === 'implemented' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {item.status}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>by {item.author} • {item.timestamp}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => voteForFeedback(item.id)}
                      className="h-7 text-xs"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {item.votes}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
