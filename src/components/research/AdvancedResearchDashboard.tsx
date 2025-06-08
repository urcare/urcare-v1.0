
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Award,
  Target,
  Network,
  FileText
} from 'lucide-react';
import { PublicationAnalytics } from './PublicationAnalytics';
import { GrantManagement } from './GrantManagement';
import { ResearchCollaboration } from './ResearchCollaboration';
import { ClinicalTrialManagement } from './ClinicalTrialManagement';
import { ResearchPortfolioManagement } from './ResearchPortfolioManagement';

export const AdvancedResearchDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const researchMetrics = {
    totalPublications: 847,
    totalCitations: 12456,
    hIndex: 68,
    activeGrants: 23,
    totalFunding: 8450000,
    activeTrial: 15,
    collaborators: 234,
    impactFactor: 4.8
  };

  const recentAchievements = [
    {
      type: 'publication',
      title: 'Nature Medicine publication accepted',
      date: '2024-01-20',
      impact: 'High Impact Factor: 58.7'
    },
    {
      type: 'grant',
      title: 'NIH R01 Grant Awarded',
      date: '2024-01-15',
      impact: '$2.5M over 5 years'
    },
    {
      type: 'collaboration',
      title: 'New International Partnership',
      date: '2024-01-10',
      impact: 'Joint research with Oxford University'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Research Tools</h1>
          <p className="text-gray-600 mt-2">Comprehensive research analytics and management platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="trials">Clinical Trials</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Research Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{researchMetrics.totalPublications}</p>
                    <p className="text-sm text-blue-700">Publications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{researchMetrics.totalCitations.toLocaleString()}</p>
                    <p className="text-sm text-green-700">Citations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">${(researchMetrics.totalFunding / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-purple-700">Total Funding</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{researchMetrics.collaborators}</p>
                    <p className="text-sm text-orange-700">Collaborators</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Latest research milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full ${
                      achievement.type === 'publication' ? 'bg-blue-500' :
                      achievement.type === 'grant' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.impact}</p>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                    <Badge variant="outline">
                      {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{researchMetrics.hIndex}</p>
                <p className="text-sm text-gray-600">H-Index</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{researchMetrics.impactFactor}</p>
                <p className="text-sm text-gray-600">Avg Impact Factor</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{researchMetrics.activeGrants}</p>
                <p className="text-sm text-gray-600">Active Grants</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Network className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{researchMetrics.activeTrial}</p>
                <p className="text-sm text-gray-600">Active Trials</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="publications">
          <PublicationAnalytics />
        </TabsContent>

        <TabsContent value="grants">
          <GrantManagement />
        </TabsContent>

        <TabsContent value="collaboration">
          <ResearchCollaboration />
        </TabsContent>

        <TabsContent value="trials">
          <ClinicalTrialManagement />
        </TabsContent>

        <TabsContent value="portfolio">
          <ResearchPortfolioManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
