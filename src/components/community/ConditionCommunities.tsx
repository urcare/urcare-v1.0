
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageCircle, Search, Plus, Eye, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Community {
  id: string;
  name: string;
  condition: string;
  description: string;
  memberCount: number;
  postsToday: number;
  isPrivate: boolean;
  isMember: boolean;
  moderators: string[];
  avatar: string;
  tags: string[];
}

export const ConditionCommunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [communities] = useState<Community[]>([
    {
      id: '1',
      name: 'Diabetes Support Network',
      condition: 'Type 2 Diabetes',
      description: 'A supportive community for managing diabetes through lifestyle changes and medication.',
      memberCount: 1247,
      postsToday: 23,
      isPrivate: false,
      isMember: true,
      moderators: ['Dr. Sarah Johnson', 'Mike Chen'],
      avatar: '/placeholder.svg',
      tags: ['diet', 'exercise', 'medication', 'monitoring']
    },
    {
      id: '2',
      name: 'Heart Health Heroes',
      condition: 'Cardiovascular Disease',
      description: 'Share experiences and tips for maintaining heart health and recovery.',
      memberCount: 892,
      postsToday: 15,
      isPrivate: false,
      isMember: false,
      moderators: ['Dr. Emily Rodriguez'],
      avatar: '/placeholder.svg',
      tags: ['recovery', 'exercise', 'diet', 'support']
    },
    {
      id: '3',
      name: 'Cancer Warriors Circle',
      condition: 'Cancer',
      description: 'Private support group for cancer patients and survivors.',
      memberCount: 456,
      postsToday: 8,
      isPrivate: true,
      isMember: true,
      moderators: ['Dr. Alex Thompson', 'Lisa Park'],
      avatar: '/placeholder.svg',
      tags: ['treatment', 'recovery', 'emotional-support', 'family']
    }
  ]);

  const categories = ['all', 'diabetes', 'heart', 'cancer', 'mental-health', 'chronic-pain'];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           community.condition.toLowerCase().includes(selectedCategory.replace('-', ' '));
    return matchesSearch && matchesCategory;
  });

  const joinCommunity = (communityId: string) => {
    toast.success('Successfully joined the community!');
  };

  const leaveCommunity = (communityId: string) => {
    toast.success('Left the community');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Community</CardTitle>
          <CardDescription>
            Connect with others who share similar health conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search communities or conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <Card key={community.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={community.avatar} />
                    <AvatarFallback>{community.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {community.name}
                      {community.isPrivate && <Lock className="h-4 w-4 text-gray-500" />}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{community.condition}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{community.description}</p>

              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {community.memberCount.toLocaleString()} members
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {community.postsToday} posts today
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {community.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {community.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{community.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {community.isMember ? (
                  <>
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Posts
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => leaveCommunity(community.id)}
                    >
                      Leave
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => joinCommunity(community.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {community.isPrivate ? 'Request to Join' : 'Join Community'}
                  </Button>
                )}
              </div>

              <div className="text-xs text-gray-500">
                <p>Moderated by: {community.moderators.join(', ')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No communities found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or create a new community for your condition.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Community
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
