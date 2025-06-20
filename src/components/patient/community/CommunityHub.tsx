
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Heart, Share2, Plus, Search, Filter } from 'lucide-react';

export const CommunityHub = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
        <p className="text-muted-foreground">Connect with others, share experiences, and get support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button size="lg" className="h-20 flex-col gap-2">
          <Plus className="w-6 h-6" />
          Create Post
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Users className="w-6 h-6" />
          Find Groups
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Search className="w-6 h-6" />
          Search
        </Button>
        <Button size="lg" variant="outline" className="h-20 flex-col gap-2">
          <Filter className="w-6 h-6" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Community Feed</CardTitle>
            <CardDescription>Latest posts from your network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Diabetes Support Group • 2 hours ago</p>
                </div>
              </div>
              <p className="text-sm">Just completed my first month of consistent blood sugar monitoring! The community support here has been incredible. Thank you everyone! 💪</p>
              <div className="flex items-center gap-4 pt-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  12 Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  5 Comments
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-green-500 text-white">SM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">Sarah Miller</h4>
                  <p className="text-sm text-muted-foreground">Heart Health Community • 4 hours ago</p>
                </div>
              </div>
              <p className="text-sm">Looking for workout buddies who understand heart conditions. Anyone interested in starting a virtual walking group?</p>
              <div className="flex items-center gap-4 pt-2">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  8 Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  12 Comments
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Groups</CardTitle>
            <CardDescription>Communities you're part of</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Heart Health</h4>
                <p className="text-sm text-muted-foreground">1,234 members</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Diabetes Support</h4>
                <p className="text-sm text-muted-foreground">892 members</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Mental Wellness</h4>
                <p className="text-sm text-muted-foreground">567 members</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Join More Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
