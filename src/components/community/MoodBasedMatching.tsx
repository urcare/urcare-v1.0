
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Heart, MessageCircle, Video, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Buddy {
  id: string;
  name: string;
  avatar: string;
  currentMood: string;
  compatibility: number;
  interests: string[];
  isOnline: boolean;
  lastActive: string;
  supportStyle: string;
  timezone: string;
}

const moods = [
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-100 text-blue-800' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😤', color: 'bg-red-100 text-red-800' },
  { value: 'hopeful', label: 'Hopeful', emoji: '🌟', color: 'bg-green-100 text-green-800' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'bg-purple-100 text-purple-800' },
  { value: 'motivated', label: 'Motivated', emoji: '💪', color: 'bg-orange-100 text-orange-800' }
];

export const MoodBasedMatching = () => {
  const [currentMood, setCurrentMood] = useState('');
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const mockBuddies: Buddy[] = [
    {
      id: '1',
      name: 'Sarah M.',
      avatar: '/placeholder.svg',
      currentMood: 'hopeful',
      compatibility: 92,
      interests: ['meditation', 'journaling', 'yoga'],
      isOnline: true,
      lastActive: '2 min ago',
      supportStyle: 'Encouraging listener',
      timezone: 'EST'
    },
    {
      id: '2', 
      name: 'Mike K.',
      avatar: '/placeholder.svg',
      currentMood: 'motivated',
      compatibility: 87,
      interests: ['fitness', 'nutrition', 'mindfulness'],
      isOnline: false,
      lastActive: '1 hour ago',
      supportStyle: 'Problem solver',
      timezone: 'PST'
    },
    {
      id: '3',
      name: 'Emma L.',
      avatar: '/placeholder.svg', 
      currentMood: 'grateful',
      compatibility: 84,
      interests: ['art therapy', 'music', 'nature'],
      isOnline: true,
      lastActive: 'Just now',
      supportStyle: 'Creative companion',
      timezone: 'EST'
    }
  ];

  const findMatches = () => {
    if (!currentMood) {
      toast.error('Please select your current mood first');
      return;
    }

    setIsMatching(true);
    
    // Simulate AI matching algorithm
    setTimeout(() => {
      const matches = mockBuddies.filter(buddy => {
        // Simple mood compatibility logic
        const moodCompatibility = buddy.currentMood === currentMood || 
          ['hopeful', 'grateful', 'motivated'].includes(buddy.currentMood);
        return moodCompatibility;
      }).sort((a, b) => b.compatibility - a.compatibility);
      
      setBuddies(matches);
      setIsMatching(false);
      toast.success(`Found ${matches.length} compatible buddies!`);
    }, 2000);
  };

  const connectWithBuddy = (buddyId: string) => {
    toast.success('Connection request sent!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            AI Mood-Based Buddy Matching
          </CardTitle>
          <CardDescription>
            Find support buddies based on your current emotional state and compatibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">How are you feeling today?</label>
              <Select value={currentMood} onValueChange={setCurrentMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <div className="flex items-center gap-2">
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={findMatches} 
                disabled={!currentMood || isMatching}
                className="w-full"
              >
                {isMatching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Find Buddy Matches
                  </>
                )}
              </Button>
            </div>
          </div>

          {currentMood && (
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {moods.find(m => m.value === currentMood)?.emoji}
                </span>
                <span className="font-medium">
                  Current mood: {moods.find(m => m.value === currentMood)?.label}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {buddies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Matches</CardTitle>
            <CardDescription>
              Buddies with compatible moods and support styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buddies.map((buddy) => (
                <div key={buddy.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={buddy.avatar} />
                        <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{buddy.name}</h4>
                          <Badge variant={buddy.isOnline ? "default" : "secondary"} className="text-xs">
                            {buddy.isOnline ? '🟢 Online' : '🔴 Offline'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {buddy.compatibility}% match
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">
                            Mood: {moods.find(m => m.value === buddy.currentMood)?.emoji} 
                            {moods.find(m => m.value === buddy.currentMood)?.label}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{buddy.supportStyle}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {buddy.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {buddy.timezone} • Last active {buddy.lastActive}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => connectWithBuddy(buddy.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                      {buddy.isOnline && (
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-1" />
                          Video Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
