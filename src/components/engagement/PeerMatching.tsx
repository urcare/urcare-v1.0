
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Heart, TrendingUp, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface PeerProfile {
  id: string;
  name: string;
  avatar?: string;
  matchScore: number;
  commonConditions: string[];
  sharedInterests: string[];
  recentAchievements: string[];
  location: string;
  joinedDate: string;
  isConnected: boolean;
}

interface ContentRecommendation {
  id: string;
  title: string;
  recommendedBy: string;
  category: string;
  likes: number;
  description: string;
}

interface Props {
  onConnect: (peerId: string) => void;
  onContentLike: (contentId: string) => void;
}

const peerProfiles: PeerProfile[] = [
  {
    id: 'peer-1',
    name: 'Sarah Chen',
    avatar: '',
    matchScore: 92,
    commonConditions: ['Type 2 Diabetes', 'Hypertension'],
    sharedInterests: ['Walking', 'Healthy Cooking', 'Mindfulness'],
    recentAchievements: ['30-day walking streak', 'Improved HbA1c'],
    location: 'San Francisco, CA',
    joinedDate: '2023-08',
    isConnected: false
  },
  {
    id: 'peer-2',
    name: 'Michael Rodriguez',
    avatar: '',
    matchScore: 87,
    commonConditions: ['Type 2 Diabetes'],
    sharedInterests: ['Meal Planning', 'Blood Sugar Tracking'],
    recentAchievements: ['Lost 15 lbs', 'Medication adherence'],
    location: 'Austin, TX',
    joinedDate: '2023-09',
    isConnected: true
  },
  {
    id: 'peer-3',
    name: 'Jennifer Liu',
    avatar: '',
    matchScore: 84,
    commonConditions: ['Hypertension', 'High Cholesterol'],
    sharedInterests: ['Yoga', 'Heart-healthy recipes'],
    recentAchievements: ['Blood pressure improvement', 'Stress reduction'],
    location: 'Seattle, WA',
    joinedDate: '2023-07',
    isConnected: false
  }
];

const contentRecommendations: ContentRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Mediterranean Diet Success Story',
    recommendedBy: 'Sarah Chen',
    category: 'Nutrition',
    likes: 24,
    description: 'How switching to Mediterranean diet improved my blood sugar control'
  },
  {
    id: 'rec-2',
    title: '5-Minute Morning Routine',
    recommendedBy: 'Michael Rodriguez',
    category: 'Exercise',
    likes: 18,
    description: 'Simple exercises that fit into any schedule'
  },
  {
    id: 'rec-3',
    title: 'Medication Tracking Tips',
    recommendedBy: 'Jennifer Liu',
    category: 'Management',
    likes: 31,
    description: 'Tools and techniques for never missing a dose'
  }
];

export const PeerMatching = ({ onConnect, onContentLike }: Props) => {
  const [peers, setPeers] = useState(peerProfiles);
  const [recommendations, setRecommendations] = useState(contentRecommendations);

  const handleConnect = (peerId: string) => {
    setPeers(prev => 
      prev.map(peer => 
        peer.id === peerId 
          ? { ...peer, isConnected: true }
          : peer
      )
    );
    onConnect(peerId);
    toast.success('Connection request sent!');
  };

  const handleLike = (contentId: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === contentId 
          ? { ...rec, likes: rec.likes + 1 }
          : rec
      )
    );
    onContentLike(contentId);
    toast.success('Content liked!');
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Peer Matching & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Connect with others who share similar health journeys and get personalized content recommendations.
          </p>
        </CardContent>
      </Card>

      {/* Recommended Peers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended Connections</h3>
        
        <div className="grid gap-4">
          {peers.map((peer) => (
            <Card key={peer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={peer.avatar} />
                    <AvatarFallback>{peer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{peer.name}</h4>
                        <p className="text-sm text-gray-600">{peer.location}</p>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={`${getMatchColor(peer.matchScore)} border-0`}>
                          {peer.matchScore}% match
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Common Conditions:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {peer.commonConditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Shared Interests:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {peer.sharedInterests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Recent Achievements:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {peer.recentAchievements.map((achievement, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {peer.isConnected ? (
                        <Button size="sm" variant="outline" disabled>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Connected
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleConnect(peer.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Peer Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content Recommended by Peers</h3>
        
        <div className="grid gap-3">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        {rec.category}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Recommended by {rec.recommendedBy}
                      </span>
                    </div>
                    
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(rec.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {rec.likes}
                      </Button>
                      <Button size="sm" variant="outline">
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
