
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BuddyProfile, MoodType } from '@/types/emotionalHealth';
import { Users, MessageCircle, Clock, Heart, Video } from 'lucide-react';

interface BuddyMatchingProps {
  currentMood: MoodType;
  availableBuddies: BuddyProfile[];
}

export function BuddyMatching({ currentMood, availableBuddies }: BuddyMatchingProps) {
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyProfile | null>(null);

  const getMoodCompatibleBuddies = () => {
    // Sort buddies by compatibility with current mood
    return availableBuddies
      .filter(buddy => buddy.moodCompatibility > 60)
      .sort((a, b) => b.moodCompatibility - a.moodCompatibility);
  };

  const getSupportStyleIcon = (style: BuddyProfile['supportStyle']) => {
    switch (style) {
      case 'encouraging': return '💪';
      case 'listening': return '👂';
      case 'problem_solving': return '🧠';
      case 'distraction': return '🎭';
      default: return '💫';
    }
  };

  const getSupportStyleDescription = (style: BuddyProfile['supportStyle']) => {
    switch (style) {
      case 'encouraging': return 'Provides motivation and positive reinforcement';
      case 'listening': return 'Offers empathetic listening without judgment';
      case 'problem_solving': return 'Helps think through challenges and solutions';
      case 'distraction': return 'Shares fun activities and light conversation';
      default: return 'Supportive companion';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const compatibleBuddies = getMoodCompatibleBuddies();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mood-Based Buddy Matching
          </CardTitle>
          <CardDescription>
            Connect with others who can provide the right support for your current mood: {currentMood.replace('_', ' ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🤝 How Matching Works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI analyzes your current mood</li>
                <li>• Matches you with compatible support styles</li>
                <li>• Considers timezone and availability</li>
                <li>• Prioritizes those with similar experiences</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">💬 Support Types</h4>
              <div className="text-sm text-green-800 space-y-1">
                <div>💪 <strong>Encouraging:</strong> Motivation & positivity</div>
                <div>👂 <strong>Listening:</strong> Empathetic support</div>
                <div>🧠 <strong>Problem-solving:</strong> Practical advice</div>
                <div>🎭 <strong>Distraction:</strong> Fun & light topics</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compatible Buddies</CardTitle>
          <CardDescription>
            People who can provide the right support for your current emotional state
          </CardDescription>
        </CardHeader>
        <CardContent>
          {compatibleBuddies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No compatible buddies available right now</p>
              <p className="text-sm">Try again later or adjust your preferences</p>
            </div>
          ) : (
            <div className="space-y-4">
              {compatibleBuddies.map((buddy) => (
                <div
                  key={buddy.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                    selectedBuddy?.id === buddy.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedBuddy(buddy)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-3xl">{buddy.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{buddy.name}</h4>
                          <Badge 
                            variant={buddy.isOnline ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {buddy.isOnline ? '🟢 Online' : '🔴 Offline'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            {buddy.moodCompatibility}% match
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getSupportStyleIcon(buddy.supportStyle)} {buddy.supportStyle.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {getSupportStyleDescription(buddy.supportStyle)}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {buddy.timezone} • Last active {getTimeAgo(buddy.lastActive)}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {buddy.interests.slice(0, 3).map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {buddy.interests.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{buddy.interests.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      {buddy.isOnline && (
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-1" />
                          Video
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBuddy && (
        <Card>
          <CardHeader>
            <CardTitle>Connect with {selectedBuddy.name}</CardTitle>
            <CardDescription>
              Start a conversation or schedule a support session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Quick Chat Starters:</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    "Hey, having a tough day. Could use someone to talk to."
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    "Looking for some encouragement and motivation."
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    "Want to chat about {selectedBuddy.interests[0]}?"
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Support Options:</h4>
                <div className="space-y-2">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Instant Chat
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Support Session
                  </Button>
                  {selectedBuddy.isOnline && (
                    <Button variant="outline" className="w-full">
                      <Video className="h-4 w-4 mr-2" />
                      Video Call Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Become a Support Buddy</CardTitle>
          <CardDescription>
            Help others while strengthening your own emotional resilience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Supporting others has been shown to improve your own mental health and sense of purpose.
            </p>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Join as Support Buddy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
