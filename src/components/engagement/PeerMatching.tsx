
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, MessageCircle, Heart, UserPlus, Search, Filter, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Peer {
  id: string;
  name: string;
  avatar: string;
  condition: string;
  joinedDate: string;
  compatibility: number;
  interests: string[];
  recentActivity: string;
  isOnline: boolean;
  mutualConnections: number;
  helpfulVotes: number;
}

interface PeerMatchingProps {
  onConnect: (peerId: string) => void;
  onContentLike: (contentId: string) => void;
}

export const PeerMatching = ({ onConnect, onContentLike }: PeerMatchingProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('compatibility');

  const [peers] = useState<Peer[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '/placeholder.svg',
      condition: 'Type 2 Diabetes',
      joinedDate: '2023-08-15',
      compatibility: 95,
      interests: ['Low-carb cooking', 'Walking', 'Blood sugar tracking'],
      recentActivity: 'Shared a glucose monitoring tip',
      isOnline: true,
      mutualConnections: 3,
      helpfulVotes: 127
    },
    {
      id: '2',
      name: 'Maria Santos',
      avatar: '/placeholder.svg',
      condition: 'Heart Health',
      joinedDate: '2023-07-22',
      compatibility: 87,
      interests: ['Cardio exercises', 'Mediterranean diet', 'Stress management'],
      recentActivity: 'Posted a heart-healthy recipe',
      isOnline: false,
      mutualConnections: 2,
      helpfulVotes: 89
    },
    {
      id: '3',
      name: 'David Kim',
      avatar: '/placeholder.svg',
      condition: 'Mental Health',
      joinedDate: '2023-09-10',
      compatibility: 82,
      interests: ['Meditation', 'Journaling', 'Yoga'],
      recentActivity: 'Completed 30-day mindfulness challenge',
      isOnline: true,
      mutualConnections: 1,
      helpfulVotes: 203
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: '/placeholder.svg',
      condition: 'Chronic Pain',
      joinedDate: '2023-06-18',
      compatibility: 78,
      interests: ['Gentle exercise', 'Pain management', 'Support groups'],
      recentActivity: 'Shared pain management techniques',
      isOnline: false,
      mutualConnections: 4,
      helpfulVotes: 156
    }
  ]);

  const handleConnect = (peerId: string) => {
    onConnect(peerId);
    toast.success('Connection request sent!');
  };

  const handleLikeContent = (peerId: string) => {
    onContentLike(peerId);
    toast.success('Content liked!');
  };

  const filteredPeers = peers.filter(peer => {
    const matchesSearch = peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         peer.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'online' && peer.isOnline) ||
                         (filterBy === 'condition' && peer.condition.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'compatibility': return b.compatibility - a.compatibility;
      case 'activity': return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      case 'helpful': return b.helpfulVotes - a.helpfulVotes;
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Peer Matching & Connection
          </CardTitle>
          <CardDescription>
            Connect with others who share similar health journeys and experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">247</div>
              <p className="text-sm text-gray-600">Active Peers</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-sm text-gray-600">Your Connections</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <p className="text-sm text-gray-600">Match Rate</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <p className="text-sm text-gray-600">Messages Sent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Peers</SelectItem>
                <SelectItem value="online">Online Now</SelectItem>
                <SelectItem value="condition">Same Condition</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compatibility">Compatibility</SelectItem>
                <SelectItem value="activity">Recent Activity</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Peer List */}
      <div className="space-y-4">
        {filteredPeers.map((peer) => (
          <Card key={peer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={peer.avatar} />
                      <AvatarFallback>{peer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {peer.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{peer.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {peer.compatibility}% match
                      </Badge>
                      {peer.isOnline && (
                        <Badge className="bg-green-500 text-white text-xs">Online</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{peer.condition}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {peer.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {peer.interests.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{peer.interests.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {peer.mutualConnections} mutual connections
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {peer.helpfulVotes} helpful votes
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Joined {new Date(peer.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
                      <strong>Recent:</strong> {peer.recentActivity}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleConnect(peer.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLikeContent(peer.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLikeContent(peer.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPeers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No peers found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or check back later for new members.
            </p>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
