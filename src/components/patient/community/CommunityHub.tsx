
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Heart, Star, Trophy, BookOpen } from 'lucide-react';

export const CommunityHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
        <p className="text-muted-foreground">Connect with others on similar health journeys and find support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Users className="w-8 h-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Support Groups</CardTitle>
            <CardDescription>Join condition-specific communities</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <MessageCircle className="w-8 h-8 mx-auto text-secondary mb-2" />
            <CardTitle className="text-lg">Discussion Forums</CardTitle>
            <CardDescription>Share experiences and advice</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <BookOpen className="w-8 h-8 mx-auto text-accent mb-2" />
            <CardTitle className="text-lg">Health Education</CardTitle>
            <CardDescription>Learn from expert content</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Communities</CardTitle>
            <CardDescription>Your health support groups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg">
              <Heart className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Diabetes Support Group</p>
                <p className="text-sm text-muted-foreground">1,234 members • 45 new posts</p>
              </div>
              <Button size="sm" variant="outline">Join Discussion</Button>
            </div>
            <div className="flex items-center gap-4 p-3 bg-background-secondary rounded-lg">
              <Users className="w-5 h-5 text-secondary" />
              <div className="flex-1">
                <p className="font-medium">Heart Health Community</p>
                <p className="text-sm text-muted-foreground">892 members • 12 new posts</p>
              </div>
              <Button size="sm" variant="outline">View Posts</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Achievements</CardTitle>
            <CardDescription>Your engagement milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <Trophy className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-success">Helpful Member</p>
                <p className="text-xs text-muted-foreground">Received 10+ helpful votes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
              <Star className="w-5 h-5 text-warning" />
              <div>
                <p className="font-medium text-warning">Active Participant</p>
                <p className="text-xs text-muted-foreground">Posted 20+ times this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
