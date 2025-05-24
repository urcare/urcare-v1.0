
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Search, Download, Share2, Folder, Calendar } from 'lucide-react';

interface BookmarkedContent {
  id: string;
  title: string;
  type: 'article' | 'wellness' | 'myth' | 'scanr';
  category: string;
  dateBookmarked: Date;
  summary: string;
  tags: string[];
}

interface Props {
  bookmarkedItems: string[];
}

// Mock data for demonstration
const mockBookmarkedContent: BookmarkedContent[] = [
  {
    id: '1',
    title: 'Managing Diabetes: Latest Research on Continuous Glucose Monitoring',
    type: 'article',
    category: 'Diabetes Management',
    dateBookmarked: new Date('2024-01-20'),
    summary: 'New studies show CGM devices can improve HbA1c levels by up to 0.8% when used consistently.',
    tags: ['diabetes', 'technology', 'monitoring']
  },
  {
    id: 'wellness-2',
    title: 'Diabetes-Friendly Meal Prep',
    type: 'wellness',
    category: 'Nutrition',
    dateBookmarked: new Date('2024-01-19'),
    summary: 'Weekly meal planning to maintain stable blood sugar levels.',
    tags: ['nutrition', 'meal-prep', 'diabetes']
  },
  {
    id: 'myth-1',
    title: 'Insulin causes weight gain, so I should avoid it',
    type: 'myth',
    category: 'Diabetes',
    dateBookmarked: new Date('2024-01-18'),
    summary: 'Myth debunked: Insulin is essential for diabetes management and weight can be controlled.',
    tags: ['diabetes', 'insulin', 'weight-management']
  },
  {
    id: 'scanr-1',
    title: 'Your Blood Test Results Explained',
    type: 'scanr',
    category: 'Lab Results',
    dateBookmarked: new Date('2024-01-17'),
    summary: 'AI-generated summary of your recent lab work with key insights.',
    tags: ['lab-results', 'ai-generated', 'blood-test']
  }
];

export const BookmarkLibrary = ({ bookmarkedItems }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter bookmarked content based on bookmarkedItems prop
  const filteredContent = mockBookmarkedContent.filter(content => {
    const isBookmarked = bookmarkedItems.includes(content.id);
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || content.type === selectedType;
    
    return isBookmarked && matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'wellness': return '🌟';
      case 'myth': return '🔍';
      case 'scanr': return '🤖';
      default: return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'myth': return 'bg-purple-100 text-purple-800';
      case 'scanr': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportBookmarks = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      bookmarks: filteredContent
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health-bookmarks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5" />
                Bookmark Library
              </CardTitle>
              <CardDescription>
                Your saved health content and resources
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportBookmarks}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All ({bookmarkedItems.length})</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="myth">Myths</TabsTrigger>
              <TabsTrigger value="scanr">ScanR</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedType} className="mt-4">
              {filteredContent.length === 0 ? (
                <div className="text-center py-8">
                  <BookMarked className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No bookmarked content found</p>
                  <p className="text-sm text-gray-400">Start bookmarking content to build your library</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContent.map((content) => (
                    <Card key={content.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(content.type)}</span>
                              <Badge className={getTypeColor(content.type)}>
                                {content.type}
                              </Badge>
                              <Badge variant="outline">{content.category}</Badge>
                            </div>
                            
                            <h3 className="font-semibold">{content.title}</h3>
                            <p className="text-sm text-gray-600">{content.summary}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Saved {content.dateBookmarked.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Folder className="h-3 w-3" />
                                <span>{content.category}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {content.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <Button size="sm" variant="ghost">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm">
                              Open
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
